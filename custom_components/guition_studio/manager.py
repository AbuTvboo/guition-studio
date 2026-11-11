"""Runtime manager: device discovery, layout transfer, state push and touch actions.

Communication path (no extra ports, no tokens on the device):

* HA → display: ESPHome native API user actions (``esphome.<node>_gs_*``) over
  the encrypted ESPHome connection that Home Assistant already maintains.
* display → HA: ESPHome ``homeassistant.event`` with type ``esphome.guition_studio``.
  Events are accepted by HA's ESPHome integration without enabling
  "allow device to perform actions". The display only reports *which tile* was
  touched; the action itself is looked up in the layout stored in Home
  Assistant, so a device can never trigger arbitrary service calls.
"""

from __future__ import annotations

import asyncio
import base64
from collections import deque
import json
import copy
from datetime import datetime, timedelta, timezone
from functools import partial
import logging
import secrets
from typing import Any

import aiohttp
from homeassistant.const import EVENT_HOMEASSISTANT_STOP
from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.network import NoURLAvailableError, get_url
from homeassistant.helpers.event import (
    async_call_later,
    async_track_state_change_event,
    async_track_time_change,
    async_track_time_interval,
)
from homeassistant.util import dt as dt_util

from .automation import (
    downsample,
    night_active,
    numeric_history,
    rule_entities,
    scale_series,
    state_rules_fired,
    time_rules_due,
)

from .const import (
    ACTION_FOOTBALL,
    ACTION_LOGO,
    ACTION_NOTES,
    ACTION_HELLO,
    ACTION_LAYOUT_BEGIN,
    ACTION_LAYOUT_CHUNK,
    ACTION_LAYOUT_COMMIT,
    ACTION_MODE,
    ACTION_NOTIFY,
    ACTION_PAGE,
    ACTION_ROLLBACK,
    ACTION_STATES,
    CHUNK_SIZE,
    EVENT_DEVICE,
    EVENT_UPDATED,
    PROTOCOL_VERSION,
    SIGNAL_DISPLAYS_CHANGED,
    TRANSFER_RETRIES,
    TRANSFER_TIMEOUT,
)
from .football import (
    LOGO_URL,
    SCOREBOARD_URL,
    build_payload as football_payload,
    has_live,
    logo_ids,
    logo_rgb565a8,
    parse_scoreboard,
    scoreboard_params,
)
from .layout import (
    LayoutValidationError,
    compile_device_layout,
    find_tile,
    football_settings,
    notes_settings,
    layout_entities,
    resolve_action,
    resolve_control,
    swipe_item_tile,
    validate_layout,
)
from .notes import build_payload as notes_payload
from .protocol import (
    build_state_messages,
    chunk_payload,
    describe_device_error,
    entity_payload,
    parse_event_payload,
    set_local_timezone,
    tiles_depending_on,
    to_int32,
    visibility_map,
)
from .store import StudioStore
from .themes import THEMES

_LOGGER = logging.getLogger(__name__)

ESPHOME = "esphome"
NON_RETRYABLE = ("schema:", "json:", "version", "size")


class TransferError(HomeAssistantError):
    """Layout transfer failed."""


def normalize_node(name: str | None) -> str:
    return (name or "").strip().lower().replace("-", "_")


class StudioManager:
    """Owns runtime state for all displays."""

    def __init__(self, hass: HomeAssistant, store: StudioStore) -> None:
        self.hass = hass
        self.store = store
        self.runtime: dict[str, dict[str, Any]] = {}
        self.unassigned: dict[str, dict[str, Any]] = {}
        self.log: deque[dict[str, Any]] = deque(maxlen=300)
        self._pending: dict[tuple[str, int], asyncio.Future] = {}
        self._locks: dict[str, asyncio.Lock] = {}
        self._trackers: dict[str, CALLBACK_TYPE] = {}
        self._push_pending: dict[str, set[str]] = {}
        self._push_timer: dict[str, CALLBACK_TYPE] = {}
        self._forecasts: dict[str, tuple[float, list[dict[str, Any]] | None]] = {}
        # football: (league, day) -> (fetched at, matches or None); last document sent per display
        self._fixtures: dict[tuple[str, str], tuple[float, list[dict[str, Any]] | None]] = {}
        self._football_sent: dict[str, tuple[float, str]] = {}
        # reminders: last document sent per display
        self._notes_sent: dict[str, str] = {}
        # team logos: id -> base64 RGB565A8 (None = not available); ids already on each display
        self._logos: dict[str, str | None] = {}
        self._logos_sent: dict[str, set[str]] = {}
        self._unsubs: list[CALLBACK_TYPE] = []
        self.debug = False

    # ------------------------------------------------------------------ lifecycle

    async def async_start(self) -> None:
        set_local_timezone(dt_util.get_default_time_zone())
        self._unsubs.append(self.hass.bus.async_listen(EVENT_DEVICE, self._on_device_event))
        self._unsubs.append(self.hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STOP, self._on_stop))
        self._unsubs.append(async_track_time_change(self.hass, self._on_minute, second=0))
        self._unsubs.append(async_track_time_interval(self.hass, self._on_graph_interval, timedelta(minutes=10)))
        for display_id in self.store.displays:
            self._track(display_id)
            # Ask online displays to report in, so states and layout get synchronised.
            self.hass.async_create_background_task(self._request_hello(display_id), "guition_studio_hello")

    async def async_stop(self) -> None:
        for unsub in self._unsubs:
            unsub()
        self._unsubs.clear()
        for unsub in list(self._trackers.values()) + list(self._push_timer.values()):
            unsub()
        self._trackers.clear()
        self._push_timer.clear()
        for fut in self._pending.values():
            if not fut.done():
                fut.cancel()

    @callback
    def _on_stop(self, _event: Event) -> None:
        self.hass.async_create_task(self.async_stop())

    # ------------------------------------------------------------------ helpers

    def rt(self, display_id: str) -> dict[str, Any]:
        return self.runtime.setdefault(
            display_id,
            {
                "online": False,
                "last_seen": None,
                "firmware": None,
                "protocol": None,
                "device_revision": None,
                "device_crc": None,
                "page": None,
                "heap": None,
                "psram": None,
                "uptime": None,
                "transfer": {"state": "idle", "progress": 0, "error": None},
                "ota": {"state": "idle", "progress": 0},
            },
        )

    def add_log(self, level: str, message: str, display_id: str | None = None, **data: Any) -> None:
        entry = {
            "ts": datetime.now(timezone.utc).isoformat(),
            "level": level,
            "display_id": display_id,
            "message": message,
            "data": data or None,
        }
        self.log.append(entry)
        getattr(_LOGGER, "warning" if level == "error" else "debug")("%s: %s %s", display_id, message, data or "")

    def _notify_frontend(self, display_id: str | None, kind: str, **data: Any) -> None:
        self.hass.bus.async_fire(EVENT_UPDATED, {"display_id": display_id, "kind": kind, **data})

    def service_name(self, display: dict[str, Any], action: str) -> str:
        return f"{normalize_node(display.get('node'))}_{action}"

    def has_actions(self, display: dict[str, Any]) -> bool:
        return bool(display.get("node")) and self.hass.services.has_service(
            ESPHOME, self.service_name(display, ACTION_LAYOUT_BEGIN)
        )

    async def _call(self, display: dict[str, Any], action: str, data: dict[str, Any]) -> None:
        service = self.service_name(display, action)
        if not display.get("node") or not self.hass.services.has_service(ESPHOME, service):
            raise TransferError(
                "Das Display ist nicht erreichbar oder nicht mit einem ESPHome-Gerät mit "
                "Guition-Studio-Firmware verknüpft."
            )
        await self.hass.services.async_call(ESPHOME, service, data, blocking=True)

    def display_online(self, display: dict[str, Any]) -> bool:
        """Online = the linked ESPHome device has available entities and our actions exist."""
        if not self.has_actions(display):
            return False
        device_id = display.get("device_id")
        if not device_id:
            return self.rt(display["id"])["online"]
        ent_reg = er.async_get(self.hass)
        for entry in er.async_entries_for_device(ent_reg, device_id):
            state = self.hass.states.get(entry.entity_id)
            if state is not None and state.state != "unavailable":
                return True
        return False

    def find_display_for_event(self, event: Event) -> dict[str, Any] | None:
        device_id = event.data.get("device_id")
        node = normalize_node(event.data.get("node"))
        for display in self.store.displays.values():
            if device_id and display.get("device_id"):
                if display["device_id"] == device_id:
                    return display
                continue
            if node and normalize_node(display.get("node")) == node:
                return display
        return None

    # ------------------------------------------------------------------ discovery

    def candidates(self) -> list[dict[str, Any]]:
        """ESPHome devices that expose the Guition Studio actions."""
        services = self.hass.services.async_services_for_domain(ESPHOME)
        suffix = f"_{ACTION_LAYOUT_BEGIN}"
        nodes = sorted(name[: -len(suffix)] for name in services if name.endswith(suffix))
        dev_reg = dr.async_get(self.hass)
        entries = {
            normalize_node(e.data.get("device_name")): e for e in self.hass.config_entries.async_entries(ESPHOME)
        }
        assigned = {normalize_node(d.get("node")): d["id"] for d in self.store.displays.values()}
        result = []
        for node in nodes:
            device_id = None
            name = node
            entry = entries.get(node)
            if entry is not None:
                devices = dr.async_entries_for_config_entry(dev_reg, entry.entry_id)
                if devices:
                    device_id = devices[0].id
                    name = devices[0].name_by_user or devices[0].name or node
            seen = self.unassigned.get(node, {})
            result.append(
                {
                    "node": node,
                    "device_id": device_id,
                    "name": name,
                    "assigned_display": assigned.get(node),
                    "firmware": seen.get("fw"),
                    "hardware": seen.get("hw"),
                }
            )
        return result

    # ------------------------------------------------------------------ state tracking

    def _track(self, display_id: str) -> None:
        if (unsub := self._trackers.pop(display_id, None)) is not None:
            unsub()
        self._track_rules(display_id)
        self._track_notes(display_id)
        display = self.store.get_display(display_id)
        if not display or not display.get("applied"):
            return
        entities = sorted(layout_entities(display["applied"]["layout"]))
        if not entities:
            return

        @callback
        def _changed(event: Event) -> None:
            self._schedule_push(display_id, {event.data["entity_id"]})

        self._trackers[display_id] = async_track_state_change_event(self.hass, entities, _changed)

    def _track_notes(self, display_id: str) -> None:
        """Send the reminders right away when the to-do list changes (item added, ticked off)."""
        key = f"{display_id}:notes"
        if (unsub := self._trackers.pop(key, None)) is not None:
            unsub()
        display = self.store.get_display(display_id)
        entity = notes_settings(display["applied"]["layout"]) if display and display.get("applied") else None
        if entity is None:
            return

        @callback
        def _changed(_event: Event) -> None:
            self.hass.async_create_task(self.async_push_notes(display_id))

        self._trackers[key] = async_track_state_change_event(self.hass, [entity], _changed)

    # ------------------------------------------------------------------ smart page switching & night mode

    def _settings(self, display: dict[str, Any]) -> dict[str, Any]:
        """Settings of the layout confirmed by the display (rules act on what the display shows)."""
        return ((display.get("applied") or {}).get("layout") or {}).get("settings") or {}

    def _rules(self, display: dict[str, Any]) -> list[dict[str, Any]]:
        return [r for r in self._settings(display).get("rules", []) if r.get("enabled", True)]

    def _track_rules(self, display_id: str) -> None:
        key = f"{display_id}:rules"
        if (unsub := self._trackers.pop(key, None)) is not None:
            unsub()
        display = self.store.get_display(display_id)
        if not display:
            return
        entities = sorted(rule_entities(self._rules(display)))
        if not entities:
            return

        @callback
        def _changed(event: Event) -> None:
            disp = self.store.get_display(display_id)
            if not disp:
                return
            old, new = event.data.get("old_state"), event.data.get("new_state")
            for rule in state_rules_fired(
                self._rules(disp), event.data["entity_id"], old.state if old else None, new.state if new else None
            ):
                self.hass.async_create_task(self._apply_rule(disp, rule))

        self._trackers[key] = async_track_state_change_event(self.hass, entities, _changed)

    async def _apply_rule(self, display: dict[str, Any], rule: dict[str, Any]) -> None:
        pages = ((display.get("applied") or {}).get("layout") or {}).get("pages", [])
        index = next((i for i, p in enumerate(pages) if p["id"] == rule.get("page")), None)
        if index is None or not self.has_actions(display):
            return
        try:
            await self._call(display, ACTION_PAGE, {"page": index})
            self.add_log("info", f"Regel „{rule.get('name') or rule['id']}“: Seite „{pages[index]['name']}“ angezeigt", display["id"])
        except HomeAssistantError as err:
            self.add_log("warning", f"Regel konnte nicht ausgeführt werden: {err}", display["id"])

    @callback
    def _on_minute(self, now: datetime) -> None:
        local = dt_util.as_local(now)
        for display in list(self.store.displays.values()):
            if not display.get("applied"):
                continue
            self._evaluate_night(display, local)
            for rule in time_rules_due(self._rules(display), local):
                self.hass.async_create_task(self._apply_rule(display, rule))
            if football_settings(display["applied"]["layout"]):
                self.hass.async_create_task(self.async_push_football(display["id"]))
            if notes_settings(display["applied"]["layout"]):
                # also catches edited texts and due dates ("Morgen" becomes "Heute" at midnight)
                self.hass.async_create_task(self.async_push_notes(display["id"]))

    @callback
    def _evaluate_night(self, display: dict[str, Any], local: datetime, force: bool = False) -> None:
        night = self._settings(display).get("night") or {}
        sun = self.hass.states.get("sun.sun")
        active = night_active(night, local.time(), sun.state == "below_horizon" if sun else None)
        rt = self.rt(display["id"])
        override = rt.get("night_override")
        if override is not None:
            if override["computed"] == active:
                return  # manual choice from the display stays until the schedule changes
            rt["night_override"] = None
        if not force and rt.get("night") == active:
            return
        rt["night"] = active
        self.hass.async_create_task(self._send_mode(display, active, night, show_page=not force))

    async def _send_mode(self, display: dict[str, Any], active: bool, night: dict[str, Any], show_page: bool) -> None:
        if not self.hass.services.has_service(ESPHOME, self.service_name(display, ACTION_MODE)):
            return
        try:
            await self._call(
                display,
                ACTION_MODE,
                {"night": int(active), "brightness": int(night.get("brightness", 15)), "dim": int(night.get("dim", 0)) if active else 0},
            )
            if show_page:
                self.add_log("info", "Nachtmodus aktiv" if active else "Nachtmodus beendet", display["id"])
            if active and show_page and night.get("page"):
                await self._apply_rule(display, {"id": "night", "name": "Nachtmodus", "page": night["page"]})
        except HomeAssistantError as err:
            self.add_log("warning", f"Nachtmodus konnte nicht gesetzt werden: {err}", display["id"])

    # ------------------------------------------------------------------ graph history

    @callback
    def _on_graph_interval(self, _now: datetime) -> None:
        for display_id, display in list(self.store.displays.items()):
            self.hass.async_create_task(self.async_refresh_graphs(display_id))
            if display.get("applied"):
                weather = {e for e in layout_entities(display["applied"]["layout"]) if e.startswith("weather.")}
                if weather:  # refresh forecasts even when the current conditions did not change
                    self.hass.async_create_task(self.async_push_states(display_id, weather))

    async def async_refresh_graphs(self, display_id: str) -> int:
        """Push recorder history for graph tiles (step-resampled to 48 points)."""
        display = self.store.get_display(display_id)
        if not display or not display.get("applied") or not self.has_actions(display) or "recorder" not in self.hass.config.components:
            return 0
        hours: dict[str, int] = {}
        for page in display["applied"]["layout"]["pages"]:
            for tile in page["tiles"]:
                if tile.get("type") == "graph" and tile.get("entity"):
                    hours[tile["entity"]] = max(hours.get(tile["entity"], 0), int(tile.get("hours", 24)))
        if not hours:
            return 0
        from homeassistant.components.recorder import get_instance, history  # noqa: PLC0415

        end = dt_util.utcnow()
        entities: dict[str, dict[str, Any]] = {}
        for entity_id, hrs in hours.items():
            start = end - timedelta(hours=hrs)
            states = await get_instance(self.hass).async_add_executor_job(
                partial(history.state_changes_during_period, self.hass, start, end, entity_id, no_attributes=True, include_start_time_state=True)
            )
            points = numeric_history(states.get(entity_id, []), lambda st: (st.last_changed.timestamp(), st.state))
            current = self.hass.states.get(entity_id)
            series = downsample(points, start.timestamp(), end.timestamp())
            scaled, label = scale_series(series, current.attributes.get("unit_of_measurement") if current else None)
            payload = entity_payload(entity_id.split(".", 1)[0], current.state if current else None, dict(current.attributes) if current else None)
            entities[entity_id] = {**payload, "g": scaled, "gr": label}
        try:
            for msg in build_state_messages(entities):
                await self._call(display, ACTION_STATES, {"data": msg})
        except HomeAssistantError as err:
            self.add_log("warning", f"Verlauf konnte nicht gesendet werden: {err}", display_id)
            return 0
        return len(entities)

    # ------------------------------------------------------------------ on-device settings

    LOCAL_SETTINGS = {"brightness": (5, 100), "standby": (0, 100), "timeout": (0, 86400)}

    @callback
    def _handle_setting(self, display: dict[str, Any], payload: dict[str, Any]) -> None:
        """A setting was changed in the display's own settings menu.

        Only whitelisted keys with range checks are accepted. Local values are
        stored in the confirmed and the draft layout so later transfers keep them.
        Theme / home page need a new compiled layout: the *confirmed* layout is
        re-sent with the change (unfinished drafts are never pushed).
        """
        display_id = display["id"]
        key, value = payload.get("k"), payload.get("v")
        applied = display.get("applied")
        if not applied:
            return
        settings_targets = [applied["layout"]["settings"], display["layout"].setdefault("settings", {})]
        if key in self.LOCAL_SETTINGS:
            lo, hi = self.LOCAL_SETTINGS[key]
            if isinstance(value, bool) or not isinstance(value, int) or not lo <= value <= hi:
                return
            field = {"brightness": "brightness", "standby": "standby_brightness", "timeout": "timeout"}[key]
            for s in settings_targets:
                s[field] = value
        elif key == "rotation" and value in (0, 90, 180, 270) and not isinstance(value, bool):
            for s in settings_targets:
                s["rotation"] = value
        elif key == "screensaver" and value in (0, 1):
            for s in settings_targets:
                s.setdefault("screensaver", {"enabled": False, "after": 120, "entities": []})["enabled"] = bool(value)
        elif key == "night" and value in (0, 1):
            settings = applied["layout"]["settings"]
            sun = self.hass.states.get("sun.sun")
            computed = night_active(settings.get("night") or {}, dt_util.now().time(), sun.state == "below_horizon" if sun else None)
            rt = self.rt(display_id)
            rt["night"] = bool(value)
            rt["night_override"] = {"value": bool(value), "computed": computed}
            self.add_log("info", f"Nachtmodus am Display {'eingeschaltet' if value else 'ausgeschaltet'}", display_id)
            return
        elif key == "theme" and isinstance(value, str) and value in THEMES:
            self._resend_with(display, {"theme": value}, f"Design „{THEMES[value]['name']}“")
            return
        elif key == "home" and isinstance(value, str) and any(p["id"] == value for p in applied["layout"]["pages"]):
            self._resend_with(display, {"home_page": value}, "Startseite")
            return
        else:
            self.add_log("warning", f"Ungültige Einstellung vom Display ignoriert: {payload}", display_id)
            return
        self.store.schedule_save()
        self.add_log("info", f"Am Display geändert: {key} = {value}", display_id)
        self._notify_frontend(display_id, "status")

    @callback
    def _resend_with(self, display: dict[str, Any], patch: dict[str, Any], label: str) -> None:
        layout = copy.deepcopy(display["applied"]["layout"])
        layout["settings"].update(patch)
        layout["revision"] = int(layout.get("revision", 0)) + 1
        display["layout"].setdefault("settings", {}).update(patch)
        display["layout"]["revision"] = max(int(display["layout"].get("revision", 0)), layout["revision"])
        self.store.schedule_save()
        self.add_log("info", f"{label} am Display gewählt – Layout wird neu übertragen", display["id"])
        self.hass.async_create_task(self._safe_resend(display["id"], layout))

    def _slide_url(self, display: dict[str, Any], layout: dict[str, Any]) -> str | None:
        """Streaming URL for the screensaver slideshow (secret per-display token, local HA URL)."""
        ss = (layout.get("settings") or {}).get("screensaver") or {}
        if not ss.get("enabled") or ss.get("mode") != "slideshow":
            return None
        if not display.get("slide_token"):
            display["slide_token"] = secrets.token_urlsafe(18)
            self.store.schedule_save()
        try:
            base = get_url(self.hass, allow_external=False, allow_cloud=False, prefer_external=False)
        except NoURLAvailableError:
            self.add_log("warning", "Diashow: keine interne Home-Assistant-URL konfiguriert (Einstellungen → System → Netzwerk).", display["id"])
            return None
        return f"{base}/api/guition_studio/slide/{display['id']}/{display['slide_token']}/next.jpg"

    @callback
    def notify_displays_changed(self) -> None:
        async_dispatcher_send(self.hass, SIGNAL_DISPLAYS_CHANGED)

    @callback
    def _schedule_push(self, display_id: str, entity_ids: set[str]) -> None:
        self._push_pending.setdefault(display_id, set()).update(entity_ids)
        if display_id in self._push_timer:
            return

        @callback
        def _fire(_now: Any) -> None:
            self._push_timer.pop(display_id, None)
            pending = self._push_pending.pop(display_id, set())
            self.hass.async_create_task(self.async_push_states(display_id, pending))

        # Debounce bursts of state changes (e.g. scenes) into one message.
        self._push_timer[display_id] = async_call_later(self.hass, 0.15, _fire)

    async def _forecast(self, entity_id: str) -> list[dict[str, Any]] | None:
        """Daily forecast via weather.get_forecasts (forecasts are no longer state attributes), cached 30 min."""
        cached = self._forecasts.get(entity_id)
        now = self.hass.loop.time()
        if cached and now - cached[0] < 1800:
            return cached[1]
        forecast: list[dict[str, Any]] | None = None
        try:
            response = await self.hass.services.async_call(
                "weather", "get_forecasts", {"entity_id": entity_id, "type": "daily"}, blocking=True, return_response=True
            )
            forecast = ((response or {}).get(entity_id) or {}).get("forecast")
        except (HomeAssistantError, ValueError, KeyError):
            forecast = None  # entity without daily forecast support
        self._forecasts[entity_id] = (now, forecast)
        return forecast

    # ------------------------------------------------------------------ football

    async def _fixtures_for(self, league: str, day: Any, max_age: float) -> list[dict[str, Any]] | None:
        """Matches of one league on one day (ESPN), cached for max_age seconds."""
        key = (league, day.isoformat())
        now = self.hass.loop.time()
        cached = self._fixtures.get(key)
        if cached and now - cached[0] < max_age:
            return cached[1]
        matches: list[dict[str, Any]] | None
        try:
            session = async_get_clientsession(self.hass)
            async with asyncio.timeout(15):
                resp = await session.get(SCOREBOARD_URL.format(league=league), params=scoreboard_params(day))
                resp.raise_for_status()
                data = await resp.json(content_type=None)
            matches = parse_scoreboard(data, dt_util.get_default_time_zone())
        except (TimeoutError, aiohttp.ClientError, ValueError) as err:
            if self.debug:
                self.add_log("debug", f"Spielplan {league} {day} nicht abrufbar: {err}")
            matches = cached[1] if cached else None  # keep the last good data
        self._fixtures[key] = (now, matches)
        if len(self._fixtures) > 200:
            for old in sorted(self._fixtures, key=lambda k: self._fixtures[k][0])[:100]:
                self._fixtures.pop(old, None)
        return matches

    async def async_push_football(self, display_id: str, force: bool = False) -> bool:
        """Send today's (or the next) matches to a display that shows football in its screensaver."""
        display = self.store.get_display(display_id)
        if not display or not display.get("applied") or not self.has_actions(display):
            return False
        conf = football_settings(display["applied"]["layout"])
        if conf is None:
            return False
        leagues, lang = conf
        now = dt_util.now()
        sent_at, last_doc = self._football_sent.get(display_id, (0.0, ""))
        loop_now = self.hass.loop.time()
        today = now.date()
        data = {code: await self._fixtures_for(code, today, 600) for code in leagues}
        live = has_live(data, now)
        if live:  # refresh running matches every minute
            data = {code: await self._fixtures_for(code, today, 55) for code in leagues}
        if not force and not live and loop_now - sent_at < 600:
            return False
        if not any(any(m["when"].date() == today for m in v) for v in data.values() if v):
            # nothing today: look ahead day by day (cached for an hour)
            for offset in range(1, 8):
                day = today + timedelta(days=offset)
                for code in leagues:
                    extra = await self._fixtures_for(code, day, 3600)
                    if extra and data.get(code) is not None:
                        data[code] = [*(data[code] or []), *extra]
                if any(any(m["when"].date() > today for m in v) for v in data.values() if v):
                    # include two more days so leagues playing on different days show up together
                    for extra_day in (day + timedelta(days=1), day + timedelta(days=2)):
                        for code in leagues:
                            extra = await self._fixtures_for(code, extra_day, 3600)
                            if extra and data.get(code) is not None:
                                data[code] = [*(data[code] or []), *extra]
                    break
        doc = json.dumps(football_payload(data, lang, now), ensure_ascii=False, separators=(",", ":"))
        if doc == last_doc and not force:
            self._football_sent[display_id] = (loop_now, doc)
            return False
        try:
            await self._call(display, ACTION_FOOTBALL, {"data": doc})
        except (HomeAssistantError, TransferError) as err:
            if self.debug:  # firmware < 0.5.12 has no football action
                self.add_log("debug", f"Spieldaten nicht gesendet: {err}", display_id)
            return False
        self._football_sent[display_id] = (loop_now, doc)
        self.hass.async_create_task(self._push_logos(display, json.loads(doc)))
        return True

    # ------------------------------------------------------------------ reminders (to-do list)

    async def _todo_items(self, entity_id: str) -> list[dict[str, Any]] | None:
        """Open items of a to-do entity (None = list not available)."""
        if self.hass.states.get(entity_id) is None:
            return None
        try:
            response = await self.hass.services.async_call(
                "todo",
                "get_items",
                {"entity_id": entity_id, "status": ["needs_action"]},
                blocking=True,
                return_response=True,
            )
        except (HomeAssistantError, ValueError, KeyError) as err:
            if self.debug:
                self.add_log("debug", f"To-do-Liste {entity_id} nicht lesbar: {err}")
            return None
        return list(((response or {}).get(entity_id) or {}).get("items") or [])

    async def async_push_notes(self, display_id: str, force: bool = False) -> bool:
        """Send the open to-do items to a display that shows reminders; only when something changed."""
        display = self.store.get_display(display_id)
        if not display or not display.get("applied") or not self.has_actions(display):
            return False
        entity = notes_settings(display["applied"]["layout"])
        if entity is None:
            return False
        items = await self._todo_items(entity)
        if items is None:
            doc_obj = notes_payload([], dt_util.now())
            doc_obj["t"] = [doc_obj["t"][0], doc_obj["t"][1], "To-do-Liste nicht gefunden"]
        else:
            doc_obj = notes_payload(items, dt_util.now())
        doc = json.dumps(doc_obj, ensure_ascii=False, separators=(",", ":"))
        if doc == self._notes_sent.get(display_id) and not force:
            return False
        try:
            await self._call(display, ACTION_NOTES, {"data": doc})
        except (HomeAssistantError, TransferError) as err:
            if self.debug:  # firmware < 0.5.27 has no reminders action
                self.add_log("debug", f"Erinnerungen nicht gesendet: {err}", display_id)
            return False
        self._notes_sent[display_id] = doc
        return True

    async def _logo(self, team_id: str) -> str | None:
        """Team logo as base64 RGB565A8 (downloaded once from ESPN, then cached)."""
        if team_id in self._logos:
            return self._logos[team_id]
        encoded: str | None = None
        try:
            session = async_get_clientsession(self.hass)
            async with asyncio.timeout(15):
                resp = await session.get(LOGO_URL.format(id=team_id))
                resp.raise_for_status()
                png = await resp.read()
            raw = await self.hass.async_add_executor_job(logo_rgb565a8, png)
            encoded = base64.b64encode(raw).decode()
        except (TimeoutError, aiohttp.ClientError, OSError, ValueError) as err:
            if self.debug:
                self.add_log("debug", f"Logo {team_id} nicht ladbar: {err}")
        self._logos[team_id] = encoded
        return encoded

    async def _push_logos(self, display: dict[str, Any], doc: dict[str, Any]) -> None:
        """Send the logos the display does not have yet (they live in its RAM until restart)."""
        sent = self._logos_sent.setdefault(display["id"], set())
        for team_id in logo_ids(doc):
            if team_id in sent:
                continue
            data = await self._logo(team_id)
            if data is None:
                continue
            try:
                await self._call(display, ACTION_LOGO, {"key": team_id, "data": data})
            except (HomeAssistantError, TransferError):
                return  # firmware without logo support or display offline
            sent.add(team_id)

    def _get_state(self, entity_id: str) -> str | None:
        state = self.hass.states.get(entity_id)
        return state.state if state else None

    async def async_push_states(self, display_id: str, entity_ids: set[str] | None = None) -> int:
        display = self.store.get_display(display_id)
        if not display or not display.get("applied") or not self.has_actions(display):
            return 0
        layout = display["applied"]["layout"]
        used = layout_entities(layout)
        targets = used if entity_ids is None else (set(entity_ids) & used)
        entities: dict[str, dict[str, Any]] = {}
        for eid in sorted(targets):
            state = self.hass.states.get(eid)
            domain = eid.split(".", 1)[0]
            forecast = await self._forecast(eid) if domain == "weather" and state else None
            entities[eid] = entity_payload(domain, state.state if state else None, dict(state.attributes) if state else None, forecast)
        visibility = None
        if entity_ids is None or tiles_depending_on(layout, targets):
            visibility = visibility_map(layout, self._get_state)
        messages = build_state_messages(entities, visibility)
        try:
            for msg in messages:
                await self._call(display, ACTION_STATES, {"data": msg})
        except HomeAssistantError as err:
            self.add_log("warning", f"Zustände konnten nicht gesendet werden: {err}", display_id)
            return 0
        if self.debug:
            self.add_log("debug", f"{len(entities)} Zustände gesendet", display_id)
        return len(entities)

    # ------------------------------------------------------------------ layout transfer

    async def async_apply_layout(self, display_id: str, layout: dict[str, Any]) -> dict[str, Any]:
        """Validate, persist as draft, transfer to device and wait for confirmation."""
        display = self.store.get_display(display_id)
        if display is None:
            raise TransferError("Display nicht gefunden.")
        validated = validate_layout(layout)
        applied = display.get("applied") or {}
        validated["revision"] = max(validated.get("revision", 0), applied.get("revision", 0)) + 1
        self.store.save_draft(display_id, validated)
        return await self.async_send_layout(display_id, validated)

    async def async_send_layout(self, display_id: str, layout: dict[str, Any]) -> dict[str, Any]:
        display = self.store.get_display(display_id)
        if display is None:
            raise TransferError("Display nicht gefunden.")
        payload, crc = compile_device_layout(layout, self._slide_url(display, layout))
        raw = payload.encode("utf-8")
        chunks = chunk_payload(payload, CHUNK_SIZE)
        lock = self._locks.setdefault(display_id, asyncio.Lock())
        transfer = self.rt(display_id)["transfer"]
        async with lock:
            last_error = "Unbekannter Fehler"
            for attempt in range(1, TRANSFER_RETRIES + 1):
                session = secrets.randbelow(2**31 - 2) + 1
                fut: asyncio.Future = self.hass.loop.create_future()
                self._pending[(display_id, session)] = fut
                transfer.update(state="sending", progress=0, error=None, attempt=attempt)
                self._notify_frontend(display_id, "transfer", **transfer)
                try:
                    await self._call(
                        display, ACTION_LAYOUT_BEGIN, {"session": session, "total": len(raw), "crc": to_int32(crc)}
                    )
                    for index, chunk in enumerate(chunks):
                        await self._call(display, ACTION_LAYOUT_CHUNK, {"session": session, "index": index, "data": chunk})
                        transfer["progress"] = round((index + 1) * 100 / len(chunks))
                        if index % 4 == 3:
                            self._notify_frontend(display_id, "transfer", **transfer)
                    transfer.update(state="confirming", progress=100)
                    self._notify_frontend(display_id, "transfer", **transfer)
                    await self._call(display, ACTION_LAYOUT_COMMIT, {"session": session})
                    ack = await asyncio.wait_for(fut, TRANSFER_TIMEOUT)
                except asyncio.TimeoutError:
                    last_error = "Keine Bestätigung vom Display erhalten (Zeitüberschreitung)."
                    ack = None
                except HomeAssistantError as err:
                    last_error = str(err)
                    ack = None
                finally:
                    self._pending.pop((display_id, session), None)

                if ack is not None:
                    if ack.get("ok") and (int(ack.get("crc", -1)) & 0xFFFFFFFF) == crc:
                        self.store.set_applied(display_id, layout, crc, len(raw))
                        transfer.update(state="done", progress=100, error=None)
                        self._notify_frontend(display_id, "transfer", **transfer)
                        self.add_log(
                            "info",
                            f"Layout Revision {layout.get('revision')} übertragen ({len(raw)} Bytes, Versuch {attempt}).",
                            display_id,
                        )
                        rt = self.rt(display_id)
                        rt.update(device_revision=ack.get("rev"), device_crc=crc, online=True)
                        self._track(display_id)
                        await self.async_push_states(display_id)
                        self._evaluate_night(display, dt_util.now(), force=True)
                        self.hass.async_create_task(self.async_refresh_graphs(display_id))
                        self.hass.async_create_task(self.async_push_football(display_id, force=True))
                        self.hass.async_create_task(self.async_push_notes(display_id, force=True))
                        return {"ok": True, "revision": layout.get("revision"), "size": len(raw), "crc": crc, "attempts": attempt}
                    code = str(ack.get("err") or "")
                    last_error = describe_device_error(code)
                    if code.startswith(NON_RETRYABLE):
                        break
                self.add_log("warning", f"Übertragung Versuch {attempt} fehlgeschlagen: {last_error}", display_id)
                if attempt < TRANSFER_RETRIES:
                    await asyncio.sleep(1.5 * attempt)

            transfer.update(state="error", error=last_error)
            self._notify_frontend(display_id, "transfer", **transfer)
            self.add_log("error", f"Layout-Übertragung fehlgeschlagen: {last_error}", display_id)
            raise TransferError(last_error)

    # ------------------------------------------------------------------ device commands

    async def _request_hello(self, display_id: str) -> None:
        display = self.store.get_display(display_id)
        if display and self.has_actions(display):
            try:
                await self._call(display, ACTION_HELLO, {})
            except HomeAssistantError:
                pass

    async def async_show_page(self, display_id: str, page: int) -> None:
        await self._call(self._require(display_id), ACTION_PAGE, {"page": int(page)})

    async def async_notify(self, display_id: str, title: str, message: str, seconds: int = 10) -> None:
        await self._call(
            self._require(display_id), ACTION_NOTIFY, {"title": title[:48], "message": message[:240], "seconds": int(seconds)}
        )

    async def async_rollback(self, display_id: str) -> None:
        await self._call(self._require(display_id), ACTION_ROLLBACK, {})

    async def async_reboot(self, display_id: str) -> None:
        display = self._require(display_id)
        if not display.get("device_id"):
            raise HomeAssistantError("Kein ESPHome-Gerät verknüpft.")
        ent_reg = er.async_get(self.hass)
        for entry in er.async_entries_for_device(ent_reg, display["device_id"]):
            if entry.domain == "button" and entry.original_device_class == "restart":
                await self.hass.services.async_call("button", "press", {"entity_id": entry.entity_id}, blocking=True)
                self.add_log("info", "Neustart ausgelöst", display_id)
                return
        raise HomeAssistantError("Neustart-Schaltfläche des Geräts nicht gefunden.")

    def _require(self, display_id: str) -> dict[str, Any]:
        display = self.store.get_display(display_id)
        if display is None:
            raise HomeAssistantError("Display nicht gefunden.")
        return display

    # ------------------------------------------------------------------ device events

    @callback
    def _on_device_event(self, event: Event) -> None:
        etype = event.data.get("type")
        payload = parse_event_payload(event.data.get("payload"))
        display = self.find_display_for_event(event)
        if display is None:
            if etype == "hello":
                node = normalize_node(event.data.get("node"))
                self.unassigned[node] = {**payload, "device_id": event.data.get("device_id"), "seen": datetime.now(timezone.utc).isoformat()}
                self.add_log("info", f"Neues Guition-Display „{node}“ meldet sich (noch nicht zugeordnet).", None)
                self._notify_frontend(None, "candidate", node=node)
            return
        display_id = display["id"]
        rt = self.rt(display_id)
        rt["last_seen"] = datetime.now(timezone.utc).isoformat()
        rt["online"] = True

        if etype == "ack":
            fut = self._pending.get((display_id, int(payload.get("s", 0))))
            if fut is not None and not fut.done():
                fut.set_result(payload)
        elif etype == "hello":
            self._handle_hello(display, payload)
        elif etype == "setting":
            self._handle_setting(display, payload)
        elif etype in ("tap", "hold", "set", "btn", "color"):
            self._handle_touch(display, etype, payload)
        elif etype == "hb":
            up = payload.get("up")
            if isinstance(up, int) and isinstance(rt.get("uptime"), int) and up + 60 < rt["uptime"]:
                rt["reboots"] = rt.get("reboots", 0) + 1
                self.add_log("warning", "Display wurde neu gestartet (Laufzeit zurückgesetzt).", display_id)
            rt.update(uptime=up, heap=payload.get("heap"), psram=payload.get("psram"))
            if isinstance(payload.get("heap"), int):
                rt["heap_min"] = min(rt.get("heap_min") or payload["heap"], payload["heap"])
        elif etype == "page":
            rt["page"] = payload.get("page")
            if self.debug:
                self.add_log("debug", f"Seite {payload.get('page')} angezeigt", display_id)
        elif etype == "ota":
            state = payload.get("state")
            rt["ota"] = {"state": state, "progress": payload.get("p", 100 if state == "done" else rt["ota"].get("progress", 0))}
            self.add_log("error" if state == "error" else "info", f"OTA: {state} {payload.get('p', '')}", display_id)
            self._notify_frontend(display_id, "ota", **rt["ota"])
        elif etype == "rollback":
            self.add_log("info" if payload.get("ok") else "error", f"Rollback: {payload}", display_id)
            rt["device_revision"] = payload.get("rev")
            rt["device_crc"] = payload.get("crc")
        self._notify_frontend(display_id, "status")

    @callback
    def _handle_hello(self, display: dict[str, Any], payload: dict[str, Any]) -> None:
        display_id = display["id"]
        rt = self.rt(display_id)
        up = payload.get("up")
        if isinstance(up, int) and isinstance(rt.get("uptime"), int) and up + 60 < rt["uptime"]:
            rt["reboots"] = rt.get("reboots", 0) + 1
            self.add_log("warning", "Display wurde neu gestartet.", display_id)
        rt.update(
            firmware=payload.get("fw"),
            protocol=payload.get("proto"),
            device_revision=payload.get("rev"),
            device_crc=payload.get("crc"),
            page=payload.get("page"),
            heap=payload.get("heap"),
            psram=payload.get("psram"),
            uptime=payload.get("up"),
        )
        if rt["ota"].get("state") in ("start", "progress", "done"):
            rt["ota"] = {"state": "idle", "progress": 0}
            self.add_log("info", f"Display nach Update online, Firmware {payload.get('fw')}", display_id)
        self.add_log("info", f"Display online (Firmware {payload.get('fw')}, Layout-Rev. {payload.get('rev')})", display_id)
        if payload.get("proto") != PROTOCOL_VERSION:
            self.add_log("error", "Firmware-Protokoll inkompatibel – bitte Firmware aktualisieren.", display_id)
            return
        applied = display.get("applied")
        if applied and (int(payload.get("crc", 0)) & 0xFFFFFFFF) != applied["crc"]:
            # Device has an older/other layout (e.g. after re-flash): restore ours.
            if not self._locks.setdefault(display_id, asyncio.Lock()).locked():
                self.add_log("info", "Layout auf dem Display weicht ab – wird erneut übertragen.", display_id)
                self.hass.async_create_task(self._safe_resend(display_id, applied["layout"]))
            return
        self.hass.async_create_task(self.async_push_states(display_id))
        self._evaluate_night(display, dt_util.now(), force=True)
        self.hass.async_create_task(self.async_refresh_graphs(display_id))
        self._logos_sent.pop(display_id, None)  # the display forgot its logos when it restarted
        self.hass.async_create_task(self.async_push_football(display_id, force=True))
        self.hass.async_create_task(self.async_push_notes(display_id, force=True))

    async def _safe_resend(self, display_id: str, layout: dict[str, Any]) -> None:
        try:
            await self.async_send_layout(display_id, layout)
        except (TransferError, LayoutValidationError) as err:
            self.add_log("error", f"Automatische Wiederherstellung fehlgeschlagen: {err}", display_id)

    @callback
    def _handle_touch(self, display: dict[str, Any], etype: str, payload: dict[str, Any]) -> None:
        display_id = display["id"]
        applied = display.get("applied")
        tile = find_tile(applied["layout"], str(payload.get("t", ""))) if applied else None
        if tile is None:
            self.add_log("warning", f"Unbekannte Kachel {payload.get('t')} berührt", display_id)
            return
        if tile.get("type") == "swipe":
            # the display reports which of the entities is currently shown
            item_tile = swipe_item_tile(tile, payload.get("i", 0))
            if item_tile is None:
                self.add_log("warning", f"Ungültiger Eintrag {payload.get('i')} der Wisch-Kachel {tile['id']}", display_id)
                return
            tile = item_tile
        if etype in ("set", "btn", "color"):
            state = self.hass.states.get(tile.get("entity") or "")
            resolved = resolve_control(tile, etype, payload, dict(state.attributes) if state else None)
            label = {"set": f"Regler {payload.get('v')} %", "btn": f"Taste {payload.get('b')}", "color": "Farbe"}[etype]
        else:
            resolved = resolve_action(tile, etype)
            label = "Tippen" if etype == "tap" else "Lange tippen"
        if resolved is None:
            if etype in ("set", "btn", "color"):
                self.add_log("warning", f"Ungültige Bedienung {etype} {payload} an Kachel {tile['id']} ignoriert", display_id)
            return
        domain, service, data = resolved
        self.add_log("info", f"{label}: {tile.get('title') or tile['id']} → {domain}.{service}", display_id)

        async def _run() -> None:
            try:
                await self.hass.services.async_call(domain, service, data, blocking=True)
            except (HomeAssistantError, ValueError) as err:
                self.add_log("error", f"Aktion {domain}.{service} fehlgeschlagen: {err}", display_id)
                if display.get("node"):
                    try:
                        await self.async_notify(display_id, "Aktion fehlgeschlagen", str(err)[:200], 6)
                    except HomeAssistantError:
                        pass

        self.hass.async_create_task(_run())

    # ------------------------------------------------------------------ status

    def display_status(self, display: dict[str, Any]) -> dict[str, Any]:
        rt = self.rt(display["id"])
        applied = display.get("applied") or {}
        online = self.display_online(display)
        in_sync = bool(applied) and (rt.get("device_crc") is None or (int(rt["device_crc"]) & 0xFFFFFFFF) == applied.get("crc"))
        return {
            "id": display["id"],
            "name": display["name"],
            "node": display.get("node"),
            "device_id": display.get("device_id"),
            "hardware": display.get("hardware"),
            "online": online,
            "linked": self.has_actions(display),
            "applied_revision": applied.get("revision"),
            "applied_at": applied.get("at"),
            "applied_size": applied.get("size"),
            "draft_revision": display["layout"].get("revision"),
            "draft_saved_at": display.get("draft_saved_at"),
            "in_sync": in_sync,
            "page_count": len(display["layout"].get("pages", [])),
            **{
                k: rt.get(k)
                for k in ("firmware", "protocol", "device_revision", "page", "heap", "heap_min", "psram", "uptime", "last_seen", "transfer", "ota", "night", "reboots")
            },
        }

    def entity_ids_for(self, display_id: str) -> list[str]:
        display = self.store.get_display(display_id)
        if not display:
            return []
        return sorted(layout_entities(display["layout"]))

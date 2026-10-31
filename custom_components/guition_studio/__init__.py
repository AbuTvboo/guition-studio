"""Guition Studio – visual display designer and manager for Guition ESP32-S3 panels."""

from __future__ import annotations

from datetime import timedelta
import hashlib
import logging
from pathlib import Path

import voluptuous as vol

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
import homeassistant.helpers.config_validation as cv
from homeassistant.const import Platform
from homeassistant.helpers.event import async_call_later, async_track_time_interval

from . import websocket_api
from .const import (
    CONF_FIRMWARE_REPO,
    DEFAULT_FIRMWARE_REPO,
    DOMAIN,
    EVENT_UPDATED,
    PANEL_COMPONENT,
    PANEL_URL,
    STATIC_URL,
)
from .firmware import FirmwareManager
from .http import FirmwareView
from .manager import StudioManager
from .store import StudioStore

_LOGGER = logging.getLogger(__name__)
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)
FRONTEND_DIR = Path(__file__).parent / "www"
PANEL_FILE = "guition-studio-panel.js"
PLATFORMS = [Platform.UPDATE, Platform.NOTIFY]

SERVICE_NOTIFY = "notify"
SERVICE_SHOW_PAGE = "show_page"
SERVICE_PUSH_LAYOUT = "push_layout"

DISPLAY_SCHEMA = vol.Schema({vol.Required("display"): cv.string}, extra=vol.ALLOW_EXTRA)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    store = StudioStore(hass)
    await store.async_load()
    manager = StudioManager(hass, store)
    firmware = FirmwareManager(hass, entry.options.get(CONF_FIRMWARE_REPO, entry.data.get(CONF_FIRMWARE_REPO, DEFAULT_FIRMWARE_REPO)))
    hass.data[DOMAIN] = {"store": store, "manager": manager, "firmware": firmware, "entry": entry}

    await _async_register_frontend(hass)
    _register_services(hass)
    await manager.async_start()
    await firmware.async_list_local()
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    async def _check_release(_now=None) -> None:
        await firmware.async_check_latest()
        hass.bus.async_fire(EVENT_UPDATED, {"display_id": None, "kind": "firmware"})

    # Release info for the update entities: shortly after start, then daily (read-only GitHub API call).
    entry.async_on_unload(async_call_later(hass, 60, _check_release))
    entry.async_on_unload(async_track_time_interval(hass, _check_release, timedelta(hours=24)))
    entry.async_on_unload(entry.add_update_listener(_async_update_listener))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    if not await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        return False
    data = hass.data.pop(DOMAIN, None)
    if data:
        await data["manager"].async_stop()
        await data["store"].async_save()
    frontend.async_remove_panel(hass, PANEL_URL)
    for service in (SERVICE_NOTIFY, SERVICE_SHOW_PAGE, SERVICE_PUSH_LAYOUT):
        hass.services.async_remove(DOMAIN, service)
    return True


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)


def _file_hash(path: Path) -> str:
    try:
        return hashlib.sha1(path.read_bytes()).hexdigest()[:10]  # noqa: S324 - cache busting only
    except OSError:
        return "missing"


async def _async_register_frontend(hass: HomeAssistant) -> None:
    flags = hass.data.setdefault(f"{DOMAIN}_registered", set())
    if "static" not in flags:
        await hass.http.async_register_static_paths([StaticPathConfig(STATIC_URL, str(FRONTEND_DIR), False)])
        hass.http.register_view(FirmwareView(hass))
        websocket_api.async_register(hass)
        flags.add("static")
    version = await hass.async_add_executor_job(_file_hash, FRONTEND_DIR / PANEL_FILE)
    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=PANEL_URL,
        webcomponent_name=PANEL_COMPONENT,
        sidebar_title="Guition Studio",
        sidebar_icon="mdi:tablet-dashboard",
        module_url=f"{STATIC_URL}/{PANEL_FILE}?v={version}",
        require_admin=True,
        config={},
    )


def _resolve_display(hass: HomeAssistant, ref: str) -> str:
    store: StudioStore = hass.data[DOMAIN]["store"]
    for display in store.displays.values():
        if ref in (display["id"], display["name"], display.get("node")):
            return display["id"]
    raise ServiceValidationError(f"Display „{ref}“ nicht gefunden.")


def _register_services(hass: HomeAssistant) -> None:
    async def notify(call: ServiceCall) -> None:
        manager: StudioManager = hass.data[DOMAIN]["manager"]
        await manager.async_notify(
            _resolve_display(hass, call.data["display"]), call.data.get("title", "Home Assistant"), call.data["message"], call.data.get("seconds", 10)
        )

    async def show_page(call: ServiceCall) -> None:
        manager: StudioManager = hass.data[DOMAIN]["manager"]
        display_id = _resolve_display(hass, call.data["display"])
        display = manager.store.get_display(display_id)
        applied = (display or {}).get("applied")
        if not applied:
            raise ServiceValidationError("Auf diesem Display wurde noch kein Layout übertragen.")
        target = call.data["page"]
        pages = applied["layout"]["pages"]
        index = next((i for i, p in enumerate(pages) if target in (p["id"], p["name"], str(i + 1))), None)
        if index is None:
            raise ServiceValidationError(f"Seite „{target}“ nicht gefunden.")
        await manager.async_show_page(display_id, index)

    async def push_layout(call: ServiceCall) -> None:
        manager: StudioManager = hass.data[DOMAIN]["manager"]
        display_id = _resolve_display(hass, call.data["display"])
        display = manager.store.get_display(display_id)
        try:
            await manager.async_apply_layout(display_id, display["layout"])
        except ValueError as err:
            raise HomeAssistantError(str(err)) from err

    hass.services.async_register(
        DOMAIN,
        SERVICE_NOTIFY,
        notify,
        vol.Schema(
            {
                vol.Required("display"): cv.string,
                vol.Optional("title"): cv.string,
                vol.Required("message"): cv.string,
                vol.Optional("seconds", default=10): vol.All(vol.Coerce(int), vol.Range(min=0, max=3600)),
            }
        ),
    )
    hass.services.async_register(
        DOMAIN, SERVICE_SHOW_PAGE, show_page, vol.Schema({vol.Required("display"): cv.string, vol.Required("page"): cv.string})
    )
    hass.services.async_register(DOMAIN, SERVICE_PUSH_LAYOUT, push_layout, DISPLAY_SCHEMA)


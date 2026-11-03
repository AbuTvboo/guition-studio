"""Home Assistant integration tests (pytest-homeassistant-custom-component).

The ESPHome device is emulated by registering the same ``esphome.<node>_gs_*``
services the real firmware exposes. The emulator reproduces the firmware's
transfer semantics (session, chunk order, CRC32 check, JSON parse) and answers
with the same ``esphome.guition_studio`` events, so the full HA-side path
(editor API → validation → chunked transfer → ACK → state push → touch action)
is exercised for real.
"""

from __future__ import annotations

from datetime import timedelta
import json
from typing import Any
from unittest.mock import AsyncMock, patch
import zlib

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_mock_service

from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.setup import async_setup_component

from custom_components.guition_studio.const import DOMAIN, EVENT_DEVICE, PROTOCOL_VERSION
from custom_components.guition_studio.layout import make_tile

NODE = "guition_studio_abc123"


class FakeDevice:
    """Emulates firmware/components/guition_studio transfer handling."""

    def __init__(self, hass: HomeAssistant, node: str = NODE) -> None:
        self.hass = hass
        self.node = node
        self.session = 0
        self.total = 0
        self.crc = 0
        self.buf = ""
        self.next_index = 0
        self.failed: str | None = None
        self.layout: dict | None = None
        self.layout_crc = 0
        self.states: list[dict] = []
        self.corrupt_next = 0
        self.pages: list[int] = []
        self.modes: list[dict] = []
        self.notifications: list[dict] = []
        self.school: list[dict] = []
        for action, handler in {
            "gs_layout_begin": self._begin,
            "gs_layout_chunk": self._chunk,
            "gs_layout_commit": self._commit,
            "gs_states": self._states,
            "gs_hello": self._hello,
            "gs_page": self._page,
            "gs_notify": self._notify,
            "gs_rollback": self._noop,
            "gs_mode": self._mode,
            "gs_school": self._school,
        }.items():
            hass.services.async_register("esphome", f"{node}_{action}", handler)

    def emit(self, etype: str, payload: dict[str, Any]) -> None:
        self.hass.bus.async_fire(EVENT_DEVICE, {"type": etype, "payload": json.dumps(payload), "node": self.node.replace("_", "-")})

    async def _noop(self, call: ServiceCall) -> None:
        return None

    async def _begin(self, call: ServiceCall) -> None:
        self.session = call.data["session"]
        self.total = call.data["total"]
        self.crc = call.data["crc"] & 0xFFFFFFFF
        self.buf, self.next_index, self.failed = "", 0, None

    async def _chunk(self, call: ServiceCall) -> None:
        if call.data["session"] != self.session or self.failed:
            return
        if call.data["index"] != self.next_index:
            self.failed = "sequence"
            return
        data = call.data["data"]
        if self.corrupt_next:
            data = data[:-1] + ("X" if data[-1] != "X" else "Y")
        self.buf += data
        self.next_index += 1

    async def _commit(self, call: ServiceCall) -> None:
        raw = self.buf.encode("utf-8")
        if self.failed:
            err = self.failed
        elif len(raw) != self.total:
            err = "incomplete"
        elif zlib.crc32(raw) != self.crc:
            err = "crc"
        else:
            doc = json.loads(self.buf)
            err = "" if doc.get("v") == PROTOCOL_VERSION else "version"
        if self.corrupt_next:
            self.corrupt_next -= 1
        if err:
            self.emit("ack", {"s": self.session, "ok": False, "rev": 0, "crc": self.layout_crc, "err": err})
            return
        self.layout, self.layout_crc = json.loads(self.buf), zlib.crc32(raw)
        self.emit("ack", {"s": self.session, "ok": True, "rev": self.layout["rev"], "crc": self.layout_crc, "err": ""})

    async def _states(self, call: ServiceCall) -> None:
        self.states.append(json.loads(call.data["data"]))

    async def _hello(self, call: ServiceCall) -> None:
        self.emit("hello", {"proto": PROTOCOL_VERSION, "fw": "0.1.0", "hw": "guition-4848s040", "rev": 0, "crc": self.layout_crc, "page": 0})

    async def _page(self, call: ServiceCall) -> None:
        self.pages.append(call.data["page"])

    async def _mode(self, call: ServiceCall) -> None:
        self.modes.append(dict(call.data))

    async def _school(self, call: ServiceCall) -> None:
        self.school.append(json.loads(call.data["data"]))

    async def _notify(self, call: ServiceCall) -> None:
        self.notifications.append(dict(call.data))


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations, hass: HomeAssistant):
    # hass_frontend (the built HA frontend) is not installed in test environments;
    # mark frontend/panel_custom as loaded and stub the panel calls instead.
    hass.config.components.update({"frontend", "panel_custom"})
    yield


@pytest.fixture
async def setup_studio(hass: HomeAssistant):
    """Set up the integration; frontend/panel_custom are stubbed (hass_frontend not installed in CI)."""
    assert await async_setup_component(hass, "http", {})
    assert await async_setup_component(hass, "websocket_api", {})
    assert await async_setup_component(hass, "homeassistant", {})
    hass.config.components.update({"frontend", "panel_custom"})
    entry = MockConfigEntry(domain=DOMAIN, data={"firmware_repo": "owner/repo"}, unique_id=DOMAIN)
    entry.add_to_hass(hass)
    with (
        patch("custom_components.guition_studio.panel_custom.async_register_panel", AsyncMock()) as reg,
        patch("custom_components.guition_studio.frontend.async_remove_panel"),
    ):
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
        yield entry, reg


async def test_config_flow_single_instance(hass: HomeAssistant) -> None:
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})
    assert result["type"] == "form"
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"firmware_repo": "not a repo"})
    assert result["errors"] == {"firmware_repo": "invalid_repo"}
    with patch("custom_components.guition_studio.async_setup_entry", return_value=True):
        result = await hass.config_entries.flow.async_configure(result["flow_id"], {"firmware_repo": "owner/repo"})
    assert result["type"] == "create_entry"
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})
    assert result["type"] == "abort"


async def test_panel_registered(hass: HomeAssistant, setup_studio) -> None:
    _entry, reg = setup_studio
    kwargs = reg.call_args.kwargs
    assert kwargs["frontend_url_path"] == "guition-studio"
    assert kwargs["sidebar_title"] == "Guition Studio"
    assert kwargs["require_admin"] is True
    assert kwargs["module_url"].startswith("/guition_studio_static/guition-studio-panel.js?v=")


async def test_end_to_end_transfer_state_and_touch(hass: HomeAssistant, hass_ws_client, setup_studio) -> None:
    device = FakeDevice(hass)
    hass.states.async_set("light.kitchen", "on", {"friendly_name": "Küche", "brightness": 128})
    toggles = async_mock_service(hass, "light", "toggle")
    ws = await hass_ws_client(hass)

    await ws.send_json({"id": 1, "type": "guition_studio/candidates"})
    cands = (await ws.receive_json())["result"]
    assert [c["node"] for c in cands] == [NODE]

    await ws.send_json({"id": 2, "type": "guition_studio/display/create", "name": "Küche", "node": NODE})
    display = (await ws.receive_json())["result"]
    assert display["linked"] is True
    await hass.async_block_till_done()

    await ws.send_json({"id": 3, "type": "guition_studio/layout/get", "display_id": display["id"]})
    layout = (await ws.receive_json())["result"]["layout"]
    tile = make_tile("light", 0, 1, entity="light.kitchen", title="Küche Licht")
    layout["pages"][0]["tiles"].append(tile)

    await ws.send_json({"id": 4, "type": "guition_studio/layout/apply", "display_id": display["id"], "layout": layout})
    res = await ws.receive_json()
    assert res["success"], res
    assert res["result"]["ok"] is True and res["result"]["revision"] == 1
    await hass.async_block_till_done()

    # device received a valid compiled layout containing our tile
    tiles = device.layout["pages"][0]["t"]
    dev_tile = next(t for t in tiles if t["id"] == tile["id"])
    assert dev_tile["e"] == "light.kitchen" and dev_tile["ta"] == 1
    # initial state push after ACK
    assert device.states[-1]["e"]["light.kitchen"] == {"o": 1, "a": 1, "d": "An · 50 %", "n": 50}

    # live state updates are pushed (debounced)
    hass.states.async_set("light.kitchen", "off", {"friendly_name": "Küche"})
    await hass.async_block_till_done()
    await _wait_for(hass, lambda: device.states[-1]["e"]["light.kitchen"]["o"] == 0)

    # touching the tile on the device triggers the HA action
    device.emit("tap", {"t": tile["id"], "p": layout["pages"][0]["id"]})
    await hass.async_block_till_done()
    assert len(toggles) == 1 and toggles[0].data["entity_id"] == ["light.kitchen"]

    # an unknown tile id must not trigger anything
    device.emit("tap", {"t": "t_unknown", "p": "x"})
    await hass.async_block_till_done()
    assert len(toggles) == 1

    # status reflects the confirmed layout
    await ws.send_json({"id": 5, "type": "guition_studio/displays"})
    status = (await ws.receive_json())["result"][0]
    assert status["applied_revision"] == 1 and status["in_sync"] is True


async def test_device_controls_dimmer_cover_thermostat(hass: HomeAssistant, hass_ws_client, setup_studio) -> None:
    device = FakeDevice(hass)
    hass.states.async_set("light.desk", "on", {"brightness": 255})
    hass.states.async_set("cover.shutter", "open", {"current_position": 30})
    hass.states.async_set("climate.bath", "heat", {"temperature": 21.0, "current_temperature": 20.2, "target_temp_step": 0.5})
    turn_on = async_mock_service(hass, "light", "turn_on")
    close = async_mock_service(hass, "cover", "close_cover")
    set_temp = async_mock_service(hass, "climate", "set_temperature")
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "guition_studio/display/create", "name": "D", "node": NODE})
    display = (await ws.receive_json())["result"]
    await ws.send_json({"id": 2, "type": "guition_studio/layout/get", "display_id": display["id"]})
    layout = (await ws.receive_json())["result"]["layout"]
    dimmer = make_tile("dimmer", 0, 1, entity="light.desk", icon="desk-lamp")
    cover = make_tile("cover", 1, 1, entity="cover.shutter", icon="window-shutter")
    thermo = make_tile("thermostat", 2, 1, entity="climate.bath", icon="radiator")
    layout["pages"][0]["tiles"] += [dimmer, cover, thermo]
    await ws.send_json({"id": 3, "type": "guition_studio/layout/apply", "display_id": display["id"], "layout": layout})
    assert (await ws.receive_json())["success"]
    await hass.async_block_till_done()

    pushed = device.states[-1]["e"]
    assert pushed["cover.shutter"]["n"] == 30
    assert pushed["climate.bath"]["s"] == "Ziel 21 °C"

    page = layout["pages"][0]["id"]
    device.emit("set", {"t": dimmer["id"], "p": page, "v": 35})
    device.emit("btn", {"t": cover["id"], "p": page, "b": "down"})
    device.emit("btn", {"t": thermo["id"], "p": page, "b": "plus"})
    # forged controls: wrong button for the type, out-of-range value
    device.emit("btn", {"t": dimmer["id"], "p": page, "b": "down"})
    device.emit("set", {"t": cover["id"], "p": page, "v": 500})
    await hass.async_block_till_done()
    assert [c.data for c in turn_on] == [{"entity_id": "light.desk", "brightness_pct": 35}]
    assert [c.data["entity_id"] for c in close] == ["cover.shutter"]
    assert set_temp[0].data["temperature"] == 21.5


async def test_transfer_retries_after_crc_error(hass: HomeAssistant, hass_ws_client, setup_studio) -> None:
    device = FakeDevice(hass)
    device.corrupt_next = 1
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "guition_studio/display/create", "name": "D", "node": NODE})
    display = (await ws.receive_json())["result"]
    await ws.send_json({"id": 2, "type": "guition_studio/layout/get", "display_id": display["id"]})
    layout = (await ws.receive_json())["result"]["layout"]
    with patch("custom_components.guition_studio.manager.asyncio.sleep", AsyncMock()):
        await ws.send_json({"id": 3, "type": "guition_studio/layout/apply", "display_id": display["id"], "layout": layout})
        res = await ws.receive_json()
    assert res["success"], res
    assert res["result"]["attempts"] == 2


async def test_invalid_layout_rejected_before_transfer(hass: HomeAssistant, hass_ws_client, setup_studio) -> None:
    device = FakeDevice(hass)
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "guition_studio/display/create", "name": "D", "node": NODE})
    display = (await ws.receive_json())["result"]
    await ws.send_json({"id": 2, "type": "guition_studio/layout/get", "display_id": display["id"]})
    layout = (await ws.receive_json())["result"]["layout"]
    layout["pages"][0]["tiles"].append(make_tile("light", 0, 0, entity="light.x"))  # overlaps the clock
    await ws.send_json({"id": 3, "type": "guition_studio/layout/apply", "display_id": display["id"], "layout": layout})
    res = await ws.receive_json()
    assert not res["success"] and res["error"]["code"] == "invalid_layout"
    assert "überlappt" in res["error"]["message"]
    assert device.layout is None


async def test_hello_with_foreign_layout_triggers_restore(hass: HomeAssistant, hass_ws_client, setup_studio) -> None:
    device = FakeDevice(hass)
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "guition_studio/display/create", "name": "D", "node": NODE})
    display = (await ws.receive_json())["result"]
    await ws.send_json({"id": 2, "type": "guition_studio/layout/get", "display_id": display["id"]})
    layout = (await ws.receive_json())["result"]["layout"]
    await ws.send_json({"id": 3, "type": "guition_studio/layout/apply", "display_id": display["id"], "layout": layout})
    assert (await ws.receive_json())["success"]
    good_crc = device.layout_crc

    # simulate a re-flashed device that lost its layout
    device.layout, device.layout_crc = None, 0
    device.emit("hello", {"proto": PROTOCOL_VERSION, "fw": "0.1.0", "rev": 0, "crc": 0, "page": 0})
    await hass.async_block_till_done()
    await _wait_for(hass, lambda: device.layout_crc == good_crc)


async def test_services_and_backup(hass: HomeAssistant, hass_ws_client, setup_studio) -> None:
    device = FakeDevice(hass)
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "guition_studio/display/create", "name": "Flur", "node": NODE})
    display = (await ws.receive_json())["result"]
    await ws.send_json({"id": 2, "type": "guition_studio/layout/get", "display_id": display["id"]})
    layout = (await ws.receive_json())["result"]["layout"]
    layout["pages"].append({"id": "p_second", "name": "Licht", "cols": 2, "rows": 2, "tiles": []})
    await ws.send_json({"id": 3, "type": "guition_studio/layout/apply", "display_id": display["id"], "layout": layout})
    assert (await ws.receive_json())["success"]

    await hass.services.async_call(DOMAIN, "show_page", {"display": "Flur", "page": "Licht"}, blocking=True)
    assert device.pages == [1]

    await ws.send_json({"id": 4, "type": "guition_studio/backup/export"})
    backup = (await ws.receive_json())["result"]
    assert backup["format"] == "guition-studio-backup"
    await ws.send_json({"id": 5, "type": "guition_studio/backup/restore", "backup": {"format": "nope"}})
    assert not (await ws.receive_json())["success"]
    await ws.send_json({"id": 6, "type": "guition_studio/backup/restore", "backup": backup})
    assert (await ws.receive_json())["result"]["displays"] == 1


async def _create_with_layout(hass, ws, mutate) -> tuple[dict, dict]:
    await ws.send_json({"id": 101, "type": "guition_studio/display/create", "name": "Flur", "node": NODE})
    display = (await ws.receive_json())["result"]
    await ws.send_json({"id": 102, "type": "guition_studio/layout/get", "display_id": display["id"]})
    layout = (await ws.receive_json())["result"]["layout"]
    mutate(layout)
    await ws.send_json({"id": 103, "type": "guition_studio/layout/apply", "display_id": display["id"], "layout": layout})
    res = await ws.receive_json()
    assert res["success"], res
    await hass.async_block_till_done()
    return display, layout


async def test_state_rule_switches_page_and_night_mode(hass: HomeAssistant, hass_ws_client, setup_studio) -> None:
    device = FakeDevice(hass)
    hass.states.async_set("binary_sensor.doorbell", "off")
    ws = await hass_ws_client(hass)

    def mutate(layout):
        layout["pages"].append({"id": "p_door", "name": "Tür", "cols": 2, "rows": 2, "tiles": []})
        layout["settings"]["rules"] = [
            {"name": "Klingel", "type": "state", "entity": "binary_sensor.doorbell", "operator": "eq", "value": "on", "page": "p_door"}
        ]
        # night window covering the whole day except one minute -> active now
        layout["settings"]["night"] = {"enabled": True, "mode": "time", "start": "00:00", "end": "23:59", "brightness": 7, "dim": 40}

    display, _layout = await _create_with_layout(hass, ws, mutate)
    # night mode is pushed right after the confirmed transfer
    await _wait_for(hass, lambda: bool(device.modes))
    assert device.modes[-1] == {"night": 1, "brightness": 7, "dim": 40}

    hass.states.async_set("binary_sensor.doorbell", "on")
    await hass.async_block_till_done()
    assert device.pages == [1]
    hass.states.async_set("binary_sensor.doorbell", "on", {"changed": True})  # still on -> no re-trigger
    await hass.async_block_till_done()
    assert device.pages == [1]


async def test_update_and_notify_entities(hass: HomeAssistant, hass_ws_client, setup_studio) -> None:
    device = FakeDevice(hass)
    ws = await hass_ws_client(hass)
    display, _ = await _create_with_layout(hass, ws, lambda layout: None)
    await hass.async_block_till_done()

    from homeassistant.helpers import entity_registry as er

    ent_reg = er.async_get(hass)
    notify_id = ent_reg.async_get_entity_id("notify", DOMAIN, f"{display['id']}_notify")
    update_id = ent_reg.async_get_entity_id("update", DOMAIN, f"{display['id']}_update")
    assert notify_id and update_id

    await hass.services.async_call("notify", "send_message", {"entity_id": notify_id, "message": "Post ist da", "title": "Briefkasten"}, blocking=True)
    assert device.notifications[-1]["message"] == "Post ist da" and device.notifications[-1]["title"] == "Briefkasten"

    device.emit("hello", {"proto": PROTOCOL_VERSION, "fw": "0.2.0", "rev": 1, "crc": device.layout_crc, "page": 0, "up": 50})
    await hass.async_block_till_done()
    state = hass.states.get(update_id)
    assert state.attributes["installed_version"] == "0.2.0"

    # deleting the display removes its entities
    await ws.send_json({"id": 200, "type": "guition_studio/display/delete", "display_id": display["id"]})
    assert (await ws.receive_json())["success"]
    await hass.async_block_till_done()
    assert ent_reg.async_get_entity_id("notify", DOMAIN, f"{display['id']}_notify") is None


async def test_settings_changed_on_display(hass: HomeAssistant, hass_ws_client, setup_studio) -> None:
    device = FakeDevice(hass)
    ws = await hass_ws_client(hass)
    display, _ = await _create_with_layout(hass, ws, lambda layout: layout["pages"][0]["tiles"].append(make_tile("settings", 0, 1, title="Einstellungen", icon="cog")))
    assert device.layout["set"]["th"] == "modern_dark"
    assert any(t["k"] == "settings" and t["ta"] == 7 for t in device.layout["pages"][0]["t"])
    first_crc = device.layout_crc

    # local settings: stored in confirmed + draft layout, no retransfer
    device.emit("setting", {"k": "brightness", "v": 42})
    device.emit("setting", {"k": "timeout", "v": 300})
    device.emit("setting", {"k": "screensaver", "v": 1})
    device.emit("setting", {"k": "rotation", "v": 90})
    device.emit("setting", {"k": "rotation", "v": 45})  # invalid -> ignored
    device.emit("setting", {"k": "brightness", "v": 500})  # out of range -> ignored
    device.emit("setting", {"k": "evil", "v": 1})  # unknown -> ignored
    await hass.async_block_till_done()
    await ws.send_json({"id": 400, "type": "guition_studio/layout/get", "display_id": display["id"]})
    draft = (await ws.receive_json())["result"]["layout"]
    assert draft["settings"]["brightness"] == 42 and draft["settings"]["timeout"] == 300
    assert draft["settings"]["screensaver"]["enabled"] is True
    assert draft["settings"]["rotation"] == 90
    assert device.layout_crc == first_crc

    # theme from the display: confirmed layout is re-sent with the new theme
    device.emit("setting", {"k": "theme", "v": "amoled"})
    await hass.async_block_till_done()
    await _wait_for(hass, lambda: device.layout["set"]["th"] == "amoled")
    assert device.layout["set"]["br"] == 42  # local change survives the retransfer
    assert device.layout["set"]["rot"] == 90
    device.emit("setting", {"k": "theme", "v": "does-not-exist"})
    await hass.async_block_till_done()
    assert device.layout["set"]["th"] == "amoled"


async def test_slideshow_stream(hass: HomeAssistant, hass_ws_client, hass_client_no_auth, setup_studio, tmp_path) -> None:
    from io import BytesIO

    from PIL import Image

    from homeassistant.core_config import async_process_ha_core_config

    await async_process_ha_core_config(hass, {"internal_url": "http://192.168.1.10:8123"})
    folder = tmp_path / "media" / "fotos"
    folder.mkdir(parents=True)
    Image.new("RGB", (1200, 800), (10, 120, 200)).save(folder / "a.jpg")
    hass.config.media_dirs = {"local": str(tmp_path / "media")}

    device = FakeDevice(hass)
    ws = await hass_ws_client(hass)

    def mutate(layout):
        layout["settings"]["screensaver"] = {"enabled": True, "after": 60, "entities": [], "mode": "slideshow", "folder": "fotos", "interval": 10, "order": "random", "fit": "cover", "show_clock": True}

    display, _ = await _create_with_layout(hass, ws, mutate)
    url = device.layout["set"]["slu"]
    assert url.startswith("http://192.168.1.10:8123/api/guition_studio/slide/") and url.endswith("/next.jpg")

    client = await hass_client_no_auth()
    path = url.replace("http://192.168.1.10:8123", "")
    resp = await client.get(path + "?n=1")
    assert resp.status == 200 and resp.headers["Content-Type"] == "image/jpeg"
    assert Image.open(BytesIO(await resp.read())).size == (480, 480)
    wrong = path.replace(path.split("/")[-2], "falsch")
    assert (await client.get(wrong)).status == 404

    await ws.send_json({"id": 500, "type": "guition_studio/slideshow/folders"})
    folders = (await ws.receive_json())["result"]["folders"]
    assert {"folder": "fotos", "count": 1} in folders
    await ws.send_json({"id": 501, "type": "guition_studio/backup/export"})
    backup = (await ws.receive_json())["result"]
    assert "slide_token" not in json.dumps(backup)


async def test_weather_forecast_reaches_display(hass: HomeAssistant, hass_ws_client, setup_studio) -> None:
    from homeassistant.core import SupportsResponse
    from homeassistant.util import dt as dt_util

    device = FakeDevice(hass)
    hass.states.async_set("weather.home", "partlycloudy", {"temperature": 16.4, "humidity": 71, "wind_speed": 9, "wind_speed_unit": "km/h"})
    today = dt_util.now()
    forecast = [
        {"datetime": (today + timedelta(days=d)).isoformat(), "condition": c, "temperature": hi, "templow": lo}
        for d, c, hi, lo in [(0, "partlycloudy", 18, 9), (1, "rainy", 14, 8), (2, "sunny", 20, 10), (3, "cloudy", 15, 7)]
    ]
    calls = async_mock_service(
        hass, "weather", "get_forecasts", response={"weather.home": {"forecast": forecast}}, supports_response=SupportsResponse.ONLY
    )
    ws = await hass_ws_client(hass)
    await _create_with_layout(hass, ws, lambda layout: layout["pages"][0]["tiles"].append(make_tile("weather", 0, 1, 2, 2, entity="weather.home")))
    payload = next(m["e"]["weather.home"] for m in reversed(device.states) if "weather.home" in m.get("e", {}))
    assert payload["s"] == "Teilweise bewölkt" and payload["i"] == "weather-partly-cloudy"
    assert payload["w"].startswith("↑18° ↓9°") and "Wind 9 km/h" in payload["w"]
    assert [d[1] for d in payload["f"]] == ["weather-rainy", "weather-sunny", "weather-cloudy"]
    assert calls and calls[0].data["type"] == "daily"


async def test_school_screensaver_reaches_display(hass: HomeAssistant, hass_ws_client, setup_studio) -> None:
    from homeassistant.core import SupportsResponse
    from homeassistant.util import dt as dt_util

    device = FakeDevice(hass)
    tomorrow = (dt_util.now() + timedelta(days=1)).replace(hour=8, minute=0, second=0, microsecond=0)
    lesson = {"start": tomorrow.isoformat(), "end": (tomorrow + timedelta(minutes=45)).isoformat(), "summary": "Cancelled: Mathe", "location": "R1"}
    hass.states.async_set("calendar.lena", "off")
    hass.states.async_set("sensor.elternportal_letter_1", "1", {"elements": [{"sent": dt_util.now().isoformat(), "new": True, "subject": "Elternabend"}]})
    calls = async_mock_service(
        hass, "calendar", "get_events", response={"calendar.lena": {"events": [lesson]}}, supports_response=SupportsResponse.ONLY
    )
    ws = await hass_ws_client(hass)

    def mutate(layout):
        layout["settings"]["screensaver"] = {
            "enabled": True, "after": 60, "entities": [], "mode": "school",
            "school": [{"name": "Lena", "timetable": "calendar.lena", "letters": "sensor.elternportal_letter_1"}],
        }  # fmt: skip

    await _create_with_layout(hass, ws, mutate)
    assert device.layout["set"]["ssm"] == 5
    assert calls and calls[0].data["entity_id"] == "calendar.lena"
    child = device.school[-1]["k"][0]
    assert child["n"] == "Lena" and child["d"].startswith("Morgen")
    assert child["l"] == [["08:00", "08:45", "Mathe", "R1", 1]]
    assert child["i"] == [[3, "Heute", "Elternabend", 1]]


async def test_heartbeat_detects_reboot(hass: HomeAssistant, hass_ws_client, setup_studio) -> None:
    device = FakeDevice(hass)
    ws = await hass_ws_client(hass)
    display, _ = await _create_with_layout(hass, ws, lambda layout: None)
    device.emit("hb", {"up": 5000, "heap": 120000})
    device.emit("hb", {"up": 30, "heap": 118000})
    await hass.async_block_till_done()
    await ws.send_json({"id": 300, "type": "guition_studio/displays"})
    status = (await ws.receive_json())["result"][0]
    assert status["reboots"] == 1 and status["heap_min"] == 118000


async def _wait_for(hass: HomeAssistant, predicate, timeout: float = 3.0) -> None:
    import asyncio

    loop_time = hass.loop.time
    end = loop_time() + timeout
    while loop_time() < end:
        if predicate():
            return
        await asyncio.sleep(0.05)
        await hass.async_block_till_done()
    assert predicate(), "condition not reached in time"

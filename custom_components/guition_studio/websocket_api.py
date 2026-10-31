"""WebSocket API used by the Guition Studio panel. All commands require admin."""

from __future__ import annotations

import copy
from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError

from .const import (
    DOMAIN,
    FIRMWARE_URL,
    HARDWARE_PROFILES,
    ICONS,
    MAX_GRID,
    MAX_LAYOUT_BYTES,
    MAX_PAGES,
    MAX_TILES_TOTAL,
    PLANNED_TILE_TYPES,
    PROTOCOL_VERSION,
    TILE_TYPES,
    VERSION,
)
from .layout import LayoutValidationError, compile_device_layout, default_layout, regenerate_ids, validate_layout
from .templates import build_templates
from .themes import THEMES

PREFIX = f"{DOMAIN}/"


def _d(hass: HomeAssistant) -> dict[str, Any]:
    return hass.data[DOMAIN]


def _cmd(schema: dict) -> Any:
    def deco(func):
        return websocket_api.websocket_command({vol.Required("type"): PREFIX + schema.pop("type"), **schema})(
            websocket_api.require_admin(websocket_api.async_response(func))
        )

    return deco


def _err(connection, msg, err: Exception) -> None:
    if isinstance(err, LayoutValidationError):
        connection.send_error(msg["id"], "invalid_layout", "\n".join(err.errors))
    else:
        connection.send_error(msg["id"], "failed", str(err))


def _installer_url(repo: str) -> str:
    """HTTPS browser installer published by .github/workflows/pages.yml (GitHub Pages)."""
    owner, _, name = repo.partition("/")
    return f"https://{owner.lower()}.github.io/{name}/"


@callback
def async_register(hass: HomeAssistant) -> None:
    for handler in (
        ws_info, ws_displays, ws_display_create, ws_display_update, ws_display_delete, ws_candidates,
        ws_layout_get, ws_layout_save, ws_layout_validate, ws_layout_apply, ws_layout_copy, ws_command,
        ws_template_save, ws_template_delete, ws_favorites, ws_backup_export, ws_backup_restore, ws_log,
        ws_fw_status, ws_fw_check, ws_fw_download, ws_fw_ota, ws_debug, ws_slide_folders,
    ):  # fmt: skip
        websocket_api.async_register_command(hass, handler)


def _templates(hass: HomeAssistant) -> list[dict[str, Any]]:
    builtin = [{**t, "builtin": True} for t in build_templates()]
    user = [{**t, "builtin": False} for t in _d(hass)["store"].data["templates"].values()]
    return builtin + user


@_cmd({"type": "info"})
async def ws_info(hass, connection, msg):
    connection.send_result(
        msg["id"],
        {
            "version": VERSION,
            "hardware": list(HARDWARE_PROFILES.values()),
            "themes": THEMES,
            "icons": ICONS,
            "tile_types": TILE_TYPES,
            "planned_tile_types": PLANNED_TILE_TYPES,
            "templates": _templates(hass),
            "favorites": _d(hass)["store"].data["favorites"],
            "limits": {"pages": MAX_PAGES, "grid": MAX_GRID, "tiles": MAX_TILES_TOTAL, "bytes": MAX_LAYOUT_BYTES},
            "firmware_repo": _d(hass)["firmware"].repo,
            "firmware_url": FIRMWARE_URL,
            "protocol": PROTOCOL_VERSION,
            "installer_url": _installer_url(_d(hass)["firmware"].repo),
        },
    )


@_cmd({"type": "displays"})
async def ws_displays(hass, connection, msg):
    manager = _d(hass)["manager"]
    connection.send_result(msg["id"], [manager.display_status(d) for d in manager.store.displays.values()])


@_cmd(
    {
        "type": "display/create",
        vol.Required("name"): vol.All(str, vol.Length(min=1, max=40)),
        vol.Optional("node"): vol.Any(None, str),
        vol.Optional("device_id"): vol.Any(None, str),
        vol.Optional("hardware", default="guition-4848s040"): vol.In(list(HARDWARE_PROFILES)),
        vol.Optional("layout"): dict,
    }
)
async def ws_display_create(hass, connection, msg):
    manager = _d(hass)["manager"]
    display = manager.store.create_display(msg["name"], msg.get("node"), msg.get("device_id"), msg["hardware"])
    if msg.get("layout"):
        manager.store.save_draft(display["id"], regenerate_ids(msg["layout"]))
    manager.unassigned.pop(msg.get("node") or "", None)
    manager.notify_displays_changed()
    connection.send_result(msg["id"], manager.display_status(display))
    hass.async_create_task(manager._request_hello(display["id"]))  # noqa: SLF001


@_cmd(
    {
        "type": "display/update",
        vol.Required("display_id"): str,
        vol.Optional("name"): vol.All(str, vol.Length(min=1, max=40)),
        vol.Optional("node"): vol.Any(None, str),
        vol.Optional("device_id"): vol.Any(None, str),
    }
)
async def ws_display_update(hass, connection, msg):
    manager = _d(hass)["manager"]
    if manager.store.get_display(msg["display_id"]) is None:
        connection.send_error(msg["id"], "not_found", "Display nicht gefunden.")
        return
    changes = {k: msg[k] for k in ("name", "node", "device_id") if k in msg}
    display = manager.store.update_display(msg["display_id"], **changes)
    manager._track(display["id"])  # noqa: SLF001
    manager.notify_displays_changed()
    connection.send_result(msg["id"], manager.display_status(display))
    if "node" in changes:
        hass.async_create_task(manager._request_hello(display["id"]))  # noqa: SLF001


@_cmd({"type": "display/delete", vol.Required("display_id"): str})
async def ws_display_delete(hass, connection, msg):
    manager = _d(hass)["manager"]
    manager.store.delete_display(msg["display_id"])
    manager.notify_displays_changed()
    manager._track(msg["display_id"])  # noqa: SLF001
    connection.send_result(msg["id"], {"ok": True})


@_cmd({"type": "candidates"})
async def ws_candidates(hass, connection, msg):
    connection.send_result(msg["id"], _d(hass)["manager"].candidates())


@_cmd({"type": "layout/get", vol.Required("display_id"): str})
async def ws_layout_get(hass, connection, msg):
    display = _d(hass)["store"].get_display(msg["display_id"])
    if display is None:
        connection.send_error(msg["id"], "not_found", "Display nicht gefunden.")
        return
    applied = display.get("applied") or {}
    connection.send_result(
        msg["id"],
        {
            "layout": display["layout"],
            "draft_saved_at": display.get("draft_saved_at"),
            "applied_revision": applied.get("revision"),
            "applied_at": applied.get("at"),
        },
    )


def _check(layout: dict[str, Any]) -> dict[str, Any]:
    try:
        validated = validate_layout(layout)
        payload, _crc = compile_device_layout(validated)
        return {"valid": True, "errors": [], "size": len(payload.encode("utf-8"))}
    except LayoutValidationError as err:
        return {"valid": False, "errors": err.errors, "size": None}


@_cmd({"type": "layout/save", vol.Required("display_id"): str, vol.Required("layout"): dict})
async def ws_layout_save(hass, connection, msg):
    """Save a draft. Drafts may be incomplete; validation results are returned, not enforced."""
    store = _d(hass)["store"]
    if store.get_display(msg["display_id"]) is None:
        connection.send_error(msg["id"], "not_found", "Display nicht gefunden.")
        return
    layout = msg["layout"]
    if not isinstance(layout.get("pages"), list) or len(str(layout)) > 400_000:
        connection.send_error(msg["id"], "invalid_layout", "Entwurf ist beschädigt oder zu groß.")
        return
    display = store.save_draft(msg["display_id"], layout)
    connection.send_result(msg["id"], {"saved_at": display["draft_saved_at"], **_check(layout)})


@_cmd({"type": "layout/validate", vol.Required("layout"): dict})
async def ws_layout_validate(hass, connection, msg):
    connection.send_result(msg["id"], _check(msg["layout"]))


@_cmd({"type": "layout/apply", vol.Required("display_id"): str, vol.Required("layout"): dict})
async def ws_layout_apply(hass, connection, msg):
    try:
        result = await _d(hass)["manager"].async_apply_layout(msg["display_id"], msg["layout"])
    except (HomeAssistantError, LayoutValidationError) as err:
        _err(connection, msg, err)
        return
    connection.send_result(msg["id"], result)


@_cmd({"type": "layout/copy", vol.Required("source"): str, vol.Required("target"): str})
async def ws_layout_copy(hass, connection, msg):
    store = _d(hass)["store"]
    src, dst = store.get_display(msg["source"]), store.get_display(msg["target"])
    if src is None or dst is None:
        connection.send_error(msg["id"], "not_found", "Display nicht gefunden.")
        return
    layout = regenerate_ids(src["layout"])
    layout["revision"] = dst["layout"].get("revision", 0)
    store.save_draft(dst["id"], layout)
    connection.send_result(msg["id"], {"ok": True})


@_cmd(
    {
        "type": "display/command",
        vol.Required("display_id"): str,
        vol.Required("command"): vol.In(["reboot", "rollback", "hello", "page", "notify", "push_states", "resend"]),
        vol.Optional("page"): int,
        vol.Optional("title"): str,
        vol.Optional("message"): str,
    }
)
async def ws_command(hass, connection, msg):
    manager = _d(hass)["manager"]
    did, cmd = msg["display_id"], msg["command"]
    try:
        if cmd == "reboot":
            await manager.async_reboot(did)
        elif cmd == "rollback":
            await manager.async_rollback(did)
        elif cmd == "hello":
            await manager._request_hello(did)  # noqa: SLF001
        elif cmd == "page":
            await manager.async_show_page(did, msg.get("page", 0))
        elif cmd == "notify":
            await manager.async_notify(did, msg.get("title", "Guition Studio"), msg.get("message", "Testnachricht"), 8)
        elif cmd == "push_states":
            await manager.async_push_states(did)
        elif cmd == "resend":
            display = manager._require(did)  # noqa: SLF001
            if not display.get("applied"):
                raise HomeAssistantError("Es wurde noch kein Layout übertragen.")
            await manager.async_send_layout(did, display["applied"]["layout"])
    except (HomeAssistantError, LayoutValidationError) as err:
        _err(connection, msg, err)
        return
    connection.send_result(msg["id"], {"ok": True})


@_cmd(
    {
        "type": "template/save",
        vol.Required("name"): vol.All(str, vol.Length(min=1, max=60)),
        vol.Optional("description", default=""): str,
        vol.Required("layout"): dict,
    }
)
async def ws_template_save(hass, connection, msg):
    tpl = _d(hass)["store"].save_template(msg["name"], msg["description"][:200], copy.deepcopy(msg["layout"]))
    connection.send_result(msg["id"], tpl)


@_cmd({"type": "template/delete", vol.Required("template_id"): str})
async def ws_template_delete(hass, connection, msg):
    _d(hass)["store"].delete_template(msg["template_id"])
    connection.send_result(msg["id"], {"ok": True})


@_cmd({"type": "favorites", vol.Required("favorites"): [str]})
async def ws_favorites(hass, connection, msg):
    _d(hass)["store"].set_favorites(msg["favorites"])
    connection.send_result(msg["id"], {"ok": True})


@_cmd({"type": "backup/export"})
async def ws_backup_export(hass, connection, msg):
    store = _d(hass)["store"]
    data = copy.deepcopy(store.data)
    for display in data.get("displays", {}).values():
        display.pop("slide_token", None)  # secret, regenerated on demand
    connection.send_result(msg["id"], {"format": "guition-studio-backup", "version": 1, "app_version": VERSION, "data": data})


@_cmd({"type": "backup/restore", vol.Required("backup"): dict})
async def ws_backup_restore(hass, connection, msg):
    backup = msg["backup"]
    data = backup.get("data")
    if backup.get("format") != "guition-studio-backup" or not isinstance(data, dict):
        connection.send_error(msg["id"], "invalid_backup", "Keine gültige Guition-Studio-Sicherung.")
        return
    displays = data.get("displays") or {}
    for display in displays.values():
        if not isinstance(display, dict) or "id" not in display or not isinstance(display.get("layout"), dict):
            connection.send_error(msg["id"], "invalid_backup", "Sicherung enthält beschädigte Displays.")
            return
    manager = _d(hass)["manager"]
    manager.store.data = {
        "displays": displays,
        "templates": data.get("templates") or {},
        "favorites": data.get("favorites") or [],
    }
    await manager.store.async_save()
    for display_id in displays:
        manager._track(display_id)  # noqa: SLF001
    manager.notify_displays_changed()
    connection.send_result(msg["id"], {"ok": True, "displays": len(displays)})


@_cmd({"type": "log"})
async def ws_log(hass, connection, msg):
    manager = _d(hass)["manager"]
    connection.send_result(msg["id"], {"entries": list(manager.log), "debug": manager.debug})


@_cmd({"type": "debug", vol.Required("enabled"): bool})
async def ws_debug(hass, connection, msg):
    _d(hass)["manager"].debug = msg["enabled"]
    connection.send_result(msg["id"], {"debug": msg["enabled"]})


@_cmd({"type": "firmware/status"})
async def ws_fw_status(hass, connection, msg):
    fw = _d(hass)["firmware"]
    connection.send_result(
        msg["id"],
        {"local": await fw.async_list_local(), "latest": fw.latest, "error": fw.last_error, "repo": fw.repo, "path": str(fw.base)},
    )


@_cmd({"type": "firmware/check"})
async def ws_fw_check(hass, connection, msg):
    fw = _d(hass)["firmware"]
    latest = await fw.async_check_latest()
    connection.send_result(msg["id"], {"latest": latest, "error": fw.last_error})


@_cmd({"type": "firmware/download", vol.Required("version"): str})
async def ws_fw_download(hass, connection, msg):
    try:
        result = await _d(hass)["firmware"].async_download(msg["version"])
    except Exception as err:  # noqa: BLE001 - report any download problem to the UI
        _err(connection, msg, err)
        return
    connection.send_result(msg["id"], result)


@_cmd({"type": "firmware/ota", vol.Required("display_id"): str, vol.Required("version"): str})
async def ws_fw_ota(hass, connection, msg):
    d = _d(hass)
    display = d["store"].get_display(msg["display_id"])
    if display is None:
        connection.send_error(msg["id"], "not_found", "Display nicht gefunden.")
        return
    try:
        result = await d["firmware"].async_start_ota(d["manager"], display, msg["version"])
    except HomeAssistantError as err:
        _err(connection, msg, err)
        return
    connection.send_result(msg["id"], result)


@_cmd({"type": "slideshow/folders"})
async def ws_slide_folders(hass, connection, msg):
    from .http import media_root  # noqa: PLC0415
    from .slideshow import list_folders  # noqa: PLC0415

    root = media_root(hass)
    folders = await hass.async_add_executor_job(list_folders, root)
    connection.send_result(msg["id"], {"root": str(root), "folders": folders})


__all__ = ["async_register", "default_layout"]

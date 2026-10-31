"""Diagnostics download (Settings → Devices & services → Guition Studio → ⋮)."""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DOMAIN, VERSION


async def async_get_config_entry_diagnostics(hass: HomeAssistant, entry: ConfigEntry) -> dict[str, Any]:
    data = hass.data[DOMAIN]
    manager = data["manager"]
    return {
        "version": VERSION,
        "displays": [manager.display_status(d) for d in manager.store.displays.values()],
        "layouts": {d["id"]: d["layout"] for d in manager.store.displays.values()},
        "unassigned": manager.unassigned,
        "firmware": {"repo": data["firmware"].repo, "latest": data["firmware"].latest, "local": await data["firmware"].async_list_local()},
        "log": list(manager.log)[-100:],
    }

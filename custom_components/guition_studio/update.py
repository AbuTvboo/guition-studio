"""Firmware update entity per display (Settings → Updates)."""

from __future__ import annotations

from typing import Any

from homeassistant.components.update import UpdateEntity, UpdateEntityFeature
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN
from .entity import StudioEntity, setup_display_platform


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback) -> None:
    data = hass.data[DOMAIN]
    setup_display_platform(
        hass, entry, async_add_entities, "update", "update", lambda did: DisplayFirmwareUpdate(hass, data["manager"], data["firmware"], did)
    )


class DisplayFirmwareUpdate(StudioEntity, UpdateEntity):
    _attr_name = "Guition-Studio-Firmware"
    _attr_title = "Guition Studio Firmware"
    _attr_supported_features = UpdateEntityFeature.INSTALL | UpdateEntityFeature.PROGRESS | UpdateEntityFeature.RELEASE_NOTES

    def __init__(self, hass: HomeAssistant, manager: Any, firmware: Any, display_id: str) -> None:
        super().__init__(hass, manager, display_id, "update")
        self.firmware = firmware

    @property
    def installed_version(self) -> str | None:
        return self.manager.rt(self.display_id).get("firmware")

    @property
    def latest_version(self) -> str | None:
        return self.firmware.best_version() or self.installed_version

    @property
    def in_progress(self) -> bool:
        return self.manager.rt(self.display_id).get("ota", {}).get("state") in ("start", "progress", "done")

    @property
    def update_percentage(self) -> int | None:
        if not self.in_progress:
            return None
        return int(self.manager.rt(self.display_id).get("ota", {}).get("progress") or 0)

    @property
    def release_url(self) -> str | None:
        latest = self.firmware.latest
        return latest.get("url") if latest else None

    async def async_release_notes(self) -> str | None:
        latest = self.firmware.latest
        if latest and latest.get("version") == self.latest_version:
            return latest.get("notes")
        return None

    async def async_install(self, version: str | None, backup: bool, **kwargs: Any) -> None:
        display = self.display
        if display is None:
            raise HomeAssistantError("Display nicht gefunden.")
        target = version or self.latest_version
        if not target:
            raise HomeAssistantError("Keine Firmware-Version verfügbar.")
        if self.firmware.path_for(target, "firmware.ota.bin") is None:
            await self.firmware.async_download(target)
        await self.firmware.async_start_ota(self.manager, display, target)
        self.async_write_ha_state()

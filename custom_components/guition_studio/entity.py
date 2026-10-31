"""Shared base for per-display entities (update, notify)."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity import Entity
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN, EVENT_UPDATED, SIGNAL_DISPLAYS_CHANGED
from .manager import StudioManager


def display_device_info(hass: HomeAssistant, display: dict[str, Any]) -> DeviceInfo:
    """Attach to the linked ESPHome device if known, otherwise a Guition Studio device."""
    if display.get("device_id"):
        device = dr.async_get(hass).async_get(display["device_id"])
        if device is not None and device.connections:
            return DeviceInfo(connections=device.connections)
    return DeviceInfo(
        identifiers={(DOMAIN, display["id"])},
        name=display["name"],
        manufacturer="Guition",
        model="ESP32-S3-4848S040",
    )


class StudioEntity(Entity):
    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, hass: HomeAssistant, manager: StudioManager, display_id: str, suffix: str) -> None:
        self.manager = manager
        self.display_id = display_id
        self._attr_unique_id = f"{display_id}_{suffix}"
        display = manager.store.get_display(display_id) or {"id": display_id, "name": display_id}
        self._attr_device_info = display_device_info(hass, display)

    @property
    def display(self) -> dict[str, Any] | None:
        return self.manager.store.get_display(self.display_id)

    @property
    def available(self) -> bool:
        display = self.display
        return display is not None and self.manager.has_actions(display)

    async def async_added_to_hass(self) -> None:
        @callback
        def _updated(event: Event) -> None:
            if event.data.get("display_id") in (self.display_id, None):
                self.async_write_ha_state()

        self.async_on_remove(self.hass.bus.async_listen(EVENT_UPDATED, _updated))


def setup_display_platform(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
    platform: str,
    suffix: str,
    factory: Callable[[str], Entity],
) -> None:
    """Create one entity per display and follow display additions/removals."""
    manager: StudioManager = hass.data[DOMAIN]["manager"]
    known: set[str] = set()

    @callback
    def _sync() -> None:
        current = set(manager.store.displays)
        new = sorted(current - known)
        if new:
            known.update(new)
            async_add_entities([factory(did) for did in new])
        ent_reg = er.async_get(hass)
        for did in sorted(known - current):
            known.discard(did)
            if entity_id := ent_reg.async_get_entity_id(platform, DOMAIN, f"{did}_{suffix}"):
                ent_reg.async_remove(entity_id)

    _sync()
    entry.async_on_unload(async_dispatcher_connect(hass, SIGNAL_DISPLAYS_CHANGED, _sync))

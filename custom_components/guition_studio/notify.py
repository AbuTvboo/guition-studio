"""Notify entity per display: usable as target of notify.send_message in automations."""

from __future__ import annotations

from homeassistant.components.notify import NotifyEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN
from .entity import StudioEntity, setup_display_platform


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback) -> None:
    manager = hass.data[DOMAIN]["manager"]
    setup_display_platform(hass, entry, async_add_entities, "notify", "notify", lambda did: DisplayNotify(hass, manager, did))


class DisplayNotify(StudioEntity, NotifyEntity):
    _attr_name = "Display-Benachrichtigung"

    def __init__(self, hass: HomeAssistant, manager, display_id: str) -> None:
        super().__init__(hass, manager, display_id, "notify")

    async def async_send_message(self, message: str, title: str | None = None) -> None:
        await self.manager.async_notify(self.display_id, title or "Home Assistant", message, 10)

"""Persistent storage for displays, layouts, user templates and favourites."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DEFAULT_HARDWARE, DOMAIN
from .layout import default_layout, new_id

STORAGE_VERSION = 1
STORAGE_KEY = f"{DOMAIN}.data"


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


class StudioStore:
    """Thin wrapper around HA's JSON storage (``.storage/guition_studio.data``)."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, STORAGE_KEY, atomic_writes=True)
        self.data: dict[str, Any] = {"displays": {}, "templates": {}, "favorites": []}

    async def async_load(self) -> None:
        loaded = await self._store.async_load()
        if isinstance(loaded, dict):
            self.data = {
                "displays": loaded.get("displays", {}),
                "templates": loaded.get("templates", {}),
                "favorites": loaded.get("favorites", []),
            }

    def schedule_save(self) -> None:
        self._store.async_delay_save(lambda: self.data, 1.0)

    async def async_save(self) -> None:
        await self._store.async_save(self.data)

    # ------------------------------------------------------------------ displays

    @property
    def displays(self) -> dict[str, dict[str, Any]]:
        return self.data["displays"]

    def get_display(self, display_id: str) -> dict[str, Any] | None:
        return self.displays.get(display_id)

    def create_display(
        self, name: str, node: str | None, device_id: str | None, hardware: str = DEFAULT_HARDWARE
    ) -> dict[str, Any]:
        display_id = new_id("d")
        display = {
            "id": display_id,
            "name": name,
            "node": node,
            "device_id": device_id,
            "hardware": hardware,
            "created_at": _now(),
            "layout": default_layout(),
            "draft_saved_at": _now(),
            "applied": None,
        }
        self.displays[display_id] = display
        self.schedule_save()
        return display

    def update_display(self, display_id: str, **changes: Any) -> dict[str, Any]:
        display = self.displays[display_id]
        display.update({k: v for k, v in changes.items() if v is not None or k in ("node", "device_id")})
        self.schedule_save()
        return display

    def delete_display(self, display_id: str) -> None:
        self.displays.pop(display_id, None)
        self.schedule_save()

    def save_draft(self, display_id: str, layout: dict[str, Any]) -> dict[str, Any]:
        display = self.displays[display_id]
        display["layout"] = layout
        display["draft_saved_at"] = _now()
        self.schedule_save()
        return display

    def set_applied(self, display_id: str, layout: dict[str, Any], crc: int, size: int) -> None:
        display = self.displays[display_id]
        display["applied"] = {
            "layout": layout,
            "revision": layout.get("revision", 0),
            "crc": crc,
            "size": size,
            "at": _now(),
        }
        self.schedule_save()

    # ------------------------------------------------------------------ templates

    def save_template(self, name: str, description: str, layout: dict[str, Any]) -> dict[str, Any]:
        tid = new_id("tpl")
        tpl = {"id": tid, "name": name, "description": description, "layout": layout, "created_at": _now()}
        self.data["templates"][tid] = tpl
        self.schedule_save()
        return tpl

    def delete_template(self, template_id: str) -> None:
        self.data["templates"].pop(template_id, None)
        self.schedule_save()

    def set_favorites(self, favorites: list[str]) -> None:
        self.data["favorites"] = sorted(set(favorites))[:500]
        self.schedule_save()

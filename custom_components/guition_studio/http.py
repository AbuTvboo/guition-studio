"""HTTP view serving verified firmware images and the ESP Web Tools manifest."""

from __future__ import annotations

from aiohttp import web

from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant

from .const import DOMAIN, FIRMWARE_URL
from .firmware import VERSION_RE


class FirmwareView(HomeAssistantView):
    """Public, read-only: binaries contain no secrets (see firmware.py)."""

    url = FIRMWARE_URL + "/{version}/{filename}"
    name = "api:guition_studio:firmware"
    requires_auth = False

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass

    async def get(self, request: web.Request, version: str, filename: str) -> web.StreamResponse:
        data = self.hass.data.get(DOMAIN)
        if data is None or not VERSION_RE.match(version):
            return web.Response(status=404)
        firmware = data["firmware"]
        if filename == "manifest.json":
            if firmware.path_for(version, "firmware.factory.bin") is None:
                return web.Response(status=404)
            return web.json_response(firmware.manifest(version), headers={"Cache-Control": "no-store"})
        path = firmware.path_for(version, filename)
        if path is None:
            return web.Response(status=404)
        return web.FileResponse(path, headers={"Content-Type": "application/octet-stream", "Cache-Control": "no-store"})

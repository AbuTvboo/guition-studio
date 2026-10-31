"""HTTP view serving verified firmware images and the ESP Web Tools manifest."""

from __future__ import annotations

from pathlib import Path
import secrets

from aiohttp import web

from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant

from .const import DOMAIN, FIRMWARE_URL
from .firmware import VERSION_RE
from .slideshow import DEFAULT_FOLDER, resolve_folder


def media_root(hass: HomeAssistant) -> Path:
    return Path(hass.config.media_dirs.get("local") or hass.config.path("media"))


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


class SlideView(HomeAssistantView):
    """Next screensaver picture for a display as 480x480 JPEG.

    The display's HTTP client cannot send HA tokens, so access is protected by a
    random per-display token (compared in constant time) that only reaches the
    device through the encrypted ESPHome API. Only pictures from the configured
    media folder are served.
    """

    url = "/api/guition_studio/slide/{display_id}/{token}/{name}"
    name = "api:guition_studio:slide"
    requires_auth = False

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass

    async def get(self, request: web.Request, display_id: str, token: str, name: str) -> web.StreamResponse:
        data = self.hass.data.get(DOMAIN)
        display = data["store"].get_display(display_id) if data else None
        expected = (display or {}).get("slide_token")
        if not display or not expected or not secrets.compare_digest(token, expected) or name != "next.jpg":
            return web.Response(status=404)
        applied = display.get("applied") or {}
        ss = ((applied.get("layout") or {}).get("settings") or {}).get("screensaver") or {}
        if not ss.get("enabled") or ss.get("mode") != "slideshow":
            return web.Response(status=404)
        folder = resolve_folder(media_root(self.hass), ss.get("folder", DEFAULT_FOLDER))
        if folder is None:
            return web.Response(status=404)
        picture = await self.hass.async_add_executor_job(
            data["slideshow"].next_picture, display_id, folder, ss.get("order", "random"), ss.get("fit", "cover")
        )
        if picture is None:
            return web.Response(status=404)
        return web.Response(body=picture, content_type="image/jpeg", headers={"Cache-Control": "no-store"})

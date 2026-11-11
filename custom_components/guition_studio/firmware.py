"""Firmware management: release download with SHA-256 verification, local
firmware directory, ESP Web Tools manifest and OTA via the encrypted API.

Directory layout (inside the HA config directory)::

    guition_studio/firmware/<version>/firmware.factory.bin   (USB / ESP Web Tools)
    guition_studio/firmware/<version>/firmware.ota.bin       (OTA)
    guition_studio/firmware/<version>/SHA256SUMS             (optional for local builds)

Binaries contain no secrets, so they are served without authentication
(ESP Web Tools and the device's HTTP OTA client cannot send HA tokens).
"""

from __future__ import annotations

import hashlib
import logging
from pathlib import Path
import re
import shutil
from typing import Any

import aiohttp

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.network import NoURLAvailableError, get_url

from .const import ACTION_OTA, FIRMWARE_URL, HARDWARE_PROFILES, DEFAULT_HARDWARE

_LOGGER = logging.getLogger(__name__)

VERSION_RE = re.compile(r"^[0-9A-Za-z._-]{1,32}$")
FACTORY = "firmware.factory.bin"
OTA = "firmware.ota.bin"
SUMS = "SHA256SUMS"
SERVABLE = {FACTORY, OTA}
MAX_BIN = 8 * 1024 * 1024


def _version_key(v: str) -> tuple:
    parts = re.split(r"[.\-]", v.lstrip("v"))
    return tuple((0, int(p)) if p.isdigit() else (1, p) for p in parts)


def _hash_file(path: Path, algo: str) -> str:
    h = hashlib.new(algo)
    with path.open("rb") as fh:
        for block in iter(lambda: fh.read(65536), b""):
            h.update(block)
    return h.hexdigest()


def _parse_sums(text: str) -> dict[str, str]:
    out = {}
    for line in text.splitlines():
        parts = line.strip().split()
        if len(parts) == 2 and re.fullmatch(r"[0-9a-fA-F]{64}", parts[0]):
            out[parts[1].lstrip("*").rsplit("/", 1)[-1]] = parts[0].lower()
    return out


class FirmwareManager:
    def __init__(self, hass: HomeAssistant, repo: str) -> None:
        self.hass = hass
        self.repo = repo
        self.base = Path(hass.config.path("guition_studio", "firmware"))
        self.latest: dict[str, Any] | None = None
        self.last_error: str | None = None
        self.local_cache: list[dict[str, Any]] = []

    def best_version(self) -> str | None:
        """Newest version that can be installed via OTA (local verified build or complete release)."""
        candidates = [v["version"] for v in self.local_cache if v["ota"] and v["verified"] is not False]
        if self.latest and self.latest.get("complete") and self.latest.get("version"):
            candidates.append(self.latest["version"])
        return max(candidates, key=_version_key) if candidates else None

    def path_for(self, version: str, filename: str) -> Path | None:
        if not VERSION_RE.match(version) or filename not in SERVABLE:
            return None
        path = self.base / version / filename
        return path if path.is_file() else None

    # ------------------------------------------------------------------ local

    def _scan(self) -> list[dict[str, Any]]:
        if not self.base.is_dir():
            return []
        out = []
        for d in self.base.iterdir():
            if not d.is_dir() or not VERSION_RE.match(d.name):
                continue
            factory, ota = d / FACTORY, d / OTA
            if not factory.is_file() and not ota.is_file():
                continue
            sums = _parse_sums((d / SUMS).read_text()) if (d / SUMS).is_file() else {}
            verified = None
            if sums:
                verified = all(
                    _hash_file(p, "sha256") == sums.get(p.name) for p in (factory, ota) if p.is_file()
                )
            out.append(
                {
                    "version": d.name,
                    "factory": factory.is_file(),
                    "ota": ota.is_file(),
                    "ota_size": ota.stat().st_size if ota.is_file() else None,
                    "verified": verified,
                    "source": "release" if (d / ".release").exists() else "local",
                }
            )
        out.sort(key=lambda v: _version_key(v["version"]), reverse=True)
        return out

    async def async_list_local(self) -> list[dict[str, Any]]:
        self.local_cache = await self.hass.async_add_executor_job(self._scan)
        return self.local_cache

    def manifest(self, version: str) -> dict[str, Any]:
        profile = HARDWARE_PROFILES[DEFAULT_HARDWARE]
        return {
            "name": "Guition Studio",
            "version": version,
            "home_assistant_domain": "esphome",
            "new_install_prompt_erase": True,
            "builds": [{"chipFamily": profile["chip_family"], "parts": [{"path": FACTORY, "offset": 0}]}],
        }

    async def async_delete(self, versions: list[str]) -> list[str]:
        """Remove downloaded firmware versions (their folders below self.base); returns the removed ones."""
        names = [v for v in dict.fromkeys(versions) if VERSION_RE.match(v) and v not in (".", "..")]
        if len(names) != len(versions):
            raise HomeAssistantError("Ungültige Versionsnummer.")

        def _remove() -> list[str]:
            base = self.base.resolve()
            removed = []
            for v in names:
                target = (self.base / v).resolve()
                if target.parent != base or not target.is_dir():
                    continue
                shutil.rmtree(target)
                removed.append(v)
            return removed

        removed = await self.hass.async_add_executor_job(_remove)
        await self.async_list_local()
        if removed:
            _LOGGER.info("Guition Studio firmware removed: %s", ", ".join(removed))
        return removed

    # ------------------------------------------------------------------ releases

    async def async_check_latest(self) -> dict[str, Any] | None:
        session = async_get_clientsession(self.hass)
        url = f"https://api.github.com/repos/{self.repo}/releases/latest"
        try:
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=20), headers={"Accept": "application/vnd.github+json"}) as resp:
                if resp.status == 404:
                    self.last_error = f"Keine Veröffentlichung im Repository {self.repo} gefunden."
                    return None
                resp.raise_for_status()
                data = await resp.json()
        except (aiohttp.ClientError, TimeoutError) as err:
            self.last_error = f"GitHub nicht erreichbar: {err}"
            return None
        assets = {a["name"]: a["browser_download_url"] for a in data.get("assets", [])}
        version = str(data.get("tag_name", "")).lstrip("v")
        self.latest = {
            "version": version,
            "name": data.get("name"),
            "notes": (data.get("body") or "")[:4000],
            "published": data.get("published_at"),
            "url": data.get("html_url"),
            "complete": all(n in assets for n in (FACTORY, OTA, SUMS)),
            "assets": assets,
        }
        self.last_error = None
        return self.latest

    async def async_download(self, version: str) -> dict[str, Any]:
        if not VERSION_RE.match(version):
            raise HomeAssistantError("Ungültige Versionsnummer.")
        if not self.latest or self.latest["version"] != version:
            await self.async_check_latest()
        if not self.latest or self.latest["version"] != version or not self.latest["complete"]:
            raise HomeAssistantError(
                "Release unvollständig: firmware.factory.bin, firmware.ota.bin und SHA256SUMS werden benötigt."
            )
        session = async_get_clientsession(self.hass)
        assets = self.latest["assets"]
        blobs: dict[str, bytes] = {}
        for name in (SUMS, FACTORY, OTA):
            async with session.get(assets[name], timeout=aiohttp.ClientTimeout(total=180)) as resp:
                resp.raise_for_status()
                data = await resp.read()
                if len(data) > MAX_BIN:
                    raise HomeAssistantError(f"{name} ist unerwartet groß.")
                blobs[name] = data
        sums = _parse_sums(blobs[SUMS].decode("utf-8", "replace"))
        for name in (FACTORY, OTA):
            digest = hashlib.sha256(blobs[name]).hexdigest()
            if sums.get(name) != digest:
                raise HomeAssistantError(f"Prüfsumme von {name} stimmt nicht – Download verworfen.")

        def _write() -> None:
            target = self.base / version
            tmp = self.base / f".{version}.tmp"
            shutil.rmtree(tmp, ignore_errors=True)
            tmp.mkdir(parents=True)
            for name, data in blobs.items():
                (tmp / name).write_bytes(data)
            (tmp / ".release").write_text(self.repo)
            shutil.rmtree(target, ignore_errors=True)
            tmp.rename(target)

        await self.hass.async_add_executor_job(_write)
        await self.async_list_local()
        _LOGGER.info("Guition Studio firmware %s downloaded and verified", version)
        return {"version": version, "verified": True}

    # ------------------------------------------------------------------ OTA

    async def async_start_ota(self, manager: Any, display: dict[str, Any], version: str) -> dict[str, Any]:
        path = self.path_for(version, OTA)
        if path is None:
            raise HomeAssistantError("Firmware-Version ist lokal nicht vorhanden. Bitte zuerst herunterladen.")
        try:
            base_url = get_url(self.hass, allow_external=False, allow_cloud=False, prefer_external=False)
        except NoURLAvailableError as err:
            raise HomeAssistantError(
                "Keine interne Home-Assistant-URL konfiguriert (Einstellungen → System → Netzwerk)."
            ) from err
        md5 = await self.hass.async_add_executor_job(_hash_file, path, "md5")
        url = f"{base_url}{FIRMWARE_URL}/{version}/{OTA}"
        await manager._call(display, ACTION_OTA, {"url": url, "checksum": md5})  # noqa: SLF001
        rt = manager.rt(display["id"])
        rt["ota"] = {"state": "start", "progress": 0, "version": version}
        manager.add_log("info", f"OTA-Update auf {version} gestartet ({url})", display["id"])
        return {"url": url, "md5": md5}

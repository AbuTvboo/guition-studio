"""Screensaver slideshow: pick pictures from a Home Assistant media folder and
render them as 480x480 baseline JPEGs for the display.

Pictures are streamed one at a time (the display keeps at most two decoded
frames in PSRAM). Nothing is written to the display's flash.
"""

from __future__ import annotations

from collections import OrderedDict
import io
from pathlib import Path
import random
import re
import time
from typing import Any

from .const import SCREEN_H, SCREEN_W

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".gif"}
FOLDER_RE = re.compile(r"^[\w\-. /]{0,120}$")
MAX_SOURCE_BYTES = 40 * 1024 * 1024
DEFAULT_FOLDER = "guition_studio"


def resolve_folder(media_root: Path, folder: str) -> Path | None:
    """Resolve a user-chosen folder inside the media root (no path traversal)."""
    if not FOLDER_RE.match(folder or "") or ".." in Path(folder).parts:
        return None
    root = media_root.resolve()
    target = (root / folder).resolve()
    try:
        target.relative_to(root)
    except ValueError:
        return None
    return target


def list_images(folder: Path) -> list[Path]:
    if not folder.is_dir():
        return []
    files = [p for p in folder.rglob("*") if p.is_file() and p.suffix.lower() in IMAGE_EXTENSIONS and not p.name.startswith(".")]
    return sorted(files, key=lambda p: str(p).lower())


def list_folders(media_root: Path, limit: int = 200) -> list[dict[str, Any]]:
    """Folders below the media root with their picture count (for the editor)."""
    root = media_root.resolve()
    if not root.is_dir():
        return []
    out = []
    for d in sorted([root, *[p for p in root.rglob("*") if p.is_dir()]], key=lambda p: str(p).lower())[:limit]:
        rel = "" if d == root else d.relative_to(root).as_posix()
        if any(part.startswith(".") for part in Path(rel).parts):
            continue
        count = sum(1 for p in d.iterdir() if p.is_file() and p.suffix.lower() in IMAGE_EXTENSIONS)
        out.append({"folder": rel, "count": count})
    return out


def render_picture(path: Path, fit: str = "cover", quality: int = 82) -> bytes:
    """Load any supported picture and return a 480x480 baseline JPEG (decodable by JPEGDEC)."""
    from PIL import Image, ImageOps  # noqa: PLC0415 - Pillow is a Home Assistant core dependency

    if path.stat().st_size > MAX_SOURCE_BYTES:
        raise ValueError("picture too large")
    with Image.open(path) as img:
        img.draft("RGB", (SCREEN_W * 2, SCREEN_H * 2))  # fast JPEG downscale while decoding
        img = ImageOps.exif_transpose(img)
        if img.mode not in ("RGB", "L"):
            background = Image.new("RGB", img.size, (0, 0, 0))
            img = img.convert("RGBA")
            background.paste(img, mask=img.split()[-1])
            img = background
        img = img.convert("RGB")
        size = (SCREEN_W, SCREEN_H)
        if fit == "contain":
            img = ImageOps.pad(img, size, method=Image.Resampling.LANCZOS, color=(0, 0, 0))
        else:
            img = ImageOps.fit(img, size, method=Image.Resampling.LANCZOS)
        buf = io.BytesIO()
        img.save(buf, "JPEG", quality=quality, progressive=False, optimize=False, subsampling="4:2:0")
        return buf.getvalue()


class SlideshowSource:
    """Per-display picture order plus a small cache of rendered JPEGs."""

    def __init__(self, cache_size: int = 24) -> None:
        self._order: dict[str, list[Path]] = {}
        self._pos: dict[str, int] = {}
        self._listing: dict[str, tuple[float, list[Path]]] = {}
        self._cache: OrderedDict[tuple[str, float, str], bytes] = OrderedDict()
        self._cache_size = cache_size

    def _images(self, folder: Path) -> list[Path]:
        key = str(folder)
        cached = self._listing.get(key)
        if cached and time.monotonic() - cached[0] < 60:
            return cached[1]
        files = list_images(folder)
        self._listing[key] = (time.monotonic(), files)
        return files

    def next_picture(self, display_id: str, folder: Path, order: str, fit: str) -> bytes | None:
        """Return the next rendered picture for a display, or None if the folder is empty."""
        files = self._images(folder)
        if not files:
            return None
        order_key = f"{display_id}:{folder}:{order}"
        seq = self._order.get(order_key)
        if seq is None or set(seq) != set(files):
            seq = list(files)
            if order == "random":
                random.shuffle(seq)
            self._order[order_key] = seq
            self._pos[order_key] = 0
        for _ in range(min(len(seq), 5)):  # skip broken files
            index = self._pos[order_key] % len(seq)
            path = seq[index]
            self._pos[order_key] = index + 1
            if self._pos[order_key] >= len(seq) and order == "random":
                random.shuffle(seq)  # new round in a new order (after taking the current picture)
                self._pos[order_key] = 0
            try:
                return self._render_cached(path, fit)
            except (OSError, ValueError):
                continue
        return None

    def _render_cached(self, path: Path, fit: str) -> bytes:
        key = (str(path), path.stat().st_mtime, fit)
        if key in self._cache:
            self._cache.move_to_end(key)
            return self._cache[key]
        data = render_picture(path, fit)
        self._cache[key] = data
        while len(self._cache) > self._cache_size:
            self._cache.popitem(last=False)
        return data

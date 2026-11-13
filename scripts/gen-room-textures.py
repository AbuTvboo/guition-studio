"""Prepare the room textures for the editor and the RGB565 display (Pillow + numpy required).

The pictures are dark, smooth night scenes. Truncated to RGB565 their dark areas keep only
5-10 steps per channel (R/B 5 bit and G 6 bit step at different places, which can show as
coloured contours on the panel). Therefore the pictures are lifted a little (gamma) and
converted with an ordered (Bayer) dither: the steps become a fine, regular pattern instead of
bands. (Scaling these pictures on the device needs LV_DRAW_SW_SUPPORT_RGB565A8, see the
alpha probe image in firmware/guition-studio.yaml.) The editor gets exactly the dithered pixels, so the preview matches the display.
"""

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
KEYS = ("living", "kitchen", "bedroom", "bathroom", "office", "hall", "evening", "lounge")
SIZE = 232
GAMMA = 0.8  # < 1 lifts the dark areas (more RGB565 steps there), highlights stay
BAYER = np.array(
    [[0, 32, 8, 40, 2, 34, 10, 42], [48, 16, 56, 24, 50, 18, 58, 26], [12, 44, 4, 36, 14, 46, 6, 38], [60, 28, 52, 20, 62, 30, 54, 22],
     [3, 35, 11, 43, 1, 33, 9, 41], [51, 19, 59, 27, 49, 17, 57, 25], [15, 47, 7, 39, 13, 45, 5, 37], [63, 31, 55, 23, 61, 29, 53, 21]],
    dtype=np.float64,
)  # fmt: skip
THRESHOLD = (BAYER + 0.5) / 64.0  # 0..1


def to_rgb565(image: Image.Image) -> tuple[np.ndarray, np.ndarray]:
    """Return (packed RGB565 little endian bytes, the 8-bit RGB the panel will show)."""
    a = np.asarray(image, dtype=np.float64) / 255.0
    a = np.power(a, GAMMA) * 255.0
    h, w, _ = a.shape
    t = np.tile(THRESHOLD, (h // 8 + 1, w // 8 + 1))[:h, :w]
    r = np.clip(np.floor(a[..., 0] / 255.0 * 31 + t), 0, 31).astype(np.uint16)
    g = np.clip(np.floor(a[..., 1] / 255.0 * 63 + t), 0, 63).astype(np.uint16)
    b = np.clip(np.floor(a[..., 2] / 255.0 * 31 + t), 0, 31).astype(np.uint16)
    packed = ((r << 11) | (g << 5) | b).astype("<u2")
    shown = np.stack([(r << 3) | (r >> 2), (g << 2) | (g >> 4), (b << 3) | (b >> 2)], -1).astype(np.uint8)
    return packed, shown


def main() -> None:
    out = ["/* Room textures (232x232 RGB565, little endian, gamma + ordered dither). Rebuild with scripts/gen-room-textures.py. */", "#include <stdint.h>"]
    public = ROOT / "frontend/public/room-textures"
    public.mkdir(parents=True, exist_ok=True)
    for index, key in enumerate(KEYS):
        atlas = Image.open(ROOT / "firmware/images" / ("room-atlas.png" if index < 4 else "room-atlas-extra.png")).convert("RGB")
        width, height = atlas.size
        x, y = index % 2, (index % 4) // 2
        image = atlas.crop((x * width // 2, y * height // 2, (x + 1) * width // 2, (y + 1) * height // 2))
        image = image.resize((SIZE, SIZE), Image.Resampling.LANCZOS)
        packed, shown = to_rgb565(image)
        Image.fromarray(shown).save(public / f"{key}.png", optimize=True)
        data = packed.tobytes()
        out.append(f"const uint8_t GS_ROOM_{index}[{len(data)}] = {{")
        out.extend("  " + ",".join(str(v) for v in data[i : i + 32]) + "," for i in range(0, len(data), 32))
        out.append("};")
    out.append("const uint8_t *const GS_ROOM_DATA[] = {" + ",".join(f"GS_ROOM_{i}" for i in range(len(KEYS))) + "};")
    (ROOT / "firmware/components/guition_studio/gs_room_textures.c").write_bytes(("\n".join(out) + "\n").encode("utf-8"))


if __name__ == "__main__":
    main()

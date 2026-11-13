"""Prepare the room atlas for the editor and the RGB565 display (Pillow required)."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
KEYS = ("living", "kitchen", "bedroom", "bathroom", "office", "hall", "evening", "lounge")
SIZE = 232
out = ['/* Room textures. Rebuild with scripts/gen-room-textures.py. */', '#include <stdint.h>']
public = ROOT / "frontend/public/room-textures"
public.mkdir(parents=True, exist_ok=True)
for index, key in enumerate(KEYS):
    atlas = Image.open(ROOT / "firmware/images" / ("room-atlas.png" if index < 4 else "room-atlas-extra.png")).convert("RGB")
    width, height = atlas.size
    x, y = index % 2, (index % 4) // 2
    image = atlas.crop((x * width // 2, y * height // 2, (x + 1) * width // 2, (y + 1) * height // 2))
    image = image.resize((SIZE, SIZE), Image.Resampling.LANCZOS)
    image.save(public / f"{key}.png")
    data = bytearray()
    for r, g, b in image.getdata():
        pixel = ((r >> 3) << 11) | ((g >> 2) << 5) | (b >> 3)
        data.extend((pixel & 255, pixel >> 8))
    out.append(f'const uint8_t GS_ROOM_{index}[{len(data)}] = {{')
    out.extend('  ' + ','.join(str(v) for v in data[i:i+32]) + ',' for i in range(0, len(data), 32))
    out.append('};')
out.append('const uint8_t *const GS_ROOM_DATA[] = {' + ','.join(f'GS_ROOM_{i}' for i in range(len(KEYS))) + '};')
(ROOT / 'firmware/components/guition_studio/gs_room_textures.c').write_text('\n'.join(out) + '\n', encoding='utf-8')

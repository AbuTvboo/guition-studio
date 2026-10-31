#!/usr/bin/env python3
"""Package an ESPHome build of firmware/guition-studio.yaml for Guition Studio.

Creates ``dist/firmware/<version>/`` with firmware.factory.bin, firmware.ota.bin
and SHA256SUMS. The same layout is used for GitHub release assets and for the
offline path in Home Assistant (``/config/guition_studio/firmware/<version>/``).

Usage:  python scripts/package_firmware.py [--version 0.1.0]
"""

from __future__ import annotations

import argparse
import hashlib
from pathlib import Path
import re
import shutil
import sys

ROOT = Path(__file__).resolve().parents[1]
YAML = ROOT / "firmware" / "guition-studio.yaml"
FILES = ("firmware.factory.bin", "firmware.ota.bin")


def yaml_version() -> str:
    match = re.search(r'fw_version:\s*"?([0-9A-Za-z._-]+)"?', YAML.read_text(encoding="utf-8"))
    if not match:
        sys.exit("fw_version not found in firmware/guition-studio.yaml")
    return match.group(1)


def find_build() -> Path:
    candidates = [p.parent for p in (ROOT / "firmware" / ".esphome" / "build").rglob("firmware.factory.bin")]
    if not candidates:
        sys.exit("No build found. Run: esphome compile firmware/guition-studio.yaml")
    return max(candidates, key=lambda p: (p / "firmware.factory.bin").stat().st_mtime)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--version", default=None)
    parser.add_argument("--out", default=str(ROOT / "dist" / "firmware"))
    args = parser.parse_args()
    version = args.version or yaml_version()
    build = find_build()
    target = Path(args.out) / version
    target.mkdir(parents=True, exist_ok=True)
    lines = []
    for name in FILES:
        src = build / name
        if not src.is_file():
            sys.exit(f"Missing {src}")
        shutil.copy2(src, target / name)
        digest = hashlib.sha256(src.read_bytes()).hexdigest()
        lines.append(f"{digest}  {name}")
        print(f"{name}: {src.stat().st_size} bytes  sha256={digest}")
    (target / "SHA256SUMS").write_text("\n".join(lines) + "\n", encoding="ascii")
    print(f"Packaged firmware {version} -> {target}")


if __name__ == "__main__":
    main()

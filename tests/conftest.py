"""Load the HA-independent modules of the integration without importing Home Assistant."""

from pathlib import Path
import sys
import types

PKG_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "guition_studio"

if "gs_pure" not in sys.modules:
    pkg = types.ModuleType("gs_pure")
    pkg.__path__ = [str(PKG_DIR)]  # type: ignore[attr-defined]
    sys.modules["gs_pure"] = pkg

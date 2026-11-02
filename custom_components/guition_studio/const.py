"""Constants for Guition Studio.

This module must stay free of Home Assistant imports (used by pure unit tests).
Geometry and limits must match firmware/components/guition_studio/guition_studio.h
and frontend/src/geometry.ts.
"""

from __future__ import annotations

DOMAIN = "guition_studio"
VERSION = "0.5.15"
PROTOCOL_VERSION = 5
LAYOUT_SCHEMA = 1

PANEL_URL = "guition-studio"
PANEL_COMPONENT = "guition-studio-panel"
STATIC_URL = "/guition_studio_static"
FIRMWARE_URL = "/api/guition_studio/firmware"

EVENT_DEVICE = "esphome.guition_studio"
EVENT_UPDATED = "guition_studio_updated"

# ESPHome action names (prefixed by the ESPHome node name, '-' replaced by '_')
ACTION_LAYOUT_BEGIN = "gs_layout_begin"
ACTION_LAYOUT_CHUNK = "gs_layout_chunk"
ACTION_LAYOUT_COMMIT = "gs_layout_commit"
ACTION_STATES = "gs_states"
ACTION_PAGE = "gs_page"
ACTION_NOTIFY = "gs_notify"
ACTION_ROLLBACK = "gs_rollback"
ACTION_HELLO = "gs_hello"
ACTION_OTA = "gs_ota"
ACTION_MODE = "gs_mode"
ACTION_FOOTBALL = "gs_football"
ACTION_LOGO = "gs_logo"

SIGNAL_DISPLAYS_CHANGED = "guition_studio_displays_changed"

# Hardware profiles. Only one in v1, but the structure allows more boards.
HARDWARE_PROFILES: dict[str, dict] = {
    "guition-4848s040": {
        "id": "guition-4848s040",
        "name": "Guition ESP32-S3-4848S040",
        "description": '4" IPS, 480×480, ST7701S (RGB), GT911 Touch, 16 MB Flash, 8 MB PSRAM',
        "width": 480,
        "height": 480,
        "chip_family": "ESP32-S3",
        "esphome_model": "GUITION-4848S040",
        "max_layout_bytes": 32768,
    }
}
DEFAULT_HARDWARE = "guition-4848s040"

# Geometry (pixels)
SCREEN_W = 480
SCREEN_H = 480
HEADER_H = 44
DOTS_H = 22
MARGIN = 8
GAP = 8

# Limits
MAX_PAGES = 10
MAX_GRID = 6
MAX_TILES_TOTAL = 160
MAX_LAYOUT_BYTES = 32768
MAX_TITLE_LEN = 64
CHUNK_SIZE = 1024
MAX_STATE_PAYLOAD = 1500
TRANSFER_TIMEOUT = 20.0
TRANSFER_RETRIES = 3

TILE_TYPES = [
    "light", "dimmer", "rgb", "switch", "sensor", "graph", "clock", "nav", "text", "action", "status", "settings",
    "cover", "thermostat", "media", "weather", "swipe",
]  # fmt: skip
# Swipe tile: several entities in one tile, a horizontal swipe on the tile shows the next one.
MAX_SWIPE_ITEMS = 4
# Recognised by the editor but intentionally not rendered by the firmware
# (camera streams are not sensible over the ESPHome API on a 4" ESP32 panel).
PLANNED_TILE_TYPES = ["camera"]
MAX_RULES = 20
MAX_SCREENSAVER_ENTITIES = 2
# Tile types that need an entity of one of these domains (None = any domain).
TILE_ENTITY_DOMAINS: dict[str, set[str] | None] = {
    "light": None,
    "switch": None,
    "sensor": None,
    "dimmer": {"light"},
    "rgb": {"light"},
    "graph": {"sensor", "number", "input_number"},
    "cover": {"cover"},
    "thermostat": {"climate", "water_heater"},
    "media": {"media_player"},
    "weather": {"weather"},
}

ACTIONS = [
    "none",
    "default",
    "toggle",
    "turn_on",
    "turn_off",
    "call_service",
    "navigate",
    "home",
    "back",
    "next",
    "prev",
]

# Device action codes (see TileAction in guition_studio.h)
DEV_ACTION_NONE = 0
DEV_ACTION_REMOTE = 1
DEV_ACTION_NAVIGATE = 2
DEV_ACTION_HOME = 3
DEV_ACTION_BACK = 4
DEV_ACTION_NEXT = 5
DEV_ACTION_PREV = 6
DEV_ACTION_SETTINGS = 7  # local: open the on-device settings menu
DEV_ACTION_COLOR = 8  # local: open the colour picker (RGB tiles)

# Material Design Icons available on the device (generated from scripts/icons.json)
from .icons import ICONS, LEGACY_ICONS  # noqa: E402, F401

FONT_SIZES = {"s": 0, "m": 1, "l": 2, "xl": 3, "xxl": 4}

DEFAULT_FIRMWARE_REPO = "AbuTvboo/guition-studio"
CONF_FIRMWARE_REPO = "firmware_repo"

"""Layout model: validation, normalisation and compilation to the device format.

Pure module (no Home Assistant imports) so it can be unit tested in isolation.

Editor/storage format (schema 1) is documented in docs/PROTOCOL.md. The device
format is a compact JSON document that contains only rendering information;
Home Assistant actions are resolved server-side, so layout data can never make
the device execute arbitrary code or service calls.
"""

from __future__ import annotations

import copy
import json
import re
import secrets
import zlib
from typing import Any

from .const import (
    ACTIONS,
    DEV_ACTION_BACK,
    DEV_ACTION_COLOR,
    DEV_ACTION_HOME,
    DEV_ACTION_NAVIGATE,
    DEV_ACTION_NEXT,
    DEV_ACTION_NONE,
    DEV_ACTION_PREV,
    DEV_ACTION_REMOTE,
    DEV_ACTION_SETTINGS,
    FONT_SIZES,
    ICONS,
    LAYOUT_SCHEMA,
    LEGACY_ICONS,
    MAX_SWIPE_ITEMS,
    MAX_GRID,
    MAX_LAYOUT_BYTES,
    MAX_PAGES,
    MAX_TILES_TOTAL,
    MAX_RULES,
    MAX_SCREENSAVER_ENTITIES,
    MAX_TITLE_LEN,
    PROTOCOL_VERSION,
    TILE_ENTITY_DOMAINS,
    TILE_TYPES,
)
from .themes import THEMES, get_theme

ID_RE = re.compile(r"^[A-Za-z0-9_-]{1,24}$")
TIME_RE = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")
FOLDER_RE = re.compile(r"^[\w\-. /]{0,120}$")
ENTITY_RE = re.compile(r"^[a-z0-9_]+\.[a-z0-9_]+$")
SERVICE_RE = re.compile(r"^[a-z0-9_]+\.[a-z0-9_]+$")
COLOR_RE = re.compile(r"^#[0-9A-Fa-f]{6}$")

# Domains whose default tap action is a toggle
TOGGLE_DOMAINS = {
    "light", "switch", "fan", "input_boolean", "cover", "media_player", "automation",
    "siren", "humidifier", "climate", "valve", "lock",
}  # fmt: skip
TURN_ON_DOMAINS = {"scene", "script"}
PRESS_DOMAINS = {"button", "input_button"}


class LayoutValidationError(ValueError):
    """Raised when a layout is invalid. ``errors`` contains German messages."""

    def __init__(self, errors: list[str]) -> None:
        super().__init__("; ".join(errors))
        self.errors = errors


def new_id(prefix: str) -> str:
    """Return a short random id such as ``t_3f9a1c2b``."""
    return f"{prefix}_{secrets.token_hex(4)}"


def default_settings() -> dict[str, Any]:
    return {
        "theme": "modern_dark",
        "brightness": 80,
        "standby_brightness": 10,
        "timeout": 60,
        "home_after": 0,
        "home_page": None,
        "show_header": True,
        "show_dots": True,
        "swipe": True,
        "language": "de",
        "rotation": 0,
        "touch_mode": 0,
        "night": default_night(),
        "screensaver": default_screensaver(),
        "rules": [],
    }


def default_night() -> dict[str, Any]:
    return {"enabled": False, "mode": "time", "start": "22:00", "end": "06:30", "brightness": 15, "dim": 30, "page": None}


def default_screensaver() -> dict[str, Any]:
    return {
        "enabled": False, "after": 120, "entities": [],
        # slideshow: pictures streamed from a Home Assistant media folder
        "mode": "clock", "folder": "guition_studio", "interval": 15, "order": "random", "fit": "cover", "show_clock": True,
        # prayer: timestamp sensors of the Islamic Prayer Times integration, key -> entity id
        "prayer": {}, "prayer_lang": "de", "prayer_bg": True,
    }  # fmt: skip


# Islamic prayer times screensaver: order and German labels as shown on the display.
# "sunrise" is shown for orientation but is not a prayer (never highlighted as "next").
PRAYER_KEYS: tuple[tuple[str, str], ...] = (
    ("fajr", "Fajr"),
    ("sunrise", "Sonnenaufgang"),
    ("dhuhr", "Dhuhr"),
    ("asr", "Asr"),
    ("maghrib", "Maghrib"),
    ("isha", "Isha"),
)
# Names shown on the display per language ("de" = common transliteration).
PRAYER_NAMES: dict[str, dict[str, str]] = {
    "de": dict(PRAYER_KEYS),
    "tr": {"fajr": "İmsak", "sunrise": "Güneş", "dhuhr": "Öğle", "asr": "İkindi", "maghrib": "Akşam", "isha": "Yatsı"},
}
# Texts of the "next prayer" line: prefix, separator before the countdown, hour unit, minute unit, "now" prefix
PRAYER_TEXTS: dict[str, list[str]] = {
    "de": ["Nächstes Gebet:", " in ", "h", "min", "Jetzt:"],
    "tr": ["Sonraki vakit:", " · ", "sa", "dk", "Şimdi:"],
}


def default_style() -> dict[str, Any]:
    return {
        "background": None,
        "color": None,
        "icon_color": None,
        "on_color": None,
        "on_text_color": None,
        "font_size": "m",
        "radius": 16,
        "border_width": 0,
        "border_color": None,
        "opacity": 100,
    }


def default_layout(name: str = "Start") -> dict[str, Any]:
    """Initial layout for a new display: a start page with clock and status."""
    page_id = new_id("p")
    return {
        "schema": LAYOUT_SCHEMA,
        "revision": 0,
        "settings": {**default_settings(), "home_page": page_id},
        "pages": [
            {
                "id": page_id,
                "name": name,
                "background": None,
                "cols": 3,
                "rows": 3,
                "tiles": [
                    make_tile("clock", 0, 0, w=2, h=1, title=""),
                    make_tile("status", 2, 0, title="Status"),
                ],
            }
        ],
    }


def make_tile(
    tile_type: str,
    x: int,
    y: int,
    w: int = 1,
    h: int = 1,
    entity: str | None = None,
    title: str = "",
    icon: str | None = None,
) -> dict[str, Any]:
    return {
        "id": new_id("t"),
        "type": tile_type,
        "x": x,
        "y": y,
        "w": w,
        "h": h,
        "entity": entity,
        "title": title,
        "icon": icon,
        "format": "time_date" if tile_type == "clock" else "",
        "style": default_style(),
        "show_title": True,
        "show_state": True,
        "show_icon": True,
        "tap_action": {"action": "default"},
        "hold_action": {"action": "none"},
        "visibility": [],
        "hours": 24,
        "weather": dict(WEATHER_OPTIONS),
        "items": [],
    }


def swipe_items(tile: dict[str, Any]) -> list[dict[str, Any]]:
    """Entities of a swipe tile (empty for every other tile type)."""
    return (tile.get("items") or []) if tile.get("type") == "swipe" else []


def swipe_item_tile(tile: dict[str, Any], index: Any) -> dict[str, Any] | None:
    """The tile as seen for one swipe item: same actions, entity/title of that item."""
    items = swipe_items(tile)
    if not isinstance(index, int) or isinstance(index, bool) or not 0 <= index < len(items):
        return None
    item = items[index]
    return {**tile, "entity": item["entity"], "title": item.get("title") or tile.get("title", "")}


# --------------------------------------------------------------------------- validation


def _bool(value: Any, default: bool) -> bool:
    return value if isinstance(value, bool) else default


def _int(value: Any, default: int, lo: int, hi: int) -> int:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        return default
    return max(lo, min(hi, int(value)))


def _color(value: Any) -> str | None:
    if isinstance(value, str) and COLOR_RE.match(value):
        return value.upper()
    return None


def _action(value: Any, errors: list[str], where: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        return {"action": "none"}
    action = value.get("action", "none")
    if action not in ACTIONS:
        errors.append(f"{where}: Unbekannte Aktion „{action}“.")
        return {"action": "none"}
    out: dict[str, Any] = {"action": action}
    if action == "navigate":
        page = value.get("page")
        if not isinstance(page, str) or not ID_RE.match(page):
            errors.append(f"{where}: Für „Navigation“ muss eine Zielseite gewählt werden.")
        out["page"] = page
    if action == "call_service":
        service = value.get("service")
        if not isinstance(service, str) or not SERVICE_RE.match(service):
            errors.append(f"{where}: Ungültiger Dienst „{service}“ (Format: domain.dienst).")
        data = value.get("data") or {}
        if not isinstance(data, dict):
            errors.append(f"{where}: Dienstdaten müssen ein JSON-Objekt sein.")
            data = {}
        if len(json.dumps(data)) > 2048:
            errors.append(f"{where}: Dienstdaten sind zu groß (max. 2 KB).")
        out["service"] = service
        out["data"] = data
    return out


def validate_layout(data: Any) -> dict[str, Any]:
    """Validate and normalise an editor layout. Raises LayoutValidationError."""
    errors: list[str] = []
    if not isinstance(data, dict):
        raise LayoutValidationError(["Das Layout muss ein JSON-Objekt sein."])
    if data.get("schema", LAYOUT_SCHEMA) != LAYOUT_SCHEMA:
        raise LayoutValidationError(
            [f"Nicht unterstützte Layout-Version {data.get('schema')} (erwartet {LAYOUT_SCHEMA})."]
        )

    raw_settings = data.get("settings") if isinstance(data.get("settings"), dict) else {}
    base = default_settings()
    theme = raw_settings.get("theme", base["theme"])
    if theme not in THEMES:
        errors.append(f"Unbekanntes Design „{theme}“.")
        theme = base["theme"]
    settings = {
        "theme": theme,
        "brightness": _int(raw_settings.get("brightness"), 80, 5, 100),
        "standby_brightness": _int(raw_settings.get("standby_brightness"), 10, 0, 100),
        "timeout": _int(raw_settings.get("timeout"), 60, 0, 86400),
        "home_after": _int(raw_settings.get("home_after"), 0, 0, 86400),
        "home_page": raw_settings.get("home_page"),
        "show_header": _bool(raw_settings.get("show_header"), True),
        "show_dots": _bool(raw_settings.get("show_dots"), True),
        "swipe": _bool(raw_settings.get("swipe"), True),
        "language": raw_settings.get("language") if raw_settings.get("language") in ("de", "en") else "de",
        "rotation": raw_settings.get("rotation") if raw_settings.get("rotation") in (0, 90, 180, 270) else 0,
        "touch_mode": _int(raw_settings.get("touch_mode"), 0, 0, 3),
        "night": _validate_night(raw_settings.get("night"), errors),
        "screensaver": _validate_screensaver(raw_settings.get("screensaver"), errors),
        "rules": _validate_rules(raw_settings.get("rules"), errors),
    }

    pages_in = data.get("pages")
    if not isinstance(pages_in, list) or not pages_in:
        raise LayoutValidationError(["Das Layout benötigt mindestens eine Seite."])
    if len(pages_in) > MAX_PAGES:
        errors.append(f"Zu viele Seiten ({len(pages_in)}). Maximal {MAX_PAGES} Seiten werden unterstützt.")

    page_ids: set[str] = set()
    tile_ids: set[str] = set()
    pages: list[dict[str, Any]] = []
    total_tiles = 0
    for pidx, page in enumerate(pages_in[:MAX_PAGES]):
        if not isinstance(page, dict):
            errors.append(f"Seite {pidx + 1}: ungültiges Format.")
            continue
        pid = page.get("id")
        pname = str(page.get("name") or f"Seite {pidx + 1}")[:32]
        where_p = f"Seite „{pname}“"
        if not isinstance(pid, str) or not ID_RE.match(pid):
            errors.append(f"{where_p}: ungültige Seiten-ID.")
            pid = new_id("p")
        if pid in page_ids:
            errors.append(f"{where_p}: Seiten-ID „{pid}“ ist doppelt vergeben.")
        page_ids.add(pid)
        cols = page.get("cols", 3)
        rows = page.get("rows", 3)
        if not all(isinstance(v, int) and not isinstance(v, bool) and 1 <= v <= MAX_GRID for v in (cols, rows)):
            errors.append(f"{where_p}: Rastergröße muss zwischen 1×1 und {MAX_GRID}×{MAX_GRID} liegen.")
            cols, rows = 3, 3
        occupied: dict[tuple[int, int], str] = {}
        tiles: list[dict[str, Any]] = []
        for tidx, tile in enumerate(page.get("tiles") or []):
            total_tiles += 1
            if not isinstance(tile, dict):
                errors.append(f"{where_p}, Kachel {tidx + 1}: ungültiges Format.")
                continue
            tiles.append(_validate_tile(tile, cols, rows, occupied, tile_ids, errors, where_p, tidx))
        pages.append(
            {
                "id": pid,
                "name": pname,
                "background": _color(page.get("background")),
                "cols": cols,
                "rows": rows,
                "tiles": tiles,
            }
        )
    if total_tiles > MAX_TILES_TOTAL:
        errors.append(f"Zu viele Kacheln ({total_tiles}). Maximal {MAX_TILES_TOTAL} insgesamt.")

    for page in pages:
        for tile in page["tiles"]:
            for key in ("tap_action", "hold_action"):
                act = tile[key]
                if act["action"] == "navigate" and act.get("page") not in page_ids:
                    errors.append(f"Kachel „{tile['title'] or tile['id']}“: Zielseite existiert nicht.")
    if settings["night"]["page"] not in page_ids:
        settings["night"]["page"] = None
    for rule in settings["rules"]:
        if rule["page"] not in page_ids:
            errors.append(f"Regel „{rule['name'] or rule['id']}“: Zielseite existiert nicht.")
    if settings["home_page"] not in page_ids:
        settings["home_page"] = pages[0]["id"] if pages else None

    if errors:
        raise LayoutValidationError(errors)
    return {
        "schema": LAYOUT_SCHEMA,
        "revision": _int(data.get("revision"), 0, 0, 2**31 - 1),
        "settings": settings,
        "pages": pages,
    }


DOMAIN_LABELS_DE = {
    "weather": "Wetter", "light": "Licht", "cover": "Rollladen", "climate": "Thermostat", "water_heater": "Warmwasser",
    "media_player": "Mediaplayer", "sensor": "Sensor", "number": "Zahlen", "input_number": "Zahlen-Helfer",
}  # fmt: skip

WEATHER_OPTIONS = {"condition": True, "hilo": True, "humidity": True, "wind": True, "pressure": False, "forecast": True}
WEATHER_BITS = {"condition": 1, "hilo": 2, "humidity": 4, "wind": 8, "pressure": 16, "forecast": 32}


def _weather_options(raw: Any) -> dict[str, bool]:
    raw = raw if isinstance(raw, dict) else {}
    return {k: _bool(raw.get(k), default) for k, default in WEATHER_OPTIONS.items()}


def _validate_night(raw: Any, errors: list[str]) -> dict[str, Any]:
    n = default_night()
    if not isinstance(raw, dict):
        return n
    n["enabled"] = _bool(raw.get("enabled"), False)
    n["mode"] = raw.get("mode") if raw.get("mode") in ("time", "sun") else "time"
    for key in ("start", "end"):
        value = raw.get(key, n[key])
        if not isinstance(value, str) or not TIME_RE.match(value):
            errors.append(f"Nachtmodus: ungültige Uhrzeit „{value}“ (Format HH:MM).")
        else:
            n[key] = value
    n["brightness"] = _int(raw.get("brightness"), 15, 1, 100)
    n["dim"] = _int(raw.get("dim"), 30, 0, 80)
    n["page"] = raw.get("page") if isinstance(raw.get("page"), str) else None
    return n


def _validate_screensaver(raw: Any, errors: list[str]) -> dict[str, Any]:
    s = default_screensaver()
    if not isinstance(raw, dict):
        return s
    s["enabled"] = _bool(raw.get("enabled"), False)
    s["after"] = _int(raw.get("after"), 120, 10, 86400)
    ents = raw.get("entities") or []
    if not isinstance(ents, list) or len(ents) > MAX_SCREENSAVER_ENTITIES:
        errors.append(f"Bildschirmschoner: höchstens {MAX_SCREENSAVER_ENTITIES} Entitäten.")
        ents = []
    for e in ents:
        if not isinstance(e, str) or not ENTITY_RE.match(e):
            errors.append(f"Bildschirmschoner: ungültige Entity-ID „{e}“.")
        else:
            s["entities"].append(e)
    s["mode"] = raw.get("mode") if raw.get("mode") in ("clock", "slideshow", "prayer") else "clock"
    folder = raw.get("folder", s["folder"])
    if not isinstance(folder, str) or ".." in folder or not FOLDER_RE.match(folder):
        errors.append("Bildschirmschoner: ungültiger Bilderordner.")
    else:
        s["folder"] = folder.strip("/")
    s["interval"] = _int(raw.get("interval"), 15, 5, 600)
    s["order"] = raw.get("order") if raw.get("order") in ("random", "sequential") else "random"
    s["fit"] = raw.get("fit") if raw.get("fit") in ("cover", "contain") else "cover"
    s["show_clock"] = _bool(raw.get("show_clock"), True)
    prayer = raw.get("prayer") if isinstance(raw.get("prayer"), dict) else {}
    for key, label in PRAYER_KEYS:
        eid = prayer.get(key)
        if not eid:
            continue
        if not isinstance(eid, str) or not ENTITY_RE.match(eid):
            errors.append(f"Bildschirmschoner: ungültige Entity-ID für {label}.")
        else:
            s["prayer"][key] = eid
    s["prayer_lang"] = raw.get("prayer_lang") if raw.get("prayer_lang") in PRAYER_NAMES else "de"
    s["prayer_bg"] = _bool(raw.get("prayer_bg"), True)
    if s["enabled"] and s["mode"] == "prayer" and not s["prayer"]:
        errors.append("Bildschirmschoner: Bitte die Gebetszeit-Sensoren auswählen.")
    return s


def _validate_rules(raw: Any, errors: list[str]) -> list[dict[str, Any]]:
    if not isinstance(raw, list):
        return []
    if len(raw) > MAX_RULES:
        errors.append(f"Höchstens {MAX_RULES} Seitenwechsel-Regeln.")
    out = []
    for i, r in enumerate(raw[:MAX_RULES]):
        if not isinstance(r, dict):
            continue
        name = str(r.get("name") or "")[:40]
        where = f"Regel „{name or i + 1}“"
        rule: dict[str, Any] = {
            "id": r.get("id") if isinstance(r.get("id"), str) and ID_RE.match(r["id"]) else new_id("r"),
            "name": name,
            "enabled": _bool(r.get("enabled"), True),
            "type": r.get("type"),
            "page": r.get("page"),
        }
        if rule["type"] == "time":
            if not isinstance(r.get("at"), str) or not TIME_RE.match(r["at"]):
                errors.append(f"{where}: ungültige Uhrzeit (Format HH:MM).")
            rule["at"] = r.get("at")
        elif rule["type"] == "state":
            ent, op = r.get("entity"), r.get("operator", "eq")
            if not isinstance(ent, str) or not ENTITY_RE.match(ent):
                errors.append(f"{where}: ungültige Entity-ID.")
            if op not in ("eq", "ne", "gt", "lt"):
                errors.append(f"{where}: ungültiger Vergleich.")
            rule.update(entity=ent, operator=op, value=str(r.get("value", ""))[:64])
        else:
            errors.append(f"{where}: unbekannter Auslöser.")
        out.append(rule)
    return out


def _validate_tile(
    tile: dict[str, Any],
    cols: int,
    rows: int,
    occupied: dict[tuple[int, int], str],
    tile_ids: set[str],
    errors: list[str],
    where_p: str,
    tidx: int,
) -> dict[str, Any]:
    tid = tile.get("id")
    title = str(tile.get("title") or "")[:MAX_TITLE_LEN]
    where = f"{where_p}, Kachel „{title or tidx + 1}“"
    if not isinstance(tid, str) or not ID_RE.match(tid):
        errors.append(f"{where}: ungültige Kachel-ID.")
        tid = new_id("t")
    if tid in tile_ids:
        errors.append(f"{where}: Kachel-ID „{tid}“ ist doppelt vergeben.")
    tile_ids.add(tid)

    ttype = tile.get("type")
    if ttype not in TILE_TYPES:
        errors.append(f"{where}: Kacheltyp „{ttype}“ wird von dieser Firmware nicht unterstützt.")
        ttype = "text"
    x, y, w, h = (tile.get(k) for k in ("x", "y", "w", "h"))
    if not all(isinstance(v, int) and not isinstance(v, bool) for v in (x, y, w, h)):
        errors.append(f"{where}: Position und Größe müssen ganze Zahlen sein.")
        x, y, w, h = 0, 0, 1, 1
    elif w < 1 or h < 1 or x < 0 or y < 0 or x + w > cols or y + h > rows:
        errors.append(f"{where}: liegt außerhalb des Displays ({cols}×{rows}-Raster).")
    else:
        for yy in range(y, y + h):
            for xx in range(x, x + w):
                if (xx, yy) in occupied:
                    errors.append(f"{where}: überlappt mit einer anderen Kachel.")
                    break
                occupied[(xx, yy)] = tid
            else:
                continue
            break

    entity = tile.get("entity") or None
    if entity is not None and (not isinstance(entity, str) or not ENTITY_RE.match(entity)):
        errors.append(f"{where}: ungültige Entity-ID „{entity}“.")
        entity = None
    items: list[dict[str, Any]] = []
    if ttype == "swipe":
        raw_items = tile.get("items") if isinstance(tile.get("items"), list) else []
        if len(raw_items) > MAX_SWIPE_ITEMS:
            errors.append(f"{where}: Eine Wisch-Kachel hat höchstens {MAX_SWIPE_ITEMS} Entitäten.")
        for item in raw_items[:MAX_SWIPE_ITEMS]:
            if not isinstance(item, dict):
                continue
            ient = item.get("entity")
            if not ient:
                continue
            if not isinstance(ient, str) or not ENTITY_RE.match(ient):
                errors.append(f"{where}: ungültige Entity-ID „{ient}“.")
                continue
            iicon = item.get("icon") or None
            iicon = LEGACY_ICONS.get(iicon, iicon) if iicon else None
            if iicon is not None and iicon not in ICONS:
                errors.append(f"{where}: Unbekanntes Icon „{iicon}“.")
                iicon = None
            items.append({"entity": ient, "title": str(item.get("title") or "")[:MAX_TITLE_LEN], "icon": iicon})
        if not items:
            errors.append(f"{where}: Bitte mindestens eine Entität für die Wisch-Kachel auswählen.")
        entity = items[0]["entity"] if items else None
    if ttype in TILE_ENTITY_DOMAINS:
        domains = TILE_ENTITY_DOMAINS[ttype]
        if not entity:
            errors.append(f"{where}: Bitte eine Home-Assistant-Entität zuordnen.")
        elif domains is not None and entity.split(".", 1)[0] not in domains:
            names = " oder ".join(DOMAIN_LABELS_DE.get(d, d) for d in sorted(domains))
            errors.append(f"{where}: Dieser Kacheltyp braucht eine {names}-Entität ({', '.join(d + '.…' for d in sorted(domains))}).")

    icon = tile.get("icon") or None
    icon = LEGACY_ICONS.get(icon, icon) if icon else None
    if icon is not None and icon not in ICONS:
        errors.append(f"{where}: Unbekanntes Icon „{icon}“.")
        icon = None

    style_in = tile.get("style") if isinstance(tile.get("style"), dict) else {}
    style = default_style()
    for key in ("background", "color", "icon_color", "on_color", "on_text_color", "border_color"):
        style[key] = _color(style_in.get(key))
    font = style_in.get("font_size", "m")
    style["font_size"] = font if font in FONT_SIZES else "m"
    style["radius"] = _int(style_in.get("radius"), 16, 0, 60)
    style["border_width"] = _int(style_in.get("border_width"), 0, 0, 8)
    style["opacity"] = _int(style_in.get("opacity"), 100, 10, 100)

    visibility = []
    for cond in tile.get("visibility") or []:
        if not isinstance(cond, dict):
            continue
        cent = cond.get("entity")
        op = cond.get("operator", "eq")
        if not isinstance(cent, str) or not ENTITY_RE.match(cent) or op not in ("eq", "ne", "gt", "lt"):
            errors.append(f"{where}: ungültige Sichtbarkeitsbedingung.")
            continue
        visibility.append({"entity": cent, "operator": op, "value": str(cond.get("value", ""))[:64]})

    fmt = tile.get("format") if tile.get("format") in ("time", "time_date", "") else ""
    return {
        "id": tid,
        "type": ttype,
        "x": x,
        "y": y,
        "w": w,
        "h": h,
        "entity": entity,
        "title": title,
        "icon": icon,
        "format": fmt,
        "style": style,
        "show_title": _bool(tile.get("show_title"), True),
        "show_state": _bool(tile.get("show_state"), True),
        "show_icon": _bool(tile.get("show_icon"), True),
        "tap_action": _action(tile.get("tap_action"), errors, where),
        "hold_action": _action(tile.get("hold_action"), errors, where),
        "visibility": visibility,
        "hours": _int(tile.get("hours"), 24, 1, 48),
        "weather": _weather_options(tile.get("weather")),
        "items": items,
    }


# --------------------------------------------------------------------------- actions


def resolve_action(tile: dict[str, Any], which: str) -> tuple[str, str, dict[str, Any]] | None:
    """Resolve a remote tile action to (domain, service, data). None = nothing to do.

    Only called for actions configured by an administrator in the editor.
    """
    act = tile.get(f"{which}_action") or {"action": "none"}
    action = act.get("action", "none")
    entity = tile.get("entity")
    domain = entity.split(".", 1)[0] if entity else None
    if action == "default":
        if not entity:
            return None
        if domain in TOGGLE_DOMAINS:
            return ("homeassistant", "toggle", {"entity_id": entity})
        if domain in TURN_ON_DOMAINS:
            return (domain, "turn_on", {"entity_id": entity})
        if domain in PRESS_DOMAINS:
            return (domain, "press", {"entity_id": entity})
        return None
    if action in ("toggle", "turn_on", "turn_off"):
        if not entity:
            return None
        if action == "toggle":
            return ("homeassistant", "toggle", {"entity_id": entity})
        return ("homeassistant", action, {"entity_id": entity})
    if action == "call_service":
        domain_s, service = act["service"].split(".", 1)
        data = dict(act.get("data") or {})
        if entity and "entity_id" not in data and not any(k in data for k in ("device_id", "area_id")):
            data["entity_id"] = entity
        return (domain_s, service, data)
    return None


BUTTON_SERVICES: dict[str, dict[str, tuple[str, str]]] = {
    "cover": {"up": ("cover", "open_cover"), "stop": ("cover", "stop_cover"), "down": ("cover", "close_cover")},
    "media": {
        "prev": ("media_player", "media_previous_track"),
        "play": ("media_player", "media_play_pause"),
        "next": ("media_player", "media_next_track"),
        "vol_down": ("media_player", "volume_down"),
        "vol_up": ("media_player", "volume_up"),
    },
}


# Colour swatches of the RGB tile (order/colours must match the firmware: guition_studio.cpp SWATCH_COLORS)
RGB_SWATCHES: dict[str, dict[str, Any]] = {
    "c1": {"color_temp_kelvin": 2700},
    "c2": {"rgb_color": [255, 59, 48]},
    "c3": {"rgb_color": [52, 199, 89]},
    "c4": {"rgb_color": [10, 132, 255]},
    "c5": {"rgb_color": [191, 90, 242]},
}


def resolve_control(
    tile: dict[str, Any], kind: str, payload: dict[str, Any], attributes: dict[str, Any] | None
) -> tuple[str, str, dict[str, Any]] | None:
    """Resolve an in-tile control (slider/button) reported by the display.

    Only controls that belong to the tile's type are accepted, values are
    range-checked, and the target is always the tile's own entity.
    """
    entity = tile.get("entity")
    ttype = tile.get("type")
    if not entity:
        return None
    if kind == "color" and ttype == "rgb":
        h, s, k = payload.get("h"), payload.get("s"), payload.get("k")
        if isinstance(k, int) and not isinstance(k, bool) and 1500 <= k <= 10000:
            return ("light", "turn_on", {"entity_id": entity, "color_temp_kelvin": k})
        if (
            isinstance(h, int) and isinstance(s, int) and not isinstance(h, bool) and not isinstance(s, bool)
            and 0 <= h <= 360 and 0 <= s <= 100
        ):
            return ("light", "turn_on", {"entity_id": entity, "hs_color": [h, s]})
        return None
    if kind == "btn" and ttype == "rgb":
        swatch = RGB_SWATCHES.get(payload.get("b"))
        return ("light", "turn_on", {"entity_id": entity, **swatch}) if swatch else None
    if kind == "set" and ttype in ("dimmer", "rgb"):
        value = payload.get("v")
        if isinstance(value, bool) or not isinstance(value, int) or not 0 <= value <= 100:
            return None
        if value == 0:
            return ("light", "turn_off", {"entity_id": entity})
        return ("light", "turn_on", {"entity_id": entity, "brightness_pct": value})
    if kind != "btn":
        return None
    button = payload.get("b")
    if ttype in BUTTON_SERVICES:
        target = BUTTON_SERVICES[ttype].get(button)
        return (target[0], target[1], {"entity_id": entity}) if target else None
    if ttype == "thermostat" and button in ("minus", "plus"):
        attrs = attributes or {}
        current = attrs.get("temperature")
        if not isinstance(current, (int, float)):
            return None
        step = attrs.get("target_temp_step") or (1.0 if attrs.get("temperature_unit") == "°F" else 0.5)
        target = current + (step if button == "plus" else -step)
        lo, hi = attrs.get("min_temp"), attrs.get("max_temp")
        if isinstance(lo, (int, float)):
            target = max(lo, target)
        if isinstance(hi, (int, float)):
            target = min(hi, target)
        domain = entity.split(".", 1)[0]
        return (domain, "set_temperature", {"entity_id": entity, "temperature": round(target, 1)})
    return None


def _device_action(tile: dict[str, Any], which: str, page_index: dict[str, int]) -> tuple[int, int]:
    if tile.get("type") == "settings" and which == "tap":
        return DEV_ACTION_SETTINGS, -1
    if tile.get("type") == "rgb" and which == "hold" and (tile.get("hold_action") or {}).get("action", "none") in ("none", "default"):
        return DEV_ACTION_COLOR, -1  # long press opens the colour picker on the display
    act = tile.get(f"{which}_action") or {"action": "none"}
    action = act.get("action")
    if tile.get("type") == "swipe" and action not in ("navigate", "home", "back", "next", "prev"):
        # remote if the action does something for at least one of the entities
        views = (swipe_item_tile(tile, i) for i in range(len(swipe_items(tile))))
        return (DEV_ACTION_REMOTE if any(v and resolve_action(v, which) for v in views) else DEV_ACTION_NONE), -1
    if action == "navigate":
        return DEV_ACTION_NAVIGATE, page_index.get(act.get("page"), -1)
    if action == "home":
        return DEV_ACTION_HOME, -1
    if action == "back":
        return DEV_ACTION_BACK, -1
    if action == "next":
        return DEV_ACTION_NEXT, -1
    if action == "prev":
        return DEV_ACTION_PREV, -1
    if resolve_action(tile, which) is not None:
        return DEV_ACTION_REMOTE, -1
    return DEV_ACTION_NONE, -1


# --------------------------------------------------------------------------- compile


def _hex(color: str | None, fallback: str) -> str:
    return (color or fallback).lstrip("#").upper()


def compile_device_layout(layout: dict[str, Any], slide_url: str | None = None) -> tuple[str, int]:
    """Compile a validated layout into the compact device JSON. Returns (payload, crc32)."""
    settings = layout["settings"]
    theme = get_theme(settings["theme"])
    page_index = {p["id"]: i for i, p in enumerate(layout["pages"])}
    lang_na = "Nicht verfügbar" if settings.get("language", "de") == "de" else "Unavailable"

    pages = []
    for page in layout["pages"]:
        tiles = []
        for t in page["tiles"]:
            s = t["style"]
            ta, tp = _device_action(t, "tap", page_index)
            ha, hp = _device_action(t, "hold", page_index)
            dev: dict[str, Any] = {
                "id": t["id"],
                "k": t["type"],
                "x": t["x"],
                "y": t["y"],
                "w": t["w"],
                "h": t["h"],
            }
            if t.get("entity"):
                dev["e"] = t["entity"]
            if t.get("title"):
                dev["ti"] = t["title"]
            if t.get("icon"):
                dev["ic"] = t["icon"]
            if t.get("format"):
                dev["fmt"] = t["format"]
            if t["type"] == "swipe":
                # [entity, title, icon] per item; title falls back to a readable object id
                dev["it"] = [
                    [
                        it["entity"],
                        (it.get("title") or it["entity"].split(".", 1)[1].replace("_", " ").title())[:MAX_TITLE_LEN],
                        it.get("icon") or "",
                    ]
                    for it in swipe_items(t)
                ]
            if t["type"] == "weather":
                opts = t.get("weather") or WEATHER_OPTIONS
                dev["wo"] = sum(bit for key, bit in WEATHER_BITS.items() if opts.get(key, WEATHER_OPTIONS[key]))
            dev.update(
                {
                    "bg": _hex(s["background"], theme["tile_bg"]),
                    "fg": _hex(s["color"], theme["text"]),
                    "icc": _hex(s["icon_color"], theme["icon"]),
                    "obg": _hex(s["on_color"], theme["on_bg"]),
                    "ofg": _hex(s["on_text_color"], theme["on_text"]),
                }
            )
            if s["border_width"]:
                dev["bw"] = s["border_width"]
                dev["bc"] = _hex(s["border_color"], theme["accent"])
            if FONT_SIZES[s["font_size"]] != 1:
                dev["fs"] = FONT_SIZES[s["font_size"]]
            if s["radius"] != 16:
                dev["rad"] = s["radius"]
            if s["opacity"] != 100:
                dev["op"] = s["opacity"]
            if not t["show_title"]:
                dev["st"] = 0
            if not t["show_state"]:
                dev["sv"] = 0
            if not t["show_icon"]:
                dev["si"] = 0
            if ta:
                dev["ta"] = ta
            if tp >= 0:
                dev["tp"] = tp
            if ha:
                dev["ha"] = ha
            if hp >= 0:
                dev["hp"] = hp
            tiles.append(dev)
        pages.append(
            {
                "id": page["id"],
                "n": page["name"],
                "bg": _hex(page.get("background"), theme["page_bg"]),
                "c": page["cols"],
                "r": page["rows"],
                "t": tiles,
            }
        )

    doc = {
        "v": PROTOCOL_VERSION,
        "rev": layout.get("revision", 0),
        "set": {
            "br": settings["brightness"],
            "sb": settings["standby_brightness"],
            "to": settings["timeout"],
            "ret": settings["home_after"],
            "home": page_index.get(settings["home_page"], 0),
            "hdr": int(settings["show_header"]),
            "dots": int(settings["show_dots"]),
            "swp": int(settings["swipe"]),
            "hbg": _hex(None, theme["header_bg"]),
            "hfg": _hex(None, theme["header_text"]),
            "mut": _hex(None, theme["muted"]),
            "acc": _hex(None, theme["accent"]),
            "ok": _hex(None, theme["ok"]),
            "err": _hex(None, theme["error"]),
            "na": lang_na,
            # on-device settings menu: night values for manual toggle, theme choices, current theme
            "rot": settings.get("rotation", 0),
            "tch": settings.get("touch_mode", 0),
            "nb": (settings.get("night") or {}).get("brightness", 15),
            "nd": (settings.get("night") or {}).get("dim", 30),
            "th": settings["theme"],
            "thl": [[key, t["name"]] for key, t in THEMES.items()],
            **_screensaver_device(settings, layout, slide_url),
        },
        "pages": pages,
    }
    payload = json.dumps(doc, ensure_ascii=False, separators=(",", ":"))
    size = len(payload.encode("utf-8"))
    if size > MAX_LAYOUT_BYTES:
        raise LayoutValidationError(
            [
                f"Das Layout ist zu groß für das Display ({size} von maximal {MAX_LAYOUT_BYTES} Bytes). "
                "Bitte Seiten oder Kacheln reduzieren."
            ]
        )
    return payload, zlib.crc32(payload.encode("utf-8"))


def _screensaver_device(settings: dict[str, Any], layout: dict[str, Any], slide_url: str | None = None) -> dict[str, Any]:
    ss = settings.get("screensaver") or {}
    if not ss.get("enabled"):
        return {}
    titles = []
    for eid in ss.get("entities", []):
        tile = next((t for p in layout["pages"] for t in p["tiles"] if t.get("entity") == eid and t.get("title")), None)
        titles.append((tile["title"] if tile else eid.split(".", 1)[1].replace("_", " ").title())[:32])
    out = {"ss": ss["after"], "sse": ss.get("entities", []), "sst": titles}
    if ss.get("mode") == "slideshow" and slide_url:
        out.update(ssm=1, slu=slide_url, sli=ss.get("interval", 15), slc=int(ss.get("show_clock", True)))
    elif ss.get("mode") == "prayer":
        prayer = ss.get("prayer") or {}
        lang = ss.get("prayer_lang") if ss.get("prayer_lang") in PRAYER_NAMES else "de"
        names = PRAYER_NAMES[lang]
        rows = [(key, names[key], prayer[key]) for key, _ in PRAYER_KEYS if prayer.get(key)]
        # spk: 1 = real prayer (can be "next"), 0 = sunrise (orientation only)
        # spx: texts of the countdown line, spb: calligraphy background (firmware >= 0.5.9)
        out.update(
            ssm=2,
            spn=[label for _, label, _ in rows],
            spe=[eid for _, _, eid in rows],
            spk=[0 if key == "sunrise" else 1 for key, _, _ in rows],
            spx=PRAYER_TEXTS[lang],
            spb=int(ss.get("prayer_bg", True)),
        )
    return out


def layout_entities(layout: dict[str, Any]) -> set[str]:
    """All entity ids the display shows (tiles, visibility conditions, screensaver)."""
    ss = (layout.get("settings") or {}).get("screensaver", {}) or {}
    out: set[str] = set(ss.get("entities", []))
    if ss.get("enabled") and ss.get("mode") == "prayer":
        out.update(e for e in (ss.get("prayer") or {}).values() if e)
    for page in layout.get("pages", []):
        for tile in page.get("tiles", []):
            if tile.get("entity"):
                out.add(tile["entity"])
            out.update(it["entity"] for it in swipe_items(tile))
            for cond in tile.get("visibility", []):
                out.add(cond["entity"])
    return out


def find_tile(layout: dict[str, Any], tile_id: str) -> dict[str, Any] | None:
    for page in layout.get("pages", []):
        for tile in page.get("tiles", []):
            if tile.get("id") == tile_id:
                return tile
    return None


def regenerate_ids(layout: dict[str, Any]) -> dict[str, Any]:
    """Return a deep copy with fresh page/tile ids (used for templates/copies)."""
    out = copy.deepcopy(layout)
    mapping: dict[str, str] = {}
    for page in out.get("pages", []):
        old = page.get("id")
        page["id"] = new_id("p")
        if old:
            mapping[old] = page["id"]
        for tile in page.get("tiles", []):
            tile["id"] = new_id("t")
    for page in out.get("pages", []):
        for tile in page.get("tiles", []):
            for key in ("tap_action", "hold_action"):
                act = tile.get(key) or {}
                if act.get("action") == "navigate" and act.get("page") in mapping:
                    act["page"] = mapping[act["page"]]
    settings = out.get("settings") or {}
    if settings.get("home_page") in mapping:
        settings["home_page"] = mapping[settings["home_page"]]
    return out

"""Transfer protocol helpers (pure module, unit tested).

See docs/PROTOCOL.md for the full description.
"""

from __future__ import annotations

from datetime import datetime
import json
from typing import Any, Callable, Iterable

from .const import CHUNK_SIZE, MAX_STATE_PAYLOAD

ON_STATES = {
    "on", "open", "opening", "closing", "home", "playing", "unlocked", "heat", "cool",
    "heat_cool", "auto", "dry", "fan_only", "active", "detected", "problem", "armed_home",
    "armed_away", "armed_night", "armed_vacation", "cleaning", "buffering",
}  # fmt: skip

STATE_TEXT_DE = {
    "on": "An",
    "off": "Aus",
    "open": "Offen",
    "opening": "Öffnet",
    "closed": "Geschlossen",
    "closing": "Schließt",
    "home": "Zuhause",
    "not_home": "Abwesend",
    "playing": "Wiedergabe",
    "paused": "Pausiert",
    "idle": "Bereit",
    "standby": "Standby",
    "buffering": "Lädt",
    "locked": "Verriegelt",
    "unlocked": "Entriegelt",
    "locking": "Verriegelt …",
    "unlocking": "Entriegelt …",
    "jammed": "Blockiert",
    "heat": "Heizen",
    "cool": "Kühlen",
    "heat_cool": "Heizen/Kühlen",
    "auto": "Automatik",
    "dry": "Entfeuchten",
    "fan_only": "Lüften",
    "unknown": "Unbekannt",
    "unavailable": "Nicht verfügbar",
    "armed_home": "Scharf (Zuhause)",
    "armed_away": "Scharf (Abwesend)",
    "disarmed": "Unscharf",
    "triggered": "Ausgelöst",
}

BINARY_TEXT_DE = {
    "door": ("Offen", "Geschlossen"),
    "garage_door": ("Offen", "Geschlossen"),
    "window": ("Offen", "Geschlossen"),
    "opening": ("Offen", "Geschlossen"),
    "motion": ("Bewegung", "Keine Bewegung"),
    "occupancy": ("Belegt", "Frei"),
    "presence": ("Anwesend", "Abwesend"),
    "moisture": ("Nass", "Trocken"),
    "smoke": ("Rauch!", "OK"),
    "battery": ("Schwach", "OK"),
    "connectivity": ("Verbunden", "Getrennt"),
    "lock": ("Entriegelt", "Verriegelt"),
    "plug": ("Eingesteckt", "Ausgesteckt"),
    "problem": ("Problem", "OK"),
}


def chunk_payload(payload: str, size: int = CHUNK_SIZE) -> list[str]:
    """Split a payload into chunks of at most ``size`` UTF-8 bytes.

    Splits only on character boundaries so every chunk is valid UTF-8 (ESPHome
    string arguments must be valid UTF-8).
    """
    chunks: list[str] = []
    current: list[str] = []
    current_len = 0
    for ch in payload:
        blen = len(ch.encode("utf-8"))
        if current_len + blen > size and current:
            chunks.append("".join(current))
            current, current_len = [], 0
        current.append(ch)
        current_len += blen
    if current:
        chunks.append("".join(current))
    return chunks


def to_int32(value: int) -> int:
    """Map an unsigned 32-bit value onto the signed int32 range used by ESPHome int args."""
    value &= 0xFFFFFFFF
    return value - 0x100000000 if value >= 0x80000000 else value


def parse_event_payload(raw: Any) -> dict[str, Any]:
    if isinstance(raw, dict):
        return raw
    if not isinstance(raw, str) or not raw:
        return {}
    try:
        data = json.loads(raw)
    except ValueError:
        return {}
    return data if isinstance(data, dict) else {}


def _fmt_number(value: Any) -> str | None:
    try:
        num = float(value)
    except (TypeError, ValueError):
        return None
    if num != num:  # NaN
        return None
    if num.is_integer() and abs(num) < 1e9:
        return str(int(num))
    text = f"{num:.1f}" if abs(num) < 1000 else f"{num:.0f}"
    return text.replace(".", ",")


def format_state(domain: str, state: str, attributes: dict[str, Any]) -> str:
    """Human readable (German) state text for the display."""
    if state in ("unavailable", "unknown"):
        return STATE_TEXT_DE[state]
    unit = attributes.get("unit_of_measurement")
    device_class = attributes.get("device_class")

    if domain in ("sensor", "number", "input_number"):
        if device_class == "timestamp":
            try:
                return datetime.fromisoformat(state).astimezone().strftime("%H:%M")
            except ValueError:
                return state[:16]
        num = _fmt_number(state)
        if num is not None:
            return f"{num} {unit}".strip() if unit else num
        return state[:48]
    if domain == "binary_sensor":
        on_off = BINARY_TEXT_DE.get(device_class or "")
        if on_off:
            return on_off[0] if state == "on" else on_off[1]
        return STATE_TEXT_DE.get(state, state)
    if domain == "light" and state == "on" and attributes.get("brightness") is not None:
        pct = round(int(attributes["brightness"]) * 100 / 255)
        return f"An · {pct} %"
    if domain == "cover" and attributes.get("current_position") is not None and state in ("open", "opening", "closing"):
        return f"{STATE_TEXT_DE.get(state, state)} · {attributes['current_position']} %"
    if domain == "climate":
        cur = _fmt_number(attributes.get("current_temperature"))
        target = _fmt_number(attributes.get("temperature"))
        if cur and target:
            return f"{cur} °C → {target} °C"
        if cur:
            return f"{cur} °C"
    if domain == "media_player" and state == "playing" and attributes.get("media_title"):
        return str(attributes["media_title"])[:48]
    if domain == "weather":
        temp = _fmt_number(attributes.get("temperature"))
        unit_t = attributes.get("temperature_unit", "°C")
        return f"{temp} {unit_t}" if temp else state
    if domain in ("scene", "button", "input_button"):
        return ""
    if domain == "script":
        return "Läuft" if state == "on" else ""
    return STATE_TEXT_DE.get(state, state)[:48]


WEATHER_DE: dict[str, tuple[str, str]] = {
    "clear-night": ("Klar", "weather-night"),
    "cloudy": ("Bewölkt", "weather-cloudy"),
    "exceptional": ("Unwetter", "alert"),
    "fog": ("Nebel", "weather-fog"),
    "hail": ("Hagel", "weather-hail"),
    "lightning": ("Gewitter", "weather-lightning"),
    "lightning-rainy": ("Gewitter", "weather-lightning-rainy"),
    "partlycloudy": ("Teilweise bewölkt", "weather-partly-cloudy"),
    "pouring": ("Starkregen", "weather-pouring"),
    "rainy": ("Regen", "weather-rainy"),
    "snowy": ("Schnee", "weather-snowy"),
    "snowy-rainy": ("Schneeregen", "weather-snowy-rainy"),
    "sunny": ("Sonnig", "weather-sunny"),
    "windy": ("Windig", "weather-windy"),
    "windy-variant": ("Windig", "weather-windy"),
}


def _extras(domain: str, state: str, attrs: dict[str, Any]) -> dict[str, Any]:
    """Additional values for the advanced tiles: n=0..100, s=secondary text, i=icon override."""
    out: dict[str, Any] = {}
    if domain == "light":
        bri = attrs.get("brightness")
        out["n"] = round(int(bri) * 100 / 255) if state == "on" and isinstance(bri, (int, float)) else (100 if state == "on" else 0)
    elif domain == "cover" and isinstance(attrs.get("current_position"), (int, float)):
        out["n"] = int(attrs["current_position"])
    elif domain in ("climate", "water_heater"):
        target = _fmt_number(attrs.get("temperature"))
        if target is not None:
            out["s"] = f"Ziel {target} °C"
        cur = _fmt_number(attrs.get("current_temperature"))
        out["d"] = f"{cur} °C" if cur is not None else STATE_TEXT_DE.get(state, state)
    elif domain == "media_player":
        title = attrs.get("media_title")
        artist = attrs.get("media_artist")
        if title:
            out["s"] = f"{artist} – {title}"[:64] if artist else str(title)[:64]
        vol = attrs.get("volume_level")
        if isinstance(vol, (int, float)):
            out["n"] = round(vol * 100)
    elif domain == "weather":
        text, icon = WEATHER_DE.get(state, (state, "weather-cloudy"))
        humidity = _fmt_number(attrs.get("humidity"))
        out["s"] = f"{text} · {humidity} %" if humidity else text
        out["i"] = icon
    return out


def entity_payload(domain: str, state: str | None, attributes: dict[str, Any] | None) -> dict[str, Any]:
    """Compact per-entity state for the device: o=on, a=available, d=display text (+ extras)."""
    if state is None:
        return {"o": 0, "a": 0, "d": STATE_TEXT_DE["unavailable"]}
    attrs = attributes or {}
    available = state not in ("unavailable",)
    payload: dict[str, Any] = {
        "o": 1 if state in ON_STATES else 0,
        "a": 1 if available else 0,
        "d": format_state(domain, state, attrs),
    }
    if available:
        payload.update(_extras(domain, state, attrs))
    return payload


def evaluate_condition(cond: dict[str, Any], get_state: Callable[[str], str | None]) -> bool:
    state = get_state(cond["entity"])
    if state is None:
        return False
    op = cond.get("operator", "eq")
    value = cond.get("value", "")
    if op == "eq":
        return state == value
    if op == "ne":
        return state != value
    try:
        num, ref = float(state), float(value)
    except (TypeError, ValueError):
        return False
    return num > ref if op == "gt" else num < ref


def tile_visible(tile: dict[str, Any], get_state: Callable[[str], str | None]) -> bool:
    conds = tile.get("visibility") or []
    return all(evaluate_condition(c, get_state) for c in conds)


def build_state_messages(
    entities: dict[str, dict[str, Any]],
    visibility: dict[str, int] | None = None,
    max_len: int = MAX_STATE_PAYLOAD,
) -> list[str]:
    """Pack entity states / tile visibility into as few messages as possible."""
    messages: list[str] = []
    current: dict[str, Any] = {"e": {}}

    def flush() -> None:
        nonlocal current
        if current.get("e") or current.get("v"):
            messages.append(json.dumps(current, ensure_ascii=False, separators=(",", ":")))
        current = {"e": {}}

    def size_with(key: str, k: str, v: Any) -> int:
        trial = {**current, key: {**current.get(key, {}), k: v}}
        return len(json.dumps(trial, ensure_ascii=False, separators=(",", ":")).encode("utf-8"))

    for eid, payload in entities.items():
        if size_with("e", eid, payload) > max_len:
            flush()
        current["e"][eid] = payload
    for tid, vis in (visibility or {}).items():
        if size_with("v", tid, vis) > max_len:
            flush()
        current.setdefault("v", {})[tid] = vis
    flush()
    return messages


def visibility_map(layout: dict[str, Any], get_state: Callable[[str], str | None]) -> dict[str, int]:
    out: dict[str, int] = {}
    for page in layout.get("pages", []):
        for tile in page.get("tiles", []):
            if tile.get("visibility"):
                out[tile["id"]] = 1 if tile_visible(tile, get_state) else 0
    return out


def tiles_depending_on(layout: dict[str, Any], entity_ids: Iterable[str]) -> bool:
    ids = set(entity_ids)
    for page in layout.get("pages", []):
        for tile in page.get("tiles", []):
            if any(c["entity"] in ids for c in tile.get("visibility", [])):
                return True
    return False


DEVICE_ERRORS_DE = {
    "crc": "Prüfsumme stimmt nicht – Übertragung beschädigt.",
    "size": "Layout ist zu groß für den Gerätespeicher.",
    "oom": "Nicht genug Speicher auf dem Gerät.",
    "sequence": "Datenpakete kamen in falscher Reihenfolge an.",
    "overflow": "Mehr Daten empfangen als angekündigt.",
    "incomplete": "Übertragung unvollständig.",
    "session": "Übertragungssitzung unbekannt (Gerät neu gestartet?).",
    "nvs": "Speichern im Flash des Geräts fehlgeschlagen.",
    "version": "Layout-Version wird von der Firmware nicht unterstützt – bitte Firmware aktualisieren.",
}


def describe_device_error(code: str) -> str:
    if code in DEVICE_ERRORS_DE:
        return DEVICE_ERRORS_DE[code]
    if code.startswith("json:"):
        return f"Gerät konnte das Layout nicht lesen ({code[5:]})."
    if code.startswith("schema:"):
        return f"Gerät hat das Layout abgelehnt ({code[7:]})."
    return code or "Unbekannter Fehler"

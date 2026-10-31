"""Built-in layout templates (pure module).

Templates contain no entity ids; after applying a template the editor marks
tiles without an entity so the user can assign them by drag and drop.
"""

from __future__ import annotations

from typing import Any

from .layout import default_settings, make_tile, new_id


def _tile(t: str, x: int, y: int, w: int = 1, h: int = 1, title: str = "", icon: str | None = None, **kw: Any) -> dict:
    tile = make_tile(t, x, y, w, h, title=title, icon=icon)
    tile.update(kw)
    return tile


def _page(name: str, tiles: list[dict], cols: int = 3, rows: int = 3) -> dict:
    return {"id": new_id("p"), "name": name, "background": None, "cols": cols, "rows": rows, "tiles": tiles}


def _layout(pages: list[dict], theme: str = "modern_dark") -> dict:
    settings = {**default_settings(), "theme": theme, "home_page": pages[0]["id"]}
    return {"schema": 1, "revision": 0, "settings": settings, "pages": pages}


def _nav(x: int, y: int, page: dict, title: str, icon: str = "arrow-right") -> dict:
    return _tile("nav", x, y, title=title, icon=icon, tap_action={"action": "navigate", "page": page["id"]})


def _back(x: int, y: int, w: int = 1) -> dict:
    return _tile("nav", x, y, w, 1, title="Zurück", icon="arrow-left", tap_action={"action": "back"})


def build_templates() -> list[dict[str, Any]]:
    """Return fresh copies (new ids) of all built-in templates."""
    out: list[dict[str, Any]] = []

    living = _page(
        "Wohnzimmer",
        [
            _tile("clock", 0, 0, 2, 1),
            _tile("weather", 2, 0, title="Wetter", icon="weather-partly-cloudy"),
            _tile("dimmer", 0, 1, title="Deckenlicht", icon="ceiling-light"),
            _tile("light", 1, 1, title="Stehlampe", icon="floor-lamp"),
            _tile("switch", 2, 1, title="TV-Steckdose", icon="television"),
            _tile("cover", 0, 2, title="Rollladen", icon="window-shutter"),
            _tile("action", 1, 2, title="Filmabend", icon="movie-open"),
            _tile("sensor", 2, 2, title="Temperatur", icon="thermometer"),
        ],
    )
    out.append({"id": "living_room", "name": "Wohnzimmer", "description": "Uhr, Wetter, Dimmer, Rollladen und Szene", "layout": _layout([living])})

    bedroom = _page(
        "Schlafzimmer",
        [
            _tile("clock", 0, 0, 2, 1),
            _tile("dimmer", 0, 1, title="Nachttisch links", icon="desk-lamp"),
            _tile("dimmer", 1, 1, title="Nachttisch rechts", icon="desk-lamp"),
            _tile("action", 0, 2, 2, 1, title="Gute Nacht", icon="weather-night"),
        ],
        cols=2,
        rows=3,
    )
    out.append({"id": "bedroom", "name": "Schlafzimmer", "description": "Ruhiges 2×3-Layout mit Gute-Nacht-Szene", "layout": _layout([bedroom], "amoled")})

    kitchen = _page(
        "Küche",
        [
            _tile("light", 0, 0, title="Arbeitslicht", icon="led-strip-variant"),
            _tile("light", 1, 0, title="Esstisch", icon="ceiling-light"),
            _tile("switch", 2, 0, title="Kaffeemaschine", icon="coffee"),
            _tile("sensor", 0, 1, title="Temperatur", icon="thermometer"),
            _tile("sensor", 1, 1, title="Luftfeuchte", icon="water-percent"),
            _tile("clock", 2, 1),
        ],
        cols=3,
        rows=2,
    )
    out.append({"id": "kitchen", "name": "Küche", "description": "Licht, Geräte und Raumklima", "layout": _layout([kitchen], "modern_light")})

    overview = _page("Übersicht", [])
    lights = _page(
        "Licht",
        [_tile("dimmer", x, y, title=f"Licht {y * 3 + x + 1}", icon="lightbulb") for y in range(2) for x in range(3)] + [_back(0, 2, 3)],
    )
    climate = _page(
        "Klima",
        [
            _tile("thermostat", 0, 0, 2, 1, title="Wohnzimmer", icon="radiator"),
            _tile("sensor", 2, 0, title="Luftfeuchte", icon="water-percent"),
            _tile("thermostat", 0, 1, 2, 1, title="Bad", icon="radiator"),
            _tile("sensor", 2, 1, title="Außen", icon="thermometer"),
            _back(0, 2, 3),
        ],
    )
    overview["tiles"] = [
        _tile("clock", 0, 0, 2, 1),
        _tile("weather", 2, 0, title="Wetter", icon="weather-sunny"),
        _nav(0, 1, lights, "Licht", "lightbulb-group"),
        _nav(1, 1, climate, "Klima", "home-thermometer"),
        _tile("status", 2, 1, title="Status"),
        _tile("graph", 0, 2, 2, 1, title="Stromverbrauch", icon="lightning-bolt"),
        _tile("action", 2, 2, title="Alles aus", icon="power"),
    ]
    out.append({"id": "overview", "name": "Smart-Home-Übersicht", "description": "Drei Seiten mit Navigation", "layout": _layout([overview, lights, climate])})

    media = _page(
        "Medien",
        [
            _tile("media", 0, 0, 3, 2, title="Wohnzimmer", icon="speaker"),
            _tile("switch", 0, 2, title="Fernseher", icon="television"),
            _tile("action", 1, 2, title="Radio", icon="music"),
            _tile("dimmer", 2, 2, title="Licht", icon="lamp"),
        ],
    )
    out.append({"id": "media", "name": "Mediensteuerung", "description": "Mediaplayer mit Titel, Wiedergabe und Lautstärke", "layout": _layout([media], "minimal")})

    heating = _page(
        "Heizung",
        [
            _tile("thermostat", 0, 0, 2, 1, title="Wohnzimmer", icon="radiator"),
            _tile("sensor", 2, 0, title="Außen", icon="thermometer"),
            _tile("thermostat", 0, 1, 2, 1, title="Bad", icon="radiator"),
            _tile("action", 2, 1, title="Eco", icon="leaf"),
            _tile("thermostat", 0, 2, 2, 1, title="Schlafzimmer", icon="radiator"),
            _tile("action", 2, 2, title="Komfort", icon="fire"),
        ],
    )
    out.append({"id": "heating", "name": "Heizungssteuerung", "description": "Thermostate mit Zieltemperatur ± und Modi", "layout": _layout([heating], "pastel")})
    return out

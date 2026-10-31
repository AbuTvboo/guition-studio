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
    out.extend(_more_templates())
    return out


def _with(layout: dict, night: dict | None = None, screensaver: dict | None = None) -> dict:
    """Preconfigure night mode / screensaver for a template."""
    if night:
        layout["settings"]["night"] = {"enabled": True, "mode": "sun", "start": "22:00", "end": "06:30", "brightness": 10, "dim": 40, "page": None, **night}
    if screensaver:
        layout["settings"]["screensaver"] = {"enabled": True, "after": 120, "entities": [], **screensaver}
    return layout


def _more_templates() -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []

    hall = _page(
        "Flur",
        [
            _tile("clock", 0, 0, 2, 1),
            _tile("weather", 2, 0, title="Draußen", icon="weather-partly-cloudy"),
            _tile("switch", 0, 1, title="Haustür", icon="lock"),
            _tile("sensor", 1, 1, title="Garage", icon="garage"),
            _tile("light", 2, 1, title="Flurlicht", icon="ceiling-light"),
            _tile("action", 0, 2, title="Alles aus", icon="power"),
            _tile("action", 1, 2, title="Abwesend", icon="shield-home"),
            _tile("settings", 2, 2, title="Einstellungen", icon="cog"),
        ],
    )
    out.append({"id": "hallway", "name": "Eingang & Flur", "description": "Haustür, Garage, Wetter und „Alles aus“ beim Gehen", "layout": _with(_layout([hall], "modern_dark"), screensaver={"after": 60})})

    bath = _page(
        "Bad",
        [
            _tile("dimmer", 0, 0, title="Spiegel", icon="lightbulb-outline"),
            _tile("thermostat", 1, 0, 2, 1, title="Fußbodenheizung", icon="radiator"),
            _tile("switch", 0, 1, title="Lüfter", icon="fan"),
            _tile("graph", 1, 1, 2, 1, title="Luftfeuchte", icon="water-percent", hours=12),
            _tile("light", 0, 2, title="Decke", icon="ceiling-light"),
            _tile("sensor", 1, 2, title="Temperatur", icon="thermometer"),
            _tile("action", 2, 2, title="Wellness", icon="shower"),
        ],
    )
    out.append({"id": "bathroom", "name": "Badezimmer", "description": "Heizung, Lüfter und Luftfeuchte-Verlauf", "layout": _with(_layout([bath], "modern_light"), night={"brightness": 15, "dim": 30})})

    kids = _page(
        "Kinderzimmer",
        [
            _tile("rgb", 0, 0, 2, 1, title="Nachtlicht", icon="string-lights"),
            _tile("clock", 2, 0),
            _tile("dimmer", 0, 1, title="Deckenlampe", icon="ceiling-light"),
            _tile("sensor", 1, 1, title="Temperatur", icon="thermometer"),
            _tile("cover", 2, 1, title="Rollladen", icon="window-shutter"),
            _tile("action", 0, 2, 3, 1, title="Gute Nacht", icon="weather-night"),
        ],
    )
    out.append({"id": "kids", "name": "Kinderzimmer", "description": "Farbiges Nachtlicht, Rollladen und Gute-Nacht-Szene", "layout": _with(_layout([kids], "pastel"), night={"brightness": 5, "dim": 60})})

    energy = _page(
        "Energie",
        [
            _tile("graph", 0, 0, 3, 1, title="Hausverbrauch", icon="lightning-bolt", hours=24),
            _tile("sensor", 0, 1, title="Solar", icon="solar-power"),
            _tile("sensor", 1, 1, title="Netz", icon="power-plug"),
            _tile("sensor", 2, 1, title="Speicher", icon="battery-charging"),
            _tile("graph", 0, 2, 2, 1, title="Solar heute", icon="weather-sunny", hours=12),
            _tile("sensor", 2, 2, title="Kosten heute", icon="gauge"),
        ],
    )
    out.append({"id": "energy", "name": "Energie-Dashboard", "description": "Verbrauch und Solar als Verlauf, Speicher und Netz", "layout": _layout([energy], "amoled")})

    garden = _page(
        "Garten",
        [
            _tile("weather", 0, 0, 2, 1, title="Wetter", icon="weather-sunny"),
            _tile("sensor", 2, 0, title="Pool", icon="pool"),
            _tile("switch", 0, 1, title="Bewässerung", icon="sprinkler"),
            _tile("light", 1, 1, title="Gartenlicht", icon="string-lights"),
            _tile("cover", 2, 1, title="Markise", icon="blinds"),
            _tile("cover", 0, 2, title="Garagentor", icon="garage"),
            _tile("sensor", 1, 2, title="Bodenfeuchte", icon="flower"),
            _tile("switch", 2, 2, title="Steckdose", icon="power-socket-de"),
        ],
    )
    out.append({"id": "garden", "name": "Garten & Außen", "description": "Bewässerung, Markise, Garagentor und Pool", "layout": _layout([garden], "minimal")})

    office = _page(
        "Büro",
        [
            _tile("clock", 0, 0, 2, 1),
            _tile("sensor", 2, 0, title="CO₂", icon="leaf"),
            _tile("dimmer", 0, 1, title="Schreibtisch", icon="desk-lamp"),
            _tile("thermostat", 1, 1, 2, 1, title="Heizung", icon="radiator"),
            _tile("media", 0, 2, 2, 1, title="Musik", icon="speaker"),
            _tile("action", 2, 2, title="Fokus", icon="star"),
        ],
    )
    out.append({"id": "office", "name": "Homeoffice", "description": "Schreibtischlicht, Klima, CO₂ und Musik", "layout": _layout([office], "modern_dark")})

    simple = _page(
        "Einfach",
        [
            _tile("light", 0, 0, title="Licht", icon="lightbulb", style={**make_tile("light", 0, 0)["style"], "font_size": "xl"}),
            _tile("action", 1, 0, title="Hilfe", icon="phone", style={**make_tile("action", 0, 0)["style"], "font_size": "xl"}),
            _tile("sensor", 0, 1, title="Temperatur", icon="thermometer", style={**make_tile("sensor", 0, 0)["style"], "font_size": "l"}),
            _tile("clock", 1, 1),
        ],
        cols=2,
        rows=2,
    )
    simple_layout = _layout([simple], "modern_light")
    simple_layout["settings"].update(show_dots=False, swipe=False)
    out.append({"id": "simple", "name": "Einfach (große Kacheln)", "description": "2×2 mit großer Schrift – für Kinder, Gäste und Senioren", "layout": simple_layout})

    home = _page("Zuhause", [])
    lights = _page(
        "Licht",
        [
            _tile("dimmer", 0, 0, title="Wohnzimmer", icon="ceiling-light"),
            _tile("dimmer", 1, 0, title="Esstisch", icon="lamp"),
            _tile("rgb", 2, 0, title="Ambiente", icon="led-strip-variant"),
            _tile("light", 0, 1, title="Küche", icon="lightbulb"),
            _tile("light", 1, 1, title="Flur", icon="lightbulb"),
            _tile("light", 2, 1, title="Außen", icon="string-lights"),
            _back(0, 2, 3),
        ],
    )
    climate = _page(
        "Klima",
        [
            _tile("thermostat", 0, 0, 2, 1, title="Wohnzimmer", icon="radiator"),
            _tile("sensor", 2, 0, title="Außen", icon="thermometer"),
            _tile("graph", 0, 1, 3, 1, title="Temperatur 24 h", icon="thermometer", hours=24),
            _back(0, 2, 3),
        ],
    )
    media = _page(
        "Medien",
        [
            _tile("media", 0, 0, 3, 2, title="Wohnzimmer", icon="speaker"),
            _back(0, 2, 3),
        ],
    )
    home["tiles"] = [
        _tile("clock", 0, 0, 2, 1),
        _tile("weather", 2, 0, title="Wetter", icon="weather-partly-cloudy"),
        _nav(0, 1, lights, "Licht", "lightbulb-group"),
        _nav(1, 1, climate, "Klima", "home-thermometer"),
        _nav(2, 1, media, "Medien", "music"),
        _tile("status", 0, 2, title="Status"),
        _tile("action", 1, 2, title="Alles aus", icon="power"),
        _tile("settings", 2, 2, title="Einstellungen", icon="cog"),
    ]
    complete = _with(_layout([home, lights, climate, media], "modern_dark"), night={"brightness": 10, "dim": 40}, screensaver={"after": 180})
    complete["settings"]["home_after"] = 120
    out.append({"id": "complete", "name": "Smart Home komplett", "description": "4 Seiten mit Navigation, Nachtmodus und Bildschirmschoner", "layout": complete})
    return out

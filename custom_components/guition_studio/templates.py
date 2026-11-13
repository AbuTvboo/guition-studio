"""Built-in layout templates (pure module).

Templates contain no entity ids; after applying a template the editor marks
tiles without an entity so the user can assign them by drag and drop.
"""

from __future__ import annotations

from typing import Any

from .const import FREE_COLS, FREE_STEP
from .layout import default_settings, default_style, free_rows, make_tile, new_id


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
    out.extend(_design_templates())
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


# --------------------------------------------------------------------------- 4" design templates
# Recreations of design mockups. Start pages use the free layout so the arrangement matches
# the pictures; positions are given in pixels of the page area (464 px wide, 420 px high on a
# single page, 396 px with page dots) and converted to the FREE_STEP grid. Photos and smooth
# gradients are not possible on the RGB565 panel, so the look is carried by flat tile colours,
# coloured borders, icon frames and the "only the icon lights up" effect.


def _st(**kw: Any) -> dict:
    return {**default_style(), **kw}


def _ft(t: str, x: int, y: int, w: int, h: int, title: str = "", icon: str | None = None, style: dict | None = None, **kw: Any) -> dict:
    """Tile on a free page, coordinates in pixels (multiples of FREE_STEP)."""
    assert all(v % FREE_STEP == 0 for v in (x, y, w, h)), (title, x, y, w, h)
    tile = _tile(t, x // FREE_STEP, y // FREE_STEP, w // FREE_STEP, h // FREE_STEP, title=title, icon=icon, **kw)
    if style:
        tile["style"] = style
    return tile


def _free_page(name: str, tiles: list[dict], background: str) -> dict:
    page = _page(name, tiles)
    page["free"] = True
    page["background"] = background
    return page


def _sub(name: str, tiles: list[dict], background: str | None = None) -> dict:
    page = _page(name, tiles)
    page["background"] = background
    return page


def _design(pages: list[dict], theme: str) -> dict:
    layout = _layout(pages, theme)
    for page in pages:
        if page.get("free"):
            page["cols"], page["rows"] = FREE_COLS, free_rows(layout["settings"], len(pages))
    return layout


def _go(page: dict) -> dict:
    return {"action": "navigate", "page": page["id"]}


def _grid6(name: str, tile_type: str, label: str, icon: str, background: str | None = None) -> dict:
    """Sub page: six tiles of one type and a back button."""
    tiles = [_tile(tile_type, x, y, title=f"{label} {y * 3 + x + 1}", icon=icon) for y in range(2) for x in range(3)]
    return _sub(name, tiles + [_back(0, 2, 3)], background)


def _design_templates() -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []

    # 1 ── dark glass: four room cards with a yellow light button, climate, energy, scenes
    card = {"background": "#1E2735", "radius": 20, "align": "left", "font_size": "l", "icon_size": "l", "icon_frame": "rounded",
            "on_effect": "icon", "on_color": "#FFC531", "border_width": 1, "border_color": "#2E3A4D"}  # fmt: skip
    scene = {"radius": 18, "align": "center", "icon_size": "s", "icon_color": "#FFFFFF", "color": "#FFFFFF", "border_width": 1}
    glass = _free_page(
        "Home Assistant",
        [
            _ft("light", 0, 0, 228, 124, "Wohnzimmer", "sofa", _st(**card)),
            _ft("light", 236, 0, 228, 124, "Küche", "silverware-fork-knife", _st(**card)),
            _ft("light", 0, 132, 228, 124, "Schlafzimmer", "bed", _st(**card)),
            _ft("light", 236, 132, 228, 124, "Bad", "shower", _st(**card)),
            _ft("thermostat", 0, 264, 228, 88, "Klima", "thermometer",
                _st(background="#2E241E", icon_color="#FF9F43", radius=18, border_width=1, border_color="#5A3B22")),
            _ft("graph", 236, 264, 228, 88, "Energie", "lightning-bolt",
                _st(background="#102A24", icon_color="#2EE59D", color="#E6FFF5", radius=18, border_width=1, border_color="#1E6B52"), hours=12),
            _ft("action", 0, 360, 148, 60, "Relax", "sofa", _st(**scene, background="#4C2F7A", border_color="#8E5CE0")),
            _ft("action", 156, 360, 152, 60, "Nacht", "weather-night", _st(**scene, background="#233A80", border_color="#4F7BEA")),
            _ft("action", 316, 360, 148, 60, "Abwesend", "home-outline", _st(**scene, background="#0F5E5A", border_color="#2BC4B4")),
        ],
        "#0B1220",
    )
    out.append({"id": "design_glass", "name": "Design: Glas Nacht", "description": "Dunkle Raumkarten mit gelbem Licht-Button, Klima, Energie-Verlauf und Szenen",
                "layout": _design([glass], "modern_dark")})  # fmt: skip

    # 2 ── light: clock + weather, "all lights", four categories with sub pages, room row
    def cat(color: str) -> dict:
        return _st(background="#FFFFFF", icon_color=color, icon_size="s", align="left", font_size="l",
                   radius=16, border_width=2, border_color=color)  # fmt: skip

    room = {"background": "#FFFFFF", "icon_color": "#4B5563", "align": "left", "radius": 16, "on_color": "#DCEBFB", "on_text_color": "#1F2937"}
    lights = _grid6("Lichter", "dimmer", "Licht", "lightbulb")
    blinds = _grid6("Jalousien", "cover", "Jalousie", "blinds")
    plugs = _grid6("Steckdosen", "switch", "Steckdose", "power-socket-de")
    heat = _sub("Heizung", [
        _tile("thermostat", 0, 0, 2, 1, title="Wohnzimmer", icon="radiator"), _tile("sensor", 2, 0, title="Außen", icon="thermometer"),
        _tile("thermostat", 0, 1, 2, 1, title="Schlafzimmer", icon="radiator"), _tile("sensor", 2, 1, title="Luftfeuchte", icon="water-percent"),
        _back(0, 2, 3),
    ])  # fmt: skip
    bright = _free_page(
        "Zuhause",
        [
            _ft("clock", 0, 0, 228, 80, style=_st(background="#FFFFFF", font_size="xl", align="left", radius=16)),
            _ft("weather", 236, 0, 228, 80, "Wetter", "weather-partly-cloudy", _st(background="#FFFFFF", radius=16)),
            _ft("light", 0, 88, 464, 76, "Alle Lichter", "lightbulb",
                _st(background="#FFFFFF", icon_color="#F5B400", icon_size="s", align="left", on_effect="icon", on_color="#F5B400", radius=16)),
            _ft("nav", 0, 172, 228, 64, "Lichter", "lightbulb", cat("#F5B400"), tap_action=_go(lights)),
            _ft("nav", 236, 172, 228, 64, "Jalousien", "blinds", cat("#2F80ED"), tap_action=_go(blinds)),
            _ft("nav", 0, 244, 228, 64, "Steckdosen", "power-socket-de", cat("#22A447"), tap_action=_go(plugs)),
            _ft("nav", 236, 244, 228, 64, "Heizung", "thermometer", cat("#EF4444"), tap_action=_go(heat)),
            _ft("light", 0, 316, 108, 80, "Wohnzimmer", "sofa", _st(**{**room, "background": "#E3F0FD"})),
            _ft("light", 116, 316, 112, 80, "Küche", "silverware-fork-knife", _st(**room)),
            _ft("light", 236, 316, 112, 80, "Schlafzimmer", "bed", _st(**room)),
            _ft("light", 356, 316, 108, 80, "Flur", "door", _st(**room)),
        ],
        "#EEF2F7",
    )
    out.append({"id": "design_bright", "name": "Design: Hell & klar", "description": "Uhr und Wetter, „Alle Lichter“, vier Bereiche mit Unterseiten und Räume",
                "layout": _design([bright, lights, blinds, plugs, heat], "modern_light")})  # fmt: skip

    # 3 ── neon: big dimmer in the middle, coloured outlines, scene row
    def neon(color: str, **kw: Any) -> dict:
        return _st(**{"background": "#10131C", "border_width": 2, "border_color": color, "icon_color": color, "align": "left",
                      "font_size": "l", "icon_size": "l", "radius": 18, **kw})  # fmt: skip

    n_lamps = _grid6("Lampen", "dimmer", "Lampe", "ceiling-light", "#05070C")
    n_plugs = _grid6("Steckdosen", "switch", "Steckdose", "power-socket-de", "#05070C")
    n_blinds = _grid6("Rollläden", "cover", "Rollladen", "window-shutter", "#05070C")
    neon_home = _free_page(
        "Smart Home",
        [
            _ft("nav", 0, 0, 120, 140, "Lampen", "lightbulb-outline", neon("#F5B342"), tap_action=_go(n_lamps)),
            _ft("nav", 0, 148, 120, 140, "Rollläden", "blinds", neon("#8B7CF6"), tap_action=_go(n_blinds)),
            _ft("dimmer", 128, 0, 208, 288, "Wohnzimmer", "ceiling-light",
                neon("#F5B342", align="center", font_size="xl", state_size="xl", radius=60, border_width=3, on_effect="icon", on_color="#FFB547", icon_frame="ring")),
            _ft("nav", 344, 0, 120, 140, "Steckdosen", "power-plug", neon("#34D399"), tap_action=_go(n_plugs)),
            _ft("sensor", 344, 148, 120, 140, "Temperatur", "thermometer", neon("#38BDF8")),
            _ft("action", 0, 300, 108, 96, "Kino", "movie-open", neon("#38BDF8", align="center", border_width=3)),
            _ft("action", 116, 300, 112, 96, "Essen", "silverware-fork-knife", neon("#F5B342", align="center")),
            _ft("action", 236, 300, 112, 96, "Schlafen", "weather-night", neon("#8B7CF6", align="center")),
            _ft("action", 356, 300, 108, 96, "Party", "music", neon("#E879F9", align="center")),
        ],
        "#05070C",
    )
    out.append({"id": "design_neon", "name": "Design: Neon Dimmer", "description": "Großer Dimmer in der Mitte, farbige Leuchtrahmen, Szenen und drei Unterseiten",
                "layout": _design([neon_home, n_lamps, n_plugs, n_blinds], "amoled")})  # fmt: skip

    # 4 ── colourful room cards: two devices + a bright button per room, mode row
    def dev(bg: str) -> dict:
        return _st(background=bg, align="left", icon_size="s", radius=14, on_effect="icon", on_color="#FFD60A", icon_color="#FFFFFF", color="#FFFFFF")

    def btn(bg: str) -> dict:
        return _st(background=bg, align="center", font_size="l", radius=14, icon_color="#FFFFFF", color="#FFFFFF")

    sub4: dict[str, dict] = {}
    for name, bg, accent in (("Wohnzimmer", "#12305C", "#0A84FF"), ("Küche", "#4A2A12", "#FF7A1A"), ("Büro", "#123F22", "#22B14C")):
        sub4[name] = _sub(name, [
            _tile("dimmer", 0, 0, 2, 1, title="Deckenlicht", icon="ceiling-light", style=_st(on_color=accent)),
            _tile("light", 2, 0, title="Lampe", icon="lamp", style=_st(on_color=accent)),
            _tile("switch", 0, 1, title="Steckdose", icon="power-socket-de", style=_st(on_color=accent)),
            _tile("cover", 1, 1, title="Rollladen", icon="window-shutter"),
            _tile("sensor", 2, 1, title="Temperatur", icon="thermometer"),
            _back(0, 2, 3),
        ], bg)  # fmt: skip
    mode = {"background": "#1F2630", "align": "center", "font_size": "l", "radius": 16, "color": "#FFFFFF", "icon_color": "#FFFFFF"}
    rooms = _free_page(
        "Home Assistant",
        [
            _ft("light", 0, 0, 108, 76, "Licht", "lightbulb", dev("#12305C")),
            _ft("switch", 116, 0, 112, 76, "TV", "television", dev("#12305C")),
            _ft("nav", 0, 84, 228, 52, "Wohnzimmer", "sofa", btn("#0A84FF"), tap_action=_go(sub4["Wohnzimmer"]), show_icon=False),
            _ft("light", 236, 0, 112, 76, "Licht", "lightbulb", dev("#4A2A12")),
            _ft("switch", 356, 0, 108, 76, "Lüfter", "fan", dev("#4A2A12")),
            _ft("nav", 236, 84, 228, 52, "Küche", "silverware-fork-knife", btn("#FF7A1A"), tap_action=_go(sub4["Küche"]), show_icon=False),
            _ft("light", 0, 148, 108, 76, "Licht", "lightbulb", dev("#34205A")),
            _ft("cover", 116, 148, 112, 76, "Rollladen", "window-shutter", dev("#34205A")),
            _ft("action", 0, 232, 228, 52, "Schlafmodus", "bed", btn("#8B3DFF"), show_icon=False),
            _ft("light", 236, 148, 112, 76, "Licht", "lightbulb", dev("#123F22")),
            _ft("switch", 356, 148, 108, 76, "Steckdose", "power-socket-de", dev("#123F22")),
            _ft("nav", 236, 232, 228, 52, "Büro", "desk-lamp", btn("#22B14C"), tap_action=_go(sub4["Büro"]), show_icon=False),
            _ft("action", 0, 296, 108, 100, "Zuhause", "home", _st(**{**mode, "background": "#0A84FF"})),
            _ft("action", 116, 296, 112, 100, "Gäste", "account", _st(**mode)),
            _ft("action", 236, 296, 112, 100, "Nacht", "weather-night", _st(**mode)),
            _ft("action", 356, 296, 108, 100, "Alles aus", "power", _st(**{**mode, "icon_color": "#FF453A"})),
        ],
        "#0B0F14",
    )
    out.append({"id": "design_rooms", "name": "Design: Raumkarten bunt", "description": "Vier farbige Räume mit je zwei Geräten und Steuer-Button, Modus-Leiste",
                "layout": _design([rooms, *sub4.values()], "modern_dark")})  # fmt: skip

    # 5 ── warm black/gold: big clock banner, five categories, rooms, scenes
    gold = "#F5A524"

    def warm(**kw: Any) -> dict:
        return _st(**{"background": "#1C1915", "border_width": 1, "border_color": "#3A2E1E", "icon_color": "#F2E6D0", "color": "#F2E6D0",
                      "on_color": "#4A3412", "on_text_color": "#FFD58A", "radius": 18, "align": "center", **kw})  # fmt: skip

    evening = _free_page(
        "Zuhause",
        [
            _ft("clock", 0, 0, 464, 100, style=warm(background="#2A1E12", border_color="#6B4A1E", color="#F5C77E", font_size="xxl")),
            _ft("light", 0, 108, 88, 112, "Lichter", "lightbulb-outline", warm(icon_color=gold, border_color=gold, border_width=2)),
            _ft("cover", 96, 108, 88, 112, "Rollläden", "blinds", warm()),
            _ft("switch", 192, 108, 88, 112, "Steckdosen", "power-plug", warm()),
            _ft("sensor", 288, 108, 88, 112, "Heizung", "thermometer", warm(icon_color="#FF7A3D")),
            _ft("sensor", 384, 108, 80, 112, "Alarm", "shield-home", warm()),
            _ft("light", 0, 228, 108, 80, "Wohnzimmer", "sofa", warm(align="left", icon_color=gold, border_color="#6B4A1E")),
            _ft("light", 116, 228, 112, 80, "Küche", "silverware-fork-knife", warm(align="left")),
            _ft("light", 236, 228, 112, 80, "Schlafzimmer", "bed", warm(align="left")),
            _ft("light", 356, 228, 108, 80, "Büro", "desk-lamp", warm(align="left")),
            _ft("action", 0, 316, 108, 104, "Abend", "weather-sunny", warm(background="#3A2810", border_color=gold, border_width=2, icon_color=gold, font_size="l")),
            _ft("action", 116, 316, 112, 104, "Film", "movie-open", warm(font_size="l")),
            _ft("action", 236, 316, 112, 104, "Schlafen", "weather-night", warm(icon_color="#FFD58A", font_size="l")),
            _ft("action", 356, 316, 108, 104, "Alles aus", "power", warm(font_size="l")),
        ],
        "#0D0B08",
    )
    out.append({"id": "design_evening", "name": "Design: Abendgold", "description": "Warmes Schwarz-Gold mit großer Uhr, Kategorien, Räumen und Szenen",
                "layout": _design([evening], "modern_dark")})  # fmt: skip

    # 6 ── light and airy: four big category cards, four rooms, mode bar
    def soft(bg: str, icon: str, **kw: Any) -> dict:
        return _st(**{"background": bg, "icon_color": icon, "color": "#1F2937", "radius": 20, "align": "center", "border_width": 1,
                      "border_color": "#E3E8EF", "on_color": "#DCEBFB", "on_text_color": "#1F2937", **kw})  # fmt: skip

    big = {"font_size": "l", "icon_size": "l"}
    airy = _free_page(
        "Home Assistant",
        [
            _ft("light", 0, 0, 108, 160, "Lampen", "ceiling-light", soft("#FFFFFF", "#F5B400", **big, on_effect="icon", on_color="#F5B400")),
            _ft("sensor", 116, 0, 112, 160, "Heizung", "thermometer", soft("#FFF4EA", "#E5533D", **big)),
            _ft("cover", 236, 0, 112, 160, "Rollläden", "window-shutter", soft("#FFFFFF", "#2F5E9E", **big)),
            _ft("switch", 356, 0, 108, 160, "Steckdosen", "power-socket-de", soft("#FFFFFF", "#374151", **big)),
            _ft("light", 0, 168, 108, 132, "Wohnzimmer", "sofa", soft("#EEF5FC", "#374151", align="left")),
            _ft("light", 116, 168, 112, 132, "Küche", "silverware-fork-knife", soft("#FDF6EE", "#374151", align="left")),
            _ft("light", 236, 168, 112, 132, "Bad", "shower", soft("#EEF5FC", "#374151", align="left")),
            _ft("light", 356, 168, 108, 132, "Schlafzimmer", "bed", soft("#FDF6EE", "#374151", align="left")),
            _ft("action", 0, 308, 108, 112, "Zuhause", "home", soft("#DCEBFB", "#1E6FD9", color="#1E4E8C", font_size="l")),
            _ft("action", 116, 308, 112, 112, "Nacht", "weather-night", soft("#FFFFFF", "#374151", font_size="l")),
            _ft("action", 236, 308, 112, 112, "Gäste", "account", soft("#FFFFFF", "#374151", font_size="l")),
            _ft("action", 356, 308, 108, 112, "Urlaub", "map-marker", soft("#FFFFFF", "#374151", font_size="l")),
        ],
        "#F3F6FA",
    )
    out.append({"id": "design_airy", "name": "Design: Hell kompakt", "description": "Große helle Kategorie-Karten, Räume und Modus-Leiste",
                "layout": _design([airy], "modern_light")})  # fmt: skip

    # 7 ── cyan glow: light dimmer in the middle, four side cards, scene row
    cyan = "#1FD1C4"

    def glow(color: str = cyan, **kw: Any) -> dict:
        return _st(**{"background": "#0A1F22", "border_width": 2, "border_color": color, "icon_color": color, "color": "#E8FFFD",
                      "align": "left", "font_size": "l", "icon_size": "l", "radius": 22, **kw})  # fmt: skip

    teal = _free_page(
        "Smart Home",
        [
            _ft("sensor", 0, 0, 132, 152, "Klima", "snowflake", glow()),
            _ft("cover", 0, 160, 132, 152, "Rollläden", "window-shutter", glow()),
            _ft("dimmer", 140, 0, 184, 312, "Lichter", "lightbulb-outline",
                glow(align="center", font_size="xl", state_size="xl", radius=60, border_width=3, icon_color="#FF9F1C", on_effect="icon", on_color="#FF9F1C", icon_frame="ring")),
            _ft("switch", 332, 0, 132, 152, "Steckdosen", "power-socket-de", glow()),
            _ft("sensor", 332, 160, 132, 152, "Alarm", "shield-home", glow("#FFB020", background="#2A1A08")),
            _ft("action", 0, 320, 108, 100, "Morgen", "weather-sunny", glow(align="center", icon_color="#FFB020", icon_size="auto")),
            _ft("action", 116, 320, 112, 100, "Arbeiten", "keyboard", glow(align="center", icon_size="auto")),
            _ft("action", 236, 320, 112, 100, "Entspannen", "flower", glow(align="center", icon_size="auto")),
            _ft("action", 356, 320, 108, 100, "Party", "music", glow("#FFB020", background="#2A1A08", align="center", icon_size="auto")),
        ],
        "#03080A",
    )
    out.append({"id": "design_cyan", "name": "Design: Cyan Glow", "description": "Türkise Leuchtrahmen, Licht-Dimmer in der Mitte, Klima, Alarm und Szenen",
                "layout": _design([teal], "amoled")})  # fmt: skip

    # 8 ── playful colours: four rooms with two devices and a big switch bar each, scene row
    def tint(bg: str) -> dict:
        return _st(background=bg, align="left", icon_size="s", radius=14, color="#FFFFFF", icon_color="#FFD60A", on_effect="icon", on_color="#FFD60A")

    def bar(bg: str, text: str = "#1A1200") -> dict:
        return _st(background=bg, align="left", icon_size="s", radius=30, color=text, icon_color=text, on_color=bg, on_text_color=text)

    fun = {"background": "#1B2238", "align": "center", "font_size": "l", "radius": 16, "color": "#FFFFFF"}
    play = _free_page(
        "Zuhause",
        [
            _ft("light", 0, 0, 108, 76, "Licht", "lightbulb", tint("#5A2430")),
            _ft("switch", 116, 0, 112, 76, "Lüfter", "fan", tint("#5A2430")),
            _ft("light", 0, 84, 228, 64, "Wohnzimmer", "sofa", bar("#F59E0B"), show_state=False),
            _ft("light", 236, 0, 112, 76, "Licht", "lightbulb", tint("#1D4A35")),
            _ft("sensor", 356, 0, 108, 76, "Luftfeuchte", "water-percent", tint("#1D4A35")),
            _ft("switch", 236, 84, 228, 64, "Steckdose", "power-socket-de", bar("#4ADE80"), show_state=False),
            _ft("light", 0, 156, 108, 76, "Licht", "lightbulb", tint("#1E3A6B")),
            _ft("sensor", 116, 156, 112, 76, "Bewegung", "motion-sensor", tint("#1E3A6B")),
            _ft("switch", 0, 240, 228, 64, "Flurlicht (Auto)", "run", bar("#60A5FA"), show_state=False),
            _ft("light", 236, 156, 112, 76, "Licht", "lightbulb", tint("#3D2466")),
            _ft("sensor", 356, 156, 108, 76, "Luftfeuchte", "water-percent", tint("#3D2466")),
            _ft("switch", 236, 240, 228, 64, "Lüfter", "fan", bar("#A855F7", "#FFFFFF"), show_state=False),
            _ft("action", 0, 312, 108, 108, "Alles an", "weather-sunny", _st(**{**fun, "icon_color": "#FFD60A"})),
            _ft("action", 116, 312, 112, 108, "Alles aus", "power", _st(**{**fun, "icon_color": "#A5B4FC"})),
            _ft("action", 236, 312, 112, 108, "Nacht", "weather-night", _st(**{**fun, "icon_color": "#C7D2FE"})),
            _ft("action", 356, 312, 108, 108, "Favoriten", "star", _st(**{**fun, "background": "#4A1D3A", "icon_color": "#F472B6"})),
        ],
        "#10162A",
    )
    out.append({"id": "design_playful", "name": "Design: Bunt verspielt", "description": "Vier farbige Räume mit Geräten und großem Schalter, Szenen-Leiste",
                "layout": _design([play], "modern_dark")})  # fmt: skip
    # Real room textures and controls shared by the editor and the display.
    for tile, texture in zip(glass["tiles"][:4], ("living", "kitchen", "bedroom", "bathroom")):
        tile["style"].update(texture=texture, font_size="l", icon_size="m", icon_frame="none")
    for page in (neon_home, teal):
        for tile in page["tiles"]:
            if tile["type"] == "dimmer":
                tile["style"].update(control="ring", radius=60, font_size="l", icon_frame="none")
    # Room cards use the existing multi-entity binding and action routing. Each
    # row can be tapped independently; no entity IDs or made-up states ship.
    def room_card(x: int, y: int, name: str, icon: str, texture: str, accent: str) -> dict:
        return _ft("swipe", x, y, 228, 152, name, icon,
                   _st(texture=texture, control="room", color="#FFFFFF", icon_color="#FFFFFF",
                       on_effect="icon", on_color=accent, font_size="l", radius=16,
                       border_width=1, border_color=accent), items=[])

    rooms["tiles"] = [
        room_card(0, 0, "Wohnzimmer", "sofa", "living", "#0A84FF"),
        room_card(236, 0, "Küche", "silverware-fork-knife", "kitchen", "#FF7A1A"),
        room_card(0, 160, "Schlafzimmer", "bed", "bedroom", "#8B3DFF"),
        room_card(236, 160, "Büro", "desk-lamp", "office", "#22B14C"),
        *rooms["tiles"][-4:],
    ]
    for i, tile in enumerate(rooms["tiles"][-4:]):
        tile.update(y=80, h=19)
    # Preserve access to detailed dimmer/cover/temperature controls via hold.
    for tile in rooms["tiles"][:4]:
        if tile["title"] in sub4:
            tile["hold_action"] = _go(sub4[tile["title"]])
    play["tiles"] = [
        room_card(0, 0, "Wohnzimmer", "sofa", "lounge", "#FFB547"),
        room_card(236, 0, "Küche", "silverware-fork-knife", "kitchen", "#4ADE80"),
        room_card(0, 160, "Flur", "door", "hall", "#60A5FA"),
        room_card(236, 160, "Bad", "shower", "bathroom", "#A855F7"),
        *play["tiles"][-4:],
    ]
    for tile in play["tiles"][-4:]:
        tile.update(y=80, h=25)
    evening["tiles"][0].update(type="text", title="Guten Abend", format="", tap_action={"action": "none"})
    evening["tiles"][0]["style"].update(texture="evening", font_size="xl", color="#FFF0CE")
    bright["tiles"][1].update(show_title=False, weather={"condition": True, "hilo": False, "humidity": False, "wind": False, "pressure": False, "forecast": False})
    for tile in evening["tiles"][1:10]:
        tile["style"].update(font_size="s", state_size="s", icon_size="m", on_effect="icon")
    for tile in airy["tiles"][:8]:
        tile["style"].update(font_size="s", state_size="s", on_effect="icon")
    teal["tiles"][3]["style"].update(on_effect="icon")
    for tile in bright["tiles"][-4:]:
        tile["style"].update(font_size="s")
    for page in (neon_home, teal):
        for tile in page["tiles"]:
            if tile["type"] != "dimmer":
                tile["style"].update(font_size="m")
            if tile["type"] == "sensor":
                tile["style"].update(align="center", icon_size="m")
    return out

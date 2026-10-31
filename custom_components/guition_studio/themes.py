"""Built-in design themes (pure module, shared with the editor via the info API)."""

from __future__ import annotations

THEMES: dict[str, dict[str, str]] = {
    "modern_dark": {
        "name": "Modern Dark",
        "page_bg": "#0B0F14",
        "tile_bg": "#1C232C",
        "text": "#E6EDF3",
        "muted": "#8B98A5",
        "icon": "#9CC4FF",
        "on_bg": "#FFB547",
        "on_text": "#1A1200",
        "header_bg": "#0B0F14",
        "header_text": "#E6EDF3",
        "accent": "#3D8BFD",
        "ok": "#2EA043",
        "error": "#F85149",
    },
    "modern_light": {
        "name": "Modern Light",
        "page_bg": "#EEF1F5",
        "tile_bg": "#FFFFFF",
        "text": "#1F2937",
        "muted": "#6B7280",
        "icon": "#2563EB",
        "on_bg": "#FBBF24",
        "on_text": "#1F1300",
        "header_bg": "#EEF1F5",
        "header_text": "#111827",
        "accent": "#2563EB",
        "ok": "#16A34A",
        "error": "#DC2626",
    },
    "minimal": {
        "name": "Minimal",
        "page_bg": "#121212",
        "tile_bg": "#1E1E1E",
        "text": "#F5F5F5",
        "muted": "#9E9E9E",
        "icon": "#F5F5F5",
        "on_bg": "#F5F5F5",
        "on_text": "#121212",
        "header_bg": "#121212",
        "header_text": "#F5F5F5",
        "accent": "#FFFFFF",
        "ok": "#9CCC65",
        "error": "#EF5350",
    },
    "pastel": {
        "name": "Pastel",
        "page_bg": "#FDF6F0",
        "tile_bg": "#FFFFFF",
        "text": "#4A4453",
        "muted": "#9A8FA6",
        "icon": "#B388EB",
        "on_bg": "#F7C59F",
        "on_text": "#3D2C1E",
        "header_bg": "#FDF6F0",
        "header_text": "#4A4453",
        "accent": "#B388EB",
        "ok": "#7BC8A4",
        "error": "#E57373",
    },
    "amoled": {
        "name": "AMOLED Black",
        "page_bg": "#000000",
        "tile_bg": "#0D0D0D",
        "text": "#FFFFFF",
        "muted": "#7A7A7A",
        "icon": "#00E5FF",
        "on_bg": "#00E5FF",
        "on_text": "#000000",
        "header_bg": "#000000",
        "header_text": "#FFFFFF",
        "accent": "#00E5FF",
        "ok": "#00E676",
        "error": "#FF1744",
    },
}

DEFAULT_THEME = "modern_dark"


def get_theme(name: str | None) -> dict[str, str]:
    """Return a theme by key, falling back to the default theme."""
    return THEMES.get(name or DEFAULT_THEME, THEMES[DEFAULT_THEME])

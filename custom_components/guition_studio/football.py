"""Football fixtures for the screensaver (pure module, unit tested).

Source: ESPN's public soccer scoreboard (no API key), one request per league and day:
    https://site.api.espn.com/apis/site/v2/sports/soccer/<league>/scoreboard?dates=YYYYMMDD
(date ranges are rejected by the endpoint). The endpoint is unofficial; parsing is
defensive and unknown fields are ignored. Team names come in English and are lightly
corrected (NAME_FIX).

The display gets one compact JSON document (action gs_football):
    {"h": "Heute", "g": [["Bundesliga", [[time_or_score, home, away, state, minute], ...]], ...]}
state: 0 = upcoming, 1 = live, 2 = finished.
"""

from __future__ import annotations

from datetime import date, datetime, timedelta, tzinfo
import json
from typing import Any

SCOREBOARD_URL = "https://site.api.espn.com/apis/site/v2/sports/soccer/{league}/scoreboard"

# Selectable competitions (ESPN code -> name shown on the display), in display order.
LEAGUES: dict[str, str] = {
    "ger.1": "Bundesliga",
    "ger.2": "2. Bundesliga",
    "tur.1": "Süper Lig",
    "esp.1": "LaLiga",
    "eng.1": "Premier League",
    "ita.1": "Serie A",
    "fra.1": "Ligue 1",
    "uefa.champions": "Champions League",
}
DEFAULT_LEAGUES = ["ger.1", "tur.1", "esp.1"]
LOOKAHEAD_DAYS = 7  # without matches today, the next match day within a week is shown
MAX_MATCHES = 40
MAX_PAYLOAD = 6000

TEXTS: dict[str, dict[str, str]] = {
    "de": {"today": "Heute", "next": "Nächste Spiele", "none": "Keine Spiele in den nächsten 7 Tagen", "ht": "HZ",
           "error": "Keine Spieldaten erreichbar", "days": "Mo Di Mi Do Fr Sa So"},
    "tr": {"today": "Bugün", "next": "Sonraki maçlar", "none": "Önümüzdeki 7 günde maç yok", "ht": "İY",
           "error": "Maç verisine ulaşılamıyor", "days": "Pzt Sal Çar Per Cum Cmt Paz"},
}  # fmt: skip


def scoreboard_params(day: date) -> dict[str, str]:
    return {"dates": f"{day:%Y%m%d}", "limit": "100"}


# ESPN short names (English, no diacritics) -> names as fans know them
NAME_FIX: dict[str, str] = {
    "Cologne": "Köln", "Bayern Munich": "Bayern", "Munich": "Bayern", "Monchengladbach": "M'gladbach",
    "Borussia Monchengladbach": "M'gladbach", "Nuremberg": "Nürnberg", "Dusseldorf": "Düsseldorf",
    "Furth": "Fürth", "Greuther Furth": "Fürth", "Koln": "Köln",
    "Besiktas": "Beşiktaş", "Fenerbahce": "Fenerbahçe", "Basaksehir": "Başakşehir", "Istanbul Basaksehir": "Başakşehir", "Istanbul BB": "Başakşehir",
    "Eyupspor": "Eyüpspor", "Goztepe": "Göztepe", "Kasimpasa": "Kasımpaşa", "Karagumruk": "Karagümrük",
    "Fatih Karagumruk": "Karagümrük", "Genclerbirligi": "Gençlerbirliği", "Caykur Rizespor": "Rizespor",
    "Atletico Madrid": "Atlético", "Atlético Madrid": "Atlético", "Alaves": "Alavés", "Leganes": "Leganés",
    "Almeria": "Almería", "Cadiz": "Cádiz", "Malaga": "Málaga",
}  # fmt: skip


def _team(comp: dict[str, Any]) -> str:
    team = comp.get("team") or {}
    name = str(team.get("shortDisplayName") or team.get("displayName") or team.get("abbreviation") or "?")
    return NAME_FIX.get(name, name)[:22]


def parse_scoreboard(data: Any, tz: tzinfo | None) -> list[dict[str, Any]]:
    """ESPN scoreboard JSON -> matches sorted by kick-off: when (aware), home, away, scores, state, minute."""
    out: list[dict[str, Any]] = []
    events = data.get("events") if isinstance(data, dict) else None
    for ev in events or []:
        try:
            comp = (ev.get("competitions") or [None])[0] or {}
            teams = comp.get("competitors") or []
            home = next(c for c in teams if c.get("homeAway") == "home")
            away = next(c for c in teams if c.get("homeAway") == "away")
            when = datetime.fromisoformat(str(ev.get("date") or comp.get("date")).replace("Z", "+00:00")).astimezone(tz)
        except (StopIteration, TypeError, ValueError, AttributeError):
            continue
        status = (comp.get("status") or ev.get("status") or {}).get("type") or {}
        clock = (comp.get("status") or ev.get("status") or {}).get("displayClock") or ""
        state = {"pre": 0, "in": 1, "post": 2}.get(status.get("state"), 0)
        if status.get("name") in ("STATUS_POSTPONED", "STATUS_CANCELED", "STATUS_ABANDONED"):
            state = 3
        out.append(
            {
                "id": str(ev.get("id") or f"{when.isoformat()}-{_team(home)}"),
                "when": when,
                "home": _team(home),
                "away": _team(away),
                "hs": str(home.get("score", "")),
                "as": str(away.get("score", "")),
                "state": state,
                "halftime": status.get("name") == "STATUS_HALFTIME",
                "minute": str(clock)[:6],
            }
        )
    out.sort(key=lambda m: m["when"])
    return out


def build_payload(
    leagues: dict[str, list[dict[str, Any]] | None], lang: str, now: datetime
) -> dict[str, Any]:
    """Pick today's matches (or the next match day) per league and build the display document.

    leagues: ESPN code -> parsed matches (None = could not be loaded).
    """
    tx = TEXTS.get(lang, TEXTS["de"])
    days = tx["days"].split()
    today = now.date()
    loaded = {k: v for k, v in leagues.items() if v is not None}
    if not loaded:
        return {"h": tx["error"], "g": []}
    todays = {k: [m for m in v if m["when"].date() == today] for k, v in loaded.items()}
    if any(todays.values()):
        chosen, header, show_day = todays, tx["today"], False
    else:
        upcoming = [m["when"].date() for v in loaded.values() for m in v if m["when"].date() > today]
        if not upcoming:
            return {"h": tx["none"], "g": []}
        # next match day of each league (leagues play on different days, so up to 3 days ahead)
        first = min(upcoming)
        chosen = {
            k: [m for m in v if first <= m["when"].date() <= first + timedelta(days=2)] for k, v in loaded.items()
        }
        header, show_day = tx["next"], True

    groups = []
    count = 0
    for code in LEAGUES:  # fixed order
        matches = chosen.get(code) or []
        rows = []
        for m in matches:
            if count >= MAX_MATCHES:
                break
            count += 1
            if m["state"] in (1, 2):
                first_col = f"{m['hs']}:{m['as']}"
            elif m["state"] == 3:
                first_col = "–"
            else:
                first_col = m["when"].strftime("%H:%M")
                if show_day:
                    first_col = f"{days[m['when'].weekday()]} {first_col}"
            minute = tx["ht"] if m["halftime"] else (m["minute"] if m["state"] == 1 else "")
            rows.append([first_col, m["home"], m["away"], m["state"], minute])
        if rows:
            groups.append([LEAGUES[code], rows])
    doc = {"h": header, "g": groups}
    while len(json.dumps(doc, ensure_ascii=False).encode()) > MAX_PAYLOAD and groups:
        groups[-1][1].pop()  # keep the document small for the API action
        if not groups[-1][1]:
            groups.pop()
    return doc


def has_live(leagues: dict[str, list[dict[str, Any]] | None], now: datetime) -> bool:
    """Live matches (or kick-off within 15 minutes) -> refresh every minute."""
    soon = now + timedelta(minutes=15)
    return any(
        m["state"] == 1 or (m["state"] == 0 and now - timedelta(minutes=5) <= m["when"] <= soon)
        for v in leagues.values()
        if v
        for m in v
    )

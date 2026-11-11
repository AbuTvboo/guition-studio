"""Football fixtures for the screensaver (pure module, unit tested).

Source: ESPN's public soccer scoreboard (no API key), one request per league and day:
    https://site.api.espn.com/apis/site/v2/sports/soccer/<league>/scoreboard?dates=YYYYMMDD
(date ranges are rejected by the endpoint). The endpoint is unofficial; parsing is
defensive and unknown fields are ignored. Team names come in English and are lightly
corrected (NAME_FIX).

The display gets one compact JSON document (action gs_football):
    {"h": "HEUTE", "t": ["FUSSBALL", "ENDE", "ABGESAGT"],
     "g": [["BUNDESLIGA", [[time_or_score, home, away, state, minute, home_logo, away_logo], ...], "D20515"], ...]}
state: 0 = upcoming, 1 = live, 2 = finished, 3 = postponed. Logos are ESPN team ids; the
pictures are sent separately once per boot (action gs_logo, see logo_rgb565a8()).
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
    # national teams: only shown while matches are played (international breaks, tournaments)
    "uefa.nations": "Nations League",
    "uefa.euro": "EM",
    "uefa.euroq": "EM-Qualifikation",
    "fifa.world": "WM",
    "fifa.worldq.uefa": "WM-Qualifikation (Europa)",
}
NATIONAL = {"uefa.nations", "uefa.euro", "uefa.euroq", "fifa.world", "fifa.worldq.uefa"}
DEFAULT_LEAGUES = ["ger.1", "tur.1", "esp.1"]
# colour of the competition strip (sports TV look), bright enough on the dark background
LEAGUE_COLORS: dict[str, str] = {
    "ger.1": "D20515", "ger.2": "B0121F", "tur.1": "E30A17", "esp.1": "EE5A24",
    "eng.1": "6A1B9A", "ita.1": "1565C0", "fra.1": "2E5AAC", "uefa.champions": "1A3A8F",
    "uefa.nations": "0B8A6F", "uefa.euro": "1E50A0", "uefa.euroq": "1E50A0", "fifa.world": "B8860B", "fifa.worldq.uefa": "B8860B",
}  # fmt: skip
LOOKAHEAD_DAYS = 7  # without matches today, the next match day within a week is shown
MAX_MATCHES = 40
MAX_PAYLOAD = 6000

TEXTS: dict[str, dict[str, str]] = {
    "de": {"today": "HEUTE", "next": "NÄCHSTE SPIELE", "none": "Keine Spiele in den nächsten 7 Tagen", "ht": "HZ",
           "error": "Keine Spieldaten erreichbar", "days": "MO DI MI DO FR SA SO",
           "title": "FUSSBALL", "end": "ENDE", "off": "ABGESAGT"},
    "tr": {"today": "BUGÜN", "next": "SONRAKİ MAÇLAR", "none": "Önümüzdeki 7 günde maç yok", "ht": "İY",
           "error": "Maç verisine ulaşılamıyor", "days": "PZT SAL ÇAR PER CUM CMT PAZ",
           "title": "FUTBOL", "end": "BİTTİ", "off": "ERTELENDİ"},
}  # fmt: skip
# competition names in capitals (str.upper() would turn the Turkish "i" into a dotless "I")
LEAGUE_TITLES: dict[str, str] = {
    "ger.1": "BUNDESLIGA", "ger.2": "2. BUNDESLIGA", "tur.1": "SÜPER LİG", "esp.1": "LALIGA",
    "eng.1": "PREMIER LEAGUE", "ita.1": "SERIE A", "fra.1": "LIGUE 1", "uefa.champions": "CHAMPIONS LEAGUE",
    "uefa.nations": "NATIONS LEAGUE", "uefa.euro": "EM", "uefa.euroq": "EM-QUALIFIKATION",
    "fifa.world": "WM", "fifa.worldq.uefa": "WM-QUALIFIKATION",
}  # fmt: skip
LEAGUE_TITLES_TR: dict[str, str] = {
    "uefa.nations": "ULUSLAR LİGİ", "uefa.euro": "AVRUPA ŞAMPİYONASI", "uefa.euroq": "AVRUPA ŞAMP. ELEMELERİ",
    "fifa.world": "DÜNYA KUPASI", "fifa.worldq.uefa": "DÜNYA KUPASI ELEMELERİ",
}  # fmt: skip

# national teams (ESPN English name -> German, Turkish)
NATIONS: dict[str, tuple[str, str]] = {
    "Germany": ("Deutschland", "Almanya"), "Turkey": ("Türkei", "Türkiye"), "Türkiye": ("Türkei", "Türkiye"),
    "France": ("Frankreich", "Fransa"), "Spain": ("Spanien", "İspanya"), "Italy": ("Italien", "İtalya"),
    "England": ("England", "İngiltere"), "Netherlands": ("Niederlande", "Hollanda"), "Portugal": ("Portugal", "Portekiz"),
    "Belgium": ("Belgien", "Belçika"), "Croatia": ("Kroatien", "Hırvatistan"), "Switzerland": ("Schweiz", "İsviçre"),
    "Austria": ("Österreich", "Avusturya"), "Denmark": ("Dänemark", "Danimarka"), "Sweden": ("Schweden", "İsveç"),
    "Norway": ("Norwegen", "Norveç"), "Poland": ("Polen", "Polonya"), "Czechia": ("Tschechien", "Çekya"),
    "Czech Republic": ("Tschechien", "Çekya"), "Slovakia": ("Slowakei", "Slovakya"), "Slovenia": ("Slowenien", "Slovenya"),
    "Hungary": ("Ungarn", "Macaristan"), "Romania": ("Rumänien", "Romanya"), "Bulgaria": ("Bulgarien", "Bulgaristan"),
    "Greece": ("Griechenland", "Yunanistan"), "Serbia": ("Serbien", "Sırbistan"), "Montenegro": ("Montenegro", "Karadağ"),
    "Bosnia-Herzegovina": ("Bosnien-H.", "Bosna-Hersek"), "Bosnia and Herzegovina": ("Bosnien-H.", "Bosna-Hersek"),
    "Albania": ("Albanien", "Arnavutluk"), "North Macedonia": ("Nordmazedonien", "K. Makedonya"), "Kosovo": ("Kosovo", "Kosova"),
    "Georgia": ("Georgien", "Gürcistan"), "Armenia": ("Armenien", "Ermenistan"), "Azerbaijan": ("Aserbaidschan", "Azerbaycan"),
    "Kazakhstan": ("Kasachstan", "Kazakistan"), "Ukraine": ("Ukraine", "Ukrayna"), "Belarus": ("Belarus", "Belarus"),
    "Russia": ("Russland", "Rusya"), "Moldova": ("Moldau", "Moldova"), "Lithuania": ("Litauen", "Litvanya"),
    "Latvia": ("Lettland", "Letonya"), "Estonia": ("Estland", "Estonya"), "Finland": ("Finnland", "Finlandiya"),
    "Iceland": ("Island", "İzlanda"), "Republic of Ireland": ("Irland", "İrlanda"), "Ireland": ("Irland", "İrlanda"),
    "Northern Ireland": ("Nordirland", "K. İrlanda"), "Scotland": ("Schottland", "İskoçya"), "Wales": ("Wales", "Galler"),
    "Faroe Islands": ("Färöer", "Faroe Adaları"), "Luxembourg": ("Luxemburg", "Lüksemburg"),
    "Liechtenstein": ("Liechtenstein", "Lihtenştayn"), "Cyprus": ("Zypern", "Kıbrıs"), "Gibraltar": ("Gibraltar", "Cebelitarık"),
    "Israel": ("Israel", "İsrail"), "Argentina": ("Argentinien", "Arjantin"), "Brazil": ("Brasilien", "Brezilya"),
    "Colombia": ("Kolumbien", "Kolombiya"), "Chile": ("Chile", "Şili"), "Mexico": ("Mexiko", "Meksika"),
    "United States": ("USA", "ABD"), "USA": ("USA", "ABD"), "Canada": ("Kanada", "Kanada"), "Japan": ("Japan", "Japonya"),
    "South Korea": ("Südkorea", "Güney Kore"), "Australia": ("Australien", "Avustralya"),
    "Saudi Arabia": ("Saudi-Arabien", "S. Arabistan"), "Qatar": ("Katar", "Katar"), "Jordan": ("Jordanien", "Ürdün"),
    "Uzbekistan": ("Usbekistan", "Özbekistan"), "Morocco": ("Marokko", "Fas"), "Algeria": ("Algerien", "Cezayir"),
    "Tunisia": ("Tunesien", "Tunus"), "Egypt": ("Ägypten", "Mısır"), "Ghana": ("Ghana", "Gana"),
    "Ivory Coast": ("Elfenbeinküste", "Fildişi Sahili"), "Nigeria": ("Nigeria", "Nijerya"), "Cameroon": ("Kamerun", "Kamerun"),
    "South Africa": ("Südafrika", "Güney Afrika"), "Congo DR": ("DR Kongo", "Kongo DC"), "New Zealand": ("Neuseeland", "Yeni Zelanda"),
    "Cape Verde": ("Kap Verde", "Yeşil Burun"), "Cape Verde Islands": ("Kap Verde", "Yeşil Burun"),
    "Costa Rica": ("Costa Rica", "Kosta Rika"), "Jamaica": ("Jamaika", "Jamaika"), "Haiti": ("Haiti", "Haiti"),
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


LOGO_SIZE = 24
LOGO_URL = "https://a.espncdn.com/i/teamlogos/soccer/500/{id}.png"


def logo_rgb565a8(png: bytes, size: int = LOGO_SIZE) -> bytes:
    """Team logo -> LVGL RGB565A8 (RGB565 little endian plane, then alpha plane), size x size."""
    from io import BytesIO  # noqa: PLC0415

    from PIL import Image  # noqa: PLC0415

    img = Image.open(BytesIO(png)).convert("RGBA")
    bbox = img.getbbox()  # trim transparent borders so the crest fills the square
    if bbox:
        img = img.crop(bbox)
    img.thumbnail((size, size), Image.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.paste(img, ((size - img.width) // 2, (size - img.height) // 2), img)
    rgb = bytearray()
    alpha = bytearray()
    px = canvas.tobytes()  # RGBA, works on every Pillow version
    for i in range(0, len(px), 4):
        r, g, b, a = px[i], px[i + 1], px[i + 2], px[i + 3]
        v = ((r & 0xF8) << 8) | ((g & 0xFC) << 3) | (b >> 3)
        rgb += bytes((v & 0xFF, v >> 8))
        alpha.append(a)
    return bytes(rgb + alpha)


def _logo_id(comp: dict[str, Any]) -> str:
    team = comp.get("team") or {}
    tid = str(team.get("id") or "")
    return tid if tid.isdigit() else ""


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
                "hl": _logo_id(home),
                "al": _logo_id(away),
                "hs": str(home.get("score", "")),
                "as": str(away.get("score", "")),
                "state": state,
                "halftime": status.get("name") == "STATUS_HALFTIME",
                "minute": str(clock)[:6],
            }
        )
    out.sort(key=lambda m: m["when"])
    return out


def nation_name(name: str, lang: str) -> str:
    """National team name in the display language (unknown names stay English)."""
    names = NATIONS.get(name)
    return names[1 if lang == "tr" else 0] if names else name


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
            home, away = (nation_name(m["home"], lang), nation_name(m["away"], lang)) if code in NATIONAL else (m["home"], m["away"])
            rows.append([first_col, home, away, m["state"], minute, m.get("hl", ""), m.get("al", "")])
        if rows:
            title = LEAGUE_TITLES_TR.get(code, LEAGUE_TITLES[code]) if lang == "tr" else LEAGUE_TITLES[code]
            groups.append([title, rows, LEAGUE_COLORS[code]])
    doc = {"h": header, "t": [tx["title"], tx["end"], tx["off"]], "g": groups}
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


def logo_ids(doc: dict[str, Any]) -> list[str]:
    """Team ids whose logos the display needs for this document (in display order)."""
    out: list[str] = []
    for group in doc.get("g", []):  # [name, rows, colour]
        for row in group[1]:
            for tid in row[5:7]:
                if tid and tid not in out:
                    out.append(tid)
    return out

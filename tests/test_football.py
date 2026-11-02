"""Football screensaver: ESPN parsing, payload for the display, settings."""

from datetime import datetime, timedelta, timezone
import json

import pytest

from io import BytesIO

from PIL import Image

from gs_pure.football import LOGO_SIZE, build_payload, has_live, logo_ids, logo_rgb565a8, parse_scoreboard
from gs_pure.layout import LayoutValidationError, compile_device_layout, default_layout, football_settings, validate_layout

TZ = timezone(timedelta(hours=1))


def _event(eid, iso, home, away, state="pre", name="STATUS_SCHEDULED", clock="0'", hs="0", as_="0"):
    return {
        "id": eid,
        "date": iso,
        "competitions": [
            {
                "status": {"displayClock": clock, "type": {"state": state, "name": name}},
                "competitors": [
                    {"homeAway": "home", "score": hs, "team": {"id": f"{eid}1", "shortDisplayName": home}},
                    {"homeAway": "away", "score": as_, "team": {"id": f"{eid}2", "shortDisplayName": away}},
                ],
            }
        ],
    }


BUNDESLIGA = {
    "events": [
        _event("2", "2026-11-07T17:30Z", "Bayern Munich", "Dortmund"),
        _event("1", "2026-11-07T14:30Z", "Leipzig", "Freiburg", "in", "STATUS_IN_PROGRESS", "67'", "2", "1"),
        _event("3", "2026-11-07T14:30Z", "Cologne", "Mainz", "in", "STATUS_HALFTIME", "45'", "0", "0"),
        {"id": "broken"},
    ]
}
SUPERLIG = {"events": [_event("9", "2026-11-07T11:00Z", "Besiktas", "Fenerbahce", "post", "STATUS_FULL_TIME", "90'", "3", "2")]}


def test_parse_scoreboard_sorts_and_fixes_names():
    matches = parse_scoreboard(BUNDESLIGA, TZ)
    assert [m["home"] for m in matches] == ["Leipzig", "Köln", "Bayern"]  # broken event skipped, sorted by kick-off
    assert matches[0]["when"].hour == 15 and matches[0]["state"] == 1 and matches[0]["minute"] == "67'"
    assert matches[1]["halftime"] is True


def test_payload_today_with_live_and_finished():
    data = {"ger.1": parse_scoreboard(BUNDESLIGA, TZ), "tur.1": parse_scoreboard(SUPERLIG, TZ), "esp.1": []}
    now = datetime(2026, 11, 7, 16, 0, tzinfo=TZ)
    doc = build_payload(data, "de", now)
    assert doc["h"] == "Heute"
    assert doc["g"][0] == [
        "Bundesliga",
        [
            ["2:1", "Leipzig", "Freiburg", 1, "67'", "11", "12"],
            ["0:0", "Köln", "Mainz", 1, "HZ", "31", "32"],
            ["18:30", "Bayern", "Dortmund", 0, "", "21", "22"],
        ],
    ]
    assert doc["g"][1] == ["Süper Lig", [["3:2", "Beşiktaş", "Fenerbahçe", 2, "", "91", "92"]]]
    assert logo_ids(doc) == ["11", "12", "31", "32", "21", "22", "91", "92"]
    assert len(doc["g"]) == 2  # LaLiga without matches is left out
    assert has_live(data, now)


def test_payload_next_match_day_and_errors():
    data = {"ger.1": parse_scoreboard(BUNDESLIGA, TZ)}
    doc = build_payload(data, "tr", datetime(2026, 11, 5, 9, 0, tzinfo=TZ))
    assert doc["h"] == "Sonraki maçlar"
    assert doc["g"][0][1][-1][:3] == ["Cmt 18:30", "Bayern", "Dortmund"]  # weekday + kick-off
    assert build_payload({"ger.1": None}, "de", datetime(2026, 11, 5, tzinfo=TZ)) == {"h": "Keine Spieldaten erreichbar", "g": []}
    assert build_payload({"ger.1": []}, "de", datetime(2026, 11, 5, tzinfo=TZ))["g"] == []
    upcoming = {"ger.1": [m for m in data["ger.1"] if m["state"] == 0]}
    assert not has_live(upcoming, datetime(2026, 11, 5, 9, 0, tzinfo=TZ))
    assert has_live(upcoming, datetime(2026, 11, 7, 18, 20, tzinfo=TZ))  # kick-off in 10 minutes


def _layout(mode, **extra):
    layout = default_layout()
    layout["settings"]["screensaver"] = {"enabled": True, "after": 60, "entities": [], "mode": mode,
                                         "prayer": {"fajr": "sensor.fajr"}, **extra}
    return layout


def test_football_and_mix_settings():
    valid = validate_layout(_layout("football", leagues=["esp.1", "ger.1", "unbekannt"]))
    assert valid["settings"]["screensaver"]["leagues"] == ["ger.1", "esp.1"]  # known codes, fixed order
    assert json.loads(compile_device_layout(valid)[0])["set"]["ssm"] == 3
    assert football_settings(valid) == (["ger.1", "esp.1"], "de")
    mix = validate_layout(_layout("mix", mix_interval=30, prayer_lang="tr"))
    doc = json.loads(compile_device_layout(mix)[0])["set"]
    assert doc["ssm"] == 4 and doc["smi"] == 30 and doc["spe"] == ["sensor.fajr"]
    assert football_settings(mix) == (["ger.1", "tur.1", "esp.1"], "tr")
    assert football_settings(validate_layout(_layout("prayer"))) is None
    with pytest.raises(LayoutValidationError):
        validate_layout(_layout("football", leagues=[]))


def test_logo_is_trimmed_and_converted_to_rgb565a8():
    img = Image.new("RGBA", (100, 60), (0, 0, 0, 0))
    img.paste((255, 0, 0, 255), (20, 10, 80, 50))  # red crest with a transparent border
    buf = BytesIO()
    img.save(buf, "PNG")
    raw = logo_rgb565a8(buf.getvalue())
    n = LOGO_SIZE * LOGO_SIZE
    assert len(raw) == n * 3
    centre = (LOGO_SIZE // 2) * LOGO_SIZE + LOGO_SIZE // 2
    assert raw[centre * 2 : centre * 2 + 2] == bytes((0x00, 0xF8))  # red, little endian
    assert raw[2 * n + centre] == 255 and raw[2 * n] == 0  # opaque centre, transparent corner
    assert LOGO_SIZE == 24  # = LOGO_PX in guition_studio.h

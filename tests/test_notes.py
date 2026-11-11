"""Reminders screensaver: to-do items -> display document, settings."""

from datetime import datetime, timedelta, timezone
import json

import pytest

from gs_pure.layout import LayoutValidationError, compile_device_layout, default_layout, notes_settings, validate_layout
from gs_pure.notes import MAX_TEXT, build_payload, clean_text

TZ = timezone(timedelta(hours=1))
NOW = datetime(2026, 11, 11, 9, 30, tzinfo=TZ)  # Wednesday


def test_items_sorted_by_due_date_with_labels():
    items = [
        {"summary": "Blumen gießen", "status": "needs_action"},
        {"summary": "Müll rausbringen", "status": "needs_action", "due": "2026-11-12"},
        {"summary": "Arzttermin", "status": "needs_action", "due": "2026-11-11T16:00:00+01:00"},
        {"summary": "Rechnung bezahlen", "status": "needs_action", "due": "2026-11-09"},
        {"summary": "Erledigt", "status": "completed"},
        {"summary": "Geburtstag Oma", "status": "needs_action", "due": "2026-11-14"},
        {"summary": "Reifen wechseln", "status": "needs_action", "due": "2026-12-01"},
        {"summary": "Zweite Notiz ohne Datum", "status": "needs_action"},
    ]
    doc = build_payload(items, NOW)
    assert doc["t"][0] == "ERINNERUNGEN"
    assert doc["i"] == [
        ["Rechnung bezahlen", "Überfällig", 4],
        ["Arzttermin", "Heute 16:00", 3],
        ["Müll rausbringen", "Morgen", 2],
        ["Geburtstag Oma", "Sa", 1],
        ["Reifen wechseln", "01.12.", 1],
        ["Blumen gießen", "", 0],  # no due date: list order
        ["Zweite Notiz ohne Datum", "", 0],
    ]


def test_utc_due_time_shown_in_local_time_and_empty_list():
    doc = build_payload([{"summary": "Paket abholen", "due": "2026-11-12T17:00:00Z"}], NOW)
    assert doc["i"] == [["Paket abholen", "Morgen 18:00", 2]]
    assert build_payload([], NOW)["i"] == []
    assert build_payload([{"summary": "  "}, "kaputt"], NOW)["i"] == []


def test_text_is_cleaned_for_the_display_fonts():
    assert clean_text("Einkaufen 🛒\nMilch & Brot") == "Einkaufen Milch & Brot"
    assert clean_text("Şule İçin çay – 5 €") == "Şule İçin çay – 5 €"
    long = clean_text("x" * 300)
    assert len(long) == MAX_TEXT and long.endswith("…")


def _layout(mode, **extra):
    layout = default_layout()
    layout["settings"]["screensaver"] = {"enabled": True, "after": 60, "entities": [], "mode": mode, **extra}
    return layout


def test_notes_settings_and_device_mode():
    valid = validate_layout(_layout("notes", notes="todo.erinnerungen"))
    assert notes_settings(valid) == "todo.erinnerungen"
    assert json.loads(compile_device_layout(valid)[0])["set"]["ssm"] == 6
    with pytest.raises(LayoutValidationError):
        validate_layout(_layout("notes"))
    with pytest.raises(LayoutValidationError):
        validate_layout(_layout("notes", notes="sensor.nope"))
    mix = validate_layout(_layout("mix", notes="todo.erinnerungen", mix_views=["football", "notes"]))
    doc = json.loads(compile_device_layout(mix)[0])["set"]
    assert doc["ssm"] == 4 and doc["smv"] == [1, 2]
    assert notes_settings(validate_layout(_layout("football"))) is None

"""School screensaver: WebUntis calendar events + Eltern-Portal elements -> display document, settings."""

from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone
import json

import pytest

from gs_pure.layout import LayoutValidationError, compile_device_layout, default_layout, football_settings, school_settings, validate_layout
from gs_pure.school import KIND_APPOINTMENT, KIND_EXAM, KIND_HOMEWORK, KIND_LETTER, KIND_SUBSTITUTION, build_child, build_payload, day_label, pick_day, parse_lessons

TZ = timezone(timedelta(hours=1))
NOW = datetime(2026, 11, 3, 9, 10, tzinfo=TZ)  # Tuesday, during the 2nd lesson


def _lesson(day, start, end, summary, room=""):
    return {"start": f"{day}T{start}:00+01:00", "end": f"{day}T{end}:00+01:00", "summary": summary, "location": room}


TIMETABLE = [
    _lesson("2026-11-03", "08:45", "09:30", "Mathematik", "R101"),
    _lesson("2026-11-03", "08:00", "08:45", "Deutsch", "R101"),
    _lesson("2026-11-03", "09:50", "10:35", "Cancelled: Englisch", "R12"),
    _lesson("2026-11-03", "10:35", "11:20", "Irregular: Sport", "Halle"),
    _lesson("2026-11-04", "08:00", "08:45", "Room change: Biologie", "R7"),
    {"start": "2026-11-05", "end": "2026-11-06", "summary": "Wandertag"},  # all-day: not a lesson
]


@dataclass
class Letter:  # like pyelternportal.letter.Letter (kept as objects in the state attributes)
    letter_id: str
    number: str
    sent: datetime
    new: bool
    attachment: bool
    subject: str
    distribution: str
    body: str


def test_lessons_status_and_order():
    lessons = parse_lessons(TIMETABLE, TZ)
    assert [le["subject"] for le in lessons] == ["Deutsch", "Mathematik", "Englisch", "Sport", "Biologie"]
    assert [le["status"] for le in lessons] == [0, 0, 1, 2, 3]


def test_day_today_until_the_last_lesson_then_next_school_day():
    lessons = parse_lessons(TIMETABLE, TZ)
    assert pick_day(lessons, NOW) == date(2026, 11, 3)
    assert pick_day(lessons, NOW.replace(hour=11, minute=20)) == date(2026, 11, 4)
    assert pick_day(lessons, NOW + timedelta(days=3)) is None
    today = date(2026, 11, 3)
    assert day_label(today, today) == "Heute · Di 3.11."
    assert day_label(date(2026, 11, 4), today) == "Morgen · Mi 4.11."
    assert day_label(date(2026, 11, 9), today) == "Montag, 9.11."


def test_child_document():
    sources = {
        "timetable": TIMETABLE,
        "homework": [
            {"start": "2026-11-01", "end": "2026-11-05", "summary": "Mathematik", "description": "S. 42 Nr. 3"},  # due Wed
            {"start": "2026-10-20", "end": "2026-11-01", "summary": "Deutsch", "description": "alt"},  # overdue
        ],
        "exams": [{"start": "2026-11-06T08:00:00+01:00", "end": "2026-11-06T09:30:00+01:00", "summary": "Englisch Schulaufgabe"}],
        "letters": [
            Letter("1", "12", datetime(2026, 10, 20, 7, 0), True, False, "Elternabend", "", ""),
            {"sent": "2026-10-01T07:00:00", "new": False, "subject": "Alt und gelesen"},
        ],
        "appointments": [{"title": "Herbstferien", "start": "2026-11-02T00:00:00", "end": "2026-11-07T00:00:00"}],
        "substitutions": [{"date": "2026-11-04", "lesson": "3", "subject_new": "Physik", "room": "R9", "info": "statt Chemie"}],
    }
    child = build_child("Lena", sources, NOW)
    assert child["n"] == "Lena" and child["d"] == "Heute · Di 3.11." and child["c"] == 1
    assert child["l"][0] == ["08:00", "08:45", "Deutsch", "R101", 0]
    assert child["l"][2] == ["09:50", "10:35", "Englisch", "R12", 1]
    assert len(child["l"]) == 4  # only today's lessons
    kinds = [it[0] for it in child["i"]]
    assert kinds == [KIND_LETTER, KIND_APPOINTMENT, KIND_HOMEWORK, KIND_SUBSTITUTION, KIND_EXAM]
    letter, appointment, homework, substitution, exam = child["i"]
    assert letter == [KIND_LETTER, "Di 20.10.", "Elternabend", 1]  # new letters stay until read
    assert appointment[1] == "Heute" and appointment[2] == "Herbstferien"  # running appointment = today
    assert homework == [KIND_HOMEWORK, "Morgen", "Mathematik: S. 42 Nr. 3", 1]
    assert substitution == [KIND_SUBSTITUTION, "Morgen", "3. Std · Physik · Raum R9 · statt Chemie", 1]
    assert exam == [KIND_EXAM, "Fr 6.11.", "Englisch Schulaufgabe (08:00)", 0]


def test_payload_without_lessons_and_long_texts():
    doc = build_payload([("Ömer", {"timetable": [], "letters": [{"sent": NOW.isoformat(), "new": True, "subject": "x" * 200}]})], NOW)
    assert doc["t"][0] == "SCHULE" and len(doc["g"]) == 5
    child = doc["k"][0]
    assert child["d"] == "" and child["l"] == [] and child["c"] == 0
    assert len(child["i"][0][2]) == 64 and child["i"][0][2].endswith("…")
    json.dumps(doc, ensure_ascii=False)


def _layout(mode, **extra):
    layout = default_layout()
    layout["settings"]["screensaver"] = {"enabled": True, "after": 60, "entities": [], "mode": mode, **extra}
    return layout


KIDS = [
    {"name": "Lena", "timetable": "calendar.lena", "exams": "calendar.lena_pruefungen", "letters": "sensor.elternportal_letter_1"},
    {"name": "  ", "timetable": "calendar.max"},
    {"name": "Leer"},  # no entity: dropped
]


def test_school_settings():
    valid = validate_layout(_layout("school", school=KIDS))
    school = valid["settings"]["screensaver"]["school"]
    assert [c["name"] for c in school] == ["Lena", "Kind 2"]
    assert json.loads(compile_device_layout(valid)[0])["set"]["ssm"] == 5
    assert school_settings(valid) == school
    with pytest.raises(LayoutValidationError):
        validate_layout(_layout("school", school=[]))
    with pytest.raises(LayoutValidationError):  # wrong domain
        validate_layout(_layout("school", school=[{"name": "A", "timetable": "sensor.x"}]))


def test_mix_with_school():
    mix = validate_layout(_layout("mix", school=KIDS, mix_views=["school", "football"], mix_interval=30))
    doc = json.loads(compile_device_layout(mix)[0])["set"]
    assert doc["ssm"] == 4 and doc["smv"] == [1, 2] and doc["smi"] == 30 and "spe" not in doc
    assert school_settings(mix) is not None and football_settings(mix) is not None
    # settings from before 0.5.23 (no mix_views): prayer times + football as before
    old = validate_layout(_layout("mix", prayer={"fajr": "sensor.fajr"}))
    doc = json.loads(compile_device_layout(old)[0])["set"]
    assert doc["smv"] == [0, 1] and doc["spe"] == ["sensor.fajr"]
    assert school_settings(old) is None
    with pytest.raises(LayoutValidationError):
        validate_layout(_layout("mix", school=KIDS, mix_views=["school"]))

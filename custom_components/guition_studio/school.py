"""School screensaver: timetable (WebUntis) and news (Eltern-Portal) per child.

Home Assistant reads the calendars of the WebUntis integration (lessons, homework, exams) and
the sensors of the Eltern-Portal integration (letters, appointments, substitutions), and sends
one compact document to the display via the API action ``gs_school``.

Document: ``{"t": [title, upcoming, no school], "g": [tag per kind], "k": [child, ...]}``
child:    ``{"n": name, "d": day label, "c": 1 if the day is today,
             "l": [[start, end, subject, room, status], ...], "i": [[kind, date, text, hot], ...]}``
status 0 normal, 1 cancelled, 2 irregular (substitution), 3 room change.
"""

from __future__ import annotations

from datetime import date, datetime, time, timedelta, tzinfo
from typing import Any

MAX_CHILDREN = 4
MAX_LESSONS = 14
MAX_ITEMS = 6
LOOKAHEAD_DAYS = 8  # timetable: next school day within this many days
EXAM_DAYS = 14
HOMEWORK_DAYS = 7
LETTER_DAYS = 3  # letters already read stay this long

KIND_EXAM, KIND_HOMEWORK, KIND_APPOINTMENT, KIND_LETTER, KIND_SUBSTITUTION = range(5)
TAGS = ["PRÜFUNG", "HAUSAUFG.", "TERMIN", "BRIEF", "VERTRET."]
TEXTS = ["SCHULE", "Demnächst", "Kein Unterricht in den nächsten Tagen"]
WEEKDAYS = ("Mo", "Di", "Mi", "Do", "Fr", "Sa", "So")
WEEKDAYS_LONG = ("Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag")

# summary prefixes of the WebUntis integration (not translated there)
STATUS_PREFIXES = (("Cancelled: ", 1), ("Irregular: ", 2), ("Room change: ", 3))

# settings key -> (domain, what it is)
SOURCES: dict[str, str] = {
    "timetable": "calendar",  # WebUntis: Stundenplan
    "homework": "calendar",  # WebUntis: Hausaufgaben
    "exams": "calendar",  # WebUntis: Prüfungen
    "letters": "sensor",  # Eltern-Portal: Elternbriefe
    "appointments": "sensor",  # Eltern-Portal: Termine
    "substitutions": "sensor",  # Eltern-Portal: Vertretungsplan
}


def parse_when(value: Any, tz: tzinfo) -> datetime | None:
    """ISO string, date or datetime -> aware datetime (all-day dates = local midnight)."""
    if value is None or value == "":
        return None
    if isinstance(value, str):
        text = value.strip()
        try:
            value = datetime.fromisoformat(text) if ("T" in text or " " in text) else date.fromisoformat(text)
        except ValueError:
            return None
    if isinstance(value, datetime):
        return value.astimezone(tz) if value.tzinfo else value.replace(tzinfo=tz)
    if isinstance(value, date):
        return datetime.combine(value, time.min, tz)
    return None


def _is_date_only(value: Any) -> bool:
    if isinstance(value, str):
        return "T" not in value and " " not in value.strip()
    return isinstance(value, date) and not isinstance(value, datetime)


def field(obj: Any, name: str, default: Any = None) -> Any:
    """Attribute of an Eltern-Portal element (dataclass in memory, dict after serialisation)."""
    if isinstance(obj, dict):
        return obj.get(name, default)
    return getattr(obj, name, default)


def elements(state_attrs: dict[str, Any] | None) -> list[Any]:
    items = (state_attrs or {}).get("elements")
    return list(items) if isinstance(items, (list, tuple)) else []


def lesson_status(summary: str) -> tuple[str, int]:
    for prefix, status in STATUS_PREFIXES:
        if summary.startswith(prefix):
            return summary[len(prefix) :].strip(), status
    return summary.strip(), 0


def short_date(day: date) -> str:
    return f"{WEEKDAYS[day.weekday()]} {day.day}.{day.month}."


def item_date(day: date, today: date) -> str:
    if day == today:
        return "Heute"
    if day == today + timedelta(days=1):
        return "Morgen"
    return short_date(day)


def day_label(day: date, today: date) -> str:
    """'Heute · Di 3.11.', 'Morgen · Mi 4.11.' or 'Montag, 9.11.'"""
    if day == today:
        return f"Heute · {short_date(day)}"
    if day == today + timedelta(days=1):
        return f"Morgen · {short_date(day)}"
    return f"{WEEKDAYS_LONG[day.weekday()]}, {day.day}.{day.month}."


def _clip(text: Any, size: int) -> str:
    out = " ".join(str(text or "").split())
    return out if len(out) <= size else out[: size - 1].rstrip() + "…"


def parse_lessons(events: list[dict[str, Any]], tz: tzinfo) -> list[dict[str, Any]]:
    """WebUntis calendar events -> lessons with start/end datetimes, subject, room, status."""
    out = []
    for ev in events or []:
        start, end = parse_when(ev.get("start"), tz), parse_when(ev.get("end"), tz)
        if start is None or end is None or _is_date_only(ev.get("start")):
            continue
        name, status = lesson_status(str(ev.get("summary") or ""))
        out.append({"start": start, "end": end, "subject": name, "room": str(ev.get("location") or ""), "status": status})
    out.sort(key=lambda le: (le["start"], le["end"]))
    return out


def pick_day(lessons: list[dict[str, Any]], now: datetime) -> date | None:
    """Today while lessons are still ahead or running, otherwise the next day with lessons."""
    today = now.date()
    if any(le["start"].date() == today and le["end"] > now for le in lessons):
        return today
    later = sorted({le["start"].date() for le in lessons if le["start"].date() > today})
    return later[0] if later else None


def _items_untis(homework: list[dict[str, Any]], exams: list[dict[str, Any]], today: date, tz: tzinfo) -> list[tuple]:
    out: list[tuple] = []
    for ev in exams or []:
        start = parse_when(ev.get("start"), tz)
        if start is None or not today <= start.date() <= today + timedelta(days=EXAM_DAYS):
            continue
        text = str(ev.get("summary") or "")
        if not _is_date_only(ev.get("start")):
            text = f"{text} ({start:%H:%M})"
        out.append((start.date(), KIND_EXAM, text, (start.date() - today).days <= 2))
    for ev in homework or []:
        end = parse_when(ev.get("end"), tz)
        if end is None:
            continue
        # all-day events: end is exclusive (due date + 1 day)
        due = end.date() - timedelta(days=1) if _is_date_only(ev.get("end")) else end.date()
        if not today <= due <= today + timedelta(days=HOMEWORK_DAYS):
            continue
        text = str(ev.get("summary") or "")
        if ev.get("description"):
            text = f"{text}: {ev['description']}"
        out.append((due, KIND_HOMEWORK, text, (due - today).days <= 1))
    return out


def _items_elternportal(
    letters: list[Any], appointments: list[Any], substitutions: list[Any], today: date, tz: tzinfo
) -> list[tuple]:
    out: list[tuple] = []
    for le in letters or []:
        sent = parse_when(field(le, "sent"), tz)
        new = bool(field(le, "new", False))
        if sent is None or (not new and sent.date() < today - timedelta(days=LETTER_DAYS)):
            continue
        out.append((sent.date(), KIND_LETTER, str(field(le, "subject") or "Elternbrief"), new))
    for ap in appointments or []:
        start, end = parse_when(field(ap, "start"), tz), parse_when(field(ap, "end"), tz)
        if start is None:
            continue
        if (end or start).date() < today or start.date() > today + timedelta(days=EXAM_DAYS):
            continue
        out.append((max(start.date(), today), KIND_APPOINTMENT, str(field(ap, "title") or ""), (start.date() - today).days <= 1))
    for sub in substitutions or []:
        day = parse_when(field(sub, "date"), tz)
        if day is None or not today <= day.date() <= today + timedelta(days=2):
            continue
        parts = []
        if field(sub, "lesson"):
            parts.append(f"{field(sub, 'lesson')}. Std")
        subject = field(sub, "subject_new") or field(sub, "subject_old")
        if subject:
            parts.append(str(subject))
        if field(sub, "room"):
            parts.append(f"Raum {field(sub, 'room')}")
        if field(sub, "info"):
            parts.append(str(field(sub, "info")))
        out.append((day.date(), KIND_SUBSTITUTION, " · ".join(parts) or "Vertretung", True))
    return out


def build_child(name: str, sources: dict[str, Any], now: datetime) -> dict[str, Any]:
    """sources: timetable/homework/exams = calendar events, letters/... = Eltern-Portal elements."""
    tz = now.tzinfo
    assert tz is not None
    today = now.date()
    lessons = parse_lessons(sources.get("timetable") or [], tz)
    day = pick_day(lessons, now)
    rows = []
    if day is not None:
        for le in lessons:
            if le["start"].date() != day:
                continue
            rows.append([f"{le['start']:%H:%M}", f"{le['end']:%H:%M}", _clip(le["subject"], 32), _clip(le["room"], 12), le["status"]])
    items = _items_untis(sources.get("homework") or [], sources.get("exams") or [], today, tz)
    items += _items_elternportal(sources.get("letters") or [], sources.get("appointments") or [], sources.get("substitutions") or [], today, tz)
    # news (new letters, substitutions) first on the same day, then by kind
    items.sort(key=lambda it: (it[0], not it[3], it[1]))
    out: dict[str, Any] = {
        "n": _clip(name, 20),
        "d": day_label(day, today) if day is not None else "",
        "c": int(day == today),
        "l": rows[:MAX_LESSONS],
        "i": [[kind, item_date(d, today), _clip(text, 64), int(hot)] for d, kind, text, hot in items[:MAX_ITEMS]],
    }
    return out


def build_payload(children: list[tuple[str, dict[str, Any]]], now: datetime) -> dict[str, Any]:
    return {"t": TEXTS, "g": TAGS, "k": [build_child(name, src, now) for name, src in children[:MAX_CHILDREN]]}


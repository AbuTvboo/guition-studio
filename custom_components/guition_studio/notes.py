"""Reminders screensaver: open items of a Home Assistant to-do list (pure module, unit tested).

The items come from the action todo.get_items (status needs_action). Notes written on the phone
(Home Assistant app -> To-do lists) show up on the display, sorted by due date:

    {"t": ["ERINNERUNGEN", "offen", "Alles erledigt – nichts zu tun"],
     "i": [[text, due_label, level], ...]}

level: 0 = no due date, 1 = later, 2 = tomorrow, 3 = today, 4 = overdue (colour on the display).
"""

from __future__ import annotations

from datetime import date, datetime, tzinfo
from typing import Any

MAX_ITEMS = 30
MAX_TEXT = 120
DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]
TEXTS = ["ERINNERUNGEN", "offen", "Alles erledigt – nichts zu tun"]

# characters the display fonts contain (= TEXT_RANGE in scripts/gen-fonts.mjs)
_RANGES = (
    (0x20, 0x7E), (0xA0, 0xFF), (0x11E, 0x11F), (0x130, 0x131), (0x15E, 0x15F), (0x2013, 0x2014),
    (0x2018, 0x201E), (0x2022, 0x2022), (0x2026, 0x2026), (0x20AC, 0x20AC), (0x2190, 0x2193), (0x2212, 0x2212),
)  # fmt: skip


def _printable(ch: str) -> bool:
    code = ord(ch)
    return any(lo <= code <= hi for lo, hi in _RANGES)


def clean_text(text: Any) -> str:
    """One line of text the display can render (emojis and other symbols are dropped)."""
    words = "".join(ch if _printable(ch) else " " for ch in str(text or "").replace("\n", " ")).split()
    out = " ".join(words)
    return out if len(out) <= MAX_TEXT else out[: MAX_TEXT - 1].rstrip() + "…"


def _due(item: dict[str, Any], tz: tzinfo | None) -> tuple[date, str] | None:
    """(day, "HH:MM" or "") of the item's due date, None without one."""
    raw = item.get("due")
    if not raw:
        return None
    if isinstance(raw, datetime):
        when = raw
    elif isinstance(raw, date):
        return raw, ""
    else:
        text = str(raw)
        try:
            if len(text) == 10:
                return date.fromisoformat(text), ""
            when = datetime.fromisoformat(text.replace("Z", "+00:00"))
        except ValueError:
            return None
    if when.tzinfo is not None and tz is not None:
        when = when.astimezone(tz)
    return when.date(), when.strftime("%H:%M")


def _label(day: date, hhmm: str, today: date) -> tuple[str, int]:
    delta = (day - today).days
    if delta < 0:
        return "Überfällig", 4
    if delta == 0:
        return ("Heute " + hhmm).strip(), 3
    if delta == 1:
        return ("Morgen " + hhmm).strip(), 2
    if delta < 7:
        return f"{DAYS[day.weekday()]} {hhmm}".strip() if hhmm else DAYS[day.weekday()], 1
    return f"{day:%d.%m.}", 1


def build_payload(items: list[dict[str, Any]], now: datetime) -> dict[str, Any]:
    """Open items, overdue/today first, then by due date; items without a date keep their list order."""
    today = now.date()
    rows = []
    for pos, item in enumerate(items):
        if not isinstance(item, dict) or item.get("status", "needs_action") != "needs_action":
            continue
        text = clean_text(item.get("summary"))
        if not text:
            continue
        due = _due(item, now.tzinfo)
        if due is None:
            rows.append(((1, date.max, "", pos), [text, "", 0]))
        else:
            label, level = _label(due[0], due[1], today)
            rows.append(((0, due[0], due[1] or "99:99", pos), [text, label, level]))
    rows.sort(key=lambda r: r[0])
    return {"t": TEXTS, "i": [r[1] for r in rows[:MAX_ITEMS]]}

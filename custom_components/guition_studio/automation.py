"""Smart page switching, night mode and graph helpers (pure module, unit tested).

Evaluated in Home Assistant, so the display needs no clock logic beyond showing
the time, and rules can use any HA entity.
"""

from __future__ import annotations

from datetime import datetime, time
import re
from typing import Any, Callable, Iterable

TIME_RE = re.compile(r"^([01]\d|2[0-3]):([0-5]\d)$")
GRAPH_POINTS = 48


def parse_hhmm(value: Any) -> time | None:
    if not isinstance(value, str):
        return None
    m = TIME_RE.match(value)
    return time(int(m.group(1)), int(m.group(2))) if m else None


def in_window(now: time, start: time, end: time) -> bool:
    """True if ``now`` is inside [start, end); windows may cross midnight."""
    if start == end:
        return False
    if start < end:
        return start <= now < end
    return now >= start or now < end


def night_active(night: dict[str, Any] | None, now: time, sun_below_horizon: bool | None) -> bool:
    if not night or not night.get("enabled"):
        return False
    if night.get("mode") == "sun":
        return bool(sun_below_horizon)
    start, end = parse_hhmm(night.get("start")), parse_hhmm(night.get("end"))
    return bool(start and end and in_window(now, start, end))


def compare(state: str | None, operator: str, value: str) -> bool:
    if state is None:
        return False
    if operator == "eq":
        return state == value
    if operator == "ne":
        return state != value
    try:
        a, b = float(state), float(value)
    except (TypeError, ValueError):
        return False
    return a > b if operator == "gt" else a < b


def time_rules_due(rules: Iterable[dict[str, Any]], now: datetime) -> list[dict[str, Any]]:
    """Time rules whose ``at`` matches the current minute."""
    hhmm = now.strftime("%H:%M")
    return [r for r in rules if r.get("type") == "time" and r.get("at") == hhmm]


def state_rules_fired(
    rules: Iterable[dict[str, Any]], entity_id: str, old_state: str | None, new_state: str | None
) -> list[dict[str, Any]]:
    """State rules that changed from not matching to matching (edge-triggered)."""
    fired = []
    for r in rules:
        if r.get("type") != "state" or r.get("entity") != entity_id:
            continue
        op, val = r.get("operator", "eq"), str(r.get("value", ""))
        if compare(new_state, op, val) and not compare(old_state, op, val):
            fired.append(r)
    return fired


def rule_entities(rules: Iterable[dict[str, Any]]) -> set[str]:
    return {r["entity"] for r in rules if r.get("type") == "state" and r.get("entity")}


# --------------------------------------------------------------------------- graph


def downsample(points: list[tuple[float, float]], start: float, end: float, n: int = GRAPH_POINTS) -> list[float | None]:
    """Step-function resampling: value at the end of each bucket (last known value).

    ``points`` are (unix_ts, value) sorted by time; values before ``start`` seed the series.
    """
    out: list[float | None] = []
    if end <= start or n <= 0:
        return out
    step = (end - start) / n
    idx = 0
    current: float | None = None
    for b in range(n):
        bucket_end = start + (b + 1) * step
        while idx < len(points) and points[idx][0] <= bucket_end:
            current = points[idx][1]
            idx += 1
        out.append(current)
    return out


def _fmt(v: float) -> str:
    return (f"{v:.0f}" if abs(v) >= 100 or float(v).is_integer() else f"{v:.1f}").replace(".", ",")


def scale_series(values: list[float | None], unit: str | None = None) -> tuple[list[int], str]:
    """Scale to 0..100 ints for the device (-1 = no data) plus a 'min – max unit' label."""
    nums = [v for v in values if v is not None]
    if not nums:
        return [-1] * len(values), ""
    lo, hi = min(nums), max(nums)
    span = hi - lo
    scaled = [-1 if v is None else (50 if span == 0 else round((v - lo) * 100 / span)) for v in values]
    label = f"{_fmt(lo)} – {_fmt(hi)}" + (f" {unit}" if unit else "")
    return scaled, label


def numeric_history(states: Iterable[Any], value_of: Callable[[Any], tuple[float, str]]) -> list[tuple[float, float]]:
    """Convert HA State objects to (ts, value) pairs, skipping non-numeric states."""
    out = []
    for st in states:
        try:
            ts, raw = value_of(st)
            out.append((ts, float(raw)))
        except (TypeError, ValueError):
            continue
    return out

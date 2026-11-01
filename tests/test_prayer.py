"""Islamic prayer times screensaver (layout validation, device fields, timestamp formatting)."""

from datetime import timezone, timedelta
import json

import pytest

from gs_pure.layout import LayoutValidationError, compile_device_layout, default_layout, layout_entities, validate_layout
from gs_pure.protocol import format_state, set_local_timezone

PRAYER = {
    "fajr": "sensor.islamic_prayer_times_fajr_prayer",
    "sunrise": "sensor.islamic_prayer_times_sunrise_prayer",
    "dhuhr": "sensor.islamic_prayer_times_dhuhr_prayer",
    "asr": "sensor.islamic_prayer_times_asr_prayer",
    "maghrib": "sensor.islamic_prayer_times_maghrib_prayer",
    "isha": "sensor.islamic_prayer_times_isha_prayer",
}


def _layout(prayer):
    layout = default_layout()
    layout["settings"]["screensaver"] = {"enabled": True, "after": 60, "entities": ["sensor.temp"], "mode": "prayer", "prayer": prayer}
    return layout


def test_prayer_device_fields_in_display_order():
    valid = validate_layout(_layout(dict(reversed(list(PRAYER.items())))))
    doc = json.loads(compile_device_layout(valid)[0])["set"]
    assert doc["ssm"] == 2
    assert doc["spn"] == ["Fajr", "Sonnenaufgang", "Dhuhr", "Asr", "Maghrib", "Isha"]
    assert doc["spe"] == list(PRAYER.values())
    assert doc["spk"] == [1, 0, 1, 1, 1, 1]
    # the prayer sensors are pushed to the display like tile entities
    assert set(PRAYER.values()) <= layout_entities(valid)


def test_prayer_without_sunrise_and_invalid_ids():
    valid = validate_layout(_layout({"fajr": PRAYER["fajr"], "isha": PRAYER["isha"]}))
    doc = json.loads(compile_device_layout(valid)[0])["set"]
    assert doc["spn"] == ["Fajr", "Isha"] and doc["spk"] == [1, 1]
    with pytest.raises(LayoutValidationError):
        validate_layout(_layout({"fajr": "kein sensor"}))
    with pytest.raises(LayoutValidationError):
        validate_layout(_layout({}))


def test_prayer_entities_not_pushed_in_other_modes():
    layout = _layout(PRAYER)
    layout["settings"]["screensaver"]["mode"] = "clock"
    valid = validate_layout(layout)
    assert not set(PRAYER.values()) & layout_entities(valid)
    assert "ssm" not in json.loads(compile_device_layout(valid)[0])["set"]


def test_timestamp_uses_home_assistant_time_zone():
    set_local_timezone(timezone(timedelta(hours=1)))
    try:
        assert format_state("sensor", "2026-11-02T04:31:00+00:00", {"device_class": "timestamp"}) == "05:31"
    finally:
        set_local_timezone(None)

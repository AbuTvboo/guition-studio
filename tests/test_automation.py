from datetime import datetime, time
import json

import pytest

from gs_pure.automation import (
    downsample,
    in_window,
    night_active,
    numeric_history,
    rule_entities,
    scale_series,
    state_rules_fired,
    time_rules_due,
)
from gs_pure.layout import LayoutValidationError, compile_device_layout, default_layout, make_tile, resolve_control, validate_layout


def test_time_window_across_midnight():
    assert in_window(time(23, 0), time(22, 0), time(6, 30))
    assert in_window(time(5, 59), time(22, 0), time(6, 30))
    assert not in_window(time(12, 0), time(22, 0), time(6, 30))
    assert in_window(time(13, 0), time(12, 0), time(14, 0))
    assert not in_window(time(14, 0), time(12, 0), time(14, 0))
    assert not in_window(time(1, 0), time(5, 0), time(5, 0))


def test_night_modes():
    night = {"enabled": True, "mode": "time", "start": "22:00", "end": "06:30"}
    assert night_active(night, time(23, 15), None)
    assert not night_active({**night, "enabled": False}, time(23, 15), None)
    assert night_active({**night, "mode": "sun"}, time(12, 0), True)
    assert not night_active({**night, "mode": "sun"}, time(23, 0), False)


def test_rules():
    rules = [
        {"id": "r1", "type": "time", "at": "07:00", "page": "p1"},
        {"id": "r2", "type": "state", "entity": "binary_sensor.door", "operator": "eq", "value": "on", "page": "p2"},
        {"id": "r3", "type": "state", "entity": "sensor.t", "operator": "gt", "value": "25", "page": "p3"},
    ]
    assert [r["id"] for r in time_rules_due(rules, datetime(2026, 1, 1, 7, 0, 0))] == ["r1"]
    assert time_rules_due(rules, datetime(2026, 1, 1, 7, 1)) == []
    assert [r["id"] for r in state_rules_fired(rules, "binary_sensor.door", "off", "on")] == ["r2"]
    assert state_rules_fired(rules, "binary_sensor.door", "on", "on") == []  # edge-triggered only
    assert [r["id"] for r in state_rules_fired(rules, "sensor.t", "24", "26.5")] == ["r3"]
    assert state_rules_fired(rules, "sensor.t", "26", "27") == []
    assert rule_entities(rules) == {"binary_sensor.door", "sensor.t"}


def test_downsample_and_scale():
    pts = [(0, 10.0), (50, 20.0), (75, 30.0)]
    series = downsample(pts, 0, 100, 4)
    assert series == [10.0, 20.0, 30.0, 30.0]  # bucket ends: 25, 50, 75, 100
    assert downsample([], 0, 100, 3) == [None, None, None]
    scaled, label = scale_series([10.0, None, 15.0, 20.0], "°C")
    assert scaled == [0, -1, 50, 100] and label == "10 – 20 °C"
    assert scale_series([None, None])[0] == [-1, -1]
    assert scale_series([5.0, 5.0])[0] == [50, 50]


def test_numeric_history_skips_text_states():
    class St:
        def __init__(self, ts, state):
            self.ts, self.state = ts, state

    pts = numeric_history([St(1, "1.5"), St(2, "unavailable"), St(3, "2")], lambda s: (s.ts, s.state))
    assert pts == [(1, 1.5), (3, 2.0)]


def test_settings_validation_and_device_screensaver():
    layout = default_layout()
    page_id = layout["pages"][0]["id"]
    layout["pages"][0]["tiles"].append(make_tile("sensor", 0, 1, entity="sensor.temp", title="Innen"))
    layout["settings"]["night"] = {"enabled": True, "mode": "time", "start": "22:00", "end": "06:00", "brightness": 5, "dim": 50, "page": page_id}
    layout["settings"]["screensaver"] = {"enabled": True, "after": 90, "entities": ["sensor.temp"]}
    layout["settings"]["rules"] = [{"name": "Morgen", "type": "time", "at": "07:00", "page": page_id}]
    valid = validate_layout(layout)
    assert valid["settings"]["rules"][0]["id"].startswith("r_")
    doc = json.loads(compile_device_layout(valid)[0])
    assert doc["set"]["ss"] == 90 and doc["set"]["sse"] == ["sensor.temp"] and doc["set"]["sst"] == ["Innen"]

    bad = default_layout()
    bad["settings"]["night"] = {"enabled": True, "start": "25:00", "end": "06:00"}
    bad["settings"]["rules"] = [{"type": "state", "entity": "x", "page": "p_missing"}, {"type": "magic", "page": page_id}]
    with pytest.raises(LayoutValidationError) as err:
        validate_layout(bad)
    text = " ".join(err.value.errors)
    assert "Nachtmodus" in text and "Entity-ID" in text and "Auslöser" in text and "Zielseite" in text


def test_rotation_setting():
    layout = default_layout()
    layout["settings"]["rotation"] = 270
    doc = json.loads(compile_device_layout(validate_layout(layout))[0])
    assert doc["set"]["rot"] == 270
    layout["settings"]["touch_mode"] = 1
    assert json.loads(compile_device_layout(validate_layout(layout))[0])["set"]["tch"] == 1
    layout["settings"]["rotation"] = 45  # invalid -> falls back to 0
    assert validate_layout(layout)["settings"]["rotation"] == 0


def test_rgb_and_graph_tiles():
    rgb = make_tile("rgb", 0, 0, entity="light.strip")
    assert resolve_control(rgb, "btn", {"b": "c4"}, None) == ("light", "turn_on", {"entity_id": "light.strip", "rgb_color": [10, 132, 255]})
    assert resolve_control(rgb, "btn", {"b": "c1"}, None)[2]["color_temp_kelvin"] == 2700
    assert resolve_control(rgb, "btn", {"b": "c9"}, None) is None
    assert resolve_control(rgb, "set", {"v": 60}, None)[2]["brightness_pct"] == 60
    assert resolve_control(rgb, "color", {"h": 240, "s": 100}, None) == ("light", "turn_on", {"entity_id": "light.strip", "hs_color": [240, 100]})
    assert resolve_control(rgb, "color", {"k": 2700}, None)[2] == {"entity_id": "light.strip", "color_temp_kelvin": 2700}
    assert resolve_control(rgb, "color", {"h": 999, "s": 50}, None) is None
    assert resolve_control(make_tile("dimmer", 0, 0, entity="light.d"), "color", {"h": 10, "s": 10}, None) is None
    doc = json.loads(compile_device_layout(validate_layout({**default_layout(), "pages": [{"id": "p_1", "name": "A", "cols": 3, "rows": 3, "tiles": [rgb]}]}))[0])
    assert doc["pages"][0]["t"][0]["ha"] == 8  # long press opens the colour picker
    layout = default_layout()
    graph = make_tile("graph", 0, 1, 2, 1, entity="sensor.power")
    graph["hours"] = 99
    layout["pages"][0]["tiles"].append(graph)
    assert validate_layout(layout)["pages"][0]["tiles"][-1]["hours"] == 48
    layout["pages"][0]["tiles"][-1]["entity"] = "light.x"
    with pytest.raises(LayoutValidationError):
        validate_layout(layout)

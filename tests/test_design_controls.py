"""Design controls preserve bindings through validation and device compilation."""
import json

from gs_pure.layout import (
    compile_device_layout, default_layout, layout_entities, make_tile,
    resolve_action, resolve_control, swipe_item_tile, validate_layout,
)


def test_ring_compiles_and_controls_the_assigned_light():
    layout = default_layout()
    tile = make_tile("dimmer", 0, 2, entity="light.living")
    tile["style"].update(control="ring", texture="living")
    layout["pages"][0]["tiles"].append(tile)
    valid = validate_layout(layout)
    normalized = valid["pages"][0]["tiles"][-1]
    device = json.loads(compile_device_layout(valid)[0])["pages"][0]["t"][-1]
    assert device["ring"] == 1 and device["tex"] == 1
    assert resolve_control(normalized, "set", {"v": 72}, {}) == ("light", "turn_on", {"entity_id": "light.living", "brightness_pct": 72})
    assert resolve_control(normalized, "set", {"v": 0}, {}) == ("light", "turn_off", {"entity_id": "light.living"})
    assert resolve_control(normalized, "set", {"v": 101}, {}) is None


def test_room_rows_keep_separate_actions_and_all_state_subscriptions():
    layout = default_layout()
    tile = make_tile("swipe", 0, 2, title="Küche")
    tile["style"].update(control="room", texture="kitchen")
    tile["items"] = [
        {"entity": "light.kitchen", "title": "Licht", "icon": "lightbulb"},
        {"entity": "switch.kettle", "title": "Steckdose", "icon": "power-plug"},
        {"entity": "sensor.humidity", "title": "Feuchte", "icon": "water-percent"},
    ]
    layout["pages"][0]["tiles"].append(tile)
    valid = validate_layout(layout)
    normalized = valid["pages"][0]["tiles"][-1]
    device = json.loads(compile_device_layout(valid)[0])["pages"][0]["t"][-1]
    assert device["room"] == 1 and device["tex"] == 2
    assert {"light.kitchen", "switch.kettle", "sensor.humidity"} <= layout_entities(valid)
    assert resolve_action(swipe_item_tile(normalized, 1), "tap") == ("homeassistant", "toggle", {"entity_id": "switch.kettle"})
    assert resolve_action(swipe_item_tile(normalized, 2), "tap") is None
    assert swipe_item_tile(normalized, 4) is None


def test_unknown_texture_and_incompatible_control_are_discarded():
    layout = default_layout()
    tile = make_tile("sensor", 0, 2, entity="sensor.temp")
    tile["style"].update(control="ring", texture="../../secret")
    layout["pages"][0]["tiles"].append(tile)
    device = json.loads(compile_device_layout(validate_layout(layout))[0])["pages"][0]["t"][-1]
    assert "ring" not in device and "tex" not in device

"""Swipe tile: several entities in one tile, swiping on the display shows the next one."""

import json

import pytest

from gs_pure.layout import (
    LayoutValidationError,
    compile_device_layout,
    default_layout,
    layout_entities,
    make_tile,
    resolve_action,
    swipe_item_tile,
    validate_layout,
)

ITEMS = [
    {"entity": "light.wohnzimmer", "title": "Wohnzimmer", "icon": "lightbulb"},
    {"entity": "sensor.temperatur", "title": "", "icon": None},
    {"entity": "switch.kaffee", "title": "Kaffee", "icon": "toggle-switch"},
]


def _layout(items):
    layout = default_layout()
    tile = make_tile("swipe", 0, 2, w=1, h=1)
    tile["items"] = items
    layout["pages"][0]["tiles"].append(tile)
    return layout, tile["id"]


def _device_tile(valid, tid):
    doc = json.loads(compile_device_layout(valid)[0])
    return next(t for p in doc["pages"] for t in p["t"] if t["id"] == tid)


def test_swipe_tile_compiles_items_and_pushes_all_entities():
    layout, tid = _layout(ITEMS)
    valid = validate_layout(layout)
    tile = next(t for t in valid["pages"][0]["tiles"] if t["id"] == tid)
    assert tile["entity"] == "light.wohnzimmer"  # mirrors the first item
    dev = _device_tile(valid, tid)
    assert dev["k"] == "swipe" and dev["e"] == "light.wohnzimmer"
    assert dev["it"] == [
        ["light.wohnzimmer", "Wohnzimmer", "lightbulb"],
        ["sensor.temperatur", "Temperatur", ""],  # empty title -> readable object id
        ["switch.kaffee", "Kaffee", "toggle-switch"],
    ]
    assert dev["ta"] == 1  # remote tap: at least one item can be toggled
    assert {i["entity"] for i in ITEMS} <= layout_entities(valid)


def test_tap_targets_the_shown_item():
    layout, tid = _layout(ITEMS)
    tile = next(t for t in validate_layout(layout)["pages"][0]["tiles"] if t["id"] == tid)
    assert resolve_action(swipe_item_tile(tile, 2), "tap") == ("homeassistant", "toggle", {"entity_id": "switch.kaffee"})
    assert resolve_action(swipe_item_tile(tile, 1), "tap") is None  # sensor: nothing to toggle
    for bad in (3, -1, "1", True, None):
        assert swipe_item_tile(tile, bad) is None


def test_swipe_tile_validation():
    with pytest.raises(LayoutValidationError):
        validate_layout(_layout([])[0])  # needs at least one entity
    with pytest.raises(LayoutValidationError):
        validate_layout(_layout(ITEMS + [{"entity": "light.a"}, {"entity": "light.b"}])[0])  # max 4
    with pytest.raises(LayoutValidationError):
        validate_layout(_layout([{"entity": "kein sensor"}])[0])
    with pytest.raises(LayoutValidationError):
        validate_layout(_layout([{"entity": "light.a", "icon": "gibt-es-nicht"}])[0])


def test_swipe_direction():
    layout, tid = _layout(ITEMS)
    assert "sd" not in _device_tile(validate_layout(layout), tid)  # default: left/right
    layout["pages"][0]["tiles"][-1]["swipe_dir"] = "v"
    valid = validate_layout(layout)
    assert _device_tile(valid, tid)["sd"] == 1
    layout["pages"][0]["tiles"][-1]["swipe_dir"] = "diagonal"
    assert "sd" not in _device_tile(validate_layout(layout), tid)

"""Tile layout options: alignment, icon size, state size and icon frame."""

import json

from gs_pure.layout import compile_device_layout, default_layout, make_tile, validate_layout


def _device_tile(style):
    layout = default_layout()
    tile = make_tile("light", 0, 1, entity="light.kitchen", title="Küche", icon="lightbulb")
    tile["style"].update(style)
    layout["pages"][0]["tiles"].append(tile)
    doc = json.loads(compile_device_layout(validate_layout(layout))[0])
    return doc["pages"][0]["t"][-1]


def test_defaults_add_no_keys():
    dev = _device_tile({})
    for key in ("al", "is", "vs", "if"):
        assert key not in dev


def test_options_are_sent_to_the_device():
    dev = _device_tile({"align": "center", "icon_size": "l", "state_size": "xl", "icon_frame": "ring"})
    assert dev["al"] == 2
    assert dev["is"] == 40
    assert dev["vs"] == 3
    assert dev["if"] == 2


def test_invalid_values_fall_back_to_auto():
    dev = _device_tile({"align": "diagonal", "icon_size": 99, "state_size": "huge", "icon_frame": "star"})
    for key in ("al", "is", "vs", "if"):
        assert key not in dev

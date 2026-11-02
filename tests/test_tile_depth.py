"""3D tiles setting: on by default, can be switched off."""

import json

from gs_pure.layout import compile_device_layout, default_layout, validate_layout


def _t3d(layout):
    return json.loads(compile_device_layout(validate_layout(layout))[0])["set"]["t3d"]


def test_tile_depth_default_on_and_switchable():
    layout = default_layout()
    assert _t3d(layout) == 1
    layout["settings"].pop("tile_depth", None)  # older layouts without the setting get 3D too
    assert _t3d(layout) == 1
    layout["settings"]["tile_depth"] = False
    assert _t3d(layout) == 0

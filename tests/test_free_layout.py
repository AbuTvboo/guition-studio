"""Free layout pages (fine 4 px grid) and the icon-only 'on' effect."""

import json

import pytest

from gs_pure.const import FREE_COLS, FREE_STEP
from gs_pure.layout import (
    LayoutValidationError,
    compile_device_layout,
    default_layout,
    free_rows,
    make_tile,
    validate_layout,
)


def _free_layout(**tile_geo):
    layout = default_layout()
    page = layout["pages"][0]
    page["free"] = True
    page["tiles"] = [make_tile("light", entity="light.kitchen", title="Küche", **tile_geo)]
    return layout


def test_free_page_uses_the_fine_grid_and_is_sent_with_step():
    layout = validate_layout(_free_layout(x=3, y=5, w=40, h=30))
    page = layout["pages"][0]
    assert page["free"] is True
    assert page["cols"] == FREE_COLS
    assert page["rows"] == free_rows(layout["settings"], 1)
    dev = json.loads(compile_device_layout(layout)[0])["pages"][0]
    assert dev["g"] == FREE_STEP
    assert dev["c"] == FREE_COLS
    assert dev["t"][0]["w"] == 40


def test_free_page_rejects_tiles_below_the_page_area():
    layout = default_layout()
    rows = free_rows(validate_layout(layout)["settings"], 1)
    with pytest.raises(LayoutValidationError):
        validate_layout(_free_layout(x=0, y=rows - 5, w=10, h=10))


def test_grid_pages_have_no_step():
    dev = json.loads(compile_device_layout(validate_layout(default_layout()))[0])["pages"][0]
    assert "g" not in dev


def test_icon_on_effect():
    layout = _free_layout(x=0, y=0, w=30, h=30)
    layout["pages"][0]["tiles"][0]["style"]["on_effect"] = "icon"
    dev = json.loads(compile_device_layout(validate_layout(layout))[0])["pages"][0]["t"][0]
    assert dev["og"] == 1

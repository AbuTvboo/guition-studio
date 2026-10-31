import json
import zlib

import pytest

from gs_pure.const import MAX_LAYOUT_BYTES, PROTOCOL_VERSION
from gs_pure.layout import (
    LayoutValidationError,
    compile_device_layout,
    default_layout,
    find_tile,
    layout_entities,
    make_tile,
    regenerate_ids,
    resolve_action,
    resolve_control,
    validate_layout,
)
from gs_pure.templates import build_templates


def _layout_with(tiles, cols=3, rows=3, pages=1):
    layout = default_layout()
    layout["pages"][0]["tiles"] = tiles
    layout["pages"][0]["cols"] = cols
    layout["pages"][0]["rows"] = rows
    for i in range(pages - 1):
        layout["pages"].append({"id": f"p_extra{i}", "name": f"S{i}", "cols": 2, "rows": 2, "tiles": []})
    return layout


def test_default_layout_is_valid_and_compiles():
    layout = validate_layout(default_layout())
    payload, crc = compile_device_layout(layout)
    doc = json.loads(payload)
    assert doc["v"] == PROTOCOL_VERSION
    assert doc["pages"][0]["c"] == 3
    assert crc == zlib.crc32(payload.encode())


def test_overlap_is_rejected():
    a = make_tile("light", 0, 0, 2, 1, entity="light.a")
    b = make_tile("switch", 1, 0, entity="switch.b")
    with pytest.raises(LayoutValidationError) as err:
        validate_layout(_layout_with([a, b]))
    assert any("überlappt" in e for e in err.value.errors)


def test_out_of_bounds_is_rejected():
    a = make_tile("light", 2, 2, 2, 1, entity="light.a")
    with pytest.raises(LayoutValidationError) as err:
        validate_layout(_layout_with([a]))
    assert any("außerhalb" in e for e in err.value.errors)


def test_entity_required_for_light():
    with pytest.raises(LayoutValidationError):
        validate_layout(_layout_with([make_tile("light", 0, 0)]))


def test_invalid_entity_and_service_rejected():
    t = make_tile("action", 0, 0, entity="Light.Bad Id")
    t2 = make_tile("action", 1, 0)
    t2["tap_action"] = {"action": "call_service", "service": "rm -rf"}
    with pytest.raises(LayoutValidationError) as err:
        validate_layout(_layout_with([t, t2]))
    assert len(err.value.errors) == 2


def test_navigation_target_must_exist():
    t = make_tile("nav", 0, 0)
    t["tap_action"] = {"action": "navigate", "page": "p_missing"}
    with pytest.raises(LayoutValidationError):
        validate_layout(_layout_with([t]))


def test_navigation_compiles_to_page_index():
    layout = _layout_with([], pages=2)
    t = make_tile("nav", 0, 0)
    t["tap_action"] = {"action": "navigate", "page": "p_extra0"}
    layout["pages"][0]["tiles"] = [t]
    doc = json.loads(compile_device_layout(validate_layout(layout))[0])
    tile = doc["pages"][0]["t"][0]
    assert tile["ta"] == 2 and tile["tp"] == 1


def test_remote_action_flag_only_when_resolvable():
    light = make_tile("light", 0, 0, entity="light.a")
    sensor = make_tile("sensor", 1, 0, entity="sensor.t")
    doc = json.loads(compile_device_layout(validate_layout(_layout_with([light, sensor])))[0])
    tiles = {t["k"]: t for t in doc["pages"][0]["t"]}
    assert tiles["light"]["ta"] == 1
    assert "ta" not in tiles["sensor"]


def test_resolve_actions():
    t = make_tile("light", 0, 0, entity="light.kitchen")
    assert resolve_action(t, "tap") == ("homeassistant", "toggle", {"entity_id": "light.kitchen"})
    t["tap_action"] = {"action": "call_service", "service": "light.turn_on", "data": {"brightness_pct": 50}}
    assert resolve_action(t, "tap") == ("light", "turn_on", {"brightness_pct": 50, "entity_id": "light.kitchen"})
    scene = make_tile("action", 0, 0, entity="scene.movie")
    assert resolve_action(scene, "tap") == ("scene", "turn_on", {"entity_id": "scene.movie"})
    assert resolve_action(scene, "hold") is None


def test_size_limit():
    layout = default_layout()
    layout["pages"] = []
    for p in range(10):
        tiles = []
        for y in range(6):
            for x in range(6):
                if len(tiles) + p * 36 >= 160:
                    break
                t = make_tile("action", x, y, title="X" * 64, entity=f"script.{'a' * 60}{p}{y}{x}")
                tiles.append(t)
        layout["pages"].append({"id": f"p_{p}", "name": f"Seite {p}", "cols": 6, "rows": 6, "tiles": tiles})
    valid = validate_layout(layout)
    with pytest.raises(LayoutValidationError) as err:
        compile_device_layout(valid)
    assert str(MAX_LAYOUT_BYTES) in err.value.errors[0]


def test_regenerate_ids_keeps_navigation():
    tpl = build_templates()[3]["layout"]
    copy = regenerate_ids(tpl)
    old_ids = {p["id"] for p in tpl["pages"]}
    new_ids = {p["id"] for p in copy["pages"]}
    assert not old_ids & new_ids
    nav = [t for t in copy["pages"][0]["tiles"] if t["type"] == "nav"][0]
    assert nav["tap_action"]["page"] in new_ids
    assert copy["settings"]["home_page"] in new_ids


DEMO_DOMAIN = {
    "light": "light", "dimmer": "light", "switch": "switch", "sensor": "sensor", "cover": "cover",
    "thermostat": "climate", "media": "media_player", "weather": "weather", "rgb": "light", "graph": "sensor",
}  # fmt: skip


def test_templates_are_structurally_valid_after_assigning_entities():
    for tpl in build_templates():
        layout = regenerate_ids(tpl["layout"])
        for page in layout["pages"]:
            for tile in page["tiles"]:
                if tile["type"] in DEMO_DOMAIN:
                    tile["entity"] = f"{DEMO_DOMAIN[tile['type']]}.demo"
        compile_device_layout(validate_layout(layout))


def test_entity_domain_must_match_tile_type():
    t = make_tile("cover", 0, 0, entity="light.wrong")
    with pytest.raises(LayoutValidationError) as err:
        validate_layout(_layout_with([t]))
    assert "cover" in err.value.errors[0]
    validate_layout(_layout_with([make_tile("cover", 0, 1, entity="cover.ok")]))


def test_legacy_icons_are_mapped_to_mdi():
    t = make_tile("action", 0, 1, icon="charge")
    layout = validate_layout(_layout_with([t]))
    assert layout["pages"][0]["tiles"][0]["icon"] == "flash"
    with pytest.raises(LayoutValidationError):
        validate_layout(_layout_with([make_tile("action", 0, 1, icon="does-not-exist")]))


def test_resolve_controls_are_type_bound_and_range_checked():
    dimmer = make_tile("dimmer", 0, 0, entity="light.a")
    assert resolve_control(dimmer, "set", {"v": 40}, None) == ("light", "turn_on", {"entity_id": "light.a", "brightness_pct": 40})
    assert resolve_control(dimmer, "set", {"v": 0}, None) == ("light", "turn_off", {"entity_id": "light.a"})
    assert resolve_control(dimmer, "set", {"v": 101}, None) is None
    assert resolve_control(dimmer, "set", {"v": "50"}, None) is None
    assert resolve_control(dimmer, "btn", {"b": "up"}, None) is None
    cover = make_tile("cover", 0, 0, entity="cover.c")
    assert resolve_control(cover, "btn", {"b": "down"}, None) == ("cover", "close_cover", {"entity_id": "cover.c"})
    assert resolve_control(cover, "btn", {"b": "rm"}, None) is None
    assert resolve_control(cover, "set", {"v": 10}, None) is None
    media = make_tile("media", 0, 0, entity="media_player.m")
    assert resolve_control(media, "btn", {"b": "play"}, None)[1] == "media_play_pause"
    thermo = make_tile("thermostat", 0, 0, entity="climate.k")
    attrs = {"temperature": 21.5, "target_temp_step": 0.5, "max_temp": 22}
    assert resolve_control(thermo, "btn", {"b": "plus"}, attrs) == ("climate", "set_temperature", {"entity_id": "climate.k", "temperature": 22.0})
    assert resolve_control(thermo, "btn", {"b": "plus"}, {**attrs, "temperature": 22})[2]["temperature"] == 22
    assert resolve_control(thermo, "btn", {"b": "minus"}, attrs)[2]["temperature"] == 21.0
    assert resolve_control(thermo, "btn", {"b": "plus"}, {}) is None


def test_layout_entities_and_find_tile():
    t = make_tile("light", 0, 0, entity="light.a")
    t["visibility"] = [{"entity": "binary_sensor.night", "operator": "eq", "value": "on"}]
    layout = validate_layout(_layout_with([t]))
    assert layout_entities(layout) == {"light.a", "binary_sensor.night"}
    assert find_tile(layout, t["id"])["entity"] == "light.a"


def test_non_ascii_payload_size_is_bytes():
    t = make_tile("text", 0, 0, title="Küche – Ümläute ✓")
    payload, crc = compile_device_layout(validate_layout(_layout_with([t])))
    assert "Küche" in payload
    assert crc == zlib.crc32(payload.encode("utf-8"))

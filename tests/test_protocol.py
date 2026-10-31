import json

from gs_pure.protocol import (
    build_state_messages,
    chunk_payload,
    describe_device_error,
    entity_payload,
    format_state,
    parse_event_payload,
    tile_visible,
    to_int32,
)


def test_chunking_roundtrip_and_utf8_boundaries():
    payload = ("äöü€" * 700) + "x"
    chunks = chunk_payload(payload, 1024)
    assert "".join(chunks) == payload
    assert all(len(c.encode("utf-8")) <= 1024 for c in chunks)
    for c in chunks:
        c.encode("utf-8").decode("utf-8")


def test_to_int32():
    assert to_int32(0xFFFFFFFF) == -1
    assert to_int32(0x7FFFFFFF) == 0x7FFFFFFF
    assert to_int32(0x80000000) == -(2**31)
    assert to_int32(-1 & 0xFFFFFFFF) & 0xFFFFFFFF == 0xFFFFFFFF


def test_format_states():
    assert format_state("light", "on", {"brightness": 255}) == "An · 100 %"
    assert format_state("light", "off", {}) == "Aus"
    assert format_state("sensor", "21.456", {"unit_of_measurement": "°C"}) == "21,5 °C"
    assert format_state("sensor", "40", {"unit_of_measurement": "%"}) == "40 %"
    assert format_state("binary_sensor", "on", {"device_class": "window"}) == "Offen"
    assert format_state("switch", "unavailable", {}) == "Nicht verfügbar"
    assert format_state("climate", "heat", {"current_temperature": 20.5, "temperature": 22}) == "20,5 °C → 22 °C"


def test_entity_payload():
    assert entity_payload("light", "on", {}) == {"o": 1, "a": 1, "d": "An", "n": 100}
    assert entity_payload("light", "on", {"brightness": 128})["n"] == 50
    assert entity_payload("light", "off", {})["n"] == 0
    assert entity_payload("light", "unavailable", {})["a"] == 0
    assert entity_payload("light", None, None)["a"] == 0


def test_entity_payload_extras_for_advanced_tiles():
    cover = entity_payload("cover", "open", {"current_position": 40})
    assert cover["n"] == 40 and cover["d"] == "Offen · 40 %"
    climate = entity_payload("climate", "heat", {"current_temperature": 20.5, "temperature": 22})
    assert climate["d"] == "20,5 °C" and climate["s"] == "Ziel 22 °C" and climate["o"] == 1
    media = entity_payload("media_player", "playing", {"media_title": "Song", "media_artist": "Band", "volume_level": 0.35})
    assert media["s"] == "Band – Song" and media["n"] == 35
    weather = entity_payload("weather", "rainy", {"temperature": 12.3, "humidity": 80})
    assert weather == {"o": 0, "a": 1, "d": "12,3 °C", "s": "Regen · 80 %", "i": "weather-rainy"}


def test_visibility():
    states = {"sun.sun": "below_horizon", "sensor.t": "18"}
    get = states.get
    tile = {"visibility": [{"entity": "sun.sun", "operator": "eq", "value": "below_horizon"}]}
    assert tile_visible(tile, get)
    tile["visibility"].append({"entity": "sensor.t", "operator": "gt", "value": "20"})
    assert not tile_visible(tile, get)
    assert tile_visible({"visibility": []}, get)


def test_state_messages_respect_size():
    entities = {f"sensor.s{i:03d}": {"o": 0, "a": 1, "d": "123,4 kWh"} for i in range(200)}
    msgs = build_state_messages(entities, {"t_1": 0}, max_len=1500)
    assert len(msgs) > 1
    merged = {}
    vis = {}
    for m in msgs:
        assert len(m.encode()) <= 1500
        doc = json.loads(m)
        merged.update(doc.get("e", {}))
        vis.update(doc.get("v", {}))
    assert merged == entities
    assert vis == {"t_1": 0}


def test_event_payload_and_errors():
    assert parse_event_payload('{"s":1,"ok":true}') == {"s": 1, "ok": True}
    assert parse_event_payload("garbage") == {}
    assert "Prüfsumme" in describe_device_error("crc")
    assert "abgelehnt" in describe_device_error("schema:grid")

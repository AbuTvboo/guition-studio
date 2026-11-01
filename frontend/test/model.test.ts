import { describe, expect, it } from "vitest";
import { cellRect, pageGeometry, pointToCell } from "../src/geometry";
import { History } from "../src/history";
import {
  addPage,
  addTile,
  duplicatePage,
  findFreeSpot,
  isFree,
  makePage,
  makeTile,
  missingEntities,
  movePage,
  moveTiles,
  pasteTiles,
  removePage,
  resizeTile,
  setGrid,
} from "../src/model";
import { buildLibrary, defaultTileType, filterLibrary } from "../src/entities";
import { formatState, previewExtras } from "../src/preview";
import { DEVICE_ICONS, LEGACY_ICONS, normalizeIcon } from "../src/icons";
import { entityDomainProblem, needsEntity } from "../src/model";
import { matchesQuery } from "../src/views/entity-picker";
import type { Hass, Layout } from "../src/types";

function layout(): Layout {
  const p1 = makePage("Eins");
  const p2 = makePage("Zwei");
  p1.tiles.push(makeTile("light", 0, 0, 1, 1, { id: "t_a", entity: "light.a" }), makeTile("switch", 1, 0, 2, 1, { id: "t_b", entity: "switch.b" }));
  return {
    schema: 1,
    revision: 0,
    settings: { theme: "modern_dark", brightness: 80, standby_brightness: 10, timeout: 60, home_after: 0, home_page: p1.id, show_header: true, show_dots: true, swipe: true, language: "de" },
    pages: [p1, p2],
  };
}

describe("geometry (must match firmware)", () => {
  it("computes header/dots offsets", () => {
    expect(pageGeometry({ show_header: true, show_dots: true }, 2)).toEqual({ top: 44, bottom: 22, height: 414 });
    expect(pageGeometry({ show_header: true, show_dots: true }, 1).bottom).toBe(0);
  });
  it("cell rects use integer division like C++", () => {
    const geo = pageGeometry({ show_header: true, show_dots: true }, 2);
    // area 464 x 398, 3x3, gap 8 -> cw = floor(448/3) = 149, ch = floor(382/3) = 127
    expect(cellRect({ cols: 3, rows: 3 }, geo, 1, 1, 2, 1)).toEqual({ x: 8 + 157, y: 8 + 135, w: 149 * 2 + 8, h: 127 });
  });
  it("maps points to clamped cells", () => {
    const geo = pageGeometry({ show_header: false, show_dots: false }, 1);
    expect(pointToCell({ cols: 3, rows: 3 }, geo, 10, 10)).toEqual({ x: 0, y: 0 });
    expect(pointToCell({ cols: 3, rows: 3 }, geo, 470, 470)).toEqual({ x: 2, y: 2 });
    expect(pointToCell({ cols: 3, rows: 3 }, geo, -50, 999)).toEqual({ x: 0, y: 2 });
  });
});

describe("collision and moves", () => {
  it("detects collisions and bounds", () => {
    const l = layout();
    expect(isFree(l.pages[0], { x: 0, y: 0, w: 1, h: 1 })).toBe(false);
    expect(isFree(l.pages[0], { x: 0, y: 1, w: 3, h: 1 })).toBe(true);
    expect(isFree(l.pages[0], { x: 2, y: 2, w: 2, h: 1 })).toBe(false);
    expect(findFreeSpot(l.pages[0], 1, 1)).toEqual({ x: 0, y: 1 });
  });
  it("moves within a page and rejects overlaps", () => {
    const l = layout();
    expect(moveTiles(l, l.pages[0].id, ["t_a"], "t_a", l.pages[0].id, 1, 0).ok).toBe(false);
    const res = moveTiles(l, l.pages[0].id, ["t_a"], "t_a", l.pages[0].id, 2, 2);
    expect(res.ok).toBe(true);
    expect(res.layout.pages[0].tiles.find((t) => t.id === "t_a")).toMatchObject({ x: 2, y: 2 });
    expect(l.pages[0].tiles[0].x).toBe(0); // immutable
  });
  it("moves a group across pages keeping offsets", () => {
    const l = layout();
    const res = moveTiles(l, l.pages[0].id, ["t_a", "t_b"], "t_a", l.pages[1].id, 0, 2);
    expect(res.ok).toBe(true);
    expect(res.layout.pages[0].tiles).toHaveLength(0);
    expect(res.layout.pages[1].tiles.map((t) => [t.id, t.x, t.y])).toEqual([["t_a", 0, 2], ["t_b", 1, 2]]);
  });
  it("group moves that leave the grid fail", () => {
    const l = layout();
    expect(moveTiles(l, l.pages[0].id, ["t_a", "t_b"], "t_a", l.pages[1].id, 1, 0).ok).toBe(false);
  });
  it("resizes with collision check", () => {
    const l = layout();
    expect(resizeTile(l, l.pages[0].id, "t_a", 2, 1).ok).toBe(false);
    expect(resizeTile(l, l.pages[0].id, "t_a", 1, 3).ok).toBe(true);
    expect(resizeTile(l, l.pages[0].id, "t_a", 1, 4).ok).toBe(false);
  });
  it("adds tiles at the next free spot and shrinks if needed", () => {
    const l = layout();
    const res = addTile(l, l.pages[0].id, makeTile("sensor", 0, 0, 3, 3));
    expect(res.ok).toBe(true);
    const added = res.layout.pages[0].tiles[2];
    expect([added.x, added.y, added.w, added.h]).toEqual([0, 1, 1, 1]);
  });
  it("pastes keeping group shape with new ids", () => {
    const l = layout();
    const res = pasteTiles(l, l.pages[0].id, l.pages[0].tiles);
    expect(res.ids).toHaveLength(2);
    expect(res.ids).not.toContain("t_a");
    const pasted = res.layout.pages[0].tiles.filter((t) => res.ids.includes(t.id));
    expect(pasted.map((t) => [t.x, t.y])).toEqual([[0, 1], [1, 1]]);
  });
});

describe("pages", () => {
  it("adds, duplicates, moves and removes pages", () => {
    let l = layout();
    const added = addPage(l, "Drei")!;
    l = added.layout;
    expect(l.pages).toHaveLength(3);
    const dup = duplicatePage(l, l.pages[0].id)!;
    expect(dup.layout.pages[1].tiles[0].id).not.toBe("t_a");
    l = movePage(l, 2, 0);
    expect(l.pages[0].name).toBe("Drei");
  });
  it("removing a page clears navigation to it and fixes home page", () => {
    const l = layout();
    l.pages[1].tiles.push(makeTile("nav", 0, 0, 1, 1, { tap_action: { action: "navigate", page: l.pages[0].id } }));
    const next = removePage(l, l.pages[0].id)!;
    expect(next.pages[0].tiles[0].tap_action.action).toBe("none");
    expect(next.settings.home_page).toBe(next.pages[0].id);
    expect(removePage(next, next.pages[0].id)).toBeNull();
  });
  it("grid changes refuse to cut off tiles", () => {
    const l = layout();
    expect(setGrid(l, l.pages[0].id, 2, 2).ok).toBe(false);
    expect(setGrid(l, l.pages[0].id, 3, 1).ok).toBe(true);
    expect(setGrid(l, l.pages[0].id, 7, 3).ok).toBe(false);
  });
  it("finds tiles without entity", () => {
    const l = layout();
    l.pages[1].tiles.push(makeTile("light", 0, 0));
    expect(missingEntities(l)).toHaveLength(1);
  });
});

describe("history", () => {
  it("undo/redo snapshots", () => {
    const h = new History<{ v: number }>();
    h.push({ v: 1 });
    h.push({ v: 2 });
    expect(h.undo({ v: 3 })).toEqual({ v: 2 });
    expect(h.undo({ v: 2 })).toEqual({ v: 1 });
    expect(h.undo({ v: 1 })).toBeNull();
    expect(h.redo({ v: 1 })).toEqual({ v: 2 });
  });
});

describe("entity library", () => {
  const hass = {
    states: {
      "light.kueche": { entity_id: "light.kueche", state: "on", attributes: { friendly_name: "Küche Decke" } },
      "switch.steckdose": { entity_id: "switch.steckdose", state: "off", attributes: { friendly_name: "TV Steckdose", device_class: "outlet" } },
      "sensor.temp": { entity_id: "sensor.temp", state: "21.5", attributes: { friendly_name: "Temperatur", unit_of_measurement: "°C" } },
      "zone.home": { entity_id: "zone.home", state: "0", attributes: {} },
    },
    entities: { "light.kueche": { entity_id: "light.kueche", area_id: "kitchen" } },
    areas: { kitchen: { area_id: "kitchen", name: "Küche" } },
    connection: {} as Hass["connection"],
  } as Hass;

  it("categorises and searches by area, id and name", () => {
    const lib = buildLibrary(hass);
    expect(lib.map((e) => e.entity_id)).not.toContain("zone.home");
    expect(lib.find((e) => e.entity_id === "switch.steckdose")?.category).toBe("outlet");
    expect(filterLibrary(lib, "küche", "all", []).map((e) => e.entity_id)).toEqual(["light.kueche"]);
    expect(filterLibrary(lib, "sensor.", "all", [])).toHaveLength(1);
    expect(filterLibrary(lib, "", "favorites", ["sensor.temp"])).toHaveLength(1);
    expect(filterLibrary(lib, "", "light", [])).toHaveLength(1);
  });
  it("picks tile types per domain", () => {
    expect(defaultTileType("light.x")).toBe("light");
    expect(defaultTileType("scene.x")).toBe("action");
    expect(defaultTileType("sensor.x")).toBe("sensor");
    expect(defaultTileType("cover.x")).toBe("cover");
    expect(defaultTileType("climate.x")).toBe("thermostat");
    expect(defaultTileType("media_player.x")).toBe("media");
    expect(defaultTileType("weather.home")).toBe("weather");
    expect(defaultTileType("light.x", { entity_id: "light.x", state: "on", attributes: { supported_color_modes: ["brightness"] } })).toBe("dimmer");
    expect(defaultTileType("light.x", { entity_id: "light.x", state: "on", attributes: { supported_color_modes: ["onoff"] } })).toBe("light");
  });
  it("detects colour lights as rgb tiles", () => {
    expect(defaultTileType("light.x", { entity_id: "light.x", state: "on", attributes: { supported_color_modes: ["hs", "color_temp"] } })).toBe("rgb");
  });
  it("removing a page also removes rules and night page pointing to it", () => {
    const l = layout();
    const target = l.pages[1].id;
    l.settings.rules = [{ id: "r_1", name: "", enabled: true, type: "time", at: "07:00", page: target }];
    l.settings.night = { enabled: true, mode: "time", start: "22:00", end: "06:00", brightness: 10, dim: 0, page: target };
    const next = removePage(l, target)!;
    expect(next.settings.rules).toEqual([]);
    expect(next.settings.night?.page).toBeNull();
  });
  it("checks entity requirements per tile type", () => {
    expect(needsEntity({ type: "thermostat" })).toBe(true);
    expect(needsEntity({ type: "clock" })).toBe(false);
    expect(entityDomainProblem({ type: "cover", entity: "light.a" })).toContain("cover");
    expect(entityDomainProblem({ type: "cover", entity: "cover.a" })).toBeNull();
    expect(entityDomainProblem({ type: "switch", entity: "fan.a" })).toBeNull();
  });
  it("computes extras like the backend", () => {
    expect(previewExtras("light", "on", { brightness: 128 }).num).toBe(50);
    expect(previewExtras("climate", "heat", { current_temperature: 20.5, temperature: 22 })).toMatchObject({ text: "20,5 °C", sub: "Ziel 22 °C" });
    expect(previewExtras("media_player", "playing", { media_title: "Song", media_artist: "Band", volume_level: 0.35 })).toMatchObject({ sub: "Band – Song", num: 35 });
    expect(previewExtras("weather", "rainy", { humidity: 80, wind_speed: 12 })).toMatchObject({ sub: "Regen", icon: "weather-rainy", detail: "Feuchte 80 % · Wind 12 km/h" });
  });
  it("finds entities with German search words", () => {
    const hass = {
      states: {
        "weather.forecast_home": { entity_id: "weather.forecast_home", state: "sunny", attributes: { friendly_name: "Forecast Home" } },
        "light.kitchen": { entity_id: "light.kitchen", state: "on", attributes: { friendly_name: "Kitchen" } },
      },
      connection: {} as Hass["connection"],
    } as Hass;
    expect(matchesQuery(hass, hass.states["weather.forecast_home"], "wetter")).toBe(true);
    expect(matchesQuery(hass, hass.states["light.kitchen"], "wetter")).toBe(false);
    expect(matchesQuery(hass, hass.states["light.kitchen"], "lampe")).toBe(true);
    expect(matchesQuery(hass, hass.states["weather.forecast_home"], "forecast")).toBe(true);
    expect(entityDomainProblem({ type: "weather", entity: "sensor.temp" })).toContain("Wetter-Entität");
  });
  it("maps legacy icon names to MDI", () => {
    expect(normalizeIcon("charge")).toBe("flash");
    expect(normalizeIcon("lightbulb")).toBe("lightbulb");
    expect(DEVICE_ICONS).toContain("lightbulb");
    expect(Object.values(LEGACY_ICONS).every((v) => DEVICE_ICONS.includes(v))).toBe(true);
  });
  it("formats states like the backend", () => {
    expect(formatState("sensor", "21.456", { unit_of_measurement: "°C" })).toBe("21,5 °C");
    expect(formatState("light", "on", { brightness: 255 })).toBe("An · 100 %");
    expect(formatState("binary_sensor", "on", { device_class: "window" })).toBe("Offen");
  });
});

import { detectPrayerSensors } from "../src/entities";

describe("detectPrayerSensors", () => {
  const ts = (entity_id: string, friendly_name = "") => ({ entity_id, state: "2026-11-02T05:31:00+00:00", attributes: { device_class: "timestamp", friendly_name } });
  it("finds the Islamic Prayer Times sensors and skips unrelated timestamps", () => {
    const states = Object.fromEntries(
      [
        ts("sensor.islamic_prayer_times_fajr_prayer"),
        ts("sensor.islamic_prayer_times_sunrise_prayer"),
        ts("sensor.islamic_prayer_times_dhuhr_prayer"),
        ts("sensor.islamic_prayer_times_asr_prayer"),
        ts("sensor.islamic_prayer_times_maghrib_prayer"),
        ts("sensor.islamic_prayer_times_isha_prayer"),
        ts("sensor.islamic_prayer_times_midnight"),
        ts("sensor.sun_next_rising", "Sunrise"),
        { entity_id: "sensor.asr_text", state: "x", attributes: {} },
      ].map((e) => [e.entity_id, e])
    );
    const found = detectPrayerSensors({ states } as never);
    expect(found).toEqual({
      fajr: "sensor.islamic_prayer_times_fajr_prayer",
      sunrise: "sensor.islamic_prayer_times_sunrise_prayer",
      dhuhr: "sensor.islamic_prayer_times_dhuhr_prayer",
      asr: "sensor.islamic_prayer_times_asr_prayer",
      maghrib: "sensor.islamic_prayer_times_maghrib_prayer",
      isha: "sensor.islamic_prayer_times_isha_prayer",
    });
  });
  it("does not take the sun's sunrise sensor as prayer sunrise", () => {
    const states = { "sensor.sun_next_rising": ts("sensor.sun_next_rising", "Sunrise") };
    expect(detectPrayerSensors({ states } as never)).toEqual({});
  });
});

// DEVELOPMENT ONLY – standalone harness for `npm run dev`.
// Emulates the guition_studio websocket API in memory so the editor can be
// developed without Home Assistant. Nothing here is bundled into the release;
// the "apply" command is clearly a simulation and never talks to a device.
import type { Hass, HassEntity, Layout } from "../src/types";
import { makePage, makeTile } from "../src/model";
import { DEVICE_ICONS } from "../src/icon-list";

const themes = {
  modern_dark: { name: "Modern Dark", page_bg: "#0B0F14", tile_bg: "#1C232C", text: "#E6EDF3", muted: "#8B98A5", icon: "#9CC4FF", on_bg: "#FFB547", on_text: "#1A1200", header_bg: "#0B0F14", header_text: "#E6EDF3", accent: "#3D8BFD", ok: "#2EA043", error: "#F85149" },
  modern_light: { name: "Modern Light", page_bg: "#EEF1F5", tile_bg: "#FFFFFF", text: "#1F2937", muted: "#6B7280", icon: "#2563EB", on_bg: "#FBBF24", on_text: "#1F1300", header_bg: "#EEF1F5", header_text: "#111827", accent: "#2563EB", ok: "#16A34A", error: "#DC2626" },
  amoled: { name: "AMOLED Black", page_bg: "#000000", tile_bg: "#0D0D0D", text: "#FFFFFF", muted: "#7A7A7A", icon: "#00E5FF", on_bg: "#00E5FF", on_text: "#000000", header_bg: "#000000", header_text: "#FFFFFF", accent: "#00E5FF", ok: "#00E676", error: "#FF1744" },
};

const ent = (entity_id: string, state: string, attributes: Record<string, unknown>): HassEntity => ({ entity_id, state, attributes });

function startLayout(): Layout {
  const p1 = makePage("Wohnzimmer");
  p1.tiles.push(
    makeTile("clock", 0, 0, 2, 1),
    makeTile("sensor", 2, 0, 1, 1, { entity: "sensor.wohnzimmer_temperatur", title: "Temperatur", icon: "tint" }),
    makeTile("light", 0, 1, 1, 1, { entity: "light.wohnzimmer_decke", title: "Decke", icon: "power" }),
    makeTile("light", 1, 1, 1, 1, { entity: "light.stehlampe", title: "Stehlampe", icon: "power" }),
    makeTile("switch", 2, 1, 1, 1, { entity: "switch.tv_steckdose", title: "TV", icon: "charge" })
  );
  const p2 = makePage("Küche");
  return {
    schema: 1,
    revision: 3,
    settings: { theme: "modern_dark", brightness: 80, standby_brightness: 10, timeout: 60, home_after: 0, home_page: p1.id, show_header: true, show_dots: true, swipe: true, language: "de" },
    pages: [p1, p2],
  };
}

export function createMockHass(): Hass {
  const states: Record<string, HassEntity> = {
    "light.wohnzimmer_decke": ent("light.wohnzimmer_decke", "on", { friendly_name: "Wohnzimmer Decke", brightness: 180 }),
    "light.stehlampe": ent("light.stehlampe", "off", { friendly_name: "Stehlampe" }),
    "light.kueche": ent("light.kueche", "unavailable", { friendly_name: "Küche Arbeitslicht" }),
    "switch.tv_steckdose": ent("switch.tv_steckdose", "on", { friendly_name: "TV-Steckdose", device_class: "outlet" }),
    "sensor.wohnzimmer_temperatur": ent("sensor.wohnzimmer_temperatur", "21.46", { friendly_name: "Wohnzimmer Temperatur", unit_of_measurement: "°C", device_class: "temperature" }),
    "sensor.luftfeuchte": ent("sensor.luftfeuchte", "48", { friendly_name: "Luftfeuchte", unit_of_measurement: "%", device_class: "humidity" }),
    "scene.filmabend": ent("scene.filmabend", "2026-10-30T20:00:00", { friendly_name: "Filmabend" }),
    "cover.rollladen": ent("cover.rollladen", "open", { friendly_name: "Rollladen Terrasse", current_position: 40 }),
    "binary_sensor.terrassentuer": ent("binary_sensor.terrassentuer", "off", { friendly_name: "Terrassentür", device_class: "door" }),
    "media_player.wohnzimmer": ent("media_player.wohnzimmer", "playing", { friendly_name: "Sonos Wohnzimmer", media_title: "Lo-Fi Beats" }),
  };
  const displays: Record<string, any> = {
    d_demo: { id: "d_demo", name: "Wohnzimmer-Display", node: "guition_studio_a1b2c3", layout: startLayout(), applied: { revision: 3 } },
  };
  const listeners = new Set<(ev: any) => void>();
  const status = (d: any) => ({
    id: d.id, name: d.name, node: d.node, device_id: null, hardware: "guition-4848s040", online: true, linked: !!d.node,
    applied_revision: d.applied?.revision ?? null, applied_at: new Date().toISOString(), applied_size: 2100, draft_revision: d.layout.revision,
    draft_saved_at: new Date().toISOString(), in_sync: true, page_count: d.layout.pages.length, firmware: "0.1.0", protocol: 1, device_revision: d.applied?.revision ?? null,
    page: 0, heap: 180000, psram: 7200000, uptime: 7200, last_seen: new Date().toISOString(), transfer: { state: "idle", progress: 0, error: null }, ota: { state: "idle", progress: 0 },
  });
  const validate = (l: Layout) => {
    const errors = l.pages.flatMap((p) => p.tiles.filter((t) => ["light", "switch", "sensor"].includes(t.type) && !t.entity).map((t) => `Kachel „${t.title || t.id}“: Bitte eine Home-Assistant-Entität zuordnen.`));
    return { valid: !errors.length, errors, size: JSON.stringify(l).length / 2 };
  };
  const handlers: Record<string, (m: any) => any> = {
    info: () => ({
      version: "0.1.0-dev", hardware: [{ id: "guition-4848s040", name: "Guition ESP32-S3-4848S040", description: '4" 480×480', width: 480, height: 480, chip_family: "ESP32-S3" }],
      themes, icons: DEVICE_ICONS,
      tile_types: ["light", "dimmer", "rgb", "switch", "graph", "sensor", "clock", "nav", "text", "action", "status", "cover", "thermostat", "media", "weather"], planned_tile_types: ["camera"], protocol: 3,
      templates: [], favorites: ["light.stehlampe"], limits: { pages: 10, grid: 6, tiles: 160, bytes: 32768 }, firmware_repo: "AbuTvboo/guition-studio", firmware_url: "/api/guition_studio/firmware",
    }),
    displays: () => Object.values(displays).map(status),
    candidates: () => [{ node: "guition_studio_a1b2c3", device_id: null, name: "Guition Studio a1b2c3", assigned_display: "d_demo", firmware: "0.1.0", hardware: "guition-4848s040" }],
    "layout/get": (m) => ({ layout: displays[m.display_id].layout, draft_saved_at: new Date().toISOString(), applied_revision: 3, applied_at: null }),
    "layout/save": (m) => ((displays[m.display_id].layout = m.layout), { saved_at: new Date().toISOString(), ...validate(m.layout) }),
    "layout/validate": (m) => validate(m.layout),
    "layout/apply": async (m) => {
      const v = validate(m.layout);
      if (!v.valid) throw { code: "invalid_layout", message: v.errors.join("\n") };
      for (const p of [25, 50, 75, 100]) {
        await new Promise((r) => setTimeout(r, 250));
        listeners.forEach((l) => l({ data: { display_id: m.display_id, kind: "transfer", state: p < 100 ? "sending" : "confirming", progress: p } }));
      }
      const d = displays[m.display_id];
      d.layout = { ...m.layout, revision: (d.applied?.revision ?? 0) + 1 };
      d.applied = { revision: d.layout.revision };
      return { ok: true, revision: d.layout.revision, size: v.size, crc: 0, attempts: 1 };
    },
    favorites: () => ({ ok: true }),
    log: () => ({ entries: [{ ts: new Date().toISOString(), level: "info", display_id: "d_demo", message: "SIMULATION: Display online (Firmware 0.1.0)", data: null }], debug: false }),
    "firmware/status": () => ({ local: [], latest: null, error: null, repo: "AbuTvboo/guition-studio", path: "/config/guition_studio/firmware" }),
  };
  return {
    states,
    areas: { wohnzimmer: { area_id: "wohnzimmer", name: "Wohnzimmer" } },
    entities: { "light.wohnzimmer_decke": { entity_id: "light.wohnzimmer_decke", area_id: "wohnzimmer" } },
    connection: {
      async sendMessagePromise(msg: any) {
        const key = String(msg.type).replace("guition_studio/", "");
        const h = handlers[key];
        if (!h) throw { code: "unknown", message: `Mock: ${key} nicht implementiert` };
        return JSON.parse(JSON.stringify(await h(msg)));
      },
      async subscribeEvents(cb: (ev: any) => void) {
        listeners.add(cb);
        return () => listeners.delete(cb);
      },
    },
  } as Hass;
}

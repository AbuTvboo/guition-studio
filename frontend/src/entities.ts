// Entity library helpers: categorisation, search and default tiles (unit tested).
import { makeTile } from "./model";
import type { Hass, HassEntity, PrayerKey, SchoolChild, Tile, TileType } from "./types";

export type CategoryKey =
  | "all"
  | "favorites"
  | "light"
  | "switch"
  | "outlet"
  | "climate"
  | "sensor"
  | "cover"
  | "media"
  | "scene"
  | "automation"
  | "script"
  | "status"
  | "navigation"
  | "system";

export const CATEGORIES: { key: CategoryKey; label: string; icon: string }[] = [
  { key: "all", label: "Alle", icon: "mdi:view-grid" },
  { key: "favorites", label: "Favoriten", icon: "mdi:star" },
  { key: "light", label: "Beleuchtung", icon: "mdi:lightbulb" },
  { key: "switch", label: "Schalter", icon: "mdi:toggle-switch" },
  { key: "outlet", label: "Steckdosen", icon: "mdi:power-socket-de" },
  { key: "climate", label: "Klima", icon: "mdi:thermostat" },
  { key: "sensor", label: "Sensoren", icon: "mdi:gauge" },
  { key: "cover", label: "Rollläden", icon: "mdi:window-shutter" },
  { key: "media", label: "Medien", icon: "mdi:play-circle" },
  { key: "scene", label: "Szenen", icon: "mdi:palette" },
  { key: "automation", label: "Automationen", icon: "mdi:robot" },
  { key: "script", label: "Skripte", icon: "mdi:script-text" },
  { key: "status", label: "Statusanzeigen", icon: "mdi:information" },
  { key: "navigation", label: "Navigation", icon: "mdi:arrow-right-bold-box" },
  { key: "system", label: "Systemfunktionen", icon: "mdi:cog" },
];

export function domainOf(entityId: string): string {
  return entityId.split(".", 1)[0];
}

export function categoryOf(entity: HassEntity): CategoryKey | null {
  const domain = domainOf(entity.entity_id);
  const dc = entity.attributes.device_class;
  switch (domain) {
    case "light":
      return "light";
    case "switch":
      return dc === "outlet" ? "outlet" : "switch";
    case "input_boolean":
    case "button":
    case "input_button":
    case "lock":
    case "siren":
      return "switch";
    case "climate":
    case "fan":
    case "humidifier":
    case "water_heater":
      return "climate";
    case "sensor":
    case "number":
    case "input_number":
      return "sensor";
    case "cover":
    case "valve":
      return "cover";
    case "media_player":
      return "media";
    case "scene":
      return "scene";
    case "automation":
      return "automation";
    case "script":
      return "script";
    case "binary_sensor":
    case "person":
    case "device_tracker":
    case "sun":
    case "weather":
    case "alarm_control_panel":
    case "update":
      return "status";
    default:
      return null;
  }
}

export function friendlyName(entity: HassEntity): string {
  return (entity.attributes.friendly_name as string) || entity.entity_id;
}

export function areaName(hass: Hass, entityId: string): string {
  const reg = hass.entities?.[entityId];
  const areaId = reg?.area_id || (reg?.device_id ? hass.devices?.[reg.device_id]?.area_id : null);
  return (areaId && hass.areas?.[areaId]?.name) || "";
}

export function deviceName(hass: Hass, entityId: string): string {
  const deviceId = hass.entities?.[entityId]?.device_id;
  const dev = deviceId ? hass.devices?.[deviceId] : undefined;
  return dev?.name_by_user || dev?.name || "";
}

export interface LibraryEntry {
  entity_id: string;
  name: string;
  domain: string;
  category: CategoryKey;
  area: string;
  device: string;
  state: string;
}

export function buildLibrary(hass: Hass): LibraryEntry[] {
  const out: LibraryEntry[] = [];
  for (const entity of Object.values(hass.states)) {
    const category = categoryOf(entity);
    if (!category) continue;
    const reg = hass.entities?.[entity.entity_id];
    if (reg?.hidden) continue;
    out.push({
      entity_id: entity.entity_id,
      name: friendlyName(entity),
      domain: domainOf(entity.entity_id),
      category,
      area: areaName(hass, entity.entity_id),
      device: deviceName(hass, entity.entity_id),
      state: entity.state,
    });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name, "de"));
}

/** Search by name, entity id, device, area and domain. All words must match. */
export function filterLibrary(entries: LibraryEntry[], query: string, category: CategoryKey, favorites: string[]): LibraryEntry[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const fav = new Set(favorites);
  return entries.filter((e) => {
    if (category === "favorites" && !fav.has(e.entity_id)) return false;
    if (category !== "all" && category !== "favorites" && e.category !== category) return false;
    const hay = `${e.name} ${e.entity_id} ${e.device} ${e.area} ${e.domain}`.toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}

export function defaultTileType(entityId: string, entity?: HassEntity): TileType {
  const domain = domainOf(entityId);
  if (domain === "light") {
    const modes = (entity?.attributes.supported_color_modes as string[] | undefined) ?? [];
    if (modes.some((m) => ["rgb", "rgbw", "rgbww", "hs", "xy"].includes(m))) return "rgb";
    return modes.some((m) => m !== "onoff") ? "dimmer" : "light";
  }
  if (domain === "cover") return "cover";
  if (domain === "climate" || domain === "water_heater") return "thermostat";
  if (domain === "media_player") return "media";
  if (domain === "weather") return "weather";
  if (["switch", "input_boolean", "fan", "automation", "lock", "siren", "humidifier", "valve"].includes(domain)) return "switch";
  if (["scene", "script", "button", "input_button"].includes(domain)) return "action";
  return "sensor";
}

export function defaultIcon(entity: HassEntity | undefined, entityId: string): string {
  const domain = domainOf(entityId);
  const dc = entity?.attributes.device_class as string | undefined;
  if (domain === "light") return "lightbulb";
  if (domain === "switch") return dc === "outlet" ? "power-socket-de" : "toggle-switch";
  if (domain === "fan") return "fan";
  if (domain === "cover") return dc === "garage" ? "garage" : dc === "blind" ? "blinds" : dc === "curtain" ? "curtains" : "window-shutter";
  if (domain === "media_player") return dc === "tv" ? "television" : "speaker";
  if (domain === "scene") return "palette";
  if (domain === "script") return "script-text";
  if (domain === "automation") return "robot";
  if (domain === "climate" || domain === "water_heater") return "radiator";
  if (domain === "weather") return "weather-partly-cloudy";
  if (domain === "lock") return "lock";
  if (domain === "vacuum") return "robot-vacuum";
  if (domain === "person" || domain === "device_tracker") return "account";
  if (dc === "temperature") return "thermometer";
  if (dc === "humidity" || dc === "moisture") return "water-percent";
  if (dc === "power" || dc === "energy" || dc === "voltage" || dc === "current") return "lightning-bolt";
  if (dc === "battery") return "battery";
  if (dc === "motion" || dc === "occupancy" || dc === "presence") return "motion-sensor";
  if (dc === "connectivity") return "wifi";
  if (dc === "door" || dc === "garage_door") return "door";
  if (dc === "window" || dc === "opening") return "window-closed";
  return "gauge";
}

const DEFAULT_SIZE: Partial<Record<TileType, [number, number]>> = { media: [2, 1], thermostat: [1, 1], cover: [1, 1] };

export function tileFromEntity(hass: Hass, entityId: string): Tile {
  const entity = hass.states[entityId];
  const type = defaultTileType(entityId, entity);
  const [w, h] = DEFAULT_SIZE[type] ?? [1, 1];
  return makeTile(type, 0, 0, w, h, {
    entity: entityId,
    title: entity ? friendlyName(entity).slice(0, 64) : entityId,
    icon: defaultIcon(entity, entityId),
  });
}

/** Prayer times screensaver rows (same order and labels as on the display). */
export const PRAYERS: { key: PrayerKey; label: string; aliases: string[] }[] = [
  { key: "fajr", label: "Fajr", aliases: ["fajr", "fadschr", "sabah"] },
  { key: "sunrise", label: "Sonnenaufgang", aliases: ["sunrise", "sonnenaufgang", "shuruq", "shurooq", "gunes"] },
  { key: "dhuhr", label: "Dhuhr", aliases: ["dhuhr", "zuhr", "dhuhur", "duhr", "ogle"] },
  { key: "asr", label: "Asr", aliases: ["asr", "ikindi"] },
  { key: "maghrib", label: "Maghrib", aliases: ["maghrib", "magrib", "aksam"] },
  { key: "isha", label: "Isha", aliases: ["isha", "ischa", "yatsi"] },
];

/**
 * Find the timestamp sensors of the "Islamic Prayer Times" integration (or similar)
 * by entity id / name. Sensors that look like prayer sensors are preferred.
 */
export function detectPrayerSensors(hass: Hass): Partial<Record<PrayerKey, string>> {
  const sensors = Object.values(hass.states).filter(
    (e) => e.entity_id.startsWith("sensor.") && e.attributes.device_class === "timestamp" && !/midnight|mitternacht/.test(e.entity_id)
  );
  const out: Partial<Record<PrayerKey, string>> = {};
  for (const p of PRAYERS) {
    const hits = sensors.filter((e) => {
      const hay = `${e.entity_id} ${friendlyName(e)}`.toLowerCase();
      return p.aliases.some((a) => hay.includes(a));
    });
    const score = (e: HassEntity) => (/prayer|gebet|islam|salah|namaz|adhan/.test(`${e.entity_id} ${friendlyName(e)}`.toLowerCase()) ? 0 : 1);
    hits.sort((a, b) => score(a) - score(b) || a.entity_id.localeCompare(b.entity_id));
    if (hits[0] && (p.key !== "sunrise" || score(hits[0]) === 0)) out[p.key] = hits[0].entity_id;
  }
  return out;
}

/** School screensaver: what each child entry can show (key = SchoolChild field). */
export const SCHOOL_SOURCES: { key: Exclude<keyof SchoolChild, "name">; label: string; domain: "calendar" | "sensor"; source: string }[] = [
  { key: "timetable", label: "Stundenplan", domain: "calendar", source: "WebUntis" },
  { key: "homework", label: "Hausaufgaben", domain: "calendar", source: "WebUntis" },
  { key: "exams", label: "Prüfungen", domain: "calendar", source: "WebUntis" },
  { key: "letters", label: "Elternbriefe", domain: "sensor", source: "Eltern-Portal" },
  { key: "appointments", label: "Termine", domain: "sensor", source: "Eltern-Portal" },
  { key: "substitutions", label: "Vertretungsplan", domain: "sensor", source: "Eltern-Portal" },
];

const norm = (text: string) =>
  text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/**
 * Find the children of the WebUntis integration (one device per login: lessons, homework and exam
 * calendars) and of the Eltern-Portal integration (sensor.elternportal_<kind>_<student id>) and
 * pair them by first name (otherwise in order).
 */
export function detectSchoolChildren(hass: Hass): SchoolChild[] {
  const registry = Object.values(hass.entities ?? {});
  // WebUntis: calendars grouped by device
  const untis = new Map<string, { name: string; child: Partial<SchoolChild> }>();
  for (const e of registry) {
    if (e.platform !== "webuntis" || !e.entity_id.startsWith("calendar.") || !hass.states[e.entity_id]) continue;
    const dev = e.device_id ?? e.entity_id;
    const device = e.device_id ? hass.devices?.[e.device_id] : undefined;
    const group = untis.get(dev) ?? { name: device?.name_by_user || device?.name || "", child: {} };
    const key = e.translation_key ?? "";
    if (key === "homework" || /_(homework|hausaufgaben)$/.test(e.entity_id)) group.child.homework = e.entity_id;
    else if (key === "exam" || /_(exams?|prufungen|pruefungen)$/.test(e.entity_id)) group.child.exams = e.entity_id;
    else group.child.timetable = e.entity_id;
    untis.set(dev, group);
  }
  // Eltern-Portal: one set of sensors per student
  const portal = new Map<string, { name: string; child: Partial<SchoolChild> }>();
  const kinds: Record<string, keyof SchoolChild> = { letter: "letters", appointment: "appointments", substitution: "substitutions" };
  for (const entity of Object.values(hass.states)) {
    const m = /^sensor\.elternportal_(letter|appointment|substitution)_(\w+)$/.exec(entity.entity_id);
    if (!m) continue;
    const group = portal.get(m[2]) ?? { name: "", child: {} };
    (group.child as Record<string, string>)[kinds[m[1]]] = entity.entity_id;
    // friendly name "Lena Letter" -> "Lena"
    const words = friendlyName(entity).split(/\s+/);
    if (!group.name && words.length > 1) group.name = words.slice(0, -1).join(" ");
    portal.set(m[2], group);
  }
  const out: SchoolChild[] = [];
  const free = [...untis.values()];
  for (const p of portal.values()) {
    const first = norm(p.name.split(" ")[0] ?? "");
    let idx = first ? free.findIndex((u) => norm(`${u.name} ${Object.values(u.child).join(" ")}`).includes(first)) : -1;
    if (idx < 0 && free.length && portal.size === untis.size) idx = 0;
    const u = idx >= 0 ? free.splice(idx, 1)[0] : undefined;
    out.push({ ...(u?.child ?? {}), ...p.child, name: p.name || u?.name || `Kind ${out.length + 1}` });
  }
  for (const u of free) out.push({ ...u.child, name: u.name || `Kind ${out.length + 1}` });
  return out.slice(0, 4).map((c) => ({ ...c, name: c.name.slice(0, 20) }));
}

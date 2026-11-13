// Live preview helpers. Mirrors protocol.py (format_state / entity_payload) so the
// designer shows what the display will show.
import type { Hass, Theme, Tile } from "./types";

const ON = new Set(["on", "open", "opening", "closing", "home", "playing", "unlocked", "heat", "cool", "heat_cool", "auto", "dry", "fan_only", "active", "detected", "problem", "armed_home", "armed_away", "armed_night", "cleaning", "buffering"]);

const TEXT: Record<string, string> = {
  on: "An", off: "Aus", open: "Offen", opening: "Öffnet", closed: "Geschlossen", closing: "Schließt",
  home: "Zuhause", not_home: "Abwesend", playing: "Wiedergabe", paused: "Pausiert", idle: "Bereit",
  standby: "Standby", locked: "Verriegelt", unlocked: "Entriegelt", heat: "Heizen", cool: "Kühlen",
  auto: "Automatik", unknown: "Unbekannt", unavailable: "Nicht verfügbar", disarmed: "Unscharf",
};

const BINARY: Record<string, [string, string]> = {
  door: ["Offen", "Geschlossen"], window: ["Offen", "Geschlossen"], opening: ["Offen", "Geschlossen"],
  garage_door: ["Offen", "Geschlossen"], motion: ["Bewegung", "Keine Bewegung"], occupancy: ["Belegt", "Frei"],
  presence: ["Anwesend", "Abwesend"], moisture: ["Nass", "Trocken"], smoke: ["Rauch!", "OK"],
  battery: ["Schwach", "OK"], connectivity: ["Verbunden", "Getrennt"], problem: ["Problem", "OK"],
};

function num(v: unknown): string | null {
  const n = Number(v);
  if (v === null || v === undefined || v === "" || Number.isNaN(n)) return null;
  if (Number.isInteger(n)) return String(n);
  return (Math.abs(n) < 1000 ? n.toFixed(1) : n.toFixed(0)).replace(".", ",");
}

export function formatState(domain: string, state: string, a: Record<string, any>): string {
  if (state === "unavailable" || state === "unknown") return TEXT[state];
  if (["sensor", "number", "input_number"].includes(domain)) {
    const n = num(state);
    if (n !== null) return a.unit_of_measurement ? `${n} ${a.unit_of_measurement}` : n;
    return state.slice(0, 48);
  }
  if (domain === "binary_sensor") {
    const pair = BINARY[a.device_class];
    if (pair) return state === "on" ? pair[0] : pair[1];
  }
  if (domain === "light" && state === "on" && a.brightness != null) return `An · ${Math.round((a.brightness * 100) / 255)} %`;
  if (domain === "cover" && a.current_position != null && ["open", "opening", "closing"].includes(state)) return `${TEXT[state] ?? state} · ${a.current_position} %`;
  if (domain === "climate") {
    const cur = num(a.current_temperature);
    const target = num(a.temperature);
    if (cur && target) return `${cur} °C → ${target} °C`;
    if (cur) return `${cur} °C`;
  }
  if (domain === "media_player" && state === "playing" && a.media_title) return String(a.media_title).slice(0, 48);
  if (["scene", "button", "input_button"].includes(domain)) return "";
  if (domain === "script") return state === "on" ? "Läuft" : "";
  return (TEXT[state] ?? state).slice(0, 48);
}

export interface PreviewState {
  known: boolean;
  available: boolean;
  on: boolean;
  text: string;
  num: number; // -1 = none
  sub: string;
  icon: string | null;
  detail: string;
  parts?: { humidity: string; wind: string; pressure: string };
}

const WEATHER: Record<string, [string, string]> = {
  "clear-night": ["Klar", "weather-night"], cloudy: ["Bewölkt", "weather-cloudy"], exceptional: ["Unwetter", "alert"],
  fog: ["Nebel", "weather-fog"], hail: ["Hagel", "weather-hail"], lightning: ["Gewitter", "weather-lightning"],
  "lightning-rainy": ["Gewitter", "weather-lightning-rainy"], partlycloudy: ["Teilweise bewölkt", "weather-partly-cloudy"],
  pouring: ["Starkregen", "weather-pouring"], rainy: ["Regen", "weather-rainy"], snowy: ["Schnee", "weather-snowy"],
  "snowy-rainy": ["Schneeregen", "weather-snowy-rainy"], sunny: ["Sonnig", "weather-sunny"], windy: ["Windig", "weather-windy"],
  "windy-variant": ["Windig", "weather-windy"],
};

/** Mirrors protocol._extras(): n = 0..100, s = secondary text, i = icon override, d override for climate. */
export function previewExtras(
  domain: string,
  state: string,
  a: Record<string, any>
): { num: number; sub: string; icon: string | null; text?: string; detail?: string; parts?: { humidity: string; wind: string; pressure: string } } {
  if (domain === "light") return { num: state === "on" ? (typeof a.brightness === "number" ? Math.round((a.brightness * 100) / 255) : 100) : 0, sub: "", icon: null };
  if (domain === "cover" && typeof a.current_position === "number") return { num: a.current_position, sub: "", icon: null };
  if (domain === "climate" || domain === "water_heater") {
    const target = num(a.temperature);
    const cur = num(a.current_temperature);
    return { num: -1, sub: target ? `Ziel ${target} °C` : "", icon: null, text: cur ? `${cur} °C` : TEXT[state] ?? state };
  }
  if (domain === "media_player") {
    const title = a.media_title ? (a.media_artist ? `${a.media_artist} – ${a.media_title}` : String(a.media_title)) : "";
    return { num: typeof a.volume_level === "number" ? Math.round(a.volume_level * 100) : -1, sub: title.slice(0, 64), icon: null };
  }
  if (domain === "weather") {
    const [text, icon] = WEATHER[state] ?? [state, "weather-cloudy"];
    const details = [];
    const hum = num(a.humidity);
    if (hum) details.push(`Feuchte ${hum} %`);
    const wind = num(a.wind_speed);
    if (wind) details.push(`Wind ${wind} ${a.wind_speed_unit ?? "km/h"}`);
    return { num: -1, text: num(a.temperature) !== null ? `${num(a.temperature)} ${a.temperature_unit ?? "°C"}` : "–", sub: text, icon, detail: details.join(" · "), parts: { humidity: hum ? `Feuchte ${hum} %` : "", wind: wind ? `Wind ${wind} ${a.wind_speed_unit ?? "km/h"}` : "", pressure: num(a.pressure) ? `${num(a.pressure)} ${a.pressure_unit ?? "hPa"}` : "" } };
  }
  return { num: -1, sub: "", icon: null };
}

export function previewState(hass: Hass | undefined, tile: Tile): PreviewState {
  const empty = { num: -1, sub: "", icon: null, detail: "" };
  if (!tile.entity) return { known: false, available: true, on: false, text: "", ...empty };
  const st = hass?.states[tile.entity];
  if (!st) return { known: true, available: false, on: false, text: "Nicht verfügbar", ...empty };
  const domain = tile.entity.split(".", 1)[0];
  const available = st.state !== "unavailable";
  const base = { known: true, available, on: ON.has(st.state), text: formatState(domain, st.state, st.attributes) };
  if (!available) return { ...base, ...empty };
  const ex = previewExtras(domain, st.state, st.attributes);
  return { ...base, text: ex.text ?? base.text, num: ex.num, sub: ex.sub, icon: ex.icon, detail: ex.detail ?? "", parts: ex.parts };
}

export function tileColors(tile: Tile, theme: Theme, ps: PreviewState) {
  const stateful = ["light", "switch", "dimmer", "rgb", "swipe"].includes(tile.type);
  const s = tile.style;
  // "on" colours the whole card - or with on_effect "icon" only the icon (glow drawn by the tile)
  const on = stateful && ps.on && ps.available && s.on_effect !== "icon";
  return {
    bg: on ? s.on_color ?? theme.on_bg : s.background ?? theme.tile_bg,
    fg: on ? s.on_text_color ?? theme.on_text : s.color ?? theme.text,
    icon: !ps.available
      ? theme.muted
      : on
        ? s.on_text_color ?? theme.on_text
        : ps.on && tile.entity && tile.type !== "sensor"
          ? s.on_color ?? theme.on_bg
          : s.icon_color ?? theme.icon,
    /** icon glows in the on colour */
    glow: stateful && ps.on && ps.available && s.on_effect === "icon" ? s.on_color ?? theme.on_bg : null,
  };
}

export function visibleNow(hass: Hass | undefined, tile: Tile): boolean {
  return tile.visibility.every((c) => {
    const st = hass?.states[c.entity]?.state;
    if (st === undefined) return false;
    if (c.operator === "eq") return st === c.value;
    if (c.operator === "ne") return st !== c.value;
    const a = Number(st);
    const b = Number(c.value);
    if (Number.isNaN(a) || Number.isNaN(b)) return false;
    return c.operator === "gt" ? a > b : a < b;
  });
}

// Mirrors custom_components/guition_studio/layout.py (layout schema 1)

export type TileType =
  | "light"
  | "dimmer"
  | "rgb"
  | "graph"
  | "switch"
  | "sensor"
  | "clock"
  | "nav"
  | "text"
  | "action"
  | "status"
  | "settings"
  | "cover"
  | "thermostat"
  | "media"
  | "weather"
  | "swipe";

/** Tile types that need an entity; value = allowed domains (null = any). Mirrors const.py. */
export const TILE_ENTITY_DOMAINS: Partial<Record<TileType, string[] | null>> = {
  light: null,
  switch: null,
  sensor: null,
  dimmer: ["light"],
  rgb: ["light"],
  graph: ["sensor", "number", "input_number"],
  cover: ["cover"],
  thermostat: ["climate", "water_heater"],
  media: ["media_player"],
  weather: ["weather"],
  // entities are chosen per item (tile.items), tile.entity mirrors the first one
  swipe: null,
};
export type ActionType =
  | "none"
  | "default"
  | "toggle"
  | "turn_on"
  | "turn_off"
  | "call_service"
  | "navigate"
  | "home"
  | "back"
  | "next"
  | "prev";
export type FontSize = "s" | "m" | "l" | "xl" | "xxl";

export interface TileAction {
  action: ActionType;
  page?: string;
  service?: string;
  data?: Record<string, unknown>;
}

export interface Condition {
  entity: string;
  operator: "eq" | "ne" | "gt" | "lt";
  value: string;
}

export interface TileStyle {
  background: string | null;
  color: string | null;
  icon_color: string | null;
  on_color: string | null;
  on_text_color: string | null;
  font_size: FontSize;
  radius: number;
  border_width: number;
  border_color: string | null;
  opacity: number;
}

export interface Tile {
  id: string;
  type: TileType;
  x: number;
  y: number;
  w: number;
  h: number;
  entity: string | null;
  title: string;
  icon: string | null;
  format: "" | "time" | "time_date";
  style: TileStyle;
  show_title: boolean;
  show_state: boolean;
  show_icon: boolean;
  tap_action: TileAction;
  hold_action: TileAction;
  visibility: Condition[];
  hours?: number;
  weather?: WeatherOptions;
  /** swipe tile: up to 4 entities, one shown at a time */
  items?: SwipeItem[];
  /** swipe tile: "h" = left/right (default), "v" = up/down */
  swipe_dir?: "h" | "v";
}

export interface SwipeItem {
  entity: string;
  title: string;
  icon: string | null;
}

export const MAX_SWIPE_ITEMS = 4;

export interface WeatherOptions {
  condition: boolean;
  hilo: boolean;
  humidity: boolean;
  wind: boolean;
  pressure: boolean;
  forecast: boolean;
}

// Mirrors WEATHER_OPTIONS in layout.py
export const DEFAULT_WEATHER_OPTIONS: WeatherOptions = { condition: true, hilo: true, humidity: true, wind: true, pressure: false, forecast: true };

export interface Page {
  id: string;
  name: string;
  background: string | null;
  cols: number;
  rows: number;
  tiles: Tile[];
}

export interface DisplaySettings {
  theme: string;
  brightness: number;
  standby_brightness: number;
  timeout: number;
  home_after: number;
  home_page: string | null;
  show_header: boolean;
  show_dots: boolean;
  /** 3D tiles: light from above + drop shadow (default on) */
  tile_depth?: boolean;
  swipe: boolean;
  language: "de" | "en";
  rotation?: 0 | 90 | 180 | 270;
  touch_mode?: 0 | 1 | 2 | 3;
  night?: NightSettings;
  screensaver?: ScreensaverSettings;
  rules?: PageRule[];
}

export interface NightSettings {
  enabled: boolean;
  mode: "time" | "sun";
  start: string;
  end: string;
  brightness: number;
  dim: number;
  page: string | null;
}

export interface ScreensaverSettings {
  enabled: boolean;
  after: number;
  entities: string[];
  mode?: "clock" | "slideshow" | "prayer" | "football" | "mix";
  folder?: string;
  interval?: number;
  order?: "random" | "sequential";
  fit?: "cover" | "contain";
  show_clock?: boolean;
  /** prayer mode: timestamp sensors (Islamic Prayer Times integration), key -> entity id */
  prayer?: Partial<Record<PrayerKey, string>>;
  /** names on the display: "de" (Fajr, Dhuhr …) or "tr" (İmsak, Öğle …) */
  prayer_lang?: "de" | "tr";
  /** calligraphy background: "none" or one of PRAYER_BACKGROUNDS (0.5.9 stored a boolean) */
  prayer_bg?: string | boolean;
  /** football: ESPN league codes, e.g. "ger.1" */
  leagues?: string[];
  /** mix: seconds per view (prayer times / football) */
  mix_interval?: number;
}

export type PrayerKey = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";

export interface PageRule {
  id: string;
  name: string;
  enabled: boolean;
  type: "time" | "state";
  page: string;
  at?: string;
  entity?: string;
  operator?: "eq" | "ne" | "gt" | "lt";
  value?: string;
}

export interface Layout {
  schema: 1;
  revision: number;
  settings: DisplaySettings;
  pages: Page[];
}

export interface Theme {
  name: string;
  page_bg: string;
  tile_bg: string;
  text: string;
  muted: string;
  icon: string;
  on_bg: string;
  on_text: string;
  header_bg: string;
  header_text: string;
  accent: string;
  ok: string;
  error: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  layout: Layout;
  builtin: boolean;
}

export interface StudioInfo {
  version: string;
  hardware: { id: string; name: string; description: string; width: number; height: number; chip_family: string }[];
  themes: Record<string, Theme>;
  icons: string[];
  tile_types: TileType[];
  planned_tile_types: string[];
  templates: Template[];
  favorites: string[];
  limits: { pages: number; grid: number; tiles: number; bytes: number };
  firmware_repo: string;
  firmware_url: string;
  protocol: number;
  installer_url: string;
}

export interface TransferState {
  state: "idle" | "sending" | "confirming" | "done" | "error";
  progress: number;
  error: string | null;
  attempt?: number;
}

export interface DisplayStatus {
  id: string;
  name: string;
  node: string | null;
  device_id: string | null;
  hardware: string;
  online: boolean;
  linked: boolean;
  applied_revision: number | null;
  applied_at: string | null;
  applied_size: number | null;
  draft_revision: number;
  draft_saved_at: string | null;
  in_sync: boolean;
  page_count: number;
  firmware: string | null;
  protocol: number | null;
  device_revision: number | null;
  page: number | null;
  heap: number | null;
  psram: number | null;
  uptime: number | null;
  last_seen: string | null;
  transfer: TransferState;
  ota: { state: string; progress: number; version?: string };
  night?: boolean | null;
  reboots?: number | null;
  heap_min?: number | null;
}

export interface Candidate {
  node: string;
  device_id: string | null;
  name: string;
  assigned_display: string | null;
  firmware: string | null;
  hardware: string | null;
}

export interface LogEntry {
  ts: string;
  level: "info" | "warning" | "error" | "debug";
  display_id: string | null;
  message: string;
  data: Record<string, unknown> | null;
}

export interface FirmwareLocal {
  version: string;
  factory: boolean;
  ota: boolean;
  ota_size: number | null;
  verified: boolean | null;
  source: "release" | "local";
}

export interface FirmwareStatus {
  local: FirmwareLocal[];
  latest: { version: string; name: string; notes: string; published: string; url: string; complete: boolean } | null;
  error: string | null;
  repo: string;
  path: string;
}

export interface Validation {
  valid: boolean;
  errors: string[];
  size: number | null;
}

// Minimal subset of the Home Assistant frontend `hass` object we rely on.
export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed?: string;
}

export interface Hass {
  states: Record<string, HassEntity>;
  entities?: Record<string, { entity_id: string; device_id?: string | null; area_id?: string | null; hidden?: boolean; entity_category?: string | null }>;
  devices?: Record<string, { id: string; name?: string | null; name_by_user?: string | null; area_id?: string | null }>;
  areas?: Record<string, { area_id: string; name: string }>;
  user?: { name: string; is_admin: boolean };
  themes?: { darkMode?: boolean };
  connection: {
    sendMessagePromise<T = any>(msg: Record<string, unknown>): Promise<T>;
    subscribeEvents(cb: (ev: any) => void, eventType: string): Promise<() => void>;
  };
}

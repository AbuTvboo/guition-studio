import { a as e, c as t, d as n, g as r, i, l as a, n as o, o as s, p as c, r as l, s as u, t as d } from "./chunks/class-map-7fYjXT0k.js";
import { a as f, n as p, o as m, r as h, s as g, t as _ } from "./chunks/directive-helpers-BJqCicWh.js";
// src/api.ts
var v = class {
	constructor(e) {
		this.hass = e, this.info = () => this.call("info"), this.displays = () => this.call("displays"), this.candidates = () => this.call("candidates"), this.createDisplay = (e) => this.call("display/create", e), this.updateDisplay = (e, t) => this.call("display/update", {
			display_id: e,
			...t
		}), this.deleteDisplay = (e) => this.call("display/delete", { display_id: e }), this.getLayout = (e) => this.call("layout/get", { display_id: e }), this.saveLayout = (e, t) => this.call("layout/save", {
			display_id: e,
			layout: t
		}), this.validate = (e) => this.call("layout/validate", { layout: e }), this.apply = (e, t) => this.call("layout/apply", {
			display_id: e,
			layout: t
		}), this.copyLayout = (e, t) => this.call("layout/copy", {
			source: e,
			target: t
		}), this.command = (e, t, n = {}) => this.call("display/command", {
			display_id: e,
			command: t,
			...n
		}), this.saveTemplate = (e, t, n) => this.call("template/save", {
			name: e,
			description: t,
			layout: n
		}), this.deleteTemplate = (e) => this.call("template/delete", { template_id: e }), this.setFavorites = (e) => this.call("favorites", { favorites: e }), this.exportBackup = () => this.call("backup/export"), this.restoreBackup = (e) => this.call("backup/restore", { backup: e }), this.log = () => this.call("log"), this.setDebug = (e) => this.call("debug", { enabled: e }), this.firmwareStatus = () => this.call("firmware/status"), this.firmwareCheck = () => this.call("firmware/check"), this.firmwareDownload = (e) => this.call("firmware/download", { version: e }), this.slideFolders = () => this.call("slideshow/folders"), this.firmwareOta = (e, t) => this.call("firmware/ota", {
			display_id: e,
			version: t
		});
	}
	call(e, t = {}) {
		return this.hass().connection.sendMessagePromise({
			type: `guition_studio/${e}`,
			...t
		});
	}
};
function y(e) {
	return e && typeof e == "object" && "message" in e ? String(e.message) : String(e);
}
function b(e, t) {
	let n = new Blob([JSON.stringify(t, null, 2)], { type: "application/json" }), r = document.createElement("a");
	r.href = URL.createObjectURL(n), r.download = e, r.click(), setTimeout(() => URL.revokeObjectURL(r.href), 1e3);
}
function ee() {
	return new Promise((e, t) => {
		let n = document.createElement("input");
		n.type = "file", n.accept = "application/json,.json", n.onchange = async () => {
			let r = n.files?.[0];
			if (!r) return t(/* @__PURE__ */ Error("Keine Datei gewählt"));
			try {
				e(JSON.parse(await r.text()));
			} catch {
				t(/* @__PURE__ */ Error("Die Datei enthält kein gültiges JSON."));
			}
		}, n.click();
	});
}
function x(e, t) {
	let n = e.show_header ? 44 : 0, r = e.show_dots && t > 1 ? 22 : 0;
	return {
		top: n,
		bottom: r,
		height: 480 - n - r
	};
}
function te(e, t) {
	let n = t.height - 16;
	return {
		cw: Math.floor((464 - (e.cols - 1) * 8) / e.cols),
		ch: Math.floor((n - (e.rows - 1) * 8) / e.rows)
	};
}
function S(e, t, n, r, i, a) {
	let { cw: o, ch: s } = te(e, t);
	return {
		x: 8 + n * (o + 8),
		y: 8 + r * (s + 8),
		w: i * o + (i - 1) * 8,
		h: a * s + (a - 1) * 8
	};
}
function ne(e, t, n, r) {
	let { cw: i, ch: a } = te(e, t), o = Math.floor((n - 8 + 4) / (i + 8)), s = Math.floor((r - 8 + 4) / (a + 8));
	return {
		x: Math.max(0, Math.min(e.cols - 1, o)),
		y: Math.max(0, Math.min(e.rows - 1, s))
	};
}
// src/icon-list.ts
var re = {
	settings: "cog",
	next: "skip-next",
	prev: "skip-previous",
	volume: "volume-high",
	mute: "volume-off",
	up: "arrow-up",
	down: "arrow-down",
	left: "arrow-left",
	right: "arrow-right",
	ok: "check",
	warning: "alert",
	charge: "flash",
	eye: "motion-sensor",
	tint: "water-percent",
	audio: "music",
	video: "television",
	list: "menu",
	gps: "map-marker",
	edit: "pencil",
	trash: "trash-can",
	envelope: "email",
	call: "phone",
	save: "content-save",
	loop: "repeat",
	bars: "menu",
	drive: "harddisk"
};
// src/icons.ts
function ie(e) {
	return e ? re[e] ?? e : null;
}
function ae(e) {
	return `mdi:${ie(e)}`;
}
function oe(e) {
	return (ie(e) ?? "").split("-").slice(0, 2).map((e) => e[0]?.toUpperCase() ?? "").join("");
}
// src/preview.ts
var se = /* @__PURE__ */ new Set([
	"on",
	"open",
	"opening",
	"closing",
	"home",
	"playing",
	"unlocked",
	"heat",
	"cool",
	"heat_cool",
	"auto",
	"dry",
	"fan_only",
	"active",
	"detected",
	"problem",
	"armed_home",
	"armed_away",
	"armed_night",
	"cleaning",
	"buffering"
]), C = {
	on: "An",
	off: "Aus",
	open: "Offen",
	opening: "Öffnet",
	closed: "Geschlossen",
	closing: "Schließt",
	home: "Zuhause",
	not_home: "Abwesend",
	playing: "Wiedergabe",
	paused: "Pausiert",
	idle: "Bereit",
	standby: "Standby",
	locked: "Verriegelt",
	unlocked: "Entriegelt",
	heat: "Heizen",
	cool: "Kühlen",
	auto: "Automatik",
	unknown: "Unbekannt",
	unavailable: "Nicht verfügbar",
	disarmed: "Unscharf"
}, ce = {
	door: ["Offen", "Geschlossen"],
	window: ["Offen", "Geschlossen"],
	opening: ["Offen", "Geschlossen"],
	garage_door: ["Offen", "Geschlossen"],
	motion: ["Bewegung", "Keine Bewegung"],
	occupancy: ["Belegt", "Frei"],
	presence: ["Anwesend", "Abwesend"],
	moisture: ["Nass", "Trocken"],
	smoke: ["Rauch!", "OK"],
	battery: ["Schwach", "OK"],
	connectivity: ["Verbunden", "Getrennt"],
	problem: ["Problem", "OK"]
};
function w(e) {
	let t = Number(e);
	return e == null || e === "" || Number.isNaN(t) ? null : Number.isInteger(t) ? String(t) : (Math.abs(t) < 1e3 ? t.toFixed(1) : t.toFixed(0)).replace(".", ",");
}
function le(e, t, n) {
	if (t === "unavailable" || t === "unknown") return C[t];
	if ([
		"sensor",
		"number",
		"input_number"
	].includes(e)) {
		let e = w(t);
		return e === null ? t.slice(0, 48) : n.unit_of_measurement ? `${e} ${n.unit_of_measurement}` : e;
	}
	if (e === "binary_sensor") {
		let e = ce[n.device_class];
		if (e) return t === "on" ? e[0] : e[1];
	}
	if (e === "light" && t === "on" && n.brightness != null) return `An · ${Math.round(n.brightness * 100 / 255)} %`;
	if (e === "cover" && n.current_position != null && [
		"open",
		"opening",
		"closing"
	].includes(t)) return `${C[t] ?? t} · ${n.current_position} %`;
	if (e === "climate") {
		let e = w(n.current_temperature), t = w(n.temperature);
		if (e && t) return `${e} °C → ${t} °C`;
		if (e) return `${e} °C`;
	}
	return e === "media_player" && t === "playing" && n.media_title ? String(n.media_title).slice(0, 48) : [
		"scene",
		"button",
		"input_button"
	].includes(e) ? "" : e === "script" ? t === "on" ? "Läuft" : "" : (C[t] ?? t).slice(0, 48);
}
var ue = {
	"clear-night": ["Klar", "weather-night"],
	cloudy: ["Bewölkt", "weather-cloudy"],
	exceptional: ["Unwetter", "alert"],
	fog: ["Nebel", "weather-fog"],
	hail: ["Hagel", "weather-hail"],
	lightning: ["Gewitter", "weather-lightning"],
	"lightning-rainy": ["Gewitter", "weather-lightning-rainy"],
	partlycloudy: ["Teilweise bewölkt", "weather-partly-cloudy"],
	pouring: ["Starkregen", "weather-pouring"],
	rainy: ["Regen", "weather-rainy"],
	snowy: ["Schnee", "weather-snowy"],
	"snowy-rainy": ["Schneeregen", "weather-snowy-rainy"],
	sunny: ["Sonnig", "weather-sunny"],
	windy: ["Windig", "weather-windy"],
	"windy-variant": ["Windig", "weather-windy"]
};
function de(e, t, n) {
	if (e === "light") return {
		num: t === "on" ? typeof n.brightness == "number" ? Math.round(n.brightness * 100 / 255) : 100 : 0,
		sub: "",
		icon: null
	};
	if (e === "cover" && typeof n.current_position == "number") return {
		num: n.current_position,
		sub: "",
		icon: null
	};
	if (e === "climate" || e === "water_heater") {
		let e = w(n.temperature), r = w(n.current_temperature);
		return {
			num: -1,
			sub: e ? `Ziel ${e} °C` : "",
			icon: null,
			text: r ? `${r} °C` : C[t] ?? t
		};
	}
	if (e === "media_player") {
		let e = n.media_title ? n.media_artist ? `${n.media_artist} – ${n.media_title}` : String(n.media_title) : "";
		return {
			num: typeof n.volume_level == "number" ? Math.round(n.volume_level * 100) : -1,
			sub: e.slice(0, 64),
			icon: null
		};
	}
	if (e === "weather") {
		let [e, r] = ue[t] ?? [t, "weather-cloudy"], i = [], a = w(n.humidity);
		a && i.push(`Feuchte ${a} %`);
		let o = w(n.wind_speed);
		return o && i.push(`Wind ${o} ${n.wind_speed_unit ?? "km/h"}`), {
			num: -1,
			sub: e,
			icon: r,
			detail: i.join(" · "),
			parts: {
				humidity: a ? `Feuchte ${a} %` : "",
				wind: o ? `Wind ${o} ${n.wind_speed_unit ?? "km/h"}` : "",
				pressure: w(n.pressure) ? `${w(n.pressure)} ${n.pressure_unit ?? "hPa"}` : ""
			}
		};
	}
	return {
		num: -1,
		sub: "",
		icon: null
	};
}
function fe(e, t) {
	let n = {
		num: -1,
		sub: "",
		icon: null,
		detail: ""
	};
	if (!t.entity) return {
		known: !1,
		available: !0,
		on: !1,
		text: "",
		...n
	};
	let r = e?.states[t.entity];
	if (!r) return {
		known: !0,
		available: !1,
		on: !1,
		text: "Nicht verfügbar",
		...n
	};
	let i = t.entity.split(".", 1)[0], a = r.state !== "unavailable", o = {
		known: !0,
		available: a,
		on: se.has(r.state),
		text: le(i, r.state, r.attributes)
	};
	if (!a) return {
		...o,
		...n
	};
	let s = de(i, r.state, r.attributes);
	return {
		...o,
		text: s.text ?? o.text,
		num: s.num,
		sub: s.sub,
		icon: s.icon,
		detail: s.detail ?? "",
		parts: s.parts
	};
}
function pe(e, t, n) {
	let r = [
		"light",
		"switch",
		"dimmer",
		"rgb",
		"swipe"
	].includes(e.type) && n.on && n.available, i = e.style;
	return {
		bg: r ? i.on_color ?? t.on_bg : i.background ?? t.tile_bg,
		fg: r ? i.on_text_color ?? t.on_text : i.color ?? t.text,
		icon: n.available ? r ? i.on_text_color ?? t.on_text : n.on && e.entity && e.type !== "sensor" ? i.on_color ?? t.on_bg : i.icon_color ?? t.icon : t.muted
	};
}
function me(e, t) {
	return t.visibility.every((t) => {
		let n = e?.states[t.entity]?.state;
		if (n === void 0) return !1;
		if (t.operator === "eq") return n === t.value;
		if (t.operator === "ne") return n !== t.value;
		let r = Number(n), i = Number(t.value);
		return Number.isNaN(r) || Number.isNaN(i) ? !1 : t.operator === "gt" ? r > i : r < i;
	});
}
// src/types.ts
var he = {
	light: null,
	switch: null,
	sensor: null,
	dimmer: ["light"],
	rgb: ["light"],
	graph: [
		"sensor",
		"number",
		"input_number"
	],
	cover: ["cover"],
	thermostat: ["climate", "water_heater"],
	media: ["media_player"],
	weather: ["weather"],
	swipe: null
}, ge = {
	condition: !0,
	hilo: !0,
	humidity: !0,
	wind: !0,
	pressure: !1,
	forecast: !0
}, T = r`
  /* Palette: --gsp-* is set once on the panel (light/dark), every component maps it here. */
  :host {
    --gs-bg: var(--gsp-bg, #f3f6f9);
    --gs-surface: var(--gsp-surface, #ffffff);
    --gs-surface-2: var(--gsp-surface-2, #eef2f6);
    --gs-text: var(--gsp-text, #0f1c2a);
    --gs-muted: var(--gsp-muted, #5b6b7c);
    --gs-border: var(--gsp-border, #dfe5ec);
    --gs-primary: var(--gsp-primary, #0e7490);
    --gs-primary-strong: var(--gsp-primary-strong, #155e75);
    --gs-on-primary: var(--gsp-on-primary, #ffffff);
    --gs-accent: var(--gsp-accent, #f59e0b);
    --gs-ok: var(--gsp-ok, #15803d);
    --gs-warn: var(--gsp-warn, #b45309);
    --gs-error: var(--gsp-error, #b91c1c);
    --gs-radius: 12px;
    --gs-shadow: var(--gsp-shadow, 0 1px 2px rgba(15, 28, 42, 0.05), 0 2px 8px rgba(15, 28, 42, 0.04));
    --gs-shadow-lg: var(--gsp-shadow-lg, 0 12px 32px rgba(15, 28, 42, 0.18));
    color: var(--gs-text);
    font-family: "Inter", "Segoe UI", var(--paper-font-body1_-_font-family, "Roboto"), system-ui, sans-serif;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
  }
  * {
    box-sizing: border-box;
  }
  h1,
  h2,
  h3 {
    margin: 0 0 8px;
    font-weight: 600;
  }
  h1 {
    font-size: 22px;
    letter-spacing: -0.01em;
  }
  h2 {
    font-size: 16px;
    letter-spacing: -0.005em;
  }
  h3 {
    font-size: 11.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--gs-muted);
  }
  p {
    margin: 0 0 8px;
    line-height: 1.5;
  }
  .card {
    background: var(--gs-surface);
    border: 1px solid var(--gs-border);
    border-radius: var(--gs-radius);
    box-shadow: var(--gs-shadow);
    padding: 18px;
  }
  .grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
  .row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .spacer {
    flex: 1;
  }
  .muted {
    color: var(--gs-muted);
  }
  .small {
    font-size: 12px;
  }
  button,
  .btn {
    font: inherit;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 36px;
    padding: 0 14px;
    border-radius: 8px;
    border: 1px solid var(--gs-border);
    background: var(--gs-surface);
    color: var(--gs-text);
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    white-space: nowrap;
    transition: background 0.15s, border-color 0.15s, box-shadow 0.15s, transform 0.05s;
  }
  button:hover:not(:disabled) {
    background: var(--gs-surface-2);
    border-color: color-mix(in srgb, var(--gs-text) 18%, var(--gs-border));
  }
  button:active:not(:disabled) {
    transform: translateY(1px);
  }
  button:focus-visible,
  input:focus-visible,
  select:focus-visible,
  [tabindex]:focus-visible {
    outline: 2px solid var(--gs-primary);
    outline-offset: 2px;
  }
  button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  button.primary {
    background: var(--gs-primary);
    border-color: var(--gs-primary);
    color: var(--gs-on-primary);
    box-shadow: 0 1px 2px color-mix(in srgb, var(--gs-primary) 35%, transparent);
  }
  button.primary:hover:not(:disabled) {
    background: var(--gs-primary-strong);
    border-color: var(--gs-primary-strong);
  }
  button.danger {
    color: var(--gs-error);
    border-color: color-mix(in srgb, var(--gs-error) 40%, transparent);
  }
  button.icon {
    padding: 0;
    width: 36px;
  }
  button.ghost {
    border-color: transparent;
    background: transparent;
  }
  button.ghost:hover:not(:disabled) {
    border-color: transparent;
  }
  input,
  select,
  textarea {
    font: inherit;
    color: var(--gs-text);
    background: var(--gs-surface);
    border: 1px solid var(--gs-border);
    border-radius: 8px;
    min-height: 36px;
    padding: 6px 10px;
    width: 100%;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  input:focus,
  select:focus,
  textarea:focus {
    outline: none;
    border-color: var(--gs-primary);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--gs-primary) 20%, transparent);
  }
  textarea {
    min-height: 70px;
    font-family: ui-monospace, monospace;
    font-size: 12px;
  }
  input[type="color"] {
    padding: 2px;
    width: 44px;
    min-height: 32px;
  }
  input[type="range"] {
    padding: 0;
    border: none;
    accent-color: var(--gs-primary);
  }
  input[type="checkbox"] {
    width: 18px;
    min-height: 18px;
    accent-color: var(--gs-primary);
  }
  label.field {
    display: grid;
    gap: 4px;
    margin-bottom: 12px;
    font-size: 12px;
    color: var(--gs-muted);
  }
  label.field > span {
    font-weight: 500;
  }
  label.check {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    cursor: pointer;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 12px;
    background: var(--gs-surface-2);
    color: var(--gs-muted);
    white-space: nowrap;
  }
  .chip.ok {
    background: color-mix(in srgb, var(--gs-ok) 15%, transparent);
    color: var(--gs-ok);
  }
  .chip.warn {
    background: color-mix(in srgb, var(--gs-warn) 18%, transparent);
    color: var(--gs-warn);
  }
  .chip.error {
    background: color-mix(in srgb, var(--gs-error) 15%, transparent);
    color: var(--gs-error);
  }
  .notice {
    padding: 12px 14px;
    border-radius: 10px;
    background: color-mix(in srgb, var(--gs-primary) 7%, var(--gs-surface));
    border: 1px solid color-mix(in srgb, var(--gs-primary) 22%, transparent);
    border-left: 4px solid var(--gs-primary);
    margin: 8px 0;
    line-height: 1.5;
  }
  .notice.warn {
    background: color-mix(in srgb, var(--gs-warn) 8%, var(--gs-surface));
    border-color: color-mix(in srgb, var(--gs-warn) 28%, transparent);
    border-left-color: var(--gs-warn);
  }
  .notice.error {
    background: color-mix(in srgb, var(--gs-error) 7%, var(--gs-surface));
    border-color: color-mix(in srgb, var(--gs-error) 28%, transparent);
    border-left-color: var(--gs-error);
  }
  .notice.ok {
    background: color-mix(in srgb, var(--gs-ok) 7%, var(--gs-surface));
    border-color: color-mix(in srgb, var(--gs-ok) 28%, transparent);
    border-left-color: var(--gs-ok);
  }
  .progress {
    height: 8px;
    border-radius: 99px;
    background: var(--gs-surface-2);
    overflow: hidden;
  }
  .progress > div {
    height: 100%;
    background: linear-gradient(90deg, var(--gs-primary-strong), var(--gs-primary));
    transition: width 0.3s;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th,
  td {
    text-align: left;
    padding: 8px 6px;
    border-bottom: 1px solid var(--gs-border);
    vertical-align: middle;
  }
  th {
    font-size: 11.5px;
    color: var(--gs-muted);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  code {
    font-family: ui-monospace, monospace;
    font-size: 12px;
    background: var(--gs-surface-2);
    padding: 1px 5px;
    border-radius: 5px;
  }
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    display: inline-block;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  ha-icon {
    --mdc-icon-size: 20px;
  }
`;
function _e(e, t = "•") {
	return customElements.get("ha-icon") ? c`<ha-icon .icon=${e}></ha-icon>` : c`<span class="glyph" aria-hidden="true">${t}</span>`;
}
function E(e, t) {
	return e ? customElements.get("ha-icon") ? c`<ha-icon .icon=${ae(e)} style="--mdc-icon-size:${t}px"></ha-icon>` : c`<span style="font-size:${Math.round(t * .6)}px;line-height:${t}px;font-weight:700;display:inline-block;min-width:${t}px;text-align:center">${oe(e)}</span>` : a;
}
function D(e, t, n) {
	e.dispatchEvent(new CustomEvent(t, {
		detail: n,
		bubbles: !0,
		composed: !0
	}));
}
function O(e, t) {
	return new Promise((n) => D(e, "gs-confirm", {
		...t,
		resolve: n
	}));
}
function ve(e, t, n, r = "Name") {
	return new Promise((i) => D(e, "gs-prompt", {
		title: t,
		value: n,
		label: r,
		resolve: i
	}));
}
function k(e, t, n = "info") {
	D(e, "gs-toast", {
		message: t,
		kind: n
	});
}
function A(e) {
	if (!e) return "–";
	let t = (Date.now() - new Date(e).getTime()) / 1e3;
	return t < 60 ? "gerade eben" : t < 3600 ? `vor ${Math.round(t / 60)} Min.` : t < 86400 ? `vor ${Math.round(t / 3600)} Std.` : new Date(e).toLocaleString("de-DE");
}
function j(e) {
	return e == null ? "–" : e < 1024 ? `${e} B` : e < 1048576 ? `${(e / 1024).toFixed(1).replace(".", ",")} KB` : `${(e / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;
}
var ye = {
	s: 12,
	m: 16,
	l: 20,
	xl: 28,
	xxl: 40
};
function be(e, t, n, r, i, o = /* @__PURE__ */ new Date(), s = 0) {
	let l = e.type === "swipe" ? e.items ?? [] : [];
	if (l.length) {
		let t = l[Math.min(s, l.length - 1)];
		e = {
			...e,
			entity: t.entity,
			title: t.title,
			icon: t.icon ?? e.icon
		};
	}
	let u = fe(n, e), d = pe(e, t, u), f = r >= 200 && i >= 200, p = i < 90 ? 8 : 12, m = ye[e.style.font_size] ?? 16, h = u.known && !u.available ? "warning" : e.icon, _ = (t) => e.show_title ? c`<div class="t-title" style=${g({
		fontSize: `${m}px`,
		...t
	})}>${e.title}</div>` : a, v = o.toLocaleTimeString("de-DE", {
		hour: "2-digit",
		minute: "2-digit"
	}), y;
	switch (e.type) {
		case "clock":
			y = c`<div class="t-center">
        <div style="font-size:${f ? 40 : 28}px;font-weight:600">${v}</div>
        ${e.show_title ? c`<div style="font-size:16px">${e.title || o.toLocaleDateString("de-DE")}</div>` : a}
      </div>`;
			break;
		case "weather": {
			let t = {
				...ge,
				...e.weather ?? {}
			}, n = r >= 200, o = i >= 200 && t.forecast, s = p + (o ? 74 : 0), l = [
				t.hilo ? "↑–° ↓–°" : "",
				t.humidity ? u.parts?.humidity ?? "" : "",
				t.wind ? u.parts?.wind ?? "" : "",
				t.pressure ? u.parts?.pressure ?? "" : ""
			].filter(Boolean).join(" · "), f = (t.hilo || t.humidity || t.wind || t.pressure) && (n || i >= 150), m = s;
			f && (s += 18);
			let g = s;
			t.condition && (s += 22), y = c`${_({
				position: "absolute",
				left: `${p}px`,
				top: `${p}px`,
				right: `${p + 48}px`
			})}
        <div style="position:absolute;right:${p}px;top:${p - 4}px;color:${d.icon}">${E(u.icon ?? h, o ? 40 : 28)}</div>
        <div class="t-value" style="position:absolute;left:${p}px;bottom:${s}px;font-size:${o || n ? 40 : 28}px">${u.known ? u.available ? u.text || "–" : "Nicht verfügbar" : "–"}</div>
        ${t.condition ? c`<div class="t-state" style="position:absolute;left:${p}px;right:${p}px;bottom:${g}px;font-size:16px">${u.sub}</div>` : a}
        ${f ? c`<div class="t-state" style="position:absolute;left:${p}px;right:${p}px;bottom:${m}px;font-size:12px">${l}</div>` : a}
        ${o ? c`<div class="t-buttons" style="left:${p}px;right:${p}px;bottom:${p}px;height:70px;font-size:12px;text-align:center">
              ${[
				0,
				1,
				2
			].map(() => c`<span style="flex-direction:column;gap:2px">Vorhersage<br />vom Display</span>`)}
            </div>` : a}`;
			break;
		}
		case "sensor": {
			let t = h;
			y = c`${_({
				position: "absolute",
				left: `${p}px`,
				top: `${p}px`,
				right: `${p + 34}px`
			})}
        ${e.show_icon ? c`<div style="position:absolute;right:${p}px;top:${p - 4}px;color:${d.icon}">${E(t, 28)}</div>` : a}
        <div class="t-value" style="position:absolute;left:${p}px;right:${p}px;bottom:${p}px;font-size:${f ? 40 : r < 110 ? 20 : 28}px">
          ${u.known ? u.available ? u.text || "–" : "Nicht verfügbar" : "–"}
        </div>
        ${a}`;
			break;
		}
		case "cover":
		case "thermostat":
		case "media": {
			let t = i >= 200 ? 52 : i >= 120 ? 40 : 32, n = e.type === "cover" ? [
				"arrow-up",
				"stop",
				"arrow-down"
			] : e.type === "thermostat" ? ["minus", "plus"] : r >= 280 ? [
				"volume-minus",
				"skip-previous",
				"play-pause",
				"skip-next",
				"volume-plus"
			] : [
				"skip-previous",
				"play-pause",
				"skip-next"
			], o = i - t - 2 * p >= 40, s = e.type === "media", l = s && u.available && u.sub ? u.sub : u.known ? u.available ? u.text : "Nicht verfügbar" : "–", m = s && u.available && u.sub ? u.text : u.available ? u.sub : "";
			y = c`${e.show_icon && e.icon ? c`<div style="position:absolute;left:${p}px;top:${p - 2}px;color:${d.icon}">${E(h, 20)}</div>` : a}
        ${_({
				position: "absolute",
				left: `${p + (e.show_icon && e.icon ? 26 : 0)}px`,
				top: `${p}px`,
				right: `${p}px`
			})}
        ${o ? c`<div class="t-value" style="position:absolute;left:${p}px;right:${p}px;top:${p + 24}px;font-size:${s ? 16 : f ? 40 : i >= 140 ? 28 : 20}px">${l}</div>
              ${i - t - 2 * p >= 84 || s ? c`<div class="t-state" style="position:absolute;left:${p}px;right:${p}px;bottom:${p + t + 6}px;font-size:12px">${m}</div>` : a}` : a}
        <div class="t-buttons" style="left:${p}px;right:${p}px;bottom:${p}px;height:${t}px">
          ${n.map((e) => c`<span style="border-radius:${Math.round(t / 3)}px;background:color-mix(in srgb, ${d.fg} 10%, transparent)">${E(e, t >= 44 ? 28 : 20)}</span>`)}
        </div>`;
			break;
		}
		case "nav":
		case "action":
		case "settings":
			y = c`<div class="t-center">
        ${e.show_icon && e.icon ? c`<div style="color:${d.icon}">${E(h, f ? 40 : 28)}</div>` : a}
        ${_({
				textAlign: "center",
				maxWidth: "100%"
			})}
      </div>`;
			break;
		case "text":
			y = c`<div class="t-center" style="font-size:${m}px;text-align:center;white-space:pre-wrap">${e.title}</div>`;
			break;
		case "status":
			y = c`<div style="position:absolute;left:${p}px;top:50%;transform:translateY(-50%);font-size:15px;line-height:1.8">
        <div style="color:${t.ok}">📶 WLAN verbunden</div>
        <div style="color:${t.ok}">⌂ HA verbunden</div>
      </div>`;
			break;
		case "graph": {
			let t = Array.from({ length: 24 }, (e, t) => 35 + Math.round(25 * Math.sin(t / 3.2) + 15 * Math.sin(t / 1.7))), n = p + 28, r = i - n - (p + 16);
			y = c`${_({
				position: "absolute",
				left: `${p}px`,
				top: `${p}px`,
				right: `${p + 90}px`
			})}
        <div class="t-value" style="position:absolute;right:${p}px;top:${p - 2}px;font-size:20px">${u.known && u.available ? u.text : "–"}</div>
        <div class="t-bars" style="left:${p}px;right:${p}px;top:${n}px;height:${Math.max(r, 0)}px">
          ${t.map((e, t) => c`<span style="height:${e}%;background:${d.icon};opacity:${.3 + .7 * t / 23}"></span>`)}
        </div>
        <div class="t-state" style="position:absolute;left:${p}px;right:${p}px;bottom:${p - 2}px;font-size:12px">Verlauf ${e.hours ?? 24} h · Vorschau</div>`;
			break;
		}
		default: {
			let n = e.type === "rgb", r = e.type === "dimmer" || n, o = r ? i >= 140 ? 18 : 12 : 0, m = n ? i >= 140 ? 28 : 20 : 0, g = r ? p + o + 10 + (n ? m + 8 : 0) : p, v = u.on ? u.num >= 0 ? u.num : 100 : 0;
			y = c`${e.show_icon ? c`<div style="position:absolute;left:${p}px;top:${p - 2}px;color:${d.icon}">${E(h, f ? 40 : 28)}</div>` : a}
        ${_({
				position: "absolute",
				left: `${p}px`,
				right: `${p}px`,
				bottom: `${e.show_state ? g + 20 : g}px`
			})}
        ${e.show_state ? c`<div class="t-state" style="position:absolute;left:${p}px;right:${p}px;bottom:${g}px;font-size:${e.style.font_size === "s" ? 12 : 16}px">
              ${u.known ? u.available ? u.text : "Nicht verfügbar" : "…"}
            </div>` : a}
        ${r ? c`<div class="t-slider" style="left:${p + 4}px;right:${p + 4}px;bottom:${p + 2}px;height:${o}px;background:color-mix(in srgb, ${d.fg} 20%, transparent)">
              <div style="width:${v}%;background:${e.style.on_color ?? t.on_bg}"></div>
            </div>` : a}
        ${n ? c`<div class="t-buttons" style="left:${p}px;right:${p}px;bottom:${p + o + 10}px;height:${m}px">
              ${[
				"#FFB46B",
				"#FF3B30",
				"#34C759",
				"#0A84FF",
				"#BF5AF2"
			].map((e) => c`<span style="border-radius:${m}px;background:${e}"></span>`)}
            </div>` : a}
        ${l.length > 1 ? c`<div style=${e.swipe_dir === "v" ? `position:absolute;right:${p - 2}px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:5px` : `position:absolute;right:${p}px;top:${p + 4}px;display:flex;gap:5px`}>
              ${l.map((e, t) => c`<span style="width:7px;height:7px;border-radius:4px;background:${d.fg};opacity:${t === Math.min(s, l.length - 1) ? 1 : .4}"></span>`)}
            </div>` : a}`;
		}
	}
	return c`<div
    class="t-inner ${u.known && !u.available ? "unavailable" : ""}"
    style=${g({
		background: d.bg,
		color: d.fg,
		borderRadius: `${e.style.radius}px`,
		border: e.style.border_width ? `${e.style.border_width}px solid ${e.style.border_color ?? t.accent}` : "none",
		opacity: String(e.style.opacity / 100 * (u.known && !u.available ? .5 : 1))
	})}
  >
    ${y}
  </div>`;
}
var xe = r`
  .screen {
    position: relative;
    width: 480px;
    height: 480px;
    overflow: hidden;
    border-radius: 6px;
    font-family: "Montserrat", "Segoe UI", system-ui, sans-serif;
    user-select: none;
  }
  .s-header {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 44px;
    display: flex;
    align-items: center;
    padding: 0 14px;
    font-size: 20px;
    gap: 10px;
  }
  .s-header .name {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .s-page {
    position: absolute;
    left: 0;
    right: 0;
  }
  .s-dots {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }
  .s-dots span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  .tile {
    position: absolute;
  }
  .t-inner {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }
  /* 3D tiles (like the display): light from above, bright top edge, drop shadow */
  .d3 .t-inner {
    /* flat fill like on the device (a gradient bands on the 16-bit panel), light top edge + shadow */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
  .t-inner.unavailable {
    filter: grayscale(0.8);
  }
  .t-title,
  .t-state,
  .t-value {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .t-value {
    font-weight: 600;
  }
  .t-buttons {
    position: absolute;
    display: flex;
    gap: 6px;
  }
  .t-buttons span {
    flex: 1;
    display: grid;
    place-items: center;
  }
  .t-bars {
    position: absolute;
    display: flex;
    align-items: flex-end;
    gap: 2px;
  }
  .t-bars span {
    flex: 1;
    border-radius: 2px;
  }
  .t-slider {
    position: absolute;
    border-radius: 99px;
    overflow: hidden;
  }
  .t-slider > div {
    height: 100%;
    border-radius: 99px;
  }
  .t-center {
    position: absolute;
    inset: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    overflow: hidden;
  }
`;
function Se(e, t, n, r) {
	let i = n[e.settings.theme] ?? Object.values(n)[0], o = x(e.settings, e.pages.length), s = e.pages.indexOf(t);
	return c`<div class="screen ${e.settings.tile_depth ?? !0 ? "d3" : ""}" style="background:${i.header_bg}">
    ${e.settings.show_header ? c`<div class="s-header" style="color:${i.header_text}">
          <span class="name">${t.name}</span><span>${(/* @__PURE__ */ new Date()).toLocaleTimeString("de-DE", {
		hour: "2-digit",
		minute: "2-digit"
	})}</span>
          <span style="color:${i.ok};font-size:15px">📶</span><span style="color:${i.ok};font-size:16px">⌂</span>
        </div>` : a}
    <div class="s-page" style="top:${o.top}px;height:${o.height}px;background:${t.background ?? i.page_bg}">
      ${t.tiles.map((e) => {
		let n = S(t, o, e.x, e.y, e.w, e.h);
		return c`<div class="tile" style="left:${n.x}px;top:${n.y}px;width:${n.w}px;height:${n.h}px;${me(r, e) ? "" : "opacity:.25"}">
          ${be(e, i, r, n.w, n.h)}
        </div>`;
	})}
    </div>
    ${o.bottom ? c`<div class="s-dots">${e.pages.map((e, t) => c`<span style="background:${t === s ? i.accent : i.muted}"></span>`)}</div>` : a}
  </div>`;
}
// \0@oxc-project+runtime@0.156.0/helpers/esm/decorate.js
function M(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
// src/views/base.ts
var Ce, N = class extends t {
	constructor(...e) {
		super(...e), this.displays = [];
	}
	go(e, t) {
		D(this, "gs-navigate", {
			view: e,
			display: t
		});
	}
	refreshAll() {
		D(this, "gs-refresh");
	}
};
Ce = N, Ce.styles = [T, r`
      :host {
        display: block;
        padding: 24px;
        max-width: 1280px;
      }
      .page-head {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;
        flex-wrap: wrap;
      }
      .page-head h1 {
        margin: 0;
      }
      section {
        margin-bottom: 24px;
      }
    `], M([s({ attribute: !1 })], N.prototype, "hass", void 0), M([s({ attribute: !1 })], N.prototype, "api", void 0), M([s({ attribute: !1 })], N.prototype, "info", void 0), M([s({ attribute: !1 })], N.prototype, "displays", void 0);
// src/views/overview.ts
var we = class extends N {
	constructor(...e) {
		super(...e), this.previews = {};
	}
	async updated(e) {
		if (e.has("displays")) {
			for (let e of this.displays) if (!this.previews[e.id]) try {
				let t = await this.api.getLayout(e.id);
				this.previews = {
					...this.previews,
					[e.id]: t.layout
				};
			} catch {}
		}
	}
	async resend(e) {
		try {
			await this.api.command(e, "resend"), k(this, "Layout erneut übertragen ✓", "ok");
		} catch (e) {
			k(this, y(e), "error");
		}
	}
	render() {
		let e = this.displays.filter((e) => e.online).length, t = this.displays.filter((e) => e.applied_revision !== null && !e.in_sync).length;
		return c`
      <div class="page-head">
        <h1>Übersicht</h1>
        <span class="spacer"></span>
        <button class="primary" @click=${() => this.go("displays")}>＋ Display hinzufügen</button>
      </div>
      <section class="stats">
        <div class="card stat"><div class="num">${this.displays.length}</div><div class="muted">Displays</div></div>
        <div class="card stat"><div class="num" style="color:var(--gs-ok)">${e}</div><div class="muted">online</div></div>
        <div class="card stat"><div class="num" style="color:${t ? "var(--gs-warn)" : "inherit"}">${t}</div><div class="muted">nicht synchron</div></div>
        <div class="card stat"><div class="num">${this.info.version}</div><div class="muted">Guition Studio</div></div>
      </section>
      ${this.displays.length === 0 ? c`<div class="card welcome">
            <h2>Willkommen bei Guition Studio 👋</h2>
            <p>In wenigen Schritten bringst du dein Guition ESP32-S3-4848S040 zum Laufen:</p>
            <ol>
              <li>Firmware per USB direkt aus dem Browser installieren</li>
              <li>WLAN einrichten und mit Home Assistant koppeln</li>
              <li>Seiten per Drag-and-Drop gestalten und übertragen – ohne YAML</li>
            </ol>
            <button class="primary" @click=${() => this.go("displays")}>Einrichtung starten</button>
          </div>` : c`<div class="grid">
            ${this.displays.map((e) => {
			let t = this.previews[e.id], n = t?.pages.find((e) => e.id === t.settings.home_page) ?? t?.pages[0];
			return c`<div class="card disp">
                <div class="thumb">${t && n ? c`<div class="scale">${Se(t, n, this.info.themes, this.hass)}</div>` : a}</div>
                <div class="row" style="margin-top:12px">
                  <h2 style="margin:0">${e.name}</h2>
                  <span class="spacer"></span>
                  <span class="chip ${e.online ? "ok" : e.linked ? "error" : "warn"}">${e.online ? "● Online" : e.linked ? "○ Offline" : "Nicht verknüpft"}</span>
                </div>
                <div class="meta muted small">
                  <span>Firmware ${e.firmware ?? "–"}</span>
                  <span>${e.page_count} Seite(n)</span>
                  <span>Layout ${e.applied_revision == null ? "noch nicht übertragen" : `Rev. ${e.applied_revision}`}</span>
                  <span>Zuletzt gesehen: ${A(e.last_seen)}</span>
                </div>
                ${e.applied_revision != null && !e.in_sync ? c`<div class="notice warn small">Das Display zeigt ein anderes Layout als zuletzt übertragen.</div>` : a}
                <div class="row" style="margin-top:10px">
                  <button class="primary" @click=${() => this.go("designer", e.id)}>✎ Bearbeiten</button>
                  ${e.applied_revision == null ? a : c`<button ?disabled=${!e.online} @click=${() => this.resend(e.id)}>⇪ Erneut senden</button>`}
                  <button @click=${() => this.go("diagnostics")}>Diagnose</button>
                </div>
              </div>`;
		})}
          </div>`}
    `;
	}
}, Te = (we.styles = [
	...N.styles,
	xe,
	r`
      .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 16px;
      }
      .stat .num {
        font-size: 28px;
        font-weight: 700;
      }
      .welcome ol {
        line-height: 1.9;
      }
      .thumb {
        width: 240px;
        height: 240px;
        margin: 0 auto;
        background: #111;
        border-radius: 12px;
        padding: 0;
        overflow: hidden;
        box-shadow: 0 0 0 6px #111;
      }
      .scale {
        transform: scale(0.5);
        transform-origin: 0 0;
        pointer-events: none;
      }
      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 14px;
        margin-top: 6px;
      }
    `
], we);
M([e()], Te.prototype, "previews", void 0), Te = M([u("gs-overview")], Te);
// src/views/installer.ts
var Ee;
function De() {
	return "serial" in navigator && window.isSecureContext ? {
		ok: !0,
		problem: null
	} : /Android|iPhone|iPad/i.test(navigator.userAgent) ? {
		ok: !1,
		problem: "mobile"
	} : navigator.brave ? {
		ok: !1,
		problem: "brave"
	} : window.isSecureContext ? {
		ok: !1,
		problem: "browser"
	} : {
		ok: !1,
		problem: "insecure"
	};
}
var Oe = {
	insecure: "Home Assistant ist über http:// geöffnet – dort erlaubt der Browser keinen USB-Zugriff. Kein Problem: der Guition-Installer läuft über eine sichere Seite.",
	brave: "Brave unterstützt die USB-Installation nicht zuverlässig. Öffne den Installer am besten in Google Chrome oder Microsoft Edge (bei Windows vorinstalliert).",
	mobile: "Auf Smartphones und Tablets ist keine USB-Installation möglich. Öffne den Installer an einem Computer mit Chrome oder Edge.",
	browser: "Dieser Browser kann nicht per USB installieren. Öffne den Installer in Google Chrome oder Microsoft Edge."
}, P = (Ee = class extends t {
	constructor(...e) {
		super(...e), this.firmwareUrl = "/api/guition_studio/firmware", this.installerUrl = "", this.status = null, this.version = "", this.busy = !1, this.ewtLoaded = !1, this.error = null;
	}
	connectedCallback() {
		super.connectedCallback(), this.load();
	}
	async load() {
		try {
			this.status = await this.api.firmwareStatus();
			let e = this.status.local.filter((e) => e.factory);
			!this.version && e.length && (this.version = e[0].version), De().ok && !this.ewtLoaded && (await import("./chunks/install-button-ekHFp8KY.js"), this.ewtLoaded = !0);
		} catch (e) {
			this.error = y(e);
		}
	}
	async downloadLatest() {
		this.busy = !0;
		try {
			let e = await this.api.firmwareCheck();
			if (!e.latest) throw Error(e.error ?? "Keine Firmware-Veröffentlichung gefunden.");
			await this.api.firmwareDownload(e.latest.version), k(this, `Firmware ${e.latest.version} heruntergeladen und geprüft ✓`, "ok"), this.version = e.latest.version, await this.load();
		} catch (e) {
			k(this, y(e), "error");
		} finally {
			this.busy = !1;
		}
	}
	renderOnlineInstaller(e) {
		return c`<div class="online ${e ? "primary-path" : ""}">
      ${e ? c`<p>${Oe[e]}</p>` : a}
      <a class="btn big primary" href=${this.installerUrl} target="_blank" rel="noopener">🔌 Sicheren Installer öffnen ↗</a>
      <p class="small muted">Öffnet <code>${this.installerUrl}</code> in einem neuen Tab: Display per USB anschließen, „Installieren“ klicken, WLAN eingeben – danach hier weiter.</p>
    </div>`;
	}
	renderOfflineAlternatives() {
		let e = this.status?.local.find((e) => e.factory), t = e ? `${this.firmwareUrl}/${e.version}/firmware.factory.bin` : `https://github.com/${this.status?.repo ?? ""}/releases/latest`;
		return c`<ol class="small alt-list">
      <li>${e ? c`<a href=${t} download>firmware.factory.bin herunterladen</a>` : c`<a href=${t} target="_blank" rel="noopener">firmware.factory.bin aus dem neuesten Release laden ↗</a>`}</li>
      <li>Mit esptool flashen: <code>python -m esptool --chip esp32s3 write_flash 0x0 firmware.factory.bin</code></li>
      <li>WLAN danach über <a href="https://www.improv-wifi.com/" target="_blank" rel="noopener">improv-wifi.com</a> (USB, Chrome/Edge) einrichten.</li>
      <li>Oder Home Assistant über HTTPS bzw. am selben Rechner unter <code>http://localhost:8123</code> öffnen – dann klappt die Installation auch direkt hier.</li>
    </ol>`;
	}
	render() {
		if (this.error) return c`<div class="notice error">${this.error}</div>`;
		let e = De();
		if (!e.ok && this.installerUrl) return c`${this.renderOnlineInstaller(e.problem)}
        <details class="alt">
          <summary class="small">Andere Wege (ohne Internet / für Fortgeschrittene)</summary>
          ${this.renderOfflineAlternatives()}
        </details>`;
		if (!this.status) return c`<span class="spinner"></span> Prüfe verfügbare Firmware …`;
		let t = this.status.local.filter((e) => e.factory), n = `${this.firmwareUrl}/${this.version}/manifest.json`, r = t.find((e) => e.version === this.version);
		return c`
      ${t.length === 0 ? c`<div class="notice warn">
            Es ist noch keine Firmware in Home Assistant vorhanden.
            <div class="row" style="margin-top:8px">
              <button class="primary" ?disabled=${this.busy} @click=${() => this.downloadLatest()}>
                ${this.busy ? c`<span class="spinner"></span>` : "⇩"} Neueste geprüfte Firmware herunterladen
              </button>
            </div>
            <p class="small muted" style="margin-top:8px">Quelle: GitHub-Releases von <code>${this.status.repo}</code>. Alternativ eine selbst gebaute Firmware nach <code>${this.status.path}/&lt;version&gt;/</code> kopieren (siehe Firmware-Anleitung).</p>
          </div>` : c`<label class="field"><span>Firmwareversion</span>
              <select @change=${(e) => this.version = e.target.value}>
                ${t.map((e) => c`<option value=${e.version} ?selected=${e.version === this.version}>${e.version} ${e.source === "release" ? "(Release)" : "(lokal)"} ${e.verified ? "✓ geprüft" : e.verified === !1 ? "⚠ Prüfsumme falsch" : ""}</option>`)}
              </select>
            </label>
            ${r?.verified === !1 ? c`<div class="notice error">Die Prüfsumme dieser Firmware stimmt nicht. Bitte nicht installieren und neu herunterladen.</div>` : a}
            ${e.ok ? c`<div class="install">
                  ${this.ewtLoaded ? c`<esp-web-install-button manifest=${n}>
                        <button slot="activate" class="primary big" ?disabled=${r?.verified === !1}>🔌 Gerät verbinden & Firmware installieren</button>
                        <span slot="unsupported">Dein Browser unterstützt keine Installation über USB.</span>
                        <span slot="not-allowed">Installation nur über HTTPS möglich.</span>
                      </esp-web-install-button>` : c`<span class="spinner"></span> Lade Installer …`}
                  <ol class="small">
                    <li>Display per USB-C-Kabel (Datenkabel!) mit diesem Computer verbinden.</li>
                    <li>Auf die Schaltfläche klicken und im Browser-Dialog den seriellen Port wählen (meist „USB Serial“, „CH340“ oder „CP210x“).</li>
                    <li>Der Installer erkennt den Chip automatisch und bricht ab, wenn es kein ESP32-S3 ist.</li>
                    <li>Bei Erstinstallation „Gerät löschen“ bestätigen. Danach WLAN-Zugangsdaten im selben Dialog eingeben (Improv).</li>
                  </ol>
                  <p class="small muted">Erkennt der Browser das Board nicht: BOOT-Taste gedrückt halten, kurz RESET drücken, BOOT loslassen und erneut verbinden.</p>
                  ${this.installerUrl ? c`<p class="small muted">Alternativ: <a href=${this.installerUrl} target="_blank" rel="noopener">Online-Installer öffnen ↗</a></p>` : a}
                </div>` : this.renderOfflineAlternatives()}`}
    `;
	}
}, Ee.styles = [T, r`
      .install ol {
        line-height: 1.7;
        padding-left: 18px;
      }
      button.big {
        min-height: 48px;
        font-size: 15px;
        padding: 0 22px;
      }
      a {
        color: var(--gs-primary);
      }
      .online {
        text-align: center;
        padding: 18px;
        border-radius: 14px;
        background: color-mix(in srgb, var(--gs-primary) 7%, transparent);
        margin-bottom: 12px;
      }
      a.btn.big {
        min-height: 52px;
        font-size: 16px;
        padding: 0 26px;
        background: linear-gradient(135deg, var(--gs-primary), var(--gs-primary-strong));
        border: none;
        color: #fff;
        font-weight: 600;
        margin: 6px 0 10px;
      }
      .alt summary {
        cursor: pointer;
        color: var(--gs-muted);
      }
      .alt-list {
        line-height: 1.8;
        padding-left: 18px;
      }
    `], Ee);
M([s({ attribute: !1 })], P.prototype, "api", void 0), M([s({ attribute: !1 })], P.prototype, "firmwareUrl", void 0), M([s({ attribute: !1 })], P.prototype, "installerUrl", void 0), M([e()], P.prototype, "status", void 0), M([e()], P.prototype, "version", void 0), M([e()], P.prototype, "busy", void 0), M([e()], P.prototype, "ewtLoaded", void 0), M([e()], P.prototype, "error", void 0), P = M([u("gs-usb-installer")], P);
// src/views/displays.ts
var ke = class extends N {
	constructor(...e) {
		super(...e), this.wizard = !1, this.step = 1, this.name = "Wohnzimmer-Display", this.hardware = "guition-4848s040", this.method = "usb", this.candidates = [], this.chosen = null, this.created = null, this.busy = !1, this.linkFor = null;
	}
	disconnectedCallback() {
		super.disconnectedCallback(), window.clearInterval(this.poll);
	}
	async loadCandidates() {
		try {
			this.candidates = await this.api.candidates();
		} catch (e) {
			k(this, y(e), "error");
		}
	}
	startPolling() {
		window.clearInterval(this.poll), this.loadCandidates(), this.poll = window.setInterval(() => this.loadCandidates(), 3e3);
	}
	openWizard() {
		this.wizard = !0, this.step = 1, this.chosen = null, this.created = null;
	}
	gotoStep(e) {
		this.step = e, e === 4 ? this.startPolling() : window.clearInterval(this.poll);
	}
	async finish() {
		this.busy = !0;
		try {
			this.created = await this.api.createDisplay({
				name: this.name.trim() || "Guition-Display",
				hardware: this.hardware,
				node: this.chosen?.node ?? null,
				device_id: this.chosen?.device_id ?? null
			}), window.clearInterval(this.poll), this.step = 5, this.refreshAll();
		} catch (e) {
			k(this, y(e), "error");
		} finally {
			this.busy = !1;
		}
	}
	async sendInitial() {
		if (this.created) {
			this.busy = !0;
			try {
				let e = await this.api.getLayout(this.created.id);
				await this.api.apply(this.created.id, e.layout), k(this, "Startlayout wurde auf das Display übertragen ✓", "ok");
			} catch (e) {
				k(this, y(e), "error");
			} finally {
				this.busy = !1;
			}
		}
	}
	async rename(e) {
		let t = await ve(this, "Display umbenennen", e.name);
		t && (await this.api.updateDisplay(e.id, { name: t }), this.refreshAll());
	}
	async removeDisplay(e) {
		await O(this, {
			title: "Display entfernen?",
			text: `„${e.name}“ inklusive aller Seiten wird aus Guition Studio entfernt. Das ESPHome-Gerät selbst bleibt in Home Assistant und behält sein aktuelles Layout.`,
			confirm: "Entfernen",
			danger: !0
		}) && (await this.api.deleteDisplay(e.id), this.refreshAll());
	}
	async link(e, t) {
		try {
			await this.api.updateDisplay(e.id, {
				node: t?.node ?? null,
				device_id: t?.device_id ?? null
			}), k(this, t ? `Mit ${t.name} verknüpft` : "Verknüpfung entfernt", "ok"), this.linkFor = null, this.refreshAll();
		} catch (e) {
			k(this, y(e), "error");
		}
	}
	async copyTo(e, t) {
		let n = this.displays.find((e) => e.id === t);
		n && await O(this, {
			title: "Layout kopieren?",
			text: `Der Entwurf von „${n.name}“ wird durch das Layout von „${e.name}“ ersetzt.`,
			confirm: "Kopieren"
		}) && (await this.api.copyLayout(e.id, t), k(this, "Layout kopiert – im Designer prüfen und übertragen.", "ok"));
	}
	async command(e, t, n, r = !1) {
		if (!r || await O(this, {
			title: `${n}?`,
			text: `Diese Aktion wird sofort auf „${e.name}“ ausgeführt.`,
			confirm: n,
			danger: !0
		})) try {
			await this.api.command(e.id, t, t === "notify" ? {
				title: "Guition Studio",
				message: "Testnachricht aus Home Assistant 👋"
			} : {}), k(this, `${n}: erledigt`, "ok");
		} catch (e) {
			k(this, y(e), "error");
		}
	}
	render() {
		return c`
      <div class="page-head">
        <h1>Meine Displays</h1>
        <span class="spacer"></span>
        <button class="primary" @click=${() => this.openWizard()}>＋ Neues Display einrichten</button>
      </div>
      ${this.wizard ? this.renderWizard() : a}
      ${this.displays.length === 0 && !this.wizard ? c`<div class="card"><p>Noch keine Displays eingerichtet.</p></div>` : a}
      <div class="list">${this.displays.map((e) => this.renderDisplay(e))}</div>
    `;
	}
	renderDisplay(e) {
		let t = this.displays.filter((t) => t.id !== e.id);
		return c`<div class="card disp">
      <div class="row">
        <h2 style="margin:0">${e.name}</h2>
        <span class="chip ${e.online ? "ok" : e.linked ? "error" : "warn"}">${e.online ? "● Online" : e.linked ? "○ Offline" : "Nicht verknüpft"}</span>
        <span class="spacer"></span>
        <button class="primary" @click=${() => this.go("designer", e.id)}>✎ Designer</button>
        <button class="icon" title="Umbenennen" @click=${() => this.rename(e)}>✎</button>
        <button class="icon danger" title="Entfernen" @click=${() => this.removeDisplay(e)}>🗑</button>
      </div>
      <table class="facts small">
        <tr><th>Gerät (ESPHome)</th><td>${e.node ? c`<code>${e.node}</code>` : c`<span class="muted">nicht verknüpft</span>`}
          <button class="small-btn" @click=${() => {
			this.linkFor = this.linkFor === e.id ? null : e.id, this.loadCandidates();
		}}>${e.node ? "Ändern" : "Verknüpfen"}</button></td></tr>
        <tr><th>Hardware</th><td>${this.info.hardware.find((t) => t.id === e.hardware)?.name ?? e.hardware}</td></tr>
        <tr><th>Firmware</th><td>${e.firmware ?? "–"} ${e.protocol != null && e.protocol !== this.info.protocol ? c`<span class="chip error">Protokoll inkompatibel</span>` : a}</td></tr>
        <tr><th>Layout</th><td>${e.applied_revision == null ? "noch nicht übertragen" : `Revision ${e.applied_revision}, ${A(e.applied_at)}`} ${e.applied_revision == null ? a : c`<span class="chip ${e.in_sync ? "ok" : "warn"}">${e.in_sync ? "synchron" : "abweichend"}</span>`}</td></tr>
        <tr><th>Zuletzt gesehen</th><td>${A(e.last_seen)}</td></tr>
      </table>
      ${this.linkFor === e.id ? this.renderLinker(e) : a}
      <div class="row" style="margin-top:12px">
        <button ?disabled=${!e.online} @click=${() => this.command(e, "notify", "Testbenachrichtigung")}>🔔 Testbenachrichtigung</button>
        <button ?disabled=${!e.online} @click=${() => this.command(e, "push_states", "Zustände senden")}>↻ Zustände senden</button>
        <button ?disabled=${!e.online} @click=${() => this.command(e, "rollback", "Vorheriges Layout wiederherstellen", !0)}>⎌ Rollback</button>
        <button ?disabled=${!e.online} @click=${() => this.command(e, "reboot", "Neustart", !0)}>⟳ Neustart</button>
        ${t.length ? c`<select class="copy" @change=${(t) => {
			let n = t.target;
			n.value && this.copyTo(e, n.value), n.value = "";
		}}>
              <option value="">Layout kopieren nach …</option>
              ${t.map((e) => c`<option value=${e.id}>${e.name}</option>`)}
            </select>` : a}
      </div>
    </div>`;
	}
	renderLinker(e) {
		let t = this.candidates.filter((t) => !t.assigned_display || t.assigned_display === e.id);
		return c`<div class="notice">
      ${t.length ? c`<p>Gefundene Guition-Studio-Geräte in Home Assistant:</p>
            ${t.map((t) => c`<div class="row cand"><b>${t.name}</b> <code>${t.node}</code><span class="spacer"></span><button @click=${() => this.link(e, t)}>Verknüpfen</button></div>`)}` : c`<p>Kein freies Gerät gefunden. Ist das Display in der ESPHome-Integration hinzugefügt und online?</p>`}
      ${e.node ? c`<button class="danger" @click=${() => this.link(e, null)}>Verknüpfung entfernen</button>` : a}
    </div>`;
	}
	renderWizard() {
		return c`<div class="card wizard">
      <div class="row"><h2 style="margin:0">Neues Display einrichten</h2><span class="spacer"></span><button class="icon ghost" title="Schließen" @click=${() => {
			this.wizard = !1, window.clearInterval(this.poll);
		}}>✕</button></div>
      <ol class="steps">
        ${[
			"Display hinzufügen",
			"Gerät verbinden",
			"Firmware installieren",
			"WLAN & Home Assistant",
			"Designer öffnen"
		].map((e, t) => c`<li class=${t + 1 === this.step ? "active" : t + 1 < this.step ? "done" : ""}><span>${t + 1 < this.step ? "✓" : t + 1}</span>${e}</li>`)}
      </ol>
      <div class="step-body">${this.renderStep()}</div>
    </div>`;
	}
	renderStep() {
		switch (this.step) {
			case 1: return c`
          <label class="field"><span>Anzeigename</span><input maxlength="40" .value=${this.name} @input=${(e) => this.name = e.target.value} /></label>
          <label class="field"><span>Hardwareprofil</span>
            <select @change=${(e) => this.hardware = e.target.value}>
              ${this.info.hardware.map((e) => c`<option value=${e.id} ?selected=${e.id === this.hardware}>${e.name}</option>`)}
            </select>
          </label>
          <div class="notice small">
            <b>Unterstützte Hardware:</b> ${this.info.hardware.map((e) => c`${e.name} – ${e.description}`)}<br />
            Weitere Displays sind architektonisch vorgesehen, werden in dieser Version aber noch nicht unterstützt.
          </div>
          <div class="methods">
            <label class="method ${this.method === "usb" ? "sel" : ""}"><input type="radio" name="m" .checked=${this.method === "usb"} @change=${() => this.method = "usb"} />
              <b>🔌 Neu installieren (USB)</b><span class="muted small">Für neue Displays: Firmware direkt aus dem Browser aufspielen.</span></label>
            <label class="method ${this.method === "ota" ? "sel" : ""}"><input type="radio" name="m" .checked=${this.method === "ota"} @change=${() => this.method = "ota"} />
              <b>📡 Bereits installiert (WLAN)</b><span class="muted small">Das Display läuft schon mit Guition-Studio-Firmware und ist in Home Assistant.</span></label>
          </div>
          <div class="row nav"><span class="spacer"></span><button class="primary" ?disabled=${!this.name.trim()} @click=${() => this.gotoStep(this.method === "usb" ? 2 : 4)}>Weiter</button></div>`;
			case 2: return c`
          <p>Verbinde das Guition-Display mit einem <b>USB-C-Datenkabel</b> mit diesem Computer. Das Display muss nicht geöffnet werden.</p>
          <ul class="small">
            <li>Browser: Google Chrome oder Microsoft Edge am Computer</li>
            <li>Ist Home Assistant über <code>http://</code> geöffnet, startet im nächsten Schritt automatisch der sichere Online-Installer</li>
            <li>Unter Windows wird ggf. ein CH340-Treiber benötigt</li>
          </ul>
          <div class="row nav"><button @click=${() => this.gotoStep(1)}>Zurück</button><span class="spacer"></span><button class="primary" @click=${() => this.gotoStep(3)}>Weiter zur Installation</button></div>`;
			case 3: return c`
          <div class="notice warn small"><b>Achtung:</b> Die Installation überschreibt die vorhandene Firmware des Displays vollständig.</div>
          <gs-usb-installer .api=${this.api} .firmwareUrl=${this.info.firmware_url} .installerUrl=${this.info.installer_url}></gs-usb-installer>
          <div class="row nav"><button @click=${() => this.gotoStep(2)}>Zurück</button><span class="spacer"></span><button class="primary" @click=${() => this.gotoStep(4)}>Installation abgeschlossen – weiter</button></div>`;
			case 4: {
				let e = this.candidates.filter((e) => !e.assigned_display);
				return c`
          <ol class="small" style="line-height:1.8">
            <li>WLAN wurde im Installationsdialog eingerichtet (Improv). Das Display zeigt danach „Noch kein Layout vorhanden“.</li>
            <li>Home Assistant erkennt das Gerät automatisch: <b>Einstellungen → Geräte & Dienste → Entdeckt → ESPHome → Hinzufügen</b>.
              Der Verschlüsselungsschlüssel wird dabei automatisch erzeugt und auf dem Display gespeichert.</li>
            <li>Sobald das Gerät hinzugefügt ist, erscheint es hier:</li>
          </ol>
          <a class="btn" href="/config/integrations/dashboard" target="_top">Geräte & Dienste öffnen ↗</a>
          <div class="cands">
            ${e.length ? e.map((e) => c`<label class="method ${this.chosen?.node === e.node ? "sel" : ""}">
                    <input type="radio" name="cand" .checked=${this.chosen?.node === e.node} @change=${() => this.chosen = e} />
                    <b>${e.name}</b><span class="muted small"><code>${e.node}</code> ${e.firmware ? `· Firmware ${e.firmware}` : ""} · ✓ Guition-Studio-Aktionen gefunden</span>
                  </label>`) : c`<div class="row muted"><span class="spinner"></span> Suche nach Guition-Studio-Geräten in Home Assistant …</div>`}
          </div>
          <div class="row nav">
            <button @click=${() => this.gotoStep(this.method === "usb" ? 3 : 1)}>Zurück</button><span class="spacer"></span>
            <button title="Display ohne Gerät anlegen und später verknüpfen" @click=${() => this.finish()}>Später verknüpfen</button>
            <button class="primary" ?disabled=${!this.chosen || this.busy} @click=${() => this.finish()}>Verknüpfen & weiter</button>
          </div>`;
			}
			case 5: return c`
          <div class="notice ok"><b>„${this.created?.name}“ wurde angelegt.</b> Ein Startlayout mit Uhrzeit und Statusanzeige wurde erstellt.</div>
          ${this.created?.linked ? c`<p>Übertrage das Startlayout jetzt zur Kontrolle auf das Display oder gestalte direkt eigene Seiten.</p>
                <div class="row"><button ?disabled=${this.busy} @click=${() => this.sendInitial()}>${this.busy ? c`<span class="spinner"></span>` : "⇪"} Startlayout übertragen</button></div>` : c`<p class="muted">Das Display ist noch nicht mit einem Gerät verknüpft. Das kannst du jederzeit unter „Meine Displays“ nachholen.</p>`}
          <div class="row nav"><span class="spacer"></span><button class="primary" @click=${() => {
				this.wizard = !1, this.go("designer", this.created?.id);
			}}>✎ Designer öffnen</button></div>`;
		}
	}
}, F = (ke.styles = [...N.styles, r`
      .list {
        display: grid;
        gap: 16px;
      }
      .facts th {
        width: 160px;
      }
      .small-btn {
        min-height: 26px;
        padding: 0 8px;
        font-size: 12px;
        margin-left: 8px;
      }
      select.copy {
        width: auto;
      }
      .cand {
        padding: 6px 0;
      }
      .wizard {
        margin-bottom: 24px;
      }
      .steps {
        display: flex;
        list-style: none;
        padding: 0;
        margin: 16px 0;
        gap: 6px;
        flex-wrap: wrap;
      }
      .steps li {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px 6px 6px;
        border-radius: 999px;
        background: var(--gs-surface-2);
        color: var(--gs-muted);
        font-size: 13px;
      }
      .steps li span {
        display: grid;
        place-items: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--gs-border);
        font-weight: 600;
      }
      .steps li.active {
        color: var(--gs-primary);
        font-weight: 600;
      }
      .steps li.active span {
        background: var(--gs-primary);
        color: #fff;
      }
      .steps li.done span {
        background: var(--gs-ok);
        color: #fff;
      }
      .step-body {
        max-width: 720px;
      }
      .methods,
      .cands {
        display: grid;
        gap: 10px;
        margin: 14px 0;
      }
      .method {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 2px 10px;
        padding: 12px 14px;
        border: 2px solid var(--gs-border);
        border-radius: 12px;
        cursor: pointer;
      }
      .method input {
        grid-row: span 2;
        width: 18px;
      }
      .method.sel {
        border-color: var(--gs-primary);
        background: color-mix(in srgb, var(--gs-primary) 6%, transparent);
      }
      .nav {
        margin-top: 18px;
      }
    `], ke);
M([e()], F.prototype, "wizard", void 0), M([e()], F.prototype, "step", void 0), M([e()], F.prototype, "name", void 0), M([e()], F.prototype, "hardware", void 0), M([e()], F.prototype, "method", void 0), M([e()], F.prototype, "candidates", void 0), M([e()], F.prototype, "chosen", void 0), M([e()], F.prototype, "created", void 0), M([e()], F.prototype, "busy", void 0), M([e()], F.prototype, "linkFor", void 0), F = M([u("gs-displays")], F);
// node_modules/lit-html/directives/repeat.js
var Ae = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, je = o(class extends l {
	constructor(e) {
		if (super(e), e.type !== i.CHILD) throw Error("repeat() can only be used in text expressions");
	}
	dt(e, t, n) {
		let r;
		n === void 0 ? n = t : t !== void 0 && (r = t);
		let i = [], a = [], o = 0;
		for (let t of e) i[o] = r ? r(t, o) : o, a[o] = n(t, o), o++;
		return {
			values: a,
			keys: i
		};
	}
	render(e, t, n) {
		return this.dt(e, t, n).values;
	}
	update(e, [t, r, i]) {
		let a = _(e), { values: o, keys: s } = this.dt(t, r, i);
		if (!Array.isArray(a)) return this.ut = s, o;
		let c = this.ut ??= [], l = [], u, d, g = 0, v = a.length - 1, y = 0, b = o.length - 1;
		for (; g <= v && y <= b;) if (a[g] === null) g++;
		else if (a[v] === null) v--;
		else if (c[g] === s[y]) l[y] = f(a[g], o[y]), g++, y++;
		else if (c[v] === s[b]) l[b] = f(a[v], o[b]), v--, b--;
		else if (c[g] === s[b]) l[b] = f(a[g], o[b]), m(e, l[b + 1], a[g]), g++, b--;
		else if (c[v] === s[y]) l[y] = f(a[v], o[y]), m(e, a[g], a[v]), v--, y++;
		else if (u === void 0 && (u = Ae(s, y, b), d = Ae(c, g, v)), u.has(c[g])) {
			if (u.has(c[v])) {
				let t = d.get(s[y]), n = t === void 0 ? null : a[t];
				if (n === null) {
					let t = m(e, a[g]);
					f(t, o[y]), l[y] = t;
				} else l[y] = f(n, o[y]), m(e, a[g], n), a[t] = null;
				y++;
			} else p(a[v]), v--;
		} else p(a[g]), g++;
		for (; y <= b;) {
			let t = m(e, l[b + 1]);
			f(t, o[y]), l[y++] = t;
		}
		for (; g <= v;) {
			let e = a[g++];
			e !== null && p(e);
		}
		return this.ut = s, h(e, l), n;
	}
});
function I(e) {
	let t = /* @__PURE__ */ new Uint8Array(4);
	return crypto.getRandomValues(t), `${e}_${Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("")}`;
}
var L = (e) => JSON.parse(JSON.stringify(e));
function Me() {
	return {
		background: null,
		color: null,
		icon_color: null,
		on_color: null,
		on_text_color: null,
		font_size: "m",
		radius: 16,
		border_width: 0,
		border_color: null,
		opacity: 100
	};
}
function R(e, t = 0, n = 0, r = 1, i = 1, a = {}) {
	return {
		id: I("t"),
		type: e,
		x: t,
		y: n,
		w: r,
		h: i,
		entity: null,
		title: "",
		icon: null,
		format: e === "clock" ? "time_date" : "",
		style: Me(),
		show_title: !0,
		show_state: !0,
		show_icon: !0,
		tap_action: { action: "default" },
		hold_action: { action: "none" },
		visibility: [],
		hours: 24,
		weather: { ...ge },
		items: [],
		swipe_dir: "h",
		...a
	};
}
function Ne(e, t = 3, n = 3) {
	return {
		id: I("p"),
		name: e,
		background: null,
		cols: t,
		rows: n,
		tiles: []
	};
}
function Pe(e) {
	return e.pages.reduce((e, t) => e + t.tiles.length, 0);
}
function Fe(e, t, n, r, i) {
	return t >= 0 && n >= 0 && r >= 1 && i >= 1 && t + r <= e.cols && n + i <= e.rows;
}
function Ie(e, t) {
	return e.x < t.x + t.w && t.x < e.x + e.w && e.y < t.y + t.h && t.y < e.y + e.h;
}
function z(e, t, n = /* @__PURE__ */ new Set()) {
	return Fe(e, t.x, t.y, t.w, t.h) ? !e.tiles.some((e) => !n.has(e.id) && Ie(e, t)) : !1;
}
function Le(e, t = 1, n = 1) {
	for (let r = 0; r + n <= e.rows; r++) for (let i = 0; i + t <= e.cols; i++) if (z(e, {
		x: i,
		y: r,
		w: t,
		h: n
	})) return {
		x: i,
		y: r
	};
	return null;
}
function Re(e) {
	let t = Array.from({ length: e.rows }, () => Array(e.cols).fill(!1));
	for (let n of e.tiles) for (let r = n.y; r < n.y + n.h && r < e.rows; r++) for (let i = n.x; i < n.x + n.w && i < e.cols; i++) t[r][i] = !0;
	return t;
}
function B(e, t, n, r, i, a, o) {
	let s = L(e), c = s.pages.find((e) => e.id === t), l = s.pages.find((e) => e.id === i);
	if (!c || !l) return {
		layout: e,
		ok: !1,
		reason: "Seite nicht gefunden"
	};
	let u = c.tiles.filter((e) => n.includes(e.id)), d = u.find((e) => e.id === r);
	if (!d) return {
		layout: e,
		ok: !1,
		reason: "Kachel nicht gefunden"
	};
	let f = a - d.x, p = o - d.y, m = new Set(c === l ? n : []);
	for (let t of u) if (!z(l, {
		x: t.x + f,
		y: t.y + p,
		w: t.w,
		h: t.h
	}, m)) return {
		layout: e,
		ok: !1,
		reason: Fe(l, t.x + f, t.y + p, t.w, t.h) ? "Platz ist belegt" : "Außerhalb des Displays"
	};
	c.tiles = c.tiles.filter((e) => !n.includes(e.id));
	for (let e of u) e.x += f, e.y += p, l.tiles.push(e);
	return {
		layout: s,
		ok: !0
	};
}
function ze(e, t, n, r, i) {
	let a = L(e), o = a.pages.find((e) => e.id === t), s = o?.tiles.find((e) => e.id === n);
	return !o || !s ? {
		layout: e,
		ok: !1,
		reason: "Kachel nicht gefunden"
	} : z(o, {
		x: s.x,
		y: s.y,
		w: r,
		h: i
	}, /* @__PURE__ */ new Set([n])) ? (s.w = r, s.h = i, {
		layout: a,
		ok: !0
	}) : {
		layout: e,
		ok: !1,
		reason: Fe(o, s.x, s.y, r, i) ? "Platz ist belegt" : "Außerhalb des Displays"
	};
}
function Be(e, t, n) {
	if (Pe(e) >= 160) return {
		layout: e,
		ok: !1,
		reason: "Maximal 160 Kacheln"
	};
	let r = L(e), i = r.pages.find((e) => e.id === t);
	if (!i) return {
		layout: e,
		ok: !1,
		reason: "Seite nicht gefunden"
	};
	if (!z(i, n)) {
		let { w: t, h: r } = n, a = Le(i, t, r);
		if (a ||= (t = r = 1, Le(i, 1, 1)), !a) return {
			layout: e,
			ok: !1,
			reason: "Kein freier Platz auf dieser Seite"
		};
		n = {
			...n,
			...a,
			w: t,
			h: r
		};
	}
	return i.tiles.push(n), {
		layout: r,
		ok: !0
	};
}
function Ve(e, t, n, r) {
	let i = L(e), a = i.pages.find((e) => e.id === t)?.tiles.find((e) => e.id === n);
	return a && Object.assign(a, L(r)), i;
}
function He(e, t) {
	let n = L(e);
	for (let e of n.pages) e.tiles = e.tiles.filter((e) => !t.includes(e.id));
	return n;
}
function Ue(e, t, n) {
	let r = L(e), i = [], a = 0, o = () => r.pages.find((e) => e.id === t);
	if (!o()) return {
		layout: e,
		ids: i,
		skipped: n.length
	};
	let s = Math.min(...n.map((e) => e.x)), c = Math.min(...n.map((e) => e.y)), l = null;
	for (let e = 0; e < o().rows && !l; e++) for (let t = 0; t < o().cols && !l; t++) n.every((n) => z(o(), {
		x: n.x - s + t,
		y: n.y - c + e,
		w: n.w,
		h: n.h
	})) && (l = {
		x: t,
		y: e
	});
	for (let e of n) {
		let n = {
			...L(e),
			id: I("t")
		};
		l && (n.x = e.x - s + l.x, n.y = e.y - c + l.y);
		let o = Be(r, t, n);
		o.ok ? (r = o.layout, i.push(n.id)) : a++;
	}
	return {
		layout: r,
		ids: i,
		skipped: a
	};
}
function We(e, t) {
	if (e.pages.length >= 10) return null;
	let n = L(e), r = Ne(t ?? `Seite ${n.pages.length + 1}`);
	return n.pages.push(r), {
		layout: n,
		id: r.id
	};
}
function Ge(e, t) {
	if (e.pages.length >= 10) return null;
	let n = e.pages.find((e) => e.id === t);
	if (!n || Pe(e) + n.tiles.length > 160) return null;
	let r = L(e), i = {
		...L(n),
		id: I("p"),
		name: `${n.name} (Kopie)`
	};
	return i.tiles = i.tiles.map((e) => ({
		...e,
		id: I("t")
	})), r.pages.splice(r.pages.findIndex((e) => e.id === t) + 1, 0, i), {
		layout: r,
		id: i.id
	};
}
function Ke(e, t) {
	if (e.pages.length <= 1) return null;
	let n = L(e);
	n.pages = n.pages.filter((e) => e.id !== t);
	for (let e of n.pages) for (let n of e.tiles) for (let e of ["tap_action", "hold_action"]) n[e].action === "navigate" && n[e].page === t && (n[e] = { action: "none" });
	return n.settings.home_page === t && (n.settings.home_page = n.pages[0].id), n.settings.rules && (n.settings.rules = n.settings.rules.filter((e) => e.page !== t)), n.settings.night?.page === t && (n.settings.night = {
		...n.settings.night,
		page: null
	}), n;
}
function qe(e, t, n) {
	let r = L(e);
	if (n < 0 || n >= r.pages.length || t === n) return r;
	let [i] = r.pages.splice(t, 1);
	return r.pages.splice(n, 0, i), r;
}
function Je(e, t, n, r) {
	if (n < 1 || r < 1 || n > 6 || r > 6) return {
		layout: e,
		ok: !1,
		reason: "Raster muss zwischen 1×1 und 6×6 liegen"
	};
	let i = L(e), a = i.pages.find((e) => e.id === t);
	if (!a) return {
		layout: e,
		ok: !1,
		reason: "Seite nicht gefunden"
	};
	let o = a.tiles.filter((e) => e.x + e.w > n || e.y + e.h > r);
	return o.length ? {
		layout: e,
		ok: !1,
		reason: `${o.length} Kachel(n) lägen außerhalb des neuen Rasters. Bitte zuerst verschieben oder verkleinern.`
	} : (a.cols = n, a.rows = r, {
		layout: i,
		ok: !0
	});
}
function Ye(e) {
	return e.pages.flatMap((e) => e.tiles.filter((e) => Xe(e) && !e.entity));
}
function Xe(e) {
	return e.type in he;
}
function Ze(e) {
	let t = he[e.type];
	if (!e.entity || !t || t.includes(e.entity.split(".", 1)[0])) return null;
	let n = {
		weather: "Wetter",
		light: "Licht",
		cover: "Rollladen",
		climate: "Thermostat",
		water_heater: "Warmwasser",
		media_player: "Mediaplayer",
		sensor: "Sensor",
		number: "Zahlen",
		input_number: "Zahlen-Helfer"
	};
	return `Dieser Kacheltyp braucht eine ${t.map((e) => n[e] ?? e).join(" oder ")}-Entität (${t.map((e) => `${e}.…`).join(", ")}). Bitte in der Liste auswählen.`;
}
// src/entities.ts
var Qe = [
	{
		key: "all",
		label: "Alle",
		icon: "mdi:view-grid"
	},
	{
		key: "favorites",
		label: "Favoriten",
		icon: "mdi:star"
	},
	{
		key: "light",
		label: "Beleuchtung",
		icon: "mdi:lightbulb"
	},
	{
		key: "switch",
		label: "Schalter",
		icon: "mdi:toggle-switch"
	},
	{
		key: "outlet",
		label: "Steckdosen",
		icon: "mdi:power-socket-de"
	},
	{
		key: "climate",
		label: "Klima",
		icon: "mdi:thermostat"
	},
	{
		key: "sensor",
		label: "Sensoren",
		icon: "mdi:gauge"
	},
	{
		key: "cover",
		label: "Rollläden",
		icon: "mdi:window-shutter"
	},
	{
		key: "media",
		label: "Medien",
		icon: "mdi:play-circle"
	},
	{
		key: "scene",
		label: "Szenen",
		icon: "mdi:palette"
	},
	{
		key: "automation",
		label: "Automationen",
		icon: "mdi:robot"
	},
	{
		key: "script",
		label: "Skripte",
		icon: "mdi:script-text"
	},
	{
		key: "status",
		label: "Statusanzeigen",
		icon: "mdi:information"
	},
	{
		key: "navigation",
		label: "Navigation",
		icon: "mdi:arrow-right-bold-box"
	},
	{
		key: "system",
		label: "Systemfunktionen",
		icon: "mdi:cog"
	}
];
function $e(e) {
	return e.split(".", 1)[0];
}
function et(e) {
	let t = $e(e.entity_id), n = e.attributes.device_class;
	switch (t) {
		case "light": return "light";
		case "switch": return n === "outlet" ? "outlet" : "switch";
		case "input_boolean":
		case "button":
		case "input_button":
		case "lock":
		case "siren": return "switch";
		case "climate":
		case "fan":
		case "humidifier":
		case "water_heater": return "climate";
		case "sensor":
		case "number":
		case "input_number": return "sensor";
		case "cover":
		case "valve": return "cover";
		case "media_player": return "media";
		case "scene": return "scene";
		case "automation": return "automation";
		case "script": return "script";
		case "binary_sensor":
		case "person":
		case "device_tracker":
		case "sun":
		case "weather":
		case "alarm_control_panel":
		case "update": return "status";
		default: return null;
	}
}
function V(e) {
	return e.attributes.friendly_name || e.entity_id;
}
function tt(e, t) {
	let n = e.entities?.[t], r = n?.area_id || (n?.device_id ? e.devices?.[n.device_id]?.area_id : null);
	return r && e.areas?.[r]?.name || "";
}
function nt(e, t) {
	let n = e.entities?.[t]?.device_id, r = n ? e.devices?.[n] : void 0;
	return r?.name_by_user || r?.name || "";
}
function rt(e) {
	let t = [];
	for (let n of Object.values(e.states)) {
		let r = et(n);
		r && (e.entities?.[n.entity_id]?.hidden || t.push({
			entity_id: n.entity_id,
			name: V(n),
			domain: $e(n.entity_id),
			category: r,
			area: tt(e, n.entity_id),
			device: nt(e, n.entity_id),
			state: n.state
		}));
	}
	return t.sort((e, t) => e.name.localeCompare(t.name, "de"));
}
function it(e, t, n, r) {
	let i = t.toLowerCase().split(/\s+/).filter(Boolean), a = new Set(r);
	return e.filter((e) => {
		if (n === "favorites" && !a.has(e.entity_id) || n !== "all" && n !== "favorites" && e.category !== n) return !1;
		let t = `${e.name} ${e.entity_id} ${e.device} ${e.area} ${e.domain}`.toLowerCase();
		return i.every((e) => t.includes(e));
	});
}
function at(e, t) {
	let n = $e(e);
	if (n === "light") {
		let e = t?.attributes.supported_color_modes ?? [];
		return e.some((e) => [
			"rgb",
			"rgbw",
			"rgbww",
			"hs",
			"xy"
		].includes(e)) ? "rgb" : e.some((e) => e !== "onoff") ? "dimmer" : "light";
	}
	return n === "cover" ? "cover" : n === "climate" || n === "water_heater" ? "thermostat" : n === "media_player" ? "media" : n === "weather" ? "weather" : [
		"switch",
		"input_boolean",
		"fan",
		"automation",
		"lock",
		"siren",
		"humidifier",
		"valve"
	].includes(n) ? "switch" : [
		"scene",
		"script",
		"button",
		"input_button"
	].includes(n) ? "action" : "sensor";
}
function ot(e, t) {
	let n = $e(t), r = e?.attributes.device_class;
	return n === "light" ? "lightbulb" : n === "switch" ? r === "outlet" ? "power-socket-de" : "toggle-switch" : n === "fan" ? "fan" : n === "cover" ? r === "garage" ? "garage" : r === "blind" ? "blinds" : r === "curtain" ? "curtains" : "window-shutter" : n === "media_player" ? r === "tv" ? "television" : "speaker" : n === "scene" ? "palette" : n === "script" ? "script-text" : n === "automation" ? "robot" : n === "climate" || n === "water_heater" ? "radiator" : n === "weather" ? "weather-partly-cloudy" : n === "lock" ? "lock" : n === "vacuum" ? "robot-vacuum" : n === "person" || n === "device_tracker" ? "account" : r === "temperature" ? "thermometer" : r === "humidity" || r === "moisture" ? "water-percent" : r === "power" || r === "energy" || r === "voltage" || r === "current" ? "lightning-bolt" : r === "battery" ? "battery" : r === "motion" || r === "occupancy" || r === "presence" ? "motion-sensor" : r === "connectivity" ? "wifi" : r === "door" || r === "garage_door" ? "door" : r === "window" || r === "opening" ? "window-closed" : "gauge";
}
var st = {
	media: [2, 1],
	thermostat: [1, 1],
	cover: [1, 1]
};
function H(e, t) {
	let n = e.states[t], r = at(t, n), [i, a] = st[r] ?? [1, 1];
	return R(r, 0, 0, i, a, {
		entity: t,
		title: n ? V(n).slice(0, 64) : t,
		icon: ot(n, t)
	});
}
var ct = [
	{
		key: "fajr",
		label: "Fajr",
		aliases: [
			"fajr",
			"fadschr",
			"sabah"
		]
	},
	{
		key: "sunrise",
		label: "Sonnenaufgang",
		aliases: [
			"sunrise",
			"sonnenaufgang",
			"shuruq",
			"shurooq",
			"gunes"
		]
	},
	{
		key: "dhuhr",
		label: "Dhuhr",
		aliases: [
			"dhuhr",
			"zuhr",
			"dhuhur",
			"duhr",
			"ogle"
		]
	},
	{
		key: "asr",
		label: "Asr",
		aliases: ["asr", "ikindi"]
	},
	{
		key: "maghrib",
		label: "Maghrib",
		aliases: [
			"maghrib",
			"magrib",
			"aksam"
		]
	},
	{
		key: "isha",
		label: "Isha",
		aliases: [
			"isha",
			"ischa",
			"yatsi"
		]
	}
];
function lt(e) {
	let t = Object.values(e.states).filter((e) => e.entity_id.startsWith("sensor.") && e.attributes.device_class === "timestamp" && !/midnight|mitternacht/.test(e.entity_id)), n = {};
	for (let e of ct) {
		let r = t.filter((t) => {
			let n = `${t.entity_id} ${V(t)}`.toLowerCase();
			return e.aliases.some((e) => n.includes(e));
		}), i = (e) => +!/prayer|gebet|islam|salah|namaz|adhan/.test(`${e.entity_id} ${V(e)}`.toLowerCase());
		r.sort((e, t) => i(e) - i(t) || e.entity_id.localeCompare(t.entity_id)), r[0] && (e.key !== "sunrise" || i(r[0]) === 0) && (n[e.key] = r[0].entity_id);
	}
	return n;
}
// src/history.ts
var ut = class {
	constructor(e = 100) {
		this.limit = e, this.past = [], this.future = [];
	}
	push(e) {
		let t = JSON.stringify(e);
		this.past[this.past.length - 1] !== t && (this.past.push(t), this.past.length > this.limit && this.past.shift(), this.future = []);
	}
	undo(e) {
		let t = this.past.pop();
		return t === void 0 ? null : (this.future.push(JSON.stringify(e)), JSON.parse(t));
	}
	redo(e) {
		let t = this.future.pop();
		return t === void 0 ? null : (this.past.push(JSON.stringify(e)), JSON.parse(t));
	}
	clear() {
		this.past = [], this.future = [];
	}
	get canUndo() {
		return this.past.length > 0;
	}
	get canRedo() {
		return this.future.length > 0;
	}
}, dt, ft = {
	wetter: ["weather"],
	licht: ["light"],
	lampe: ["light"],
	leuchte: ["light"],
	schalter: ["switch", "input_boolean"],
	steckdose: ["switch"],
	sensor: ["sensor", "binary_sensor"],
	temperatur: ["sensor", "climate"],
	rollladen: ["cover"],
	rolladen: ["cover"],
	jalousie: ["cover"],
	markise: ["cover"],
	tor: ["cover"],
	heizung: ["climate"],
	thermostat: ["climate"],
	klima: ["climate"],
	musik: ["media_player"],
	medien: ["media_player"],
	lautsprecher: ["media_player"],
	fernseher: ["media_player"],
	szene: ["scene"],
	skript: ["script"],
	automation: ["automation"],
	taste: ["button", "input_button"],
	knopf: ["button", "input_button"],
	person: ["person"],
	schloss: ["lock"],
	ventilator: ["fan"],
	lüfter: ["fan"]
}, pt = {
	weather: "Wetter",
	light: "Licht",
	switch: "Schalter",
	sensor: "Sensor",
	binary_sensor: "Binärsensor",
	cover: "Rollladen",
	climate: "Thermostat",
	water_heater: "Warmwasser",
	media_player: "Mediaplayer",
	scene: "Szene",
	script: "Skript",
	number: "Zahl",
	input_number: "Zahlen-Helfer"
};
function mt(e, t, n) {
	let r = n.toLowerCase().split(/\s+/).filter(Boolean);
	if (!r.length) return !0;
	let i = t.entity_id.split(".", 1)[0], a = `${V(t)} ${t.entity_id} ${tt(e, t.entity_id)} ${pt[i] ?? ""}`.toLowerCase();
	return r.every((e) => a.includes(e) || Object.entries(ft).some(([t, n]) => t.startsWith(e) && e.length >= 3 && n.includes(i)));
}
var U = (dt = class extends t {
	constructor(...e) {
		super(...e), this.value = null, this.domains = null, this.placeholder = "Entität suchen (z. B. wetter, licht, küche) …", this.invalid = !1, this.open = !1, this.query = "", this.active = 0;
	}
	get options() {
		return Object.values(this.hass.states).filter((e) => !this.domains || this.domains.includes(e.entity_id.split(".", 1)[0])).filter((e) => mt(this.hass, e, this.query)).sort((e, t) => V(e).localeCompare(V(t), "de")).slice(0, 60);
	}
	choose(e) {
		this.open = !1, this.query = "", D(this, "gs-entity", e);
	}
	onKey(e) {
		let t = this.options;
		e.key === "ArrowDown" ? (e.preventDefault(), this.open = !0, this.active = Math.min(this.active + 1, t.length - 1)) : e.key === "ArrowUp" ? (e.preventDefault(), this.active = Math.max(this.active - 1, 0)) : e.key === "Enter" && this.open && t[this.active] ? (e.preventDefault(), this.choose(t[this.active].entity_id)) : e.key === "Escape" && (this.open = !1);
	}
	render() {
		let e = this.value ? this.hass.states[this.value] : void 0, t = this.open ? this.options : [], n = this.domains ? this.domains.map((e) => pt[e] ?? e).join(" / ") : "";
		return c`<div class="wrap">
      <input
        class=${this.invalid ? "invalid" : ""}
        .value=${this.open ? this.query : e ? `${V(e)} (${e.entity_id})` : this.value ?? ""}
        placeholder=${this.placeholder}
        @focus=${() => {
			this.open = !0, this.active = 0;
		}}
        @input=${(e) => {
			this.query = e.target.value, this.open = !0, this.active = 0;
		}}
        @keydown=${(e) => this.onKey(e)}
        @blur=${() => setTimeout(() => this.open = !1, 150)}
      />
      ${this.value ? c`<button class="clear icon ghost" title="Entität entfernen" @mousedown=${(e) => e.preventDefault()} @click=${() => this.choose(null)}>✕</button>` : a}
      ${this.open ? c`<div class="list" role="listbox">
            ${t.length === 0 ? c`<div class="empty">Keine passende ${n ? `${n}-` : ""}Entität gefunden.${this.domains?.includes("weather") ? c`<br />Tipp: Die Wetter-Integration „Met.no“ legt in Home Assistant automatisch <code>weather.forecast_home</code> an.` : a}</div>` : t.map((e, t) => {
			let n = e.entity_id.split(".", 1)[0];
			return c`<div
                    class="opt ${t === this.active ? "active" : ""}"
                    role="option"
                    @mousedown=${(e) => e.preventDefault()}
                    @click=${() => this.choose(e.entity_id)}
                    @mouseenter=${() => this.active = t}
                  >
                    <span class="nm">${V(e)}</span>
                    <span class="meta">${e.entity_id}${tt(this.hass, e.entity_id) ? ` · ${tt(this.hass, e.entity_id)}` : ""} · ${le(n, e.state, e.attributes)}</span>
                  </div>`;
		})}
          </div>` : a}
    </div>`;
	}
}, dt.styles = [T, r`
      .wrap {
        position: relative;
      }
      input {
        padding-right: 36px;
      }
      input.invalid {
        border-color: var(--gs-error);
      }
      .clear {
        position: absolute;
        right: 2px;
        top: 0;
        width: 32px;
      }
      .list {
        position: absolute;
        z-index: 30;
        left: 0;
        right: 0;
        top: calc(100% + 4px);
        max-height: 280px;
        overflow-y: auto;
        background: var(--gs-surface);
        border: 1px solid var(--gs-border);
        border-radius: 12px;
        box-shadow: var(--gs-shadow);
      }
      .opt {
        display: grid;
        gap: 2px;
        padding: 8px 12px;
        cursor: pointer;
      }
      .opt.active {
        background: color-mix(in srgb, var(--gs-primary) 12%, transparent);
      }
      .nm {
        font-weight: 500;
        color: var(--gs-text);
      }
      .meta {
        font-size: 11px;
        color: var(--gs-muted);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .empty {
        padding: 12px;
        font-size: 12px;
        color: var(--gs-muted);
        line-height: 1.5;
      }
    `], dt);
M([s({ attribute: !1 })], U.prototype, "hass", void 0), M([s()], U.prototype, "value", void 0), M([s({ attribute: !1 })], U.prototype, "domains", void 0), M([s()], U.prototype, "placeholder", void 0), M([s({ type: Boolean })], U.prototype, "invalid", void 0), M([e()], U.prototype, "open", void 0), M([e()], U.prototype, "query", void 0), M([e()], U.prototype, "active", void 0), U = M([u("gs-entity-picker")], U);
// src/views/tile-props.ts
var ht, gt, _t = {
	light: "Licht (Ein/Aus)",
	dimmer: "Licht mit Helligkeitsregler",
	rgb: "RGB-Licht (Farben + Helligkeit)",
	graph: "Verlaufsgraph",
	switch: "Schalter",
	sensor: "Sensorwert",
	clock: "Uhrzeit",
	nav: "Navigation",
	text: "Text",
	action: "Aktion / Szene / Skript",
	status: "WLAN/HA-Status",
	settings: "Einstellungen (öffnet das Menü am Display)",
	cover: "Rollladen (▲ ■ ▼)",
	thermostat: "Thermostat (− +)",
	media: "Mediaplayer",
	weather: "Wetter",
	swipe: "Wisch-Kachel (bis 4 Entitäten)",
	camera: "Kameravorschau (Stream auf ESP32 nicht sinnvoll)"
}, vt = {
	none: "Keine Aktion",
	default: "Standard (passend zur Entität)",
	toggle: "Umschalten",
	turn_on: "Einschalten",
	turn_off: "Ausschalten",
	call_service: "Aktion/Dienst ausführen …",
	navigate: "Zu Seite wechseln …",
	home: "Zur Startseite",
	back: "Zurück",
	next: "Nächste Seite",
	prev: "Vorherige Seite"
}, yt = {
	s: "Klein",
	m: "Normal",
	l: "Groß",
	xl: "Sehr groß",
	xxl: "Riesig"
}, W = (ht = class extends t {
	constructor(...e) {
		super(...e), this.iconsOpen = !1, this.iconFilter = "", this.jsonError = null;
	}
	patch(e) {
		D(this, "gs-patch", e);
	}
	patchStyle(e) {
		this.patch({ style: {
			...this.tile.style,
			...e
		} });
	}
	geometry(e) {
		let t = this.tile;
		D(this, "gs-geometry", {
			x: t.x,
			y: t.y,
			w: t.w,
			h: t.h,
			...e
		});
	}
	get theme() {
		return this.info.themes[this.layout.settings.theme] ?? Object.values(this.info.themes)[0];
	}
	colorField(e, t, n) {
		let r = this.tile.style[t];
		return c`<div class="color-row">
      <span>${e}</span>
      <input type="color" .value=${r ?? n} @input=${(e) => this.patchStyle({ [t]: e.target.value.toUpperCase() })} />
      ${r ? c`<button class="icon ghost" title="Auf Design-Standard zurücksetzen" @click=${() => this.patchStyle({ [t]: null })}>↺</button>` : c`<span class="muted small">Design</span>`}
    </div>`;
	}
	actionEditor(e, t) {
		let n = this.tile[e], r = (t) => this.patch({ [e]: t });
		return c`<label class="field"><span>${t}</span>
        <select @change=${(e) => {
			let t = e.target.value;
			r(t === "navigate" ? {
				action: t,
				page: this.layout.pages[0].id
			} : t === "call_service" ? {
				action: t,
				service: "",
				data: {}
			} : { action: t });
		}}>
          ${Object.keys(vt).map((e) => c`<option value=${e} ?selected=${n.action === e}>${vt[e]}</option>`)}
        </select>
      </label>
      ${n.action === "navigate" ? c`<label class="field"><span>Zielseite</span>
            <select @change=${(e) => r({
			action: "navigate",
			page: e.target.value
		})}>
              ${this.layout.pages.map((e) => c`<option value=${e.id} ?selected=${n.page === e.id}>${e.name}</option>`)}
            </select>
          </label>` : a}
      ${n.action === "call_service" ? c`<label class="field"><span>Aktion (domain.dienst)</span>
              <input placeholder="z. B. media_player.media_play_pause" .value=${n.service ?? ""} @change=${(e) => r({
			...n,
			service: e.target.value.trim()
		})} />
            </label>
            <label class="field"><span>Daten (JSON, optional – entity_id wird automatisch ergänzt)</span>
              <textarea
                .value=${JSON.stringify(n.data ?? {}, null, 1)}
                @change=${(e) => {
			try {
				let t = JSON.parse(e.target.value || "{}");
				if (typeof t != "object" || Array.isArray(t) || t === null) throw Error();
				this.jsonError = null, r({
					...n,
					data: t
				});
			} catch {
				this.jsonError = "Kein gültiges JSON-Objekt";
			}
		}}
              ></textarea>
              ${this.jsonError ? c`<span style="color:var(--gs-error)">${this.jsonError}</span>` : a}
            </label>` : a}`;
	}
	visibilityEditor() {
		let e = this.tile.visibility, t = (e) => this.patch({ visibility: e });
		return c`${e.map((n, r) => c`<div class="cond">
          <input list="gs-entities" placeholder="Entität" .value=${n.entity} @change=${(n) => t(e.map((e, t) => t === r ? {
			...e,
			entity: n.target.value.trim()
		} : e))} />
          <select @change=${(n) => t(e.map((e, t) => t === r ? {
			...e,
			operator: n.target.value
		} : e))}>
            ${[
			"eq",
			"ne",
			"gt",
			"lt"
		].map((e) => c`<option value=${e} ?selected=${n.operator === e}>${{
			eq: "=",
			ne: "≠",
			gt: ">",
			lt: "<"
		}[e]}</option>`)}
          </select>
          <input placeholder="Wert" .value=${n.value} @change=${(n) => t(e.map((e, t) => t === r ? {
			...e,
			value: n.target.value
		} : e))} />
          <button class="icon ghost" title="Entfernen" @click=${() => t(e.filter((e, t) => t !== r))}>✕</button>
        </div>`)}
      <button @click=${() => t([...e, {
			entity: this.tile.entity ?? "",
			operator: "eq",
			value: "on"
		}])}>＋ Bedingung</button>
      <p class="muted small" style="margin-top:6px">Die Kachel ist nur sichtbar, wenn alle Bedingungen erfüllt sind. Home Assistant wertet sie aus und aktualisiert das Display live.</p>`;
	}
	weatherOptions() {
		let e = this.tile, t = {
			...ge,
			...e.weather ?? {}
		}, n = (e, n) => this.patch({ weather: {
			...t,
			[e]: n
		} });
		return c`<div class="field-like">
      <span class="lbl">Wetter-Anzeige</span>
      ${[
			["condition", "Zustand (z. B. „Sonnig“)"],
			["hilo", "Höchst- und Tiefstwert heute"],
			["humidity", "Luftfeuchte"],
			["wind", "Wind"],
			["pressure", "Luftdruck"],
			["forecast", "3-Tage-Vorhersage (ab Größe 2×2)"]
		].map(([e, r]) => c`<label class="check"><input type="checkbox" .checked=${t[e]} @change=${(t) => n(e, t.target.checked)} /> ${r}</label>`)}
      <p class="muted small">Temperatur und Wetter-Icon werden immer angezeigt. Details erscheinen ab 2 Spalten Breite (oder ab einer hohen Kachel), die Vorhersage ab 2×2.</p>
    </div>`;
	}
	swipeItems() {
		let e = this.tile.items ?? [], t = (e) => this.patch({
			items: e,
			entity: e[0]?.entity ?? null
		});
		return c`<div class="field-like">
      <label class="field"><span>Wischrichtung</span>
        <select @change=${(e) => this.patch({ swipe_dir: e.target.value })}>
          <option value="h" ?selected=${this.tile.swipe_dir !== "v"}>⇆ Links / rechts</option>
          <option value="v" ?selected=${this.tile.swipe_dir === "v"}>⇅ Hoch / runter</option>
        </select>
      </label>
      <span class="muted small">Entitäten (bis ${4}). Auf dem Display über die Kachel wischen, um zur nächsten zu wechseln – der Inhalt folgt dem Finger. Tippen bedient die gerade angezeigte Entität; beim Wischen wird nichts ausgelöst.</span>
      ${e.map((n, r) => c`<div class="swipe-item">
          <span class="swipe-no">${r + 1}</span>
          <div style="flex:1;min-width:0;display:grid;gap:4px">
            <gs-entity-picker
              .hass=${this.hass}
              .value=${n.entity}
              ?invalid=${!n.entity || !this.hass.states[n.entity]}
              @gs-entity=${(i) => {
			let a = [...e];
			if (!i.detail) a.splice(r, 1);
			else {
				let e = this.hass.states[i.detail];
				a[r] = {
					entity: i.detail,
					title: e ? V(e).slice(0, 64) : n.title,
					icon: ot(e, i.detail)
				};
			}
			t(a);
		}}
            ></gs-entity-picker>
            <input maxlength="64" placeholder="Titel" .value=${n.title} @input=${(i) => {
			let a = [...e];
			a[r] = {
				...n,
				title: i.target.value
			}, t(a);
		}} />
          </div>
          <div style="display:grid;gap:4px">
            <button class="icon ghost" title="Nach oben" ?disabled=${r === 0} @click=${() => {
			let n = [...e];
			[n[r - 1], n[r]] = [n[r], n[r - 1]], t(n);
		}}>↑</button>
            <button class="icon ghost danger" title="Entfernen" @click=${() => t(e.filter((e, t) => t !== r))}>✕</button>
          </div>
        </div>`)}
      ${e.length < 4 ? c`<gs-entity-picker
            .hass=${this.hass}
            .value=${null}
            ?invalid=${e.length === 0}
            placeholder="＋ Entität hinzufügen (z. B. licht, temperatur) …"
            @gs-entity=${(n) => {
			if (!n.detail) return;
			let r = this.hass.states[n.detail];
			t([...e, {
				entity: n.detail,
				title: r ? V(r).slice(0, 64) : "",
				icon: ot(r, n.detail)
			}]);
		}}
          ></gs-entity-picker>` : a}
    </div>`;
	}
	render() {
		let e = this.tile, t = this.theme, n = e.entity ? this.hass.states[e.entity] : void 0, r = Xe(e), i = Ze(e), o = this.info.icons.filter((e) => e.includes(this.iconFilter.trim().toLowerCase()));
		return c`
      <datalist id="gs-entities">
        ${Object.values(this.hass.states).map((e) => c`<option value=${e.entity_id}>${V(e)}</option>`)}
      </datalist>
      <div class="row head">
        <h2 style="margin:0">Kachel</h2><span class="spacer"></span>
        <button class="icon" title="Duplizieren" @click=${() => D(this, "gs-duplicate")}>⊕</button>
        <button class="icon danger" title="Löschen" @click=${() => D(this, "gs-delete")}>🗑</button>
      </div>

      <section>
        <h3>Inhalt</h3>
        <label class="field"><span>Kacheltyp</span>
          <select @change=${(t) => {
			let n = t.target.value, r = n === "swipe" && !(e.items ?? []).length && e.entity ? { items: [{
				entity: e.entity,
				title: e.title,
				icon: e.icon
			}] } : {};
			this.patch({
				type: n,
				...r
			});
		}}>
            ${this.info.tile_types.map((t) => c`<option value=${t} ?selected=${e.type === t}>${_t[t] ?? t}</option>`)}
            <optgroup label="Geplant (noch nicht in Firmware v1)">
              ${this.info.planned_tile_types.map((e) => c`<option disabled>${_t[e] ?? e} – nicht verfügbar</option>`)}
            </optgroup>
          </select>
        </label>
        ${e.type === "swipe" ? a : c`<label class="field"><span>${e.type === "text" ? "Text" : e.type === "clock" ? "Untertitel (leer = Datum)" : "Titel"}</span>
              <input maxlength="64" .value=${e.title} @input=${(e) => this.patch({ title: e.target.value })} />
            </label>`}
        ${e.type === "swipe" ? this.swipeItems() : a}
        ${e.type !== "clock" && e.type !== "text" && e.type !== "status" && e.type !== "swipe" ? c`<label class="field"><span>Entität ${r ? "(erforderlich)" : "(optional)"}</span>
              <gs-entity-picker
                .hass=${this.hass}
                .value=${e.entity}
                .domains=${he[e.type] ?? null}
                ?invalid=${r && !e.entity || !!i}
                @gs-entity=${(t) => {
			let n = t.detail, r = n ? this.hass.states[n] : void 0;
			this.patch({
				entity: n,
				...r && !e.title ? { title: V(r).slice(0, 64) } : {}
			});
		}}
              ></gs-entity-picker>
              ${e.entity && !n ? c`<span style="color:var(--gs-error)">Entität existiert nicht oder ist nicht verfügbar</span>` : a}
              ${i ? c`<span style="color:var(--gs-error)">${i}</span>` : a}
              ${n ? c`<span>Aktuell: <b>${le(n.entity_id.split(".", 1)[0], n.state, n.attributes)}</b>
                    ${n.entity_id.startsWith("weather.") ? c`<br />${[
			n.attributes.humidity == null ? "" : `Luftfeuchte ${n.attributes.humidity} %`,
			n.attributes.wind_speed == null ? "" : `Wind ${n.attributes.wind_speed} ${n.attributes.wind_speed_unit ?? "km/h"}`,
			n.attributes.pressure == null ? "" : `Luftdruck ${n.attributes.pressure} ${n.attributes.pressure_unit ?? "hPa"}`
		].filter(Boolean).join(" · ")}<br />Ab 2 Spalten zeigt die Kachel Höchst-/Tiefstwert, Feuchte und Wind; ab 2×2 die 3-Tage-Vorhersage.` : a}</span>` : a}
            </label>` : a}
        ${e.type === "weather" ? this.weatherOptions() : a}
        ${e.type === "graph" ? c`<label class="field"><span>Zeitraum des Verlaufs</span>
              <select @change=${(e) => this.patch({ hours: +e.target.value })}>
                ${[
			1,
			3,
			6,
			12,
			24,
			48
		].map((t) => c`<option value=${t} ?selected=${(e.hours ?? 24) === t}>${t} Stunde${t === 1 ? "" : "n"}</option>`)}
              </select>
              <span>Daten aus dem Recorder von Home Assistant, Aktualisierung alle 10 Minuten.</span>
            </label>` : a}
        ${e.type !== "clock" && e.type !== "text" && e.type !== "status" ? c`<div class="field-like">
              <span class="lbl">Icon</span>
              <div class="row">
                <button class="icon-btn" @click=${() => this.iconsOpen = !this.iconsOpen} title="Icon wählen">${E(e.icon, 22)} ${e.icon ?? "kein Icon"}</button>
                ${e.icon ? c`<button class="icon ghost" title="Icon entfernen" @click=${() => this.patch({ icon: null })}>✕</button>` : a}
              </div>
              ${this.iconsOpen ? c`<input
                      class="icon-search"
                      type="search"
                      placeholder="Icon suchen (englisch, z. B. lamp, fan, door) …"
                      .value=${this.iconFilter}
                      @input=${(e) => this.iconFilter = e.target.value}
                    />
                    <div class="icon-grid">
                    ${o.map((t) => c`<button class=${e.icon === t ? "sel" : ""} title=${t} @click=${() => {
			this.patch({ icon: t }), this.iconsOpen = !1;
		}}>${E(t, 20)}</button>`)}
                    ${o.length ? a : c`<span class="muted small" style="grid-column:1/-1">Kein Icon gefunden</span>`}
                  </div>` : a}
            </div>` : a}
        <label class="check"><input type="checkbox" .checked=${e.show_title} @change=${(e) => this.patch({ show_title: e.target.checked })} /> Titel anzeigen</label>
        ${[
			"light",
			"dimmer",
			"rgb",
			"switch",
			"action"
		].includes(e.type) ? c`<label class="check"><input type="checkbox" .checked=${e.show_state} @change=${(e) => this.patch({ show_state: e.target.checked })} /> Zustand anzeigen</label>` : a}
        <label class="check"><input type="checkbox" .checked=${e.show_icon} @change=${(e) => this.patch({ show_icon: e.target.checked })} /> Icon anzeigen</label>
      </section>

      <section>
        <h3>Darstellung</h3>
        <label class="field"><span>Schriftgröße</span>
          <select @change=${(e) => this.patchStyle({ font_size: e.target.value })}>
            ${Object.entries(yt).map(([t, n]) => c`<option value=${t} ?selected=${e.style.font_size === t}>${n}</option>`)}
          </select>
        </label>
        ${this.colorField("Hintergrund", "background", t.tile_bg)} ${this.colorField("Textfarbe", "color", t.text)}
        ${this.colorField("Iconfarbe", "icon_color", t.icon)}
        ${[
			"light",
			"dimmer",
			"rgb",
			"switch",
			"cover",
			"thermostat",
			"media"
		].includes(e.type) ? c`${this.colorField("Farbe wenn „An“", "on_color", t.on_bg)} ${this.colorField("Text wenn „An“", "on_text_color", t.on_text)}` : a}
        <label class="field"><span>Eckenradius: ${e.style.radius}px</span>
          <input type="range" min="0" max="60" .value=${String(e.style.radius)} @change=${(e) => this.patchStyle({ radius: +e.target.value })} />
        </label>
        <label class="field"><span>Rahmen: ${e.style.border_width}px</span>
          <input type="range" min="0" max="8" .value=${String(e.style.border_width)} @change=${(e) => this.patchStyle({ border_width: +e.target.value })} />
        </label>
        ${e.style.border_width ? this.colorField("Rahmenfarbe", "border_color", t.accent) : a}
        <label class="field"><span>Deckkraft: ${e.style.opacity} %</span>
          <input type="range" min="10" max="100" step="5" .value=${String(e.style.opacity)} @change=${(e) => this.patchStyle({ opacity: +e.target.value })} />
        </label>
      </section>

      <section>
        <h3>Größe & Position</h3>
        <div class="geo">
          ${[
			"x",
			"y",
			"w",
			"h"
		].map((t) => c`<label class="field"><span>${{
			x: "Spalte",
			y: "Zeile",
			w: "Breite",
			h: "Höhe"
		}[t]}</span>
              <input type="number" min=${1} max=${t === "x" || t === "w" ? this.page.cols : this.page.rows}
                .value=${String(t === "x" || t === "y" ? e[t] + 1 : e[t])}
                @change=${(e) => {
			let n = parseInt(e.target.value, 10);
			Number.isNaN(n) || this.geometry({ [t]: t === "x" || t === "y" ? n - 1 : n });
		}} />
            </label>`)}
        </div>
      </section>

      <section>
        <h3>Aktionen</h3>
        ${e.type === "settings" ? c`<p class="small">Tippen öffnet das Einstellungsmenü direkt am Display (Helligkeit, Timeout, Nachtmodus, Design, Startseite, Info, Neustart). Alternativ: 3 Sekunden auf die Uhr oben rechts drücken.</p>` : this.actionEditor("tap_action", "Beim Tippen")}
        ${this.actionEditor("hold_action", "Beim langen Tippen")}
        ${e.type === "rgb" && ["none", "default"].includes(e.hold_action.action) ? c`<p class="small">Langes Tippen öffnet am Display den <b>Farbwähler</b> (Farben, Weißtöne, Helligkeit).</p>` : a}
        <p class="muted small">Aktionen werden in Home Assistant ausgeführt – das Display meldet nur, welche Kachel berührt wurde.</p>
      </section>

      <section>
        <h3>Sichtbarkeit</h3>
        ${this.visibilityEditor()}
      </section>
    `;
	}
}, ht.styles = [T, r`
      :host {
        display: block;
      }
      .swipe-item {
        display: flex;
        gap: 8px;
        align-items: flex-start;
        padding: 8px;
        margin: 6px 0;
        border: 1px solid var(--gs-border);
        border-radius: 10px;
        background: var(--gs-surface-2);
      }
      .swipe-no {
        display: grid;
        place-items: center;
        width: 22px;
        height: 22px;
        margin-top: 7px;
        border-radius: 50%;
        background: var(--gs-primary);
        color: var(--gs-on-primary);
        font-size: 12px;
        font-weight: 600;
        flex-shrink: 0;
      }
      .head {
        margin-bottom: 12px;
        padding-right: 36px;
      }
      section {
        border-top: 1px solid var(--gs-border);
        padding-top: 12px;
        margin-top: 12px;
      }
      .color-row {
        display: grid;
        grid-template-columns: 1fr auto 44px;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        font-size: 13px;
      }
      .geo {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0 10px;
      }
      .field-like {
        margin-bottom: 12px;
      }
      .lbl {
        display: block;
        font-size: 12px;
        color: var(--gs-muted);
        font-weight: 500;
        margin-bottom: 4px;
      }
      .icon-btn {
        justify-content: flex-start;
        min-width: 160px;
      }
      .icon-search {
        margin-top: 8px;
      }
      .icon-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 4px;
        margin-top: 8px;
        max-height: 220px;
        overflow-y: auto;
      }
      .icon-grid button {
        padding: 0;
        min-height: 36px;
      }
      .icon-grid button.sel {
        border-color: var(--gs-primary);
        background: color-mix(in srgb, var(--gs-primary) 15%, transparent);
      }
      .cond {
        display: grid;
        grid-template-columns: 1fr 58px 70px 32px;
        gap: 4px;
        margin-bottom: 6px;
      }
      input.invalid {
        border-color: var(--gs-error);
      }
    `], ht);
M([s({ attribute: !1 })], W.prototype, "hass", void 0), M([s({ attribute: !1 })], W.prototype, "info", void 0), M([s({ attribute: !1 })], W.prototype, "layout", void 0), M([s({ attribute: !1 })], W.prototype, "page", void 0), M([s({ attribute: !1 })], W.prototype, "tile", void 0), M([e()], W.prototype, "iconsOpen", void 0), M([e()], W.prototype, "iconFilter", void 0), M([e()], W.prototype, "jsonError", void 0), W = M([u("gs-tile-props")], W);
var bt = [
	[2, 2],
	[2, 3],
	[3, 3],
	[3, 4],
	[4, 4]
], G = (gt = class extends t {
	commit(e) {
		D(this, "gs-commit", e);
	}
	grid(e, t) {
		let n = Je(this.layout, this.page.id, e, t);
		n.ok ? this.commit(n.layout) : k(this, n.reason ?? "Nicht möglich", "error");
	}
	render() {
		let e = this.page, t = this.info.themes[this.layout.settings.theme] ?? Object.values(this.info.themes)[0], n = (t) => {
			let n = L(this.layout);
			Object.assign(n.pages.find((t) => t.id === e.id), t), this.commit(n);
		};
		return c`
      <h2>Seite „${e.name}“</h2>
      <label class="field"><span>Name</span>
        <input maxlength="32" .value=${e.name} @change=${(t) => n({ name: t.target.value.trim() || e.name })} />
      </label>
      <div class="color-row">
        <span>Hintergrund</span>
        <input type="color" .value=${e.background ?? t.page_bg} @input=${(e) => n({ background: e.target.value.toUpperCase() })} />
        ${e.background ? c`<button class="icon ghost" title="Design-Standard" @click=${() => n({ background: null })}>↺</button>` : c`<span class="muted small">Design</span>`}
      </div>
      <div class="field-like">
        <span class="lbl">Raster (Spalten × Zeilen)</span>
        <div class="presets">
          ${bt.map(([t, n]) => c`<button class=${e.cols === t && e.rows === n ? "sel" : ""} @click=${() => this.grid(t, n)}>${t} × ${n}</button>`)}
        </div>
        <div class="custom">
          <label class="field"><span>Spalten</span>
            <input type="number" min="1" max=${this.info.limits.grid} .value=${String(e.cols)} @change=${(t) => this.grid(+t.target.value, e.rows)} />
          </label>
          <label class="field"><span>Zeilen</span>
            <input type="number" min="1" max=${this.info.limits.grid} .value=${String(e.rows)} @change=${(t) => this.grid(e.cols, +t.target.value)} />
          </label>
        </div>
        <p class="muted small">Maximal ${this.info.limits.grid}×${this.info.limits.grid} – darüber werden Kacheln auf 4" zu klein für eine sichere Touchbedienung.</p>
      </div>
    `;
	}
}, gt.styles = [T, r`
      .color-row {
        display: grid;
        grid-template-columns: 1fr auto 44px;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
      }
      .lbl {
        display: block;
        font-size: 12px;
        color: var(--gs-muted);
        font-weight: 500;
        margin-bottom: 6px;
      }
      .presets {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 4px;
        margin-bottom: 8px;
      }
      .presets button {
        padding: 0;
      }
      .presets .sel {
        background: var(--gs-primary);
        color: var(--gs-on-primary);
        border-color: var(--gs-primary);
      }
      .custom {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }
    `], gt);
M([s({ attribute: !1 })], G.prototype, "info", void 0), M([s({ attribute: !1 })], G.prototype, "layout", void 0), M([s({ attribute: !1 })], G.prototype, "page", void 0), G = M([u("gs-page-props")], G);
// src/views/automation-props.ts
var xt, St = {
	enabled: !1,
	mode: "time",
	start: "22:00",
	end: "06:30",
	brightness: 15,
	dim: 30,
	page: null
}, Ct = [
	{
		code: "ger.1",
		name: "1. Bundesliga"
	},
	{
		code: "ger.2",
		name: "2. Bundesliga"
	},
	{
		code: "tur.1",
		name: "Süper Lig"
	},
	{
		code: "esp.1",
		name: "LaLiga"
	},
	{
		code: "eng.1",
		name: "Premier League"
	},
	{
		code: "ita.1",
		name: "Serie A"
	},
	{
		code: "fra.1",
		name: "Ligue 1"
	},
	{
		code: "uefa.champions",
		name: "Champions League"
	}
], wt = [
	"ger.1",
	"tur.1",
	"esp.1"
], Tt = [
	{
		key: "basmala",
		label: "Basmala",
		hint: "Mihrab-Bogen, Sternmuster und Basmala"
	},
	{
		key: "mosque",
		label: "Moschee",
		hint: "Sternenhimmel mit Mondsichel, Moschee-Silhouette und „Allah“-Kalligraphie"
	},
	{
		key: "none",
		label: "Schlicht",
		hint: "Schwarzer Hintergrund"
	}
], Et = {
	enabled: !1,
	after: 120,
	entities: [],
	mode: "clock",
	folder: "guition_studio",
	interval: 15,
	order: "random",
	fit: "cover",
	show_clock: !0
}, K = (xt = class extends t {
	constructor(...e) {
		super(...e), this.folders = null, this.mediaRoot = "";
	}
	async loadFolders() {
		if (this.api) try {
			let e = await this.api.slideFolders();
			this.folders = e.folders, this.mediaRoot = e.root;
		} catch {
			this.folders = [];
		}
	}
	get night() {
		return {
			...St,
			...this.layout.settings.night ?? {}
		};
	}
	get screensaver() {
		return {
			...Et,
			...this.layout.settings.screensaver ?? {}
		};
	}
	get rules() {
		return this.layout.settings.rules ?? [];
	}
	commit(e) {
		let t = L(this.layout);
		t.settings = {
			...t.settings,
			...e
		}, D(this, "gs-commit", t);
	}
	setRule(e, t) {
		this.commit({ rules: this.rules.map((n, r) => r === e ? {
			...n,
			...t
		} : n) });
	}
	addRule() {
		let e = {
			id: I("r"),
			name: "",
			enabled: !0,
			type: "time",
			at: "07:00",
			page: this.layout.pages[0].id
		};
		this.commit({ rules: [...this.rules, e] });
	}
	pageSelect(e, t, n = !1) {
		return c`<select @change=${(e) => t(e.target.value || null)}>
      ${n ? c`<option value="" ?selected=${!e}>– keine –</option>` : a}
      ${this.layout.pages.map((t) => c`<option value=${t.id} ?selected=${t.id === e}>${t.name}</option>`)}
    </select>`;
	}
	render() {
		let e = this.night, t = this.screensaver;
		return c`
      <datalist id="gs-auto-entities">
        ${Object.values(this.hass.states).map((e) => c`<option value=${e.entity_id}>${V(e)}</option>`)}
      </datalist>
      <p class="muted small">Gilt nach dem nächsten „Auf Display übertragen“. Home Assistant wertet die Regeln aus, ohne YAML.</p>

      <section>
        <h3>Intelligenter Seitenwechsel</h3>
        ${this.rules.length === 0 ? c`<p class="muted small">Noch keine Regeln. Beispiel: „Wenn die Klingel läutet → Seite Tür“ oder „Um 07:00 → Seite Morgen“.</p>` : a}
        ${this.rules.map((e, t) => c`<div class="rule ${e.enabled ? "" : "off"}">
            <div class="row">
              <input type="checkbox" title="Regel aktiv" .checked=${e.enabled} @change=${(e) => this.setRule(t, { enabled: e.target.checked })} />
              <input class="grow" placeholder="Name (optional)" maxlength="40" .value=${e.name} @change=${(e) => this.setRule(t, { name: e.target.value })} />
              <button class="icon ghost" title="Regel löschen" @click=${() => this.commit({ rules: this.rules.filter((e, n) => n !== t) })}>✕</button>
            </div>
            <div class="grid2">
              <label class="field"><span>Auslöser</span>
                <select @change=${(n) => {
			let r = n.target.value;
			this.setRule(t, r === "time" ? {
				type: r,
				at: e.at ?? "07:00"
			} : {
				type: r,
				entity: e.entity ?? "",
				operator: e.operator ?? "eq",
				value: e.value ?? "on"
			});
		}}>
                  <option value="time" ?selected=${e.type === "time"}>Uhrzeit (täglich)</option>
                  <option value="state" ?selected=${e.type === "state"}>Zustand einer Entität</option>
                </select>
              </label>
              <label class="field"><span>Seite anzeigen</span>${this.pageSelect(e.page, (e) => this.setRule(t, { page: e ?? this.layout.pages[0].id }))}</label>
            </div>
            ${e.type === "time" ? c`<label class="field"><span>Um</span><input type="time" .value=${e.at ?? "07:00"} @change=${(e) => this.setRule(t, { at: e.target.value })} /></label>` : c`<div class="cond">
                  <input list="gs-auto-entities" placeholder="Entität, z. B. binary_sensor.klingel" .value=${e.entity ?? ""} @change=${(e) => this.setRule(t, { entity: e.target.value.trim() })} />
                  <select @change=${(e) => this.setRule(t, { operator: e.target.value })}>
                    ${[
			"eq",
			"ne",
			"gt",
			"lt"
		].map((t) => c`<option value=${t} ?selected=${(e.operator ?? "eq") === t}>${{
			eq: "wird",
			ne: "wird nicht",
			gt: "größer",
			lt: "kleiner"
		}[t]}</option>`)}
                  </select>
                  <input placeholder="Wert" .value=${e.value ?? ""} @change=${(e) => this.setRule(t, { value: e.target.value })} />
                </div>`}
          </div>`)}
        <button @click=${() => this.addRule()} ?disabled=${this.rules.length >= 20}>＋ Regel hinzufügen</button>
        <p class="muted small">Regeln wecken das Display und lösen nur beim Wechsel in den Zustand aus, nicht dauerhaft.</p>
      </section>

      <section>
        <h3>Nachtmodus</h3>
        <label class="check"><input type="checkbox" .checked=${e.enabled} @change=${(t) => this.commit({ night: {
			...e,
			enabled: t.target.checked
		} })} /> Nachtmodus verwenden</label>
        ${e.enabled ? c`<label class="field"><span>Zeitraum</span>
                <select @change=${(t) => this.commit({ night: {
			...e,
			mode: t.target.value
		} })}>
                  <option value="time" ?selected=${e.mode === "time"}>Feste Uhrzeiten</option>
                  <option value="sun" ?selected=${e.mode === "sun"}>Sonnenuntergang bis Sonnenaufgang</option>
                </select>
              </label>
              ${e.mode === "time" ? c`<div class="grid2">
                    <label class="field"><span>Von</span><input type="time" .value=${e.start} @change=${(t) => this.commit({ night: {
			...e,
			start: t.target.value
		} })} /></label>
                    <label class="field"><span>Bis</span><input type="time" .value=${e.end} @change=${(t) => this.commit({ night: {
			...e,
			end: t.target.value
		} })} /></label>
                  </div>` : c`<p class="muted small">Nutzt <code>sun.sun</code> aus Home Assistant.</p>`}
              <label class="field"><span>Maximale Helligkeit nachts: ${e.brightness} %</span>
                <input type="range" min="1" max="100" .value=${String(e.brightness)} @change=${(t) => this.commit({ night: {
			...e,
			brightness: +t.target.value
		} })} />
              </label>
              <label class="field"><span>Zusätzlich abdunkeln: ${e.dim} %</span>
                <input type="range" min="0" max="80" step="5" .value=${String(e.dim)} @change=${(t) => this.commit({ night: {
			...e,
			dim: +t.target.value
		} })} />
              </label>
              <label class="field"><span>Bei Beginn zu Seite wechseln</span>${this.pageSelect(e.page, (t) => this.commit({ night: {
			...e,
			page: t
		} }), !0)}</label>` : a}
      </section>

      <section>
        <h3>Bildschirmschoner</h3>
        <label class="check"><input type="checkbox" .checked=${t.enabled} @change=${(e) => this.commit({ screensaver: {
			...t,
			enabled: e.target.checked
		} })} /> Uhr & Werte bei Inaktivität zeigen</label>
        ${t.enabled ? c`<label class="field"><span>Nach</span>
                <select @change=${(e) => this.commit({ screensaver: {
			...t,
			after: +e.target.value
		} })}>
                  ${[
			[30, "30 Sekunden"],
			[60, "1 Minute"],
			[120, "2 Minuten"],
			[300, "5 Minuten"],
			[900, "15 Minuten"]
		].map(([e, n]) => c`<option value=${e} ?selected=${t.after === e}>${n}</option>`)}
                </select>
              </label>
              <label class="field"><span>Anzeige</span>
                <select @change=${(e) => {
			let n = e.target.value, r = (n === "prayer" || n === "mix") && !Object.values(t.prayer ?? {}).some(Boolean) ? lt(this.hass) : t.prayer;
			this.commit({ screensaver: {
				...t,
				mode: n,
				prayer: r
			} }), n === "slideshow" && !this.folders && this.loadFolders();
		}}>
                  <option value="clock" ?selected=${t.mode !== "slideshow"}>Uhr, Datum & Werte</option>
                  <option value="slideshow" ?selected=${t.mode === "slideshow"}>Diashow (Bilder aus Home Assistant)</option>
                  <option value="prayer" ?selected=${t.mode === "prayer"}>Islamische Gebetszeiten</option>
                  <option value="football" ?selected=${t.mode === "football"}>Fußball – heutige Spiele</option>
                  <option value="mix" ?selected=${t.mode === "mix"}>Gebetszeiten & Fußball im Wechsel</option>
                </select>
              </label>
              ${t.mode === "slideshow" ? this.renderSlideshow(t) : a}
              ${t.mode === "mix" ? this.renderMix(t) : a}
              ${t.mode === "football" || t.mode === "mix" ? this.renderFootball(t) : a}
              ${t.mode === "prayer" || t.mode === "mix" ? this.renderPrayer(t) : a}
              ${t.mode === "clock" || !t.mode ? [0, 1].map((e) => c`<label class="field"><span>Wert ${e + 1} (optional)</span>
                  <input list="gs-auto-entities" placeholder="z. B. sensor.aussentemperatur" .value=${t.entities[e] ?? ""}
                    @change=${(n) => {
			let r = [...t.entities];
			r[e] = n.target.value.trim(), this.commit({ screensaver: {
				...t,
				entities: r.filter(Boolean).slice(0, 2)
			} });
		}} />
                </label>`) : a}
              <p class="muted small">Antippen beendet den Bildschirmschoner, ohne eine Kachel auszulösen. Er erscheint vor dem Dimmen, wenn seine Zeit kürzer ist als der Bildschirm-Timeout.</p>` : a}
      </section>
    `;
	}
	firstUpdated() {
		this.screensaver.mode === "slideshow" && this.loadFolders();
	}
	renderMix(e) {
		return c`<label class="field"><span>Wechsel alle</span>
      <select @change=${(t) => this.commit({ screensaver: {
			...e,
			mix_interval: +t.target.value
		} })}>
        ${[
			[10, "10 Sekunden"],
			[20, "20 Sekunden"],
			[30, "30 Sekunden"],
			[60, "1 Minute"],
			[120, "2 Minuten"]
		].map(([t, n]) => c`<option value=${t} ?selected=${(e.mix_interval ?? 20) === t}>${n}</option>`)}
      </select>
    </label>`;
	}
	renderFootball(e) {
		let t = e.leagues ?? wt, n = (n, r) => this.commit({ screensaver: {
			...e,
			leagues: Ct.map((e) => e.code).filter((e) => e === n ? r : t.includes(e))
		} });
		return c`<div class="field"><span class="muted small">Ligen</span>
        <div class="league-grid">
          ${Ct.map((e) => c`<label class="check"><input type="checkbox" .checked=${t.includes(e.code)} @change=${(t) => n(e.code, t.target.checked)} /> ${e.name}</label>`)}
        </div>
      </div>
      ${t.length === 0 ? c`<div class="notice warn small">Bitte mindestens eine Liga auswählen.</div>` : a}
      <div class="notice small">
        Home Assistant holt die Spiele von ESPN (öffentlich, ohne Konto) – alle 10 Minuten, während Spiele laufen jede Minute.
        Gezeigt werden die heutigen Spiele mit Anstoß, Live-Spielstand und Minute; an Tagen ohne Spiele die nächsten Spiele mit Wochentag.
        Darstellung wie im Sport-TV: Liga-Balken in Ligafarbe, je Spiel eine Karte mit Vereinslogos und Ergebnis-Box (live rot mit Minute). Passen nicht alle Spiele auf eine Seite, wird alle 8 Sekunden weitergeblättert.
      </div>`;
	}
	renderPrayerBackgrounds(e) {
		let t = e.prayer_bg === !1 ? "none" : e.prayer_bg === !0 || !e.prayer_bg ? "basmala" : e.prayer_bg;
		return c`<div class="field"><span class="muted small">Hintergrund</span>
      <div class="bg-grid">
        ${Tt.map((n) => c`<button class="bg-card ${t === n.key ? "active" : ""}" title=${n.hint} @click=${() => this.commit({ screensaver: {
			...e,
			prayer_bg: n.key
		} })}>
            ${n.key === "none" ? c`<span class="bg-none">Aa</span>` : c`<img src="/guition_studio_static/prayer/${n.key}.jpg" alt="" loading="lazy" />`}
            <span>${n.label}</span>
          </button>`)}
      </div>
    </div>`;
	}
	renderPrayer(e) {
		let t = e.prayer ?? {}, n = (t) => this.commit({ screensaver: {
			...e,
			prayer: t
		} }), r = Object.values(t).filter(Boolean).length;
		return c`<div class="notice small">
        Die Zeiten kommen aus der Home-Assistant-Integration <b>Islamic Prayer Times</b>
        (Einstellungen → Geräte & Dienste → Integration hinzufügen). Berechnungsmethode, Schule (Asr) und Standort stellst du dort ein.
        Das Display zeigt Uhrzeit, Datum und alle Zeiten. Das nächste Gebet wird hervorgehoben, darüber steht ein Countdown.
      </div>
      <label class="field"><span>Sprache der Namen</span>
          <select @change=${(t) => this.commit({ screensaver: {
			...e,
			prayer_lang: t.target.value
		} })}>
            <option value="de" ?selected=${e.prayer_lang !== "tr"}>Deutsch (Fajr, Dhuhr, Asr …)</option>
            <option value="tr" ?selected=${e.prayer_lang === "tr"}>Türkçe (İmsak, Öğle, İkindi …)</option>
          </select>
        </label>
      ${this.renderPrayerBackgrounds(e)}
      ${r === 0 ? c`<div class="notice warn small">Keine Gebetszeit-Sensoren gefunden. Bitte die Integration einrichten oder die Sensoren unten von Hand wählen.</div>` : a}
      ${ct.map((e) => c`<label class="field"><span>${e.label}${e.key === "sunrise" ? " (optional, kein Gebet)" : ""}</span>
          <gs-entity-picker
            .hass=${this.hass}
            .value=${t[e.key] ?? null}
            .domains=${["sensor"]}
            placeholder="Sensor suchen (z. B. ${e.label.toLowerCase()}) …"
            @gs-entity=${(r) => {
			let i = { ...t };
			r.detail ? i[e.key] = r.detail : delete i[e.key], n(i);
		}}
          ></gs-entity-picker>
        </label>`)}
      <button @click=${() => n(lt(this.hass))}>Automatisch erkennen</button>`;
	}
	renderSlideshow(e) {
		let t = (t) => this.commit({ screensaver: {
			...e,
			...t
		} }), n = this.folders?.find((t) => t.folder === e.folder);
		return c`<label class="field"><span>Bilderordner (in „Medien → Meine Medien“)</span>
        ${this.folders === null ? c`<span><span class="spinner"></span> Ordner werden geladen …</span>` : c`<select @change=${(e) => t({ folder: e.target.value })}>
              ${n ? a : c`<option selected value=${e.folder ?? ""}>${e.folder || "Hauptordner"} (nicht gefunden)</option>`}
              ${this.folders.map((t) => c`<option value=${t.folder} ?selected=${t.folder === e.folder}>${t.folder || "Hauptordner"} – ${t.count} Bild${t.count === 1 ? "" : "er"}</option>`)}
            </select>`}
      </label>
      ${n && n.count === 0 ? c`<div class="notice warn small">In diesem Ordner liegen keine Bilder.</div>` : a}
      <div class="notice small">
        Bilder hochladen: In Home Assistant links <b>Medien → Meine Medien</b> öffnen, einen Ordner (z. B. <code>guition_studio</code>) anlegen und Fotos hineinziehen.
        Home Assistant verkleinert jedes Bild auf 480 × 480 und schickt immer nur <b>ein</b> Bild ans Display – im Display wird nichts gespeichert.
        ${this.mediaRoot ? c`<br /><span class="muted">Speicherort: <code>${this.mediaRoot}</code></span>` : a}
        <br /><button style="margin-top:6px" @click=${() => this.loadFolders()}>↻ Ordner neu laden</button>
      </div>
      <div class="grid2">
        <label class="field"><span>Bildwechsel</span>
          <select @change=${(e) => t({ interval: +e.target.value })}>
            ${[
			[5, "5 s"],
			[10, "10 s"],
			[15, "15 s"],
			[30, "30 s"],
			[60, "1 min"],
			[300, "5 min"]
		].map(([t, n]) => c`<option value=${t} ?selected=${(e.interval ?? 15) === t}>${n}</option>`)}
          </select>
        </label>
        <label class="field"><span>Reihenfolge</span>
          <select @change=${(e) => t({ order: e.target.value })}>
            <option value="random" ?selected=${e.order !== "sequential"}>Zufällig</option>
            <option value="sequential" ?selected=${e.order === "sequential"}>Der Reihe nach</option>
          </select>
        </label>
      </div>
      <label class="field"><span>Bildausschnitt</span>
        <select @change=${(e) => t({ fit: e.target.value })}>
          <option value="cover" ?selected=${e.fit !== "contain"}>Ausfüllen (Ränder werden beschnitten)</option>
          <option value="contain" ?selected=${e.fit === "contain"}>Ganzes Bild (mit schwarzen Rändern)</option>
        </select>
      </label>
      <label class="check"><input type="checkbox" .checked=${e.show_clock !== !1} @change=${(e) => t({ show_clock: e.target.checked })} /> Uhrzeit & Datum über den Bildern</label>`;
	}
}, xt.styles = [T, r`
      .league-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0 12px;
        margin: 6px 0 4px;
      }
      .bg-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
        gap: 8px;
        margin: 6px 0 12px;
      }
      .bg-card {
        display: grid;
        gap: 4px;
        padding: 4px;
        min-height: 0;
        height: auto;
        border-radius: 10px;
        font-size: 12px;
        white-space: normal;
      }
      .bg-card img,
      .bg-none {
        width: 100%;
        aspect-ratio: 1;
        border-radius: 7px;
        display: block;
      }
      .bg-none {
        display: grid;
        place-items: center;
        background: #000;
        color: #8b98a5;
        font-size: 20px;
      }
      .bg-card.active {
        border-color: var(--gs-primary);
        box-shadow: 0 0 0 2px var(--gs-primary);
        font-weight: 600;
      }
      section {
        border-top: 1px solid var(--gs-border);
        padding-top: 12px;
        margin-top: 12px;
      }
      .rule {
        border: 1px solid var(--gs-border);
        border-radius: 12px;
        padding: 10px;
        margin-bottom: 10px;
      }
      .rule.off {
        opacity: 0.6;
      }
      .rule .row {
        margin-bottom: 8px;
        flex-wrap: nowrap;
      }
      .grow {
        flex: 1;
      }
      .grid2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0 8px;
      }
      .cond {
        display: grid;
        grid-template-columns: 1fr 96px 70px;
        gap: 4px;
      }
    `], xt);
M([s({ attribute: !1 })], K.prototype, "hass", void 0), M([s({ attribute: !1 })], K.prototype, "layout", void 0), M([s({ attribute: !1 })], K.prototype, "api", void 0), M([e()], K.prototype, "folders", void 0), M([e()], K.prototype, "mediaRoot", void 0), K = M([u("gs-automation-props")], K);
// src/views/designer.ts
var Dt, q = [], J = (Dt = class extends t {
	constructor(...e) {
		super(...e), this.displays = [], this.displayId = null, this.layout = null, this.activePage = "", this.selection = [], this.zoom = .8, this.showGrid = !0, this.multi = !1, this.drag = null, this.saveState = "saved", this.validation = null, this.applying = null, this.search = "", this.category = "all", this.favorites = [], this.libraryOpen = !0, this.propsOpen = !1, this.loading = !1, this.loadError = null, this.pageDragIndex = null, this.propsTab = "page", this.history = new ut(), this.libraryCache = null, this.loadedFor = null, this.onKeyDown = (e) => {
			let t = e.composedPath()[0];
			if ([
				"INPUT",
				"SELECT",
				"TEXTAREA"
			].includes(t?.tagName) || !this.layout) return;
			let n = e.ctrlKey || e.metaKey, r = e.key;
			if (r === "Escape") {
				this.drag ? this.cancelDrag() : this.selection = [];
				return;
			}
			if (n && r.toLowerCase() === "z") {
				e.preventDefault(), e.shiftKey ? this.redo() : this.undo();
				return;
			}
			if (n && r.toLowerCase() === "y") {
				e.preventDefault(), this.redo();
				return;
			}
			if (n && r.toLowerCase() === "c") return this.copySelection();
			if (n && r.toLowerCase() === "v") return this.paste();
			if (n && r.toLowerCase() === "d") return e.preventDefault(), this.duplicateSelection();
			if (r === "Delete" || r === "Backspace") {
				e.preventDefault(), this.deleteSelection();
				return;
			}
			let i = this.page;
			if (!i) return;
			if (r === "Tab" && i.tiles.length) {
				e.preventDefault();
				let t = [...i.tiles].sort((e, t) => e.y - t.y || e.x - t.x), n = t[(t.findIndex((e) => e.id === this.selection[0]) + (e.shiftKey ? -1 : 1) + t.length) % t.length];
				this.selection = [n.id];
				return;
			}
			let a = {
				ArrowLeft: [-1, 0],
				ArrowRight: [1, 0],
				ArrowUp: [0, -1],
				ArrowDown: [0, 1]
			};
			if (a[r] && this.selection.length) {
				e.preventDefault();
				let [t, n] = a[r], o = i.tiles.find((e) => e.id === this.selection[0]);
				if (!o) return;
				let s = e.shiftKey ? ze(this.layout, i.id, o.id, o.w + t, o.h + n) : B(this.layout, i.id, this.selection, o.id, i.id, o.x + t, o.y + n);
				s.ok ? this.commit(s.layout) : k(this, s.reason ?? "Nicht möglich");
			} else if ((r === "PageUp" || r === "PageDown") && this.selection.length) {
				e.preventDefault();
				let t = this.layout.pages.indexOf(i) + (r === "PageDown" ? 1 : -1), n = this.layout.pages[t], a = i.tiles.find((e) => e.id === this.selection[0]);
				if (!n || !a) return;
				let o = B(this.layout, i.id, this.selection, a.id, n.id, a.x, a.y);
				o.ok ? (this.commit(o.layout), this.activePage = n.id) : k(this, `Auf „${n.name}“ ist an dieser Position kein Platz`);
			}
		}, this.cancelDrag = () => {
			this.endDragListeners(), this.drag = null;
		}, this.onPointerMove = (e) => {
			let t = this.drag;
			if (!t || !this.layout || !t.started && Math.hypot(e.clientX - t.startX, e.clientY - t.startY) < 5) return;
			let n = x(this.layout.settings, this.layout.pages.length), r = {
				...t,
				started: !0,
				clientX: e.clientX,
				clientY: e.clientY,
				target: null,
				valid: !1,
				reason: void 0
			};
			if (this.autoScroll(e.clientX), t.mode === "resize") {
				let i = this.layout.pages.find((e) => e.id === t.sourcePage), a = i.tiles.find((e) => e.id === t.anchorId), o = this.hitPage(e.clientX, e.clientY);
				if (o && o.page.id === i.id) {
					let e = ne(i, n, o.px, o.py), t = Math.max(1, Math.min(i.cols - a.x, e.x - a.x + 1)), s = Math.max(1, Math.min(i.rows - a.y, e.y - a.y + 1));
					r.target = {
						page: i.id,
						x: a.x,
						y: a.y,
						w: t,
						h: s
					}, r.valid = z(i, {
						x: a.x,
						y: a.y,
						w: t,
						h: s
					}, /* @__PURE__ */ new Set([a.id])), r.valid || (r.reason = "Platz ist belegt");
				}
				this.drag = r;
				return;
			}
			let i = this.hitPage(e.clientX, e.clientY);
			if (!i) {
				r.reason = "Außerhalb des Displays", this.drag = r;
				return;
			}
			let a = ne(i.page, n, i.px, i.py);
			if (t.mode === "new" && t.newTile) {
				let e = Math.min(t.newTile.w, i.page.cols), n = Math.min(t.newTile.h, i.page.rows), o = Math.max(0, Math.min(i.page.cols - e, a.x)), s = Math.max(0, Math.min(i.page.rows - n, a.y));
				r.target = {
					page: i.page.id,
					x: o,
					y: s,
					w: e,
					h: n
				}, r.valid = z(i.page, {
					x: o,
					y: s,
					w: e,
					h: n
				}), r.valid || (r.reason = "Platz ist belegt");
			} else if (t.mode === "move" && t.sourcePage && t.anchorId) {
				let e = this.layout.pages.find((e) => e.id === t.sourcePage), n = e.tiles.filter((e) => t.ids.includes(e.id)), o = n.find((e) => e.id === t.anchorId), s = Math.min(...n.map((e) => e.x - o.x)), c = Math.max(...n.map((e) => e.x + e.w - o.x)), l = Math.min(...n.map((e) => e.y - o.y)), u = Math.max(...n.map((e) => e.y + e.h - o.y)), d = Math.max(-s, Math.min(i.page.cols - c, a.x - t.grab.x)), f = Math.max(-l, Math.min(i.page.rows - u, a.y - t.grab.y));
				r.target = {
					page: i.page.id,
					x: d,
					y: f,
					w: o.w,
					h: o.h
				};
				let p = B(this.layout, e.id, t.ids, o.id, i.page.id, d, f);
				r.valid = p.ok, r.reason = p.reason;
			}
			this.drag = r;
		}, this.onPointerUp = () => {
			let e = this.drag;
			if (this.endDragListeners(), this.drag = null, !e || !this.layout) return;
			if (!e.started) {
				e.mode === "new" && e.newTile && this.addToActivePage(e.newTile);
				return;
			}
			if (!e.target || !e.valid) {
				e.reason && k(this, `Ablegen nicht möglich: ${e.reason}`);
				return;
			}
			let t = e.target;
			if (e.mode === "new" && e.newTile) {
				let n = Be(this.layout, t.page, {
					...e.newTile,
					x: t.x,
					y: t.y,
					w: t.w,
					h: t.h
				});
				n.ok ? (this.commit(n.layout), this.activePage = t.page, this.selection = [e.newTile.id]) : k(this, n.reason ?? "Nicht möglich", "error");
			} else if (e.mode === "resize" && e.anchorId && e.sourcePage) {
				let n = ze(this.layout, e.sourcePage, e.anchorId, t.w, t.h);
				n.ok && this.commit(n.layout);
			} else if (e.mode === "move" && e.anchorId && e.sourcePage) {
				let n = B(this.layout, e.sourcePage, e.ids, e.anchorId, t.page, t.x, t.y);
				n.ok && (this.commit(n.layout), this.activePage = t.page);
			}
		};
	}
	connectedCallback() {
		super.connectedCallback(), this.addEventListener("keydown", this.onKeyDown), this.tabIndex = 0;
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.removeEventListener("keydown", this.onKeyDown), this.endDragListeners(), this.saveState === "dirty" && this.saveNow();
	}
	willUpdate(e) {
		e.has("info") && this.info && (this.favorites = [...this.info.favorites]), (e.has("displayId") || e.has("api")) && this.displayId !== this.loadedFor && this.api && this.load();
	}
	get display() {
		return this.displays.find((e) => e.id === this.displayId);
	}
	get page() {
		return this.layout?.pages.find((e) => e.id === this.activePage) ?? this.layout?.pages[0];
	}
	get selectedTiles() {
		return this.page?.tiles.filter((e) => this.selection.includes(e.id)) ?? [];
	}
	async load() {
		if (this.saveState === "dirty" && this.loadedFor && await this.saveNow(), this.loadedFor = this.displayId, this.layout = null, this.selection = [], this.history.clear(), this.displayId) {
			this.loading = !0;
			try {
				let e = await this.api.getLayout(this.displayId);
				this.layout = e.layout, this.activePage = e.layout.settings.home_page ?? e.layout.pages[0]?.id ?? "", this.saveState = "saved", this.loadError = null, this.fitZoom(), this.validate();
			} catch (e) {
				this.loadError = y(e);
			} finally {
				this.loading = !1;
			}
		}
	}
	commit(e) {
		if (!this.layout) return;
		this.history.push(this.layout), this.layout = e, e.pages.some((e) => e.id === this.activePage) || (this.activePage = e.pages[0].id);
		let t = new Set(e.pages.flatMap((e) => e.tiles.map((e) => e.id)));
		this.selection = this.selection.filter((e) => t.has(e)), this.scheduleSave();
	}
	scheduleSave() {
		this.saveState = "dirty", window.clearTimeout(this.saveTimer), this.saveTimer = window.setTimeout(() => this.saveNow(), 1200);
	}
	async saveNow() {
		if (window.clearTimeout(this.saveTimer), this.layout && this.loadedFor) {
			this.saveState = "saving";
			try {
				let e = await this.api.saveLayout(this.loadedFor, this.layout);
				this.validation = e, this.saveState = "saved";
			} catch (e) {
				this.saveState = "error", k(this, `Entwurf konnte nicht gespeichert werden: ${y(e)}`, "error");
			}
		}
	}
	async validate() {
		if (this.layout) try {
			this.validation = await this.api.validate(this.layout);
		} catch {}
	}
	undo() {
		if (!this.layout) return;
		let e = this.history.undo(this.layout);
		e && (this.layout = e, e.pages.some((e) => e.id === this.activePage) || (this.activePage = e.pages[0].id), this.scheduleSave());
	}
	redo() {
		if (!this.layout) return;
		let e = this.history.redo(this.layout);
		e && (this.layout = e, this.scheduleSave());
	}
	fitZoom() {
		let e = this.renderRoot?.querySelector?.(".workspace")?.clientHeight ?? window.innerHeight - 380;
		this.zoom = Math.max(.4, Math.min(1, Math.floor((e - 60) / 480 * 20) / 20));
	}
	copySelection() {
		q = L(this.selectedTiles), q.length && k(this, `${q.length} Kachel(n) kopiert`);
	}
	paste() {
		if (!this.layout || !q.length || !this.page) return;
		let e = Ue(this.layout, this.page.id, q);
		e.ids.length ? (this.commit(e.layout), this.selection = e.ids, e.skipped && k(this, `${e.skipped} Kachel(n) passten nicht mehr auf die Seite`, "error")) : k(this, "Kein freier Platz auf dieser Seite", "error");
	}
	duplicateSelection() {
		let e = this.selectedTiles;
		e.length && (q = L(e), this.paste());
	}
	async deleteSelection() {
		this.layout && this.selection.length && (this.commit(He(this.layout, this.selection)), this.selection = []);
	}
	startTileDrag(e, t, n) {
		if (e.button !== 0) return;
		e.stopPropagation(), this.focus({ preventScroll: !0 });
		let r = e.shiftKey || e.ctrlKey || e.metaKey || this.multi;
		if (t.id !== this.activePage && (this.activePage = t.id, this.selection = []), r) {
			if (this.selection = this.selection.includes(n.id) ? this.selection.filter((e) => e !== n.id) : [...this.selection, n.id], !this.selection.includes(n.id)) return;
		} else this.selection.includes(n.id) || (this.selection = [n.id]);
		let i = this.cellAt(t, e.clientX, e.clientY);
		this.beginDrag({
			mode: "move",
			sourcePage: t.id,
			ids: [...this.selection],
			anchorId: n.id,
			grab: {
				x: i ? i.x - n.x : 0,
				y: i ? i.y - n.y : 0
			}
		}, e);
	}
	startResize(e, t, n) {
		e.button === 0 && (e.stopPropagation(), this.selection = [n.id], this.beginDrag({
			mode: "resize",
			sourcePage: t.id,
			ids: [n.id],
			anchorId: n.id,
			grab: {
				x: 0,
				y: 0
			}
		}, e));
	}
	startNewDrag(e, t, n) {
		e.button === 0 && (e.preventDefault(), this.beginDrag({
			mode: "new",
			sourcePage: null,
			ids: [],
			anchorId: null,
			grab: {
				x: 0,
				y: 0
			},
			newTile: t(),
			label: n
		}, e));
	}
	beginDrag(e, t) {
		this.drag = {
			...e,
			started: !1,
			startX: t.clientX,
			startY: t.clientY,
			clientX: t.clientX,
			clientY: t.clientY,
			target: null,
			valid: !1
		}, window.addEventListener("pointermove", this.onPointerMove), window.addEventListener("pointerup", this.onPointerUp), window.addEventListener("pointercancel", this.cancelDrag);
	}
	endDragListeners() {
		window.removeEventListener("pointermove", this.onPointerMove), window.removeEventListener("pointerup", this.onPointerUp), window.removeEventListener("pointercancel", this.cancelDrag);
	}
	hitPage(e, t) {
		if (!this.layout) return null;
		let n = x(this.layout.settings, this.layout.pages.length);
		for (let r of this.renderRoot.querySelectorAll(".canvas[data-page]")) {
			let i = r.getBoundingClientRect();
			if (e >= i.left && e <= i.right && t >= i.top && t <= i.bottom) {
				let a = this.layout.pages.find((e) => e.id === r.dataset.page);
				if (!a) continue;
				return {
					page: a,
					px: (e - i.left) / this.zoom,
					py: (t - i.top) / this.zoom - n.top
				};
			}
		}
		return null;
	}
	cellAt(e, t, n) {
		let r = this.hitPage(t, n);
		return !r || r.page.id !== e.id || !this.layout ? null : ne(e, x(this.layout.settings, this.layout.pages.length), r.px, r.py);
	}
	autoScroll(e) {
		let t = this.renderRoot.querySelector(".workspace");
		if (!t) return;
		let n = t.getBoundingClientRect();
		e < n.left + 40 ? t.scrollLeft -= 14 : e > n.right - 40 && (t.scrollLeft += 14);
	}
	addToActivePage(e) {
		if (!this.layout || !this.page) return;
		let t = Be(this.layout, this.page.id, e);
		t.ok ? (this.commit(t.layout), this.selection = [e.id], this.propsOpen = !0) : k(this, t.reason ?? "Kein Platz", "error");
	}
	async renamePage(e) {
		let t = await ve(this, "Seite umbenennen", e.name, "Seitenname");
		if (!t || !this.layout) return;
		let n = L(this.layout);
		n.pages.find((t) => t.id === e.id).name = t.slice(0, 32), this.commit(n);
	}
	async deletePage(e) {
		if (!this.layout) return;
		if (this.layout.pages.length <= 1) {
			k(this, "Die letzte Seite kann nicht gelöscht werden.");
			return;
		}
		if (!await O(this, {
			title: "Seite löschen?",
			text: `„${e.name}“ mit ${e.tiles.length} Kachel(n) wird gelöscht. Du kannst das mit Rückgängig (Strg+Z) wiederherstellen.`,
			confirm: "Löschen",
			danger: !0
		})) return;
		let t = Ke(this.layout, e.id);
		t && this.commit(t);
	}
	setHome(e) {
		if (!this.layout) return;
		let t = L(this.layout);
		t.settings.home_page = e.id, this.commit(t);
	}
	onPageDrop(e) {
		if (this.pageDragIndex === null || !this.layout) return;
		let t = this.pageDragIndex;
		this.pageDragIndex = null, t !== e && this.commit(qe(this.layout, t, e));
	}
	async apply() {
		if (!this.layout || !this.displayId) return;
		if (!this.display?.linked) {
			k(this, "Dieses Display ist mit keinem Gerät verknüpft. Bitte unter „Meine Displays“ ein Gerät zuordnen.", "error");
			return;
		}
		let e = Ye(this.layout);
		if (e.length) {
			let t = this.layout.pages.find((t) => t.tiles.includes(e[0]));
			this.activePage = t.id, this.selection = [e[0].id], this.propsOpen = !0, k(this, `${e.length} Kachel(n) ohne zugeordnete Entität – bitte zuerst eine Entität wählen.`, "error");
			return;
		}
		await this.saveNow(), this.applying = {
			state: "sending",
			progress: 0
		};
		let t;
		try {
			t = await this.hass.connection.subscribeEvents((e) => {
				e.data?.display_id === this.displayId && e.data?.kind === "transfer" && (this.applying = {
					state: e.data.state,
					progress: e.data.progress ?? 0,
					error: e.data.error
				});
			}, "guition_studio_updated");
		} catch {}
		try {
			let e = await this.api.apply(this.displayId, this.layout);
			this.layout = {
				...this.layout,
				revision: e.revision
			}, this.applying = {
				state: "done",
				progress: 100
			}, k(this, `Layout (Revision ${e.revision}, ${e.size} Bytes) wurde vom Display bestätigt ✓`, "ok"), D(this, "gs-refresh"), setTimeout(() => this.applying = null, 2500);
		} catch (e) {
			this.applying = {
				state: "error",
				progress: 0,
				error: y(e)
			};
		} finally {
			t?.();
		}
	}
	get libraryEntries() {
		return this.libraryCache && this.libraryCache.states === this.hass.states || (this.libraryCache = {
			states: this.hass.states,
			entries: rt(this.hass)
		}), this.libraryCache.entries;
	}
	systemItems() {
		let e = [
			{
				key: "clock",
				label: "Uhrzeit",
				icon: "mdi:clock-outline",
				glyph: "🕒",
				category: "system",
				make: () => R("clock", 0, 0, 2, 1)
			},
			{
				key: "text",
				label: "Text",
				icon: "mdi:format-text",
				glyph: "T",
				category: "system",
				make: () => R("text", 0, 0, 1, 1, {
					title: "Text",
					tap_action: { action: "none" }
				})
			},
			{
				key: "status",
				label: "WLAN/HA-Status",
				icon: "mdi:wifi-check",
				glyph: "📶",
				category: "system",
				make: () => R("status", 0, 0, 1, 1, {
					title: "Status",
					tap_action: { action: "none" }
				})
			},
			{
				key: "swipe",
				label: "Wisch-Kachel ⇆ (links/rechts)",
				icon: "mdi:gesture-swipe-horizontal",
				glyph: "⇆",
				category: "system",
				make: () => R("swipe", 0, 0, 1, 1)
			},
			{
				key: "swipe-v",
				label: "Wisch-Kachel ⇅ (hoch/runter)",
				icon: "mdi:gesture-swipe-vertical",
				glyph: "⇅",
				category: "system",
				make: () => R("swipe", 0, 0, 1, 1, { swipe_dir: "v" })
			},
			{
				key: "settings",
				label: "Einstellungen (am Display)",
				icon: "mdi:cog",
				glyph: "⚙",
				category: "system",
				make: () => R("settings", 0, 0, 1, 1, {
					title: "Einstellungen",
					icon: "cog",
					tap_action: { action: "none" }
				})
			},
			{
				key: "home",
				label: "Startseite",
				icon: "mdi:home",
				glyph: "⌂",
				category: "navigation",
				make: () => R("nav", 0, 0, 1, 1, {
					title: "Start",
					icon: "home",
					tap_action: { action: "home" }
				})
			},
			{
				key: "back",
				label: "Zurück",
				icon: "mdi:arrow-left",
				glyph: "◀",
				category: "navigation",
				make: () => R("nav", 0, 0, 1, 1, {
					title: "Zurück",
					icon: "arrow-left",
					tap_action: { action: "back" }
				})
			},
			{
				key: "next",
				label: "Nächste Seite",
				icon: "mdi:arrow-right",
				glyph: "▶",
				category: "navigation",
				make: () => R("nav", 0, 0, 1, 1, {
					title: "Weiter",
					icon: "arrow-right",
					tap_action: { action: "next" }
				})
			}
		];
		for (let t of this.layout?.pages ?? []) e.push({
			key: `nav-${t.id}`,
			label: `→ ${t.name}`,
			icon: "mdi:arrow-right-bold-box",
			glyph: "➜",
			category: "navigation",
			make: () => R("nav", 0, 0, 1, 1, {
				title: t.name,
				icon: "arrow-right",
				tap_action: {
					action: "navigate",
					page: t.id
				}
			})
		});
		return e;
	}
	async toggleFavorite(e) {
		this.favorites = this.favorites.includes(e) ? this.favorites.filter((t) => t !== e) : [...this.favorites, e];
		try {
			await this.api.setFavorites(this.favorites);
		} catch (e) {
			k(this, y(e), "error");
		}
	}
	render() {
		return !this.displayId || !this.displays.length ? c`<div class="empty card">
        <h2>Noch kein Display vorhanden</h2>
        <p>Füge zuerst unter „Meine Displays“ ein Guition-Display hinzu. Danach kannst du hier Seiten gestalten.</p>
        <button class="primary" @click=${() => D(this, "gs-navigate", { view: "displays" })}>Display hinzufügen</button>
      </div>` : this.loadError ? c`<div class="notice error" style="margin:20px">${this.loadError} <button @click=${() => this.load()}>Erneut laden</button></div>` : !this.layout || this.loading ? c`<div style="padding:40px"><span class="spinner"></span> Layout wird geladen …</div>` : c`<div class="designer ${this.libraryOpen ? "" : "lib-closed"} ${this.propsOpen ? "props-open" : ""}">
      ${this.renderSidebar()} ${this.renderToolbar()} ${this.renderWorkspace()} ${this.renderLibrary()} ${this.renderProps()}
    </div>
    ${this.drag?.started && this.drag.mode === "new" ? c`<div class="ghost ${this.drag.valid ? "valid" : "invalid"}" style="left:${this.drag.clientX + 12}px;top:${this.drag.clientY + 12}px">${this.drag.label}</div>` : a}
    ${this.applying ? this.renderApplying() : a}`;
	}
	renderSidebar() {
		let e = this.layout, t = e.settings, n = (t) => this.commit({
			...L(e),
			settings: {
				...e.settings,
				...t
			}
		});
		return c`<aside class="sidebar">
      <label class="field"><span>Display</span>
        <select @change=${(e) => D(this, "gs-select-display", e.target.value)}>
          ${this.displays.map((e) => c`<option value=${e.id} ?selected=${e.id === this.displayId}>${e.name}${e.online ? "" : " (offline)"}</option>`)}
        </select>
      </label>
      <div class="row" style="margin-bottom:8px">
        <h3 style="margin:0">Seiten</h3><span class="spacer"></span>
        <span class="muted small">${e.pages.length}/${10}</span>
      </div>
      <ul class="pages" role="listbox" aria-label="Seiten">
        ${je(e.pages, (e) => e.id, (e, n) => c`<li
            class=${d({
			active: e.id === this.page?.id,
			dragover: this.pageDragIndex !== null
		})}
            draggable="true"
            role="option"
            aria-selected=${e.id === this.page?.id}
            tabindex="0"
            @dragstart=${() => this.pageDragIndex = n}
            @dragover=${(e) => e.preventDefault()}
            @drop=${() => this.onPageDrop(n)}
            @dragend=${() => this.pageDragIndex = null}
            @click=${() => {
			this.activePage = e.id, this.selection = [], this.renderRoot.querySelector(`[data-col="${e.id}"]`)?.scrollIntoView({
				behavior: "smooth",
				inline: "center",
				block: "nearest"
			});
		}}
            @dblclick=${() => this.renamePage(e)}
            @keydown=${(t) => t.key === "Enter" && (this.activePage = e.id)}
          >
            <span class="drag-handle" title="Ziehen zum Sortieren">⋮⋮</span>
            <span class="pname">${e.name}</span>
            <button class="icon ghost tiny ${t.home_page === e.id ? "home" : ""}" title="Als Startseite festlegen" @click=${(t) => (t.stopPropagation(), this.setHome(e))}>
              ${t.home_page === e.id ? "★" : "☆"}
            </button>
          </li>`)}
      </ul>
      <div class="page-actions">
        <button title="Seite hinzufügen" ?disabled=${e.pages.length >= 10} @click=${() => {
			let t = We(e);
			t && (this.commit(t.layout), this.activePage = t.id);
		}}>＋ Neu</button>
        <button title="Seite duplizieren" ?disabled=${e.pages.length >= 10} @click=${() => {
			let t = this.page && Ge(e, this.page.id);
			t ? (this.commit(t.layout), this.activePage = t.id) : k(this, "Duplizieren nicht möglich (Seiten- oder Kachellimit erreicht)");
		}}>⧉</button>
        <button title="Seite umbenennen" @click=${() => this.page && this.renamePage(this.page)}>✎</button>
        <button title="Seite nach oben" @click=${() => {
			let t = e.pages.indexOf(this.page);
			t > 0 && this.commit(qe(e, t, t - 1));
		}}>↑</button>
        <button title="Seite nach unten" @click=${() => {
			let t = e.pages.indexOf(this.page);
			t < e.pages.length - 1 && this.commit(qe(e, t, t + 1));
		}}>↓</button>
        <button class="danger" title="Seite löschen" @click=${() => this.page && this.deletePage(this.page)}>🗑</button>
      </div>

      <details class="settings" open>
        <summary><h3 style="display:inline">Displayeinstellungen</h3></summary>
        <label class="field"><span>Design</span>
          <select @change=${(e) => n({ theme: e.target.value })}>
            ${Object.entries(this.info.themes).map(([e, n]) => c`<option value=${e} ?selected=${e === t.theme}>${n.name}</option>`)}
          </select>
        </label>
        <label class="field"><span>Helligkeit: ${t.brightness} %</span>
          <input type="range" min="5" max="100" .value=${String(t.brightness)} @change=${(e) => n({ brightness: +e.target.value })} />
        </label>
        <label class="field"><span>Standby-Helligkeit: ${t.standby_brightness} %</span>
          <input type="range" min="0" max="100" .value=${String(t.standby_brightness)} @change=${(e) => n({ standby_brightness: +e.target.value })} />
        </label>
        <label class="field"><span>Bildschirm-Timeout</span>
          <select @change=${(e) => n({ timeout: +e.target.value })}>
            ${[
			[0, "Nie dimmen"],
			[15, "15 Sekunden"],
			[30, "30 Sekunden"],
			[60, "1 Minute"],
			[120, "2 Minuten"],
			[300, "5 Minuten"],
			[900, "15 Minuten"]
		].map(([e, n]) => c`<option value=${e} ?selected=${t.timeout === e}>${n}</option>`)}
          </select>
        </label>
        <label class="field"><span>Zur Startseite zurück nach</span>
          <select @change=${(e) => n({ home_after: +e.target.value })}>
            ${[
			[0, "Nie"],
			[30, "30 Sekunden"],
			[60, "1 Minute"],
			[300, "5 Minuten"]
		].map(([e, n]) => c`<option value=${e} ?selected=${t.home_after === e}>${n}</option>`)}
          </select>
        </label>
        <label class="field"><span>Bildschirmdrehung</span>
          <select @change=${(e) => n({ rotation: +e.target.value })}>
            ${[
			0,
			90,
			180,
			270
		].map((e) => c`<option value=${e} ?selected=${(t.rotation ?? 0) === e}>${e}°</option>`)}
          </select>
        </label>
        <label class="check"><input type="checkbox" .checked=${t.show_header} @change=${(e) => n({ show_header: e.target.checked })} /> Kopfzeile mit Uhr & Status</label>
        <label class="check"><input type="checkbox" .checked=${t.show_dots} @change=${(e) => n({ show_dots: e.target.checked })} /> Seitenpunkte anzeigen</label>
        <label class="check"><input type="checkbox" .checked=${t.tile_depth ?? !0} @change=${(e) => n({ tile_depth: e.target.checked })} /> 3D-Kacheln (Schatten & Licht)</label>
        <label class="check"><input type="checkbox" .checked=${t.swipe} @change=${(e) => n({ swipe: e.target.checked })} /> Wischen zum Seitenwechsel</label>
      </details>
    </aside>`;
	}
	renderToolbar() {
		let e = this.validation, t = this.display, n = {
			saved: "Entwurf gespeichert",
			dirty: "Ungespeichert …",
			saving: "Speichert …",
			error: "Speichern fehlgeschlagen"
		}[this.saveState];
		return c`<div class="toolbar">
      <button class="icon" title="Rückgängig (Strg+Z)" ?disabled=${!this.history.canUndo} @click=${() => this.undo()}>↶</button>
      <button class="icon" title="Wiederholen (Strg+Y)" ?disabled=${!this.history.canRedo} @click=${() => this.redo()}>↷</button>
      <span class="sep"></span>
      <button class="icon" title="Verkleinern" @click=${() => this.zoom = Math.max(.3, +(this.zoom - .1).toFixed(2))}>−</button>
      <button class="zoom" title="An Fenster anpassen" @click=${() => this.fitZoom()}>${Math.round(this.zoom * 100)} %</button>
      <button class="icon" title="Vergrößern" @click=${() => this.zoom = Math.min(1.6, +(this.zoom + .1).toFixed(2))}>＋</button>
      <span class="sep"></span>
      <button class=${this.showGrid ? "toggled" : ""} title="Raster & Hilfslinien" @click=${() => this.showGrid = !this.showGrid}>▦ Raster</button>
      <button class=${this.multi ? "toggled" : ""} title="Mehrfachauswahl (für Touch). Mit Maus: Umschalt/Strg + Klick" @click=${() => this.multi = !this.multi}>☑ Mehrfach</button>
      <span class="sep"></span>
      <button class="icon" title="Kopieren (Strg+C)" ?disabled=${!this.selection.length} @click=${() => this.copySelection()}>⧉</button>
      <button class="icon" title="Einfügen (Strg+V)" ?disabled=${!q.length} @click=${() => this.paste()}>📋</button>
      <button class="icon" title="Duplizieren (Strg+D)" ?disabled=${!this.selection.length} @click=${() => this.duplicateSelection()}>⊕</button>
      <button class="icon danger" title="Löschen (Entf)" ?disabled=${!this.selection.length} @click=${() => this.deleteSelection()}>🗑</button>
      <span class="spacer"></span>
      <span class="chip ${this.saveState === "error" ? "error" : this.saveState === "saved" ? "" : "warn"}" title="Entwürfe werden automatisch in Home Assistant gespeichert">${n}</span>
      ${e ? e.valid ? c`<span class="chip ok" title="Layoutgröße auf dem Gerät">✓ Gültig · ${((e.size ?? 0) / 1024).toFixed(1)} KB</span>` : c`<span class="chip error" title=${e.errors.join("\n")}>⚠ ${e.errors.length} Hinweis(e)</span>` : a}
      <span class="chip ${t?.online ? "ok" : "error"}">${t?.online ? "● Online" : "○ Offline"}</span>
      <button
        class=${this.propsTab === "auto" && !this.selection.length && this.propsOpen ? "toggled" : ""}
        title="Bildschirmschoner, Diashow, Nachtmodus und Seitenwechsel-Regeln"
        @click=${() => {
			this.selection = [], this.propsTab = "auto", this.propsOpen = !0, this.updateComplete.then(() => this.renderRoot.querySelector(".props")?.scrollTo({ top: 0 }));
		}}
      >⏾ Automatik</button>
      <button class="icon props-toggle" title="Eigenschaften" @click=${() => this.propsOpen = !this.propsOpen}>☰</button>
      <button class="primary" ?disabled=${!!this.applying && this.applying.state !== "error" && this.applying.state !== "done"} @click=${() => this.apply()}>
        ⇪ Auf Display übertragen
      </button>
    </div>`;
	}
	renderWorkspace() {
		let e = this.layout, t = this.info.themes[e.settings.theme] ?? Object.values(this.info.themes)[0], n = x(e.settings, e.pages.length), r = this.zoom, i = this.drag?.started ? this.drag : null;
		return c`<div
      class="workspace"
      @wheel=${(e) => {
			e.ctrlKey && (e.preventDefault(), this.zoom = Math.max(.3, Math.min(1.6, +(this.zoom - Math.sign(e.deltaY) * .05).toFixed(2))));
		}}
    >
      ${e.pages.map((o, s) => {
			let l = Re(o), u = i && i.mode === "move" ? new Set(i.ids) : /* @__PURE__ */ new Set();
			return c`<div class="page-col ${o.id === this.page?.id ? "active" : ""}" data-col=${o.id}>
          <div class="page-label" @click=${() => this.activePage = o.id} @dblclick=${() => this.renamePage(o)}>
            <span class="num">${s + 1}</span> ${o.name}
            ${e.settings.home_page === o.id ? c`<span class="chip">★ Start</span>` : a}
            <span class="muted small">${o.cols}×${o.rows}</span>
          </div>
          <div class="canvas-wrap" style="width:${480 * r}px;height:${480 * r}px">
            <div
              class="screen canvas ${i ? "dragging" : ""} ${e.settings.tile_depth ?? !0 ? "d3" : ""}"
              data-page=${o.id}
              style="transform:scale(${r});background:${t.header_bg}"
              @pointerdown=${() => {
				this.activePage = o.id, this.selection = [];
			}}
            >
              ${e.settings.show_header ? c`<div class="s-header" style="color:${t.header_text}">
                    <span class="name">${o.name}</span><span>${(/* @__PURE__ */ new Date()).toLocaleTimeString("de-DE", {
				hour: "2-digit",
				minute: "2-digit"
			})}</span>
                    <span style="color:${t.ok};font-size:15px">📶</span><span style="color:${t.ok};font-size:16px">⌂</span>
                  </div>` : a}
              <div class="s-page" style="top:${n.top}px;height:${n.height}px;background:${o.background ?? t.page_bg}">
                ${this.showGrid || i ? l.flatMap((e, t) => e.map((e, r) => {
				let a = S(o, n, r, t, 1, 1);
				return c`<div class="cell ${e ? "occ" : "free"} ${i ? "show" : ""}" style="left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px"></div>`;
			})) : a}
                ${je(o.tiles, (e) => e.id, (e) => {
				let r = S(o, n, e.x, e.y, e.w, e.h), i = this.selection.includes(e.id) && o.id === this.page?.id, s = Xe(e) && !e.entity, l = e.visibility.length > 0 && !me(this.hass, e);
				return c`<div
                      class=${d({
					tile: !0,
					selected: i,
					lifted: u.has(e.id),
					hiddenNow: l
				})}
                      style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"
                      title=${e.entity ?? e.title}
                      @pointerdown=${(t) => this.startTileDrag(t, o, e)}
                      @dblclick=${() => this.propsOpen = !0}
                    >
                      ${be(e, t, this.hass, r.w, r.h)}
                      ${s ? c`<div class="badge" title="Keine Entität zugeordnet">⚠ Entität fehlt</div>` : a}
                      ${l ? c`<div class="badge info" title="Zurzeit durch Sichtbarkeitsbedingung ausgeblendet">ausgeblendet</div>` : a}
                      ${i && this.selection.length === 1 ? c`<div class="resize" title="Größe ändern" @pointerdown=${(t) => this.startResize(t, o, e)}></div>` : a}
                    </div>`;
			})}
                ${i?.target && i.target.page === o.id ? this.renderDropPreview(o, i) : a}
              </div>
              ${n.bottom ? c`<div class="s-dots">${e.pages.map((e, n) => c`<span style="background:${n === s ? t.accent : t.muted}"></span>`)}</div>` : a}
            </div>
          </div>
        </div>`;
		})}
      ${e.pages.length < 10 ? c`<button class="add-page" style="height:${480 * r}px" @click=${() => {
			let t = We(e);
			t && (this.commit(t.layout), this.activePage = t.id);
		}}>＋<br />Seite hinzufügen</button>` : a}
    </div>`;
	}
	renderDropPreview(e, t) {
		let n = this.layout, r = x(n.settings, n.pages.length), i = t.target, a = [i];
		if (t.mode === "move" && t.sourcePage) {
			let e = n.pages.find((e) => e.id === t.sourcePage), r = e.tiles.find((e) => e.id === t.anchorId);
			a = e.tiles.filter((e) => t.ids.includes(e.id)).map((e) => ({
				x: e.x - r.x + i.x,
				y: e.y - r.y + i.y,
				w: e.w,
				h: e.h
			}));
		}
		return a.filter((t) => Fe(e, t.x, t.y, t.w, t.h)).map((n) => {
			let i = S(e, r, n.x, n.y, n.w, n.h);
			return c`<div class="drop ${t.valid ? "valid" : "invalid"}" style="left:${i.x}px;top:${i.y}px;width:${i.w}px;height:${i.h}px"></div>`;
		});
	}
	renderLibrary() {
		let e = it(this.libraryEntries, this.search, this.category, this.favorites), t = this.systemItems().filter((e) => (this.category === "all" || this.category === e.category) && e.label.toLowerCase().includes(this.search.toLowerCase())), n = this.category === "all" || this.category === "navigation" || this.category === "system";
		return c`<section class="library" aria-label="Elementbibliothek">
      <div class="lib-head">
        <button class="ghost" @click=${() => this.libraryOpen = !this.libraryOpen} title="Bibliothek ein-/ausklappen">${this.libraryOpen ? "▾" : "▸"} Elemente</button>
        <input
          type="search"
          placeholder="Suchen nach Name, Entity-ID, Gerät, Bereich oder Domain …"
          .value=${this.search}
          @input=${(e) => this.search = e.target.value}
          @focus=${() => this.libraryOpen = !0}
        />
        <span class="muted small">${e.length + (n ? t.length : 0)} Treffer</span>
      </div>
      ${this.libraryOpen ? c`<div class="cats" role="tablist">
              ${Qe.map((e) => c`<button role="tab" aria-selected=${this.category === e.key} class="cat ${this.category === e.key ? "active" : ""}" @click=${() => this.category = e.key}>
                  ${_e(e.icon, "")} ${e.label}
                </button>`)}
            </div>
            <div class="items">
              ${n ? t.map((e) => c`<div
                      class="item system"
                      tabindex="0"
                      title="Ziehen oder klicken zum Hinzufügen"
                      @pointerdown=${(t) => this.startNewDrag(t, () => e.make(this.layout), e.label)}
                      @keydown=${(t) => t.key === "Enter" && this.addToActivePage(e.make(this.layout))}
                    >
                      <span class="ic">${_e(e.icon, e.glyph)}</span>
                      <span class="nm">${e.label}</span>
                      <span class="sub">${e.category === "navigation" ? "Navigation" : "System"}</span>
                    </div>`) : a}
              ${e.slice(0, 300).map((e) => c`<div
                  class="item ${e.state === "unavailable" ? "unavail" : ""}"
                  tabindex="0"
                  title="${e.entity_id} – ziehen oder Enter zum Hinzufügen"
                  @pointerdown=${(t) => {
			t.target.closest(".fav") || this.startNewDrag(t, () => H(this.hass, e.entity_id), e.name);
		}}
                  @keydown=${(t) => t.key === "Enter" && this.addToActivePage(H(this.hass, e.entity_id))}
                >
                  <button class="fav ghost" title="Favorit" @click=${() => this.toggleFavorite(e.entity_id)}>${this.favorites.includes(e.entity_id) ? "★" : "☆"}</button>
                  <span class="nm">${e.name}</span>
                  <span class="sub">${e.area || e.domain} · ${e.state === "unavailable" ? "nicht verfügbar" : e.state}</span>
                  <span class="eid">${e.entity_id}</span>
                </div>`)}
              ${e.length > 300 ? c`<div class="muted small more">… weitere ${e.length - 300} – bitte Suche verfeinern</div>` : a}
              ${!e.length && !(n && t.length) ? c`<div class="muted more">Keine passenden Elemente gefunden.</div>` : a}
            </div>` : a}
    </section>`;
	}
	renderProps() {
		let e = this.layout, t = this.page, n = this.selectedTiles;
		return c`<aside class="props">
      <button class="icon ghost close-props" @click=${() => this.propsOpen = !1} title="Schließen">✕</button>
      ${n.length === 1 ? c`<gs-tile-props
            .hass=${this.hass}
            .info=${this.info}
            .layout=${e}
            .page=${t}
            .tile=${n[0]}
            @gs-patch=${(r) => this.commit(Ve(e, t.id, n[0].id, r.detail))}
            @gs-geometry=${(r) => {
			let i = r.detail, a = n[0], o = B(e, t.id, [a.id], a.id, t.id, i.x, i.y);
			o.ok && (i.w !== a.w || i.h !== a.h) && (o = ze(o.layout, t.id, a.id, i.w, i.h)), o.ok ? this.commit(o.layout) : k(this, o.reason ?? "Nicht möglich");
		}}
            @gs-delete=${() => this.deleteSelection()}
            @gs-duplicate=${() => this.duplicateSelection()}
          ></gs-tile-props>` : n.length > 1 ? c`<h2>${n.length} Kacheln ausgewählt</h2>
              <p class="muted">Gemeinsam verschieben: ziehen oder Pfeiltasten. Mit Bild↑/Bild↓ auf andere Seiten verschieben.</p>
              <div class="row">
                <button @click=${() => this.duplicateSelection()}>⊕ Duplizieren</button>
                <button @click=${() => this.copySelection()}>⧉ Kopieren</button>
                <button class="danger" @click=${() => this.deleteSelection()}>🗑 Löschen</button>
              </div>` : c`<div class="tabs" role="tablist">
              <button role="tab" aria-selected=${this.propsTab === "page"} class=${this.propsTab === "page" ? "active" : ""} @click=${() => this.propsTab = "page"}>Seite</button>
              <button role="tab" aria-selected=${this.propsTab === "auto"} class=${this.propsTab === "auto" ? "active" : ""} @click=${() => this.propsTab = "auto"}>Automatik</button>
            </div>
            ${this.propsTab === "auto" ? c`<gs-automation-props .hass=${this.hass} .api=${this.api} .layout=${e} @gs-commit=${(e) => this.commit(e.detail)}></gs-automation-props>` : c`<gs-page-props
                  .info=${this.info}
                  .layout=${e}
                  .page=${t}
                  @gs-commit=${(e) => this.commit(e.detail)}
                ></gs-page-props>`}
            <div class="notice small" style="margin-top:16px">
              <b>So geht's:</b> Ziehe Entitäten aus der Bibliothek unten auf eine Seite. Kacheln verschieben per Drag-and-Drop – auch zwischen Seiten.
              Ecke unten rechts zieht die Größe. Tastatur: Tab wählt Kacheln, Pfeile verschieben, Umschalt+Pfeile ändern die Größe, Entf löscht.
            </div>
            ${this.validation && !this.validation.valid ? c`<div class="notice warn small"><b>Vor dem Übertragen beheben:</b><ul>${this.validation.errors.slice(0, 8).map((e) => c`<li>${e}</li>`)}</ul></div>` : a}`}
    </aside>`;
	}
	renderApplying() {
		let e = this.applying, t = e.state === "error" ? "Übertragung fehlgeschlagen" : e.state === "done" ? "Übertragen und vom Display bestätigt" : e.state === "confirming" ? "Warte auf Bestätigung des Displays …" : "Layout wird übertragen …";
		return c`<div class="apply-toast card ${e.state}">
      <div class="row"><b>${t}</b><span class="spacer"></span>${e.state === "error" || e.state === "done" ? c`<button class="icon ghost" @click=${() => this.applying = null}>✕</button>` : c`<span class="spinner"></span>`}</div>
      ${e.state === "error" ? a : c`<div class="progress"><div style="width:${e.progress}%"></div></div>`}
      ${e.error ? c`<p class="small" style="margin-top:8px">${e.error}</p>
            <p class="small muted">Das zuletzt funktionierende Layout bleibt auf dem Display aktiv. Prüfe unter „Diagnose“, ob das Display online ist.</p>
            <button @click=${() => this.apply()}>Erneut versuchen</button>` : a}
    </div>`;
	}
}, Dt.styles = [
	T,
	xe,
	r`
      :host {
        display: block;
        height: calc(100vh - 56px);
        outline: none;
      }
      .empty {
        max-width: 520px;
        margin: 60px auto;
      }
      .designer {
        display: grid;
        grid-template-columns: 250px minmax(0, 1fr) 330px;
        grid-template-rows: auto minmax(0, 1fr) auto;
        grid-template-areas: "side tool props" "side work props" "side lib props";
        height: 100%;
      }
      .sidebar {
        grid-area: side;
        border-right: 1px solid var(--gs-border);
        background: var(--gs-surface);
        padding: 14px;
        overflow-y: auto;
      }
      .toolbar {
        grid-area: tool;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        border-bottom: 1px solid var(--gs-border);
        background: var(--gs-surface);
        flex-wrap: wrap;
      }
      .toolbar .sep {
        width: 1px;
        height: 24px;
        background: var(--gs-border);
        margin: 0 4px;
      }
      .toolbar .zoom {
        min-width: 64px;
      }
      .toolbar .toggled {
        background: color-mix(in srgb, var(--gs-primary) 15%, transparent);
        border-color: var(--gs-primary);
        color: var(--gs-primary);
      }
      .props-toggle {
        display: none;
      }
      .workspace {
        grid-area: work;
        overflow: auto;
        display: flex;
        gap: 28px;
        padding: 20px 28px;
        align-items: flex-start;
        background: repeating-conic-gradient(var(--gs-bg) 0% 25%, color-mix(in srgb, var(--gs-surface-2) 60%, var(--gs-bg)) 0% 50%) 0 0 / 24px 24px;
      }
      .page-col {
        flex-shrink: 0;
        opacity: 0.88;
        transition: opacity 0.15s;
      }
      .page-col.active {
        opacity: 1;
      }
      .page-label {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        font-weight: 600;
        cursor: pointer;
      }
      .page-label .num {
        display: grid;
        place-items: center;
        width: 22px;
        height: 22px;
        border-radius: 6px;
        background: var(--gs-surface-2);
        font-size: 12px;
      }
      .page-col.active .num {
        background: var(--gs-primary);
        color: var(--gs-on-primary);
      }
      .canvas-wrap {
        position: relative;
        border-radius: 10px;
        box-shadow: 0 0 0 10px #111, 0 10px 30px rgba(0, 0, 0, 0.35);
      }
      .page-col.active .canvas-wrap {
        box-shadow: 0 0 0 10px #111, 0 0 0 13px var(--gs-primary), 0 10px 30px rgba(0, 0, 0, 0.35);
      }
      .canvas {
        position: absolute;
        left: 0;
        top: 0;
        transform-origin: 0 0;
        touch-action: none;
      }
      .cell {
        position: absolute;
        border-radius: 12px;
        border: 1px dashed rgba(128, 128, 128, 0.35);
        pointer-events: none;
      }
      .cell.occ {
        border-color: transparent;
      }
      .cell.free.show {
        border-color: color-mix(in srgb, var(--gs-primary) 60%, transparent);
        background: color-mix(in srgb, var(--gs-primary) 6%, transparent);
      }
      .tile {
        cursor: grab;
        touch-action: none;
        border-radius: 16px;
      }
      .tile:hover {
        outline: 2px solid color-mix(in srgb, var(--gs-primary) 50%, transparent);
        outline-offset: 2px;
      }
      .tile.selected {
        outline: 3px solid var(--gs-primary);
        outline-offset: 3px;
        z-index: 2;
      }
      .tile.lifted {
        opacity: 0.35;
      }
      .tile.hiddenNow > .t-inner {
        opacity: 0.35 !important;
      }
      .badge {
        position: absolute;
        left: 6px;
        top: 6px;
        background: var(--gs-accent);
        color: #111;
        font-size: 11px;
        font-weight: 600;
        padding: 2px 6px;
        border-radius: 6px;
        pointer-events: none;
      }
      .badge.info {
        background: #64748b;
        color: #fff;
        top: auto;
        bottom: 6px;
      }
      .resize {
        position: absolute;
        right: -8px;
        bottom: -8px;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: var(--gs-primary);
        border: 3px solid #fff;
        cursor: nwse-resize;
        touch-action: none;
        z-index: 3;
      }
      .drop {
        position: absolute;
        border-radius: 16px;
        pointer-events: none;
        z-index: 5;
        border: 3px solid;
      }
      .drop.valid {
        border-color: var(--gs-ok);
        background: color-mix(in srgb, var(--gs-ok) 25%, transparent);
      }
      .drop.invalid {
        border-color: var(--gs-error);
        background: color-mix(in srgb, var(--gs-error) 25%, transparent);
      }
      .add-page {
        flex-shrink: 0;
        width: 160px;
        margin-top: 30px;
        border: 2px dashed var(--gs-border);
        background: transparent;
        color: var(--gs-muted);
        flex-direction: column;
        font-size: 15px;
      }
      .pages {
        list-style: none;
        padding: 0;
        margin: 0 0 8px;
      }
      .pages li {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 8px;
        border-radius: 10px;
        cursor: pointer;
        margin-bottom: 2px;
      }
      .pages li:hover {
        background: var(--gs-surface-2);
      }
      .pages li.active {
        background: color-mix(in srgb, var(--gs-primary) 14%, transparent);
        color: var(--gs-primary);
        font-weight: 600;
      }
      .pname {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .drag-handle {
        cursor: grab;
        color: var(--gs-muted);
        font-size: 12px;
      }
      button.tiny {
        width: 26px;
        min-height: 26px;
        color: var(--gs-muted);
      }
      button.tiny.home {
        color: var(--gs-accent);
      }
      .page-actions {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
        margin-bottom: 16px;
      }
      .page-actions button {
        padding: 0 10px;
      }
      details.settings summary {
        cursor: pointer;
        margin-bottom: 10px;
      }
      .library {
        grid-area: lib;
        border-top: 1px solid var(--gs-border);
        background: var(--gs-surface);
        display: flex;
        flex-direction: column;
        max-height: 270px;
      }
      .lib-head {
        display: flex;
        gap: 10px;
        align-items: center;
        padding: 8px 12px;
      }
      .lib-head input {
        max-width: 520px;
      }
      .cats {
        display: flex;
        gap: 6px;
        padding: 0 12px 8px;
        overflow-x: auto;
        flex-shrink: 0;
      }
      .cat {
        min-height: 30px;
        padding: 0 10px;
        font-size: 12px;
        border-radius: 999px;
      }
      .cat.active {
        background: var(--gs-primary);
        color: var(--gs-on-primary);
        border-color: var(--gs-primary);
      }
      .cat ha-icon {
        --mdc-icon-size: 16px;
      }
      .items {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
        gap: 8px;
        padding: 0 12px 12px;
        overflow-y: auto;
      }
      .item {
        position: relative;
        display: grid;
        gap: 2px;
        padding: 8px 10px 8px 34px;
        border: 1px solid var(--gs-border);
        border-radius: 10px;
        background: var(--gs-surface);
        cursor: grab;
        touch-action: none;
        user-select: none;
      }
      .item:hover {
        border-color: var(--gs-primary);
      }
      .item.unavail {
        opacity: 0.6;
      }
      .item .nm {
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .item .sub,
      .item .eid {
        font-size: 11px;
        color: var(--gs-muted);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .item .fav,
      .item .ic {
        position: absolute;
        left: 4px;
        top: 6px;
        width: 26px;
        min-height: 26px;
        padding: 0;
        color: var(--gs-accent);
        display: grid;
        place-items: center;
      }
      .item .ic {
        color: var(--gs-primary);
      }
      .more {
        padding: 10px;
      }
      .props {
        grid-area: props;
        border-left: 1px solid var(--gs-border);
        background: var(--gs-surface);
        padding: 16px;
        overflow-y: auto;
        position: relative;
      }
      .tabs {
        display: flex;
        gap: 4px;
        margin: 0 36px 14px 0;
        background: var(--gs-surface-2);
        border-radius: 12px;
        padding: 4px;
      }
      .tabs button {
        flex: 1;
        border: none;
        background: transparent;
        min-height: 32px;
      }
      .tabs button.active {
        background: var(--gs-surface);
        box-shadow: var(--gs-shadow);
        font-weight: 600;
      }
      .close-props {
        display: none;
        position: absolute;
        right: 8px;
        top: 8px;
      }
      .ghost {
        position: fixed;
        z-index: 50;
        pointer-events: none;
        padding: 8px 12px;
        border-radius: 10px;
        background: var(--gs-primary);
        color: var(--gs-on-primary);
        font-weight: 600;
        box-shadow: var(--gs-shadow);
      }
      .ghost.invalid {
        background: #64748b;
      }
      .apply-toast {
        position: fixed;
        right: 24px;
        bottom: 24px;
        width: 360px;
        z-index: 60;
      }
      .apply-toast.error {
        border-left: 4px solid var(--gs-error);
      }
      .apply-toast.done {
        border-left: 4px solid var(--gs-ok);
      }
      .apply-toast .progress {
        margin-top: 10px;
      }
      @media (max-width: 1250px) {
        .designer {
          grid-template-columns: 220px minmax(0, 1fr);
          grid-template-areas: "side tool" "side work" "side lib";
        }
        .props {
          position: fixed;
          right: 0;
          top: 56px;
          bottom: 0;
          width: min(360px, 92vw);
          z-index: 40;
          transform: translateX(100%);
          transition: transform 0.2s;
          box-shadow: var(--gs-shadow);
        }
        .props-open .props {
          transform: none;
        }
        .props-toggle,
        .close-props {
          display: inline-flex;
        }
      }
      @media (max-width: 800px) {
        .designer {
          grid-template-columns: minmax(0, 1fr);
          grid-template-areas: "tool" "work" "lib" "side";
          height: auto;
        }
        .workspace {
          min-height: 420px;
        }
      }
    `
], Dt);
M([s({ attribute: !1 })], J.prototype, "hass", void 0), M([s({ attribute: !1 })], J.prototype, "api", void 0), M([s({ attribute: !1 })], J.prototype, "info", void 0), M([s({ attribute: !1 })], J.prototype, "displays", void 0), M([s({ attribute: !1 })], J.prototype, "displayId", void 0), M([e()], J.prototype, "layout", void 0), M([e()], J.prototype, "activePage", void 0), M([e()], J.prototype, "selection", void 0), M([e()], J.prototype, "zoom", void 0), M([e()], J.prototype, "showGrid", void 0), M([e()], J.prototype, "multi", void 0), M([e()], J.prototype, "drag", void 0), M([e()], J.prototype, "saveState", void 0), M([e()], J.prototype, "validation", void 0), M([e()], J.prototype, "applying", void 0), M([e()], J.prototype, "search", void 0), M([e()], J.prototype, "category", void 0), M([e()], J.prototype, "favorites", void 0), M([e()], J.prototype, "libraryOpen", void 0), M([e()], J.prototype, "propsOpen", void 0), M([e()], J.prototype, "loading", void 0), M([e()], J.prototype, "loadError", void 0), M([e()], J.prototype, "pageDragIndex", void 0), M([e()], J.prototype, "propsTab", void 0), J = M([u("gs-designer")], J);
// src/views/firmware.ts
var Ot;
function kt(e, t) {
	let n = e.split(/[.-]/).map((e) => parseInt(e, 10) || 0), r = t.split(/[.-]/).map((e) => parseInt(e, 10) || 0);
	for (let e = 0; e < Math.max(n.length, r.length); e++) if ((n[e] ?? 0) !== (r[e] ?? 0)) return (n[e] ?? 0) - (r[e] ?? 0);
	return 0;
}
var Y = (Ot = class extends N {
	constructor(...e) {
		super(...e), this.status = null, this.busy = null, this.target = {}, this.showUsb = !1;
	}
	connectedCallback() {
		super.connectedCallback(), this.load();
	}
	async load() {
		try {
			this.status = await this.api.firmwareStatus();
		} catch (e) {
			k(this, y(e), "error");
		}
	}
	async check() {
		this.busy = "check";
		try {
			let e = await this.api.firmwareCheck();
			e.error && k(this, e.error, "error"), await this.load();
		} finally {
			this.busy = null;
		}
	}
	async download(e) {
		this.busy = "download";
		try {
			await this.api.firmwareDownload(e), k(this, `Firmware ${e} heruntergeladen und SHA-256 geprüft ✓`, "ok"), await this.load();
		} catch (e) {
			k(this, y(e), "error");
		} finally {
			this.busy = null;
		}
	}
	async ota(e, t) {
		if (await O(this, {
			title: `Firmware ${t} installieren?`,
			text: `„${e.name}“ lädt die Firmware über WLAN von Home Assistant und startet neu (ca. 1–2 Minuten).\n\nDas Display während des Updates nicht vom Strom trennen. Schlägt das Update fehl, bleibt die bisherige Firmware aktiv; im schlimmsten Fall ist eine Neuinstallation per USB möglich (siehe Wiederherstellung).`,
			confirm: "Update starten",
			danger: !0
		})) {
			this.busy = e.id;
			try {
				await this.api.firmwareOta(e.id, t), k(this, "Update gestartet – Fortschritt siehe unten", "ok"), this.refreshAll();
			} catch (e) {
				k(this, y(e), "error");
			} finally {
				this.busy = null;
			}
		}
	}
	render() {
		let e = this.status, t = e?.local.filter((e) => e.ota && e.verified !== !1) ?? [], n = e?.latest, r = n && e?.local.some((e) => e.version === n.version);
		return c`
      <div class="page-head"><h1>Firmware-Manager</h1><span class="spacer"></span><button ?disabled=${this.busy === "check"} @click=${() => this.check()}>${this.busy === "check" ? c`<span class="spinner"></span>` : "↻"} Nach Updates suchen</button></div>
      <section class="grid">
        <div class="card">
          <h2>Neueste Veröffentlichung</h2>
          ${n ? c`<p><b>${n.version}</b> <span class="muted small">${n.published ? new Date(n.published).toLocaleDateString("de-DE") : ""}</span></p>
                ${n.complete ? a : c`<div class="notice warn small">Release enthält nicht alle benötigten Dateien.</div>`}
                <details><summary class="small">Änderungen</summary><pre class="notes">${n.notes || "–"}</pre></details>
                <div class="row" style="margin-top:8px">
                  ${r ? c`<span class="chip ok">✓ heruntergeladen</span>` : c`<button class="primary" ?disabled=${!n.complete || this.busy === "download"} @click=${() => this.download(n.version)}>
                        ${this.busy === "download" ? c`<span class="spinner"></span>` : "⇩"} Herunterladen & prüfen
                      </button>`}
                  <a class="btn" href=${n.url} target="_blank" rel="noopener">Release ↗</a>
                </div>` : c`<p class="muted">${e?.error ?? "Noch nicht geprüft. Klicke auf „Nach Updates suchen“."}</p>`}
          <p class="small muted">Quelle: <code>${e?.repo ?? this.info.firmware_repo}</code></p>
        </div>
        <div class="card">
          <h2>In Home Assistant verfügbar</h2>
          ${e?.local.length ? c`<table class="small">
                <tr><th>Version</th><th>Quelle</th><th>OTA-Größe</th><th>Prüfung</th></tr>
                ${e.local.map((e) => c`<tr><td><b>${e.version}</b></td><td>${e.source === "release" ? "GitHub-Release" : "Lokal"}</td><td>${j(e.ota_size)}</td>
                    <td>${e.verified ? c`<span class="chip ok">SHA-256 ✓</span>` : e.verified === !1 ? c`<span class="chip error">fehlerhaft</span>` : c`<span class="chip">ohne Prüfsumme</span>`}</td></tr>`)}
              </table>` : c`<p class="muted">Keine Firmware vorhanden.</p>`}
          <p class="small muted">Ablageort: <code>${e?.path ?? "…"}</code></p>
        </div>
      </section>

      <section class="card">
        <h2>Displays aktualisieren (OTA)</h2>
        ${this.displays.length === 0 ? c`<p class="muted">Keine Displays.</p>` : a}
        <table>
          <tr><th>Display</th><th>Installiert</th><th>Status</th><th>Zielversion</th><th></th></tr>
          ${this.displays.map((e) => {
			let n = this.target[e.id] ?? t[0]?.version ?? "", r = e.firmware && n ? kt(n, e.firmware) > 0 : !1, i = e.ota?.state && e.ota.state !== "idle" ? e.ota : null;
			return c`<tr>
              <td><b>${e.name}</b></td>
              <td>${e.firmware ?? "–"}</td>
              <td>
                ${i ? i.state === "error" ? c`<span class="chip error">Update fehlgeschlagen</span>` : c`<div class="progress" style="width:140px"><div style="width:${i.progress}%"></div></div><span class="small muted">${i.state} ${i.progress}%</span>` : c`<span class="chip ${e.online ? "ok" : "error"}">${e.online ? "online" : "offline"}</span>`}
              </td>
              <td>
                <select .value=${n} @change=${(t) => this.target = {
				...this.target,
				[e.id]: t.target.value
			}} ?disabled=${!t.length}>
                  ${t.map((e) => c`<option value=${e.version} ?selected=${e.version === n}>${e.version}</option>`)}
                </select>
              </td>
              <td>
                <button class=${r ? "primary" : ""} ?disabled=${!e.online || !n || this.busy === e.id} @click=${() => this.ota(e, n)}>
                  ${r ? "Update installieren" : "Erneut installieren"}
                </button>
              </td>
            </tr>`;
		})}
        </table>
        <p class="small muted">OTA läuft ausschließlich über die verschlüsselte ESPHome-Verbindung: Home Assistant teilt dem Display die Download-Adresse und MD5-Prüfsumme mit; ein offener OTA-Port existiert nicht.</p>
      </section>

      <section class="card">
        <div class="row"><h2 style="margin:0">Installation per USB</h2><span class="spacer"></span><button @click=${() => this.showUsb = !this.showUsb}>${this.showUsb ? "Ausblenden" : "Anzeigen"}</button></div>
        ${this.showUsb ? c`<gs-usb-installer .api=${this.api} .firmwareUrl=${this.info.firmware_url} .installerUrl=${this.info.installer_url}></gs-usb-installer>` : c`<p class="muted small">Für Erstinstallation oder Wiederherstellung.</p>`}
      </section>

      <section class="card">
        <h2>Wiederherstellung nach fehlgeschlagenem Update</h2>
        <ol class="small" style="line-height:1.8">
          <li>Das ESP32-S3 nutzt zwei App-Partitionen: Ein abgebrochenes OTA-Update wird nicht aktiviert, die alte Firmware startet weiter.</li>
          <li>Startet das Display nicht mehr: per USB verbinden, oben „Installation per USB“ öffnen und die Firmware neu installieren.</li>
          <li>Wird kein Port erkannt: BOOT-Taste halten, RESET kurz drücken, BOOT loslassen – das Board ist dann im ROM-Bootloader und immer flashbar.</li>
          <li>Layouts liegen in Home Assistant. Nach der Neuinstallation überträgt Guition Studio das zuletzt bestätigte Layout automatisch wieder.</li>
        </ol>
      </section>
    `;
	}
}, Ot.styles = [...N.styles, r`
      .notes {
        white-space: pre-wrap;
        font-size: 12px;
        max-height: 200px;
        overflow: auto;
      }
      td select {
        min-width: 110px;
      }
    `], Ot);
M([e()], Y.prototype, "status", void 0), M([e()], Y.prototype, "busy", void 0), M([e()], Y.prototype, "target", void 0), M([e()], Y.prototype, "showUsb", void 0), Y = M([u("gs-firmware")], Y);
// src/views/templates.ts
var At;
function jt(e) {
	let t = L(e), n = /* @__PURE__ */ new Map();
	for (let e of t.pages) {
		let t = I("p");
		n.set(e.id, t), e.id = t;
		for (let t of e.tiles) t.id = I("t");
	}
	for (let e of t.pages) for (let t of e.tiles) for (let e of ["tap_action", "hold_action"]) t[e].action === "navigate" && t[e].page && (t[e].page = n.get(t[e].page) ?? t[e].page);
	return t.settings.home_page && (t.settings.home_page = n.get(t.settings.home_page) ?? t.pages[0]?.id ?? null), t;
}
var X = (At = class extends N {
	constructor(...e) {
		super(...e), this.displayId = null, this.target = null, this.area = "";
	}
	get targetId() {
		return this.target ?? this.displayId ?? this.displays[0]?.id ?? null;
	}
	async useTemplate(e) {
		let t = this.targetId, n = this.displays.find((e) => e.id === t);
		if (!t || !n) k(this, "Bitte zuerst ein Display anlegen.", "error");
		else if (await O(this, {
			title: `Vorlage „${e.name}“ übernehmen?`,
			text: `Der aktuelle Entwurf von „${n.name}“ wird ersetzt. Das Layout auf dem Display ändert sich erst beim Übertragen.`,
			confirm: "Übernehmen"
		})) try {
			let n = await this.api.getLayout(t), r = jt(e.layout);
			r.revision = n.layout.revision, await this.api.saveLayout(t, r), k(this, "Vorlage übernommen – Kacheln ohne Entität sind markiert.", "ok"), this.go("designer", t);
		} catch (e) {
			k(this, y(e), "error");
		}
	}
	async saveAsTemplate() {
		let e = this.targetId;
		if (!e) return;
		let t = await ve(this, "Als Vorlage speichern", "Meine Vorlage", "Name der Vorlage");
		if (!t) return;
		let n = await this.api.getLayout(e);
		await this.api.saveTemplate(t, `Gespeichert am ${(/* @__PURE__ */ new Date()).toLocaleDateString("de-DE")}`, n.layout), D(this, "gs-info-changed"), k(this, "Vorlage gespeichert", "ok");
	}
	async deleteTemplate(e) {
		await O(this, {
			title: "Vorlage löschen?",
			text: `„${e.name}“ wird gelöscht.`,
			confirm: "Löschen",
			danger: !0
		}) && (await this.api.deleteTemplate(e.id), D(this, "gs-info-changed"));
	}
	async exportLayout() {
		let e = this.targetId;
		if (!e) return;
		let t = await this.api.getLayout(e);
		b(`guition-layout-${(this.displays.find((t) => t.id === e)?.name ?? "display").replace(/\W+/g, "_")}.json`, {
			format: "guition-studio-layout",
			version: 1,
			layout: t.layout
		});
	}
	async importLayout() {
		let e = this.targetId;
		if (e) try {
			let t = await ee(), n = t.format === "guition-studio-layout" ? t.layout : t;
			if (!n || !Array.isArray(n.pages)) throw Error("Die Datei enthält kein Guition-Studio-Layout.");
			let r = await this.api.validate(n);
			if (!await O(this, {
				title: "Layout importieren?",
				text: `${n.pages.length} Seite(n). ${r.valid ? "Das Layout ist gültig." : `Hinweise: ${r.errors.slice(0, 3).join(" ")}`}\nDer aktuelle Entwurf wird ersetzt.`,
				confirm: "Importieren"
			})) return;
			let i = await this.api.getLayout(e), a = jt(n);
			a.revision = i.layout.revision, await this.api.saveLayout(e, a), k(this, "Layout importiert", "ok"), this.go("designer", e);
		} catch (e) {
			k(this, y(e), "error");
		}
	}
	async backup() {
		let e = await this.api.exportBackup();
		b(`guition-studio-backup-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`, e);
	}
	async restore() {
		try {
			let e = await ee();
			if (!await O(this, {
				title: "Sicherung wiederherstellen?",
				text: "Alle Displays, Layouts, eigenen Vorlagen und Favoriten in Guition Studio werden durch die Sicherung ersetzt.",
				confirm: "Wiederherstellen",
				danger: !0
			})) return;
			let t = await this.api.restoreBackup(e);
			k(this, `Sicherung mit ${t.displays} Display(s) wiederhergestellt`, "ok"), D(this, "gs-info-changed"), this.refreshAll();
		} catch (e) {
			k(this, y(e), "error");
		}
	}
	async suggestFromArea() {
		let e = this.targetId;
		if (!e || !this.area) return;
		let t = rt(this.hass).filter((e) => e.area === this.area && e.state !== "unavailable"), n = (e) => t.filter((t) => e.includes(t.category)), r = [
			n(["light"]).map((e) => H(this.hass, e.entity_id)),
			n([
				"switch",
				"outlet",
				"cover",
				"climate"
			]).map((e) => H(this.hass, e.entity_id)),
			t.filter((e) => e.category === "sensor" && [
				"temperature",
				"humidity",
				"power",
				"energy"
			].includes(this.hass.states[e.entity_id]?.attributes.device_class)).map((e) => H(this.hass, e.entity_id)),
			n(["scene", "script"]).map((e) => H(this.hass, e.entity_id))
		].flat();
		if (!r.length) {
			k(this, "In diesem Bereich wurden keine passenden Entitäten gefunden.", "error");
			return;
		}
		let i = [], a = null, o = Ne(this.area);
		o.tiles.push(R("clock", 0, 0, 2, 1), R("status", 2, 0, 1, 1, {
			title: "Status",
			tap_action: { action: "none" }
		})), i.push(o), a = o;
		for (let e of r) {
			let t = Le(a, 1, 1);
			if (!t) {
				if (i.length >= 10) break;
				a = Ne(`${this.area} ${i.length + 1}`), i.push(a), t = Le(a, 1, 1);
			}
			a.tiles.push({
				...e,
				...t
			});
		}
		let s = await this.api.getLayout(e), c = {
			...s.layout,
			pages: i,
			settings: {
				...s.layout.settings,
				home_page: i[0].id
			}
		};
		await O(this, {
			title: "Vorschlag übernehmen?",
			text: `${r.length} Entitäten aus „${this.area}“ auf ${i.length} Seite(n). Der aktuelle Entwurf wird ersetzt.`,
			confirm: "Übernehmen"
		}) && (await this.api.saveLayout(e, c), this.go("designer", e));
	}
	render() {
		let e = Object.values(this.hass.areas ?? {}).map((e) => e.name).sort((e, t) => e.localeCompare(t, "de"));
		return c`
      <div class="page-head">
        <h1>Vorlagen</h1><span class="spacer"></span>
        <label class="row small">Ziel-Display
          <select style="width:auto" @change=${(e) => this.target = e.target.value}>
            ${this.displays.map((e) => c`<option value=${e.id} ?selected=${e.id === this.targetId}>${e.name}</option>`)}
          </select>
        </label>
      </div>
      <div class="grid tpl-grid">
        ${this.info.templates.map((e) => {
			let t = e.layout.pages.find((t) => t.id === e.layout.settings.home_page) ?? e.layout.pages[0];
			return c`<div class="card tpl">
            <div class="thumb"><div class="scale">${Se(e.layout, t, this.info.themes)}</div></div>
            <div class="row"><h2 style="margin:8px 0 0">${e.name}</h2><span class="spacer"></span>${e.builtin ? c`<span class="chip">mitgeliefert</span>` : c`<span class="chip ok">eigene</span>`}</div>
            <p class="muted small">${e.description} · ${e.layout.pages.length} Seite(n) · ${this.info.themes[e.layout.settings.theme]?.name ?? ""}</p>
            <div class="row">
              <button class="primary" ?disabled=${!this.displays.length} @click=${() => this.useTemplate(e)}>Übernehmen</button>
              ${e.builtin ? a : c`<button class="danger" @click=${() => this.deleteTemplate(e)}>Löschen</button>`}
            </div>
          </div>`;
		})}
      </div>
      <section class="grid" style="margin-top:24px">
        <div class="card">
          <h2>Automatisches Dashboard</h2>
          <p class="small muted">Erstellt aus den Entitäten eines Bereichs ein Startlayout (Licht, Schalter, Klima-Sensoren, Szenen).</p>
          <div class="row">
            <select style="flex:1" @change=${(e) => this.area = e.target.value}>
              <option value="">Bereich wählen …</option>
              ${e.map((e) => c`<option ?selected=${e === this.area}>${e}</option>`)}
            </select>
            <button ?disabled=${!this.area || !this.displays.length} @click=${() => this.suggestFromArea()}>Vorschlagen</button>
          </div>
        </div>
        <div class="card">
          <h2>Eigene Layouts</h2>
          <div class="row">
            <button ?disabled=${!this.displays.length} @click=${() => this.saveAsTemplate()}>★ Als Vorlage speichern</button>
            <button ?disabled=${!this.displays.length} @click=${() => this.exportLayout()}>⇩ JSON-Export</button>
            <button ?disabled=${!this.displays.length} @click=${() => this.importLayout()}>⇧ JSON-Import</button>
          </div>
        </div>
        <div class="card">
          <h2>Sicherung</h2>
          <p class="small muted">Enthält alle Displays, Layouts, eigenen Vorlagen und Favoriten (keine Passwörter oder Schlüssel).</p>
          <div class="row"><button @click=${() => this.backup()}>⇩ Backup erstellen</button><button class="danger" @click=${() => this.restore()}>⇧ Backup wiederherstellen</button></div>
        </div>
      </section>
    `;
	}
}, At.styles = [
	...N.styles,
	xe,
	r`
      .tpl-grid {
        grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
      }
      .thumb {
        width: 192px;
        height: 192px;
        margin: 0 auto;
        overflow: hidden;
        border-radius: 10px;
        box-shadow: 0 0 0 5px #111;
      }
      .scale {
        transform: scale(0.4);
        transform-origin: 0 0;
        pointer-events: none;
      }
    `
], At);
M([s({ attribute: !1 })], X.prototype, "displayId", void 0), M([e()], X.prototype, "target", void 0), M([e()], X.prototype, "area", void 0), X = M([u("gs-templates")], X);
// src/views/settings.ts
var Mt = class extends N {
	constructor(...e) {
		super(...e), this.displayId = null, this.selected = null, this.layout = null, this.debug = !1, this.dirty = !1, this.busy = !1, this.loadedId = null;
	}
	get currentId() {
		return this.selected ?? this.displayId ?? this.displays[0]?.id ?? null;
	}
	connectedCallback() {
		super.connectedCallback(), this.api.log().then((e) => this.debug = e.debug).catch(() => void 0);
	}
	updated(e) {
		(e.has("displays") || e.has("selected") || e.has("displayId")) && this.currentId && (!this.layout || this.loadedId !== this.currentId) && this.load();
	}
	async load() {
		let e = this.currentId;
		e && (this.loadedId = e, this.layout = (await this.api.getLayout(e)).layout, this.dirty = !1);
	}
	set(e) {
		this.layout && (this.layout = {
			...this.layout,
			settings: {
				...this.layout.settings,
				...e
			}
		}, this.dirty = !0);
	}
	async save(e) {
		if (this.layout && this.currentId) {
			this.busy = !0;
			try {
				if (e) {
					let e = await this.api.apply(this.currentId, this.layout);
					this.layout = {
						...this.layout,
						revision: e.revision
					}, k(this, "Einstellungen auf dem Display übernommen ✓", "ok");
				} else await this.api.saveLayout(this.currentId, this.layout), k(this, "Als Entwurf gespeichert", "ok");
				this.dirty = !1, this.refreshAll();
			} catch (e) {
				k(this, y(e), "error");
			} finally {
				this.busy = !1;
			}
		}
	}
	async rename(e) {
		this.currentId && e.trim() && (await this.api.updateDisplay(this.currentId, { name: e.trim() }), this.refreshAll());
	}
	async setDebug(e) {
		await this.api.setDebug(e), this.debug = e;
	}
	render() {
		let e = this.displays.find((e) => e.id === this.currentId), t = this.layout?.settings;
		return c`
      <div class="page-head">
        <h1>Einstellungen</h1><span class="spacer"></span>
        ${this.displays.length ? c`<select style="width:auto" @change=${(e) => this.selected = e.target.value}>
              ${this.displays.map((e) => c`<option value=${e.id} ?selected=${e.id === this.currentId}>${e.name}</option>`)}
            </select>` : a}
      </div>
      ${!e || !t ? c`<div class="card"><p class="muted">Kein Display ausgewählt.</p></div>` : c`<div class="grid">
            <div class="card">
              <h2>Display</h2>
              <label class="field"><span>Displayname</span><input .value=${e.name} @change=${(e) => this.rename(e.target.value)} /></label>
              <table class="small">
                <tr><th>WLAN-/Verbindungsstatus</th><td><span class="chip ${e.online ? "ok" : "error"}">${e.online ? "verbunden" : "getrennt"}</span></td></tr>
                <tr><th>Firmwareversion</th><td>${e.firmware ?? "–"}</td></tr>
                <tr><th>Zuletzt gesehen</th><td>${A(e.last_seen)}</td></tr>
                <tr><th>Freier RAM / PSRAM</th><td>${e.heap == null ? "–" : `${Math.round(e.heap / 1024)} KB / ${Math.round((e.psram ?? 0) / 1024)} KB`}</td></tr>
              </table>
              <div class="row" style="margin-top:10px">
                <button ?disabled=${!e.online} @click=${() => this.api.command(e.id, "reboot").then(() => k(this, "Neustart ausgelöst", "ok"), (e) => k(this, y(e), "error"))}>⟳ Neustart</button>
                <button @click=${() => this.go("diagnostics")}>Diagnosedaten</button>
              </div>
            </div>
            <div class="card">
              <h2>Anzeige</h2>
              <label class="field"><span>Helligkeit: ${t.brightness} %</span><input type="range" min="5" max="100" .value=${String(t.brightness)} @input=${(e) => this.set({ brightness: +e.target.value })} /></label>
              <label class="field"><span>Standby-Helligkeit: ${t.standby_brightness} %</span><input type="range" min="0" max="100" .value=${String(t.standby_brightness)} @input=${(e) => this.set({ standby_brightness: +e.target.value })} /></label>
              <label class="field"><span>Bildschirm-Timeout (Sekunden, 0 = nie)</span><input type="number" min="0" max="86400" .value=${String(t.timeout)} @change=${(e) => this.set({ timeout: +e.target.value })} /></label>
              <label class="field"><span>Design</span>
                <select @change=${(e) => this.set({ theme: e.target.value })}>
                  ${Object.entries(this.info.themes).map(([e, n]) => c`<option value=${e} ?selected=${e === t.theme}>${n.name}${e === "modern_light" || e === "pastel" ? " (hell)" : " (dunkel)"}</option>`)}
                </select>
              </label>
              <label class="field"><span>Standardseite</span>
                <select @change=${(e) => this.set({ home_page: e.target.value })}>
                  ${this.layout.pages.map((e) => c`<option value=${e.id} ?selected=${e.id === t.home_page}>${e.name}</option>`)}
                </select>
              </label>
            </div>
            <div class="card">
              <h2>Bedienung</h2>
              <label class="check"><input type="checkbox" .checked=${t.swipe} @change=${(e) => this.set({ swipe: e.target.checked })} /> Seitenwechsel durch Wischen</label>
              <label class="check"><input type="checkbox" .checked=${t.show_dots} @change=${(e) => this.set({ show_dots: e.target.checked })} /> Seitenpunkte anzeigen</label>
              <label class="check"><input type="checkbox" .checked=${t.show_header} @change=${(e) => this.set({ show_header: e.target.checked })} /> Kopfzeile anzeigen</label>
              <label class="check"><input type="checkbox" .checked=${t.tile_depth ?? !0} @change=${(e) => this.set({ tile_depth: e.target.checked })} /> 3D-Kacheln (Schatten & Licht von oben)</label>
              <label class="field"><span>Sprache der Displaytexte</span>
                <select @change=${(e) => this.set({ language: e.target.value })}>
                  <option value="de" ?selected=${t.language === "de"}>Deutsch</option>
                  <option value="en" ?selected=${t.language === "en"}>English (nur Gerätetexte)</option>
                </select>
              </label>
              <label class="field"><span>Bildschirmdrehung</span>
                <select @change=${(e) => this.set({ rotation: +e.target.value })}>
                  ${[
			0,
			90,
			180,
			270
		].map((e) => c`<option value=${e} ?selected=${(t.rotation ?? 0) === e}>${e}°${e === 0 ? " (Standard, USB-Anschluss unten links)" : ""}</option>`)}
                </select>
              </label>
              <p class="small muted">Dreht Bild und Touch – praktisch, wenn das Display gedreht montiert ist. Auch direkt am Display im Einstellungsmenü änderbar (Firmware ≥ 0.5.2).</p>
              <label class="field"><span>Touch-Ausrichtung</span>
                <select @change=${(e) => this.set({ touch_mode: +e.target.value })}>
                  <option value="0" ?selected=${(t.touch_mode ?? 0) === 0}>Standard</option>
                  <option value="1" ?selected=${t.touch_mode === 1}>Um 180° gedreht (Tippen landet gegenüber)</option>
                  <option value="2" ?selected=${t.touch_mode === 2}>Links/rechts gespiegelt</option>
                  <option value="3" ?selected=${t.touch_mode === 3}>Oben/unten gespiegelt</option>
                </select>
              </label>
              <p class="small muted">Nur ändern, wenn Berührungen an der falschen Stelle ankommen (z. B. ✕ oben rechts löst etwas unten links aus). Wirkt sofort nach „Speichern & auf Display übernehmen“ (Firmware ≥ 0.5.3).</p>
            </div>
          </div>
          <div class="card auto-card">
            <h2>Bildschirmschoner, Diashow, Nachtmodus & Seitenwechsel</h2>
            <gs-automation-props
              .hass=${this.hass}
              .api=${this.api}
              .layout=${this.layout}
              @gs-commit=${(e) => {
			this.layout = e.detail, this.dirty = !0;
		}}
            ></gs-automation-props>
          </div>
          <div class="row actions">
            <span class="muted small">${this.dirty ? "Ungespeicherte Änderungen" : "Alle Änderungen gespeichert"}</span><span class="spacer"></span>
            <button ?disabled=${!this.dirty || this.busy} @click=${() => this.save(!1)}>Als Entwurf speichern</button>
            <button class="primary" ?disabled=${!e.linked || this.busy} @click=${() => this.save(!0)}>${this.busy ? c`<span class="spinner"></span>` : a} Speichern & auf Display übernehmen</button>
          </div>`}
      <section class="card" style="margin-top:24px">
        <h2>Guition Studio</h2>
        <label class="check"><input type="checkbox" .checked=${this.debug} @change=${(e) => this.setDebug(e.target.checked)} /> Debug-Modus (protokolliert Seitenwechsel und Zustandsübertragungen)</label>
        <p class="small muted">Firmware-Quelle: <code>${this.info.firmware_repo}</code> – änderbar unter Einstellungen → Geräte & Dienste → Guition Studio → Konfigurieren.<br />
        Oberflächensprache: Deutsch (weitere Sprachen geplant).</p>
        <p class="small support">Gefällt dir Guition Studio? Über <a href="https://paypal.me/sebagueven" target="_blank" rel="noopener">PayPal</a> kannst du mir einen Kaffee spendieren ☕ – danke!</p>
      </section>
    `;
	}
}, Z = (Mt.styles = [...N.styles, r`
      .actions {
        margin-top: 16px;
        position: sticky;
        bottom: 0;
        background: var(--gs-bg);
        padding: 10px 0;
      }
      .support a {
        color: var(--gs-primary);
        font-weight: 600;
      }
      .auto-card {
        margin-top: 16px;
        max-width: 640px;
      }
      th {
        width: 50%;
      }
    `], Mt);
M([s({ attribute: !1 })], Z.prototype, "displayId", void 0), M([e()], Z.prototype, "selected", void 0), M([e()], Z.prototype, "layout", void 0), M([e()], Z.prototype, "debug", void 0), M([e()], Z.prototype, "dirty", void 0), M([e()], Z.prototype, "busy", void 0), Z = M([u("gs-settings")], Z);
// src/views/diagnostics.ts
var Nt = class extends N {
	constructor(...e) {
		super(...e), this.entries = [], this.level = "all", this.debug = !1;
	}
	connectedCallback() {
		super.connectedCallback(), this.load(), this.timer = window.setInterval(() => this.load(), 4e3);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), window.clearInterval(this.timer);
	}
	async load() {
		try {
			let e = await this.api.log();
			this.entries = e.entries.slice().reverse(), this.debug = e.debug;
		} catch {}
	}
	async cmd(e, t, n) {
		try {
			await this.api.command(e, t), k(this, `${n}: OK`, "ok"), setTimeout(() => this.load(), 800);
		} catch (e) {
			k(this, y(e), "error");
		}
	}
	render() {
		let e = (e) => e ? this.displays.find((t) => t.id === e)?.name ?? e : "–", t = this.entries.filter((e) => this.level === "all" || e.level === this.level);
		return c`
      <div class="page-head">
        <h1>Diagnose & Protokolle</h1><span class="spacer"></span>
        <label class="check" style="margin:0"><input type="checkbox" .checked=${this.debug} @change=${async (e) => {
			this.debug = e.target.checked, await this.api.setDebug(this.debug);
		}} /> Debug-Modus</label>
        <button @click=${() => b("guition-studio-log.json", {
			displays: this.displays,
			log: this.entries
		})}>⇩ Exportieren</button>
      </div>
      <div class="grid">
        ${this.displays.map((e) => c`<div class="card">
            <div class="row"><h2 style="margin:0">${e.name}</h2><span class="spacer"></span><span class="chip ${e.online ? "ok" : "error"}">${e.online ? "online" : "offline"}</span></div>
            <table class="small">
              <tr><th>ESPHome-Gerät</th><td>${e.node ?? "–"} ${e.linked ? c`<span class="chip ok">Aktionen ✓</span>` : c`<span class="chip error">keine Aktionen</span>`}</td></tr>
              <tr><th>Firmware / Protokoll</th><td>${e.firmware ?? "–"} / ${e.protocol ?? "–"}</td></tr>
              <tr><th>Layout HA / Gerät</th><td>Rev. ${e.applied_revision ?? "–"} / Rev. ${e.device_revision ?? "–"} ${e.applied_revision == null ? a : c`<span class="chip ${e.in_sync ? "ok" : "warn"}">${e.in_sync ? "synchron" : "abweichend"}</span>`}</td></tr>
              <tr><th>Layoutgröße</th><td>${j(e.applied_size)} von ${j(this.info.limits.bytes)}</td></tr>
              <tr><th>Freier RAM / PSRAM</th><td>${j(e.heap)} / ${j(e.psram)}</td></tr>
              <tr><th>Laufzeit</th><td>${e.uptime == null ? "–" : `${Math.floor(e.uptime / 3600)} h ${Math.floor(e.uptime % 3600 / 60)} min`} (Stand ${A(e.last_seen)})</td></tr>
              <tr><th>Aktuelle Seite</th><td>${e.page == null ? "–" : e.page + 1}</td></tr>
              <tr><th>Nachtmodus</th><td>${e.night == null ? "–" : e.night ? "aktiv" : "aus"}</td></tr>
              <tr><th>Neustarts / min. freier RAM</th><td>${e.reboots ?? 0} / ${j(e.heap_min)}</td></tr>
              <tr><th>Letzte Übertragung</th><td>${e.transfer.state}${e.transfer.error ? ` – ${e.transfer.error}` : ""}</td></tr>
            </table>
            <div class="row" style="margin-top:10px">
              <button ?disabled=${!e.linked} @click=${() => this.cmd(e.id, "hello", "Status angefordert")}>Status abfragen</button>
              <button ?disabled=${!e.linked} @click=${() => this.cmd(e.id, "push_states", "Zustände gesendet")}>Zustände senden</button>
              <button ?disabled=${!e.linked || e.applied_revision == null} @click=${() => this.cmd(e.id, "resend", "Layout erneut gesendet")}>Layout erneut senden</button>
            </div>
          </div>`)}
      </div>
      <section class="card" style="margin-top:24px">
        <div class="row">
          <h2 style="margin:0">Protokoll</h2><span class="spacer"></span>
          <select style="width:auto" @change=${(e) => this.level = e.target.value}>
            <option value="all">Alle</option><option value="error">Fehler</option><option value="warning">Warnungen</option><option value="info">Info</option><option value="debug">Debug</option>
          </select>
          <button class="icon" title="Aktualisieren" @click=${() => this.load()}>↻</button>
        </div>
        <table class="log small">
          <tr><th>Zeit</th><th>Display</th><th>Meldung</th></tr>
          ${t.length === 0 ? c`<tr><td colspan="3" class="muted">Noch keine Einträge.</td></tr>` : a}
          ${t.map((t) => c`<tr class=${t.level}>
              <td class="ts">${new Date(t.ts).toLocaleTimeString("de-DE")}</td>
              <td>${e(t.display_id)}</td>
              <td><span class="lvl ${t.level}">${t.level}</span> ${t.message}</td>
            </tr>`)}
        </table>
      </section>
    `;
	}
}, Q = (Nt.styles = [...N.styles, r`
      th {
        width: 44%;
      }
      .log th:first-child,
      .ts {
        width: 90px;
        white-space: nowrap;
      }
      .log th:nth-child(2) {
        width: 160px;
      }
      .lvl {
        font-size: 10px;
        text-transform: uppercase;
        padding: 1px 6px;
        border-radius: 4px;
        background: var(--gs-surface-2);
        margin-right: 6px;
      }
      .lvl.error {
        background: var(--gs-error);
        color: #fff;
      }
      .lvl.warning {
        background: var(--gs-warn);
        color: #fff;
      }
    `], Nt);
M([e()], Q.prototype, "entries", void 0), M([e()], Q.prototype, "level", void 0), M([e()], Q.prototype, "debug", void 0), Q = M([u("gs-diagnostics")], Q);
// src/panel.ts
var Pt, Ft = [
	{
		key: "overview",
		label: "Übersicht",
		icon: "mdi:view-dashboard",
		glyph: "▦"
	},
	{
		key: "displays",
		label: "Meine Displays",
		icon: "mdi:tablet",
		glyph: "▢"
	},
	{
		key: "designer",
		label: "Display-Designer",
		icon: "mdi:pencil-ruler",
		glyph: "✎"
	},
	{
		key: "firmware",
		label: "Firmware-Manager",
		icon: "mdi:chip",
		glyph: "⚙"
	},
	{
		key: "templates",
		label: "Vorlagen",
		icon: "mdi:palette-swatch",
		glyph: "❖"
	},
	{
		key: "settings",
		label: "Einstellungen",
		icon: "mdi:cog",
		glyph: "⚙"
	},
	{
		key: "diagnostics",
		label: "Diagnose & Protokolle",
		icon: "mdi:stethoscope",
		glyph: "♥"
	}
], $ = (Pt = class extends t {
	constructor(...e) {
		super(...e), this.narrow = !1, this.view = "overview", this.displays = [], this.selected = null, this.error = null, this.dialog = null, this.toasts = [], this.navOpen = !1, this.api = new v(() => this.hass), this.toastId = 0, this.onNavigate = (e) => {
			this.view = e.detail.view, e.detail.display && (this.selected = e.detail.display), this.navOpen = !1, this.refresh();
		}, this.onConfirm = (e) => {
			e.stopPropagation(), this.dialog = {
				kind: "confirm",
				...e.detail
			};
		}, this.onPrompt = (e) => {
			e.stopPropagation(), this.dialog = {
				kind: "prompt",
				confirm: "Übernehmen",
				text: "",
				...e.detail
			};
		}, this.onToast = (e) => {
			let t = ++this.toastId;
			this.toasts = [...this.toasts, {
				id: t,
				...e.detail
			}], setTimeout(() => this.toasts = this.toasts.filter((e) => e.id !== t), e.detail.kind === "error" ? 8e3 : 4e3);
		};
	}
	connectedCallback() {
		super.connectedCallback(), this.addEventListener("gs-confirm", this.onConfirm), this.addEventListener("gs-prompt", this.onPrompt), this.addEventListener("gs-toast", this.onToast), this.addEventListener("gs-navigate", this.onNavigate), this.addEventListener("gs-refresh", () => this.refresh());
		let e = new URLSearchParams(location.search).get("view");
		e && Ft.some((t) => t.key === e) && (this.view = e);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.unsub?.(), this.unsub = void 0, window.clearInterval(this.refreshTimer);
	}
	async firstUpdated() {
		await this.load();
		try {
			this.unsub = await this.hass.connection.subscribeEvents((e) => {
				(e.data?.kind === "transfer" || e.data?.kind === "ota") && this.dispatchEvent(new CustomEvent("gs-progress", { detail: e.data })), this.scheduleRefresh();
			}, "guition_studio_updated");
		} catch {}
		this.refreshTimer = window.setInterval(() => this.refresh(), 15e3);
	}
	scheduleRefresh() {
		window.clearTimeout(this.scheduleTimer), this.scheduleTimer = window.setTimeout(() => this.refresh(), 400);
	}
	async load() {
		try {
			this.info = await this.api.info(), await this.refresh(), !this.selected && this.displays.length && (this.selected = this.displays[0].id), this.error = null;
		} catch (e) {
			this.error = `Guition Studio konnte nicht geladen werden: ${y(e)}`;
		}
	}
	async refresh() {
		try {
			this.displays = await this.api.displays(), this.selected && !this.displays.some((e) => e.id === this.selected) && (this.selected = this.displays[0]?.id ?? null);
		} catch (e) {
			this.error = y(e);
		}
	}
	async reloadInfo() {
		this.info = await this.api.info();
	}
	closeDialog(e) {
		let t = this.dialog;
		if (t) {
			if (this.dialog = null, t.kind === "prompt") {
				let n = this.renderRoot.querySelector("#prompt-input");
				t.resolve(e && n?.value.trim() || null);
			} else t.resolve(e);
		}
	}
	renderView() {
		if (!this.info) return c`<div class="loading"><span class="spinner"></span> Lade Guition Studio …</div>`;
		let e = {
			hass: this.hass,
			api: this.api,
			info: this.info,
			displays: this.displays
		};
		switch (this.view) {
			case "overview": return c`<gs-overview .hass=${e.hass} .api=${this.api} .info=${this.info} .displays=${this.displays}></gs-overview>`;
			case "displays": return c`<gs-displays .hass=${e.hass} .api=${this.api} .info=${this.info} .displays=${this.displays}></gs-displays>`;
			case "designer": return c`<gs-designer
          .hass=${e.hass}
          .api=${this.api}
          .info=${this.info}
          .displays=${this.displays}
          .displayId=${this.selected}
          @gs-select-display=${(e) => this.selected = e.detail}
        ></gs-designer>`;
			case "firmware": return c`<gs-firmware .hass=${e.hass} .api=${this.api} .info=${this.info} .displays=${this.displays}></gs-firmware>`;
			case "templates": return c`<gs-templates
          .hass=${e.hass}
          .api=${this.api}
          .info=${this.info}
          .displays=${this.displays}
          .displayId=${this.selected}
          @gs-info-changed=${() => this.reloadInfo()}
        ></gs-templates>`;
			case "settings": return c`<gs-settings .hass=${e.hass} .api=${this.api} .info=${this.info} .displays=${this.displays} .displayId=${this.selected}></gs-settings>`;
			case "diagnostics": return c`<gs-diagnostics .hass=${e.hass} .api=${this.api} .info=${this.info} .displays=${this.displays}></gs-diagnostics>`;
		}
	}
	render() {
		return c`
      <div class="shell ${this.narrow ? "narrow" : ""}">
        <header class="topbar">
          <button class="icon ghost menu" title="Menü" @click=${() => this.navOpen = !this.navOpen}>${_e("mdi:menu", "≡")}</button>
          <div class="brand"><span class="logo">GS</span> <span>Guition <b>Studio</b></span></div>
          <span class="spacer"></span>
          ${this.info ? c`<span class="chip">v${this.info.version}</span>` : a}
        </header>
        <div class="body">
          <nav class="${this.navOpen ? "open" : ""}" aria-label="Guition Studio Navigation">
            ${Ft.map((e) => c`<button
                class="nav-item ${this.view === e.key ? "active" : ""}"
                aria-current=${this.view === e.key ? "page" : "false"}
                @click=${() => {
			this.view = e.key, this.navOpen = !1;
		}}
              >
                ${_e(e.icon, e.glyph)}<span>${e.label}</span>
              </button>`)}
          </nav>
          <main>${this.error ? c`<div class="notice error">${this.error} <button @click=${() => this.load()}>Erneut versuchen</button></div>` : a}${this.renderView()}</main>
        </div>
      </div>
      ${this.dialog ? this.renderDialog(this.dialog) : a}
      <div class="toasts" role="status" aria-live="polite">${this.toasts.map((e) => c`<div class="toast ${e.kind}">${e.message}</div>`)}</div>
    `;
	}
	renderDialog(e) {
		return c`<div class="scrim" @click=${(e) => e.target === e.currentTarget && this.closeDialog(!1)}>
      <div
        class="dialog card"
        role="dialog"
        aria-modal="true"
        @keydown=${(t) => {
			t.key === "Escape" && this.closeDialog(!1), t.key === "Enter" && e.kind === "prompt" && this.closeDialog(!0);
		}}
      >
        <h2>${e.title}</h2>
        ${e.text ? c`<p style="white-space:pre-line">${e.text}</p>` : a}
        ${e.kind === "prompt" ? c`<label class="field"><span>${e.label}</span><input id="prompt-input" .value=${e.value ?? ""} maxlength="40" autofocus /></label>` : a}
        <div class="row" style="justify-content:flex-end;margin-top:12px">
          <button @click=${() => this.closeDialog(!1)}>Abbrechen</button>
          <button class=${e.danger ? "primary danger-fill" : "primary"} @click=${() => this.closeDialog(!0)} autofocus>${e.confirm ?? "OK"}</button>
        </div>
      </div>
    </div>`;
	}
	updated() {
		this.toggleAttribute("dark", !!this.hass?.themes?.darkMode), this.dialog?.kind === "prompt" && this.renderRoot.querySelector("#prompt-input")?.focus();
	}
}, Pt.styles = [T, r`
      /* Guition Studio palette: petrol primary, amber accent, cool slate neutrals. */
      :host {
        --gsp-bg: #f3f6f9;
        --gsp-surface: #ffffff;
        --gsp-surface-2: #eef2f6;
        --gsp-text: #0f1c2a;
        --gsp-muted: #5b6b7c;
        --gsp-border: #dfe5ec;
        --gsp-primary: #0e7490;
        --gsp-primary-strong: #155e75;
        --gsp-on-primary: #ffffff;
        --gsp-accent: #f59e0b;
        --gsp-ok: #15803d;
        --gsp-warn: #b45309;
        --gsp-error: #b91c1c;
        --gsp-shadow: 0 1px 2px rgba(15, 28, 42, 0.05), 0 2px 8px rgba(15, 28, 42, 0.04);
        --gsp-shadow-lg: 0 12px 32px rgba(15, 28, 42, 0.18);
        --gsp-bar: linear-gradient(90deg, #0b1d2a 0%, #0f2b3a 60%, #114052 100%);
        display: block;
        height: 100%;
        background: var(--gs-bg);
      }
      :host([dark]) {
        --gsp-bg: #0b1117;
        --gsp-surface: #121a23;
        --gsp-surface-2: #19232e;
        --gsp-text: #e6edf3;
        --gsp-muted: #8b98a5;
        --gsp-border: #253241;
        --gsp-primary: #22b8cf;
        --gsp-primary-strong: #0ea5c0;
        --gsp-on-primary: #04212a;
        --gsp-accent: #fbbf24;
        --gsp-ok: #3fb950;
        --gsp-warn: #f0b429;
        --gsp-error: #f87171;
        --gsp-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
        --gsp-shadow-lg: 0 16px 40px rgba(0, 0, 0, 0.55);
        --gsp-bar: linear-gradient(90deg, #070d13 0%, #0b1a24 60%, #0d2a36 100%);
      }
      .shell {
        display: flex;
        flex-direction: column;
        height: 100vh;
      }
      .topbar {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 56px;
        padding: 0 16px;
        background: var(--gsp-bar);
        color: #f1f5f9;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        box-shadow: 0 1px 0 rgba(0, 0, 0, 0.15);
        flex-shrink: 0;
      }
      .topbar .chip {
        background: rgba(255, 255, 255, 0.1);
        color: #cbd5e1;
        font-variant-numeric: tabular-nums;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 17px;
        font-weight: 600;
        letter-spacing: -0.01em;
      }
      .brand b {
        font-weight: 400;
        color: #7dd3e8;
      }
      .logo {
        position: relative;
        display: grid;
        place-items: center;
        width: 30px;
        height: 30px;
        border-radius: 8px;
        background: linear-gradient(135deg, #22b8cf, #0e7490);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18);
        color: #fff;
        font-size: 12.5px;
        font-weight: 700;
        letter-spacing: 0.02em;
      }
      .logo::after {
        content: "";
        position: absolute;
        right: -2px;
        bottom: -2px;
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: #f59e0b;
        border: 2px solid #0f2b3a;
      }
      .menu {
        display: none;
        color: inherit;
      }
      .body {
        flex: 1;
        display: flex;
        min-height: 0;
      }
      nav {
        width: 224px;
        flex-shrink: 0;
        padding: 14px 10px;
        border-right: 1px solid var(--gs-border);
        background: var(--gs-surface);
        overflow-y: auto;
      }
      .nav-item {
        position: relative;
        width: 100%;
        justify-content: flex-start;
        border: none;
        background: transparent;
        margin-bottom: 2px;
        gap: 12px;
        min-height: 40px;
        color: var(--gs-muted);
        font-weight: 500;
      }
      .nav-item:hover:not(:disabled) {
        color: var(--gs-text);
        background: var(--gs-surface-2);
      }
      .nav-item.active {
        background: color-mix(in srgb, var(--gs-primary) 11%, transparent);
        color: var(--gs-primary);
        font-weight: 600;
      }
      .nav-item.active::before {
        content: "";
        position: absolute;
        left: -10px;
        top: 8px;
        bottom: 8px;
        width: 3px;
        border-radius: 0 3px 3px 0;
        background: var(--gs-primary);
      }
      main {
        flex: 1;
        min-width: 0;
        overflow: auto;
        position: relative;
      }
      main > :not(.notice) {
        display: block;
      }
      .loading {
        padding: 40px;
        display: flex;
        gap: 12px;
        align-items: center;
      }
      @media (max-width: 860px) {
        .menu {
          display: inline-flex;
        }
        nav {
          position: absolute;
          z-index: 20;
          top: 56px;
          bottom: 0;
          transform: translateX(-100%);
          transition: transform 0.2s;
          box-shadow: var(--gs-shadow);
        }
        nav.open {
          transform: none;
        }
      }
      .scrim {
        position: fixed;
        inset: 0;
        background: rgba(7, 13, 19, 0.55);
        backdrop-filter: blur(2px);
        display: grid;
        place-items: center;
        z-index: 100;
      }
      .dialog {
        width: min(460px, 92vw);
        box-shadow: var(--gs-shadow-lg);
      }
      .danger-fill {
        background: var(--gs-error) !important;
        border-color: var(--gs-error) !important;
      }
      .toasts {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: grid;
        gap: 8px;
        z-index: 200;
      }
      .toast {
        background: #0f1c2a;
        color: #f1f5f9;
        padding: 12px 18px 12px 16px;
        border-radius: 10px;
        border-left: 4px solid #22b8cf;
        box-shadow: var(--gs-shadow-lg);
        max-width: 80vw;
      }
      .toast.ok {
        border-left-color: #3fb950;
      }
      .toast.error {
        border-left-color: #f87171;
      }
    `], Pt);
M([s({ attribute: !1 })], $.prototype, "hass", void 0), M([s({ type: Boolean })], $.prototype, "narrow", void 0), M([e()], $.prototype, "view", void 0), M([e()], $.prototype, "info", void 0), M([e()], $.prototype, "displays", void 0), M([e()], $.prototype, "selected", void 0), M([e()], $.prototype, "error", void 0), M([e()], $.prototype, "dialog", void 0), M([e()], $.prototype, "toasts", void 0), M([e()], $.prototype, "navOpen", void 0), $ = M([u("guition-studio-panel")], $);

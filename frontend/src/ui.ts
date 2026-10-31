// Design system, shared helpers and the static screen renderer.
import { css, html, nothing, type TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { cellRect, pageGeometry, SCREEN } from "./geometry";
import { iconFallback, iconMdi } from "./icons";
import { previewState, tileColors, visibleNow } from "./preview";
import type { Hass, Layout, Page, Theme, Tile } from "./types";

export const sharedStyles = css`
  :host {
    --gs-bg: var(--primary-background-color, #f4f6f9);
    --gs-surface: var(--card-background-color, #ffffff);
    --gs-surface-2: var(--secondary-background-color, #eef1f5);
    --gs-text: var(--primary-text-color, #1f2937);
    --gs-muted: var(--secondary-text-color, #6b7280);
    --gs-border: var(--divider-color, rgba(0, 0, 0, 0.12));
    --gs-primary: var(--primary-color, #2563eb);
    --gs-on-primary: var(--text-primary-color, #ffffff);
    --gs-ok: var(--success-color, #16a34a);
    --gs-warn: var(--warning-color, #d97706);
    --gs-error: var(--error-color, #dc2626);
    --gs-radius: 14px;
    --gs-shadow: 0 1px 2px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.06);
    color: var(--gs-text);
    font-family: var(--paper-font-body1_-_font-family, "Roboto", "Segoe UI", system-ui, sans-serif);
    font-size: 14px;
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
  }
  h2 {
    font-size: 17px;
  }
  h3 {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
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
    border-radius: 10px;
    border: 1px solid var(--gs-border);
    background: var(--gs-surface);
    color: var(--gs-text);
    cursor: pointer;
    text-decoration: none;
    white-space: nowrap;
    transition: background 0.15s, border-color 0.15s, transform 0.05s;
  }
  button:hover:not(:disabled) {
    background: var(--gs-surface-2);
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
  }
  button.primary:hover:not(:disabled) {
    filter: brightness(1.08);
    background: var(--gs-primary);
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
  input,
  select,
  textarea {
    font: inherit;
    color: var(--gs-text);
    background: var(--gs-surface);
    border: 1px solid var(--gs-border);
    border-radius: 10px;
    min-height: 36px;
    padding: 6px 10px;
    width: 100%;
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
    border-radius: 12px;
    background: var(--gs-surface-2);
    border-left: 4px solid var(--gs-primary);
    margin: 8px 0;
    line-height: 1.5;
  }
  .notice.warn {
    border-color: var(--gs-warn);
  }
  .notice.error {
    border-color: var(--gs-error);
  }
  .notice.ok {
    border-color: var(--gs-ok);
  }
  .progress {
    height: 8px;
    border-radius: 99px;
    background: var(--gs-surface-2);
    overflow: hidden;
  }
  .progress > div {
    height: 100%;
    background: var(--gs-primary);
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
    font-size: 12px;
    color: var(--gs-muted);
    font-weight: 500;
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

/** Material icon in HA (ha-icon), unicode glyph otherwise. */
export function mdi(name: string, fallback = "•"): TemplateResult {
  if (customElements.get("ha-icon")) return html`<ha-icon .icon=${name}></ha-icon>`;
  return html`<span class="glyph" aria-hidden="true">${fallback}</span>`;
}

/** Firmware icon key → preview icon. */
export function deviceIcon(key: string | null, size: number): TemplateResult | typeof nothing {
  if (!key) return nothing;
  if (customElements.get("ha-icon")) return html`<ha-icon .icon=${iconMdi(key)} style="--mdc-icon-size:${size}px"></ha-icon>`;
  return html`<span style="font-size:${Math.round(size * 0.6)}px;line-height:${size}px;font-weight:700;display:inline-block;min-width:${size}px;text-align:center">${iconFallback(key)}</span>`;
}

export function fireEvent(node: HTMLElement, type: string, detail?: unknown): void {
  node.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
}

export interface ConfirmOptions {
  title: string;
  text: string;
  confirm?: string;
  danger?: boolean;
}

export function confirmDialog(node: HTMLElement, opts: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => fireEvent(node, "gs-confirm", { ...opts, resolve }));
}

export function promptDialog(node: HTMLElement, title: string, value: string, label = "Name"): Promise<string | null> {
  return new Promise((resolve) => fireEvent(node, "gs-prompt", { title, value, label, resolve }));
}

export function toast(node: HTMLElement, message: string, kind: "info" | "ok" | "error" = "info"): void {
  fireEvent(node, "gs-toast", { message, kind });
}

export function relTime(iso: string | null | undefined): string {
  if (!iso) return "–";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "gerade eben";
  if (diff < 3600) return `vor ${Math.round(diff / 60)} Min.`;
  if (diff < 86400) return `vor ${Math.round(diff / 3600)} Std.`;
  return new Date(iso).toLocaleString("de-DE");
}

export function formatBytes(n: number | null | undefined): string {
  if (n == null) return "–";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1).replace(".", ",")} KB`;
  return `${(n / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;
}

const FONT_PX: Record<string, number> = { s: 12, m: 16, l: 20, xl: 28, xxl: 40 };

/** Inner content of a tile, laid out like the firmware does. */
export function renderTileContent(tile: Tile, theme: Theme, hass: Hass | undefined, pw: number, ph: number, now = new Date()): TemplateResult {
  const ps = previewState(hass, tile);
  const c = tileColors(tile, theme, ps);
  const big = pw >= 200 && ph >= 200;
  const pad = ph < 90 ? 8 : 12;
  const titlePx = FONT_PX[tile.style.font_size] ?? 16;
  const iconKey = ps.known && !ps.available ? "warning" : tile.icon;
  const title = (style: Record<string, string>) =>
    tile.show_title ? html`<div class="t-title" style=${styleMap({ fontSize: `${titlePx}px`, ...style })}>${tile.title}</div>` : nothing;
  const hhmm = now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  let body: TemplateResult;
  switch (tile.type) {
    case "clock":
      body = html`<div class="t-center">
        <div style="font-size:${big ? 40 : 28}px;font-weight:600">${hhmm}</div>
        ${tile.show_title ? html`<div style="font-size:16px">${tile.title || now.toLocaleDateString("de-DE")}</div>` : nothing}
      </div>`;
      break;
    case "weather": {
      const wide = pw >= 200;
      const tall = ph >= 200;
      const fcH = tall ? 74 : 0;
      let bottom = pad + fcH;
      const showDetail = wide || ph >= 150;
      const detailBottom = bottom;
      if (showDetail) bottom += 18;
      const subBottom = bottom;
      bottom += 22;
      body = html`${title({ position: "absolute", left: `${pad}px`, top: `${pad}px`, right: `${pad + 48}px` })}
        <div style="position:absolute;right:${pad}px;top:${pad - 4}px;color:${c.icon}">${deviceIcon(ps.icon ?? iconKey, tall ? 40 : 28)}</div>
        <div class="t-value" style="position:absolute;left:${pad}px;bottom:${bottom}px;font-size:${tall || wide ? 40 : 28}px">${ps.known ? (ps.available ? ps.text || "–" : "Nicht verfügbar") : "–"}</div>
        <div class="t-state" style="position:absolute;left:${pad}px;right:${pad}px;bottom:${subBottom}px;font-size:16px">${ps.sub}</div>
        ${showDetail ? html`<div class="t-state" style="position:absolute;left:${pad}px;right:${pad}px;bottom:${detailBottom}px;font-size:12px">${ps.detail}</div>` : nothing}
        ${tall
          ? html`<div class="t-buttons" style="left:${pad}px;right:${pad}px;bottom:${pad}px;height:70px;font-size:12px;text-align:center">
              ${[0, 1, 2].map(() => html`<span style="flex-direction:column;gap:2px">Vorhersage<br />vom Display</span>`)}
            </div>`
          : nothing}`;
      break;
    }
    case "sensor": {
      const weather = false;
      const ic = weather && ps.icon ? ps.icon : iconKey;
      body = html`${title({ position: "absolute", left: `${pad}px`, top: `${pad}px`, right: `${pad + 34}px` })}
        ${tile.show_icon || weather ? html`<div style="position:absolute;right:${pad}px;top:${pad - 4}px;color:${c.icon}">${deviceIcon(ic, weather && big ? 40 : 28)}</div>` : nothing}
        <div class="t-value" style="position:absolute;left:${pad}px;right:${pad}px;bottom:${weather ? pad + 18 : pad}px;font-size:${big ? 40 : pw < 110 ? 20 : 28}px">
          ${ps.known ? (ps.available ? ps.text || "–" : "Nicht verfügbar") : "–"}
        </div>
        ${weather ? html`<div class="t-state" style="position:absolute;left:${pad}px;right:${pad}px;bottom:${pad}px;font-size:12px">${ps.sub}</div>` : nothing}`;
      break;
    }
    case "cover":
    case "thermostat":
    case "media": {
      const btnH = ph >= 200 ? 52 : ph >= 120 ? 40 : 32;
      const buttons =
        tile.type === "cover"
          ? ["arrow-up", "stop", "arrow-down"]
          : tile.type === "thermostat"
            ? ["minus", "plus"]
            : pw >= 280
              ? ["volume-minus", "skip-previous", "play-pause", "skip-next", "volume-plus"]
              : ["skip-previous", "play-pause", "skip-next"];
      const roomForValue = ph - btnH - 2 * pad >= 40;
      const media = tile.type === "media";
      const main = media && ps.available && ps.sub ? ps.sub : ps.known ? (ps.available ? ps.text : "Nicht verfügbar") : "–";
      const second = media && ps.available && ps.sub ? ps.text : ps.available ? ps.sub : "";
      body = html`${tile.show_icon && tile.icon ? html`<div style="position:absolute;left:${pad}px;top:${pad - 2}px;color:${c.icon}">${deviceIcon(iconKey, 20)}</div>` : nothing}
        ${title({ position: "absolute", left: `${pad + (tile.show_icon && tile.icon ? 26 : 0)}px`, top: `${pad}px`, right: `${pad}px` })}
        ${roomForValue
          ? html`<div class="t-value" style="position:absolute;left:${pad}px;right:${pad}px;top:${pad + 24}px;font-size:${media ? 16 : big ? 40 : ph >= 140 ? 28 : 20}px">${main}</div>
              ${ph - btnH - 2 * pad >= 84 || media
                ? html`<div class="t-state" style="position:absolute;left:${pad}px;right:${pad}px;bottom:${pad + btnH + 6}px;font-size:12px">${second}</div>`
                : nothing}`
          : nothing}
        <div class="t-buttons" style="left:${pad}px;right:${pad}px;bottom:${pad}px;height:${btnH}px">
          ${buttons.map((b) => html`<span style="border-radius:${Math.round(btnH / 3)}px;background:color-mix(in srgb, ${c.fg} 10%, transparent)">${deviceIcon(b, btnH >= 44 ? 28 : 20)}</span>`)}
        </div>`;
      break;
    }
    case "nav":
    case "action":
    case "settings":
      body = html`<div class="t-center">
        ${tile.show_icon && tile.icon ? html`<div style="color:${c.icon}">${deviceIcon(iconKey, big ? 40 : 28)}</div>` : nothing}
        ${title({ textAlign: "center", maxWidth: "100%" })}
      </div>`;
      break;
    case "text":
      body = html`<div class="t-center" style="font-size:${titlePx}px;text-align:center;white-space:pre-wrap">${tile.title}</div>`;
      break;
    case "status":
      body = html`<div style="position:absolute;left:${pad}px;top:50%;transform:translateY(-50%);font-size:15px;line-height:1.8">
        <div style="color:${theme.ok}">📶 WLAN verbunden</div>
        <div style="color:${theme.ok}">⌂ HA verbunden</div>
      </div>`;
      break;
    case "graph": {
      // the real history is loaded by Home Assistant from the recorder; the editor shows a neutral sample
      const bars = 24;
      const sample = Array.from({ length: bars }, (_, i) => 35 + Math.round(25 * Math.sin(i / 3.2) + 15 * Math.sin(i / 1.7)));
      const areaTop = pad + 28;
      const areaH = ph - areaTop - (pad + 16);
      body = html`${title({ position: "absolute", left: `${pad}px`, top: `${pad}px`, right: `${pad + 90}px` })}
        <div class="t-value" style="position:absolute;right:${pad}px;top:${pad - 2}px;font-size:20px">${ps.known ? (ps.available ? ps.text : "–") : "–"}</div>
        <div class="t-bars" style="left:${pad}px;right:${pad}px;top:${areaTop}px;height:${Math.max(areaH, 0)}px">
          ${sample.map((v, i) => html`<span style="height:${v}%;background:${c.icon};opacity:${0.3 + (0.7 * i) / (bars - 1)}"></span>`)}
        </div>
        <div class="t-state" style="position:absolute;left:${pad}px;right:${pad}px;bottom:${pad - 2}px;font-size:12px">Verlauf ${tile.hours ?? 24} h · Vorschau</div>`;
      break;
    }
    default: {
      const rgb = tile.type === "rgb";
      const dimmer = tile.type === "dimmer" || rgb;
      const sliderH = dimmer ? (ph >= 140 ? 18 : 12) : 0;
      const swatchH = rgb ? (ph >= 140 ? 28 : 20) : 0;
      const bottom = dimmer ? pad + sliderH + 10 + (rgb ? swatchH + 8 : 0) : pad;
      const level = ps.on ? (ps.num >= 0 ? ps.num : 100) : 0;
      body = html`${tile.show_icon ? html`<div style="position:absolute;left:${pad}px;top:${pad - 2}px;color:${c.icon}">${deviceIcon(iconKey, big ? 40 : 28)}</div>` : nothing}
        ${title({ position: "absolute", left: `${pad}px`, right: `${pad}px`, bottom: `${tile.show_state ? bottom + 20 : bottom}px` })}
        ${tile.show_state
          ? html`<div class="t-state" style="position:absolute;left:${pad}px;right:${pad}px;bottom:${bottom}px;font-size:${tile.style.font_size === "s" ? 12 : 16}px">
              ${ps.known ? (ps.available ? ps.text : "Nicht verfügbar") : "…"}
            </div>`
          : nothing}
        ${dimmer
          ? html`<div class="t-slider" style="left:${pad + 4}px;right:${pad + 4}px;bottom:${pad + 2}px;height:${sliderH}px;background:color-mix(in srgb, ${c.fg} 20%, transparent)">
              <div style="width:${level}%;background:${tile.style.on_color ?? theme.on_bg}"></div>
            </div>`
          : nothing}
        ${rgb
          ? html`<div class="t-buttons" style="left:${pad}px;right:${pad}px;bottom:${pad + sliderH + 10}px;height:${swatchH}px">
              ${["#FFB46B", "#FF3B30", "#34C759", "#0A84FF", "#BF5AF2"].map((col) => html`<span style="border-radius:${swatchH}px;background:${col}"></span>`)}
            </div>`
          : nothing}`;
    }
  }
  return html`<div
    class="t-inner ${ps.known && !ps.available ? "unavailable" : ""}"
    style=${styleMap({
      background: c.bg,
      color: c.fg,
      borderRadius: `${tile.style.radius}px`,
      border: tile.style.border_width ? `${tile.style.border_width}px solid ${tile.style.border_color ?? theme.accent}` : "none",
      opacity: String((tile.style.opacity / 100) * (ps.known && !ps.available ? 0.5 : 1)),
    })}
  >
    ${body}
  </div>`;
}

export const screenStyles = css`
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

/** Non-interactive screen (header + page + dots) used for previews and templates. */
export function renderScreen(layout: Layout, page: Page, themes: Record<string, Theme>, hass?: Hass): TemplateResult {
  const theme = themes[layout.settings.theme] ?? Object.values(themes)[0];
  const geo = pageGeometry(layout.settings, layout.pages.length);
  const index = layout.pages.indexOf(page);
  return html`<div class="screen" style="background:${theme.header_bg}">
    ${layout.settings.show_header
      ? html`<div class="s-header" style="color:${theme.header_text}">
          <span class="name">${page.name}</span><span>${new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}</span>
          <span style="color:${theme.ok};font-size:15px">📶</span><span style="color:${theme.ok};font-size:16px">⌂</span>
        </div>`
      : nothing}
    <div class="s-page" style="top:${geo.top}px;height:${geo.height}px;background:${page.background ?? theme.page_bg}">
      ${page.tiles.map((t) => {
        const r = cellRect(page, geo, t.x, t.y, t.w, t.h);
        return html`<div class="tile" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;${visibleNow(hass, t) ? "" : "opacity:.25"}">
          ${renderTileContent(t, theme, hass, r.w, r.h)}
        </div>`;
      })}
    </div>
    ${geo.bottom
      ? html`<div class="s-dots">${layout.pages.map((_, i) => html`<span style="background:${i === index ? theme.accent : theme.muted}"></span>`)}</div>`
      : nothing}
  </div>`;
}

export const SCREEN_SIZE = SCREEN;

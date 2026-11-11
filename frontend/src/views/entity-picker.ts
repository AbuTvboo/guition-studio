import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { areaName, friendlyName } from "../entities";
import { formatState } from "../preview";
import type { Hass, HassEntity } from "../types";
import { fireEvent, sharedStyles } from "../ui";

// German search words -> Home Assistant domains (entity ids are always English)
export const GERMAN_ALIASES: Record<string, string[]> = {
  wetter: ["weather"],
  notiz: ["todo"],
  erinnerung: ["todo"],
  aufgabe: ["todo"],
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
  "lüfter": ["fan"],
};

export const DOMAIN_LABELS: Record<string, string> = {
  weather: "Wetter",
  todo: "To-do-Liste",
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
  input_number: "Zahlen-Helfer",
};

export function matchesQuery(hass: Hass, entity: HassEntity, query: string): boolean {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const domain = entity.entity_id.split(".", 1)[0];
  const hay = `${friendlyName(entity)} ${entity.entity_id} ${areaName(hass, entity.entity_id)} ${DOMAIN_LABELS[domain] ?? ""}`.toLowerCase();
  return words.every((w) => hay.includes(w) || Object.entries(GERMAN_ALIASES).some(([alias, domains]) => alias.startsWith(w) && w.length >= 3 && domains.includes(domain)));
}

/** Searchable entity selection, filtered to the domains a tile type accepts. */
@customElement("gs-entity-picker")
export class GsEntityPicker extends LitElement {
  @property({ attribute: false }) hass!: Hass;
  @property() value: string | null = null;
  @property({ attribute: false }) domains: string[] | null = null;
  @property() placeholder = "Entität suchen (z. B. wetter, licht, küche) …";
  @property({ type: Boolean }) invalid = false;
  @state() private open = false;
  @state() private query = "";
  @state() private active = 0;

  private get options(): HassEntity[] {
    return Object.values(this.hass.states)
      .filter((e) => !this.domains || this.domains.includes(e.entity_id.split(".", 1)[0]))
      .filter((e) => matchesQuery(this.hass, e, this.query))
      .sort((a, b) => friendlyName(a).localeCompare(friendlyName(b), "de"))
      .slice(0, 60);
  }

  private choose(entityId: string | null) {
    this.open = false;
    this.query = "";
    fireEvent(this, "gs-entity", entityId);
  }

  private onKey(e: KeyboardEvent) {
    const opts = this.options;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      this.open = true;
      this.active = Math.min(this.active + 1, opts.length - 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      this.active = Math.max(this.active - 1, 0);
    } else if (e.key === "Enter" && this.open && opts[this.active]) {
      e.preventDefault();
      this.choose(opts[this.active].entity_id);
    } else if (e.key === "Escape") {
      this.open = false;
    }
  }

  render() {
    const current = this.value ? this.hass.states[this.value] : undefined;
    const opts = this.open ? this.options : [];
    const domainHint = this.domains ? this.domains.map((d) => DOMAIN_LABELS[d] ?? d).join(" / ") : "";
    return html`<div class="wrap">
      <input
        class=${this.invalid ? "invalid" : ""}
        .value=${this.open ? this.query : current ? `${friendlyName(current)} (${current.entity_id})` : this.value ?? ""}
        placeholder=${this.placeholder}
        @focus=${() => {
          this.open = true;
          this.active = 0;
        }}
        @input=${(e: Event) => {
          this.query = (e.target as HTMLInputElement).value;
          this.open = true;
          this.active = 0;
        }}
        @keydown=${(e: KeyboardEvent) => this.onKey(e)}
        @blur=${() => setTimeout(() => (this.open = false), 150)}
      />
      ${this.value ? html`<button class="clear icon ghost" title="Entität entfernen" @mousedown=${(e: Event) => e.preventDefault()} @click=${() => this.choose(null)}>✕</button>` : nothing}
      ${this.open
        ? html`<div class="list" role="listbox">
            ${opts.length === 0
              ? html`<div class="empty">Keine passende ${domainHint ? `${domainHint}-` : ""}Entität gefunden.${this.domains?.includes("weather")
                  ? html`<br />Tipp: Die Wetter-Integration „Met.no“ legt in Home Assistant automatisch <code>weather.forecast_home</code> an.`
                  : nothing}</div>`
              : opts.map((e, i) => {
                  const domain = e.entity_id.split(".", 1)[0];
                  return html`<div
                    class="opt ${i === this.active ? "active" : ""}"
                    role="option"
                    @mousedown=${(ev: Event) => ev.preventDefault()}
                    @click=${() => this.choose(e.entity_id)}
                    @mouseenter=${() => (this.active = i)}
                  >
                    <span class="nm">${friendlyName(e)}</span>
                    <span class="meta">${e.entity_id}${areaName(this.hass, e.entity_id) ? ` · ${areaName(this.hass, e.entity_id)}` : ""} · ${formatState(domain, e.state, e.attributes)}</span>
                  </div>`;
                })}
          </div>`
        : nothing}
    </div>`;
  }

  static styles = [
    sharedStyles,
    css`
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
    `,
  ];
}

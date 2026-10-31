import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { friendlyName } from "../entities";
import { clone, entityDomainProblem, needsEntity, setGrid } from "../model";
import type { ActionType, Condition, Hass, Layout, Page, StudioInfo, Tile, TileAction, TileStyle } from "../types";
import { deviceIcon, fireEvent, sharedStyles, toast } from "../ui";

export const TYPE_LABELS: Record<string, string> = {
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
  camera: "Kameravorschau (Stream auf ESP32 nicht sinnvoll)",
};

const ACTION_LABELS: Record<ActionType, string> = {
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
  prev: "Vorherige Seite",
};

const FONT_LABELS = { s: "Klein", m: "Normal", l: "Groß", xl: "Sehr groß", xxl: "Riesig" };

@customElement("gs-tile-props")
export class GsTileProps extends LitElement {
  @property({ attribute: false }) hass!: Hass;
  @property({ attribute: false }) info!: StudioInfo;
  @property({ attribute: false }) layout!: Layout;
  @property({ attribute: false }) page!: Page;
  @property({ attribute: false }) tile!: Tile;
  @state() private iconsOpen = false;
  @state() private iconFilter = "";
  @state() private jsonError: string | null = null;

  private patch(p: Partial<Tile>) {
    fireEvent(this, "gs-patch", p);
  }

  private patchStyle(p: Partial<TileStyle>) {
    this.patch({ style: { ...this.tile.style, ...p } });
  }

  private geometry(p: Partial<{ x: number; y: number; w: number; h: number }>) {
    const t = this.tile;
    fireEvent(this, "gs-geometry", { x: t.x, y: t.y, w: t.w, h: t.h, ...p });
  }

  private get theme() {
    return this.info.themes[this.layout.settings.theme] ?? Object.values(this.info.themes)[0];
  }

  private colorField(label: string, key: keyof TileStyle, fallback: string) {
    const value = this.tile.style[key] as string | null;
    return html`<div class="color-row">
      <span>${label}</span>
      <input type="color" .value=${value ?? fallback} @input=${(e: Event) => this.patchStyle({ [key]: (e.target as HTMLInputElement).value.toUpperCase() } as Partial<TileStyle>)} />
      ${value
        ? html`<button class="icon ghost" title="Auf Design-Standard zurücksetzen" @click=${() => this.patchStyle({ [key]: null } as Partial<TileStyle>)}>↺</button>`
        : html`<span class="muted small">Design</span>`}
    </div>`;
  }

  private actionEditor(key: "tap_action" | "hold_action", label: string) {
    const act = this.tile[key];
    const set = (a: TileAction) => this.patch({ [key]: a } as Partial<Tile>);
    return html`<label class="field"><span>${label}</span>
        <select @change=${(e: Event) => {
          const action = (e.target as HTMLSelectElement).value as ActionType;
          set(action === "navigate" ? { action, page: this.layout.pages[0].id } : action === "call_service" ? { action, service: "", data: {} } : { action });
        }}>
          ${(Object.keys(ACTION_LABELS) as ActionType[]).map((a) => html`<option value=${a} ?selected=${act.action === a}>${ACTION_LABELS[a]}</option>`)}
        </select>
      </label>
      ${act.action === "navigate"
        ? html`<label class="field"><span>Zielseite</span>
            <select @change=${(e: Event) => set({ action: "navigate", page: (e.target as HTMLSelectElement).value })}>
              ${this.layout.pages.map((p) => html`<option value=${p.id} ?selected=${act.page === p.id}>${p.name}</option>`)}
            </select>
          </label>`
        : nothing}
      ${act.action === "call_service"
        ? html`<label class="field"><span>Aktion (domain.dienst)</span>
              <input placeholder="z. B. media_player.media_play_pause" .value=${act.service ?? ""} @change=${(e: Event) => set({ ...act, service: (e.target as HTMLInputElement).value.trim() })} />
            </label>
            <label class="field"><span>Daten (JSON, optional – entity_id wird automatisch ergänzt)</span>
              <textarea
                .value=${JSON.stringify(act.data ?? {}, null, 1)}
                @change=${(e: Event) => {
                  try {
                    const data = JSON.parse((e.target as HTMLTextAreaElement).value || "{}");
                    if (typeof data !== "object" || Array.isArray(data) || data === null) throw new Error();
                    this.jsonError = null;
                    set({ ...act, data });
                  } catch {
                    this.jsonError = "Kein gültiges JSON-Objekt";
                  }
                }}
              ></textarea>
              ${this.jsonError ? html`<span style="color:var(--gs-error)">${this.jsonError}</span>` : nothing}
            </label>`
        : nothing}`;
  }

  private visibilityEditor() {
    const conds = this.tile.visibility;
    const set = (v: Condition[]) => this.patch({ visibility: v });
    return html`${conds.map(
        (c, i) => html`<div class="cond">
          <input list="gs-entities" placeholder="Entität" .value=${c.entity} @change=${(e: Event) => set(conds.map((x, j) => (j === i ? { ...x, entity: (e.target as HTMLInputElement).value.trim() } : x)))} />
          <select @change=${(e: Event) => set(conds.map((x, j) => (j === i ? { ...x, operator: (e.target as HTMLSelectElement).value as Condition["operator"] } : x)))}>
            ${(["eq", "ne", "gt", "lt"] as const).map((o) => html`<option value=${o} ?selected=${c.operator === o}>${{ eq: "=", ne: "≠", gt: ">", lt: "<" }[o]}</option>`)}
          </select>
          <input placeholder="Wert" .value=${c.value} @change=${(e: Event) => set(conds.map((x, j) => (j === i ? { ...x, value: (e.target as HTMLInputElement).value } : x)))} />
          <button class="icon ghost" title="Entfernen" @click=${() => set(conds.filter((_, j) => j !== i))}>✕</button>
        </div>`
      )}
      <button @click=${() => set([...conds, { entity: this.tile.entity ?? "", operator: "eq", value: "on" }])}>＋ Bedingung</button>
      <p class="muted small" style="margin-top:6px">Die Kachel ist nur sichtbar, wenn alle Bedingungen erfüllt sind. Home Assistant wertet sie aus und aktualisiert das Display live.</p>`;
  }

  render() {
    const t = this.tile;
    const theme = this.theme;
    const entity = t.entity ? this.hass.states[t.entity] : undefined;
    const requiresEntity = needsEntity(t);
    const domainProblem = entityDomainProblem(t);
    const icons = this.info.icons.filter((i) => i.includes(this.iconFilter.trim().toLowerCase()));
    return html`
      <datalist id="gs-entities">
        ${Object.values(this.hass.states).map((s) => html`<option value=${s.entity_id}>${friendlyName(s)}</option>`)}
      </datalist>
      <div class="row head">
        <h2 style="margin:0">Kachel</h2><span class="spacer"></span>
        <button class="icon" title="Duplizieren" @click=${() => fireEvent(this, "gs-duplicate")}>⊕</button>
        <button class="icon danger" title="Löschen" @click=${() => fireEvent(this, "gs-delete")}>🗑</button>
      </div>

      <section>
        <h3>Inhalt</h3>
        <label class="field"><span>Kacheltyp</span>
          <select @change=${(e: Event) => this.patch({ type: (e.target as HTMLSelectElement).value as Tile["type"] })}>
            ${this.info.tile_types.map((k) => html`<option value=${k} ?selected=${t.type === k}>${TYPE_LABELS[k] ?? k}</option>`)}
            <optgroup label="Geplant (noch nicht in Firmware v1)">
              ${this.info.planned_tile_types.map((k) => html`<option disabled>${TYPE_LABELS[k] ?? k} – nicht verfügbar</option>`)}
            </optgroup>
          </select>
        </label>
        <label class="field"><span>${t.type === "text" ? "Text" : t.type === "clock" ? "Untertitel (leer = Datum)" : "Titel"}</span>
          <input maxlength="64" .value=${t.title} @input=${(e: Event) => this.patch({ title: (e.target as HTMLInputElement).value })} />
        </label>
        ${t.type !== "clock" && t.type !== "text" && t.type !== "status"
          ? html`<label class="field"><span>Zugeordnete Entity-ID ${requiresEntity ? "(erforderlich)" : "(optional)"}</span>
              <input
                list="gs-entities"
                placeholder="z. B. light.wohnzimmer"
                class=${(requiresEntity && !t.entity) || domainProblem ? "invalid" : ""}
                .value=${t.entity ?? ""}
                @change=${(e: Event) => {
                  const v = (e.target as HTMLInputElement).value.trim();
                  const st = this.hass.states[v];
                  this.patch({ entity: v || null, ...(st && !t.title ? { title: friendlyName(st).slice(0, 64) } : {}) });
                }}
              />
              ${t.entity && !entity ? html`<span style="color:var(--gs-error)">Entität existiert nicht oder ist nicht verfügbar</span>` : nothing}
              ${domainProblem ? html`<span style="color:var(--gs-error)">${domainProblem}</span>` : nothing}
              ${entity ? html`<span>Aktuell: <b>${entity.state}</b> ${entity.attributes.unit_of_measurement ?? ""}</span>` : nothing}
            </label>`
          : nothing}
        ${t.type === "graph"
          ? html`<label class="field"><span>Zeitraum des Verlaufs</span>
              <select @change=${(e: Event) => this.patch({ hours: +(e.target as HTMLSelectElement).value })}>
                ${[1, 3, 6, 12, 24, 48].map((h) => html`<option value=${h} ?selected=${(t.hours ?? 24) === h}>${h} Stunde${h === 1 ? "" : "n"}</option>`)}
              </select>
              <span>Daten aus dem Recorder von Home Assistant, Aktualisierung alle 10 Minuten.</span>
            </label>`
          : nothing}
        ${t.type !== "clock" && t.type !== "text" && t.type !== "status"
          ? html`<div class="field-like">
              <span class="lbl">Icon</span>
              <div class="row">
                <button class="icon-btn" @click=${() => (this.iconsOpen = !this.iconsOpen)} title="Icon wählen">${deviceIcon(t.icon, 22)} ${t.icon ?? "kein Icon"}</button>
                ${t.icon ? html`<button class="icon ghost" title="Icon entfernen" @click=${() => this.patch({ icon: null })}>✕</button>` : nothing}
              </div>
              ${this.iconsOpen
                ? html`<input
                      class="icon-search"
                      type="search"
                      placeholder="Icon suchen (englisch, z. B. lamp, fan, door) …"
                      .value=${this.iconFilter}
                      @input=${(e: Event) => (this.iconFilter = (e.target as HTMLInputElement).value)}
                    />
                    <div class="icon-grid">
                    ${icons.map(
                      (i) => html`<button class=${t.icon === i ? "sel" : ""} title=${i} @click=${() => {
                        this.patch({ icon: i });
                        this.iconsOpen = false;
                      }}>${deviceIcon(i, 20)}</button>`
                    )}
                    ${icons.length ? nothing : html`<span class="muted small" style="grid-column:1/-1">Kein Icon gefunden</span>`}
                  </div>`
                : nothing}
            </div>`
          : nothing}
        <label class="check"><input type="checkbox" .checked=${t.show_title} @change=${(e: Event) => this.patch({ show_title: (e.target as HTMLInputElement).checked })} /> Titel anzeigen</label>
        ${["light", "dimmer", "rgb", "switch", "action"].includes(t.type)
          ? html`<label class="check"><input type="checkbox" .checked=${t.show_state} @change=${(e: Event) => this.patch({ show_state: (e.target as HTMLInputElement).checked })} /> Zustand anzeigen</label>`
          : nothing}
        <label class="check"><input type="checkbox" .checked=${t.show_icon} @change=${(e: Event) => this.patch({ show_icon: (e.target as HTMLInputElement).checked })} /> Icon anzeigen</label>
      </section>

      <section>
        <h3>Darstellung</h3>
        <label class="field"><span>Schriftgröße</span>
          <select @change=${(e: Event) => this.patchStyle({ font_size: (e.target as HTMLSelectElement).value as TileStyle["font_size"] })}>
            ${Object.entries(FONT_LABELS).map(([k, l]) => html`<option value=${k} ?selected=${t.style.font_size === k}>${l}</option>`)}
          </select>
        </label>
        ${this.colorField("Hintergrund", "background", theme.tile_bg)} ${this.colorField("Textfarbe", "color", theme.text)}
        ${this.colorField("Iconfarbe", "icon_color", theme.icon)}
        ${["light", "dimmer", "rgb", "switch", "cover", "thermostat", "media"].includes(t.type)
          ? html`${this.colorField("Farbe wenn „An“", "on_color", theme.on_bg)} ${this.colorField("Text wenn „An“", "on_text_color", theme.on_text)}`
          : nothing}
        <label class="field"><span>Eckenradius: ${t.style.radius}px</span>
          <input type="range" min="0" max="60" .value=${String(t.style.radius)} @change=${(e: Event) => this.patchStyle({ radius: +(e.target as HTMLInputElement).value })} />
        </label>
        <label class="field"><span>Rahmen: ${t.style.border_width}px</span>
          <input type="range" min="0" max="8" .value=${String(t.style.border_width)} @change=${(e: Event) => this.patchStyle({ border_width: +(e.target as HTMLInputElement).value })} />
        </label>
        ${t.style.border_width ? this.colorField("Rahmenfarbe", "border_color", theme.accent) : nothing}
        <label class="field"><span>Deckkraft: ${t.style.opacity} %</span>
          <input type="range" min="10" max="100" step="5" .value=${String(t.style.opacity)} @change=${(e: Event) => this.patchStyle({ opacity: +(e.target as HTMLInputElement).value })} />
        </label>
      </section>

      <section>
        <h3>Größe & Position</h3>
        <div class="geo">
          ${(["x", "y", "w", "h"] as const).map(
            (k) => html`<label class="field"><span>${{ x: "Spalte", y: "Zeile", w: "Breite", h: "Höhe" }[k]}</span>
              <input type="number" min=${k === "w" || k === "h" ? 1 : 1} max=${k === "x" || k === "w" ? this.page.cols : this.page.rows}
                .value=${String(k === "x" || k === "y" ? t[k] + 1 : t[k])}
                @change=${(e: Event) => {
                  const v = parseInt((e.target as HTMLInputElement).value, 10);
                  if (Number.isNaN(v)) return;
                  this.geometry({ [k]: k === "x" || k === "y" ? v - 1 : v });
                }} />
            </label>`
          )}
        </div>
      </section>

      <section>
        <h3>Aktionen</h3>
        ${t.type === "settings"
          ? html`<p class="small">Tippen öffnet das Einstellungsmenü direkt am Display (Helligkeit, Timeout, Nachtmodus, Design, Startseite, Info, Neustart). Alternativ: 3 Sekunden auf die Uhr oben rechts drücken.</p>`
          : this.actionEditor("tap_action", "Beim Tippen")}
        ${this.actionEditor("hold_action", "Beim langen Tippen")}
        <p class="muted small">Aktionen werden in Home Assistant ausgeführt – das Display meldet nur, welche Kachel berührt wurde.</p>
      </section>

      <section>
        <h3>Sichtbarkeit</h3>
        ${this.visibilityEditor()}
      </section>
    `;
  }

  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
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
    `,
  ];
}

const GRID_PRESETS: [number, number][] = [
  [2, 2],
  [2, 3],
  [3, 3],
  [3, 4],
  [4, 4],
];

@customElement("gs-page-props")
export class GsPageProps extends LitElement {
  @property({ attribute: false }) info!: StudioInfo;
  @property({ attribute: false }) layout!: Layout;
  @property({ attribute: false }) page!: Page;

  private commit(next: Layout) {
    fireEvent(this, "gs-commit", next);
  }

  private grid(cols: number, rows: number) {
    const res = setGrid(this.layout, this.page.id, cols, rows);
    if (res.ok) this.commit(res.layout);
    else toast(this, res.reason ?? "Nicht möglich", "error");
  }

  render() {
    const p = this.page;
    const theme = this.info.themes[this.layout.settings.theme] ?? Object.values(this.info.themes)[0];
    const patch = (patch: Partial<Page>) => {
      const next = clone(this.layout);
      Object.assign(next.pages.find((x) => x.id === p.id)!, patch);
      this.commit(next);
    };
    return html`
      <h2>Seite „${p.name}“</h2>
      <label class="field"><span>Name</span>
        <input maxlength="32" .value=${p.name} @change=${(e: Event) => patch({ name: (e.target as HTMLInputElement).value.trim() || p.name })} />
      </label>
      <div class="color-row">
        <span>Hintergrund</span>
        <input type="color" .value=${p.background ?? theme.page_bg} @input=${(e: Event) => patch({ background: (e.target as HTMLInputElement).value.toUpperCase() })} />
        ${p.background ? html`<button class="icon ghost" title="Design-Standard" @click=${() => patch({ background: null })}>↺</button>` : html`<span class="muted small">Design</span>`}
      </div>
      <div class="field-like">
        <span class="lbl">Raster (Spalten × Zeilen)</span>
        <div class="presets">
          ${GRID_PRESETS.map(
            ([c, r]) => html`<button class=${p.cols === c && p.rows === r ? "sel" : ""} @click=${() => this.grid(c, r)}>${c} × ${r}</button>`
          )}
        </div>
        <div class="custom">
          <label class="field"><span>Spalten</span>
            <input type="number" min="1" max=${this.info.limits.grid} .value=${String(p.cols)} @change=${(e: Event) => this.grid(+(e.target as HTMLInputElement).value, p.rows)} />
          </label>
          <label class="field"><span>Zeilen</span>
            <input type="number" min="1" max=${this.info.limits.grid} .value=${String(p.rows)} @change=${(e: Event) => this.grid(p.cols, +(e.target as HTMLInputElement).value)} />
          </label>
        </div>
        <p class="muted small">Maximal ${this.info.limits.grid}×${this.info.limits.grid} – darüber werden Kacheln auf 4" zu klein für eine sichere Touchbedienung.</p>
      </div>
    `;
  }

  static styles = [
    sharedStyles,
    css`
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
    `,
  ];
}

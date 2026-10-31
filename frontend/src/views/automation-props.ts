import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { friendlyName } from "../entities";
import { clone, newId } from "../model";
import type { Hass, Layout, NightSettings, PageRule, ScreensaverSettings } from "../types";
import { fireEvent, sharedStyles } from "../ui";

export const DEFAULT_NIGHT: NightSettings = { enabled: false, mode: "time", start: "22:00", end: "06:30", brightness: 15, dim: 30, page: null };
export const DEFAULT_SCREENSAVER: ScreensaverSettings = { enabled: false, after: 120, entities: [] };

/** Smart page switching, night mode and screensaver (evaluated by Home Assistant / the display). */
@customElement("gs-automation-props")
export class GsAutomationProps extends LitElement {
  @property({ attribute: false }) hass!: Hass;
  @property({ attribute: false }) layout!: Layout;

  private get night(): NightSettings {
    return { ...DEFAULT_NIGHT, ...(this.layout.settings.night ?? {}) };
  }

  private get screensaver(): ScreensaverSettings {
    return { ...DEFAULT_SCREENSAVER, ...(this.layout.settings.screensaver ?? {}) };
  }

  private get rules(): PageRule[] {
    return this.layout.settings.rules ?? [];
  }

  private commit(patch: Partial<Layout["settings"]>) {
    const next = clone(this.layout);
    next.settings = { ...next.settings, ...patch };
    fireEvent(this, "gs-commit", next);
  }

  private setRule(index: number, patch: Partial<PageRule>) {
    this.commit({ rules: this.rules.map((r, i) => (i === index ? { ...r, ...patch } : r)) });
  }

  private addRule() {
    const rule: PageRule = { id: newId("r"), name: "", enabled: true, type: "time", at: "07:00", page: this.layout.pages[0].id };
    this.commit({ rules: [...this.rules, rule] });
  }

  private pageSelect(value: string | null, onChange: (v: string | null) => void, allowNone = false) {
    return html`<select @change=${(e: Event) => onChange((e.target as HTMLSelectElement).value || null)}>
      ${allowNone ? html`<option value="" ?selected=${!value}>– keine –</option>` : nothing}
      ${this.layout.pages.map((p) => html`<option value=${p.id} ?selected=${p.id === value}>${p.name}</option>`)}
    </select>`;
  }

  render() {
    const night = this.night;
    const ss = this.screensaver;
    return html`
      <datalist id="gs-auto-entities">
        ${Object.values(this.hass.states).map((s) => html`<option value=${s.entity_id}>${friendlyName(s)}</option>`)}
      </datalist>
      <p class="muted small">Gilt nach dem nächsten „Auf Display übertragen“. Home Assistant wertet die Regeln aus, ohne YAML.</p>

      <section>
        <h3>Intelligenter Seitenwechsel</h3>
        ${this.rules.length === 0 ? html`<p class="muted small">Noch keine Regeln. Beispiel: „Wenn die Klingel läutet → Seite Tür“ oder „Um 07:00 → Seite Morgen“.</p>` : nothing}
        ${this.rules.map(
          (r, i) => html`<div class="rule ${r.enabled ? "" : "off"}">
            <div class="row">
              <input type="checkbox" title="Regel aktiv" .checked=${r.enabled} @change=${(e: Event) => this.setRule(i, { enabled: (e.target as HTMLInputElement).checked })} />
              <input class="grow" placeholder="Name (optional)" maxlength="40" .value=${r.name} @change=${(e: Event) => this.setRule(i, { name: (e.target as HTMLInputElement).value })} />
              <button class="icon ghost" title="Regel löschen" @click=${() => this.commit({ rules: this.rules.filter((_, j) => j !== i) })}>✕</button>
            </div>
            <div class="grid2">
              <label class="field"><span>Auslöser</span>
                <select @change=${(e: Event) => {
                  const type = (e.target as HTMLSelectElement).value as PageRule["type"];
                  this.setRule(i, type === "time" ? { type, at: r.at ?? "07:00" } : { type, entity: r.entity ?? "", operator: r.operator ?? "eq", value: r.value ?? "on" });
                }}>
                  <option value="time" ?selected=${r.type === "time"}>Uhrzeit (täglich)</option>
                  <option value="state" ?selected=${r.type === "state"}>Zustand einer Entität</option>
                </select>
              </label>
              <label class="field"><span>Seite anzeigen</span>${this.pageSelect(r.page, (v) => this.setRule(i, { page: v ?? this.layout.pages[0].id }))}</label>
            </div>
            ${r.type === "time"
              ? html`<label class="field"><span>Um</span><input type="time" .value=${r.at ?? "07:00"} @change=${(e: Event) => this.setRule(i, { at: (e.target as HTMLInputElement).value })} /></label>`
              : html`<div class="cond">
                  <input list="gs-auto-entities" placeholder="Entität, z. B. binary_sensor.klingel" .value=${r.entity ?? ""} @change=${(e: Event) => this.setRule(i, { entity: (e.target as HTMLInputElement).value.trim() })} />
                  <select @change=${(e: Event) => this.setRule(i, { operator: (e.target as HTMLSelectElement).value as PageRule["operator"] })}>
                    ${(["eq", "ne", "gt", "lt"] as const).map((o) => html`<option value=${o} ?selected=${(r.operator ?? "eq") === o}>${{ eq: "wird", ne: "wird nicht", gt: "größer", lt: "kleiner" }[o]}</option>`)}
                  </select>
                  <input placeholder="Wert" .value=${r.value ?? ""} @change=${(e: Event) => this.setRule(i, { value: (e.target as HTMLInputElement).value })} />
                </div>`}
          </div>`
        )}
        <button @click=${() => this.addRule()} ?disabled=${this.rules.length >= 20}>＋ Regel hinzufügen</button>
        <p class="muted small">Regeln wecken das Display und lösen nur beim Wechsel in den Zustand aus, nicht dauerhaft.</p>
      </section>

      <section>
        <h3>Nachtmodus</h3>
        <label class="check"><input type="checkbox" .checked=${night.enabled} @change=${(e: Event) => this.commit({ night: { ...night, enabled: (e.target as HTMLInputElement).checked } })} /> Nachtmodus verwenden</label>
        ${night.enabled
          ? html`<label class="field"><span>Zeitraum</span>
                <select @change=${(e: Event) => this.commit({ night: { ...night, mode: (e.target as HTMLSelectElement).value as NightSettings["mode"] } })}>
                  <option value="time" ?selected=${night.mode === "time"}>Feste Uhrzeiten</option>
                  <option value="sun" ?selected=${night.mode === "sun"}>Sonnenuntergang bis Sonnenaufgang</option>
                </select>
              </label>
              ${night.mode === "time"
                ? html`<div class="grid2">
                    <label class="field"><span>Von</span><input type="time" .value=${night.start} @change=${(e: Event) => this.commit({ night: { ...night, start: (e.target as HTMLInputElement).value } })} /></label>
                    <label class="field"><span>Bis</span><input type="time" .value=${night.end} @change=${(e: Event) => this.commit({ night: { ...night, end: (e.target as HTMLInputElement).value } })} /></label>
                  </div>`
                : html`<p class="muted small">Nutzt <code>sun.sun</code> aus Home Assistant.</p>`}
              <label class="field"><span>Maximale Helligkeit nachts: ${night.brightness} %</span>
                <input type="range" min="1" max="100" .value=${String(night.brightness)} @change=${(e: Event) => this.commit({ night: { ...night, brightness: +(e.target as HTMLInputElement).value } })} />
              </label>
              <label class="field"><span>Zusätzlich abdunkeln: ${night.dim} %</span>
                <input type="range" min="0" max="80" step="5" .value=${String(night.dim)} @change=${(e: Event) => this.commit({ night: { ...night, dim: +(e.target as HTMLInputElement).value } })} />
              </label>
              <label class="field"><span>Bei Beginn zu Seite wechseln</span>${this.pageSelect(night.page, (v) => this.commit({ night: { ...night, page: v } }), true)}</label>`
          : nothing}
      </section>

      <section>
        <h3>Bildschirmschoner</h3>
        <label class="check"><input type="checkbox" .checked=${ss.enabled} @change=${(e: Event) => this.commit({ screensaver: { ...ss, enabled: (e.target as HTMLInputElement).checked } })} /> Uhr & Werte bei Inaktivität zeigen</label>
        ${ss.enabled
          ? html`<label class="field"><span>Nach</span>
                <select @change=${(e: Event) => this.commit({ screensaver: { ...ss, after: +(e.target as HTMLSelectElement).value } })}>
                  ${[[30, "30 Sekunden"], [60, "1 Minute"], [120, "2 Minuten"], [300, "5 Minuten"], [900, "15 Minuten"]].map(([v, l]) => html`<option value=${v} ?selected=${ss.after === v}>${l}</option>`)}
                </select>
              </label>
              ${[0, 1].map(
                (i) => html`<label class="field"><span>Wert ${i + 1} (optional)</span>
                  <input list="gs-auto-entities" placeholder="z. B. sensor.aussentemperatur" .value=${ss.entities[i] ?? ""}
                    @change=${(e: Event) => {
                      const ents = [...ss.entities];
                      ents[i] = (e.target as HTMLInputElement).value.trim();
                      this.commit({ screensaver: { ...ss, entities: ents.filter(Boolean).slice(0, 2) } });
                    }} />
                </label>`
              )}
              <p class="muted small">Antippen beendet den Bildschirmschoner, ohne eine Kachel auszulösen. Er erscheint vor dem Dimmen, wenn seine Zeit kürzer ist als der Bildschirm-Timeout.</p>`
          : nothing}
      </section>
    `;
  }

  static styles = [
    sharedStyles,
    css`
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
    `,
  ];
}

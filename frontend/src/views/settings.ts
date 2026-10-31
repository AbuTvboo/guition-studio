import { css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { errorText } from "../api";
import type { DisplaySettings, Layout } from "../types";
import "./automation-props";
import { relTime, toast } from "../ui";
import { StudioView } from "./base";

@customElement("gs-settings")
export class GsSettings extends StudioView {
  @property({ attribute: false }) displayId: string | null = null;
  @state() private selected: string | null = null;
  @state() private layout: Layout | null = null;
  @state() private debug = false;
  @state() private dirty = false;
  @state() private busy = false;

  private get currentId() {
    return this.selected ?? this.displayId ?? this.displays[0]?.id ?? null;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.api.log().then((r) => (this.debug = r.debug)).catch(() => undefined);
  }

  protected updated(changed: Map<string, unknown>) {
    if ((changed.has("displays") || changed.has("selected") || changed.has("displayId")) && this.currentId && (!this.layout || this.loadedId !== this.currentId)) this.load();
  }

  private loadedId: string | null = null;

  private async load() {
    const id = this.currentId;
    if (!id) return;
    this.loadedId = id;
    this.layout = (await this.api.getLayout(id)).layout;
    this.dirty = false;
  }

  private set(patch: Partial<DisplaySettings>) {
    if (!this.layout) return;
    this.layout = { ...this.layout, settings: { ...this.layout.settings, ...patch } };
    this.dirty = true;
  }

  private async save(apply: boolean) {
    if (!this.layout || !this.currentId) return;
    this.busy = true;
    try {
      if (apply) {
        const res = await this.api.apply(this.currentId, this.layout);
        this.layout = { ...this.layout, revision: res.revision };
        toast(this, "Einstellungen auf dem Display übernommen ✓", "ok");
      } else {
        await this.api.saveLayout(this.currentId, this.layout);
        toast(this, "Als Entwurf gespeichert", "ok");
      }
      this.dirty = false;
      this.refreshAll();
    } catch (err) {
      toast(this, errorText(err), "error");
    } finally {
      this.busy = false;
    }
  }

  private async rename(name: string) {
    if (!this.currentId || !name.trim()) return;
    await this.api.updateDisplay(this.currentId, { name: name.trim() });
    this.refreshAll();
  }

  private async setDebug(v: boolean) {
    await this.api.setDebug(v);
    this.debug = v;
  }

  render() {
    const d = this.displays.find((x) => x.id === this.currentId);
    const s = this.layout?.settings;
    return html`
      <div class="page-head">
        <h1>Einstellungen</h1><span class="spacer"></span>
        ${this.displays.length
          ? html`<select style="width:auto" @change=${(e: Event) => (this.selected = (e.target as HTMLSelectElement).value)}>
              ${this.displays.map((x) => html`<option value=${x.id} ?selected=${x.id === this.currentId}>${x.name}</option>`)}
            </select>`
          : nothing}
      </div>
      ${!d || !s
        ? html`<div class="card"><p class="muted">Kein Display ausgewählt.</p></div>`
        : html`<div class="grid">
            <div class="card">
              <h2>Display</h2>
              <label class="field"><span>Displayname</span><input .value=${d.name} @change=${(e: Event) => this.rename((e.target as HTMLInputElement).value)} /></label>
              <table class="small">
                <tr><th>WLAN-/Verbindungsstatus</th><td><span class="chip ${d.online ? "ok" : "error"}">${d.online ? "verbunden" : "getrennt"}</span></td></tr>
                <tr><th>Firmwareversion</th><td>${d.firmware ?? "–"}</td></tr>
                <tr><th>Zuletzt gesehen</th><td>${relTime(d.last_seen)}</td></tr>
                <tr><th>Freier RAM / PSRAM</th><td>${d.heap != null ? `${Math.round(d.heap / 1024)} KB / ${Math.round((d.psram ?? 0) / 1024)} KB` : "–"}</td></tr>
              </table>
              <div class="row" style="margin-top:10px">
                <button ?disabled=${!d.online} @click=${() => this.api.command(d.id, "reboot").then(() => toast(this, "Neustart ausgelöst", "ok"), (e) => toast(this, errorText(e), "error"))}>⟳ Neustart</button>
                <button @click=${() => this.go("diagnostics")}>Diagnosedaten</button>
              </div>
            </div>
            <div class="card">
              <h2>Anzeige</h2>
              <label class="field"><span>Helligkeit: ${s.brightness} %</span><input type="range" min="5" max="100" .value=${String(s.brightness)} @input=${(e: Event) => this.set({ brightness: +(e.target as HTMLInputElement).value })} /></label>
              <label class="field"><span>Standby-Helligkeit: ${s.standby_brightness} %</span><input type="range" min="0" max="100" .value=${String(s.standby_brightness)} @input=${(e: Event) => this.set({ standby_brightness: +(e.target as HTMLInputElement).value })} /></label>
              <label class="field"><span>Bildschirm-Timeout (Sekunden, 0 = nie)</span><input type="number" min="0" max="86400" .value=${String(s.timeout)} @change=${(e: Event) => this.set({ timeout: +(e.target as HTMLInputElement).value })} /></label>
              <label class="field"><span>Design</span>
                <select @change=${(e: Event) => this.set({ theme: (e.target as HTMLSelectElement).value })}>
                  ${Object.entries(this.info.themes).map(([k, t]) => html`<option value=${k} ?selected=${k === s.theme}>${t.name}${k === "modern_light" || k === "pastel" ? " (hell)" : " (dunkel)"}</option>`)}
                </select>
              </label>
              <label class="field"><span>Standardseite</span>
                <select @change=${(e: Event) => this.set({ home_page: (e.target as HTMLSelectElement).value })}>
                  ${this.layout!.pages.map((p) => html`<option value=${p.id} ?selected=${p.id === s.home_page}>${p.name}</option>`)}
                </select>
              </label>
            </div>
            <div class="card">
              <h2>Bedienung</h2>
              <label class="check"><input type="checkbox" .checked=${s.swipe} @change=${(e: Event) => this.set({ swipe: (e.target as HTMLInputElement).checked })} /> Seitenwechsel durch Wischen</label>
              <label class="check"><input type="checkbox" .checked=${s.show_dots} @change=${(e: Event) => this.set({ show_dots: (e.target as HTMLInputElement).checked })} /> Seitenpunkte anzeigen</label>
              <label class="check"><input type="checkbox" .checked=${s.show_header} @change=${(e: Event) => this.set({ show_header: (e.target as HTMLInputElement).checked })} /> Kopfzeile anzeigen</label>
              <label class="field"><span>Sprache der Displaytexte</span>
                <select @change=${(e: Event) => this.set({ language: (e.target as HTMLSelectElement).value as "de" | "en" })}>
                  <option value="de" ?selected=${s.language === "de"}>Deutsch</option>
                  <option value="en" ?selected=${s.language === "en"}>English (nur Gerätetexte)</option>
                </select>
              </label>
              <label class="field"><span>Bildschirmrotation</span><select disabled><option>0° – nicht verfügbar</option></select></label>
              <p class="small muted">Rotation und Touch-Empfindlichkeit erfordern einen eigenen Firmware-Build (siehe docs/FIRMWARE.md) und sind hier deshalb gesperrt.</p>
            </div>
          </div>
          <div class="card auto-card">
            <h2>Bildschirmschoner, Diashow, Nachtmodus & Seitenwechsel</h2>
            <gs-automation-props
              .hass=${this.hass}
              .api=${this.api}
              .layout=${this.layout}
              @gs-commit=${(e: CustomEvent<Layout>) => {
                this.layout = e.detail;
                this.dirty = true;
              }}
            ></gs-automation-props>
          </div>
          <div class="row actions">
            <span class="muted small">${this.dirty ? "Ungespeicherte Änderungen" : "Alle Änderungen gespeichert"}</span><span class="spacer"></span>
            <button ?disabled=${!this.dirty || this.busy} @click=${() => this.save(false)}>Als Entwurf speichern</button>
            <button class="primary" ?disabled=${!d.linked || this.busy} @click=${() => this.save(true)}>${this.busy ? html`<span class="spinner"></span>` : nothing} Speichern & auf Display übernehmen</button>
          </div>`}
      <section class="card" style="margin-top:24px">
        <h2>Guition Studio</h2>
        <label class="check"><input type="checkbox" .checked=${this.debug} @change=${(e: Event) => this.setDebug((e.target as HTMLInputElement).checked)} /> Debug-Modus (protokolliert Seitenwechsel und Zustandsübertragungen)</label>
        <p class="small muted">Firmware-Quelle: <code>${this.info.firmware_repo}</code> – änderbar unter Einstellungen → Geräte & Dienste → Guition Studio → Konfigurieren.<br />
        Oberflächensprache: Deutsch (weitere Sprachen geplant).</p>
      </section>
    `;
  }

  static styles = [
    ...StudioView.styles,
    css`
      .actions {
        margin-top: 16px;
        position: sticky;
        bottom: 0;
        background: var(--gs-bg);
        padding: 10px 0;
      }
      .auto-card {
        margin-top: 16px;
        max-width: 640px;
      }
      th {
        width: 50%;
      }
    `,
  ];
}


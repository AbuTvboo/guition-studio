import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { StudioApi } from "../api";
import { PRAYERS, detectPrayerSensors, friendlyName } from "../entities";
import { clone, newId } from "../model";
import type { Hass, Layout, MixView, NightSettings, PageRule, ScreensaverSettings } from "../types";
import { fireEvent, sharedStyles } from "../ui";
import "./entity-picker";

export const DEFAULT_NIGHT: NightSettings = { enabled: false, mode: "time", start: "22:00", end: "06:30", brightness: 15, dim: 30, page: null };
/** Football competitions (ESPN codes, = FOOTBALL_LEAGUES in layout.py). */
const FOOTBALL_LEAGUES = [
  { code: "ger.1", name: "1. Bundesliga" },
  { code: "ger.2", name: "2. Bundesliga" },
  { code: "tur.1", name: "Süper Lig" },
  { code: "esp.1", name: "LaLiga" },
  { code: "eng.1", name: "Premier League" },
  { code: "ita.1", name: "Serie A" },
  { code: "fra.1", name: "Ligue 1" },
  { code: "uefa.champions", name: "Champions League" },
  { code: "uefa.nations", name: "Nations League" },
  { code: "uefa.euro", name: "EM" },
  { code: "uefa.euroq", name: "EM-Qualifikation" },
  { code: "fifa.world", name: "WM" },
  { code: "fifa.worldq.uefa", name: "WM-Qualifikation (Europa)" },
];
const DEFAULT_LEAGUES = ["ger.1", "tur.1", "esp.1"];

/** Views that can alternate in mix mode (= MIX_VIEWS in layout.py). */
const MIX_VIEWS: { key: MixView; label: string }[] = [
  { key: "prayer", label: "Gebetszeiten" },
  { key: "football", label: "Fußball" },
];

/** Data views the screensaver shows (mix: the chosen ones; old settings: prayer + football). */
export function screensaverViews(ss: ScreensaverSettings): MixView[] {
  if (ss.mode === "mix") {
    const chosen = ss.mix_views ?? ["prayer", "football"];
    return MIX_VIEWS.map((v) => v.key).filter((k) => chosen.includes(k));
  }
  return ss.mode === "prayer" || ss.mode === "football" ? [ss.mode] : [];
}

/** Calligraphy backgrounds built into the firmware (keys = PRAYER_BACKGROUNDS in layout.py). */
const PRAYER_BACKGROUNDS = [
  { key: "basmala", label: "Basmala", hint: "Mihrab-Bogen, Sternmuster und Basmala" },
  { key: "mosque", label: "Moschee", hint: "Sternenhimmel mit Mondsichel, Moschee-Silhouette und „Allah“-Kalligraphie" },
  { key: "none", label: "Schlicht", hint: "Schwarzer Hintergrund" },
];

export const DEFAULT_SCREENSAVER: ScreensaverSettings = {
  enabled: false,
  after: 120,
  entities: [],
  mode: "clock",
  folder: "guition_studio",
  interval: 15,
  order: "random",
  fit: "cover",
  show_clock: true,
};

/** Smart page switching, night mode and screensaver (evaluated by Home Assistant / the display). */
@customElement("gs-automation-props")
export class GsAutomationProps extends LitElement {
  @property({ attribute: false }) hass!: Hass;
  @property({ attribute: false }) layout!: Layout;
  @property({ attribute: false }) api?: StudioApi;
  @state() private folders: { folder: string; count: number }[] | null = null;
  @state() private mediaRoot = "";

  private async loadFolders() {
    if (!this.api) return;
    try {
      const res = await this.api.slideFolders();
      this.folders = res.folders;
      this.mediaRoot = res.root;
    } catch {
      this.folders = [];
    }
  }

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
              <label class="field"><span>Anzeige</span>
                <select @change=${(e: Event) => {
                  const mode = (e.target as HTMLSelectElement).value as ScreensaverSettings["mode"];
                  const views = screensaverViews({ ...ss, mode });
                  const prayer = views.includes("prayer") && !Object.values(ss.prayer ?? {}).some(Boolean) ? detectPrayerSensors(this.hass) : ss.prayer;
                  this.commit({ screensaver: { ...ss, mode, prayer } });
                  if (mode === "slideshow" && !this.folders) this.loadFolders();
                }}>
                  <option value="clock" ?selected=${ss.mode !== "slideshow"}>Uhr, Datum & Werte</option>
                  <option value="slideshow" ?selected=${ss.mode === "slideshow"}>Diashow (Bilder aus Home Assistant)</option>
                  <option value="prayer" ?selected=${ss.mode === "prayer"}>Islamische Gebetszeiten</option>
                  <option value="football" ?selected=${ss.mode === "football"}>Fußball – heutige Spiele</option>
                  <option value="mix" ?selected=${ss.mode === "mix"}>Gebetszeiten & Fußball im Wechsel</option>
                </select>
              </label>
              ${ss.mode === "slideshow" ? this.renderSlideshow(ss) : nothing}
              ${ss.mode === "mix" ? this.renderMix(ss) : nothing}
              ${screensaverViews(ss).includes("football") ? this.renderFootball(ss) : nothing}
              ${screensaverViews(ss).includes("prayer") ? this.renderPrayer(ss) : nothing}
              ${ss.mode === "clock" || !ss.mode ? [0, 1].map(
                (i) => html`<label class="field"><span>Wert ${i + 1} (optional)</span>
                  <input list="gs-auto-entities" placeholder="z. B. sensor.aussentemperatur" .value=${ss.entities[i] ?? ""}
                    @change=${(e: Event) => {
                      const ents = [...ss.entities];
                      ents[i] = (e.target as HTMLInputElement).value.trim();
                      this.commit({ screensaver: { ...ss, entities: ents.filter(Boolean).slice(0, 2) } });
                    }} />
                </label>`
              ) : nothing}
              <p class="muted small">Antippen beendet den Bildschirmschoner, ohne eine Kachel auszulösen. Er erscheint vor dem Dimmen, wenn seine Zeit kürzer ist als der Bildschirm-Timeout.</p>`
          : nothing}
      </section>
    `;
  }

  protected firstUpdated(): void {
    if (this.screensaver.mode === "slideshow") this.loadFolders();
  }

  private renderMix(ss: ScreensaverSettings) {
    const views = screensaverViews(ss);
    const toggle = (key: MixView, on: boolean) => {
      const next = MIX_VIEWS.map((v) => v.key).filter((k) => (k === key ? on : views.includes(k)));
      const patch: Partial<ScreensaverSettings> = { mix_views: next };
      if (key === "prayer" && on && !Object.values(ss.prayer ?? {}).some(Boolean)) patch.prayer = detectPrayerSensors(this.hass);
      this.commit({ screensaver: { ...ss, ...patch } });
    };
    return html`<div class="field"><span class="muted small">Im Wechsel zeigen</span>
        <div class="league-grid">
          ${MIX_VIEWS.map(
            (v) => html`<label class="check"><input type="checkbox" .checked=${views.includes(v.key)} @change=${(e: Event) => toggle(v.key, (e.target as HTMLInputElement).checked)} /> ${v.label}</label>`
          )}
        </div>
      </div>
      ${views.length < 2 ? html`<div class="notice warn small">Bitte mindestens zwei Anzeigen auswählen.</div>` : nothing}
      <label class="field"><span>Wechsel alle</span>
      <select @change=${(e: Event) => this.commit({ screensaver: { ...ss, mix_interval: +(e.target as HTMLSelectElement).value } })}>
        ${[[10, "10 Sekunden"], [20, "20 Sekunden"], [30, "30 Sekunden"], [60, "1 Minute"], [120, "2 Minuten"]].map(
          ([v, l]) => html`<option value=${v} ?selected=${(ss.mix_interval ?? 20) === v}>${l}</option>`
        )}
      </select>
    </label>`;
  }

  private renderFootball(ss: ScreensaverSettings) {
    const leagues = ss.leagues ?? DEFAULT_LEAGUES;
    const toggle = (code: string, on: boolean) =>
      this.commit({ screensaver: { ...ss, leagues: FOOTBALL_LEAGUES.map((l) => l.code).filter((c) => (c === code ? on : leagues.includes(c))) } });
    return html`<label class="field"><span>Sprache</span>
        <select @change=${(e: Event) => this.commit({ screensaver: { ...ss, football_lang: (e.target as HTMLSelectElement).value as "de" | "tr" } })}>
          <option value="de" ?selected=${ss.football_lang !== "tr"}>Deutsch (HEUTE, ENDE, Deutschland …)</option>
          <option value="tr" ?selected=${ss.football_lang === "tr"}>Türkçe (BUGÜN, BİTTİ, Almanya …)</option>
        </select>
      </label>
      <div class="field"><span class="muted small">Ligen</span>
        <div class="league-grid">
          ${FOOTBALL_LEAGUES.map(
            (l) => html`<label class="check"><input type="checkbox" .checked=${leagues.includes(l.code)} @change=${(e: Event) => toggle(l.code, (e.target as HTMLInputElement).checked)} /> ${l.name}</label>`
          )}
        </div>
      </div>
      ${leagues.length === 0 ? html`<div class="notice warn small">Bitte mindestens eine Liga auswählen.</div>` : nothing}
      <div class="notice small">
        Home Assistant holt die Spiele von ESPN (öffentlich, ohne Konto) – alle 10 Minuten, während Spiele laufen jede Minute.
        Gezeigt werden die heutigen Spiele mit Anstoß, Live-Spielstand und Minute; an Tagen ohne Spiele die nächsten Spiele mit Wochentag.
        Nations League, EM, WM und die Qualifikationen erscheinen nur, wenn dort gerade gespielt wird (z. B. in Länderspielpausen) – du kannst sie also dauerhaft angehakt lassen.
        Darstellung wie im Sport-TV: Liga-Balken in Ligafarbe, je Spiel eine Karte mit Vereinslogos und Ergebnis-Box (live rot mit Minute). Passen nicht alle Spiele auf eine Seite, wird alle 8 Sekunden weitergeblättert.
      </div>`;
  }

  private renderPrayerBackgrounds(ss: ScreensaverSettings) {
    const current = ss.prayer_bg === false ? "none" : ss.prayer_bg === true || !ss.prayer_bg ? "basmala" : ss.prayer_bg;
    return html`<div class="field"><span class="muted small">Hintergrund</span>
      <div class="bg-grid">
        ${PRAYER_BACKGROUNDS.map(
          (b) => html`<button class="bg-card ${current === b.key ? "active" : ""}" title=${b.hint} @click=${() => this.commit({ screensaver: { ...ss, prayer_bg: b.key } })}>
            ${b.key === "none" ? html`<span class="bg-none">Aa</span>` : html`<img src="/guition_studio_static/prayer/${b.key}.jpg" alt="" loading="lazy" />`}
            <span>${b.label}</span>
          </button>`
        )}
      </div>
    </div>`;
  }

  private renderPrayer(ss: ScreensaverSettings) {
    const prayer = ss.prayer ?? {};
    const set = (next: ScreensaverSettings["prayer"]) => this.commit({ screensaver: { ...ss, prayer: next } });
    const found = Object.values(prayer).filter(Boolean).length;
    return html`<div class="notice small">
        Die Zeiten kommen aus der Home-Assistant-Integration <b>Islamic Prayer Times</b>
        (Einstellungen → Geräte & Dienste → Integration hinzufügen). Berechnungsmethode, Schule (Asr) und Standort stellst du dort ein.
        Das Display zeigt Uhrzeit, Datum und alle Zeiten. Das nächste Gebet wird hervorgehoben, darüber steht ein Countdown.
      </div>
      <label class="field"><span>Sprache der Namen</span>
          <select @change=${(e: Event) => this.commit({ screensaver: { ...ss, prayer_lang: (e.target as HTMLSelectElement).value as "de" | "tr" } })}>
            <option value="de" ?selected=${ss.prayer_lang !== "tr"}>Deutsch (Fajr, Dhuhr, Asr …)</option>
            <option value="tr" ?selected=${ss.prayer_lang === "tr"}>Türkçe (İmsak, Öğle, İkindi …)</option>
          </select>
        </label>
      ${this.renderPrayerBackgrounds(ss)}
      ${found === 0 ? html`<div class="notice warn small">Keine Gebetszeit-Sensoren gefunden. Bitte die Integration einrichten oder die Sensoren unten von Hand wählen.</div>` : nothing}
      ${PRAYERS.map(
        (p) => html`<label class="field"><span>${p.label}${p.key === "sunrise" ? " (optional, kein Gebet)" : ""}</span>
          <gs-entity-picker
            .hass=${this.hass}
            .value=${prayer[p.key] ?? null}
            .domains=${["sensor"]}
            placeholder="Sensor suchen (z. B. ${p.label.toLowerCase()}) …"
            @gs-entity=${(e: CustomEvent<string | null>) => {
              const next = { ...prayer };
              if (e.detail) next[p.key] = e.detail;
              else delete next[p.key];
              set(next);
            }}
          ></gs-entity-picker>
        </label>`
      )}
      <button @click=${() => set(detectPrayerSensors(this.hass))}>Automatisch erkennen</button>`;
  }

  private renderSlideshow(ss: ScreensaverSettings) {
    const set = (patch: Partial<ScreensaverSettings>) => this.commit({ screensaver: { ...ss, ...patch } });
    const current = this.folders?.find((f) => f.folder === ss.folder);
    return html`<label class="field"><span>Bilderordner (in „Medien → Meine Medien“)</span>
        ${this.folders === null
          ? html`<span><span class="spinner"></span> Ordner werden geladen …</span>`
          : html`<select @change=${(e: Event) => set({ folder: (e.target as HTMLSelectElement).value })}>
              ${!current ? html`<option selected value=${ss.folder ?? ""}>${ss.folder || "Hauptordner"} (nicht gefunden)</option>` : nothing}
              ${this.folders.map((f) => html`<option value=${f.folder} ?selected=${f.folder === ss.folder}>${f.folder || "Hauptordner"} – ${f.count} Bild${f.count === 1 ? "" : "er"}</option>`)}
            </select>`}
      </label>
      ${current && current.count === 0 ? html`<div class="notice warn small">In diesem Ordner liegen keine Bilder.</div>` : nothing}
      <div class="notice small">
        Bilder hochladen: In Home Assistant links <b>Medien → Meine Medien</b> öffnen, einen Ordner (z. B. <code>guition_studio</code>) anlegen und Fotos hineinziehen.
        Home Assistant verkleinert jedes Bild auf 480 × 480 und schickt immer nur <b>ein</b> Bild ans Display – im Display wird nichts gespeichert.
        ${this.mediaRoot ? html`<br /><span class="muted">Speicherort: <code>${this.mediaRoot}</code></span>` : nothing}
        <br /><button style="margin-top:6px" @click=${() => this.loadFolders()}>↻ Ordner neu laden</button>
      </div>
      <div class="grid2">
        <label class="field"><span>Bildwechsel</span>
          <select @change=${(e: Event) => set({ interval: +(e.target as HTMLSelectElement).value })}>
            ${[[5, "5 s"], [10, "10 s"], [15, "15 s"], [30, "30 s"], [60, "1 min"], [300, "5 min"]].map(([v, l]) => html`<option value=${v} ?selected=${(ss.interval ?? 15) === v}>${l}</option>`)}
          </select>
        </label>
        <label class="field"><span>Reihenfolge</span>
          <select @change=${(e: Event) => set({ order: (e.target as HTMLSelectElement).value as ScreensaverSettings["order"] })}>
            <option value="random" ?selected=${ss.order !== "sequential"}>Zufällig</option>
            <option value="sequential" ?selected=${ss.order === "sequential"}>Der Reihe nach</option>
          </select>
        </label>
      </div>
      <label class="field"><span>Bildausschnitt</span>
        <select @change=${(e: Event) => set({ fit: (e.target as HTMLSelectElement).value as ScreensaverSettings["fit"] })}>
          <option value="cover" ?selected=${ss.fit !== "contain"}>Ausfüllen (Ränder werden beschnitten)</option>
          <option value="contain" ?selected=${ss.fit === "contain"}>Ganzes Bild (mit schwarzen Rändern)</option>
        </select>
      </label>
      <label class="check"><input type="checkbox" .checked=${ss.show_clock !== false} @change=${(e: Event) => set({ show_clock: (e.target as HTMLInputElement).checked })} /> Uhrzeit & Datum über den Bildern</label>`;
  }

  static styles = [
    sharedStyles,
    css`
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
    `,
  ];
}

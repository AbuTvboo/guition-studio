import { css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { downloadJson, errorText, pickJsonFile } from "../api";
import { buildLibrary, tileFromEntity } from "../entities";
import { clone, findFreeSpot, makePage, makeTile, newId, MAX_PAGES } from "../model";
import type { Layout, Page, Template, Tile } from "../types";
import { confirmDialog, fireEvent, promptDialog, renderScreen, screenStyles, toast } from "../ui";
import { StudioView } from "./base";

/** Fresh ids for pages/tiles while keeping navigation targets consistent. */
export function regenerateIds(layout: Layout): Layout {
  const next = clone(layout);
  const map = new Map<string, string>();
  for (const p of next.pages) {
    const id = newId("p");
    map.set(p.id, id);
    p.id = id;
    for (const t of p.tiles) t.id = newId("t");
  }
  for (const p of next.pages)
    for (const t of p.tiles)
      for (const k of ["tap_action", "hold_action"] as const) if (t[k].action === "navigate" && t[k].page) t[k].page = map.get(t[k].page!) ?? t[k].page;
  if (next.settings.home_page) next.settings.home_page = map.get(next.settings.home_page) ?? next.pages[0]?.id ?? null;
  return next;
}

@customElement("gs-templates")
export class GsTemplates extends StudioView {
  @property({ attribute: false }) displayId: string | null = null;
  @state() private target: string | null = null;
  @state() private area = "";

  private get targetId(): string | null {
    return this.target ?? this.displayId ?? this.displays[0]?.id ?? null;
  }

  private async useTemplate(t: Template) {
    const id = this.targetId;
    const display = this.displays.find((d) => d.id === id);
    if (!id || !display) {
      toast(this, "Bitte zuerst ein Display anlegen.", "error");
      return;
    }
    const ok = await confirmDialog(this, {
      title: `Vorlage „${t.name}“ übernehmen?`,
      text: `Der aktuelle Entwurf von „${display.name}“ wird ersetzt. Das Layout auf dem Display ändert sich erst beim Übertragen.`,
      confirm: "Übernehmen",
    });
    if (!ok) return;
    try {
      const current = await this.api.getLayout(id);
      const layout = regenerateIds(t.layout);
      layout.revision = current.layout.revision;
      await this.api.saveLayout(id, layout);
      toast(this, "Vorlage übernommen – Kacheln ohne Entität sind markiert.", "ok");
      this.go("designer", id);
    } catch (err) {
      toast(this, errorText(err), "error");
    }
  }

  private async saveAsTemplate() {
    const id = this.targetId;
    if (!id) return;
    const name = await promptDialog(this, "Als Vorlage speichern", "Meine Vorlage", "Name der Vorlage");
    if (!name) return;
    const res = await this.api.getLayout(id);
    await this.api.saveTemplate(name, `Gespeichert am ${new Date().toLocaleDateString("de-DE")}`, res.layout);
    fireEvent(this, "gs-info-changed");
    toast(this, "Vorlage gespeichert", "ok");
  }

  private async deleteTemplate(t: Template) {
    if (!(await confirmDialog(this, { title: "Vorlage löschen?", text: `„${t.name}“ wird gelöscht.`, confirm: "Löschen", danger: true }))) return;
    await this.api.deleteTemplate(t.id);
    fireEvent(this, "gs-info-changed");
  }

  private async exportLayout() {
    const id = this.targetId;
    if (!id) return;
    const res = await this.api.getLayout(id);
    const name = this.displays.find((d) => d.id === id)?.name ?? "display";
    downloadJson(`guition-layout-${name.replace(/\W+/g, "_")}.json`, { format: "guition-studio-layout", version: 1, layout: res.layout });
  }

  private async importLayout() {
    const id = this.targetId;
    if (!id) return;
    try {
      const data = (await pickJsonFile()) as { format?: string; layout?: Layout } & Layout;
      const layout = data.format === "guition-studio-layout" ? data.layout : data;
      if (!layout || !Array.isArray(layout.pages)) throw new Error("Die Datei enthält kein Guition-Studio-Layout.");
      const check = await this.api.validate(layout);
      const ok = await confirmDialog(this, {
        title: "Layout importieren?",
        text: `${layout.pages.length} Seite(n). ${check.valid ? "Das Layout ist gültig." : `Hinweise: ${check.errors.slice(0, 3).join(" ")}`}\nDer aktuelle Entwurf wird ersetzt.`,
        confirm: "Importieren",
      });
      if (!ok) return;
      const current = await this.api.getLayout(id);
      const fresh = regenerateIds(layout);
      fresh.revision = current.layout.revision;
      await this.api.saveLayout(id, fresh);
      toast(this, "Layout importiert", "ok");
      this.go("designer", id);
    } catch (err) {
      toast(this, errorText(err), "error");
    }
  }

  private async backup() {
    const data = await this.api.exportBackup();
    downloadJson(`guition-studio-backup-${new Date().toISOString().slice(0, 10)}.json`, data);
  }

  private async restore() {
    try {
      const data = await pickJsonFile();
      const ok = await confirmDialog(this, {
        title: "Sicherung wiederherstellen?",
        text: "Alle Displays, Layouts, eigenen Vorlagen und Favoriten in Guition Studio werden durch die Sicherung ersetzt.",
        confirm: "Wiederherstellen",
        danger: true,
      });
      if (!ok) return;
      const res = await this.api.restoreBackup(data);
      toast(this, `Sicherung mit ${res.displays} Display(s) wiederhergestellt`, "ok");
      fireEvent(this, "gs-info-changed");
      this.refreshAll();
    } catch (err) {
      toast(this, errorText(err), "error");
    }
  }

  /** Suggest a start layout from the entities of one area (client-side, no AI). */
  private async suggestFromArea() {
    const id = this.targetId;
    if (!id || !this.area) return;
    const lib = buildLibrary(this.hass).filter((e) => e.area === this.area && e.state !== "unavailable");
    const pick = (cats: string[]) => lib.filter((e) => cats.includes(e.category));
    const groups: Tile[][] = [
      pick(["light"]).map((e) => tileFromEntity(this.hass, e.entity_id)),
      pick(["switch", "outlet", "cover", "climate"]).map((e) => tileFromEntity(this.hass, e.entity_id)),
      lib
        .filter((e) => e.category === "sensor" && ["temperature", "humidity", "power", "energy"].includes(this.hass.states[e.entity_id]?.attributes.device_class))
        .map((e) => tileFromEntity(this.hass, e.entity_id)),
      pick(["scene", "script"]).map((e) => tileFromEntity(this.hass, e.entity_id)),
    ];
    const tiles = groups.flat();
    if (!tiles.length) {
      toast(this, "In diesem Bereich wurden keine passenden Entitäten gefunden.", "error");
      return;
    }
    const pages: Page[] = [];
    let page: Page | null = null;
    const start = makePage(this.area);
    start.tiles.push(makeTile("clock", 0, 0, 2, 1), makeTile("status", 2, 0, 1, 1, { title: "Status", tap_action: { action: "none" } }));
    pages.push(start);
    page = start;
    for (const t of tiles) {
      let spot = findFreeSpot(page, 1, 1);
      if (!spot) {
        if (pages.length >= MAX_PAGES) break;
        page = makePage(`${this.area} ${pages.length + 1}`);
        pages.push(page);
        spot = findFreeSpot(page, 1, 1)!;
      }
      page.tiles.push({ ...t, ...spot });
    }
    const current = await this.api.getLayout(id);
    const layout: Layout = { ...current.layout, pages, settings: { ...current.layout.settings, home_page: pages[0].id } };
    const ok = await confirmDialog(this, {
      title: "Vorschlag übernehmen?",
      text: `${tiles.length} Entitäten aus „${this.area}“ auf ${pages.length} Seite(n). Der aktuelle Entwurf wird ersetzt.`,
      confirm: "Übernehmen",
    });
    if (!ok) return;
    await this.api.saveLayout(id, layout);
    this.go("designer", id);
  }

  render() {
    const areas = Object.values(this.hass.areas ?? {}).map((a) => a.name).sort((a, b) => a.localeCompare(b, "de"));
    return html`
      <div class="page-head">
        <h1>Vorlagen</h1><span class="spacer"></span>
        <label class="row small">Ziel-Display
          <select style="width:auto" @change=${(e: Event) => (this.target = (e.target as HTMLSelectElement).value)}>
            ${this.displays.map((d) => html`<option value=${d.id} ?selected=${d.id === this.targetId}>${d.name}</option>`)}
          </select>
        </label>
      </div>
      <div class="grid tpl-grid">
        ${this.info.templates.map((t) => {
          const page = t.layout.pages.find((p) => p.id === t.layout.settings.home_page) ?? t.layout.pages[0];
          return html`<div class="card tpl">
            <div class="thumb"><div class="scale">${renderScreen(t.layout, page, this.info.themes)}</div></div>
            <div class="row"><h2 style="margin:8px 0 0">${t.name}</h2><span class="spacer"></span>${t.builtin ? html`<span class="chip">mitgeliefert</span>` : html`<span class="chip ok">eigene</span>`}</div>
            <p class="muted small">${t.description} · ${t.layout.pages.length} Seite(n) · ${this.info.themes[t.layout.settings.theme]?.name ?? ""}</p>
            <div class="row">
              <button class="primary" ?disabled=${!this.displays.length} @click=${() => this.useTemplate(t)}>Übernehmen</button>
              ${t.builtin ? nothing : html`<button class="danger" @click=${() => this.deleteTemplate(t)}>Löschen</button>`}
            </div>
          </div>`;
        })}
      </div>
      <section class="grid" style="margin-top:24px">
        <div class="card">
          <h2>Automatisches Dashboard</h2>
          <p class="small muted">Erstellt aus den Entitäten eines Bereichs ein Startlayout (Licht, Schalter, Klima-Sensoren, Szenen).</p>
          <div class="row">
            <select style="flex:1" @change=${(e: Event) => (this.area = (e.target as HTMLSelectElement).value)}>
              <option value="">Bereich wählen …</option>
              ${areas.map((a) => html`<option ?selected=${a === this.area}>${a}</option>`)}
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

  static styles = [
    ...StudioView.styles,
    screenStyles,
    css`
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
    `,
  ];
}

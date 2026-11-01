import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { repeat } from "lit/directives/repeat.js";
import { errorText, type StudioApi } from "../api";
import { CATEGORIES, buildLibrary, filterLibrary, tileFromEntity, type CategoryKey, type LibraryEntry } from "../entities";
import { cellRect, pageGeometry, pointToCell, SCREEN } from "../geometry";
import { History } from "../history";
import {
  addPage,
  addTile,
  clone,
  duplicatePage,
  inBounds,
  isFree,
  makeTile,
  missingEntities,
  movePage,
  needsEntity,
  moveTiles,
  occupiedCells,
  pasteTiles,
  removePage,
  removeTiles,
  resizeTile,
  updateTile,
  MAX_PAGES,
} from "../model";
import { visibleNow } from "../preview";
import type { DisplayStatus, Hass, Layout, Page, StudioInfo, Tile, Validation } from "../types";
import { confirmDialog, fireEvent, mdi, promptDialog, renderTileContent, screenStyles, sharedStyles, toast } from "../ui";
import "./tile-props";
import "./automation-props";

type DragMode = "move" | "resize" | "new";

interface DragState {
  mode: DragMode;
  started: boolean;
  startX: number;
  startY: number;
  clientX: number;
  clientY: number;
  sourcePage: string | null;
  ids: string[];
  anchorId: string | null;
  grab: { x: number; y: number };
  newTile?: Tile;
  label?: string;
  target: { page: string; x: number; y: number; w: number; h: number } | null;
  valid: boolean;
  reason?: string;
}

interface SystemItem {
  key: string;
  label: string;
  icon: string;
  glyph: string;
  make: (layout: Layout) => Tile;
  category: CategoryKey;
}

let clipboard: Tile[] = [];

@customElement("gs-designer")
export class GsDesigner extends LitElement {
  @property({ attribute: false }) hass!: Hass;
  @property({ attribute: false }) api!: StudioApi;
  @property({ attribute: false }) info!: StudioInfo;
  @property({ attribute: false }) displays: DisplayStatus[] = [];
  @property({ attribute: false }) displayId: string | null = null;

  @state() private layout: Layout | null = null;
  @state() private activePage = "";
  @state() private selection: string[] = [];
  @state() private zoom = 0.8;
  @state() private showGrid = true;
  @state() private multi = false;
  @state() private drag: DragState | null = null;
  @state() private saveState: "saved" | "dirty" | "saving" | "error" = "saved";
  @state() private validation: Validation | null = null;
  @state() private applying: { state: string; progress: number; error?: string | null } | null = null;
  @state() private search = "";
  @state() private category: CategoryKey = "all";
  @state() private favorites: string[] = [];
  @state() private libraryOpen = true;
  @state() private propsOpen = false;
  @state() private loading = false;
  @state() private loadError: string | null = null;
  @state() private pageDragIndex: number | null = null;
  @state() private propsTab: "page" | "auto" = "page";

  private history = new History<Layout>();
  private saveTimer?: number;
  private libraryCache: { states: unknown; entries: LibraryEntry[] } | null = null;
  private loadedFor: string | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("keydown", this.onKeyDown);
    this.tabIndex = 0;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("keydown", this.onKeyDown);
    this.endDragListeners();
    if (this.saveState === "dirty") this.saveNow();
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has("info") && this.info) this.favorites = [...this.info.favorites];
    if ((changed.has("displayId") || changed.has("api")) && this.displayId !== this.loadedFor && this.api) {
      this.load();
    }
  }

  private get display(): DisplayStatus | undefined {
    return this.displays.find((d) => d.id === this.displayId);
  }

  private get page(): Page | undefined {
    return this.layout?.pages.find((p) => p.id === this.activePage) ?? this.layout?.pages[0];
  }

  private get selectedTiles(): Tile[] {
    return this.page?.tiles.filter((t) => this.selection.includes(t.id)) ?? [];
  }

  private async load(): Promise<void> {
    if (this.saveState === "dirty" && this.loadedFor) await this.saveNow();
    this.loadedFor = this.displayId;
    this.layout = null;
    this.selection = [];
    this.history.clear();
    if (!this.displayId) return;
    this.loading = true;
    try {
      const res = await this.api.getLayout(this.displayId);
      this.layout = res.layout;
      this.activePage = res.layout.settings.home_page ?? res.layout.pages[0]?.id ?? "";
      this.saveState = "saved";
      this.loadError = null;
      this.fitZoom();
      this.validate();
    } catch (err) {
      this.loadError = errorText(err);
    } finally {
      this.loading = false;
    }
  }

  // ---------------------------------------------------------------- edits

  private commit(next: Layout): void {
    if (!this.layout) return;
    this.history.push(this.layout);
    this.layout = next;
    if (!next.pages.some((p) => p.id === this.activePage)) this.activePage = next.pages[0].id;
    const ids = new Set(next.pages.flatMap((p) => p.tiles.map((t) => t.id)));
    this.selection = this.selection.filter((id) => ids.has(id));
    this.scheduleSave();
  }

  private scheduleSave(): void {
    this.saveState = "dirty";
    window.clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => this.saveNow(), 1200);
  }

  private async saveNow(): Promise<void> {
    window.clearTimeout(this.saveTimer);
    if (!this.layout || !this.loadedFor) return;
    this.saveState = "saving";
    try {
      const res = await this.api.saveLayout(this.loadedFor, this.layout);
      this.validation = res;
      this.saveState = "saved";
    } catch (err) {
      this.saveState = "error";
      toast(this, `Entwurf konnte nicht gespeichert werden: ${errorText(err)}`, "error");
    }
  }

  private async validate(): Promise<void> {
    if (!this.layout) return;
    try {
      this.validation = await this.api.validate(this.layout);
    } catch {
      /* ignore */
    }
  }

  private undo(): void {
    if (!this.layout) return;
    const prev = this.history.undo(this.layout);
    if (prev) {
      this.layout = prev;
      if (!prev.pages.some((p) => p.id === this.activePage)) this.activePage = prev.pages[0].id;
      this.scheduleSave();
    }
  }

  private redo(): void {
    if (!this.layout) return;
    const next = this.history.redo(this.layout);
    if (next) {
      this.layout = next;
      this.scheduleSave();
    }
  }

  private fitZoom(): void {
    const ws = this.renderRoot?.querySelector?.(".workspace") as HTMLElement | null;
    const h = ws?.clientHeight ?? window.innerHeight - 380;
    this.zoom = Math.max(0.4, Math.min(1, Math.floor(((h - 60) / SCREEN) * 20) / 20));
  }

  // ---------------------------------------------------------------- selection & clipboard

  private copySelection(): void {
    clipboard = clone(this.selectedTiles);
    if (clipboard.length) toast(this, `${clipboard.length} Kachel(n) kopiert`);
  }

  private paste(): void {
    if (!this.layout || !clipboard.length || !this.page) return;
    const res = pasteTiles(this.layout, this.page.id, clipboard);
    if (!res.ids.length) {
      toast(this, "Kein freier Platz auf dieser Seite", "error");
      return;
    }
    this.commit(res.layout);
    this.selection = res.ids;
    if (res.skipped) toast(this, `${res.skipped} Kachel(n) passten nicht mehr auf die Seite`, "error");
  }

  private duplicateSelection(): void {
    const tiles = this.selectedTiles;
    if (!tiles.length) return;
    clipboard = clone(tiles);
    this.paste();
  }

  private async deleteSelection(): Promise<void> {
    if (!this.layout || !this.selection.length) return;
    this.commit(removeTiles(this.layout, this.selection));
    this.selection = [];
  }

  // ---------------------------------------------------------------- keyboard

  private onKeyDown = (e: KeyboardEvent): void => {
    const target = e.composedPath()[0] as HTMLElement;
    if (["INPUT", "SELECT", "TEXTAREA"].includes(target?.tagName)) return;
    if (!this.layout) return;
    const mod = e.ctrlKey || e.metaKey;
    const key = e.key;
    if (key === "Escape") {
      if (this.drag) this.cancelDrag();
      else this.selection = [];
      return;
    }
    if (mod && key.toLowerCase() === "z") {
      e.preventDefault();
      e.shiftKey ? this.redo() : this.undo();
      return;
    }
    if (mod && key.toLowerCase() === "y") {
      e.preventDefault();
      this.redo();
      return;
    }
    if (mod && key.toLowerCase() === "c") return this.copySelection();
    if (mod && key.toLowerCase() === "v") return this.paste();
    if (mod && key.toLowerCase() === "d") {
      e.preventDefault();
      return this.duplicateSelection();
    }
    if (key === "Delete" || key === "Backspace") {
      e.preventDefault();
      this.deleteSelection();
      return;
    }
    const page = this.page;
    if (!page) return;
    if (key === "Tab" && page.tiles.length) {
      e.preventDefault();
      const order = [...page.tiles].sort((a, b) => a.y - b.y || a.x - b.x);
      const idx = order.findIndex((t) => t.id === this.selection[0]);
      const next = order[(idx + (e.shiftKey ? -1 : 1) + order.length) % order.length];
      this.selection = [next.id];
      return;
    }
    const dirs: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    if (dirs[key] && this.selection.length) {
      e.preventDefault();
      const [dx, dy] = dirs[key];
      const anchor = page.tiles.find((t) => t.id === this.selection[0]);
      if (!anchor) return;
      const res = e.shiftKey
        ? resizeTile(this.layout, page.id, anchor.id, anchor.w + dx, anchor.h + dy)
        : moveTiles(this.layout, page.id, this.selection, anchor.id, page.id, anchor.x + dx, anchor.y + dy);
      if (res.ok) this.commit(res.layout);
      else toast(this, res.reason ?? "Nicht möglich");
      return;
    }
    if ((key === "PageUp" || key === "PageDown") && this.selection.length) {
      e.preventDefault();
      const idx = this.layout.pages.indexOf(page) + (key === "PageDown" ? 1 : -1);
      const to = this.layout.pages[idx];
      const anchor = page.tiles.find((t) => t.id === this.selection[0]);
      if (!to || !anchor) return;
      const res = moveTiles(this.layout, page.id, this.selection, anchor.id, to.id, anchor.x, anchor.y);
      if (res.ok) {
        this.commit(res.layout);
        this.activePage = to.id;
      } else toast(this, `Auf „${to.name}“ ist an dieser Position kein Platz`);
    }
  };

  // ---------------------------------------------------------------- pointer drag & drop

  private startTileDrag(e: PointerEvent, page: Page, tile: Tile): void {
    if (e.button !== 0) return;
    e.stopPropagation();
    this.focus({ preventScroll: true });
    const additive = e.shiftKey || e.ctrlKey || e.metaKey || this.multi;
    if (page.id !== this.activePage) {
      this.activePage = page.id;
      this.selection = [];
    }
    if (additive) {
      this.selection = this.selection.includes(tile.id) ? this.selection.filter((id) => id !== tile.id) : [...this.selection, tile.id];
      if (!this.selection.includes(tile.id)) return;
    } else if (!this.selection.includes(tile.id)) {
      this.selection = [tile.id];
    }
    const cell = this.cellAt(page, e.clientX, e.clientY);
    this.beginDrag({
      mode: "move",
      sourcePage: page.id,
      ids: [...this.selection],
      anchorId: tile.id,
      grab: { x: cell ? cell.x - tile.x : 0, y: cell ? cell.y - tile.y : 0 },
    }, e);
  }

  private startResize(e: PointerEvent, page: Page, tile: Tile): void {
    if (e.button !== 0) return;
    e.stopPropagation();
    this.selection = [tile.id];
    this.beginDrag({ mode: "resize", sourcePage: page.id, ids: [tile.id], anchorId: tile.id, grab: { x: 0, y: 0 } }, e);
  }

  private startNewDrag(e: PointerEvent, make: () => Tile, label: string): void {
    if (e.button !== 0) return;
    e.preventDefault();
    this.beginDrag({ mode: "new", sourcePage: null, ids: [], anchorId: null, grab: { x: 0, y: 0 }, newTile: make(), label }, e);
  }

  private beginDrag(partial: Pick<DragState, "mode" | "sourcePage" | "ids" | "anchorId" | "grab" | "newTile" | "label">, e: PointerEvent): void {
    this.drag = { ...partial, started: false, startX: e.clientX, startY: e.clientY, clientX: e.clientX, clientY: e.clientY, target: null, valid: false };
    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
    window.addEventListener("pointercancel", this.cancelDrag);
  }

  private endDragListeners(): void {
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
    window.removeEventListener("pointercancel", this.cancelDrag);
  }

  private cancelDrag = (): void => {
    this.endDragListeners();
    this.drag = null;
  };

  /** Page under the pointer and the position in page-area pixel coordinates. */
  private hitPage(clientX: number, clientY: number): { page: Page; px: number; py: number } | null {
    if (!this.layout) return null;
    const geo = pageGeometry(this.layout.settings, this.layout.pages.length);
    for (const el of this.renderRoot.querySelectorAll<HTMLElement>(".canvas[data-page]")) {
      const r = el.getBoundingClientRect();
      if (clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom) {
        const page = this.layout.pages.find((p) => p.id === el.dataset.page);
        if (!page) continue;
        return { page, px: (clientX - r.left) / this.zoom, py: (clientY - r.top) / this.zoom - geo.top };
      }
    }
    return null;
  }

  private cellAt(page: Page, clientX: number, clientY: number) {
    const hit = this.hitPage(clientX, clientY);
    if (!hit || hit.page.id !== page.id || !this.layout) return null;
    return pointToCell(page, pageGeometry(this.layout.settings, this.layout.pages.length), hit.px, hit.py);
  }

  private onPointerMove = (e: PointerEvent): void => {
    const d = this.drag;
    if (!d || !this.layout) return;
    if (!d.started && Math.hypot(e.clientX - d.startX, e.clientY - d.startY) < 5) return;
    const geo = pageGeometry(this.layout.settings, this.layout.pages.length);
    const next: DragState = { ...d, started: true, clientX: e.clientX, clientY: e.clientY, target: null, valid: false, reason: undefined };
    this.autoScroll(e.clientX);

    if (d.mode === "resize") {
      const page = this.layout.pages.find((p) => p.id === d.sourcePage)!;
      const tile = page.tiles.find((t) => t.id === d.anchorId)!;
      const hit = this.hitPage(e.clientX, e.clientY);
      if (hit && hit.page.id === page.id) {
        const cell = pointToCell(page, geo, hit.px, hit.py);
        const w = Math.max(1, Math.min(page.cols - tile.x, cell.x - tile.x + 1));
        const h = Math.max(1, Math.min(page.rows - tile.y, cell.y - tile.y + 1));
        next.target = { page: page.id, x: tile.x, y: tile.y, w, h };
        next.valid = isFree(page, { x: tile.x, y: tile.y, w, h }, new Set([tile.id]));
        if (!next.valid) next.reason = "Platz ist belegt";
      }
      this.drag = next;
      return;
    }

    const hit = this.hitPage(e.clientX, e.clientY);
    if (!hit) {
      next.reason = "Außerhalb des Displays";
      this.drag = next;
      return;
    }
    const cell = pointToCell(hit.page, geo, hit.px, hit.py);
    if (d.mode === "new" && d.newTile) {
      const w = Math.min(d.newTile.w, hit.page.cols);
      const h = Math.min(d.newTile.h, hit.page.rows);
      const x = Math.max(0, Math.min(hit.page.cols - w, cell.x));
      const y = Math.max(0, Math.min(hit.page.rows - h, cell.y));
      next.target = { page: hit.page.id, x, y, w, h };
      next.valid = isFree(hit.page, { x, y, w, h });
      if (!next.valid) next.reason = "Platz ist belegt";
    } else if (d.mode === "move" && d.sourcePage && d.anchorId) {
      const src = this.layout.pages.find((p) => p.id === d.sourcePage)!;
      const moving = src.tiles.filter((t) => d.ids.includes(t.id));
      const anchor = moving.find((t) => t.id === d.anchorId)!;
      // clamp the whole group into the target grid
      const minDx = Math.min(...moving.map((t) => t.x - anchor.x));
      const maxDx = Math.max(...moving.map((t) => t.x + t.w - anchor.x));
      const minDy = Math.min(...moving.map((t) => t.y - anchor.y));
      const maxDy = Math.max(...moving.map((t) => t.y + t.h - anchor.y));
      const ax = Math.max(-minDx, Math.min(hit.page.cols - maxDx, cell.x - d.grab.x));
      const ay = Math.max(-minDy, Math.min(hit.page.rows - maxDy, cell.y - d.grab.y));
      next.target = { page: hit.page.id, x: ax, y: ay, w: anchor.w, h: anchor.h };
      const res = moveTiles(this.layout, src.id, d.ids, anchor.id, hit.page.id, ax, ay);
      next.valid = res.ok;
      next.reason = res.reason;
    }
    this.drag = next;
  };

  private onPointerUp = (): void => {
    const d = this.drag;
    this.endDragListeners();
    this.drag = null;
    if (!d || !this.layout) return;
    if (!d.started) {
      if (d.mode === "new" && d.newTile) this.addToActivePage(d.newTile);
      return;
    }
    if (!d.target || !d.valid) {
      if (d.reason) toast(this, `Ablegen nicht möglich: ${d.reason}`);
      return;
    }
    const t = d.target;
    if (d.mode === "new" && d.newTile) {
      const res = addTile(this.layout, t.page, { ...d.newTile, x: t.x, y: t.y, w: t.w, h: t.h });
      if (res.ok) {
        this.commit(res.layout);
        this.activePage = t.page;
        this.selection = [d.newTile.id];
      } else toast(this, res.reason ?? "Nicht möglich", "error");
    } else if (d.mode === "resize" && d.anchorId && d.sourcePage) {
      const res = resizeTile(this.layout, d.sourcePage, d.anchorId, t.w, t.h);
      if (res.ok) this.commit(res.layout);
    } else if (d.mode === "move" && d.anchorId && d.sourcePage) {
      const res = moveTiles(this.layout, d.sourcePage, d.ids, d.anchorId, t.page, t.x, t.y);
      if (res.ok) {
        this.commit(res.layout);
        this.activePage = t.page;
      }
    }
  };

  private autoScroll(clientX: number): void {
    const ws = this.renderRoot.querySelector<HTMLElement>(".workspace");
    if (!ws) return;
    const r = ws.getBoundingClientRect();
    if (clientX < r.left + 40) ws.scrollLeft -= 14;
    else if (clientX > r.right - 40) ws.scrollLeft += 14;
  }

  private addToActivePage(tile: Tile): void {
    if (!this.layout || !this.page) return;
    const res = addTile(this.layout, this.page.id, tile);
    if (!res.ok) {
      toast(this, res.reason ?? "Kein Platz", "error");
      return;
    }
    this.commit(res.layout);
    this.selection = [tile.id];
    this.propsOpen = true;
  }

  // ---------------------------------------------------------------- pages

  private async renamePage(page: Page): Promise<void> {
    const name = await promptDialog(this, "Seite umbenennen", page.name, "Seitenname");
    if (!name || !this.layout) return;
    const next = clone(this.layout);
    next.pages.find((p) => p.id === page.id)!.name = name.slice(0, 32);
    this.commit(next);
  }

  private async deletePage(page: Page): Promise<void> {
    if (!this.layout) return;
    if (this.layout.pages.length <= 1) {
      toast(this, "Die letzte Seite kann nicht gelöscht werden.");
      return;
    }
    const ok = await confirmDialog(this, {
      title: "Seite löschen?",
      text: `„${page.name}“ mit ${page.tiles.length} Kachel(n) wird gelöscht. Du kannst das mit Rückgängig (Strg+Z) wiederherstellen.`,
      confirm: "Löschen",
      danger: true,
    });
    if (!ok) return;
    const next = removePage(this.layout, page.id);
    if (next) this.commit(next);
  }

  private setHome(page: Page): void {
    if (!this.layout) return;
    const next = clone(this.layout);
    next.settings.home_page = page.id;
    this.commit(next);
  }

  private onPageDrop(to: number): void {
    if (this.pageDragIndex === null || !this.layout) return;
    const from = this.pageDragIndex;
    this.pageDragIndex = null;
    if (from !== to) this.commit(movePage(this.layout, from, to));
  }

  // ---------------------------------------------------------------- apply

  private async apply(): Promise<void> {
    if (!this.layout || !this.displayId) return;
    const display = this.display;
    if (!display?.linked) {
      toast(this, "Dieses Display ist mit keinem Gerät verknüpft. Bitte unter „Meine Displays“ ein Gerät zuordnen.", "error");
      return;
    }
    const missing = missingEntities(this.layout);
    if (missing.length) {
      const page = this.layout.pages.find((p) => p.tiles.includes(missing[0]))!;
      this.activePage = page.id;
      this.selection = [missing[0].id];
      this.propsOpen = true;
      toast(this, `${missing.length} Kachel(n) ohne zugeordnete Entität – bitte zuerst eine Entität wählen.`, "error");
      return;
    }
    await this.saveNow();
    this.applying = { state: "sending", progress: 0 };
    let unsub: (() => void) | undefined;
    try {
      unsub = await this.hass.connection.subscribeEvents((ev: any) => {
        if (ev.data?.display_id === this.displayId && ev.data?.kind === "transfer") {
          this.applying = { state: ev.data.state, progress: ev.data.progress ?? 0, error: ev.data.error };
        }
      }, "guition_studio_updated");
    } catch {
      /* progress is optional */
    }
    try {
      const res = await this.api.apply(this.displayId, this.layout);
      this.layout = { ...this.layout, revision: res.revision };
      this.applying = { state: "done", progress: 100 };
      toast(this, `Layout (Revision ${res.revision}, ${res.size} Bytes) wurde vom Display bestätigt ✓`, "ok");
      fireEvent(this, "gs-refresh");
      setTimeout(() => (this.applying = null), 2500);
    } catch (err) {
      this.applying = { state: "error", progress: 0, error: errorText(err) };
    } finally {
      unsub?.();
    }
  }

  // ---------------------------------------------------------------- library

  private get libraryEntries(): LibraryEntry[] {
    if (!this.libraryCache || this.libraryCache.states !== this.hass.states) {
      this.libraryCache = { states: this.hass.states, entries: buildLibrary(this.hass) };
    }
    return this.libraryCache.entries;
  }

  private systemItems(): SystemItem[] {
    const items: SystemItem[] = [
      { key: "clock", label: "Uhrzeit", icon: "mdi:clock-outline", glyph: "🕒", category: "system", make: () => makeTile("clock", 0, 0, 2, 1) },
      { key: "text", label: "Text", icon: "mdi:format-text", glyph: "T", category: "system", make: () => makeTile("text", 0, 0, 1, 1, { title: "Text", tap_action: { action: "none" } }) },
      { key: "status", label: "WLAN/HA-Status", icon: "mdi:wifi-check", glyph: "📶", category: "system", make: () => makeTile("status", 0, 0, 1, 1, { title: "Status", tap_action: { action: "none" } }) },
      { key: "settings", label: "Einstellungen (am Display)", icon: "mdi:cog", glyph: "⚙", category: "system", make: () => makeTile("settings", 0, 0, 1, 1, { title: "Einstellungen", icon: "cog", tap_action: { action: "none" } }) },
      { key: "home", label: "Startseite", icon: "mdi:home", glyph: "⌂", category: "navigation", make: () => makeTile("nav", 0, 0, 1, 1, { title: "Start", icon: "home", tap_action: { action: "home" } }) },
      { key: "back", label: "Zurück", icon: "mdi:arrow-left", glyph: "◀", category: "navigation", make: () => makeTile("nav", 0, 0, 1, 1, { title: "Zurück", icon: "arrow-left", tap_action: { action: "back" } }) },
      { key: "next", label: "Nächste Seite", icon: "mdi:arrow-right", glyph: "▶", category: "navigation", make: () => makeTile("nav", 0, 0, 1, 1, { title: "Weiter", icon: "arrow-right", tap_action: { action: "next" } }) },
    ];
    for (const p of this.layout?.pages ?? []) {
      items.push({
        key: `nav-${p.id}`,
        label: `→ ${p.name}`,
        icon: "mdi:arrow-right-bold-box",
        glyph: "➜",
        category: "navigation",
        make: () => makeTile("nav", 0, 0, 1, 1, { title: p.name, icon: "arrow-right", tap_action: { action: "navigate", page: p.id } }),
      });
    }
    return items;
  }

  private async toggleFavorite(entityId: string): Promise<void> {
    this.favorites = this.favorites.includes(entityId) ? this.favorites.filter((f) => f !== entityId) : [...this.favorites, entityId];
    try {
      await this.api.setFavorites(this.favorites);
    } catch (err) {
      toast(this, errorText(err), "error");
    }
  }

  // ---------------------------------------------------------------- render

  render() {
    if (!this.displayId || !this.displays.length) {
      return html`<div class="empty card">
        <h2>Noch kein Display vorhanden</h2>
        <p>Füge zuerst unter „Meine Displays“ ein Guition-Display hinzu. Danach kannst du hier Seiten gestalten.</p>
        <button class="primary" @click=${() => fireEvent(this, "gs-navigate", { view: "displays" })}>Display hinzufügen</button>
      </div>`;
    }
    if (this.loadError) return html`<div class="notice error" style="margin:20px">${this.loadError} <button @click=${() => this.load()}>Erneut laden</button></div>`;
    if (!this.layout || this.loading) return html`<div style="padding:40px"><span class="spinner"></span> Layout wird geladen …</div>`;
    return html`<div class="designer ${this.libraryOpen ? "" : "lib-closed"} ${this.propsOpen ? "props-open" : ""}">
      ${this.renderSidebar()} ${this.renderToolbar()} ${this.renderWorkspace()} ${this.renderLibrary()} ${this.renderProps()}
    </div>
    ${this.drag?.started && this.drag.mode === "new"
      ? html`<div class="ghost ${this.drag.valid ? "valid" : "invalid"}" style="left:${this.drag.clientX + 12}px;top:${this.drag.clientY + 12}px">${this.drag.label}</div>`
      : nothing}
    ${this.applying ? this.renderApplying() : nothing}`;
  }

  private renderSidebar() {
    const layout = this.layout!;
    const s = layout.settings;
    const set = (patch: Partial<Layout["settings"]>) => this.commit({ ...clone(layout), settings: { ...layout.settings, ...patch } });
    return html`<aside class="sidebar">
      <label class="field"><span>Display</span>
        <select @change=${(e: Event) => fireEvent(this, "gs-select-display", (e.target as HTMLSelectElement).value)}>
          ${this.displays.map((d) => html`<option value=${d.id} ?selected=${d.id === this.displayId}>${d.name}${d.online ? "" : " (offline)"}</option>`)}
        </select>
      </label>
      <div class="row" style="margin-bottom:8px">
        <h3 style="margin:0">Seiten</h3><span class="spacer"></span>
        <span class="muted small">${layout.pages.length}/${MAX_PAGES}</span>
      </div>
      <ul class="pages" role="listbox" aria-label="Seiten">
        ${repeat(
          layout.pages,
          (p) => p.id,
          (p, i) => html`<li
            class=${classMap({ active: p.id === this.page?.id, dragover: this.pageDragIndex !== null })}
            draggable="true"
            role="option"
            aria-selected=${p.id === this.page?.id}
            tabindex="0"
            @dragstart=${() => (this.pageDragIndex = i)}
            @dragover=${(e: DragEvent) => e.preventDefault()}
            @drop=${() => this.onPageDrop(i)}
            @dragend=${() => (this.pageDragIndex = null)}
            @click=${() => {
              this.activePage = p.id;
              this.selection = [];
              this.renderRoot.querySelector(`[data-col="${p.id}"]`)?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
            }}
            @dblclick=${() => this.renamePage(p)}
            @keydown=${(e: KeyboardEvent) => e.key === "Enter" && (this.activePage = p.id)}
          >
            <span class="drag-handle" title="Ziehen zum Sortieren">⋮⋮</span>
            <span class="pname">${p.name}</span>
            <button class="icon ghost tiny ${s.home_page === p.id ? "home" : ""}" title="Als Startseite festlegen" @click=${(e: Event) => (e.stopPropagation(), this.setHome(p))}>
              ${s.home_page === p.id ? "★" : "☆"}
            </button>
          </li>`
        )}
      </ul>
      <div class="page-actions">
        <button title="Seite hinzufügen" ?disabled=${layout.pages.length >= MAX_PAGES} @click=${() => {
          const r = addPage(layout);
          if (r) {
            this.commit(r.layout);
            this.activePage = r.id;
          }
        }}>＋ Neu</button>
        <button title="Seite duplizieren" ?disabled=${layout.pages.length >= MAX_PAGES} @click=${() => {
          const r = this.page && duplicatePage(layout, this.page.id);
          if (r) {
            this.commit(r.layout);
            this.activePage = r.id;
          } else toast(this, "Duplizieren nicht möglich (Seiten- oder Kachellimit erreicht)");
        }}>⧉</button>
        <button title="Seite umbenennen" @click=${() => this.page && this.renamePage(this.page)}>✎</button>
        <button title="Seite nach oben" @click=${() => {
          const i = layout.pages.indexOf(this.page!);
          if (i > 0) this.commit(movePage(layout, i, i - 1));
        }}>↑</button>
        <button title="Seite nach unten" @click=${() => {
          const i = layout.pages.indexOf(this.page!);
          if (i < layout.pages.length - 1) this.commit(movePage(layout, i, i + 1));
        }}>↓</button>
        <button class="danger" title="Seite löschen" @click=${() => this.page && this.deletePage(this.page)}>🗑</button>
      </div>

      <details class="settings" open>
        <summary><h3 style="display:inline">Displayeinstellungen</h3></summary>
        <label class="field"><span>Design</span>
          <select @change=${(e: Event) => set({ theme: (e.target as HTMLSelectElement).value })}>
            ${Object.entries(this.info.themes).map(([k, t]) => html`<option value=${k} ?selected=${k === s.theme}>${t.name}</option>`)}
          </select>
        </label>
        <label class="field"><span>Helligkeit: ${s.brightness} %</span>
          <input type="range" min="5" max="100" .value=${String(s.brightness)} @change=${(e: Event) => set({ brightness: +(e.target as HTMLInputElement).value })} />
        </label>
        <label class="field"><span>Standby-Helligkeit: ${s.standby_brightness} %</span>
          <input type="range" min="0" max="100" .value=${String(s.standby_brightness)} @change=${(e: Event) => set({ standby_brightness: +(e.target as HTMLInputElement).value })} />
        </label>
        <label class="field"><span>Bildschirm-Timeout</span>
          <select @change=${(e: Event) => set({ timeout: +(e.target as HTMLSelectElement).value })}>
            ${[[0, "Nie dimmen"], [15, "15 Sekunden"], [30, "30 Sekunden"], [60, "1 Minute"], [120, "2 Minuten"], [300, "5 Minuten"], [900, "15 Minuten"]].map(
              ([v, l]) => html`<option value=${v} ?selected=${s.timeout === v}>${l}</option>`
            )}
          </select>
        </label>
        <label class="field"><span>Zur Startseite zurück nach</span>
          <select @change=${(e: Event) => set({ home_after: +(e.target as HTMLSelectElement).value })}>
            ${[[0, "Nie"], [30, "30 Sekunden"], [60, "1 Minute"], [300, "5 Minuten"]].map(([v, l]) => html`<option value=${v} ?selected=${s.home_after === v}>${l}</option>`)}
          </select>
        </label>
        <label class="field"><span>Bildschirmdrehung</span>
          <select @change=${(e: Event) => set({ rotation: +(e.target as HTMLSelectElement).value as 0 | 90 | 180 | 270 })}>
            ${([0, 90, 180, 270] as const).map((r) => html`<option value=${r} ?selected=${(s.rotation ?? 0) === r}>${r}°</option>`)}
          </select>
        </label>
        <label class="check"><input type="checkbox" .checked=${s.show_header} @change=${(e: Event) => set({ show_header: (e.target as HTMLInputElement).checked })} /> Kopfzeile mit Uhr & Status</label>
        <label class="check"><input type="checkbox" .checked=${s.show_dots} @change=${(e: Event) => set({ show_dots: (e.target as HTMLInputElement).checked })} /> Seitenpunkte anzeigen</label>
        <label class="check"><input type="checkbox" .checked=${s.swipe} @change=${(e: Event) => set({ swipe: (e.target as HTMLInputElement).checked })} /> Wischen zum Seitenwechsel</label>
      </details>
    </aside>`;
  }

  private renderToolbar() {
    const v = this.validation;
    const display = this.display;
    const saveLabel = { saved: "Entwurf gespeichert", dirty: "Ungespeichert …", saving: "Speichert …", error: "Speichern fehlgeschlagen" }[this.saveState];
    return html`<div class="toolbar">
      <button class="icon" title="Rückgängig (Strg+Z)" ?disabled=${!this.history.canUndo} @click=${() => this.undo()}>↶</button>
      <button class="icon" title="Wiederholen (Strg+Y)" ?disabled=${!this.history.canRedo} @click=${() => this.redo()}>↷</button>
      <span class="sep"></span>
      <button class="icon" title="Verkleinern" @click=${() => (this.zoom = Math.max(0.3, +(this.zoom - 0.1).toFixed(2)))}>−</button>
      <button class="zoom" title="An Fenster anpassen" @click=${() => this.fitZoom()}>${Math.round(this.zoom * 100)} %</button>
      <button class="icon" title="Vergrößern" @click=${() => (this.zoom = Math.min(1.6, +(this.zoom + 0.1).toFixed(2)))}>＋</button>
      <span class="sep"></span>
      <button class=${this.showGrid ? "toggled" : ""} title="Raster & Hilfslinien" @click=${() => (this.showGrid = !this.showGrid)}>▦ Raster</button>
      <button class=${this.multi ? "toggled" : ""} title="Mehrfachauswahl (für Touch). Mit Maus: Umschalt/Strg + Klick" @click=${() => (this.multi = !this.multi)}>☑ Mehrfach</button>
      <span class="sep"></span>
      <button class="icon" title="Kopieren (Strg+C)" ?disabled=${!this.selection.length} @click=${() => this.copySelection()}>⧉</button>
      <button class="icon" title="Einfügen (Strg+V)" ?disabled=${!clipboard.length} @click=${() => this.paste()}>📋</button>
      <button class="icon" title="Duplizieren (Strg+D)" ?disabled=${!this.selection.length} @click=${() => this.duplicateSelection()}>⊕</button>
      <button class="icon danger" title="Löschen (Entf)" ?disabled=${!this.selection.length} @click=${() => this.deleteSelection()}>🗑</button>
      <span class="spacer"></span>
      <span class="chip ${this.saveState === "error" ? "error" : this.saveState === "saved" ? "" : "warn"}" title="Entwürfe werden automatisch in Home Assistant gespeichert">${saveLabel}</span>
      ${v
        ? v.valid
          ? html`<span class="chip ok" title="Layoutgröße auf dem Gerät">✓ Gültig · ${((v.size ?? 0) / 1024).toFixed(1)} KB</span>`
          : html`<span class="chip error" title=${v.errors.join("\n")}>⚠ ${v.errors.length} Hinweis(e)</span>`
        : nothing}
      <span class="chip ${display?.online ? "ok" : "error"}">${display?.online ? "● Online" : "○ Offline"}</span>
      <button
        class=${this.propsTab === "auto" && !this.selection.length && this.propsOpen ? "toggled" : ""}
        title="Bildschirmschoner, Diashow, Nachtmodus und Seitenwechsel-Regeln"
        @click=${() => {
          this.selection = [];
          this.propsTab = "auto";
          this.propsOpen = true;
          this.updateComplete.then(() => this.renderRoot.querySelector(".props")?.scrollTo({ top: 0 }));
        }}
      >⏾ Automatik</button>
      <button class="icon props-toggle" title="Eigenschaften" @click=${() => (this.propsOpen = !this.propsOpen)}>☰</button>
      <button class="primary" ?disabled=${!!this.applying && this.applying.state !== "error" && this.applying.state !== "done"} @click=${() => this.apply()}>
        ⇪ Auf Display übertragen
      </button>
    </div>`;
  }

  private renderWorkspace() {
    const layout = this.layout!;
    const theme = this.info.themes[layout.settings.theme] ?? Object.values(this.info.themes)[0];
    const geo = pageGeometry(layout.settings, layout.pages.length);
    const z = this.zoom;
    const d = this.drag?.started ? this.drag : null;
    return html`<div
      class="workspace"
      @wheel=${(e: WheelEvent) => {
        if (!e.ctrlKey) return;
        e.preventDefault();
        this.zoom = Math.max(0.3, Math.min(1.6, +(this.zoom - Math.sign(e.deltaY) * 0.05).toFixed(2)));
      }}
    >
      ${layout.pages.map((page, index) => {
        const cells = occupiedCells(page);
        const moving = d && d.mode === "move" ? new Set(d.ids) : new Set<string>();
        return html`<div class="page-col ${page.id === this.page?.id ? "active" : ""}" data-col=${page.id}>
          <div class="page-label" @click=${() => (this.activePage = page.id)} @dblclick=${() => this.renamePage(page)}>
            <span class="num">${index + 1}</span> ${page.name}
            ${layout.settings.home_page === page.id ? html`<span class="chip">★ Start</span>` : nothing}
            <span class="muted small">${page.cols}×${page.rows}</span>
          </div>
          <div class="canvas-wrap" style="width:${SCREEN * z}px;height:${SCREEN * z}px">
            <div
              class="screen canvas ${d ? "dragging" : ""}"
              data-page=${page.id}
              style="transform:scale(${z});background:${theme.header_bg}"
              @pointerdown=${() => {
                this.activePage = page.id;
                this.selection = [];
              }}
            >
              ${layout.settings.show_header
                ? html`<div class="s-header" style="color:${theme.header_text}">
                    <span class="name">${page.name}</span><span>${new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}</span>
                    <span style="color:${theme.ok};font-size:15px">📶</span><span style="color:${theme.ok};font-size:16px">⌂</span>
                  </div>`
                : nothing}
              <div class="s-page" style="top:${geo.top}px;height:${geo.height}px;background:${page.background ?? theme.page_bg}">
                ${this.showGrid || d
                  ? cells.flatMap((row, y) =>
                      row.map((occ, x) => {
                        const r = cellRect(page, geo, x, y, 1, 1);
                        return html`<div class="cell ${occ ? "occ" : "free"} ${d ? "show" : ""}" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"></div>`;
                      })
                    )
                  : nothing}
                ${repeat(
                  page.tiles,
                  (t) => t.id,
                  (t) => {
                    const r = cellRect(page, geo, t.x, t.y, t.w, t.h);
                    const selected = this.selection.includes(t.id) && page.id === this.page?.id;
                    const missing = needsEntity(t) && !t.entity;
                    const hidden = t.visibility.length > 0 && !visibleNow(this.hass, t);
                    return html`<div
                      class=${classMap({ tile: true, selected, lifted: moving.has(t.id), hiddenNow: hidden })}
                      style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"
                      title=${t.entity ?? t.title}
                      @pointerdown=${(e: PointerEvent) => this.startTileDrag(e, page, t)}
                      @dblclick=${() => (this.propsOpen = true)}
                    >
                      ${renderTileContent(t, theme, this.hass, r.w, r.h)}
                      ${missing ? html`<div class="badge" title="Keine Entität zugeordnet">⚠ Entität fehlt</div>` : nothing}
                      ${hidden ? html`<div class="badge info" title="Zurzeit durch Sichtbarkeitsbedingung ausgeblendet">ausgeblendet</div>` : nothing}
                      ${selected && this.selection.length === 1
                        ? html`<div class="resize" title="Größe ändern" @pointerdown=${(e: PointerEvent) => this.startResize(e, page, t)}></div>`
                        : nothing}
                    </div>`;
                  }
                )}
                ${d?.target && d.target.page === page.id ? this.renderDropPreview(page, d) : nothing}
              </div>
              ${geo.bottom
                ? html`<div class="s-dots">${layout.pages.map((_, i) => html`<span style="background:${i === index ? theme.accent : theme.muted}"></span>`)}</div>`
                : nothing}
            </div>
          </div>
        </div>`;
      })}
      ${layout.pages.length < MAX_PAGES
        ? html`<button class="add-page" style="height:${SCREEN * z}px" @click=${() => {
            const r = addPage(layout);
            if (r) {
              this.commit(r.layout);
              this.activePage = r.id;
            }
          }}>＋<br />Seite hinzufügen</button>`
        : nothing}
    </div>`;
  }

  private renderDropPreview(page: Page, d: DragState) {
    const layout = this.layout!;
    const geo = pageGeometry(layout.settings, layout.pages.length);
    const t = d.target!;
    let rects: { x: number; y: number; w: number; h: number }[] = [t];
    if (d.mode === "move" && d.sourcePage) {
      const src = layout.pages.find((p) => p.id === d.sourcePage)!;
      const anchor = src.tiles.find((x) => x.id === d.anchorId)!;
      rects = src.tiles.filter((x) => d.ids.includes(x.id)).map((x) => ({ x: x.x - anchor.x + t.x, y: x.y - anchor.y + t.y, w: x.w, h: x.h }));
    }
    return rects
      .filter((r) => inBounds(page, r.x, r.y, r.w, r.h))
      .map((rc) => {
        const r = cellRect(page, geo, rc.x, rc.y, rc.w, rc.h);
        return html`<div class="drop ${d.valid ? "valid" : "invalid"}" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"></div>`;
      });
  }

  private renderLibrary() {
    const entries = filterLibrary(this.libraryEntries, this.search, this.category, this.favorites);
    const system = this.systemItems().filter(
      (s) => (this.category === "all" || this.category === s.category) && s.label.toLowerCase().includes(this.search.toLowerCase())
    );
    const showSystem = this.category === "all" || this.category === "navigation" || this.category === "system";
    return html`<section class="library" aria-label="Elementbibliothek">
      <div class="lib-head">
        <button class="ghost" @click=${() => (this.libraryOpen = !this.libraryOpen)} title="Bibliothek ein-/ausklappen">${this.libraryOpen ? "▾" : "▸"} Elemente</button>
        <input
          type="search"
          placeholder="Suchen nach Name, Entity-ID, Gerät, Bereich oder Domain …"
          .value=${this.search}
          @input=${(e: Event) => (this.search = (e.target as HTMLInputElement).value)}
          @focus=${() => (this.libraryOpen = true)}
        />
        <span class="muted small">${entries.length + (showSystem ? system.length : 0)} Treffer</span>
      </div>
      ${this.libraryOpen
        ? html`<div class="cats" role="tablist">
              ${CATEGORIES.map(
                (c) => html`<button role="tab" aria-selected=${this.category === c.key} class="cat ${this.category === c.key ? "active" : ""}" @click=${() => (this.category = c.key)}>
                  ${mdi(c.icon, "")} ${c.label}
                </button>`
              )}
            </div>
            <div class="items">
              ${showSystem
                ? system.map(
                    (s) => html`<div
                      class="item system"
                      tabindex="0"
                      title="Ziehen oder klicken zum Hinzufügen"
                      @pointerdown=${(e: PointerEvent) => this.startNewDrag(e, () => s.make(this.layout!), s.label)}
                      @keydown=${(e: KeyboardEvent) => e.key === "Enter" && this.addToActivePage(s.make(this.layout!))}
                    >
                      <span class="ic">${mdi(s.icon, s.glyph)}</span>
                      <span class="nm">${s.label}</span>
                      <span class="sub">${s.category === "navigation" ? "Navigation" : "System"}</span>
                    </div>`
                  )
                : nothing}
              ${entries.slice(0, 300).map(
                (e) => html`<div
                  class="item ${e.state === "unavailable" ? "unavail" : ""}"
                  tabindex="0"
                  title="${e.entity_id} – ziehen oder Enter zum Hinzufügen"
                  @pointerdown=${(ev: PointerEvent) => {
                    if ((ev.target as HTMLElement).closest(".fav")) return;
                    this.startNewDrag(ev, () => tileFromEntity(this.hass, e.entity_id), e.name);
                  }}
                  @keydown=${(ev: KeyboardEvent) => ev.key === "Enter" && this.addToActivePage(tileFromEntity(this.hass, e.entity_id))}
                >
                  <button class="fav ghost" title="Favorit" @click=${() => this.toggleFavorite(e.entity_id)}>${this.favorites.includes(e.entity_id) ? "★" : "☆"}</button>
                  <span class="nm">${e.name}</span>
                  <span class="sub">${e.area || e.domain} · ${e.state === "unavailable" ? "nicht verfügbar" : e.state}</span>
                  <span class="eid">${e.entity_id}</span>
                </div>`
              )}
              ${entries.length > 300 ? html`<div class="muted small more">… weitere ${entries.length - 300} – bitte Suche verfeinern</div>` : nothing}
              ${!entries.length && !(showSystem && system.length) ? html`<div class="muted more">Keine passenden Elemente gefunden.</div>` : nothing}
            </div>`
        : nothing}
    </section>`;
  }

  private renderProps() {
    const layout = this.layout!;
    const page = this.page!;
    const tiles = this.selectedTiles;
    return html`<aside class="props">
      <button class="icon ghost close-props" @click=${() => (this.propsOpen = false)} title="Schließen">✕</button>
      ${tiles.length === 1
        ? html`<gs-tile-props
            .hass=${this.hass}
            .info=${this.info}
            .layout=${layout}
            .page=${page}
            .tile=${tiles[0]}
            @gs-patch=${(e: CustomEvent<Partial<Tile>>) => this.commit(updateTile(layout, page.id, tiles[0].id, e.detail))}
            @gs-geometry=${(e: CustomEvent<{ x: number; y: number; w: number; h: number }>) => {
              const g = e.detail;
              const t = tiles[0];
              let res = moveTiles(layout, page.id, [t.id], t.id, page.id, g.x, g.y);
              if (res.ok && (g.w !== t.w || g.h !== t.h)) res = resizeTile(res.layout, page.id, t.id, g.w, g.h);
              if (res.ok) this.commit(res.layout);
              else toast(this, res.reason ?? "Nicht möglich");
            }}
            @gs-delete=${() => this.deleteSelection()}
            @gs-duplicate=${() => this.duplicateSelection()}
          ></gs-tile-props>`
        : tiles.length > 1
          ? html`<h2>${tiles.length} Kacheln ausgewählt</h2>
              <p class="muted">Gemeinsam verschieben: ziehen oder Pfeiltasten. Mit Bild↑/Bild↓ auf andere Seiten verschieben.</p>
              <div class="row">
                <button @click=${() => this.duplicateSelection()}>⊕ Duplizieren</button>
                <button @click=${() => this.copySelection()}>⧉ Kopieren</button>
                <button class="danger" @click=${() => this.deleteSelection()}>🗑 Löschen</button>
              </div>`
          : html`<div class="tabs" role="tablist">
              <button role="tab" aria-selected=${this.propsTab === "page"} class=${this.propsTab === "page" ? "active" : ""} @click=${() => (this.propsTab = "page")}>Seite</button>
              <button role="tab" aria-selected=${this.propsTab === "auto"} class=${this.propsTab === "auto" ? "active" : ""} @click=${() => (this.propsTab = "auto")}>Automatik</button>
            </div>
            ${this.propsTab === "auto"
              ? html`<gs-automation-props .hass=${this.hass} .api=${this.api} .layout=${layout} @gs-commit=${(e: CustomEvent<Layout>) => this.commit(e.detail)}></gs-automation-props>`
              : html`<gs-page-props
                  .info=${this.info}
                  .layout=${layout}
                  .page=${page}
                  @gs-commit=${(e: CustomEvent<Layout>) => this.commit(e.detail)}
                ></gs-page-props>`}
            <div class="notice small" style="margin-top:16px">
              <b>So geht's:</b> Ziehe Entitäten aus der Bibliothek unten auf eine Seite. Kacheln verschieben per Drag-and-Drop – auch zwischen Seiten.
              Ecke unten rechts zieht die Größe. Tastatur: Tab wählt Kacheln, Pfeile verschieben, Umschalt+Pfeile ändern die Größe, Entf löscht.
            </div>
            ${this.validation && !this.validation.valid
              ? html`<div class="notice warn small"><b>Vor dem Übertragen beheben:</b><ul>${this.validation.errors.slice(0, 8).map((e) => html`<li>${e}</li>`)}</ul></div>`
              : nothing}`}
    </aside>`;
  }

  private renderApplying() {
    const a = this.applying!;
    const label =
      a.state === "error"
        ? "Übertragung fehlgeschlagen"
        : a.state === "done"
          ? "Übertragen und vom Display bestätigt"
          : a.state === "confirming"
            ? "Warte auf Bestätigung des Displays …"
            : "Layout wird übertragen …";
    return html`<div class="apply-toast card ${a.state}">
      <div class="row"><b>${label}</b><span class="spacer"></span>${a.state === "error" || a.state === "done" ? html`<button class="icon ghost" @click=${() => (this.applying = null)}>✕</button>` : html`<span class="spinner"></span>`}</div>
      ${a.state !== "error" ? html`<div class="progress"><div style="width:${a.progress}%"></div></div>` : nothing}
      ${a.error
        ? html`<p class="small" style="margin-top:8px">${a.error}</p>
            <p class="small muted">Das zuletzt funktionierende Layout bleibt auf dem Display aktiv. Prüfe unter „Diagnose“, ob das Display online ist.</p>
            <button @click=${() => this.apply()}>Erneut versuchen</button>`
        : nothing}
    </div>`;
  }

  static styles = [
    sharedStyles,
    screenStyles,
    css`
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
    `,
  ];
}

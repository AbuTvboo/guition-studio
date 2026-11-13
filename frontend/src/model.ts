// Pure, immutable layout operations used by the designer (unit tested).
import { DEFAULT_WEATHER_OPTIONS, TILE_ENTITY_DOMAINS, type Layout, type Page, type Tile, type TileStyle, type TileType } from "./types";
import { cellRect, FREE_COLS, FREE_STEP, freeRows, GAP, MARGIN, pageGeometry } from "./geometry";

export const MAX_PAGES = 10;
export const MAX_GRID = 6;
export const MAX_TILES = 160;

export function newId(prefix: string): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return `${prefix}_${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;
}

export const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

export function defaultStyle(): TileStyle {
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
    opacity: 100,
    align: "auto",
    icon_size: "auto",
    state_size: "auto",
    icon_frame: "none",
    on_effect: "card",
    control: "default",
    texture: "none",
  };
}

export function makeTile(type: TileType, x = 0, y = 0, w = 1, h = 1, extra: Partial<Tile> = {}): Tile {
  return {
    id: newId("t"),
    type,
    x,
    y,
    w,
    h,
    entity: null,
    title: "",
    icon: null,
    format: type === "clock" ? "time_date" : "",
    style: defaultStyle(),
    show_title: true,
    show_state: true,
    show_icon: true,
    tap_action: { action: "default" },
    hold_action: { action: "none" },
    visibility: [],
    hours: 24,
    weather: { ...DEFAULT_WEATHER_OPTIONS },
    items: [],
    swipe_dir: "h",
    ...extra,
  };
}

export function makePage(name: string, cols = 3, rows = 3): Page {
  return { id: newId("p"), name, background: null, cols, rows, tiles: [] };
}

export function totalTiles(layout: Layout): number {
  return layout.pages.reduce((n, p) => n + p.tiles.length, 0);
}

// --------------------------------------------------------------- collision

export function inBounds(page: Pick<Page, "cols" | "rows">, x: number, y: number, w: number, h: number): boolean {
  return x >= 0 && y >= 0 && w >= 1 && h >= 1 && x + w <= page.cols && y + h <= page.rows;
}

export function overlaps(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }): boolean {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

export function isFree(page: Page, rect: { x: number; y: number; w: number; h: number }, ignore: Set<string> = new Set()): boolean {
  if (!inBounds(page, rect.x, rect.y, rect.w, rect.h)) return false;
  return !page.tiles.some((t) => !ignore.has(t.id) && overlaps(t, rect));
}

export function findFreeSpot(page: Page, w = 1, h = 1): { x: number; y: number } | null {
  for (let y = 0; y + h <= page.rows; y++) {
    for (let x = 0; x + w <= page.cols; x++) {
      if (isFree(page, { x, y, w, h })) return { x, y };
    }
  }
  return null;
}

export function occupiedCells(page: Page): boolean[][] {
  const grid = Array.from({ length: page.rows }, () => Array<boolean>(page.cols).fill(false));
  for (const t of page.tiles) {
    for (let y = t.y; y < t.y + t.h && y < page.rows; y++) for (let x = t.x; x < t.x + t.w && x < page.cols; x++) grid[y][x] = true;
  }
  return grid;
}

// --------------------------------------------------------------- tile ops

export interface MoveResult {
  layout: Layout;
  ok: boolean;
  reason?: string;
}

/**
 * Move a group of tiles from one page to a target page so that the anchor tile lands at (ax, ay).
 * All tiles keep their relative offsets. Fails (ok=false) if any tile would leave the grid or collide.
 */
export function moveTiles(layout: Layout, fromPageId: string, ids: string[], anchorId: string, toPageId: string, ax: number, ay: number): MoveResult {
  const next = clone(layout);
  const from = next.pages.find((p) => p.id === fromPageId);
  const to = next.pages.find((p) => p.id === toPageId);
  if (!from || !to) return { layout, ok: false, reason: "Seite nicht gefunden" };
  const moving = from.tiles.filter((t) => ids.includes(t.id));
  const anchor = moving.find((t) => t.id === anchorId);
  if (!anchor) return { layout, ok: false, reason: "Kachel nicht gefunden" };
  if (!!from.free !== !!to.free) {
    // grid page <-> free page: convert sizes and the offsets relative to the anchor
    for (const t of moving) {
      if (t === anchor) continue;
      const c = convertRect({ x: t.x - anchor.x, y: t.y - anchor.y, w: t.w, h: t.h }, !!from.free, !!to.free);
      Object.assign(t, { x: anchor.x + c.x, y: anchor.y + c.y, w: c.w, h: c.h });
    }
    const c = convertRect({ x: 0, y: 0, w: anchor.w, h: anchor.h }, !!from.free, !!to.free);
    anchor.w = c.w;
    anchor.h = c.h;
  }
  const dx = ax - anchor.x;
  const dy = ay - anchor.y;
  const ignore = new Set(from === to ? ids : []);
  for (const t of moving) {
    if (!isFree(to, { x: t.x + dx, y: t.y + dy, w: t.w, h: t.h }, ignore)) {
      return { layout, ok: false, reason: inBounds(to, t.x + dx, t.y + dy, t.w, t.h) ? "Platz ist belegt" : "Außerhalb des Displays" };
    }
  }
  from.tiles = from.tiles.filter((t) => !ids.includes(t.id));
  for (const t of moving) {
    t.x += dx;
    t.y += dy;
    to.tiles.push(t);
  }
  return { layout: next, ok: true };
}

export function resizeTile(layout: Layout, pageId: string, id: string, w: number, h: number): MoveResult {
  const next = clone(layout);
  const page = next.pages.find((p) => p.id === pageId);
  const tile = page?.tiles.find((t) => t.id === id);
  if (!page || !tile) return { layout, ok: false, reason: "Kachel nicht gefunden" };
  if (!isFree(page, { x: tile.x, y: tile.y, w, h }, new Set([id]))) {
    return { layout, ok: false, reason: inBounds(page, tile.x, tile.y, w, h) ? "Platz ist belegt" : "Außerhalb des Displays" };
  }
  tile.w = w;
  tile.h = h;
  return { layout: next, ok: true };
}

export function addTile(layout: Layout, pageId: string, tile: Tile): MoveResult {
  if (totalTiles(layout) >= MAX_TILES) return { layout, ok: false, reason: `Maximal ${MAX_TILES} Kacheln` };
  const next = clone(layout);
  const page = next.pages.find((p) => p.id === pageId);
  if (!page) return { layout, ok: false, reason: "Seite nicht gefunden" };
  if (!isFree(page, tile)) {
    let { w, h } = tile;
    let spot = findFreeSpot(page, w, h);
    if (!spot) {
      // smaller fallback: one grid cell, on a free page 64 px
      w = Math.min(w, page.free ? 16 : 1);
      h = Math.min(h, page.free ? 16 : 1);
      spot = findFreeSpot(page, w, h);
    }
    if (!spot) return { layout, ok: false, reason: "Kein freier Platz auf dieser Seite" };
    tile = { ...tile, ...spot, w, h };
  }
  page.tiles.push(tile);
  return { layout: next, ok: true };
}

export function updateTile(layout: Layout, pageId: string, id: string, patch: Partial<Tile>): Layout {
  const next = clone(layout);
  const tile = next.pages.find((p) => p.id === pageId)?.tiles.find((t) => t.id === id);
  if (tile) Object.assign(tile, clone(patch));
  return next;
}

export function removeTiles(layout: Layout, ids: string[]): Layout {
  const next = clone(layout);
  for (const p of next.pages) p.tiles = p.tiles.filter((t) => !ids.includes(t.id));
  return next;
}

/** Paste copies of tiles onto a page, keeping the group shape if possible, otherwise first free spots. */
export function pasteTiles(layout: Layout, pageId: string, tiles: Tile[]): { layout: Layout; ids: string[]; skipped: number } {
  let next = clone(layout);
  const ids: string[] = [];
  let skipped = 0;
  const page = () => next.pages.find((p) => p.id === pageId)!;
  if (!page()) return { layout, ids, skipped: tiles.length };
  const minX = Math.min(...tiles.map((t) => t.x));
  const minY = Math.min(...tiles.map((t) => t.y));
  // try to keep the shape: search an offset where the whole group fits
  let offset: { x: number; y: number } | null = null;
  for (let oy = 0; oy < page().rows && !offset; oy++) {
    for (let ox = 0; ox < page().cols && !offset; ox++) {
      const fits = tiles.every((t) => isFree(page(), { x: t.x - minX + ox, y: t.y - minY + oy, w: t.w, h: t.h }));
      if (fits) offset = { x: ox, y: oy };
    }
  }
  for (const t of tiles) {
    const copy: Tile = { ...clone(t), id: newId("t") };
    if (offset) {
      copy.x = t.x - minX + offset.x;
      copy.y = t.y - minY + offset.y;
    }
    const res = addTile(next, pageId, copy);
    if (res.ok) {
      next = res.layout;
      ids.push(copy.id);
    } else skipped++;
  }
  return { layout: next, ids, skipped };
}

// --------------------------------------------------------------- page ops

export function addPage(layout: Layout, name?: string): { layout: Layout; id: string } | null {
  if (layout.pages.length >= MAX_PAGES) return null;
  const next = clone(layout);
  const page = makePage(name ?? `Seite ${next.pages.length + 1}`);
  next.pages.push(page);
  return { layout: next, id: page.id };
}

export function duplicatePage(layout: Layout, pageId: string): { layout: Layout; id: string } | null {
  if (layout.pages.length >= MAX_PAGES) return null;
  const src = layout.pages.find((p) => p.id === pageId);
  if (!src || totalTiles(layout) + src.tiles.length > MAX_TILES) return null;
  const next = clone(layout);
  const copy: Page = { ...clone(src), id: newId("p"), name: `${src.name} (Kopie)` };
  copy.tiles = copy.tiles.map((t) => ({ ...t, id: newId("t") }));
  next.pages.splice(next.pages.findIndex((p) => p.id === pageId) + 1, 0, copy);
  return { layout: next, id: copy.id };
}

export function removePage(layout: Layout, pageId: string): Layout | null {
  if (layout.pages.length <= 1) return null;
  const next = clone(layout);
  next.pages = next.pages.filter((p) => p.id !== pageId);
  // remove navigation actions pointing to the deleted page
  for (const p of next.pages)
    for (const t of p.tiles)
      for (const key of ["tap_action", "hold_action"] as const)
        if (t[key].action === "navigate" && t[key].page === pageId) t[key] = { action: "none" };
  if (next.settings.home_page === pageId) next.settings.home_page = next.pages[0].id;
  if (next.settings.rules) next.settings.rules = next.settings.rules.filter((r) => r.page !== pageId);
  if (next.settings.night?.page === pageId) next.settings.night = { ...next.settings.night, page: null };
  return next;
}

export function movePage(layout: Layout, from: number, to: number): Layout {
  const next = clone(layout);
  if (to < 0 || to >= next.pages.length || from === to) return next;
  const [p] = next.pages.splice(from, 1);
  next.pages.splice(to, 0, p);
  return next;
}

// --------------------------------------------------------------- free layout

/** Reference cell when converting without a concrete page geometry (≈ a 4×4 grid cell). */
const REF_CELL = 108;

/**
 * Convert a rect (position relative to some origin + size) between grid units and the 4 px units
 * of a free page, e.g. for tiles from the library (always grid sized) or tiles moved between pages.
 */
export function convertRect(r: { x: number; y: number; w: number; h: number }, fromFree: boolean, toFree: boolean) {
  if (fromFree === toFree) return { ...r };
  const unit = REF_CELL + GAP;
  if (toFree) {
    const size = (n: number) => Math.max(1, Math.round((n * REF_CELL + (n - 1) * GAP) / FREE_STEP));
    const pos = (n: number) => Math.round((n * unit) / FREE_STEP);
    return { x: pos(r.x), y: pos(r.y), w: size(r.w), h: size(r.h) };
  }
  const size = (n: number) => Math.max(1, Math.round((n * FREE_STEP + GAP) / unit));
  const pos = (n: number) => Math.round((n * FREE_STEP) / unit);
  return { x: pos(r.x), y: pos(r.y), w: size(r.w), h: size(r.h) };
}

/** Tile sized for the given page (library tiles come in grid units). */
export function fitTile(tile: Tile, page: Page | undefined, fromFree = false): Tile {
  if (!page || !!page.free === fromFree) return tile;
  const c = convertRect({ x: 0, y: 0, w: tile.w, h: tile.h }, fromFree, !!page.free);
  return { ...tile, w: Math.min(c.w, page.cols), h: Math.min(c.h, page.rows) };
}

/** Keep the fine grid of free pages in sync with the page area (header, page dots). */
export function syncFreePages(layout: Layout): Layout {
  const geo = pageGeometry(layout.settings, layout.pages.length);
  const rows = freeRows(geo);
  if (!layout.pages.some((p) => p.free && (p.cols !== FREE_COLS || p.rows !== rows))) return layout;
  const next = clone(layout);
  for (const p of next.pages) {
    if (!p.free) continue;
    p.cols = FREE_COLS;
    p.rows = rows;
  }
  return next;
}

/**
 * Switch a page between the cell grid and the free layout. Tiles keep their position on the screen:
 * grid -> free is exact (4 px), free -> grid snaps them into a 6×6 grid (fails if they would collide).
 */
export function setFree(layout: Layout, pageId: string, free: boolean): MoveResult {
  const next = clone(layout);
  const page = next.pages.find((p) => p.id === pageId);
  if (!page) return { layout, ok: false, reason: "Seite nicht gefunden" };
  if (!!page.free === free) return { layout, ok: true };
  const geo = pageGeometry(next.settings, next.pages.length);
  const rects = page.tiles.map((t) => cellRect(page, geo, t.x, t.y, t.w, t.h));
  if (free) {
    page.tiles.forEach((t, i) => {
      const r = rects[i];
      t.x = Math.floor((r.x - MARGIN) / FREE_STEP);
      t.y = Math.floor((r.y - MARGIN) / FREE_STEP);
      t.w = Math.max(1, Math.floor(r.w / FREE_STEP));
      t.h = Math.max(1, Math.floor(r.h / FREE_STEP));
    });
    page.free = true;
    page.cols = FREE_COLS;
    page.rows = freeRows(geo);
    return { layout: next, ok: true };
  }
  const grid = { cols: MAX_GRID, rows: MAX_GRID };
  const cell = cellRect(grid, geo, 0, 0, 1, 1);
  const unitW = cell.w + GAP;
  const unitH = cell.h + GAP;
  page.tiles.forEach((t, i) => {
    const r = rects[i];
    t.w = Math.max(1, Math.min(grid.cols, Math.round((r.w + GAP) / unitW)));
    t.h = Math.max(1, Math.min(grid.rows, Math.round((r.h + GAP) / unitH)));
    t.x = Math.max(0, Math.min(grid.cols - t.w, Math.round((r.x - MARGIN) / unitW)));
    t.y = Math.max(0, Math.min(grid.rows - t.h, Math.round((r.y - MARGIN) / unitH)));
  });
  const clash = page.tiles.some((a, i) => page.tiles.some((b, j) => j > i && overlaps(a, b)));
  if (clash) return { layout, ok: false, reason: "Im Raster würden sich Kacheln überlappen. Bitte erst Abstand zwischen den Kacheln lassen." };
  page.free = false;
  page.cols = grid.cols;
  page.rows = grid.rows;
  return { layout: next, ok: true };
}

export function setGrid(layout: Layout, pageId: string, cols: number, rows: number): MoveResult {
  if (cols < 1 || rows < 1 || cols > MAX_GRID || rows > MAX_GRID) return { layout, ok: false, reason: `Raster muss zwischen 1×1 und ${MAX_GRID}×${MAX_GRID} liegen` };
  const next = clone(layout);
  const page = next.pages.find((p) => p.id === pageId);
  if (!page) return { layout, ok: false, reason: "Seite nicht gefunden" };
  const outside = page.tiles.filter((t) => t.x + t.w > cols || t.y + t.h > rows);
  if (outside.length) {
    return { layout, ok: false, reason: `${outside.length} Kachel(n) lägen außerhalb des neuen Rasters. Bitte zuerst verschieben oder verkleinern.` };
  }
  page.cols = cols;
  page.rows = rows;
  return { layout: next, ok: true };
}

/** Tiles that still need an entity before the layout can be transferred. */
export function missingEntities(layout: Layout): Tile[] {
  return layout.pages.flatMap((p) => p.tiles.filter((t) => needsEntity(t) && !t.entity));
}

export function needsEntity(tile: Pick<Tile, "type">): boolean {
  return tile.type in TILE_ENTITY_DOMAINS;
}

/** German hint if the entity's domain does not fit the tile type, else null. */
export function entityDomainProblem(tile: Pick<Tile, "type" | "entity">): string | null {
  const allowed = TILE_ENTITY_DOMAINS[tile.type];
  if (!tile.entity || !allowed) return null;
  if (allowed.includes(tile.entity.split(".", 1)[0])) return null;
  const labels: Record<string, string> = { weather: "Wetter", light: "Licht", cover: "Rollladen", climate: "Thermostat", water_heater: "Warmwasser", media_player: "Mediaplayer", sensor: "Sensor", number: "Zahlen", input_number: "Zahlen-Helfer" };
  return `Dieser Kacheltyp braucht eine ${allowed.map((d) => labels[d] ?? d).join(" oder ")}-Entität (${allowed.map((d) => `${d}.…`).join(", ")}). Bitte in der Liste auswählen.`;
}

// Pixel geometry of the device screen. MUST match the firmware
// (guition_studio.h) and const.py, otherwise the preview is not WYSIWYG.
import type { DisplaySettings, Page } from "./types";

export const SCREEN = 480;
export const HEADER_H = 44;
export const DOTS_H = 22;
export const MARGIN = 8;
export const GAP = 8;
/** free layout ("Freie Anordnung"): fine grid of FREE_STEP px without gaps */
export const FREE_STEP = 4;
export const FREE_COLS = Math.floor((SCREEN - 2 * MARGIN) / FREE_STEP);

type GridPage = Pick<Page, "cols" | "rows"> & { free?: boolean };

/** Rows of the fine grid of a free page (depends on header / page dots). */
export function freeRows(geo: PageGeometry): number {
  return Math.floor((geo.height - 2 * MARGIN) / FREE_STEP);
}

export interface PageGeometry {
  top: number;
  bottom: number;
  height: number; // page area height (between header and dots)
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function pageGeometry(settings: Pick<DisplaySettings, "show_header" | "show_dots">, pageCount: number): PageGeometry {
  const top = settings.show_header ? HEADER_H : 0;
  const bottom = settings.show_dots && pageCount > 1 ? DOTS_H : 0;
  return { top, bottom, height: SCREEN - top - bottom };
}

function cellSize(page: GridPage, geo: PageGeometry) {
  if (page.free) return { cw: FREE_STEP, ch: FREE_STEP, gap: 0 };
  const areaW = SCREEN - 2 * MARGIN;
  const areaH = geo.height - 2 * MARGIN;
  // integer division exactly like the C++ code
  const cw = Math.floor((areaW - (page.cols - 1) * GAP) / page.cols);
  const ch = Math.floor((areaH - (page.rows - 1) * GAP) / page.rows);
  return { cw, ch, gap: GAP };
}

/** Rect in page-area coordinates (relative to the top of the page area). */
export function cellRect(page: GridPage, geo: PageGeometry, x: number, y: number, w: number, h: number): Rect {
  const { cw, ch, gap } = cellSize(page, geo);
  return {
    x: MARGIN + x * (cw + gap),
    y: MARGIN + y * (ch + gap),
    w: w * cw + (w - 1) * gap,
    h: h * ch + (h - 1) * gap,
  };
}

/** Cell under a point given in page-area coordinates, clamped into the grid. */
export function pointToCell(page: GridPage, geo: PageGeometry, px: number, py: number): { x: number; y: number } {
  const { cw, ch, gap } = cellSize(page, geo);
  const x = Math.floor((px - MARGIN + gap / 2) / (cw + gap));
  const y = Math.floor((py - MARGIN + gap / 2) / (ch + gap));
  return { x: Math.max(0, Math.min(page.cols - 1, x)), y: Math.max(0, Math.min(page.rows - 1, y)) };
}

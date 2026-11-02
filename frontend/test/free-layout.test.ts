import { describe, expect, it } from "vitest";
import { cellRect, FREE_COLS, freeRows, pageGeometry } from "../src/geometry";
import { convertRect, fitTile, makePage, makeTile, moveTiles, setFree, syncFreePages } from "../src/model";
import type { Layout } from "../src/types";

function layout(): Layout {
  const p1 = makePage("Eins");
  const p2 = makePage("Zwei");
  p1.tiles.push(makeTile("light", 0, 0, 1, 1, { id: "t_a", entity: "light.a" }), makeTile("switch", 1, 0, 2, 1, { id: "t_b", entity: "switch.b" }));
  return {
    schema: 1,
    revision: 0,
    settings: { theme: "modern_dark", brightness: 80, standby_brightness: 10, timeout: 60, home_after: 0, home_page: p1.id, show_header: true, show_dots: true, swipe: true, language: "de" },
    pages: [p1, p2],
  } as Layout;
}

describe("free layout", () => {
  it("keeps the tiles where they are when switching to free (within 4 px)", () => {
    const l = layout();
    const geo = pageGeometry(l.settings, l.pages.length);
    const before = l.pages[0].tiles.map((t) => cellRect(l.pages[0], geo, t.x, t.y, t.w, t.h));
    const res = setFree(l, l.pages[0].id, true);
    expect(res.ok).toBe(true);
    const page = res.layout.pages[0];
    expect(page.free).toBe(true);
    expect(page.cols).toBe(FREE_COLS);
    expect(page.rows).toBe(freeRows(geo));
    page.tiles.forEach((t, i) => {
      const r = cellRect(page, geo, t.x, t.y, t.w, t.h);
      expect(Math.abs(r.x - before[i].x)).toBeLessThan(4);
      expect(Math.abs(r.w - before[i].w)).toBeLessThan(4);
    });
  });

  it("snaps back into a 6×6 grid", () => {
    const l = layout();
    const free = setFree(l, l.pages[0].id, true).layout;
    const back = setFree(free, l.pages[0].id, false);
    expect(back.ok).toBe(true);
    expect(back.layout.pages[0].free).toBe(false);
    expect(back.layout.pages[0].cols).toBe(6);
    expect(back.layout.pages[0].tiles.map((t) => [t.x, t.y, t.w, t.h])).toEqual([
      [0, 0, 2, 2],
      [2, 0, 4, 2],
    ]);
  });

  it("converts sizes for library tiles and between page kinds", () => {
    const l = setFree(layout(), "x", true).layout; // unknown page: unchanged
    expect(l.pages[0].free).toBeFalsy();
    expect(convertRect({ x: 0, y: 0, w: 1, h: 1 }, false, true)).toEqual({ x: 0, y: 0, w: 27, h: 27 });
    const base = layout();
    const freePage = setFree(base, base.pages[1].id, true).layout.pages[1];
    const t = fitTile(makeTile("light", 0, 0, 2, 1), freePage);
    expect(t.w).toBe(56);
    expect(t.h).toBe(27);
  });

  it("moves a grid tile onto a free page with a matching pixel size", () => {
    let l = layout();
    l = setFree(l, l.pages[1].id, true).layout;
    const res = moveTiles(l, l.pages[0].id, ["t_a"], "t_a", l.pages[1].id, 10, 10);
    expect(res.ok).toBe(true);
    const moved = res.layout.pages[1].tiles[0];
    expect([moved.x, moved.y, moved.w, moved.h]).toEqual([10, 10, 27, 27]);
  });

  it("follows header changes with the row count", () => {
    let l = layout();
    l = setFree(l, l.pages[0].id, true).layout;
    const rows = l.pages[0].rows;
    l = syncFreePages({ ...l, settings: { ...l.settings, show_header: false } });
    expect(l.pages[0].rows).toBe(rows + 11);
  });
});

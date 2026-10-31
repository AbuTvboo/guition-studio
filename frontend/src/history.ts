// Snapshot based undo/redo for layouts.
export class History<T> {
  private past: string[] = [];
  private future: string[] = [];

  constructor(private readonly limit = 100) {}

  /** Record the state *before* a change. */
  push(state: T): void {
    const snap = JSON.stringify(state);
    if (this.past[this.past.length - 1] === snap) return;
    this.past.push(snap);
    if (this.past.length > this.limit) this.past.shift();
    this.future = [];
  }

  undo(current: T): T | null {
    const prev = this.past.pop();
    if (prev === undefined) return null;
    this.future.push(JSON.stringify(current));
    return JSON.parse(prev) as T;
  }

  redo(current: T): T | null {
    const next = this.future.pop();
    if (next === undefined) return null;
    this.past.push(JSON.stringify(current));
    return JSON.parse(next) as T;
  }

  clear(): void {
    this.past = [];
    this.future = [];
  }

  get canUndo(): boolean {
    return this.past.length > 0;
  }

  get canRedo(): boolean {
    return this.future.length > 0;
  }
}

// Typed wrapper around the guition_studio/* websocket commands.
import type {
  Candidate,
  DisplayStatus,
  FirmwareStatus,
  Hass,
  Layout,
  LogEntry,
  StudioInfo,
  Template,
  Validation,
} from "./types";

export class StudioApi {
  constructor(private hass: () => Hass) {}

  private call<T>(type: string, data: Record<string, unknown> = {}): Promise<T> {
    return this.hass().connection.sendMessagePromise<T>({ type: `guition_studio/${type}`, ...data });
  }

  info = () => this.call<StudioInfo>("info");
  displays = () => this.call<DisplayStatus[]>("displays");
  candidates = () => this.call<Candidate[]>("candidates");
  createDisplay = (d: { name: string; node?: string | null; device_id?: string | null; hardware?: string; layout?: Layout }) =>
    this.call<DisplayStatus>("display/create", d);
  updateDisplay = (display_id: string, d: { name?: string; node?: string | null; device_id?: string | null }) =>
    this.call<DisplayStatus>("display/update", { display_id, ...d });
  deleteDisplay = (display_id: string) => this.call("display/delete", { display_id });
  getLayout = (display_id: string) =>
    this.call<{ layout: Layout; draft_saved_at: string; applied_revision: number | null; applied_at: string | null }>("layout/get", { display_id });
  saveLayout = (display_id: string, layout: Layout) => this.call<Validation & { saved_at: string }>("layout/save", { display_id, layout });
  validate = (layout: Layout) => this.call<Validation>("layout/validate", { layout });
  apply = (display_id: string, layout: Layout) =>
    this.call<{ ok: boolean; revision: number; size: number; crc: number; attempts: number }>("layout/apply", { display_id, layout });
  copyLayout = (source: string, target: string) => this.call("layout/copy", { source, target });
  command = (display_id: string, command: string, extra: Record<string, unknown> = {}) => this.call("display/command", { display_id, command, ...extra });
  saveTemplate = (name: string, description: string, layout: Layout) => this.call<Template>("template/save", { name, description, layout });
  deleteTemplate = (template_id: string) => this.call("template/delete", { template_id });
  setFavorites = (favorites: string[]) => this.call("favorites", { favorites });
  exportBackup = () => this.call<Record<string, unknown>>("backup/export");
  restoreBackup = (backup: unknown) => this.call<{ ok: boolean; displays: number }>("backup/restore", { backup });
  log = () => this.call<{ entries: LogEntry[]; debug: boolean }>("log");
  setDebug = (enabled: boolean) => this.call("debug", { enabled });
  firmwareStatus = () => this.call<FirmwareStatus>("firmware/status");
  firmwareCheck = () => this.call<{ latest: FirmwareStatus["latest"]; error: string | null }>("firmware/check");
  firmwareDownload = (version: string) => this.call<{ version: string; verified: boolean }>("firmware/download", { version });
  slideFolders = () => this.call<{ root: string; folders: { folder: string; count: number }[] }>("slideshow/folders");
  firmwareDelete = (versions: string[]) => this.call<{ removed: string[] }>("firmware/delete", { versions });
  firmwareOta = (display_id: string, version: string) => this.call<{ url: string }>("firmware/ota", { display_id, version });
}

export function errorText(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) return String((err as { message: string }).message);
  return String(err);
}

export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export function pickJsonFile(): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return reject(new Error("Keine Datei gewählt"));
      try {
        resolve(JSON.parse(await file.text()));
      } catch {
        reject(new Error("Die Datei enthält kein gültiges JSON."));
      }
    };
    input.click();
  });
}

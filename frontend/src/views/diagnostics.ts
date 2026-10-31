import { css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { downloadJson, errorText } from "../api";
import type { LogEntry } from "../types";
import { formatBytes, relTime, toast } from "../ui";
import { StudioView } from "./base";

@customElement("gs-diagnostics")
export class GsDiagnostics extends StudioView {
  @state() private entries: LogEntry[] = [];
  @state() private level = "all";
  @state() private debug = false;
  private timer?: number;

  connectedCallback(): void {
    super.connectedCallback();
    this.load();
    this.timer = window.setInterval(() => this.load(), 4000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearInterval(this.timer);
  }

  private async load() {
    try {
      const res = await this.api.log();
      this.entries = res.entries.slice().reverse();
      this.debug = res.debug;
    } catch {
      /* ignore */
    }
  }

  private async cmd(id: string, command: string, label: string) {
    try {
      await this.api.command(id, command);
      toast(this, `${label}: OK`, "ok");
      setTimeout(() => this.load(), 800);
    } catch (err) {
      toast(this, errorText(err), "error");
    }
  }

  render() {
    const name = (id: string | null) => (id ? this.displays.find((d) => d.id === id)?.name ?? id : "–");
    const shown = this.entries.filter((e) => this.level === "all" || e.level === this.level);
    return html`
      <div class="page-head">
        <h1>Diagnose & Protokolle</h1><span class="spacer"></span>
        <label class="check" style="margin:0"><input type="checkbox" .checked=${this.debug} @change=${async (e: Event) => {
          this.debug = (e.target as HTMLInputElement).checked;
          await this.api.setDebug(this.debug);
        }} /> Debug-Modus</label>
        <button @click=${() => downloadJson("guition-studio-log.json", { displays: this.displays, log: this.entries })}>⇩ Exportieren</button>
      </div>
      <div class="grid">
        ${this.displays.map(
          (d) => html`<div class="card">
            <div class="row"><h2 style="margin:0">${d.name}</h2><span class="spacer"></span><span class="chip ${d.online ? "ok" : "error"}">${d.online ? "online" : "offline"}</span></div>
            <table class="small">
              <tr><th>ESPHome-Gerät</th><td>${d.node ?? "–"} ${d.linked ? html`<span class="chip ok">Aktionen ✓</span>` : html`<span class="chip error">keine Aktionen</span>`}</td></tr>
              <tr><th>Firmware / Protokoll</th><td>${d.firmware ?? "–"} / ${d.protocol ?? "–"}</td></tr>
              <tr><th>Layout HA / Gerät</th><td>Rev. ${d.applied_revision ?? "–"} / Rev. ${d.device_revision ?? "–"} ${d.applied_revision != null ? html`<span class="chip ${d.in_sync ? "ok" : "warn"}">${d.in_sync ? "synchron" : "abweichend"}</span>` : nothing}</td></tr>
              <tr><th>Layoutgröße</th><td>${formatBytes(d.applied_size)} von ${formatBytes(this.info.limits.bytes)}</td></tr>
              <tr><th>Freier RAM / PSRAM</th><td>${formatBytes(d.heap)} / ${formatBytes(d.psram)}</td></tr>
              <tr><th>Laufzeit</th><td>${d.uptime != null ? `${Math.floor(d.uptime / 3600)} h ${Math.floor((d.uptime % 3600) / 60)} min` : "–"} (Stand ${relTime(d.last_seen)})</td></tr>
              <tr><th>Aktuelle Seite</th><td>${d.page != null ? d.page + 1 : "–"}</td></tr>
              <tr><th>Nachtmodus</th><td>${d.night == null ? "–" : d.night ? "aktiv" : "aus"}</td></tr>
              <tr><th>Neustarts / min. freier RAM</th><td>${d.reboots ?? 0} / ${formatBytes(d.heap_min)}</td></tr>
              <tr><th>Letzte Übertragung</th><td>${d.transfer.state}${d.transfer.error ? ` – ${d.transfer.error}` : ""}</td></tr>
            </table>
            <div class="row" style="margin-top:10px">
              <button ?disabled=${!d.linked} @click=${() => this.cmd(d.id, "hello", "Status angefordert")}>Status abfragen</button>
              <button ?disabled=${!d.linked} @click=${() => this.cmd(d.id, "push_states", "Zustände gesendet")}>Zustände senden</button>
              <button ?disabled=${!d.linked || d.applied_revision == null} @click=${() => this.cmd(d.id, "resend", "Layout erneut gesendet")}>Layout erneut senden</button>
            </div>
          </div>`
        )}
      </div>
      <section class="card" style="margin-top:24px">
        <div class="row">
          <h2 style="margin:0">Protokoll</h2><span class="spacer"></span>
          <select style="width:auto" @change=${(e: Event) => (this.level = (e.target as HTMLSelectElement).value)}>
            <option value="all">Alle</option><option value="error">Fehler</option><option value="warning">Warnungen</option><option value="info">Info</option><option value="debug">Debug</option>
          </select>
          <button class="icon" title="Aktualisieren" @click=${() => this.load()}>↻</button>
        </div>
        <table class="log small">
          <tr><th>Zeit</th><th>Display</th><th>Meldung</th></tr>
          ${shown.length === 0 ? html`<tr><td colspan="3" class="muted">Noch keine Einträge.</td></tr>` : nothing}
          ${shown.map(
            (e) => html`<tr class=${e.level}>
              <td class="ts">${new Date(e.ts).toLocaleTimeString("de-DE")}</td>
              <td>${name(e.display_id)}</td>
              <td><span class="lvl ${e.level}">${e.level}</span> ${e.message}</td>
            </tr>`
          )}
        </table>
      </section>
    `;
  }

  static styles = [
    ...StudioView.styles,
    css`
      th {
        width: 44%;
      }
      .log th:first-child,
      .ts {
        width: 90px;
        white-space: nowrap;
      }
      .log th:nth-child(2) {
        width: 160px;
      }
      .lvl {
        font-size: 10px;
        text-transform: uppercase;
        padding: 1px 6px;
        border-radius: 4px;
        background: var(--gs-surface-2);
        margin-right: 6px;
      }
      .lvl.error {
        background: var(--gs-error);
        color: #fff;
      }
      .lvl.warning {
        background: var(--gs-warn);
        color: #fff;
      }
    `,
  ];
}

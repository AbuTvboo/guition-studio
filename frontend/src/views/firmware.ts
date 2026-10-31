import { css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { errorText } from "../api";
import type { DisplayStatus, FirmwareStatus } from "../types";
import { confirmDialog, formatBytes, toast } from "../ui";
import { StudioView } from "./base";
import "./installer";

function cmpVersion(a: string, b: string): number {
  const pa = a.split(/[.-]/).map((x) => parseInt(x, 10) || 0);
  const pb = b.split(/[.-]/).map((x) => parseInt(x, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) - (pb[i] ?? 0);
  return 0;
}

@customElement("gs-firmware")
export class GsFirmware extends StudioView {
  @state() private status: FirmwareStatus | null = null;
  @state() private busy: string | null = null;
  @state() private target: Record<string, string> = {};
  @state() private showUsb = false;

  connectedCallback(): void {
    super.connectedCallback();
    this.load();
  }

  private async load() {
    try {
      this.status = await this.api.firmwareStatus();
    } catch (err) {
      toast(this, errorText(err), "error");
    }
  }

  private async check() {
    this.busy = "check";
    try {
      const res = await this.api.firmwareCheck();
      if (res.error) toast(this, res.error, "error");
      await this.load();
    } finally {
      this.busy = null;
    }
  }

  private async download(version: string) {
    this.busy = "download";
    try {
      await this.api.firmwareDownload(version);
      toast(this, `Firmware ${version} heruntergeladen und SHA-256 geprüft ✓`, "ok");
      await this.load();
    } catch (err) {
      toast(this, errorText(err), "error");
    } finally {
      this.busy = null;
    }
  }

  private async ota(d: DisplayStatus, version: string) {
    const ok = await confirmDialog(this, {
      title: `Firmware ${version} installieren?`,
      text:
        `„${d.name}“ lädt die Firmware über WLAN von Home Assistant und startet neu (ca. 1–2 Minuten).\n\n` +
        "Das Display während des Updates nicht vom Strom trennen. Schlägt das Update fehl, bleibt die bisherige Firmware aktiv; " +
        "im schlimmsten Fall ist eine Neuinstallation per USB möglich (siehe Wiederherstellung).",
      confirm: "Update starten",
      danger: true,
    });
    if (!ok) return;
    this.busy = d.id;
    try {
      await this.api.firmwareOta(d.id, version);
      toast(this, "Update gestartet – Fortschritt siehe unten", "ok");
      this.refreshAll();
    } catch (err) {
      toast(this, errorText(err), "error");
    } finally {
      this.busy = null;
    }
  }

  render() {
    const s = this.status;
    const otaVersions = s?.local.filter((v) => v.ota && v.verified !== false) ?? [];
    const latest = s?.latest;
    const haveLatest = latest && s?.local.some((v) => v.version === latest.version);
    return html`
      <div class="page-head"><h1>Firmware-Manager</h1><span class="spacer"></span><button ?disabled=${this.busy === "check"} @click=${() => this.check()}>${this.busy === "check" ? html`<span class="spinner"></span>` : "↻"} Nach Updates suchen</button></div>
      <section class="grid">
        <div class="card">
          <h2>Neueste Veröffentlichung</h2>
          ${latest
            ? html`<p><b>${latest.version}</b> <span class="muted small">${latest.published ? new Date(latest.published).toLocaleDateString("de-DE") : ""}</span></p>
                ${latest.complete ? nothing : html`<div class="notice warn small">Release enthält nicht alle benötigten Dateien.</div>`}
                <details><summary class="small">Änderungen</summary><pre class="notes">${latest.notes || "–"}</pre></details>
                <div class="row" style="margin-top:8px">
                  ${haveLatest
                    ? html`<span class="chip ok">✓ heruntergeladen</span>`
                    : html`<button class="primary" ?disabled=${!latest.complete || this.busy === "download"} @click=${() => this.download(latest.version)}>
                        ${this.busy === "download" ? html`<span class="spinner"></span>` : "⇩"} Herunterladen & prüfen
                      </button>`}
                  <a class="btn" href=${latest.url} target="_blank" rel="noopener">Release ↗</a>
                </div>`
            : html`<p class="muted">${s?.error ?? "Noch nicht geprüft. Klicke auf „Nach Updates suchen“."}</p>`}
          <p class="small muted">Quelle: <code>${s?.repo ?? this.info.firmware_repo}</code></p>
        </div>
        <div class="card">
          <h2>In Home Assistant verfügbar</h2>
          ${s?.local.length
            ? html`<table class="small">
                <tr><th>Version</th><th>Quelle</th><th>OTA-Größe</th><th>Prüfung</th></tr>
                ${s.local.map(
                  (v) => html`<tr><td><b>${v.version}</b></td><td>${v.source === "release" ? "GitHub-Release" : "Lokal"}</td><td>${formatBytes(v.ota_size)}</td>
                    <td>${v.verified ? html`<span class="chip ok">SHA-256 ✓</span>` : v.verified === false ? html`<span class="chip error">fehlerhaft</span>` : html`<span class="chip">ohne Prüfsumme</span>`}</td></tr>`
                )}
              </table>`
            : html`<p class="muted">Keine Firmware vorhanden.</p>`}
          <p class="small muted">Ablageort: <code>${s?.path ?? "…"}</code></p>
        </div>
      </section>

      <section class="card">
        <h2>Displays aktualisieren (OTA)</h2>
        ${this.displays.length === 0 ? html`<p class="muted">Keine Displays.</p>` : nothing}
        <table>
          <tr><th>Display</th><th>Installiert</th><th>Status</th><th>Zielversion</th><th></th></tr>
          ${this.displays.map((d) => {
            const target = this.target[d.id] ?? otaVersions[0]?.version ?? "";
            const newer = d.firmware && target ? cmpVersion(target, d.firmware) > 0 : false;
            const ota = d.ota?.state && d.ota.state !== "idle" ? d.ota : null;
            return html`<tr>
              <td><b>${d.name}</b></td>
              <td>${d.firmware ?? "–"}</td>
              <td>
                ${ota
                  ? ota.state === "error"
                    ? html`<span class="chip error">Update fehlgeschlagen</span>`
                    : html`<div class="progress" style="width:140px"><div style="width:${ota.progress}%"></div></div><span class="small muted">${ota.state} ${ota.progress}%</span>`
                  : html`<span class="chip ${d.online ? "ok" : "error"}">${d.online ? "online" : "offline"}</span>`}
              </td>
              <td>
                <select .value=${target} @change=${(e: Event) => (this.target = { ...this.target, [d.id]: (e.target as HTMLSelectElement).value })} ?disabled=${!otaVersions.length}>
                  ${otaVersions.map((v) => html`<option value=${v.version} ?selected=${v.version === target}>${v.version}</option>`)}
                </select>
              </td>
              <td>
                <button class=${newer ? "primary" : ""} ?disabled=${!d.online || !target || this.busy === d.id} @click=${() => this.ota(d, target)}>
                  ${newer ? "Update installieren" : "Erneut installieren"}
                </button>
              </td>
            </tr>`;
          })}
        </table>
        <p class="small muted">OTA läuft ausschließlich über die verschlüsselte ESPHome-Verbindung: Home Assistant teilt dem Display die Download-Adresse und MD5-Prüfsumme mit; ein offener OTA-Port existiert nicht.</p>
      </section>

      <section class="card">
        <div class="row"><h2 style="margin:0">Installation per USB</h2><span class="spacer"></span><button @click=${() => (this.showUsb = !this.showUsb)}>${this.showUsb ? "Ausblenden" : "Anzeigen"}</button></div>
        ${this.showUsb ? html`<gs-usb-installer .api=${this.api} .firmwareUrl=${this.info.firmware_url} .installerUrl=${this.info.installer_url}></gs-usb-installer>` : html`<p class="muted small">Für Erstinstallation oder Wiederherstellung.</p>`}
      </section>

      <section class="card">
        <h2>Wiederherstellung nach fehlgeschlagenem Update</h2>
        <ol class="small" style="line-height:1.8">
          <li>Das ESP32-S3 nutzt zwei App-Partitionen: Ein abgebrochenes OTA-Update wird nicht aktiviert, die alte Firmware startet weiter.</li>
          <li>Startet das Display nicht mehr: per USB verbinden, oben „Installation per USB“ öffnen und die Firmware neu installieren.</li>
          <li>Wird kein Port erkannt: BOOT-Taste halten, RESET kurz drücken, BOOT loslassen – das Board ist dann im ROM-Bootloader und immer flashbar.</li>
          <li>Layouts liegen in Home Assistant. Nach der Neuinstallation überträgt Guition Studio das zuletzt bestätigte Layout automatisch wieder.</li>
        </ol>
      </section>
    `;
  }

  static styles = [
    ...StudioView.styles,
    css`
      .notes {
        white-space: pre-wrap;
        font-size: 12px;
        max-height: 200px;
        overflow: auto;
      }
      td select {
        min-width: 110px;
      }
    `,
  ];
}

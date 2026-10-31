import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { errorText, type StudioApi } from "../api";
import type { FirmwareStatus } from "../types";
import { sharedStyles, toast } from "../ui";

export type SerialProblem = "insecure" | "brave" | "mobile" | "browser";

export function webSerialSupport(): { ok: boolean; problem: SerialProblem | null } {
  if ("serial" in navigator && window.isSecureContext) return { ok: true, problem: null };
  if (/Android|iPhone|iPad/i.test(navigator.userAgent)) return { ok: false, problem: "mobile" };
  if ((navigator as Navigator & { brave?: unknown }).brave) return { ok: false, problem: "brave" };
  if (!window.isSecureContext) return { ok: false, problem: "insecure" };
  return { ok: false, problem: "browser" };
}

const PROBLEM_TEXT: Record<SerialProblem, string> = {
  insecure: "Home Assistant ist über http:// geöffnet – dort erlaubt der Browser keinen USB-Zugriff. Kein Problem: der Guition-Installer läuft über eine sichere Seite.",
  brave: "Brave unterstützt die USB-Installation nicht zuverlässig. Öffne den Installer am besten in Google Chrome oder Microsoft Edge (bei Windows vorinstalliert).",
  mobile: "Auf Smartphones und Tablets ist keine USB-Installation möglich. Öffne den Installer an einem Computer mit Chrome oder Edge.",
  browser: "Dieser Browser kann nicht per USB installieren. Öffne den Installer in Google Chrome oder Microsoft Edge.",
};

/** USB installation via ESP Web Tools with a documented fallback path. */
@customElement("gs-usb-installer")
export class GsUsbInstaller extends LitElement {
  @property({ attribute: false }) api!: StudioApi;
  @property({ attribute: false }) firmwareUrl = "/api/guition_studio/firmware";
  @property({ attribute: false }) installerUrl = "";
  @state() private status: FirmwareStatus | null = null;
  @state() private version = "";
  @state() private busy = false;
  @state() private ewtLoaded = false;
  @state() private error: string | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this.load();
  }

  private async load() {
    try {
      this.status = await this.api.firmwareStatus();
      const factory = this.status.local.filter((v) => v.factory);
      if (!this.version && factory.length) this.version = factory[0].version;
      if (webSerialSupport().ok && !this.ewtLoaded) {
        await import("esp-web-tools");
        this.ewtLoaded = true;
      }
    } catch (err) {
      this.error = errorText(err);
    }
  }

  private async downloadLatest() {
    this.busy = true;
    try {
      const check = await this.api.firmwareCheck();
      if (!check.latest) throw new Error(check.error ?? "Keine Firmware-Veröffentlichung gefunden.");
      await this.api.firmwareDownload(check.latest.version);
      toast(this, `Firmware ${check.latest.version} heruntergeladen und geprüft ✓`, "ok");
      this.version = check.latest.version;
      await this.load();
    } catch (err) {
      toast(this, errorText(err), "error");
    } finally {
      this.busy = false;
    }
  }

  /** Easiest path: the HTTPS installer page (GitHub Pages) works independent of how HA is opened. */
  private renderOnlineInstaller(problem: SerialProblem | null) {
    return html`<div class="online ${problem ? "primary-path" : ""}">
      ${problem ? html`<p>${PROBLEM_TEXT[problem]}</p>` : nothing}
      <a class="btn big primary" href=${this.installerUrl} target="_blank" rel="noopener">🔌 Sicheren Installer öffnen ↗</a>
      <p class="small muted">Öffnet <code>${this.installerUrl}</code> in einem neuen Tab: Display per USB anschließen, „Installieren“ klicken, WLAN eingeben – danach hier weiter.</p>
    </div>`;
  }

  private renderOfflineAlternatives() {
    const local = this.status?.local.find((v) => v.factory);
    const fileUrl = local ? `${this.firmwareUrl}/${local.version}/firmware.factory.bin` : `https://github.com/${this.status?.repo ?? ""}/releases/latest`;
    return html`<ol class="small alt-list">
      <li>${local ? html`<a href=${fileUrl} download>firmware.factory.bin herunterladen</a>` : html`<a href=${fileUrl} target="_blank" rel="noopener">firmware.factory.bin aus dem neuesten Release laden ↗</a>`}</li>
      <li>Mit esptool flashen: <code>python -m esptool --chip esp32s3 write_flash 0x0 firmware.factory.bin</code></li>
      <li>WLAN danach über <a href="https://www.improv-wifi.com/" target="_blank" rel="noopener">improv-wifi.com</a> (USB, Chrome/Edge) einrichten.</li>
      <li>Oder Home Assistant über HTTPS bzw. am selben Rechner unter <code>http://localhost:8123</code> öffnen – dann klappt die Installation auch direkt hier.</li>
    </ol>`;
  }

  render() {
    if (this.error) return html`<div class="notice error">${this.error}</div>`;
    const support = webSerialSupport();
    if (!support.ok && this.installerUrl) {
      return html`${this.renderOnlineInstaller(support.problem)}
        <details class="alt">
          <summary class="small">Andere Wege (ohne Internet / für Fortgeschrittene)</summary>
          ${this.renderOfflineAlternatives()}
        </details>`;
    }
    if (!this.status) return html`<span class="spinner"></span> Prüfe verfügbare Firmware …`;
    const factory = this.status.local.filter((v) => v.factory);
    const manifest = `${this.firmwareUrl}/${this.version}/manifest.json`;
    const selected = factory.find((v) => v.version === this.version);
    return html`
      ${factory.length === 0
        ? html`<div class="notice warn">
            Es ist noch keine Firmware in Home Assistant vorhanden.
            <div class="row" style="margin-top:8px">
              <button class="primary" ?disabled=${this.busy} @click=${() => this.downloadLatest()}>
                ${this.busy ? html`<span class="spinner"></span>` : "⇩"} Neueste geprüfte Firmware herunterladen
              </button>
            </div>
            <p class="small muted" style="margin-top:8px">Quelle: GitHub-Releases von <code>${this.status.repo}</code>. Alternativ eine selbst gebaute Firmware nach <code>${this.status.path}/&lt;version&gt;/</code> kopieren (siehe Firmware-Anleitung).</p>
          </div>`
        : html`<label class="field"><span>Firmwareversion</span>
              <select @change=${(e: Event) => (this.version = (e.target as HTMLSelectElement).value)}>
                ${factory.map((v) => html`<option value=${v.version} ?selected=${v.version === this.version}>${v.version} ${v.source === "release" ? "(Release)" : "(lokal)"} ${v.verified ? "✓ geprüft" : v.verified === false ? "⚠ Prüfsumme falsch" : ""}</option>`)}
              </select>
            </label>
            ${selected?.verified === false ? html`<div class="notice error">Die Prüfsumme dieser Firmware stimmt nicht. Bitte nicht installieren und neu herunterladen.</div>` : nothing}
            ${support.ok
              ? html`<div class="install">
                  ${this.ewtLoaded
                    ? html`<esp-web-install-button manifest=${manifest}>
                        <button slot="activate" class="primary big" ?disabled=${selected?.verified === false}>🔌 Gerät verbinden & Firmware installieren</button>
                        <span slot="unsupported">Dein Browser unterstützt keine Installation über USB.</span>
                        <span slot="not-allowed">Installation nur über HTTPS möglich.</span>
                      </esp-web-install-button>`
                    : html`<span class="spinner"></span> Lade Installer …`}
                  <ol class="small">
                    <li>Display per USB-C-Kabel (Datenkabel!) mit diesem Computer verbinden.</li>
                    <li>Auf die Schaltfläche klicken und im Browser-Dialog den seriellen Port wählen (meist „USB Serial“, „CH340“ oder „CP210x“).</li>
                    <li>Der Installer erkennt den Chip automatisch und bricht ab, wenn es kein ESP32-S3 ist.</li>
                    <li>Bei Erstinstallation „Gerät löschen“ bestätigen. Danach WLAN-Zugangsdaten im selben Dialog eingeben (Improv).</li>
                  </ol>
                  <p class="small muted">Erkennt der Browser das Board nicht: BOOT-Taste gedrückt halten, kurz RESET drücken, BOOT loslassen und erneut verbinden.</p>
                  ${this.installerUrl ? html`<p class="small muted">Alternativ: <a href=${this.installerUrl} target="_blank" rel="noopener">Online-Installer öffnen ↗</a></p>` : nothing}
                </div>`
              : this.renderOfflineAlternatives()}`}
    `;
  }

  static styles = [
    sharedStyles,
    css`
      .install ol {
        line-height: 1.7;
        padding-left: 18px;
      }
      button.big {
        min-height: 48px;
        font-size: 15px;
        padding: 0 22px;
      }
      a {
        color: var(--gs-primary);
      }
      .online {
        text-align: center;
        padding: 18px;
        border-radius: 14px;
        background: color-mix(in srgb, var(--gs-primary) 7%, transparent);
        margin-bottom: 12px;
      }
      a.btn.big {
        min-height: 52px;
        font-size: 16px;
        padding: 0 26px;
        background: linear-gradient(135deg, #3d8bfd, #8b5cf6);
        border: none;
        color: #fff;
        font-weight: 600;
        margin: 6px 0 10px;
      }
      .alt summary {
        cursor: pointer;
        color: var(--gs-muted);
      }
      .alt-list {
        line-height: 1.8;
        padding-left: 18px;
      }
    `,
  ];
}

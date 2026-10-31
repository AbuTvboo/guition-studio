import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { errorText, type StudioApi } from "../api";
import type { FirmwareStatus } from "../types";
import { sharedStyles, toast } from "../ui";

export function webSerialSupport(): { ok: boolean; reason: string | null } {
  if (!window.isSecureContext) {
    return {
      ok: false,
      reason:
        "Home Assistant wird nicht über HTTPS (oder localhost) geöffnet. Web Serial ist aus Sicherheitsgründen nur in einem sicheren Kontext verfügbar.",
    };
  }
  if (!("serial" in navigator)) {
    return { ok: false, reason: "Dieser Browser unterstützt kein Web Serial. Bitte Chrome, Edge oder Opera am Computer verwenden." };
  }
  return { ok: true, reason: null };
}

/** USB installation via ESP Web Tools with a documented fallback path. */
@customElement("gs-usb-installer")
export class GsUsbInstaller extends LitElement {
  @property({ attribute: false }) api!: StudioApi;
  @property({ attribute: false }) firmwareUrl = "/api/guition_studio/firmware";
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

  render() {
    if (this.error) return html`<div class="notice error">${this.error}</div>`;
    if (!this.status) return html`<span class="spinner"></span> Prüfe verfügbare Firmware …`;
    const factory = this.status.local.filter((v) => v.factory);
    const support = webSerialSupport();
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
                </div>`
              : html`<div class="notice warn">
                  <b>USB-Installation im Browser nicht möglich.</b> ${support.reason}
                  <p style="margin-top:8px"><b>Alternative:</b></p>
                  <ol class="small">
                    <li><a href=${`${this.firmwareUrl}/${this.version}/firmware.factory.bin`} download>firmware.factory.bin herunterladen</a></li>
                    <li>Mit esptool flashen: <code>esptool.py --chip esp32s3 write_flash 0x0 firmware.factory.bin</code></li>
                    <li>Oder Home Assistant über HTTPS bzw. am Rechner unter <code>http://localhost:8123</code> öffnen und hier erneut versuchen.</li>
                    <li>WLAN danach über <a href="https://www.improv-wifi.com/" target="_blank" rel="noopener">improv-wifi.com</a> (USB) einrichten.</li>
                  </ol>
                </div>`}`}
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
    `,
  ];
}

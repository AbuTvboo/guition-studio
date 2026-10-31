import { css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { errorText } from "../api";
import type { Candidate, DisplayStatus } from "../types";
import { confirmDialog, promptDialog, relTime, toast } from "../ui";
import { StudioView } from "./base";
import "./installer";

type Step = 1 | 2 | 3 | 4 | 5;

@customElement("gs-displays")
export class GsDisplays extends StudioView {
  @state() private wizard = false;
  @state() private step: Step = 1;
  @state() private name = "Wohnzimmer-Display";
  @state() private hardware = "guition-4848s040";
  @state() private method: "usb" | "ota" = "usb";
  @state() private candidates: Candidate[] = [];
  @state() private chosen: Candidate | null = null;
  @state() private created: DisplayStatus | null = null;
  @state() private busy = false;
  @state() private linkFor: string | null = null;
  private poll?: number;

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearInterval(this.poll);
  }

  private async loadCandidates() {
    try {
      this.candidates = await this.api.candidates();
    } catch (err) {
      toast(this, errorText(err), "error");
    }
  }

  private startPolling() {
    window.clearInterval(this.poll);
    this.loadCandidates();
    this.poll = window.setInterval(() => this.loadCandidates(), 3000);
  }

  private openWizard() {
    this.wizard = true;
    this.step = 1;
    this.chosen = null;
    this.created = null;
  }

  private gotoStep(step: Step) {
    this.step = step;
    if (step === 4) this.startPolling();
    else window.clearInterval(this.poll);
  }

  private async finish() {
    this.busy = true;
    try {
      this.created = await this.api.createDisplay({
        name: this.name.trim() || "Guition-Display",
        hardware: this.hardware,
        node: this.chosen?.node ?? null,
        device_id: this.chosen?.device_id ?? null,
      });
      window.clearInterval(this.poll);
      this.step = 5;
      this.refreshAll();
    } catch (err) {
      toast(this, errorText(err), "error");
    } finally {
      this.busy = false;
    }
  }

  private async sendInitial() {
    if (!this.created) return;
    this.busy = true;
    try {
      const res = await this.api.getLayout(this.created.id);
      await this.api.apply(this.created.id, res.layout);
      toast(this, "Startlayout wurde auf das Display übertragen ✓", "ok");
    } catch (err) {
      toast(this, errorText(err), "error");
    } finally {
      this.busy = false;
    }
  }

  private async rename(d: DisplayStatus) {
    const name = await promptDialog(this, "Display umbenennen", d.name);
    if (!name) return;
    await this.api.updateDisplay(d.id, { name });
    this.refreshAll();
  }

  private async removeDisplay(d: DisplayStatus) {
    const ok = await confirmDialog(this, {
      title: "Display entfernen?",
      text: `„${d.name}“ inklusive aller Seiten wird aus Guition Studio entfernt. Das ESPHome-Gerät selbst bleibt in Home Assistant und behält sein aktuelles Layout.`,
      confirm: "Entfernen",
      danger: true,
    });
    if (!ok) return;
    await this.api.deleteDisplay(d.id);
    this.refreshAll();
  }

  private async link(d: DisplayStatus, c: Candidate | null) {
    try {
      await this.api.updateDisplay(d.id, { node: c?.node ?? null, device_id: c?.device_id ?? null });
      toast(this, c ? `Mit ${c.name} verknüpft` : "Verknüpfung entfernt", "ok");
      this.linkFor = null;
      this.refreshAll();
    } catch (err) {
      toast(this, errorText(err), "error");
    }
  }

  private async copyTo(d: DisplayStatus, targetId: string) {
    const target = this.displays.find((x) => x.id === targetId);
    if (!target) return;
    const ok = await confirmDialog(this, {
      title: "Layout kopieren?",
      text: `Der Entwurf von „${target.name}“ wird durch das Layout von „${d.name}“ ersetzt.`,
      confirm: "Kopieren",
    });
    if (!ok) return;
    await this.api.copyLayout(d.id, targetId);
    toast(this, "Layout kopiert – im Designer prüfen und übertragen.", "ok");
  }

  private async command(d: DisplayStatus, command: string, label: string, danger = false) {
    if (danger) {
      const ok = await confirmDialog(this, { title: `${label}?`, text: `Diese Aktion wird sofort auf „${d.name}“ ausgeführt.`, confirm: label, danger: true });
      if (!ok) return;
    }
    try {
      await this.api.command(d.id, command, command === "notify" ? { title: "Guition Studio", message: "Testnachricht aus Home Assistant 👋" } : {});
      toast(this, `${label}: erledigt`, "ok");
    } catch (err) {
      toast(this, errorText(err), "error");
    }
  }

  render() {
    return html`
      <div class="page-head">
        <h1>Meine Displays</h1>
        <span class="spacer"></span>
        <button class="primary" @click=${() => this.openWizard()}>＋ Neues Display einrichten</button>
      </div>
      ${this.wizard ? this.renderWizard() : nothing}
      ${this.displays.length === 0 && !this.wizard ? html`<div class="card"><p>Noch keine Displays eingerichtet.</p></div>` : nothing}
      <div class="list">${this.displays.map((d) => this.renderDisplay(d))}</div>
    `;
  }

  private renderDisplay(d: DisplayStatus) {
    const others = this.displays.filter((x) => x.id !== d.id);
    return html`<div class="card disp">
      <div class="row">
        <h2 style="margin:0">${d.name}</h2>
        <span class="chip ${d.online ? "ok" : d.linked ? "error" : "warn"}">${d.online ? "● Online" : d.linked ? "○ Offline" : "Nicht verknüpft"}</span>
        <span class="spacer"></span>
        <button class="primary" @click=${() => this.go("designer", d.id)}>✎ Designer</button>
        <button class="icon" title="Umbenennen" @click=${() => this.rename(d)}>✎</button>
        <button class="icon danger" title="Entfernen" @click=${() => this.removeDisplay(d)}>🗑</button>
      </div>
      <table class="facts small">
        <tr><th>Gerät (ESPHome)</th><td>${d.node ? html`<code>${d.node}</code>` : html`<span class="muted">nicht verknüpft</span>`}
          <button class="small-btn" @click=${() => { this.linkFor = this.linkFor === d.id ? null : d.id; this.loadCandidates(); }}>${d.node ? "Ändern" : "Verknüpfen"}</button></td></tr>
        <tr><th>Hardware</th><td>${this.info.hardware.find((h) => h.id === d.hardware)?.name ?? d.hardware}</td></tr>
        <tr><th>Firmware</th><td>${d.firmware ?? "–"} ${d.protocol != null && d.protocol !== this.info.protocol ? html`<span class="chip error">Protokoll inkompatibel</span>` : nothing}</td></tr>
        <tr><th>Layout</th><td>${d.applied_revision != null ? `Revision ${d.applied_revision}, ${relTime(d.applied_at)}` : "noch nicht übertragen"} ${d.applied_revision != null ? html`<span class="chip ${d.in_sync ? "ok" : "warn"}">${d.in_sync ? "synchron" : "abweichend"}</span>` : nothing}</td></tr>
        <tr><th>Zuletzt gesehen</th><td>${relTime(d.last_seen)}</td></tr>
      </table>
      ${this.linkFor === d.id ? this.renderLinker(d) : nothing}
      <div class="row" style="margin-top:12px">
        <button ?disabled=${!d.online} @click=${() => this.command(d, "notify", "Testbenachrichtigung")}>🔔 Testbenachrichtigung</button>
        <button ?disabled=${!d.online} @click=${() => this.command(d, "push_states", "Zustände senden")}>↻ Zustände senden</button>
        <button ?disabled=${!d.online} @click=${() => this.command(d, "rollback", "Vorheriges Layout wiederherstellen", true)}>⎌ Rollback</button>
        <button ?disabled=${!d.online} @click=${() => this.command(d, "reboot", "Neustart", true)}>⟳ Neustart</button>
        ${others.length
          ? html`<select class="copy" @change=${(e: Event) => {
              const sel = e.target as HTMLSelectElement;
              if (sel.value) this.copyTo(d, sel.value);
              sel.value = "";
            }}>
              <option value="">Layout kopieren nach …</option>
              ${others.map((o) => html`<option value=${o.id}>${o.name}</option>`)}
            </select>`
          : nothing}
      </div>
    </div>`;
  }

  private renderLinker(d: DisplayStatus) {
    const free = this.candidates.filter((c) => !c.assigned_display || c.assigned_display === d.id);
    return html`<div class="notice">
      ${free.length
        ? html`<p>Gefundene Guition-Studio-Geräte in Home Assistant:</p>
            ${free.map((c) => html`<div class="row cand"><b>${c.name}</b> <code>${c.node}</code><span class="spacer"></span><button @click=${() => this.link(d, c)}>Verknüpfen</button></div>`)}`
        : html`<p>Kein freies Gerät gefunden. Ist das Display in der ESPHome-Integration hinzugefügt und online?</p>`}
      ${d.node ? html`<button class="danger" @click=${() => this.link(d, null)}>Verknüpfung entfernen</button>` : nothing}
    </div>`;
  }

  private renderWizard() {
    const steps = ["Display hinzufügen", "Gerät verbinden", "Firmware installieren", "WLAN & Home Assistant", "Designer öffnen"];
    return html`<div class="card wizard">
      <div class="row"><h2 style="margin:0">Neues Display einrichten</h2><span class="spacer"></span><button class="icon ghost" title="Schließen" @click=${() => { this.wizard = false; window.clearInterval(this.poll); }}>✕</button></div>
      <ol class="steps">
        ${steps.map((s, i) => html`<li class=${i + 1 === this.step ? "active" : i + 1 < this.step ? "done" : ""}><span>${i + 1 < this.step ? "✓" : i + 1}</span>${s}</li>`)}
      </ol>
      <div class="step-body">${this.renderStep()}</div>
    </div>`;
  }

  private renderStep() {
    switch (this.step) {
      case 1:
        return html`
          <label class="field"><span>Anzeigename</span><input maxlength="40" .value=${this.name} @input=${(e: Event) => (this.name = (e.target as HTMLInputElement).value)} /></label>
          <label class="field"><span>Hardwareprofil</span>
            <select @change=${(e: Event) => (this.hardware = (e.target as HTMLSelectElement).value)}>
              ${this.info.hardware.map((h) => html`<option value=${h.id} ?selected=${h.id === this.hardware}>${h.name}</option>`)}
            </select>
          </label>
          <div class="notice small">
            <b>Unterstützte Hardware:</b> ${this.info.hardware.map((h) => html`${h.name} – ${h.description}`)}<br />
            Weitere Displays sind architektonisch vorgesehen, werden in dieser Version aber noch nicht unterstützt.
          </div>
          <div class="methods">
            <label class="method ${this.method === "usb" ? "sel" : ""}"><input type="radio" name="m" .checked=${this.method === "usb"} @change=${() => (this.method = "usb")} />
              <b>🔌 Neu installieren (USB)</b><span class="muted small">Für neue Displays: Firmware direkt aus dem Browser aufspielen.</span></label>
            <label class="method ${this.method === "ota" ? "sel" : ""}"><input type="radio" name="m" .checked=${this.method === "ota"} @change=${() => (this.method = "ota")} />
              <b>📡 Bereits installiert (WLAN)</b><span class="muted small">Das Display läuft schon mit Guition-Studio-Firmware und ist in Home Assistant.</span></label>
          </div>
          <div class="row nav"><span class="spacer"></span><button class="primary" ?disabled=${!this.name.trim()} @click=${() => this.gotoStep(this.method === "usb" ? 2 : 4)}>Weiter</button></div>`;
      case 2:
        return html`
          <p>Verbinde das Guition-Display mit einem <b>USB-C-Datenkabel</b> mit diesem Computer. Das Display muss nicht geöffnet werden.</p>
          <ul class="small">
            <li>Browser: Google Chrome oder Microsoft Edge am Computer</li>
            <li>Ist Home Assistant über <code>http://</code> geöffnet, startet im nächsten Schritt automatisch der sichere Online-Installer</li>
            <li>Unter Windows wird ggf. ein CH340-Treiber benötigt</li>
          </ul>
          <div class="row nav"><button @click=${() => this.gotoStep(1)}>Zurück</button><span class="spacer"></span><button class="primary" @click=${() => this.gotoStep(3)}>Weiter zur Installation</button></div>`;
      case 3:
        return html`
          <div class="notice warn small"><b>Achtung:</b> Die Installation überschreibt die vorhandene Firmware des Displays vollständig.</div>
          <gs-usb-installer .api=${this.api} .firmwareUrl=${this.info.firmware_url} .installerUrl=${this.info.installer_url}></gs-usb-installer>
          <div class="row nav"><button @click=${() => this.gotoStep(2)}>Zurück</button><span class="spacer"></span><button class="primary" @click=${() => this.gotoStep(4)}>Installation abgeschlossen – weiter</button></div>`;
      case 4: {
        const free = this.candidates.filter((c) => !c.assigned_display);
        return html`
          <ol class="small" style="line-height:1.8">
            <li>WLAN wurde im Installationsdialog eingerichtet (Improv). Das Display zeigt danach „Noch kein Layout vorhanden“.</li>
            <li>Home Assistant erkennt das Gerät automatisch: <b>Einstellungen → Geräte & Dienste → Entdeckt → ESPHome → Hinzufügen</b>.
              Der Verschlüsselungsschlüssel wird dabei automatisch erzeugt und auf dem Display gespeichert.</li>
            <li>Sobald das Gerät hinzugefügt ist, erscheint es hier:</li>
          </ol>
          <a class="btn" href="/config/integrations/dashboard" target="_top">Geräte & Dienste öffnen ↗</a>
          <div class="cands">
            ${free.length
              ? free.map(
                  (c) => html`<label class="method ${this.chosen?.node === c.node ? "sel" : ""}">
                    <input type="radio" name="cand" .checked=${this.chosen?.node === c.node} @change=${() => (this.chosen = c)} />
                    <b>${c.name}</b><span class="muted small"><code>${c.node}</code> ${c.firmware ? `· Firmware ${c.firmware}` : ""} · ✓ Guition-Studio-Aktionen gefunden</span>
                  </label>`
                )
              : html`<div class="row muted"><span class="spinner"></span> Suche nach Guition-Studio-Geräten in Home Assistant …</div>`}
          </div>
          <div class="row nav">
            <button @click=${() => this.gotoStep(this.method === "usb" ? 3 : 1)}>Zurück</button><span class="spacer"></span>
            <button title="Display ohne Gerät anlegen und später verknüpfen" @click=${() => this.finish()}>Später verknüpfen</button>
            <button class="primary" ?disabled=${!this.chosen || this.busy} @click=${() => this.finish()}>Verknüpfen & weiter</button>
          </div>`;
      }
      case 5:
        return html`
          <div class="notice ok"><b>„${this.created?.name}“ wurde angelegt.</b> Ein Startlayout mit Uhrzeit und Statusanzeige wurde erstellt.</div>
          ${this.created?.linked
            ? html`<p>Übertrage das Startlayout jetzt zur Kontrolle auf das Display oder gestalte direkt eigene Seiten.</p>
                <div class="row"><button ?disabled=${this.busy} @click=${() => this.sendInitial()}>${this.busy ? html`<span class="spinner"></span>` : "⇪"} Startlayout übertragen</button></div>`
            : html`<p class="muted">Das Display ist noch nicht mit einem Gerät verknüpft. Das kannst du jederzeit unter „Meine Displays“ nachholen.</p>`}
          <div class="row nav"><span class="spacer"></span><button class="primary" @click=${() => { this.wizard = false; this.go("designer", this.created?.id); }}>✎ Designer öffnen</button></div>`;
    }
  }

  static styles = [
    ...StudioView.styles,
    css`
      .list {
        display: grid;
        gap: 16px;
      }
      .facts th {
        width: 160px;
      }
      .small-btn {
        min-height: 26px;
        padding: 0 8px;
        font-size: 12px;
        margin-left: 8px;
      }
      select.copy {
        width: auto;
      }
      .cand {
        padding: 6px 0;
      }
      .wizard {
        margin-bottom: 24px;
      }
      .steps {
        display: flex;
        list-style: none;
        padding: 0;
        margin: 16px 0;
        gap: 6px;
        flex-wrap: wrap;
      }
      .steps li {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px 6px 6px;
        border-radius: 999px;
        background: var(--gs-surface-2);
        color: var(--gs-muted);
        font-size: 13px;
      }
      .steps li span {
        display: grid;
        place-items: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--gs-border);
        font-weight: 600;
      }
      .steps li.active {
        color: var(--gs-primary);
        font-weight: 600;
      }
      .steps li.active span {
        background: var(--gs-primary);
        color: #fff;
      }
      .steps li.done span {
        background: var(--gs-ok);
        color: #fff;
      }
      .step-body {
        max-width: 720px;
      }
      .methods,
      .cands {
        display: grid;
        gap: 10px;
        margin: 14px 0;
      }
      .method {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 2px 10px;
        padding: 12px 14px;
        border: 2px solid var(--gs-border);
        border-radius: 12px;
        cursor: pointer;
      }
      .method input {
        grid-row: span 2;
        width: 18px;
      }
      .method.sel {
        border-color: var(--gs-primary);
        background: color-mix(in srgb, var(--gs-primary) 6%, transparent);
      }
      .nav {
        margin-top: 18px;
      }
    `,
  ];
}


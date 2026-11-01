import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { StudioApi, errorText } from "./api";
import { mdi, sharedStyles, type ConfirmOptions } from "./ui";
import type { DisplayStatus, Hass, StudioInfo } from "./types";
import "./views/overview";
import "./views/displays";
import "./views/designer";
import "./views/firmware";
import "./views/templates";
import "./views/settings";
import "./views/diagnostics";

export type ViewKey = "overview" | "displays" | "designer" | "firmware" | "templates" | "settings" | "diagnostics";

const NAV: { key: ViewKey; label: string; icon: string; glyph: string }[] = [
  { key: "overview", label: "Übersicht", icon: "mdi:view-dashboard", glyph: "▦" },
  { key: "displays", label: "Meine Displays", icon: "mdi:tablet", glyph: "▢" },
  { key: "designer", label: "Display-Designer", icon: "mdi:pencil-ruler", glyph: "✎" },
  { key: "firmware", label: "Firmware-Manager", icon: "mdi:chip", glyph: "⚙" },
  { key: "templates", label: "Vorlagen", icon: "mdi:palette-swatch", glyph: "❖" },
  { key: "settings", label: "Einstellungen", icon: "mdi:cog", glyph: "⚙" },
  { key: "diagnostics", label: "Diagnose & Protokolle", icon: "mdi:stethoscope", glyph: "♥" },
];

interface DialogState extends ConfirmOptions {
  kind: "confirm" | "prompt";
  value?: string;
  label?: string;
  resolve: (v: any) => void;
}

@customElement("guition-studio-panel")
export class GuitionStudioPanel extends LitElement {
  @property({ attribute: false }) hass!: Hass;
  @property({ type: Boolean }) narrow = false;

  @state() private view: ViewKey = "overview";
  @state() private info?: StudioInfo;
  @state() private displays: DisplayStatus[] = [];
  @state() private selected: string | null = null;
  @state() private error: string | null = null;
  @state() private dialog: DialogState | null = null;
  @state() private toasts: { id: number; message: string; kind: string }[] = [];
  @state() private navOpen = false;

  readonly api = new StudioApi(() => this.hass);
  private unsub?: () => void;
  private refreshTimer?: number;
  private toastId = 0;

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("gs-confirm", this.onConfirm as EventListener);
    this.addEventListener("gs-prompt", this.onPrompt as EventListener);
    this.addEventListener("gs-toast", this.onToast as EventListener);
    this.addEventListener("gs-navigate", this.onNavigate as EventListener);
    this.addEventListener("gs-refresh", () => this.refresh());
    const v = new URLSearchParams(location.search).get("view") as ViewKey | null;
    if (v && NAV.some((n) => n.key === v)) this.view = v;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unsub?.();
    this.unsub = undefined;
    window.clearInterval(this.refreshTimer);
  }

  protected async firstUpdated(): Promise<void> {
    await this.load();
    try {
      this.unsub = await this.hass.connection.subscribeEvents((ev: any) => {
        if (ev.data?.kind === "transfer" || ev.data?.kind === "ota") {
          this.dispatchEvent(new CustomEvent("gs-progress", { detail: ev.data }));
        }
        this.scheduleRefresh();
      }, "guition_studio_updated");
    } catch {
      /* non-admin users cannot subscribe; the panel requires admin anyway */
    }
    this.refreshTimer = window.setInterval(() => this.refresh(), 15000);
  }

  private scheduleTimer?: number;
  private scheduleRefresh() {
    window.clearTimeout(this.scheduleTimer);
    this.scheduleTimer = window.setTimeout(() => this.refresh(), 400);
  }

  async load(): Promise<void> {
    try {
      this.info = await this.api.info();
      await this.refresh();
      if (!this.selected && this.displays.length) this.selected = this.displays[0].id;
      this.error = null;
    } catch (err) {
      this.error = `Guition Studio konnte nicht geladen werden: ${errorText(err)}`;
    }
  }

  async refresh(): Promise<void> {
    try {
      this.displays = await this.api.displays();
      if (this.selected && !this.displays.some((d) => d.id === this.selected)) this.selected = this.displays[0]?.id ?? null;
    } catch (err) {
      this.error = errorText(err);
    }
  }

  async reloadInfo(): Promise<void> {
    this.info = await this.api.info();
  }

  private onNavigate = (ev: CustomEvent<{ view: ViewKey; display?: string }>) => {
    this.view = ev.detail.view;
    if (ev.detail.display) this.selected = ev.detail.display;
    this.navOpen = false;
    this.refresh();
  };

  private onConfirm = (ev: CustomEvent) => {
    ev.stopPropagation();
    this.dialog = { kind: "confirm", ...ev.detail };
  };

  private onPrompt = (ev: CustomEvent) => {
    ev.stopPropagation();
    this.dialog = { kind: "prompt", confirm: "Übernehmen", text: "", ...ev.detail };
  };

  private onToast = (ev: CustomEvent<{ message: string; kind: string }>) => {
    const id = ++this.toastId;
    this.toasts = [...this.toasts, { id, ...ev.detail }];
    setTimeout(() => (this.toasts = this.toasts.filter((t) => t.id !== id)), ev.detail.kind === "error" ? 8000 : 4000);
  };

  private closeDialog(result: boolean) {
    const d = this.dialog;
    if (!d) return;
    this.dialog = null;
    if (d.kind === "prompt") {
      const input = this.renderRoot.querySelector<HTMLInputElement>("#prompt-input");
      d.resolve(result ? input?.value.trim() || null : null);
    } else d.resolve(result);
  }

  private renderView() {
    if (!this.info) return html`<div class="loading"><span class="spinner"></span> Lade Guition Studio …</div>`;
    const common = { hass: this.hass, api: this.api, info: this.info, displays: this.displays };
    switch (this.view) {
      case "overview":
        return html`<gs-overview .hass=${common.hass} .api=${this.api} .info=${this.info} .displays=${this.displays}></gs-overview>`;
      case "displays":
        return html`<gs-displays .hass=${common.hass} .api=${this.api} .info=${this.info} .displays=${this.displays}></gs-displays>`;
      case "designer":
        return html`<gs-designer
          .hass=${common.hass}
          .api=${this.api}
          .info=${this.info}
          .displays=${this.displays}
          .displayId=${this.selected}
          @gs-select-display=${(e: CustomEvent<string>) => (this.selected = e.detail)}
        ></gs-designer>`;
      case "firmware":
        return html`<gs-firmware .hass=${common.hass} .api=${this.api} .info=${this.info} .displays=${this.displays}></gs-firmware>`;
      case "templates":
        return html`<gs-templates
          .hass=${common.hass}
          .api=${this.api}
          .info=${this.info}
          .displays=${this.displays}
          .displayId=${this.selected}
          @gs-info-changed=${() => this.reloadInfo()}
        ></gs-templates>`;
      case "settings":
        return html`<gs-settings .hass=${common.hass} .api=${this.api} .info=${this.info} .displays=${this.displays} .displayId=${this.selected}></gs-settings>`;
      case "diagnostics":
        return html`<gs-diagnostics .hass=${common.hass} .api=${this.api} .info=${this.info} .displays=${this.displays}></gs-diagnostics>`;
    }
  }

  render() {
    return html`
      <div class="shell ${this.narrow ? "narrow" : ""}">
        <header class="topbar">
          <button class="icon ghost menu" title="Menü" @click=${() => (this.navOpen = !this.navOpen)}>${mdi("mdi:menu", "≡")}</button>
          <div class="brand"><span class="logo">GS</span> <span>Guition <b>Studio</b></span></div>
          <span class="spacer"></span>
          ${this.info ? html`<span class="chip">v${this.info.version}</span>` : nothing}
        </header>
        <div class="body">
          <nav class="${this.navOpen ? "open" : ""}" aria-label="Guition Studio Navigation">
            ${NAV.map(
              (n) => html`<button
                class="nav-item ${this.view === n.key ? "active" : ""}"
                aria-current=${this.view === n.key ? "page" : "false"}
                @click=${() => {
                  this.view = n.key;
                  this.navOpen = false;
                }}
              >
                ${mdi(n.icon, n.glyph)}<span>${n.label}</span>
              </button>`
            )}
          </nav>
          <main>${this.error ? html`<div class="notice error">${this.error} <button @click=${() => this.load()}>Erneut versuchen</button></div>` : nothing}${this.renderView()}</main>
        </div>
      </div>
      ${this.dialog ? this.renderDialog(this.dialog) : nothing}
      <div class="toasts" role="status" aria-live="polite">${this.toasts.map((t) => html`<div class="toast ${t.kind}">${t.message}</div>`)}</div>
    `;
  }

  private renderDialog(d: DialogState) {
    return html`<div class="scrim" @click=${(e: Event) => e.target === e.currentTarget && this.closeDialog(false)}>
      <div
        class="dialog card"
        role="dialog"
        aria-modal="true"
        @keydown=${(e: KeyboardEvent) => {
          if (e.key === "Escape") this.closeDialog(false);
          if (e.key === "Enter" && d.kind === "prompt") this.closeDialog(true);
        }}
      >
        <h2>${d.title}</h2>
        ${d.text ? html`<p style="white-space:pre-line">${d.text}</p>` : nothing}
        ${d.kind === "prompt"
          ? html`<label class="field"><span>${d.label}</span><input id="prompt-input" .value=${d.value ?? ""} maxlength="40" autofocus /></label>`
          : nothing}
        <div class="row" style="justify-content:flex-end;margin-top:12px">
          <button @click=${() => this.closeDialog(false)}>Abbrechen</button>
          <button class=${d.danger ? "primary danger-fill" : "primary"} @click=${() => this.closeDialog(true)} autofocus>${d.confirm ?? "OK"}</button>
        </div>
      </div>
    </div>`;
  }

  protected updated(): void {
    this.toggleAttribute("dark", !!this.hass?.themes?.darkMode);
    if (this.dialog?.kind === "prompt") this.renderRoot.querySelector<HTMLInputElement>("#prompt-input")?.focus();
  }

  static styles = [
    sharedStyles,
    css`
      /* Guition Studio palette: petrol primary, amber accent, cool slate neutrals. */
      :host {
        --gsp-bg: #f3f6f9;
        --gsp-surface: #ffffff;
        --gsp-surface-2: #eef2f6;
        --gsp-text: #0f1c2a;
        --gsp-muted: #5b6b7c;
        --gsp-border: #dfe5ec;
        --gsp-primary: #0e7490;
        --gsp-primary-strong: #155e75;
        --gsp-on-primary: #ffffff;
        --gsp-accent: #f59e0b;
        --gsp-ok: #15803d;
        --gsp-warn: #b45309;
        --gsp-error: #b91c1c;
        --gsp-shadow: 0 1px 2px rgba(15, 28, 42, 0.05), 0 2px 8px rgba(15, 28, 42, 0.04);
        --gsp-shadow-lg: 0 12px 32px rgba(15, 28, 42, 0.18);
        --gsp-bar: linear-gradient(90deg, #0b1d2a 0%, #0f2b3a 60%, #114052 100%);
        display: block;
        height: 100%;
        background: var(--gs-bg);
      }
      :host([dark]) {
        --gsp-bg: #0b1117;
        --gsp-surface: #121a23;
        --gsp-surface-2: #19232e;
        --gsp-text: #e6edf3;
        --gsp-muted: #8b98a5;
        --gsp-border: #253241;
        --gsp-primary: #22b8cf;
        --gsp-primary-strong: #0ea5c0;
        --gsp-on-primary: #04212a;
        --gsp-accent: #fbbf24;
        --gsp-ok: #3fb950;
        --gsp-warn: #f0b429;
        --gsp-error: #f87171;
        --gsp-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
        --gsp-shadow-lg: 0 16px 40px rgba(0, 0, 0, 0.55);
        --gsp-bar: linear-gradient(90deg, #070d13 0%, #0b1a24 60%, #0d2a36 100%);
      }
      .shell {
        display: flex;
        flex-direction: column;
        height: 100vh;
      }
      .topbar {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 56px;
        padding: 0 16px;
        background: var(--gsp-bar);
        color: #f1f5f9;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        box-shadow: 0 1px 0 rgba(0, 0, 0, 0.15);
        flex-shrink: 0;
      }
      .topbar .chip {
        background: rgba(255, 255, 255, 0.1);
        color: #cbd5e1;
        font-variant-numeric: tabular-nums;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 17px;
        font-weight: 600;
        letter-spacing: -0.01em;
      }
      .brand b {
        font-weight: 400;
        color: #7dd3e8;
      }
      .logo {
        position: relative;
        display: grid;
        place-items: center;
        width: 30px;
        height: 30px;
        border-radius: 8px;
        background: linear-gradient(135deg, #22b8cf, #0e7490);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18);
        color: #fff;
        font-size: 12.5px;
        font-weight: 700;
        letter-spacing: 0.02em;
      }
      .logo::after {
        content: "";
        position: absolute;
        right: -2px;
        bottom: -2px;
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: #f59e0b;
        border: 2px solid #0f2b3a;
      }
      .menu {
        display: none;
        color: inherit;
      }
      .body {
        flex: 1;
        display: flex;
        min-height: 0;
      }
      nav {
        width: 224px;
        flex-shrink: 0;
        padding: 14px 10px;
        border-right: 1px solid var(--gs-border);
        background: var(--gs-surface);
        overflow-y: auto;
      }
      .nav-item {
        position: relative;
        width: 100%;
        justify-content: flex-start;
        border: none;
        background: transparent;
        margin-bottom: 2px;
        gap: 12px;
        min-height: 40px;
        color: var(--gs-muted);
        font-weight: 500;
      }
      .nav-item:hover:not(:disabled) {
        color: var(--gs-text);
        background: var(--gs-surface-2);
      }
      .nav-item.active {
        background: color-mix(in srgb, var(--gs-primary) 11%, transparent);
        color: var(--gs-primary);
        font-weight: 600;
      }
      .nav-item.active::before {
        content: "";
        position: absolute;
        left: -10px;
        top: 8px;
        bottom: 8px;
        width: 3px;
        border-radius: 0 3px 3px 0;
        background: var(--gs-primary);
      }
      main {
        flex: 1;
        min-width: 0;
        overflow: auto;
        position: relative;
      }
      main > :not(.notice) {
        display: block;
      }
      .loading {
        padding: 40px;
        display: flex;
        gap: 12px;
        align-items: center;
      }
      @media (max-width: 860px) {
        .menu {
          display: inline-flex;
        }
        nav {
          position: absolute;
          z-index: 20;
          top: 56px;
          bottom: 0;
          transform: translateX(-100%);
          transition: transform 0.2s;
          box-shadow: var(--gs-shadow);
        }
        nav.open {
          transform: none;
        }
      }
      .scrim {
        position: fixed;
        inset: 0;
        background: rgba(7, 13, 19, 0.55);
        backdrop-filter: blur(2px);
        display: grid;
        place-items: center;
        z-index: 100;
      }
      .dialog {
        width: min(460px, 92vw);
        box-shadow: var(--gs-shadow-lg);
      }
      .danger-fill {
        background: var(--gs-error) !important;
        border-color: var(--gs-error) !important;
      }
      .toasts {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: grid;
        gap: 8px;
        z-index: 200;
      }
      .toast {
        background: #0f1c2a;
        color: #f1f5f9;
        padding: 12px 18px 12px 16px;
        border-radius: 10px;
        border-left: 4px solid #22b8cf;
        box-shadow: var(--gs-shadow-lg);
        max-width: 80vw;
      }
      .toast.ok {
        border-left-color: #3fb950;
      }
      .toast.error {
        border-left-color: #f87171;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "guition-studio-panel": GuitionStudioPanel;
  }
}

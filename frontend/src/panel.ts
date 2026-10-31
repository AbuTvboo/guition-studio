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
          <div class="brand"><span class="logo">GS</span> Guition Studio</div>
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
    if (this.dialog?.kind === "prompt") this.renderRoot.querySelector<HTMLInputElement>("#prompt-input")?.focus();
  }

  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        height: 100%;
        background: var(--gs-bg);
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
        background: var(--app-header-background-color, var(--gs-surface));
        color: var(--app-header-text-color, var(--gs-text));
        border-bottom: 1px solid var(--gs-border);
        flex-shrink: 0;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 18px;
        font-weight: 600;
      }
      .logo {
        display: grid;
        place-items: center;
        width: 30px;
        height: 30px;
        border-radius: 9px;
        background: linear-gradient(135deg, #3d8bfd, #8b5cf6);
        color: #fff;
        font-size: 13px;
        font-weight: 700;
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
        padding: 12px 10px;
        border-right: 1px solid var(--gs-border);
        background: var(--gs-surface);
        overflow-y: auto;
      }
      .nav-item {
        width: 100%;
        justify-content: flex-start;
        border: none;
        background: transparent;
        margin-bottom: 2px;
        gap: 12px;
        min-height: 42px;
      }
      .nav-item.active {
        background: color-mix(in srgb, var(--gs-primary) 14%, transparent);
        color: var(--gs-primary);
        font-weight: 600;
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
        background: rgba(0, 0, 0, 0.45);
        display: grid;
        place-items: center;
        z-index: 100;
      }
      .dialog {
        width: min(460px, 92vw);
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
        background: #1f2937;
        color: #fff;
        padding: 12px 18px;
        border-radius: 12px;
        box-shadow: var(--gs-shadow);
        max-width: 80vw;
      }
      .toast.ok {
        background: #166534;
      }
      .toast.error {
        background: #991b1b;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "guition-studio-panel": GuitionStudioPanel;
  }
}

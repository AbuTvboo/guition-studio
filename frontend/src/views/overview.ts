import { css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { errorText } from "../api";
import type { Layout } from "../types";
import { relTime, renderScreen, screenStyles, toast } from "../ui";
import { StudioView } from "./base";

@customElement("gs-overview")
export class GsOverview extends StudioView {
  @state() private previews: Record<string, Layout> = {};

  protected async updated(changed: Map<string, unknown>) {
    if (changed.has("displays")) {
      for (const d of this.displays) {
        if (!this.previews[d.id]) {
          try {
            const res = await this.api.getLayout(d.id);
            this.previews = { ...this.previews, [d.id]: res.layout };
          } catch {
            /* preview optional */
          }
        }
      }
    }
  }

  private async resend(id: string) {
    try {
      await this.api.command(id, "resend");
      toast(this, "Layout erneut übertragen ✓", "ok");
    } catch (err) {
      toast(this, errorText(err), "error");
    }
  }

  render() {
    const online = this.displays.filter((d) => d.online).length;
    const outOfSync = this.displays.filter((d) => d.applied_revision !== null && !d.in_sync).length;
    return html`
      <div class="page-head">
        <h1>Übersicht</h1>
        <span class="spacer"></span>
        <button class="primary" @click=${() => this.go("displays")}>＋ Display hinzufügen</button>
      </div>
      <section class="stats">
        <div class="card stat"><div class="num">${this.displays.length}</div><div class="muted">Displays</div></div>
        <div class="card stat"><div class="num" style="color:var(--gs-ok)">${online}</div><div class="muted">online</div></div>
        <div class="card stat"><div class="num" style="color:${outOfSync ? "var(--gs-warn)" : "inherit"}">${outOfSync}</div><div class="muted">nicht synchron</div></div>
        <div class="card stat"><div class="num">${this.info.version}</div><div class="muted">Guition Studio</div></div>
      </section>
      ${this.displays.length === 0
        ? html`<div class="card welcome">
            <h2>Willkommen bei Guition Studio 👋</h2>
            <p>In wenigen Schritten bringst du dein Guition ESP32-S3-4848S040 zum Laufen:</p>
            <ol>
              <li>Firmware per USB direkt aus dem Browser installieren</li>
              <li>WLAN einrichten und mit Home Assistant koppeln</li>
              <li>Seiten per Drag-and-Drop gestalten und übertragen – ohne YAML</li>
            </ol>
            <button class="primary" @click=${() => this.go("displays")}>Einrichtung starten</button>
          </div>`
        : html`<div class="grid">
            ${this.displays.map((d) => {
              const layout = this.previews[d.id];
              const page = layout?.pages.find((p) => p.id === layout.settings.home_page) ?? layout?.pages[0];
              return html`<div class="card disp">
                <div class="thumb">${layout && page ? html`<div class="scale">${renderScreen(layout, page, this.info.themes, this.hass)}</div>` : nothing}</div>
                <div class="row" style="margin-top:12px">
                  <h2 style="margin:0">${d.name}</h2>
                  <span class="spacer"></span>
                  <span class="chip ${d.online ? "ok" : d.linked ? "error" : "warn"}">${d.online ? "● Online" : d.linked ? "○ Offline" : "Nicht verknüpft"}</span>
                </div>
                <div class="meta muted small">
                  <span>Firmware ${d.firmware ?? "–"}</span>
                  <span>${d.page_count} Seite(n)</span>
                  <span>Layout ${d.applied_revision != null ? `Rev. ${d.applied_revision}` : "noch nicht übertragen"}</span>
                  <span>Zuletzt gesehen: ${relTime(d.last_seen)}</span>
                </div>
                ${d.applied_revision != null && !d.in_sync ? html`<div class="notice warn small">Das Display zeigt ein anderes Layout als zuletzt übertragen.</div>` : nothing}
                <div class="row" style="margin-top:10px">
                  <button class="primary" @click=${() => this.go("designer", d.id)}>✎ Bearbeiten</button>
                  ${d.applied_revision != null ? html`<button ?disabled=${!d.online} @click=${() => this.resend(d.id)}>⇪ Erneut senden</button>` : nothing}
                  <button @click=${() => this.go("diagnostics")}>Diagnose</button>
                </div>
              </div>`;
            })}
          </div>`}
    `;
  }

  static styles = [
    ...StudioView.styles,
    screenStyles,
    css`
      .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 16px;
      }
      .stat .num {
        font-size: 28px;
        font-weight: 700;
      }
      .welcome ol {
        line-height: 1.9;
      }
      .thumb {
        width: 240px;
        height: 240px;
        margin: 0 auto;
        background: #111;
        border-radius: 12px;
        padding: 0;
        overflow: hidden;
        box-shadow: 0 0 0 6px #111;
      }
      .scale {
        transform: scale(0.5);
        transform-origin: 0 0;
        pointer-events: none;
      }
      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 14px;
        margin-top: 6px;
      }
    `,
  ];
}

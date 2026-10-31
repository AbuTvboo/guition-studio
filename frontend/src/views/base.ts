import { LitElement, css } from "lit";
import { property } from "lit/decorators.js";
import type { StudioApi } from "../api";
import type { DisplayStatus, Hass, StudioInfo } from "../types";
import { fireEvent, sharedStyles } from "../ui";
import type { ViewKey } from "../panel";

export class StudioView extends LitElement {
  @property({ attribute: false }) hass!: Hass;
  @property({ attribute: false }) api!: StudioApi;
  @property({ attribute: false }) info!: StudioInfo;
  @property({ attribute: false }) displays: DisplayStatus[] = [];

  protected go(view: ViewKey, display?: string) {
    fireEvent(this, "gs-navigate", { view, display });
  }

  protected refreshAll() {
    fireEvent(this, "gs-refresh");
  }

  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        padding: 24px;
        max-width: 1280px;
      }
      .page-head {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;
        flex-wrap: wrap;
      }
      .page-head h1 {
        margin: 0;
      }
      section {
        margin-bottom: 24px;
      }
    `,
  ];
}

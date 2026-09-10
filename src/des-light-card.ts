import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { renderSegmented, segmentedStyles, ON_OFF_OPTIONS } from './segmented';
import { tokenStyles } from './tokens';
import { formatInt, clamp } from './format';
import { entityState, entityNumberAttribute } from './resolve';
import {
  isWritableLight,
  isWritableSwitch,
  writeLight,
  writeSwitch,
  callAction,
} from './service';
import type {
  DesLightCardConfig,
  LightItemConfig,
  LightItemKind,
  HomeAssistant,
} from './types';

const GRID_COLUMNS = 12;
const GRID_ROWS = 3;
const GRID_MIN_ROWS = 2;

const DEFAULT_NAME = 'Licht';
/** Brightness bar writes on release, debounced. */
const WRITE_DEBOUNCE_MS = 300;
const SETTLE_TIMEOUT_MS = 8000;

/** One light row reduced to what the card draws. */
interface LightView {
  entity: string;
  name: string;
  icon?: string;
  kind: LightItemKind;
  on_action?: LightItemConfig['on_action'];
  on_label?: string;
  /** true / false / null (unreadable). */
  on: boolean | null;
  /** Brightness 0-100 for `dim`, null when unreadable. */
  bright: number | null;
}

/** Demo rows mirroring the documented example. */
const DEMO_ITEMS: ReadonlyArray<{
  entity: string;
  name: string;
  icon: string;
  kind: LightItemKind;
  on: boolean;
  bright?: number;
  on_label?: string;
}> = [
  { entity: 'light.__demo_spots__', name: 'Spots', icon: 'mdi:track-light', kind: 'dim', on: true, bright: 70 },
  {
    entity: 'switch.__demo_essen__',
    name: 'Essen',
    icon: 'mdi:vanity-light',
    kind: 'switch',
    on: false,
    on_label: 'Ambiente',
  },
  { entity: 'switch.__demo_couch__', name: 'Couch', icon: 'mdi:ceiling-light', kind: 'switch', on: true },
];

export class DesLightCard extends LitElement {
  static override properties = {
    hass: { attribute: false },
    _config: { state: true },
    _onLocal: { state: true },
    _brightLocal: { state: true },
  };

  declare hass?: HomeAssistant;
  declare _config?: DesLightCardConfig;
  /** Optimistic per-entity on/off and brightness while a write settles. */
  declare _onLocal: Record<string, boolean>;
  declare _brightLocal: Record<string, number>;

  private _writeTimers = new Map<string, number>();
  private _settleTimers = new Map<string, number>();

  constructor() {
    super();
    this._onLocal = {};
    this._brightLocal = {};
  }

  setConfig(config: DesLightCardConfig): void {
    if (!config) {
      throw new Error('des-light-card: Konfiguration fehlt');
    }
    if (config.items !== undefined) {
      if (!Array.isArray(config.items)) {
        throw new Error('des-light-card: "items" muss eine Liste sein');
      }
      for (const item of config.items) {
        if (!item || !item.entity || !item.name) {
          throw new Error('des-light-card: jedes Item braucht "entity" und "name"');
        }
        if (item.kind !== undefined && item.kind !== 'switch' && item.kind !== 'dim') {
          throw new Error('des-light-card: "kind" muss "switch" oder "dim" sein');
        }
      }
    }
    this._config = config;
    this._onLocal = {};
    this._brightLocal = {};
  }

  getCardSize(): number {
    return GRID_ROWS;
  }

  getGridOptions(): { columns: number; rows: number; min_rows: number } {
    return { columns: GRID_COLUMNS, rows: GRID_ROWS, min_rows: GRID_MIN_ROWS };
  }

  static getStubConfig(): DesLightCardConfig {
    return { type: 'custom:des-light-card', name: 'Wohnzimmer' };
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    for (const t of this._writeTimers.values()) window.clearTimeout(t);
    this._writeTimers.clear();
    for (const t of this._settleTimers.values()) window.clearTimeout(t);
    this._settleTimers.clear();
  }

  /** Drops optimistic values the entity has confirmed. */
  protected override willUpdate(): void {
    if (this._isDemo) return;

    if (Object.keys(this._onLocal).length > 0) {
      let next = this._onLocal;
      let changed = false;
      for (const [entity, val] of Object.entries(this._onLocal)) {
        const state = entityState(entity, this.hass);
        if (state !== null && (state.toLowerCase() === 'on') === val) {
          if (!changed) {
            next = { ...this._onLocal };
            changed = true;
          }
          delete next[entity];
          this._clearSettle(`on:${entity}`);
        }
      }
      if (changed) this._onLocal = next;
    }

    if (Object.keys(this._brightLocal).length > 0) {
      let next = this._brightLocal;
      let changed = false;
      for (const [entity, val] of Object.entries(this._brightLocal)) {
        const pct = this._entityBrightness(entity);
        if (pct !== null && pct === val) {
          if (!changed) {
            next = { ...this._brightLocal };
            changed = true;
          }
          delete next[entity];
          this._clearSettle(`bright:${entity}`);
        }
      }
      if (changed) this._brightLocal = next;
    }
  }

  // =========================================================================
  // view model
  // =========================================================================

  private get _isDemo(): boolean {
    return !this._config?.items || this._config.items.length === 0;
  }

  /** On/off from the entity (local override wins), null when unreadable. */
  private _on(entity: string): boolean | null {
    const local = this._onLocal[entity];
    if (local !== undefined) return local;
    const state = entityState(entity, this.hass);
    return state === null ? null : state.toLowerCase() === 'on';
  }

  /** Brightness 0-100 from the entity's `brightness` (0-255), null if absent. */
  private _entityBrightness(entity: string): number | null {
    const raw = entityNumberAttribute(entity, this.hass, 'brightness');
    return raw === null ? null : Math.round(clamp(raw, 0, 255) / 255 * 100);
  }

  private _bright(entity: string): number | null {
    const local = this._brightLocal[entity];
    if (local !== undefined) return local;
    return this._entityBrightness(entity);
  }

  private _views(): LightView[] {
    if (this._isDemo) {
      return DEMO_ITEMS.map((d) => ({
        entity: d.entity,
        name: d.name,
        icon: d.icon,
        kind: d.kind,
        on_label: d.on_label,
        on: this._onLocal[d.entity] ?? d.on,
        bright: d.kind === 'dim' ? (this._brightLocal[d.entity] ?? d.bright ?? 0) : null,
      }));
    }
    return (this._config?.items ?? []).map((item) => {
      const kind: LightItemKind = item.kind === 'dim' ? 'dim' : 'switch';
      return {
        entity: item.entity,
        name: item.name,
        icon: item.icon,
        kind,
        on_action: item.on_action,
        on_label: item.on_label,
        on: this._on(item.entity),
        bright: kind === 'dim' ? this._bright(item.entity) : null,
      };
    });
  }

  // =========================================================================
  // render
  // =========================================================================

  override render(): TemplateResult | typeof nothing {
    const config = this._config;
    if (!config) return nothing;

    const views = this._views();
    const total = views.length;
    const onCount = views.filter((v) => v.on === true).length;

    return html`
      <ha-card>
        <div class="card">
          <div class="header">
            <span class="name">${config.name ?? DEFAULT_NAME}</span>
            <div class="meta">${onCount} von ${total} an</div>
          </div>
          <div class="items">${views.map((v) => this._renderRow(v))}</div>
        </div>
      </ha-card>
    `;
  }

  private _renderRow(view: LightView): TemplateResult {
    const { entity, on } = view;
    const writable =
      this._isDemo ||
      isWritableLight(entity) ||
      isWritableSwitch(entity) ||
      view.on_action !== undefined;
    const dimDisabled = !this._isDemo && !isWritableLight(entity);

    return html`
      <div class="row ${on === null ? 'dim' : ''}">
        <ha-icon class="row-icon ${on === true ? 'on' : ''}" icon=${view.icon ?? 'mdi:lightbulb'}></ha-icon>
        <span class="row-name">${view.name}</span>
        <div class="row-mid">
          ${view.kind === 'dim'
            ? this._renderBrightness(view, dimDisabled)
            : view.on_label
              ? html`<span class="row-hint">${view.on_label}</span>`
              : nothing}
        </div>
        ${renderSegmented(
          ON_OFF_OPTIONS,
          on === null ? null : on ? 'on' : 'off',
          (value) => (value === 'on' ? this._turnOn(view) : this._turnOff(view)),
          view.name,
          !writable,
        )}
      </div>
    `;
  }

  private _renderBrightness(view: LightView, disabled: boolean): TemplateResult {
    const value = view.bright;
    const fill = value ?? 0;
    return html`
      <div class="bright" style="--fill:${fill}%">
        <input
          class="bright-input"
          type="range"
          min="0"
          max="100"
          step="1"
          .value=${String(value ?? 0)}
          ?disabled=${disabled}
          aria-label="Helligkeit ${view.name}"
          @input=${(ev: Event) => this._onBrightInput(view.entity, ev)}
          @change=${(ev: Event) => this._onBrightChange(view.entity, ev)}
        />
      </div>
      <span class="bright-pct">${value === null ? html`<span class="unavail">–</span>` : `${formatInt(value)} %`}</span>
    `;
  }

  // =========================================================================
  // interaction
  // =========================================================================

  private _turnOn(view: LightView): void {
    this._setOnLocal(view.entity, true);
    if (this._isDemo) return;

    if (view.on_action) {
      void this._write(callAction(this.hass, view.on_action), () =>
        this._clearOnLocal(view.entity),
      );
      this._holdOn(view.entity);
      return;
    }
    this._writeOnOff(view.entity, true);
  }

  private _turnOff(view: LightView): void {
    this._setOnLocal(view.entity, false);
    if (this._isDemo) return;
    this._writeOnOff(view.entity, false);
  }

  private _writeOnOff(entity: string, on: boolean): void {
    const call = isWritableLight(entity)
      ? writeLight(this.hass, entity, on)
      : isWritableSwitch(entity)
        ? writeSwitch(this.hass, entity, on)
        : null;
    if (!call) {
      this._clearOnLocal(entity);
      return;
    }
    this._holdOn(entity);
    void this._write(call, () => {
      this._clearSettle(`on:${entity}`);
      this._clearOnLocal(entity);
    });
  }

  private _holdOn(entity: string): void {
    this._holdOptimistic(`on:${entity}`, () => this._clearOnLocal(entity));
  }

  private _onBrightInput(entity: string, ev: Event): void {
    this._setBrightLocal(entity, Number((ev.target as HTMLInputElement).value));
  }

  private _onBrightChange(entity: string, ev: Event): void {
    const value = clamp(Math.round(Number((ev.target as HTMLInputElement).value)), 0, 100);
    this._setBrightLocal(entity, value);
    // A dim row is also on once it has brightness.
    this._setOnLocal(entity, value > 0);
    if (this._isDemo || !isWritableLight(entity)) return;

    const pending = this._writeTimers.get(entity);
    if (pending !== undefined) window.clearTimeout(pending);
    this._writeTimers.set(
      entity,
      window.setTimeout(() => {
        this._writeTimers.delete(entity);
        this._holdOptimistic(`bright:${entity}`, () => this._clearBrightLocal(entity));
        void this._write(
          writeLight(this.hass, entity, true, { brightness_pct: value }),
          () => {
            this._clearSettle(`bright:${entity}`);
            this._clearBrightLocal(entity);
          },
        );
      }, WRITE_DEBOUNCE_MS),
    );
  }

  private _setOnLocal(entity: string, on: boolean): void {
    this._onLocal = { ...this._onLocal, [entity]: on };
  }

  private _clearOnLocal(entity: string): void {
    if (this._onLocal[entity] === undefined) return;
    const next = { ...this._onLocal };
    delete next[entity];
    this._onLocal = next;
  }

  private _setBrightLocal(entity: string, value: number): void {
    this._brightLocal = { ...this._brightLocal, [entity]: clamp(Math.round(value), 0, 100) };
  }

  private _clearBrightLocal(entity: string): void {
    if (this._brightLocal[entity] === undefined) return;
    const next = { ...this._brightLocal };
    delete next[entity];
    this._brightLocal = next;
  }

  private _holdOptimistic(key: string, release: () => void): void {
    this._clearSettle(key);
    this._settleTimers.set(
      key,
      window.setTimeout(() => {
        this._settleTimers.delete(key);
        release();
      }, SETTLE_TIMEOUT_MS),
    );
  }

  private _clearSettle(key: string): void {
    const timer = this._settleTimers.get(key);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      this._settleTimers.delete(key);
    }
  }

  private async _write(call: Promise<unknown>, onFailure: () => void): Promise<void> {
    try {
      await call;
    } catch (error) {
      onFailure();
      // eslint-disable-next-line no-console
      console.error('des-light-card: Service-Call fehlgeschlagen', error);
    }
  }

  static override styles = [
    tokenStyles,
    segmentedStyles,
    css`
      :host {
        display: block;
        height: 100%;
      }

      ha-card {
        height: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        background: var(--ha-card-background, var(--card-background-color, #fff));
        color: var(--primary-text-color);
      }

      .card {
        flex: 1 1 auto;
        min-height: 0;
        display: flex;
        flex-direction: column;
        padding: 12px 16px;
      }

      .header {
        flex: 0 0 auto;
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 8px;
      }

      .name {
        font-size: 15px;
        font-weight: 500;
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .meta {
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        flex-shrink: 0;
      }

      .unavail {
        color: var(--secondary-text-color);
        opacity: 0.7;
      }

      .items {
        margin-top: 6px;
      }

      .row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 0;
        border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.18));
      }

      .row.dim {
        opacity: 0.5;
      }

      .row-icon {
        --mdc-icon-size: 18px;
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        color: var(--secondary-text-color);
      }

      .row-icon.on {
        color: var(--primary-color, #03a9f4);
      }

      .row-name {
        width: 64px;
        flex-shrink: 0;
        font-size: 13px;
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .row-mid {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .row-hint {
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* --- brightness bar (same look as the cover position bar) --- */

      .bright {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
      }

      .bright-input {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        min-width: 0;
        height: 14px;
        background: none;
        cursor: pointer;
      }

      .bright-input:disabled {
        opacity: 0.35;
        cursor: not-allowed;
      }

      .bright-input::-webkit-slider-runnable-track {
        height: 6px;
        border-radius: 3px;
        background: linear-gradient(
          to right,
          var(--primary-color, #03a9f4) var(--fill, 0%),
          var(--divider-color, rgba(127, 127, 127, 0.3)) var(--fill, 0%)
        );
      }

      .bright-input::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--primary-color, #03a9f4);
        border: 2px solid var(--card-background-color, #fff);
        margin-top: -4px;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
      }

      .bright-input::-moz-range-track {
        height: 6px;
        border-radius: 3px;
        background: var(--divider-color, rgba(127, 127, 127, 0.3));
      }

      .bright-input::-moz-range-progress {
        height: 6px;
        border-radius: 3px;
        background: var(--primary-color, #03a9f4);
      }

      .bright-input::-moz-range-thumb {
        width: 14px;
        height: 14px;
        border: 2px solid var(--card-background-color, #fff);
        border-radius: 50%;
        background: var(--primary-color, #03a9f4);
      }

      .bright-input:focus-visible {
        outline: 2px solid var(--primary-color, #03a9f4);
        outline-offset: 2px;
        border-radius: 3px;
      }

      .bright-pct {
        width: 32px;
        text-align: right;
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        flex-shrink: 0;
      }
    `,
  ];
}

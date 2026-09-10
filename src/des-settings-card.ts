import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { renderSegmented, segmentedStyles } from './segmented';
import { tokenStyles } from './tokens';
import { entityState } from './resolve';
import { isWritableSwitch, writeSwitch } from './service';
import type {
  DesSettingsCardConfig,
  SettingsItemConfig,
  SettingsPillColor,
  HomeAssistant,
} from './types';

const GRID_COLUMNS = 12;
const GRID_ROWS = 2;
const GRID_MIN_ROWS = 2;
const DEFAULT_NAME = 'Haus';
const SETTLE_TIMEOUT_MS = 8000;

/** Pill colour → CSS class (same tones as the other cards' pills). */
const PILL_CLASS: Record<SettingsPillColor, string> = {
  blue: 'pill-blue',
  amber: 'pill-amber',
  gray: 'pill-gray',
};

interface SettingsView {
  entity: string;
  name: string;
  pill?: string;
  color: SettingsPillColor;
  /** true / false / null (unreadable). */
  on: boolean | null;
}

/** Demo rows for the editor preview: Lüftung on, Urlaub off. */
const DEMO_ITEMS: ReadonlyArray<SettingsView> = [
  { entity: 'input_boolean.__demo_luftung__', name: 'Lüftungsmodus', pill: 'Lüftung', color: 'blue', on: true },
  { entity: 'input_boolean.__demo_urlaub__', name: 'Urlaubsmodus', pill: 'Urlaub', color: 'amber', on: false },
];

export class DesSettingsCard extends LitElement {
  static override properties = {
    hass: { attribute: false },
    _config: { state: true },
    _onLocal: { state: true },
  };

  declare hass?: HomeAssistant;
  declare _config?: DesSettingsCardConfig;
  /** Optimistic per-entity on/off while a write settles. */
  declare _onLocal: Record<string, boolean>;

  private _settleTimers = new Map<string, number>();

  constructor() {
    super();
    this._onLocal = {};
  }

  setConfig(config: DesSettingsCardConfig): void {
    if (!config) {
      throw new Error('des-settings-card: Konfiguration fehlt');
    }
    if (config.items !== undefined) {
      if (!Array.isArray(config.items)) {
        throw new Error('des-settings-card: "items" muss eine Liste sein');
      }
      for (const item of config.items) {
        if (!item || !item.entity || !item.name) {
          throw new Error('des-settings-card: jedes Item braucht "entity" und "name"');
        }
        if (item.color !== undefined && !['blue', 'amber', 'gray'].includes(item.color)) {
          throw new Error('des-settings-card: "color" muss "blue", "amber" oder "gray" sein');
        }
      }
    }
    this._config = config;
    this._onLocal = {};
  }

  getCardSize(): number {
    return GRID_ROWS;
  }

  getGridOptions(): { columns: number; rows: number; min_rows: number } {
    return { columns: GRID_COLUMNS, rows: GRID_ROWS, min_rows: GRID_MIN_ROWS };
  }

  static getStubConfig(): DesSettingsCardConfig {
    return { type: 'custom:des-settings-card', name: DEFAULT_NAME };
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    for (const t of this._settleTimers.values()) window.clearTimeout(t);
    this._settleTimers.clear();
  }

  /** Drops optimistic values the entity has confirmed. */
  protected override willUpdate(): void {
    if (this._isDemo || Object.keys(this._onLocal).length === 0) return;
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
        this._clearSettle(entity);
      }
    }
    if (changed) this._onLocal = next;
  }

  private get _isDemo(): boolean {
    return !this._config?.items || this._config.items.length === 0;
  }

  private _on(entity: string): boolean | null {
    const local = this._onLocal[entity];
    if (local !== undefined) return local;
    const state = entityState(entity, this.hass);
    return state === null ? null : state.toLowerCase() === 'on';
  }

  private _views(): SettingsView[] {
    if (this._isDemo) {
      return DEMO_ITEMS.map((d) => ({ ...d, on: this._onLocal[d.entity] ?? d.on }));
    }
    return (this._config?.items ?? []).map((item: SettingsItemConfig) => ({
      entity: item.entity,
      name: item.name,
      pill: item.pill,
      color: item.color ?? 'blue',
      on: this._on(item.entity),
    }));
  }

  override render(): TemplateResult | typeof nothing {
    const config = this._config;
    if (!config) return nothing;

    const views = this._views();
    const active = views.filter((v) => v.on === true);
    const meta =
      active.length === 0
        ? 'Automatik'
        : `${active.length} ${active.length === 1 ? 'Abweichung' : 'Abweichungen'}`;

    return html`
      <ha-card>
        <div class="card">
          <div class="header">
            <span class="name">${config.name ?? DEFAULT_NAME}</span>
            <div class="badges">
              ${active
                .filter((v) => v.pill)
                .map(
                  (v) => html`<span class="badge ${PILL_CLASS[v.color]}">
                    <span class="badge-label">${v.pill}</span>
                  </span>`,
                )}
            </div>
          </div>

          <div class="meta">${meta}</div>

          <div class="items">${views.map((v) => this._renderRow(v))}</div>
        </div>
      </ha-card>
    `;
  }

  private _renderRow(view: SettingsView): TemplateResult {
    const { entity, on } = view;
    const disabled = !this._isDemo && !isWritableSwitch(entity);
    return html`
      <div class="row ${on === null ? 'dim' : ''}">
        <span class="row-name">${view.name}</span>
        ${renderSegmented<'on' | 'off'>(
          [
            { value: 'on', label: 'An' },
            { value: 'off', label: 'Aus' },
          ],
          on === null ? null : on ? 'on' : 'off',
          (value) => this._set(entity, value === 'on'),
          view.name,
          disabled,
        )}
      </div>
    `;
  }

  private _set(entity: string, on: boolean): void {
    this._onLocal = { ...this._onLocal, [entity]: on };
    if (this._isDemo || !isWritableSwitch(entity)) return;

    this._holdOptimistic(entity, () => this._clearOnLocal(entity));
    void this._write(writeSwitch(this.hass, entity, on), () => {
      this._clearSettle(entity);
      this._clearOnLocal(entity);
    });
  }

  private _clearOnLocal(entity: string): void {
    if (this._onLocal[entity] === undefined) return;
    const next = { ...this._onLocal };
    delete next[entity];
    this._onLocal = next;
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
      console.error('des-settings-card: Service-Call fehlgeschlagen', error);
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
        align-items: center;
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

      .badges {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
        justify-content: flex-end;
        flex-shrink: 0;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 20px;
        padding: 0 9px;
        border-radius: 10px;
        font-size: 11px;
        font-weight: 500;
        line-height: 1;
        white-space: nowrap;
        background: rgba(127, 127, 127, 0.15);
        color: var(--secondary-text-color);
      }

      .badge-label {
        display: block;
        transform: translateY(1px);
      }

      .pill-blue {
        background: rgba(33, 150, 243, 0.16);
        background: color-mix(in srgb, var(--info-color, #2196f3) 16%, transparent);
        color: var(--info-color, #2196f3);
      }

      .pill-amber {
        background: rgba(255, 152, 0, 0.16);
        background: color-mix(in srgb, var(--warning-color, #ff9800) 16%, transparent);
        color: var(--warning-color, #ff9800);
      }

      .pill-gray {
        background: rgba(127, 127, 127, 0.16);
        background: color-mix(in srgb, var(--secondary-text-color, #727272) 16%, transparent);
        color: var(--secondary-text-color);
      }

      .meta {
        flex: 0 0 auto;
        margin-top: 2px;
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
      }

      .items {
        margin-top: 6px;
      }

      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 8px 0;
        border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.18));
      }

      .row.dim {
        opacity: 0.5;
      }

      .row-name {
        font-size: 13px;
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
      }
    `,
  ];
}

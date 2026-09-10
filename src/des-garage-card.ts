import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { renderSegmented, segmentedStyles, ON_OFF_OPTIONS } from './segmented';
import { chevronStyles } from './chevron';
import { overlayStyles, OverlayCloser } from './overlay';
import { tokenStyles } from './tokens';
import { formatInt, formatFixed } from './format';
import { entityState, resolveNumber } from './resolve';
import { isWritableSwitch, isWritableLight, writeSwitch, writeLight } from './service';
import type {
  DesGarageCardConfig,
  GarageDeviceConfig,
  GarageSettingConfig,
  GarageSettingColor,
  HomeAssistant,
  StatsPeriod,
} from './types';

/** Setting pill colour → CSS class (same tones as the other cards' pills). */
const SETTING_PILL_CLASS: Record<GarageSettingColor, string> = {
  blue: 'pill-blue',
  amber: 'pill-amber',
  gray: 'pill-gray',
};

const GRID_COLUMNS = 12;
const GRID_ROWS = 4;
const GRID_MIN_ROWS = 3;
const DEFAULT_NAME = 'Garage';
const DEFAULT_THRESHOLD_W = 2;
const SETTLE_TIMEOUT_MS = 8000;
/** Consumption cache refresh while the card is open. */
const STATS_REFRESH_MS = 15 * 60 * 1000;

const PERIOD_ORDER: ReadonlyArray<StatsPeriod> = ['day', 'week', 'month', 'year'];
const PERIOD_LABEL: Record<StatsPeriod, string> = {
  day: 'Tag',
  week: 'Woche',
  month: 'Monat',
  year: 'Jahr',
};
/** recorder period per view period. */
const RECORDER_PERIOD: Record<StatsPeriod, 'hour' | 'day' | 'month'> = {
  day: 'hour',
  week: 'day',
  month: 'day',
  year: 'month',
};

interface StatItem {
  start?: number | string;
  change?: number | null;
}
type StatsResponse = Record<string, StatItem[] | undefined>;

interface ItemView {
  entity: string;
  name: string;
  isLight: boolean;
  energyId?: string;
  on: boolean | null;
  powerW: number | null;
}

/** Demo dataset for the editor preview. */
const DEMO_LIGHT = { entity: 'light.__demo_licht__', name: 'Licht', on: true, powerW: 8, kwh: 0.12 };
const DEMO_DEVICES: ReadonlyArray<{
  entity: string;
  name: string;
  on: boolean;
  powerW: number | null;
  kwh: number;
}> = [
  { entity: 'switch.__demo_werkbank__', name: 'Werkbank', on: true, powerW: 18, kwh: 0.34 },
  { entity: 'switch.__demo_fraese__', name: 'Fräse', on: false, powerW: null, kwh: 0.0 },
  { entity: 'switch.__demo_kappex__', name: 'Kappex', on: false, powerW: null, kwh: 0.0 },
  { entity: 'switch.__demo_kompressor__', name: 'Kompressor', on: true, powerW: 240, kwh: 0.9 },
  { entity: 'switch.__demo_staubsauger__', name: 'Staubsauger', on: false, powerW: null, kwh: 0.0 },
  { entity: 'switch.__demo_tuer__', name: 'Tür', on: true, powerW: 0, kwh: 0.05 },
];
/** Rough per-period multiplier so the demo consumption differs by period. */
const DEMO_PERIOD_FACTOR: Record<StatsPeriod, number> = { day: 1, week: 6, month: 25, year: 300 };

export class DesGarageCard extends LitElement {
  static override properties = {
    hass: { attribute: false },
    _config: { state: true },
    _expanded: { state: true },
    _period: { state: true },
    _onLocal: { state: true },
    _stats: { state: true },
  };

  declare hass?: HomeAssistant;
  declare _config?: DesGarageCardConfig;
  declare _expanded: boolean;
  declare _period: StatsPeriod;
  declare _onLocal: Record<string, boolean>;
  /** Cached consumption per period → statistic_id → kWh (null = no statistics). */
  declare _stats: Partial<Record<StatsPeriod, Record<string, number | null>>>;

  private _closer = new OverlayCloser(this, () => this._collapse());
  private _settleTimers = new Map<string, number>();
  private _statsTimer?: number;
  /** Guards against out-of-order stats responses. */
  private _statsToken = 0;

  constructor() {
    super();
    this._expanded = false;
    this._period = 'day';
    this._onLocal = {};
    this._stats = {};
  }

  setConfig(config: DesGarageCardConfig): void {
    if (!config) {
      throw new Error('des-garage-card: Konfiguration fehlt');
    }
    if (config.devices !== undefined) {
      if (!Array.isArray(config.devices)) {
        throw new Error('des-garage-card: "devices" muss eine Liste sein');
      }
      for (const d of config.devices) {
        if (!d || !d.entity || !d.name) {
          throw new Error('des-garage-card: jedes Gerät braucht "entity" und "name"');
        }
      }
    }
    if (config.light && (!config.light.entity || !config.light.name)) {
      throw new Error('des-garage-card: "light" braucht "entity" und "name"');
    }
    if (config.settings !== undefined) {
      if (!Array.isArray(config.settings)) {
        throw new Error('des-garage-card: "settings" muss eine Liste sein');
      }
      for (const s of config.settings) {
        if (!s || !s.entity || !s.name) {
          throw new Error('des-garage-card: jede Einstellung braucht "entity" und "name"');
        }
        if (s.color !== undefined && !['blue', 'amber', 'gray'].includes(s.color)) {
          throw new Error('des-garage-card: "color" muss "blue", "amber" oder "gray" sein');
        }
      }
    }
    this._config = config;
    this._expanded = false;
    this._onLocal = {};
    this._stats = {};
  }

  getCardSize(): number {
    return GRID_ROWS;
  }

  getGridOptions(): { columns: number; rows: number; min_rows: number } {
    return { columns: GRID_COLUMNS, rows: GRID_ROWS, min_rows: GRID_MIN_ROWS };
  }

  static getStubConfig(): DesGarageCardConfig {
    return { type: 'custom:des-garage-card', name: DEFAULT_NAME };
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._closer.deactivate();
    this._stopStatsTimer();
    for (const t of this._settleTimers.values()) window.clearTimeout(t);
    this._settleTimers.clear();
  }

  protected override willUpdate(): void {
    this.toggleAttribute('expanded', this._expanded);
    // Not gated on demo: settings use real entities even on an otherwise-demo
    // card; the entityState check below simply never confirms a demo entity.
    if (Object.keys(this._onLocal).length === 0) return;
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

  // =========================================================================
  // view model
  // =========================================================================

  private get _isDemo(): boolean {
    const c = this._config;
    return !c?.light && !(c?.devices && c.devices.length > 0);
  }

  private get _threshold(): number {
    const t = this._config?.on_threshold_w;
    return typeof t === 'number' && t >= 0 ? t : DEFAULT_THRESHOLD_W;
  }

  private _on(entity: string): boolean | null {
    const local = this._onLocal[entity];
    if (local !== undefined) return local;
    const state = entityState(entity, this.hass);
    return state === null ? null : state.toLowerCase() === 'on';
  }

  private _power(powerEntity?: string): number | null {
    if (!powerEntity) return null;
    const r = resolveNumber(powerEntity, this.hass);
    return r.kind === 'value' ? r.value : null;
  }

  private _deviceView(device: GarageDeviceConfig, isLight: boolean): ItemView {
    return {
      entity: device.entity,
      name: device.name,
      isLight,
      energyId: device.energy_entity,
      on: this._on(device.entity),
      powerW: this._power(device.power_entity),
    };
  }

  private _lightView(): ItemView | null {
    if (this._isDemo) {
      return {
        entity: DEMO_LIGHT.entity,
        name: DEMO_LIGHT.name,
        isLight: true,
        on: this._onLocal[DEMO_LIGHT.entity] ?? DEMO_LIGHT.on,
        powerW: DEMO_LIGHT.powerW,
      };
    }
    const light = this._config?.light;
    return light ? this._deviceView(light, true) : null;
  }

  private _deviceViews(): ItemView[] {
    if (this._isDemo) {
      return DEMO_DEVICES.map((d) => ({
        entity: d.entity,
        name: d.name,
        isLight: false,
        on: this._onLocal[d.entity] ?? d.on,
        powerW: d.powerW,
      }));
    }
    return (this._config?.devices ?? []).map((d) => this._deviceView(d, false));
  }

  /** true active (green), false on-but-idle (grey), null off/unreadable (empty). */
  private _dotState(view: ItemView): boolean | null {
    if (view.on !== true) return null;
    return view.powerW !== null && view.powerW >= this._threshold ? true : false;
  }

  /** Consumption (kWh) of an item in the active period, null when unavailable. */
  private _consumption(view: ItemView): number | null {
    if (this._isDemo) {
      const base =
        view.isLight
          ? DEMO_LIGHT.kwh
          : DEMO_DEVICES.find((d) => d.entity === view.entity)?.kwh ?? 0;
      return Number((base * DEMO_PERIOD_FACTOR[this._period]).toFixed(2));
    }
    if (!view.energyId) return null;
    const periodStats = this._stats[this._period];
    if (!periodStats || !(view.energyId in periodStats)) return null;
    return periodStats[view.energyId];
  }

  // =========================================================================
  // render
  // =========================================================================

  override render(): TemplateResult | typeof nothing {
    const config = this._config;
    if (!config) return nothing;

    const light = this._lightView();
    const devices = this._deviceViews();
    const all = light ? [light, ...devices] : devices;

    const totalW = all.reduce((sum, v) => sum + (v.powerW ?? 0), 0);
    const devicesOn = devices.filter((v) => v.on === true).length;
    const meta = `${devicesOn} Geräte an · ${formatInt(totalW)} W`;
    const lightOn = light?.on === true;
    const settings = config.settings ?? [];
    const activeSettings = settings.filter(
      (s) => s.pill && this._on(s.entity) === true,
    );

    return html`
      <ha-card>
        <div class="card">
          <div class="header">
            <span class="name">${config.name ?? DEFAULT_NAME}</span>
            <div class="badges">
              ${lightOn
                ? html`<span class="badge badge-amber"><span class="badge-label">Licht an</span></span>`
                : nothing}
              ${activeSettings.map(
                (s) => html`<span class="badge ${SETTING_PILL_CLASS[s.color ?? 'blue']}">
                  <span class="badge-label">${s.pill}</span>
                </span>`,
              )}
            </div>
          </div>
          <div class="meta">${meta}</div>

          <div class="grid">${devices.map((v) => this._renderTile(v))}</div>

          <div
            class="chevron-row clickable"
            role="button"
            tabindex="0"
            aria-expanded=${String(this._expanded)}
            aria-label="Details"
            @click=${this._toggleExpanded}
            @keydown=${this._onKeydown}
          >
            <ha-icon class="chevron ${this._expanded ? 'open' : ''}" icon="mdi:chevron-down"></ha-icon>
          </div>
        </div>
        ${this._expanded
          ? html`<div class="overlay">
              ${this._renderTable(light, devices)}
              ${(config.settings ?? []).length > 0
                ? this._renderSettings(config.settings ?? [])
                : nothing}
            </div>`
          : nothing}
      </ha-card>
    `;
  }

  private _renderTile(view: ItemView): TemplateResult {
    const dot = this._dotState(view);
    const dotClass = dot === true ? 'on' : dot === false ? 'idle' : 'off';
    const power =
      view.on === true && view.powerW !== null ? `${formatInt(view.powerW)} W` : '–';
    return html`
      <div class="tile">
        <span class="dot ${dotClass}"></span>
        <span class="tile-name">${view.name}</span>
        <span class="tile-power">${power}</span>
      </div>
    `;
  }

  private _renderTable(light: ItemView | null, devices: ItemView[]): TemplateResult {
    const rows = light ? [light, ...devices] : devices;
    const totalW = rows.reduce((sum, v) => sum + (v.powerW ?? 0), 0);
    const totalKwh = rows.reduce((sum, v) => {
      const c = this._consumption(v);
      return sum + (c ?? 0);
    }, 0);

    return html`
      <div class="table-head">
        <span class="table-title">Verbrauch &amp; Schalten</span>
        ${renderSegmented<StatsPeriod>(
          PERIOD_ORDER.map((p) => ({ value: p, label: PERIOD_LABEL[p] })),
          this._period,
          (value) => this._setPeriod(value),
          'Zeitraum',
        )}
      </div>
      <table class="tbl">
        <thead>
          <tr>
            <th class="col-name">Gerät</th>
            <th>Leistung</th>
            <th title="Stand der letzten vollen Stunde">Verbrauch</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((v) => this._renderTableRow(v))}
          <tr class="total">
            <td class="col-name">Gesamt</td>
            <td>${formatInt(totalW)} W</td>
            <td>${formatFixed(totalKwh, 2)} kWh</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    `;
  }

  private _renderTableRow(view: ItemView): TemplateResult {
    const power =
      view.on === true && view.powerW !== null ? `${formatInt(view.powerW)} W` : '–';
    const kwh = this._consumption(view);
    const writable =
      this._isDemo ||
      (view.isLight ? isWritableLight(view.entity) : isWritableSwitch(view.entity));

    return html`
      <tr>
        <td class="col-name">${view.name}</td>
        <td>${power}</td>
        <td title=${kwh === null ? 'keine Statistik' : 'Stand der letzten vollen Stunde'}>
          ${kwh === null ? '–' : `${formatFixed(kwh, 2)} kWh`}
        </td>
        <td class="col-seg">
          ${renderSegmented(
            ON_OFF_OPTIONS,
            view.on === null ? null : view.on ? 'on' : 'off',
            (value) => this._set(view, value === 'on'),
            view.name,
            !writable,
          )}
        </td>
      </tr>
    `;
  }

  /** "Einstellungen" block under the table: one on/off row per setting. */
  private _renderSettings(settings: GarageSettingConfig[]): TemplateResult {
    return html`
      <div class="settings">
        <div class="settings-title">Einstellungen</div>
        ${settings.map((s) => {
          const on = this._on(s.entity);
          const disabled = !isWritableSwitch(s.entity);
          return html`
            <div class="setting-row ${on === null ? 'dim' : ''}">
              <span class="setting-name">${s.name}</span>
              ${renderSegmented(
                ON_OFF_OPTIONS,
                on === null ? null : on ? 'on' : 'off',
                (value) => this._setSetting(s.entity, value === 'on'),
                s.name,
                disabled,
              )}
            </div>
          `;
        })}
      </div>
    `;
  }

  private _setSetting(entity: string, on: boolean): void {
    this._onLocal = { ...this._onLocal, [entity]: on };
    if (!isWritableSwitch(entity)) return;
    this._holdOptimistic(entity, () => this._clearOnLocal(entity));
    void this._write(writeSwitch(this.hass, entity, on), () => {
      this._clearSettle(entity);
      this._clearOnLocal(entity);
    });
  }

  // =========================================================================
  // statistics
  // =========================================================================

  private _periodStart(period: StatsPeriod): Date {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const d = now.getDate();
    if (period === 'day') return new Date(y, m, d);
    if (period === 'week') {
      const back = (now.getDay() + 6) % 7; // Monday = 0
      return new Date(y, m, d - back);
    }
    if (period === 'month') return new Date(y, m, 1);
    return new Date(y, 0, 1);
  }

  private _energyIds(): string[] {
    const ids: string[] = [];
    if (this._config?.light?.energy_entity) ids.push(this._config.light.energy_entity);
    for (const d of this._config?.devices ?? []) {
      if (d.energy_entity) ids.push(d.energy_entity);
    }
    return ids;
  }

  private async _fetchStats(period: StatsPeriod): Promise<void> {
    if (this._isDemo || !this.hass?.callWS) return;
    const ids = this._energyIds();
    if (ids.length === 0) return;

    const token = ++this._statsToken;
    const start = this._periodStart(period);
    const end = new Date();

    try {
      const result = await this.hass.callWS<StatsResponse>({
        type: 'recorder/statistics_during_period',
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        statistic_ids: ids,
        period: RECORDER_PERIOD[period],
        types: ['change'],
      });
      if (token !== this._statsToken) return;

      const map: Record<string, number | null> = {};
      for (const id of ids) {
        const series = result?.[id];
        if (!series || series.length === 0) {
          map[id] = null; // no statistics for this sensor
          continue;
        }
        let sum = 0;
        for (const entry of series) {
          if (typeof entry.change === 'number' && Number.isFinite(entry.change)) {
            sum += entry.change;
          }
        }
        map[id] = sum;
      }
      this._stats = { ...this._stats, [period]: map };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('des-garage-card: Statistik konnte nicht geladen werden', error);
    }
  }

  private _startStatsTimer(): void {
    this._stopStatsTimer();
    this._statsTimer = window.setInterval(() => {
      // Refresh the currently shown period only.
      void this._fetchStats(this._period);
    }, STATS_REFRESH_MS);
  }

  private _stopStatsTimer(): void {
    if (this._statsTimer !== undefined) {
      window.clearInterval(this._statsTimer);
      this._statsTimer = undefined;
    }
  }

  // =========================================================================
  // interaction
  // =========================================================================

  private _toggleExpanded(): void {
    this._expanded = !this._expanded;
    if (this._expanded) {
      this._closer.activate();
      void this._fetchStats(this._period);
      this._startStatsTimer();
    } else {
      this._closer.deactivate();
      this._stopStatsTimer();
    }
  }

  private _collapse(): void {
    if (!this._expanded) return;
    this._expanded = false;
    this._closer.deactivate();
    this._stopStatsTimer();
  }

  private _onKeydown(ev: KeyboardEvent): void {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this._toggleExpanded();
    }
  }

  private _setPeriod(period: StatsPeriod): void {
    this._period = period;
    if (this._stats[period] === undefined) void this._fetchStats(period);
  }

  private _set(view: ItemView, on: boolean): void {
    this._onLocal = { ...this._onLocal, [view.entity]: on };
    if (this._isDemo) return;

    const call = view.isLight
      ? isWritableLight(view.entity)
        ? writeLight(this.hass, view.entity, on)
        : null
      : isWritableSwitch(view.entity)
        ? writeSwitch(this.hass, view.entity, on)
        : null;
    if (!call) {
      this._clearOnLocal(view.entity);
      return;
    }
    this._holdOptimistic(view.entity, () => this._clearOnLocal(view.entity));
    void this._write(call, () => {
      this._clearSettle(view.entity);
      this._clearOnLocal(view.entity);
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
      console.error('des-garage-card: Service-Call fehlgeschlagen', error);
    }
  }

  static override styles = [
    tokenStyles,
    segmentedStyles,
    chevronStyles,
    overlayStyles,
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
      }

      .badge-label {
        display: block;
        transform: translateY(1px);
      }

      .badge-amber,
      .pill-amber {
        background: rgba(255, 152, 0, 0.16);
        background: color-mix(in srgb, var(--warning-color, #ff9800) 16%, transparent);
        color: var(--warning-color, #ff9800);
      }

      .pill-blue {
        background: rgba(33, 150, 243, 0.16);
        background: color-mix(in srgb, var(--info-color, #2196f3) 16%, transparent);
        color: var(--info-color, #2196f3);
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

      /* --- collapsed status grid --- */

      .grid {
        margin-top: 8px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
      }

      .tile {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 5px 8px;
        border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.28));
        border-radius: 6px;
      }

      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .dot.on {
        background: var(--success-color, #2e7d32);
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.12);
      }

      .dot.idle {
        background: var(--secondary-text-color, #888);
        opacity: 0.6;
      }

      .dot.off {
        background: transparent;
        border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.5));
      }

      .tile-name {
        font-size: 13px;
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
      }

      .tile-power {
        margin-left: auto;
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        flex-shrink: 0;
      }

      /* --- expanded table --- */

      .table-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 8px;
      }

      .table-title {
        font-size: 11px;
        color: var(--secondary-text-color);
        letter-spacing: 0.04em;
      }

      .tbl {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
      }

      .tbl th,
      .tbl td {
        padding: 6px 6px;
        text-align: right;
        white-space: nowrap;
        color: var(--secondary-text-color);
      }

      .tbl th {
        font-weight: 500;
      }

      .tbl .col-name {
        text-align: left;
      }

      .tbl td.col-name {
        color: var(--primary-text-color);
      }

      .tbl th:first-child,
      .tbl td:first-child {
        padding-left: 0;
      }

      .tbl th:last-child,
      .tbl td:last-child {
        padding-right: 0;
      }

      .tbl .col-seg {
        text-align: right;
      }

      .tbl tbody td {
        border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.18));
      }

      .tbl tr.total td {
        color: var(--secondary-text-color);
        font-weight: 500;
      }

      /* Right-align the segmented control in its cell. */
      .tbl .col-seg .seg {
        float: right;
      }

      /* --- settings block --- */

      .settings {
        margin-top: 12px;
        padding-top: 10px;
        border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.18));
      }

      .settings-title {
        font-size: 11px;
        color: var(--secondary-text-color);
        letter-spacing: 0.04em;
        margin-bottom: 4px;
      }

      .setting-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 6px 0;
      }

      .setting-row.dim {
        opacity: 0.5;
      }

      .setting-name {
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

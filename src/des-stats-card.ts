import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { formatFixed, formatInt, clamp } from './format';
import { entityUnit, isEntityId, resolveNumber } from './resolve';
import { renderSegmented, segmentedStyles } from './segmented';
import type {
  DesStatsCardConfig,
  HomeAssistant,
  NumberValue,
  StatsPeriod,
  StatsPeriodConfig,
} from './types';

const PERIOD_ORDER: ReadonlyArray<StatsPeriod> = ['day', 'week', 'month', 'year'];
const PERIOD_SET: ReadonlySet<StatsPeriod> = new Set(PERIOD_ORDER);
const PERIOD_LABEL: Record<StatsPeriod, string> = {
  day: 'Tag',
  week: 'Woche',
  month: 'Monat',
  year: 'Jahr',
};

type MetricKey =
  | 'consumption'
  | 'production'
  | 'import'
  | 'export'
  | 'charge'
  | 'discharge';

/** The six rows, in display order, with their label and colour class. */
const METRICS: ReadonlyArray<{ key: MetricKey; label: string; cls: string }> = [
  { key: 'consumption', label: 'Verbrauch', cls: 'm-consumption' },
  { key: 'production', label: 'Produktion', cls: 'm-production' },
  { key: 'import', label: 'Import', cls: 'm-import' },
  { key: 'export', label: 'Export', cls: 'm-export' },
  { key: 'charge', label: 'Laden', cls: 'm-charge' },
  { key: 'discharge', label: 'Entladen', cls: 'm-discharge' },
];

/** One period's resolved figures; `null` marks a row the card cannot show. */
type PeriodValues = Record<MetricKey, number | null>;

/** Builds a `PeriodValues` from an array in `METRICS` order (demo datasets). */
function values(row: readonly number[]): PeriodValues {
  return {
    consumption: row[0],
    production: row[1],
    import: row[2],
    export: row[3],
    charge: row[4],
    discharge: row[5],
  };
}

/**
 * Static demo datasets (no `periods` config). Order per row:
 * consumption / production / import / export / charge / discharge.
 */
const DEMO: Record<StatsPeriod, PeriodValues> = {
  day: values([17.6, 22.4, 4.4, 3.1, 6.2, 5.8]),
  week: values([148.2, 127.5, 38.6, 41.0, 32.1, 28.4]),
  month: values([610, 590, 160, 175, 140, 128]),
  year: values([5400, 8200, 1900, 4100, 1200, 1100]),
};

/** True for a config slot (value, entity id, or a non-empty list) that is set. */
function presentValue(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(presentValue);
  if (typeof value === 'number') return Number.isFinite(value);
  return typeof value === 'string' && value.trim().length > 0;
}

export class DesStatsCard extends LitElement {
  static override properties = {
    // Assigning `hass` is a reactive property write, so Home Assistant's state
    // updates re-render the card (same mechanism as the other cards).
    hass: { attribute: false },
    _config: { state: true },
    _period: { state: true },
  };

  declare hass?: HomeAssistant;
  declare _config?: DesStatsCardConfig;
  /** The user's period pick, or `null` to follow `default_period`. */
  declare _period: StatsPeriod | null;

  constructor() {
    super();
    this._period = null;
  }

  setConfig(config: DesStatsCardConfig): void {
    if (!config) {
      throw new Error('des-stats-card: Konfiguration fehlt');
    }
    if (!config.name) {
      throw new Error('des-stats-card: "name" ist erforderlich');
    }
    if (config.default_period && !PERIOD_SET.has(config.default_period)) {
      throw new Error(
        'des-stats-card: "default_period" muss "day", "week", "month" oder "year" sein',
      );
    }
    this._config = config;
    this._period = null;
  }

  getCardSize(): number {
    const period = this._effectivePeriod(this._availablePeriods());
    const rows = period
      ? METRICS.filter((m) => this._periodValues(period)[m.key] !== null).length
      : 0;
    return 2 + Math.ceil(rows / 2);
  }

  static getStubConfig(): DesStatsCardConfig {
    // No periods, so the picker preview shows the populated demo readout.
    return { type: 'custom:des-stats-card', name: 'Statistik', default_period: 'day' };
  }

  // =========================================================================
  // mode + resolution
  // =========================================================================

  /** Any configured period figure switches the card from demo to reading. */
  private get _entityMode(): boolean {
    const periods = this._config?.periods;
    if (!periods) return false;
    return PERIOD_ORDER.some((period) => {
      const block = periods[period];
      return block !== undefined && METRICS.some((m) => presentValue(block[m.key]));
    });
  }

  /**
   * A configured slot's numeric value, rescaled onto kWh (Wh → /1000,
   * MWh → ×1000). `null` for an unset, unavailable or non-numeric slot.
   */
  private _num(raw: NumberValue | undefined): number | null {
    if (raw === undefined) return null;
    if (typeof raw === 'string' && raw.trim().length === 0) return null;
    const resolved = resolveNumber(raw, this.hass);
    if (resolved.kind !== 'value') return null;

    let value = resolved.value;
    // Only entities carry a unit; a static number is taken as already in kWh.
    if (typeof raw === 'string' && isEntityId(raw)) {
      const unit = entityUnit(raw, this.hass);
      if (unit === 'wh') value /= 1000;
      else if (unit === 'mwh') value *= 1000;
    }
    return Number.isFinite(value) ? value : null;
  }

  /** Sum of a single value or a list; `null` when nothing resolves. */
  private _sumList(raw: NumberValue | NumberValue[] | undefined): number | null {
    if (raw === undefined) return null;
    const list = Array.isArray(raw) ? raw : [raw];
    const nums = list
      .map((entry) => this._num(entry))
      .filter((n): n is number => n !== null);
    return nums.length > 0 ? nums.reduce((a, b) => a + b, 0) : null;
  }

  private _metricValue(
    block: StatsPeriodConfig | undefined,
    key: MetricKey,
  ): number | null {
    if (!block) return null;
    if (key === 'charge' || key === 'discharge') return this._sumList(block[key]);
    return this._num(block[key]);
  }

  private _periodValues(period: StatsPeriod): PeriodValues {
    if (!this._entityMode) return DEMO[period];
    const block = this._config?.periods?.[period];
    const out = {} as PeriodValues;
    for (const { key } of METRICS) out[key] = this._metricValue(block, key);
    return out;
  }

  /** Periods that have at least one readable figure (all four in demo mode). */
  private _availablePeriods(): StatsPeriod[] {
    if (!this._entityMode) return [...PERIOD_ORDER];
    return PERIOD_ORDER.filter((period) => {
      const vals = this._periodValues(period);
      return METRICS.some((m) => vals[m.key] !== null);
    });
  }

  /** The user's pick if still available, else `default_period`, else the first. */
  private _effectivePeriod(available: StatsPeriod[]): StatsPeriod | null {
    if (available.length === 0) return null;
    if (this._period && available.includes(this._period)) return this._period;
    const preferred = this._config?.default_period;
    if (preferred && available.includes(preferred)) return preferred;
    return available[0];
  }

  /** Percentage, whole number, or null when the denominator is unusable. */
  private _ratio(part: number | null, whole: number | null): number | null {
    if (whole === null || whole <= 0 || part === null) return null;
    return clamp((1 - part / whole) * 100, 0, 100);
  }

  // =========================================================================
  // render
  // =========================================================================

  override render(): TemplateResult | typeof nothing {
    const config = this._config;
    if (!config) return nothing;

    const available = this._availablePeriods();
    const period = this._effectivePeriod(available);
    const vals = period ? this._periodValues(period) : null;

    const autark = vals ? this._ratio(vals.import, vals.consumption) : null;
    const eigen = vals ? this._ratio(vals.export, vals.production) : null;

    return html`
      <ha-card>
        <div class="card">
          <div class="header">
            <span class="name">${config.name}</span>
            ${available.length > 0 && period
              ? renderSegmented(
                  available.map((p) => ({ value: p, label: PERIOD_LABEL[p] })),
                  period,
                  (value) => this._setPeriod(value),
                  'Zeitraum',
                )
              : nothing}
          </div>

          ${autark === null && eigen === null
            ? nothing
            : html`<div class="meta">
                ${this._pct(autark)} % autark · ${this._pct(eigen)} %
                Eigenverbrauch
              </div>`}

          ${vals ? this._renderRows(vals) : nothing}
        </div>
      </ha-card>
    `;
  }

  private _renderRows(vals: PeriodValues): TemplateResult {
    // Full-scale is the largest shown value, so the tallest bar reads 100 %.
    const shown = METRICS.map((m) => vals[m.key]).filter(
      (v): v is number => v !== null,
    );
    const max = shown.reduce((a, b) => Math.max(a, b), 0);

    return html`
      <div class="rows">
        ${METRICS.map((metric) => {
          const value = vals[metric.key];
          if (value === null) return nothing;
          const pct = max > 0 ? clamp((value / max) * 100, 0, 100) : 0;
          return html`
            <span class="row-label">${metric.label}</span>
            <div class="bar">
              <div
                class="bar-fill ${metric.cls}"
                style="width: ${pct}%"
              ></div>
            </div>
            <span class="row-value">${formatFixed(value)} kWh</span>
          `;
        })}
      </div>
    `;
  }

  /** Whole-number percent, or a muted "–" when it cannot be computed. */
  private _pct(value: number | null): TemplateResult {
    return value === null
      ? html`<span class="unavail">–</span>`
      : html`${formatInt(value)}`;
  }

  private _setPeriod(period: StatsPeriod): void {
    this._period = period;
  }

  static override styles = [
    segmentedStyles,
    css`
      :host {
        display: block;
        height: 100%;

        /* Two hues the theme does not provide: an olive that stays clear of the
           production green, and a lighter blue for discharge against charge. */
        --stats-export-color: #639922;
        --stats-discharge-color: #7fb8e8;
      }

      ha-card {
        height: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        background: var(--card-background-color, var(--ha-card-background, #fff));
        color: var(--primary-text-color);
      }

      .card {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 12px 16px;
      }

      /* --- header --- */

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .name {
        font-size: 15px;
        font-weight: 500;
        color: var(--primary-text-color);
        white-space: nowrap;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .meta {
        margin-top: 4px;
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .unavail {
        color: var(--secondary-text-color);
        opacity: 0.7;
      }

      /* --- rows: label | bar | value --- */

      .rows {
        margin-top: 12px;
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 7px 10px;
      }

      .row-label {
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
      }

      .row-value {
        font-size: 12px;
        text-align: right;
        color: var(--primary-text-color);
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }

      .bar {
        height: 6px;
        border-radius: 3px;
        background: var(--divider-color, rgba(127, 127, 127, 0.22));
        overflow: hidden;
      }

      .bar-fill {
        height: 100%;
        border-radius: 3px;
        transition: width 0.25s ease-out;
      }

      .bar-fill.m-consumption {
        background: var(--secondary-text-color);
      }

      .bar-fill.m-production {
        background: var(--success-color, #2e7d32);
      }

      .bar-fill.m-import {
        background: var(--error-color, #d32f2f);
      }

      .bar-fill.m-export {
        background: var(--stats-export-color, #639922);
      }

      .bar-fill.m-charge {
        background: var(--info-color, #2196f3);
      }

      .bar-fill.m-discharge {
        background: var(--stats-discharge-color, #7fb8e8);
      }
    `,
  ];
}

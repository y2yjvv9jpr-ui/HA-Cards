import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { formatFixed, formatInt, clamp } from './format';
import { entityUnit, isEntityId, resolveNumber } from './resolve';
import { chevronStyles } from './chevron';
import { overlayStyles, OverlayCloser } from './overlay';
import { tokenStyles } from './tokens';
import { renderSegmented, segmentedStyles } from './segmented';
import type {
  DesHouseCardConfig,
  HomeAssistant,
  HouseDemoState,
  StatsPeriod,
} from './types';

const DEMO_STATES: ReadonlySet<HouseDemoState> = new Set([
  'normal',
  'night',
  'export',
]);

/** How a resolved entity value is rescaled onto the unit the card expects. */
type Scale = 'power' | 'energy' | 'plain';

/** Grid size in a HA sections view (column_span 3 → 36 columns): a third wide. */
const GRID_ROWS = 6;
const GRID_MIN_ROWS = 5;
const GRID_COLUMNS = 12;

/** Default sources for the mix bar / chart — Daniel's helpers. */
const DEFAULT_SOLAR_POWER = 'sensor.pv_helper_solar_direkt_leistung';
const DEFAULT_STORAGE_POWER = 'sensor.pv_helper_speicher_leistung';
const DEFAULT_GRID_POWER = 'sensor.inverter_external_power';
const DEFAULT_SOLAR_ENERGY = 'sensor.pv_helper_energie_solar_direkt';
const DEFAULT_STORAGE_ENERGY = 'sensor.pv_helper_energie_entladen_gesamt';
const DEFAULT_GRID_ENERGY = 'sensor.pv_helper_energie_import_gesamt';

/** Series colours — same as the mix bar. Solar follows the production token. */
const COLOR_SOLAR = 'var(--des-production-color)';
const COLOR_STORAGE = '#378ADD';
const COLOR_GRID = '#E24B4A';

const PERIOD_ORDER: ReadonlyArray<StatsPeriod> = ['day', 'week', 'month', 'year'];
const PERIOD_LABEL: Record<StatsPeriod, string> = {
  day: 'Tag',
  week: 'Woche',
  month: 'Monat',
  year: 'Jahr',
};
const PERIOD_META: Record<StatsPeriod, string> = {
  day: 'W',
  week: 'kWh je Tag',
  month: 'kWh je Tag',
  year: 'kWh je Monat',
};

/** Chart height in a view that imposes none; flex overrides it where sized. */
const FALLBACK_CHART_HEIGHT = 180;
/** Ignore sub-pixel jitter, so measuring can never chase its own writes. */
const HEIGHT_EPSILON_PX = 2;

/** The embedded card element accepts a `hass` assignment; that is all we need. */
interface EmbeddedCard extends HTMLElement {
  hass?: HomeAssistant;
}

/** The ApexCharts instance the embedded card keeps; only `updateOptions` is used. */
interface ApexInstance {
  updateOptions(
    options: Record<string, unknown>,
    redrawPaths?: boolean,
    animate?: boolean,
  ): unknown;
}

/** Property names apexcharts-card has used for its ApexCharts instance. */
const APEX_INSTANCE_KEYS = ['_apexChart', 'apexChart', '_chart'] as const;

/** Minimal shape of Home Assistant's card-helper bundle. */
interface CardHelpers {
  createCardElement(config: Record<string, unknown>): EmbeddedCard;
}

/**
 * The raw numbers the mix is computed from, whatever the source. In entity
 * mode a field the card could not read is `null`; in demo mode nothing is null.
 * `autarky` is `null` unless read straight from `autarky_entity`, in which case
 * it wins over the import/consumption calculation.
 */
interface RawInputs {
  load: number | null;
  gridRaw: number | null;
  storage: Array<number | null>;
  /** Total PV power; when non-null the solar share is measured, not derived. */
  pvPower: number | null;
  todayConsumption: number | null;
  todayImport: number | null;
  todayExport: number | null;
  autarky: number | null;
}

/**
 * Phase 1 has no entity binding: the whole readout is one of these canned
 * datasets, picked with `demo_state`. Phase 2 keeps them as the fallback
 * whenever no entity field is configured. The grid value is stated *after*
 * `invert_grid` (which defaults to `false`): positive = draw, negative = feed.
 */
const DEMO_DATA: Record<HouseDemoState, RawInputs> = {
  // Measured mode (pvPower set): 2.840 W solar / 72 %, 710 W storage / 18 %,
  // 400 W grid / 10 %. pv 2840 − feed-in 0 − charging 0 = 2840 W solar.
  normal: {
    load: 3950,
    gridRaw: 400,
    storage: [710, 0],
    pvPower: 2840,
    todayConsumption: 23.4,
    todayImport: 4.4,
    todayExport: 3.1,
    autarky: null,
  },
  // No sun and no grid flow: the battery alone carries the house (100 % storage).
  night: {
    load: 620,
    gridRaw: 0,
    storage: [620, 0],
    pvPower: 0,
    todayConsumption: 23.4,
    todayImport: 4.4,
    todayExport: 3.1,
    autarky: null,
  },
  // Surplus solar: 5.000 W PV, 3.800 W of it fed to the grid, 1.200 W into the
  // house (100 % solar). Fully self-supplied.
  export: {
    load: 1200,
    gridRaw: -3800,
    storage: [0, 0],
    pvPower: 5000,
    todayConsumption: 23.4,
    todayImport: 4.4,
    todayExport: 3.1,
    autarky: null,
  },
};

// --- resolved view model ---------------------------------------------------
//
// The render layer draws from this shape whether the values came from the demo
// dataset or from `hass.states`. Only `load` and the three `today*` fields can
// be null (they show a muted "–"); the mix shares are always numbers, since a
// missing input counts as 0 W for the mix and `load ≤ 0` empties every segment.

interface HouseView {
  load: number | null;
  solarShare: number;
  storageShare: number;
  gridShare: number;
  /** Percentages 0-100 for the bar; all 0 when `load ≤ 0`. */
  solarPct: number;
  storagePct: number;
  gridPct: number;
  todayConsumption: number | null;
  todayImport: number | null;
  todayExport: number | null;
  autarky: number | null;
  /** True when at least one "Heute" value is present (drives chevron + block). */
  hasToday: boolean;
}

/** True for a config slot that actually names an entity/value. */
function present(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

function nonEmptyArray(value: unknown): boolean {
  return Array.isArray(value) && value.some(present);
}

export class DesHouseCard extends LitElement {
  static override properties = {
    // Assigning `hass` is a reactive property write, so Home Assistant's state
    // updates re-render the card (same mechanism as the other cards).
    hass: { attribute: false },
    _config: { state: true },
    _expanded: { state: true },
    _period: { state: true },
  };

  declare hass?: HomeAssistant;
  declare _config?: DesHouseCardConfig;
  declare _expanded: boolean;
  /** The user's period pick, or `null` to follow the default (Tag). */
  declare _period: StatsPeriod | null;

  /** Closes the dropdown on an outside click or Escape while it is open. */
  private _closer = new OverlayCloser(this, () => this._collapse());

  // embedded chart lifecycle (mirrors des-chart-card)
  private _chartEl?: EmbeddedCard;
  private _chartPeriod?: StatsPeriod;
  private _mountToken = 0;
  private _helpersPromise?: Promise<CardHelpers | null>;
  private _awaitingApex = false;
  private _chartHeight?: number;
  private _resizeObserver?: ResizeObserver;
  private _observedChart?: HTMLElement;

  constructor() {
    super();
    this._expanded = false;
    this._period = null;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._closer.deactivate();
    this._teardownChart();
    this._resizeObserver?.disconnect();
    this._resizeObserver = undefined;
    this._observedChart = undefined;
  }

  override firstUpdated(): void {
    // apexcharts-card may register after us; re-render once it does.
    if (!this._apexAvailable() && !this._awaitingApex) {
      this._awaitingApex = true;
      customElements
        .whenDefined('apexcharts-card')
        .then(() => this.requestUpdate())
        .catch(() => undefined);
    }
  }

  /** Keeps the `expanded` attribute in sync and drives the embedded chart. */
  protected override updated(): void {
    this.toggleAttribute('expanded', this._expanded);
    const container = this.renderRoot?.querySelector('#chart') as HTMLElement | null;
    this._observeChartSize(container);
    this._applyChartHeight();
    this._syncChart();
  }

  setConfig(config: DesHouseCardConfig): void {
    if (!config) {
      throw new Error('des-house-card: Konfiguration fehlt');
    }
    if (!config.name) {
      throw new Error('des-house-card: "name" ist erforderlich');
    }
    if (config.demo_state && !DEMO_STATES.has(config.demo_state)) {
      throw new Error(
        'des-house-card: "demo_state" muss "normal", "night" oder "export" sein',
      );
    }
    if (
      config.storage_positive &&
      config.storage_positive !== 'discharge' &&
      config.storage_positive !== 'charge'
    ) {
      throw new Error(
        'des-house-card: "storage_positive" muss "discharge" oder "charge" sein',
      );
    }
    this._config = config;
    this._expanded = false;
    this._period = null;
    this._teardownChart();
  }

  getCardSize(): number {
    return GRID_ROWS;
  }

  /** HA sections view: a third of the section; the chart grows into the rows. */
  getGridOptions(): { columns: number; rows: number; min_rows: number } {
    return { columns: GRID_COLUMNS, rows: GRID_ROWS, min_rows: GRID_MIN_ROWS };
  }

  static getStubConfig(): DesHouseCardConfig {
    // No entities, so the picker preview shows the populated demo readout.
    return {
      type: 'custom:des-house-card',
      name: 'Haus',
      demo_state: 'normal',
    };
  }

  // =========================================================================
  // mode + resolution
  // =========================================================================

  /** Any configured entity field switches the card from demo to reading. */
  private get _entityMode(): boolean {
    const c = this._config;
    if (!c) return false;
    return (
      present(c.pv_power_entity) ||
      present(c.load_power_entity) ||
      present(c.grid_power_entity) ||
      nonEmptyArray(c.storage_power_entities) ||
      present(c.today_consumption_entity) ||
      present(c.today_import_entity) ||
      present(c.today_export_entity) ||
      present(c.autarky_entity) ||
      present(c.solar_power_entity) ||
      present(c.storage_power_entity) ||
      present(c.solar_energy_entity) ||
      present(c.storage_energy_entity) ||
      present(c.grid_energy_entity)
    );
  }

  /**
   * A configured entity's numeric value, rescaled onto the card's base unit
   * (W for power, kWh for energy). `null` for an unset, unavailable or
   * non-numeric slot - all of which render as a muted "–".
   */
  private _num(entity: string | undefined, scale: Scale): number | null {
    if (!present(entity)) return null;
    const resolved = resolveNumber(entity, this.hass);
    if (resolved.kind !== 'value') return null;

    let value = resolved.value;
    // Only entities carry a unit; a static number is taken as already-scaled.
    if (isEntityId(entity!)) {
      const unit = entityUnit(entity!, this.hass);
      if (scale === 'power') {
        if (unit === 'kw') value *= 1000;
        else if (unit === 'mw') value *= 1_000_000;
      } else if (scale === 'energy') {
        if (unit === 'wh') value /= 1000;
        else if (unit === 'mwh') value *= 1000;
      }
    }
    return Number.isFinite(value) ? value : null;
  }

  private _rawInputs(): RawInputs {
    if (!this._entityMode) {
      return DEMO_DATA[this._config!.demo_state ?? 'normal'];
    }
    const c = this._config!;
    return {
      load: this._num(c.load_power_entity, 'power'),
      gridRaw: this._num(c.grid_power_entity, 'power'),
      storage: (c.storage_power_entities ?? []).map((e) => this._num(e, 'power')),
      pvPower: this._num(c.pv_power_entity, 'power'),
      todayConsumption: this._num(c.today_consumption_entity, 'energy'),
      todayImport: this._num(c.today_import_entity, 'energy'),
      todayExport: this._num(c.today_export_entity, 'energy'),
      autarky: this._num(c.autarky_entity, 'plain'),
    };
  }

  private _view(): HouseView {
    const c = this._config!;
    const raw = this._rawInputs();

    const invert = c.invert_grid ? -1 : 1;
    const grid = raw.gridRaw === null ? null : raw.gridRaw * invert;
    const gridForMix = grid ?? 0;
    const gridIn = Math.max(gridForMix, 0);
    const gridOut = Math.max(-gridForMix, 0);

    // Positive storage power means discharge by default; `charge` flips it.
    const chargeMode = (c.storage_positive ?? 'discharge') === 'charge';
    const storageDischarge = raw.storage.reduce<number>((sum, v) => {
      if (v === null) return sum;
      return sum + Math.max(chargeMode ? -v : v, 0);
    }, 0);

    let storageShare = 0;
    let gridShare = 0;
    let solarShare = 0;
    let pct: (share: number) => number;

    if (raw.pvPower !== null) {
      // Measured mode: solar is what PV delivers minus what leaves the house
      // again (feed-in + storage charging); the shares are relative to the sum
      // of the sources, which may differ from the metered consumption.
      const storageChargeW = raw.storage.reduce<number>((sum, v) => {
        if (v === null) return sum;
        return sum + Math.max(chargeMode ? v : -v, 0);
      }, 0);
      solarShare = Math.max(raw.pvPower - gridOut - storageChargeW, 0);
      storageShare = storageDischarge;
      gridShare = gridIn;
      const sources = solarShare + storageShare + gridShare;
      pct = (share) => (sources > 0 ? clamp((share / sources) * 100, 0, 100) : 0);
    } else {
      // Derived mode: solar is the remainder of the metered load. Missing load
      // counts as 0 W, and `load ≤ 0` empties every segment.
      const lv = raw.load !== null && raw.load > 0 ? raw.load : 0;
      if (lv > 0) {
        storageShare = Math.min(storageDischarge, lv);
        gridShare = Math.min(gridIn, lv - storageShare);
        solarShare = Math.max(lv - storageShare - gridShare, 0);
      }
      pct = (share) => (lv > 0 ? clamp((share / lv) * 100, 0, 100) : 0);
    }

    return {
      load: raw.load,
      solarShare,
      storageShare,
      gridShare,
      solarPct: pct(solarShare),
      storagePct: pct(storageShare),
      gridPct: pct(gridShare),
      todayConsumption: raw.todayConsumption,
      todayImport: raw.todayImport,
      todayExport: raw.todayExport,
      autarky: this._autarky(raw),
      hasToday:
        raw.todayConsumption !== null ||
        raw.todayImport !== null ||
        raw.todayExport !== null,
    };
  }

  /** `autarky_entity` wins; otherwise 1 − import / consumption, in whole %. */
  private _autarky(raw: RawInputs): number | null {
    if (raw.autarky !== null) return raw.autarky;
    const { todayConsumption: cons, todayImport: imp } = raw;
    if (cons === null || cons <= 0 || imp === null) return null;
    return clamp((1 - imp / cons) * 100, 0, 100);
  }

  // =========================================================================
  // chart period model
  // =========================================================================

  private _chartEntity(configured: string | undefined, fallback: string): string {
    return configured ?? fallback;
  }

  /** Week/Month/Year need the three energy entities; day needs only power. */
  private _energyPeriodsAvailable(): boolean {
    const c = this._config;
    return (
      present(this._chartEntity(c?.solar_energy_entity, DEFAULT_SOLAR_ENERGY)) &&
      present(this._chartEntity(c?.storage_energy_entity, DEFAULT_STORAGE_ENERGY)) &&
      present(this._chartEntity(c?.grid_energy_entity, DEFAULT_GRID_ENERGY))
    );
  }

  private _availablePeriods(): StatsPeriod[] {
    return this._energyPeriodsAvailable() ? [...PERIOD_ORDER] : ['day'];
  }

  private _effectivePeriod(available: StatsPeriod[]): StatsPeriod {
    if (this._period && available.includes(this._period)) return this._period;
    return available.includes('day') ? 'day' : available[0];
  }

  private _setPeriod(period: StatsPeriod): void {
    this._period = period;
  }

  private _apexAvailable(): boolean {
    return customElements.get('apexcharts-card') !== undefined;
  }

  /** The full apexcharts-card config for one period, built from the sources. */
  private _apexCardConfig(period: StatsPeriod): Record<string, unknown> {
    const c = this._config;
    const height = this._chartHeight ?? FALLBACK_CHART_HEIGHT;

    const datetimeFormatter: Record<StatsPeriod, Record<string, string>> = {
      day: { hour: 'HH' },
      week: { day: 'dd.MM' },
      month: { day: 'dd.' },
      year: { month: 'MMM' },
    };

    // Stacked columns, not areas: ApexCharts (>= 3.44.1, the version bundled
    // with apexcharts-card) no longer stacks areas — bars still stack. See
    // apexcharts.js#4132. stack_group (below) is added because stacking also
    // breaks when a yaxis is present (apexcharts-card#827).
    const apex_config = {
      chart: { height, type: 'column', stacked: true },
      legend: {
        position: 'bottom',
        markers: { offsetX: -4 },
        itemMargin: { horizontal: 10 },
      },
      grid: { borderColor: 'var(--divider-color)', strokeDashArray: 3 },
      plotOptions: { bar: { columnWidth: '70%' } },
      xaxis: {
        tooltip: { enabled: false },
        labels: { datetimeFormatter: datetimeFormatter[period] },
      },
    };

    if (period === 'day') {
      return {
        type: 'custom:apexcharts-card',
        header: { show: false },
        graph_span: '24h',
        span: { start: 'day' },
        stacked: true,
        apex_config,
        all_series_config: {
          type: 'column',
          stack_group: 'quellen',
          extend_to: false,
          group_by: { func: 'avg', duration: '10min', fill: 'last' },
          unit: 'W',
          float_precision: 0,
          show: { legend_value: false },
        },
        series: [
          {
            entity: this._chartEntity(c?.solar_power_entity, DEFAULT_SOLAR_POWER),
            name: 'Solar',
            color: COLOR_SOLAR,
          },
          {
            entity: this._chartEntity(c?.storage_power_entity, DEFAULT_STORAGE_POWER),
            name: 'Speicher',
            color: COLOR_STORAGE,
            transform: 'return Math.max(0, x);',
          },
          {
            entity: this._chartEntity(c?.grid_power_entity, DEFAULT_GRID_POWER),
            name: 'Netz',
            color: COLOR_GRID,
            transform: 'return Math.max(0, x);',
          },
        ],
      };
    }

    const spanStart =
      period === 'week' ? 'isoWeek' : period === 'month' ? 'month' : 'year';
    const graphSpan =
      period === 'week' ? '7d' : period === 'month' ? '31d' : '366d';
    const statsPeriod = period === 'year' ? 'month' : 'day';
    const floatPrecision = period === 'year' ? 0 : 1;

    return {
      type: 'custom:apexcharts-card',
      header: { show: false },
      graph_span: graphSpan,
      span: { start: spanStart },
      stacked: true,
      apex_config,
      all_series_config: {
        type: 'column',
        stack_group: 'quellen',
        extend_to: false,
        statistics: { type: 'change', period: statsPeriod, align: 'start' },
        unit: 'kWh',
        float_precision: floatPrecision,
        show: { legend_value: false },
      },
      series: [
        {
          entity: this._chartEntity(c?.solar_energy_entity, DEFAULT_SOLAR_ENERGY),
          name: 'Solar',
          color: COLOR_SOLAR,
        },
        {
          entity: this._chartEntity(c?.storage_energy_entity, DEFAULT_STORAGE_ENERGY),
          name: 'Speicher',
          color: COLOR_STORAGE,
        },
        {
          entity: this._chartEntity(c?.grid_energy_entity, DEFAULT_GRID_ENERGY),
          name: 'Netz',
          color: COLOR_GRID,
        },
      ],
    };
  }

  // =========================================================================
  // render
  // =========================================================================

  override render(): TemplateResult | typeof nothing {
    const config = this._config;
    if (!config) return nothing;

    const view = this._view();

    return html`
      <ha-card>
        <div class="card">${this._renderCollapsed(config, view)}</div>
        ${this._expanded && view.hasToday ? this._renderExpanded(view) : nothing}
      </ha-card>
    `;
  }

  // --- collapsed (always visible) ------------------------------------------

  private _renderCollapsed(
    config: DesHouseCardConfig,
    view: HouseView,
  ): TemplateResult {
    return html`
      <div class="header">
        <div class="head-left">
          <span class="name">${config.name}</span>
          <span class="meta">${this._renderMeta(view)}</span>
        </div>
        ${this._renderPills(view)}
      </div>

      ${this._renderPowerRow(view)}
      ${this._renderMixBar(view)}
      ${this._entityMode ? this._renderChartSection() : nothing}

      ${view.hasToday
        ? html`<div
            class="chevron-row clickable"
            role="button"
            tabindex="0"
            aria-expanded=${String(this._expanded)}
            aria-label="Details"
            @click=${this._toggleExpanded}
            @keydown=${this._onKeydown}
          >
            <ha-icon
              class="chevron ${this._expanded ? 'open' : ''}"
              icon="mdi:chevron-down"
            ></ha-icon>
          </div>`
        : nothing}
    `;
  }

  /** "{today_consumption} kWh heute · {autarkie} % autark". */
  private _renderMeta(view: HouseView): TemplateResult {
    return html`${this._unit(view.todayConsumption, formatFixed, 'kWh')} heute ·
    ${this._unit(view.autarky, formatInt, '%')} autark`;
  }

  /** Solar / Speicher / Netz as coloured pills with the current W value. */
  private _renderPills(view: HouseView): TemplateResult {
    const pill = (
      cls: string,
      label: string,
      watts: number,
    ): TemplateResult => {
      const zero = !(watts > 0);
      return html`
        <span class="hpill ${zero ? 'zero' : ''}">
          <span class="swatch ${zero ? 'zero' : cls}"></span>
          <span class="hpill-label">${label}</span>
          <span class="hpill-value">${formatInt(watts)} W</span>
        </span>
      `;
    };

    return html`
      <div class="pills">
        ${pill('solar', 'Solar', view.solarShare)}
        ${pill('storage', 'Speicher', view.storageShare)}
        ${pill('grid', 'Netz', view.gridShare)}
      </div>
    `;
  }

  private _renderPowerRow(view: HouseView): TemplateResult {
    return html`
      <div class="power-row">
        <div class="load">
          <span class="load-value">${this._unit(view.load, formatInt, 'W')}</span>
          <span class="load-label">Verbrauch</span>
        </div>
      </div>
    `;
  }

  private _renderMixBar(view: HouseView): TemplateResult {
    return html`
      <div
        class="mix"
        role="img"
        aria-label="Stromherkunft: Solar ${formatInt(view.solarPct)} %, Speicher
        ${formatInt(view.storagePct)} %, Netz ${formatInt(view.gridPct)} %"
      >
        <div class="mix-seg solar" style="width: ${view.solarPct}%"></div>
        <div class="mix-seg storage" style="width: ${view.storagePct}%"></div>
        <div class="mix-seg grid" style="width: ${view.gridPct}%"></div>
      </div>
    `;
  }

  private _renderChartSection(): TemplateResult {
    const available = this._availablePeriods();
    const period = this._effectivePeriod(available);

    return html`
      <div class="chart-head">
        ${renderSegmented(
          available.map((p) => ({ value: p, label: PERIOD_LABEL[p] })),
          period,
          (value) => this._setPeriod(value),
          'Zeitraum',
        )}
      </div>
      <div class="chart-meta">${PERIOD_META[period]}</div>
      ${this._apexAvailable()
        ? html`<div class="chart" id="chart"></div>`
        : html`<div class="hint">apexcharts-card nicht installiert</div>`}
    `;
  }

  // --- expanded ------------------------------------------------------------

  private _renderExpanded(view: HouseView): TemplateResult {
    return html`
      <div class="overlay">
        <div class="today">
          ${this._todayRow('Verbrauch', view.todayConsumption, '')}
          ${this._todayRow('Netzbezug', view.todayImport, 'draw')}
          ${this._todayRow('Einspeisung', view.todayExport, 'feed')}
        </div>
      </div>
    `;
  }

  /** One "Heute" row, or nothing when its value is missing. */
  private _todayRow(
    label: string,
    value: number | null,
    modifier: string,
  ): TemplateResult | typeof nothing {
    if (value === null) return nothing;
    return html`
      <span class="today-label">${label}</span>
      <span class="today-value ${modifier}">${formatFixed(value)} kWh</span>
    `;
  }

  // =========================================================================
  // embedded chart lifecycle (mirrors des-chart-card)
  // =========================================================================

  private _observeChartSize(container: HTMLElement | null): void {
    if (typeof ResizeObserver === 'undefined') return;
    if (this._observedChart === (container ?? undefined)) return;

    this._resizeObserver?.disconnect();
    this._observedChart = container ?? undefined;
    if (!container) return;

    this._resizeObserver ??= new ResizeObserver(() => this._applyChartHeight());
    this._resizeObserver.observe(container);
  }

  private _applyChartHeight(): void {
    const container = this.renderRoot?.querySelector('#chart') as HTMLElement | null;
    if (!container) return;

    const height = container.clientHeight;
    if (height <= 0) return;
    if (
      this._chartHeight !== undefined &&
      Math.abs(height - this._chartHeight) <= HEIGHT_EPSILON_PX
    ) {
      return;
    }

    this._chartHeight = height;
    this._resizeApex(height);
  }

  private _resizeApex(height: number): void {
    const instance = this._apexInstance();
    if (!instance) return;
    try {
      void instance.updateOptions({ chart: { height } }, false, false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('des-house-card: Chart-Höhe konnte nicht gesetzt werden', error);
    }
  }

  private _apexInstance(): ApexInstance | undefined {
    const element = this._chartEl as unknown as Record<string, unknown> | undefined;
    if (!element) return undefined;

    for (const key of APEX_INSTANCE_KEYS) {
      const candidate = element[key] as ApexInstance | undefined;
      if (candidate && typeof candidate.updateOptions === 'function') {
        return candidate;
      }
    }
    return undefined;
  }

  private _syncChart(): void {
    if (!this._entityMode) {
      this._teardownChart();
      return;
    }
    const period = this._effectivePeriod(this._availablePeriods());
    const container = this.renderRoot?.querySelector('#chart') as HTMLElement | null;

    if (!this._apexAvailable() || !container) {
      this._teardownChart();
      return;
    }

    // Same period: keep the element, just push the latest hass through.
    if (this._chartEl && this._chartPeriod === period) {
      if (!this._chartEl.isConnected) container.replaceChildren(this._chartEl);
      this._chartEl.hass = this.hass;
      return;
    }

    void this._mountChart(container, period);
  }

  private async _mountChart(
    container: HTMLElement,
    period: StatsPeriod,
  ): Promise<void> {
    const token = ++this._mountToken;
    this._removeChartEl();

    const helpers = await this._getHelpers();
    if (!helpers || token !== this._mountToken) return;

    let element: EmbeddedCard;
    try {
      element = helpers.createCardElement(this._apexCardConfig(period));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('des-house-card: Chart konnte nicht erzeugt werden', error);
      return;
    }
    if (token !== this._mountToken) return;

    element.classList.add('embedded');
    element.hass = this.hass;
    container.replaceChildren(element);
    this._chartEl = element;
    this._chartPeriod = period;
  }

  private _getHelpers(): Promise<CardHelpers | null> {
    if (!this._helpersPromise) {
      const loader = (window as unknown as {
        loadCardHelpers?: () => Promise<CardHelpers>;
      }).loadCardHelpers;
      this._helpersPromise =
        typeof loader === 'function' ? loader() : Promise.resolve(null);
    }
    return this._helpersPromise;
  }

  private _removeChartEl(): void {
    if (this._chartEl) {
      this._chartEl.remove();
      this._chartEl = undefined;
    }
    this._chartPeriod = undefined;
  }

  private _teardownChart(): void {
    this._mountToken++; // cancel any in-flight mount
    this._removeChartEl();
  }

  // =========================================================================
  // shared
  // =========================================================================

  /** Formatted "value unit", or a muted "–" when the value is missing. */
  private _unit(
    value: number | null,
    format: (n: number) => string,
    unit: string,
  ): TemplateResult {
    return value === null
      ? html`<span class="unavail">–</span>`
      : html`${format(value)} ${unit}`;
  }

  private _toggleExpanded(): void {
    this._expanded = !this._expanded;
    if (this._expanded) this._closer.activate();
    else this._closer.deactivate();
  }

  private _collapse(): void {
    if (!this._expanded) return;
    this._expanded = false;
    this._closer.deactivate();
  }

  private _onKeydown(ev: KeyboardEvent): void {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this._toggleExpanded();
    }
  }

  static override styles = [
    chevronStyles,
    overlayStyles,
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
      /* Cap the card at the grid height so the chart fits instead of pushing. */
      overflow: hidden;
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

    /* --- header --- */

    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
      flex: 0 0 auto;
    }

    .head-left {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .name {
      font-size: 15px;
      font-weight: 500;
      color: var(--primary-text-color);
      white-space: nowrap;
    }

    .meta {
      font-size: 12px;
      color: var(--secondary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Placeholder for values the card could not read. */
    .unavail {
      color: var(--secondary-text-color);
      opacity: 0.7;
    }

    /* --- source pills (Solar / Speicher / Netz) --- */

    .pills {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 6px;
      flex-shrink: 0;
    }

    .hpill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 2px 8px;
      border-radius: 10px;
      background: rgba(127, 127, 127, 0.12);
      font-size: 11px;
      line-height: 1;
      white-space: nowrap;
    }

    .hpill-label {
      color: var(--secondary-text-color);
    }

    .hpill-value {
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
    }

    .hpill.zero .hpill-value {
      color: var(--secondary-text-color);
    }

    /* --- power row --- */

    .power-row {
      display: flex;
      align-items: baseline;
      gap: 12px;
      margin-top: 10px;
      flex: 0 0 auto;
    }

    .load {
      display: flex;
      align-items: baseline;
      gap: 8px;
      min-width: 0;
    }

    .load-value {
      font-size: 24px;
      line-height: 1.15;
      color: var(--primary-text-color);
      white-space: nowrap;
    }

    .load-label {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }

    /* --- mix bar --- */

    .mix {
      display: flex;
      height: 8px;
      margin-top: 12px;
      border-radius: 4px;
      overflow: hidden;
      background: var(--divider-color, rgba(127, 127, 127, 0.22));
      flex: 0 0 auto;
    }

    .mix-seg {
      height: 100%;
      transition: width 0.25s ease-out;
    }

    .mix-seg.solar,
    .swatch.solar {
      background: var(--des-production-color, #2e7d32);
    }

    /* Blue = the storage card's "charging" colour: heating/charging fills a store. */
    .mix-seg.storage,
    .swatch.storage {
      background: #378add;
    }

    .mix-seg.grid,
    .swatch.grid {
      background: #e24b4a;
    }

    .swatch {
      width: 8px;
      height: 8px;
      border-radius: 2px;
      flex-shrink: 0;
    }

    .swatch.zero {
      background: var(--secondary-text-color);
      opacity: 0.5;
    }

    /* --- chart section --- */

    .chart-head {
      display: flex;
      justify-content: flex-end;
      margin-top: 12px;
      flex: 0 0 auto;
    }

    .chart-meta {
      margin-top: 4px;
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      flex: 0 0 auto;
    }

    /* Takes whatever height is left; the height is a start size flex overrides.
       overflow:hidden keeps a chart that briefly overshoots from scrolling. */
    .chart {
      flex: 1 1 auto;
      min-height: 0;
      height: 180px;
      position: relative;
      margin-top: 6px;
      overflow: hidden;
    }

    /* Strip the embedded apexcharts-card frame so it sits flush inside ours. */
    .chart .embedded {
      position: absolute;
      inset: 0;
      display: block;
      margin: 0;
      --ha-card-background: transparent;
      --ha-card-border-width: 0;
      --ha-card-box-shadow: none;
    }

    .hint {
      margin-top: 10px;
      font-size: 12px;
      color: var(--secondary-text-color);
      opacity: 0.85;
    }

    /* --- expanded "Heute" block --- */

    .today {
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      gap: 4px 12px;
      font-size: 12px;
    }

    .today-label {
      color: var(--secondary-text-color);
    }

    .today-value {
      text-align: right;
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    .today-value.draw {
      color: var(--error-color, #d32f2f);
    }

    .today-value.feed {
      color: var(--des-export-color, #2e7d32);
    }
  `,
  ];
}

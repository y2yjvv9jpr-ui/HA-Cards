import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { renderSegmented, segmentedStyles } from './segmented';
import type {
  DesChartCardConfig,
  HomeAssistant,
  StatsPeriod,
} from './types';

const PERIOD_ORDER: ReadonlyArray<StatsPeriod> = ['day', 'week', 'month', 'year'];
const PERIOD_SET: ReadonlySet<StatsPeriod> = new Set(PERIOD_ORDER);
const DEFAULT_LABEL: Record<StatsPeriod, string> = {
  day: 'Tag',
  week: 'Woche',
  month: 'Monat',
  year: 'Jahr',
};

/** Grid size in a HA sections view (column_span 3 → 36 columns): two thirds wide. */
const GRID_ROWS = 4;
const GRID_MIN_ROWS = 3;
const GRID_COLUMNS = 24;

/**
 * Chart height in a view that imposes none - a classic (masonry) view. It is
 * the container's CSS `height`, which flex overrides wherever the card *is*
 * given a height, so no code has to tell the two cases apart.
 */
const FALLBACK_CHART_HEIGHT = 220;

/** Ignore sub-pixel jitter, so measuring can never chase its own writes. */
const HEIGHT_EPSILON_PX = 2;

/** The embedded card element accepts a `hass` assignment; that is all we need. */
interface EmbeddedCard extends HTMLElement {
  hass?: HomeAssistant;
}

/**
 * The ApexCharts instance the embedded card keeps. Only `updateOptions` is
 * used, and the lookup below verifies it before calling - resizing through the
 * live instance avoids tearing the chart down and refetching its history on
 * every grid resize.
 */
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

export class DesChartCard extends LitElement {
  static override properties = {
    hass: { attribute: false },
    _config: { state: true },
    _period: { state: true },
  };

  declare hass?: HomeAssistant;
  declare _config?: DesChartCardConfig;
  /** The user's period pick, or `null` to follow `default_period`. */
  declare _period: StatsPeriod | null;

  /** The embedded apexcharts-card element and which period it belongs to. */
  private _chartEl?: EmbeddedCard;
  private _chartPeriod?: StatsPeriod;
  /** Bumped on every (re)mount/teardown so a stale async mount can bail out. */
  private _mountToken = 0;
  private _helpersPromise?: Promise<CardHelpers | null>;
  private _awaitingApex = false;
  /** Last height handed to the chart, so a resize that changes nothing is free. */
  private _chartHeight?: number;
  private _resizeObserver?: ResizeObserver;
  /** The element the observer is currently watching. */
  private _observedChart?: HTMLElement;

  constructor() {
    super();
    this._period = null;
  }

  setConfig(config: DesChartCardConfig): void {
    if (!config) {
      throw new Error('des-chart-card: Konfiguration fehlt');
    }
    if (!config.name) {
      throw new Error('des-chart-card: "name" ist erforderlich');
    }
    if (config.default_period && !PERIOD_SET.has(config.default_period)) {
      throw new Error(
        'des-chart-card: "default_period" muss "day", "week", "month" oder "year" sein',
      );
    }
    if (config.periods !== undefined &&
      (typeof config.periods !== 'object' || config.periods === null)) {
      throw new Error('des-chart-card: "periods" muss ein Objekt sein');
    }
    this._config = config;
    this._period = null;
    // A changed config can drop the mounted chart's period; rebuild on update.
    this._teardownChart();
  }

  getCardSize(): number {
    return GRID_ROWS;
  }

  /** HA sections view: two thirds wide; the chart grows into the given rows. */
  getGridOptions(): { columns: number; rows: number; min_rows: number } {
    return { columns: GRID_COLUMNS, rows: GRID_ROWS, min_rows: GRID_MIN_ROWS };
  }

  static getStubConfig(): DesChartCardConfig {
    return { type: 'custom:des-chart-card', name: 'Chart', default_period: 'day' };
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
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

  /**
   * Watches the chart container, not ha-card or the window: the container is
   * what flex sizes from the grid, and a sections grid can resize it without
   * the window ever changing.
   */
  private _observeChartSize(container: HTMLElement | null): void {
    if (typeof ResizeObserver === 'undefined') return;
    if (this._observedChart === (container ?? undefined)) return;

    this._resizeObserver?.disconnect();
    this._observedChart = container ?? undefined;
    if (!container) return;

    this._resizeObserver ??= new ResizeObserver(() => this._applyChartHeight());
    this._resizeObserver.observe(container);
  }

  // =========================================================================
  // period model
  // =========================================================================

  private _apexAvailable(): boolean {
    return customElements.get('apexcharts-card') !== undefined;
  }

  private _chartConfig(period: StatsPeriod): Record<string, unknown> | null {
    const chart = this._config?.periods?.[period]?.chart;
    return chart && typeof chart === 'object' ? chart : null;
  }

  private _label(period: StatsPeriod): string {
    const label = this._config?.periods?.[period]?.label;
    return typeof label === 'string' && label.trim().length > 0
      ? label
      : DEFAULT_LABEL[period];
  }

  /** Periods that carry a chart; empty means "demo" (no periods configured). */
  private _realPeriods(): StatsPeriod[] {
    return PERIOD_ORDER.filter((p) => this._chartConfig(p) !== null);
  }

  private get _isDemo(): boolean {
    return this._realPeriods().length === 0;
  }

  private _available(): StatsPeriod[] {
    const real = this._realPeriods();
    return real.length > 0 ? real : [...PERIOD_ORDER];
  }

  /** The user's pick if still available, else `default_period`, else the first. */
  private _effectivePeriod(available: StatsPeriod[]): StatsPeriod {
    if (this._period && available.includes(this._period)) return this._period;
    const preferred = this._config?.default_period;
    if (preferred && available.includes(preferred)) return preferred;
    return available[0];
  }

  // =========================================================================
  // render
  // =========================================================================

  override render(): TemplateResult | typeof nothing {
    const config = this._config;
    if (!config) return nothing;

    const available = this._available();
    const period = this._effectivePeriod(available);
    const meta = this._isDemo ? null : this._config?.periods?.[period]?.meta;

    return html`
      <ha-card>
        <div class="card">
          <div class="header">
            <span class="name">${config.name}</span>
            ${renderSegmented(
              available.map((p) => ({ value: p, label: this._label(p) })),
              period,
              (value) => this._setPeriod(value),
              'Zeitraum',
            )}
          </div>
          ${meta ? html`<div class="meta">${meta}</div>` : nothing}
          ${this._renderChartArea(period)}
        </div>
      </ha-card>
    `;
  }

  private _renderChartArea(period: StatsPeriod): TemplateResult {
    if (this._isDemo || this._chartConfig(period) === null) {
      return html`<div class="hint">Keine Chart-Config</div>`;
    }
    if (!this._apexAvailable()) {
      return html`<div class="hint">apexcharts-card nicht installiert</div>`;
    }
    // Populated imperatively in `updated()` via the HA card helpers.
    return html`<div class="chart" id="chart"></div>`;
  }

  private _setPeriod(period: StatsPeriod): void {
    this._period = period;
  }

  // =========================================================================
  // embedded chart lifecycle
  // =========================================================================

  protected override updated(): void {
    const container = this.renderRoot?.querySelector('#chart') as HTMLElement | null;
    this._observeChartSize(container);
    this._applyChartHeight();
    this._syncChart();
  }

  /**
   * Takes the height flex handed the container and passes it to the chart.
   *
   * The container is never sized from here. It is a flex child with
   * `min-height: 0`, so the grid's height wins over the content; measuring it
   * and then writing to it would be measuring our own output.
   */
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

  /** Resizes the mounted chart in place instead of rebuilding it. */
  private _resizeApex(height: number): void {
    const instance = this._apexInstance();
    if (!instance) return;
    try {
      void instance.updateOptions({ chart: { height } }, false, false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('des-chart-card: Chart-Höhe konnte nicht gesetzt werden', error);
    }
  }

  /**
   * The ApexCharts instance inside the embedded card. Private API of a foreign
   * card, so every candidate is checked for `updateOptions` before use; without
   * it the card still works, the chart just keeps the height it was built with
   * until the next remount.
   */
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
    const period = this._effectivePeriod(this._available());
    const cfg = this._isDemo ? null : this._chartConfig(period);
    const container = this.renderRoot?.querySelector('#chart') as HTMLElement | null;

    if (!cfg || !this._apexAvailable() || !container) {
      this._teardownChart();
      return;
    }

    // Same period: keep the element, just push the latest hass through.
    if (this._chartEl && this._chartPeriod === period) {
      if (!this._chartEl.isConnected) container.replaceChildren(this._chartEl);
      this._chartEl.hass = this.hass;
      return;
    }

    void this._mountChart(container, cfg, period);
  }

  private async _mountChart(
    container: HTMLElement,
    cfg: Record<string, unknown>,
    period: StatsPeriod,
  ): Promise<void> {
    const token = ++this._mountToken;
    this._removeChartEl();

    const helpers = await this._getHelpers();
    if (!helpers || token !== this._mountToken) return;

    let element: EmbeddedCard;
    try {
      element = helpers.createCardElement(this._embedConfig(cfg));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('des-chart-card: Chart konnte nicht erzeugt werden', error);
      return;
    }
    if (token !== this._mountToken) return;

    element.classList.add('embedded');
    element.hass = this.hass;
    container.replaceChildren(element);
    this._chartEl = element;
    this._chartPeriod = period;
  }

  /**
   * Adds the card type, forces the embedded card's own header off, and sets the
   * chart height. A height from the user's `apex_config` is deliberately
   * overwritten - the card's job here is to fill the space it was given.
   */
  private _embedConfig(cfg: Record<string, unknown>): Record<string, unknown> {
    const header =
      cfg.header && typeof cfg.header === 'object'
        ? (cfg.header as Record<string, unknown>)
        : {};
    const apex =
      cfg.apex_config && typeof cfg.apex_config === 'object'
        ? (cfg.apex_config as Record<string, unknown>)
        : {};
    const apexChart =
      apex.chart && typeof apex.chart === 'object'
        ? (apex.chart as Record<string, unknown>)
        : {};

    return {
      ...cfg,
      type: 'custom:apexcharts-card',
      header: { ...header, show: false },
      apex_config: {
        ...apex,
        chart: {
          ...apexChart,
          height: this._chartHeight ?? FALLBACK_CHART_HEIGHT,
        },
      },
    };
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

  static override styles = [
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
        /* Caps the card at the height the grid gave it - without this the
           chart pushes the card open instead of fitting into it. */
        overflow: hidden;
        background: var(--card-background-color, var(--ha-card-background, #fff));
        color: var(--primary-text-color);
      }

      /* min-height:0 on every flex level, otherwise the default
         min-height:auto stops these boxes shrinking below their content and
         the grid height is ignored. */
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
        flex: 0 0 auto;
        margin-top: 4px;
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* Takes whatever height is left. The height below is only a start size:
         in a view that imposes a height, flex grows or shrinks the container
         from it; in a classic view nothing does, so it stays 220px. That is
         what makes the fallback work without any code branching on view type.
         overflow:hidden keeps a chart that briefly overshoots - the legend,
         mostly - from producing a scrollbar. */
      .chart {
        flex: 1 1 auto;
        min-height: 0;
        height: 220px;
        position: relative;
        margin-top: 8px;
        overflow: hidden;
      }

      /* The embedded apexcharts-card renders its own ha-card; strip its frame
         so the chart sits flush inside ours. Custom properties pierce the
         embedded shadow root, so setting them here is enough.
         Absolutely positioned on purpose: out of flow, it cannot add its own
         height back into the measurement the height is derived from. */
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
    `,
  ];
}

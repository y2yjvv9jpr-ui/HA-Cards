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

/** Grid size in a HA sections view (12-column grid): two thirds wide, taller. */
const GRID_ROWS = 6;
const GRID_COLUMNS = 8;

/** The embedded card element accepts a `hass` assignment; that is all we need. */
interface EmbeddedCard extends HTMLElement {
  hass?: HomeAssistant;
}

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

  /** HA sections view: two thirds of the section wide, fixed height. */
  getGridOptions(): { columns: number; rows: number; min_rows: number } {
    return { columns: GRID_COLUMNS, rows: GRID_ROWS, min_rows: GRID_ROWS };
  }

  static getStubConfig(): DesChartCardConfig {
    return { type: 'custom:des-chart-card', name: 'Chart', default_period: 'day' };
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._teardownChart();
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
    this._syncChart();
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

  /** Adds the card type and forces the embedded card's own header off. */
  private _embedConfig(cfg: Record<string, unknown>): Record<string, unknown> {
    const header =
      cfg.header && typeof cfg.header === 'object'
        ? (cfg.header as Record<string, unknown>)
        : {};
    return {
      ...cfg,
      type: 'custom:apexcharts-card',
      header: { ...header, show: false },
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
        background: var(--card-background-color, var(--ha-card-background, #fff));
        color: var(--primary-text-color);
      }

      .card {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 12px 16px;
      }

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

      .chart {
        margin-top: 8px;
      }

      /* The embedded apexcharts-card renders its own ha-card; strip its frame
         so the chart sits flush inside ours. Custom properties pierce the
         embedded shadow root, so setting them here is enough. */
      .chart .embedded {
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

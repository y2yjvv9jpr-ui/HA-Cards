import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { formatFixed, formatInt, clamp } from './format';
import { entityUnit, isEntityId, resolveNumber } from './resolve';
import { chevronStyles } from './chevron';
import type {
  DesHouseCardConfig,
  HomeAssistant,
  HouseDemoState,
} from './types';

const DEMO_STATES: ReadonlySet<HouseDemoState> = new Set([
  'normal',
  'night',
  'export',
]);

/** How a resolved entity value is rescaled onto the unit the card expects. */
type Scale = 'power' | 'energy' | 'plain';

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
  /** Grid power after `invert_grid`; null when unreadable (pill shows "Netz 0 W"). */
  gridIn: number;
  gridOut: number;
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
  };

  declare hass?: HomeAssistant;
  declare _config?: DesHouseCardConfig;
  declare _expanded: boolean;

  constructor() {
    super();
    this._expanded = false;
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
  }

  getCardSize(): number {
    // header + power + mix bar + three legend rows ≈ 4; expanded adds the rows.
    const view = this._config ? this._view() : null;
    let rows = 4;
    if (this._expanded && view) {
      rows += [view.todayConsumption, view.todayImport, view.todayExport].filter(
        (v) => v !== null,
      ).length;
    }
    return rows;
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
      present(c.autarky_entity)
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
      gridIn,
      gridOut,
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
  // render
  // =========================================================================

  override render(): TemplateResult | typeof nothing {
    const config = this._config;
    if (!config) return nothing;

    const view = this._view();

    return html`
      <ha-card>
        <div class="card">
          ${this._renderCollapsed(config, view)}
          ${this._expanded && view.hasToday ? this._renderExpanded(view) : nothing}
        </div>
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
        ${this._renderPill(view)}
      </div>

      ${this._renderPowerRow(view)}
      ${this._renderMixBar(view)}
      ${this._renderLegend(view)}

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

  /** feed-in (green) beats draw (red) beats an idle "Netz 0 W" (muted). */
  private _renderPill(view: HouseView): TemplateResult {
    const [text, modifier] =
      view.gridOut > 0
        ? [`Einspeisung ${formatInt(view.gridOut)} W`, 'pill-feed']
        : view.gridIn > 0
          ? [`Netzbezug ${formatInt(view.gridIn)} W`, 'pill-draw']
          : ['Netz 0 W', 'pill-idle'];

    return html`<span class="pill ${modifier}">
      <span class="pill-label">${text}</span>
    </span>`;
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

  private _renderLegend(view: HouseView): TemplateResult {
    const rows: Array<{
      cls: string;
      label: string;
      power: number;
      pct: number;
    }> = [
      { cls: 'solar', label: 'Solar', power: view.solarShare, pct: view.solarPct },
      {
        cls: 'storage',
        label: 'Speicher',
        power: view.storageShare,
        pct: view.storagePct,
      },
      { cls: 'grid', label: 'Netz', power: view.gridShare, pct: view.gridPct },
    ];

    return html`
      <div class="legend">
        ${rows.map(
          (row) => html`
            <div class="legend-row">
              <span class="swatch ${row.cls}"></span>
              <span class="legend-label">${row.label}</span>
              <span class="legend-power">${formatInt(row.power)} W</span>
              <span class="legend-pct">${formatInt(row.pct)} %</span>
            </div>
          `,
        )}
      </div>
    `;
  }

  // --- expanded ------------------------------------------------------------

  private _renderExpanded(view: HouseView): TemplateResult {
    return html`
      <div class="details">
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
  }

  private _onKeydown(ev: KeyboardEvent): void {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this._toggleExpanded();
    }
  }

  static override styles = [
    chevronStyles,
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

    /* --- header --- */

    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
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

    /* --- status pill (shared look with the other cards' badges) --- */

    .pill {
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
      flex-shrink: 0;
      background: rgba(127, 127, 127, 0.15);
      color: var(--secondary-text-color);
    }

    .pill-label {
      display: block;
      transform: translateY(1px);
    }

    .pill-feed {
      background: rgba(46, 125, 50, 0.16);
      background: color-mix(in srgb, var(--success-color, #2e7d32) 16%, transparent);
      color: var(--success-color, #2e7d32);
    }

    .pill-draw {
      background: rgba(211, 47, 47, 0.16);
      background: color-mix(in srgb, var(--error-color, #d32f2f) 16%, transparent);
      color: var(--error-color, #d32f2f);
    }

    .pill-idle {
      background: rgba(127, 127, 127, 0.16);
      background: color-mix(
        in srgb,
        var(--secondary-text-color, #727272) 16%,
        transparent
      );
      color: var(--secondary-text-color);
    }

    /* --- power row --- */

    .power-row {
      display: flex;
      align-items: baseline;
      gap: 12px;
      margin-top: 10px;
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
    }

    .mix-seg {
      height: 100%;
      transition: width 0.25s ease-out;
    }

    .mix-seg.solar,
    .swatch.solar {
      background: var(--success-color, #2e7d32);
    }

    /* Blue = the storage card's "charging" colour: heating/charging fills a store. */
    .mix-seg.storage,
    .swatch.storage {
      background: var(--info-color, #2196f3);
    }

    .mix-seg.grid,
    .swatch.grid {
      background: var(--error-color, #d32f2f);
    }

    /* --- legend --- */

    .legend {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .legend-row {
      display: grid;
      grid-template-columns: 8px 1fr auto auto;
      align-items: center;
      gap: 8px;
      font-size: 12px;
    }

    .swatch {
      width: 8px;
      height: 8px;
      border-radius: 2px;
    }

    .legend-label {
      color: var(--secondary-text-color);
    }

    .legend-power {
      text-align: right;
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    .legend-pct {
      text-align: right;
      min-width: 38px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    /* --- chevron --- */

    .chevron-row {
      display: flex;
      justify-content: center;
      margin-top: 8px;
    }

    .chevron-row.clickable {
      cursor: pointer;
      outline: none;
    }

    /* A mouse click must not leave the ring standing; keyboard focus keeps it. */
    .chevron-row.clickable:focus {
      outline: none;
    }

    .chevron-row.clickable:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
      border-radius: 6px;
    }

    /* --- expanded "Heute" block --- */

    .details {
      margin-top: 8px;
      padding-top: 10px;
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.22));
    }

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
      color: var(--success-color, #2e7d32);
    }
  `,
  ];
}

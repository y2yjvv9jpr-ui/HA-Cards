import { LitElement, html, css, nothing, svg, type TemplateResult } from 'lit';
import {
  formatDecimal,
  formatFixed,
  formatInt,
  formatSignedMinus,
  clamp,
} from './format';
import { entityUnit, isEntityId, resolveNumber, resolveText } from './resolve';
import { chevronStyles } from './chevron';
import type {
  DesInverterCardConfig,
  HomeAssistant,
  InverterData,
  InverterDemoState,
} from './types';

const DEMO_STATES: ReadonlySet<InverterDemoState> = new Set([
  'normal',
  'alarm',
  'night',
]);

const DEFAULT_KWP_TOTAL = 12.5;
const DEFAULT_KWP_PV1 = 6.5;
const DEFAULT_KWP_PV2 = 6.0;
const DEFAULT_IMBALANCE_RATIO = 0.5;
const DEFAULT_IMBALANCE_MIN_W = 500;

/** Grid size in a HA sections view (12-column grid): a third wide. */
const GRID_ROWS = 4;
const GRID_COLUMNS = 4;

const PHASE_LABELS = ['L1', 'L2', 'L3'] as const;

/** How a resolved entity value is rescaled onto the unit the card expects. */
type Scale = 'power' | 'energy' | 'plain';

/**
 * Phase 1 has no entity binding: the entire readout is one of these canned
 * datasets, picked with `demo_state`, so every visual state (producing, alarm,
 * night) can be exercised straight from YAML. Phase 2 keeps them as the
 * fallback whenever no `*_entity` field is configured.
 */
const DEMO_DATA: Record<InverterDemoState, InverterData> = {
  normal: {
    model: 'Growatt MOD 10KTL3-X',
    todayProduction: 24.6,
    totalProduction: 18432,
    fault: 'OK',
    alarm: 'OK',
    deviceState: 'Netzbetrieb',
    pvPower: 7850,
    inverterTemp: 42.5,
    dcTemp: 38.2,
    gridFrequency: 50.01,
    strings: [
      { power: 4200, voltage: 615.3, current: 6.8 },
      { power: 3650, voltage: 598.1, current: 6.1 },
    ],
    phases: [
      { grid: -2300, inverter: 2600, voltage: 232.1 },
      { grid: -2450, inverter: 2620, voltage: 231.5 },
      { grid: -2100, inverter: 2630, voltage: 233.0 },
    ],
  },
  // Grid-overvoltage alarm, and PV2 badly under PV1 so the imbalance bar shows.
  alarm: {
    model: 'Growatt MOD 10KTL3-X',
    todayProduction: 12.3,
    totalProduction: 18420,
    fault: 'OK',
    alarm: 'Grid overvoltage',
    deviceState: 'Netzbetrieb',
    pvPower: 4500,
    inverterTemp: 40.1,
    dcTemp: 41.5,
    gridFrequency: 50.09,
    strings: [
      { power: 3300, voltage: 610.2, current: 5.4 },
      { power: 1200, voltage: 585.0, current: 2.05 },
    ],
    phases: [
      { grid: -1000, inverter: 1520, voltage: 253.2 },
      { grid: -1100, inverter: 1500, voltage: 251.8 },
      { grid: -900, inverter: 1480, voltage: 252.5 },
    ],
  },
  // Everything at rest: no PV power, inverter in standby, grid idle.
  night: {
    model: 'Growatt MOD 10KTL3-X',
    todayProduction: 24.6,
    totalProduction: 18432,
    fault: 'OK',
    alarm: 'OK',
    deviceState: 'Standby',
    pvPower: 0,
    inverterTemp: 27.3,
    dcTemp: 26.5,
    gridFrequency: 49.99,
    strings: [
      { power: 0, voltage: 0, current: 0 },
      { power: 0, voltage: 0, current: 0 },
    ],
    phases: [
      { grid: 0, inverter: 0, voltage: 231.4 },
      { grid: 0, inverter: 0, voltage: 230.9 },
      { grid: 0, inverter: 0, voltage: 232.2 },
    ],
  },
};

// --- resolved view model ---------------------------------------------------
//
// The render layer draws from this shape whether the values came from the demo
// dataset or from `hass.states`. In entity mode a field the card could not read
// is `null` and shows a muted "–"; in demo mode nothing is ever null, so the
// output stays pixel-identical to Phase 1.

interface StringView {
  power: number | null;
  voltage: number | null;
  current: number | null;
}

interface PhaseView {
  grid: number | null;
  inverter: number | null;
  voltage: number | null;
}

interface InverterView {
  model: string;
  todayProduction: number | null;
  totalProduction: number | null;
  fault: string | null;
  alarm: string | null;
  deviceState: string;
  pvPower: number | null;
  inverterTemp: number | null;
  dcTemp: number | null;
  gridFrequency: number | null;
  strings: [StringView, StringView];
  phases: [PhaseView, PhaseView, PhaseView];
  imbalance: [boolean, boolean];
  /** Which optional blocks have at least one configured field. */
  showStrings: boolean;
  showPhases: boolean;
  showDcItem: boolean;
  showFreqItem: boolean;
}

/** True for a config slot that actually names an entity/value. */
function present(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

function nonEmptyArray(value: unknown): boolean {
  return Array.isArray(value) && value.some(present);
}

function sumNonNull(values: ReadonlyArray<number | null>): number | null {
  const usable = values.filter((v): v is number => v !== null);
  return usable.length > 0 ? usable.reduce((a, b) => a + b, 0) : null;
}

export class DesInverterCard extends LitElement {
  static override properties = {
    // Assigning `hass` is a reactive property write, so Home Assistant's state
    // updates re-render the card (same mechanism as the storage card).
    hass: { attribute: false },
    _config: { state: true },
    _expanded: { state: true },
  };

  declare hass?: HomeAssistant;
  declare _config?: DesInverterCardConfig;
  declare _expanded: boolean;

  constructor() {
    super();
    this._expanded = false;
  }

  setConfig(config: DesInverterCardConfig): void {
    if (!config) {
      throw new Error('des-inverter-card: Konfiguration fehlt');
    }
    if (!config.name) {
      throw new Error('des-inverter-card: "name" ist erforderlich');
    }
    if (config.demo_state && !DEMO_STATES.has(config.demo_state)) {
      throw new Error(
        'des-inverter-card: "demo_state" muss "normal", "alarm" oder "night" sein',
      );
    }
    this._config = config;
    this._expanded = false;
  }

  getCardSize(): number {
    const blocks = this._blocks();
    let rows = 2; // header + power row
    if (blocks.strings) rows += 1; // string bars
    if (this._expanded) {
      if (blocks.strings) rows += 1;
      if (blocks.phases) rows += 2;
      if (blocks.dc || blocks.freq) rows += 1;
    }
    return rows;
  }

  /** HA sections view: a third of the section, fixed height. */
  getGridOptions(): { columns: number; rows: number; min_rows: number } {
    return { columns: GRID_COLUMNS, rows: GRID_ROWS, min_rows: GRID_ROWS };
  }

  static getStubConfig(): DesInverterCardConfig {
    // No entities, so the picker preview shows the populated demo readout.
    return {
      type: 'custom:des-inverter-card',
      name: 'Wechselrichter',
      demo_state: 'normal',
      kwp_total: 12.5,
      kwp_pv1: 6.5,
      kwp_pv2: 6.0,
    };
  }

  // =========================================================================
  // mode + config-derived scalars
  // =========================================================================

  /** Any configured `*_entity` field switches the card from demo to reading. */
  private get _entityMode(): boolean {
    const c = this._config;
    if (!c) return false;
    return (
      present(c.pv_power_entity) ||
      present(c.today_production_entity) ||
      present(c.total_production_entity) ||
      present(c.fault_entity) ||
      present(c.alarm_entity) ||
      present(c.device_state_entity) ||
      present(c.inverter_temp_entity) ||
      present(c.dc_temp_entity) ||
      present(c.grid_frequency_entity) ||
      present(c.pv1_power_entity) ||
      present(c.pv1_voltage_entity) ||
      present(c.pv1_current_entity) ||
      present(c.pv2_power_entity) ||
      present(c.pv2_voltage_entity) ||
      present(c.pv2_current_entity) ||
      nonEmptyArray(c.grid_power_entities) ||
      nonEmptyArray(c.inverter_power_entities) ||
      nonEmptyArray(c.grid_voltage_entities)
    );
  }

  /** Which optional blocks are present, from config alone (no hass needed). */
  private _blocks(): {
    strings: boolean;
    phases: boolean;
    dc: boolean;
    freq: boolean;
  } {
    const c = this._config;
    if (!c || !this._entityMode) {
      // Demo mode shows every block (DC item still honours show_dc_temp).
      return {
        strings: true,
        phases: true,
        dc: c?.show_dc_temp !== false,
        freq: true,
      };
    }
    return {
      strings:
        present(c.pv1_power_entity) ||
        present(c.pv1_voltage_entity) ||
        present(c.pv1_current_entity) ||
        present(c.pv2_power_entity) ||
        present(c.pv2_voltage_entity) ||
        present(c.pv2_current_entity),
      phases:
        nonEmptyArray(c.grid_power_entities) ||
        nonEmptyArray(c.inverter_power_entities) ||
        nonEmptyArray(c.grid_voltage_entities),
      dc: c.show_dc_temp !== false && present(c.dc_temp_entity),
      freq: present(c.grid_frequency_entity),
    };
  }

  private get _kwpTotal(): number {
    return this._config?.kwp_total ?? DEFAULT_KWP_TOTAL;
  }

  private get _kwpString(): [number, number] {
    return [
      this._config?.kwp_pv1 ?? DEFAULT_KWP_PV1,
      this._config?.kwp_pv2 ?? DEFAULT_KWP_PV2,
    ];
  }

  // =========================================================================
  // resolution: entities → view model
  // =========================================================================

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

  /** A configured entity's text, or null when unset/unavailable. */
  private _text(entity: string | undefined): string | null {
    if (!present(entity)) return null;
    const resolved = resolveText(entity, this.hass);
    return resolved.kind === 'value' ? resolved.value : null;
  }

  private _view(): InverterView {
    return this._entityMode ? this._entityView() : this._demoView();
  }

  /** Wraps the static demo dataset in the (non-null) view shape. */
  private _demoView(): InverterView {
    const config = this._config!;
    const data = DEMO_DATA[config.demo_state ?? 'normal'];
    return {
      model: config.model ?? data.model,
      todayProduction: data.todayProduction,
      totalProduction: data.totalProduction,
      fault: data.fault,
      alarm: data.alarm,
      deviceState: data.deviceState,
      pvPower: data.pvPower,
      inverterTemp: data.inverterTemp,
      dcTemp: data.dcTemp,
      gridFrequency: data.gridFrequency,
      strings: [data.strings[0], data.strings[1]],
      phases: [data.phases[0], data.phases[1], data.phases[2]],
      imbalance: this._imbalance(data.strings[0].power, data.strings[1].power),
      showStrings: true,
      showPhases: true,
      showDcItem: config.show_dc_temp !== false,
      showFreqItem: true,
    };
  }

  private _entityView(): InverterView {
    const c = this._config!;

    const pv1Power = this._num(c.pv1_power_entity, 'power');
    const pv2Power = this._num(c.pv2_power_entity, 'power');

    // Total PV power: the dedicated entity, else the sum of the strings.
    let pvPower: number | null;
    if (present(c.pv_power_entity)) {
      pvPower = this._num(c.pv_power_entity, 'power');
    } else {
      pvPower = sumNonNull([pv1Power, pv2Power]);
    }

    const strings: [StringView, StringView] = [
      {
        power: pv1Power,
        voltage: this._num(c.pv1_voltage_entity, 'plain'),
        current: this._num(c.pv1_current_entity, 'plain'),
      },
      {
        power: pv2Power,
        voltage: this._num(c.pv2_voltage_entity, 'plain'),
        current: this._num(c.pv2_current_entity, 'plain'),
      },
    ];

    const phase = (i: number): PhaseView => ({
      grid: this._num(c.grid_power_entities?.[i], 'power'),
      inverter: this._num(c.inverter_power_entities?.[i], 'power'),
      voltage: this._num(c.grid_voltage_entities?.[i], 'plain'),
    });

    const blocks = this._blocks();

    return {
      model: c.model ?? '',
      todayProduction: this._num(c.today_production_entity, 'energy'),
      totalProduction: this._num(c.total_production_entity, 'energy'),
      fault: this._text(c.fault_entity),
      alarm: this._text(c.alarm_entity),
      deviceState: this._text(c.device_state_entity) ?? 'Normal',
      pvPower,
      inverterTemp: this._num(c.inverter_temp_entity, 'plain'),
      dcTemp: this._num(c.dc_temp_entity, 'plain'),
      gridFrequency: this._num(c.grid_frequency_entity, 'plain'),
      strings,
      phases: [phase(0), phase(1), phase(2)],
      imbalance: this._imbalance(pv1Power, pv2Power),
      showStrings: blocks.strings,
      showPhases: blocks.phases,
      showDcItem: blocks.dc,
      showFreqItem: blocks.freq,
    };
  }

  /** Per-string amber flags; skipped when a power is missing (would be NaN). */
  private _imbalance(
    p0: number | null,
    p1: number | null,
  ): [boolean, boolean] {
    const config = this._config;
    if (config?.imbalance_warn === false) return [false, false];
    if (p0 === null || p1 === null) return [false, false];

    const ratio = config?.imbalance_ratio ?? DEFAULT_IMBALANCE_RATIO;
    const minW = config?.imbalance_min_w ?? DEFAULT_IMBALANCE_MIN_W;
    const lags = (self: number, other: number): boolean =>
      self < ratio * other && other > minW;
    return [lags(p0, p1), lags(p1, p0)];
  }

  // =========================================================================
  // render
  // =========================================================================

  override render(): TemplateResult | typeof nothing {
    const config = this._config;
    if (!config) return nothing;

    const view = this._view();
    const hasDetails = view.showStrings || view.showPhases || this._hasFooter(view);

    return html`
      <ha-card>
        <div class="card">
          ${this._renderCollapsed(view, hasDetails)}
          ${this._expanded && hasDetails ? this._renderExpanded(view) : nothing}
        </div>
      </ha-card>
    `;
  }

  private _hasFooter(view: InverterView): boolean {
    return view.showDcItem || view.showFreqItem;
  }

  // --- collapsed (always visible) ------------------------------------------

  private _renderCollapsed(view: InverterView, hasDetails: boolean): TemplateResult {
    const config = this._config!;

    return html`
      <div class="header">
        <div class="head-left">
          <span class="name">${config.name}</span>
          <span class="meta">${this._renderMeta(view)}</span>
        </div>
        ${this._renderPill(view)}
      </div>

      ${this._renderPowerRow(view)}
      ${view.showStrings ? this._renderStringBars(view) : nothing}

      ${hasDetails
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

  /** "{model} · {today} kWh heute · {total} kWh gesamt"; model dropped if empty. */
  private _renderMeta(view: InverterView): TemplateResult {
    const parts: Array<TemplateResult> = [];
    if (view.model) parts.push(html`${view.model}`);
    parts.push(html`${this._unit(view.todayProduction, formatFixed, 'kWh')} heute`);
    parts.push(
      html`${this._unit(view.totalProduction, formatInt, 'kWh')} gesamt`,
    );
    return html`${parts.map((part, i) => (i === 0 ? part : html` · ${part}`))}`;
  }

  /** fault beats alarm beats device state; "OK"/absent means no fault. */
  private _renderPill(view: InverterView): TemplateResult {
    const raised = (value: string | null): string | null => {
      if (value === null) return null;
      const text = value.trim();
      return text.length > 0 && text.toLowerCase() !== 'ok' ? text : null;
    };

    const fault = raised(view.fault);
    const alarm = raised(view.alarm);

    const [text, modifier] = fault
      ? [`Fault: ${fault}`, 'pill-fault']
      : alarm
        ? [`Alarm: ${alarm}`, 'pill-alarm']
        : [view.deviceState, 'pill-ok'];

    return html`<span class="pill ${modifier}">
      <span class="pill-label">${text}</span>
    </span>`;
  }

  private _renderPowerRow(view: InverterView): TemplateResult {
    const producing = view.pvPower !== null && view.pvPower > 0;
    const kwpTotal = this._kwpTotal;
    const share =
      view.pvPower !== null && kwpTotal > 0
        ? clamp((view.pvPower / (kwpTotal * 1000)) * 100, 0, 999)
        : null;

    return html`
      <div class="power-row">
        <div class="pv">
          <span class="pv-value ${producing ? 'producing' : 'idle'}">
            ${this._unit(view.pvPower, formatInt, 'W')}
          </span>
          ${share === null
            ? nothing
            : html`<span class="pv-share">
                ${formatInt(share)} % von ${formatDecimal(kwpTotal)} kWp
              </span>`}
        </div>
        <div class="temp">
          ${this._thermometer()}
          ${this._unit(view.inverterTemp, formatFixed, '°C')}
        </div>
      </div>
    `;
  }

  private _renderStringBars(view: InverterView): TemplateResult {
    const kwp = this._kwpString;

    return html`
      <div class="strings">
        ${view.strings.map((s, i) => {
          const full = (kwp[i] ?? 0) * 1000;
          const pct =
            s.power !== null && full > 0
              ? clamp((s.power / full) * 100, 0, 100)
              : 0;
          const warn = view.imbalance[i];
          return html`
            <div class="string-row">
              <span class="string-label">PV${i + 1}</span>
              <div class="bar">
                <div
                  class="bar-fill ${warn ? 'warn' : ''}"
                  style="width: ${pct}%"
                ></div>
              </div>
              <span class="string-power">
                ${this._unit(s.power, formatInt, 'W')}
              </span>
            </div>
          `;
        })}
      </div>
    `;
  }

  // --- expanded ------------------------------------------------------------

  private _renderExpanded(view: InverterView): TemplateResult {
    return html`
      <div class="details">
        ${view.showStrings ? this._renderStringsTable(view) : nothing}
        ${view.showPhases ? this._renderPhasesTable(view) : nothing}
        ${this._hasFooter(view) ? this._renderFooter(view) : nothing}
      </div>
    `;
  }

  // A. Strings — voltage / current per MPPT input.
  private _renderStringsTable(view: InverterView): TemplateResult {
    return html`
      <div class="grid strings-grid">
        <span class="col-head">Strings</span>
        <span class="col-head num">Spannung</span>
        <span class="col-head num">Strom</span>
        ${view.strings.map(
          (s, i) => html`
            <span class="row-label">PV${i + 1}</span>
            <span class="num">${this._unit(s.voltage, formatFixed, 'V')}</span>
            <span class="num">${this._unit(s.current, formatFixed, 'A')}</span>
          `,
        )}
      </div>
    `;
  }

  // B. Phases — grid flow, inverter output, voltage per phase, plus a Σ row.
  private _renderPhasesTable(view: InverterView): TemplateResult {
    const invert = this._config?.invert_grid ? -1 : 1;

    const gridValues = view.phases.map((p) =>
      p.grid === null ? null : p.grid * invert,
    );
    const gridSum = sumNonNull(gridValues);
    const inverterSum = sumNonNull(view.phases.map((p) => p.inverter));

    return html`
      <div class="grid phases-grid">
        <span class="col-head">Phasen</span>
        <span class="col-head num">Netz</span>
        <span class="col-head num">WR-Ausgang</span>
        <span class="col-head num">Spannung</span>

        ${view.phases.map((p, i) => {
          const grid = gridValues[i]!;
          return html`
            <span class="row-label">${PHASE_LABELS[i]}</span>
            <span class="num ${this._gridClass(grid)}">
              ${this._unit(grid, formatSignedMinus, 'W')}
            </span>
            <span class="num">${this._unit(p.inverter, formatInt, 'W')}</span>
            <span class="num">${this._unit(p.voltage, formatFixed, 'V')}</span>
          `;
        })}

        <span class="row-label sum">Σ</span>
        <span class="num sum ${this._gridClass(gridSum)}">
          ${this._unit(gridSum, formatSignedMinus, 'W')}
        </span>
        <span class="num sum">${this._unit(inverterSum, formatInt, 'W')}</span>
        <span class="num sum muted">–</span>
      </div>
    `;
  }

  // C. Footer — DC temperature (optional) and grid frequency.
  private _renderFooter(view: InverterView): TemplateResult {
    return html`
      <div class="footer">
        ${view.showDcItem
          ? html`<div class="foot-item">
              <span class="foot-label">DC-Temperatur</span>
              <span class="foot-value">
                ${this._unit(view.dcTemp, formatFixed, '°C')}
              </span>
            </div>`
          : nothing}
        ${view.showFreqItem
          ? html`<div class="foot-item">
              <span class="foot-label">Netzfrequenz</span>
              <span class="foot-value">
                ${this._unit(view.gridFrequency, (n) => formatFixed(n, 2), 'Hz')}
              </span>
            </div>`
          : nothing}
      </div>
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

  /** negative = feed-in (green), positive = import (red), zero/null = muted. */
  private _gridClass(value: number | null): string {
    if (value === null || value === 0) return 'muted';
    return value < 0 ? 'grid-feed' : 'grid-draw';
  }

  /** Inline thermometer glyph, so the card needs no external icon set. */
  private _thermometer(): TemplateResult {
    return html`<svg
      class="thermo"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      role="img"
      aria-label="Temperatur"
    >
      ${svg`<path
        fill="currentColor"
        d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0m-3-10a2 2 0 0 1 2 2v1h-4V5a2 2 0 0 1 2-2Z"
      />`}
    </svg>`;
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

    /* --- status pill (shared look with the storage card badges) --- */

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

    .pill-ok {
      background: rgba(46, 125, 50, 0.16);
      background: color-mix(in srgb, var(--success-color, #2e7d32) 16%, transparent);
      color: var(--success-color, #2e7d32);
    }

    .pill-alarm {
      background: rgba(255, 152, 0, 0.16);
      background: color-mix(in srgb, var(--warning-color, #ff9800) 16%, transparent);
      color: var(--warning-color, #ff9800);
    }

    .pill-fault {
      background: rgba(211, 47, 47, 0.18);
      background: color-mix(in srgb, var(--error-color, #d32f2f) 18%, transparent);
      color: var(--error-color, #d32f2f);
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    /* --- power row --- */

    .power-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
      margin-top: 10px;
    }

    .pv {
      display: flex;
      align-items: baseline;
      gap: 8px;
      min-width: 0;
    }

    .pv-value {
      font-size: 24px;
      line-height: 1.15;
      white-space: nowrap;
    }

    .pv-value.producing {
      color: var(--success-color, #2e7d32);
    }

    .pv-value.idle {
      color: var(--secondary-text-color);
    }

    .pv-share {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }

    .temp {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .thermo {
      flex-shrink: 0;
      opacity: 0.8;
    }

    /* --- string bars --- */

    .strings {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .string-row {
      display: grid;
      grid-template-columns: 30px 1fr auto;
      align-items: center;
      gap: 10px;
    }

    .string-label {
      font-size: 12px;
      color: var(--secondary-text-color);
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
      background: var(--success-color, #2e7d32);
      transition: width 0.25s ease-out;
    }

    .bar-fill.warn {
      background: var(--warning-color, #ff9800);
    }

    .string-power {
      font-size: 12px;
      color: var(--secondary-text-color);
      text-align: right;
      white-space: nowrap;
      min-width: 52px;
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

    /* --- expanded details --- */

    .details {
      margin-top: 8px;
      padding-top: 10px;
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.22));
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .grid {
      display: grid;
      align-items: center;
      gap: 4px 12px;
      font-size: 12px;
    }

    .strings-grid {
      grid-template-columns: auto 1fr 1fr;
    }

    .phases-grid {
      grid-template-columns: auto 1fr 1fr 1fr;
    }

    .col-head {
      font-size: 11px;
      color: var(--secondary-text-color);
      padding-bottom: 2px;
    }

    .row-label {
      color: var(--secondary-text-color);
    }

    .num {
      text-align: right;
      white-space: nowrap;
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
    }

    .muted {
      color: var(--secondary-text-color);
    }

    .grid-feed {
      color: var(--success-color, #2e7d32);
    }

    .grid-draw {
      color: var(--error-color, #d32f2f);
    }

    /* Σ row: set off with a hairline and a touch more weight. */
    .sum {
      font-weight: 500;
      padding-top: 5px;
      margin-top: 1px;
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.18));
    }

    /* --- footer --- */

    .footer {
      display: flex;
      gap: 24px;
    }

    .foot-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .foot-label {
      font-size: 11px;
      color: var(--secondary-text-color);
    }

    .foot-value {
      font-size: 13px;
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
    }
  `,
  ];
}

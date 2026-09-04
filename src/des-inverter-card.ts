import { LitElement, html, css, nothing, svg, type TemplateResult } from 'lit';
import {
  formatDecimal,
  formatFixed,
  formatInt,
  formatSignedMinus,
  clamp,
} from './format';
import type {
  DesInverterCardConfig,
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

const PHASE_LABELS = ['L1', 'L2', 'L3'] as const;

/**
 * Phase 1 has no entity binding: the entire readout is one of these canned
 * datasets, picked with `demo_state`, so every visual state (producing, alarm,
 * night) can be exercised straight from YAML.
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

export class DesInverterCard extends LitElement {
  static override properties = {
    hass: { attribute: false },
    _config: { state: true },
    _expanded: { state: true },
  };

  declare hass?: unknown;
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
    return this._expanded ? 6 : 3;
  }

  static getStubConfig(): DesInverterCardConfig {
    return {
      type: 'custom:des-inverter-card',
      name: 'Wechselrichter',
      demo_state: 'normal',
      kwp_total: 12.5,
      kwp_pv1: 6.5,
      kwp_pv2: 6.0,
    };
  }

  private get _data(): InverterData {
    return DEMO_DATA[this._config?.demo_state ?? 'normal'];
  }

  // --- config-derived scalars ----------------------------------------------

  private get _kwpTotal(): number {
    return this._config?.kwp_total ?? DEFAULT_KWP_TOTAL;
  }

  private get _kwpString(): [number, number] {
    return [
      this._config?.kwp_pv1 ?? DEFAULT_KWP_PV1,
      this._config?.kwp_pv2 ?? DEFAULT_KWP_PV2,
    ];
  }

  /** Per-string amber flags for a badly imbalanced array. */
  private get _imbalance(): [boolean, boolean] {
    const config = this._config;
    if (config?.imbalance_warn === false) return [false, false];

    const ratio = config?.imbalance_ratio ?? DEFAULT_IMBALANCE_RATIO;
    const minW = config?.imbalance_min_w ?? DEFAULT_IMBALANCE_MIN_W;
    const [a, b] = this._data.strings.map((s) => s.power);
    const lags = (self: number, other: number): boolean =>
      self < ratio * other && other > minW;
    return [lags(a!, b!), lags(b!, a!)];
  }

  override render(): TemplateResult | typeof nothing {
    const config = this._config;
    if (!config) return nothing;

    return html`
      <ha-card>
        <div class="card">
          ${this._renderCollapsed()}
          ${this._expanded ? this._renderExpanded() : nothing}
        </div>
      </ha-card>
    `;
  }

  // =========================================================================
  // collapsed (always visible)
  // =========================================================================

  private _renderCollapsed(): TemplateResult {
    const config = this._config!;
    const data = this._data;
    const model = config.model ?? data.model;

    return html`
      <div class="header">
        <div class="head-left">
          <span class="name">${config.name}</span>
          <span class="meta">
            ${model} · ${formatFixed(data.todayProduction)} kWh heute ·
            ${formatInt(data.totalProduction)} kWh gesamt
          </span>
        </div>
        ${this._renderPill(data)}
      </div>

      ${this._renderPowerRow(data)} ${this._renderStringBars(data)}

      <div
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
      </div>
    `;
  }

  /** fault beats alarm beats device state. */
  private _renderPill(data: InverterData): TemplateResult {
    const [text, modifier] =
      data.fault !== 'OK'
        ? [`Fault: ${data.fault}`, 'pill-fault']
        : data.alarm !== 'OK'
          ? [`Alarm: ${data.alarm}`, 'pill-alarm']
          : [data.deviceState, 'pill-ok'];

    return html`<span class="pill ${modifier}">
      <span class="pill-label">${text}</span>
    </span>`;
  }

  private _renderPowerRow(data: InverterData): TemplateResult {
    const producing = data.pvPower > 0;
    const kwpTotal = this._kwpTotal;
    const share =
      kwpTotal > 0 ? clamp((data.pvPower / (kwpTotal * 1000)) * 100, 0, 999) : 0;

    return html`
      <div class="power-row">
        <div class="pv">
          <span class="pv-value ${producing ? 'producing' : 'idle'}">
            ${formatInt(data.pvPower)} W
          </span>
          <span class="pv-share">
            ${formatInt(share)} % von ${formatDecimal(kwpTotal)} kWp
          </span>
        </div>
        <div class="temp">
          ${this._thermometer()} ${formatFixed(data.inverterTemp)} °C
        </div>
      </div>
    `;
  }

  private _renderStringBars(data: InverterData): TemplateResult {
    const kwp = this._kwpString;
    const imbalance = this._imbalance;

    return html`
      <div class="strings">
        ${data.strings.map((s, i) => {
          const full = (kwp[i] ?? 0) * 1000;
          const pct = full > 0 ? clamp((s.power / full) * 100, 0, 100) : 0;
          const warn = imbalance[i];
          return html`
            <div class="string-row">
              <span class="string-label">PV${i + 1}</span>
              <div class="bar">
                <div
                  class="bar-fill ${warn ? 'warn' : ''}"
                  style="width: ${pct}%"
                ></div>
              </div>
              <span class="string-power">${formatInt(s.power)} W</span>
            </div>
          `;
        })}
      </div>
    `;
  }

  // =========================================================================
  // expanded
  // =========================================================================

  private _renderExpanded(): TemplateResult {
    return html`
      <div class="details">
        ${this._renderStringsTable()} ${this._renderPhasesTable()}
        ${this._renderFooter()}
      </div>
    `;
  }

  // A. Strings — voltage / current per MPPT input.
  private _renderStringsTable(): TemplateResult {
    const data = this._data;
    return html`
      <div class="grid strings-grid">
        <span class="col-head">Strings</span>
        <span class="col-head num">Spannung</span>
        <span class="col-head num">Strom</span>
        ${data.strings.map(
          (s, i) => html`
            <span class="row-label">PV${i + 1}</span>
            <span class="num">${formatFixed(s.voltage)} V</span>
            <span class="num">${formatFixed(s.current)} A</span>
          `,
        )}
      </div>
    `;
  }

  // B. Phases — grid flow, inverter output, voltage per phase, plus a Σ row.
  private _renderPhasesTable(): TemplateResult {
    const data = this._data;
    const invert = this._config?.invert_grid ? -1 : 1;

    const gridValues = data.phases.map((p) => p.grid * invert);
    const gridSum = gridValues.reduce((a, b) => a + b, 0);
    const inverterSum = data.phases.reduce((a, p) => a + p.inverter, 0);

    return html`
      <div class="grid phases-grid">
        <span class="col-head">Phasen</span>
        <span class="col-head num">Netz</span>
        <span class="col-head num">WR-Ausgang</span>
        <span class="col-head num">Spannung</span>

        ${data.phases.map(
          (p, i) => html`
            <span class="row-label">${PHASE_LABELS[i]}</span>
            <span class="num ${this._gridClass(gridValues[i]!)}">
              ${formatSignedMinus(gridValues[i]!)} W
            </span>
            <span class="num">${formatInt(p.inverter)} W</span>
            <span class="num">${formatFixed(p.voltage)} V</span>
          `,
        )}

        <span class="row-label sum">Σ</span>
        <span class="num sum ${this._gridClass(gridSum)}">
          ${formatSignedMinus(gridSum)} W
        </span>
        <span class="num sum">${formatInt(inverterSum)} W</span>
        <span class="num sum muted">–</span>
      </div>
    `;
  }

  // C. Footer — DC temperature (optional) and grid frequency.
  private _renderFooter(): TemplateResult {
    const data = this._data;
    const showDc = this._config?.show_dc_temp !== false;

    return html`
      <div class="footer">
        ${showDc
          ? html`<div class="foot-item">
              <span class="foot-label">DC-Temperatur</span>
              <span class="foot-value">${formatFixed(data.dcTemp)} °C</span>
            </div>`
          : nothing}
        <div class="foot-item">
          <span class="foot-label">Netzfrequenz</span>
          <span class="foot-value">${formatFixed(data.gridFrequency, 2)} Hz</span>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // shared
  // =========================================================================

  /** negative = feed-in (green), positive = import (red), zero = muted. */
  private _gridClass(value: number): string {
    if (value < 0) return 'grid-feed';
    if (value > 0) return 'grid-draw';
    return 'muted';
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

  static override styles = css`
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

    .chevron-row.clickable:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
      border-radius: 6px;
    }

    .chevron {
      --mdc-icon-size: 22px;
      width: 22px;
      height: 22px;
      color: var(--secondary-text-color);
      transition: transform 0.18s ease-in-out;
    }

    .chevron.open {
      transform: rotate(180deg);
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
  `;
}

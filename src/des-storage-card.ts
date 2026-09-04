import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { formatDecimal, formatInt, formatSignedInt, clamp } from './format';
import { resolveNumber, resolveString } from './resolve';
import type {
  BackupState,
  DesStorageCardConfig,
  HomeAssistant,
  StorageStatus,
} from './types';

const STATUS_LABEL: Record<StorageStatus, string> = {
  charging: 'Lädt',
  discharging: 'Entlädt',
  idle: 'Bereit',
  heating: 'Heizt',
  off: 'Aus',
};

const THRESHOLD_MIN = 10;
const THRESHOLD_MAX = 80;
const THRESHOLD_STEP = 5;

export class DesStorageCard extends LitElement {
  static override properties = {
    hass: { attribute: false },
    _config: { state: true },
    _threshold: { state: true },
  };

  declare hass?: HomeAssistant;
  declare _config?: DesStorageCardConfig;
  declare _threshold: number;

  constructor() {
    super();
    this._threshold = THRESHOLD_MIN;
  }

  setConfig(config: DesStorageCardConfig): void {
    if (!config) {
      throw new Error('des-storage-card: Konfiguration fehlt');
    }
    if (config.variant !== 'battery' && config.variant !== 'thermal') {
      throw new Error(
        'des-storage-card: "variant" muss "battery" oder "thermal" sein',
      );
    }
    if (!config.name) {
      throw new Error('des-storage-card: "name" ist erforderlich');
    }
    if (!(config.status in STATUS_LABEL)) {
      throw new Error(
        'des-storage-card: "status" muss charging | discharging | idle | heating | off sein',
      );
    }
    this._config = config;

    const threshold = resolveNumber(config.threshold_pct, this.hass);
    this._threshold =
      threshold === null
        ? THRESHOLD_MIN
        : clamp(
            Math.round(threshold / THRESHOLD_STEP) * THRESHOLD_STEP,
            THRESHOLD_MIN,
            THRESHOLD_MAX,
          );
  }

  getCardSize(): number {
    return 3;
  }

  static getStubConfig(): DesStorageCardConfig {
    return {
      type: 'custom:des-storage-card',
      variant: 'battery',
      name: 'Hausakku',
      status: 'discharging',
      soc: 62,
      capacity_kwh: 10.2,
      energy_kwh: 6.3,
      power_w: -1240,
      temp_c: 23.5,
      threshold_pct: 20,
      time_remaining: '4:36 h bis 50 %',
      time_at: 'um 00:12',
      backup: 'none',
    };
  }

  override render(): TemplateResult | typeof nothing {
    const config = this._config;
    if (!config) return nothing;

    const isBattery = config.variant === 'battery';

    return html`
      <ha-card>
        <div class="card">
          ${this._renderHeader(config)}
          <div class="subline">${this._renderSubline(config)}</div>
          <div class="main">
            ${isBattery
              ? this._renderBatteryMain(config)
              : this._renderThermalMain(config)}
            ${this._renderTiming(config)}
          </div>
          ${this._renderTemperature(config)}
          <div class="controls">
            ${isBattery
              ? this._renderBatteryControls()
              : this._renderThermalControls()}
          </div>
        </div>
      </ha-card>
    `;
  }

  // --- header -------------------------------------------------------------

  private _renderHeader(config: DesStorageCardConfig): TemplateResult {
    const backup: BackupState = config.backup ?? 'none';

    return html`
      <div class="header">
        <div class="name">${config.name}</div>
        <div class="badges">
          ${backup === 'none' ? nothing : this._renderBackupBadge(backup)}
          <span class="badge status-${config.status}">
            ${STATUS_LABEL[config.status]}
          </span>
        </div>
      </div>
    `;
  }

  private _renderBackupBadge(backup: BackupState): TemplateResult {
    return backup === 'active'
      ? html`<span class="badge backup-active">NOTSTROM AKTIV</span>`
      : html`<span class="badge backup-ready">Notstrom bereit</span>`;
  }

  private _renderSubline(config: DesStorageCardConfig): string {
    if (config.variant === 'thermal') {
      return 'Wärmespeicher · Überschussheizung';
    }
    const capacity = resolveNumber(config.capacity_kwh, this.hass);
    const parts: string[] = [];
    if (capacity !== null) {
      parts.push(`Kapazität ${formatDecimal(capacity)} kWh`);
    }
    parts.push(`Schwelle ${formatInt(this._threshold)} %`);
    return parts.join(' · ');
  }

  // --- main row -----------------------------------------------------------

  private _renderBatteryMain(config: DesStorageCardConfig): TemplateResult {
    const soc = clamp(resolveNumber(config.soc, this.hass) ?? 0, 0, 100);
    const energy = resolveNumber(config.energy_kwh, this.hass);

    return html`
      <div class="primary">
        ${this._renderBatteryIcon(soc)}
        <div class="readout">
          <div class="value">${formatInt(soc)} %</div>
          ${energy === null
            ? nothing
            : html`<div class="value-sub">${formatDecimal(energy)} kWh</div>`}
        </div>
      </div>
    `;
  }

  /** Battery drawn as SVG; fill width follows soc, colour follows the level. */
  private _renderBatteryIcon(soc: number): TemplateResult {
    const fillColor =
      soc > 50
        ? 'var(--success-color, #2e7d32)'
        : soc >= 20
          ? 'var(--warning-color, #ff9800)'
          : 'var(--error-color, #d32f2f)';

    // Inner drawable area of the battery body.
    const innerW = 42;
    const fillW = (innerW * soc) / 100;

    return html`
      <svg
        class="battery"
        viewBox="0 0 56 28"
        width="56"
        height="28"
        role="img"
        aria-label="Ladestand ${formatInt(soc)} Prozent"
      >
        <rect
          x="1"
          y="1"
          width="48"
          height="26"
          rx="4"
          fill="none"
          stroke="var(--secondary-text-color)"
          stroke-width="2"
          opacity="0.6"
        />
        <rect
          x="51"
          y="9"
          width="4"
          height="10"
          rx="2"
          fill="var(--secondary-text-color)"
          opacity="0.6"
        />
        <rect
          x="4"
          y="4"
          width=${fillW}
          height="20"
          rx="2"
          fill=${fillColor}
        />
      </svg>
    `;
  }

  private _renderThermalMain(config: DesStorageCardConfig): TemplateResult {
    const energy = resolveNumber(config.energy_kwh, this.hass);

    return html`
      <div class="primary">
        <ha-icon class="fish" icon="mdi:fish"></ha-icon>
        <div class="readout">
          <div class="value">
            ${energy === null ? '–' : formatDecimal(energy)} kWh
          </div>
          <div class="value-sub">heute eingespeichert</div>
        </div>
      </div>
    `;
  }

  /** Right-hand column: times (muted) above the coloured power reading. */
  private _renderTiming(config: DesStorageCardConfig): TemplateResult {
    const remaining = resolveString(config.time_remaining, this.hass);
    const at = resolveString(config.time_at, this.hass);
    const power = resolveNumber(config.power_w, this.hass);

    const powerClass =
      power === null || power === 0
        ? 'power neutral'
        : power < 0
          ? 'power negative'
          : 'power positive';

    return html`
      <div class="timing">
        ${remaining === null
          ? nothing
          : html`<div class="muted">${remaining}</div>`}
        ${at === null ? nothing : html`<div class="muted">${at}</div>`}
        ${power === null
          ? nothing
          : html`<div class=${powerClass}>
              ${power === 0 ? formatInt(0) : formatSignedInt(power)} W
            </div>`}
      </div>
    `;
  }

  private _renderTemperature(
    config: DesStorageCardConfig,
  ): TemplateResult | typeof nothing {
    const temp = resolveNumber(config.temp_c, this.hass);
    if (temp === null) return nothing;

    return html`
      <div class="temp">
        <ha-icon icon="mdi:thermometer"></ha-icon>
        <span>Akku ${formatDecimal(temp)} °C</span>
      </div>
    `;
  }

  // --- controls -----------------------------------------------------------

  private _renderBatteryControls(): TemplateResult {
    return html`
      <button class="action" type="button" @click=${this._onChargeNow}>
        Jetzt laden
      </button>
      <div class="slider-wrap">
        <input
          class="slider"
          type="range"
          min=${THRESHOLD_MIN}
          max=${THRESHOLD_MAX}
          step=${THRESHOLD_STEP}
          .value=${String(this._threshold)}
          aria-label="Entladeschwelle"
          @input=${this._onThresholdInput}
        />
        <span class="slider-value">${formatInt(this._threshold)} %</span>
      </div>
    `;
  }

  private _renderThermalControls(): TemplateResult {
    return html`
      <button class="action" type="button" @click=${this._onToggleHeater}>
        Heizer aus/an
      </button>
      <span class="muted control-hint">Schaltet bei Überschuss</span>
    `;
  }

  // Phase 1: no service calls yet - these are deliberate no-ops.
  private _onChargeNow(): void {
    /* Phase 2: call the charge service here. */
  }

  private _onToggleHeater(): void {
    /* Phase 2: toggle the heater switch here. */
  }

  /** Local-only feedback so the slider does not feel broken in phase 1. */
  private _onThresholdInput(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    this._threshold = Number(target.value);
  }

  static override styles = css`
    :host {
      display: block;
    }

    ha-card {
      background: var(--card-background-color, var(--ha-card-background, #fff));
      color: var(--primary-text-color);
    }

    .card {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    /* --- header --- */

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .name {
      font-size: 16px;
      font-weight: 500;
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .badges {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }

    .badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      line-height: 1.4;
      white-space: nowrap;
      /* Fallback for browsers without color-mix(); overridden below. */
      background: rgba(127, 127, 127, 0.15);
      color: var(--secondary-text-color);
    }

    .status-charging {
      background: rgba(33, 150, 243, 0.16);
      background: color-mix(in srgb, var(--info-color, #2196f3) 16%, transparent);
      color: var(--info-color, #2196f3);
    }

    .status-discharging,
    .status-heating {
      background: rgba(255, 152, 0, 0.16);
      background: color-mix(
        in srgb,
        var(--warning-color, #ff9800) 16%,
        transparent
      );
      color: var(--warning-color, #ff9800);
    }

    .status-idle,
    .status-off {
      background: rgba(127, 127, 127, 0.16);
      background: color-mix(
        in srgb,
        var(--secondary-text-color, #727272) 16%,
        transparent
      );
      color: var(--secondary-text-color);
    }

    .backup-ready {
      background: rgba(46, 125, 50, 0.16);
      background: color-mix(
        in srgb,
        var(--success-color, #2e7d32) 16%,
        transparent
      );
      color: var(--success-color, #2e7d32);
    }

    .backup-active {
      background: rgba(211, 47, 47, 0.18);
      background: color-mix(in srgb, var(--error-color, #d32f2f) 18%, transparent);
      color: var(--error-color, #d32f2f);
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    /* --- sub line --- */

    .subline {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: -4px;
    }

    /* --- main row --- */

    .main {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 12px;
    }

    .primary {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .battery {
      flex-shrink: 0;
    }

    .fish {
      --mdc-icon-size: 40px;
      width: 40px;
      height: 40px;
      color: var(--info-color, #2196f3);
      flex-shrink: 0;
    }

    .readout {
      min-width: 0;
    }

    .value {
      font-size: 30px;
      font-weight: 400;
      line-height: 1.1;
      color: var(--primary-text-color);
      white-space: nowrap;
    }

    .value-sub {
      font-size: 13px;
      color: var(--secondary-text-color);
      margin-top: 2px;
      white-space: nowrap;
    }

    .timing {
      text-align: right;
      flex-shrink: 0;
    }

    .muted {
      font-size: 12px;
      color: var(--secondary-text-color);
      line-height: 1.5;
    }

    .power {
      font-size: 16px;
      font-weight: 500;
      margin-top: 2px;
      white-space: nowrap;
    }

    .power.negative {
      color: var(--error-color, #d32f2f);
    }

    .power.positive {
      color: var(--success-color, #2e7d32);
    }

    .power.neutral {
      color: var(--secondary-text-color);
    }

    /* --- temperature row --- */

    .temp {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }

    .temp ha-icon {
      --mdc-icon-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* --- controls --- */

    .controls {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.25));
    }

    .action {
      font-family: inherit;
      font-size: 13px;
      font-weight: 500;
      color: var(--primary-color, #03a9f4);
      background: none;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.35));
      border-radius: 6px;
      padding: 6px 14px;
      cursor: pointer;
      white-space: nowrap;
    }

    .action:hover {
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, transparent);
    }

    .action:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }

    .slider-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      min-width: 0;
    }

    .slider {
      flex: 1;
      min-width: 0;
      accent-color: var(--primary-color, #03a9f4);
      cursor: pointer;
    }

    .slider-value {
      font-size: 13px;
      color: var(--secondary-text-color);
      min-width: 42px;
      text-align: right;
      white-space: nowrap;
    }

    .control-hint {
      margin-left: auto;
    }
  `;
}

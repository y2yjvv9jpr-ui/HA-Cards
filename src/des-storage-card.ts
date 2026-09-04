import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { formatDecimal, formatInt, formatSignedInt, clamp } from './format';
import { resolveNumber, resolveString } from './resolve';
import type {
  BackupState,
  ChargeMode,
  DesStorageCardConfig,
  HomeAssistant,
  ItemMode,
  ItemModeConfigValue,
  StatusConfigValue,
  StorageStatus,
  ThermalItemConfig,
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

const TARGET_MIN = 50;
const TARGET_MAX = 100;
const TARGET_STEP = 5;

const MAX_ITEMS = 5;

const CHARGE_MODES: ReadonlyArray<{ value: ChargeMode; label: string }> = [
  { value: 'charge', label: 'Laden' },
  { value: 'auto', label: 'Auto' },
];

const ITEM_MODES: ReadonlyArray<{ value: ItemMode; label: string }> = [
  { value: 'on', label: 'An' },
  { value: 'auto', label: 'Auto' },
  { value: 'off', label: 'Aus' },
];

/**
 * Normalises whatever YAML produced for `status`.
 *
 * HA parses with YAML 1.1: unquoted `off` arrives as the boolean `false`.
 * `standby` is accepted as an alias for `idle`.
 */
function normaliseStatus(raw: StatusConfigValue | undefined): StorageStatus | null {
  if (raw === false) return 'off';
  if (raw === 'standby') return 'idle';
  if (typeof raw === 'string' && raw in STATUS_LABEL) {
    return raw as StorageStatus;
  }
  return null;
}

/** Same YAML 1.1 trap for item modes: `on`/`off` arrive as booleans. */
function normaliseItemMode(raw: ItemModeConfigValue | undefined): ItemMode {
  if (raw === true) return 'on';
  if (raw === false) return 'off';
  if (raw === 'on' || raw === 'auto' || raw === 'off') return raw;
  return 'auto';
}

/** Snaps a configured percentage onto the slider's own scale. */
function snap(value: number, min: number, max: number, step: number): number {
  return clamp(Math.round(value / step) * step, min, max);
}

/**
 * Traffic-light class for the battery temperature.
 *
 *   < 4 °C  red · 4-8 °C  yellow · 8-40 °C  neutral · 40-50 °C  yellow · > 50 °C  red
 */
function temperatureClass(temp: number): string {
  if (temp < 4 || temp > 50) return 'temp-alert';
  if (temp < 8 || temp > 40) return 'temp-warn';
  return '';
}

export class DesStorageCard extends LitElement {
  static override properties = {
    hass: { attribute: false },
    _config: { state: true },
    _threshold: { state: true },
    _chargeTarget: { state: true },
    _chargeMode: { state: true },
    _expanded: { state: true },
    _itemModes: { state: true },
  };

  declare hass?: HomeAssistant;
  declare _config?: DesStorageCardConfig;
  declare _threshold: number;
  declare _chargeTarget: number;
  declare _chargeMode: ChargeMode;
  declare _expanded: boolean;
  declare _itemModes: ItemMode[];

  private _status: StorageStatus = 'idle';

  constructor() {
    super();
    this._threshold = THRESHOLD_MIN;
    this._chargeTarget = TARGET_MAX;
    this._chargeMode = 'auto';
    this._expanded = false;
    this._itemModes = [];
  }

  setConfig(config: DesStorageCardConfig): void {
    if (!config) {
      throw new Error('des-storage-card: Konfiguration fehlt');
    }
    if (config.variant !== 'battery' && config.variant !== 'thermal_group') {
      throw new Error(
        'des-storage-card: "variant" muss "battery" oder "thermal_group" sein',
      );
    }
    if (!config.name) {
      throw new Error('des-storage-card: "name" ist erforderlich');
    }

    if (config.variant === 'battery') {
      const status = normaliseStatus(config.status);
      if (status === null) {
        throw new Error(
          'des-storage-card: "status" muss charging | discharging | idle | standby | heating | off sein',
        );
      }
      this._status = status;

      const threshold = resolveNumber(config.threshold_pct, this.hass);
      this._threshold =
        threshold === null
          ? THRESHOLD_MIN
          : snap(threshold, THRESHOLD_MIN, THRESHOLD_MAX, THRESHOLD_STEP);

      const target = resolveNumber(config.charge_target_pct, this.hass);
      this._chargeTarget =
        target === null ? TARGET_MAX : snap(target, TARGET_MIN, TARGET_MAX, TARGET_STEP);

      this._chargeMode = config.charge_mode === 'charge' ? 'charge' : 'auto';
    } else {
      const items = config.items;
      if (!Array.isArray(items) || items.length === 0) {
        throw new Error(
          'des-storage-card: "items" braucht mindestens einen Eintrag',
        );
      }
      if (items.length > MAX_ITEMS) {
        throw new Error(
          `des-storage-card: "items" erlaubt höchstens ${MAX_ITEMS} Einträge`,
        );
      }
      if (items.some((item) => !item || !item.name)) {
        throw new Error('des-storage-card: jeder Eintrag in "items" braucht "name"');
      }
      this._itemModes = items.map((item) => normaliseItemMode(item.mode));
    }

    this._config = config;
    this._expanded = false;
  }

  getCardSize(): number {
    if (this._config?.variant === 'thermal_group') {
      return 1 + (this._config.items?.length ?? 0);
    }
    return this._expanded ? 3 : 2;
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
      charge_target_pct: 90,
      charge_mode: 'auto',
      time_remaining: '4:36 h bis 20 %',
      time_at: 'um 00:12',
      backup: 'none',
    };
  }

  override render(): TemplateResult | typeof nothing {
    const config = this._config;
    if (!config) return nothing;

    return html`
      <ha-card>
        <div class="card">
          ${config.variant === 'battery'
            ? this._renderBattery(config)
            : this._renderThermalGroup(config)}
        </div>
      </ha-card>
    `;
  }

  // =========================================================================
  // variant: battery
  // =========================================================================

  private _renderBattery(config: DesStorageCardConfig): TemplateResult {
    const soc = clamp(resolveNumber(config.soc, this.hass) ?? 0, 0, 100);
    const energy = resolveNumber(config.energy_kwh, this.hass);
    const power = resolveNumber(config.power_w, this.hass);
    const backup: BackupState = config.backup ?? 'none';
    const times = this._batteryTimes(config);

    return html`
      <div class="header">
        <div class="head-left">
          <span class="name">${config.name}</span>
          <span class="meta">${this._renderBatteryMeta(config)}</span>
        </div>
        <div class="badges">
          ${backup === 'none' ? nothing : this._renderBackupBadge(backup)}
          ${this._renderBadge(
            STATUS_LABEL[this._status],
            `status-${this._status}`,
          )}
        </div>
      </div>

      <div
        class="main"
        role="button"
        tabindex="0"
        aria-expanded=${this._expanded ? 'true' : 'false'}
        @click=${this._toggleExpanded}
        @keydown=${this._onMainKeydown}
      >
        ${this._renderBatteryIcon(soc)}
        <div class="readout">
          <span class="soc">${formatInt(soc)} %</span>
          ${energy === null
            ? nothing
            : html`<span class="energy">${formatDecimal(energy)} kWh</span>`}
        </div>
        <div class="timing">
          ${power === null
            ? nothing
            : html`<div class=${this._powerClass(power)}>
                ${this._formatPower(power)}
              </div>`}
          ${times === null ? nothing : html`<div class="muted">${times}</div>`}
        </div>
        <ha-icon
          class="chevron ${this._expanded ? 'open' : ''}"
          icon="mdi:chevron-down"
        ></ha-icon>
      </div>

      ${this._expanded
        ? html`<div class="grow"></div>
            ${this._renderBatteryControls()}`
        : nothing}
    `;
  }

  /**
   * Two labelled slider rows on one grid, so labels, tracks and values line
   * up. The charge-mode control sits to their right, centred over both rows.
   */
  private _renderBatteryControls(): TemplateResult {
    const targetActive = this._chargeMode === 'charge';

    return html`
      <div class="controls">
        <div class="ctl-rows">
          <span class="ctl-label ${targetActive ? '' : 'disabled'}">Ladeziel</span>
          <input
            class="slider"
            type="range"
            min=${TARGET_MIN}
            max=${TARGET_MAX}
            step=${TARGET_STEP}
            .value=${String(this._chargeTarget)}
            ?disabled=${!targetActive}
            aria-label="Ladeziel"
            @input=${this._onTargetInput}
          />
          <span class="ctl-value ${targetActive ? '' : 'disabled'}">
            ${formatInt(this._chargeTarget)} %
          </span>

          <span class="ctl-label">min. SoC</span>
          <input
            class="slider"
            type="range"
            min=${THRESHOLD_MIN}
            max=${THRESHOLD_MAX}
            step=${THRESHOLD_STEP}
            .value=${String(this._threshold)}
            aria-label="Minimaler Ladestand"
            @input=${this._onThresholdInput}
          />
          <span class="ctl-value">${formatInt(this._threshold)} %</span>
        </div>
        ${this._renderSegmented(
          CHARGE_MODES,
          this._chargeMode,
          (value) => this._setChargeMode(value),
          'Lademodus',
        )}
      </div>
    `;
  }

  /** "10,2 kWh · 23,5 °C · min. 20 % SoC" - temp segment dropped when null. */
  private _renderBatteryMeta(config: DesStorageCardConfig): TemplateResult {
    const capacity = resolveNumber(config.capacity_kwh, this.hass);
    const temp = resolveNumber(config.temp_c, this.hass);
    const parts: Array<TemplateResult | string> = [];

    if (capacity !== null) parts.push(`${formatDecimal(capacity)} kWh`);
    if (temp !== null) {
      parts.push(
        html`<span class=${temperatureClass(temp)}>
          ${formatDecimal(temp)} °C
        </span>`,
      );
    }
    parts.push(`min. ${formatInt(this._threshold)} % SoC`);

    return html`${parts.map((part, index) =>
      index === 0 ? part : html` · ${part}`,
    )}`;
  }

  /** "4:36 h bis 20 % · um 00:12" - null when neither is set. */
  private _batteryTimes(config: DesStorageCardConfig): string | null {
    const parts = [
      resolveString(config.time_remaining, this.hass),
      resolveString(config.time_at, this.hass),
    ].filter((part): part is string => part !== null);

    return parts.length > 0 ? parts.join(' · ') : null;
  }

  /** Upright battery; the fill grows from the bottom. */
  private _renderBatteryIcon(soc: number): TemplateResult {
    const fillColor =
      soc > 50
        ? 'var(--success-color, #2e7d32)'
        : soc >= 20
          ? 'var(--warning-color, #ff9800)'
          : 'var(--error-color, #d32f2f)';

    // Inner drawable area of the battery body: y 6..32, height 26.
    const innerY = 6;
    const innerH = 26;
    const fillH = (innerH * soc) / 100;
    const fillY = innerY + (innerH - fillH);

    return html`
      <svg
        class="battery"
        viewBox="0 0 22 36"
        width="22"
        height="36"
        role="img"
        aria-label="Ladestand ${formatInt(soc)} Prozent"
      >
        <rect
          x="7"
          y="1"
          width="8"
          height="3"
          rx="1.5"
          fill="var(--secondary-text-color)"
          opacity="0.6"
        />
        <rect
          x="2"
          y="4"
          width="18"
          height="31"
          rx="3"
          fill="none"
          stroke="var(--secondary-text-color)"
          stroke-width="2"
          opacity="0.6"
        />
        <rect
          x="4"
          y=${fillY}
          width="14"
          height=${fillH}
          rx="1.5"
          fill=${fillColor}
        />
      </svg>
    `;
  }

  // =========================================================================
  // variant: thermal_group
  // =========================================================================

  private _renderThermalGroup(config: DesStorageCardConfig): TemplateResult {
    const items = config.items ?? [];
    const powers = items.map((item) => resolveNumber(item.power_w, this.hass) ?? 0);
    const totalEnergy = items.reduce(
      (sum, item) => sum + (resolveNumber(item.energy_kwh, this.hass) ?? 0),
      0,
    );
    const totalPower = powers.reduce((sum, power) => sum + power, 0);
    const heatingCount = powers.filter((power) => power > 0).length;

    return html`
      <div class="header">
        <div class="head-left">
          <span class="name">${config.name}</span>
        </div>
        <div class="badges">
          <!-- Heating charges the heat store, so it reads as "charging". -->
          ${this._renderBadge(
            heatingCount > 0 ? `${formatInt(heatingCount)} heizen` : 'Aus',
            heatingCount > 0 ? 'status-charging' : 'status-off',
          )}
        </div>
      </div>

      <div class="main">
        <ha-icon class="fish" icon="mdi:fish"></ha-icon>
        <div class="readout stacked">
          <span class="soc">${formatDecimal(totalEnergy)} kWh</span>
          <span class="energy">heute eingespeichert</span>
        </div>
        <div class="timing">
          <div class=${this._powerClass(totalPower)}>
            ${this._formatPower(totalPower)}
          </div>
        </div>
      </div>

      <div class="items">
        ${items.map((item, index) => this._renderItem(item, index, powers[index]!))}
      </div>
    `;
  }

  private _renderItem(
    item: ThermalItemConfig,
    index: number,
    power: number,
  ): TemplateResult {
    const energy = resolveNumber(item.energy_kwh, this.hass);

    return html`
      <div class="item">
        <span class="item-name">${item.name}</span>
        <span class="item-energy">
          ${energy === null ? '' : `${formatDecimal(energy)} kWh`}
        </span>
        <span class=${power > 0 ? 'item-power positive' : 'item-power'}>
          ${this._formatPower(power)}
        </span>
        ${this._renderSegmented(
          ITEM_MODES,
          this._itemModes[index] ?? 'auto',
          (value) => this._setItemMode(index, value),
          `Modus ${item.name}`,
        )}
      </div>
    `;
  }

  // =========================================================================
  // shared
  // =========================================================================

  /** One segmented control, used for both charge mode and item modes. */
  private _renderSegmented<T extends string>(
    options: ReadonlyArray<{ value: T; label: string }>,
    active: T,
    onSelect: (value: T) => void,
    ariaLabel: string,
  ): TemplateResult {
    return html`
      <div class="seg" role="group" aria-label=${ariaLabel}>
        ${options.map(
          ({ value, label }) => html`
            <button
              type="button"
              class=${active === value ? 'active' : ''}
              aria-pressed=${active === value ? 'true' : 'false'}
              @click=${(ev: Event) => {
                ev.stopPropagation();
                onSelect(value);
              }}
            >
              ${label}
            </button>
          `,
        )}
      </div>
    `;
  }

  /**
   * The label sits in its own element so it can be nudged down optically.
   * Metric centring alone reads as too high - see `.badge-label` in the styles.
   */
  private _renderBadge(label: string, modifier: string): TemplateResult {
    return html`<span class="badge ${modifier}">
      <span class="badge-label">${label}</span>
    </span>`;
  }

  private _renderBackupBadge(backup: BackupState): TemplateResult {
    return backup === 'active'
      ? this._renderBadge('NOTSTROM AKTIV', 'backup-active')
      : this._renderBadge('Notstrom bereit', 'backup-ready');
  }

  private _powerClass(power: number): string {
    if (power === 0) return 'power neutral';
    return power < 0 ? 'power negative' : 'power positive';
  }

  private _formatPower(power: number): string {
    return `${power === 0 ? formatInt(0) : formatSignedInt(power)} W`;
  }

  // --- local-only interaction (phase 1 persists nothing) -------------------

  private _toggleExpanded(): void {
    this._expanded = !this._expanded;
  }

  private _onMainKeydown(ev: KeyboardEvent): void {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this._toggleExpanded();
    }
  }

  private _setChargeMode(mode: ChargeMode): void {
    this._chargeMode = mode;
  }

  private _onTargetInput(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    this._chargeTarget = Number(target.value);
  }

  private _onThresholdInput(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    this._threshold = Number(target.value);
  }

  private _setItemMode(index: number, mode: ItemMode): void {
    const next = [...this._itemModes];
    next[index] = mode;
    this._itemModes = next;
  }

  static override styles = css`
    /* The card fills whatever height the sections grid hands it, so several
       cards in one row can be levelled with grid_options.rows. */
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

    /* Eats the spare height when the card is stretched, so the content stays
       at the top and the control row sits on the bottom edge. */
    .grow {
      flex: 1 1 0;
      min-height: 12px;
    }

    /* --- header --- */

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .head-left {
      display: flex;
      align-items: baseline;
      gap: 8px;
      min-width: 0;
    }

    .name {
      font-size: 15px;
      font-weight: 500;
      color: var(--primary-text-color);
      white-space: nowrap;
      /* On narrow cards the meta line truncates, never the name. */
      flex-shrink: 0;
    }

    .meta {
      font-size: 12px;
      color: var(--secondary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .temp-warn {
      color: var(--warning-color, #ff9800);
    }

    .temp-alert {
      color: var(--error-color, #d32f2f);
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
      /* Fallback for browsers without color-mix(); overridden below. */
      background: rgba(127, 127, 127, 0.15);
      color: var(--secondary-text-color);
    }

    /* Metric centring puts the glyphs visually too high: with line-height:1
       the em box still reserves descender space these labels do not use, so
       their optical centre sits above the box centre. Nudge the text down. */
    .badge-label {
      display: block;
      transform: translateY(1px);
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

    /* --- main row --- */

    .main {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 8px;
    }

    [role='button'].main {
      cursor: pointer;
      outline: none;
    }

    [role='button'].main:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 3px;
      border-radius: 6px;
    }

    .battery {
      flex-shrink: 0;
    }

    .fish {
      --mdc-icon-size: 30px;
      width: 30px;
      height: 30px;
      color: var(--secondary-text-color);
      flex-shrink: 0;
    }

    .readout {
      display: flex;
      align-items: baseline;
      gap: 8px;
      min-width: 0;
    }

    .readout.stacked {
      flex-direction: column;
      gap: 0;
      align-items: flex-start;
    }

    .soc {
      font-size: 24px;
      line-height: 1.15;
      color: var(--primary-text-color);
      white-space: nowrap;
    }

    .energy {
      font-size: 13px;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }

    .timing {
      margin-left: auto;
      text-align: right;
      flex-shrink: 0;
    }

    .muted {
      font-size: 12px;
      color: var(--secondary-text-color);
      line-height: 1.4;
    }

    .power {
      font-size: 15px;
      font-weight: 500;
      line-height: 1.3;
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

    .chevron {
      --mdc-icon-size: 22px;
      width: 22px;
      height: 22px;
      color: var(--secondary-text-color);
      flex-shrink: 0;
      transition: transform 0.18s ease-in-out;
    }

    .chevron.open {
      transform: rotate(180deg);
    }

    /* --- battery controls (collapsed by default) --- */

    .controls {
      display: flex;
      align-items: center;
      gap: 14px;
      padding-top: 10px;
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.22));
    }

    /* Both slider rows share one grid so labels, tracks and values line up. */
    .ctl-rows {
      flex: 1;
      min-width: 0;
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 8px 10px;
    }

    .ctl-label {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }

    .ctl-value {
      font-size: 12px;
      color: var(--secondary-text-color);
      min-width: 38px;
      text-align: right;
      white-space: nowrap;
    }

    .ctl-label.disabled,
    .ctl-value.disabled {
      opacity: 0.4;
    }

    /* --- sliders: thin track, small muted thumb --- */

    .slider {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      min-width: 0;
      height: 12px;
      background: none;
      cursor: pointer;
    }

    .slider:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }

    .slider::-webkit-slider-runnable-track {
      height: 3px;
      border-radius: 2px;
      background: var(--divider-color, rgba(127, 127, 127, 0.3));
    }

    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 12px;
      height: 12px;
      border: none;
      border-radius: 50%;
      background: var(--secondary-text-color);
      /* Centres the thumb on the 3px track. */
      margin-top: -4.5px;
    }

    .slider::-moz-range-track {
      height: 3px;
      border-radius: 2px;
      background: var(--divider-color, rgba(127, 127, 127, 0.3));
    }

    .slider::-moz-range-thumb {
      width: 12px;
      height: 12px;
      border: none;
      border-radius: 50%;
      background: var(--secondary-text-color);
    }

    .slider:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
      border-radius: 3px;
    }

    /* --- thermal group item rows --- */

    .items {
      margin-top: 8px;
    }

    .item {
      display: grid;
      grid-template-columns: minmax(84px, 1fr) auto minmax(56px, auto) auto;
      align-items: center;
      gap: 10px;
      padding: 6px 0;
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.18));
    }

    .item-name {
      font-size: 13px;
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item-energy {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }

    .item-power {
      font-size: 12px;
      text-align: right;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }

    .item-power.positive {
      color: var(--success-color, #2e7d32);
      font-weight: 500;
    }

    /* --- segmented control --- */

    .seg {
      display: inline-flex;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.28));
      border-radius: 5px;
      overflow: hidden;
    }

    .seg button {
      font-family: inherit;
      font-size: 11px;
      line-height: 1;
      padding: 4px 7px;
      background: none;
      border: none;
      border-left: 1px solid var(--divider-color, rgba(127, 127, 127, 0.28));
      color: var(--secondary-text-color);
      cursor: pointer;
    }

    .seg button:first-child {
      border-left: none;
    }

    .seg button:hover {
      color: var(--primary-text-color);
    }

    .seg button.active {
      background: rgba(3, 169, 244, 0.12);
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 12%, transparent);
      color: var(--primary-color, #03a9f4);
      font-weight: 500;
    }

    .seg button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: -2px;
    }
  `;
}

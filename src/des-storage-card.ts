import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { formatFixed, formatInt, formatSignedInt, clamp } from './format';
import {
  entityNumberAttribute,
  isEntityId,
  resolveNumber,
  resolveText,
  type Resolved,
} from './resolve';
import {
  isChargeState,
  isWritableChargeMode,
  isWritableNumber,
  isWritableSwitch,
  validateChargeModeControl,
  writeChargeMode,
  writeNumber,
  writeSwitch,
} from './service';
import type {
  BackupState,
  ChargeMode,
  NumberValue,
  DesStorageCardConfig,
  HomeAssistant,
  ItemMode,
  StorageStatus,
  TextValue,
  ThermalItemConfig,
} from './types';

const STATUS_LABEL: Record<StorageStatus, string> = {
  charging: 'Lädt',
  discharging: 'Entlädt',
  idle: 'Bereit',
  heating: 'Heizt',
  off: 'Aus',
};

/** Slider bounds. A bound number entity overrides these with its own. */
interface SliderRange {
  min: number;
  max: number;
  step: number;
}

const THRESHOLD_RANGE: SliderRange = { min: 10, max: 80, step: 5 };
const TARGET_RANGE: SliderRange = { min: 50, max: 100, step: 5 };

const MAX_ITEMS = 5;

/** Below this many watts the battery counts as idle, not as charging. */
const POWER_DEADBAND_W = 25;

/**
 * Sliders write on `change` (pointer release), and that write is debounced:
 * keyboard stepping fires `change` per arrow key, so without this a held key
 * would queue a service call per step.
 */
const WRITE_DEBOUNCE_MS = 500;

/**
 * How long an optimistic value may survive without the entity confirming it.
 *
 * Without this the override is only released on a match, so a device that
 * refuses the change (or answers with a third state) leaves the control
 * permanently detached from its entity until the dashboard is reloaded.
 */
const SETTLE_TIMEOUT_MS = 8000;

/** Remaining-time states that mean "nothing to show". */
const NO_TIME_STATES = new Set([
  'not charging',
  'not discharging',
  'unknown',
  'unavailable',
  'none',
  '-',
  '--',
]);

const CHARGE_MODES: ReadonlyArray<{ value: ChargeMode; label: string }> = [
  { value: 'charge', label: 'Laden' },
  { value: 'auto', label: 'Auto' },
];

const ITEM_MODES: ReadonlyArray<{ value: ItemMode; label: string }> = [
  { value: 'on', label: 'An' },
  { value: 'auto', label: 'Auto' },
  { value: 'off', label: 'Aus' },
];

/** How `mode_entity` encodes the three modes. */
const MODE_BY_NUMBER: Readonly<Record<number, ItemMode>> = {
  1: 'on',
  2: 'auto',
  3: 'off',
};
const NUMBER_BY_MODE: Readonly<Record<ItemMode, number>> = {
  on: 1,
  auto: 2,
  off: 3,
};

/** `standby` is an accepted alias for `idle`; anything else returns null. */
function normaliseStatus(raw: string): StorageStatus | null {
  const value = raw.trim().toLowerCase();
  if (value === 'standby') return 'idle';
  return value in STATUS_LABEL ? (value as StorageStatus) : null;
}

function normaliseItemMode(raw: string): ItemMode {
  const value = raw.trim().toLowerCase();
  if (value === 'on' || value === 'auto' || value === 'off') return value;
  return 'auto';
}

/**
 * Snaps a value onto the slider's own scale.
 *
 * Counted from `min`, not from zero: an entity may well start at 22 with a
 * step of 5, and rounding to a multiple of 5 would land off its own grid.
 */
function snap(value: number, range: SliderRange): number {
  const { min, max, step } = range;
  if (!(step > 0)) return clamp(value, min, max);
  const steps = Math.round((value - min) / step);
  // Trims the float noise that min + steps * step can produce.
  const snapped = Number((min + steps * step).toFixed(6));
  return clamp(snapped, min, max);
}

/** Decimals a step implies, so the readout matches the slider's precision. */
function decimalsForStep(step: number): number {
  if (!Number.isFinite(step) || Number.isInteger(step)) return 0;
  const text = String(step);
  const dot = text.indexOf('.');
  return dot === -1 ? 0 : Math.min(3, text.length - dot - 1);
}

/** Formats a slider value with just as many decimals as its step needs. */
function formatForStep(value: number, step: number): string {
  const decimals = decimalsForStep(step);
  return decimals === 0 ? formatInt(value) : formatFixed(value, decimals);
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
    // Assigning `hass` is a reactive property write, so Home Assistant's
    // state updates re-render the card without a custom setter.
    hass: { attribute: false },
    _config: { state: true },
    _thresholdLocal: { state: true },
    _targetLocal: { state: true },
    _chargeModeLocal: { state: true },
    _expanded: { state: true },
    _itemModesLocal: { state: true },
  };

  declare hass?: HomeAssistant;
  declare _config?: DesStorageCardConfig;
  declare _expanded: boolean;

  // `null` means "follow the config/entity"; a value means the user has
  // touched the control in this session. Phase 3 turns these into writes.
  declare _thresholdLocal: number | null;
  declare _targetLocal: number | null;
  declare _chargeModeLocal: ChargeMode | null;
  declare _itemModesLocal: Array<ItemMode | null>;

  /** Pending debounced slider writes, keyed by which slider they belong to. */
  private _writeTimers = new Map<'threshold' | 'target', number>();

  /** Deadlines after which an unconfirmed optimistic value is dropped. */
  private _settleTimers = new Map<string, number>();

  constructor() {
    super();
    this._expanded = false;
    this._thresholdLocal = null;
    this._targetLocal = null;
    this._chargeModeLocal = null;
    this._itemModesLocal = [];
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

    if (config.variant === 'battery' && config.charge_mode_control !== undefined) {
      const problem = validateChargeModeControl(config.charge_mode_control);
      if (problem !== null) throw new Error(`des-storage-card: ${problem}`);
    }

    if (config.variant === 'thermal_group') {
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
      for (const item of items) {
        if (item.mode_entity !== undefined && !isWritableNumber(item.mode_entity)) {
          throw new Error(
            `des-storage-card: "mode_entity" muss eine number- oder input_number-Entität sein (ist: ${item.mode_entity})`,
          );
        }
      }
      this._itemModesLocal = items.map(() => null);
    }

    this._config = config;
    this._expanded = false;
    this._thresholdLocal = null;
    this._targetLocal = null;
    this._chargeModeLocal = null;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    for (const timer of this._writeTimers.values()) window.clearTimeout(timer);
    this._writeTimers.clear();
    for (const timer of this._settleTimers.values()) window.clearTimeout(timer);
    this._settleTimers.clear();
  }

  /** Drops an optimistic value that the entity never confirmed. */
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

  /**
   * Drops an optimistic local value once the entity reports it back, so the
   * control follows the entity again (including changes made elsewhere).
   * Runs in `willUpdate` rather than `updated` so it costs no extra render.
   */
  protected override willUpdate(): void {
    const config = this._config;
    if (!config) return;

    if (config.variant === 'battery') {
      if (
        this._thresholdLocal !== null &&
        this._entityMatches(
          config.threshold_pct,
          this._thresholdLocal,
          this._rangeFor(config.threshold_pct, THRESHOLD_RANGE),
        )
      ) {
        this._thresholdLocal = null;
        this._clearSettle('threshold');
      }

      if (
        this._targetLocal !== null &&
        this._entityMatches(
          config.charge_target_pct,
          this._targetLocal,
          this._rangeFor(config.charge_target_pct, TARGET_RANGE),
        )
      ) {
        this._targetLocal = null;
        this._clearSettle('target');
      }

      const control = config.charge_mode_control;
      if (this._chargeModeLocal !== null && control?.entity) {
        const state = resolveText(control.entity, this.hass);
        if (state.kind === 'value') {
          const actual = isChargeState(control, state.value) ? 'charge' : 'auto';
          if (actual === this._chargeModeLocal) {
            this._chargeModeLocal = null;
            this._clearSettle('chargeMode');
          }
        }
      }
      return;
    }

    const items = config.items ?? [];
    let changed = false;
    const next = [...this._itemModesLocal];
    items.forEach((item, index) => {
      const local = next[index];
      if (!local) return;
      // A bare switch cannot express "auto", so that choice stays local until
      // the card reloads; a mode entity confirms all three.
      const actual = this._itemModeFromEntity(item);
      if (actual === null || actual !== local) return;
      next[index] = null;
      changed = true;
      this._clearSettle(`item:${index}`);
    });
    if (changed) this._itemModesLocal = next;
  }

  /** True when the slot is entity-bound and already carries exactly `local`. */
  private _entityMatches(
    slot: NumberValue | undefined,
    local: number,
    range: SliderRange,
  ): boolean {
    // Static values are never "confirmed" by an entity - they stay local.
    if (typeof slot !== 'string' || !isEntityId(slot)) return false;
    const resolved = resolveNumber(slot, this.hass);
    return resolved.kind === 'value' && snap(resolved.value, range) === local;
  }

  /**
   * The bounds a slider actually uses.
   *
   * A bound `number`/`input_number` publishes its own min/max/step, and those
   * are authoritative - writing a value outside them would just be rejected.
   * Each attribute falls back on its own, so a partially described entity
   * still yields a usable range.
   */
  private _rangeFor(
    slot: NumberValue | undefined,
    fallback: SliderRange,
  ): SliderRange {
    if (!isWritableNumber(slot)) return fallback;
    const entityId = slot as string;

    const min = entityNumberAttribute(entityId, this.hass, 'min') ?? fallback.min;
    const max = entityNumberAttribute(entityId, this.hass, 'max') ?? fallback.max;
    const step = entityNumberAttribute(entityId, this.hass, 'step') ?? fallback.step;

    // A nonsensical range would freeze the slider, so ignore it.
    if (!(min < max) || !(step > 0)) return fallback;
    return { min, max, step };
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
      soc: 62,
      capacity_kwh: 10.2,
      power_w: -1240,
      temp_c: 23.5,
      threshold_pct: 20,
      charge_target_pct: 90,
      charge_mode: 'auto',
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
  // resolution / derivation
  // =========================================================================

  /** `power_w` if given, otherwise voltage x current; sign optionally flipped. */
  private _power(config: DesStorageCardConfig): Resolved<number> {
    let power = resolveNumber(config.power_w, this.hass);

    if (power.kind === 'unset' && config.voltage_entity && config.current_entity) {
      const volts = resolveNumber(config.voltage_entity, this.hass);
      const amps = resolveNumber(config.current_entity, this.hass);
      power =
        volts.kind === 'value' && amps.kind === 'value'
          ? { kind: 'value', value: volts.value * amps.value }
          : { kind: 'unavailable' };
    }

    if (power.kind === 'value' && config.invert_power) {
      return { kind: 'value', value: -power.value };
    }
    return power;
  }

  /** Configured status, else derived from the power sign. */
  private _status(
    config: DesStorageCardConfig,
    power: Resolved<number>,
  ): StorageStatus {
    const configured = resolveText(config.status, this.hass);
    if (configured.kind === 'value') {
      const status = normaliseStatus(configured.value);
      if (status !== null) return status;
    }

    if (power.kind === 'value') {
      if (power.value < -POWER_DEADBAND_W) return 'discharging';
      if (power.value > POWER_DEADBAND_W) return 'charging';
    }
    return 'idle';
  }

  /** `energy_kwh` if given, otherwise soc x capacity / 100. */
  private _energy(
    config: DesStorageCardConfig,
    soc: Resolved<number>,
    capacity: Resolved<number>,
  ): Resolved<number> {
    const energy = resolveNumber(config.energy_kwh, this.hass);
    if (energy.kind !== 'unset') return energy;

    if (soc.kind === 'value' && capacity.kind === 'value') {
      return { kind: 'value', value: (soc.value * capacity.value) / 100 };
    }
    // Only claim "unavailable" when the inputs were actually configured.
    if (soc.kind === 'unavailable' || capacity.kind === 'unavailable') {
      return { kind: 'unavailable' };
    }
    return { kind: 'unset' };
  }

  /**
   * Remaining time. `time_remaining` wins; otherwise the charging variant is
   * used while power is positive and the discharging one in every other case.
   */
  private _timeRemaining(
    config: DesStorageCardConfig,
    power: Resolved<number>,
  ): string | null {
    let source: TextValue | undefined = config.time_remaining;
    if (source === undefined) {
      source =
        power.kind === 'value' && power.value > 0
          ? config.time_remaining_charging
          : config.time_remaining_discharging;
    }

    const resolved = resolveText(source, this.hass);
    if (resolved.kind !== 'value') return null;
    return NO_TIME_STATES.has(resolved.value.trim().toLowerCase())
      ? null
      : resolved.value;
  }

  private _backup(config: DesStorageCardConfig): BackupState {
    const backup = config.backup;
    if (!backup || backup === 'none') return 'none';

    if (typeof backup === 'string') {
      return backup === 'active' || backup === 'ready' ? backup : 'none';
    }

    const state = resolveText(backup.entity, this.hass);
    // An unavailable entity must not be reported as "Notstrom bereit".
    if (state.kind !== 'value') return 'none';

    const active = (backup.active_states ?? []).some(
      (candidate) => candidate.trim().toLowerCase() === state.value.toLowerCase(),
    );
    return active ? 'active' : 'ready';
  }

  private _threshold(config: DesStorageCardConfig): number | null {
    if (this._thresholdLocal !== null) return this._thresholdLocal;
    const resolved = resolveNumber(config.threshold_pct, this.hass);
    return resolved.kind === 'value'
      ? snap(resolved.value, this._rangeFor(config.threshold_pct, THRESHOLD_RANGE))
      : null;
  }

  private _chargeTarget(config: DesStorageCardConfig): number | null {
    if (this._targetLocal !== null) return this._targetLocal;
    const resolved = resolveNumber(config.charge_target_pct, this.hass);
    return resolved.kind === 'value'
      ? snap(resolved.value, this._rangeFor(config.charge_target_pct, TARGET_RANGE))
      : null;
  }

  /**
   * `null` means "cannot say" - the control is bound to an entity the card
   * cannot read right now, so no segment is highlighted. Showing a confident
   * "Laden" for an entity that never answered is how a wrong entity id stayed
   * invisible before.
   */
  private _chargeMode(config: DesStorageCardConfig): ChargeMode | null {
    if (this._chargeModeLocal !== null) return this._chargeModeLocal;

    const control = config.charge_mode_control;
    if (control?.entity) {
      // A configured control owns the state; never fall back to charge_mode,
      // which would report a stale static value as if it were live.
      const state = resolveText(control.entity, this.hass);
      if (state.kind !== 'value') return null;
      return isChargeState(control, state.value) ? 'charge' : 'auto';
    }

    const resolved = resolveText(config.charge_mode, this.hass);
    return resolved.kind === 'value' &&
      resolved.value.trim().toLowerCase() === 'charge'
      ? 'charge'
      : 'auto';
  }

  /**
   * Local click wins, then `mode_entity`, then a static `mode`, then the
   * switch entity's on/off state. `null` means no segment is highlighted -
   * `mode_entity` carrying something outside 1/2/3 is the only way there.
   */
  private _itemMode(item: ThermalItemConfig, index: number): ItemMode | null {
    const local = this._itemModesLocal[index];
    if (local) return local;

    if (item.mode_entity) {
      // The mode entity is authoritative; never fall back to the switch, which
      // would report the heater's state as if it were the selected mode.
      return this._itemModeFromEntity(item);
    }

    const configured = resolveText(item.mode, this.hass);
    if (configured.kind === 'value') return normaliseItemMode(configured.value);

    return this._itemModeFromEntity(item) ?? 'auto';
  }

  /**
   * The mode the entities currently report, ignoring any local override.
   * `null` when nothing readable says what the mode is.
   */
  private _itemModeFromEntity(item: ThermalItemConfig): ItemMode | null {
    if (item.mode_entity) {
      const state = resolveText(item.mode_entity, this.hass);
      if (state.kind !== 'value') return null;
      // States arrive as strings like "2.0".
      const numeric = Math.round(Number.parseFloat(state.value));
      return MODE_BY_NUMBER[numeric] ?? null;
    }

    if (item.switch_entity) {
      const state = resolveText(item.switch_entity, this.hass);
      if (state.kind === 'value') {
        return state.value.trim().toLowerCase() === 'on' ? 'on' : 'off';
      }
    }
    return null;
  }

  // =========================================================================
  // variant: battery
  // =========================================================================

  private _renderBattery(config: DesStorageCardConfig): TemplateResult {
    const soc = resolveNumber(config.soc, this.hass);
    const capacity = resolveNumber(config.capacity_kwh, this.hass);
    const power = this._power(config);
    const energy = this._energy(config, soc, capacity);
    const status = this._status(config, power);
    const backup = this._backup(config);
    const remaining = this._timeRemaining(config, power);
    const at = resolveText(config.time_at, this.hass);
    const times = [remaining, at.kind === 'value' ? at.value : null].filter(
      (part): part is string => part !== null,
    );

    const showControls = config.controls !== false;

    return html`
      <div class="header">
        <div class="head-left">
          <span class="name">${config.name}</span>
          <span class="meta">${this._renderBatteryMeta(config, capacity)}</span>
        </div>
        <div class="badges">
          ${backup === 'none' ? nothing : this._renderBackupBadge(backup)}
          ${this._renderBadge(STATUS_LABEL[status], `status-${status}`)}
        </div>
      </div>

      <div
        class="main ${showControls ? 'clickable' : ''}"
        role=${showControls ? 'button' : 'presentation'}
        tabindex=${showControls ? 0 : -1}
        aria-expanded=${showControls ? String(this._expanded) : nothing}
        @click=${showControls ? this._toggleExpanded : nothing}
        @keydown=${showControls ? this._onMainKeydown : nothing}
      >
        ${this._renderBatteryIcon(soc)}
        <div class="readout">
          <span class="soc">
            ${soc.kind === 'value' ? `${formatInt(soc.value)} %` : this._dash()}
          </span>
          ${energy.kind === 'unset'
            ? nothing
            : html`<span class="energy">
                ${energy.kind === 'value'
                  ? `${formatFixed(energy.value)} kWh`
                  : this._dash()}
              </span>`}
        </div>
        <div class="timing">
          ${power.kind === 'unset'
            ? nothing
            : html`<div class=${this._powerClass(power)}>
                ${power.kind === 'value'
                  ? this._formatPower(power.value)
                  : this._dash()}
              </div>`}
          ${times.length === 0
            ? nothing
            : html`<div class="muted">${times.join(' · ')}</div>`}
        </div>
        ${showControls
          ? html`<ha-icon
              class="chevron ${this._expanded ? 'open' : ''}"
              icon="mdi:chevron-down"
            ></ha-icon>`
          : nothing}
      </div>

      ${showControls && this._expanded
        ? html`<div class="grow"></div>
            ${this._renderBatteryControls(config)}`
        : nothing}
    `;
  }

  /**
   * Two labelled slider rows on one grid, so labels, tracks and values line
   * up. The charge-mode control sits to their right, centred over both rows.
   */
  private _renderBatteryControls(config: DesStorageCardConfig): TemplateResult {
    const mode = this._chargeMode(config);
    const targetActive = mode === 'charge';
    const target = this._chargeTarget(config);
    const threshold = this._threshold(config);
    const targetRange = this._rangeFor(config.charge_target_pct, TARGET_RANGE);
    const thresholdRange = this._rangeFor(config.threshold_pct, THRESHOLD_RANGE);

    return html`
      <div class="controls">
        <div class="ctl-rows">
          <span class="ctl-label ${targetActive ? '' : 'disabled'}">Ladeziel</span>
          <input
            class="slider"
            type="range"
            min=${targetRange.min}
            max=${targetRange.max}
            step=${targetRange.step}
            .value=${String(target ?? targetRange.min)}
            ?disabled=${!targetActive}
            aria-label="Ladeziel"
            @input=${this._onTargetInput}
            @change=${this._onTargetChange}
          />
          <span class="ctl-value ${targetActive ? '' : 'disabled'}">
            ${target === null
              ? this._dash()
              : `${formatForStep(target, targetRange.step)} %`}
          </span>

          <span class="ctl-label">min. SoC</span>
          <input
            class="slider"
            type="range"
            min=${thresholdRange.min}
            max=${thresholdRange.max}
            step=${thresholdRange.step}
            .value=${String(threshold ?? thresholdRange.min)}
            aria-label="Minimaler Ladestand"
            @input=${this._onThresholdInput}
            @change=${this._onThresholdChange}
          />
          <span class="ctl-value">
            ${threshold === null
              ? this._dash()
              : `${formatForStep(threshold, thresholdRange.step)} %`}
          </span>
        </div>
        ${this._renderSegmented(
          CHARGE_MODES,
          mode,
          (value) => this._setChargeMode(value),
          'Lademodus',
        )}
      </div>
    `;
  }

  /** "6,6 kWh · 23,5 °C · min. 20 % SoC" - unset segments are dropped. */
  private _renderBatteryMeta(
    config: DesStorageCardConfig,
    capacity: Resolved<number>,
  ): TemplateResult {
    const temp = resolveNumber(config.temp_c, this.hass);
    const threshold = this._threshold(config);
    const parts: Array<TemplateResult | string> = [];

    if (capacity.kind === 'value') {
      parts.push(`${formatFixed(capacity.value)} kWh`);
    } else if (capacity.kind === 'unavailable') {
      parts.push(html`${this._dash()} kWh`);
    }

    if (temp.kind === 'value') {
      parts.push(
        html`<span class=${temperatureClass(temp.value)}>
          ${formatFixed(temp.value)} °C
        </span>`,
      );
    } else if (temp.kind === 'unavailable') {
      parts.push(html`${this._dash()} °C`);
    }

    parts.push(
      threshold === null
        ? html`min. ${this._dash()} SoC`
        : `min. ${formatForStep(
            threshold,
            this._rangeFor(config.threshold_pct, THRESHOLD_RANGE).step,
          )} % SoC`,
    );

    return html`${parts.map((part, index) =>
      index === 0 ? part : html` · ${part}`,
    )}`;
  }

  /** Upright battery; the fill grows from the bottom. */
  private _renderBatteryIcon(soc: Resolved<number>): TemplateResult {
    const level = soc.kind === 'value' ? clamp(soc.value, 0, 100) : 0;
    const fillColor =
      soc.kind !== 'value'
        ? 'transparent'
        : level > 50
          ? 'var(--success-color, #2e7d32)'
          : level >= 20
            ? 'var(--warning-color, #ff9800)'
            : 'var(--error-color, #d32f2f)';

    // Inner drawable area of the battery body: y 6..32, height 26.
    const innerY = 6;
    const innerH = 26;
    const fillH = (innerH * level) / 100;
    const fillY = innerY + (innerH - fillH);

    return html`
      <svg
        class="battery"
        viewBox="0 0 22 36"
        width="22"
        height="36"
        role="img"
        aria-label=${soc.kind === 'value'
          ? `Ladestand ${formatInt(level)} Prozent`
          : 'Ladestand unbekannt'}
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
    const powers = items.map((item) => resolveNumber(item.power_w, this.hass));
    const energies = items.map((item) => resolveNumber(item.energy_kwh, this.hass));

    const totalEnergy = this._sum(energies);
    const totalPower = this._sum(powers);
    const heatingCount = powers.filter(
      (power) => power.kind === 'value' && power.value > 0,
    ).length;

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
          <span class="soc">
            ${totalEnergy === null
              ? this._dash()
              : `${formatFixed(totalEnergy)} kWh`}
          </span>
          <span class="energy">heute eingespeichert</span>
        </div>
        <div class="timing">
          <div
            class=${totalPower !== null && totalPower > 0
              ? 'power positive'
              : 'power neutral'}
          >
            ${totalPower === null ? this._dash() : this._formatPower(totalPower)}
          </div>
        </div>
      </div>

      <div class="items">
        ${items.map((item, index) =>
          this._renderItem(item, index, powers[index]!, energies[index]!),
        )}
      </div>
    `;
  }

  /** Sums the values that resolved; null when none of them did. */
  private _sum(values: ReadonlyArray<Resolved<number>>): number | null {
    const usable = values.filter(
      (entry): entry is { kind: 'value'; value: number } => entry.kind === 'value',
    );
    if (usable.length === 0) return null;
    return usable.reduce((sum, entry) => sum + entry.value, 0);
  }

  private _renderItem(
    item: ThermalItemConfig,
    index: number,
    power: Resolved<number>,
    energy: Resolved<number>,
  ): TemplateResult {
    const heating = power.kind === 'value' && power.value > 0;

    return html`
      <div class="item">
        <span class="item-name">${item.name}</span>
        <span class="item-energy">
          ${energy.kind === 'value'
            ? `${formatFixed(energy.value)} kWh`
            : energy.kind === 'unavailable'
              ? this._dash()
              : ''}
        </span>
        <span class=${heating ? 'item-power positive' : 'item-power'}>
          ${power.kind === 'value'
            ? this._formatPower(power.value)
            : power.kind === 'unavailable'
              ? this._dash()
              : ''}
        </span>
        ${this._renderSegmented(
          ITEM_MODES,
          this._itemMode(item, index),
          (value) => this._setItemMode(index, value),
          `Modus ${item.name}`,
        )}
      </div>
    `;
  }

  // =========================================================================
  // shared
  // =========================================================================

  /** Muted placeholder for a value the card could not read. */
  private _dash(): TemplateResult {
    return html`<span class="unavail">–</span>`;
  }

  /** One segmented control, used for both charge mode and item modes. */
  private _renderSegmented<T extends string>(
    options: ReadonlyArray<{ value: T; label: string }>,
    active: T | null,
    onSelect: (value: T) => void,
    ariaLabel: string,
  ): TemplateResult {
    return html`
      <div
        class="seg ${active === null ? 'unknown' : ''}"
        role="group"
        aria-label=${ariaLabel}
        title=${active === null ? 'Zustand nicht lesbar' : nothing}
      >
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

  private _powerClass(power: Resolved<number>): string {
    if (power.kind !== 'value' || power.value === 0) return 'power neutral';
    return power.value < 0 ? 'power negative' : 'power positive';
  }

  private _formatPower(power: number): string {
    const watts = Math.round(power);
    return `${watts === 0 ? formatInt(0) : formatSignedInt(watts)} W`;
  }

  // --- interaction ---------------------------------------------------------
  //
  // Every handler updates the local state first so the UI reacts immediately,
  // then writes to the bound entity. A rejected write drops the local value,
  // which puts the control back on whatever the entity really says.

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
    this._chargeModeLocal = mode;

    const control = this._config?.charge_mode_control;
    if (!control?.entity || !isWritableChargeMode(control)) return;

    this._holdOptimistic('chargeMode', () => {
      this._chargeModeLocal = null;
    });
    void this._write(writeChargeMode(this.hass, control, mode), () => {
      this._clearSettle('chargeMode');
      this._chargeModeLocal = null;
    });
  }

  /** Dragging only moves the UI; the write happens on release. */
  private _onTargetInput(ev: Event): void {
    this._targetLocal = Number((ev.target as HTMLInputElement).value);
  }

  private _onThresholdInput(ev: Event): void {
    this._thresholdLocal = Number((ev.target as HTMLInputElement).value);
  }

  private _onTargetChange(ev: Event): void {
    const value = Number((ev.target as HTMLInputElement).value);
    this._targetLocal = value;
    this._scheduleNumberWrite('target', this._config?.charge_target_pct, value);
  }

  private _onThresholdChange(ev: Event): void {
    const value = Number((ev.target as HTMLInputElement).value);
    this._thresholdLocal = value;
    this._scheduleNumberWrite('threshold', this._config?.threshold_pct, value);
  }

  private _scheduleNumberWrite(
    which: 'threshold' | 'target',
    slot: NumberValue | undefined,
    value: number,
  ): void {
    // Statically configured sliders stay local, exactly as in phase 2.
    if (!isWritableNumber(slot)) return;
    const entityId = slot as string;

    const pending = this._writeTimers.get(which);
    if (pending !== undefined) window.clearTimeout(pending);

    this._writeTimers.set(
      which,
      window.setTimeout(() => {
        this._writeTimers.delete(which);
        this._holdOptimistic(which, () => {
          if (which === 'threshold') this._thresholdLocal = null;
          else this._targetLocal = null;
        });
        void this._write(writeNumber(this.hass, entityId, value), () => {
          this._clearSettle(which);
          if (which === 'threshold') this._thresholdLocal = null;
          else this._targetLocal = null;
        });
      }, WRITE_DEBOUNCE_MS),
    );
  }

  private _setItemMode(index: number, mode: ItemMode): void {
    const next = [...this._itemModesLocal];
    next[index] = mode;
    this._itemModesLocal = next;

    const item = this._config?.items?.[index];
    const release = () => {
      const revert = [...this._itemModesLocal];
      revert[index] = null;
      this._itemModesLocal = revert;
    };

    // With a mode entity the card writes the mode and leaves the switch alone -
    // the automation behind that entity decides when the heater actually runs.
    if (item?.mode_entity) {
      if (!isWritableNumber(item.mode_entity)) return;
      this._holdOptimistic(`item:${index}`, release);
      void this._write(
        writeNumber(this.hass, item.mode_entity, NUMBER_BY_MODE[mode]),
        () => {
          this._clearSettle(`item:${index}`);
          release();
        },
      );
      return;
    }

    const entityId = item?.switch_entity;
    // "Auto" hands control back to the surplus automation - nothing to call.
    if (mode === 'auto' || !isWritableSwitch(entityId)) return;

    this._holdOptimistic(`item:${index}`, release);
    void this._write(writeSwitch(this.hass, entityId as string, mode === 'on'), () => {
      this._clearSettle(`item:${index}`);
      release();
    });
  }

  /** Awaits a service call and runs `onFailure` if it rejects. */
  private async _write(call: Promise<unknown>, onFailure: () => void): Promise<void> {
    try {
      await call;
    } catch (error) {
      onFailure();
      // eslint-disable-next-line no-console
      console.error('des-storage-card: Service-Call fehlgeschlagen', error);
    }
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

    /* Placeholder for values the card could not read. */
    .unavail {
      color: var(--secondary-text-color);
      opacity: 0.7;
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

    .main.clickable {
      cursor: pointer;
      outline: none;
    }

    .main.clickable:focus-visible {
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

    .seg.unknown {
      opacity: 0.5;
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

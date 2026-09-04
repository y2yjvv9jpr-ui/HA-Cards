export type StorageVariant = 'battery' | 'thermal_group';

export type StorageStatus =
  | 'charging'
  | 'discharging'
  | 'idle'
  | 'heating'
  | 'off';

/**
 * Phase 2: every value slot takes a static value **or** an entity id.
 *
 * `resolve.ts` decides which is which - an entity id is `domain.object_id`,
 * so `6.55` and `4:36 h bis 20 %` stay literal values.
 */
export type NumberValue = number | string;

/**
 * Text slot: static text, an entity id, or a boolean.
 *
 * The boolean is not an oversight: Home Assistant parses with YAML 1.1, where
 * unquoted `off`/`on` arrive as `false`/`true`.
 */
export type TextValue = string | boolean;

export type BackupState = 'none' | 'ready' | 'active';

/** Emergency power read from an entity instead of a fixed state. */
export interface BackupEntityConfig {
  entity: string;
  /** States that mean "running on backup power". Compared case-insensitively. */
  active_states?: string[];
}

/** Battery: "charge" forces charging, "auto" is the normal control loop. */
export type ChargeMode = 'auto' | 'charge';

/**
 * Makes the Laden/Auto control write instead of only display.
 *
 * The service follows the entity's domain: `select`/`input_select` get
 * `select_option`, `switch`/`input_boolean` get `turn_on`/`turn_off`. For the
 * switch domains `charge_state`/`auto_state` default to `on`/`off`, so they
 * only have to be spelled out for selects.
 */
export interface ChargeModeControlConfig {
  entity: string;
  /** Option/state that means "charging is forced". */
  charge_state?: string;
  /** Option/state that means "back to the normal control loop". */
  auto_state?: string;
}

/** Thermal item: "auto" lets the surplus logic decide, on/off force it. */
export type ItemMode = 'on' | 'auto' | 'off';

export interface ThermalItemConfig {
  name: string;
  /** kWh stored into this item today. */
  energy_kwh?: NumberValue;
  /** Current heating power in W; `> 0` counts as heating. */
  power_w?: NumberValue;
  /** Start position of the toggle. Takes precedence over `switch_entity`. */
  mode?: TextValue;
  /** Falls back to this switch's state (`on`/`off`) when `mode` is unset. */
  switch_entity?: string;
}

/**
 * Phase 3: values come from the config or from `hass.states`, and every
 * control that is bound to an entity writes back to it. A statically
 * configured value keeps the phase-2 behaviour and stays purely local.
 */
export interface DesStorageCardConfig {
  type: string;
  variant: StorageVariant;
  name: string;

  // --- variant: battery ---------------------------------------------------

  /**
   * Status badge. Optional - when unset it is derived from `power_w`.
   * Accepts `charging`/`discharging`/`idle`/`standby`/`heating`/`off`,
   * `false` (unquoted YAML `off`), or an entity id.
   */
  status?: TextValue;
  /** State of charge in percent (0-100). */
  soc?: NumberValue;
  /** Nominal capacity in kWh, shown in the header meta line. */
  capacity_kwh?: NumberValue;
  /** Remaining energy in kWh. Optional - derived from soc x capacity. */
  energy_kwh?: NumberValue;
  /** Signed power in W: negative = discharging, positive = charging. */
  power_w?: NumberValue;
  /** With `current_entity`, supplies `power_w` as voltage x current. */
  voltage_entity?: string;
  /** With `voltage_entity`, supplies `power_w` as voltage x current. */
  current_entity?: string;
  /** Flips the sign of the resolved power. Default `false`. */
  invert_power?: boolean;
  /** Cell temperature in °C. `null` drops the segment from the meta line. */
  temp_c?: NumberValue | null;
  /** Minimum state of charge in percent; start value of the slider. */
  threshold_pct?: NumberValue;
  /** Target state of charge for forced charging; start value of the slider. */
  charge_target_pct?: NumberValue;
  /** Start value of the charge-mode control (display only). */
  charge_mode?: TextValue;
  /** Binds the Laden/Auto control to an entity so it writes back. */
  charge_mode_control?: ChargeModeControlConfig;
  /** Free text or entity, e.g. "4:36 h bis 20 %". Wins over the two below. */
  time_remaining?: TextValue;
  /** Used while charging (power > 0). */
  time_remaining_charging?: TextValue;
  /** Used while discharging or idle. */
  time_remaining_discharging?: TextValue;
  /** Free text or entity, e.g. "um 00:12". */
  time_at?: TextValue;
  /** Fixed state, or an entity plus the states that mean "active". */
  backup?: BackupState | BackupEntityConfig;
  /** `false` hides the control row and the chevron. Default `true`. */
  controls?: boolean;

  // --- variant: thermal_group ---------------------------------------------

  /** 1-5 heat sinks aggregated into one card. */
  items?: ThermalItemConfig[];
}

// ===========================================================================
// des-inverter-card
// ===========================================================================

/**
 * Which set of static demo values the card renders. Phase 1 has no entity
 * binding at all - the whole readout comes from a canned dataset so every
 * visual state can be checked from YAML alone.
 *
 * - `normal` - producing, everything OK.
 * - `alarm`  - grid overvoltage alarm plus an imbalanced string (amber bar).
 * - `night`  - all powers zero, device in standby.
 */
export type InverterDemoState = 'normal' | 'alarm' | 'night';

/** One MPPT string (PV1 / PV2). */
export interface InverterString {
  /** Current DC power in W. */
  power: number;
  /** DC voltage in V. */
  voltage: number;
  /** DC current in A. */
  current: number;
}

/** One AC phase (L1 / L2 / L3). */
export interface InverterPhase {
  /** Grid power in W: negative = feed-in, positive = import (before invert). */
  grid: number;
  /** Inverter AC output on this phase in W. */
  inverter: number;
  /** Grid voltage on this phase in V. */
  voltage: number;
}

/**
 * The full readout the card draws. In Phase 1 this is produced entirely from
 * static demo data; Phase 2 fills the same shape from `hass.states`.
 */
export interface InverterData {
  model: string;
  /** Energy produced today in kWh. */
  todayProduction: number;
  /** Lifetime energy in kWh. */
  totalProduction: number;
  /** Fault text; `"OK"` means no fault. */
  fault: string;
  /** Alarm text; `"OK"` means no alarm. */
  alarm: string;
  /** Human-readable device state, shown when neither fault nor alarm is set. */
  deviceState: string;
  /** Total PV power in W. */
  pvPower: number;
  /** Inverter (AC board) temperature in °C. */
  inverterTemp: number;
  /** DC-side temperature in °C. */
  dcTemp: number;
  /** Grid frequency in Hz. */
  gridFrequency: number;
  /** PV1, PV2. */
  strings: [InverterString, InverterString];
  /** L1, L2, L3. */
  phases: [InverterPhase, InverterPhase, InverterPhase];
}

/**
 * Phase 1 card. The `*_entity` slots are reserved for Phase 2 and are read by
 * nothing yet - the card renders the demo dataset picked by `demo_state`.
 */
export interface DesInverterCardConfig {
  type: string;
  name: string;

  /** Which static dataset to render. Default `normal`. */
  demo_state?: InverterDemoState;

  /** Shown in the meta line; falls back to the demo model when unset. */
  model?: string;

  /** Total installed peak power in kWp - drives the utilisation percentage. */
  kwp_total?: number;
  /** Peak power of string PV1 in kWp - full-scale for its bar. */
  kwp_pv1?: number;
  /** Peak power of string PV2 in kWp - full-scale for its bar. */
  kwp_pv2?: number;

  /** Flip the grid-power sign convention. Default `false`. */
  invert_grid?: boolean;
  /** Show the DC-temperature field in the expanded footer. Default `true`. */
  show_dc_temp?: boolean;

  /** Highlight a badly imbalanced string with an amber bar. Default `true`. */
  imbalance_warn?: boolean;
  /** A string counts as imbalanced below this fraction of the other. Default `0.5`. */
  imbalance_ratio?: number;
  /** ...but only while the other string exceeds this many watts. Default `500`. */
  imbalance_min_w?: number;

  // --- reserved for Phase 2 (entity binding) - unused in Phase 1 -----------
  pv_power_entity?: string;
  today_production_entity?: string;
  total_production_entity?: string;
  fault_entity?: string;
  alarm_entity?: string;
  device_state_entity?: string;
  inverter_temp_entity?: string;
  dc_temp_entity?: string;
  grid_frequency_entity?: string;
  pv1_power_entity?: string;
  pv1_voltage_entity?: string;
  pv1_current_entity?: string;
  pv2_power_entity?: string;
  pv2_voltage_entity?: string;
  pv2_current_entity?: string;
  grid_power_entities?: string[];
  inverter_power_entities?: string[];
  grid_voltage_entities?: string[];
}

/** Minimal shape of the Home Assistant object handed to a card. */
export interface HomeAssistant {
  states: Record<
    string,
    { state: string; attributes?: Record<string, unknown> } | undefined
  >;
  /** Optional so a card handed a bare `hass` stub still renders. */
  callService?: (
    domain: string,
    service: string,
    data?: Record<string, unknown>,
  ) => Promise<unknown> | unknown;
  themes?: unknown;
  locale?: { language?: string };
}

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
  }
}

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
  /**
   * `input_number` holding the mode: 1 = An, 2 = Auto, 3 = Aus.
   *
   * When set it both drives and receives the toggle, and `switch_entity`
   * becomes read-only - the automation behind the mode entity owns the switch.
   */
  mode_entity?: string;
  /** Start position of the toggle. Used when `mode_entity` is unset. */
  mode?: TextValue;
  /**
   * Without `mode_entity` the toggle reads and writes this switch directly.
   * With `mode_entity` it is only read (heating state).
   */
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
  /**
   * Scales the resolved power. Default `1`.
   *
   * For a summed entity that several cards share: two house batteries behind
   * one inverter total get `0.5` each. Applies to the power only - never to
   * soc, capacity or the remaining times.
   */
  power_share?: NumberValue;
  /**
   * Below this many watts (absolute) the battery reads as idle. Default `20`.
   *
   * Keeps standby currents from being reported as discharging.
   */
  idle_threshold_w?: NumberValue;
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
 * The static demo dataset (`demo_state`). Phase 2 reads the live readout from
 * entities into a nullable view model of the same shape; this stays the
 * fallback whenever no `*_entity` field is configured.
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
 * Phase 2, read-only. As soon as any `*_entity` field is set the card reads the
 * whole readout from `hass.states` and `demo_state` is ignored; with no entity
 * field it falls back to the static demo dataset. Values scale onto the card's
 * base units by the entity's `unit_of_measurement` (kW/MW → W, Wh/MWh → kWh).
 */
export interface DesInverterCardConfig {
  type: string;
  name: string;

  /** Static demo dataset, used only when no `*_entity` field is set. Default `normal`. */
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

  // --- entity binding (read-only) -----------------------------------------

  /** Total PV power. Falls back to the sum of the two strings when unset. */
  pv_power_entity?: string;
  /** Energy produced today (kWh). */
  today_production_entity?: string;
  /** Lifetime energy (kWh). */
  total_production_entity?: string;
  /** Fault text; `OK`/unavailable means no fault (red pill otherwise). */
  fault_entity?: string;
  /** Alarm text; `OK`/unavailable means no alarm (amber pill otherwise). */
  alarm_entity?: string;
  /** Device state shown when neither fault nor alarm is raised. Default "Normal". */
  device_state_entity?: string;
  /** Inverter (AC board) temperature (°C). */
  inverter_temp_entity?: string;
  /** DC-side temperature (°C), footer. */
  dc_temp_entity?: string;
  /** Grid frequency (Hz), footer. */
  grid_frequency_entity?: string;
  /** String PV1 power / voltage / current. */
  pv1_power_entity?: string;
  pv1_voltage_entity?: string;
  pv1_current_entity?: string;
  /** String PV2 power / voltage / current. */
  pv2_power_entity?: string;
  pv2_voltage_entity?: string;
  pv2_current_entity?: string;
  /** Grid power per phase `[L1, L2, L3]` (signed; see `invert_grid`). */
  grid_power_entities?: string[];
  /** Inverter AC output per phase `[L1, L2, L3]`. */
  inverter_power_entities?: string[];
  /** Grid voltage per phase `[L1, L2, L3]`. */
  grid_voltage_entities?: string[];
}

// ===========================================================================
// des-house-card
// ===========================================================================

/**
 * Which set of static demo values the card renders. Like the inverter card,
 * phase 1 has no entity binding: the whole readout comes from a canned dataset
 * so every visual state can be checked from YAML alone.
 *
 * - `normal` - solar-dominated day with a small grid draw and some discharge.
 * - `night`  - no solar and no grid, the battery covers the whole house.
 * - `export` - surplus solar, house fully self-supplied and feeding the grid.
 */
export type HouseDemoState = 'normal' | 'night' | 'export';

/** What a positive value on a `storage_power_entities` entry means. */
export type StoragePositive = 'discharge' | 'charge';

/**
 * Phase 1 + 2 in one, read-only. As soon as any of the load/grid/storage/today
 * entity fields is set the card reads its whole readout from `hass.states` and
 * `demo_state` is ignored; with no entity field it falls back to the static
 * demo dataset. Power values scale onto W and energy values onto kWh by the
 * entity's `unit_of_measurement` (kW/MW → W, Wh/MWh → kWh), like the inverter
 * card.
 */
export interface DesHouseCardConfig {
  type: string;
  name: string;

  /** Static demo dataset, used only when no entity field is set. Default `normal`. */
  demo_state?: HouseDemoState;

  /** Flip the grid-power sign convention. Default `false` (positive = draw). */
  invert_grid?: boolean;
  /** Whether a positive storage power means discharging or charging. Default `discharge`. */
  storage_positive?: StoragePositive;
  /**
   * Grid deadband in W for the status pill only. Default `40`.
   *
   * While `|grid|` stays below this, the pill reads a neutral "Netz … W"
   * instead of Netzbezug/Einspeisung - a hybrid inverter always draws a little
   * from the grid, and that trickle should not paint the pill red. The mix bar
   * and its percentages are unaffected.
   */
  grid_min_w?: number;

  // --- entity binding (read-only) -----------------------------------------

  /**
   * Total PV power in W. When set (and readable) the solar share is measured
   * as `pv − feed-in − storage charging` and the mix is scaled by the sum of
   * the sources instead of by the metered consumption. Unset: solar is the
   * remainder of the load.
   */
  pv_power_entity?: string;
  /** House consumption in W. */
  load_power_entity?: string;
  /** Grid power in W (signed; see `invert_grid`). */
  grid_power_entity?: string;
  /** One entry per storage that feeds the house, each signed power in W. */
  storage_power_entities?: string[];
  /** Energy consumed today (kWh). */
  today_consumption_entity?: string;
  /** Energy imported from the grid today (kWh). */
  today_import_entity?: string;
  /** Energy exported to the grid today (kWh). */
  today_export_entity?: string;
  /** Self-sufficiency in percent; when set it replaces the computed value. */
  autarky_entity?: string;
}

// ===========================================================================
// des-stats-card
// ===========================================================================

/** The four periods the statistics card can switch between. */
export type StatsPeriod = 'day' | 'week' | 'month' | 'year';

/**
 * One period's six energy figures, each in kWh. Every field is optional and
 * takes a static value or an entity id; `charge`/`discharge` also take a list
 * that is summed (several batteries). A period whose block is missing or whose
 * every field is empty is dropped from the period switcher.
 */
export interface StatsPeriodConfig {
  consumption?: NumberValue;
  production?: NumberValue;
  import?: NumberValue;
  export?: NumberValue;
  charge?: NumberValue | NumberValue[];
  discharge?: NumberValue | NumberValue[];
}

/**
 * Phase 1 + 2 in one, read-only. With a `periods` block the card reads its
 * figures from `hass.states`; with none it falls back to a static demo dataset
 * (editor preview). Energy values scale onto kWh by `unit_of_measurement`
 * (Wh → /1000, MWh → ×1000). The chosen period lives in component state and is
 * never written back to Home Assistant.
 */
export interface DesStatsCardConfig {
  type: string;
  name: string;
  /** Period selected on load; falls back to the first available one. Default `day`. */
  default_period?: StatsPeriod;
  periods?: Partial<Record<StatsPeriod, StatsPeriodConfig>>;
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

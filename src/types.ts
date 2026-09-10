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

export type BackupState = 'none' | 'ready' | 'active' | 'off';

/** Emergency power read from an entity instead of a fixed state. */
export interface BackupEntityConfig {
  entity: string;
  /**
   * States that mean the emergency outlet is on/ready. Compared
   * case-insensitively. A match reads as green "Notstrom bereit", anything else
   * as red "Notstrom aus".
   */
  active_states?: string[];
  /**
   * Optional switch (`switch`/`input_boolean`) for the emergency outlet. When
   * set, the expanded controls carry a "Notstromsteckdose" row that toggles it.
   */
  switch_entity?: string;
}

/**
 * Battery: "charge" forces charging, "auto" is the normal control loop, "off"
 * is a standby that only exists when `charge_mode_control.off_state` is set.
 */
export type ChargeMode = 'auto' | 'charge' | 'off';

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
  /**
   * Option/state that means "standby, automations off". Only for
   * `select`/`input_select` entities; setting it makes the control three-part
   * (Laden | Auto | Aus) and moves it onto its own row above the sliders.
   */
  off_state?: string;
}

/** One pack of a multi-pack battery, shown as a compact table row when expanded. */
export interface BatteryPackConfig {
  name: string;
  /** State of charge in percent. */
  soc?: NumberValue;
  /** Nominal capacity in kWh; with `soc` it yields the stored-energy column. */
  capacity_kwh?: NumberValue;
  /** Cell temperature in °C; coloured on the same traffic-light as the header. */
  temp_c?: NumberValue;
  /** Cell-balance text, shown in the "Zellen" column as reported by the sensor. */
  balance?: TextValue;
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
  /** Overrides the `battery` profile's upper warn threshold (°C). */
  temp_warn_c?: number;
  /** Overrides the `battery` profile's upper alert threshold (°C). */
  temp_alert_c?: number;
  /** Minimum state of charge in percent; start value of the slider. */
  threshold_pct?: NumberValue;
  /** Charge limit (max. SoC), valid in every mode; start value of the slider. */
  charge_target_pct?: NumberValue;
  /**
   * Maximum discharge power in W. When set, a third slider "max. Entladen" is
   * shown; its min/max/step come from the entity's own attributes and it writes
   * back via `input_number.set_value`, always operable regardless of the mode.
   */
  discharge_limit_entity?: string;
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
  /**
   * Optional per-pack rows in the expanded area: name, soc, temperature and
   * cell balance. For a battery made of several packs (e.g. a Zendure).
   */
  packs?: BatteryPackConfig[];

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
  /** Inverter (AC board) temperature (°C), shown as a pill in the header. */
  inverter_temp_entity?: string;
  /** DC-side temperature (°C), footer. */
  dc_temp_entity?: string;
  /** Overrides the `inverter` profile's upper warn threshold (°C). Default 60. */
  temp_warn_c?: number;
  /** Overrides the `inverter` profile's upper alert threshold (°C). Default 75. */
  temp_alert_c?: number;
  /** Grid frequency (Hz), footer. */
  grid_frequency_entity?: string;

  // --- clock monitoring ----------------------------------------------------

  /**
   * `datetime` entity carrying the inverter's own clock. Without it none of
   * the clock display appears at all.
   */
  time_entity?: string;
  /** Deviation in minutes from which the clock is flagged. Default 2. */
  time_warn_minutes?: number;
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

  // --- chart sources ------------------------------------------------------
  // The stacked-area chart below the mix bar. All optional; omitted fields use
  // Daniel's helpers as defaults. The "Tag" period reads instantaneous power
  // (W); Woche/Monat/Jahr read energy (kWh) from long-term statistics and are
  // only offered when all three energy entities are present (set one to "" to
  // drop them and show only "Tag").

  /** Day series: solar power in W. Default `sensor.pv_helper_solar_direkt_leistung`. */
  solar_power_entity?: string;
  /** Day series: storage power in W (only the positive/discharge part is shown).
   *  Default `sensor.pv_helper_speicher_leistung`. */
  storage_power_entity?: string;
  // grid_power_entity (above) doubles as the day grid series (positive = draw).

  /** Week/Month/Year series: solar energy in kWh. Default `sensor.pv_helper_energie_solar_direkt`. */
  solar_energy_entity?: string;
  /** Week/Month/Year series: storage discharge energy in kWh. Default `sensor.pv_helper_energie_entladen_gesamt`. */
  storage_energy_entity?: string;
  /** Week/Month/Year series: grid import energy in kWh. Default `sensor.pv_helper_energie_import_gesamt`. */
  grid_energy_entity?: string;
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

// ===========================================================================
// des-chart-card
// ===========================================================================

/** One period's embedded chart plus its labels. */
export interface ChartPeriodConfig {
  /** Segment label; falls back to Tag/Woche/Monat/Jahr. */
  label?: string;
  /** Muted line under the header for this period. */
  meta?: string;
  /**
   * A full `apexcharts-card` config **without** `type`. The card adds
   * `type: custom:apexcharts-card` and forces `header.show: false`. A period
   * without a `chart` is dropped from the switcher.
   */
  chart?: Record<string, unknown>;
}

/**
 * A header with a local (component-state) period switcher over an embedded
 * `apexcharts-card`, one chart config per period. The chart element is built
 * through Home Assistant's own card helpers, so no chart library is bundled.
 * Without a `periods` block the card shows a Tag/Woche/Monat/Jahr demo header
 * and a "Keine Chart-Config" hint.
 */
export interface DesChartCardConfig {
  type: string;
  name: string;
  /** Period selected on load; falls back to the first available one. Default `day`. */
  default_period?: StatsPeriod;
  periods?: Partial<Record<StatsPeriod, ChartPeriodConfig>>;
}

// ===========================================================================
// des-dehumidifier-card
// ===========================================================================

/** How loud a fault reads: `error` = red pill, `warning` = amber pill. */
export type FaultSeverity = 'error' | 'warning';

/**
 * One fault indicator. The pill only appears while the `binary_sensor` is
 * `on`; the order of the `faults` list is the order of the pills.
 */
export interface DehumidifierFaultConfig {
  /** A `binary_sensor` (or any entity whose `on` state means "fault active"). */
  entity: string;
  /** Pill label, e.g. "Tank voll". */
  name: string;
  /** Colour of the pill. Default `error`. */
  severity?: FaultSeverity;
}

/**
 * Phase 1 + 2 in one, like the other cards: with no entities the card shows a
 * canned demo (52 % ist, 45 % target, device on, no fault, a synthetic 24-h
 * trace); as soon as the live entities are configured it reads and writes them.
 *
 * The target humidity is read from the `humidifier` entity's `humidity`
 * attribute and written with `humidifier.set_humidity`. Power binds to a
 * `fan`/`switch`/`input_boolean`, Max-Trocknen to a `select`, the child lock to
 * a `switch`.
 */
export interface DesDehumidifierCardConfig {
  type: string;
  /** Header title. Default "Luftentfeuchter". */
  name?: string;
  /** First part of the meta line, e.g. "Arbeitszimmer". Optional. */
  location?: string;

  /** Current relative humidity in percent. Required for live operation. */
  humidity_entity?: string;
  /**
   * `humidifier` entity. Supplies the target (its `humidity` attribute) and
   * receives `humidifier.set_humidity`.
   */
  humidifier_entity?: string;
  /** On/off of the device: `fan`/`switch`/`input_boolean`. */
  power_entity?: string;
  /** Max-Trocknen countdown: a `select`; options come from the entity. */
  countdown_entity?: string;
  /** The countdown option that means "off". Default "Abbrechen". */
  countdown_off_option?: string;
  /** Optional child-lock `switch`. */
  child_lock_entity?: string;
  /** Fault indicators, in pill order. Optional. */
  faults?: DehumidifierFaultConfig[];

  /** Chart time span in hours. Default 24. */
  history_hours?: number;
  /** Bar / slider lower bound in percent. Default 30. */
  target_min?: number;
  /** Bar / slider upper bound in percent. Default 80. */
  target_max?: number;
  /** Slider step in percent. Default 5. */
  target_step?: number;
}

// ===========================================================================
// des-cover-card
// ===========================================================================

/**
 * A declarative service call: `service` is `domain.service`, `target` carries
 * the entity/device/area, `data` the service data. Used by the cover card's
 * scene tiles and drivable through `service.ts`' `callAction`.
 */
export interface HassServiceCall {
  service: string;
  target?: Record<string, unknown>;
  data?: Record<string, unknown>;
}

/** One scene tile in the cover card's tile row. */
export interface CoverSceneConfig {
  name: string;
  /** Optional `mdi:…` icon. */
  icon?: string;
  /** The action fired on tap. */
  action: HassServiceCall;
}

/** One roller shutter in a section. */
export interface CoverItemConfig {
  entity: string;
  /** Label shown in the expanded per-cover row. */
  name: string;
}

/** One floor / group of covers in the expanded area. */
export interface CoverSectionConfig {
  name: string;
  covers: CoverItemConfig[];
}

/**
 * Phase 1 + 2 in one, like the other cards. With no entities the card shows a
 * canned demo (group at 65 %, mixed individual positions); as soon as
 * `group_entity` or `sections` are configured it reads and writes them.
 *
 * Positions are the raw Home Assistant cover position (100 = fully open, full
 * bar). Covers are driven with `cover.open_cover`/`close_cover`/`stop_cover`
 * and `cover.set_cover_position`; scene tiles fire an arbitrary service call.
 */
export interface DesCoverCardConfig {
  type: string;
  /** Header title. Default "Rollläden". */
  name?: string;
  /** Cover group for the "Haus" group row (e.g. `cover.rollladen`). */
  group_entity?: string;
  /** 1-6 scene tiles, in order. */
  scenes?: CoverSceneConfig[];
  /** Floors / groups, each with its covers; shown when expanded. */
  sections?: CoverSectionConfig[];
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
  /**
   * Home Assistant's WebSocket call. Optional so a bare `hass` stub still
   * renders; the dehumidifier card uses it for `history/history_during_period`.
   */
  callWS?: <T = unknown>(message: Record<string, unknown>) => Promise<T>;
  /**
   * Frontend state formatter. Returns the translated display for an entity's
   * state, or for a specific `state` value (e.g. a select option). Optional so a
   * bare `hass` stub still renders; the dehumidifier card uses it for the
   * countdown labels and falls back to the raw value.
   */
  formatEntityState?: (
    stateObj: { state: string; attributes?: Record<string, unknown> } | undefined,
    state?: string,
  ) => string;
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

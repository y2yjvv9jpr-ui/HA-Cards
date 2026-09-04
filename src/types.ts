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
 * Phase 2 is read-only: values come from the config or from `hass.states`,
 * but the controls still only change local display state. Phase 3 adds the
 * service calls that write back.
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
  /** Start value of the charge-mode control. */
  charge_mode?: TextValue;
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

/** Minimal shape of the Home Assistant object handed to a card. */
export interface HomeAssistant {
  states: Record<
    string,
    { state: string; attributes?: Record<string, unknown> } | undefined
  >;
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

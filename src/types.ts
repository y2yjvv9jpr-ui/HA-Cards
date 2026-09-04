export type StorageVariant = 'battery' | 'thermal_group';

export type StorageStatus =
  | 'charging'
  | 'discharging'
  | 'idle'
  | 'heating'
  | 'off';

/**
 * What may actually appear in YAML for `status`.
 *
 * Home Assistant parses with YAML 1.1, where unquoted `off` becomes the
 * boolean `false` - so the card has to accept `false` as well. `standby` is
 * an accepted alias for `idle`.
 */
export type StatusConfigValue = StorageStatus | 'standby' | false;

export type BackupState = 'none' | 'ready' | 'active';

/** Battery: "charge" forces charging, "auto" is the normal control loop. */
export type ChargeMode = 'auto' | 'charge';

/** Thermal item: "auto" lets the surplus logic decide, on/off force it. */
export type ItemMode = 'on' | 'auto' | 'off';

/** Same YAML 1.1 trap as `status`: unquoted `on`/`off` arrive as booleans. */
export type ItemModeConfigValue = ItemMode | boolean;

export interface ThermalItemConfig {
  name: string;
  /** kWh stored into this item today. */
  energy_kwh?: number;
  /** Current heating power in W; > 0 means it is heating. */
  power_w?: number;
  mode?: ItemModeConfigValue;
}

/**
 * Phase 1: every value below is a plain static value taken straight from YAML.
 *
 * The keys are deliberately named after the *value* they carry (soc,
 * power_w, energy_kwh, ...) and not after their source, so that phase 2 can
 * widen each of these types to `number | string` and accept an entity id in
 * exactly the same slot:
 *
 *   soc: 62                 # phase 1 - static
 *   soc: sensor.akku_soc    # phase 2 - entity, same key
 *
 * See `resolveNumber()` / `resolveString()` in `resolve.ts` - that is the one
 * place that has to learn about `hass.states` later.
 */
export interface DesStorageCardConfig {
  type: string;
  variant: StorageVariant;
  name: string;

  // --- variant: battery ---------------------------------------------------

  /** Battery only. Drives the status badge. */
  status?: StatusConfigValue;
  /** State of charge in percent (0-100). */
  soc?: number;
  /** Nominal capacity in kWh, shown in the header meta line. */
  capacity_kwh?: number;
  /** Remaining energy in kWh. */
  energy_kwh?: number;
  /** Signed power in W: negative = discharging, positive = charging. */
  power_w?: number;
  /** Cell temperature in °C. `null` drops the segment from the meta line. */
  temp_c?: number | null;
  /** Discharge threshold in percent; start value of the slider. */
  threshold_pct?: number;
  /** Start value of the mode button. */
  charge_mode?: ChargeMode;
  /** Free text, e.g. "4:36 h bis 20 %". */
  time_remaining?: string | null;
  /** Free text, e.g. "um 00:12". */
  time_at?: string | null;
  /** Emergency power badge. Hidden when "none". */
  backup?: BackupState;

  // --- variant: thermal_group ---------------------------------------------

  /** 1-5 heat sinks aggregated into one card. */
  items?: ThermalItemConfig[];
}

/** Minimal shape of the Home Assistant object handed to a card. */
export interface HomeAssistant {
  states: Record<string, { state: string; attributes: Record<string, unknown> }>;
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

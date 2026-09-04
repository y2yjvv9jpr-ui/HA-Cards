export type StorageVariant = 'battery' | 'thermal';

export type StorageStatus =
  | 'charging'
  | 'discharging'
  | 'idle'
  | 'heating'
  | 'off';

export type BackupState = 'none' | 'ready' | 'active';

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
  status: StorageStatus;

  /** Battery only: state of charge in percent (0-100). */
  soc?: number;
  /** Battery only: nominal capacity in kWh. */
  capacity_kwh?: number;
  /** Battery: remaining energy in kWh. Thermal: kWh stored today. */
  energy_kwh?: number;
  /** Signed power in W: negative = discharging, positive = charging/heating. */
  power_w?: number;
  /** Battery: cell temperature in °C. `null` hides the row entirely. */
  temp_c?: number | null;
  /** Battery only: discharge threshold in percent. */
  threshold_pct?: number;
  /** Free text, e.g. "4:36 h bis 50 %". */
  time_remaining?: string | null;
  /** Free text, e.g. "um 00:12". */
  time_at?: string | null;
  /** Emergency power badge. Hidden when "none". */
  backup?: BackupState;
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

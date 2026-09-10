import { css, html, type TemplateResult } from 'lit';

/**
 * Shared temperature colouring for every card that shows a °C value. Keeping the
 * thresholds, the level logic and the pill look in one place is what stops the
 * cards from drifting apart (before this, only des-storage-card knew the
 * battery thresholds and des-inverter-card coloured nothing at all).
 */

export type TemperatureLevel = 'neutral' | 'warn' | 'alert';

/** Which set of thresholds applies. */
export type TemperatureProfile = 'battery' | 'inverter';

interface ProfileThresholds {
  /** Below this → alert (too cold). `null` = no cold limit. */
  coldAlert: number | null;
  /** Below this → warn (cold). `null` = no cold limit. */
  coldWarn: number | null;
  /** Above this → warn (warm). */
  hotWarn: number;
  /** Above this → alert (hot). */
  hotAlert: number;
}

/**
 * - `battery`  — cells dislike heat and cold alike: < 4 alert, < 8 warn,
 *   > 40 warn, > 50 alert (the values des-storage-card has always used).
 * - `inverter` — only the upper end matters: > 60 warn, > 75 alert, no cold
 *   limits.
 */
const PROFILES: Record<TemperatureProfile, ProfileThresholds> = {
  battery: { coldAlert: 4, coldWarn: 8, hotWarn: 40, hotAlert: 50 },
  inverter: { coldAlert: null, coldWarn: null, hotWarn: 60, hotAlert: 75 },
};

/**
 * Per-card override of the profile's **upper** thresholds (`temp_warn_c` /
 * `temp_alert_c`). A non-finite or missing value keeps the profile default; the
 * cold limits are never overridden.
 */
export interface TemperatureOverride {
  warn?: number;
  alert?: number;
}

function upper(value: number | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

/**
 * The traffic-light level for a temperature under the given profile. Alert wins
 * over warn; the upper thresholds can be raised or lowered per card.
 */
export function temperatureLevel(
  temp: number,
  profile: TemperatureProfile,
  override?: TemperatureOverride,
): TemperatureLevel {
  const base = PROFILES[profile];
  const hotWarn = upper(override?.warn, base.hotWarn);
  const hotAlert = upper(override?.alert, base.hotAlert);

  if ((base.coldAlert !== null && temp < base.coldAlert) || temp > hotAlert) {
    return 'alert';
  }
  if ((base.coldWarn !== null && temp < base.coldWarn) || temp > hotWarn) {
    return 'warn';
  }
  return 'neutral';
}

/**
 * The shared pill look: a tinted rounded badge whose colour follows the level.
 * Drop `temperaturePillStyles` into a component's `static styles` array and
 * render the pill with `renderTemperaturePill`.
 */
export const temperaturePillStyles = css`
  .temp-pill {
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
    /* Fallback for browsers without color-mix(); overridden per level below. */
    background: rgba(127, 127, 127, 0.16);
    background: color-mix(
      in srgb,
      var(--secondary-text-color, #727272) 16%,
      transparent
    );
    color: var(--secondary-text-color);
  }

  .temp-pill.warn {
    background: rgba(255, 152, 0, 0.16);
    background: color-mix(in srgb, var(--warning-color, #ff9800) 16%, transparent);
    color: var(--warning-color, #ff9800);
  }

  .temp-pill.alert {
    background: rgba(211, 47, 47, 0.16);
    background: color-mix(in srgb, var(--error-color, #d32f2f) 16%, transparent);
    color: var(--error-color, #d32f2f);
  }

  /* Metric centring puts the glyphs visually too high with line-height:1; nudge
     the text down, exactly as the storage card's other badges do. */
  .temp-pill-label {
    display: block;
    transform: translateY(1px);
  }
`;

/** One temperature pill; `label` is the formatted value, e.g. "51,6 °C". */
export function renderTemperaturePill(
  label: string | TemplateResult,
  level: TemperatureLevel,
): TemplateResult {
  return html`<span class="temp-pill ${level}">
    <span class="temp-pill-label">${label}</span>
  </span>`;
}

import type { HomeAssistant } from './types';

/**
 * Single seam between "static value from YAML" and "value from an entity".
 *
 * Phase 1 only ever sees numbers/strings and passes them through. Phase 2
 * adds the `typeof value === 'string'` branch that looks the id up in
 * `hass.states` - no call site has to change.
 */
export function resolveNumber(
  value: number | string | null | undefined,
  _hass?: HomeAssistant,
): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  // Phase 2: look up `value` as an entity id in `_hass.states` here.
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function resolveString(
  value: string | null | undefined,
  _hass?: HomeAssistant,
): string | null {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text.length > 0 ? text : null;
}

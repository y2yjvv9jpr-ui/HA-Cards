import type { HomeAssistant } from './types';

/** States that carry no usable value. */
const NO_VALUE = new Set(['unavailable', 'unknown', 'none', 'null', '']);

/**
 * `domain.object_id`.
 *
 * Deliberately stricter than "contains a dot": free text like `4:36 h bis 20 %`
 * and decimals like `6.55` must never be mistaken for an entity id.
 */
const ENTITY_ID = /^[a-z][a-z0-9_]*\.[a-z0-9_]+$/;

/**
 * Deliberately not a `value is string` type predicate: callers have already
 * narrowed to `string` at that point, so the predicate would narrow the else
 * branch to `never`.
 */
export function isEntityId(value: unknown): boolean {
  return typeof value === 'string' && ENTITY_ID.test(value);
}

/**
 * Three outcomes a config slot can have, kept apart on purpose:
 *
 * - `unset`       - not configured at all; the caller may derive or omit it.
 * - `value`       - a usable value, static or read from an entity.
 * - `unavailable` - configured, but the entity is missing/unavailable/unknown.
 *                   The card renders a muted "–" for these instead of guessing.
 */
export type Resolved<T> =
  | { kind: 'unset' }
  | { kind: 'value'; value: T }
  | { kind: 'unavailable' };

const UNSET = { kind: 'unset' } as const;
const UNAVAILABLE = { kind: 'unavailable' } as const;

/** Raw state string of an entity, or null when it carries no usable value. */
export function entityState(
  entityId: string,
  hass?: HomeAssistant,
): string | null {
  const entity = hass?.states?.[entityId];
  if (!entity || typeof entity.state !== 'string') return null;
  const state = entity.state.trim();
  return NO_VALUE.has(state.toLowerCase()) ? null : state;
}

/**
 * A numeric attribute of an entity, e.g. the `min`/`max`/`step` a
 * `number`/`input_number` publishes. `null` when it is absent or unusable.
 */
export function entityNumberAttribute(
  entityId: string,
  hass: HomeAssistant | undefined,
  name: string,
): number | null {
  const raw = hass?.states?.[entityId]?.attributes?.[name];
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null;
  if (typeof raw === 'string') {
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

/**
 * The `unit_of_measurement` of an entity, trimmed and lower-cased, or null.
 * Lets a caller rescale e.g. a `kW` power onto the `W` the card expects.
 */
export function entityUnit(
  entityId: string,
  hass?: HomeAssistant,
): string | null {
  const raw = hass?.states?.[entityId]?.attributes?.unit_of_measurement;
  if (typeof raw !== 'string') return null;
  const unit = raw.trim().toLowerCase();
  return unit.length > 0 ? unit : null;
}

/** Static number, numeric string, or an entity whose state parses as a number. */
export function resolveNumber(
  raw: number | string | boolean | null | undefined,
  hass?: HomeAssistant,
): Resolved<number> {
  if (raw === null || raw === undefined || typeof raw === 'boolean') return UNSET;
  if (typeof raw === 'number') {
    return Number.isFinite(raw) ? { kind: 'value', value: raw } : UNAVAILABLE;
  }

  if (isEntityId(raw)) {
    const state = entityState(raw, hass);
    if (state === null) return UNAVAILABLE;
    const parsed = Number.parseFloat(state);
    return Number.isFinite(parsed) ? { kind: 'value', value: parsed } : UNAVAILABLE;
  }

  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? { kind: 'value', value: parsed } : UNAVAILABLE;
}

/**
 * Static text, or an entity's state string.
 *
 * Booleans become `on`/`off` so the YAML 1.1 trap (`status: off` parsing as
 * `false`) resolves the same way as the quoted spelling.
 */
export function resolveText(
  raw: string | boolean | number | null | undefined,
  hass?: HomeAssistant,
): Resolved<string> {
  if (raw === null || raw === undefined) return UNSET;
  if (typeof raw === 'boolean') return { kind: 'value', value: raw ? 'on' : 'off' };
  if (typeof raw === 'number') return { kind: 'value', value: String(raw) };

  if (isEntityId(raw)) {
    const state = entityState(raw, hass);
    return state === null ? UNAVAILABLE : { kind: 'value', value: state };
  }

  const text = raw.trim();
  return text.length > 0 ? { kind: 'value', value: text } : UNSET;
}

/** Convenience for callers that treat "unset" and "unavailable" alike. */
export function valueOr<T>(resolved: Resolved<T>, fallback: T): T {
  return resolved.kind === 'value' ? resolved.value : fallback;
}

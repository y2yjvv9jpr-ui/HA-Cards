import { isEntityId } from './resolve';
import type { ChargeModeControlConfig, HomeAssistant } from './types';

/** Domains whose value is written with `set_value`. */
const NUMBER_DOMAINS = new Set(['number', 'input_number']);
/** Domains switched with `turn_on` / `turn_off`. */
const SWITCH_DOMAINS = new Set(['switch', 'input_boolean']);
/** Domains whose option is picked with `select_option`. */
const SELECT_DOMAINS = new Set(['select', 'input_select']);
/**
 * Domains switched on/off as a power toggle. Like `SWITCH_DOMAINS` plus `fan`:
 * a `fan` entity is turned on/off with the very same `turn_on`/`turn_off`
 * services, so the dehumidifier's power line can bind to `fan.…`,
 * `switch.…` or `input_boolean.…` alike.
 */
const POWER_DOMAINS = new Set(['fan', 'switch', 'input_boolean']);

/** States that count as "on" when a switch-like entity carries a state name. */
const ON_STATES = new Set(['on', 'true', '1', 'yes', 'an', 'ein']);

export function domainOf(entityId: string): string {
  const dot = entityId.indexOf('.');
  return dot === -1 ? '' : entityId.slice(0, dot);
}

function isWritable(target: unknown, domains: ReadonlySet<string>): boolean {
  return (
    typeof target === 'string' &&
    isEntityId(target) &&
    domains.has(domainOf(target))
  );
}

/** True when this slot can be written back - i.e. it is a number entity. */
export function isWritableNumber(target: unknown): boolean {
  return isWritable(target, NUMBER_DOMAINS);
}

/** True when this slot can be switched - i.e. it is a switch-like entity. */
export function isWritableSwitch(target: unknown): boolean {
  return isWritable(target, SWITCH_DOMAINS);
}

/**
 * True when this slot can be toggled as a power switch - a `fan`, `switch` or
 * `input_boolean`. Used by the dehumidifier card's "Gerät An|Aus" control.
 */
export function isWritablePower(target: unknown): boolean {
  return isWritable(target, POWER_DOMAINS);
}

/** True when this slot is a `humidifier` entity we can set the humidity of. */
export function isWritableHumidity(target: unknown): boolean {
  return (
    typeof target === 'string' &&
    isEntityId(target) &&
    domainOf(target) === 'humidifier'
  );
}

/** True when the charge-mode control names an entity this card can drive. */
export function isWritableChargeMode(control: unknown): boolean {
  if (!control || typeof control !== 'object') return false;
  const entity = (control as ChargeModeControlConfig).entity;
  return isWritable(entity, SELECT_DOMAINS) || isWritable(entity, SWITCH_DOMAINS);
}

function call(
  hass: HomeAssistant | undefined,
  domain: string,
  service: string,
  data: Record<string, unknown>,
): Promise<unknown> {
  if (typeof hass?.callService !== 'function') {
    return Promise.reject(new Error('des-storage-card: hass.callService fehlt'));
  }
  // Wrapped so a synchronous throw rejects instead of escaping to the caller.
  try {
    return Promise.resolve(hass.callService(domain, service, data));
  } catch (error) {
    return Promise.reject(error);
  }
}

/** `number.set_value` / `input_number.set_value`. */
export function writeNumber(
  hass: HomeAssistant | undefined,
  entityId: string,
  value: number,
): Promise<unknown> {
  const domain = domainOf(entityId);
  if (!NUMBER_DOMAINS.has(domain)) {
    return Promise.reject(
      new Error(`des-storage-card: ${entityId} ist keine number-Entität`),
    );
  }
  return call(hass, domain, 'set_value', { entity_id: entityId, value });
}

/** `switch.turn_on` / `input_boolean.turn_off` and friends. */
export function writeSwitch(
  hass: HomeAssistant | undefined,
  entityId: string,
  on: boolean,
): Promise<unknown> {
  const domain = domainOf(entityId);
  if (!SWITCH_DOMAINS.has(domain)) {
    return Promise.reject(
      new Error(`des-storage-card: ${entityId} ist kein Schalter`),
    );
  }
  return call(hass, domain, on ? 'turn_on' : 'turn_off', { entity_id: entityId });
}

/**
 * Power toggle across `fan` / `switch` / `input_boolean`: all three take the
 * same `turn_on` / `turn_off` service, only the domain differs.
 */
export function writePower(
  hass: HomeAssistant | undefined,
  entityId: string,
  on: boolean,
): Promise<unknown> {
  const domain = domainOf(entityId);
  if (!POWER_DOMAINS.has(domain)) {
    return Promise.reject(
      new Error(`des-cards: ${entityId} kann nicht als Ein/Aus geschaltet werden`),
    );
  }
  return call(hass, domain, on ? 'turn_on' : 'turn_off', { entity_id: entityId });
}

/** `humidifier.set_humidity` - sets the target humidity in percent. */
export function writeHumidity(
  hass: HomeAssistant | undefined,
  entityId: string,
  humidity: number,
): Promise<unknown> {
  if (domainOf(entityId) !== 'humidifier') {
    return Promise.reject(
      new Error(`des-cards: ${entityId} ist keine humidifier-Entität`),
    );
  }
  return call(hass, 'humidifier', 'set_humidity', {
    entity_id: entityId,
    humidity,
  });
}

/** `select.select_option` / `input_select.select_option`. */
export function writeSelect(
  hass: HomeAssistant | undefined,
  entityId: string,
  option: string,
): Promise<unknown> {
  const domain = domainOf(entityId);
  if (!SELECT_DOMAINS.has(domain)) {
    return Promise.reject(
      new Error(`des-storage-card: ${entityId} ist keine select-Entität`),
    );
  }
  return call(hass, domain, 'select_option', { entity_id: entityId, option });
}

/**
 * The state that means "charging" for this control.
 *
 * For switch-like entities the default is the plain `on`/`off` pair, so
 * `charge_state`/`auto_state` only have to be spelled out for selects.
 */
function targetState(
  control: ChargeModeControlConfig,
  mode: 'charge' | 'auto' | 'off',
): string | undefined {
  // "off" only ever exists for selects (off_state); it is validated to require
  // one, so there is no switch fallback here.
  if (mode === 'off') return control.off_state;

  const explicit = mode === 'charge' ? control.charge_state : control.auto_state;
  if (explicit !== undefined) return explicit;
  return isWritable(control.entity, SWITCH_DOMAINS)
    ? mode === 'charge'
      ? 'on'
      : 'off'
    : undefined;
}

/**
 * Does the entity's current state mean "charging"?
 *
 * Only a positive match against `charge_state` counts. Inferring "charging"
 * from "not auto_state" would be wrong for any select that has a third
 * option - a Zendure sitting on `Standby` is neither charging nor in auto.
 */
export function isChargeState(
  control: ChargeModeControlConfig,
  state: string,
): boolean {
  const charge = targetState(control, 'charge');
  if (charge === undefined) return false;
  return charge.trim().toLowerCase() === state.trim().toLowerCase();
}

/**
 * Does the entity's current state mean "off" (standby)? Only ever true when an
 * `off_state` is configured and matches; otherwise the state is charge or auto.
 */
export function isOffState(
  control: ChargeModeControlConfig,
  state: string,
): boolean {
  const off = control.off_state;
  if (off === undefined) return false;
  return off.trim().toLowerCase() === state.trim().toLowerCase();
}

/**
 * Checks a `charge_mode_control` block at config time.
 *
 * Returns the error message to throw, or `null` when the block is usable.
 * Without this a typo in `charge_state` silently produced a wrong - and
 * un-writable - segment state with nothing logged anywhere.
 */
export function validateChargeModeControl(control: unknown): string | null {
  if (control === null || typeof control !== 'object') {
    return '"charge_mode_control" muss ein Objekt mit "entity" sein';
  }

  const { entity, charge_state, auto_state, off_state } =
    control as ChargeModeControlConfig;

  if (typeof entity !== 'string' || entity.length === 0) {
    return '"charge_mode_control" braucht "entity"';
  }
  if (!isWritableChargeMode(control)) {
    return `"charge_mode_control.entity" muss select, input_select, switch oder input_boolean sein (ist: ${entity})`;
  }

  // A three-part control needs a select: a switch is binary and cannot carry a
  // third "off" option.
  if (off_state !== undefined && !SELECT_DOMAINS.has(domainOf(entity))) {
    return `"charge_mode_control.off_state" gibt es nur für select/input_select (ist: ${entity})`;
  }

  // Switch-like entities are binary, so on/off are sensible defaults. A select
  // has no such default: both options have to be named.
  if (SELECT_DOMAINS.has(domainOf(entity))) {
    const missing = [
      charge_state === undefined ? 'charge_state' : null,
      auto_state === undefined ? 'auto_state' : null,
    ].filter((name): name is string => name !== null);

    if (missing.length > 0) {
      return `"charge_mode_control" braucht ${missing.join(' und ')} für ${entity}`;
    }
  }

  return null;
}

/** Writes the charge mode, picking the service from the entity's domain. */
export function writeChargeMode(
  hass: HomeAssistant | undefined,
  control: ChargeModeControlConfig,
  mode: 'charge' | 'auto' | 'off',
): Promise<unknown> {
  const entity = control.entity;
  const domain = domainOf(entity);
  const target = targetState(control, mode);

  if (SELECT_DOMAINS.has(domain)) {
    if (target === undefined) {
      const field =
        mode === 'charge'
          ? 'charge_state'
          : mode === 'auto'
            ? 'auto_state'
            : 'off_state';
      return Promise.reject(
        new Error(
          `des-storage-card: charge_mode_control braucht ${field} für ${entity}`,
        ),
      );
    }
    return writeSelect(hass, entity, target);
  }

  if (SWITCH_DOMAINS.has(domain)) {
    return writeSwitch(hass, entity, ON_STATES.has((target ?? '').toLowerCase()));
  }

  return Promise.reject(
    new Error(`des-storage-card: ${entity} wird als Lademodus nicht unterstützt`),
  );
}

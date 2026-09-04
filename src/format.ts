const LOCALE = 'de-DE';

/** "1.234" - integer with thousands separator, no sign. */
export function formatInt(value: number): string {
  return new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 }).format(value);
}

/** "+1.234" / "-567" - signed integer with thousands separator. */
export function formatSignedInt(value: number): string {
  return new Intl.NumberFormat(LOCALE, {
    maximumFractionDigits: 0,
    signDisplay: 'always',
  }).format(value);
}

/** "12,4" - up to `digits` decimals, thousands separator. */
export function formatDecimal(value: number, digits = 1): string {
  return new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format(value);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

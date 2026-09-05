import { css, html, nothing, type TemplateResult } from 'lit';

/**
 * The segmented control shared by every card: the An/Auto/Aus and Laden/Auto
 * toggles of `des-storage-card` and the Zeitraumwahl of `des-stats-card`.
 *
 * Lit scopes styles per component, so a shared look needs both halves exported
 * here: `segmentedStyles` goes into each host's `static styles` array, and
 * `renderSegmented` produces the markup. Keeping them together is what stops
 * the two cards from drifting apart.
 */

/** Drop `segmentedStyles` into a component's `static styles` array. */
export const segmentedStyles = css`
  .seg {
    display: inline-flex;
    border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.28));
    border-radius: 5px;
    overflow: hidden;
  }

  .seg button {
    font-family: inherit;
    font-size: 11px;
    line-height: 1;
    padding: 4px 7px;
    background: none;
    border: none;
    border-left: 1px solid var(--divider-color, rgba(127, 127, 127, 0.28));
    color: var(--secondary-text-color);
    cursor: pointer;
  }

  .seg.unknown {
    opacity: 0.5;
  }

  .seg button:first-child {
    border-left: none;
  }

  .seg button:hover {
    color: var(--primary-text-color);
  }

  .seg button.active {
    background: rgba(3, 169, 244, 0.12);
    background: color-mix(in srgb, var(--primary-color, #03a9f4) 12%, transparent);
    color: var(--primary-color, #03a9f4);
    font-weight: 500;
  }

  .seg button:focus-visible {
    outline: 2px solid var(--primary-color, #03a9f4);
    outline-offset: -2px;
  }

  .seg button:disabled {
    cursor: not-allowed;
  }
`;

/**
 * One segmented control. `active === null` dims the whole control and marks it
 * as "state not readable"; each button stops propagation so a control nested in
 * a clickable region does not also trigger that region. `disabled` dims it the
 * same way and makes every button unclickable (an unreadable bound entity).
 */
export function renderSegmented<T extends string>(
  options: ReadonlyArray<{ value: T; label: string }>,
  active: T | null,
  onSelect: (value: T) => void,
  ariaLabel: string,
  disabled = false,
): TemplateResult {
  const dim = disabled || active === null;
  return html`
    <div
      class="seg ${dim ? 'unknown' : ''}"
      role="group"
      aria-label=${ariaLabel}
      title=${disabled
        ? 'Nicht verfügbar'
        : active === null
          ? 'Zustand nicht lesbar'
          : nothing}
    >
      ${options.map(
        ({ value, label }) => html`
          <button
            type="button"
            class=${active === value ? 'active' : ''}
            aria-pressed=${active === value ? 'true' : 'false'}
            ?disabled=${disabled}
            @click=${(ev: Event) => {
              ev.stopPropagation();
              onSelect(value);
            }}
          >
            ${label}
          </button>
        `,
      )}
    </div>
  `;
}

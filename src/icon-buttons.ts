import { css, html, nothing, type TemplateResult } from 'lit';

/**
 * A small row of icon buttons shared across the cards - the ▼ ■ ▲ of the cover
 * card, and later the light card's controls. Unlike the segmented control, each
 * button is a **separate** element with its own full border and corner radius,
 * spaced by a gap: nothing overlaps, so a highlighted button (`active`) shows
 * its border all the way round instead of being clipped by its neighbour.
 *
 * Like the segmented control, styles and markup are exported together so every
 * host renders the same look: drop `iconButtonStyles` into `static styles` and
 * call `renderIconButtons`.
 */

export interface IconButtonItem<T extends string = string> {
  /** Passed back to `onSelect` when the button is pressed. */
  value: T;
  /** `mdi:…` icon name. */
  icon: string;
  /** Accessible label / tooltip. */
  label: string;
  /** Highlights the button: border + icon in the primary colour. */
  active?: boolean;
  /** Dims the button and blocks the press. */
  disabled?: boolean;
}

/** Drop into a component's `static styles` array. */
export const iconButtonStyles = css`
  .icon-btns {
    display: inline-flex;
    /* A real gap, not a negative margin: neighbours never overlap, so an
       active button's border stays fully visible. */
    gap: 3px;
    flex-shrink: 0;
  }

  .icon-btns button {
    box-sizing: border-box;
    width: 24px;
    height: 22px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    background: none;
    border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.28));
    border-radius: 5px;
    color: var(--secondary-text-color);
    cursor: pointer;
  }

  .icon-btns button:hover {
    color: var(--primary-text-color);
  }

  .icon-btns button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* Highlighted (e.g. the stop button while a cover is moving). */
  .icon-btns button.active {
    color: var(--primary-color, #03a9f4);
    border-color: var(--primary-color, #03a9f4);
  }

  .icon-btns button:focus-visible {
    outline: 2px solid var(--primary-color, #03a9f4);
    outline-offset: 1px;
  }

  .icon-btns ha-icon {
    --mdc-icon-size: 18px;
    width: 18px;
    height: 18px;
  }
`;

/**
 * One row of icon buttons. Each button stops click propagation so a row nested
 * in a clickable region does not also trigger that region.
 */
export function renderIconButtons<T extends string>(
  items: ReadonlyArray<IconButtonItem<T>>,
  onSelect: (value: T) => void,
  groupLabel?: string,
): TemplateResult {
  return html`
    <div class="icon-btns" role="group" aria-label=${groupLabel ?? nothing}>
      ${items.map(
        (item) => html`
          <button
            type="button"
            class=${item.active ? 'active' : ''}
            aria-label=${item.label}
            title=${item.label}
            ?disabled=${item.disabled}
            @click=${(ev: Event) => {
              ev.stopPropagation();
              onSelect(item.value);
            }}
          >
            <ha-icon icon=${item.icon}></ha-icon>
          </button>
        `,
      )}
    </div>
  `;
}

import { css } from 'lit';

/**
 * Shared look of the expand/collapse chevron across the cards (storage,
 * inverter, house). Only the icon itself is shared here; the *focusable*
 * wrapper differs per card (the whole main row on the storage card, a centred
 * chevron row on the others), so each card keeps its own focus rule — see the
 * note on the focus fix below.
 *
 * Focus fix: a mouse click must not leave the focus ring standing, while
 * keyboard focus must stay visible. Each card pairs its focusable wrapper's
 * `:focus { outline: none }` with a `:focus-visible` outline for exactly that.
 */
export const chevronStyles = css`
  .chevron {
    --mdc-icon-size: 22px;
    width: 22px;
    height: 22px;
    color: var(--secondary-text-color);
    flex-shrink: 0;
    transition: transform 0.18s ease-in-out;
  }

  .chevron.open {
    transform: rotate(180deg);
  }
`;

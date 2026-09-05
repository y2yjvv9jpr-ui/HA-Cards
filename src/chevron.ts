import { css } from 'lit';

/**
 * Shared look and behaviour of the expand/collapse chevron across the cards
 * (storage, inverter, house). All three now use the same centred
 * `.chevron-row` wrapper, so both the icon and the row live here rather than
 * being copied into each card.
 *
 * Focus fix: a mouse click must not leave the focus ring standing, while
 * keyboard focus must stay visible - hence `:focus { outline: none }` paired
 * with a `:focus-visible` outline.
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

  .chevron-row {
    display: flex;
    justify-content: center;
    margin-top: 8px;
  }

  .chevron-row.clickable {
    cursor: pointer;
    outline: none;
  }

  /* A mouse click must not leave the ring standing; keyboard focus keeps it. */
  .chevron-row.clickable:focus {
    outline: none;
  }

  .chevron-row.clickable:focus-visible {
    outline: 2px solid var(--primary-color, #03a9f4);
    outline-offset: 2px;
    border-radius: 6px;
  }
`;

import { css } from 'lit';

/**
 * Shared design tokens for the cards.
 *
 * CSS custom properties do not cross shadow-DOM boundaries, so every card that
 * uses a token includes this block in its `styles` array; the value then lives
 * in exactly one place instead of being copied per card.
 */
export const tokenStyles = css`
  :host {
    /* Feed-in / export colour: a muted olive that stays clear of the
       production green. Shared by the stats card (Export row) and the inverter
       card (export bar). The dashboard chart's "Einspeisung" series cannot read
       CSS variables, so it repeats the literal hex #639922 — keep them in sync. */
    --des-export-color: #639922;
  }
`;

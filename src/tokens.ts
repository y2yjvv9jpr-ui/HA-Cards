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
    /* Production / solar colour: the default Home Assistant success green,
       pinned to a literal so it matches the dashboard chart (which cannot read
       CSS variables). Shared by the stats card (Produktion row) and, as the
       literal hex #2e7d32, the "Solar" series of the chart — keep them in sync. */
    --des-production-color: #2e7d32;

    /* Feed-in / export colour: a muted olive that stays clear of the
       production green. Shared by the stats card (Export row) and the inverter
       card (export bar). The dashboard chart's "Einspeisung" series cannot read
       CSS variables, so it repeats the literal hex #639922 — keep them in sync. */
    --des-export-color: #639922;
  }
`;

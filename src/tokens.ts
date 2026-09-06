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
    /* The project uses exactly two energy greens, plus one status green.

       Production / solar (#2e7d32, the default Home Assistant success green):
       everything that means "PV / Erzeugung" — the house card's Solar row and
       mix segment, the inverter card's PV power figure and PV1/PV2 bars, the
       stats card's Produktion row, and the chart's "Solar" series (which repeats
       the literal hex, as a chart cannot read CSS variables). */
    --des-production-color: #2e7d32;

    /* Export / feed-in (#639922, a muted olive that stays clear of the
       production green): everything that means "Einspeisung" — the house card's
       feed pill and feed value, the inverter card's export bar and the grid
       feed-in figures, the stats card's Export row, and the chart's
       "Einspeisung" series (repeated as the literal hex). */
    --des-export-color: #639922;

    /* Status OK (#2e7d32): the "everything is fine / active" green that is NOT
       an energy colour — the Normal/Bereit status pills, the charging and
       heating power figures, a healthy battery fill and the running dot. Its own
       token so it can move independently of the production green later. */
    --des-status-ok-color: #2e7d32;
  }
`;

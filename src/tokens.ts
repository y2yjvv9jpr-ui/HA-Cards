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
    /* Two energy greens, defined once here.

       Production / solar: follows the theme's success colour (falling back to
       #2e7d32). Everything that means "PV / Erzeugung" — the house card's Solar
       row and mix segment, the inverter card's PV power figure and PV1/PV2 bars,
       the stats card's Produktion row, and the chart's "Solar" series. */
    --des-production-color: var(--success-color, #2e7d32);

    /* Export / feed-in: a fixed dark green (#2e7d32). Everything that means
       "Einspeisung" — the inverter card's export bar and grid feed-in figures,
       the house card's Einspeisung day value, the stats card's Export row, and
       the chart's "Einspeisung" series (repeated as the literal hex, as a chart
       cannot read CSS variables). Fixed rather than theme-following so the chart
       literal matches the card. */
    --des-export-color: #2e7d32;
  }
`;

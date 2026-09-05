import { css } from 'lit';

/**
 * Shared bits for the expandable cards' detail block. In a HA sections view the
 * cell has a fixed height, so the expanded block cannot grow in flow without
 * being drawn behind the neighbours. Instead it becomes a dropdown: an absolute
 * panel hanging under the card that overlays whatever sits below it.
 *
 * Each card puts `.overlay` on its expanded panel, reflects an `expanded`
 * attribute on the host (for the stacking rule), and drives an `OverlayCloser`
 * so a click outside, Escape, or the chevron closes it.
 */
export const overlayStyles = css`
  /* Only while open does the host lift above its neighbours. */
  :host([expanded]) {
    position: relative;
    z-index: 20;
  }

  /* The panel is positioned against ha-card and must escape its box. */
  ha-card {
    position: relative;
    overflow: visible;
  }

  .overlay {
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    box-sizing: border-box;
    padding: 12px 16px;
    background: var(--card-background-color, var(--ha-card-background, #fff));
    border: var(--ha-card-border-width, 1px) solid
      var(--ha-card-border-color, var(--divider-color, rgba(0, 0, 0, 0.12)));
    /* It joins the card above, so no top edge; rounded only at the bottom. */
    border-top: none;
    border-radius: 0 0 var(--ha-card-border-radius, 12px)
      var(--ha-card-border-radius, 12px);
    box-shadow: var(--ha-card-box-shadow, 0 8px 24px rgba(0, 0, 0, 0.35));
    animation: overlay-in 0.12s ease-out;
  }

  /* Absolute panel, so the transform never nudges the neighbours' layout. */
  @keyframes overlay-in {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

/**
 * Closes an open overlay on a click outside the card or an Escape press. The
 * document listeners live only while the overlay is open; `deactivate()` (call
 * it from `disconnectedCallback`) always removes them. A click that lands
 * inside the card keeps the panel open - the host is on the click's composed
 * path even for the very click that opened it, so opening never self-closes.
 */
export class OverlayCloser {
  private _active = false;

  constructor(
    private readonly _host: HTMLElement,
    private readonly _onClose: () => void,
  ) {}

  private readonly _onDocClick = (ev: MouseEvent): void => {
    if (!ev.composedPath().includes(this._host)) this._onClose();
  };

  private readonly _onKeydown = (ev: KeyboardEvent): void => {
    if (ev.key === 'Escape') this._onClose();
  };

  activate(): void {
    if (this._active) return;
    this._active = true;
    document.addEventListener('click', this._onDocClick);
    document.addEventListener('keydown', this._onKeydown);
  }

  deactivate(): void {
    if (!this._active) return;
    this._active = false;
    document.removeEventListener('click', this._onDocClick);
    document.removeEventListener('keydown', this._onKeydown);
  }
}

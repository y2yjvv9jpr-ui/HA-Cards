import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { entityState } from './resolve';
import { writeSelect } from './service';
import { renderSegmented, segmentedStyles } from './segmented';
import type { DesPeriodCardConfig, HomeAssistant } from './types';

/** Shown when no `entity` is configured (editor preview). */
const DEMO_OPTIONS = ['Tag', 'Woche', 'Monat', 'Jahr'];
const DEMO_ACTIVE = 'Tag';

/** True for a config slot that actually names an entity/value. */
function present(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

interface Option {
  value: string;
  label: string;
}

export class DesPeriodCard extends LitElement {
  static override properties = {
    // Assigning `hass` re-renders the card, so the active segment follows the
    // entity's state without any local selection to keep in sync.
    hass: { attribute: false },
    _config: { state: true },
  };

  declare hass?: HomeAssistant;
  declare _config?: DesPeriodCardConfig;

  setConfig(config: DesPeriodCardConfig): void {
    if (!config) {
      throw new Error('des-period-card: Konfiguration fehlt');
    }
    if (!config.name) {
      throw new Error('des-period-card: "name" ist erforderlich');
    }
    if (config.options !== undefined && !Array.isArray(config.options)) {
      throw new Error('des-period-card: "options" muss eine Liste sein');
    }
    if (
      Array.isArray(config.options) &&
      config.options.some((o) => !o || !present(o.value))
    ) {
      throw new Error('des-period-card: jede Option in "options" braucht "value"');
    }
    this._config = config;
  }

  getCardSize(): number {
    return 1;
  }

  static getStubConfig(): DesPeriodCardConfig {
    // No entity, so the picker preview shows the Tag/Woche/Monat/Jahr demo.
    return { type: 'custom:des-period-card', name: 'Zeitraum' };
  }

  // =========================================================================
  // resolution
  // =========================================================================

  private get _entityMode(): boolean {
    return present(this._config?.entity);
  }

  /** Config options if given, else the entity's own `options`, else the demo. */
  private _options(): Option[] {
    const c = this._config!;
    if (Array.isArray(c.options) && c.options.length > 0) {
      return c.options
        .filter((o) => o && present(o.value))
        .map((o) => ({ value: o.value, label: present(o.label) ? o.label! : o.value }));
    }

    if (this._entityMode) {
      const attr = this.hass?.states?.[c.entity!]?.attributes?.options;
      if (Array.isArray(attr)) {
        return attr
          .filter((v): v is string => typeof v === 'string')
          .map((v) => ({ value: v, label: v }));
      }
      return [];
    }

    return DEMO_OPTIONS.map((v) => ({ value: v, label: v }));
  }

  /** The active segment follows the entity's state; `null` dims the control. */
  private _active(): string | null {
    const c = this._config!;
    if (!this._entityMode) return DEMO_ACTIVE;
    return entityState(c.entity!, this.hass);
  }

  /** An unreadable bound entity leaves the switcher dimmed and unclickable. */
  private _disabled(): boolean {
    return this._entityMode && entityState(this._config!.entity!, this.hass) === null;
  }

  /** `meta_entity`'s state + unit (real casing), else the static `meta` text. */
  private _meta(): string | null {
    const c = this._config!;
    if (present(c.meta_entity)) {
      const state = entityState(c.meta_entity!, this.hass);
      if (state === null) return null;
      const raw = this.hass?.states?.[c.meta_entity!]?.attributes?.unit_of_measurement;
      const unit = typeof raw === 'string' ? raw.trim() : '';
      return unit ? `${state} ${unit}` : state;
    }
    return present(c.meta) ? c.meta!.trim() : null;
  }

  // =========================================================================
  // render
  // =========================================================================

  override render(): TemplateResult | typeof nothing {
    const c = this._config;
    if (!c) return nothing;

    const options = this._options();
    const active = this._active();
    const disabled = this._disabled();
    const meta = this._meta();

    return html`
      <ha-card>
        <div class="card">
          <div class="header">
            <span class="name">${c.name}</span>
            ${options.length > 0
              ? renderSegmented(
                  options,
                  active,
                  (value) => this._select(value),
                  'Zeitraum',
                  disabled,
                )
              : nothing}
          </div>
          ${meta ? html`<div class="meta">${meta}</div>` : nothing}
        </div>
      </ha-card>
    `;
  }

  /**
   * Writes the pick into the bound `input_select`. No optimistic switch: the
   * active segment updates only once the entity reports the new state back.
   */
  private _select(value: string): void {
    const entity = this._config?.entity;
    if (!present(entity)) return;
    void this._write(writeSelect(this.hass, entity!, value));
  }

  private async _write(call: Promise<unknown>): Promise<void> {
    try {
      await call;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('des-period-card: Service-Call fehlgeschlagen', error);
    }
  }

  static override styles = [
    segmentedStyles,
    css`
      :host {
        display: block;
      }

      ha-card {
        box-sizing: border-box;
        background: var(--card-background-color, var(--ha-card-background, #fff));
        color: var(--primary-text-color);
      }

      /* Standard card padding, nothing extra below, so a chart card placed
         right underneath butts straight against this header. */
      .card {
        padding: 12px 16px;
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .name {
        font-size: 15px;
        font-weight: 500;
        color: var(--primary-text-color);
        white-space: nowrap;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .meta {
        margin-top: 4px;
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `,
  ];
}

import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { renderSegmented, segmentedStyles } from './segmented';
import { chevronStyles } from './chevron';
import { overlayStyles, OverlayCloser } from './overlay';
import { tokenStyles } from './tokens';
import { formatInt, clamp } from './format';
import type { DesBedLightCardConfig, HomeAssistant } from './types';

const GRID_COLUMNS = 12;
const GRID_ROWS = 3;
const GRID_MIN_ROWS = 3;
const DEFAULT_NAME = 'Bett';

type RowKey = 'seiten' | 'kopf_aneka' | 'kopf_daniel';
type ColorMode = 'white' | 'color';

interface ModeSettings {
  brightness: number;
  colorMode: ColorMode;
  kelvin: number;
  hue: number;
  sat: number;
}
interface RowModel {
  /** Active mode: 'off' or one of the editable modes. */
  active: string;
  modes: Record<string, ModeSettings>;
}
type Model = Record<RowKey, RowModel>;

const ROW_NAME: Record<RowKey, string> = {
  seiten: 'Seiten',
  kopf_aneka: 'Kopfende Aneka',
  kopf_daniel: 'Kopfende Daniel',
};

/** The editable (non-off) modes each row offers. */
const EDITABLE_MODES: Record<RowKey, ReadonlyArray<{ value: string; label: string }>> = {
  seiten: [
    { value: 'ambiente', label: 'Ambiente' },
    { value: 'max', label: 'Max' },
  ],
  kopf_aneka: [
    { value: 'lesen', label: 'Lesen' },
    { value: 'max', label: 'Max' },
  ],
  kopf_daniel: [
    { value: 'lesen', label: 'Lesen' },
    { value: 'max', label: 'Max' },
  ],
};

/** Label of an active mode for the meta line; null when the row is off. */
function activeLabel(row: RowKey, active: string): string | null {
  if (active === 'off') return null;
  if (row === 'seiten') return active === 'max' ? 'Seiten Max' : 'Seiten Ambiente';
  const who = row === 'kopf_aneka' ? 'Aneka' : 'Daniel';
  return active === 'max' ? `${who} Max` : `${who} liest`;
}

interface Preset {
  name: string;
  kind: ColorMode;
  kelvin?: number;
  hue?: number;
  sat?: number;
}
const PRESETS: ReadonlyArray<Preset> = [
  { name: 'Warmweiß', kind: 'white', kelvin: 2200 },
  { name: 'Neutralweiß', kind: 'white', kelvin: 3500 },
  { name: 'Kaltweiß', kind: 'white', kelvin: 5500 },
  { name: 'Rot', kind: 'color', hue: 0, sat: 100 },
  { name: 'Orange', kind: 'color', hue: 30, sat: 100 },
  { name: 'Grün', kind: 'color', hue: 120, sat: 100 },
  { name: 'Blau', kind: 'color', hue: 220, sat: 100 },
  { name: 'Violett', kind: 'color', hue: 275, sat: 100 },
  { name: 'Pink', kind: 'color', hue: 320, sat: 80 },
];

/** Approximate kelvin → CSS rgb (Tanner Helland), for the colour swatches. */
function kelvinToCss(kelvin: number): string {
  const t = clamp(kelvin, 1000, 40000) / 100;
  const r = t <= 66 ? 255 : 329.698727446 * Math.pow(t - 60, -0.1332047592);
  const g =
    t <= 66
      ? 99.4708025861 * Math.log(t) - 161.1195681661
      : 288.1221695283 * Math.pow(t - 60, -0.0755148492);
  const b = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  const c = (v: number): number => Math.round(clamp(v, 0, 255));
  return `rgb(${c(r)}, ${c(g)}, ${c(b)})`;
}

function hslCss(hue: number, sat: number): string {
  return `hsl(${Math.round(hue)}, ${Math.round(sat)}%, 50%)`;
}

/** CSS colour of a mode's light, or null when off. */
function modeColor(settings: ModeSettings): string {
  return settings.colorMode === 'white'
    ? kelvinToCss(settings.kelvin)
    : hslCss(settings.hue, settings.sat);
}

/** Fresh demo model on every mount, so interactions can be replayed. */
function demoModel(): Model {
  const max: ModeSettings = { brightness: 100, colorMode: 'white', kelvin: 4000, hue: 30, sat: 100 };
  return {
    seiten: {
      active: 'ambiente',
      modes: {
        ambiente: { brightness: 35, colorMode: 'white', kelvin: 2200, hue: 30, sat: 100 },
        max: { ...max },
      },
    },
    kopf_aneka: {
      active: 'off',
      modes: {
        lesen: { brightness: 60, colorMode: 'white', kelvin: 2700, hue: 30, sat: 100 },
        max: { ...max },
      },
    },
    kopf_daniel: {
      active: 'lesen',
      modes: {
        lesen: { brightness: 60, colorMode: 'white', kelvin: 2700, hue: 30, sat: 100 },
        max: { ...max },
      },
    },
  };
}

export class DesBedLightCard extends LitElement {
  static override properties = {
    hass: { attribute: false },
    _config: { state: true },
    _expanded: { state: true },
    _model: { state: true },
    _editRow: { state: true },
    _editMode: { state: true },
  };

  declare hass?: HomeAssistant;
  declare _config?: DesBedLightCardConfig;
  declare _expanded: boolean;
  declare _model: Model;
  declare _editRow: RowKey;
  declare _editMode: string;

  private _closer = new OverlayCloser(this, () => this._collapse());

  constructor() {
    super();
    this._expanded = false;
    this._model = demoModel();
    this._editRow = 'seiten';
    this._editMode = 'ambiente';
  }

  setConfig(config: DesBedLightCardConfig): void {
    if (!config) {
      throw new Error('des-bed-light-card: Konfiguration fehlt');
    }
    this._config = config;
    this._expanded = false;
  }

  getCardSize(): number {
    return GRID_ROWS;
  }

  getGridOptions(): { columns: number; rows: number; min_rows: number } {
    return { columns: GRID_COLUMNS, rows: GRID_ROWS, min_rows: GRID_MIN_ROWS };
  }

  static getStubConfig(): DesBedLightCardConfig {
    return { type: 'custom:des-bed-light-card', name: DEFAULT_NAME };
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._closer.deactivate();
  }

  protected override updated(): void {
    this.toggleAttribute('expanded', this._expanded);
  }

  // =========================================================================
  // helpers
  // =========================================================================

  private _rowKeys(): RowKey[] {
    return ['seiten', 'kopf_aneka', 'kopf_daniel'];
  }

  private _rowOptions(row: RowKey): Array<{ value: string; label: string }> {
    const off = { value: 'off', label: 'Aus' };
    return [off, ...EDITABLE_MODES[row]];
  }

  private _editModeFor(row: RowKey): string {
    const modes = EDITABLE_MODES[row];
    return modes.some((m) => m.value === this._editMode) ? this._editMode : modes[0].value;
  }

  private _editing(): ModeSettings {
    return this._model[this._editRow].modes[this._editModeFor(this._editRow)];
  }

  // =========================================================================
  // render
  // =========================================================================

  override render(): TemplateResult | typeof nothing {
    const config = this._config;
    if (!config) return nothing;

    const labels = this._rowKeys()
      .map((r) => activeLabel(r, this._model[r].active))
      .filter((l): l is string => l !== null);
    const meta = labels.length > 0 ? labels.join(' · ') : 'Alles aus';

    return html`
      <ha-card>
        <div class="card">
          <div class="header">
            <span class="name">${config.name ?? DEFAULT_NAME}</span>
            <div class="meta">${meta}</div>
          </div>

          <div class="rows">${this._rowKeys().map((r) => this._renderRow(r))}</div>

          <div
            class="chevron-row clickable"
            role="button"
            tabindex="0"
            aria-expanded=${String(this._expanded)}
            aria-label="Szene bearbeiten"
            @click=${this._toggleExpanded}
            @keydown=${this._onKeydown}
          >
            <ha-icon class="chevron ${this._expanded ? 'open' : ''}" icon="mdi:chevron-down"></ha-icon>
          </div>
        </div>
        ${this._expanded ? html`<div class="overlay">${this._renderEditor()}</div>` : nothing}
      </ha-card>
    `;
  }

  private _renderRow(row: RowKey): TemplateResult {
    const model = this._model[row];
    const active = model.active;
    const color = active === 'off' ? null : modeColor(model.modes[active]);

    return html`
      <div class="bed-row">
        <span
          class="dot ${color === null ? 'off' : ''}"
          style=${color === null ? nothing : `background:${color}`}
        ></span>
        <span class="bed-name">${ROW_NAME[row]}</span>
        ${renderSegmented<string>(
          this._rowOptions(row),
          active,
          (value) => this._setActive(row, value),
          ROW_NAME[row],
        )}
      </div>
    `;
  }

  private _renderEditor(): TemplateResult {
    const row = this._editRow;
    const mode = this._editModeFor(row);
    const s = this._editing();
    const isWhite = s.colorMode === 'white';

    const activePreset = PRESETS.findIndex((p) =>
      p.kind === 'white'
        ? isWhite && p.kelvin === s.kelvin
        : !isWhite && p.hue === s.hue && p.sat === s.sat,
    );

    return html`
      <div class="edit">
        <div class="edit-head">
          <span class="edit-title">Szene bearbeiten</span>
          <div class="edit-segs">
            ${renderSegmented<RowKey>(
              [
                { value: 'seiten', label: 'Seiten' },
                { value: 'kopf_aneka', label: 'Kopf Aneka' },
                { value: 'kopf_daniel', label: 'Kopf Daniel' },
              ],
              row,
              (value) => this._setEditRow(value),
              'Zeile',
            )}
            ${renderSegmented<string>(
              [...EDITABLE_MODES[row]],
              mode,
              (value) => (this._editMode = value),
              'Modus',
            )}
          </div>
        </div>

        <div class="ctl-row">
          <span class="ctl-label">Helligkeit</span>
          <input
            class="slider bright-slider"
            style="--fill:${s.brightness}%"
            type="range"
            min="0"
            max="100"
            step="1"
            .value=${String(s.brightness)}
            aria-label="Helligkeit"
            @input=${(ev: Event) => this._patch({ brightness: this._num(ev) })}
          />
          <span class="ctl-value">${formatInt(s.brightness)} %</span>
        </div>

        <div class="presets">
          ${PRESETS.map(
            (p, i) => html`<button
              type="button"
              class="preset ${i === activePreset ? 'active' : ''}"
              style="background:${p.kind === 'white' ? kelvinToCss(p.kelvin ?? 4000) : hslCss(p.hue ?? 0, p.sat ?? 100)}"
              title=${p.name}
              aria-label=${p.name}
              @click=${() => this._applyPreset(p)}
            ></button>`,
          )}
        </div>

        <div class="block ${isWhite ? '' : 'dimmed'}">
          <div class="ctl-row">
            <span class="ctl-label">Weißton</span>
            <input
              class="slider white-slider"
              type="range"
              min="2000"
              max="6500"
              step="50"
              .value=${String(s.kelvin)}
              aria-label="Weißton"
              @input=${(ev: Event) => this._patch({ colorMode: 'white', kelvin: this._num(ev) })}
            />
            <span class="ctl-value">${isWhite ? `${formatInt(s.kelvin)} K` : '—'}</span>
          </div>
        </div>

        <div class="block ${isWhite ? 'dimmed' : ''}">
          <div class="ctl-row">
            <span class="ctl-label">Farbton</span>
            <input
              class="slider hue-slider"
              type="range"
              min="0"
              max="360"
              step="1"
              .value=${String(s.hue)}
              aria-label="Farbton"
              @input=${(ev: Event) => this._patch({ colorMode: 'color', hue: this._num(ev) })}
            />
            <span class="ctl-value">${isWhite ? '—' : `${formatInt(s.hue)}°`}</span>
          </div>
          <div class="ctl-row">
            <span class="ctl-label">Sättigung</span>
            <input
              class="slider sat-slider"
              style="--sat-hue:${s.hue}"
              type="range"
              min="0"
              max="100"
              step="1"
              .value=${String(s.sat)}
              aria-label="Sättigung"
              @input=${(ev: Event) => this._patch({ colorMode: 'color', sat: this._num(ev) })}
            />
            <span class="ctl-value">${isWhite ? '—' : `${formatInt(s.sat)} %`}</span>
          </div>
        </div>

        <div class="hint">
          Änderungen wirken sofort auf die Lampe, wenn die Szene aktiv ist, und werden gespeichert.
        </div>
      </div>
    `;
  }

  // =========================================================================
  // interaction (local only - this card is UI-only for now)
  // =========================================================================

  private _num(ev: Event): number {
    return Number((ev.target as HTMLInputElement).value);
  }

  private _toggleExpanded(): void {
    this._expanded = !this._expanded;
    if (this._expanded) this._closer.activate();
    else this._closer.deactivate();
  }

  private _collapse(): void {
    if (!this._expanded) return;
    this._expanded = false;
    this._closer.deactivate();
  }

  private _onKeydown(ev: KeyboardEvent): void {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this._toggleExpanded();
    }
  }

  private _setActive(row: RowKey, mode: string): void {
    this._model = {
      ...this._model,
      [row]: { ...this._model[row], active: mode },
    };
  }

  private _setEditRow(row: RowKey): void {
    this._editRow = row;
    // Keep the mode valid for the newly selected row.
    this._editMode = this._editModeFor(row);
  }

  /** Immutably patches the currently edited mode's settings. */
  private _patch(patch: Partial<ModeSettings>): void {
    const row = this._editRow;
    const mode = this._editModeFor(row);
    const current = this._model[row].modes[mode];
    this._model = {
      ...this._model,
      [row]: {
        ...this._model[row],
        modes: { ...this._model[row].modes, [mode]: { ...current, ...patch } },
      },
    };
  }

  private _applyPreset(preset: Preset): void {
    if (preset.kind === 'white') {
      this._patch({ colorMode: 'white', kelvin: preset.kelvin ?? 4000 });
    } else {
      this._patch({ colorMode: 'color', hue: preset.hue ?? 0, sat: preset.sat ?? 100 });
    }
  }

  static override styles = [
    tokenStyles,
    segmentedStyles,
    chevronStyles,
    overlayStyles,
    css`
      :host {
        display: block;
        height: 100%;
      }

      ha-card {
        height: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        background: var(--ha-card-background, var(--card-background-color, #fff));
        color: var(--primary-text-color);
      }

      .card {
        flex: 1 1 auto;
        min-height: 0;
        display: flex;
        flex-direction: column;
        padding: 12px 16px;
      }

      .header {
        flex: 0 0 auto;
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 8px;
      }

      .name {
        font-size: 15px;
        font-weight: 500;
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .meta {
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
      }

      .rows {
        margin-top: 6px;
      }

      .bed-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 7px 0;
      }

      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex-shrink: 0;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
      }

      .dot.off {
        background: transparent;
        box-shadow: none;
        border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.5));
      }

      .bed-name {
        width: 110px;
        flex-shrink: 0;
        font-size: 13px;
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* push the segmented control to the right */
      .bed-row > .seg {
        margin-left: auto;
      }

      /* --- editor (expanded) --- */

      .edit {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .edit-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
      }

      .edit-title {
        font-size: 11px;
        color: var(--secondary-text-color);
        letter-spacing: 0.04em;
      }

      .edit-segs {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .ctl-row {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .ctl-label {
        width: 72px;
        flex-shrink: 0;
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
      }

      .ctl-value {
        width: 46px;
        text-align: right;
        flex-shrink: 0;
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
      }

      .block.dimmed {
        opacity: 0.45;
      }

      /* --- presets --- */

      .presets {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .preset {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: none;
        padding: 0;
        cursor: pointer;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
      }

      .preset.active {
        box-shadow: 0 0 0 2px var(--primary-color, #03a9f4);
      }

      .preset:focus-visible {
        outline: 2px solid var(--primary-color, #03a9f4);
        outline-offset: 2px;
      }

      /* --- sliders --- */

      .slider {
        -webkit-appearance: none;
        appearance: none;
        flex: 1;
        width: 100%;
        min-width: 0;
        height: 14px;
        background: none;
        cursor: pointer;
      }

      .slider::-webkit-slider-runnable-track {
        height: 6px;
        border-radius: 3px;
      }

      .slider::-moz-range-track {
        height: 6px;
        border-radius: 3px;
      }

      .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--card-background-color, #fff);
        border: 2px solid var(--primary-text-color, #444);
        margin-top: -4px;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
      }

      .slider::-moz-range-thumb {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--card-background-color, #fff);
        border: 2px solid var(--primary-text-color, #444);
      }

      .slider:focus-visible {
        outline: 2px solid var(--primary-color, #03a9f4);
        outline-offset: 2px;
        border-radius: 3px;
      }

      /* brightness: primary fill via --fill */
      .bright-slider::-webkit-slider-runnable-track {
        background: linear-gradient(
          to right,
          var(--primary-color, #03a9f4) var(--fill, 0%),
          var(--divider-color, rgba(127, 127, 127, 0.3)) var(--fill, 0%)
        );
      }
      .bright-slider::-moz-range-progress {
        height: 6px;
        border-radius: 3px;
        background: var(--primary-color, #03a9f4);
      }
      .bright-slider::-moz-range-track {
        background: var(--divider-color, rgba(127, 127, 127, 0.3));
      }

      /* white point: warm → cold gradient */
      .white-slider::-webkit-slider-runnable-track,
      .white-slider::-moz-range-track {
        background: linear-gradient(to right, #ff9c3f, #ffd8a8, #fff, #cfe0ff, #a9c6ff);
      }

      /* hue: rainbow */
      .hue-slider::-webkit-slider-runnable-track,
      .hue-slider::-moz-range-track {
        background: linear-gradient(
          to right,
          hsl(0, 100%, 50%),
          hsl(60, 100%, 50%),
          hsl(120, 100%, 50%),
          hsl(180, 100%, 50%),
          hsl(240, 100%, 50%),
          hsl(300, 100%, 50%),
          hsl(360, 100%, 50%)
        );
      }

      /* saturation: grey → full colour at the current hue */
      .sat-slider::-webkit-slider-runnable-track,
      .sat-slider::-moz-range-track {
        background: linear-gradient(
          to right,
          hsl(var(--sat-hue, 30), 0%, 50%),
          hsl(var(--sat-hue, 30), 100%, 50%)
        );
      }

      .hint {
        font-size: 11px;
        color: var(--secondary-text-color);
        opacity: 0.85;
      }
    `,
  ];
}

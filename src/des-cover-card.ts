import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { chevronStyles } from './chevron';
import { overlayStyles, OverlayCloser } from './overlay';
import { tokenStyles } from './tokens';
import { iconButtonStyles, renderIconButtons } from './icon-buttons';
import { renderSegmented, segmentedStyles } from './segmented';
import { formatInt, clamp } from './format';
import { entityState, entityNumberAttribute, isEntityId } from './resolve';
import {
  isWritableCover,
  isWritableSwitch,
  writeCover,
  writeCoverPosition,
  writeSwitch,
  callAction,
} from './service';
import type {
  DesCoverCardConfig,
  CoverSceneConfig,
  CoverItemConfig,
  CoverModeConfig,
  CoverModeColor,
  HomeAssistant,
} from './types';

/** Mode pill colour → CSS class (same tones as the other cards' pills). */
const MODE_PILL_CLASS: Record<CoverModeColor, string> = {
  blue: 'pill-blue',
  amber: 'pill-amber',
  gray: 'pill-gray',
};

/** Grid size in a HA sections view (column_span 3 → 36 columns): a third wide. */
const GRID_COLUMNS = 12;
/** Collapsed the card is short: header, group row, scene tiles, chevron. */
const GRID_ROWS = 3;
const GRID_MIN_ROWS = 3;

const DEFAULT_NAME = 'Rollläden';
const MAX_SCENES = 6;

/** The position bar writes on release, debounced (like the dehumidifier slider). */
const WRITE_DEBOUNCE_MS = 300;
/** How long an optimistic position survives without the entity confirming it. */
const SETTLE_TIMEOUT_MS = 8000;
/** Scene-tile tap feedback duration. */
const SCENE_FLASH_MS = 100;

/** A cover reduced to what the card draws. */
interface CoverView {
  entity: string;
  name: string;
  /** 0-100, or null when the position cannot be read. */
  position: number | null;
  /** `open` / `closed` / `opening` / `closing`, or null. */
  state: string | null;
  readable: boolean;
}

interface SectionView {
  name: string;
  covers: CoverView[];
}

/** Demo group + floors, so the editor preview shows every element. */
const DEMO_GROUP = { entity: 'cover.__demo_group__', position: 65 };
const DEMO_SECTIONS: ReadonlyArray<{
  name: string;
  covers: ReadonlyArray<{ entity: string; name: string; position: number }>;
}> = [
  {
    name: 'Erdgeschoss',
    covers: [
      { entity: 'cover.__demo_eg_flur__', name: 'Flur', position: 100 },
      { entity: 'cover.__demo_eg_wohnen__', name: 'Wohnzimmer', position: 40 },
      { entity: 'cover.__demo_eg_kueche__', name: 'Küche', position: 0 },
    ],
  },
  {
    name: 'Obergeschoss',
    covers: [
      { entity: 'cover.__demo_og_bad__', name: 'Bad', position: 65 },
      { entity: 'cover.__demo_og_schlaf__', name: 'Schlafzimmer', position: 0 },
      { entity: 'cover.__demo_og_kind__', name: 'Kinderzimmer', position: 100 },
    ],
  },
];

export class DesCoverCard extends LitElement {
  static override properties = {
    hass: { attribute: false },
    _config: { state: true },
    _expanded: { state: true },
    _posLocal: { state: true },
    _modeLocal: { state: true },
    _flashScene: { state: true },
  };

  declare hass?: HomeAssistant;
  declare _config?: DesCoverCardConfig;
  declare _expanded: boolean;
  /** Optimistic per-entity positions while a write is in flight / being dragged. */
  declare _posLocal: Record<string, number>;
  /** Optimistic per-entity on/off of the automatic modes. */
  declare _modeLocal: Record<string, boolean>;
  declare _flashScene: number | null;

  private _closer = new OverlayCloser(this, () => this._collapse());
  private _writeTimers = new Map<string, number>();
  private _settleTimers = new Map<string, number>();

  constructor() {
    super();
    this._expanded = false;
    this._posLocal = {};
    this._modeLocal = {};
    this._flashScene = null;
  }

  setConfig(config: DesCoverCardConfig): void {
    if (!config) {
      throw new Error('des-cover-card: Konfiguration fehlt');
    }
    if (config.scenes !== undefined) {
      if (!Array.isArray(config.scenes)) {
        throw new Error('des-cover-card: "scenes" muss eine Liste sein');
      }
      if (config.scenes.length > MAX_SCENES) {
        throw new Error(`des-cover-card: höchstens ${MAX_SCENES} "scenes"`);
      }
      for (const scene of config.scenes) {
        if (!scene || !scene.name) {
          throw new Error('des-cover-card: jede Szene braucht "name"');
        }
        if (typeof scene.action?.service !== 'string') {
          throw new Error(`des-cover-card: Szene "${scene?.name}" braucht action.service`);
        }
      }
    }
    if (config.sections !== undefined) {
      if (!Array.isArray(config.sections)) {
        throw new Error('des-cover-card: "sections" muss eine Liste sein');
      }
      for (const section of config.sections) {
        if (!section || !section.name || !Array.isArray(section.covers)) {
          throw new Error('des-cover-card: jede Sektion braucht "name" und "covers"');
        }
        for (const cover of section.covers) {
          if (!cover || !cover.entity || !cover.name) {
            throw new Error('des-cover-card: jeder Rollladen braucht "entity" und "name"');
          }
        }
      }
    }

    if (config.modes !== undefined) {
      if (!Array.isArray(config.modes)) {
        throw new Error('des-cover-card: "modes" muss eine Liste sein');
      }
      for (const mode of config.modes) {
        if (!mode || !mode.entity || !mode.name) {
          throw new Error('des-cover-card: jeder Modus braucht "entity" und "name"');
        }
        if (mode.color !== undefined && !['blue', 'amber', 'gray'].includes(mode.color)) {
          throw new Error('des-cover-card: "color" muss "blue", "amber" oder "gray" sein');
        }
      }
    }

    this._config = config;
    this._expanded = false;
    this._posLocal = {};
    this._modeLocal = {};
  }

  getCardSize(): number {
    return GRID_ROWS;
  }

  getGridOptions(): { columns: number; rows: number; min_rows: number } {
    return { columns: GRID_COLUMNS, rows: GRID_ROWS, min_rows: GRID_MIN_ROWS };
  }

  static getStubConfig(): DesCoverCardConfig {
    return { type: 'custom:des-cover-card', name: DEFAULT_NAME };
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._closer.deactivate();
    for (const timer of this._writeTimers.values()) window.clearTimeout(timer);
    this._writeTimers.clear();
    for (const timer of this._settleTimers.values()) window.clearTimeout(timer);
    this._settleTimers.clear();
  }

  /** Drops optimistic positions the entity has meanwhile confirmed. */
  protected override willUpdate(): void {
    // Modes use real entities even in the (cover-)demo, so clear them first.
    if (Object.keys(this._modeLocal).length > 0) {
      let next = this._modeLocal;
      let changed = false;
      for (const [entity, val] of Object.entries(this._modeLocal)) {
        const state = entityState(entity, this.hass);
        if (state !== null && (state.toLowerCase() === 'on') === val) {
          if (!changed) {
            next = { ...this._modeLocal };
            changed = true;
          }
          delete next[entity];
          this._clearSettle(`mode:${entity}`);
        }
      }
      if (changed) this._modeLocal = next;
    }

    if (this._isDemo) return;
    const keys = Object.keys(this._posLocal);
    if (keys.length === 0) return;

    let next = this._posLocal;
    let changed = false;
    for (const entity of keys) {
      const attr = entityNumberAttribute(entity, this.hass, 'current_position');
      if (attr !== null && Math.round(clamp(attr, 0, 100)) === this._posLocal[entity]) {
        if (!changed) {
          next = { ...this._posLocal };
          changed = true;
        }
        delete next[entity];
        this._clearSettle(entity);
      }
    }
    if (changed) this._posLocal = next;
  }

  protected override updated(): void {
    this.toggleAttribute('expanded', this._expanded);
  }

  // =========================================================================
  // view model
  // =========================================================================

  private get _isDemo(): boolean {
    const c = this._config;
    return !c?.group_entity && !(c?.sections && c.sections.length > 0);
  }

  /** Live position (local override wins), null when unreadable. */
  private _livePosition(entity: string): number | null {
    const local = this._posLocal[entity];
    if (local !== undefined) return local;
    const attr = entityNumberAttribute(entity, this.hass, 'current_position');
    return attr === null ? null : Math.round(clamp(attr, 0, 100));
  }

  private _coverView(item: CoverItemConfig): CoverView {
    const position = this._livePosition(item.entity);
    const state = entityState(item.entity, this.hass);
    return {
      entity: item.entity,
      name: item.name,
      position,
      state,
      readable: position !== null || state !== null,
    };
  }

  private _sectionViews(): SectionView[] {
    if (this._isDemo) {
      return DEMO_SECTIONS.map((s) => ({
        name: s.name,
        covers: s.covers.map((c) => ({
          entity: c.entity,
          name: c.name,
          position: this._posLocal[c.entity] ?? c.position,
          state: null,
          readable: true,
        })),
      }));
    }
    return (this._config?.sections ?? []).map((s) => ({
      name: s.name,
      covers: s.covers.map((c) => this._coverView(c)),
    }));
  }

  private _groupView(): CoverView | null {
    if (this._isDemo) {
      return {
        entity: DEMO_GROUP.entity,
        name: 'Haus',
        position: this._posLocal[DEMO_GROUP.entity] ?? DEMO_GROUP.position,
        state: null,
        readable: true,
      };
    }
    const id = this._config?.group_entity;
    if (!isEntityId(id)) return null;
    const position = this._livePosition(id as string);
    const state = entityState(id as string, this.hass);
    return {
      entity: id as string,
      name: 'Haus',
      position,
      state,
      readable: position !== null || state !== null,
    };
  }

  /** offen = 100, zu = 0, sonst teilweise; ohne Position nach state. */
  private _counts(covers: CoverView[]): { open: number; closed: number; partial: number } {
    let open = 0;
    let closed = 0;
    let partial = 0;
    for (const c of covers) {
      if (!c.readable) continue;
      if (c.position !== null) {
        if (c.position >= 100) open++;
        else if (c.position <= 0) closed++;
        else partial++;
      } else if (c.state === 'open') {
        open++;
      } else if (c.state === 'closed') {
        closed++;
      } else {
        partial++;
      }
    }
    return { open, closed, partial };
  }

  private _sceneAvailable(scene: CoverSceneConfig): boolean {
    const target = scene.action?.target?.entity_id;
    const id = Array.isArray(target) ? target[0] : target;
    if (!this.hass || typeof id !== 'string') return true;
    return this.hass.states?.[id] !== undefined;
  }

  // =========================================================================
  // render
  // =========================================================================

  override render(): TemplateResult | typeof nothing {
    const config = this._config;
    if (!config) return nothing;

    const sections = this._sectionViews();
    const allCovers = sections.flatMap((s) => s.covers);
    const counts = this._counts(allCovers);
    const group = this._groupView();
    const scenes = config.scenes ?? [];
    const modes = config.modes ?? [];
    const activeModes = modes.filter((m) => this._modeOn(m.entity) === true);

    const meta = `${counts.open} offen · ${counts.closed} zu · ${counts.partial} teilweise`;

    return html`
      <ha-card>
        <div class="card">
          <div class="header">
            <span class="name">${config.name ?? DEFAULT_NAME}</span>
            <div class="head-right">
              <div class="badges">
                ${activeModes.map(
                  (m) => html`<span class="badge ${MODE_PILL_CLASS[m.color ?? 'blue']}">
                    <span class="badge-label">${m.name}</span>
                  </span>`,
                )}
              </div>
              <div class="meta">${meta}</div>
            </div>
          </div>

          ${group
            ? html`<div class="group-row">
                <span class="row-label group">Haus</span>
                ${this._renderPosControl(group)}
              </div>`
            : nothing}

          ${scenes.length > 0
            ? html`<div class="tiles">
                ${scenes.map((scene, index) => this._renderScene(scene, index))}
              </div>`
            : nothing}

          ${modes.length > 0 ? this._renderModes(modes) : nothing}

          <div
            class="chevron-row clickable"
            role="button"
            tabindex="0"
            aria-expanded=${String(this._expanded)}
            aria-label="Details"
            @click=${this._toggleExpanded}
            @keydown=${this._onKeydown}
          >
            <ha-icon
              class="chevron ${this._expanded ? 'open' : ''}"
              icon="mdi:chevron-down"
            ></ha-icon>
          </div>
        </div>
        ${this._expanded
          ? html`<div class="overlay">${this._renderSections(sections)}</div>`
          : nothing}
      </ha-card>
    `;
  }

  private _dash(): TemplateResult {
    return html`<span class="unavail">–</span>`;
  }

  /** On/off of an automatic mode (local override wins), null when unreadable. */
  private _modeOn(entity: string): boolean | null {
    const local = this._modeLocal[entity];
    if (local !== undefined) return local;
    const state = entityState(entity, this.hass);
    return state === null ? null : state.toLowerCase() === 'on';
  }

  /** The "Automatik" row under the scene tiles: label + a segmented per mode. */
  private _renderModes(modes: CoverModeConfig[]): TemplateResult {
    return html`
      <div class="modes-row">
        <span class="modes-title">Automatik</span>
        <div class="modes">
          ${modes.map((mode) => {
            const on = this._modeOn(mode.entity);
            const disabled = !isWritableSwitch(mode.entity);
            return html`
              <div class="mode">
                <span class="mode-name">${mode.name}</span>
                ${renderSegmented<'on' | 'off'>(
                  [
                    { value: 'on', label: 'An' },
                    { value: 'off', label: 'Aus' },
                  ],
                  on === null ? null : on ? 'on' : 'off',
                  (value) => this._setMode(mode.entity, value === 'on'),
                  mode.name,
                  disabled,
                )}
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  private _setMode(entity: string, on: boolean): void {
    this._modeLocal = { ...this._modeLocal, [entity]: on };
    if (!isWritableSwitch(entity)) return;
    this._holdOptimistic(`mode:${entity}`, () => this._clearModeLocal(entity));
    void this._write(writeSwitch(this.hass, entity, on), () => {
      this._clearSettle(`mode:${entity}`);
      this._clearModeLocal(entity);
    });
  }

  private _clearModeLocal(entity: string): void {
    if (this._modeLocal[entity] === undefined) return;
    const next = { ...this._modeLocal };
    delete next[entity];
    this._modeLocal = next;
  }

  private _renderScene(scene: CoverSceneConfig, index: number): TemplateResult {
    const available = this._sceneAvailable(scene);
    return html`
      <button
        class="tile ${this._flashScene === index ? 'flash' : ''}"
        ?disabled=${!available}
        title=${available ? nothing : 'Nicht verfügbar'}
        @click=${() => this._onScene(scene, index)}
      >
        ${scene.icon ? html`<ha-icon icon=${scene.icon}></ha-icon>` : nothing}
        <span class="tile-label">${scene.name}</span>
      </button>
    `;
  }

  private _renderSections(sections: SectionView[]): TemplateResult {
    return html`
      <div class="sections">
        ${sections.map(
          (section) => html`
            <div class="section">
              <div class="section-title">${section.name}</div>
              ${section.covers.map((cover) => this._renderCoverRow(cover))}
            </div>
          `,
        )}
      </div>
    `;
  }

  private _renderCoverRow(cover: CoverView): TemplateResult {
    return html`
      <div class="cover-row ${cover.readable ? '' : 'dim'}">
        <span class="row-label cover">${cover.name}</span>
        ${this._renderPosControl(cover)}
      </div>
    `;
  }

  /** Position bar + percent + ▲ ■ ▼, shared by the group row and cover rows. */
  private _renderPosControl(view: CoverView): TemplateResult {
    const { entity, position, state, readable } = view;
    const fill = position ?? 0;
    const stopActive = state === 'opening' || state === 'closing';

    return html`
      <div class="pos" style="--fill:${fill}%">
        <input
          class="pos-input"
          type="range"
          min="0"
          max="100"
          step="1"
          .value=${String(position ?? 0)}
          ?disabled=${!readable}
          aria-label="Position ${view.name}"
          @input=${(ev: Event) => this._onPosInput(entity, ev)}
          @change=${(ev: Event) => this._onPosChange(entity, ev)}
        />
      </div>
      <span class="pos-pct">
        ${position === null ? this._dash() : `${formatInt(position)} %`}
      </span>
      ${renderIconButtons<'close' | 'stop' | 'open'>(
        [
          { value: 'close', icon: 'mdi:chevron-down', label: 'Schließen', disabled: !readable },
          {
            value: 'stop',
            icon: 'mdi:stop',
            label: 'Stopp',
            active: stopActive,
            disabled: !readable,
          },
          { value: 'open', icon: 'mdi:chevron-up', label: 'Öffnen', disabled: !readable },
        ],
        (action) => this._cover(entity, action),
        `Rollladen ${view.name}`,
      )}
    `;
  }

  // =========================================================================
  // interaction
  // =========================================================================

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

  private _setPosLocal(entity: string, value: number): void {
    this._posLocal = { ...this._posLocal, [entity]: clamp(Math.round(value), 0, 100) };
  }

  private _clearPosLocal(entity: string): void {
    if (this._posLocal[entity] === undefined) return;
    const next = { ...this._posLocal };
    delete next[entity];
    this._posLocal = next;
  }

  /** Dragging only moves the UI; the write happens on release (debounced). */
  private _onPosInput(entity: string, ev: Event): void {
    this._setPosLocal(entity, Number((ev.target as HTMLInputElement).value));
  }

  private _onPosChange(entity: string, ev: Event): void {
    const value = clamp(Math.round(Number((ev.target as HTMLInputElement).value)), 0, 100);
    this._setPosLocal(entity, value);
    if (this._isDemo || !isWritableCover(entity)) return;

    const pending = this._writeTimers.get(entity);
    if (pending !== undefined) window.clearTimeout(pending);
    this._writeTimers.set(
      entity,
      window.setTimeout(() => {
        this._writeTimers.delete(entity);
        this._holdOptimistic(entity, () => this._clearPosLocal(entity));
        void this._write(writeCoverPosition(this.hass, entity, value), () => {
          this._clearSettle(entity);
          this._clearPosLocal(entity);
        });
      }, WRITE_DEBOUNCE_MS),
    );
  }

  private _cover(entity: string, action: 'open' | 'close' | 'stop'): void {
    if (this._isDemo || !isWritableCover(entity)) return;
    void this._write(writeCover(this.hass, entity, action), () => undefined);
  }

  private _onScene(scene: CoverSceneConfig, index: number): void {
    this._flashScene = index;
    window.setTimeout(() => {
      if (this._flashScene === index) this._flashScene = null;
    }, SCENE_FLASH_MS);
    void this._write(callAction(this.hass, scene.action), () => undefined);
  }

  private _holdOptimistic(key: string, release: () => void): void {
    this._clearSettle(key);
    this._settleTimers.set(
      key,
      window.setTimeout(() => {
        this._settleTimers.delete(key);
        release();
      }, SETTLE_TIMEOUT_MS),
    );
  }

  private _clearSettle(key: string): void {
    const timer = this._settleTimers.get(key);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      this._settleTimers.delete(key);
    }
  }

  private async _write(call: Promise<unknown>, onFailure: () => void): Promise<void> {
    try {
      await call;
    } catch (error) {
      onFailure();
      // eslint-disable-next-line no-console
      console.error('des-cover-card: Service-Call fehlgeschlagen', error);
    }
  }

  static override styles = [
    tokenStyles,
    chevronStyles,
    overlayStyles,
    iconButtonStyles,
    segmentedStyles,
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

      /* --- header --- */

      .header {
        flex: 0 0 auto;
        display: flex;
        align-items: flex-start;
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

      .head-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 3px;
        flex-shrink: 0;
        min-width: 0;
      }

      .badges {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
        justify-content: flex-end;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 20px;
        padding: 0 9px;
        border-radius: 10px;
        font-size: 11px;
        font-weight: 500;
        line-height: 1;
        white-space: nowrap;
      }

      .badge-label {
        display: block;
        transform: translateY(1px);
      }

      .pill-blue {
        background: rgba(33, 150, 243, 0.16);
        background: color-mix(in srgb, var(--info-color, #2196f3) 16%, transparent);
        color: var(--info-color, #2196f3);
      }

      .pill-amber {
        background: rgba(255, 152, 0, 0.16);
        background: color-mix(in srgb, var(--warning-color, #ff9800) 16%, transparent);
        color: var(--warning-color, #ff9800);
      }

      .pill-gray {
        background: rgba(127, 127, 127, 0.16);
        background: color-mix(in srgb, var(--secondary-text-color, #727272) 16%, transparent);
        color: var(--secondary-text-color);
      }

      .meta {
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        flex-shrink: 0;
      }

      .unavail {
        color: var(--secondary-text-color);
        opacity: 0.7;
      }

      /* --- automatic modes row --- */

      .modes-row {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-top: 12px;
        padding-top: 10px;
        border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.18));
      }

      .modes-title {
        font-size: 11px;
        color: var(--secondary-text-color);
        letter-spacing: 0.04em;
        flex-shrink: 0;
      }

      .modes {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
        margin-left: auto;
        justify-content: flex-end;
      }

      .mode {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .mode-name {
        font-size: 13px;
        color: var(--primary-text-color);
        white-space: nowrap;
      }

      /* --- group row / cover row --- */

      .group-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 12px;
      }

      .row-label {
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        flex-shrink: 0;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .row-label.group {
        width: 44px;
        color: var(--primary-text-color);
      }

      .row-label.cover {
        width: 112px;
        color: var(--primary-text-color);
      }

      /* --- position bar --- */

      .pos {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
      }

      .pos-input {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        min-width: 0;
        height: 14px;
        background: none;
        cursor: pointer;
      }

      .pos-input:disabled {
        opacity: 0.35;
        cursor: not-allowed;
      }

      /* Webkit: the fill is painted into the track from the --fill percentage. */
      .pos-input::-webkit-slider-runnable-track {
        height: 6px;
        border-radius: 3px;
        background: linear-gradient(
          to right,
          var(--primary-color, #03a9f4) var(--fill, 0%),
          var(--divider-color, rgba(127, 127, 127, 0.3)) var(--fill, 0%)
        );
      }

      .pos-input::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--primary-color, #03a9f4);
        border: 2px solid var(--card-background-color, #fff);
        margin-top: -4px;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
      }

      /* Firefox: track + progress do the fill, thumb is the knob. */
      .pos-input::-moz-range-track {
        height: 6px;
        border-radius: 3px;
        background: var(--divider-color, rgba(127, 127, 127, 0.3));
      }

      .pos-input::-moz-range-progress {
        height: 6px;
        border-radius: 3px;
        background: var(--primary-color, #03a9f4);
      }

      .pos-input::-moz-range-thumb {
        width: 14px;
        height: 14px;
        border: 2px solid var(--card-background-color, #fff);
        border-radius: 50%;
        background: var(--primary-color, #03a9f4);
      }

      .pos-input:focus-visible {
        outline: 2px solid var(--primary-color, #03a9f4);
        outline-offset: 2px;
        border-radius: 3px;
      }

      .pos-pct {
        min-width: 34px;
        text-align: right;
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        flex-shrink: 0;
      }

      /* The ▼ ■ ▲ buttons come from the shared icon-buttons module. */

      /* --- scene tiles --- */

      .tiles {
        display: flex;
        gap: 6px;
        margin-top: 12px;
      }

      .tile {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 3px;
        padding: 8px 4px;
        background: none;
        border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.28));
        border-radius: 5px;
        color: var(--secondary-text-color);
        cursor: pointer;
        font-family: inherit;
        transition: background 0.1s ease-out;
      }

      .tile:hover {
        color: var(--primary-text-color);
      }

      .tile:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .tile.flash {
        background: rgba(3, 169, 244, 0.12);
        background: color-mix(in srgb, var(--primary-color, #03a9f4) 12%, transparent);
      }

      .tile:focus-visible {
        outline: 2px solid var(--primary-color, #03a9f4);
        outline-offset: -2px;
      }

      .tile ha-icon {
        --mdc-icon-size: 20px;
        width: 20px;
        height: 20px;
      }

      .tile-label {
        font-size: 11px;
        line-height: 1.1;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }

      /* --- expanded sections --- */

      .sections {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .section-title {
        font-size: 11px;
        color: var(--secondary-text-color);
        letter-spacing: 0.04em;
        margin-bottom: 2px;
      }

      .cover-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 0;
        border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.18));
      }

      .cover-row.dim {
        opacity: 0.5;
      }
    `,
  ];
}

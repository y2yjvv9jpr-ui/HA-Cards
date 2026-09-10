import { LitElement, html, svg, css, nothing, type TemplateResult } from 'lit';
import { renderSegmented, segmentedStyles } from './segmented';
import { chevronStyles } from './chevron';
import { overlayStyles, OverlayCloser } from './overlay';
import { tokenStyles } from './tokens';
import { formatInt, clamp } from './format';
import {
  entityState,
  entityNumberAttribute,
  isEntityId,
  resolveNumber,
  type Resolved,
} from './resolve';
import {
  domainOf,
  isWritablePower,
  isWritableHumidity,
  isWritableSwitch,
  writePower,
  writeHumidity,
  writeSwitch,
  writeSelect,
} from './service';
import type {
  DesDehumidifierCardConfig,
  DehumidifierFaultConfig,
  HomeAssistant,
} from './types';

/** Grid size in a HA sections view (column_span 3 → 36 columns): a third wide,
    tall enough for the 24-h chart to read (Daniel lays the card out at rows 5). */
const GRID_COLUMNS = 12;
const GRID_ROWS = 5;
const GRID_MIN_ROWS = 4;

/** Defaults for the slider / bar range and the chart span. */
const DEFAULT_TARGET_MIN = 30;
const DEFAULT_TARGET_MAX = 80;
const DEFAULT_TARGET_STEP = 5;
const DEFAULT_HISTORY_HOURS = 24;
const DEFAULT_NAME = 'Luftentfeuchter';
const DEFAULT_OFF_OPTION = 'Abbrechen';

/** The target-humidity slider writes on release, debounced. */
const WRITE_DEBOUNCE_MS = 300;
/** How long an optimistic value survives without the entity confirming it. */
const SETTLE_TIMEOUT_MS = 8000;

/** History is refetched on this cadence (plus once on every (re)connect). */
const HISTORY_REFRESH_MS = 5 * 60 * 1000;

/** Chart geometry. */
const CHART_MIN_HEIGHT_PX = 140;
const CHART_MARGIN = { top: 6, right: 8, bottom: 18, left: 30 } as const;
/** The y-axis is rounded to 10 % ticks and spans at least this much. */
const Y_TICK = 10;
const Y_MIN_SPAN = 20;
/** One x-axis time tick every 6 hours, plus a "jetzt" tick at the right edge. */
const X_TICK_HOURS = 6;
/** Ignore sub-pixel jitter, so measuring never chases its own writes. */
const SIZE_EPSILON_PX = 2;

/** States that count as "on" for the fault / power / lock reads. */
function isOn(state: string | null): boolean {
  return state !== null && state.trim().toLowerCase() === 'on';
}

interface HistoryItem {
  s?: string;
  state?: string;
  lu?: number;
  last_updated?: number;
  last_changed?: number;
}
type HistoryResponse = Record<string, HistoryItem[] | undefined>;

interface Point {
  /** Milliseconds since the epoch. */
  t: number;
  /** Humidity in percent. */
  v: number;
}

interface Range {
  min: number;
  max: number;
  step: number;
}

/** Nearest step inside the range, trimming float noise. */
function snap(value: number, range: Range): number {
  const { min, max, step } = range;
  if (!(step > 0)) return clamp(value, min, max);
  const steps = Math.round((value - min) / step);
  const snapped = Number((min + steps * step).toFixed(6));
  return clamp(snapped, min, max);
}

/** HH:mm in the browser's locale, 24-hour. */
function hhmm(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Shortens a countdown option for the segmented control: the off option becomes
 * "Aus", "1 Stunde"/"2 Stunden" become "1 h"/"2 h" (leading number + " h"), and
 * anything without a leading number is left untouched.
 */
function shortenCountdown(option: string, offOption: string): string {
  if (option.trim().toLowerCase() === offOption.trim().toLowerCase()) return 'Aus';
  const match = option.trim().match(/^(\d+(?:[.,]\d+)?)/);
  return match ? `${match[1].replace(',', '.')} h` : option;
}

export class DesDehumidifierCard extends LitElement {
  static override properties = {
    hass: { attribute: false },
    _config: { state: true },
    _expanded: { state: true },
    _targetLocal: { state: true },
    _powerLocal: { state: true },
    _countdownLocal: { state: true },
    _lockLocal: { state: true },
    _history: { state: true },
    _chartW: { state: true },
    _chartH: { state: true },
  };

  declare hass?: HomeAssistant;
  declare _config?: DesDehumidifierCardConfig;
  declare _expanded: boolean;

  // `null` follows the entity; a value is an optimistic local override.
  declare _targetLocal: number | null;
  declare _powerLocal: boolean | null;
  declare _countdownLocal: string | null;
  declare _lockLocal: boolean | null;

  declare _history: Point[];
  declare _chartW: number;
  declare _chartH: number;

  private _closer = new OverlayCloser(this, () => this._collapse());
  private _writeTimer?: number;
  private _settleTimers = new Map<string, number>();

  private _historyStarted = false;
  private _historyTimer?: number;

  private _resizeObserver?: ResizeObserver;
  private _observedChart?: HTMLElement;

  constructor() {
    super();
    this._expanded = false;
    this._targetLocal = null;
    this._powerLocal = null;
    this._countdownLocal = null;
    this._lockLocal = null;
    this._history = [];
    this._chartW = 0;
    this._chartH = 0;
  }

  setConfig(config: DesDehumidifierCardConfig): void {
    if (!config) {
      throw new Error('des-dehumidifier-card: Konfiguration fehlt');
    }
    if (config.faults !== undefined) {
      if (!Array.isArray(config.faults)) {
        throw new Error('des-dehumidifier-card: "faults" muss eine Liste sein');
      }
      for (const fault of config.faults) {
        if (!fault || typeof fault.entity !== 'string' || !fault.entity) {
          throw new Error('des-dehumidifier-card: jeder "faults"-Eintrag braucht "entity"');
        }
        if (!fault.name) {
          throw new Error('des-dehumidifier-card: jeder "faults"-Eintrag braucht "name"');
        }
        if (
          fault.severity !== undefined &&
          fault.severity !== 'error' &&
          fault.severity !== 'warning'
        ) {
          throw new Error(
            'des-dehumidifier-card: "severity" muss "error" oder "warning" sein',
          );
        }
      }
    }

    this._config = config;
    this._expanded = false;
    this._targetLocal = null;
    this._powerLocal = null;
    this._countdownLocal = null;
    this._lockLocal = null;

    // A new config can flip demo/live or change the span; rebuild the history.
    this._historyStarted = false;
    this._history = this._isDemo ? this._buildDemoHistory() : [];
  }

  getCardSize(): number {
    return GRID_ROWS;
  }

  getGridOptions(): { columns: number; rows: number; min_rows: number } {
    return { columns: GRID_COLUMNS, rows: GRID_ROWS, min_rows: GRID_MIN_ROWS };
  }

  static getStubConfig(): DesDehumidifierCardConfig {
    // No entities → the canned demo, so the editor preview shows every element.
    return {
      type: 'custom:des-dehumidifier-card',
      name: DEFAULT_NAME,
      location: 'Arbeitszimmer',
    };
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._closer.deactivate();
    if (this._writeTimer !== undefined) window.clearTimeout(this._writeTimer);
    for (const timer of this._settleTimers.values()) window.clearTimeout(timer);
    this._settleTimers.clear();
    if (this._historyTimer !== undefined) window.clearInterval(this._historyTimer);
    this._historyTimer = undefined;
    // Refetch on reconnect ("außerdem beim Verbinden").
    this._historyStarted = false;
    this._resizeObserver?.disconnect();
    this._resizeObserver = undefined;
    this._observedChart = undefined;
  }

  /** Drops optimistic values the entity has meanwhile confirmed. */
  protected override willUpdate(): void {
    const config = this._config;
    if (!config) return;

    if (this._targetLocal !== null && isEntityId(config.humidifier_entity)) {
      const attr = entityNumberAttribute(
        config.humidifier_entity as string,
        this.hass,
        'humidity',
      );
      if (attr !== null && snap(attr, this._targetRange()) === this._targetLocal) {
        this._targetLocal = null;
        this._clearSettle('target');
      }
    }

    if (this._powerLocal !== null && isEntityId(config.power_entity)) {
      const state = entityState(config.power_entity as string, this.hass);
      if (state !== null && isOn(state) === this._powerLocal) {
        this._powerLocal = null;
        this._clearSettle('power');
      }
    }

    if (this._countdownLocal !== null && isEntityId(config.countdown_entity)) {
      const state = entityState(config.countdown_entity as string, this.hass);
      if (state !== null && state === this._countdownLocal) {
        this._countdownLocal = null;
        this._clearSettle('countdown');
      }
    }

    if (this._lockLocal !== null && isEntityId(config.child_lock_entity)) {
      const state = entityState(config.child_lock_entity as string, this.hass);
      if (state !== null && isOn(state) === this._lockLocal) {
        this._lockLocal = null;
        this._clearSettle('lock');
      }
    }
  }

  protected override updated(): void {
    this.toggleAttribute('expanded', this._expanded);
    this._maybeStartHistory();

    const container = this.renderRoot?.querySelector('#chart') as HTMLElement | null;
    this._observeChartSize(container);
    this._measureChart();
  }

  // =========================================================================
  // demo / live
  // =========================================================================

  private get _isDemo(): boolean {
    const c = this._config;
    return (
      !c?.humidity_entity &&
      !c?.humidifier_entity &&
      !c?.power_entity &&
      !c?.countdown_entity &&
      !c?.child_lock_entity
    );
  }

  private _targetRange(): Range {
    const c = this._config;
    const min = c?.target_min ?? DEFAULT_TARGET_MIN;
    const max = c?.target_max ?? DEFAULT_TARGET_MAX;
    const step = c?.target_step ?? DEFAULT_TARGET_STEP;
    if (!(min < max) || !(step > 0)) {
      return {
        min: DEFAULT_TARGET_MIN,
        max: DEFAULT_TARGET_MAX,
        step: DEFAULT_TARGET_STEP,
      };
    }
    return { min, max, step };
  }

  private _historyHours(): number {
    const h = this._config?.history_hours;
    return typeof h === 'number' && h > 0 ? h : DEFAULT_HISTORY_HOURS;
  }

  private _offOption(): string {
    const o = this._config?.countdown_off_option;
    return typeof o === 'string' && o.trim().length > 0 ? o : DEFAULT_OFF_OPTION;
  }

  /** Current relative humidity. */
  private _humidity(): Resolved<number> {
    if (this._isDemo) return { kind: 'value', value: 52 };
    return resolveNumber(this._config?.humidity_entity, this.hass);
  }

  /** Target humidity, `null` when it cannot be read. */
  private _target(): number | null {
    if (this._targetLocal !== null) return this._targetLocal;
    if (this._isDemo) return 45;
    const id = this._config?.humidifier_entity;
    if (!isEntityId(id)) return null;
    const attr = entityNumberAttribute(id as string, this.hass, 'humidity');
    return attr === null ? null : attr;
  }

  /** Device on/off, `null` when it cannot be read. */
  private _powerOn(): boolean | null {
    if (this._powerLocal !== null) return this._powerLocal;
    if (this._isDemo) return true;
    const id = this._config?.power_entity;
    if (!isEntityId(id)) return null;
    const state = entityState(id as string, this.hass);
    return state === null ? null : isOn(state);
  }

  /** Options the countdown select offers. */
  private _countdownOptions(): string[] {
    if (this._isDemo) {
      return [this._offOption(), '1 Stunde', '2 Stunden', '4 Stunden'];
    }
    const id = this._config?.countdown_entity;
    if (!isEntityId(id)) return [];
    const options = this.hass?.states?.[id as string]?.attributes?.options;
    return Array.isArray(options)
      ? options.filter((o): o is string => typeof o === 'string')
      : [];
  }

  /** Current countdown option, `null` when it cannot be read. */
  private _countdown(): string | null {
    if (this._countdownLocal !== null) return this._countdownLocal;
    if (this._isDemo) return this._offOption();
    const id = this._config?.countdown_entity;
    if (!isEntityId(id)) return null;
    return entityState(id as string, this.hass);
  }

  /** Child lock on/off, `null` when it cannot be read. */
  private _lockOn(): boolean | null {
    if (this._lockLocal !== null) return this._lockLocal;
    if (this._isDemo) return false;
    const id = this._config?.child_lock_entity;
    if (!isEntityId(id)) return null;
    const state = entityState(id as string, this.hass);
    return state === null ? null : isOn(state);
  }

  /** The active faults, in configured order. */
  private _activeFaults(): DehumidifierFaultConfig[] {
    const faults = this._config?.faults ?? [];
    if (this._isDemo) return [];
    return faults.filter((f) => isOn(entityState(f.entity, this.hass)));
  }

  // =========================================================================
  // render
  // =========================================================================

  override render(): TemplateResult | typeof nothing {
    const config = this._config;
    if (!config) return nothing;

    const humidity = this._humidity();
    const target = this._target();
    const on = this._powerOn();
    const range = this._targetRange();
    const faults = this._activeFaults();
    const hasError = faults.some((f) => (f.severity ?? 'error') === 'error');

    const overTarget =
      on === true && humidity.kind === 'value' && target !== null
        ? Math.round(humidity.value - target)
        : null;

    const metaParts = [
      config.location,
      `Ziel ${target === null ? '–' : `${Math.round(target)} %`}`,
    ].filter((p): p is string => typeof p === 'string' && p.length > 0);

    return html`
      <ha-card>
        <div class="card">
          <div class="header">
            <div class="head-left">
              <span class="name">${config.name ?? DEFAULT_NAME}</span>
              <div class="meta">${metaParts.join(' · ')}</div>
            </div>
            <div class="badges">
              ${faults.map((f) => this._renderFaultBadge(f))}
              ${this._renderCountdownBadge()}
              ${hasError ? nothing : this._renderStatusBadge(on, humidity, target)}
            </div>
          </div>

          <div class="value-row">
            <div class="value-main">
              <span class="value-num">
                ${humidity.kind === 'value'
                  ? `${formatInt(humidity.value)} %`
                  : this._dash()}
              </span>
              <span class="value-label">Luftfeuchte</span>
            </div>
            ${overTarget !== null && overTarget > 0
              ? html`<span class="value-over">${formatInt(overTarget)} % über Ziel</span>`
              : nothing}
          </div>

          ${this._renderBar(humidity, target, range)}
          ${this._renderChart(target)}

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
          ? html`<div class="overlay">${this._renderControls(range, target)}</div>`
          : nothing}
      </ha-card>
    `;
  }

  private _dash(): TemplateResult {
    return html`<span class="unavail">–</span>`;
  }

  private _renderBadge(label: string, modifier: string): TemplateResult {
    return html`<span class="badge ${modifier}">
      <span class="badge-label">${label}</span>
    </span>`;
  }

  private _renderFaultBadge(fault: DehumidifierFaultConfig): TemplateResult {
    const severity = fault.severity ?? 'error';
    return this._renderBadge(
      fault.name,
      severity === 'warning' ? 'badge-warn' : 'badge-error',
    );
  }

  /** "Max-Trocknen <Option>" in blue while the countdown is not off. */
  private _renderCountdownBadge(): TemplateResult | typeof nothing {
    const current = this._countdown();
    if (current === null) return nothing;
    if (current.trim().toLowerCase() === this._offOption().trim().toLowerCase()) {
      return nothing;
    }
    return this._renderBadge(`Max-Trocknen ${current}`, 'badge-info');
  }

  /**
   * "Läuft" (green, on and above target), "Bereit" (blue, on and at/below
   * target), "Aus" (grey, off). Omitted while an error fault is up (handled by
   * the caller) or while the power state is not readable.
   */
  private _renderStatusBadge(
    on: boolean | null,
    humidity: Resolved<number>,
    target: number | null,
  ): TemplateResult | typeof nothing {
    if (on === null) return nothing;
    if (on === false) return this._renderBadge('Aus', 'badge-neutral');
    const running =
      humidity.kind === 'value' && target !== null && humidity.value > target;
    return running
      ? this._renderBadge('Läuft', 'badge-run')
      : this._renderBadge('Bereit', 'badge-info');
  }

  /**
   * Horizontal bar over `target_min…target_max`, filled to the current humidity
   * and always blue (--primary-color), with a vertical target marker and a
   * scale line underneath. Unchanged by faults.
   */
  private _renderBar(
    humidity: Resolved<number>,
    target: number | null,
    range: Range,
  ): TemplateResult {
    const span = range.max - range.min;
    const fillPct =
      humidity.kind === 'value'
        ? clamp((humidity.value - range.min) / span, 0, 1) * 100
        : 0;
    const targetPct =
      target === null ? null : clamp((target - range.min) / span, 0, 1) * 100;

    return html`
      <div class="bar-wrap">
        <div class="bar">
          <div class="bar-fill" style="width:${fillPct}%"></div>
          ${targetPct === null
            ? nothing
            : html`<div class="bar-target" style="left:${targetPct}%"></div>`}
        </div>
        <div class="bar-scale">
          <span>${formatInt(range.min)}</span>
          <span>Ziel ${target === null ? '–' : formatInt(Math.round(target))}</span>
          <span>${formatInt(range.max)}</span>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // chart
  // =========================================================================

  private _observeChartSize(container: HTMLElement | null): void {
    if (typeof ResizeObserver === 'undefined') return;
    if (this._observedChart === (container ?? undefined)) return;

    this._resizeObserver?.disconnect();
    this._observedChart = container ?? undefined;
    if (!container) return;

    this._resizeObserver ??= new ResizeObserver(() => this._measureChart());
    this._resizeObserver.observe(container);
  }

  private _measureChart(): void {
    const container = this.renderRoot?.querySelector('#chart') as HTMLElement | null;
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w <= 0 || h <= 0) return;
    if (
      Math.abs(w - this._chartW) <= SIZE_EPSILON_PX &&
      Math.abs(h - this._chartH) <= SIZE_EPSILON_PX
    ) {
      return;
    }
    this._chartW = w;
    this._chartH = h;
  }

  private _maybeStartHistory(): void {
    if (this._isDemo || this._historyStarted) return;
    const id = this._config?.humidity_entity;
    if (!this.hass?.callWS || !isEntityId(id)) return;

    this._historyStarted = true;
    void this._fetchHistory();
    this._historyTimer = window.setInterval(
      () => void this._fetchHistory(),
      HISTORY_REFRESH_MS,
    );
  }

  private async _fetchHistory(): Promise<void> {
    const config = this._config;
    const hass = this.hass;
    const id = config?.humidity_entity;
    if (!config || !hass?.callWS || !isEntityId(id)) return;

    const end = new Date();
    const start = new Date(end.getTime() - this._historyHours() * 3600 * 1000);

    try {
      const result = await hass.callWS<HistoryResponse>({
        type: 'history/history_during_period',
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        entity_ids: [id as string],
        minimal_response: true,
        no_attributes: true,
        significant_changes_only: false,
      });

      const series = result?.[id as string] ?? [];
      const points: Point[] = [];
      for (const item of series) {
        const raw = item.s ?? item.state;
        const seconds = item.lu ?? item.last_updated ?? item.last_changed;
        if (raw === undefined || raw === null || seconds === undefined) continue;
        const lower = String(raw).trim().toLowerCase();
        if (lower === 'unavailable' || lower === 'unknown' || lower === '') continue;
        const value = Number.parseFloat(String(raw));
        if (!Number.isFinite(value)) continue;
        points.push({ t: seconds * 1000, v: value });
      }
      points.sort((a, b) => a.t - b.t);
      this._history = points;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('des-dehumidifier-card: Historie konnte nicht geladen werden', error);
    }
  }

  /** A plausible descending-then-steady 24-h trace for the editor preview. */
  private _buildDemoHistory(): Point[] {
    const hours = this._historyHours();
    const end = Date.now();
    const stepMs = 15 * 60 * 1000;
    const count = Math.round((hours * 3600 * 1000) / stepMs);
    const points: Point[] = [];
    for (let i = 0; i <= count; i++) {
      const t = end - (count - i) * stepMs;
      const frac = i / count; // 0 → oldest, 1 → now
      // Starts around 62 %, settles toward 52 %, with a gentle daily wobble.
      const base = 62 - 10 * frac;
      const wobble = 3 * Math.sin(frac * Math.PI * 4);
      points.push({ t, v: Math.round((base + wobble) * 10) / 10 });
    }
    return points;
  }

  /** y-axis bounds: data and target, rounded to 10 %, at least a 20 % span. */
  private _yBounds(target: number | null): { lo: number; hi: number } {
    const values = this._history.map((p) => p.v);
    if (target !== null) values.push(target);
    if (values.length === 0) return { lo: 40, hi: 60 };

    let lo = Math.floor(Math.min(...values) / Y_TICK) * Y_TICK;
    let hi = Math.ceil(Math.max(...values) / Y_TICK) * Y_TICK;
    if (hi - lo < Y_MIN_SPAN) {
      const mid = (lo + hi) / 2;
      lo = Math.floor((mid - Y_MIN_SPAN / 2) / Y_TICK) * Y_TICK;
      hi = lo + Y_MIN_SPAN;
    }
    return { lo: clamp(lo, 0, 100), hi: clamp(hi, 0, 100) };
  }

  private _renderChart(target: number | null): TemplateResult {
    const W = this._chartW;
    const H = this._chartH;
    // The container is measured in `updated()`; until then draw nothing into it.
    const svgContent =
      W > 0 && H > 0 ? this._renderChartSvg(W, H, target) : nothing;
    return html`<div class="chart" id="chart">${svgContent}</div>`;
  }

  private _renderChartSvg(
    W: number,
    H: number,
    target: number | null,
  ): TemplateResult {
    const { top, right, bottom, left } = CHART_MARGIN;
    const plotW = Math.max(1, W - left - right);
    const plotH = Math.max(1, H - top - bottom);

    const { lo, hi } = this._yBounds(target);
    const ySpan = hi - lo || 1;
    const yOf = (v: number): number => top + plotH * (1 - (v - lo) / ySpan);

    const now = Date.now();
    const start = now - this._historyHours() * 3600 * 1000;
    const tSpan = now - start || 1;
    const xOf = (t: number): number => left + plotW * clamp((t - start) / tSpan, 0, 1);

    // y grid + labels on round 10s.
    const yTicks: TemplateResult[] = [];
    for (let v = lo; v <= hi + 0.001; v += Y_TICK) {
      const y = yOf(v);
      yTicks.push(svg`
        <line class="grid" x1=${left} y1=${y} x2=${left + plotW} y2=${y}></line>
        <text class="axis-label" x=${left - 5} y=${y + 3} text-anchor="end">${formatInt(v)}</text>
      `);
    }

    // x time ticks every 6 h, plus "jetzt" at the right edge.
    const xTicks: TemplateResult[] = [];
    const steps = Math.max(1, Math.floor(this._historyHours() / X_TICK_HOURS));
    for (let j = steps; j >= 1; j--) {
      const t = now - j * X_TICK_HOURS * 3600 * 1000;
      if (t < start - 1) continue;
      const x = xOf(t);
      xTicks.push(svg`
        <text class="axis-label" x=${x} y=${top + plotH + 13} text-anchor="middle">${hhmm(new Date(t))}</text>
      `);
    }
    xTicks.push(svg`
      <text class="axis-label" x=${left + plotW} y=${top + plotH + 13} text-anchor="end">jetzt</text>
    `);

    const points = this._history.filter((p) => p.t >= start - tSpan * 0.02);
    let linePath = '';
    let areaPath = '';
    if (points.length > 0) {
      const coords = points.map((p) => `${xOf(p.t).toFixed(1)},${yOf(p.v).toFixed(1)}`);
      linePath = `M${coords.join(' L')}`;
      const firstX = xOf(points[0].t).toFixed(1);
      const lastX = xOf(points[points.length - 1].t).toFixed(1);
      const baseY = (top + plotH).toFixed(1);
      areaPath = `M${firstX},${baseY} L${coords.join(' L')} L${lastX},${baseY} Z`;
    }

    const targetY = target === null ? null : yOf(clamp(target, lo, hi));

    return svg`
      <svg
        class="chart-svg"
        width=${W}
        height=${H}
        viewBox="0 0 ${W} ${H}"
        preserveAspectRatio="none"
        role="img"
        aria-label="Verlauf der Luftfeuchte"
      >
        ${yTicks}
        ${areaPath ? svg`<path class="area" d=${areaPath}></path>` : nothing}
        ${targetY === null
          ? nothing
          : svg`<line class="target-line" x1=${left} y1=${targetY} x2=${left + plotW} y2=${targetY}></line>`}
        ${linePath ? svg`<path class="line" d=${linePath}></path>` : nothing}
        ${xTicks}
      </svg>
    `;
  }

  // =========================================================================
  // controls (expanded)
  // =========================================================================

  private _renderControls(range: Range, target: number | null): TemplateResult {
    const config = this._config;
    if (!config) return html``;

    const on = this._powerOn();
    const powerDisabled =
      isEntityId(config.power_entity) && !isWritablePower(config.power_entity);
    const powerSeg = renderSegmented<'on' | 'off'>(
      [
        { value: 'on', label: 'An' },
        { value: 'off', label: 'Aus' },
      ],
      on === null ? null : on ? 'on' : 'off',
      (value) => this._setPower(value === 'on'),
      'Gerät',
      powerDisabled,
    );

    const humidityDisabled =
      isEntityId(config.humidifier_entity) &&
      !isWritableHumidity(config.humidifier_entity);

    const options = this._countdownOptions();
    const current = this._countdown();
    const offOption = this._offOption();
    const countdownDisabled =
      isEntityId(config.countdown_entity) &&
      !['select', 'input_select'].includes(domainOf(config.countdown_entity as string));
    const countdownSeg =
      options.length > 0
        ? renderSegmented<string>(
            options.map((o) => ({ value: o, label: shortenCountdown(o, offOption) })),
            current !== null && options.includes(current) ? current : null,
            (value) => this._setCountdown(value),
            'Max-Trocknen',
            countdownDisabled,
          )
        : null;

    const lockConfigured =
      typeof config.child_lock_entity === 'string' &&
      config.child_lock_entity.trim().length > 0;
    const lock = this._lockOn();
    const lockDisabled =
      isEntityId(config.child_lock_entity) &&
      !isWritableSwitch(config.child_lock_entity);
    const lockSeg = renderSegmented<'on' | 'off'>(
      [
        { value: 'on', label: 'An' },
        { value: 'off', label: 'Aus' },
      ],
      lock === null ? null : lock ? 'on' : 'off',
      (value) => this._setLock(value === 'on'),
      'Kindersicherung',
      lockDisabled,
    );

    return html`
      <div class="controls">
        <div class="ctl-row">
          <span class="ctl-label">Gerät</span>
          <div class="ctl-control">${powerSeg}</div>
        </div>

        <div class="ctl-row">
          <span class="ctl-label ${humidityDisabled ? 'disabled' : ''}">Zielfeuchte</span>
          <div class="ctl-control slider-control">
            <input
              class="slider"
              type="range"
              min=${range.min}
              max=${range.max}
              step=${range.step}
              .value=${String(target ?? range.min)}
              ?disabled=${humidityDisabled}
              aria-label="Zielfeuchte"
              @input=${this._onTargetInput}
              @change=${this._onTargetChange}
            />
            <span class="ctl-value">
              ${target === null ? this._dash() : `${formatInt(Math.round(target))} %`}
            </span>
          </div>
        </div>

        ${countdownSeg
          ? html`<div class="ctl-row">
              <span class="ctl-label">Max-Trocknen</span>
              <div class="ctl-control">${countdownSeg}</div>
            </div>`
          : nothing}

        ${lockConfigured
          ? html`<div class="ctl-row">
              <span class="ctl-label">Kindersicherung</span>
              <div class="ctl-control">${lockSeg}</div>
            </div>`
          : nothing}
      </div>
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
      console.error('des-dehumidifier-card: Service-Call fehlgeschlagen', error);
    }
  }

  private _setPower(on: boolean): void {
    this._powerLocal = on;
    const id = this._config?.power_entity;
    if (!isWritablePower(id)) return;
    this._holdOptimistic('power', () => {
      this._powerLocal = null;
    });
    void this._write(writePower(this.hass, id as string, on), () => {
      this._clearSettle('power');
      this._powerLocal = null;
    });
  }

  private _setCountdown(option: string): void {
    this._countdownLocal = option;
    const id = this._config?.countdown_entity;
    if (
      !isEntityId(id) ||
      !['select', 'input_select'].includes(domainOf(id as string))
    ) {
      return;
    }
    this._holdOptimistic('countdown', () => {
      this._countdownLocal = null;
    });
    void this._write(writeSelect(this.hass, id as string, option), () => {
      this._clearSettle('countdown');
      this._countdownLocal = null;
    });
  }

  private _setLock(on: boolean): void {
    this._lockLocal = on;
    const id = this._config?.child_lock_entity;
    if (!isWritableSwitch(id)) return;
    this._holdOptimistic('lock', () => {
      this._lockLocal = null;
    });
    void this._write(writeSwitch(this.hass, id as string, on), () => {
      this._clearSettle('lock');
      this._lockLocal = null;
    });
  }

  /** Dragging only moves the UI; the write happens on release (debounced). */
  private _onTargetInput(ev: Event): void {
    this._targetLocal = snap(
      Number((ev.target as HTMLInputElement).value),
      this._targetRange(),
    );
  }

  private _onTargetChange(ev: Event): void {
    const value = snap(
      Number((ev.target as HTMLInputElement).value),
      this._targetRange(),
    );
    this._targetLocal = value;

    const id = this._config?.humidifier_entity;
    if (!isWritableHumidity(id)) return;

    if (this._writeTimer !== undefined) window.clearTimeout(this._writeTimer);
    this._writeTimer = window.setTimeout(() => {
      this._writeTimer = undefined;
      this._holdOptimistic('target', () => {
        this._targetLocal = null;
      });
      void this._write(writeHumidity(this.hass, id as string, value), () => {
        this._clearSettle('target');
        this._targetLocal = null;
      });
    }, WRITE_DEBOUNCE_MS);
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

      /* min-height:0 on every flex level so the chart fills the grid height
         instead of pushing the card open. */
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

      .head-left {
        min-width: 0;
      }

      .name {
        font-size: 15px;
        font-weight: 500;
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
      }

      .meta {
        margin-top: 2px;
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .unavail {
        color: var(--secondary-text-color);
        opacity: 0.7;
      }

      .badges {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
        justify-content: flex-end;
        flex-shrink: 0;
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
        background: rgba(127, 127, 127, 0.15);
        color: var(--secondary-text-color);
      }

      .badge-label {
        display: block;
        transform: translateY(1px);
      }

      /* Blue: Max-Trocknen and "Bereit" - the info colour, matching the other
         cards' charging pill. */
      .badge-info {
        background: rgba(33, 150, 243, 0.16);
        background: color-mix(in srgb, var(--info-color, #2196f3) 16%, transparent);
        color: var(--info-color, #2196f3);
      }

      /* Green: "Läuft" - actively drying. */
      .badge-run {
        background: rgba(46, 125, 50, 0.16);
        background: color-mix(in srgb, var(--success-color, #2e7d32) 16%, transparent);
        color: var(--success-color, #2e7d32);
      }

      /* Amber: warning faults (e.g. Abtauen), same tone as "Entladen". */
      .badge-warn {
        background: rgba(255, 152, 0, 0.16);
        background: color-mix(in srgb, var(--warning-color, #ff9800) 16%, transparent);
        color: var(--warning-color, #ff9800);
      }

      /* Red: error faults (e.g. Tank voll), same tone as "Notstrom". */
      .badge-error {
        background: rgba(211, 47, 47, 0.16);
        background: color-mix(in srgb, var(--error-color, #d32f2f) 16%, transparent);
        color: var(--error-color, #d32f2f);
      }

      /* Grey: "Aus". */
      .badge-neutral {
        background: rgba(127, 127, 127, 0.16);
        background: color-mix(in srgb, var(--secondary-text-color, #727272) 16%, transparent);
        color: var(--secondary-text-color);
      }

      /* --- value --- */

      .value-row {
        flex: 0 0 auto;
        display: flex;
        align-items: baseline;
        gap: 8px;
        margin-top: 10px;
      }

      .value-main {
        display: flex;
        align-items: baseline;
        gap: 8px;
        min-width: 0;
      }

      .value-num {
        font-size: 26px;
        line-height: 1.1;
        color: var(--primary-text-color);
        white-space: nowrap;
      }

      .value-label {
        font-size: 13px;
        color: var(--secondary-text-color);
        white-space: nowrap;
      }

      .value-over {
        margin-left: auto;
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
      }

      /* --- bar --- */

      .bar-wrap {
        flex: 0 0 auto;
        margin-top: 8px;
      }

      .bar {
        position: relative;
        height: 8px;
        border-radius: 4px;
        background: var(--divider-color, rgba(127, 127, 127, 0.25));
        overflow: hidden;
      }

      .bar-fill {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        border-radius: 4px;
        background: var(--primary-color, #03a9f4);
        transition: width 0.25s ease-out;
      }

      /* The marker sits above the fill, so it is not clipped by overflow. */
      .bar-target {
        position: absolute;
        top: -2px;
        width: 2px;
        height: 12px;
        margin-left: -1px;
        background: var(--primary-text-color);
        opacity: 0.75;
      }

      .bar-scale {
        display: flex;
        justify-content: space-between;
        margin-top: 4px;
        font-size: 11px;
        color: var(--secondary-text-color);
      }

      /* --- chart --- */

      .chart {
        flex: 1 1 auto;
        min-height: ${CHART_MIN_HEIGHT_PX}px;
        margin-top: 10px;
        position: relative;
        overflow: hidden;
      }

      .chart-svg {
        display: block;
      }

      .chart-svg .grid {
        stroke: var(--secondary-text-color);
        stroke-width: 1;
        opacity: 0.15;
      }

      .chart-svg .axis-label {
        fill: var(--secondary-text-color);
        font-size: 11px;
      }

      .chart-svg .area {
        fill: var(--primary-color, #03a9f4);
        opacity: 0.12;
        stroke: none;
      }

      .chart-svg .line {
        fill: none;
        stroke: var(--primary-color, #03a9f4);
        stroke-width: 2;
        stroke-linejoin: round;
        stroke-linecap: round;
      }

      .chart-svg .target-line {
        stroke: var(--secondary-text-color);
        stroke-width: 1.5;
        stroke-dasharray: 4 3;
        opacity: 0.7;
      }

      /* --- controls (expanded) --- */

      .controls {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .ctl-row {
        display: grid;
        grid-template-columns: 96px 1fr;
        align-items: center;
        gap: 10px;
      }

      .ctl-label {
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
      }

      .ctl-label.disabled {
        opacity: 0.4;
      }

      .ctl-control {
        display: flex;
        align-items: center;
        min-width: 0;
      }

      .slider-control {
        gap: 10px;
      }

      .ctl-value {
        font-size: 12px;
        color: var(--secondary-text-color);
        min-width: 38px;
        text-align: right;
        white-space: nowrap;
      }

      /* --- slider: thin track, small muted thumb (matches the storage card) --- */

      .slider {
        -webkit-appearance: none;
        appearance: none;
        flex: 1;
        width: 100%;
        min-width: 0;
        height: 12px;
        background: none;
        cursor: pointer;
      }

      .slider:disabled {
        opacity: 0.35;
        cursor: not-allowed;
      }

      .slider::-webkit-slider-runnable-track {
        height: 3px;
        border-radius: 2px;
        background: var(--divider-color, rgba(127, 127, 127, 0.3));
      }

      .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 12px;
        height: 12px;
        border: none;
        border-radius: 50%;
        background: var(--secondary-text-color);
        margin-top: -4.5px;
      }

      .slider::-moz-range-track {
        height: 3px;
        border-radius: 2px;
        background: var(--divider-color, rgba(127, 127, 127, 0.3));
      }

      .slider::-moz-range-thumb {
        width: 12px;
        height: 12px;
        border: none;
        border-radius: 50%;
        background: var(--secondary-text-color);
      }

      .slider:focus-visible {
        outline: 2px solid var(--primary-color, #03a9f4);
        outline-offset: 2px;
        border-radius: 3px;
      }
    `,
  ];
}

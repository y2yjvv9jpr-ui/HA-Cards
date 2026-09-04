/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Z = globalThis, be = Z.ShadowRoot && (Z.ShadyCSS === void 0 || Z.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, we = Symbol(), Me = /* @__PURE__ */ new WeakMap();
let je = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== we) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (be && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = Me.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && Me.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const nt = (i) => new je(typeof i == "string" ? i : i + "", void 0, we), H = (i, ...e) => {
  const t = i.length === 1 ? i[0] : e.reduce((r, s, n) => r + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + i[n + 1], i[0]);
  return new je(t, i, we);
}, ot = (i, e) => {
  if (be) i.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const r = document.createElement("style"), s = Z.litNonce;
    s !== void 0 && r.setAttribute("nonce", s), r.textContent = t.cssText, i.appendChild(r);
  }
}, Pe = be ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const r of e.cssRules) t += r.cssText;
  return nt(t);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: at, defineProperty: lt, getOwnPropertyDescriptor: ct, getOwnPropertyNames: dt, getOwnPropertySymbols: ht, getPrototypeOf: ut } = Object, se = globalThis, Te = se.trustedTypes, pt = Te ? Te.emptyScript : "", gt = se.reactiveElementPolyfillSupport, D = (i, e) => i, ge = { toAttribute(i, e) {
  switch (e) {
    case Boolean:
      i = i ? pt : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, e) {
  let t = i;
  switch (e) {
    case Boolean:
      t = i !== null;
      break;
    case Number:
      t = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(i);
      } catch {
        t = null;
      }
  }
  return t;
} }, Ve = (i, e) => !at(i, e), Ce = { attribute: !0, type: String, converter: ge, reflect: !1, useDefault: !1, hasChanged: Ve };
Symbol.metadata ??= Symbol("metadata"), se.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let L = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Ce) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = Symbol(), s = this.getPropertyDescriptor(e, r, t);
      s !== void 0 && lt(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: s, set: n } = ct(this.prototype, e) ?? { get() {
      return this[t];
    }, set(o) {
      this[t] = o;
    } };
    return { get: s, set(o) {
      const l = s?.call(this);
      n?.call(this, o), this.requestUpdate(e, l, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Ce;
  }
  static _$Ei() {
    if (this.hasOwnProperty(D("elementProperties"))) return;
    const e = ut(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(D("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(D("properties"))) {
      const t = this.properties, r = [...dt(t), ...ht(t)];
      for (const s of r) this.createProperty(s, t[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [r, s] of t) this.elementProperties.set(r, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, r] of this.elementProperties) {
      const s = this._$Eu(t, r);
      s !== void 0 && this._$Eh.set(s, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const s of r) t.unshift(Pe(s));
    } else e !== void 0 && t.push(Pe(e));
    return t;
  }
  static _$Eu(e, t) {
    const r = t.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const r of t.keys()) this.hasOwnProperty(r) && (e.set(r, this[r]), delete this[r]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ot(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, t, r) {
    this._$AK(e, r);
  }
  _$ET(e, t) {
    const r = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, r);
    if (s !== void 0 && r.reflect === !0) {
      const n = (r.converter?.toAttribute !== void 0 ? r.converter : ge).toAttribute(t, r.type);
      this._$Em = e, n == null ? this.removeAttribute(s) : this.setAttribute(s, n), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const r = this.constructor, s = r._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const n = r.getPropertyOptions(s), o = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : ge;
      this._$Em = s;
      const l = o.fromAttribute(t, n.type);
      this[s] = l ?? this._$Ej?.get(s) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, t, r, s = !1, n) {
    if (e !== void 0) {
      const o = this.constructor;
      if (s === !1 && (n = this[e]), r ??= o.getPropertyOptions(e), !((r.hasChanged ?? Ve)(n, t) || r.useDefault && r.reflect && n === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, r)))) return;
      this.C(e, t, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: r, reflect: s, wrapped: n }, o) {
    r && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, o ?? t ?? this[e]), n !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (t = void 0), this._$AL.set(e, t)), s === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [s, n] of this._$Ep) this[s] = n;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [s, n] of r) {
        const { wrapped: o } = n, l = this[s];
        o !== !0 || this._$AL.has(s) || l === void 0 || this.C(s, void 0, n, l);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((r) => r.hostUpdate?.()), this.update(t)) : this._$EM();
    } catch (r) {
      throw e = !1, this._$EM(), r;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach((t) => this._$ET(t, this[t])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
L.elementStyles = [], L.shadowRootOptions = { mode: "open" }, L[D("elementProperties")] = /* @__PURE__ */ new Map(), L[D("finalized")] = /* @__PURE__ */ new Map(), gt?.({ ReactiveElement: L }), (se.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $e = globalThis, Le = (i) => i, X = $e.trustedTypes, Ne = X ? X.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, qe = "$lit$", k = `lit$${Math.random().toFixed(9).slice(2)}$`, Ke = "?" + k, mt = `<${Ke}>`, M = document, F = () => M.createComment(""), U = (i) => i === null || typeof i != "object" && typeof i != "function", ke = Array.isArray, _t = (i) => ke(i) || typeof i?.[Symbol.iterator] == "function", le = `[ 	
\f\r]`, R = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ze = /-->/g, Oe = />/g, S = RegExp(`>|${le}(?:([^\\s"'>=/]+)(${le}*=${le}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Re = /'/g, Ie = /"/g, Ge = /^(?:script|style|textarea|title)$/i, Ye = (i) => (e, ...t) => ({ _$litType$: i, strings: e, values: t }), c = Ye(1), ft = Ye(2), N = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), De = /* @__PURE__ */ new WeakMap(), A = M.createTreeWalker(M, 129);
function Ze(i, e) {
  if (!ke(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ne !== void 0 ? Ne.createHTML(e) : e;
}
const vt = (i, e) => {
  const t = i.length - 1, r = [];
  let s, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = R;
  for (let l = 0; l < t; l++) {
    const a = i[l];
    let u, g, h = -1, _ = 0;
    for (; _ < a.length && (o.lastIndex = _, g = o.exec(a), g !== null); ) _ = o.lastIndex, o === R ? g[1] === "!--" ? o = ze : g[1] !== void 0 ? o = Oe : g[2] !== void 0 ? (Ge.test(g[2]) && (s = RegExp("</" + g[2], "g")), o = S) : g[3] !== void 0 && (o = S) : o === S ? g[0] === ">" ? (o = s ?? R, h = -1) : g[1] === void 0 ? h = -2 : (h = o.lastIndex - g[2].length, u = g[1], o = g[3] === void 0 ? S : g[3] === '"' ? Ie : Re) : o === Ie || o === Re ? o = S : o === ze || o === Oe ? o = R : (o = S, s = void 0);
    const y = o === S && i[l + 1].startsWith("/>") ? " " : "";
    n += o === R ? a + mt : h >= 0 ? (r.push(u), a.slice(0, h) + qe + a.slice(h) + k + y) : a + k + (h === -2 ? l : y);
  }
  return [Ze(i, n + (i[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class W {
  constructor({ strings: e, _$litType$: t }, r) {
    let s;
    this.parts = [];
    let n = 0, o = 0;
    const l = e.length - 1, a = this.parts, [u, g] = vt(e, t);
    if (this.el = W.createElement(u, r), A.currentNode = this.el.content, t === 2 || t === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (s = A.nextNode()) !== null && a.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const h of s.getAttributeNames()) if (h.endsWith(qe)) {
          const _ = g[o++], y = s.getAttribute(h).split(k), w = /([.?@])?(.*)/.exec(_);
          a.push({ type: 1, index: n, name: w[2], strings: y, ctor: w[1] === "." ? xt : w[1] === "?" ? bt : w[1] === "@" ? wt : ie }), s.removeAttribute(h);
        } else h.startsWith(k) && (a.push({ type: 6, index: n }), s.removeAttribute(h));
        if (Ge.test(s.tagName)) {
          const h = s.textContent.split(k), _ = h.length - 1;
          if (_ > 0) {
            s.textContent = X ? X.emptyScript : "";
            for (let y = 0; y < _; y++) s.append(h[y], F()), A.nextNode(), a.push({ type: 2, index: ++n });
            s.append(h[_], F());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Ke) a.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = s.data.indexOf(k, h + 1)) !== -1; ) a.push({ type: 7, index: n }), h += k.length - 1;
      }
      n++;
    }
  }
  static createElement(e, t) {
    const r = M.createElement("template");
    return r.innerHTML = e, r;
  }
}
function z(i, e, t = i, r) {
  if (e === N) return e;
  let s = r !== void 0 ? t._$Co?.[r] : t._$Cl;
  const n = U(e) ? void 0 : e._$litDirective$;
  return s?.constructor !== n && (s?._$AO?.(!1), n === void 0 ? s = void 0 : (s = new n(i), s._$AT(i, t, r)), r !== void 0 ? (t._$Co ??= [])[r] = s : t._$Cl = s), s !== void 0 && (e = z(i, s._$AS(i, e.values), s, r)), e;
}
class yt {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: r } = this._$AD, s = (e?.creationScope ?? M).importNode(t, !0);
    A.currentNode = s;
    let n = A.nextNode(), o = 0, l = 0, a = r[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let u;
        a.type === 2 ? u = new j(n, n.nextSibling, this, e) : a.type === 1 ? u = new a.ctor(n, a.name, a.strings, this, e) : a.type === 6 && (u = new $t(n, this, e)), this._$AV.push(u), a = r[++l];
      }
      o !== a?.index && (n = A.nextNode(), o++);
    }
    return A.currentNode = M, s;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}
class j {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, r, s) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = r, this.options = s, this._$Cv = s?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = z(this, e, t), U(e) ? e === d || e == null || e === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : e !== this._$AH && e !== N && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : _t(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== d && U(this._$AH) ? this._$AA.nextSibling.data = e : this.T(M.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: r } = e, s = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = W.createElement(Ze(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === s) this._$AH.p(t);
    else {
      const n = new yt(s, this), o = n.u(this.options);
      n.p(t), this.T(o), this._$AH = n;
    }
  }
  _$AC(e) {
    let t = De.get(e.strings);
    return t === void 0 && De.set(e.strings, t = new W(e)), t;
  }
  k(e) {
    ke(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let r, s = 0;
    for (const n of e) s === t.length ? t.push(r = new j(this.O(F()), this.O(F()), this, this.options)) : r = t[s], r._$AI(n), s++;
    s < t.length && (this._$AR(r && r._$AB.nextSibling, s), t.length = s);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const r = Le(e).nextSibling;
      Le(e).remove(), e = r;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class ie {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, r, s, n) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = e, this.name = t, this._$AM = s, this.options = n, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = d;
  }
  _$AI(e, t = this, r, s) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) e = z(this, e, t, 0), o = !U(e) || e !== this._$AH && e !== N, o && (this._$AH = e);
    else {
      const l = e;
      let a, u;
      for (e = n[0], a = 0; a < n.length - 1; a++) u = z(this, l[r + a], t, a), u === N && (u = this._$AH[a]), o ||= !U(u) || u !== this._$AH[a], u === d ? e = d : e !== d && (e += (u ?? "") + n[a + 1]), this._$AH[a] = u;
    }
    o && !s && this.j(e);
  }
  j(e) {
    e === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class xt extends ie {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === d ? void 0 : e;
  }
}
class bt extends ie {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== d);
  }
}
class wt extends ie {
  constructor(e, t, r, s, n) {
    super(e, t, r, s, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = z(this, e, t, 0) ?? d) === N) return;
    const r = this._$AH, s = e === d && r !== d || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, n = e !== d && (r === d || s);
    s && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class $t {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    z(this, e);
  }
}
const kt = $e.litHtmlPolyfillSupport;
kt?.(W, j), ($e.litHtmlVersions ??= []).push("3.3.3");
const Et = (i, e, t) => {
  const r = t?.renderBefore ?? e;
  let s = r._$litPart$;
  if (s === void 0) {
    const n = t?.renderBefore ?? null;
    r._$litPart$ = s = new j(e.insertBefore(F(), n), n, void 0, t ?? {});
  }
  return s._$AI(i), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ee = globalThis;
class E extends L {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Et(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return N;
  }
}
E._$litElement$ = !0, E.finalized = !0, Ee.litElementHydrateSupport?.({ LitElement: E });
const St = Ee.litElementPolyfillSupport;
St?.({ LitElement: E });
(Ee.litElementVersions ??= []).push("4.2.2");
const ne = "de-DE";
function m(i) {
  return new Intl.NumberFormat(ne, { maximumFractionDigits: 0 }).format(i);
}
function At(i) {
  return new Intl.NumberFormat(ne, {
    maximumFractionDigits: 0,
    signDisplay: "always"
  }).format(i);
}
function Fe(i) {
  const e = Math.round(i), t = m(Math.abs(e));
  return e > 0 ? `+${t}` : e < 0 ? `−${t}` : t;
}
function Mt(i, e = 1) {
  return new Intl.NumberFormat(ne, {
    minimumFractionDigits: 0,
    maximumFractionDigits: e
  }).format(i);
}
function f(i, e = 1) {
  return new Intl.NumberFormat(ne, {
    minimumFractionDigits: e,
    maximumFractionDigits: e
  }).format(i);
}
function b(i, e, t) {
  return Math.min(t, Math.max(e, i));
}
const Pt = /* @__PURE__ */ new Set(["unavailable", "unknown", "none", "null", ""]), Tt = /^[a-z][a-z0-9_]*\.[a-z0-9_]+$/;
function P(i) {
  return typeof i == "string" && Tt.test(i);
}
const me = { kind: "unset" }, I = { kind: "unavailable" };
function Je(i, e) {
  const t = e?.states?.[i];
  if (!t || typeof t.state != "string") return null;
  const r = t.state.trim();
  return Pt.has(r.toLowerCase()) ? null : r;
}
function ce(i, e, t) {
  const r = e?.states?.[i]?.attributes?.[t];
  if (typeof r == "number") return Number.isFinite(r) ? r : null;
  if (typeof r == "string") {
    const s = Number.parseFloat(r);
    return Number.isFinite(s) ? s : null;
  }
  return null;
}
function Se(i, e) {
  const t = e?.states?.[i]?.attributes?.unit_of_measurement;
  if (typeof t != "string") return null;
  const r = t.trim().toLowerCase();
  return r.length > 0 ? r : null;
}
function v(i, e) {
  if (i == null || typeof i == "boolean") return me;
  if (typeof i == "number")
    return Number.isFinite(i) ? { kind: "value", value: i } : I;
  if (P(i)) {
    const r = Je(i, e);
    if (r === null) return I;
    const s = Number.parseFloat(r);
    return Number.isFinite(s) ? { kind: "value", value: s } : I;
  }
  const t = Number.parseFloat(i);
  return Number.isFinite(t) ? { kind: "value", value: t } : I;
}
function x(i, e) {
  if (i == null) return me;
  if (typeof i == "boolean") return { kind: "value", value: i ? "on" : "off" };
  if (typeof i == "number") return { kind: "value", value: String(i) };
  if (P(i)) {
    const r = Je(i, e);
    return r === null ? I : { kind: "value", value: r };
  }
  const t = i.trim();
  return t.length > 0 ? { kind: "value", value: t } : me;
}
const Xe = /* @__PURE__ */ new Set(["number", "input_number"]), V = /* @__PURE__ */ new Set(["switch", "input_boolean"]), oe = /* @__PURE__ */ new Set(["select", "input_select"]), Ct = /* @__PURE__ */ new Set(["on", "true", "1", "yes", "an", "ein"]);
function O(i) {
  const e = i.indexOf(".");
  return e === -1 ? "" : i.slice(0, e);
}
function B(i, e) {
  return typeof i == "string" && P(i) && e.has(O(i));
}
function K(i) {
  return B(i, Xe);
}
function Lt(i) {
  return B(i, V);
}
function Qe(i) {
  if (!i || typeof i != "object") return !1;
  const e = i.entity;
  return B(e, oe) || B(e, V);
}
function Ae(i, e, t, r) {
  if (typeof i?.callService != "function")
    return Promise.reject(new Error("des-storage-card: hass.callService fehlt"));
  try {
    return Promise.resolve(i.callService(e, t, r));
  } catch (s) {
    return Promise.reject(s);
  }
}
function Ue(i, e, t) {
  const r = O(e);
  return Xe.has(r) ? Ae(i, r, "set_value", { entity_id: e, value: t }) : Promise.reject(
    new Error(`des-storage-card: ${e} ist keine number-Entität`)
  );
}
function et(i, e, t) {
  const r = O(e);
  return V.has(r) ? Ae(i, r, t ? "turn_on" : "turn_off", { entity_id: e }) : Promise.reject(
    new Error(`des-storage-card: ${e} ist kein Schalter`)
  );
}
function Nt(i, e, t) {
  const r = O(e);
  return oe.has(r) ? Ae(i, r, "select_option", { entity_id: e, option: t }) : Promise.reject(
    new Error(`des-storage-card: ${e} ist keine select-Entität`)
  );
}
function tt(i, e) {
  const t = e === "charge" ? i.charge_state : i.auto_state;
  return t !== void 0 ? t : B(i.entity, V) ? e === "charge" ? "on" : "off" : void 0;
}
function We(i, e) {
  const t = tt(i, "charge");
  return t === void 0 ? !1 : t.trim().toLowerCase() === e.trim().toLowerCase();
}
function zt(i) {
  if (i === null || typeof i != "object")
    return '"charge_mode_control" muss ein Objekt mit "entity" sein';
  const { entity: e, charge_state: t, auto_state: r } = i;
  if (typeof e != "string" || e.length === 0)
    return '"charge_mode_control" braucht "entity"';
  if (!Qe(i))
    return `"charge_mode_control.entity" muss select, input_select, switch oder input_boolean sein (ist: ${e})`;
  if (oe.has(O(e))) {
    const s = [
      t === void 0 ? "charge_state" : null,
      r === void 0 ? "auto_state" : null
    ].filter((n) => n !== null);
    if (s.length > 0)
      return `"charge_mode_control" braucht ${s.join(" und ")} für ${e}`;
  }
  return null;
}
function Ot(i, e, t) {
  const r = e.entity, s = O(r), n = tt(e, t);
  return oe.has(s) ? n === void 0 ? Promise.reject(
    new Error(
      `des-storage-card: charge_mode_control braucht ${t === "charge" ? "charge_state" : "auto_state"} für ${r}`
    )
  ) : Nt(i, r, n) : V.has(s) ? et(i, r, Ct.has((n ?? "").toLowerCase())) : Promise.reject(
    new Error(`des-storage-card: ${r} wird als Lademodus nicht unterstützt`)
  );
}
const rt = H`
  .seg {
    display: inline-flex;
    border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.28));
    border-radius: 5px;
    overflow: hidden;
  }

  .seg button {
    font-family: inherit;
    font-size: 11px;
    line-height: 1;
    padding: 4px 7px;
    background: none;
    border: none;
    border-left: 1px solid var(--divider-color, rgba(127, 127, 127, 0.28));
    color: var(--secondary-text-color);
    cursor: pointer;
  }

  .seg.unknown {
    opacity: 0.5;
  }

  .seg button:first-child {
    border-left: none;
  }

  .seg button:hover {
    color: var(--primary-text-color);
  }

  .seg button.active {
    background: rgba(3, 169, 244, 0.12);
    background: color-mix(in srgb, var(--primary-color, #03a9f4) 12%, transparent);
    color: var(--primary-color, #03a9f4);
    font-weight: 500;
  }

  .seg button:focus-visible {
    outline: 2px solid var(--primary-color, #03a9f4);
    outline-offset: -2px;
  }
`;
function _e(i, e, t, r) {
  return c`
    <div
      class="seg ${e === null ? "unknown" : ""}"
      role="group"
      aria-label=${r}
      title=${e === null ? "Zustand nicht lesbar" : d}
    >
      ${i.map(
    ({ value: s, label: n }) => c`
          <button
            type="button"
            class=${e === s ? "active" : ""}
            aria-pressed=${e === s ? "true" : "false"}
            @click=${(o) => {
      o.stopPropagation(), t(s);
    }}
          >
            ${n}
          </button>
        `
  )}
    </div>
  `;
}
const st = {
  charging: "Lädt",
  discharging: "Entlädt",
  idle: "Bereit",
  heating: "Heizt",
  off: "Aus"
}, G = { min: 10, max: 80, step: 5 }, de = { min: 50, max: 100, step: 5 }, Be = 5, He = 25, Rt = 500, It = 8e3, Dt = /* @__PURE__ */ new Set([
  "not charging",
  "not discharging",
  "unknown",
  "unavailable",
  "none",
  "-",
  "--"
]), Ft = [
  { value: "charge", label: "Laden" },
  { value: "auto", label: "Auto" }
], Ut = [
  { value: "on", label: "An" },
  { value: "auto", label: "Auto" },
  { value: "off", label: "Aus" }
], Wt = {
  1: "on",
  2: "auto",
  3: "off"
}, Bt = {
  on: 1,
  auto: 2,
  off: 3
};
function Ht(i) {
  const e = i.trim().toLowerCase();
  return e === "standby" ? "idle" : e in st ? e : null;
}
function jt(i) {
  const e = i.trim().toLowerCase();
  return e === "on" || e === "auto" || e === "off" ? e : "auto";
}
function he(i, e) {
  const { min: t, max: r, step: s } = e;
  if (!(s > 0)) return b(i, t, r);
  const n = Math.round((i - t) / s), o = Number((t + n * s).toFixed(6));
  return b(o, t, r);
}
function Vt(i) {
  if (!Number.isFinite(i) || Number.isInteger(i)) return 0;
  const e = String(i), t = e.indexOf(".");
  return t === -1 ? 0 : Math.min(3, e.length - t - 1);
}
function ue(i, e) {
  const t = Vt(e);
  return t === 0 ? m(i) : f(i, t);
}
function qt(i) {
  return i < 4 || i > 50 ? "temp-alert" : i < 8 || i > 40 ? "temp-warn" : "";
}
const Q = class Q extends E {
  constructor() {
    super(), this._writeTimers = /* @__PURE__ */ new Map(), this._settleTimers = /* @__PURE__ */ new Map(), this._expanded = !1, this._thresholdLocal = null, this._targetLocal = null, this._chargeModeLocal = null, this._itemModesLocal = [];
  }
  setConfig(e) {
    if (!e)
      throw new Error("des-storage-card: Konfiguration fehlt");
    if (e.variant !== "battery" && e.variant !== "thermal_group")
      throw new Error(
        'des-storage-card: "variant" muss "battery" oder "thermal_group" sein'
      );
    if (!e.name)
      throw new Error('des-storage-card: "name" ist erforderlich');
    if (e.variant === "battery" && e.charge_mode_control !== void 0) {
      const t = zt(e.charge_mode_control);
      if (t !== null) throw new Error(`des-storage-card: ${t}`);
    }
    if (e.variant === "thermal_group") {
      const t = e.items;
      if (!Array.isArray(t) || t.length === 0)
        throw new Error(
          'des-storage-card: "items" braucht mindestens einen Eintrag'
        );
      if (t.length > Be)
        throw new Error(
          `des-storage-card: "items" erlaubt höchstens ${Be} Einträge`
        );
      if (t.some((r) => !r || !r.name))
        throw new Error('des-storage-card: jeder Eintrag in "items" braucht "name"');
      for (const r of t)
        if (r.mode_entity !== void 0 && !K(r.mode_entity))
          throw new Error(
            `des-storage-card: "mode_entity" muss eine number- oder input_number-Entität sein (ist: ${r.mode_entity})`
          );
      this._itemModesLocal = t.map(() => null);
    }
    this._config = e, this._expanded = !1, this._thresholdLocal = null, this._targetLocal = null, this._chargeModeLocal = null;
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    for (const e of this._writeTimers.values()) window.clearTimeout(e);
    this._writeTimers.clear();
    for (const e of this._settleTimers.values()) window.clearTimeout(e);
    this._settleTimers.clear();
  }
  /** Drops an optimistic value that the entity never confirmed. */
  _holdOptimistic(e, t) {
    this._clearSettle(e), this._settleTimers.set(
      e,
      window.setTimeout(() => {
        this._settleTimers.delete(e), t();
      }, It)
    );
  }
  _clearSettle(e) {
    const t = this._settleTimers.get(e);
    t !== void 0 && (window.clearTimeout(t), this._settleTimers.delete(e));
  }
  /**
   * Drops an optimistic local value once the entity reports it back, so the
   * control follows the entity again (including changes made elsewhere).
   * Runs in `willUpdate` rather than `updated` so it costs no extra render.
   */
  willUpdate() {
    const e = this._config;
    if (!e) return;
    if (e.variant === "battery") {
      this._thresholdLocal !== null && this._entityMatches(
        e.threshold_pct,
        this._thresholdLocal,
        this._rangeFor(e.threshold_pct, G)
      ) && (this._thresholdLocal = null, this._clearSettle("threshold")), this._targetLocal !== null && this._entityMatches(
        e.charge_target_pct,
        this._targetLocal,
        this._rangeFor(e.charge_target_pct, de)
      ) && (this._targetLocal = null, this._clearSettle("target"));
      const n = e.charge_mode_control;
      if (this._chargeModeLocal !== null && n?.entity) {
        const o = x(n.entity, this.hass);
        o.kind === "value" && (We(n, o.value) ? "charge" : "auto") === this._chargeModeLocal && (this._chargeModeLocal = null, this._clearSettle("chargeMode"));
      }
      return;
    }
    const t = e.items ?? [];
    let r = !1;
    const s = [...this._itemModesLocal];
    t.forEach((n, o) => {
      const l = s[o];
      if (!l) return;
      const a = this._itemModeFromEntity(n);
      a === null || a !== l || (s[o] = null, r = !0, this._clearSettle(`item:${o}`));
    }), r && (this._itemModesLocal = s);
  }
  /** True when the slot is entity-bound and already carries exactly `local`. */
  _entityMatches(e, t, r) {
    if (typeof e != "string" || !P(e)) return !1;
    const s = v(e, this.hass);
    return s.kind === "value" && he(s.value, r) === t;
  }
  /**
   * The bounds a slider actually uses.
   *
   * A bound `number`/`input_number` publishes its own min/max/step, and those
   * are authoritative - writing a value outside them would just be rejected.
   * Each attribute falls back on its own, so a partially described entity
   * still yields a usable range.
   */
  _rangeFor(e, t) {
    if (!K(e)) return t;
    const r = e, s = ce(r, this.hass, "min") ?? t.min, n = ce(r, this.hass, "max") ?? t.max, o = ce(r, this.hass, "step") ?? t.step;
    return !(s < n) || !(o > 0) ? t : { min: s, max: n, step: o };
  }
  getCardSize() {
    return this._config?.variant === "thermal_group" ? 1 + (this._config.items?.length ?? 0) : this._expanded ? 3 : 2;
  }
  static getStubConfig() {
    return {
      type: "custom:des-storage-card",
      variant: "battery",
      name: "Hausakku",
      soc: 62,
      capacity_kwh: 10.2,
      power_w: -1240,
      temp_c: 23.5,
      threshold_pct: 20,
      charge_target_pct: 90,
      charge_mode: "auto",
      backup: "none"
    };
  }
  render() {
    const e = this._config;
    return e ? c`
      <ha-card>
        <div class="card">
          ${e.variant === "battery" ? this._renderBattery(e) : this._renderThermalGroup(e)}
        </div>
      </ha-card>
    ` : d;
  }
  // =========================================================================
  // resolution / derivation
  // =========================================================================
  /** `power_w` if given, otherwise voltage x current; sign optionally flipped. */
  _power(e) {
    let t = v(e.power_w, this.hass);
    if (t.kind === "unset" && e.voltage_entity && e.current_entity) {
      const r = v(e.voltage_entity, this.hass), s = v(e.current_entity, this.hass);
      t = r.kind === "value" && s.kind === "value" ? { kind: "value", value: r.value * s.value } : { kind: "unavailable" };
    }
    return t.kind === "value" && e.invert_power ? { kind: "value", value: -t.value } : t;
  }
  /** Configured status, else derived from the power sign. */
  _status(e, t) {
    const r = x(e.status, this.hass);
    if (r.kind === "value") {
      const s = Ht(r.value);
      if (s !== null) return s;
    }
    if (t.kind === "value") {
      if (t.value < -He) return "discharging";
      if (t.value > He) return "charging";
    }
    return "idle";
  }
  /** `energy_kwh` if given, otherwise soc x capacity / 100. */
  _energy(e, t, r) {
    const s = v(e.energy_kwh, this.hass);
    return s.kind !== "unset" ? s : t.kind === "value" && r.kind === "value" ? { kind: "value", value: t.value * r.value / 100 } : t.kind === "unavailable" || r.kind === "unavailable" ? { kind: "unavailable" } : { kind: "unset" };
  }
  /**
   * Remaining time. `time_remaining` wins; otherwise the charging variant is
   * used while power is positive and the discharging one in every other case.
   */
  _timeRemaining(e, t) {
    let r = e.time_remaining;
    r === void 0 && (r = t.kind === "value" && t.value > 0 ? e.time_remaining_charging : e.time_remaining_discharging);
    const s = x(r, this.hass);
    return s.kind !== "value" || Dt.has(s.value.trim().toLowerCase()) ? null : s.value;
  }
  _backup(e) {
    const t = e.backup;
    if (!t || t === "none") return "none";
    if (typeof t == "string")
      return t === "active" || t === "ready" ? t : "none";
    const r = x(t.entity, this.hass);
    return r.kind !== "value" ? "none" : (t.active_states ?? []).some(
      (n) => n.trim().toLowerCase() === r.value.toLowerCase()
    ) ? "active" : "ready";
  }
  _threshold(e) {
    if (this._thresholdLocal !== null) return this._thresholdLocal;
    const t = v(e.threshold_pct, this.hass);
    return t.kind === "value" ? he(t.value, this._rangeFor(e.threshold_pct, G)) : null;
  }
  _chargeTarget(e) {
    if (this._targetLocal !== null) return this._targetLocal;
    const t = v(e.charge_target_pct, this.hass);
    return t.kind === "value" ? he(t.value, this._rangeFor(e.charge_target_pct, de)) : null;
  }
  /**
   * `null` means "cannot say" - the control is bound to an entity the card
   * cannot read right now, so no segment is highlighted. Showing a confident
   * "Laden" for an entity that never answered is how a wrong entity id stayed
   * invisible before.
   */
  _chargeMode(e) {
    if (this._chargeModeLocal !== null) return this._chargeModeLocal;
    const t = e.charge_mode_control;
    if (t?.entity) {
      const s = x(t.entity, this.hass);
      return s.kind !== "value" ? null : We(t, s.value) ? "charge" : "auto";
    }
    const r = x(e.charge_mode, this.hass);
    return r.kind === "value" && r.value.trim().toLowerCase() === "charge" ? "charge" : "auto";
  }
  /**
   * Local click wins, then `mode_entity`, then a static `mode`, then the
   * switch entity's on/off state. `null` means no segment is highlighted -
   * `mode_entity` carrying something outside 1/2/3 is the only way there.
   */
  _itemMode(e, t) {
    const r = this._itemModesLocal[t];
    if (r) return r;
    if (e.mode_entity)
      return this._itemModeFromEntity(e);
    const s = x(e.mode, this.hass);
    return s.kind === "value" ? jt(s.value) : this._itemModeFromEntity(e) ?? "auto";
  }
  /**
   * The mode the entities currently report, ignoring any local override.
   * `null` when nothing readable says what the mode is.
   */
  _itemModeFromEntity(e) {
    if (e.mode_entity) {
      const t = x(e.mode_entity, this.hass);
      if (t.kind !== "value") return null;
      const r = Math.round(Number.parseFloat(t.value));
      return Wt[r] ?? null;
    }
    if (e.switch_entity) {
      const t = x(e.switch_entity, this.hass);
      if (t.kind === "value")
        return t.value.trim().toLowerCase() === "on" ? "on" : "off";
    }
    return null;
  }
  // =========================================================================
  // variant: battery
  // =========================================================================
  _renderBattery(e) {
    const t = v(e.soc, this.hass), r = v(e.capacity_kwh, this.hass), s = this._power(e), n = this._energy(e, t, r), o = this._status(e, s), l = this._backup(e), a = this._timeRemaining(e, s), u = x(e.time_at, this.hass), g = [a, u.kind === "value" ? u.value : null].filter(
      (_) => _ !== null
    ), h = e.controls !== !1;
    return c`
      <div class="header">
        <div class="head-left">
          <span class="name">${e.name}</span>
          <span class="meta">${this._renderBatteryMeta(e, r)}</span>
        </div>
        <div class="badges">
          ${l === "none" ? d : this._renderBackupBadge(l)}
          ${this._renderBadge(st[o], `status-${o}`)}
        </div>
      </div>

      <div
        class="main ${h ? "clickable" : ""}"
        role=${h ? "button" : "presentation"}
        tabindex=${h ? 0 : -1}
        aria-expanded=${h ? String(this._expanded) : d}
        @click=${h ? this._toggleExpanded : d}
        @keydown=${h ? this._onMainKeydown : d}
      >
        ${this._renderBatteryIcon(t)}
        <div class="readout">
          <span class="soc">
            ${t.kind === "value" ? `${m(t.value)} %` : this._dash()}
          </span>
          ${n.kind === "unset" ? d : c`<span class="energy">
                ${n.kind === "value" ? `${f(n.value)} kWh` : this._dash()}
              </span>`}
        </div>
        <div class="timing">
          ${s.kind === "unset" ? d : c`<div class=${this._powerClass(s)}>
                ${s.kind === "value" ? this._formatPower(s.value) : this._dash()}
              </div>`}
          ${g.length === 0 ? d : c`<div class="muted">${g.join(" · ")}</div>`}
        </div>
        ${h ? c`<ha-icon
              class="chevron ${this._expanded ? "open" : ""}"
              icon="mdi:chevron-down"
            ></ha-icon>` : d}
      </div>

      ${h && this._expanded ? c`<div class="grow"></div>
            ${this._renderBatteryControls(e)}` : d}
    `;
  }
  /**
   * Two labelled slider rows on one grid, so labels, tracks and values line
   * up. The charge-mode control sits to their right, centred over both rows.
   */
  _renderBatteryControls(e) {
    const t = this._chargeMode(e), r = t === "charge", s = this._chargeTarget(e), n = this._threshold(e), o = this._rangeFor(e.charge_target_pct, de), l = this._rangeFor(e.threshold_pct, G);
    return c`
      <div class="controls">
        <div class="ctl-rows">
          <span class="ctl-label ${r ? "" : "disabled"}">Ladeziel</span>
          <input
            class="slider"
            type="range"
            min=${o.min}
            max=${o.max}
            step=${o.step}
            .value=${String(s ?? o.min)}
            ?disabled=${!r}
            aria-label="Ladeziel"
            @input=${this._onTargetInput}
            @change=${this._onTargetChange}
          />
          <span class="ctl-value ${r ? "" : "disabled"}">
            ${s === null ? this._dash() : `${ue(s, o.step)} %`}
          </span>

          <span class="ctl-label">min. SoC</span>
          <input
            class="slider"
            type="range"
            min=${l.min}
            max=${l.max}
            step=${l.step}
            .value=${String(n ?? l.min)}
            aria-label="Minimaler Ladestand"
            @input=${this._onThresholdInput}
            @change=${this._onThresholdChange}
          />
          <span class="ctl-value">
            ${n === null ? this._dash() : `${ue(n, l.step)} %`}
          </span>
        </div>
        ${_e(
      Ft,
      t,
      (a) => this._setChargeMode(a),
      "Lademodus"
    )}
      </div>
    `;
  }
  /** "6,6 kWh · 23,5 °C · min. 20 % SoC" - unset segments are dropped. */
  _renderBatteryMeta(e, t) {
    const r = v(e.temp_c, this.hass), s = this._threshold(e), n = [];
    return t.kind === "value" ? n.push(`${f(t.value)} kWh`) : t.kind === "unavailable" && n.push(c`${this._dash()} kWh`), r.kind === "value" ? n.push(
      c`<span class=${qt(r.value)}>
          ${f(r.value)} °C
        </span>`
    ) : r.kind === "unavailable" && n.push(c`${this._dash()} °C`), n.push(
      s === null ? c`min. ${this._dash()} SoC` : `min. ${ue(
        s,
        this._rangeFor(e.threshold_pct, G).step
      )} % SoC`
    ), c`${n.map(
      (o, l) => l === 0 ? o : c` · ${o}`
    )}`;
  }
  /** Upright battery; the fill grows from the bottom. */
  _renderBatteryIcon(e) {
    const t = e.kind === "value" ? b(e.value, 0, 100) : 0, r = e.kind !== "value" ? "transparent" : t > 50 ? "var(--success-color, #2e7d32)" : t >= 20 ? "var(--warning-color, #ff9800)" : "var(--error-color, #d32f2f)", s = 6, n = 26, o = n * t / 100, l = s + (n - o);
    return c`
      <svg
        class="battery"
        viewBox="0 0 22 36"
        width="22"
        height="36"
        role="img"
        aria-label=${e.kind === "value" ? `Ladestand ${m(t)} Prozent` : "Ladestand unbekannt"}
      >
        <rect
          x="7"
          y="1"
          width="8"
          height="3"
          rx="1.5"
          fill="var(--secondary-text-color)"
          opacity="0.6"
        />
        <rect
          x="2"
          y="4"
          width="18"
          height="31"
          rx="3"
          fill="none"
          stroke="var(--secondary-text-color)"
          stroke-width="2"
          opacity="0.6"
        />
        <rect
          x="4"
          y=${l}
          width="14"
          height=${o}
          rx="1.5"
          fill=${r}
        />
      </svg>
    `;
  }
  // =========================================================================
  // variant: thermal_group
  // =========================================================================
  _renderThermalGroup(e) {
    const t = e.items ?? [], r = t.map((a) => v(a.power_w, this.hass)), s = t.map((a) => v(a.energy_kwh, this.hass)), n = this._sum(s), o = this._sum(r), l = r.filter(
      (a) => a.kind === "value" && a.value > 0
    ).length;
    return c`
      <div class="header">
        <div class="head-left">
          <span class="name">${e.name}</span>
        </div>
        <div class="badges">
          <!-- Heating charges the heat store, so it reads as "charging". -->
          ${this._renderBadge(
      l > 0 ? `${m(l)} heizen` : "Aus",
      l > 0 ? "status-charging" : "status-off"
    )}
        </div>
      </div>

      <div class="main">
        <ha-icon class="fish" icon="mdi:fish"></ha-icon>
        <div class="readout stacked">
          <span class="soc">
            ${n === null ? this._dash() : `${f(n)} kWh`}
          </span>
          <span class="energy">heute eingespeichert</span>
        </div>
        <div class="timing">
          <div
            class=${o !== null && o > 0 ? "power positive" : "power neutral"}
          >
            ${o === null ? this._dash() : this._formatPower(o)}
          </div>
        </div>
      </div>

      <div class="items">
        ${t.map(
      (a, u) => this._renderItem(a, u, r[u], s[u])
    )}
      </div>
    `;
  }
  /** Sums the values that resolved; null when none of them did. */
  _sum(e) {
    const t = e.filter(
      (r) => r.kind === "value"
    );
    return t.length === 0 ? null : t.reduce((r, s) => r + s.value, 0);
  }
  _renderItem(e, t, r, s) {
    const n = r.kind === "value" && r.value > 0;
    return c`
      <div class="item">
        <span class="item-name">${e.name}</span>
        <span class="item-energy">
          ${s.kind === "value" ? `${f(s.value)} kWh` : s.kind === "unavailable" ? this._dash() : ""}
        </span>
        <span class=${n ? "item-power positive" : "item-power"}>
          ${r.kind === "value" ? this._formatPower(r.value) : r.kind === "unavailable" ? this._dash() : ""}
        </span>
        ${_e(
      Ut,
      this._itemMode(e, t),
      (o) => this._setItemMode(t, o),
      `Modus ${e.name}`
    )}
      </div>
    `;
  }
  // =========================================================================
  // shared
  // =========================================================================
  /** Muted placeholder for a value the card could not read. */
  _dash() {
    return c`<span class="unavail">–</span>`;
  }
  /**
   * The label sits in its own element so it can be nudged down optically.
   * Metric centring alone reads as too high - see `.badge-label` in the styles.
   */
  _renderBadge(e, t) {
    return c`<span class="badge ${t}">
      <span class="badge-label">${e}</span>
    </span>`;
  }
  _renderBackupBadge(e) {
    return e === "active" ? this._renderBadge("NOTSTROM AKTIV", "backup-active") : this._renderBadge("Notstrom bereit", "backup-ready");
  }
  _powerClass(e) {
    return e.kind !== "value" || e.value === 0 ? "power neutral" : e.value < 0 ? "power negative" : "power positive";
  }
  _formatPower(e) {
    const t = Math.round(e);
    return `${t === 0 ? m(0) : At(t)} W`;
  }
  // --- interaction ---------------------------------------------------------
  //
  // Every handler updates the local state first so the UI reacts immediately,
  // then writes to the bound entity. A rejected write drops the local value,
  // which puts the control back on whatever the entity really says.
  _toggleExpanded() {
    this._expanded = !this._expanded;
  }
  _onMainKeydown(e) {
    (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this._toggleExpanded());
  }
  _setChargeMode(e) {
    this._chargeModeLocal = e;
    const t = this._config?.charge_mode_control;
    !t?.entity || !Qe(t) || (this._holdOptimistic("chargeMode", () => {
      this._chargeModeLocal = null;
    }), this._write(Ot(this.hass, t, e), () => {
      this._clearSettle("chargeMode"), this._chargeModeLocal = null;
    }));
  }
  /** Dragging only moves the UI; the write happens on release. */
  _onTargetInput(e) {
    this._targetLocal = Number(e.target.value);
  }
  _onThresholdInput(e) {
    this._thresholdLocal = Number(e.target.value);
  }
  _onTargetChange(e) {
    const t = Number(e.target.value);
    this._targetLocal = t, this._scheduleNumberWrite("target", this._config?.charge_target_pct, t);
  }
  _onThresholdChange(e) {
    const t = Number(e.target.value);
    this._thresholdLocal = t, this._scheduleNumberWrite("threshold", this._config?.threshold_pct, t);
  }
  _scheduleNumberWrite(e, t, r) {
    if (!K(t)) return;
    const s = t, n = this._writeTimers.get(e);
    n !== void 0 && window.clearTimeout(n), this._writeTimers.set(
      e,
      window.setTimeout(() => {
        this._writeTimers.delete(e), this._holdOptimistic(e, () => {
          e === "threshold" ? this._thresholdLocal = null : this._targetLocal = null;
        }), this._write(Ue(this.hass, s, r), () => {
          this._clearSettle(e), e === "threshold" ? this._thresholdLocal = null : this._targetLocal = null;
        });
      }, Rt)
    );
  }
  _setItemMode(e, t) {
    const r = [...this._itemModesLocal];
    r[e] = t, this._itemModesLocal = r;
    const s = this._config?.items?.[e], n = () => {
      const l = [...this._itemModesLocal];
      l[e] = null, this._itemModesLocal = l;
    };
    if (s?.mode_entity) {
      if (!K(s.mode_entity)) return;
      this._holdOptimistic(`item:${e}`, n), this._write(
        Ue(this.hass, s.mode_entity, Bt[t]),
        () => {
          this._clearSettle(`item:${e}`), n();
        }
      );
      return;
    }
    const o = s?.switch_entity;
    t === "auto" || !Lt(o) || (this._holdOptimistic(`item:${e}`, n), this._write(et(this.hass, o, t === "on"), () => {
      this._clearSettle(`item:${e}`), n();
    }));
  }
  /** Awaits a service call and runs `onFailure` if it rejects. */
  async _write(e, t) {
    try {
      await e;
    } catch (r) {
      t(), console.error("des-storage-card: Service-Call fehlgeschlagen", r);
    }
  }
};
Q.properties = {
  // Assigning `hass` is a reactive property write, so Home Assistant's
  // state updates re-render the card without a custom setter.
  hass: { attribute: !1 },
  _config: { state: !0 },
  _thresholdLocal: { state: !0 },
  _targetLocal: { state: !0 },
  _chargeModeLocal: { state: !0 },
  _expanded: { state: !0 },
  _itemModesLocal: { state: !0 }
}, Q.styles = [
  rt,
  H`
    /* The card fills whatever height the sections grid hands it, so several
       cards in one row can be levelled with grid_options.rows. */
    :host {
      display: block;
      height: 100%;
    }

    ha-card {
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      background: var(--card-background-color, var(--ha-card-background, #fff));
      color: var(--primary-text-color);
    }

    .card {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 12px 16px;
    }

    /* Eats the spare height when the card is stretched, so the content stays
       at the top and the control row sits on the bottom edge. */
    .grow {
      flex: 1 1 0;
      min-height: 12px;
    }

    /* --- header --- */

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .head-left {
      display: flex;
      align-items: baseline;
      gap: 8px;
      min-width: 0;
    }

    .name {
      font-size: 15px;
      font-weight: 500;
      color: var(--primary-text-color);
      white-space: nowrap;
      /* On narrow cards the meta line truncates, never the name. */
      flex-shrink: 0;
    }

    .meta {
      font-size: 12px;
      color: var(--secondary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .temp-warn {
      color: var(--warning-color, #ff9800);
    }

    .temp-alert {
      color: var(--error-color, #d32f2f);
    }

    /* Placeholder for values the card could not read. */
    .unavail {
      color: var(--secondary-text-color);
      opacity: 0.7;
    }

    .badges {
      display: flex;
      align-items: center;
      gap: 6px;
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
      /* Fallback for browsers without color-mix(); overridden below. */
      background: rgba(127, 127, 127, 0.15);
      color: var(--secondary-text-color);
    }

    /* Metric centring puts the glyphs visually too high: with line-height:1
       the em box still reserves descender space these labels do not use, so
       their optical centre sits above the box centre. Nudge the text down. */
    .badge-label {
      display: block;
      transform: translateY(1px);
    }

    .status-charging {
      background: rgba(33, 150, 243, 0.16);
      background: color-mix(in srgb, var(--info-color, #2196f3) 16%, transparent);
      color: var(--info-color, #2196f3);
    }

    .status-discharging,
    .status-heating {
      background: rgba(255, 152, 0, 0.16);
      background: color-mix(
        in srgb,
        var(--warning-color, #ff9800) 16%,
        transparent
      );
      color: var(--warning-color, #ff9800);
    }

    .status-idle,
    .status-off {
      background: rgba(127, 127, 127, 0.16);
      background: color-mix(
        in srgb,
        var(--secondary-text-color, #727272) 16%,
        transparent
      );
      color: var(--secondary-text-color);
    }

    .backup-ready {
      background: rgba(46, 125, 50, 0.16);
      background: color-mix(
        in srgb,
        var(--success-color, #2e7d32) 16%,
        transparent
      );
      color: var(--success-color, #2e7d32);
    }

    .backup-active {
      background: rgba(211, 47, 47, 0.18);
      background: color-mix(in srgb, var(--error-color, #d32f2f) 18%, transparent);
      color: var(--error-color, #d32f2f);
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    /* --- main row --- */

    .main {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 8px;
    }

    .main.clickable {
      cursor: pointer;
      outline: none;
    }

    .main.clickable:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 3px;
      border-radius: 6px;
    }

    .battery {
      flex-shrink: 0;
    }

    .fish {
      --mdc-icon-size: 30px;
      width: 30px;
      height: 30px;
      color: var(--secondary-text-color);
      flex-shrink: 0;
    }

    .readout {
      display: flex;
      align-items: baseline;
      gap: 8px;
      min-width: 0;
    }

    .readout.stacked {
      flex-direction: column;
      gap: 0;
      align-items: flex-start;
    }

    .soc {
      font-size: 24px;
      line-height: 1.15;
      color: var(--primary-text-color);
      white-space: nowrap;
    }

    .energy {
      font-size: 13px;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }

    .timing {
      margin-left: auto;
      text-align: right;
      flex-shrink: 0;
    }

    .muted {
      font-size: 12px;
      color: var(--secondary-text-color);
      line-height: 1.4;
    }

    .power {
      font-size: 15px;
      font-weight: 500;
      line-height: 1.3;
      white-space: nowrap;
    }

    .power.negative {
      color: var(--error-color, #d32f2f);
    }

    .power.positive {
      color: var(--success-color, #2e7d32);
    }

    .power.neutral {
      color: var(--secondary-text-color);
    }

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

    /* --- battery controls (collapsed by default) --- */

    .controls {
      display: flex;
      align-items: center;
      gap: 14px;
      padding-top: 10px;
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.22));
    }

    /* Both slider rows share one grid so labels, tracks and values line up. */
    .ctl-rows {
      flex: 1;
      min-width: 0;
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 8px 10px;
    }

    .ctl-label {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }

    .ctl-value {
      font-size: 12px;
      color: var(--secondary-text-color);
      min-width: 38px;
      text-align: right;
      white-space: nowrap;
    }

    .ctl-label.disabled,
    .ctl-value.disabled {
      opacity: 0.4;
    }

    /* --- sliders: thin track, small muted thumb --- */

    .slider {
      -webkit-appearance: none;
      appearance: none;
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
      /* Centres the thumb on the 3px track. */
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

    /* --- thermal group item rows --- */

    .items {
      margin-top: 8px;
    }

    .item {
      display: grid;
      grid-template-columns: minmax(84px, 1fr) auto minmax(56px, auto) auto;
      align-items: center;
      gap: 10px;
      padding: 6px 0;
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.18));
    }

    .item-name {
      font-size: 13px;
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item-energy {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }

    .item-power {
      font-size: 12px;
      text-align: right;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }

    .item-power.positive {
      color: var(--success-color, #2e7d32);
      font-weight: 500;
    }
  `
];
let fe = Q;
const Kt = /* @__PURE__ */ new Set([
  "normal",
  "alarm",
  "night"
]), Gt = 12.5, Yt = 6.5, Zt = 6, Jt = 0.5, Xt = 500, Qt = ["L1", "L2", "L3"], er = {
  normal: {
    model: "Growatt MOD 10KTL3-X",
    todayProduction: 24.6,
    totalProduction: 18432,
    fault: "OK",
    alarm: "OK",
    deviceState: "Netzbetrieb",
    pvPower: 7850,
    inverterTemp: 42.5,
    dcTemp: 38.2,
    gridFrequency: 50.01,
    strings: [
      { power: 4200, voltage: 615.3, current: 6.8 },
      { power: 3650, voltage: 598.1, current: 6.1 }
    ],
    phases: [
      { grid: -2300, inverter: 2600, voltage: 232.1 },
      { grid: -2450, inverter: 2620, voltage: 231.5 },
      { grid: -2100, inverter: 2630, voltage: 233 }
    ]
  },
  // Grid-overvoltage alarm, and PV2 badly under PV1 so the imbalance bar shows.
  alarm: {
    model: "Growatt MOD 10KTL3-X",
    todayProduction: 12.3,
    totalProduction: 18420,
    fault: "OK",
    alarm: "Grid overvoltage",
    deviceState: "Netzbetrieb",
    pvPower: 4500,
    inverterTemp: 40.1,
    dcTemp: 41.5,
    gridFrequency: 50.09,
    strings: [
      { power: 3300, voltage: 610.2, current: 5.4 },
      { power: 1200, voltage: 585, current: 2.05 }
    ],
    phases: [
      { grid: -1e3, inverter: 1520, voltage: 253.2 },
      { grid: -1100, inverter: 1500, voltage: 251.8 },
      { grid: -900, inverter: 1480, voltage: 252.5 }
    ]
  },
  // Everything at rest: no PV power, inverter in standby, grid idle.
  night: {
    model: "Growatt MOD 10KTL3-X",
    todayProduction: 24.6,
    totalProduction: 18432,
    fault: "OK",
    alarm: "OK",
    deviceState: "Standby",
    pvPower: 0,
    inverterTemp: 27.3,
    dcTemp: 26.5,
    gridFrequency: 49.99,
    strings: [
      { power: 0, voltage: 0, current: 0 },
      { power: 0, voltage: 0, current: 0 }
    ],
    phases: [
      { grid: 0, inverter: 0, voltage: 231.4 },
      { grid: 0, inverter: 0, voltage: 230.9 },
      { grid: 0, inverter: 0, voltage: 232.2 }
    ]
  }
};
function p(i) {
  return typeof i == "string" && i.trim().length > 0;
}
function T(i) {
  return Array.isArray(i) && i.some(p);
}
function pe(i) {
  const e = i.filter((t) => t !== null);
  return e.length > 0 ? e.reduce((t, r) => t + r, 0) : null;
}
const ee = class ee extends E {
  constructor() {
    super(), this._expanded = !1;
  }
  setConfig(e) {
    if (!e)
      throw new Error("des-inverter-card: Konfiguration fehlt");
    if (!e.name)
      throw new Error('des-inverter-card: "name" ist erforderlich');
    if (e.demo_state && !Kt.has(e.demo_state))
      throw new Error(
        'des-inverter-card: "demo_state" muss "normal", "alarm" oder "night" sein'
      );
    this._config = e, this._expanded = !1;
  }
  getCardSize() {
    const e = this._blocks();
    let t = 2;
    return e.strings && (t += 1), this._expanded && (e.strings && (t += 1), e.phases && (t += 2), (e.dc || e.freq) && (t += 1)), t;
  }
  static getStubConfig() {
    return {
      type: "custom:des-inverter-card",
      name: "Wechselrichter",
      demo_state: "normal",
      kwp_total: 12.5,
      kwp_pv1: 6.5,
      kwp_pv2: 6
    };
  }
  // =========================================================================
  // mode + config-derived scalars
  // =========================================================================
  /** Any configured `*_entity` field switches the card from demo to reading. */
  get _entityMode() {
    const e = this._config;
    return e ? p(e.pv_power_entity) || p(e.today_production_entity) || p(e.total_production_entity) || p(e.fault_entity) || p(e.alarm_entity) || p(e.device_state_entity) || p(e.inverter_temp_entity) || p(e.dc_temp_entity) || p(e.grid_frequency_entity) || p(e.pv1_power_entity) || p(e.pv1_voltage_entity) || p(e.pv1_current_entity) || p(e.pv2_power_entity) || p(e.pv2_voltage_entity) || p(e.pv2_current_entity) || T(e.grid_power_entities) || T(e.inverter_power_entities) || T(e.grid_voltage_entities) : !1;
  }
  /** Which optional blocks are present, from config alone (no hass needed). */
  _blocks() {
    const e = this._config;
    return !e || !this._entityMode ? {
      strings: !0,
      phases: !0,
      dc: e?.show_dc_temp !== !1,
      freq: !0
    } : {
      strings: p(e.pv1_power_entity) || p(e.pv1_voltage_entity) || p(e.pv1_current_entity) || p(e.pv2_power_entity) || p(e.pv2_voltage_entity) || p(e.pv2_current_entity),
      phases: T(e.grid_power_entities) || T(e.inverter_power_entities) || T(e.grid_voltage_entities),
      dc: e.show_dc_temp !== !1 && p(e.dc_temp_entity),
      freq: p(e.grid_frequency_entity)
    };
  }
  get _kwpTotal() {
    return this._config?.kwp_total ?? Gt;
  }
  get _kwpString() {
    return [
      this._config?.kwp_pv1 ?? Yt,
      this._config?.kwp_pv2 ?? Zt
    ];
  }
  // =========================================================================
  // resolution: entities → view model
  // =========================================================================
  /**
   * A configured entity's numeric value, rescaled onto the card's base unit
   * (W for power, kWh for energy). `null` for an unset, unavailable or
   * non-numeric slot - all of which render as a muted "–".
   */
  _num(e, t) {
    if (!p(e)) return null;
    const r = v(e, this.hass);
    if (r.kind !== "value") return null;
    let s = r.value;
    if (P(e)) {
      const n = Se(e, this.hass);
      t === "power" ? n === "kw" ? s *= 1e3 : n === "mw" && (s *= 1e6) : t === "energy" && (n === "wh" ? s /= 1e3 : n === "mwh" && (s *= 1e3));
    }
    return Number.isFinite(s) ? s : null;
  }
  /** A configured entity's text, or null when unset/unavailable. */
  _text(e) {
    if (!p(e)) return null;
    const t = x(e, this.hass);
    return t.kind === "value" ? t.value : null;
  }
  _view() {
    return this._entityMode ? this._entityView() : this._demoView();
  }
  /** Wraps the static demo dataset in the (non-null) view shape. */
  _demoView() {
    const e = this._config, t = er[e.demo_state ?? "normal"];
    return {
      model: e.model ?? t.model,
      todayProduction: t.todayProduction,
      totalProduction: t.totalProduction,
      fault: t.fault,
      alarm: t.alarm,
      deviceState: t.deviceState,
      pvPower: t.pvPower,
      inverterTemp: t.inverterTemp,
      dcTemp: t.dcTemp,
      gridFrequency: t.gridFrequency,
      strings: [t.strings[0], t.strings[1]],
      phases: [t.phases[0], t.phases[1], t.phases[2]],
      imbalance: this._imbalance(t.strings[0].power, t.strings[1].power),
      showStrings: !0,
      showPhases: !0,
      showDcItem: e.show_dc_temp !== !1,
      showFreqItem: !0
    };
  }
  _entityView() {
    const e = this._config, t = this._num(e.pv1_power_entity, "power"), r = this._num(e.pv2_power_entity, "power");
    let s;
    p(e.pv_power_entity) ? s = this._num(e.pv_power_entity, "power") : s = pe([t, r]);
    const n = [
      {
        power: t,
        voltage: this._num(e.pv1_voltage_entity, "plain"),
        current: this._num(e.pv1_current_entity, "plain")
      },
      {
        power: r,
        voltage: this._num(e.pv2_voltage_entity, "plain"),
        current: this._num(e.pv2_current_entity, "plain")
      }
    ], o = (a) => ({
      grid: this._num(e.grid_power_entities?.[a], "power"),
      inverter: this._num(e.inverter_power_entities?.[a], "power"),
      voltage: this._num(e.grid_voltage_entities?.[a], "plain")
    }), l = this._blocks();
    return {
      model: e.model ?? "",
      todayProduction: this._num(e.today_production_entity, "energy"),
      totalProduction: this._num(e.total_production_entity, "energy"),
      fault: this._text(e.fault_entity),
      alarm: this._text(e.alarm_entity),
      deviceState: this._text(e.device_state_entity) ?? "Normal",
      pvPower: s,
      inverterTemp: this._num(e.inverter_temp_entity, "plain"),
      dcTemp: this._num(e.dc_temp_entity, "plain"),
      gridFrequency: this._num(e.grid_frequency_entity, "plain"),
      strings: n,
      phases: [o(0), o(1), o(2)],
      imbalance: this._imbalance(t, r),
      showStrings: l.strings,
      showPhases: l.phases,
      showDcItem: l.dc,
      showFreqItem: l.freq
    };
  }
  /** Per-string amber flags; skipped when a power is missing (would be NaN). */
  _imbalance(e, t) {
    const r = this._config;
    if (r?.imbalance_warn === !1) return [!1, !1];
    if (e === null || t === null) return [!1, !1];
    const s = r?.imbalance_ratio ?? Jt, n = r?.imbalance_min_w ?? Xt, o = (l, a) => l < s * a && a > n;
    return [o(e, t), o(t, e)];
  }
  // =========================================================================
  // render
  // =========================================================================
  render() {
    if (!this._config) return d;
    const t = this._view(), r = t.showStrings || t.showPhases || this._hasFooter(t);
    return c`
      <ha-card>
        <div class="card">
          ${this._renderCollapsed(t, r)}
          ${this._expanded && r ? this._renderExpanded(t) : d}
        </div>
      </ha-card>
    `;
  }
  _hasFooter(e) {
    return e.showDcItem || e.showFreqItem;
  }
  // --- collapsed (always visible) ------------------------------------------
  _renderCollapsed(e, t) {
    const r = this._config;
    return c`
      <div class="header">
        <div class="head-left">
          <span class="name">${r.name}</span>
          <span class="meta">${this._renderMeta(e)}</span>
        </div>
        ${this._renderPill(e)}
      </div>

      ${this._renderPowerRow(e)}
      ${e.showStrings ? this._renderStringBars(e) : d}

      ${t ? c`<div
            class="chevron-row clickable"
            role="button"
            tabindex="0"
            aria-expanded=${String(this._expanded)}
            aria-label="Details"
            @click=${this._toggleExpanded}
            @keydown=${this._onKeydown}
          >
            <ha-icon
              class="chevron ${this._expanded ? "open" : ""}"
              icon="mdi:chevron-down"
            ></ha-icon>
          </div>` : d}
    `;
  }
  /** "{model} · {today} kWh heute · {total} kWh gesamt"; model dropped if empty. */
  _renderMeta(e) {
    const t = [];
    return e.model && t.push(c`${e.model}`), t.push(c`${this._unit(e.todayProduction, f, "kWh")} heute`), t.push(
      c`${this._unit(e.totalProduction, m, "kWh")} gesamt`
    ), c`${t.map((r, s) => s === 0 ? r : c` · ${r}`)}`;
  }
  /** fault beats alarm beats device state; "OK"/absent means no fault. */
  _renderPill(e) {
    const t = (l) => {
      if (l === null) return null;
      const a = l.trim();
      return a.length > 0 && a.toLowerCase() !== "ok" ? a : null;
    }, r = t(e.fault), s = t(e.alarm), [n, o] = r ? [`Fault: ${r}`, "pill-fault"] : s ? [`Alarm: ${s}`, "pill-alarm"] : [e.deviceState, "pill-ok"];
    return c`<span class="pill ${o}">
      <span class="pill-label">${n}</span>
    </span>`;
  }
  _renderPowerRow(e) {
    const t = e.pvPower !== null && e.pvPower > 0, r = this._kwpTotal, s = e.pvPower !== null && r > 0 ? b(e.pvPower / (r * 1e3) * 100, 0, 999) : null;
    return c`
      <div class="power-row">
        <div class="pv">
          <span class="pv-value ${t ? "producing" : "idle"}">
            ${this._unit(e.pvPower, m, "W")}
          </span>
          ${s === null ? d : c`<span class="pv-share">
                ${m(s)} % von ${Mt(r)} kWp
              </span>`}
        </div>
        <div class="temp">
          ${this._thermometer()}
          ${this._unit(e.inverterTemp, f, "°C")}
        </div>
      </div>
    `;
  }
  _renderStringBars(e) {
    const t = this._kwpString;
    return c`
      <div class="strings">
        ${e.strings.map((r, s) => {
      const n = (t[s] ?? 0) * 1e3, o = r.power !== null && n > 0 ? b(r.power / n * 100, 0, 100) : 0, l = e.imbalance[s];
      return c`
            <div class="string-row">
              <span class="string-label">PV${s + 1}</span>
              <div class="bar">
                <div
                  class="bar-fill ${l ? "warn" : ""}"
                  style="width: ${o}%"
                ></div>
              </div>
              <span class="string-power">
                ${this._unit(r.power, m, "W")}
              </span>
            </div>
          `;
    })}
      </div>
    `;
  }
  // --- expanded ------------------------------------------------------------
  _renderExpanded(e) {
    return c`
      <div class="details">
        ${e.showStrings ? this._renderStringsTable(e) : d}
        ${e.showPhases ? this._renderPhasesTable(e) : d}
        ${this._hasFooter(e) ? this._renderFooter(e) : d}
      </div>
    `;
  }
  // A. Strings — voltage / current per MPPT input.
  _renderStringsTable(e) {
    return c`
      <div class="grid strings-grid">
        <span class="col-head">Strings</span>
        <span class="col-head num">Spannung</span>
        <span class="col-head num">Strom</span>
        ${e.strings.map(
      (t, r) => c`
            <span class="row-label">PV${r + 1}</span>
            <span class="num">${this._unit(t.voltage, f, "V")}</span>
            <span class="num">${this._unit(t.current, f, "A")}</span>
          `
    )}
      </div>
    `;
  }
  // B. Phases — grid flow, inverter output, voltage per phase, plus a Σ row.
  _renderPhasesTable(e) {
    const t = this._config?.invert_grid ? -1 : 1, r = e.phases.map(
      (o) => o.grid === null ? null : o.grid * t
    ), s = pe(r), n = pe(e.phases.map((o) => o.inverter));
    return c`
      <div class="grid phases-grid">
        <span class="col-head">Phasen</span>
        <span class="col-head num">Netz</span>
        <span class="col-head num">WR-Ausgang</span>
        <span class="col-head num">Spannung</span>

        ${e.phases.map((o, l) => {
      const a = r[l];
      return c`
            <span class="row-label">${Qt[l]}</span>
            <span class="num ${this._gridClass(a)}">
              ${this._unit(a, Fe, "W")}
            </span>
            <span class="num">${this._unit(o.inverter, m, "W")}</span>
            <span class="num">${this._unit(o.voltage, f, "V")}</span>
          `;
    })}

        <span class="row-label sum">Σ</span>
        <span class="num sum ${this._gridClass(s)}">
          ${this._unit(s, Fe, "W")}
        </span>
        <span class="num sum">${this._unit(n, m, "W")}</span>
        <span class="num sum muted">–</span>
      </div>
    `;
  }
  // C. Footer — DC temperature (optional) and grid frequency.
  _renderFooter(e) {
    return c`
      <div class="footer">
        ${e.showDcItem ? c`<div class="foot-item">
              <span class="foot-label">DC-Temperatur</span>
              <span class="foot-value">
                ${this._unit(e.dcTemp, f, "°C")}
              </span>
            </div>` : d}
        ${e.showFreqItem ? c`<div class="foot-item">
              <span class="foot-label">Netzfrequenz</span>
              <span class="foot-value">
                ${this._unit(e.gridFrequency, (t) => f(t, 2), "Hz")}
              </span>
            </div>` : d}
      </div>
    `;
  }
  // =========================================================================
  // shared
  // =========================================================================
  /** Formatted "value unit", or a muted "–" when the value is missing. */
  _unit(e, t, r) {
    return e === null ? c`<span class="unavail">–</span>` : c`${t(e)} ${r}`;
  }
  /** negative = feed-in (green), positive = import (red), zero/null = muted. */
  _gridClass(e) {
    return e === null || e === 0 ? "muted" : e < 0 ? "grid-feed" : "grid-draw";
  }
  /** Inline thermometer glyph, so the card needs no external icon set. */
  _thermometer() {
    return c`<svg
      class="thermo"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      role="img"
      aria-label="Temperatur"
    >
      ${ft`<path
        fill="currentColor"
        d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0m-3-10a2 2 0 0 1 2 2v1h-4V5a2 2 0 0 1 2-2Z"
      />`}
    </svg>`;
  }
  _toggleExpanded() {
    this._expanded = !this._expanded;
  }
  _onKeydown(e) {
    (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this._toggleExpanded());
  }
};
ee.properties = {
  // Assigning `hass` is a reactive property write, so Home Assistant's state
  // updates re-render the card (same mechanism as the storage card).
  hass: { attribute: !1 },
  _config: { state: !0 },
  _expanded: { state: !0 }
}, ee.styles = H`
    :host {
      display: block;
      height: 100%;
    }

    ha-card {
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      background: var(--card-background-color, var(--ha-card-background, #fff));
      color: var(--primary-text-color);
    }

    .card {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 12px 16px;
    }

    /* --- header --- */

    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }

    .head-left {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .name {
      font-size: 15px;
      font-weight: 500;
      color: var(--primary-text-color);
      white-space: nowrap;
    }

    .meta {
      font-size: 12px;
      color: var(--secondary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Placeholder for values the card could not read. */
    .unavail {
      color: var(--secondary-text-color);
      opacity: 0.7;
    }

    /* --- status pill (shared look with the storage card badges) --- */

    .pill {
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
      flex-shrink: 0;
      background: rgba(127, 127, 127, 0.15);
      color: var(--secondary-text-color);
    }

    .pill-label {
      display: block;
      transform: translateY(1px);
    }

    .pill-ok {
      background: rgba(46, 125, 50, 0.16);
      background: color-mix(in srgb, var(--success-color, #2e7d32) 16%, transparent);
      color: var(--success-color, #2e7d32);
    }

    .pill-alarm {
      background: rgba(255, 152, 0, 0.16);
      background: color-mix(in srgb, var(--warning-color, #ff9800) 16%, transparent);
      color: var(--warning-color, #ff9800);
    }

    .pill-fault {
      background: rgba(211, 47, 47, 0.18);
      background: color-mix(in srgb, var(--error-color, #d32f2f) 18%, transparent);
      color: var(--error-color, #d32f2f);
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    /* --- power row --- */

    .power-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
      margin-top: 10px;
    }

    .pv {
      display: flex;
      align-items: baseline;
      gap: 8px;
      min-width: 0;
    }

    .pv-value {
      font-size: 24px;
      line-height: 1.15;
      white-space: nowrap;
    }

    .pv-value.producing {
      color: var(--success-color, #2e7d32);
    }

    .pv-value.idle {
      color: var(--secondary-text-color);
    }

    .pv-share {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }

    .temp {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .thermo {
      flex-shrink: 0;
      opacity: 0.8;
    }

    /* --- string bars --- */

    .strings {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .string-row {
      display: grid;
      grid-template-columns: 30px 1fr auto;
      align-items: center;
      gap: 10px;
    }

    .string-label {
      font-size: 12px;
      color: var(--secondary-text-color);
    }

    .bar {
      height: 6px;
      border-radius: 3px;
      background: var(--divider-color, rgba(127, 127, 127, 0.22));
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      border-radius: 3px;
      background: var(--success-color, #2e7d32);
      transition: width 0.25s ease-out;
    }

    .bar-fill.warn {
      background: var(--warning-color, #ff9800);
    }

    .string-power {
      font-size: 12px;
      color: var(--secondary-text-color);
      text-align: right;
      white-space: nowrap;
      min-width: 52px;
    }

    /* --- chevron --- */

    .chevron-row {
      display: flex;
      justify-content: center;
      margin-top: 8px;
    }

    .chevron-row.clickable {
      cursor: pointer;
      outline: none;
    }

    .chevron-row.clickable:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
      border-radius: 6px;
    }

    .chevron {
      --mdc-icon-size: 22px;
      width: 22px;
      height: 22px;
      color: var(--secondary-text-color);
      transition: transform 0.18s ease-in-out;
    }

    .chevron.open {
      transform: rotate(180deg);
    }

    /* --- expanded details --- */

    .details {
      margin-top: 8px;
      padding-top: 10px;
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.22));
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .grid {
      display: grid;
      align-items: center;
      gap: 4px 12px;
      font-size: 12px;
    }

    .strings-grid {
      grid-template-columns: auto 1fr 1fr;
    }

    .phases-grid {
      grid-template-columns: auto 1fr 1fr 1fr;
    }

    .col-head {
      font-size: 11px;
      color: var(--secondary-text-color);
      padding-bottom: 2px;
    }

    .row-label {
      color: var(--secondary-text-color);
    }

    .num {
      text-align: right;
      white-space: nowrap;
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
    }

    .muted {
      color: var(--secondary-text-color);
    }

    .grid-feed {
      color: var(--success-color, #2e7d32);
    }

    .grid-draw {
      color: var(--error-color, #d32f2f);
    }

    /* Σ row: set off with a hairline and a touch more weight. */
    .sum {
      font-weight: 500;
      padding-top: 5px;
      margin-top: 1px;
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.18));
    }

    /* --- footer --- */

    .footer {
      display: flex;
      gap: 24px;
    }

    .foot-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .foot-label {
      font-size: 11px;
      color: var(--secondary-text-color);
    }

    .foot-value {
      font-size: 13px;
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
    }
  `;
let ve = ee;
const tr = /* @__PURE__ */ new Set([
  "normal",
  "night",
  "export"
]), rr = {
  // Solar-dominated: 2.840 W solar / 72 %, 710 W storage / 18 %, 400 W grid / 10 %.
  normal: {
    load: 3950,
    gridRaw: 400,
    storage: [710, -240],
    todayConsumption: 23.4,
    todayImport: 4.4,
    todayExport: 3.1,
    autarky: null
  },
  // No sun and no grid flow: the battery alone carries the house (100 % storage).
  night: {
    load: 620,
    gridRaw: 0,
    storage: [620, 0],
    todayConsumption: 23.4,
    todayImport: 4.4,
    todayExport: 3.1,
    autarky: null
  },
  // Surplus solar: the house is fully self-supplied (100 % solar) and feeds the grid.
  export: {
    load: 1200,
    gridRaw: -3800,
    storage: [0, 0],
    todayConsumption: 23.4,
    todayImport: 4.4,
    todayExport: 3.1,
    autarky: null
  }
};
function $(i) {
  return typeof i == "string" && i.trim().length > 0;
}
function sr(i) {
  return Array.isArray(i) && i.some($);
}
const te = class te extends E {
  constructor() {
    super(), this._expanded = !1;
  }
  setConfig(e) {
    if (!e)
      throw new Error("des-house-card: Konfiguration fehlt");
    if (!e.name)
      throw new Error('des-house-card: "name" ist erforderlich');
    if (e.demo_state && !tr.has(e.demo_state))
      throw new Error(
        'des-house-card: "demo_state" muss "normal", "night" oder "export" sein'
      );
    if (e.storage_positive && e.storage_positive !== "discharge" && e.storage_positive !== "charge")
      throw new Error(
        'des-house-card: "storage_positive" muss "discharge" oder "charge" sein'
      );
    this._config = e, this._expanded = !1;
  }
  getCardSize() {
    const e = this._config ? this._view() : null;
    let t = 4;
    return this._expanded && e && (t += [e.todayConsumption, e.todayImport, e.todayExport].filter(
      (r) => r !== null
    ).length), t;
  }
  static getStubConfig() {
    return {
      type: "custom:des-house-card",
      name: "Haus",
      demo_state: "normal"
    };
  }
  // =========================================================================
  // mode + resolution
  // =========================================================================
  /** Any configured entity field switches the card from demo to reading. */
  get _entityMode() {
    const e = this._config;
    return e ? $(e.load_power_entity) || $(e.grid_power_entity) || sr(e.storage_power_entities) || $(e.today_consumption_entity) || $(e.today_import_entity) || $(e.today_export_entity) || $(e.autarky_entity) : !1;
  }
  /**
   * A configured entity's numeric value, rescaled onto the card's base unit
   * (W for power, kWh for energy). `null` for an unset, unavailable or
   * non-numeric slot - all of which render as a muted "–".
   */
  _num(e, t) {
    if (!$(e)) return null;
    const r = v(e, this.hass);
    if (r.kind !== "value") return null;
    let s = r.value;
    if (P(e)) {
      const n = Se(e, this.hass);
      t === "power" ? n === "kw" ? s *= 1e3 : n === "mw" && (s *= 1e6) : t === "energy" && (n === "wh" ? s /= 1e3 : n === "mwh" && (s *= 1e3));
    }
    return Number.isFinite(s) ? s : null;
  }
  _rawInputs() {
    if (!this._entityMode)
      return rr[this._config.demo_state ?? "normal"];
    const e = this._config;
    return {
      load: this._num(e.load_power_entity, "power"),
      gridRaw: this._num(e.grid_power_entity, "power"),
      storage: (e.storage_power_entities ?? []).map((t) => this._num(t, "power")),
      todayConsumption: this._num(e.today_consumption_entity, "energy"),
      todayImport: this._num(e.today_import_entity, "energy"),
      todayExport: this._num(e.today_export_entity, "energy"),
      autarky: this._num(e.autarky_entity, "plain")
    };
  }
  _view() {
    const e = this._config, t = this._rawInputs(), r = e.invert_grid ? -1 : 1, n = (t.gridRaw === null ? null : t.gridRaw * r) ?? 0, o = Math.max(n, 0), l = Math.max(-n, 0), a = (e.storage_positive ?? "discharge") === "charge", u = t.storage.reduce((q, ae) => ae === null ? q : q + Math.max(a ? -ae : ae, 0), 0), g = t.load !== null && t.load > 0 ? t.load : 0;
    let h = 0, _ = 0, y = 0;
    g > 0 && (h = Math.min(u, g), _ = Math.min(o, g - h), y = Math.max(g - h - _, 0));
    const w = (q) => g > 0 ? b(q / g * 100, 0, 100) : 0;
    return {
      load: t.load,
      gridIn: o,
      gridOut: l,
      solarShare: y,
      storageShare: h,
      gridShare: _,
      solarPct: w(y),
      storagePct: w(h),
      gridPct: w(_),
      todayConsumption: t.todayConsumption,
      todayImport: t.todayImport,
      todayExport: t.todayExport,
      autarky: this._autarky(t),
      hasToday: t.todayConsumption !== null || t.todayImport !== null || t.todayExport !== null
    };
  }
  /** `autarky_entity` wins; otherwise 1 − import / consumption, in whole %. */
  _autarky(e) {
    if (e.autarky !== null) return e.autarky;
    const { todayConsumption: t, todayImport: r } = e;
    return t === null || t <= 0 || r === null ? null : b((1 - r / t) * 100, 0, 100);
  }
  // =========================================================================
  // render
  // =========================================================================
  render() {
    const e = this._config;
    if (!e) return d;
    const t = this._view();
    return c`
      <ha-card>
        <div class="card">
          ${this._renderCollapsed(e, t)}
          ${this._expanded && t.hasToday ? this._renderExpanded(t) : d}
        </div>
      </ha-card>
    `;
  }
  // --- collapsed (always visible) ------------------------------------------
  _renderCollapsed(e, t) {
    return c`
      <div class="header">
        <div class="head-left">
          <span class="name">${e.name}</span>
          <span class="meta">${this._renderMeta(t)}</span>
        </div>
        ${this._renderPill(t)}
      </div>

      ${this._renderPowerRow(t)}
      ${this._renderMixBar(t)}
      ${this._renderLegend(t)}

      ${t.hasToday ? c`<div
            class="chevron-row clickable"
            role="button"
            tabindex="0"
            aria-expanded=${String(this._expanded)}
            aria-label="Details"
            @click=${this._toggleExpanded}
            @keydown=${this._onKeydown}
          >
            <ha-icon
              class="chevron ${this._expanded ? "open" : ""}"
              icon="mdi:chevron-down"
            ></ha-icon>
          </div>` : d}
    `;
  }
  /** "{today_consumption} kWh heute · {autarkie} % autark". */
  _renderMeta(e) {
    return c`${this._unit(e.todayConsumption, f, "kWh")} heute ·
    ${this._unit(e.autarky, m, "%")} autark`;
  }
  /** feed-in (green) beats draw (red) beats an idle "Netz 0 W" (muted). */
  _renderPill(e) {
    const [t, r] = e.gridOut > 0 ? [`Einspeisung ${m(e.gridOut)} W`, "pill-feed"] : e.gridIn > 0 ? [`Netzbezug ${m(e.gridIn)} W`, "pill-draw"] : ["Netz 0 W", "pill-idle"];
    return c`<span class="pill ${r}">
      <span class="pill-label">${t}</span>
    </span>`;
  }
  _renderPowerRow(e) {
    return c`
      <div class="power-row">
        <div class="load">
          <span class="load-value">${this._unit(e.load, m, "W")}</span>
          <span class="load-label">Verbrauch</span>
        </div>
      </div>
    `;
  }
  _renderMixBar(e) {
    return c`
      <div
        class="mix"
        role="img"
        aria-label="Stromherkunft: Solar ${m(e.solarPct)} %, Speicher
        ${m(e.storagePct)} %, Netz ${m(e.gridPct)} %"
      >
        <div class="mix-seg solar" style="width: ${e.solarPct}%"></div>
        <div class="mix-seg storage" style="width: ${e.storagePct}%"></div>
        <div class="mix-seg grid" style="width: ${e.gridPct}%"></div>
      </div>
    `;
  }
  _renderLegend(e) {
    const t = [
      { cls: "solar", label: "Solar", power: e.solarShare, pct: e.solarPct },
      {
        cls: "storage",
        label: "Speicher",
        power: e.storageShare,
        pct: e.storagePct
      },
      { cls: "grid", label: "Netz", power: e.gridShare, pct: e.gridPct }
    ];
    return c`
      <div class="legend">
        ${t.map(
      (r) => c`
            <div class="legend-row">
              <span class="swatch ${r.cls}"></span>
              <span class="legend-label">${r.label}</span>
              <span class="legend-power">${m(r.power)} W</span>
              <span class="legend-pct">${m(r.pct)} %</span>
            </div>
          `
    )}
      </div>
    `;
  }
  // --- expanded ------------------------------------------------------------
  _renderExpanded(e) {
    return c`
      <div class="details">
        <div class="today">
          ${this._todayRow("Verbrauch", e.todayConsumption, "")}
          ${this._todayRow("Netzbezug", e.todayImport, "draw")}
          ${this._todayRow("Einspeisung", e.todayExport, "feed")}
        </div>
      </div>
    `;
  }
  /** One "Heute" row, or nothing when its value is missing. */
  _todayRow(e, t, r) {
    return t === null ? d : c`
      <span class="today-label">${e}</span>
      <span class="today-value ${r}">${f(t)} kWh</span>
    `;
  }
  // =========================================================================
  // shared
  // =========================================================================
  /** Formatted "value unit", or a muted "–" when the value is missing. */
  _unit(e, t, r) {
    return e === null ? c`<span class="unavail">–</span>` : c`${t(e)} ${r}`;
  }
  _toggleExpanded() {
    this._expanded = !this._expanded;
  }
  _onKeydown(e) {
    (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this._toggleExpanded());
  }
};
te.properties = {
  // Assigning `hass` is a reactive property write, so Home Assistant's state
  // updates re-render the card (same mechanism as the other cards).
  hass: { attribute: !1 },
  _config: { state: !0 },
  _expanded: { state: !0 }
}, te.styles = H`
    :host {
      display: block;
      height: 100%;
    }

    ha-card {
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      background: var(--card-background-color, var(--ha-card-background, #fff));
      color: var(--primary-text-color);
    }

    .card {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 12px 16px;
    }

    /* --- header --- */

    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }

    .head-left {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .name {
      font-size: 15px;
      font-weight: 500;
      color: var(--primary-text-color);
      white-space: nowrap;
    }

    .meta {
      font-size: 12px;
      color: var(--secondary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Placeholder for values the card could not read. */
    .unavail {
      color: var(--secondary-text-color);
      opacity: 0.7;
    }

    /* --- status pill (shared look with the other cards' badges) --- */

    .pill {
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
      flex-shrink: 0;
      background: rgba(127, 127, 127, 0.15);
      color: var(--secondary-text-color);
    }

    .pill-label {
      display: block;
      transform: translateY(1px);
    }

    .pill-feed {
      background: rgba(46, 125, 50, 0.16);
      background: color-mix(in srgb, var(--success-color, #2e7d32) 16%, transparent);
      color: var(--success-color, #2e7d32);
    }

    .pill-draw {
      background: rgba(211, 47, 47, 0.16);
      background: color-mix(in srgb, var(--error-color, #d32f2f) 16%, transparent);
      color: var(--error-color, #d32f2f);
    }

    .pill-idle {
      background: rgba(127, 127, 127, 0.16);
      background: color-mix(
        in srgb,
        var(--secondary-text-color, #727272) 16%,
        transparent
      );
      color: var(--secondary-text-color);
    }

    /* --- power row --- */

    .power-row {
      display: flex;
      align-items: baseline;
      gap: 12px;
      margin-top: 10px;
    }

    .load {
      display: flex;
      align-items: baseline;
      gap: 8px;
      min-width: 0;
    }

    .load-value {
      font-size: 24px;
      line-height: 1.15;
      color: var(--primary-text-color);
      white-space: nowrap;
    }

    .load-label {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }

    /* --- mix bar --- */

    .mix {
      display: flex;
      height: 8px;
      margin-top: 12px;
      border-radius: 4px;
      overflow: hidden;
      background: var(--divider-color, rgba(127, 127, 127, 0.22));
    }

    .mix-seg {
      height: 100%;
      transition: width 0.25s ease-out;
    }

    .mix-seg.solar,
    .swatch.solar {
      background: var(--success-color, #2e7d32);
    }

    /* Blue = the storage card's "charging" colour: heating/charging fills a store. */
    .mix-seg.storage,
    .swatch.storage {
      background: var(--info-color, #2196f3);
    }

    .mix-seg.grid,
    .swatch.grid {
      background: var(--error-color, #d32f2f);
    }

    /* --- legend --- */

    .legend {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .legend-row {
      display: grid;
      grid-template-columns: 8px 1fr auto auto;
      align-items: center;
      gap: 8px;
      font-size: 12px;
    }

    .swatch {
      width: 8px;
      height: 8px;
      border-radius: 2px;
    }

    .legend-label {
      color: var(--secondary-text-color);
    }

    .legend-power {
      text-align: right;
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    .legend-pct {
      text-align: right;
      min-width: 38px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    /* --- chevron --- */

    .chevron-row {
      display: flex;
      justify-content: center;
      margin-top: 8px;
    }

    .chevron-row.clickable {
      cursor: pointer;
      outline: none;
    }

    .chevron-row.clickable:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
      border-radius: 6px;
    }

    .chevron {
      --mdc-icon-size: 22px;
      width: 22px;
      height: 22px;
      color: var(--secondary-text-color);
      transition: transform 0.18s ease-in-out;
    }

    .chevron.open {
      transform: rotate(180deg);
    }

    /* --- expanded "Heute" block --- */

    .details {
      margin-top: 8px;
      padding-top: 10px;
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.22));
    }

    .today {
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      gap: 4px 12px;
      font-size: 12px;
    }

    .today-label {
      color: var(--secondary-text-color);
    }

    .today-value {
      text-align: right;
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    .today-value.draw {
      color: var(--error-color, #d32f2f);
    }

    .today-value.feed {
      color: var(--success-color, #2e7d32);
    }
  `;
let ye = te;
const J = ["day", "week", "month", "year"], ir = new Set(J), nr = {
  day: "Tag",
  week: "Woche",
  month: "Monat",
  year: "Jahr"
}, C = [
  { key: "consumption", label: "Verbrauch", cls: "m-consumption" },
  { key: "production", label: "Produktion", cls: "m-production" },
  { key: "import", label: "Import", cls: "m-import" },
  { key: "export", label: "Export", cls: "m-export" },
  { key: "charge", label: "Laden", cls: "m-charge" },
  { key: "discharge", label: "Entladen", cls: "m-discharge" }
];
function Y(i) {
  return {
    consumption: i[0],
    production: i[1],
    import: i[2],
    export: i[3],
    charge: i[4],
    discharge: i[5]
  };
}
const or = {
  day: Y([17.6, 22.4, 4.4, 3.1, 6.2, 5.8]),
  week: Y([148.2, 127.5, 38.6, 41, 32.1, 28.4]),
  month: Y([610, 590, 160, 175, 140, 128]),
  year: Y([5400, 8200, 1900, 4100, 1200, 1100])
};
function it(i) {
  return Array.isArray(i) ? i.some(it) : typeof i == "number" ? Number.isFinite(i) : typeof i == "string" && i.trim().length > 0;
}
const re = class re extends E {
  constructor() {
    super(), this._period = null;
  }
  setConfig(e) {
    if (!e)
      throw new Error("des-stats-card: Konfiguration fehlt");
    if (!e.name)
      throw new Error('des-stats-card: "name" ist erforderlich');
    if (e.default_period && !ir.has(e.default_period))
      throw new Error(
        'des-stats-card: "default_period" muss "day", "week", "month" oder "year" sein'
      );
    this._config = e, this._period = null;
  }
  getCardSize() {
    const e = this._effectivePeriod(this._availablePeriods()), t = e ? C.filter((r) => this._periodValues(e)[r.key] !== null).length : 0;
    return 2 + Math.ceil(t / 2);
  }
  static getStubConfig() {
    return { type: "custom:des-stats-card", name: "Statistik", default_period: "day" };
  }
  // =========================================================================
  // mode + resolution
  // =========================================================================
  /** Any configured period figure switches the card from demo to reading. */
  get _entityMode() {
    const e = this._config?.periods;
    return e ? J.some((t) => {
      const r = e[t];
      return r !== void 0 && C.some((s) => it(r[s.key]));
    }) : !1;
  }
  /**
   * A configured slot's numeric value, rescaled onto kWh (Wh → /1000,
   * MWh → ×1000). `null` for an unset, unavailable or non-numeric slot.
   */
  _num(e) {
    if (e === void 0 || typeof e == "string" && e.trim().length === 0) return null;
    const t = v(e, this.hass);
    if (t.kind !== "value") return null;
    let r = t.value;
    if (typeof e == "string" && P(e)) {
      const s = Se(e, this.hass);
      s === "wh" ? r /= 1e3 : s === "mwh" && (r *= 1e3);
    }
    return Number.isFinite(r) ? r : null;
  }
  /** Sum of a single value or a list; `null` when nothing resolves. */
  _sumList(e) {
    if (e === void 0) return null;
    const r = (Array.isArray(e) ? e : [e]).map((s) => this._num(s)).filter((s) => s !== null);
    return r.length > 0 ? r.reduce((s, n) => s + n, 0) : null;
  }
  _metricValue(e, t) {
    return e ? t === "charge" || t === "discharge" ? this._sumList(e[t]) : this._num(e[t]) : null;
  }
  _periodValues(e) {
    if (!this._entityMode) return or[e];
    const t = this._config?.periods?.[e], r = {};
    for (const { key: s } of C) r[s] = this._metricValue(t, s);
    return r;
  }
  /** Periods that have at least one readable figure (all four in demo mode). */
  _availablePeriods() {
    return this._entityMode ? J.filter((e) => {
      const t = this._periodValues(e);
      return C.some((r) => t[r.key] !== null);
    }) : [...J];
  }
  /** The user's pick if still available, else `default_period`, else the first. */
  _effectivePeriod(e) {
    if (e.length === 0) return null;
    if (this._period && e.includes(this._period)) return this._period;
    const t = this._config?.default_period;
    return t && e.includes(t) ? t : e[0];
  }
  /** Percentage, whole number, or null when the denominator is unusable. */
  _ratio(e, t) {
    return t === null || t <= 0 || e === null ? null : b((1 - e / t) * 100, 0, 100);
  }
  // =========================================================================
  // render
  // =========================================================================
  render() {
    const e = this._config;
    if (!e) return d;
    const t = this._availablePeriods(), r = this._effectivePeriod(t), s = r ? this._periodValues(r) : null, n = s ? this._ratio(s.import, s.consumption) : null, o = s ? this._ratio(s.export, s.production) : null;
    return c`
      <ha-card>
        <div class="card">
          <div class="header">
            <span class="name">${e.name}</span>
            ${t.length > 0 && r ? _e(
      t.map((l) => ({ value: l, label: nr[l] })),
      r,
      (l) => this._setPeriod(l),
      "Zeitraum"
    ) : d}
          </div>

          ${n === null && o === null ? d : c`<div class="meta">
                ${this._pct(n)} % autark · ${this._pct(o)} %
                Eigenverbrauch
              </div>`}

          ${s ? this._renderRows(s) : d}
        </div>
      </ha-card>
    `;
  }
  _renderRows(e) {
    const r = C.map((s) => e[s.key]).filter(
      (s) => s !== null
    ).reduce((s, n) => Math.max(s, n), 0);
    return c`
      <div class="rows">
        ${C.map((s) => {
      const n = e[s.key];
      if (n === null) return d;
      const o = r > 0 ? b(n / r * 100, 0, 100) : 0;
      return c`
            <span class="row-label">${s.label}</span>
            <div class="bar">
              <div
                class="bar-fill ${s.cls}"
                style="width: ${o}%"
              ></div>
            </div>
            <span class="row-value">${f(n)} kWh</span>
          `;
    })}
      </div>
    `;
  }
  /** Whole-number percent, or a muted "–" when it cannot be computed. */
  _pct(e) {
    return e === null ? c`<span class="unavail">–</span>` : c`${m(e)}`;
  }
  _setPeriod(e) {
    this._period = e;
  }
};
re.properties = {
  // Assigning `hass` is a reactive property write, so Home Assistant's state
  // updates re-render the card (same mechanism as the other cards).
  hass: { attribute: !1 },
  _config: { state: !0 },
  _period: { state: !0 }
}, re.styles = [
  rt,
  H`
      :host {
        display: block;
        height: 100%;

        /* Two hues the theme does not provide: an olive that stays clear of the
           production green, and a lighter blue for discharge against charge. */
        --stats-export-color: #639922;
        --stats-discharge-color: #7fb8e8;
      }

      ha-card {
        height: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        background: var(--card-background-color, var(--ha-card-background, #fff));
        color: var(--primary-text-color);
      }

      .card {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 12px 16px;
      }

      /* --- header --- */

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

      .unavail {
        color: var(--secondary-text-color);
        opacity: 0.7;
      }

      /* --- rows: label | bar | value --- */

      .rows {
        margin-top: 12px;
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 7px 10px;
      }

      .row-label {
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
      }

      .row-value {
        font-size: 12px;
        text-align: right;
        color: var(--primary-text-color);
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }

      .bar {
        height: 6px;
        border-radius: 3px;
        background: var(--divider-color, rgba(127, 127, 127, 0.22));
        overflow: hidden;
      }

      .bar-fill {
        height: 100%;
        border-radius: 3px;
        transition: width 0.25s ease-out;
      }

      .bar-fill.m-consumption {
        background: var(--secondary-text-color);
      }

      .bar-fill.m-production {
        background: var(--success-color, #2e7d32);
      }

      .bar-fill.m-import {
        background: var(--error-color, #d32f2f);
      }

      .bar-fill.m-export {
        background: var(--stats-export-color, #639922);
      }

      .bar-fill.m-charge {
        background: var(--info-color, #2196f3);
      }

      .bar-fill.m-discharge {
        background: var(--stats-discharge-color, #7fb8e8);
      }
    `
];
let xe = re;
const ar = "0.2.0", lr = [
  {
    type: "des-storage-card",
    element: fe,
    name: "Daniels Speicherkarte",
    description: "Speicherkarte für Hausakkus (battery) und Wärmespeicher-Gruppen (thermal_group)."
  },
  {
    type: "des-inverter-card",
    element: ve,
    name: "Daniels Wechselrichterkarte",
    description: "Wechselrichter-Übersicht: PV-Leistung, Strings und Phasen (Entities oder Demo-Werte)."
  },
  {
    type: "des-house-card",
    element: ye,
    name: "Daniels Hauskarte",
    description: "Hausverbrauch und Stromherkunft: Solar, Speicher, Netz plus Tageswerte (Entities oder Demo-Werte)."
  },
  {
    type: "des-stats-card",
    element: xe,
    name: "Daniels Statistikkarte",
    description: "Energiestatistik je Zeitraum (Tag/Woche/Monat/Jahr): Verbrauch, Produktion, Import, Export, Laden, Entladen."
  }
];
window.customCards = window.customCards ?? [];
for (const i of lr)
  customElements.get(i.type) || customElements.define(i.type, i.element), window.customCards.some((e) => e.type === i.type) || window.customCards.push({
    type: i.type,
    name: i.name,
    description: i.description,
    preview: !1
  });
console.info(
  `%c DANIELS-ENERGY-CARDS %c v${ar} `,
  "background:#03a9f4;color:#fff;font-weight:700;border-radius:3px 0 0 3px;padding:2px 4px",
  "background:#555;color:#fff;border-radius:0 3px 3px 0;padding:2px 4px"
);
export {
  ye as DesHouseCard,
  ve as DesInverterCard,
  xe as DesStatsCard,
  fe as DesStorageCard
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = globalThis, ne = W.ShadowRoot && (W.ShadyCSS === void 0 || W.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ae = Symbol(), he = /* @__PURE__ */ new WeakMap();
let Se = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== ae) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (ne && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = he.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && he.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const We = (i) => new Se(typeof i == "string" ? i : i + "", void 0, ae), Te = (i, ...e) => {
  const t = i.length === 1 ? i[0] : e.reduce((r, s, n) => r + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + i[n + 1], i[0]);
  return new Se(t, i, ae);
}, Be = (i, e) => {
  if (ne) i.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const r = document.createElement("style"), s = W.litNonce;
    s !== void 0 && r.setAttribute("nonce", s), r.textContent = t.cssText, i.appendChild(r);
  }
}, ue = ne ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const r of e.cssRules) t += r.cssText;
  return We(t);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ie, defineProperty: je, getOwnPropertyDescriptor: Ke, getOwnPropertyNames: Ve, getOwnPropertySymbols: Ge, getPrototypeOf: qe } = Object, K = globalThis, pe = K.trustedTypes, Ye = pe ? pe.emptyScript : "", Ze = K.reactiveElementPolyfillSupport, L = (i, e) => i, te = { toAttribute(i, e) {
  switch (e) {
    case Boolean:
      i = i ? Ye : null;
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
} }, Ce = (i, e) => !Ie(i, e), ge = { attribute: !0, type: String, converter: te, reflect: !1, useDefault: !1, hasChanged: Ce };
Symbol.metadata ??= Symbol("metadata"), K.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let k = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = ge) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = Symbol(), s = this.getPropertyDescriptor(e, r, t);
      s !== void 0 && je(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: s, set: n } = Ke(this.prototype, e) ?? { get() {
      return this[t];
    }, set(a) {
      this[t] = a;
    } };
    return { get: s, set(a) {
      const o = s?.call(this);
      n?.call(this, a), this.requestUpdate(e, o, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ge;
  }
  static _$Ei() {
    if (this.hasOwnProperty(L("elementProperties"))) return;
    const e = qe(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(L("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(L("properties"))) {
      const t = this.properties, r = [...Ve(t), ...Ge(t)];
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
      for (const s of r) t.unshift(ue(s));
    } else e !== void 0 && t.push(ue(e));
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
    return Be(e, this.constructor.elementStyles), e;
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
      const n = (r.converter?.toAttribute !== void 0 ? r.converter : te).toAttribute(t, r.type);
      this._$Em = e, n == null ? this.removeAttribute(s) : this.setAttribute(s, n), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const r = this.constructor, s = r._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const n = r.getPropertyOptions(s), a = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : te;
      this._$Em = s;
      const o = a.fromAttribute(t, n.type);
      this[s] = o ?? this._$Ej?.get(s) ?? o, this._$Em = null;
    }
  }
  requestUpdate(e, t, r, s = !1, n) {
    if (e !== void 0) {
      const a = this.constructor;
      if (s === !1 && (n = this[e]), r ??= a.getPropertyOptions(e), !((r.hasChanged ?? Ce)(n, t) || r.useDefault && r.reflect && n === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, r)))) return;
      this.C(e, t, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: r, reflect: s, wrapped: n }, a) {
    r && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), n !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (t = void 0), this._$AL.set(e, t)), s === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        const { wrapped: a } = n, o = this[s];
        a !== !0 || this._$AL.has(s) || o === void 0 || this.C(s, void 0, n, o);
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
k.elementStyles = [], k.shadowRootOptions = { mode: "open" }, k[L("elementProperties")] = /* @__PURE__ */ new Map(), k[L("finalized")] = /* @__PURE__ */ new Map(), Ze?.({ ReactiveElement: k }), (K.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const oe = globalThis, me = (i) => i, B = oe.trustedTypes, fe = B ? B.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, Me = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, Le = "?" + $, Xe = `<${Le}>`, y = document, P = () => y.createComment(""), N = (i) => i === null || typeof i != "object" && typeof i != "function", le = Array.isArray, Je = (i) => le(i) || typeof i?.[Symbol.iterator] == "function", Z = `[ 	
\f\r]`, C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _e = /-->/g, ve = />/g, w = RegExp(`>|${Z}(?:([^\\s"'>=/]+)(${Z}*=${Z}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), be = /'/g, $e = /"/g, Pe = /^(?:script|style|textarea|title)$/i, Ne = (i) => (e, ...t) => ({ _$litType$: i, strings: e, values: t }), c = Ne(1), Qe = Ne(2), E = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), we = /* @__PURE__ */ new WeakMap(), x = y.createTreeWalker(y, 129);
function Oe(i, e) {
  if (!le(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return fe !== void 0 ? fe.createHTML(e) : e;
}
const et = (i, e) => {
  const t = i.length - 1, r = [];
  let s, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = C;
  for (let o = 0; o < t; o++) {
    const l = i[o];
    let u, p, d = -1, _ = 0;
    for (; _ < l.length && (a.lastIndex = _, p = a.exec(l), p !== null); ) _ = a.lastIndex, a === C ? p[1] === "!--" ? a = _e : p[1] !== void 0 ? a = ve : p[2] !== void 0 ? (Pe.test(p[2]) && (s = RegExp("</" + p[2], "g")), a = w) : p[3] !== void 0 && (a = w) : a === w ? p[0] === ">" ? (a = s ?? C, d = -1) : p[1] === void 0 ? d = -2 : (d = a.lastIndex - p[2].length, u = p[1], a = p[3] === void 0 ? w : p[3] === '"' ? $e : be) : a === $e || a === be ? a = w : a === _e || a === ve ? a = C : (a = w, s = void 0);
    const b = a === w && i[o + 1].startsWith("/>") ? " " : "";
    n += a === C ? l + Xe : d >= 0 ? (r.push(u), l.slice(0, d) + Me + l.slice(d) + $ + b) : l + $ + (d === -2 ? o : b);
  }
  return [Oe(i, n + (i[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class O {
  constructor({ strings: e, _$litType$: t }, r) {
    let s;
    this.parts = [];
    let n = 0, a = 0;
    const o = e.length - 1, l = this.parts, [u, p] = et(e, t);
    if (this.el = O.createElement(u, r), x.currentNode = this.el.content, t === 2 || t === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (s = x.nextNode()) !== null && l.length < o; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const d of s.getAttributeNames()) if (d.endsWith(Me)) {
          const _ = p[a++], b = s.getAttribute(d).split($), H = /([.?@])?(.*)/.exec(_);
          l.push({ type: 1, index: n, name: H[2], strings: b, ctor: H[1] === "." ? rt : H[1] === "?" ? st : H[1] === "@" ? it : V }), s.removeAttribute(d);
        } else d.startsWith($) && (l.push({ type: 6, index: n }), s.removeAttribute(d));
        if (Pe.test(s.tagName)) {
          const d = s.textContent.split($), _ = d.length - 1;
          if (_ > 0) {
            s.textContent = B ? B.emptyScript : "";
            for (let b = 0; b < _; b++) s.append(d[b], P()), x.nextNode(), l.push({ type: 2, index: ++n });
            s.append(d[_], P());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Le) l.push({ type: 2, index: n });
      else {
        let d = -1;
        for (; (d = s.data.indexOf($, d + 1)) !== -1; ) l.push({ type: 7, index: n }), d += $.length - 1;
      }
      n++;
    }
  }
  static createElement(e, t) {
    const r = y.createElement("template");
    return r.innerHTML = e, r;
  }
}
function S(i, e, t = i, r) {
  if (e === E) return e;
  let s = r !== void 0 ? t._$Co?.[r] : t._$Cl;
  const n = N(e) ? void 0 : e._$litDirective$;
  return s?.constructor !== n && (s?._$AO?.(!1), n === void 0 ? s = void 0 : (s = new n(i), s._$AT(i, t, r)), r !== void 0 ? (t._$Co ??= [])[r] = s : t._$Cl = s), s !== void 0 && (e = S(i, s._$AS(i, e.values), s, r)), e;
}
class tt {
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
    const { el: { content: t }, parts: r } = this._$AD, s = (e?.creationScope ?? y).importNode(t, !0);
    x.currentNode = s;
    let n = x.nextNode(), a = 0, o = 0, l = r[0];
    for (; l !== void 0; ) {
      if (a === l.index) {
        let u;
        l.type === 2 ? u = new D(n, n.nextSibling, this, e) : l.type === 1 ? u = new l.ctor(n, l.name, l.strings, this, e) : l.type === 6 && (u = new nt(n, this, e)), this._$AV.push(u), l = r[++o];
      }
      a !== l?.index && (n = x.nextNode(), a++);
    }
    return x.currentNode = y, s;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}
class D {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, r, s) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = r, this.options = s, this._$Cv = s?.isConnected ?? !0;
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
    e = S(this, e, t), N(e) ? e === h || e == null || e === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : e !== this._$AH && e !== E && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Je(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== h && N(this._$AH) ? this._$AA.nextSibling.data = e : this.T(y.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: r } = e, s = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = O.createElement(Oe(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === s) this._$AH.p(t);
    else {
      const n = new tt(s, this), a = n.u(this.options);
      n.p(t), this.T(a), this._$AH = n;
    }
  }
  _$AC(e) {
    let t = we.get(e.strings);
    return t === void 0 && we.set(e.strings, t = new O(e)), t;
  }
  k(e) {
    le(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let r, s = 0;
    for (const n of e) s === t.length ? t.push(r = new D(this.O(P()), this.O(P()), this, this.options)) : r = t[s], r._$AI(n), s++;
    s < t.length && (this._$AR(r && r._$AB.nextSibling, s), t.length = s);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const r = me(e).nextSibling;
      me(e).remove(), e = r;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class V {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, r, s, n) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = e, this.name = t, this._$AM = s, this.options = n, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = h;
  }
  _$AI(e, t = this, r, s) {
    const n = this.strings;
    let a = !1;
    if (n === void 0) e = S(this, e, t, 0), a = !N(e) || e !== this._$AH && e !== E, a && (this._$AH = e);
    else {
      const o = e;
      let l, u;
      for (e = n[0], l = 0; l < n.length - 1; l++) u = S(this, o[r + l], t, l), u === E && (u = this._$AH[l]), a ||= !N(u) || u !== this._$AH[l], u === h ? e = h : e !== h && (e += (u ?? "") + n[l + 1]), this._$AH[l] = u;
    }
    a && !s && this.j(e);
  }
  j(e) {
    e === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class rt extends V {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === h ? void 0 : e;
  }
}
class st extends V {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== h);
  }
}
class it extends V {
  constructor(e, t, r, s, n) {
    super(e, t, r, s, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = S(this, e, t, 0) ?? h) === E) return;
    const r = this._$AH, s = e === h && r !== h || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, n = e !== h && (r === h || s);
    s && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class nt {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    S(this, e);
  }
}
const at = oe.litHtmlPolyfillSupport;
at?.(O, D), (oe.litHtmlVersions ??= []).push("3.3.3");
const ot = (i, e, t) => {
  const r = t?.renderBefore ?? e;
  let s = r._$litPart$;
  if (s === void 0) {
    const n = t?.renderBefore ?? null;
    r._$litPart$ = s = new D(e.insertBefore(P(), n), n, void 0, t ?? {});
  }
  return s._$AI(i), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ce = globalThis;
class A extends k {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ot(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return E;
  }
}
A._$litElement$ = !0, A.finalized = !0, ce.litElementHydrateSupport?.({ LitElement: A });
const lt = ce.litElementPolyfillSupport;
lt?.({ LitElement: A });
(ce.litElementVersions ??= []).push("4.2.2");
const G = "de-DE";
function f(i) {
  return new Intl.NumberFormat(G, { maximumFractionDigits: 0 }).format(i);
}
function ct(i) {
  return new Intl.NumberFormat(G, {
    maximumFractionDigits: 0,
    signDisplay: "always"
  }).format(i);
}
function xe(i) {
  const e = Math.round(i), t = f(Math.abs(e));
  return e > 0 ? `+${t}` : e < 0 ? `−${t}` : t;
}
function dt(i, e = 1) {
  return new Intl.NumberFormat(G, {
    minimumFractionDigits: 0,
    maximumFractionDigits: e
  }).format(i);
}
function g(i, e = 1) {
  return new Intl.NumberFormat(G, {
    minimumFractionDigits: e,
    maximumFractionDigits: e
  }).format(i);
}
function z(i, e, t) {
  return Math.min(t, Math.max(e, i));
}
const ht = /* @__PURE__ */ new Set(["unavailable", "unknown", "none", "null", ""]), ut = /^[a-z][a-z0-9_]*\.[a-z0-9_]+$/;
function q(i) {
  return typeof i == "string" && ut.test(i);
}
const re = { kind: "unset" }, M = { kind: "unavailable" };
function ze(i, e) {
  const t = e?.states?.[i];
  if (!t || typeof t.state != "string") return null;
  const r = t.state.trim();
  return ht.has(r.toLowerCase()) ? null : r;
}
function X(i, e, t) {
  const r = e?.states?.[i]?.attributes?.[t];
  if (typeof r == "number") return Number.isFinite(r) ? r : null;
  if (typeof r == "string") {
    const s = Number.parseFloat(r);
    return Number.isFinite(s) ? s : null;
  }
  return null;
}
function m(i, e) {
  if (i == null || typeof i == "boolean") return re;
  if (typeof i == "number")
    return Number.isFinite(i) ? { kind: "value", value: i } : M;
  if (q(i)) {
    const r = ze(i, e);
    if (r === null) return M;
    const s = Number.parseFloat(r);
    return Number.isFinite(s) ? { kind: "value", value: s } : M;
  }
  const t = Number.parseFloat(i);
  return Number.isFinite(t) ? { kind: "value", value: t } : M;
}
function v(i, e) {
  if (i == null) return re;
  if (typeof i == "boolean") return { kind: "value", value: i ? "on" : "off" };
  if (typeof i == "number") return { kind: "value", value: String(i) };
  if (q(i)) {
    const r = ze(i, e);
    return r === null ? M : { kind: "value", value: r };
  }
  const t = i.trim();
  return t.length > 0 ? { kind: "value", value: t } : re;
}
const Ue = /* @__PURE__ */ new Set(["number", "input_number"]), R = /* @__PURE__ */ new Set(["switch", "input_boolean"]), Y = /* @__PURE__ */ new Set(["select", "input_select"]), pt = /* @__PURE__ */ new Set(["on", "true", "1", "yes", "an", "ein"]);
function T(i) {
  const e = i.indexOf(".");
  return e === -1 ? "" : i.slice(0, e);
}
function U(i, e) {
  return typeof i == "string" && q(i) && e.has(T(i));
}
function ye(i) {
  return U(i, Ue);
}
function gt(i) {
  return U(i, R);
}
function De(i) {
  if (!i || typeof i != "object") return !1;
  const e = i.entity;
  return U(e, Y) || U(e, R);
}
function de(i, e, t, r) {
  if (typeof i?.callService != "function")
    return Promise.reject(new Error("des-storage-card: hass.callService fehlt"));
  try {
    return Promise.resolve(i.callService(e, t, r));
  } catch (s) {
    return Promise.reject(s);
  }
}
function mt(i, e, t) {
  const r = T(e);
  return Ue.has(r) ? de(i, r, "set_value", { entity_id: e, value: t }) : Promise.reject(
    new Error(`des-storage-card: ${e} ist keine number-Entität`)
  );
}
function Re(i, e, t) {
  const r = T(e);
  return R.has(r) ? de(i, r, t ? "turn_on" : "turn_off", { entity_id: e }) : Promise.reject(
    new Error(`des-storage-card: ${e} ist kein Schalter`)
  );
}
function ft(i, e, t) {
  const r = T(e);
  return Y.has(r) ? de(i, r, "select_option", { entity_id: e, option: t }) : Promise.reject(
    new Error(`des-storage-card: ${e} ist keine select-Entität`)
  );
}
function He(i, e) {
  const t = e === "charge" ? i.charge_state : i.auto_state;
  return t !== void 0 ? t : U(i.entity, R) ? e === "charge" ? "on" : "off" : void 0;
}
function ke(i, e) {
  const t = He(i, "charge");
  return t === void 0 ? !1 : t.trim().toLowerCase() === e.trim().toLowerCase();
}
function _t(i) {
  if (i === null || typeof i != "object")
    return '"charge_mode_control" muss ein Objekt mit "entity" sein';
  const { entity: e, charge_state: t, auto_state: r } = i;
  if (typeof e != "string" || e.length === 0)
    return '"charge_mode_control" braucht "entity"';
  if (!De(i))
    return `"charge_mode_control.entity" muss select, input_select, switch oder input_boolean sein (ist: ${e})`;
  if (Y.has(T(e))) {
    const s = [
      t === void 0 ? "charge_state" : null,
      r === void 0 ? "auto_state" : null
    ].filter((n) => n !== null);
    if (s.length > 0)
      return `"charge_mode_control" braucht ${s.join(" und ")} für ${e}`;
  }
  return null;
}
function vt(i, e, t) {
  const r = e.entity, s = T(r), n = He(e, t);
  return Y.has(s) ? n === void 0 ? Promise.reject(
    new Error(
      `des-storage-card: charge_mode_control braucht ${t === "charge" ? "charge_state" : "auto_state"} für ${r}`
    )
  ) : ft(i, r, n) : R.has(s) ? Re(i, r, pt.has((n ?? "").toLowerCase())) : Promise.reject(
    new Error(`des-storage-card: ${r} wird als Lademodus nicht unterstützt`)
  );
}
const Fe = {
  charging: "Lädt",
  discharging: "Entlädt",
  idle: "Bereit",
  heating: "Heizt",
  off: "Aus"
}, F = { min: 10, max: 80, step: 5 }, J = { min: 50, max: 100, step: 5 }, Ae = 5, Ee = 25, bt = 500, $t = 8e3, wt = /* @__PURE__ */ new Set([
  "not charging",
  "not discharging",
  "unknown",
  "unavailable",
  "none",
  "-",
  "--"
]), xt = [
  { value: "charge", label: "Laden" },
  { value: "auto", label: "Auto" }
], yt = [
  { value: "on", label: "An" },
  { value: "auto", label: "Auto" },
  { value: "off", label: "Aus" }
];
function kt(i) {
  const e = i.trim().toLowerCase();
  return e === "standby" ? "idle" : e in Fe ? e : null;
}
function At(i) {
  const e = i.trim().toLowerCase();
  return e === "on" || e === "auto" || e === "off" ? e : "auto";
}
function Q(i, e) {
  const { min: t, max: r, step: s } = e;
  if (!(s > 0)) return z(i, t, r);
  const n = Math.round((i - t) / s), a = Number((t + n * s).toFixed(6));
  return z(a, t, r);
}
function Et(i) {
  if (!Number.isFinite(i) || Number.isInteger(i)) return 0;
  const e = String(i), t = e.indexOf(".");
  return t === -1 ? 0 : Math.min(3, e.length - t - 1);
}
function ee(i, e) {
  const t = Et(e);
  return t === 0 ? f(i) : g(i, t);
}
function St(i) {
  return i < 4 || i > 50 ? "temp-alert" : i < 8 || i > 40 ? "temp-warn" : "";
}
const I = class I extends A {
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
      const t = _t(e.charge_mode_control);
      if (t !== null) throw new Error(`des-storage-card: ${t}`);
    }
    if (e.variant === "thermal_group") {
      const t = e.items;
      if (!Array.isArray(t) || t.length === 0)
        throw new Error(
          'des-storage-card: "items" braucht mindestens einen Eintrag'
        );
      if (t.length > Ae)
        throw new Error(
          `des-storage-card: "items" erlaubt höchstens ${Ae} Einträge`
        );
      if (t.some((r) => !r || !r.name))
        throw new Error('des-storage-card: jeder Eintrag in "items" braucht "name"');
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
      }, $t)
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
        this._rangeFor(e.threshold_pct, F)
      ) && (this._thresholdLocal = null, this._clearSettle("threshold")), this._targetLocal !== null && this._entityMatches(
        e.charge_target_pct,
        this._targetLocal,
        this._rangeFor(e.charge_target_pct, J)
      ) && (this._targetLocal = null, this._clearSettle("target"));
      const n = e.charge_mode_control;
      if (this._chargeModeLocal !== null && n?.entity) {
        const a = v(n.entity, this.hass);
        a.kind === "value" && (ke(n, a.value) ? "charge" : "auto") === this._chargeModeLocal && (this._chargeModeLocal = null, this._clearSettle("chargeMode"));
      }
      return;
    }
    const t = e.items ?? [];
    let r = !1;
    const s = [...this._itemModesLocal];
    t.forEach((n, a) => {
      const o = s[a];
      if (!o || o === "auto" || !n.switch_entity) return;
      const l = v(n.switch_entity, this.hass);
      if (l.kind !== "value") return;
      (l.value.trim().toLowerCase() === "on" ? "on" : "off") === o && (s[a] = null, r = !0, this._clearSettle(`item:${a}`));
    }), r && (this._itemModesLocal = s);
  }
  /** True when the slot is entity-bound and already carries exactly `local`. */
  _entityMatches(e, t, r) {
    if (typeof e != "string" || !q(e)) return !1;
    const s = m(e, this.hass);
    return s.kind === "value" && Q(s.value, r) === t;
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
    if (!ye(e)) return t;
    const r = e, s = X(r, this.hass, "min") ?? t.min, n = X(r, this.hass, "max") ?? t.max, a = X(r, this.hass, "step") ?? t.step;
    return !(s < n) || !(a > 0) ? t : { min: s, max: n, step: a };
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
    ` : h;
  }
  // =========================================================================
  // resolution / derivation
  // =========================================================================
  /** `power_w` if given, otherwise voltage x current; sign optionally flipped. */
  _power(e) {
    let t = m(e.power_w, this.hass);
    if (t.kind === "unset" && e.voltage_entity && e.current_entity) {
      const r = m(e.voltage_entity, this.hass), s = m(e.current_entity, this.hass);
      t = r.kind === "value" && s.kind === "value" ? { kind: "value", value: r.value * s.value } : { kind: "unavailable" };
    }
    return t.kind === "value" && e.invert_power ? { kind: "value", value: -t.value } : t;
  }
  /** Configured status, else derived from the power sign. */
  _status(e, t) {
    const r = v(e.status, this.hass);
    if (r.kind === "value") {
      const s = kt(r.value);
      if (s !== null) return s;
    }
    if (t.kind === "value") {
      if (t.value < -Ee) return "discharging";
      if (t.value > Ee) return "charging";
    }
    return "idle";
  }
  /** `energy_kwh` if given, otherwise soc x capacity / 100. */
  _energy(e, t, r) {
    const s = m(e.energy_kwh, this.hass);
    return s.kind !== "unset" ? s : t.kind === "value" && r.kind === "value" ? { kind: "value", value: t.value * r.value / 100 } : t.kind === "unavailable" || r.kind === "unavailable" ? { kind: "unavailable" } : { kind: "unset" };
  }
  /**
   * Remaining time. `time_remaining` wins; otherwise the charging variant is
   * used while power is positive and the discharging one in every other case.
   */
  _timeRemaining(e, t) {
    let r = e.time_remaining;
    r === void 0 && (r = t.kind === "value" && t.value > 0 ? e.time_remaining_charging : e.time_remaining_discharging);
    const s = v(r, this.hass);
    return s.kind !== "value" || wt.has(s.value.trim().toLowerCase()) ? null : s.value;
  }
  _backup(e) {
    const t = e.backup;
    if (!t || t === "none") return "none";
    if (typeof t == "string")
      return t === "active" || t === "ready" ? t : "none";
    const r = v(t.entity, this.hass);
    return r.kind !== "value" ? "none" : (t.active_states ?? []).some(
      (n) => n.trim().toLowerCase() === r.value.toLowerCase()
    ) ? "active" : "ready";
  }
  _threshold(e) {
    if (this._thresholdLocal !== null) return this._thresholdLocal;
    const t = m(e.threshold_pct, this.hass);
    return t.kind === "value" ? Q(t.value, this._rangeFor(e.threshold_pct, F)) : null;
  }
  _chargeTarget(e) {
    if (this._targetLocal !== null) return this._targetLocal;
    const t = m(e.charge_target_pct, this.hass);
    return t.kind === "value" ? Q(t.value, this._rangeFor(e.charge_target_pct, J)) : null;
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
      const s = v(t.entity, this.hass);
      return s.kind !== "value" ? null : ke(t, s.value) ? "charge" : "auto";
    }
    const r = v(e.charge_mode, this.hass);
    return r.kind === "value" && r.value.trim().toLowerCase() === "charge" ? "charge" : "auto";
  }
  /** Local click wins, then `mode`, then the switch entity's on/off state. */
  _itemMode(e, t) {
    const r = this._itemModesLocal[t];
    if (r) return r;
    const s = v(e.mode, this.hass);
    if (s.kind === "value") return At(s.value);
    if (e.switch_entity) {
      const n = v(e.switch_entity, this.hass);
      if (n.kind === "value")
        return n.value.trim().toLowerCase() === "on" ? "on" : "off";
    }
    return "auto";
  }
  // =========================================================================
  // variant: battery
  // =========================================================================
  _renderBattery(e) {
    const t = m(e.soc, this.hass), r = m(e.capacity_kwh, this.hass), s = this._power(e), n = this._energy(e, t, r), a = this._status(e, s), o = this._backup(e), l = this._timeRemaining(e, s), u = v(e.time_at, this.hass), p = [l, u.kind === "value" ? u.value : null].filter(
      (_) => _ !== null
    ), d = e.controls !== !1;
    return c`
      <div class="header">
        <div class="head-left">
          <span class="name">${e.name}</span>
          <span class="meta">${this._renderBatteryMeta(e, r)}</span>
        </div>
        <div class="badges">
          ${o === "none" ? h : this._renderBackupBadge(o)}
          ${this._renderBadge(Fe[a], `status-${a}`)}
        </div>
      </div>

      <div
        class="main ${d ? "clickable" : ""}"
        role=${d ? "button" : "presentation"}
        tabindex=${d ? 0 : -1}
        aria-expanded=${d ? String(this._expanded) : h}
        @click=${d ? this._toggleExpanded : h}
        @keydown=${d ? this._onMainKeydown : h}
      >
        ${this._renderBatteryIcon(t)}
        <div class="readout">
          <span class="soc">
            ${t.kind === "value" ? `${f(t.value)} %` : this._dash()}
          </span>
          ${n.kind === "unset" ? h : c`<span class="energy">
                ${n.kind === "value" ? `${g(n.value)} kWh` : this._dash()}
              </span>`}
        </div>
        <div class="timing">
          ${s.kind === "unset" ? h : c`<div class=${this._powerClass(s)}>
                ${s.kind === "value" ? this._formatPower(s.value) : this._dash()}
              </div>`}
          ${p.length === 0 ? h : c`<div class="muted">${p.join(" · ")}</div>`}
        </div>
        ${d ? c`<ha-icon
              class="chevron ${this._expanded ? "open" : ""}"
              icon="mdi:chevron-down"
            ></ha-icon>` : h}
      </div>

      ${d && this._expanded ? c`<div class="grow"></div>
            ${this._renderBatteryControls(e)}` : h}
    `;
  }
  /**
   * Two labelled slider rows on one grid, so labels, tracks and values line
   * up. The charge-mode control sits to their right, centred over both rows.
   */
  _renderBatteryControls(e) {
    const t = this._chargeMode(e), r = t === "charge", s = this._chargeTarget(e), n = this._threshold(e), a = this._rangeFor(e.charge_target_pct, J), o = this._rangeFor(e.threshold_pct, F);
    return c`
      <div class="controls">
        <div class="ctl-rows">
          <span class="ctl-label ${r ? "" : "disabled"}">Ladeziel</span>
          <input
            class="slider"
            type="range"
            min=${a.min}
            max=${a.max}
            step=${a.step}
            .value=${String(s ?? a.min)}
            ?disabled=${!r}
            aria-label="Ladeziel"
            @input=${this._onTargetInput}
            @change=${this._onTargetChange}
          />
          <span class="ctl-value ${r ? "" : "disabled"}">
            ${s === null ? this._dash() : `${ee(s, a.step)} %`}
          </span>

          <span class="ctl-label">min. SoC</span>
          <input
            class="slider"
            type="range"
            min=${o.min}
            max=${o.max}
            step=${o.step}
            .value=${String(n ?? o.min)}
            aria-label="Minimaler Ladestand"
            @input=${this._onThresholdInput}
            @change=${this._onThresholdChange}
          />
          <span class="ctl-value">
            ${n === null ? this._dash() : `${ee(n, o.step)} %`}
          </span>
        </div>
        ${this._renderSegmented(
      xt,
      t,
      (l) => this._setChargeMode(l),
      "Lademodus"
    )}
      </div>
    `;
  }
  /** "6,6 kWh · 23,5 °C · min. 20 % SoC" - unset segments are dropped. */
  _renderBatteryMeta(e, t) {
    const r = m(e.temp_c, this.hass), s = this._threshold(e), n = [];
    return t.kind === "value" ? n.push(`${g(t.value)} kWh`) : t.kind === "unavailable" && n.push(c`${this._dash()} kWh`), r.kind === "value" ? n.push(
      c`<span class=${St(r.value)}>
          ${g(r.value)} °C
        </span>`
    ) : r.kind === "unavailable" && n.push(c`${this._dash()} °C`), n.push(
      s === null ? c`min. ${this._dash()} SoC` : `min. ${ee(
        s,
        this._rangeFor(e.threshold_pct, F).step
      )} % SoC`
    ), c`${n.map(
      (a, o) => o === 0 ? a : c` · ${a}`
    )}`;
  }
  /** Upright battery; the fill grows from the bottom. */
  _renderBatteryIcon(e) {
    const t = e.kind === "value" ? z(e.value, 0, 100) : 0, r = e.kind !== "value" ? "transparent" : t > 50 ? "var(--success-color, #2e7d32)" : t >= 20 ? "var(--warning-color, #ff9800)" : "var(--error-color, #d32f2f)", s = 6, n = 26, a = n * t / 100, o = s + (n - a);
    return c`
      <svg
        class="battery"
        viewBox="0 0 22 36"
        width="22"
        height="36"
        role="img"
        aria-label=${e.kind === "value" ? `Ladestand ${f(t)} Prozent` : "Ladestand unbekannt"}
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
          y=${o}
          width="14"
          height=${a}
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
    const t = e.items ?? [], r = t.map((l) => m(l.power_w, this.hass)), s = t.map((l) => m(l.energy_kwh, this.hass)), n = this._sum(s), a = this._sum(r), o = r.filter(
      (l) => l.kind === "value" && l.value > 0
    ).length;
    return c`
      <div class="header">
        <div class="head-left">
          <span class="name">${e.name}</span>
        </div>
        <div class="badges">
          <!-- Heating charges the heat store, so it reads as "charging". -->
          ${this._renderBadge(
      o > 0 ? `${f(o)} heizen` : "Aus",
      o > 0 ? "status-charging" : "status-off"
    )}
        </div>
      </div>

      <div class="main">
        <ha-icon class="fish" icon="mdi:fish"></ha-icon>
        <div class="readout stacked">
          <span class="soc">
            ${n === null ? this._dash() : `${g(n)} kWh`}
          </span>
          <span class="energy">heute eingespeichert</span>
        </div>
        <div class="timing">
          <div
            class=${a !== null && a > 0 ? "power positive" : "power neutral"}
          >
            ${a === null ? this._dash() : this._formatPower(a)}
          </div>
        </div>
      </div>

      <div class="items">
        ${t.map(
      (l, u) => this._renderItem(l, u, r[u], s[u])
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
          ${s.kind === "value" ? `${g(s.value)} kWh` : s.kind === "unavailable" ? this._dash() : ""}
        </span>
        <span class=${n ? "item-power positive" : "item-power"}>
          ${r.kind === "value" ? this._formatPower(r.value) : r.kind === "unavailable" ? this._dash() : ""}
        </span>
        ${this._renderSegmented(
      yt,
      this._itemMode(e, t),
      (a) => this._setItemMode(t, a),
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
  /** One segmented control, used for both charge mode and item modes. */
  _renderSegmented(e, t, r, s) {
    return c`
      <div
        class="seg ${t === null ? "unknown" : ""}"
        role="group"
        aria-label=${s}
        title=${t === null ? "Zustand nicht lesbar" : h}
      >
        ${e.map(
      ({ value: n, label: a }) => c`
            <button
              type="button"
              class=${t === n ? "active" : ""}
              aria-pressed=${t === n ? "true" : "false"}
              @click=${(o) => {
        o.stopPropagation(), r(n);
      }}
            >
              ${a}
            </button>
          `
    )}
      </div>
    `;
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
    return `${t === 0 ? f(0) : ct(t)} W`;
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
    !t?.entity || !De(t) || (this._holdOptimistic("chargeMode", () => {
      this._chargeModeLocal = null;
    }), this._write(vt(this.hass, t, e), () => {
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
    if (!ye(t)) return;
    const s = t, n = this._writeTimers.get(e);
    n !== void 0 && window.clearTimeout(n), this._writeTimers.set(
      e,
      window.setTimeout(() => {
        this._writeTimers.delete(e), this._holdOptimistic(e, () => {
          e === "threshold" ? this._thresholdLocal = null : this._targetLocal = null;
        }), this._write(mt(this.hass, s, r), () => {
          this._clearSettle(e), e === "threshold" ? this._thresholdLocal = null : this._targetLocal = null;
        });
      }, bt)
    );
  }
  _setItemMode(e, t) {
    const r = [...this._itemModesLocal];
    r[e] = t, this._itemModesLocal = r;
    const s = this._config?.items?.[e]?.switch_entity;
    if (t === "auto" || !gt(s)) return;
    const n = () => {
      const a = [...this._itemModesLocal];
      a[e] = null, this._itemModesLocal = a;
    };
    this._holdOptimistic(`item:${e}`, n), this._write(Re(this.hass, s, t === "on"), () => {
      this._clearSettle(`item:${e}`), n();
    });
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
I.properties = {
  // Assigning `hass` is a reactive property write, so Home Assistant's
  // state updates re-render the card without a custom setter.
  hass: { attribute: !1 },
  _config: { state: !0 },
  _thresholdLocal: { state: !0 },
  _targetLocal: { state: !0 },
  _chargeModeLocal: { state: !0 },
  _expanded: { state: !0 },
  _itemModesLocal: { state: !0 }
}, I.styles = Te`
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

    /* --- segmented control --- */

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
let se = I;
const Tt = /* @__PURE__ */ new Set([
  "normal",
  "alarm",
  "night"
]), Ct = 12.5, Mt = 6.5, Lt = 6, Pt = 0.5, Nt = 500, Ot = ["L1", "L2", "L3"], zt = {
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
}, j = class j extends A {
  constructor() {
    super(), this._expanded = !1;
  }
  setConfig(e) {
    if (!e)
      throw new Error("des-inverter-card: Konfiguration fehlt");
    if (!e.name)
      throw new Error('des-inverter-card: "name" ist erforderlich');
    if (e.demo_state && !Tt.has(e.demo_state))
      throw new Error(
        'des-inverter-card: "demo_state" muss "normal", "alarm" oder "night" sein'
      );
    this._config = e, this._expanded = !1;
  }
  getCardSize() {
    return this._expanded ? 6 : 3;
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
  get _data() {
    return zt[this._config?.demo_state ?? "normal"];
  }
  // --- config-derived scalars ----------------------------------------------
  get _kwpTotal() {
    return this._config?.kwp_total ?? Ct;
  }
  get _kwpString() {
    return [
      this._config?.kwp_pv1 ?? Mt,
      this._config?.kwp_pv2 ?? Lt
    ];
  }
  /** Per-string amber flags for a badly imbalanced array. */
  get _imbalance() {
    const e = this._config;
    if (e?.imbalance_warn === !1) return [!1, !1];
    const t = e?.imbalance_ratio ?? Pt, r = e?.imbalance_min_w ?? Nt, [s, n] = this._data.strings.map((o) => o.power), a = (o, l) => o < t * l && l > r;
    return [a(s, n), a(n, s)];
  }
  render() {
    return this._config ? c`
      <ha-card>
        <div class="card">
          ${this._renderCollapsed()}
          ${this._expanded ? this._renderExpanded() : h}
        </div>
      </ha-card>
    ` : h;
  }
  // =========================================================================
  // collapsed (always visible)
  // =========================================================================
  _renderCollapsed() {
    const e = this._config, t = this._data, r = e.model ?? t.model;
    return c`
      <div class="header">
        <div class="head-left">
          <span class="name">${e.name}</span>
          <span class="meta">
            ${r} · ${g(t.todayProduction)} kWh heute ·
            ${f(t.totalProduction)} kWh gesamt
          </span>
        </div>
        ${this._renderPill(t)}
      </div>

      ${this._renderPowerRow(t)} ${this._renderStringBars(t)}

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
          class="chevron ${this._expanded ? "open" : ""}"
          icon="mdi:chevron-down"
        ></ha-icon>
      </div>
    `;
  }
  /** fault beats alarm beats device state. */
  _renderPill(e) {
    const [t, r] = e.fault !== "OK" ? [`Fault: ${e.fault}`, "pill-fault"] : e.alarm !== "OK" ? [`Alarm: ${e.alarm}`, "pill-alarm"] : [e.deviceState, "pill-ok"];
    return c`<span class="pill ${r}">
      <span class="pill-label">${t}</span>
    </span>`;
  }
  _renderPowerRow(e) {
    const t = e.pvPower > 0, r = this._kwpTotal, s = r > 0 ? z(e.pvPower / (r * 1e3) * 100, 0, 999) : 0;
    return c`
      <div class="power-row">
        <div class="pv">
          <span class="pv-value ${t ? "producing" : "idle"}">
            ${f(e.pvPower)} W
          </span>
          <span class="pv-share">
            ${f(s)} % von ${dt(r)} kWp
          </span>
        </div>
        <div class="temp">
          ${this._thermometer()} ${g(e.inverterTemp)} °C
        </div>
      </div>
    `;
  }
  _renderStringBars(e) {
    const t = this._kwpString, r = this._imbalance;
    return c`
      <div class="strings">
        ${e.strings.map((s, n) => {
      const a = (t[n] ?? 0) * 1e3, o = a > 0 ? z(s.power / a * 100, 0, 100) : 0, l = r[n];
      return c`
            <div class="string-row">
              <span class="string-label">PV${n + 1}</span>
              <div class="bar">
                <div
                  class="bar-fill ${l ? "warn" : ""}"
                  style="width: ${o}%"
                ></div>
              </div>
              <span class="string-power">${f(s.power)} W</span>
            </div>
          `;
    })}
      </div>
    `;
  }
  // =========================================================================
  // expanded
  // =========================================================================
  _renderExpanded() {
    return c`
      <div class="details">
        ${this._renderStringsTable()} ${this._renderPhasesTable()}
        ${this._renderFooter()}
      </div>
    `;
  }
  // A. Strings — voltage / current per MPPT input.
  _renderStringsTable() {
    const e = this._data;
    return c`
      <div class="grid strings-grid">
        <span class="col-head">Strings</span>
        <span class="col-head num">Spannung</span>
        <span class="col-head num">Strom</span>
        ${e.strings.map(
      (t, r) => c`
            <span class="row-label">PV${r + 1}</span>
            <span class="num">${g(t.voltage)} V</span>
            <span class="num">${g(t.current)} A</span>
          `
    )}
      </div>
    `;
  }
  // B. Phases — grid flow, inverter output, voltage per phase, plus a Σ row.
  _renderPhasesTable() {
    const e = this._data, t = this._config?.invert_grid ? -1 : 1, r = e.phases.map((a) => a.grid * t), s = r.reduce((a, o) => a + o, 0), n = e.phases.reduce((a, o) => a + o.inverter, 0);
    return c`
      <div class="grid phases-grid">
        <span class="col-head">Phasen</span>
        <span class="col-head num">Netz</span>
        <span class="col-head num">WR-Ausgang</span>
        <span class="col-head num">Spannung</span>

        ${e.phases.map(
      (a, o) => c`
            <span class="row-label">${Ot[o]}</span>
            <span class="num ${this._gridClass(r[o])}">
              ${xe(r[o])} W
            </span>
            <span class="num">${f(a.inverter)} W</span>
            <span class="num">${g(a.voltage)} V</span>
          `
    )}

        <span class="row-label sum">Σ</span>
        <span class="num sum ${this._gridClass(s)}">
          ${xe(s)} W
        </span>
        <span class="num sum">${f(n)} W</span>
        <span class="num sum muted">–</span>
      </div>
    `;
  }
  // C. Footer — DC temperature (optional) and grid frequency.
  _renderFooter() {
    const e = this._data, t = this._config?.show_dc_temp !== !1;
    return c`
      <div class="footer">
        ${t ? c`<div class="foot-item">
              <span class="foot-label">DC-Temperatur</span>
              <span class="foot-value">${g(e.dcTemp)} °C</span>
            </div>` : h}
        <div class="foot-item">
          <span class="foot-label">Netzfrequenz</span>
          <span class="foot-value">${g(e.gridFrequency, 2)} Hz</span>
        </div>
      </div>
    `;
  }
  // =========================================================================
  // shared
  // =========================================================================
  /** negative = feed-in (green), positive = import (red), zero = muted. */
  _gridClass(e) {
    return e < 0 ? "grid-feed" : e > 0 ? "grid-draw" : "muted";
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
      ${Qe`<path
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
j.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 },
  _expanded: { state: !0 }
}, j.styles = Te`
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
let ie = j;
const Ut = "0.1.0", Dt = [
  {
    type: "des-storage-card",
    element: se,
    name: "Daniels Speicherkarte",
    description: "Speicherkarte für Hausakkus (battery) und Wärmespeicher-Gruppen (thermal_group)."
  },
  {
    type: "des-inverter-card",
    element: ie,
    name: "Daniels Wechselrichterkarte",
    description: "Wechselrichter-Übersicht: PV-Leistung, Strings und Phasen (Phase 1: Demo-Werte)."
  }
];
window.customCards = window.customCards ?? [];
for (const i of Dt)
  customElements.get(i.type) || customElements.define(i.type, i.element), window.customCards.some((e) => e.type === i.type) || window.customCards.push({
    type: i.type,
    name: i.name,
    description: i.description,
    preview: !1
  });
console.info(
  `%c DANIELS-ENERGY-CARDS %c v${Ut} `,
  "background:#03a9f4;color:#fff;font-weight:700;border-radius:3px 0 0 3px;padding:2px 4px",
  "background:#555;color:#fff;border-radius:0 3px 3px 0;padding:2px 4px"
);
export {
  ie as DesInverterCard,
  se as DesStorageCard
};

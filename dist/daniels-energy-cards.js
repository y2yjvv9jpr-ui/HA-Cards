/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const R = globalThis, K = R.ShadowRoot && (R.ShadyCSS === void 0 || R.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Y = Symbol(), ee = /* @__PURE__ */ new WeakMap();
let _e = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== Y) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (K && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = ee.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && ee.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ce = (i) => new _e(typeof i == "string" ? i : i + "", void 0, Y), Me = (i, ...e) => {
  const t = i.length === 1 ? i[0] : e.reduce((s, r, n) => s + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + i[n + 1], i[0]);
  return new _e(t, i, Y);
}, Te = (i, e) => {
  if (K) i.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), r = R.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = t.cssText, i.appendChild(s);
  }
}, te = K ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return Ce(t);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Le, defineProperty: Pe, getOwnPropertyDescriptor: Ne, getOwnPropertyNames: Oe, getOwnPropertySymbols: He, getPrototypeOf: Re } = Object, B = globalThis, se = B.trustedTypes, Ue = se ? se.emptyScript : "", ze = B.reactiveElementPolyfillSupport, M = (i, e) => i, V = { toAttribute(i, e) {
  switch (e) {
    case Boolean:
      i = i ? Ue : null;
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
} }, $e = (i, e) => !Le(i, e), re = { attribute: !0, type: String, converter: V, reflect: !1, useDefault: !1, hasChanged: $e };
Symbol.metadata ??= Symbol("metadata"), B.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let w = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = re) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(e, s, t);
      r !== void 0 && Pe(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: r, set: n } = Ne(this.prototype, e) ?? { get() {
      return this[t];
    }, set(a) {
      this[t] = a;
    } };
    return { get: r, set(a) {
      const h = r?.call(this);
      n?.call(this, a), this.requestUpdate(e, h, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? re;
  }
  static _$Ei() {
    if (this.hasOwnProperty(M("elementProperties"))) return;
    const e = Re(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(M("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(M("properties"))) {
      const t = this.properties, s = [...Oe(t), ...He(t)];
      for (const r of s) this.createProperty(r, t[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [s, r] of t) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, s] of this.elementProperties) {
      const r = this._$Eu(t, s);
      r !== void 0 && this._$Eh.set(r, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const r of s) t.unshift(te(r));
    } else e !== void 0 && t.push(te(e));
    return t;
  }
  static _$Eu(e, t) {
    const s = t.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof e == "string" ? e.toLowerCase() : void 0;
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
    for (const s of t.keys()) this.hasOwnProperty(s) && (e.set(s, this[s]), delete this[s]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Te(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, t, s) {
    this._$AK(e, s);
  }
  _$ET(e, t) {
    const s = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, s);
    if (r !== void 0 && s.reflect === !0) {
      const n = (s.converter?.toAttribute !== void 0 ? s.converter : V).toAttribute(t, s.type);
      this._$Em = e, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const s = this.constructor, r = s._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const n = s.getPropertyOptions(r), a = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : V;
      this._$Em = r;
      const h = a.fromAttribute(t, n.type);
      this[r] = h ?? this._$Ej?.get(r) ?? h, this._$Em = null;
    }
  }
  requestUpdate(e, t, s, r = !1, n) {
    if (e !== void 0) {
      const a = this.constructor;
      if (r === !1 && (n = this[e]), s ??= a.getPropertyOptions(e), !((s.hasChanged ?? $e)(n, t) || s.useDefault && s.reflect && n === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, s)))) return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: r, wrapped: n }, a) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), n !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)), r === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [r, n] of this._$Ep) this[r] = n;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, n] of s) {
        const { wrapped: a } = n, h = this[r];
        a !== !0 || this._$AL.has(r) || h === void 0 || this.C(r, void 0, n, h);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(t)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
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
w.elementStyles = [], w.shadowRootOptions = { mode: "open" }, w[M("elementProperties")] = /* @__PURE__ */ new Map(), w[M("finalized")] = /* @__PURE__ */ new Map(), ze?.({ ReactiveElement: w }), (B.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const X = globalThis, ie = (i) => i, U = X.trustedTypes, ne = U ? U.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, be = "$lit$", m = `lit$${Math.random().toFixed(9).slice(2)}$`, ye = "?" + m, Ie = `<${ye}>`, x = document, L = () => x.createComment(""), P = (i) => i === null || typeof i != "object" && typeof i != "function", Z = Array.isArray, Be = (i) => Z(i) || typeof i?.[Symbol.iterator] == "function", j = `[ 	
\f\r]`, E = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ae = /-->/g, oe = />/g, _ = RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), le = /'/g, he = /"/g, xe = /^(?:script|style|textarea|title)$/i, De = (i) => (e, ...t) => ({ _$litType$: i, strings: e, values: t }), u = De(1), A = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), ce = /* @__PURE__ */ new WeakMap(), y = x.createTreeWalker(x, 129);
function we(i, e) {
  if (!Z(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ne !== void 0 ? ne.createHTML(e) : e;
}
const je = (i, e) => {
  const t = i.length - 1, s = [];
  let r, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = E;
  for (let h = 0; h < t; h++) {
    const o = i[h];
    let d, p, l = -1, g = 0;
    for (; g < o.length && (a.lastIndex = g, p = a.exec(o), p !== null); ) g = a.lastIndex, a === E ? p[1] === "!--" ? a = ae : p[1] !== void 0 ? a = oe : p[2] !== void 0 ? (xe.test(p[2]) && (r = RegExp("</" + p[2], "g")), a = _) : p[3] !== void 0 && (a = _) : a === _ ? p[0] === ">" ? (a = r ?? E, l = -1) : p[1] === void 0 ? l = -2 : (l = a.lastIndex - p[2].length, d = p[1], a = p[3] === void 0 ? _ : p[3] === '"' ? he : le) : a === he || a === le ? a = _ : a === ae || a === oe ? a = E : (a = _, r = void 0);
    const v = a === _ && i[h + 1].startsWith("/>") ? " " : "";
    n += a === E ? o + Ie : l >= 0 ? (s.push(d), o.slice(0, l) + be + o.slice(l) + m + v) : o + m + (l === -2 ? h : v);
  }
  return [we(i, n + (i[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class N {
  constructor({ strings: e, _$litType$: t }, s) {
    let r;
    this.parts = [];
    let n = 0, a = 0;
    const h = e.length - 1, o = this.parts, [d, p] = je(e, t);
    if (this.el = N.createElement(d, s), y.currentNode = this.el.content, t === 2 || t === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (r = y.nextNode()) !== null && o.length < h; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const l of r.getAttributeNames()) if (l.endsWith(be)) {
          const g = p[a++], v = r.getAttribute(l).split(m), H = /([.?@])?(.*)/.exec(g);
          o.push({ type: 1, index: n, name: H[2], strings: v, ctor: H[1] === "." ? Fe : H[1] === "?" ? Ve : H[1] === "@" ? Ge : D }), r.removeAttribute(l);
        } else l.startsWith(m) && (o.push({ type: 6, index: n }), r.removeAttribute(l));
        if (xe.test(r.tagName)) {
          const l = r.textContent.split(m), g = l.length - 1;
          if (g > 0) {
            r.textContent = U ? U.emptyScript : "";
            for (let v = 0; v < g; v++) r.append(l[v], L()), y.nextNode(), o.push({ type: 2, index: ++n });
            r.append(l[g], L());
          }
        }
      } else if (r.nodeType === 8) if (r.data === ye) o.push({ type: 2, index: n });
      else {
        let l = -1;
        for (; (l = r.data.indexOf(m, l + 1)) !== -1; ) o.push({ type: 7, index: n }), l += m.length - 1;
      }
      n++;
    }
  }
  static createElement(e, t) {
    const s = x.createElement("template");
    return s.innerHTML = e, s;
  }
}
function k(i, e, t = i, s) {
  if (e === A) return e;
  let r = s !== void 0 ? t._$Co?.[s] : t._$Cl;
  const n = P(e) ? void 0 : e._$litDirective$;
  return r?.constructor !== n && (r?._$AO?.(!1), n === void 0 ? r = void 0 : (r = new n(i), r._$AT(i, t, s)), s !== void 0 ? (t._$Co ??= [])[s] = r : t._$Cl = r), r !== void 0 && (e = k(i, r._$AS(i, e.values), r, s)), e;
}
class We {
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
    const { el: { content: t }, parts: s } = this._$AD, r = (e?.creationScope ?? x).importNode(t, !0);
    y.currentNode = r;
    let n = y.nextNode(), a = 0, h = 0, o = s[0];
    for (; o !== void 0; ) {
      if (a === o.index) {
        let d;
        o.type === 2 ? d = new O(n, n.nextSibling, this, e) : o.type === 1 ? d = new o.ctor(n, o.name, o.strings, this, e) : o.type === 6 && (d = new qe(n, this, e)), this._$AV.push(d), o = s[++h];
      }
      a !== o?.index && (n = y.nextNode(), a++);
    }
    return y.currentNode = x, r;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class O {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, s, r) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    e = k(this, e, t), P(e) ? e === c || e == null || e === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : e !== this._$AH && e !== A && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Be(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== c && P(this._$AH) ? this._$AA.nextSibling.data = e : this.T(x.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: s } = e, r = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = N.createElement(we(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(t);
    else {
      const n = new We(r, this), a = n.u(this.options);
      n.p(t), this.T(a), this._$AH = n;
    }
  }
  _$AC(e) {
    let t = ce.get(e.strings);
    return t === void 0 && ce.set(e.strings, t = new N(e)), t;
  }
  k(e) {
    Z(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, r = 0;
    for (const n of e) r === t.length ? t.push(s = new O(this.O(L()), this.O(L()), this, this.options)) : s = t[r], s._$AI(n), r++;
    r < t.length && (this._$AR(s && s._$AB.nextSibling, r), t.length = r);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const s = ie(e).nextSibling;
      ie(e).remove(), e = s;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class D {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, r, n) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = c;
  }
  _$AI(e, t = this, s, r) {
    const n = this.strings;
    let a = !1;
    if (n === void 0) e = k(this, e, t, 0), a = !P(e) || e !== this._$AH && e !== A, a && (this._$AH = e);
    else {
      const h = e;
      let o, d;
      for (e = n[0], o = 0; o < n.length - 1; o++) d = k(this, h[s + o], t, o), d === A && (d = this._$AH[o]), a ||= !P(d) || d !== this._$AH[o], d === c ? e = c : e !== c && (e += (d ?? "") + n[o + 1]), this._$AH[o] = d;
    }
    a && !r && this.j(e);
  }
  j(e) {
    e === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Fe extends D {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === c ? void 0 : e;
  }
}
class Ve extends D {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== c);
  }
}
class Ge extends D {
  constructor(e, t, s, r, n) {
    super(e, t, s, r, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = k(this, e, t, 0) ?? c) === A) return;
    const s = this._$AH, r = e === c && s !== c || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, n = e !== c && (s === c || r);
    r && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class qe {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    k(this, e);
  }
}
const Ke = X.litHtmlPolyfillSupport;
Ke?.(N, O), (X.litHtmlVersions ??= []).push("3.3.3");
const Ye = (i, e, t) => {
  const s = t?.renderBefore ?? e;
  let r = s._$litPart$;
  if (r === void 0) {
    const n = t?.renderBefore ?? null;
    s._$litPart$ = r = new O(e.insertBefore(L(), n), n, void 0, t ?? {});
  }
  return r._$AI(i), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const J = globalThis;
class T extends w {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ye(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return A;
  }
}
T._$litElement$ = !0, T.finalized = !0, J.litElementHydrateSupport?.({ LitElement: T });
const Xe = J.litElementPolyfillSupport;
Xe?.({ LitElement: T });
(J.litElementVersions ??= []).push("4.2.2");
const Q = "de-DE";
function $(i) {
  return new Intl.NumberFormat(Q, { maximumFractionDigits: 0 }).format(i);
}
function Ze(i) {
  return new Intl.NumberFormat(Q, {
    maximumFractionDigits: 0,
    signDisplay: "always"
  }).format(i);
}
function S(i, e = 1) {
  return new Intl.NumberFormat(Q, {
    minimumFractionDigits: e,
    maximumFractionDigits: e
  }).format(i);
}
function Ae(i, e, t) {
  return Math.min(t, Math.max(e, i));
}
const Je = /* @__PURE__ */ new Set(["unavailable", "unknown", "none", "null", ""]), Qe = /^[a-z][a-z0-9_]*\.[a-z0-9_]+$/;
function ke(i) {
  return typeof i == "string" && Qe.test(i);
}
const G = { kind: "unset" }, C = { kind: "unavailable" };
function Ee(i, e) {
  const t = e?.states?.[i];
  if (!t || typeof t.state != "string") return null;
  const s = t.state.trim();
  return Je.has(s.toLowerCase()) ? null : s;
}
function f(i, e) {
  if (i == null || typeof i == "boolean") return G;
  if (typeof i == "number")
    return Number.isFinite(i) ? { kind: "value", value: i } : C;
  if (ke(i)) {
    const s = Ee(i, e);
    if (s === null) return C;
    const r = Number.parseFloat(s);
    return Number.isFinite(r) ? { kind: "value", value: r } : C;
  }
  const t = Number.parseFloat(i);
  return Number.isFinite(t) ? { kind: "value", value: t } : C;
}
function b(i, e) {
  if (i == null) return G;
  if (typeof i == "boolean") return { kind: "value", value: i ? "on" : "off" };
  if (typeof i == "number") return { kind: "value", value: String(i) };
  if (ke(i)) {
    const s = Ee(i, e);
    return s === null ? C : { kind: "value", value: s };
  }
  const t = i.trim();
  return t.length > 0 ? { kind: "value", value: t } : G;
}
const Se = {
  charging: "Lädt",
  discharging: "Entlädt",
  idle: "Bereit",
  heating: "Heizt",
  off: "Aus"
}, W = 10, de = 80, ue = 5, F = 50, pe = 100, ge = 5, fe = 5, ve = 25, et = /* @__PURE__ */ new Set([
  "not charging",
  "not discharging",
  "unknown",
  "unavailable",
  "none",
  "-",
  "--"
]), tt = [
  { value: "charge", label: "Laden" },
  { value: "auto", label: "Auto" }
], st = [
  { value: "on", label: "An" },
  { value: "auto", label: "Auto" },
  { value: "off", label: "Aus" }
];
function rt(i) {
  const e = i.trim().toLowerCase();
  return e === "standby" ? "idle" : e in Se ? e : null;
}
function it(i) {
  const e = i.trim().toLowerCase();
  return e === "on" || e === "auto" || e === "off" ? e : "auto";
}
function me(i, e, t, s) {
  return Ae(Math.round(i / s) * s, e, t);
}
function nt(i) {
  return i < 4 || i > 50 ? "temp-alert" : i < 8 || i > 40 ? "temp-warn" : "";
}
const I = class I extends T {
  constructor() {
    super(), this._expanded = !1, this._thresholdLocal = null, this._targetLocal = null, this._chargeModeLocal = null, this._itemModesLocal = [];
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
    if (e.variant === "thermal_group") {
      const t = e.items;
      if (!Array.isArray(t) || t.length === 0)
        throw new Error(
          'des-storage-card: "items" braucht mindestens einen Eintrag'
        );
      if (t.length > fe)
        throw new Error(
          `des-storage-card: "items" erlaubt höchstens ${fe} Einträge`
        );
      if (t.some((s) => !s || !s.name))
        throw new Error('des-storage-card: jeder Eintrag in "items" braucht "name"');
      this._itemModesLocal = t.map(() => null);
    }
    this._config = e, this._expanded = !1, this._thresholdLocal = null, this._targetLocal = null, this._chargeModeLocal = null;
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
    return e ? u`
      <ha-card>
        <div class="card">
          ${e.variant === "battery" ? this._renderBattery(e) : this._renderThermalGroup(e)}
        </div>
      </ha-card>
    ` : c;
  }
  // =========================================================================
  // resolution / derivation
  // =========================================================================
  /** `power_w` if given, otherwise voltage x current; sign optionally flipped. */
  _power(e) {
    let t = f(e.power_w, this.hass);
    if (t.kind === "unset" && e.voltage_entity && e.current_entity) {
      const s = f(e.voltage_entity, this.hass), r = f(e.current_entity, this.hass);
      t = s.kind === "value" && r.kind === "value" ? { kind: "value", value: s.value * r.value } : { kind: "unavailable" };
    }
    return t.kind === "value" && e.invert_power ? { kind: "value", value: -t.value } : t;
  }
  /** Configured status, else derived from the power sign. */
  _status(e, t) {
    const s = b(e.status, this.hass);
    if (s.kind === "value") {
      const r = rt(s.value);
      if (r !== null) return r;
    }
    if (t.kind === "value") {
      if (t.value < -ve) return "discharging";
      if (t.value > ve) return "charging";
    }
    return "idle";
  }
  /** `energy_kwh` if given, otherwise soc x capacity / 100. */
  _energy(e, t, s) {
    const r = f(e.energy_kwh, this.hass);
    return r.kind !== "unset" ? r : t.kind === "value" && s.kind === "value" ? { kind: "value", value: t.value * s.value / 100 } : t.kind === "unavailable" || s.kind === "unavailable" ? { kind: "unavailable" } : { kind: "unset" };
  }
  /**
   * Remaining time. `time_remaining` wins; otherwise the charging variant is
   * used while power is positive and the discharging one in every other case.
   */
  _timeRemaining(e, t) {
    let s = e.time_remaining;
    s === void 0 && (s = t.kind === "value" && t.value > 0 ? e.time_remaining_charging : e.time_remaining_discharging);
    const r = b(s, this.hass);
    return r.kind !== "value" || et.has(r.value.trim().toLowerCase()) ? null : r.value;
  }
  _backup(e) {
    const t = e.backup;
    if (!t || t === "none") return "none";
    if (typeof t == "string")
      return t === "active" || t === "ready" ? t : "none";
    const s = b(t.entity, this.hass);
    return s.kind !== "value" ? "none" : (t.active_states ?? []).some(
      (n) => n.trim().toLowerCase() === s.value.toLowerCase()
    ) ? "active" : "ready";
  }
  _threshold(e) {
    if (this._thresholdLocal !== null) return this._thresholdLocal;
    const t = f(e.threshold_pct, this.hass);
    return t.kind === "value" ? me(t.value, W, de, ue) : null;
  }
  _chargeTarget(e) {
    if (this._targetLocal !== null) return this._targetLocal;
    const t = f(e.charge_target_pct, this.hass);
    return t.kind === "value" ? me(t.value, F, pe, ge) : null;
  }
  _chargeMode(e) {
    if (this._chargeModeLocal !== null) return this._chargeModeLocal;
    const t = b(e.charge_mode, this.hass);
    return t.kind === "value" && t.value.trim().toLowerCase() === "charge" ? "charge" : "auto";
  }
  /** Local click wins, then `mode`, then the switch entity's on/off state. */
  _itemMode(e, t) {
    const s = this._itemModesLocal[t];
    if (s) return s;
    const r = b(e.mode, this.hass);
    if (r.kind === "value") return it(r.value);
    if (e.switch_entity) {
      const n = b(e.switch_entity, this.hass);
      if (n.kind === "value")
        return n.value.trim().toLowerCase() === "on" ? "on" : "off";
    }
    return "auto";
  }
  // =========================================================================
  // variant: battery
  // =========================================================================
  _renderBattery(e) {
    const t = f(e.soc, this.hass), s = f(e.capacity_kwh, this.hass), r = this._power(e), n = this._energy(e, t, s), a = this._status(e, r), h = this._backup(e), o = this._timeRemaining(e, r), d = b(e.time_at, this.hass), p = [o, d.kind === "value" ? d.value : null].filter(
      (g) => g !== null
    ), l = e.controls !== !1;
    return u`
      <div class="header">
        <div class="head-left">
          <span class="name">${e.name}</span>
          <span class="meta">${this._renderBatteryMeta(e, s)}</span>
        </div>
        <div class="badges">
          ${h === "none" ? c : this._renderBackupBadge(h)}
          ${this._renderBadge(Se[a], `status-${a}`)}
        </div>
      </div>

      <div
        class="main ${l ? "clickable" : ""}"
        role=${l ? "button" : "presentation"}
        tabindex=${l ? 0 : -1}
        aria-expanded=${l ? String(this._expanded) : c}
        @click=${l ? this._toggleExpanded : c}
        @keydown=${l ? this._onMainKeydown : c}
      >
        ${this._renderBatteryIcon(t)}
        <div class="readout">
          <span class="soc">
            ${t.kind === "value" ? `${$(t.value)} %` : this._dash()}
          </span>
          ${n.kind === "unset" ? c : u`<span class="energy">
                ${n.kind === "value" ? `${S(n.value)} kWh` : this._dash()}
              </span>`}
        </div>
        <div class="timing">
          ${r.kind === "unset" ? c : u`<div class=${this._powerClass(r)}>
                ${r.kind === "value" ? this._formatPower(r.value) : this._dash()}
              </div>`}
          ${p.length === 0 ? c : u`<div class="muted">${p.join(" · ")}</div>`}
        </div>
        ${l ? u`<ha-icon
              class="chevron ${this._expanded ? "open" : ""}"
              icon="mdi:chevron-down"
            ></ha-icon>` : c}
      </div>

      ${l && this._expanded ? u`<div class="grow"></div>
            ${this._renderBatteryControls(e)}` : c}
    `;
  }
  /**
   * Two labelled slider rows on one grid, so labels, tracks and values line
   * up. The charge-mode control sits to their right, centred over both rows.
   */
  _renderBatteryControls(e) {
    const t = this._chargeMode(e), s = t === "charge", r = this._chargeTarget(e), n = this._threshold(e);
    return u`
      <div class="controls">
        <div class="ctl-rows">
          <span class="ctl-label ${s ? "" : "disabled"}">Ladeziel</span>
          <input
            class="slider"
            type="range"
            min=${F}
            max=${pe}
            step=${ge}
            .value=${String(r ?? F)}
            ?disabled=${!s}
            aria-label="Ladeziel"
            @input=${this._onTargetInput}
          />
          <span class="ctl-value ${s ? "" : "disabled"}">
            ${r === null ? this._dash() : `${$(r)} %`}
          </span>

          <span class="ctl-label">min. SoC</span>
          <input
            class="slider"
            type="range"
            min=${W}
            max=${de}
            step=${ue}
            .value=${String(n ?? W)}
            aria-label="Minimaler Ladestand"
            @input=${this._onThresholdInput}
          />
          <span class="ctl-value">
            ${n === null ? this._dash() : `${$(n)} %`}
          </span>
        </div>
        ${this._renderSegmented(
      tt,
      t,
      (a) => this._setChargeMode(a),
      "Lademodus"
    )}
      </div>
    `;
  }
  /** "6,6 kWh · 23,5 °C · min. 20 % SoC" - unset segments are dropped. */
  _renderBatteryMeta(e, t) {
    const s = f(e.temp_c, this.hass), r = this._threshold(e), n = [];
    return t.kind === "value" ? n.push(`${S(t.value)} kWh`) : t.kind === "unavailable" && n.push(u`${this._dash()} kWh`), s.kind === "value" ? n.push(
      u`<span class=${nt(s.value)}>
          ${S(s.value)} °C
        </span>`
    ) : s.kind === "unavailable" && n.push(u`${this._dash()} °C`), n.push(
      r === null ? u`min. ${this._dash()} SoC` : `min. ${$(r)} % SoC`
    ), u`${n.map(
      (a, h) => h === 0 ? a : u` · ${a}`
    )}`;
  }
  /** Upright battery; the fill grows from the bottom. */
  _renderBatteryIcon(e) {
    const t = e.kind === "value" ? Ae(e.value, 0, 100) : 0, s = e.kind !== "value" ? "transparent" : t > 50 ? "var(--success-color, #2e7d32)" : t >= 20 ? "var(--warning-color, #ff9800)" : "var(--error-color, #d32f2f)", r = 6, n = 26, a = n * t / 100, h = r + (n - a);
    return u`
      <svg
        class="battery"
        viewBox="0 0 22 36"
        width="22"
        height="36"
        role="img"
        aria-label=${e.kind === "value" ? `Ladestand ${$(t)} Prozent` : "Ladestand unbekannt"}
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
          y=${h}
          width="14"
          height=${a}
          rx="1.5"
          fill=${s}
        />
      </svg>
    `;
  }
  // =========================================================================
  // variant: thermal_group
  // =========================================================================
  _renderThermalGroup(e) {
    const t = e.items ?? [], s = t.map((o) => f(o.power_w, this.hass)), r = t.map((o) => f(o.energy_kwh, this.hass)), n = this._sum(r), a = this._sum(s), h = s.filter(
      (o) => o.kind === "value" && o.value > 0
    ).length;
    return u`
      <div class="header">
        <div class="head-left">
          <span class="name">${e.name}</span>
        </div>
        <div class="badges">
          <!-- Heating charges the heat store, so it reads as "charging". -->
          ${this._renderBadge(
      h > 0 ? `${$(h)} heizen` : "Aus",
      h > 0 ? "status-charging" : "status-off"
    )}
        </div>
      </div>

      <div class="main">
        <ha-icon class="fish" icon="mdi:fish"></ha-icon>
        <div class="readout stacked">
          <span class="soc">
            ${n === null ? this._dash() : `${S(n)} kWh`}
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
      (o, d) => this._renderItem(o, d, s[d], r[d])
    )}
      </div>
    `;
  }
  /** Sums the values that resolved; null when none of them did. */
  _sum(e) {
    const t = e.filter(
      (s) => s.kind === "value"
    );
    return t.length === 0 ? null : t.reduce((s, r) => s + r.value, 0);
  }
  _renderItem(e, t, s, r) {
    const n = s.kind === "value" && s.value > 0;
    return u`
      <div class="item">
        <span class="item-name">${e.name}</span>
        <span class="item-energy">
          ${r.kind === "value" ? `${S(r.value)} kWh` : r.kind === "unavailable" ? this._dash() : ""}
        </span>
        <span class=${n ? "item-power positive" : "item-power"}>
          ${s.kind === "value" ? this._formatPower(s.value) : s.kind === "unavailable" ? this._dash() : ""}
        </span>
        ${this._renderSegmented(
      st,
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
    return u`<span class="unavail">–</span>`;
  }
  /** One segmented control, used for both charge mode and item modes. */
  _renderSegmented(e, t, s, r) {
    return u`
      <div class="seg" role="group" aria-label=${r}>
        ${e.map(
      ({ value: n, label: a }) => u`
            <button
              type="button"
              class=${t === n ? "active" : ""}
              aria-pressed=${t === n ? "true" : "false"}
              @click=${(h) => {
        h.stopPropagation(), s(n);
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
    return u`<span class="badge ${t}">
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
    return `${t === 0 ? $(0) : Ze(t)} W`;
  }
  // --- local-only interaction (phase 2 still writes nothing back) ----------
  _toggleExpanded() {
    this._expanded = !this._expanded;
  }
  _onMainKeydown(e) {
    (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this._toggleExpanded());
  }
  _setChargeMode(e) {
    this._chargeModeLocal = e;
  }
  _onTargetInput(e) {
    this._targetLocal = Number(e.target.value);
  }
  _onThresholdInput(e) {
    this._thresholdLocal = Number(e.target.value);
  }
  _setItemMode(e, t) {
    const s = [...this._itemModesLocal];
    s[e] = t, this._itemModesLocal = s;
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
}, I.styles = Me`
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
let q = I;
const z = "des-storage-card", at = "0.1.0";
customElements.get(z) || customElements.define(z, q);
window.customCards = window.customCards ?? [];
window.customCards.some((i) => i.type === z) || window.customCards.push({
  type: z,
  name: "Daniels Speicherkarte",
  description: "Speicherkarte für Hausakkus (battery) und Wärmespeicher-Gruppen (thermal_group).",
  preview: !1
});
console.info(
  `%c DANIELS-ENERGY-CARDS %c v${at} `,
  "background:#03a9f4;color:#fff;font-weight:700;border-radius:3px 0 0 3px;padding:2px 4px",
  "background:#555;color:#fff;border-radius:0 3px 3px 0;padding:2px 4px"
);
export {
  q as DesStorageCard
};

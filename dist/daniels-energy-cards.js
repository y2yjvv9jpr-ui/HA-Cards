/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const U = globalThis, V = U.ShadowRoot && (U.ShadyCSS === void 0 || U.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, q = Symbol(), G = /* @__PURE__ */ new WeakMap();
let pt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (V && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = G.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && G.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const _t = (i) => new pt(typeof i == "string" ? i : i + "", void 0, q), vt = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, r, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + i[n + 1], i[0]);
  return new pt(e, i, q);
}, yt = (i, t) => {
  if (V) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), r = U.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = e.cssText, i.appendChild(s);
  }
}, X = V ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return _t(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: bt, defineProperty: wt, getOwnPropertyDescriptor: xt, getOwnPropertyNames: At, getOwnPropertySymbols: Et, getPrototypeOf: St } = Object, B = globalThis, Q = B.trustedTypes, kt = Q ? Q.emptyScript : "", Ct = B.reactiveElementPolyfillSupport, S = (i, t) => i, W = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? kt : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, ut = (i, t) => !bt(i, t), tt = { attribute: !0, type: String, converter: W, reflect: !1, useDefault: !1, hasChanged: ut };
Symbol.metadata ??= Symbol("metadata"), B.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let b = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = tt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(t, s, e);
      r !== void 0 && wt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: r, set: n } = xt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: r, set(o) {
      const c = r?.call(this);
      n?.call(this, o), this.requestUpdate(t, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? tt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(S("elementProperties"))) return;
    const t = St(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(S("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(S("properties"))) {
      const e = this.properties, s = [...At(e), ...Et(e)];
      for (const r of s) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, r] of e) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const r = this._$Eu(e, s);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const r of s) e.unshift(X(r));
    } else t !== void 0 && e.push(X(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return yt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    const s = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, s);
    if (r !== void 0 && s.reflect === !0) {
      const n = (s.converter?.toAttribute !== void 0 ? s.converter : W).toAttribute(e, s.type);
      this._$Em = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const n = s.getPropertyOptions(r), o = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : W;
      this._$Em = r;
      const c = o.fromAttribute(e, n.type);
      this[r] = c ?? this._$Ej?.get(r) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, r = !1, n) {
    if (t !== void 0) {
      const o = this.constructor;
      if (r === !1 && (n = this[t]), s ??= o.getPropertyOptions(t), !((s.hasChanged ?? ut)(n, e) || s.useDefault && s.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: r, wrapped: n }, o) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
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
        const { wrapped: o } = n, c = this[r];
        o !== !0 || this._$AL.has(r) || c === void 0 || this.C(r, void 0, n, c);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[S("elementProperties")] = /* @__PURE__ */ new Map(), b[S("finalized")] = /* @__PURE__ */ new Map(), Ct?.({ ReactiveElement: b }), (B.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const K = globalThis, et = (i) => i, R = K.trustedTypes, st = R ? R.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, ft = "$lit$", g = `lit$${Math.random().toFixed(9).slice(2)}$`, $t = "?" + g, Tt = `<${$t}>`, y = document, C = () => y.createComment(""), T = (i) => i === null || typeof i != "object" && typeof i != "function", J = Array.isArray, Pt = (i) => J(i) || typeof i?.[Symbol.iterator] == "function", L = `[ 	
\f\r]`, A = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, rt = /-->/g, it = />/g, m = RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), nt = /'/g, ot = /"/g, gt = /^(?:script|style|textarea|title)$/i, Ht = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), u = Ht(1), w = Symbol.for("lit-noChange"), l = Symbol.for("lit-nothing"), at = /* @__PURE__ */ new WeakMap(), v = y.createTreeWalker(y, 129);
function mt(i, t) {
  if (!J(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return st !== void 0 ? st.createHTML(t) : t;
}
const Nt = (i, t) => {
  const e = i.length - 1, s = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = A;
  for (let c = 0; c < e; c++) {
    const a = i[c];
    let d, p, h = -1, f = 0;
    for (; f < a.length && (o.lastIndex = f, p = o.exec(a), p !== null); ) f = o.lastIndex, o === A ? p[1] === "!--" ? o = rt : p[1] !== void 0 ? o = it : p[2] !== void 0 ? (gt.test(p[2]) && (r = RegExp("</" + p[2], "g")), o = m) : p[3] !== void 0 && (o = m) : o === m ? p[0] === ">" ? (o = r ?? A, h = -1) : p[1] === void 0 ? h = -2 : (h = o.lastIndex - p[2].length, d = p[1], o = p[3] === void 0 ? m : p[3] === '"' ? ot : nt) : o === ot || o === nt ? o = m : o === rt || o === it ? o = A : (o = m, r = void 0);
    const $ = o === m && i[c + 1].startsWith("/>") ? " " : "";
    n += o === A ? a + Tt : h >= 0 ? (s.push(d), a.slice(0, h) + ft + a.slice(h) + g + $) : a + g + (h === -2 ? c : $);
  }
  return [mt(i, n + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class P {
  constructor({ strings: t, _$litType$: e }, s) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const c = t.length - 1, a = this.parts, [d, p] = Nt(t, e);
    if (this.el = P.createElement(d, s), v.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = v.nextNode()) !== null && a.length < c; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(ft)) {
          const f = p[o++], $ = r.getAttribute(h).split(g), N = /([.?@])?(.*)/.exec(f);
          a.push({ type: 1, index: n, name: N[2], strings: $, ctor: N[1] === "." ? Ot : N[1] === "?" ? Ut : N[1] === "@" ? Rt : I }), r.removeAttribute(h);
        } else h.startsWith(g) && (a.push({ type: 6, index: n }), r.removeAttribute(h));
        if (gt.test(r.tagName)) {
          const h = r.textContent.split(g), f = h.length - 1;
          if (f > 0) {
            r.textContent = R ? R.emptyScript : "";
            for (let $ = 0; $ < f; $++) r.append(h[$], C()), v.nextNode(), a.push({ type: 2, index: ++n });
            r.append(h[f], C());
          }
        }
      } else if (r.nodeType === 8) if (r.data === $t) a.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(g, h + 1)) !== -1; ) a.push({ type: 7, index: n }), h += g.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const s = y.createElement("template");
    return s.innerHTML = t, s;
  }
}
function x(i, t, e = i, s) {
  if (t === w) return t;
  let r = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const n = T(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== n && (r?._$AO?.(!1), n === void 0 ? r = void 0 : (r = new n(i), r._$AT(i, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = r : e._$Cl = r), r !== void 0 && (t = x(i, r._$AS(i, t.values), r, s)), t;
}
class Mt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, r = (t?.creationScope ?? y).importNode(e, !0);
    v.currentNode = r;
    let n = v.nextNode(), o = 0, c = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let d;
        a.type === 2 ? d = new H(n, n.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (d = new zt(n, this, t)), this._$AV.push(d), a = s[++c];
      }
      o !== a?.index && (n = v.nextNode(), o++);
    }
    return v.currentNode = y, r;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class H {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, r) {
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = x(this, t, e), T(t) ? t === l || t == null || t === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : t !== this._$AH && t !== w && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Pt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== l && T(this._$AH) ? this._$AA.nextSibling.data = t : this.T(y.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = P.createElement(mt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(e);
    else {
      const n = new Mt(r, this), o = n.u(this.options);
      n.p(e), this.T(o), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = at.get(t.strings);
    return e === void 0 && at.set(t.strings, e = new P(t)), e;
  }
  k(t) {
    J(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, r = 0;
    for (const n of t) r === e.length ? e.push(s = new H(this.O(C()), this.O(C()), this, this.options)) : s = e[r], s._$AI(n), r++;
    r < e.length && (this._$AR(s && s._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = et(t).nextSibling;
      et(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class I {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, r, n) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = l;
  }
  _$AI(t, e = this, s, r) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = x(this, t, e, 0), o = !T(t) || t !== this._$AH && t !== w, o && (this._$AH = t);
    else {
      const c = t;
      let a, d;
      for (t = n[0], a = 0; a < n.length - 1; a++) d = x(this, c[s + a], e, a), d === w && (d = this._$AH[a]), o ||= !T(d) || d !== this._$AH[a], d === l ? t = l : t !== l && (t += (d ?? "") + n[a + 1]), this._$AH[a] = d;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ot extends I {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === l ? void 0 : t;
  }
}
class Ut extends I {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== l);
  }
}
class Rt extends I {
  constructor(t, e, s, r, n) {
    super(t, e, s, r, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = x(this, t, e, 0) ?? l) === w) return;
    const s = this._$AH, r = t === l && s !== l || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== l && (s === l || r);
    r && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class zt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    x(this, t);
  }
}
const Dt = K.litHtmlPolyfillSupport;
Dt?.(P, H), (K.litHtmlVersions ??= []).push("3.3.3");
const Bt = (i, t, e) => {
  const s = e?.renderBefore ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const n = e?.renderBefore ?? null;
    s._$litPart$ = r = new H(t.insertBefore(C(), n), n, void 0, e ?? {});
  }
  return r._$AI(i), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Z = globalThis;
class k extends b {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Bt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return w;
  }
}
k._$litElement$ = !0, k.finalized = !0, Z.litElementHydrateSupport?.({ LitElement: k });
const It = Z.litElementPolyfillSupport;
It?.({ LitElement: k });
(Z.litElementVersions ??= []).push("4.2.2");
const Y = "de-DE";
function E(i) {
  return new Intl.NumberFormat(Y, { maximumFractionDigits: 0 }).format(i);
}
function Lt(i) {
  return new Intl.NumberFormat(Y, {
    maximumFractionDigits: 0,
    signDisplay: "always"
  }).format(i);
}
function M(i, t = 1) {
  return new Intl.NumberFormat(Y, {
    minimumFractionDigits: 0,
    maximumFractionDigits: t
  }).format(i);
}
function lt(i, t, e) {
  return Math.min(e, Math.max(t, i));
}
function _(i, t) {
  if (i == null) return null;
  if (typeof i == "number") return Number.isFinite(i) ? i : null;
  const e = Number(i);
  return Number.isFinite(e) ? e : null;
}
function ht(i, t) {
  if (i == null) return null;
  const e = String(i).trim();
  return e.length > 0 ? e : null;
}
const ct = {
  charging: "Lädt",
  discharging: "Entlädt",
  idle: "Bereit",
  heating: "Heizt",
  off: "Aus"
}, O = 10, dt = 80, j = 5, D = class D extends k {
  constructor() {
    super(), this._threshold = O;
  }
  setConfig(t) {
    if (!t)
      throw new Error("des-storage-card: Konfiguration fehlt");
    if (t.variant !== "battery" && t.variant !== "thermal")
      throw new Error(
        'des-storage-card: "variant" muss "battery" oder "thermal" sein'
      );
    if (!t.name)
      throw new Error('des-storage-card: "name" ist erforderlich');
    if (!(t.status in ct))
      throw new Error(
        'des-storage-card: "status" muss charging | discharging | idle | heating | off sein'
      );
    this._config = t;
    const e = _(t.threshold_pct, this.hass);
    this._threshold = e === null ? O : lt(
      Math.round(e / j) * j,
      O,
      dt
    );
  }
  getCardSize() {
    return 3;
  }
  static getStubConfig() {
    return {
      type: "custom:des-storage-card",
      variant: "battery",
      name: "Hausakku",
      status: "discharging",
      soc: 62,
      capacity_kwh: 10.2,
      energy_kwh: 6.3,
      power_w: -1240,
      temp_c: 23.5,
      threshold_pct: 20,
      time_remaining: "4:36 h bis 50 %",
      time_at: "um 00:12",
      backup: "none"
    };
  }
  render() {
    const t = this._config;
    if (!t) return l;
    const e = t.variant === "battery";
    return u`
      <ha-card>
        <div class="card">
          ${this._renderHeader(t)}
          <div class="subline">${this._renderSubline(t)}</div>
          <div class="main">
            ${e ? this._renderBatteryMain(t) : this._renderThermalMain(t)}
            ${this._renderTiming(t)}
          </div>
          ${this._renderTemperature(t)}
          <div class="controls">
            ${e ? this._renderBatteryControls() : this._renderThermalControls()}
          </div>
        </div>
      </ha-card>
    `;
  }
  // --- header -------------------------------------------------------------
  _renderHeader(t) {
    const e = t.backup ?? "none";
    return u`
      <div class="header">
        <div class="name">${t.name}</div>
        <div class="badges">
          ${e === "none" ? l : this._renderBackupBadge(e)}
          <span class="badge status-${t.status}">
            ${ct[t.status]}
          </span>
        </div>
      </div>
    `;
  }
  _renderBackupBadge(t) {
    return t === "active" ? u`<span class="badge backup-active">NOTSTROM AKTIV</span>` : u`<span class="badge backup-ready">Notstrom bereit</span>`;
  }
  _renderSubline(t) {
    if (t.variant === "thermal")
      return "Wärmespeicher · Überschussheizung";
    const e = _(t.capacity_kwh, this.hass), s = [];
    return e !== null && s.push(`Kapazität ${M(e)} kWh`), s.push(`Schwelle ${E(this._threshold)} %`), s.join(" · ");
  }
  // --- main row -----------------------------------------------------------
  _renderBatteryMain(t) {
    const e = lt(_(t.soc, this.hass) ?? 0, 0, 100), s = _(t.energy_kwh, this.hass);
    return u`
      <div class="primary">
        ${this._renderBatteryIcon(e)}
        <div class="readout">
          <div class="value">${E(e)} %</div>
          ${s === null ? l : u`<div class="value-sub">${M(s)} kWh</div>`}
        </div>
      </div>
    `;
  }
  /** Battery drawn as SVG; fill width follows soc, colour follows the level. */
  _renderBatteryIcon(t) {
    const e = t > 50 ? "var(--success-color, #2e7d32)" : t >= 20 ? "var(--warning-color, #ff9800)" : "var(--error-color, #d32f2f)", r = 42 * t / 100;
    return u`
      <svg
        class="battery"
        viewBox="0 0 56 28"
        width="56"
        height="28"
        role="img"
        aria-label="Ladestand ${E(t)} Prozent"
      >
        <rect
          x="1"
          y="1"
          width="48"
          height="26"
          rx="4"
          fill="none"
          stroke="var(--secondary-text-color)"
          stroke-width="2"
          opacity="0.6"
        />
        <rect
          x="51"
          y="9"
          width="4"
          height="10"
          rx="2"
          fill="var(--secondary-text-color)"
          opacity="0.6"
        />
        <rect
          x="4"
          y="4"
          width=${r}
          height="20"
          rx="2"
          fill=${e}
        />
      </svg>
    `;
  }
  _renderThermalMain(t) {
    const e = _(t.energy_kwh, this.hass);
    return u`
      <div class="primary">
        <ha-icon class="fish" icon="mdi:fish"></ha-icon>
        <div class="readout">
          <div class="value">
            ${e === null ? "–" : M(e)} kWh
          </div>
          <div class="value-sub">heute eingespeichert</div>
        </div>
      </div>
    `;
  }
  /** Right-hand column: times (muted) above the coloured power reading. */
  _renderTiming(t) {
    const e = ht(t.time_remaining, this.hass), s = ht(t.time_at, this.hass), r = _(t.power_w, this.hass), n = r === null || r === 0 ? "power neutral" : r < 0 ? "power negative" : "power positive";
    return u`
      <div class="timing">
        ${e === null ? l : u`<div class="muted">${e}</div>`}
        ${s === null ? l : u`<div class="muted">${s}</div>`}
        ${r === null ? l : u`<div class=${n}>
              ${r === 0 ? E(0) : Lt(r)} W
            </div>`}
      </div>
    `;
  }
  _renderTemperature(t) {
    const e = _(t.temp_c, this.hass);
    return e === null ? l : u`
      <div class="temp">
        <ha-icon icon="mdi:thermometer"></ha-icon>
        <span>Akku ${M(e)} °C</span>
      </div>
    `;
  }
  // --- controls -----------------------------------------------------------
  _renderBatteryControls() {
    return u`
      <button class="action" type="button" @click=${this._onChargeNow}>
        Jetzt laden
      </button>
      <div class="slider-wrap">
        <input
          class="slider"
          type="range"
          min=${O}
          max=${dt}
          step=${j}
          .value=${String(this._threshold)}
          aria-label="Entladeschwelle"
          @input=${this._onThresholdInput}
        />
        <span class="slider-value">${E(this._threshold)} %</span>
      </div>
    `;
  }
  _renderThermalControls() {
    return u`
      <button class="action" type="button" @click=${this._onToggleHeater}>
        Heizer aus/an
      </button>
      <span class="muted control-hint">Schaltet bei Überschuss</span>
    `;
  }
  // Phase 1: no service calls yet - these are deliberate no-ops.
  _onChargeNow() {
  }
  _onToggleHeater() {
  }
  /** Local-only feedback so the slider does not feel broken in phase 1. */
  _onThresholdInput(t) {
    const e = t.target;
    this._threshold = Number(e.value);
  }
};
D.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 },
  _threshold: { state: !0 }
}, D.styles = vt`
    :host {
      display: block;
    }

    ha-card {
      background: var(--card-background-color, var(--ha-card-background, #fff));
      color: var(--primary-text-color);
    }

    .card {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    /* --- header --- */

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .name {
      font-size: 16px;
      font-weight: 500;
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .badges {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }

    .badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      line-height: 1.4;
      white-space: nowrap;
      /* Fallback for browsers without color-mix(); overridden below. */
      background: rgba(127, 127, 127, 0.15);
      color: var(--secondary-text-color);
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

    /* --- sub line --- */

    .subline {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: -4px;
    }

    /* --- main row --- */

    .main {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 12px;
    }

    .primary {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .battery {
      flex-shrink: 0;
    }

    .fish {
      --mdc-icon-size: 40px;
      width: 40px;
      height: 40px;
      color: var(--info-color, #2196f3);
      flex-shrink: 0;
    }

    .readout {
      min-width: 0;
    }

    .value {
      font-size: 30px;
      font-weight: 400;
      line-height: 1.1;
      color: var(--primary-text-color);
      white-space: nowrap;
    }

    .value-sub {
      font-size: 13px;
      color: var(--secondary-text-color);
      margin-top: 2px;
      white-space: nowrap;
    }

    .timing {
      text-align: right;
      flex-shrink: 0;
    }

    .muted {
      font-size: 12px;
      color: var(--secondary-text-color);
      line-height: 1.5;
    }

    .power {
      font-size: 16px;
      font-weight: 500;
      margin-top: 2px;
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

    /* --- temperature row --- */

    .temp {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }

    .temp ha-icon {
      --mdc-icon-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* --- controls --- */

    .controls {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.25));
    }

    .action {
      font-family: inherit;
      font-size: 13px;
      font-weight: 500;
      color: var(--primary-color, #03a9f4);
      background: none;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.35));
      border-radius: 6px;
      padding: 6px 14px;
      cursor: pointer;
      white-space: nowrap;
    }

    .action:hover {
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, transparent);
    }

    .action:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }

    .slider-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      min-width: 0;
    }

    .slider {
      flex: 1;
      min-width: 0;
      accent-color: var(--primary-color, #03a9f4);
      cursor: pointer;
    }

    .slider-value {
      font-size: 13px;
      color: var(--secondary-text-color);
      min-width: 42px;
      text-align: right;
      white-space: nowrap;
    }

    .control-hint {
      margin-left: auto;
    }
  `;
let F = D;
const z = "des-storage-card", jt = "0.1.0";
customElements.get(z) || customElements.define(z, F);
window.customCards = window.customCards ?? [];
window.customCards.some((i) => i.type === z) || window.customCards.push({
  type: z,
  name: "Daniels Speicherkarte",
  description: "Speicherkarte für Hausakkus (battery) und Wärmespeicher (thermal).",
  preview: !1
});
console.info(
  `%c DANIELS-ENERGY-CARDS %c v${jt} `,
  "background:#03a9f4;color:#fff;font-weight:700;border-radius:3px 0 0 3px;padding:2px 4px",
  "background:#555;color:#fff;border-radius:0 3px 3px 0;padding:2px 4px"
);
export {
  F as DesStorageCard
};

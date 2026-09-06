/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ee = globalThis, Se = ee.ShadowRoot && (ee.ShadyCSS === void 0 || ee.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ce = Symbol(), Ie = /* @__PURE__ */ new WeakMap();
let ut = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== Ce) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (Se && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = Ie.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && Ie.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const At = (i) => new ut(typeof i == "string" ? i : i + "", void 0, Ce), E = (i, ...e) => {
  const t = i.length === 1 ? i[0] : e.reduce((r, s, a) => r + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + i[a + 1], i[0]);
  return new ut(t, i, Ce);
}, St = (i, e) => {
  if (Se) i.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const r = document.createElement("style"), s = ee.litNonce;
    s !== void 0 && r.setAttribute("nonce", s), r.textContent = t.cssText, i.appendChild(r);
  }
}, He = Se ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const r of e.cssRules) t += r.cssText;
  return At(t);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ct, defineProperty: Tt, getOwnPropertyDescriptor: Pt, getOwnPropertyNames: Mt, getOwnPropertySymbols: Ot, getPrototypeOf: Lt } = Object, le = globalThis, Ue = le.trustedTypes, Rt = Ue ? Ue.emptyScript : "", zt = le.reactiveElementPolyfillSupport, W = (i, e) => i, ye = { toAttribute(i, e) {
  switch (e) {
    case Boolean:
      i = i ? Rt : null;
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
} }, pt = (i, e) => !Ct(i, e), We = { attribute: !0, type: String, converter: ye, reflect: !1, useDefault: !1, hasChanged: pt };
Symbol.metadata ??= Symbol("metadata"), le.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let z = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = We) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = Symbol(), s = this.getPropertyDescriptor(e, r, t);
      s !== void 0 && Tt(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: s, set: a } = Pt(this.prototype, e) ?? { get() {
      return this[t];
    }, set(n) {
      this[t] = n;
    } };
    return { get: s, set(n) {
      const c = s?.call(this);
      a?.call(this, n), this.requestUpdate(e, c, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? We;
  }
  static _$Ei() {
    if (this.hasOwnProperty(W("elementProperties"))) return;
    const e = Lt(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(W("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(W("properties"))) {
      const t = this.properties, r = [...Mt(t), ...Ot(t)];
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
      for (const s of r) t.unshift(He(s));
    } else e !== void 0 && t.push(He(e));
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
    return St(e, this.constructor.elementStyles), e;
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
      const a = (r.converter?.toAttribute !== void 0 ? r.converter : ye).toAttribute(t, r.type);
      this._$Em = e, a == null ? this.removeAttribute(s) : this.setAttribute(s, a), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const r = this.constructor, s = r._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const a = r.getPropertyOptions(s), n = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : ye;
      this._$Em = s;
      const c = n.fromAttribute(t, a.type);
      this[s] = c ?? this._$Ej?.get(s) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, t, r, s = !1, a) {
    if (e !== void 0) {
      const n = this.constructor;
      if (s === !1 && (a = this[e]), r ??= n.getPropertyOptions(e), !((r.hasChanged ?? pt)(a, t) || r.useDefault && r.reflect && a === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, r)))) return;
      this.C(e, t, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: r, reflect: s, wrapped: a }, n) {
    r && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, n ?? t ?? this[e]), a !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (t = void 0), this._$AL.set(e, t)), s === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [s, a] of this._$Ep) this[s] = a;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [s, a] of r) {
        const { wrapped: n } = a, c = this[s];
        n !== !0 || this._$AL.has(s) || c === void 0 || this.C(s, void 0, a, c);
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
z.elementStyles = [], z.shadowRootOptions = { mode: "open" }, z[W("elementProperties")] = /* @__PURE__ */ new Map(), z[W("finalized")] = /* @__PURE__ */ new Map(), zt?.({ ReactiveElement: z }), (le.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Te = globalThis, Fe = (i) => i, re = Te.trustedTypes, Be = re ? re.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, _t = "$lit$", S = `lit$${Math.random().toFixed(9).slice(2)}$`, gt = "?" + S, Nt = `<${gt}>`, O = document, F = () => O.createComment(""), B = (i) => i === null || typeof i != "object" && typeof i != "function", Pe = Array.isArray, Dt = (i) => Pe(i) || typeof i?.[Symbol.iterator] == "function", _e = `[ 	
\f\r]`, H = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, je = /-->/g, Ge = />/g, T = RegExp(`>|${_e}(?:([^\\s"'>=/]+)(${_e}*=${_e}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ve = /'/g, Ke = /"/g, mt = /^(?:script|style|textarea|title)$/i, ft = (i) => (e, ...t) => ({ _$litType$: i, strings: e, values: t }), o = ft(1), It = ft(2), N = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), qe = /* @__PURE__ */ new WeakMap(), M = O.createTreeWalker(O, 129);
function vt(i, e) {
  if (!Pe(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Be !== void 0 ? Be.createHTML(e) : e;
}
const Ht = (i, e) => {
  const t = i.length - 1, r = [];
  let s, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = H;
  for (let c = 0; c < t; c++) {
    const l = i[c];
    let u, _, h = -1, m = 0;
    for (; m < l.length && (n.lastIndex = m, _ = n.exec(l), _ !== null); ) m = n.lastIndex, n === H ? _[1] === "!--" ? n = je : _[1] !== void 0 ? n = Ge : _[2] !== void 0 ? (mt.test(_[2]) && (s = RegExp("</" + _[2], "g")), n = T) : _[3] !== void 0 && (n = T) : n === T ? _[0] === ">" ? (n = s ?? H, h = -1) : _[1] === void 0 ? h = -2 : (h = n.lastIndex - _[2].length, u = _[1], n = _[3] === void 0 ? T : _[3] === '"' ? Ke : Ve) : n === Ke || n === Ve ? n = T : n === je || n === Ge ? n = H : (n = T, s = void 0);
    const v = n === T && i[c + 1].startsWith("/>") ? " " : "";
    a += n === H ? l + Nt : h >= 0 ? (r.push(u), l.slice(0, h) + _t + l.slice(h) + S + v) : l + S + (h === -2 ? c : v);
  }
  return [vt(i, a + (i[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class j {
  constructor({ strings: e, _$litType$: t }, r) {
    let s;
    this.parts = [];
    let a = 0, n = 0;
    const c = e.length - 1, l = this.parts, [u, _] = Ht(e, t);
    if (this.el = j.createElement(u, r), M.currentNode = this.el.content, t === 2 || t === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (s = M.nextNode()) !== null && l.length < c; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const h of s.getAttributeNames()) if (h.endsWith(_t)) {
          const m = _[n++], v = s.getAttribute(h).split(S), w = /([.?@])?(.*)/.exec(m);
          l.push({ type: 1, index: a, name: w[2], strings: v, ctor: w[1] === "." ? Wt : w[1] === "?" ? Ft : w[1] === "@" ? Bt : ce }), s.removeAttribute(h);
        } else h.startsWith(S) && (l.push({ type: 6, index: a }), s.removeAttribute(h));
        if (mt.test(s.tagName)) {
          const h = s.textContent.split(S), m = h.length - 1;
          if (m > 0) {
            s.textContent = re ? re.emptyScript : "";
            for (let v = 0; v < m; v++) s.append(h[v], F()), M.nextNode(), l.push({ type: 2, index: ++a });
            s.append(h[m], F());
          }
        }
      } else if (s.nodeType === 8) if (s.data === gt) l.push({ type: 2, index: a });
      else {
        let h = -1;
        for (; (h = s.data.indexOf(S, h + 1)) !== -1; ) l.push({ type: 7, index: a }), h += S.length - 1;
      }
      a++;
    }
  }
  static createElement(e, t) {
    const r = O.createElement("template");
    return r.innerHTML = e, r;
  }
}
function D(i, e, t = i, r) {
  if (e === N) return e;
  let s = r !== void 0 ? t._$Co?.[r] : t._$Cl;
  const a = B(e) ? void 0 : e._$litDirective$;
  return s?.constructor !== a && (s?._$AO?.(!1), a === void 0 ? s = void 0 : (s = new a(i), s._$AT(i, t, r)), r !== void 0 ? (t._$Co ??= [])[r] = s : t._$Cl = s), s !== void 0 && (e = D(i, s._$AS(i, e.values), s, r)), e;
}
class Ut {
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
    const { el: { content: t }, parts: r } = this._$AD, s = (e?.creationScope ?? O).importNode(t, !0);
    M.currentNode = s;
    let a = M.nextNode(), n = 0, c = 0, l = r[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let u;
        l.type === 2 ? u = new K(a, a.nextSibling, this, e) : l.type === 1 ? u = new l.ctor(a, l.name, l.strings, this, e) : l.type === 6 && (u = new jt(a, this, e)), this._$AV.push(u), l = r[++c];
      }
      n !== l?.index && (a = M.nextNode(), n++);
    }
    return M.currentNode = O, s;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}
class K {
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
    e = D(this, e, t), B(e) ? e === d || e == null || e === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : e !== this._$AH && e !== N && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Dt(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== d && B(this._$AH) ? this._$AA.nextSibling.data = e : this.T(O.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: r } = e, s = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = j.createElement(vt(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === s) this._$AH.p(t);
    else {
      const a = new Ut(s, this), n = a.u(this.options);
      a.p(t), this.T(n), this._$AH = a;
    }
  }
  _$AC(e) {
    let t = qe.get(e.strings);
    return t === void 0 && qe.set(e.strings, t = new j(e)), t;
  }
  k(e) {
    Pe(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let r, s = 0;
    for (const a of e) s === t.length ? t.push(r = new K(this.O(F()), this.O(F()), this, this.options)) : r = t[s], r._$AI(a), s++;
    s < t.length && (this._$AR(r && r._$AB.nextSibling, s), t.length = s);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const r = Fe(e).nextSibling;
      Fe(e).remove(), e = r;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class ce {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, r, s, a) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = e, this.name = t, this._$AM = s, this.options = a, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = d;
  }
  _$AI(e, t = this, r, s) {
    const a = this.strings;
    let n = !1;
    if (a === void 0) e = D(this, e, t, 0), n = !B(e) || e !== this._$AH && e !== N, n && (this._$AH = e);
    else {
      const c = e;
      let l, u;
      for (e = a[0], l = 0; l < a.length - 1; l++) u = D(this, c[r + l], t, l), u === N && (u = this._$AH[l]), n ||= !B(u) || u !== this._$AH[l], u === d ? e = d : e !== d && (e += (u ?? "") + a[l + 1]), this._$AH[l] = u;
    }
    n && !s && this.j(e);
  }
  j(e) {
    e === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Wt extends ce {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === d ? void 0 : e;
  }
}
class Ft extends ce {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== d);
  }
}
class Bt extends ce {
  constructor(e, t, r, s, a) {
    super(e, t, r, s, a), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = D(this, e, t, 0) ?? d) === N) return;
    const r = this._$AH, s = e === d && r !== d || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, a = e !== d && (r === d || s);
    s && this.element.removeEventListener(this.name, this, r), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class jt {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    D(this, e);
  }
}
const Gt = Te.litHtmlPolyfillSupport;
Gt?.(j, K), (Te.litHtmlVersions ??= []).push("3.3.3");
const Vt = (i, e, t) => {
  const r = t?.renderBefore ?? e;
  let s = r._$litPart$;
  if (s === void 0) {
    const a = t?.renderBefore ?? null;
    r._$litPart$ = s = new K(e.insertBefore(F(), a), a, void 0, t ?? {});
  }
  return s._$AI(i), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Me = globalThis;
class k extends z {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Vt(t, this.renderRoot, this.renderOptions);
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
k._$litElement$ = !0, k.finalized = !0, Me.litElementHydrateSupport?.({ LitElement: k });
const Kt = Me.litElementPolyfillSupport;
Kt?.({ LitElement: k });
(Me.litElementVersions ??= []).push("4.2.2");
const de = "de-DE";
function g(i) {
  return new Intl.NumberFormat(de, { maximumFractionDigits: 0 }).format(i);
}
function qt(i) {
  return new Intl.NumberFormat(de, {
    maximumFractionDigits: 0,
    signDisplay: "always"
  }).format(i);
}
function Z(i) {
  const e = Math.round(i), t = g(Math.abs(e));
  return e > 0 ? `+${t}` : e < 0 ? `−${t}` : t;
}
function Yt(i, e = 1) {
  return new Intl.NumberFormat(de, {
    minimumFractionDigits: 0,
    maximumFractionDigits: e
  }).format(i);
}
function b(i, e = 1) {
  return new Intl.NumberFormat(de, {
    minimumFractionDigits: e,
    maximumFractionDigits: e
  }).format(i);
}
function $(i, e, t) {
  return Math.min(t, Math.max(e, i));
}
const Zt = /* @__PURE__ */ new Set(["unavailable", "unknown", "none", "null", ""]), Xt = /^[a-z][a-z0-9_]*\.[a-z0-9_]+$/;
function L(i) {
  return typeof i == "string" && Xt.test(i);
}
const we = { kind: "unset" }, U = { kind: "unavailable" };
function yt(i, e) {
  const t = e?.states?.[i];
  if (!t || typeof t.state != "string") return null;
  const r = t.state.trim();
  return Zt.has(r.toLowerCase()) ? null : r;
}
function ge(i, e, t) {
  const r = e?.states?.[i]?.attributes?.[t];
  if (typeof r == "number") return Number.isFinite(r) ? r : null;
  if (typeof r == "string") {
    const s = Number.parseFloat(r);
    return Number.isFinite(s) ? s : null;
  }
  return null;
}
function Oe(i, e) {
  const t = e?.states?.[i]?.attributes?.unit_of_measurement;
  if (typeof t != "string") return null;
  const r = t.trim().toLowerCase();
  return r.length > 0 ? r : null;
}
function f(i, e) {
  if (i == null || typeof i == "boolean") return we;
  if (typeof i == "number")
    return Number.isFinite(i) ? { kind: "value", value: i } : U;
  if (L(i)) {
    const r = yt(i, e);
    if (r === null) return U;
    const s = Number.parseFloat(r);
    return Number.isFinite(s) ? { kind: "value", value: s } : U;
  }
  const t = Number.parseFloat(i);
  return Number.isFinite(t) ? { kind: "value", value: t } : U;
}
function x(i, e) {
  if (i == null) return we;
  if (typeof i == "boolean") return { kind: "value", value: i ? "on" : "off" };
  if (typeof i == "number") return { kind: "value", value: String(i) };
  if (L(i)) {
    const r = yt(i, e);
    return r === null ? U : { kind: "value", value: r };
  }
  const t = i.trim();
  return t.length > 0 ? { kind: "value", value: t } : we;
}
const wt = /* @__PURE__ */ new Set(["number", "input_number"]), q = /* @__PURE__ */ new Set(["switch", "input_boolean"]), he = /* @__PURE__ */ new Set(["select", "input_select"]), Jt = /* @__PURE__ */ new Set(["on", "true", "1", "yes", "an", "ein"]);
function I(i) {
  const e = i.indexOf(".");
  return e === -1 ? "" : i.slice(0, e);
}
function G(i, e) {
  return typeof i == "string" && L(i) && e.has(I(i));
}
function X(i) {
  return G(i, wt);
}
function Qt(i) {
  return G(i, q);
}
function bt(i) {
  if (!i || typeof i != "object") return !1;
  const e = i.entity;
  return G(e, he) || G(e, q);
}
function Le(i, e, t, r) {
  if (typeof i?.callService != "function")
    return Promise.reject(new Error("des-storage-card: hass.callService fehlt"));
  try {
    return Promise.resolve(i.callService(e, t, r));
  } catch (s) {
    return Promise.reject(s);
  }
}
function Ye(i, e, t) {
  const r = I(e);
  return wt.has(r) ? Le(i, r, "set_value", { entity_id: e, value: t }) : Promise.reject(
    new Error(`des-storage-card: ${e} ist keine number-Entität`)
  );
}
function xt(i, e, t) {
  const r = I(e);
  return q.has(r) ? Le(i, r, t ? "turn_on" : "turn_off", { entity_id: e }) : Promise.reject(
    new Error(`des-storage-card: ${e} ist kein Schalter`)
  );
}
function er(i, e, t) {
  const r = I(e);
  return he.has(r) ? Le(i, r, "select_option", { entity_id: e, option: t }) : Promise.reject(
    new Error(`des-storage-card: ${e} ist keine select-Entität`)
  );
}
function $t(i, e) {
  const t = e === "charge" ? i.charge_state : i.auto_state;
  return t !== void 0 ? t : G(i.entity, q) ? e === "charge" ? "on" : "off" : void 0;
}
function Ze(i, e) {
  const t = $t(i, "charge");
  return t === void 0 ? !1 : t.trim().toLowerCase() === e.trim().toLowerCase();
}
function tr(i) {
  if (i === null || typeof i != "object")
    return '"charge_mode_control" muss ein Objekt mit "entity" sein';
  const { entity: e, charge_state: t, auto_state: r } = i;
  if (typeof e != "string" || e.length === 0)
    return '"charge_mode_control" braucht "entity"';
  if (!bt(i))
    return `"charge_mode_control.entity" muss select, input_select, switch oder input_boolean sein (ist: ${e})`;
  if (he.has(I(e))) {
    const s = [
      t === void 0 ? "charge_state" : null,
      r === void 0 ? "auto_state" : null
    ].filter((a) => a !== null);
    if (s.length > 0)
      return `"charge_mode_control" braucht ${s.join(" und ")} für ${e}`;
  }
  return null;
}
function rr(i, e, t) {
  const r = e.entity, s = I(r), a = $t(e, t);
  return he.has(s) ? a === void 0 ? Promise.reject(
    new Error(
      `des-storage-card: charge_mode_control braucht ${t === "charge" ? "charge_state" : "auto_state"} für ${r}`
    )
  ) : er(i, r, a) : q.has(s) ? xt(i, r, Jt.has((a ?? "").toLowerCase())) : Promise.reject(
    new Error(`des-storage-card: ${r} wird als Lademodus nicht unterstützt`)
  );
}
const ue = E`
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

  .seg button:disabled {
    cursor: not-allowed;
  }
`;
function V(i, e, t, r, s = !1) {
  return o`
    <div
      class="seg ${s || e === null ? "unknown" : ""}"
      role="group"
      aria-label=${r}
      title=${s ? "Nicht verfügbar" : e === null ? "Zustand nicht lesbar" : d}
    >
      ${i.map(
    ({ value: n, label: c }) => o`
          <button
            type="button"
            class=${e === n ? "active" : ""}
            aria-pressed=${e === n ? "true" : "false"}
            ?disabled=${s}
            @click=${(l) => {
      l.stopPropagation(), t(n);
    }}
          >
            ${c}
          </button>
        `
  )}
    </div>
  `;
}
const Re = E`
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

  .chevron-row {
    display: flex;
    justify-content: center;
    margin-top: 8px;
  }

  .chevron-row.clickable {
    cursor: pointer;
    outline: none;
  }

  /* A mouse click must not leave the ring standing; keyboard focus keeps it. */
  .chevron-row.clickable:focus {
    outline: none;
  }

  .chevron-row.clickable:focus-visible {
    outline: 2px solid var(--primary-color, #03a9f4);
    outline-offset: 2px;
    border-radius: 6px;
  }
`, ze = E`
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

  /* While open the card gives up its bottom rounding, so the seam to the
     panel is a straight line instead of two curves meeting. */
  :host([expanded]) ha-card {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .overlay {
    position: absolute;
    /* An absolutely positioned child is laid out against ha-card's *padding*
       box, so left/right:0 would inset the panel by the card's border width
       on each side - that was the visible step at both edges. Pulling it out
       by exactly that width lines the two border boxes up. */
    left: calc(-1 * var(--ha-card-border-width, 1px));
    right: calc(-1 * var(--ha-card-border-width, 1px));
    /* Starts at the top of the card's bottom border and paints over it, so no
       hairline shows at the seam. */
    top: 100%;
    box-sizing: border-box;
    padding: 12px 16px;
    /* Same order ha-card itself uses, otherwise a theme that sets only
       --ha-card-background gives the two boxes different colours. */
    background: var(--ha-card-background, var(--card-background-color, #fff));
    border: var(--ha-card-border-width, 1px) solid
      var(--ha-card-border-color, var(--divider-color, #e0e0e0));
    /* It joins the card above, so no top edge; rounded only at the bottom. */
    border-top: none;
    border-radius: 0 0 var(--ha-card-border-radius, 12px)
      var(--ha-card-border-radius, 12px);
    /* Whatever shadow the card has - "none" in stock HA. A shadow of its own
       would make the panel read as a second, detached box. */
    box-shadow: var(--ha-card-box-shadow, none);
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
class Ne {
  constructor(e, t) {
    this._host = e, this._onClose = t, this._active = !1, this._onDocClick = (r) => {
      r.composedPath().includes(this._host) || this._onClose();
    }, this._onKeydown = (r) => {
      r.key === "Escape" && this._onClose();
    };
  }
  activate() {
    this._active || (this._active = !0, document.addEventListener("click", this._onDocClick), document.addEventListener("keydown", this._onKeydown));
  }
  deactivate() {
    this._active && (this._active = !1, document.removeEventListener("click", this._onDocClick), document.removeEventListener("keydown", this._onKeydown));
  }
}
const kt = {
  charging: "Lädt",
  discharging: "Entlädt",
  idle: "Bereit",
  heating: "Heizt",
  off: "Aus"
}, me = { min: 10, max: 80, step: 5 }, fe = { min: 50, max: 100, step: 5 }, Xe = 5, sr = 12, ir = 2, ar = 1, nr = 20, or = 1, lr = 300, cr = 6e4, Je = 5, Qe = 10, et = 48, dr = 500, hr = 8e3, ur = /* @__PURE__ */ new Set([
  "not charging",
  "not discharging",
  "unknown",
  "unavailable",
  "none",
  "-",
  "--"
]), pr = [
  { value: "charge", label: "Laden" },
  { value: "auto", label: "Auto" }
], _r = [
  { value: "on", label: "An" },
  { value: "auto", label: "Auto" },
  { value: "off", label: "Aus" }
], gr = {
  1: "on",
  2: "auto",
  3: "off"
}, mr = {
  on: 1,
  auto: 2,
  off: 3
};
function fr(i) {
  const e = i.trim().toLowerCase();
  return e === "standby" ? "idle" : e in kt ? e : null;
}
function vr(i) {
  const e = i.trim().toLowerCase();
  return e === "on" || e === "auto" || e === "off" ? e : "auto";
}
function ve(i, e) {
  const { min: t, max: r, step: s } = e;
  if (!(s > 0)) return $(i, t, r);
  const a = Math.round((i - t) / s), n = Number((t + a * s).toFixed(6));
  return $(n, t, r);
}
function yr(i) {
  if (!Number.isFinite(i) || Number.isInteger(i)) return 0;
  const e = String(i), t = e.indexOf(".");
  return t === -1 ? 0 : Math.min(3, e.length - t - 1);
}
function tt(i, e) {
  const t = yr(e);
  return t === 0 ? g(i) : b(i, t);
}
function wr(i) {
  if (!Number.isFinite(i) || i <= 0) return null;
  if (i > et) return `> ${et} h`;
  const e = Math.round(i * 60 / Je) * Je;
  return e < Qe ? `< ${Qe} min` : `${Math.floor(e / 60)}h ${e % 60}m`;
}
function br(i) {
  return i < 4 || i > 50 ? "badge-alert" : i < 8 || i > 40 ? "badge-warn" : "badge-neutral";
}
const se = class se extends k {
  constructor() {
    super(), this._writeTimers = /* @__PURE__ */ new Map(), this._settleTimers = /* @__PURE__ */ new Map(), this._closer = new Ne(this, () => this._collapse()), this._powerAverage = null, this._averageDirection = 0, this._averageStartedAt = 0, this._averageUpdatedAt = 0, this._expanded = !1, this._thresholdLocal = null, this._targetLocal = null, this._chargeModeLocal = null, this._itemModesLocal = [];
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
      const t = tr(e.charge_mode_control);
      if (t !== null) throw new Error(`des-storage-card: ${t}`);
    }
    if (e.variant === "thermal_group") {
      const t = e.items;
      if (!Array.isArray(t) || t.length === 0)
        throw new Error(
          'des-storage-card: "items" braucht mindestens einen Eintrag'
        );
      if (t.length > Xe)
        throw new Error(
          `des-storage-card: "items" erlaubt höchstens ${Xe} Einträge`
        );
      if (t.some((r) => !r || !r.name))
        throw new Error('des-storage-card: jeder Eintrag in "items" braucht "name"');
      for (const r of t)
        if (r.mode_entity !== void 0 && !X(r.mode_entity))
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
    this._settleTimers.clear(), this._closer.deactivate();
  }
  /** Keeps the `expanded` attribute in sync for the stacking rule. */
  updated() {
    this.toggleAttribute("expanded", this._expanded);
  }
  /** Drops an optimistic value that the entity never confirmed. */
  _holdOptimistic(e, t) {
    this._clearSettle(e), this._settleTimers.set(
      e,
      window.setTimeout(() => {
        this._settleTimers.delete(e), t();
      }, hr)
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
      this._updatePowerAverage(e), this._thresholdLocal !== null && this._entityMatches(
        e.threshold_pct,
        this._thresholdLocal,
        this._rangeFor(e.threshold_pct, me)
      ) && (this._thresholdLocal = null, this._clearSettle("threshold")), this._targetLocal !== null && this._entityMatches(
        e.charge_target_pct,
        this._targetLocal,
        this._rangeFor(e.charge_target_pct, fe)
      ) && (this._targetLocal = null, this._clearSettle("target"));
      const a = e.charge_mode_control;
      if (this._chargeModeLocal !== null && a?.entity) {
        const n = x(a.entity, this.hass);
        n.kind === "value" && (Ze(a, n.value) ? "charge" : "auto") === this._chargeModeLocal && (this._chargeModeLocal = null, this._clearSettle("chargeMode"));
      }
      return;
    }
    const t = e.items ?? [];
    let r = !1;
    const s = [...this._itemModesLocal];
    t.forEach((a, n) => {
      const c = s[n];
      if (!c) return;
      const l = this._itemModeFromEntity(a);
      l === null || l !== c || (s[n] = null, r = !0, this._clearSettle(`item:${n}`));
    }), r && (this._itemModesLocal = s);
  }
  /** True when the slot is entity-bound and already carries exactly `local`. */
  _entityMatches(e, t, r) {
    if (typeof e != "string" || !L(e)) return !1;
    const s = f(e, this.hass);
    return s.kind === "value" && ve(s.value, r) === t;
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
    if (!X(e)) return t;
    const r = e, s = ge(r, this.hass, "min") ?? t.min, a = ge(r, this.hass, "max") ?? t.max, n = ge(r, this.hass, "step") ?? t.step;
    return !(s < a) || !(n > 0) ? t : { min: s, max: a, step: n };
  }
  getCardSize() {
    return this._config?.variant === "thermal_group" ? 1 + (this._config.items?.length ?? 0) : this._expanded ? 3 : 2;
  }
  /**
   * HA sections view: a third of the section wide, fixed height. A battery is
   * short; a thermal group grows with its item count (3 items → 4 rows).
   */
  getGridOptions() {
    const e = this._config?.variant === "thermal_group" ? ar + (this._config.items?.length ?? 0) : ir;
    return { columns: sr, rows: e, min_rows: e };
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
    if (!e) return d;
    const t = e.variant === "battery" && e.controls !== !1;
    return o`
      <ha-card>
        <div class="card">
          ${e.variant === "battery" ? this._renderBattery(e) : this._renderThermalGroup(e)}
        </div>
        ${t && this._expanded ? o`<div class="overlay">${this._renderBatteryControls(e)}</div>` : d}
      </ha-card>
    `;
  }
  // =========================================================================
  // resolution / derivation
  // =========================================================================
  /**
   * `power_w` if given, otherwise voltage x current.
   *
   * `power_w` deliberately wins: a summed power entity is both fresher and
   * finer-grained than a BMS current in half-amp steps. The sign flip and the
   * share factor apply to whichever source was used.
   */
  _power(e) {
    let t = f(e.power_w, this.hass);
    if (t.kind === "unset" && e.voltage_entity && e.current_entity) {
      const a = f(e.voltage_entity, this.hass), n = f(e.current_entity, this.hass);
      t = a.kind === "value" && n.kind === "value" ? { kind: "value", value: a.value * n.value } : { kind: "unavailable" };
    }
    if (t.kind !== "value") return t;
    let r = e.invert_power ? -t.value : t.value;
    const s = f(e.power_share, this.hass);
    return s.kind === "unavailable" ? { kind: "unavailable" } : (r *= s.kind === "value" ? s.value : or, { kind: "value", value: r });
  }
  /** Absolute watts below which the battery reads as idle. */
  _idleThreshold(e) {
    const t = f(e.idle_threshold_w, this.hass);
    return t.kind === "value" && t.value >= 0 ? t.value : nr;
  }
  /** Configured status, else derived from the power sign. */
  _status(e, t) {
    const r = x(e.status, this.hass);
    if (r.kind === "value") {
      const s = fr(r.value);
      if (s !== null) return s;
    }
    if (t.kind === "value") {
      const s = this._idleThreshold(e);
      if (t.value <= -s) return "discharging";
      if (t.value >= s) return "charging";
    }
    return "idle";
  }
  /** `energy_kwh` if given, otherwise soc x capacity / 100. */
  _energy(e, t, r) {
    const s = f(e.energy_kwh, this.hass);
    return s.kind !== "unset" ? s : t.kind === "value" && r.kind === "value" ? { kind: "value", value: t.value * r.value / 100 } : t.kind === "unavailable" || r.kind === "unavailable" ? { kind: "unavailable" } : { kind: "unset" };
  }
  /**
   * Feeds the display power into the exponential mean.
   *
   * Idle samples are skipped rather than averaged in: a battery resting at a
   * few watts would drag the mean towards zero and inflate the estimate. A
   * change of direction starts a fresh mean, because the old one describes
   * the opposite process.
   */
  _updatePowerAverage(e) {
    const t = this._power(e);
    if (t.kind !== "value") return;
    const r = this._idleThreshold(e), s = t.value >= r ? 1 : t.value <= -r ? -1 : 0;
    if (s === 0) return;
    const a = Date.now();
    if (s !== this._averageDirection || this._powerAverage === null) {
      this._averageDirection = s, this._powerAverage = t.value, this._averageStartedAt = a, this._averageUpdatedAt = a;
      return;
    }
    const n = Math.max(0, (a - this._averageUpdatedAt) / 1e3);
    this._averageUpdatedAt = a;
    const c = 1 - Math.exp(-n / lr);
    this._powerAverage += c * (t.value - this._powerAverage);
  }
  /**
   * Remaining time.
   *
   * A configured entity wins and is shown as-is - the device knows better than
   * any estimate. Only when nothing is configured for the current direction
   * does the card work it out from state of charge, capacity and the smoothed
   * power.
   */
  _timeRemaining(e, t) {
    if (t.kind !== "value" || Math.abs(t.value) < this._idleThreshold(e))
      return null;
    const r = t.value > 0;
    let s = e.time_remaining;
    if (s === void 0 && (s = r ? e.time_remaining_charging : e.time_remaining_discharging), s === void 0) return this._estimateTimeRemaining(e, r);
    const a = x(s, this.hass);
    return a.kind !== "value" || ur.has(a.value.trim().toLowerCase()) ? null : a.value;
  }
  /**
   * Discharging: how long until the minimum state of charge.
   * Charging:    how long until the charge target.
   *
   * Uses the smoothed power, and stays silent until that mean has enough
   * history to mean anything.
   */
  _estimateTimeRemaining(e, t) {
    if (this._powerAverage === null || Date.now() - this._averageStartedAt < cr) return null;
    const r = Math.abs(this._powerAverage);
    if (r < this._idleThreshold(e)) return null;
    const s = f(e.soc, this.hass), a = f(e.capacity_kwh, this.hass);
    if (s.kind !== "value" || a.kind !== "value") return null;
    const n = t ? this._chargeTarget(e) : this._threshold(e);
    if (n === null) return null;
    const c = t ? n - s.value : s.value - n;
    return c <= 0 ? null : wr(c / 100 * a.value / (r / 1e3));
  }
  _backup(e) {
    const t = e.backup;
    if (!t || t === "none") return "none";
    if (typeof t == "string")
      return t === "active" || t === "ready" ? t : "none";
    const r = x(t.entity, this.hass);
    return r.kind !== "value" ? "none" : (t.active_states ?? []).some(
      (a) => a.trim().toLowerCase() === r.value.toLowerCase()
    ) ? "active" : "ready";
  }
  _threshold(e) {
    if (this._thresholdLocal !== null) return this._thresholdLocal;
    const t = f(e.threshold_pct, this.hass);
    return t.kind === "value" ? ve(t.value, this._rangeFor(e.threshold_pct, me)) : null;
  }
  _chargeTarget(e) {
    if (this._targetLocal !== null) return this._targetLocal;
    const t = f(e.charge_target_pct, this.hass);
    return t.kind === "value" ? ve(t.value, this._rangeFor(e.charge_target_pct, fe)) : null;
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
      return s.kind !== "value" ? null : Ze(t, s.value) ? "charge" : "auto";
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
    return s.kind === "value" ? vr(s.value) : this._itemModeFromEntity(e) ?? "auto";
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
      return gr[r] ?? null;
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
    const t = f(e.soc, this.hass), r = f(e.capacity_kwh, this.hass), s = this._power(e), a = this._energy(e, t, r), n = this._status(e, s), c = this._backup(e), l = this._timeRemaining(e, s), u = x(e.time_at, this.hass), _ = [l, u.kind === "value" ? u.value : null].filter(
      (m) => m !== null
    ), h = e.controls !== !1;
    return o`
      <div class="header">
        <div class="head-left">
          <span class="name">${e.name}</span>
        </div>
        <div class="badges">
          ${this._renderCapacityBadge(r)}
          ${this._renderTemperatureBadge(e)}
          ${c === "none" ? d : this._renderBackupBadge(c)}
          ${this._renderBadge(kt[n], `status-${n}`)}
        </div>
      </div>

      <div class="main">
        ${this._renderBatteryIcon(t)}
        <div class="readout">
          <span class="soc">
            ${t.kind === "value" ? `${g(t.value)} %` : this._dash()}
          </span>
          ${a.kind === "unset" ? d : o`<span class="energy">
                ${a.kind === "value" ? `${b(a.value)} kWh` : this._dash()}
              </span>`}
        </div>
        <div class="timing">
          ${s.kind === "unset" ? d : o`<div class=${this._powerClass(s, this._idleThreshold(e))}>
                ${s.kind === "value" ? this._formatPower(s.value) : this._dash()}
              </div>`}
          ${_.length === 0 ? d : o`<div class="muted">${_.join(" · ")}</div>`}
        </div>
      </div>

      ${h ? o`<div
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
  /**
   * Two labelled slider rows on one grid, so labels, tracks and values line
   * up. The charge-mode control sits to their right, centred over both rows.
   */
  _renderBatteryControls(e) {
    const t = this._chargeMode(e), r = this._chargeTarget(e), s = this._threshold(e), a = this._rangeFor(e.charge_target_pct, fe), n = this._rangeFor(e.threshold_pct, me);
    return o`
      <div class="controls">
        <div class="ctl-rows">
          <span class="ctl-label">Ladegrenze</span>
          <input
            class="slider"
            type="range"
            min=${a.min}
            max=${a.max}
            step=${a.step}
            .value=${String(r ?? a.min)}
            aria-label="Ladegrenze"
            @input=${this._onTargetInput}
            @change=${this._onTargetChange}
          />
          <span class="ctl-value">
            ${r === null ? this._dash() : `${tt(r, a.step)} %`}
          </span>

          <span class="ctl-label">min. SoC</span>
          <input
            class="slider"
            type="range"
            min=${n.min}
            max=${n.max}
            step=${n.step}
            .value=${String(s ?? n.min)}
            aria-label="Minimaler Ladestand"
            @input=${this._onThresholdInput}
            @change=${this._onThresholdChange}
          />
          <span class="ctl-value">
            ${s === null ? this._dash() : `${tt(s, n.step)} %`}
          </span>
        </div>
        ${V(
      pr,
      t,
      (c) => this._setChargeMode(c),
      "Lademodus"
    )}
      </div>
    `;
  }
  /** Capacity as a neutral pill; omitted when not configured. */
  _renderCapacityBadge(e) {
    return e.kind === "unset" ? d : this._renderBadge(
      e.kind === "value" ? `${b(e.value)} kWh` : o`${this._dash()} kWh`,
      "badge-neutral"
    );
  }
  /** Temperature as a pill, colour-coded on the same thresholds as before. */
  _renderTemperatureBadge(e) {
    const t = f(e.temp_c, this.hass);
    return t.kind === "unset" ? d : t.kind === "unavailable" ? this._renderBadge(o`${this._dash()} °C`, "badge-neutral") : this._renderBadge(
      `${b(t.value)} °C`,
      br(t.value)
    );
  }
  /** Upright battery; the fill grows from the bottom. */
  _renderBatteryIcon(e) {
    const t = e.kind === "value" ? $(e.value, 0, 100) : 0, r = e.kind !== "value" ? "transparent" : t > 50 ? "var(--success-color, #2e7d32)" : t >= 20 ? "var(--warning-color, #ff9800)" : "var(--error-color, #d32f2f)", s = 6, a = 26, n = a * t / 100, c = s + (a - n);
    return o`
      <svg
        class="battery"
        viewBox="0 0 22 36"
        width="22"
        height="36"
        role="img"
        aria-label=${e.kind === "value" ? `Ladestand ${g(t)} Prozent` : "Ladestand unbekannt"}
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
          y=${c}
          width="14"
          height=${n}
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
    const t = e.items ?? [], r = t.map((l) => f(l.power_w, this.hass)), s = t.map((l) => f(l.energy_kwh, this.hass)), a = this._sum(s), n = this._sum(r), c = r.filter(
      (l) => l.kind === "value" && l.value > 0
    ).length;
    return o`
      <div class="header">
        <div class="head-left">
          <span class="name">${e.name}</span>
        </div>
        <div class="badges">
          <!-- Heating charges the heat store, so it reads as "charging". -->
          ${this._renderBadge(
      c > 0 ? `${g(c)} heizen` : "Aus",
      c > 0 ? "status-charging" : "status-off"
    )}
        </div>
      </div>

      <div class="main">
        <ha-icon class="fish" icon="mdi:fish"></ha-icon>
        <div class="readout stacked">
          <span class="soc">
            ${a === null ? this._dash() : `${b(a)} kWh`}
          </span>
          <span class="energy">heute eingespeichert</span>
        </div>
        <div class="timing">
          <div
            class=${n !== null && n > 0 ? "power positive" : "power neutral"}
          >
            ${n === null ? this._dash() : this._formatPower(n)}
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
  /**
   * Status dot colour: only the `switch_entity` state counts (`on` → green),
   * never `power_w` or `mode_entity`. Missing/unavailable reads as off (grey).
   */
  _switchOn(e) {
    const t = x(e, this.hass);
    return t.kind === "value" && t.value.trim().toLowerCase() === "on";
  }
  _renderItem(e, t, r, s) {
    const a = r.kind === "value" && r.value > 0;
    return o`
      <div class="item">
        <div class="item-head">
          ${e.switch_entity ? o`<span
                class="dot ${this._switchOn(e.switch_entity) ? "dot-on" : ""}"
              ></span>` : d}
          <span class="item-name">${e.name}</span>
        </div>
        <span class="item-energy">
          ${s.kind === "value" ? `${b(s.value)} kWh` : s.kind === "unavailable" ? this._dash() : ""}
        </span>
        <span class=${a ? "item-power positive" : "item-power"}>
          ${r.kind === "value" ? this._formatPower(r.value) : r.kind === "unavailable" ? this._dash() : ""}
        </span>
        ${V(
      _r,
      this._itemMode(e, t),
      (n) => this._setItemMode(t, n),
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
    return o`<span class="unavail">–</span>`;
  }
  /**
   * The label sits in its own element so it can be nudged down optically.
   * Metric centring alone reads as too high - see `.badge-label` in the styles.
   */
  _renderBadge(e, t) {
    return o`<span class="badge ${t}">
      <span class="badge-label">${e}</span>
    </span>`;
  }
  _renderBackupBadge(e) {
    return e === "active" ? this._renderBadge("NOTSTROM AKTIV", "backup-active") : this._renderBadge("Notstrom bereit", "backup-ready");
  }
  /**
   * Battery only - the thermal group colours its own row.
   *
   * Inside the dead band the reading is muted rather than coloured: a few
   * watts of standby current are not a direction worth signalling.
   */
  _powerClass(e, t) {
    return e.kind !== "value" || Math.abs(e.value) < t ? "power neutral" : e.value < 0 ? "power negative" : "power positive";
  }
  _formatPower(e) {
    const t = Math.round(e);
    return `${t === 0 ? g(0) : qt(t)} W`;
  }
  // --- interaction ---------------------------------------------------------
  //
  // Every handler updates the local state first so the UI reacts immediately,
  // then writes to the bound entity. A rejected write drops the local value,
  // which puts the control back on whatever the entity really says.
  _toggleExpanded() {
    this._expanded = !this._expanded, this._expanded ? this._closer.activate() : this._closer.deactivate();
  }
  _collapse() {
    this._expanded && (this._expanded = !1, this._closer.deactivate());
  }
  _onKeydown(e) {
    (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this._toggleExpanded());
  }
  _setChargeMode(e) {
    this._chargeModeLocal = e;
    const t = this._config?.charge_mode_control;
    !t?.entity || !bt(t) || (this._holdOptimistic("chargeMode", () => {
      this._chargeModeLocal = null;
    }), this._write(rr(this.hass, t, e), () => {
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
    if (!X(t)) return;
    const s = t, a = this._writeTimers.get(e);
    a !== void 0 && window.clearTimeout(a), this._writeTimers.set(
      e,
      window.setTimeout(() => {
        this._writeTimers.delete(e), this._holdOptimistic(e, () => {
          e === "threshold" ? this._thresholdLocal = null : this._targetLocal = null;
        }), this._write(Ye(this.hass, s, r), () => {
          this._clearSettle(e), e === "threshold" ? this._thresholdLocal = null : this._targetLocal = null;
        });
      }, dr)
    );
  }
  _setItemMode(e, t) {
    const r = [...this._itemModesLocal];
    r[e] = t, this._itemModesLocal = r;
    const s = this._config?.items?.[e], a = () => {
      const c = [...this._itemModesLocal];
      c[e] = null, this._itemModesLocal = c;
    };
    if (s?.mode_entity) {
      if (!X(s.mode_entity)) return;
      this._holdOptimistic(`item:${e}`, a), this._write(
        Ye(this.hass, s.mode_entity, mr[t]),
        () => {
          this._clearSettle(`item:${e}`), a();
        }
      );
      return;
    }
    const n = s?.switch_entity;
    t === "auto" || !Qt(n) || (this._holdOptimistic(`item:${e}`, a), this._write(xt(this.hass, n, t === "on"), () => {
      this._clearSettle(`item:${e}`), a();
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
se.properties = {
  // Assigning `hass` is a reactive property write, so Home Assistant's
  // state updates re-render the card without a custom setter.
  hass: { attribute: !1 },
  _config: { state: !0 },
  _thresholdLocal: { state: !0 },
  _targetLocal: { state: !0 },
  _chargeModeLocal: { state: !0 },
  _expanded: { state: !0 },
  _itemModesLocal: { state: !0 }
}, se.styles = [
  ue,
  Re,
  ze,
  E`
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
      background: var(--ha-card-background, var(--card-background-color, #fff));
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
      /* The pills carry values and must stay whole, so on a narrow card the
         name is what gives way. */
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
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
      /* Never wrap and never shrink - the name truncates instead. */
      flex-wrap: nowrap;
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
    .status-heating,
    .badge-warn {
      background: rgba(255, 152, 0, 0.16);
      background: color-mix(
        in srgb,
        var(--warning-color, #ff9800) 16%,
        transparent
      );
      color: var(--warning-color, #ff9800);
    }

    .status-idle,
    .status-off,
    .badge-neutral {
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

    .badge-alert {
      background: rgba(211, 47, 47, 0.16);
      background: color-mix(in srgb, var(--error-color, #d32f2f) 16%, transparent);
      color: var(--error-color, #d32f2f);
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

    /* --- battery controls (collapsed by default) --- */

    .controls {
      display: flex;
      align-items: center;
      gap: 14px;
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

    /* Status dot + name share the first grid cell; the dot's fixed width keeps
       the name aligned whether the switch is on, off or unreadable. */
    .item-head {
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }

    .dot {
      flex: 0 0 auto;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--secondary-text-color);
      opacity: 0.5;
      /* Optical correction, not a geometric one: align-items:center already
         puts the dot on the text's ink centre, but a small circle reads as
         sitting low next to lining figures. A transform is used so the row
         height and the flex layout stay untouched. */
      transform: translateY(-1px);
    }

    .dot.dot-on {
      background: var(--success-color, #2e7d32);
      opacity: 1;
    }

    .item-name {
      font-size: 13px;
      color: var(--primary-text-color);
      min-width: 0;
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
let be = se;
const De = E`
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
`, xr = /* @__PURE__ */ new Set([
  "normal",
  "alarm",
  "night"
]), $r = 12.5, kr = 6.5, Er = 6, Ar = 0.5, Sr = 500, Cr = 40, rt = 4, Tr = 12, Pr = ["L1", "L2", "L3"], Mr = {
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
function P(i) {
  return Array.isArray(i) && i.some(p);
}
function J(i) {
  const e = i.filter((t) => t !== null);
  return e.length > 0 ? e.reduce((t, r) => t + r, 0) : null;
}
const Or = 2, Lr = 6e4, Rr = 2500, C = (i) => String(i).padStart(2, "0");
function zr(i) {
  const e = i.trim();
  if (e.length === 0) return null;
  const t = e.includes("T") ? e : e.replace(" ", "T"), r = new Date(t);
  return Number.isNaN(r.getTime()) ? null : r;
}
function Nr(i) {
  return `${C(i.getDate())}.${C(i.getMonth() + 1)}.${i.getFullYear()} ${C(i.getHours())}:${C(i.getMinutes())}`;
}
function Dr() {
  const i = /* @__PURE__ */ new Date();
  return `${i.getFullYear()}-${C(i.getMonth() + 1)}-${C(i.getDate())} ${C(i.getHours())}:${C(i.getMinutes())}:00`;
}
const ie = class ie extends k {
  constructor() {
    super(), this._closer = new Ne(this, () => this._collapse()), this._expanded = !1, this._clockTick = 0, this._timeSetDone = !1;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._closer.deactivate(), this._stopClockTimer(), this._feedbackTimer !== void 0 && (window.clearTimeout(this._feedbackTimer), this._feedbackTimer = void 0);
  }
  /** Keeps the `expanded` attribute in sync for the stacking rule. */
  updated() {
    this.toggleAttribute("expanded", this._expanded), this._syncClockTimer();
  }
  // =========================================================================
  // inverter clock
  // =========================================================================
  /** The timer only runs while a clock entity is configured. */
  _syncClockTimer() {
    const e = p(this._config?.time_entity);
    e && this._clockTimer === void 0 ? this._clockTimer = window.setInterval(() => {
      this._clockTick += 1;
    }, Lr) : e || this._stopClockTimer();
  }
  _stopClockTimer() {
    this._clockTimer !== void 0 && (window.clearInterval(this._clockTimer), this._clockTimer = void 0);
  }
  _warnMinutes() {
    const e = this._config?.time_warn_minutes;
    return typeof e == "number" && Number.isFinite(e) && e >= 0 ? e : Or;
  }
  /** Signed deviation in minutes; positive means the inverter runs ahead. */
  _clockReading() {
    const e = this._config?.time_entity;
    if (!p(e)) return { kind: "off" };
    const t = this._text(e);
    if (t === null) return { kind: "unavailable" };
    const r = zr(t);
    return r === null ? { kind: "unavailable" } : { kind: "value", at: r, minutes: (r.getTime() - Date.now()) / 6e4 };
  }
  _clockOffBy(e) {
    return e.kind === "value" && Math.abs(e.minutes) >= this._warnMinutes();
  }
  /** Amber only past the threshold; grey when the entity cannot be read. */
  _renderClockPill(e) {
    return e.kind === "off" ? d : e.kind === "unavailable" ? o`<span class="pill">
        <span class="pill-label">Uhr ?</span>
      </span>` : this._clockOffBy(e) ? o`<span class="pill pill-alarm">
      <span class="pill-label">
        Uhr ${Z(e.minutes)} min
      </span>
    </span>` : d;
  }
  _renderClockRow(e) {
    if (e.kind === "off") return d;
    const t = e.kind === "value", r = t && this._clockOffBy(e);
    return o`
      <div class="clock-row">
        <span class="foot-label">Wechselrichter-Uhr</span>
        <span class="clock-value">
          ${t ? o`${Nr(e.at)}
                <span class="clock-delta">
                  (Δ ${Z(e.minutes)} min)
                </span>` : o`<span class="unavail">–</span>`}
        </span>
        <button
          class="clock-set"
          type="button"
          ?disabled=${!r}
          @click=${this._setInverterTime}
        >
          ${this._timeSetDone ? "gesetzt" : "Zeit setzen"}
        </button>
      </div>
    `;
  }
  _setInverterTime() {
    const e = this._config?.time_entity;
    !p(e) || typeof this.hass?.callService != "function" || Promise.resolve(
      this.hass.callService("datetime", "set_value", {
        entity_id: e,
        datetime: Dr()
      })
    ).then(() => {
      this._timeSetDone = !0, this._feedbackTimer !== void 0 && window.clearTimeout(this._feedbackTimer), this._feedbackTimer = window.setTimeout(() => {
        this._feedbackTimer = void 0, this._timeSetDone = !1;
      }, Rr);
    }).catch((t) => {
      console.error("des-inverter-card: Zeit konnte nicht gesetzt werden", t);
    });
  }
  setConfig(e) {
    if (!e)
      throw new Error("des-inverter-card: Konfiguration fehlt");
    if (!e.name)
      throw new Error('des-inverter-card: "name" ist erforderlich');
    if (e.demo_state && !xr.has(e.demo_state))
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
  /** HA sections view: a third of the section, fixed height. */
  getGridOptions() {
    return { columns: Tr, rows: rt, min_rows: rt };
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
    return e ? p(e.pv_power_entity) || p(e.today_production_entity) || p(e.total_production_entity) || p(e.fault_entity) || p(e.alarm_entity) || p(e.device_state_entity) || p(e.inverter_temp_entity) || p(e.dc_temp_entity) || p(e.grid_frequency_entity) || p(e.pv1_power_entity) || p(e.pv1_voltage_entity) || p(e.pv1_current_entity) || p(e.pv2_power_entity) || p(e.pv2_voltage_entity) || p(e.pv2_current_entity) || P(e.grid_power_entities) || P(e.inverter_power_entities) || P(e.grid_voltage_entities) : !1;
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
      phases: P(e.grid_power_entities) || P(e.inverter_power_entities) || P(e.grid_voltage_entities),
      dc: e.show_dc_temp !== !1 && p(e.dc_temp_entity),
      freq: p(e.grid_frequency_entity)
    };
  }
  get _kwpTotal() {
    return this._config?.kwp_total ?? $r;
  }
  get _kwpString() {
    return [
      this._config?.kwp_pv1 ?? kr,
      this._config?.kwp_pv2 ?? Er
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
    const r = f(e, this.hass);
    if (r.kind !== "value") return null;
    let s = r.value;
    if (L(e)) {
      const a = Oe(e, this.hass);
      t === "power" ? a === "kw" ? s *= 1e3 : a === "mw" && (s *= 1e6) : t === "energy" && (a === "wh" ? s /= 1e3 : a === "mwh" && (s *= 1e3));
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
    const e = this._config, t = Mr[e.demo_state ?? "normal"];
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
      exportW: this._exportW(t.phases.map((r) => r.grid)),
      showStrings: !0,
      showExport: !0,
      showPhases: !0,
      showDcItem: e.show_dc_temp !== !1,
      showFreqItem: !0
    };
  }
  _entityView() {
    const e = this._config, t = this._num(e.pv1_power_entity, "power"), r = this._num(e.pv2_power_entity, "power");
    let s;
    p(e.pv_power_entity) ? s = this._num(e.pv_power_entity, "power") : s = J([t, r]);
    const a = [
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
    ], n = (l) => ({
      grid: this._num(e.grid_power_entities?.[l], "power"),
      inverter: this._num(e.inverter_power_entities?.[l], "power"),
      voltage: this._num(e.grid_voltage_entities?.[l], "plain")
    }), c = this._blocks();
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
      strings: a,
      phases: [n(0), n(1), n(2)],
      imbalance: this._imbalance(t, r),
      exportW: this._exportW(
        (e.grid_power_entities ?? []).map((l) => this._num(l, "power"))
      ),
      showStrings: c.strings,
      showExport: P(e.grid_power_entities),
      showPhases: c.phases,
      showDcItem: c.dc,
      showFreqItem: c.freq
    };
  }
  /**
   * Grid feed-in as a positive number, from the raw grid-phase powers.
   * The grid meter follows the Deye sign (positive = draw, negative = feed-in);
   * `invert_grid` flips that first, exactly as the phases table does, then the
   * result is negated so feed-in comes out positive. `null` stays `null`.
   */
  _exportW(e) {
    const t = this._config?.invert_grid ? -1 : 1, r = J(e);
    return r === null ? null : -(r * t);
  }
  /** Per-string amber flags; skipped when a power is missing (would be NaN). */
  _imbalance(e, t) {
    const r = this._config;
    if (r?.imbalance_warn === !1) return [!1, !1];
    if (e === null || t === null) return [!1, !1];
    const s = r?.imbalance_ratio ?? Ar, a = r?.imbalance_min_w ?? Sr, n = (c, l) => c < s * l && l > a;
    return [n(e, t), n(t, e)];
  }
  // =========================================================================
  // render
  // =========================================================================
  render() {
    const e = this._config;
    if (!e) return d;
    const t = this._view(), r = t.showStrings || t.showPhases || this._hasFooter(t) || p(e.time_entity);
    return o`
      <ha-card>
        <div class="card">${this._renderCollapsed(t, r)}</div>
        ${this._expanded && r ? this._renderExpanded(t) : d}
      </ha-card>
    `;
  }
  _hasFooter(e) {
    return e.showDcItem || e.showFreqItem;
  }
  // --- collapsed (always visible) ------------------------------------------
  _renderCollapsed(e, t) {
    const r = this._config;
    return o`
      <div class="header">
        <div class="head-left">
          <span class="name">${r.name}</span>
          <span class="meta">${this._renderMeta(e)}</span>
        </div>
        <div class="pills">
          ${this._renderClockPill(this._clockReading())}
          ${this._renderPill(e)}
        </div>
      </div>

      ${this._renderPowerRow(e)}
      ${e.showStrings || e.showExport ? this._renderStringBars(e) : d}

      ${t ? o`<div
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
    return e.model && t.push(o`${e.model}`), t.push(o`${this._unit(e.todayProduction, b, "kWh")} heute`), t.push(
      o`${this._unit(e.totalProduction, g, "kWh")} gesamt`
    ), o`${t.map((r, s) => s === 0 ? r : o` · ${r}`)}`;
  }
  /** fault beats alarm beats device state; "OK"/absent means no fault. */
  _renderPill(e) {
    const t = (c) => {
      if (c === null) return null;
      const l = c.trim();
      return l.length > 0 && l.toLowerCase() !== "ok" ? l : null;
    }, r = t(e.fault), s = t(e.alarm), [a, n] = r ? [`Fault: ${r}`, "pill-fault"] : s ? [`Alarm: ${s}`, "pill-alarm"] : [e.deviceState, "pill-ok"];
    return o`<span class="pill ${n}">
      <span class="pill-label">${a}</span>
    </span>`;
  }
  _renderPowerRow(e) {
    const t = e.pvPower !== null && e.pvPower > 0, r = this._kwpTotal, s = e.pvPower !== null && r > 0 ? $(e.pvPower / (r * 1e3) * 100, 0, 999) : null;
    return o`
      <div class="power-row">
        <div class="pv">
          <span class="pv-value ${t ? "producing" : "idle"}">
            ${this._unit(e.pvPower, g, "W")}
          </span>
          ${s === null ? d : o`<span class="pv-share">
                ${g(s)} % von ${Yt(r)} kWp
              </span>`}
        </div>
        <div class="temp">
          ${this._thermometer()}
          ${this._unit(e.inverterTemp, b, "°C")}
        </div>
      </div>
    `;
  }
  _renderStringBars(e) {
    const t = this._kwpString;
    return o`
      <div class="strings">
        ${e.showStrings ? e.strings.map((r, s) => {
      const a = (t[s] ?? 0) * 1e3, n = r.power !== null && a > 0 ? $(r.power / a * 100, 0, 100) : 0, c = e.imbalance[s];
      return o`
                <div class="string-row">
                  <span class="string-label">PV${s + 1}</span>
                  <div class="bar">
                    <div
                      class="bar-fill ${c ? "warn" : ""}"
                      style="width: ${n}%"
                    ></div>
                  </div>
                  <span class="string-power">
                    ${this._unit(r.power, g, "W")}
                  </span>
                </div>
              `;
    }) : d}
        ${e.showExport ? this._renderExportBar(e) : d}
      </div>
    `;
  }
  /**
   * Export row under the strings: same build (label, bar, value), but only
   * feed-in is shown. Below `EXPORT_MIN_W` (or while drawing) the bar is empty
   * and the value reads "0 W"; the bar is scaled against `kwp_total`, like the
   * string bars against their own kWp.
   */
  _renderExportBar(e) {
    const t = e.exportW, r = t !== null && t >= Cr, s = this._kwpTotal * 1e3, a = r && s > 0 ? $(t / s * 100, 0, 100) : 0;
    return o`
      <div class="string-row">
        <span class="string-label">Export</span>
        <div class="bar">
          <div class="bar-fill export" style="width: ${a}%"></div>
        </div>
        <span class="string-power">
          ${t === null ? o`<span class="unavail">–</span>` : o`${g(r ? t : 0)} W`}
        </span>
      </div>
    `;
  }
  // --- expanded ------------------------------------------------------------
  _renderExpanded(e) {
    return o`
      <div class="overlay details">
        ${e.showStrings ? this._renderStringsTable(e) : d}
        ${e.showPhases ? this._renderPhasesTable(e) : d}
        ${this._hasFooter(e) ? this._renderFooter(e) : d}
        ${this._renderClockRow(this._clockReading())}
      </div>
    `;
  }
  // A. Strings — voltage / current per MPPT input.
  _renderStringsTable(e) {
    return o`
      <div class="grid strings-grid">
        <span class="col-head">Strings</span>
        <span class="col-head num">Spannung</span>
        <span class="col-head num">Strom</span>
        ${e.strings.map(
      (t, r) => o`
            <span class="row-label">PV${r + 1}</span>
            <span class="num">${this._unit(t.voltage, b, "V")}</span>
            <span class="num">${this._unit(t.current, b, "A")}</span>
          `
    )}
      </div>
    `;
  }
  // B. Phases — grid flow, inverter output, voltage per phase, plus a Σ row.
  _renderPhasesTable(e) {
    const t = this._config?.invert_grid ? -1 : 1, r = e.phases.map(
      (n) => n.grid === null ? null : n.grid * t
    ), s = J(r), a = J(e.phases.map((n) => n.inverter));
    return o`
      <div class="grid phases-grid">
        <span class="col-head">Phasen</span>
        <span class="col-head num">Netz</span>
        <span class="col-head num">WR-Ausgang</span>
        <span class="col-head num">Spannung</span>

        ${e.phases.map((n, c) => {
      const l = r[c];
      return o`
            <span class="row-label">${Pr[c]}</span>
            <span class="num ${this._gridClass(l)}">
              ${this._unit(l, Z, "W")}
            </span>
            <span class="num">${this._unit(n.inverter, g, "W")}</span>
            <span class="num">${this._unit(n.voltage, b, "V")}</span>
          `;
    })}

        <span class="row-label sum">Σ</span>
        <span class="num sum ${this._gridClass(s)}">
          ${this._unit(s, Z, "W")}
        </span>
        <span class="num sum">${this._unit(a, g, "W")}</span>
        <span class="num sum muted">–</span>
      </div>
    `;
  }
  // C. Footer — DC temperature (optional) and grid frequency.
  _renderFooter(e) {
    return o`
      <div class="footer">
        ${e.showDcItem ? o`<div class="foot-item">
              <span class="foot-label">DC-Temperatur</span>
              <span class="foot-value">
                ${this._unit(e.dcTemp, b, "°C")}
              </span>
            </div>` : d}
        ${e.showFreqItem ? o`<div class="foot-item">
              <span class="foot-label">Netzfrequenz</span>
              <span class="foot-value">
                ${this._unit(e.gridFrequency, (t) => b(t, 2), "Hz")}
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
    return e === null ? o`<span class="unavail">–</span>` : o`${t(e)} ${r}`;
  }
  /** negative = feed-in (green), positive = import (red), zero/null = muted. */
  _gridClass(e) {
    return e === null || e === 0 ? "muted" : e < 0 ? "grid-feed" : "grid-draw";
  }
  /** Inline thermometer glyph, so the card needs no external icon set. */
  _thermometer() {
    return o`<svg
      class="thermo"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      role="img"
      aria-label="Temperatur"
    >
      ${It`<path
        fill="currentColor"
        d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0m-3-10a2 2 0 0 1 2 2v1h-4V5a2 2 0 0 1 2-2Z"
      />`}
    </svg>`;
  }
  _toggleExpanded() {
    this._expanded = !this._expanded, this._expanded ? this._closer.activate() : this._closer.deactivate();
  }
  _collapse() {
    this._expanded && (this._expanded = !1, this._closer.deactivate());
  }
  _onKeydown(e) {
    (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this._toggleExpanded());
  }
};
ie.properties = {
  // Assigning `hass` is a reactive property write, so Home Assistant's state
  // updates re-render the card (same mechanism as the storage card).
  hass: { attribute: !1 },
  _config: { state: !0 },
  _expanded: { state: !0 },
  _clockTick: { state: !0 },
  _timeSetDone: { state: !0 }
}, ie.styles = [
  Re,
  ze,
  De,
  E`
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

    /* Holds the clock pill and the status pill; with no clock entity it wraps
       the single status pill and nothing about the header changes. */
    .pills {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      flex-shrink: 0;
    }

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
      color: var(--des-production-color, #2e7d32);
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
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 5px;
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
      background: var(--des-production-color, #2e7d32);
      transition: width 0.25s ease-out;
    }

    .bar-fill.warn {
      background: var(--warning-color, #ff9800);
    }

    .bar-fill.export {
      background: var(--des-export-color, #2e7d32);
    }

    .string-power {
      font-size: 12px;
      color: var(--secondary-text-color);
      text-align: right;
      white-space: nowrap;
      min-width: 52px;
    }

    /* --- expanded details --- */

    .details {
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
      color: var(--des-export-color, #2e7d32);
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

    /* --- inverter clock --- */

    .clock-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .clock-value {
      margin-left: auto;
      font-size: 13px;
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    .clock-delta {
      color: var(--secondary-text-color);
    }

    /* Same look as a segmented-control button, standing on its own. */
    .clock-set {
      flex-shrink: 0;
      font-family: inherit;
      font-size: 11px;
      line-height: 1;
      padding: 4px 7px;
      background: none;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.28));
      border-radius: 5px;
      color: var(--secondary-text-color);
      cursor: pointer;
    }

    .clock-set:hover:not(:disabled) {
      color: var(--primary-text-color);
    }

    .clock-set:disabled {
      opacity: 0.4;
      cursor: default;
    }

    .clock-set:focus {
      outline: none;
    }

    .clock-set:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
  `
];
let xe = ie;
const Ir = /* @__PURE__ */ new Set([
  "normal",
  "night",
  "export"
]), st = 6, Hr = 5, Ur = 12, Wr = "sensor.pv_helper_solar_direkt_leistung", Fr = "sensor.pv_helper_speicher_leistung", Br = "sensor.inverter_external_power", it = "sensor.pv_helper_energie_solar_direkt", at = "sensor.pv_helper_energie_entladen_gesamt", nt = "sensor.pv_helper_energie_import_gesamt", ot = "var(--des-production-color)", lt = "#378ADD", ct = "#E24B4A", jr = ["day", "week", "month", "year"], Gr = {
  day: "Tag",
  week: "Woche",
  month: "Monat",
  year: "Jahr"
}, Vr = {
  day: "W",
  week: "kWh je Tag",
  month: "kWh je Tag",
  year: "kWh je Monat"
}, Kr = 180, qr = 2, Yr = ["_apexChart", "apexChart", "_chart"], Zr = {
  // Measured mode (pvPower set): 2.840 W solar / 72 %, 710 W storage / 18 %,
  // 400 W grid / 10 %. pv 2840 − feed-in 0 − charging 0 = 2840 W solar.
  normal: {
    load: 3950,
    gridRaw: 400,
    storage: [710, 0],
    pvPower: 2840,
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
    pvPower: 0,
    todayConsumption: 23.4,
    todayImport: 4.4,
    todayExport: 3.1,
    autarky: null
  },
  // Surplus solar: 5.000 W PV, 3.800 W of it fed to the grid, 1.200 W into the
  // house (100 % solar). Fully self-supplied.
  export: {
    load: 1200,
    gridRaw: -3800,
    storage: [0, 0],
    pvPower: 5e3,
    todayConsumption: 23.4,
    todayImport: 4.4,
    todayExport: 3.1,
    autarky: null
  }
};
function y(i) {
  return typeof i == "string" && i.trim().length > 0;
}
function Xr(i) {
  return Array.isArray(i) && i.some(y);
}
const ae = class ae extends k {
  constructor() {
    super(), this._closer = new Ne(this, () => this._collapse()), this._mountToken = 0, this._awaitingApex = !1, this._expanded = !1, this._period = null;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._closer.deactivate(), this._teardownChart(), this._resizeObserver?.disconnect(), this._resizeObserver = void 0, this._observedChart = void 0;
  }
  firstUpdated() {
    !this._apexAvailable() && !this._awaitingApex && (this._awaitingApex = !0, customElements.whenDefined("apexcharts-card").then(() => this.requestUpdate()).catch(() => {
    }));
  }
  /** Keeps the `expanded` attribute in sync and drives the embedded chart. */
  updated() {
    this.toggleAttribute("expanded", this._expanded);
    const e = this.renderRoot?.querySelector("#chart");
    this._observeChartSize(e), this._applyChartHeight(), this._syncChart();
  }
  setConfig(e) {
    if (!e)
      throw new Error("des-house-card: Konfiguration fehlt");
    if (!e.name)
      throw new Error('des-house-card: "name" ist erforderlich');
    if (e.demo_state && !Ir.has(e.demo_state))
      throw new Error(
        'des-house-card: "demo_state" muss "normal", "night" oder "export" sein'
      );
    if (e.storage_positive && e.storage_positive !== "discharge" && e.storage_positive !== "charge")
      throw new Error(
        'des-house-card: "storage_positive" muss "discharge" oder "charge" sein'
      );
    this._config = e, this._expanded = !1, this._period = null, this._teardownChart();
  }
  getCardSize() {
    return st;
  }
  /** HA sections view: a third of the section; the chart grows into the rows. */
  getGridOptions() {
    return { columns: Ur, rows: st, min_rows: Hr };
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
    return e ? y(e.pv_power_entity) || y(e.load_power_entity) || y(e.grid_power_entity) || Xr(e.storage_power_entities) || y(e.today_consumption_entity) || y(e.today_import_entity) || y(e.today_export_entity) || y(e.autarky_entity) || y(e.solar_power_entity) || y(e.storage_power_entity) || y(e.solar_energy_entity) || y(e.storage_energy_entity) || y(e.grid_energy_entity) : !1;
  }
  /**
   * A configured entity's numeric value, rescaled onto the card's base unit
   * (W for power, kWh for energy). `null` for an unset, unavailable or
   * non-numeric slot - all of which render as a muted "–".
   */
  _num(e, t) {
    if (!y(e)) return null;
    const r = f(e, this.hass);
    if (r.kind !== "value") return null;
    let s = r.value;
    if (L(e)) {
      const a = Oe(e, this.hass);
      t === "power" ? a === "kw" ? s *= 1e3 : a === "mw" && (s *= 1e6) : t === "energy" && (a === "wh" ? s /= 1e3 : a === "mwh" && (s *= 1e3));
    }
    return Number.isFinite(s) ? s : null;
  }
  _rawInputs() {
    if (!this._entityMode)
      return Zr[this._config.demo_state ?? "normal"];
    const e = this._config;
    return {
      load: this._num(e.load_power_entity, "power"),
      gridRaw: this._num(e.grid_power_entity, "power"),
      storage: (e.storage_power_entities ?? []).map((t) => this._num(t, "power")),
      pvPower: this._num(e.pv_power_entity, "power"),
      todayConsumption: this._num(e.today_consumption_entity, "energy"),
      todayImport: this._num(e.today_import_entity, "energy"),
      todayExport: this._num(e.today_export_entity, "energy"),
      autarky: this._num(e.autarky_entity, "plain")
    };
  }
  _view() {
    const e = this._config, t = this._rawInputs(), r = e.invert_grid ? -1 : 1, a = (t.gridRaw === null ? null : t.gridRaw * r) ?? 0, n = Math.max(a, 0), c = Math.max(-a, 0), l = (e.storage_positive ?? "discharge") === "charge", u = t.storage.reduce((w, A) => A === null ? w : w + Math.max(l ? -A : A, 0), 0);
    let _ = 0, h = 0, m = 0, v;
    if (t.pvPower !== null) {
      const w = t.storage.reduce((Y, pe) => pe === null ? Y : Y + Math.max(l ? pe : -pe, 0), 0);
      m = Math.max(t.pvPower - c - w, 0), _ = u, h = n;
      const A = m + _ + h;
      v = (Y) => A > 0 ? $(Y / A * 100, 0, 100) : 0;
    } else {
      const w = t.load !== null && t.load > 0 ? t.load : 0;
      w > 0 && (_ = Math.min(u, w), h = Math.min(n, w - _), m = Math.max(w - _ - h, 0)), v = (A) => w > 0 ? $(A / w * 100, 0, 100) : 0;
    }
    return {
      load: t.load,
      solarShare: m,
      storageShare: _,
      gridShare: h,
      solarPct: v(m),
      storagePct: v(_),
      gridPct: v(h),
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
    return t === null || t <= 0 || r === null ? null : $((1 - r / t) * 100, 0, 100);
  }
  // =========================================================================
  // chart period model
  // =========================================================================
  _chartEntity(e, t) {
    return e ?? t;
  }
  /** Week/Month/Year need the three energy entities; day needs only power. */
  _energyPeriodsAvailable() {
    const e = this._config;
    return y(this._chartEntity(e?.solar_energy_entity, it)) && y(this._chartEntity(e?.storage_energy_entity, at)) && y(this._chartEntity(e?.grid_energy_entity, nt));
  }
  _availablePeriods() {
    return this._energyPeriodsAvailable() ? [...jr] : ["day"];
  }
  _effectivePeriod(e) {
    return this._period && e.includes(this._period) ? this._period : e.includes("day") ? "day" : e[0];
  }
  _setPeriod(e) {
    this._period = e;
  }
  _apexAvailable() {
    return customElements.get("apexcharts-card") !== void 0;
  }
  /** The full apexcharts-card config for one period, built from the sources. */
  _apexCardConfig(e) {
    const t = this._config, a = {
      chart: { height: this._chartHeight ?? Kr, stacked: !0 },
      legend: {
        position: "bottom",
        markers: { offsetX: -4 },
        itemMargin: { horizontal: 10 }
      },
      grid: { borderColor: "var(--divider-color)", strokeDashArray: 3 },
      plotOptions: { bar: { columnWidth: "70%" } },
      xaxis: {
        tooltip: { enabled: !1 },
        labels: { datetimeFormatter: {
          day: { hour: "HH" },
          week: { day: "dd.MM" },
          month: { day: "dd." },
          year: { month: "MMM" }
        }[e] }
      }
    };
    return e === "day" ? {
      type: "custom:apexcharts-card",
      header: { show: !1 },
      graph_span: "24h",
      span: { start: "day" },
      stacked: !0,
      apex_config: a,
      all_series_config: {
        type: "column",
        extend_to: !1,
        group_by: { func: "avg", duration: "10min", fill: "last" },
        unit: "W",
        float_precision: 0,
        show: { legend_value: !1 }
      },
      series: [
        {
          entity: this._chartEntity(t?.solar_power_entity, Wr),
          name: "Solar",
          color: ot
        },
        {
          entity: this._chartEntity(t?.storage_power_entity, Fr),
          name: "Speicher",
          color: lt,
          transform: "return Math.max(0, x);"
        },
        {
          entity: this._chartEntity(t?.grid_power_entity, Br),
          name: "Netz",
          color: ct,
          transform: "return Math.max(0, x);"
        }
      ]
    } : {
      type: "custom:apexcharts-card",
      header: { show: !1 },
      graph_span: e === "week" ? "7d" : e === "month" ? "31d" : "366d",
      span: { start: e === "week" ? "isoWeek" : e === "month" ? "month" : "year" },
      stacked: !0,
      apex_config: a,
      all_series_config: {
        type: "column",
        extend_to: !1,
        statistics: { type: "change", period: e === "year" ? "month" : "day", align: "start" },
        unit: "kWh",
        float_precision: e === "year" ? 0 : 1,
        show: { legend_value: !1 }
      },
      series: [
        {
          entity: this._chartEntity(t?.solar_energy_entity, it),
          name: "Solar",
          color: ot
        },
        {
          entity: this._chartEntity(t?.storage_energy_entity, at),
          name: "Speicher",
          color: lt
        },
        {
          entity: this._chartEntity(t?.grid_energy_entity, nt),
          name: "Netz",
          color: ct
        }
      ]
    };
  }
  // =========================================================================
  // render
  // =========================================================================
  render() {
    const e = this._config;
    if (!e) return d;
    const t = this._view();
    return o`
      <ha-card>
        <div class="card">${this._renderCollapsed(e, t)}</div>
        ${this._expanded && t.hasToday ? this._renderExpanded(t) : d}
      </ha-card>
    `;
  }
  // --- collapsed (always visible) ------------------------------------------
  _renderCollapsed(e, t) {
    return o`
      <div class="header">
        <div class="head-left">
          <span class="name">${e.name}</span>
          <span class="meta">${this._renderMeta(t)}</span>
        </div>
        ${this._renderPills(t)}
      </div>

      ${this._renderPowerRow(t)}
      ${this._renderMixBar(t)}
      ${this._entityMode ? this._renderChartSection() : d}

      ${t.hasToday ? o`<div
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
    return o`${this._unit(e.todayConsumption, b, "kWh")} heute ·
    ${this._unit(e.autarky, g, "%")} autark`;
  }
  /** Solar / Speicher / Netz as coloured pills with the current W value. */
  _renderPills(e) {
    const t = (r, s, a) => {
      const n = !(a > 0);
      return o`
        <span class="hpill ${n ? "zero" : ""}">
          <span class="swatch ${n ? "zero" : r}"></span>
          <span class="hpill-label">${s}</span>
          <span class="hpill-value">${g(a)} W</span>
        </span>
      `;
    };
    return o`
      <div class="pills">
        ${t("solar", "Solar", e.solarShare)}
        ${t("storage", "Speicher", e.storageShare)}
        ${t("grid", "Netz", e.gridShare)}
      </div>
    `;
  }
  _renderPowerRow(e) {
    return o`
      <div class="power-row">
        <div class="load">
          <span class="load-value">${this._unit(e.load, g, "W")}</span>
          <span class="load-label">Verbrauch</span>
        </div>
      </div>
    `;
  }
  _renderMixBar(e) {
    return o`
      <div
        class="mix"
        role="img"
        aria-label="Stromherkunft: Solar ${g(e.solarPct)} %, Speicher
        ${g(e.storagePct)} %, Netz ${g(e.gridPct)} %"
      >
        <div class="mix-seg solar" style="width: ${e.solarPct}%"></div>
        <div class="mix-seg storage" style="width: ${e.storagePct}%"></div>
        <div class="mix-seg grid" style="width: ${e.gridPct}%"></div>
      </div>
    `;
  }
  _renderChartSection() {
    const e = this._availablePeriods(), t = this._effectivePeriod(e);
    return o`
      <div class="chart-head">
        ${V(
      e.map((r) => ({ value: r, label: Gr[r] })),
      t,
      (r) => this._setPeriod(r),
      "Zeitraum"
    )}
      </div>
      <div class="chart-meta">${Vr[t]}</div>
      ${this._apexAvailable() ? o`<div class="chart" id="chart"></div>` : o`<div class="hint">apexcharts-card nicht installiert</div>`}
    `;
  }
  // --- expanded ------------------------------------------------------------
  _renderExpanded(e) {
    return o`
      <div class="overlay">
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
    return t === null ? d : o`
      <span class="today-label">${e}</span>
      <span class="today-value ${r}">${b(t)} kWh</span>
    `;
  }
  // =========================================================================
  // embedded chart lifecycle (mirrors des-chart-card)
  // =========================================================================
  _observeChartSize(e) {
    typeof ResizeObserver > "u" || this._observedChart !== (e ?? void 0) && (this._resizeObserver?.disconnect(), this._observedChart = e ?? void 0, e && (this._resizeObserver ??= new ResizeObserver(() => this._applyChartHeight()), this._resizeObserver.observe(e)));
  }
  _applyChartHeight() {
    const e = this.renderRoot?.querySelector("#chart");
    if (!e) return;
    const t = e.clientHeight;
    t <= 0 || this._chartHeight !== void 0 && Math.abs(t - this._chartHeight) <= qr || (this._chartHeight = t, this._resizeApex(t));
  }
  _resizeApex(e) {
    const t = this._apexInstance();
    if (t)
      try {
        t.updateOptions({ chart: { height: e } }, !1, !1);
      } catch (r) {
        console.warn("des-house-card: Chart-Höhe konnte nicht gesetzt werden", r);
      }
  }
  _apexInstance() {
    const e = this._chartEl;
    if (e)
      for (const t of Yr) {
        const r = e[t];
        if (r && typeof r.updateOptions == "function")
          return r;
      }
  }
  _syncChart() {
    if (!this._entityMode) {
      this._teardownChart();
      return;
    }
    const e = this._effectivePeriod(this._availablePeriods()), t = this.renderRoot?.querySelector("#chart");
    if (!this._apexAvailable() || !t) {
      this._teardownChart();
      return;
    }
    if (this._chartEl && this._chartPeriod === e) {
      this._chartEl.isConnected || t.replaceChildren(this._chartEl), this._chartEl.hass = this.hass;
      return;
    }
    this._mountChart(t, e);
  }
  async _mountChart(e, t) {
    const r = ++this._mountToken;
    this._removeChartEl();
    const s = await this._getHelpers();
    if (!s || r !== this._mountToken) return;
    let a;
    try {
      a = s.createCardElement(this._apexCardConfig(t));
    } catch (n) {
      console.error("des-house-card: Chart konnte nicht erzeugt werden", n);
      return;
    }
    r === this._mountToken && (a.classList.add("embedded"), a.hass = this.hass, e.replaceChildren(a), this._chartEl = a, this._chartPeriod = t);
  }
  _getHelpers() {
    if (!this._helpersPromise) {
      const e = window.loadCardHelpers;
      this._helpersPromise = typeof e == "function" ? e() : Promise.resolve(null);
    }
    return this._helpersPromise;
  }
  _removeChartEl() {
    this._chartEl && (this._chartEl.remove(), this._chartEl = void 0), this._chartPeriod = void 0;
  }
  _teardownChart() {
    this._mountToken++, this._removeChartEl();
  }
  // =========================================================================
  // shared
  // =========================================================================
  /** Formatted "value unit", or a muted "–" when the value is missing. */
  _unit(e, t, r) {
    return e === null ? o`<span class="unavail">–</span>` : o`${t(e)} ${r}`;
  }
  _toggleExpanded() {
    this._expanded = !this._expanded, this._expanded ? this._closer.activate() : this._closer.deactivate();
  }
  _collapse() {
    this._expanded && (this._expanded = !1, this._closer.deactivate());
  }
  _onKeydown(e) {
    (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this._toggleExpanded());
  }
};
ae.properties = {
  // Assigning `hass` is a reactive property write, so Home Assistant's state
  // updates re-render the card (same mechanism as the other cards).
  hass: { attribute: !1 },
  _config: { state: !0 },
  _expanded: { state: !0 },
  _period: { state: !0 }
}, ae.styles = [
  Re,
  ze,
  De,
  ue,
  E`
    :host {
      display: block;
      height: 100%;
    }

    ha-card {
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      /* Cap the card at the grid height so the chart fits instead of pushing. */
      overflow: hidden;
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
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
      flex: 0 0 auto;
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

    /* --- source pills (Solar / Speicher / Netz) --- */

    .pills {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 6px;
      flex-shrink: 0;
    }

    .hpill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 2px 8px;
      border-radius: 10px;
      background: rgba(127, 127, 127, 0.12);
      font-size: 11px;
      line-height: 1;
      white-space: nowrap;
    }

    .hpill-label {
      color: var(--secondary-text-color);
    }

    .hpill-value {
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
    }

    .hpill.zero .hpill-value {
      color: var(--secondary-text-color);
    }

    /* --- power row --- */

    .power-row {
      display: flex;
      align-items: baseline;
      gap: 12px;
      margin-top: 10px;
      flex: 0 0 auto;
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
      flex: 0 0 auto;
    }

    .mix-seg {
      height: 100%;
      transition: width 0.25s ease-out;
    }

    .mix-seg.solar,
    .swatch.solar {
      background: var(--des-production-color, #2e7d32);
    }

    /* Blue = the storage card's "charging" colour: heating/charging fills a store. */
    .mix-seg.storage,
    .swatch.storage {
      background: #378add;
    }

    .mix-seg.grid,
    .swatch.grid {
      background: #e24b4a;
    }

    .swatch {
      width: 8px;
      height: 8px;
      border-radius: 2px;
      flex-shrink: 0;
    }

    .swatch.zero {
      background: var(--secondary-text-color);
      opacity: 0.5;
    }

    /* --- chart section --- */

    .chart-head {
      display: flex;
      justify-content: flex-end;
      margin-top: 12px;
      flex: 0 0 auto;
    }

    .chart-meta {
      margin-top: 4px;
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      flex: 0 0 auto;
    }

    /* Takes whatever height is left; the height is a start size flex overrides.
       overflow:hidden keeps a chart that briefly overshoots from scrolling. */
    .chart {
      flex: 1 1 auto;
      min-height: 0;
      height: 180px;
      position: relative;
      margin-top: 6px;
      overflow: hidden;
    }

    /* Strip the embedded apexcharts-card frame so it sits flush inside ours. */
    .chart .embedded {
      position: absolute;
      inset: 0;
      display: block;
      margin: 0;
      --ha-card-background: transparent;
      --ha-card-border-width: 0;
      --ha-card-box-shadow: none;
    }

    .hint {
      margin-top: 10px;
      font-size: 12px;
      color: var(--secondary-text-color);
      opacity: 0.85;
    }

    /* --- expanded "Heute" block --- */

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
      color: var(--des-export-color, #2e7d32);
    }
  `
];
let $e = ae;
const te = ["day", "week", "month", "year"], Jr = new Set(te), dt = 4, Qr = 12, es = {
  day: "Tag",
  week: "Woche",
  month: "Monat",
  year: "Jahr"
}, R = [
  { key: "consumption", label: "Verbrauch", cls: "m-consumption" },
  { key: "production", label: "Produktion", cls: "m-production" },
  { key: "import", label: "Import", cls: "m-import" },
  { key: "export", label: "Export", cls: "m-export" },
  { key: "charge", label: "Laden", cls: "m-charge" },
  { key: "discharge", label: "Entladen", cls: "m-discharge" }
];
function Q(i) {
  return {
    consumption: i[0],
    production: i[1],
    import: i[2],
    export: i[3],
    charge: i[4],
    discharge: i[5]
  };
}
const ts = {
  day: Q([17.6, 22.4, 4.4, 3.1, 6.2, 5.8]),
  week: Q([148.2, 127.5, 38.6, 41, 32.1, 28.4]),
  month: Q([610, 590, 160, 175, 140, 128]),
  year: Q([5400, 8200, 1900, 4100, 1200, 1100])
};
function Et(i) {
  return Array.isArray(i) ? i.some(Et) : typeof i == "number" ? Number.isFinite(i) : typeof i == "string" && i.trim().length > 0;
}
const ne = class ne extends k {
  constructor() {
    super(), this._period = null;
  }
  setConfig(e) {
    if (!e)
      throw new Error("des-stats-card: Konfiguration fehlt");
    if (!e.name)
      throw new Error('des-stats-card: "name" ist erforderlich');
    if (e.default_period && !Jr.has(e.default_period))
      throw new Error(
        'des-stats-card: "default_period" muss "day", "week", "month" oder "year" sein'
      );
    this._config = e, this._period = null;
  }
  getCardSize() {
    const e = this._effectivePeriod(this._availablePeriods()), t = e ? R.filter((r) => this._periodValues(e)[r.key] !== null).length : 0;
    return 2 + Math.ceil(t / 2);
  }
  /** HA sections view: a third of the section, fixed height. */
  getGridOptions() {
    return { columns: Qr, rows: dt, min_rows: dt };
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
    return e ? te.some((t) => {
      const r = e[t];
      return r !== void 0 && R.some((s) => Et(r[s.key]));
    }) : !1;
  }
  /**
   * A configured slot's numeric value, rescaled onto kWh (Wh → /1000,
   * MWh → ×1000). `null` for an unset, unavailable or non-numeric slot.
   */
  _num(e) {
    if (e === void 0 || typeof e == "string" && e.trim().length === 0) return null;
    const t = f(e, this.hass);
    if (t.kind !== "value") return null;
    let r = t.value;
    if (typeof e == "string" && L(e)) {
      const s = Oe(e, this.hass);
      s === "wh" ? r /= 1e3 : s === "mwh" && (r *= 1e3);
    }
    return Number.isFinite(r) ? r : null;
  }
  /** Sum of a single value or a list; `null` when nothing resolves. */
  _sumList(e) {
    if (e === void 0) return null;
    const r = (Array.isArray(e) ? e : [e]).map((s) => this._num(s)).filter((s) => s !== null);
    return r.length > 0 ? r.reduce((s, a) => s + a, 0) : null;
  }
  _metricValue(e, t) {
    return e ? t === "charge" || t === "discharge" ? this._sumList(e[t]) : this._num(e[t]) : null;
  }
  _periodValues(e) {
    if (!this._entityMode) return ts[e];
    const t = this._config?.periods?.[e], r = {};
    for (const { key: s } of R) r[s] = this._metricValue(t, s);
    return r;
  }
  /** Periods that have at least one readable figure (all four in demo mode). */
  _availablePeriods() {
    return this._entityMode ? te.filter((e) => {
      const t = this._periodValues(e);
      return R.some((r) => t[r.key] !== null);
    }) : [...te];
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
    return t === null || t <= 0 || e === null ? null : $((1 - e / t) * 100, 0, 100);
  }
  // =========================================================================
  // render
  // =========================================================================
  render() {
    const e = this._config;
    if (!e) return d;
    const t = this._availablePeriods(), r = this._effectivePeriod(t), s = r ? this._periodValues(r) : null, a = s ? this._ratio(s.import, s.consumption) : null, n = s ? this._ratio(s.export, s.production) : null;
    return o`
      <ha-card>
        <div class="card">
          <div class="header">
            <span class="name">${e.name}</span>
            ${t.length > 0 && r ? V(
      t.map((c) => ({ value: c, label: es[c] })),
      r,
      (c) => this._setPeriod(c),
      "Zeitraum"
    ) : d}
          </div>

          ${a === null && n === null ? d : o`<div class="meta">
                ${this._pct(a)} % autark · ${this._pct(n)} %
                Eigenverbrauch
              </div>`}

          ${s ? this._renderRows(s) : d}
        </div>
      </ha-card>
    `;
  }
  _renderRows(e) {
    const r = R.map((s) => e[s.key]).filter(
      (s) => s !== null
    ).reduce((s, a) => Math.max(s, a), 0);
    return o`
      <div class="rows">
        ${R.map((s) => {
      const a = e[s.key];
      if (a === null) return d;
      const n = r > 0 ? $(a / r * 100, 0, 100) : 0;
      return o`
            <span class="row-label">${s.label}</span>
            <div class="bar">
              <div
                class="bar-fill ${s.cls}"
                style="width: ${n}%"
              ></div>
            </div>
            <span class="row-value">${b(a, 2)} kWh</span>
          `;
    })}
      </div>
    `;
  }
  /** Whole-number percent, or a muted "–" when it cannot be computed. */
  _pct(e) {
    return e === null ? o`<span class="unavail">–</span>` : o`${g(e)}`;
  }
  _setPeriod(e) {
    this._period = e;
  }
};
ne.properties = {
  // Assigning `hass` is a reactive property write, so Home Assistant's state
  // updates re-render the card (same mechanism as the other cards).
  hass: { attribute: !1 },
  _config: { state: !0 },
  _period: { state: !0 }
}, ne.styles = [
  ue,
  De,
  E`
      :host {
        display: block;
        height: 100%;

        /* A lighter blue for discharge against charge; the theme has none.
           Export uses the shared --des-export-color token (see tokens.ts). */
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
        /* Reserve room for two decimals so "1.234,56 kWh" never wraps. */
        min-width: 72px;
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
        background: var(--des-production-color, #2e7d32);
      }

      .bar-fill.m-import {
        background: var(--error-color, #d32f2f);
      }

      .bar-fill.m-export {
        background: var(--des-export-color, #2e7d32);
      }

      .bar-fill.m-charge {
        background: var(--info-color, #2196f3);
      }

      .bar-fill.m-discharge {
        background: var(--stats-discharge-color, #7fb8e8);
      }
    `
];
let ke = ne;
const Ee = ["day", "week", "month", "year"], rs = new Set(Ee), ss = {
  day: "Tag",
  week: "Woche",
  month: "Monat",
  year: "Jahr"
}, ht = 4, is = 3, as = 24, ns = 220, os = 2, ls = ["_apexChart", "apexChart", "_chart"], oe = class oe extends k {
  constructor() {
    super(), this._mountToken = 0, this._awaitingApex = !1, this._period = null;
  }
  setConfig(e) {
    if (!e)
      throw new Error("des-chart-card: Konfiguration fehlt");
    if (!e.name)
      throw new Error('des-chart-card: "name" ist erforderlich');
    if (e.default_period && !rs.has(e.default_period))
      throw new Error(
        'des-chart-card: "default_period" muss "day", "week", "month" oder "year" sein'
      );
    if (e.periods !== void 0 && (typeof e.periods != "object" || e.periods === null))
      throw new Error('des-chart-card: "periods" muss ein Objekt sein');
    this._config = e, this._period = null, this._teardownChart();
  }
  getCardSize() {
    return ht;
  }
  /** HA sections view: two thirds wide; the chart grows into the given rows. */
  getGridOptions() {
    return { columns: as, rows: ht, min_rows: is };
  }
  static getStubConfig() {
    return { type: "custom:des-chart-card", name: "Chart", default_period: "day" };
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._teardownChart(), this._resizeObserver?.disconnect(), this._resizeObserver = void 0, this._observedChart = void 0;
  }
  firstUpdated() {
    !this._apexAvailable() && !this._awaitingApex && (this._awaitingApex = !0, customElements.whenDefined("apexcharts-card").then(() => this.requestUpdate()).catch(() => {
    }));
  }
  /**
   * Watches the chart container, not ha-card or the window: the container is
   * what flex sizes from the grid, and a sections grid can resize it without
   * the window ever changing.
   */
  _observeChartSize(e) {
    typeof ResizeObserver > "u" || this._observedChart !== (e ?? void 0) && (this._resizeObserver?.disconnect(), this._observedChart = e ?? void 0, e && (this._resizeObserver ??= new ResizeObserver(() => this._applyChartHeight()), this._resizeObserver.observe(e)));
  }
  // =========================================================================
  // period model
  // =========================================================================
  _apexAvailable() {
    return customElements.get("apexcharts-card") !== void 0;
  }
  _chartConfig(e) {
    const t = this._config?.periods?.[e]?.chart;
    return t && typeof t == "object" ? t : null;
  }
  _label(e) {
    const t = this._config?.periods?.[e]?.label;
    return typeof t == "string" && t.trim().length > 0 ? t : ss[e];
  }
  /** Periods that carry a chart; empty means "demo" (no periods configured). */
  _realPeriods() {
    return Ee.filter((e) => this._chartConfig(e) !== null);
  }
  get _isDemo() {
    return this._realPeriods().length === 0;
  }
  _available() {
    const e = this._realPeriods();
    return e.length > 0 ? e : [...Ee];
  }
  /** The user's pick if still available, else `default_period`, else the first. */
  _effectivePeriod(e) {
    if (this._period && e.includes(this._period)) return this._period;
    const t = this._config?.default_period;
    return t && e.includes(t) ? t : e[0];
  }
  // =========================================================================
  // render
  // =========================================================================
  render() {
    const e = this._config;
    if (!e) return d;
    const t = this._available(), r = this._effectivePeriod(t), s = this._isDemo ? null : this._config?.periods?.[r]?.meta;
    return o`
      <ha-card>
        <div class="card">
          <div class="header">
            <span class="name">${e.name}</span>
            ${V(
      t.map((a) => ({ value: a, label: this._label(a) })),
      r,
      (a) => this._setPeriod(a),
      "Zeitraum"
    )}
          </div>
          ${s ? o`<div class="meta">${s}</div>` : d}
          ${this._renderChartArea(r)}
        </div>
      </ha-card>
    `;
  }
  _renderChartArea(e) {
    return this._isDemo || this._chartConfig(e) === null ? o`<div class="hint">Keine Chart-Config</div>` : this._apexAvailable() ? o`<div class="chart" id="chart"></div>` : o`<div class="hint">apexcharts-card nicht installiert</div>`;
  }
  _setPeriod(e) {
    this._period = e;
  }
  // =========================================================================
  // embedded chart lifecycle
  // =========================================================================
  updated() {
    const e = this.renderRoot?.querySelector("#chart");
    this._observeChartSize(e), this._applyChartHeight(), this._syncChart();
  }
  /**
   * Takes the height flex handed the container and passes it to the chart.
   *
   * The container is never sized from here. It is a flex child with
   * `min-height: 0`, so the grid's height wins over the content; measuring it
   * and then writing to it would be measuring our own output.
   */
  _applyChartHeight() {
    const e = this.renderRoot?.querySelector("#chart");
    if (!e) return;
    const t = e.clientHeight;
    t <= 0 || this._chartHeight !== void 0 && Math.abs(t - this._chartHeight) <= os || (this._chartHeight = t, this._resizeApex(t));
  }
  /** Resizes the mounted chart in place instead of rebuilding it. */
  _resizeApex(e) {
    const t = this._apexInstance();
    if (t)
      try {
        t.updateOptions({ chart: { height: e } }, !1, !1);
      } catch (r) {
        console.warn("des-chart-card: Chart-Höhe konnte nicht gesetzt werden", r);
      }
  }
  /**
   * The ApexCharts instance inside the embedded card. Private API of a foreign
   * card, so every candidate is checked for `updateOptions` before use; without
   * it the card still works, the chart just keeps the height it was built with
   * until the next remount.
   */
  _apexInstance() {
    const e = this._chartEl;
    if (e)
      for (const t of ls) {
        const r = e[t];
        if (r && typeof r.updateOptions == "function")
          return r;
      }
  }
  _syncChart() {
    const e = this._effectivePeriod(this._available()), t = this._isDemo ? null : this._chartConfig(e), r = this.renderRoot?.querySelector("#chart");
    if (!t || !this._apexAvailable() || !r) {
      this._teardownChart();
      return;
    }
    if (this._chartEl && this._chartPeriod === e) {
      this._chartEl.isConnected || r.replaceChildren(this._chartEl), this._chartEl.hass = this.hass;
      return;
    }
    this._mountChart(r, t, e);
  }
  async _mountChart(e, t, r) {
    const s = ++this._mountToken;
    this._removeChartEl();
    const a = await this._getHelpers();
    if (!a || s !== this._mountToken) return;
    let n;
    try {
      n = a.createCardElement(this._embedConfig(t));
    } catch (c) {
      console.error("des-chart-card: Chart konnte nicht erzeugt werden", c);
      return;
    }
    s === this._mountToken && (n.classList.add("embedded"), n.hass = this.hass, e.replaceChildren(n), this._chartEl = n, this._chartPeriod = r);
  }
  /**
   * Adds the card type, forces the embedded card's own header off, and sets the
   * chart height. `apex_config` is deep-merged: only `chart.height` is forced,
   * every user key (including `chart.stacked`) survives. A height from the
   * user's `apex_config` is deliberately overwritten - the card's job here is to
   * fill the space it was given.
   *
   * Stacking: `stacked: true` is set both at apexcharts-card's top level and on
   * `apex_config.chart` whenever the user asked for it at either level. Bars
   * stack from the top-level flag alone, but a stacked **area** needs
   * `chart.stacked: true` on the ApexCharts object - so a config that set only
   * one of the two now gets the other. On top of that, ApexCharts only stacks
   * series that share the same x-values, so for a stacked chart that groups its
   * data (`group_by`) the card defaults `group_by.fill: last`: every bucket then
   * carries a point in every series and the areas line up. The user's own
   * `group_by.fill` still wins.
   *
   * The legend gets a default gap between marker and text
   * (`markers.offsetX: -4`, ~6 px) plus `itemMargin.horizontal: 10`, since
   * ApexCharts otherwise butts the two together. These are defaults only: the
   * user's `apex_config.legend` deep-merges on top and wins per key. Both are
   * pure geometry, so light and dark look the same.
   */
  _embedConfig(e) {
    const t = (v) => v && typeof v == "object" ? v : {}, r = t(e.header), s = t(e.apex_config), a = t(s.chart), n = t(s.legend), c = t(n.markers), l = t(n.itemMargin), u = t(e.all_series_config), _ = t(u.group_by), h = e.stacked === !0 || a.stacked === !0, m = h && "group_by" in u ? {
      all_series_config: {
        ...u,
        group_by: { fill: "last", ..._ }
      }
    } : {};
    return {
      ...e,
      ...h ? { stacked: !0 } : {},
      ...m,
      type: "custom:apexcharts-card",
      header: { ...r, show: !1 },
      apex_config: {
        ...s,
        chart: {
          ...a,
          height: this._chartHeight ?? ns,
          ...h ? { stacked: !0 } : {}
        },
        legend: {
          ...n,
          // Default first, user's value spread on top wins per key.
          markers: { offsetX: -4, ...c },
          itemMargin: { horizontal: 10, ...l }
        }
      }
    };
  }
  _getHelpers() {
    if (!this._helpersPromise) {
      const e = window.loadCardHelpers;
      this._helpersPromise = typeof e == "function" ? e() : Promise.resolve(null);
    }
    return this._helpersPromise;
  }
  _removeChartEl() {
    this._chartEl && (this._chartEl.remove(), this._chartEl = void 0), this._chartPeriod = void 0;
  }
  _teardownChart() {
    this._mountToken++, this._removeChartEl();
  }
};
oe.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 },
  _period: { state: !0 }
}, oe.styles = [
  ue,
  E`
      :host {
        display: block;
        height: 100%;
      }

      ha-card {
        height: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        /* Caps the card at the height the grid gave it - without this the
           chart pushes the card open instead of fitting into it. */
        overflow: hidden;
        background: var(--card-background-color, var(--ha-card-background, #fff));
        color: var(--primary-text-color);
      }

      /* min-height:0 on every flex level, otherwise the default
         min-height:auto stops these boxes shrinking below their content and
         the grid height is ignored. */
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
        flex: 0 0 auto;
        margin-top: 4px;
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* Takes whatever height is left. The height below is only a start size:
         in a view that imposes a height, flex grows or shrinks the container
         from it; in a classic view nothing does, so it stays 220px. That is
         what makes the fallback work without any code branching on view type.
         overflow:hidden keeps a chart that briefly overshoots - the legend,
         mostly - from producing a scrollbar. */
      .chart {
        flex: 1 1 auto;
        min-height: 0;
        height: 220px;
        position: relative;
        margin-top: 8px;
        overflow: hidden;
      }

      /* The embedded apexcharts-card renders its own ha-card; strip its frame
         so the chart sits flush inside ours. Custom properties pierce the
         embedded shadow root, so setting them here is enough.
         Absolutely positioned on purpose: out of flow, it cannot add its own
         height back into the measurement the height is derived from. */
      .chart .embedded {
        position: absolute;
        inset: 0;
        display: block;
        margin: 0;
        --ha-card-background: transparent;
        --ha-card-border-width: 0;
        --ha-card-box-shadow: none;
      }

      .hint {
        margin-top: 10px;
        font-size: 12px;
        color: var(--secondary-text-color);
        opacity: 0.85;
      }
    `
];
let Ae = oe;
const cs = "0.5.0", ds = [
  {
    type: "des-storage-card",
    element: be,
    name: "Daniels Speicherkarte",
    description: "Speicherkarte für Hausakkus (battery) und Wärmespeicher-Gruppen (thermal_group)."
  },
  {
    type: "des-inverter-card",
    element: xe,
    name: "Daniels Wechselrichterkarte",
    description: "Wechselrichter-Übersicht: PV-Leistung, Strings und Phasen (Entities oder Demo-Werte)."
  },
  {
    type: "des-house-card",
    element: $e,
    name: "Daniels Hauskarte",
    description: "Hausverbrauch und Stromherkunft: Solar, Speicher, Netz plus Tageswerte (Entities oder Demo-Werte)."
  },
  {
    type: "des-stats-card",
    element: ke,
    name: "Daniels Statistikkarte",
    description: "Energiestatistik je Zeitraum (Tag/Woche/Monat/Jahr): Verbrauch, Produktion, Import, Export, Laden, Entladen."
  },
  {
    type: "des-chart-card",
    element: Ae,
    name: "Daniels Chartkarte",
    description: "Kopfzeile mit Zeitraum-Umschalter und eingebettetem ApexCharts-Chart je Zeitraum."
  }
];
window.customCards = window.customCards ?? [];
for (const i of ds)
  customElements.get(i.type) || customElements.define(i.type, i.element), window.customCards.some((e) => e.type === i.type) || window.customCards.push({
    type: i.type,
    name: i.name,
    description: i.description,
    preview: !1
  });
console.info(
  `%c DANIELS-ENERGY-CARDS %c v${cs} `,
  "background:#03a9f4;color:#fff;font-weight:700;border-radius:3px 0 0 3px;padding:2px 4px",
  "background:#555;color:#fff;border-radius:0 3px 3px 0;padding:2px 4px"
);
export {
  Ae as DesChartCard,
  $e as DesHouseCard,
  xe as DesInverterCard,
  ke as DesStatsCard,
  be as DesStorageCard
};

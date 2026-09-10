/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const re = globalThis, Pe = re.ShadowRoot && (re.ShadyCSS === void 0 || re.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Me = Symbol(), Ue = /* @__PURE__ */ new WeakMap();
let _t = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== Me) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (Pe && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = Ue.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && Ue.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ct = (i) => new _t(typeof i == "string" ? i : i + "", void 0, Me), S = (i, ...e) => {
  const t = i.length === 1 ? i[0] : e.reduce((r, s, a) => r + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + i[a + 1], i[0]);
  return new _t(t, i, Me);
}, Tt = (i, e) => {
  if (Pe) i.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const r = document.createElement("style"), s = re.litNonce;
    s !== void 0 && r.setAttribute("nonce", s), r.textContent = t.cssText, i.appendChild(r);
  }
}, We = Pe ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const r of e.cssRules) t += r.cssText;
  return Ct(t);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Pt, defineProperty: Mt, getOwnPropertyDescriptor: Lt, getOwnPropertyNames: Ot, getOwnPropertySymbols: Rt, getPrototypeOf: Dt } = Object, de = globalThis, Be = de.trustedTypes, Nt = Be ? Be.emptyScript : "", zt = de.reactiveElementPolyfillSupport, W = (i, e) => i, be = { toAttribute(i, e) {
  switch (e) {
    case Boolean:
      i = i ? Nt : null;
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
} }, gt = (i, e) => !Pt(i, e), Ge = { attribute: !0, type: String, converter: be, reflect: !1, useDefault: !1, hasChanged: gt };
Symbol.metadata ??= Symbol("metadata"), de.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let z = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Ge) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = Symbol(), s = this.getPropertyDescriptor(e, r, t);
      s !== void 0 && Mt(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: s, set: a } = Lt(this.prototype, e) ?? { get() {
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
    return this.elementProperties.get(e) ?? Ge;
  }
  static _$Ei() {
    if (this.hasOwnProperty(W("elementProperties"))) return;
    const e = Dt(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(W("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(W("properties"))) {
      const t = this.properties, r = [...Ot(t), ...Rt(t)];
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
      for (const s of r) t.unshift(We(s));
    } else e !== void 0 && t.push(We(e));
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
    return Tt(e, this.constructor.elementStyles), e;
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
      const a = (r.converter?.toAttribute !== void 0 ? r.converter : be).toAttribute(t, r.type);
      this._$Em = e, a == null ? this.removeAttribute(s) : this.setAttribute(s, a), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const r = this.constructor, s = r._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const a = r.getPropertyOptions(s), n = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : be;
      this._$Em = s;
      const c = n.fromAttribute(t, a.type);
      this[s] = c ?? this._$Ej?.get(s) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, t, r, s = !1, a) {
    if (e !== void 0) {
      const n = this.constructor;
      if (s === !1 && (a = this[e]), r ??= n.getPropertyOptions(e), !((r.hasChanged ?? gt)(a, t) || r.useDefault && r.reflect && a === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, r)))) return;
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
z.elementStyles = [], z.shadowRootOptions = { mode: "open" }, z[W("elementProperties")] = /* @__PURE__ */ new Map(), z[W("finalized")] = /* @__PURE__ */ new Map(), zt?.({ ReactiveElement: z }), (de.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Le = globalThis, je = (i) => i, ie = Le.trustedTypes, Ve = ie ? ie.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, mt = "$lit$", C = `lit$${Math.random().toFixed(9).slice(2)}$`, ft = "?" + C, It = `<${ft}>`, O = document, B = () => O.createComment(""), G = (i) => i === null || typeof i != "object" && typeof i != "function", Oe = Array.isArray, Ht = (i) => Oe(i) || typeof i?.[Symbol.iterator] == "function", ge = `[ 	
\f\r]`, F = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ke = /-->/g, qe = />/g, P = RegExp(`>|${ge}(?:([^\\s"'>=/]+)(${ge}*=${ge}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ye = /'/g, Ze = /"/g, vt = /^(?:script|style|textarea|title)$/i, yt = (i) => (e, ...t) => ({ _$litType$: i, strings: e, values: t }), l = yt(1), Ft = yt(2), I = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), Xe = /* @__PURE__ */ new WeakMap(), L = O.createTreeWalker(O, 129);
function wt(i, e) {
  if (!Oe(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ve !== void 0 ? Ve.createHTML(e) : e;
}
const Ut = (i, e) => {
  const t = i.length - 1, r = [];
  let s, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = F;
  for (let c = 0; c < t; c++) {
    const o = i[c];
    let u, p, h = -1, m = 0;
    for (; m < o.length && (n.lastIndex = m, p = n.exec(o), p !== null); ) m = n.lastIndex, n === F ? p[1] === "!--" ? n = Ke : p[1] !== void 0 ? n = qe : p[2] !== void 0 ? (vt.test(p[2]) && (s = RegExp("</" + p[2], "g")), n = P) : p[3] !== void 0 && (n = P) : n === P ? p[0] === ">" ? (n = s ?? F, h = -1) : p[1] === void 0 ? h = -2 : (h = n.lastIndex - p[2].length, u = p[1], n = p[3] === void 0 ? P : p[3] === '"' ? Ze : Ye) : n === Ze || n === Ye ? n = P : n === Ke || n === qe ? n = F : (n = P, s = void 0);
    const v = n === P && i[c + 1].startsWith("/>") ? " " : "";
    a += n === F ? o + It : h >= 0 ? (r.push(u), o.slice(0, h) + mt + o.slice(h) + C + v) : o + C + (h === -2 ? c : v);
  }
  return [wt(i, a + (i[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class j {
  constructor({ strings: e, _$litType$: t }, r) {
    let s;
    this.parts = [];
    let a = 0, n = 0;
    const c = e.length - 1, o = this.parts, [u, p] = Ut(e, t);
    if (this.el = j.createElement(u, r), L.currentNode = this.el.content, t === 2 || t === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (s = L.nextNode()) !== null && o.length < c; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const h of s.getAttributeNames()) if (h.endsWith(mt)) {
          const m = p[n++], v = s.getAttribute(h).split(C), y = /([.?@])?(.*)/.exec(m);
          o.push({ type: 1, index: a, name: y[2], strings: v, ctor: y[1] === "." ? Bt : y[1] === "?" ? Gt : y[1] === "@" ? jt : he }), s.removeAttribute(h);
        } else h.startsWith(C) && (o.push({ type: 6, index: a }), s.removeAttribute(h));
        if (vt.test(s.tagName)) {
          const h = s.textContent.split(C), m = h.length - 1;
          if (m > 0) {
            s.textContent = ie ? ie.emptyScript : "";
            for (let v = 0; v < m; v++) s.append(h[v], B()), L.nextNode(), o.push({ type: 2, index: ++a });
            s.append(h[m], B());
          }
        }
      } else if (s.nodeType === 8) if (s.data === ft) o.push({ type: 2, index: a });
      else {
        let h = -1;
        for (; (h = s.data.indexOf(C, h + 1)) !== -1; ) o.push({ type: 7, index: a }), h += C.length - 1;
      }
      a++;
    }
  }
  static createElement(e, t) {
    const r = O.createElement("template");
    return r.innerHTML = e, r;
  }
}
function H(i, e, t = i, r) {
  if (e === I) return e;
  let s = r !== void 0 ? t._$Co?.[r] : t._$Cl;
  const a = G(e) ? void 0 : e._$litDirective$;
  return s?.constructor !== a && (s?._$AO?.(!1), a === void 0 ? s = void 0 : (s = new a(i), s._$AT(i, t, r)), r !== void 0 ? (t._$Co ??= [])[r] = s : t._$Cl = s), s !== void 0 && (e = H(i, s._$AS(i, e.values), s, r)), e;
}
class Wt {
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
    L.currentNode = s;
    let a = L.nextNode(), n = 0, c = 0, o = r[0];
    for (; o !== void 0; ) {
      if (n === o.index) {
        let u;
        o.type === 2 ? u = new Y(a, a.nextSibling, this, e) : o.type === 1 ? u = new o.ctor(a, o.name, o.strings, this, e) : o.type === 6 && (u = new Vt(a, this, e)), this._$AV.push(u), o = r[++c];
      }
      n !== o?.index && (a = L.nextNode(), n++);
    }
    return L.currentNode = O, s;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}
class Y {
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
    e = H(this, e, t), G(e) ? e === d || e == null || e === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : e !== this._$AH && e !== I && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ht(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== d && G(this._$AH) ? this._$AA.nextSibling.data = e : this.T(O.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: r } = e, s = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = j.createElement(wt(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === s) this._$AH.p(t);
    else {
      const a = new Wt(s, this), n = a.u(this.options);
      a.p(t), this.T(n), this._$AH = a;
    }
  }
  _$AC(e) {
    let t = Xe.get(e.strings);
    return t === void 0 && Xe.set(e.strings, t = new j(e)), t;
  }
  k(e) {
    Oe(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let r, s = 0;
    for (const a of e) s === t.length ? t.push(r = new Y(this.O(B()), this.O(B()), this, this.options)) : r = t[s], r._$AI(a), s++;
    s < t.length && (this._$AR(r && r._$AB.nextSibling, s), t.length = s);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const r = je(e).nextSibling;
      je(e).remove(), e = r;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class he {
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
    if (a === void 0) e = H(this, e, t, 0), n = !G(e) || e !== this._$AH && e !== I, n && (this._$AH = e);
    else {
      const c = e;
      let o, u;
      for (e = a[0], o = 0; o < a.length - 1; o++) u = H(this, c[r + o], t, o), u === I && (u = this._$AH[o]), n ||= !G(u) || u !== this._$AH[o], u === d ? e = d : e !== d && (e += (u ?? "") + a[o + 1]), this._$AH[o] = u;
    }
    n && !s && this.j(e);
  }
  j(e) {
    e === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Bt extends he {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === d ? void 0 : e;
  }
}
class Gt extends he {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== d);
  }
}
class jt extends he {
  constructor(e, t, r, s, a) {
    super(e, t, r, s, a), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = H(this, e, t, 0) ?? d) === I) return;
    const r = this._$AH, s = e === d && r !== d || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, a = e !== d && (r === d || s);
    s && this.element.removeEventListener(this.name, this, r), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Vt {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    H(this, e);
  }
}
const Kt = Le.litHtmlPolyfillSupport;
Kt?.(j, Y), (Le.litHtmlVersions ??= []).push("3.3.3");
const qt = (i, e, t) => {
  const r = t?.renderBefore ?? e;
  let s = r._$litPart$;
  if (s === void 0) {
    const a = t?.renderBefore ?? null;
    r._$litPart$ = s = new Y(e.insertBefore(B(), a), a, void 0, t ?? {});
  }
  return s._$AI(i), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Re = globalThis;
class E extends z {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = qt(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return I;
  }
}
E._$litElement$ = !0, E.finalized = !0, Re.litElementHydrateSupport?.({ LitElement: E });
const Yt = Re.litElementPolyfillSupport;
Yt?.({ LitElement: E });
(Re.litElementVersions ??= []).push("4.2.2");
const ue = "de-DE";
function f(i) {
  return new Intl.NumberFormat(ue, { maximumFractionDigits: 0 }).format(i);
}
function Zt(i) {
  return new Intl.NumberFormat(ue, {
    maximumFractionDigits: 0,
    signDisplay: "always"
  }).format(i);
}
function X(i) {
  const e = Math.round(i), t = f(Math.abs(e));
  return e > 0 ? `+${t}` : e < 0 ? `−${t}` : t;
}
function Xt(i, e = 1) {
  return new Intl.NumberFormat(ue, {
    minimumFractionDigits: 0,
    maximumFractionDigits: e
  }).format(i);
}
function w(i, e = 1) {
  return new Intl.NumberFormat(ue, {
    minimumFractionDigits: e,
    maximumFractionDigits: e
  }).format(i);
}
function $(i, e, t) {
  return Math.min(t, Math.max(e, i));
}
const Jt = /* @__PURE__ */ new Set(["unavailable", "unknown", "none", "null", ""]), Qt = /^[a-z][a-z0-9_]*\.[a-z0-9_]+$/;
function D(i) {
  return typeof i == "string" && Qt.test(i);
}
const xe = { kind: "unset" }, U = { kind: "unavailable" };
function bt(i, e) {
  const t = e?.states?.[i];
  if (!t || typeof t.state != "string") return null;
  const r = t.state.trim();
  return Jt.has(r.toLowerCase()) ? null : r;
}
function me(i, e, t) {
  const r = e?.states?.[i]?.attributes?.[t];
  if (typeof r == "number") return Number.isFinite(r) ? r : null;
  if (typeof r == "string") {
    const s = Number.parseFloat(r);
    return Number.isFinite(s) ? s : null;
  }
  return null;
}
function De(i, e) {
  const t = e?.states?.[i]?.attributes?.unit_of_measurement;
  if (typeof t != "string") return null;
  const r = t.trim().toLowerCase();
  return r.length > 0 ? r : null;
}
function g(i, e) {
  if (i == null || typeof i == "boolean") return xe;
  if (typeof i == "number")
    return Number.isFinite(i) ? { kind: "value", value: i } : U;
  if (D(i)) {
    const r = bt(i, e);
    if (r === null) return U;
    const s = Number.parseFloat(r);
    return Number.isFinite(s) ? { kind: "value", value: s } : U;
  }
  const t = Number.parseFloat(i);
  return Number.isFinite(t) ? { kind: "value", value: t } : U;
}
function x(i, e) {
  if (i == null) return xe;
  if (typeof i == "boolean") return { kind: "value", value: i ? "on" : "off" };
  if (typeof i == "number") return { kind: "value", value: String(i) };
  if (D(i)) {
    const r = bt(i, e);
    return r === null ? U : { kind: "value", value: r };
  }
  const t = i.trim();
  return t.length > 0 ? { kind: "value", value: t } : xe;
}
const xt = /* @__PURE__ */ new Set(["number", "input_number"]), Z = /* @__PURE__ */ new Set(["switch", "input_boolean"]), V = /* @__PURE__ */ new Set(["select", "input_select"]), er = /* @__PURE__ */ new Set(["on", "true", "1", "yes", "an", "ein"]);
function R(i) {
  const e = i.indexOf(".");
  return e === -1 ? "" : i.slice(0, e);
}
function K(i, e) {
  return typeof i == "string" && D(i) && e.has(R(i));
}
function J(i) {
  return K(i, xt);
}
function Je(i) {
  return K(i, Z);
}
function kt(i) {
  if (!i || typeof i != "object") return !1;
  const e = i.entity;
  return K(e, V) || K(e, Z);
}
function Ne(i, e, t, r) {
  if (typeof i?.callService != "function")
    return Promise.reject(new Error("des-storage-card: hass.callService fehlt"));
  try {
    return Promise.resolve(i.callService(e, t, r));
  } catch (s) {
    return Promise.reject(s);
  }
}
function Qe(i, e, t) {
  const r = R(e);
  return xt.has(r) ? Ne(i, r, "set_value", { entity_id: e, value: t }) : Promise.reject(
    new Error(`des-storage-card: ${e} ist keine number-Entität`)
  );
}
function ke(i, e, t) {
  const r = R(e);
  return Z.has(r) ? Ne(i, r, t ? "turn_on" : "turn_off", { entity_id: e }) : Promise.reject(
    new Error(`des-storage-card: ${e} ist kein Schalter`)
  );
}
function tr(i, e, t) {
  const r = R(e);
  return V.has(r) ? Ne(i, r, "select_option", { entity_id: e, option: t }) : Promise.reject(
    new Error(`des-storage-card: ${e} ist keine select-Entität`)
  );
}
function $t(i, e) {
  if (e === "off") return i.off_state;
  const t = e === "charge" ? i.charge_state : i.auto_state;
  return t !== void 0 ? t : K(i.entity, Z) ? e === "charge" ? "on" : "off" : void 0;
}
function rr(i, e) {
  const t = $t(i, "charge");
  return t === void 0 ? !1 : t.trim().toLowerCase() === e.trim().toLowerCase();
}
function sr(i, e) {
  const t = i.off_state;
  return t === void 0 ? !1 : t.trim().toLowerCase() === e.trim().toLowerCase();
}
function ir(i) {
  if (i === null || typeof i != "object")
    return '"charge_mode_control" muss ein Objekt mit "entity" sein';
  const { entity: e, charge_state: t, auto_state: r, off_state: s } = i;
  if (typeof e != "string" || e.length === 0)
    return '"charge_mode_control" braucht "entity"';
  if (!kt(i))
    return `"charge_mode_control.entity" muss select, input_select, switch oder input_boolean sein (ist: ${e})`;
  if (s !== void 0 && !V.has(R(e)))
    return `"charge_mode_control.off_state" gibt es nur für select/input_select (ist: ${e})`;
  if (V.has(R(e))) {
    const a = [
      t === void 0 ? "charge_state" : null,
      r === void 0 ? "auto_state" : null
    ].filter((n) => n !== null);
    if (a.length > 0)
      return `"charge_mode_control" braucht ${a.join(" und ")} für ${e}`;
  }
  return null;
}
function ar(i, e, t) {
  const r = e.entity, s = R(r), a = $t(e, t);
  if (V.has(s)) {
    if (a === void 0) {
      const n = t === "charge" ? "charge_state" : t === "auto" ? "auto_state" : "off_state";
      return Promise.reject(
        new Error(
          `des-storage-card: charge_mode_control braucht ${n} für ${r}`
        )
      );
    }
    return tr(i, r, a);
  }
  return Z.has(s) ? ke(i, r, er.has((a ?? "").toLowerCase())) : Promise.reject(
    new Error(`des-storage-card: ${r} wird als Lademodus nicht unterstützt`)
  );
}
const pe = S`
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
function q(i, e, t, r, s = !1) {
  return l`
    <div
      class="seg ${s || e === null ? "unknown" : ""}"
      role="group"
      aria-label=${r}
      title=${s ? "Nicht verfügbar" : e === null ? "Zustand nicht lesbar" : d}
    >
      ${i.map(
    ({ value: n, label: c }) => l`
          <button
            type="button"
            class=${e === n ? "active" : ""}
            aria-pressed=${e === n ? "true" : "false"}
            ?disabled=${s}
            @click=${(o) => {
      o.stopPropagation(), t(n);
    }}
          >
            ${c}
          </button>
        `
  )}
    </div>
  `;
}
const ze = S`
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
`, Ie = S`
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
class He {
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
const Et = {
  charging: "Lädt",
  discharging: "Entlädt",
  idle: "Bereit",
  heating: "Heizt",
  off: "Aus"
}, fe = { min: 10, max: 80, step: 5 }, ve = { min: 50, max: 100, step: 5 }, ye = { min: 100, max: 2400, step: 50 }, et = 5, nr = 12, or = 2, lr = 1, cr = 20, dr = 1, hr = 300, ur = 6e4, pr = 3e4, tt = 5, rt = 10, st = 48, _r = 500, gr = 8e3, mr = /* @__PURE__ */ new Set([
  "not charging",
  "not discharging",
  "unknown",
  "unavailable",
  "none",
  "-",
  "--"
]), fr = [
  { value: "charge", label: "Laden" },
  { value: "auto", label: "Auto" }
], vr = [
  { value: "charge", label: "Laden" },
  { value: "auto", label: "Auto" },
  { value: "off", label: "Aus" }
], yr = [
  { value: "on", label: "An" },
  { value: "auto", label: "Auto" },
  { value: "off", label: "Aus" }
], wr = {
  1: "on",
  2: "auto",
  3: "off"
}, br = {
  on: 1,
  auto: 2,
  off: 3
};
function xr(i) {
  const e = i.trim().toLowerCase();
  return e === "standby" ? "idle" : e in Et ? e : null;
}
function kr(i) {
  const e = i.trim().toLowerCase();
  return e === "on" || e === "auto" || e === "off" ? e : "auto";
}
function Q(i, e) {
  const { min: t, max: r, step: s } = e;
  if (!(s > 0)) return $(i, t, r);
  const a = Math.round((i - t) / s), n = Number((t + a * s).toFixed(6));
  return $(n, t, r);
}
function $r(i) {
  if (!Number.isFinite(i) || Number.isInteger(i)) return 0;
  const e = String(i), t = e.indexOf(".");
  return t === -1 ? 0 : Math.min(3, e.length - t - 1);
}
function we(i, e) {
  const t = $r(e);
  return t === 0 ? f(i) : w(i, t);
}
function Er(i) {
  if (!Number.isFinite(i) || i <= 0) return null;
  if (i > st) return `> ${st} h`;
  const e = Math.round(i * 60 / tt) * tt;
  return e < rt ? `< ${rt} min` : `${Math.floor(e / 60)}h ${e % 60}m`;
}
function St(i) {
  return i < 4 || i > 50 ? "alert" : i < 8 || i > 40 ? "warn" : "neutral";
}
function Sr(i) {
  const e = St(i);
  return e === "neutral" ? "badge-neutral" : `badge-${e}`;
}
const ae = class ae extends E {
  constructor() {
    super(), this._writeTimers = /* @__PURE__ */ new Map(), this._settleTimers = /* @__PURE__ */ new Map(), this._closer = new He(this, () => this._collapse()), this._powerAverage = null, this._averageDirection = 0, this._averageStartedAt = 0, this._averageUpdatedAt = 0, this._pendingDirection = 0, this._pendingSince = 0, this._expanded = !1, this._thresholdLocal = null, this._targetLocal = null, this._dischargeLocal = null, this._chargeModeLocal = null, this._backupSwitchLocal = null, this._itemModesLocal = [];
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
      const t = ir(e.charge_mode_control);
      if (t !== null) throw new Error(`des-storage-card: ${t}`);
    }
    if (e.variant === "thermal_group") {
      const t = e.items;
      if (!Array.isArray(t) || t.length === 0)
        throw new Error(
          'des-storage-card: "items" braucht mindestens einen Eintrag'
        );
      if (t.length > et)
        throw new Error(
          `des-storage-card: "items" erlaubt höchstens ${et} Einträge`
        );
      if (t.some((r) => !r || !r.name))
        throw new Error('des-storage-card: jeder Eintrag in "items" braucht "name"');
      for (const r of t)
        if (r.mode_entity !== void 0 && !J(r.mode_entity))
          throw new Error(
            `des-storage-card: "mode_entity" muss eine number- oder input_number-Entität sein (ist: ${r.mode_entity})`
          );
      this._itemModesLocal = t.map(() => null);
    }
    this._config = e, this._expanded = !1, this._thresholdLocal = null, this._targetLocal = null, this._dischargeLocal = null, this._chargeModeLocal = null, this._backupSwitchLocal = null;
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
      }, gr)
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
        this._rangeFor(e.threshold_pct, fe)
      ) && (this._thresholdLocal = null, this._clearSettle("threshold")), this._targetLocal !== null && this._entityMatches(
        e.charge_target_pct,
        this._targetLocal,
        this._rangeFor(e.charge_target_pct, ve)
      ) && (this._targetLocal = null, this._clearSettle("target")), this._dischargeLocal !== null && this._entityMatches(
        e.discharge_limit_entity,
        this._dischargeLocal,
        this._rangeFor(e.discharge_limit_entity, ye)
      ) && (this._dischargeLocal = null, this._clearSettle("discharge"));
      const a = e.charge_mode_control;
      if (this._chargeModeLocal !== null && a?.entity) {
        const c = this._chargeModeFromEntity(a);
        c !== null && c === this._chargeModeLocal && (this._chargeModeLocal = null, this._clearSettle("chargeMode"));
      }
      const n = e.backup;
      if (this._backupSwitchLocal !== null && n && typeof n != "string" && n.switch_entity) {
        const c = x(n.switch_entity, this.hass);
        c.kind === "value" && c.value.trim().toLowerCase() === "on" === this._backupSwitchLocal && (this._backupSwitchLocal = null, this._clearSettle("backupSwitch"));
      }
      return;
    }
    const t = e.items ?? [];
    let r = !1;
    const s = [...this._itemModesLocal];
    t.forEach((a, n) => {
      const c = s[n];
      if (!c) return;
      const o = this._itemModeFromEntity(a);
      o === null || o !== c || (s[n] = null, r = !0, this._clearSettle(`item:${n}`));
    }), r && (this._itemModesLocal = s);
  }
  /** True when the slot is entity-bound and already carries exactly `local`. */
  _entityMatches(e, t, r) {
    if (typeof e != "string" || !D(e)) return !1;
    const s = g(e, this.hass);
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
    if (!J(e)) return t;
    const r = e, s = me(r, this.hass, "min") ?? t.min, a = me(r, this.hass, "max") ?? t.max, n = me(r, this.hass, "step") ?? t.step;
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
    const e = this._config?.variant === "thermal_group" ? lr + (this._config.items?.length ?? 0) : or;
    return { columns: nr, rows: e, min_rows: e };
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
    return l`
      <ha-card>
        <div class="card">
          ${e.variant === "battery" ? this._renderBattery(e) : this._renderThermalGroup(e)}
        </div>
        ${t && this._expanded ? l`<div class="overlay">${this._renderBatteryControls(e)}</div>` : d}
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
    let t = g(e.power_w, this.hass);
    if (t.kind === "unset" && e.voltage_entity && e.current_entity) {
      const a = g(e.voltage_entity, this.hass), n = g(e.current_entity, this.hass);
      t = a.kind === "value" && n.kind === "value" ? { kind: "value", value: a.value * n.value } : { kind: "unavailable" };
    }
    if (t.kind !== "value") return t;
    let r = e.invert_power ? -t.value : t.value;
    const s = g(e.power_share, this.hass);
    return s.kind === "unavailable" ? { kind: "unavailable" } : (r *= s.kind === "value" ? s.value : dr, { kind: "value", value: r });
  }
  /** Absolute watts below which the battery reads as idle. */
  _idleThreshold(e) {
    const t = g(e.idle_threshold_w, this.hass);
    return t.kind === "value" && t.value >= 0 ? t.value : cr;
  }
  /** Configured status, else derived from the power sign. */
  _status(e, t) {
    const r = x(e.status, this.hass);
    if (r.kind === "value") {
      const s = xr(r.value);
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
    const s = g(e.energy_kwh, this.hass);
    return s.kind !== "unset" ? s : t.kind === "value" && r.kind === "value" ? { kind: "value", value: t.value * r.value / 100 } : t.kind === "unavailable" || r.kind === "unavailable" ? { kind: "unavailable" } : { kind: "unset" };
  }
  /**
   * Feeds the display power into the exponential mean.
   *
   * Idle samples are skipped rather than averaged in: a battery resting at a
   * few watts would drag the mean towards zero and inflate the estimate.
   *
   * A change of direction does **not** immediately reset the mean. The old
   * mean, and with it the last estimate, is kept while the opposite direction
   * is only tentative; the reset happens only once the new direction has held
   * for `DIRECTION_FLIP_HOLD_MS`. That keeps a shared sensor's second-by-second
   * flutter from restarting the warm-up window and wiping the estimate.
   */
  _updatePowerAverage(e) {
    const t = this._power(e);
    if (t.kind !== "value") return;
    const r = this._idleThreshold(e), s = t.value >= r ? 1 : t.value <= -r ? -1 : 0;
    if (s === 0) {
      this._pendingDirection = 0;
      return;
    }
    const a = Date.now();
    if (this._powerAverage === null || this._averageDirection === 0) {
      this._commitAverage(s, t.value, a);
      return;
    }
    if (s === this._averageDirection) {
      this._pendingDirection = 0;
      const n = Math.max(0, (a - this._averageUpdatedAt) / 1e3);
      this._averageUpdatedAt = a;
      const c = 1 - Math.exp(-n / hr);
      this._powerAverage += c * (t.value - this._powerAverage);
      return;
    }
    this._pendingDirection !== s && (this._pendingDirection = s, this._pendingSince = a), a - this._pendingSince >= pr && this._commitAverage(s, t.value, a);
  }
  /** Starts a fresh mean in `direction`, resetting the warm-up window. */
  _commitAverage(e, t, r) {
    this._averageDirection = e, this._powerAverage = t, this._averageStartedAt = r, this._averageUpdatedAt = r, this._pendingDirection = 0;
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
    if (t.kind !== "value") return { text: null, state: "no-power" };
    if (Math.abs(t.value) < this._idleThreshold(e))
      return { text: null, state: "idle" };
    const r = t.value > 0;
    let s = e.time_remaining;
    if (s === void 0 && (s = r ? e.time_remaining_charging : e.time_remaining_discharging), s !== void 0) {
      const a = x(s, this.hass);
      return a.kind !== "value" ? { text: null, state: "device" } : mr.has(a.value.trim().toLowerCase()) ? { text: null, state: "device" } : { text: a.value, state: "device" };
    }
    return this._estimateResult(e);
  }
  /**
   * Discharging: how long until the minimum state of charge.
   * Charging:    how long until the charge target.
   *
   * Uses the smoothed power and the mean's own (committed) direction - not the
   * momentary sign, so a tentative flip keeps showing the last estimate. Stays
   * silent until the mean has enough history to mean anything.
   */
  _estimateResult(e) {
    if (this._powerAverage === null) return { text: null, state: "no-data" };
    if (Date.now() - this._averageStartedAt < ur)
      return { text: null, state: "warmup" };
    const t = Math.abs(this._powerAverage);
    if (t < this._idleThreshold(e)) return { text: null, state: "idle" };
    const r = g(e.soc, this.hass), s = g(e.capacity_kwh, this.hass);
    if (r.kind !== "value" || s.kind !== "value")
      return { text: null, state: "no-soc" };
    const a = this._averageDirection > 0, n = a ? this._chargeTarget(e) : this._threshold(e);
    if (n === null) return { text: null, state: "no-limit" };
    const c = a ? n - r.value : r.value - n;
    if (c <= 0) return { text: null, state: "below-min" };
    const o = Er(
      c / 100 * s.value / (t / 1e3)
    );
    return o === null ? { text: null, state: "out-of-range" } : { text: o, state: this._pendingDirection !== 0 ? "flip" : "ok" };
  }
  _backup(e) {
    const t = e.backup;
    if (!t || t === "none") return "none";
    if (typeof t == "string")
      return t === "active" || t === "ready" || t === "off" ? t : "none";
    const r = x(t.entity, this.hass);
    return r.kind !== "value" ? "none" : (t.active_states ?? []).some(
      (a) => a.trim().toLowerCase() === r.value.toLowerCase()
    ) ? "ready" : "off";
  }
  _threshold(e) {
    if (this._thresholdLocal !== null) return this._thresholdLocal;
    const t = g(e.threshold_pct, this.hass);
    return t.kind === "value" ? Q(t.value, this._rangeFor(e.threshold_pct, fe)) : null;
  }
  _chargeTarget(e) {
    if (this._targetLocal !== null) return this._targetLocal;
    const t = g(e.charge_target_pct, this.hass);
    return t.kind === "value" ? Q(t.value, this._rangeFor(e.charge_target_pct, ve)) : null;
  }
  /**
   * The entity is the source of truth: the slider start value comes from the
   * bound `input_number`'s current state (snapped to its own range), never from
   * a default or the range maximum. `_dischargeLocal` only shadows it while an
   * optimistic write is in flight and is dropped again in `willUpdate` as soon
   * as the entity confirms - so after a reload the slider shows whatever the
   * helper actually holds. (A helper with an `initial:` would reset itself on a
   * restart; that is fixed helper-side, not here.)
   */
  _dischargeLimit(e) {
    if (this._dischargeLocal !== null) return this._dischargeLocal;
    const t = g(e.discharge_limit_entity, this.hass);
    return t.kind === "value" ? Q(
      t.value,
      this._rangeFor(e.discharge_limit_entity, ye)
    ) : null;
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
    if (t?.entity)
      return this._chargeModeFromEntity(t);
    const r = x(e.charge_mode, this.hass);
    return r.kind === "value" && r.value.trim().toLowerCase() === "charge" ? "charge" : "auto";
  }
  /**
   * The mode the control's entity currently reports, ignoring any local
   * override. `off` only when an `off_state` matches; `null` when the entity
   * cannot be read (so no segment is highlighted).
   */
  _chargeModeFromEntity(e) {
    const t = x(e.entity, this.hass);
    return t.kind !== "value" ? null : sr(e, t.value) ? "off" : rr(e, t.value) ? "charge" : "auto";
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
    return s.kind === "value" ? kr(s.value) : this._itemModeFromEntity(e) ?? "auto";
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
      return wr[r] ?? null;
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
    const t = g(e.soc, this.hass), r = g(e.capacity_kwh, this.hass), s = this._power(e), a = this._energy(e, t, r), n = this._status(e, s), c = this._backup(e), o = this._timeRemaining(e, s), u = x(e.time_at, this.hass), p = [o.text, u.kind === "value" ? u.value : null].filter((m) => m !== null).join(" · "), h = e.controls !== !1;
    return l`
      <div class="header">
        <div class="head-left">
          <span class="name">${e.name}</span>
        </div>
        <div class="badges">
          ${this._renderCapacityBadge(r)}
          ${this._renderTemperatureBadge(e)}
          ${c === "none" ? d : this._renderBackupBadge(c)}
          ${this._renderBadge(Et[n], `status-${n}`)}
        </div>
      </div>

      <div class="main">
        ${this._renderBatteryIcon(t)}
        <div class="readout">
          <span class="soc">
            ${t.kind === "value" ? `${f(t.value)} %` : this._dash()}
          </span>
          ${a.kind === "unset" ? d : l`<span class="energy">
                ${a.kind === "value" ? `${w(a.value)} kWh` : this._dash()}
              </span>`}
        </div>
        <div class="timing">
          ${s.kind === "unset" ? d : l`<div class=${this._powerClass(s, this._idleThreshold(e))}>
                ${s.kind === "value" ? this._formatPower(s.value) : this._dash()}
              </div>`}
          <!-- Always in the DOM so a missing estimate is inspectable via
               data-eta-state; hidden (no layout) while there is nothing to show. -->
          <div class="muted" data-eta-state=${o.state} ?hidden=${p.length === 0}>
            ${p}
          </div>
        </div>
      </div>

      ${h ? l`<div
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
   * up. The charge-mode control sits to their right, centred over both rows -
   * or, with a three-part (Laden|Auto|Aus) control, on its own row above them.
   * Optional per-pack rows and an emergency-outlet switch follow underneath.
   */
  _renderBatteryControls(e) {
    const t = this._chargeMode(e), r = this._chargeTarget(e), s = this._threshold(e), a = this._rangeFor(e.charge_target_pct, ve), n = this._rangeFor(e.threshold_pct, fe), c = typeof e.discharge_limit_entity == "string" && e.discharge_limit_entity.trim().length > 0, o = c ? this._dischargeLimit(e) : null, u = this._rangeFor(e.discharge_limit_entity, ye), p = e.charge_mode_control?.off_state, h = typeof p == "string" && p.trim().length > 0, m = q(
      h ? vr : fr,
      t,
      (A) => this._setChargeMode(A),
      "Lademodus"
    ), v = e.packs ?? [], y = e.backup, k = y && typeof y != "string" ? y.switch_entity : void 0;
    return l`
      <div class="controls">
        ${h ? l`<div class="mode-row">${m}</div>` : d}
        <div class="ctl-main">
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
            ${r === null ? this._dash() : `${we(r, a.step)} %`}
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
            ${s === null ? this._dash() : `${we(s, n.step)} %`}
          </span>

          ${c ? l`
                <span class="ctl-label">max. Entladen</span>
                <input
                  class="slider"
                  type="range"
                  min=${u.min}
                  max=${u.max}
                  step=${u.step}
                  .value=${String(o ?? u.min)}
                  aria-label="Maximale Entladeleistung"
                  @input=${this._onDischargeInput}
                  @change=${this._onDischargeChange}
                />
                <span class="ctl-value">
                  ${o === null ? this._dash() : `${we(o, u.step)} W`}
                </span>
              ` : d}
          </div>
          ${h ? d : m}
        </div>
        ${k ? this._renderBackupSwitchRow(e, k) : d}
        ${v.length > 0 ? l`<table class="packs">
              <thead>
                <tr>
                  <th class="pack-col-name">Akku</th>
                  <th>kWh</th>
                  <th>SoC</th>
                  <th>°C</th>
                  <th>Zellen</th>
                </tr>
              </thead>
              <tbody>
                ${v.map((A) => this._renderPack(A))}
              </tbody>
            </table>` : d}
      </div>
    `;
  }
  /**
   * One pack table row: name, stored energy, soc, temperature (traffic-light
   * coloured) and cell balance. Units live in the header, so the cells stay
   * bare numbers; a value the card cannot read shows a muted dash. (No SoH: the
   * Zendure does not expose a per-pack state of health locally.)
   */
  _renderPack(e) {
    const t = g(e.soc, this.hass), r = g(e.capacity_kwh, this.hass), s = g(e.temp_c, this.hass), a = x(e.balance, this.hass), n = t.kind === "value" && r.kind === "value" ? t.value * r.value / 100 : null, c = s.kind === "value" ? St(s.value) : "neutral";
    return l`
      <tr>
        <td class="pack-col-name">${e.name}</td>
        <td>${n !== null ? w(n) : this._dash()}</td>
        <td>${t.kind === "value" ? `${f(t.value)} %` : this._dash()}</td>
        <td class="pack-temp ${c}">
          ${s.kind === "value" ? w(s.value) : this._dash()}
        </td>
        <td>${a.kind === "value" ? a.value : this._dash()}</td>
      </tr>
    `;
  }
  /** "Notstromsteckdose" row with a switch, under the sliders / pack rows. */
  _renderBackupSwitchRow(e, t) {
    const r = this._backupSwitchOn(e), s = r !== null;
    return l`
      <div class="switch-row">
        <span class="ctl-label ${s ? "" : "disabled"}">Notstromsteckdose</span>
        <ha-switch
          .checked=${r === !0}
          .disabled=${!s}
          aria-label="Notstromsteckdose"
          title=${s ? d : "Zustand nicht lesbar"}
          @change=${(a) => this._setBackupSwitch(
      t,
      a.target.checked
    )}
        ></ha-switch>
      </div>
    `;
  }
  /** Capacity as a neutral pill; omitted when not configured. */
  _renderCapacityBadge(e) {
    return e.kind === "unset" ? d : this._renderBadge(
      e.kind === "value" ? `${w(e.value)} kWh` : l`${this._dash()} kWh`,
      "badge-neutral"
    );
  }
  /** Temperature as a pill, colour-coded on the same thresholds as before. */
  _renderTemperatureBadge(e) {
    const t = g(e.temp_c, this.hass);
    return t.kind === "unset" ? d : t.kind === "unavailable" ? this._renderBadge(l`${this._dash()} °C`, "badge-neutral") : this._renderBadge(
      `${w(t.value)} °C`,
      Sr(t.value)
    );
  }
  /** Upright battery; the fill grows from the bottom. */
  _renderBatteryIcon(e) {
    const t = e.kind === "value" ? $(e.value, 0, 100) : 0, r = e.kind !== "value" ? "transparent" : t > 50 ? "var(--success-color, #2e7d32)" : t >= 20 ? "var(--warning-color, #ff9800)" : "var(--error-color, #d32f2f)", s = 6, a = 26, n = a * t / 100, c = s + (a - n);
    return l`
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
    const t = e.items ?? [], r = t.map((o) => g(o.power_w, this.hass)), s = t.map((o) => g(o.energy_kwh, this.hass)), a = this._sum(s), n = this._sum(r), c = r.filter(
      (o) => o.kind === "value" && o.value > 0
    ).length;
    return l`
      <div class="header">
        <div class="head-left">
          <span class="name">${e.name}</span>
        </div>
        <div class="badges">
          <!-- Heating charges the heat store, so it reads as "charging". -->
          ${this._renderBadge(
      c > 0 ? `${f(c)} heizen` : "Aus",
      c > 0 ? "status-charging" : "status-off"
    )}
        </div>
      </div>

      <div class="main">
        <ha-icon class="fish" icon="mdi:fish"></ha-icon>
        <div class="readout stacked">
          <span class="soc">
            ${a === null ? this._dash() : `${w(a)} kWh`}
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
      (o, u) => this._renderItem(o, u, r[u], s[u])
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
    return l`
      <div class="item">
        <div class="item-head">
          ${e.switch_entity ? l`<span
                class="dot ${this._switchOn(e.switch_entity) ? "dot-on" : ""}"
              ></span>` : d}
          <span class="item-name">${e.name}</span>
        </div>
        <span class="item-energy">
          ${s.kind === "value" ? `${w(s.value)} kWh` : s.kind === "unavailable" ? this._dash() : ""}
        </span>
        <span class=${a ? "item-power positive" : "item-power"}>
          ${r.kind === "value" ? this._formatPower(r.value) : r.kind === "unavailable" ? this._dash() : ""}
        </span>
        ${q(
      yr,
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
    return l`<span class="unavail">–</span>`;
  }
  /**
   * The label sits in its own element so it can be nudged down optically.
   * Metric centring alone reads as too high - see `.badge-label` in the styles.
   */
  _renderBadge(e, t) {
    return l`<span class="badge ${t}">
      <span class="badge-label">${e}</span>
    </span>`;
  }
  _renderBackupBadge(e) {
    return e === "active" ? this._renderBadge("NOTSTROM AKTIV", "backup-active") : e === "off" ? this._renderBadge("Notstrom aus", "backup-off") : this._renderBadge("Notstrom bereit", "backup-ready");
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
    return `${t === 0 ? f(0) : Zt(t)} W`;
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
    !t?.entity || !kt(t) || (this._holdOptimistic("chargeMode", () => {
      this._chargeModeLocal = null;
    }), this._write(ar(this.hass, t, e), () => {
      this._clearSettle("chargeMode"), this._chargeModeLocal = null;
    }));
  }
  /** On/off of the emergency outlet; `null` when it cannot be read. */
  _backupSwitchOn(e) {
    if (this._backupSwitchLocal !== null) return this._backupSwitchLocal;
    const t = e.backup;
    if (!t || typeof t == "string" || !t.switch_entity) return null;
    const r = x(t.switch_entity, this.hass);
    return r.kind !== "value" ? null : r.value.trim().toLowerCase() === "on";
  }
  _setBackupSwitch(e, t) {
    this._backupSwitchLocal = t, Je(e) && (this._holdOptimistic("backupSwitch", () => {
      this._backupSwitchLocal = null;
    }), this._write(ke(this.hass, e, t), () => {
      this._clearSettle("backupSwitch"), this._backupSwitchLocal = null;
    }));
  }
  /** Dragging only moves the UI; the write happens on release. */
  _onTargetInput(e) {
    this._targetLocal = Number(e.target.value);
  }
  _onThresholdInput(e) {
    this._thresholdLocal = Number(e.target.value);
  }
  _onDischargeInput(e) {
    this._dischargeLocal = Number(e.target.value);
  }
  _onTargetChange(e) {
    const t = Number(e.target.value);
    this._targetLocal = t, this._scheduleNumberWrite("target", this._config?.charge_target_pct, t);
  }
  _onThresholdChange(e) {
    const t = Number(e.target.value);
    this._thresholdLocal = t, this._scheduleNumberWrite("threshold", this._config?.threshold_pct, t);
  }
  _onDischargeChange(e) {
    const t = Number(e.target.value);
    this._dischargeLocal = t, this._scheduleNumberWrite("discharge", this._config?.discharge_limit_entity, t);
  }
  /** Drops the optimistic local value of one slider. */
  _clearSliderLocal(e) {
    e === "threshold" ? this._thresholdLocal = null : e === "target" ? this._targetLocal = null : this._dischargeLocal = null;
  }
  _scheduleNumberWrite(e, t, r) {
    if (!J(t)) return;
    const s = t, a = this._writeTimers.get(e);
    a !== void 0 && window.clearTimeout(a), this._writeTimers.set(
      e,
      window.setTimeout(() => {
        this._writeTimers.delete(e), this._holdOptimistic(e, () => this._clearSliderLocal(e)), this._write(Qe(this.hass, s, r), () => {
          this._clearSettle(e), this._clearSliderLocal(e);
        });
      }, _r)
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
      if (!J(s.mode_entity)) return;
      this._holdOptimistic(`item:${e}`, a), this._write(
        Qe(this.hass, s.mode_entity, br[t]),
        () => {
          this._clearSettle(`item:${e}`), a();
        }
      );
      return;
    }
    const n = s?.switch_entity;
    t === "auto" || !Je(n) || (this._holdOptimistic(`item:${e}`, a), this._write(ke(this.hass, n, t === "on"), () => {
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
ae.properties = {
  // Assigning `hass` is a reactive property write, so Home Assistant's
  // state updates re-render the card without a custom setter.
  hass: { attribute: !1 },
  _config: { state: !0 },
  _thresholdLocal: { state: !0 },
  _targetLocal: { state: !0 },
  _dischargeLocal: { state: !0 },
  _chargeModeLocal: { state: !0 },
  _backupSwitchLocal: { state: !0 },
  _expanded: { state: !0 },
  _itemModesLocal: { state: !0 }
}, ae.styles = [
  pe,
  ze,
  Ie,
  S`
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

    /* Emergency outlet off - red, but not the loud all-caps "aktiv" alarm. */
    .backup-off {
      background: rgba(211, 47, 47, 0.16);
      background: color-mix(in srgb, var(--error-color, #d32f2f) 16%, transparent);
      color: var(--error-color, #d32f2f);
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

    /* A column: optional mode row, the sliders (+ inline mode control), the
       pack rows, and the emergency-outlet switch. */
    .controls {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* Sliders and - without a three-part control - the mode toggle beside them. */
    .ctl-main {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    /* Three-part control (Laden|Auto|Aus) on its own row, right-aligned. */
    .mode-row {
      display: flex;
      justify-content: flex-end;
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

    /* --- battery pack table --- */

    .packs {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      /* Sits below the switch row / sliders; a top rule sections it off. */
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.18));
    }

    /* Values right-aligned; units are carried by the header, not the cells. The
       row height (6px top/bottom) matches the thermal-group item rows. */
    .packs th,
    .packs td {
      padding: 6px 6px;
      text-align: right;
      white-space: nowrap;
      color: var(--secondary-text-color);
    }

    .packs th:first-child,
    .packs td:first-child {
      padding-left: 0;
    }

    .packs th:last-child,
    .packs td:last-child {
      padding-right: 0;
    }

    .packs thead th {
      font-weight: 500;
      border-bottom: 1px solid var(--divider-color, rgba(127, 127, 127, 0.18));
    }

    .packs tbody td {
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.18));
    }

    /* The header rule already separates the first data row. */
    .packs tbody tr:first-child td {
      border-top: none;
    }

    .pack-col-name {
      text-align: left;
    }

    td.pack-col-name {
      color: var(--primary-text-color);
      font-weight: 500;
    }

    /* Same traffic light as the header temperature pill, applied to the text. */
    td.pack-temp.warn {
      color: var(--warning-color, #ff9800);
    }

    td.pack-temp.alert {
      color: var(--error-color, #d32f2f);
    }

    /* --- emergency-outlet switch row --- */

    .switch-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding-top: 8px;
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.18));
    }

    /* HA sizes ha-switch for touch, which dwarfs the sliders. Scale it onto the
       card's control size and claw back the height its larger box would add, so
       the row stays as low as a slider row. */
    .switch-row ha-switch {
      flex-shrink: 0;
      transform: scale(0.72);
      transform-origin: center right;
      margin: -6px 0;
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
let $e = ae;
const Fe = S`
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
`, Ar = /* @__PURE__ */ new Set([
  "normal",
  "alarm",
  "night"
]), Cr = 12.5, Tr = 6.5, Pr = 6, Mr = 0.5, Lr = 500, Or = 40, it = 4, Rr = 12, Dr = ["L1", "L2", "L3"], Nr = {
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
function _(i) {
  return typeof i == "string" && i.trim().length > 0;
}
function M(i) {
  return Array.isArray(i) && i.some(_);
}
function ee(i) {
  const e = i.filter((t) => t !== null);
  return e.length > 0 ? e.reduce((t, r) => t + r, 0) : null;
}
const zr = 2, Ir = 6e4, Hr = 2500, T = (i) => String(i).padStart(2, "0");
function Fr(i) {
  const e = i.trim();
  if (e.length === 0) return null;
  const t = e.includes("T") ? e : e.replace(" ", "T"), r = new Date(t);
  return Number.isNaN(r.getTime()) ? null : r;
}
function Ur(i) {
  return `${T(i.getDate())}.${T(i.getMonth() + 1)}.${i.getFullYear()} ${T(i.getHours())}:${T(i.getMinutes())}`;
}
function Wr() {
  const i = /* @__PURE__ */ new Date();
  return `${i.getFullYear()}-${T(i.getMonth() + 1)}-${T(i.getDate())} ${T(i.getHours())}:${T(i.getMinutes())}:00`;
}
const ne = class ne extends E {
  constructor() {
    super(), this._closer = new He(this, () => this._collapse()), this._expanded = !1, this._clockTick = 0, this._timeSetDone = !1;
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
    const e = _(this._config?.time_entity);
    e && this._clockTimer === void 0 ? this._clockTimer = window.setInterval(() => {
      this._clockTick += 1;
    }, Ir) : e || this._stopClockTimer();
  }
  _stopClockTimer() {
    this._clockTimer !== void 0 && (window.clearInterval(this._clockTimer), this._clockTimer = void 0);
  }
  _warnMinutes() {
    const e = this._config?.time_warn_minutes;
    return typeof e == "number" && Number.isFinite(e) && e >= 0 ? e : zr;
  }
  /** Signed deviation in minutes; positive means the inverter runs ahead. */
  _clockReading() {
    const e = this._config?.time_entity;
    if (!_(e)) return { kind: "off" };
    const t = this._text(e);
    if (t === null) return { kind: "unavailable" };
    const r = Fr(t);
    return r === null ? { kind: "unavailable" } : { kind: "value", at: r, minutes: (r.getTime() - Date.now()) / 6e4 };
  }
  _clockOffBy(e) {
    return e.kind === "value" && Math.abs(e.minutes) >= this._warnMinutes();
  }
  /** Amber only past the threshold; grey when the entity cannot be read. */
  _renderClockPill(e) {
    return e.kind === "off" ? d : e.kind === "unavailable" ? l`<span class="pill">
        <span class="pill-label">Uhr ?</span>
      </span>` : this._clockOffBy(e) ? l`<span class="pill pill-alarm">
      <span class="pill-label">
        Uhr ${X(e.minutes)} min
      </span>
    </span>` : d;
  }
  _renderClockRow(e) {
    if (e.kind === "off") return d;
    const t = e.kind === "value", r = t && this._clockOffBy(e);
    return l`
      <div class="clock-row">
        <span class="foot-label">Wechselrichter-Uhr</span>
        <span class="clock-value">
          ${t ? l`${Ur(e.at)}
                <span class="clock-delta">
                  (Δ ${X(e.minutes)} min)
                </span>` : l`<span class="unavail">–</span>`}
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
    !_(e) || typeof this.hass?.callService != "function" || Promise.resolve(
      this.hass.callService("datetime", "set_value", {
        entity_id: e,
        datetime: Wr()
      })
    ).then(() => {
      this._timeSetDone = !0, this._feedbackTimer !== void 0 && window.clearTimeout(this._feedbackTimer), this._feedbackTimer = window.setTimeout(() => {
        this._feedbackTimer = void 0, this._timeSetDone = !1;
      }, Hr);
    }).catch((t) => {
      console.error("des-inverter-card: Zeit konnte nicht gesetzt werden", t);
    });
  }
  setConfig(e) {
    if (!e)
      throw new Error("des-inverter-card: Konfiguration fehlt");
    if (!e.name)
      throw new Error('des-inverter-card: "name" ist erforderlich');
    if (e.demo_state && !Ar.has(e.demo_state))
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
    return { columns: Rr, rows: it, min_rows: it };
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
    return e ? _(e.pv_power_entity) || _(e.today_production_entity) || _(e.total_production_entity) || _(e.fault_entity) || _(e.alarm_entity) || _(e.device_state_entity) || _(e.inverter_temp_entity) || _(e.dc_temp_entity) || _(e.grid_frequency_entity) || _(e.pv1_power_entity) || _(e.pv1_voltage_entity) || _(e.pv1_current_entity) || _(e.pv2_power_entity) || _(e.pv2_voltage_entity) || _(e.pv2_current_entity) || M(e.grid_power_entities) || M(e.inverter_power_entities) || M(e.grid_voltage_entities) : !1;
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
      strings: _(e.pv1_power_entity) || _(e.pv1_voltage_entity) || _(e.pv1_current_entity) || _(e.pv2_power_entity) || _(e.pv2_voltage_entity) || _(e.pv2_current_entity),
      phases: M(e.grid_power_entities) || M(e.inverter_power_entities) || M(e.grid_voltage_entities),
      dc: e.show_dc_temp !== !1 && _(e.dc_temp_entity),
      freq: _(e.grid_frequency_entity)
    };
  }
  get _kwpTotal() {
    return this._config?.kwp_total ?? Cr;
  }
  get _kwpString() {
    return [
      this._config?.kwp_pv1 ?? Tr,
      this._config?.kwp_pv2 ?? Pr
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
    if (!_(e)) return null;
    const r = g(e, this.hass);
    if (r.kind !== "value") return null;
    let s = r.value;
    if (D(e)) {
      const a = De(e, this.hass);
      t === "power" ? a === "kw" ? s *= 1e3 : a === "mw" && (s *= 1e6) : t === "energy" && (a === "wh" ? s /= 1e3 : a === "mwh" && (s *= 1e3));
    }
    return Number.isFinite(s) ? s : null;
  }
  /** A configured entity's text, or null when unset/unavailable. */
  _text(e) {
    if (!_(e)) return null;
    const t = x(e, this.hass);
    return t.kind === "value" ? t.value : null;
  }
  _view() {
    return this._entityMode ? this._entityView() : this._demoView();
  }
  /** Wraps the static demo dataset in the (non-null) view shape. */
  _demoView() {
    const e = this._config, t = Nr[e.demo_state ?? "normal"];
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
    _(e.pv_power_entity) ? s = this._num(e.pv_power_entity, "power") : s = ee([t, r]);
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
    ], n = (o) => ({
      grid: this._num(e.grid_power_entities?.[o], "power"),
      inverter: this._num(e.inverter_power_entities?.[o], "power"),
      voltage: this._num(e.grid_voltage_entities?.[o], "plain")
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
        (e.grid_power_entities ?? []).map((o) => this._num(o, "power"))
      ),
      showStrings: c.strings,
      showExport: M(e.grid_power_entities),
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
    const t = this._config?.invert_grid ? -1 : 1, r = ee(e);
    return r === null ? null : -(r * t);
  }
  /** Per-string amber flags; skipped when a power is missing (would be NaN). */
  _imbalance(e, t) {
    const r = this._config;
    if (r?.imbalance_warn === !1) return [!1, !1];
    if (e === null || t === null) return [!1, !1];
    const s = r?.imbalance_ratio ?? Mr, a = r?.imbalance_min_w ?? Lr, n = (c, o) => c < s * o && o > a;
    return [n(e, t), n(t, e)];
  }
  // =========================================================================
  // render
  // =========================================================================
  render() {
    const e = this._config;
    if (!e) return d;
    const t = this._view(), r = t.showStrings || t.showPhases || this._hasFooter(t) || _(e.time_entity);
    return l`
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
    return l`
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

      ${t ? l`<div
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
    return e.model && t.push(l`${e.model}`), t.push(l`${this._unit(e.todayProduction, w, "kWh")} heute`), t.push(
      l`${this._unit(e.totalProduction, f, "kWh")} gesamt`
    ), l`${t.map((r, s) => s === 0 ? r : l` · ${r}`)}`;
  }
  /** fault beats alarm beats device state; "OK"/absent means no fault. */
  _renderPill(e) {
    const t = (c) => {
      if (c === null) return null;
      const o = c.trim();
      return o.length > 0 && o.toLowerCase() !== "ok" ? o : null;
    }, r = t(e.fault), s = t(e.alarm), [a, n] = r ? [`Fault: ${r}`, "pill-fault"] : s ? [`Alarm: ${s}`, "pill-alarm"] : [e.deviceState, "pill-ok"];
    return l`<span class="pill ${n}">
      <span class="pill-label">${a}</span>
    </span>`;
  }
  _renderPowerRow(e) {
    const t = e.pvPower !== null && e.pvPower > 0, r = this._kwpTotal, s = e.pvPower !== null && r > 0 ? $(e.pvPower / (r * 1e3) * 100, 0, 999) : null;
    return l`
      <div class="power-row">
        <div class="pv">
          <span class="pv-value ${t ? "producing" : "idle"}">
            ${this._unit(e.pvPower, f, "W")}
          </span>
          ${s === null ? d : l`<span class="pv-share">
                ${f(s)} % von ${Xt(r)} kWp
              </span>`}
        </div>
        <div class="temp">
          ${this._thermometer()}
          ${this._unit(e.inverterTemp, w, "°C")}
        </div>
      </div>
    `;
  }
  _renderStringBars(e) {
    const t = this._kwpString;
    return l`
      <div class="strings">
        ${e.showStrings ? e.strings.map((r, s) => {
      const a = (t[s] ?? 0) * 1e3, n = r.power !== null && a > 0 ? $(r.power / a * 100, 0, 100) : 0, c = e.imbalance[s];
      return l`
                <div class="string-row">
                  <span class="string-label">PV${s + 1}</span>
                  <div class="bar">
                    <div
                      class="bar-fill ${c ? "warn" : ""}"
                      style="width: ${n}%"
                    ></div>
                  </div>
                  <span class="string-power">
                    ${this._unit(r.power, f, "W")}
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
    const t = e.exportW, r = t !== null && t >= Or, s = this._kwpTotal * 1e3, a = r && s > 0 ? $(t / s * 100, 0, 100) : 0;
    return l`
      <div class="string-row">
        <span class="string-label">Export</span>
        <div class="bar">
          <div class="bar-fill export" style="width: ${a}%"></div>
        </div>
        <span class="string-power">
          ${t === null ? l`<span class="unavail">–</span>` : l`${f(r ? t : 0)} W`}
        </span>
      </div>
    `;
  }
  // --- expanded ------------------------------------------------------------
  _renderExpanded(e) {
    return l`
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
    return l`
      <div class="grid strings-grid">
        <span class="col-head">Strings</span>
        <span class="col-head num">Spannung</span>
        <span class="col-head num">Strom</span>
        ${e.strings.map(
      (t, r) => l`
            <span class="row-label">PV${r + 1}</span>
            <span class="num">${this._unit(t.voltage, w, "V")}</span>
            <span class="num">${this._unit(t.current, w, "A")}</span>
          `
    )}
      </div>
    `;
  }
  // B. Phases — grid flow, inverter output, voltage per phase, plus a Σ row.
  _renderPhasesTable(e) {
    const t = this._config?.invert_grid ? -1 : 1, r = e.phases.map(
      (n) => n.grid === null ? null : n.grid * t
    ), s = ee(r), a = ee(e.phases.map((n) => n.inverter));
    return l`
      <div class="grid phases-grid">
        <span class="col-head">Phasen</span>
        <span class="col-head num">Netz</span>
        <span class="col-head num">WR-Ausgang</span>
        <span class="col-head num">Spannung</span>

        ${e.phases.map((n, c) => {
      const o = r[c];
      return l`
            <span class="row-label">${Dr[c]}</span>
            <span class="num ${this._gridClass(o)}">
              ${this._unit(o, X, "W")}
            </span>
            <span class="num">${this._unit(n.inverter, f, "W")}</span>
            <span class="num">${this._unit(n.voltage, w, "V")}</span>
          `;
    })}

        <span class="row-label sum">Σ</span>
        <span class="num sum ${this._gridClass(s)}">
          ${this._unit(s, X, "W")}
        </span>
        <span class="num sum">${this._unit(a, f, "W")}</span>
        <span class="num sum muted">–</span>
      </div>
    `;
  }
  // C. Footer — DC temperature (optional) and grid frequency.
  _renderFooter(e) {
    return l`
      <div class="footer">
        ${e.showDcItem ? l`<div class="foot-item">
              <span class="foot-label">DC-Temperatur</span>
              <span class="foot-value">
                ${this._unit(e.dcTemp, w, "°C")}
              </span>
            </div>` : d}
        ${e.showFreqItem ? l`<div class="foot-item">
              <span class="foot-label">Netzfrequenz</span>
              <span class="foot-value">
                ${this._unit(e.gridFrequency, (t) => w(t, 2), "Hz")}
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
    return e === null ? l`<span class="unavail">–</span>` : l`${t(e)} ${r}`;
  }
  /** negative = feed-in (green), positive = import (red), zero/null = muted. */
  _gridClass(e) {
    return e === null || e === 0 ? "muted" : e < 0 ? "grid-feed" : "grid-draw";
  }
  /** Inline thermometer glyph, so the card needs no external icon set. */
  _thermometer() {
    return l`<svg
      class="thermo"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      role="img"
      aria-label="Temperatur"
    >
      ${Ft`<path
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
ne.properties = {
  // Assigning `hass` is a reactive property write, so Home Assistant's state
  // updates re-render the card (same mechanism as the storage card).
  hass: { attribute: !1 },
  _config: { state: !0 },
  _expanded: { state: !0 },
  _clockTick: { state: !0 },
  _timeSetDone: { state: !0 }
}, ne.styles = [
  ze,
  Ie,
  Fe,
  S`
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
let Ee = ne;
const Br = /* @__PURE__ */ new Set([
  "normal",
  "night",
  "export"
]), at = 4, Gr = 4, jr = 12, Vr = "sensor.pv_helper_solar_direkt_leistung", Kr = "sensor.pv_helper_speicher_leistung", qr = "sensor.inverter_external_power", nt = "sensor.pv_helper_energie_solar_direkt", ot = "sensor.pv_helper_energie_entladen_gesamt", lt = "sensor.pv_helper_energie_import_gesamt", ct = "var(--success-color)", dt = "#378ADD", ht = "#E24B4A", Yr = ["day", "week", "month", "year"], Zr = {
  day: "Tag",
  week: "Woche",
  month: "Monat",
  year: "Jahr"
}, Xr = 180, Jr = 2, Qr = ["_apexChart", "apexChart", "_chart"], es = {
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
function b(i) {
  return typeof i == "string" && i.trim().length > 0;
}
function ts(i) {
  return Array.isArray(i) && i.some(b);
}
const oe = class oe extends E {
  constructor() {
    super(), this._closer = new He(this, () => this._collapse()), this._mountToken = 0, this._awaitingApex = !1, this._expanded = !1, this._period = null;
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
    if (e.demo_state && !Br.has(e.demo_state))
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
    return at;
  }
  /** HA sections view: a third of the section; the chart grows into the rows. */
  getGridOptions() {
    return { columns: jr, rows: at, min_rows: Gr };
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
    return e ? b(e.pv_power_entity) || b(e.load_power_entity) || b(e.grid_power_entity) || ts(e.storage_power_entities) || b(e.today_consumption_entity) || b(e.today_import_entity) || b(e.today_export_entity) || b(e.autarky_entity) || b(e.solar_power_entity) || b(e.storage_power_entity) || b(e.solar_energy_entity) || b(e.storage_energy_entity) || b(e.grid_energy_entity) : !1;
  }
  /**
   * A configured entity's numeric value, rescaled onto the card's base unit
   * (W for power, kWh for energy). `null` for an unset, unavailable or
   * non-numeric slot - all of which render as a muted "–".
   */
  _num(e, t) {
    if (!b(e)) return null;
    const r = g(e, this.hass);
    if (r.kind !== "value") return null;
    let s = r.value;
    if (D(e)) {
      const a = De(e, this.hass);
      t === "power" ? a === "kw" ? s *= 1e3 : a === "mw" && (s *= 1e6) : t === "energy" && (a === "wh" ? s /= 1e3 : a === "mwh" && (s *= 1e3));
    }
    return Number.isFinite(s) ? s : null;
  }
  _rawInputs() {
    if (!this._entityMode)
      return es[this._config.demo_state ?? "normal"];
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
    const e = this._config, t = this._rawInputs(), r = e.invert_grid ? -1 : 1, a = (t.gridRaw === null ? null : t.gridRaw * r) ?? 0, n = Math.max(a, 0), c = Math.max(-a, 0), o = (e.storage_positive ?? "discharge") === "charge", u = t.storage.reduce((y, k) => k === null ? y : y + Math.max(o ? -k : k, 0), 0);
    let p = 0, h = 0, m = 0, v;
    if (t.pvPower !== null) {
      const y = t.storage.reduce((A, _e) => _e === null ? A : A + Math.max(o ? _e : -_e, 0), 0);
      m = Math.max(t.pvPower - c - y, 0), p = u, h = n;
      const k = m + p + h;
      v = (A) => k > 0 ? $(A / k * 100, 0, 100) : 0;
    } else {
      const y = t.load !== null && t.load > 0 ? t.load : 0;
      y > 0 && (p = Math.min(u, y), h = Math.min(n, y - p), m = Math.max(y - p - h, 0)), v = (k) => y > 0 ? $(k / y * 100, 0, 100) : 0;
    }
    return {
      load: t.load,
      solarShare: m,
      storageShare: p,
      gridShare: h,
      solarPct: v(m),
      storagePct: v(p),
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
    return b(this._chartEntity(e?.solar_energy_entity, nt)) && b(this._chartEntity(e?.storage_energy_entity, ot)) && b(this._chartEntity(e?.grid_energy_entity, lt));
  }
  _availablePeriods() {
    return this._energyPeriodsAvailable() ? [...Yr] : ["day"];
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
      chart: { height: this._chartHeight ?? Xr, stacked: !0 },
      // No legend: the Solar/Speicher/Netz pills in the header already carry the
      // colour key, and dropping it reclaims vertical space for a rows-4 card.
      legend: { show: !1 },
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
        group_by: { func: "avg", duration: "30min", fill: "last" },
        unit: "W",
        float_precision: 0,
        show: { legend_value: !1 }
      },
      series: [
        {
          entity: this._chartEntity(t?.solar_power_entity, Vr),
          name: "Solar",
          color: ct
        },
        {
          entity: this._chartEntity(t?.storage_power_entity, Kr),
          name: "Speicher",
          color: dt,
          transform: "return Math.max(0, x);"
        },
        {
          entity: this._chartEntity(t?.grid_power_entity, qr),
          name: "Netz",
          color: ht,
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
          entity: this._chartEntity(t?.solar_energy_entity, nt),
          name: "Solar",
          color: ct
        },
        {
          entity: this._chartEntity(t?.storage_energy_entity, ot),
          name: "Speicher",
          color: dt
        },
        {
          entity: this._chartEntity(t?.grid_energy_entity, lt),
          name: "Netz",
          color: ht
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
    return l`
      <ha-card>
        <div class="card">${this._renderCollapsed(e, t)}</div>
        ${this._expanded && this._hasExpand(t) ? this._renderExpanded(t) : d}
      </ha-card>
    `;
  }
  /** Something to expand into: the chart (entity mode) and/or "Heute" values. */
  _hasExpand(e) {
    return this._entityMode || e.hasToday;
  }
  // --- collapsed (always visible) ------------------------------------------
  //
  // The collapsed body is the classic house readout: name + meta, the big
  // consumption figure, the mix bar and the Solar/Speicher/Netz legend rows.
  // The chart and its period switcher live only in the expanded dropdown, so
  // the card stays as compact (rows 4) as its neighbours.
  _renderCollapsed(e, t) {
    return l`
      <div class="header">
        <div class="head-left">
          <span class="name">${e.name}</span>
          <span class="meta">${this._renderMeta(t)}</span>
        </div>
      </div>

      ${this._renderPowerRow(t)}
      ${this._renderMixBar(t)}
      ${this._renderLegend(t)}

      ${this._hasExpand(t) ? l`<div
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
    return l`${this._unit(e.todayConsumption, w, "kWh")} heute ·
    ${this._unit(e.autarky, f, "%")} autark`;
  }
  _renderPowerRow(e) {
    return l`
      <div class="power-row">
        <div class="load">
          <span class="load-value">${this._unit(e.load, f, "W")}</span>
          <span class="load-label">Verbrauch</span>
        </div>
      </div>
    `;
  }
  /** Solar / Speicher / Netz with colour swatch, current W and share in %. */
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
    return l`
      <div class="legend">
        ${t.map(
      (r) => l`
            <div class="legend-row">
              <span class="swatch ${r.cls}"></span>
              <span class="legend-label">${r.label}</span>
              <span class="legend-power">${f(r.power)} W</span>
              <span class="legend-pct">${f(r.pct)} %</span>
            </div>
          `
    )}
      </div>
    `;
  }
  /** The Tag/Woche/Monat/Jahr switcher, shown above the chart in the dropdown. */
  _renderPeriodSwitcher() {
    const e = this._availablePeriods(), t = this._effectivePeriod(e);
    return q(
      e.map((r) => ({ value: r, label: Zr[r] })),
      t,
      (r) => this._setPeriod(r),
      "Zeitraum"
    );
  }
  _renderMixBar(e) {
    return l`
      <div
        class="mix"
        role="img"
        aria-label="Stromherkunft: Solar ${f(e.solarPct)} %, Speicher
        ${f(e.storagePct)} %, Netz ${f(e.gridPct)} %"
      >
        <div class="mix-seg solar" style="width: ${e.solarPct}%"></div>
        <div class="mix-seg storage" style="width: ${e.storagePct}%"></div>
        <div class="mix-seg grid" style="width: ${e.gridPct}%"></div>
      </div>
    `;
  }
  // --- expanded dropdown: period switcher + chart + "Heute" ----------------
  _renderExpanded(e) {
    return l`
      <div class="overlay">
        ${this._entityMode ? l`
              <div class="chart-head">${this._renderPeriodSwitcher()}</div>
              ${this._apexAvailable() ? l`<div class="chart" id="chart"></div>` : l`<div class="hint">apexcharts-card nicht installiert</div>`}
            ` : d}
        ${e.hasToday ? l`<div class="today">
              ${this._todayRow("Verbrauch", e.todayConsumption, "")}
              ${this._todayRow("Netzbezug", e.todayImport, "draw")}
              ${this._todayRow("Einspeisung", e.todayExport, "feed")}
            </div>` : d}
      </div>
    `;
  }
  /** One "Heute" row, or nothing when its value is missing. */
  _todayRow(e, t, r) {
    return t === null ? d : l`
      <span class="today-label">${e}</span>
      <span class="today-value ${r}">${w(t)} kWh</span>
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
    t <= 0 || this._chartHeight !== void 0 && Math.abs(t - this._chartHeight) <= Jr || (this._chartHeight = t, this._resizeApex(t));
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
      for (const t of Qr) {
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
    return e === null ? l`<span class="unavail">–</span>` : l`${t(e)} ${r}`;
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
oe.properties = {
  // Assigning `hass` is a reactive property write, so Home Assistant's state
  // updates re-render the card (same mechanism as the other cards).
  hass: { attribute: !1 },
  _config: { state: !0 },
  _expanded: { state: !0 },
  _period: { state: !0 }
}, oe.styles = [
  ze,
  Ie,
  Fe,
  pe,
  S`
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

    /* --- legend (Solar / Speicher / Netz) --- */

    .legend {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      flex: 0 0 auto;
    }

    .legend-row {
      display: grid;
      grid-template-columns: 8px 1fr auto auto;
      align-items: center;
      gap: 8px;
      font-size: 12px;
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

    /* --- chart (only inside the expanded dropdown) --- */

    .chart-head {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 8px;
    }

    /* Fixed height inside the dropdown; the embedded chart fills it absolutely. */
    .chart {
      height: 200px;
      position: relative;
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

    /* Space between the chart and the "Heute" block when both are shown. */
    .chart + .today,
    .hint + .today {
      margin-top: 12px;
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
let Se = oe;
const se = ["day", "week", "month", "year"], rs = new Set(se), ut = 4, ss = 12, is = {
  day: "Tag",
  week: "Woche",
  month: "Monat",
  year: "Jahr"
}, N = [
  { key: "consumption", label: "Verbrauch", cls: "m-consumption" },
  { key: "production", label: "Produktion", cls: "m-production" },
  { key: "import", label: "Import", cls: "m-import" },
  { key: "export", label: "Export", cls: "m-export" },
  { key: "charge", label: "Laden", cls: "m-charge" },
  { key: "discharge", label: "Entladen", cls: "m-discharge" }
];
function te(i) {
  return {
    consumption: i[0],
    production: i[1],
    import: i[2],
    export: i[3],
    charge: i[4],
    discharge: i[5]
  };
}
const as = {
  day: te([17.6, 22.4, 4.4, 3.1, 6.2, 5.8]),
  week: te([148.2, 127.5, 38.6, 41, 32.1, 28.4]),
  month: te([610, 590, 160, 175, 140, 128]),
  year: te([5400, 8200, 1900, 4100, 1200, 1100])
};
function At(i) {
  return Array.isArray(i) ? i.some(At) : typeof i == "number" ? Number.isFinite(i) : typeof i == "string" && i.trim().length > 0;
}
const le = class le extends E {
  constructor() {
    super(), this._period = null;
  }
  setConfig(e) {
    if (!e)
      throw new Error("des-stats-card: Konfiguration fehlt");
    if (!e.name)
      throw new Error('des-stats-card: "name" ist erforderlich');
    if (e.default_period && !rs.has(e.default_period))
      throw new Error(
        'des-stats-card: "default_period" muss "day", "week", "month" oder "year" sein'
      );
    this._config = e, this._period = null;
  }
  getCardSize() {
    const e = this._effectivePeriod(this._availablePeriods()), t = e ? N.filter((r) => this._periodValues(e)[r.key] !== null).length : 0;
    return 2 + Math.ceil(t / 2);
  }
  /** HA sections view: a third of the section, fixed height. */
  getGridOptions() {
    return { columns: ss, rows: ut, min_rows: ut };
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
    return e ? se.some((t) => {
      const r = e[t];
      return r !== void 0 && N.some((s) => At(r[s.key]));
    }) : !1;
  }
  /**
   * A configured slot's numeric value, rescaled onto kWh (Wh → /1000,
   * MWh → ×1000). `null` for an unset, unavailable or non-numeric slot.
   */
  _num(e) {
    if (e === void 0 || typeof e == "string" && e.trim().length === 0) return null;
    const t = g(e, this.hass);
    if (t.kind !== "value") return null;
    let r = t.value;
    if (typeof e == "string" && D(e)) {
      const s = De(e, this.hass);
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
    if (!this._entityMode) return as[e];
    const t = this._config?.periods?.[e], r = {};
    for (const { key: s } of N) r[s] = this._metricValue(t, s);
    return r;
  }
  /** Periods that have at least one readable figure (all four in demo mode). */
  _availablePeriods() {
    return this._entityMode ? se.filter((e) => {
      const t = this._periodValues(e);
      return N.some((r) => t[r.key] !== null);
    }) : [...se];
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
    return l`
      <ha-card>
        <div class="card">
          <div class="header">
            <span class="name">${e.name}</span>
            ${t.length > 0 && r ? q(
      t.map((c) => ({ value: c, label: is[c] })),
      r,
      (c) => this._setPeriod(c),
      "Zeitraum"
    ) : d}
          </div>

          ${a === null && n === null ? d : l`<div class="meta">
                ${this._pct(a)} % autark · ${this._pct(n)} %
                Eigenverbrauch
              </div>`}

          ${s ? this._renderRows(s) : d}
        </div>
      </ha-card>
    `;
  }
  _renderRows(e) {
    const r = N.map((s) => e[s.key]).filter(
      (s) => s !== null
    ).reduce((s, a) => Math.max(s, a), 0);
    return l`
      <div class="rows">
        ${N.map((s) => {
      const a = e[s.key];
      if (a === null) return d;
      const n = r > 0 ? $(a / r * 100, 0, 100) : 0;
      return l`
            <span class="row-label">${s.label}</span>
            <div class="bar">
              <div
                class="bar-fill ${s.cls}"
                style="width: ${n}%"
              ></div>
            </div>
            <span class="row-value">${w(a, 2)} kWh</span>
          `;
    })}
      </div>
    `;
  }
  /** Whole-number percent, or a muted "–" when it cannot be computed. */
  _pct(e) {
    return e === null ? l`<span class="unavail">–</span>` : l`${f(e)}`;
  }
  _setPeriod(e) {
    this._period = e;
  }
};
le.properties = {
  // Assigning `hass` is a reactive property write, so Home Assistant's state
  // updates re-render the card (same mechanism as the other cards).
  hass: { attribute: !1 },
  _config: { state: !0 },
  _period: { state: !0 }
}, le.styles = [
  pe,
  Fe,
  S`
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
let Ae = le;
const Ce = ["day", "week", "month", "year"], ns = new Set(Ce), os = {
  day: "Tag",
  week: "Woche",
  month: "Monat",
  year: "Jahr"
}, pt = 4, ls = 3, cs = 24, ds = 220, hs = 2, us = ["_apexChart", "apexChart", "_chart"], ce = class ce extends E {
  constructor() {
    super(), this._mountToken = 0, this._awaitingApex = !1, this._period = null;
  }
  setConfig(e) {
    if (!e)
      throw new Error("des-chart-card: Konfiguration fehlt");
    if (!e.name)
      throw new Error('des-chart-card: "name" ist erforderlich');
    if (e.default_period && !ns.has(e.default_period))
      throw new Error(
        'des-chart-card: "default_period" muss "day", "week", "month" oder "year" sein'
      );
    if (e.periods !== void 0 && (typeof e.periods != "object" || e.periods === null))
      throw new Error('des-chart-card: "periods" muss ein Objekt sein');
    this._config = e, this._period = null, this._teardownChart();
  }
  getCardSize() {
    return pt;
  }
  /** HA sections view: two thirds wide; the chart grows into the given rows. */
  getGridOptions() {
    return { columns: cs, rows: pt, min_rows: ls };
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
    return typeof t == "string" && t.trim().length > 0 ? t : os[e];
  }
  /** Periods that carry a chart; empty means "demo" (no periods configured). */
  _realPeriods() {
    return Ce.filter((e) => this._chartConfig(e) !== null);
  }
  get _isDemo() {
    return this._realPeriods().length === 0;
  }
  _available() {
    const e = this._realPeriods();
    return e.length > 0 ? e : [...Ce];
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
    return l`
      <ha-card>
        <div class="card">
          <div class="header">
            <span class="name">${e.name}</span>
            ${q(
      t.map((a) => ({ value: a, label: this._label(a) })),
      r,
      (a) => this._setPeriod(a),
      "Zeitraum"
    )}
          </div>
          ${s ? l`<div class="meta">${s}</div>` : d}
          ${this._renderChartArea(r)}
        </div>
      </ha-card>
    `;
  }
  _renderChartArea(e) {
    return this._isDemo || this._chartConfig(e) === null ? l`<div class="hint">Keine Chart-Config</div>` : this._apexAvailable() ? l`<div class="chart" id="chart"></div>` : l`<div class="hint">apexcharts-card nicht installiert</div>`;
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
    t <= 0 || this._chartHeight !== void 0 && Math.abs(t - this._chartHeight) <= hs || (this._chartHeight = t, this._resizeApex(t));
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
      for (const t of us) {
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
    const t = (v) => v && typeof v == "object" ? v : {}, r = t(e.header), s = t(e.apex_config), a = t(s.chart), n = t(s.legend), c = t(n.markers), o = t(n.itemMargin), u = t(e.all_series_config), p = t(u.group_by), h = e.stacked === !0 || a.stacked === !0, m = h && "group_by" in u ? {
      all_series_config: {
        ...u,
        group_by: { fill: "last", ...p }
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
          height: this._chartHeight ?? ds,
          ...h ? { stacked: !0 } : {}
        },
        legend: {
          ...n,
          // Default first, user's value spread on top wins per key.
          markers: { offsetX: -4, ...c },
          itemMargin: { horizontal: 10, ...o }
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
ce.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 },
  _period: { state: !0 }
}, ce.styles = [
  pe,
  S`
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
let Te = ce;
const ps = "0.5.0", _s = [
  {
    type: "des-storage-card",
    element: $e,
    name: "Daniels Speicherkarte",
    description: "Speicherkarte für Hausakkus (battery) und Wärmespeicher-Gruppen (thermal_group)."
  },
  {
    type: "des-inverter-card",
    element: Ee,
    name: "Daniels Wechselrichterkarte",
    description: "Wechselrichter-Übersicht: PV-Leistung, Strings und Phasen (Entities oder Demo-Werte)."
  },
  {
    type: "des-house-card",
    element: Se,
    name: "Daniels Hauskarte",
    description: "Hausverbrauch und Stromherkunft: Solar, Speicher, Netz plus Tageswerte (Entities oder Demo-Werte)."
  },
  {
    type: "des-stats-card",
    element: Ae,
    name: "Daniels Statistikkarte",
    description: "Energiestatistik je Zeitraum (Tag/Woche/Monat/Jahr): Verbrauch, Produktion, Import, Export, Laden, Entladen."
  },
  {
    type: "des-chart-card",
    element: Te,
    name: "Daniels Chartkarte",
    description: "Kopfzeile mit Zeitraum-Umschalter und eingebettetem ApexCharts-Chart je Zeitraum."
  }
];
window.customCards = window.customCards ?? [];
for (const i of _s)
  customElements.get(i.type) || customElements.define(i.type, i.element), window.customCards.some((e) => e.type === i.type) || window.customCards.push({
    type: i.type,
    name: i.name,
    description: i.description,
    preview: !1
  });
console.info(
  `%c DANIELS-ENERGY-CARDS %c v${ps} `,
  "background:#03a9f4;color:#fff;font-weight:700;border-radius:3px 0 0 3px;padding:2px 4px",
  "background:#555;color:#fff;border-radius:0 3px 3px 0;padding:2px 4px"
);
export {
  Te as DesChartCard,
  Se as DesHouseCard,
  Ee as DesInverterCard,
  Ae as DesStatsCard,
  $e as DesStorageCard
};

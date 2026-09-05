/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Z = globalThis, Ee = Z.ShadowRoot && (Z.ShadyCSS === void 0 || Z.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ae = Symbol(), Ie = /* @__PURE__ */ new WeakMap();
let it = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== Ae) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (Ee && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = Ie.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && Ie.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const vt = (i) => new it(typeof i == "string" ? i : i + "", void 0, Ae), S = (i, ...e) => {
  const t = i.length === 1 ? i[0] : e.reduce((r, s, n) => r + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + i[n + 1], i[0]);
  return new it(t, i, Ae);
}, yt = (i, e) => {
  if (Ee) i.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const r = document.createElement("style"), s = Z.litNonce;
    s !== void 0 && r.setAttribute("nonce", s), r.textContent = t.cssText, i.appendChild(r);
  }
}, De = Ee ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const r of e.cssRules) t += r.cssText;
  return vt(t);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: wt, defineProperty: bt, getOwnPropertyDescriptor: xt, getOwnPropertyNames: $t, getOwnPropertySymbols: kt, getPrototypeOf: Et } = Object, ne = globalThis, ze = ne.trustedTypes, At = ze ? ze.emptyScript : "", St = ne.reactiveElementPolyfillSupport, F = (i, e) => i, fe = { toAttribute(i, e) {
  switch (e) {
    case Boolean:
      i = i ? At : null;
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
} }, nt = (i, e) => !wt(i, e), Ue = { attribute: !0, type: String, converter: fe, reflect: !1, useDefault: !1, hasChanged: nt };
Symbol.metadata ??= Symbol("metadata"), ne.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let N = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Ue) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = Symbol(), s = this.getPropertyDescriptor(e, r, t);
      s !== void 0 && bt(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: s, set: n } = xt(this.prototype, e) ?? { get() {
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
    return this.elementProperties.get(e) ?? Ue;
  }
  static _$Ei() {
    if (this.hasOwnProperty(F("elementProperties"))) return;
    const e = Et(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(F("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(F("properties"))) {
      const t = this.properties, r = [...$t(t), ...kt(t)];
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
      for (const s of r) t.unshift(De(s));
    } else e !== void 0 && t.push(De(e));
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
    return yt(e, this.constructor.elementStyles), e;
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
      const n = (r.converter?.toAttribute !== void 0 ? r.converter : fe).toAttribute(t, r.type);
      this._$Em = e, n == null ? this.removeAttribute(s) : this.setAttribute(s, n), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const r = this.constructor, s = r._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const n = r.getPropertyOptions(s), a = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : fe;
      this._$Em = s;
      const o = a.fromAttribute(t, n.type);
      this[s] = o ?? this._$Ej?.get(s) ?? o, this._$Em = null;
    }
  }
  requestUpdate(e, t, r, s = !1, n) {
    if (e !== void 0) {
      const a = this.constructor;
      if (s === !1 && (n = this[e]), r ??= a.getPropertyOptions(e), !((r.hasChanged ?? nt)(n, t) || r.useDefault && r.reflect && n === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, r)))) return;
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
N.elementStyles = [], N.shadowRootOptions = { mode: "open" }, N[F("elementProperties")] = /* @__PURE__ */ new Map(), N[F("finalized")] = /* @__PURE__ */ new Map(), St?.({ ReactiveElement: N }), (ne.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Se = globalThis, Fe = (i) => i, X = Se.trustedTypes, We = X ? X.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, at = "$lit$", A = `lit$${Math.random().toFixed(9).slice(2)}$`, ot = "?" + A, Ct = `<${ot}>`, P = document, W = () => P.createComment(""), B = (i) => i === null || typeof i != "object" && typeof i != "function", Ce = Array.isArray, Tt = (i) => Ce(i) || typeof i?.[Symbol.iterator] == "function", de = `[ 	
\f\r]`, z = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Be = /-->/g, He = />/g, C = RegExp(`>|${de}(?:([^\\s"'>=/]+)(${de}*=${de}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), je = /'/g, Ve = /"/g, lt = /^(?:script|style|textarea|title)$/i, ct = (i) => (e, ...t) => ({ _$litType$: i, strings: e, values: t }), c = ct(1), Pt = ct(2), R = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), Ge = /* @__PURE__ */ new WeakMap(), T = P.createTreeWalker(P, 129);
function dt(i, e) {
  if (!Ce(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return We !== void 0 ? We.createHTML(e) : e;
}
const Mt = (i, e) => {
  const t = i.length - 1, r = [];
  let s, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = z;
  for (let o = 0; o < t; o++) {
    const l = i[o];
    let u, p, h = -1, f = 0;
    for (; f < l.length && (a.lastIndex = f, p = a.exec(l), p !== null); ) f = a.lastIndex, a === z ? p[1] === "!--" ? a = Be : p[1] !== void 0 ? a = He : p[2] !== void 0 ? (lt.test(p[2]) && (s = RegExp("</" + p[2], "g")), a = C) : p[3] !== void 0 && (a = C) : a === C ? p[0] === ">" ? (a = s ?? z, h = -1) : p[1] === void 0 ? h = -2 : (h = a.lastIndex - p[2].length, u = p[1], a = p[3] === void 0 ? C : p[3] === '"' ? Ve : je) : a === Ve || a === je ? a = C : a === Be || a === He ? a = z : (a = C, s = void 0);
    const w = a === C && i[o + 1].startsWith("/>") ? " " : "";
    n += a === z ? l + Ct : h >= 0 ? (r.push(u), l.slice(0, h) + at + l.slice(h) + A + w) : l + A + (h === -2 ? o : w);
  }
  return [dt(i, n + (i[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class H {
  constructor({ strings: e, _$litType$: t }, r) {
    let s;
    this.parts = [];
    let n = 0, a = 0;
    const o = e.length - 1, l = this.parts, [u, p] = Mt(e, t);
    if (this.el = H.createElement(u, r), T.currentNode = this.el.content, t === 2 || t === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (s = T.nextNode()) !== null && l.length < o; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const h of s.getAttributeNames()) if (h.endsWith(at)) {
          const f = p[a++], w = s.getAttribute(h).split(A), v = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: n, name: v[2], strings: w, ctor: v[1] === "." ? Ot : v[1] === "?" ? Nt : v[1] === "@" ? Rt : ae }), s.removeAttribute(h);
        } else h.startsWith(A) && (l.push({ type: 6, index: n }), s.removeAttribute(h));
        if (lt.test(s.tagName)) {
          const h = s.textContent.split(A), f = h.length - 1;
          if (f > 0) {
            s.textContent = X ? X.emptyScript : "";
            for (let w = 0; w < f; w++) s.append(h[w], W()), T.nextNode(), l.push({ type: 2, index: ++n });
            s.append(h[f], W());
          }
        }
      } else if (s.nodeType === 8) if (s.data === ot) l.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = s.data.indexOf(A, h + 1)) !== -1; ) l.push({ type: 7, index: n }), h += A.length - 1;
      }
      n++;
    }
  }
  static createElement(e, t) {
    const r = P.createElement("template");
    return r.innerHTML = e, r;
  }
}
function I(i, e, t = i, r) {
  if (e === R) return e;
  let s = r !== void 0 ? t._$Co?.[r] : t._$Cl;
  const n = B(e) ? void 0 : e._$litDirective$;
  return s?.constructor !== n && (s?._$AO?.(!1), n === void 0 ? s = void 0 : (s = new n(i), s._$AT(i, t, r)), r !== void 0 ? (t._$Co ??= [])[r] = s : t._$Cl = s), s !== void 0 && (e = I(i, s._$AS(i, e.values), s, r)), e;
}
class Lt {
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
    const { el: { content: t }, parts: r } = this._$AD, s = (e?.creationScope ?? P).importNode(t, !0);
    T.currentNode = s;
    let n = T.nextNode(), a = 0, o = 0, l = r[0];
    for (; l !== void 0; ) {
      if (a === l.index) {
        let u;
        l.type === 2 ? u = new V(n, n.nextSibling, this, e) : l.type === 1 ? u = new l.ctor(n, l.name, l.strings, this, e) : l.type === 6 && (u = new It(n, this, e)), this._$AV.push(u), l = r[++o];
      }
      a !== l?.index && (n = T.nextNode(), a++);
    }
    return T.currentNode = P, s;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}
class V {
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
    e = I(this, e, t), B(e) ? e === d || e == null || e === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : e !== this._$AH && e !== R && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Tt(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== d && B(this._$AH) ? this._$AA.nextSibling.data = e : this.T(P.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: r } = e, s = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = H.createElement(dt(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === s) this._$AH.p(t);
    else {
      const n = new Lt(s, this), a = n.u(this.options);
      n.p(t), this.T(a), this._$AH = n;
    }
  }
  _$AC(e) {
    let t = Ge.get(e.strings);
    return t === void 0 && Ge.set(e.strings, t = new H(e)), t;
  }
  k(e) {
    Ce(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let r, s = 0;
    for (const n of e) s === t.length ? t.push(r = new V(this.O(W()), this.O(W()), this, this.options)) : r = t[s], r._$AI(n), s++;
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
class ae {
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
    let a = !1;
    if (n === void 0) e = I(this, e, t, 0), a = !B(e) || e !== this._$AH && e !== R, a && (this._$AH = e);
    else {
      const o = e;
      let l, u;
      for (e = n[0], l = 0; l < n.length - 1; l++) u = I(this, o[r + l], t, l), u === R && (u = this._$AH[l]), a ||= !B(u) || u !== this._$AH[l], u === d ? e = d : e !== d && (e += (u ?? "") + n[l + 1]), this._$AH[l] = u;
    }
    a && !s && this.j(e);
  }
  j(e) {
    e === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ot extends ae {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === d ? void 0 : e;
  }
}
class Nt extends ae {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== d);
  }
}
class Rt extends ae {
  constructor(e, t, r, s, n) {
    super(e, t, r, s, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = I(this, e, t, 0) ?? d) === R) return;
    const r = this._$AH, s = e === d && r !== d || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, n = e !== d && (r === d || s);
    s && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class It {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    I(this, e);
  }
}
const Dt = Se.litHtmlPolyfillSupport;
Dt?.(H, V), (Se.litHtmlVersions ??= []).push("3.3.3");
const zt = (i, e, t) => {
  const r = t?.renderBefore ?? e;
  let s = r._$litPart$;
  if (s === void 0) {
    const n = t?.renderBefore ?? null;
    r._$litPart$ = s = new V(e.insertBefore(W(), n), n, void 0, t ?? {});
  }
  return s._$AI(i), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Te = globalThis;
class k extends N {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = zt(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return R;
  }
}
k._$litElement$ = !0, k.finalized = !0, Te.litElementHydrateSupport?.({ LitElement: k });
const Ut = Te.litElementPolyfillSupport;
Ut?.({ LitElement: k });
(Te.litElementVersions ??= []).push("4.2.2");
const oe = "de-DE";
function _(i) {
  return new Intl.NumberFormat(oe, { maximumFractionDigits: 0 }).format(i);
}
function Ft(i) {
  return new Intl.NumberFormat(oe, {
    maximumFractionDigits: 0,
    signDisplay: "always"
  }).format(i);
}
function Ke(i) {
  const e = Math.round(i), t = _(Math.abs(e));
  return e > 0 ? `+${t}` : e < 0 ? `−${t}` : t;
}
function Wt(i, e = 1) {
  return new Intl.NumberFormat(oe, {
    minimumFractionDigits: 0,
    maximumFractionDigits: e
  }).format(i);
}
function y(i, e = 1) {
  return new Intl.NumberFormat(oe, {
    minimumFractionDigits: e,
    maximumFractionDigits: e
  }).format(i);
}
function x(i, e, t) {
  return Math.min(t, Math.max(e, i));
}
const Bt = /* @__PURE__ */ new Set(["unavailable", "unknown", "none", "null", ""]), Ht = /^[a-z][a-z0-9_]*\.[a-z0-9_]+$/;
function M(i) {
  return typeof i == "string" && Ht.test(i);
}
const ve = { kind: "unset" }, U = { kind: "unavailable" };
function ht(i, e) {
  const t = e?.states?.[i];
  if (!t || typeof t.state != "string") return null;
  const r = t.state.trim();
  return Bt.has(r.toLowerCase()) ? null : r;
}
function he(i, e, t) {
  const r = e?.states?.[i]?.attributes?.[t];
  if (typeof r == "number") return Number.isFinite(r) ? r : null;
  if (typeof r == "string") {
    const s = Number.parseFloat(r);
    return Number.isFinite(s) ? s : null;
  }
  return null;
}
function Pe(i, e) {
  const t = e?.states?.[i]?.attributes?.unit_of_measurement;
  if (typeof t != "string") return null;
  const r = t.trim().toLowerCase();
  return r.length > 0 ? r : null;
}
function m(i, e) {
  if (i == null || typeof i == "boolean") return ve;
  if (typeof i == "number")
    return Number.isFinite(i) ? { kind: "value", value: i } : U;
  if (M(i)) {
    const r = ht(i, e);
    if (r === null) return U;
    const s = Number.parseFloat(r);
    return Number.isFinite(s) ? { kind: "value", value: s } : U;
  }
  const t = Number.parseFloat(i);
  return Number.isFinite(t) ? { kind: "value", value: t } : U;
}
function b(i, e) {
  if (i == null) return ve;
  if (typeof i == "boolean") return { kind: "value", value: i ? "on" : "off" };
  if (typeof i == "number") return { kind: "value", value: String(i) };
  if (M(i)) {
    const r = ht(i, e);
    return r === null ? U : { kind: "value", value: r };
  }
  const t = i.trim();
  return t.length > 0 ? { kind: "value", value: t } : ve;
}
const ut = /* @__PURE__ */ new Set(["number", "input_number"]), G = /* @__PURE__ */ new Set(["switch", "input_boolean"]), le = /* @__PURE__ */ new Set(["select", "input_select"]), jt = /* @__PURE__ */ new Set(["on", "true", "1", "yes", "an", "ein"]);
function D(i) {
  const e = i.indexOf(".");
  return e === -1 ? "" : i.slice(0, e);
}
function j(i, e) {
  return typeof i == "string" && M(i) && e.has(D(i));
}
function q(i) {
  return j(i, ut);
}
function Vt(i) {
  return j(i, G);
}
function pt(i) {
  if (!i || typeof i != "object") return !1;
  const e = i.entity;
  return j(e, le) || j(e, G);
}
function Me(i, e, t, r) {
  if (typeof i?.callService != "function")
    return Promise.reject(new Error("des-storage-card: hass.callService fehlt"));
  try {
    return Promise.resolve(i.callService(e, t, r));
  } catch (s) {
    return Promise.reject(s);
  }
}
function qe(i, e, t) {
  const r = D(e);
  return ut.has(r) ? Me(i, r, "set_value", { entity_id: e, value: t }) : Promise.reject(
    new Error(`des-storage-card: ${e} ist keine number-Entität`)
  );
}
function gt(i, e, t) {
  const r = D(e);
  return G.has(r) ? Me(i, r, t ? "turn_on" : "turn_off", { entity_id: e }) : Promise.reject(
    new Error(`des-storage-card: ${e} ist kein Schalter`)
  );
}
function Gt(i, e, t) {
  const r = D(e);
  return le.has(r) ? Me(i, r, "select_option", { entity_id: e, option: t }) : Promise.reject(
    new Error(`des-storage-card: ${e} ist keine select-Entität`)
  );
}
function _t(i, e) {
  const t = e === "charge" ? i.charge_state : i.auto_state;
  return t !== void 0 ? t : j(i.entity, G) ? e === "charge" ? "on" : "off" : void 0;
}
function Ye(i, e) {
  const t = _t(i, "charge");
  return t === void 0 ? !1 : t.trim().toLowerCase() === e.trim().toLowerCase();
}
function Kt(i) {
  if (i === null || typeof i != "object")
    return '"charge_mode_control" muss ein Objekt mit "entity" sein';
  const { entity: e, charge_state: t, auto_state: r } = i;
  if (typeof e != "string" || e.length === 0)
    return '"charge_mode_control" braucht "entity"';
  if (!pt(i))
    return `"charge_mode_control.entity" muss select, input_select, switch oder input_boolean sein (ist: ${e})`;
  if (le.has(D(e))) {
    const s = [
      t === void 0 ? "charge_state" : null,
      r === void 0 ? "auto_state" : null
    ].filter((n) => n !== null);
    if (s.length > 0)
      return `"charge_mode_control" braucht ${s.join(" und ")} für ${e}`;
  }
  return null;
}
function qt(i, e, t) {
  const r = e.entity, s = D(r), n = _t(e, t);
  return le.has(s) ? n === void 0 ? Promise.reject(
    new Error(
      `des-storage-card: charge_mode_control braucht ${t === "charge" ? "charge_state" : "auto_state"} für ${r}`
    )
  ) : Gt(i, r, n) : G.has(s) ? gt(i, r, jt.has((n ?? "").toLowerCase())) : Promise.reject(
    new Error(`des-storage-card: ${r} wird als Lademodus nicht unterstützt`)
  );
}
const Le = S`
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
function Q(i, e, t, r, s = !1) {
  return c`
    <div
      class="seg ${s || e === null ? "unknown" : ""}"
      role="group"
      aria-label=${r}
      title=${s ? "Nicht verfügbar" : e === null ? "Zustand nicht lesbar" : d}
    >
      ${i.map(
    ({ value: a, label: o }) => c`
          <button
            type="button"
            class=${e === a ? "active" : ""}
            aria-pressed=${e === a ? "true" : "false"}
            ?disabled=${s}
            @click=${(l) => {
      l.stopPropagation(), t(a);
    }}
          >
            ${o}
          </button>
        `
  )}
    </div>
  `;
}
const Oe = S`
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
`, Ne = S`
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

  .overlay {
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    box-sizing: border-box;
    padding: 12px 16px;
    background: var(--card-background-color, var(--ha-card-background, #fff));
    border: var(--ha-card-border-width, 1px) solid
      var(--ha-card-border-color, var(--divider-color, rgba(0, 0, 0, 0.12)));
    /* It joins the card above, so no top edge; rounded only at the bottom. */
    border-top: none;
    border-radius: 0 0 var(--ha-card-border-radius, 12px)
      var(--ha-card-border-radius, 12px);
    box-shadow: var(--ha-card-box-shadow, 0 8px 24px rgba(0, 0, 0, 0.35));
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
class Re {
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
const mt = {
  charging: "Lädt",
  discharging: "Entlädt",
  idle: "Bereit",
  heating: "Heizt",
  off: "Aus"
}, ue = { min: 10, max: 80, step: 5 }, pe = { min: 50, max: 100, step: 5 }, Ze = 5, Yt = 12, Zt = 2, Jt = 1, Xt = 20, Qt = 1, er = 300, tr = 6e4, Je = 5, Xe = 10, Qe = 48, rr = 500, sr = 8e3, ir = /* @__PURE__ */ new Set([
  "not charging",
  "not discharging",
  "unknown",
  "unavailable",
  "none",
  "-",
  "--"
]), nr = [
  { value: "charge", label: "Laden" },
  { value: "auto", label: "Auto" }
], ar = [
  { value: "on", label: "An" },
  { value: "auto", label: "Auto" },
  { value: "off", label: "Aus" }
], or = {
  1: "on",
  2: "auto",
  3: "off"
}, lr = {
  on: 1,
  auto: 2,
  off: 3
};
function cr(i) {
  const e = i.trim().toLowerCase();
  return e === "standby" ? "idle" : e in mt ? e : null;
}
function dr(i) {
  const e = i.trim().toLowerCase();
  return e === "on" || e === "auto" || e === "off" ? e : "auto";
}
function ge(i, e) {
  const { min: t, max: r, step: s } = e;
  if (!(s > 0)) return x(i, t, r);
  const n = Math.round((i - t) / s), a = Number((t + n * s).toFixed(6));
  return x(a, t, r);
}
function hr(i) {
  if (!Number.isFinite(i) || Number.isInteger(i)) return 0;
  const e = String(i), t = e.indexOf(".");
  return t === -1 ? 0 : Math.min(3, e.length - t - 1);
}
function et(i, e) {
  const t = hr(e);
  return t === 0 ? _(i) : y(i, t);
}
function ur(i) {
  if (!Number.isFinite(i) || i <= 0) return null;
  if (i > Qe) return `> ${Qe} h`;
  const e = Math.round(i * 60 / Je) * Je;
  return e < Xe ? `< ${Xe} min` : `${Math.floor(e / 60)}h ${e % 60}m`;
}
function pr(i) {
  return i < 4 || i > 50 ? "badge-alert" : i < 8 || i > 40 ? "badge-warn" : "badge-neutral";
}
const ee = class ee extends k {
  constructor() {
    super(), this._writeTimers = /* @__PURE__ */ new Map(), this._settleTimers = /* @__PURE__ */ new Map(), this._closer = new Re(this, () => this._collapse()), this._powerAverage = null, this._averageDirection = 0, this._averageStartedAt = 0, this._averageUpdatedAt = 0, this._expanded = !1, this._thresholdLocal = null, this._targetLocal = null, this._chargeModeLocal = null, this._itemModesLocal = [];
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
      const t = Kt(e.charge_mode_control);
      if (t !== null) throw new Error(`des-storage-card: ${t}`);
    }
    if (e.variant === "thermal_group") {
      const t = e.items;
      if (!Array.isArray(t) || t.length === 0)
        throw new Error(
          'des-storage-card: "items" braucht mindestens einen Eintrag'
        );
      if (t.length > Ze)
        throw new Error(
          `des-storage-card: "items" erlaubt höchstens ${Ze} Einträge`
        );
      if (t.some((r) => !r || !r.name))
        throw new Error('des-storage-card: jeder Eintrag in "items" braucht "name"');
      for (const r of t)
        if (r.mode_entity !== void 0 && !q(r.mode_entity))
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
      }, sr)
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
        this._rangeFor(e.threshold_pct, ue)
      ) && (this._thresholdLocal = null, this._clearSettle("threshold")), this._targetLocal !== null && this._entityMatches(
        e.charge_target_pct,
        this._targetLocal,
        this._rangeFor(e.charge_target_pct, pe)
      ) && (this._targetLocal = null, this._clearSettle("target"));
      const n = e.charge_mode_control;
      if (this._chargeModeLocal !== null && n?.entity) {
        const a = b(n.entity, this.hass);
        a.kind === "value" && (Ye(n, a.value) ? "charge" : "auto") === this._chargeModeLocal && (this._chargeModeLocal = null, this._clearSettle("chargeMode"));
      }
      return;
    }
    const t = e.items ?? [];
    let r = !1;
    const s = [...this._itemModesLocal];
    t.forEach((n, a) => {
      const o = s[a];
      if (!o) return;
      const l = this._itemModeFromEntity(n);
      l === null || l !== o || (s[a] = null, r = !0, this._clearSettle(`item:${a}`));
    }), r && (this._itemModesLocal = s);
  }
  /** True when the slot is entity-bound and already carries exactly `local`. */
  _entityMatches(e, t, r) {
    if (typeof e != "string" || !M(e)) return !1;
    const s = m(e, this.hass);
    return s.kind === "value" && ge(s.value, r) === t;
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
    if (!q(e)) return t;
    const r = e, s = he(r, this.hass, "min") ?? t.min, n = he(r, this.hass, "max") ?? t.max, a = he(r, this.hass, "step") ?? t.step;
    return !(s < n) || !(a > 0) ? t : { min: s, max: n, step: a };
  }
  getCardSize() {
    return this._config?.variant === "thermal_group" ? 1 + (this._config.items?.length ?? 0) : this._expanded ? 3 : 2;
  }
  /**
   * HA sections view: a third of the section wide, fixed height. A battery is
   * short; a thermal group grows with its item count (3 items → 4 rows).
   */
  getGridOptions() {
    const e = this._config?.variant === "thermal_group" ? Jt + (this._config.items?.length ?? 0) : Zt;
    return { columns: Yt, rows: e, min_rows: e };
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
    return c`
      <ha-card>
        <div class="card">
          ${e.variant === "battery" ? this._renderBattery(e) : this._renderThermalGroup(e)}
        </div>
        ${t && this._expanded ? c`<div class="overlay">${this._renderBatteryControls(e)}</div>` : d}
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
    let t = m(e.power_w, this.hass);
    if (t.kind === "unset" && e.voltage_entity && e.current_entity) {
      const n = m(e.voltage_entity, this.hass), a = m(e.current_entity, this.hass);
      t = n.kind === "value" && a.kind === "value" ? { kind: "value", value: n.value * a.value } : { kind: "unavailable" };
    }
    if (t.kind !== "value") return t;
    let r = e.invert_power ? -t.value : t.value;
    const s = m(e.power_share, this.hass);
    return s.kind === "unavailable" ? { kind: "unavailable" } : (r *= s.kind === "value" ? s.value : Qt, { kind: "value", value: r });
  }
  /** Absolute watts below which the battery reads as idle. */
  _idleThreshold(e) {
    const t = m(e.idle_threshold_w, this.hass);
    return t.kind === "value" && t.value >= 0 ? t.value : Xt;
  }
  /** Configured status, else derived from the power sign. */
  _status(e, t) {
    const r = b(e.status, this.hass);
    if (r.kind === "value") {
      const s = cr(r.value);
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
    const s = m(e.energy_kwh, this.hass);
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
    const n = Date.now();
    if (s !== this._averageDirection || this._powerAverage === null) {
      this._averageDirection = s, this._powerAverage = t.value, this._averageStartedAt = n, this._averageUpdatedAt = n;
      return;
    }
    const a = Math.max(0, (n - this._averageUpdatedAt) / 1e3);
    this._averageUpdatedAt = n;
    const o = 1 - Math.exp(-a / er);
    this._powerAverage += o * (t.value - this._powerAverage);
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
    const n = b(s, this.hass);
    return n.kind !== "value" || ir.has(n.value.trim().toLowerCase()) ? null : n.value;
  }
  /**
   * Discharging: how long until the minimum state of charge.
   * Charging:    how long until the charge target.
   *
   * Uses the smoothed power, and stays silent until that mean has enough
   * history to mean anything.
   */
  _estimateTimeRemaining(e, t) {
    if (this._powerAverage === null || Date.now() - this._averageStartedAt < tr) return null;
    const r = Math.abs(this._powerAverage);
    if (r < this._idleThreshold(e)) return null;
    const s = m(e.soc, this.hass), n = m(e.capacity_kwh, this.hass);
    if (s.kind !== "value" || n.kind !== "value") return null;
    const a = t ? this._chargeTarget(e) : this._threshold(e);
    if (a === null) return null;
    const o = t ? a - s.value : s.value - a;
    return o <= 0 ? null : ur(o / 100 * n.value / (r / 1e3));
  }
  _backup(e) {
    const t = e.backup;
    if (!t || t === "none") return "none";
    if (typeof t == "string")
      return t === "active" || t === "ready" ? t : "none";
    const r = b(t.entity, this.hass);
    return r.kind !== "value" ? "none" : (t.active_states ?? []).some(
      (n) => n.trim().toLowerCase() === r.value.toLowerCase()
    ) ? "active" : "ready";
  }
  _threshold(e) {
    if (this._thresholdLocal !== null) return this._thresholdLocal;
    const t = m(e.threshold_pct, this.hass);
    return t.kind === "value" ? ge(t.value, this._rangeFor(e.threshold_pct, ue)) : null;
  }
  _chargeTarget(e) {
    if (this._targetLocal !== null) return this._targetLocal;
    const t = m(e.charge_target_pct, this.hass);
    return t.kind === "value" ? ge(t.value, this._rangeFor(e.charge_target_pct, pe)) : null;
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
      const s = b(t.entity, this.hass);
      return s.kind !== "value" ? null : Ye(t, s.value) ? "charge" : "auto";
    }
    const r = b(e.charge_mode, this.hass);
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
    const s = b(e.mode, this.hass);
    return s.kind === "value" ? dr(s.value) : this._itemModeFromEntity(e) ?? "auto";
  }
  /**
   * The mode the entities currently report, ignoring any local override.
   * `null` when nothing readable says what the mode is.
   */
  _itemModeFromEntity(e) {
    if (e.mode_entity) {
      const t = b(e.mode_entity, this.hass);
      if (t.kind !== "value") return null;
      const r = Math.round(Number.parseFloat(t.value));
      return or[r] ?? null;
    }
    if (e.switch_entity) {
      const t = b(e.switch_entity, this.hass);
      if (t.kind === "value")
        return t.value.trim().toLowerCase() === "on" ? "on" : "off";
    }
    return null;
  }
  // =========================================================================
  // variant: battery
  // =========================================================================
  _renderBattery(e) {
    const t = m(e.soc, this.hass), r = m(e.capacity_kwh, this.hass), s = this._power(e), n = this._energy(e, t, r), a = this._status(e, s), o = this._backup(e), l = this._timeRemaining(e, s), u = b(e.time_at, this.hass), p = [l, u.kind === "value" ? u.value : null].filter(
      (f) => f !== null
    ), h = e.controls !== !1;
    return c`
      <div class="header">
        <div class="head-left">
          <span class="name">${e.name}</span>
        </div>
        <div class="badges">
          ${this._renderCapacityBadge(r)}
          ${this._renderTemperatureBadge(e)}
          ${o === "none" ? d : this._renderBackupBadge(o)}
          ${this._renderBadge(mt[a], `status-${a}`)}
        </div>
      </div>

      <div class="main">
        ${this._renderBatteryIcon(t)}
        <div class="readout">
          <span class="soc">
            ${t.kind === "value" ? `${_(t.value)} %` : this._dash()}
          </span>
          ${n.kind === "unset" ? d : c`<span class="energy">
                ${n.kind === "value" ? `${y(n.value)} kWh` : this._dash()}
              </span>`}
        </div>
        <div class="timing">
          ${s.kind === "unset" ? d : c`<div class=${this._powerClass(s, this._idleThreshold(e))}>
                ${s.kind === "value" ? this._formatPower(s.value) : this._dash()}
              </div>`}
          ${p.length === 0 ? d : c`<div class="muted">${p.join(" · ")}</div>`}
        </div>
      </div>

      ${h ? c`<div
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
    const t = this._chargeMode(e), r = this._chargeTarget(e), s = this._threshold(e), n = this._rangeFor(e.charge_target_pct, pe), a = this._rangeFor(e.threshold_pct, ue);
    return c`
      <div class="controls">
        <div class="ctl-rows">
          <span class="ctl-label">Ladegrenze</span>
          <input
            class="slider"
            type="range"
            min=${n.min}
            max=${n.max}
            step=${n.step}
            .value=${String(r ?? n.min)}
            aria-label="Ladegrenze"
            @input=${this._onTargetInput}
            @change=${this._onTargetChange}
          />
          <span class="ctl-value">
            ${r === null ? this._dash() : `${et(r, n.step)} %`}
          </span>

          <span class="ctl-label">min. SoC</span>
          <input
            class="slider"
            type="range"
            min=${a.min}
            max=${a.max}
            step=${a.step}
            .value=${String(s ?? a.min)}
            aria-label="Minimaler Ladestand"
            @input=${this._onThresholdInput}
            @change=${this._onThresholdChange}
          />
          <span class="ctl-value">
            ${s === null ? this._dash() : `${et(s, a.step)} %`}
          </span>
        </div>
        ${Q(
      nr,
      t,
      (o) => this._setChargeMode(o),
      "Lademodus"
    )}
      </div>
    `;
  }
  /** Capacity as a neutral pill; omitted when not configured. */
  _renderCapacityBadge(e) {
    return e.kind === "unset" ? d : this._renderBadge(
      e.kind === "value" ? `${y(e.value)} kWh` : c`${this._dash()} kWh`,
      "badge-neutral"
    );
  }
  /** Temperature as a pill, colour-coded on the same thresholds as before. */
  _renderTemperatureBadge(e) {
    const t = m(e.temp_c, this.hass);
    return t.kind === "unset" ? d : t.kind === "unavailable" ? this._renderBadge(c`${this._dash()} °C`, "badge-neutral") : this._renderBadge(
      `${y(t.value)} °C`,
      pr(t.value)
    );
  }
  /** Upright battery; the fill grows from the bottom. */
  _renderBatteryIcon(e) {
    const t = e.kind === "value" ? x(e.value, 0, 100) : 0, r = e.kind !== "value" ? "transparent" : t > 50 ? "var(--success-color, #2e7d32)" : t >= 20 ? "var(--warning-color, #ff9800)" : "var(--error-color, #d32f2f)", s = 6, n = 26, a = n * t / 100, o = s + (n - a);
    return c`
      <svg
        class="battery"
        viewBox="0 0 22 36"
        width="22"
        height="36"
        role="img"
        aria-label=${e.kind === "value" ? `Ladestand ${_(t)} Prozent` : "Ladestand unbekannt"}
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
      o > 0 ? `${_(o)} heizen` : "Aus",
      o > 0 ? "status-charging" : "status-off"
    )}
        </div>
      </div>

      <div class="main">
        <ha-icon class="fish" icon="mdi:fish"></ha-icon>
        <div class="readout stacked">
          <span class="soc">
            ${n === null ? this._dash() : `${y(n)} kWh`}
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
  /**
   * Status dot colour: only the `switch_entity` state counts (`on` → green),
   * never `power_w` or `mode_entity`. Missing/unavailable reads as off (grey).
   */
  _switchOn(e) {
    const t = b(e, this.hass);
    return t.kind === "value" && t.value.trim().toLowerCase() === "on";
  }
  _renderItem(e, t, r, s) {
    const n = r.kind === "value" && r.value > 0;
    return c`
      <div class="item">
        <div class="item-head">
          ${e.switch_entity ? c`<span
                class="dot ${this._switchOn(e.switch_entity) ? "dot-on" : ""}"
              ></span>` : d}
          <span class="item-name">${e.name}</span>
        </div>
        <span class="item-energy">
          ${s.kind === "value" ? `${y(s.value)} kWh` : s.kind === "unavailable" ? this._dash() : ""}
        </span>
        <span class=${n ? "item-power positive" : "item-power"}>
          ${r.kind === "value" ? this._formatPower(r.value) : r.kind === "unavailable" ? this._dash() : ""}
        </span>
        ${Q(
      ar,
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
    return `${t === 0 ? _(0) : Ft(t)} W`;
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
    !t?.entity || !pt(t) || (this._holdOptimistic("chargeMode", () => {
      this._chargeModeLocal = null;
    }), this._write(qt(this.hass, t, e), () => {
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
    if (!q(t)) return;
    const s = t, n = this._writeTimers.get(e);
    n !== void 0 && window.clearTimeout(n), this._writeTimers.set(
      e,
      window.setTimeout(() => {
        this._writeTimers.delete(e), this._holdOptimistic(e, () => {
          e === "threshold" ? this._thresholdLocal = null : this._targetLocal = null;
        }), this._write(qe(this.hass, s, r), () => {
          this._clearSettle(e), e === "threshold" ? this._thresholdLocal = null : this._targetLocal = null;
        });
      }, rr)
    );
  }
  _setItemMode(e, t) {
    const r = [...this._itemModesLocal];
    r[e] = t, this._itemModesLocal = r;
    const s = this._config?.items?.[e], n = () => {
      const o = [...this._itemModesLocal];
      o[e] = null, this._itemModesLocal = o;
    };
    if (s?.mode_entity) {
      if (!q(s.mode_entity)) return;
      this._holdOptimistic(`item:${e}`, n), this._write(
        qe(this.hass, s.mode_entity, lr[t]),
        () => {
          this._clearSettle(`item:${e}`), n();
        }
      );
      return;
    }
    const a = s?.switch_entity;
    t === "auto" || !Vt(a) || (this._holdOptimistic(`item:${e}`, n), this._write(gt(this.hass, a, t === "on"), () => {
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
ee.properties = {
  // Assigning `hass` is a reactive property write, so Home Assistant's
  // state updates re-render the card without a custom setter.
  hass: { attribute: !1 },
  _config: { state: !0 },
  _thresholdLocal: { state: !0 },
  _targetLocal: { state: !0 },
  _chargeModeLocal: { state: !0 },
  _expanded: { state: !0 },
  _itemModesLocal: { state: !0 }
}, ee.styles = [
  Le,
  Oe,
  Ne,
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

    /* A mouse click must not leave the ring standing; keyboard focus keeps it. */
    .chevron-row.clickable:focus {
      outline: none;
    }

    .chevron-row.clickable:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
      border-radius: 6px;
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
let ye = ee;
const gr = /* @__PURE__ */ new Set([
  "normal",
  "alarm",
  "night"
]), _r = 12.5, mr = 6.5, fr = 6, vr = 0.5, yr = 500, tt = 4, wr = 12, br = ["L1", "L2", "L3"], xr = {
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
function g(i) {
  return typeof i == "string" && i.trim().length > 0;
}
function L(i) {
  return Array.isArray(i) && i.some(g);
}
function _e(i) {
  const e = i.filter((t) => t !== null);
  return e.length > 0 ? e.reduce((t, r) => t + r, 0) : null;
}
const te = class te extends k {
  constructor() {
    super(), this._closer = new Re(this, () => this._collapse()), this._expanded = !1;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._closer.deactivate();
  }
  /** Keeps the `expanded` attribute in sync for the stacking rule. */
  updated() {
    this.toggleAttribute("expanded", this._expanded);
  }
  setConfig(e) {
    if (!e)
      throw new Error("des-inverter-card: Konfiguration fehlt");
    if (!e.name)
      throw new Error('des-inverter-card: "name" ist erforderlich');
    if (e.demo_state && !gr.has(e.demo_state))
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
    return { columns: wr, rows: tt, min_rows: tt };
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
    return e ? g(e.pv_power_entity) || g(e.today_production_entity) || g(e.total_production_entity) || g(e.fault_entity) || g(e.alarm_entity) || g(e.device_state_entity) || g(e.inverter_temp_entity) || g(e.dc_temp_entity) || g(e.grid_frequency_entity) || g(e.pv1_power_entity) || g(e.pv1_voltage_entity) || g(e.pv1_current_entity) || g(e.pv2_power_entity) || g(e.pv2_voltage_entity) || g(e.pv2_current_entity) || L(e.grid_power_entities) || L(e.inverter_power_entities) || L(e.grid_voltage_entities) : !1;
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
      strings: g(e.pv1_power_entity) || g(e.pv1_voltage_entity) || g(e.pv1_current_entity) || g(e.pv2_power_entity) || g(e.pv2_voltage_entity) || g(e.pv2_current_entity),
      phases: L(e.grid_power_entities) || L(e.inverter_power_entities) || L(e.grid_voltage_entities),
      dc: e.show_dc_temp !== !1 && g(e.dc_temp_entity),
      freq: g(e.grid_frequency_entity)
    };
  }
  get _kwpTotal() {
    return this._config?.kwp_total ?? _r;
  }
  get _kwpString() {
    return [
      this._config?.kwp_pv1 ?? mr,
      this._config?.kwp_pv2 ?? fr
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
    if (!g(e)) return null;
    const r = m(e, this.hass);
    if (r.kind !== "value") return null;
    let s = r.value;
    if (M(e)) {
      const n = Pe(e, this.hass);
      t === "power" ? n === "kw" ? s *= 1e3 : n === "mw" && (s *= 1e6) : t === "energy" && (n === "wh" ? s /= 1e3 : n === "mwh" && (s *= 1e3));
    }
    return Number.isFinite(s) ? s : null;
  }
  /** A configured entity's text, or null when unset/unavailable. */
  _text(e) {
    if (!g(e)) return null;
    const t = b(e, this.hass);
    return t.kind === "value" ? t.value : null;
  }
  _view() {
    return this._entityMode ? this._entityView() : this._demoView();
  }
  /** Wraps the static demo dataset in the (non-null) view shape. */
  _demoView() {
    const e = this._config, t = xr[e.demo_state ?? "normal"];
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
    g(e.pv_power_entity) ? s = this._num(e.pv_power_entity, "power") : s = _e([t, r]);
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
    ], a = (l) => ({
      grid: this._num(e.grid_power_entities?.[l], "power"),
      inverter: this._num(e.inverter_power_entities?.[l], "power"),
      voltage: this._num(e.grid_voltage_entities?.[l], "plain")
    }), o = this._blocks();
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
      phases: [a(0), a(1), a(2)],
      imbalance: this._imbalance(t, r),
      showStrings: o.strings,
      showPhases: o.phases,
      showDcItem: o.dc,
      showFreqItem: o.freq
    };
  }
  /** Per-string amber flags; skipped when a power is missing (would be NaN). */
  _imbalance(e, t) {
    const r = this._config;
    if (r?.imbalance_warn === !1) return [!1, !1];
    if (e === null || t === null) return [!1, !1];
    const s = r?.imbalance_ratio ?? vr, n = r?.imbalance_min_w ?? yr, a = (o, l) => o < s * l && l > n;
    return [a(e, t), a(t, e)];
  }
  // =========================================================================
  // render
  // =========================================================================
  render() {
    if (!this._config) return d;
    const t = this._view(), r = t.showStrings || t.showPhases || this._hasFooter(t);
    return c`
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
    return e.model && t.push(c`${e.model}`), t.push(c`${this._unit(e.todayProduction, y, "kWh")} heute`), t.push(
      c`${this._unit(e.totalProduction, _, "kWh")} gesamt`
    ), c`${t.map((r, s) => s === 0 ? r : c` · ${r}`)}`;
  }
  /** fault beats alarm beats device state; "OK"/absent means no fault. */
  _renderPill(e) {
    const t = (o) => {
      if (o === null) return null;
      const l = o.trim();
      return l.length > 0 && l.toLowerCase() !== "ok" ? l : null;
    }, r = t(e.fault), s = t(e.alarm), [n, a] = r ? [`Fault: ${r}`, "pill-fault"] : s ? [`Alarm: ${s}`, "pill-alarm"] : [e.deviceState, "pill-ok"];
    return c`<span class="pill ${a}">
      <span class="pill-label">${n}</span>
    </span>`;
  }
  _renderPowerRow(e) {
    const t = e.pvPower !== null && e.pvPower > 0, r = this._kwpTotal, s = e.pvPower !== null && r > 0 ? x(e.pvPower / (r * 1e3) * 100, 0, 999) : null;
    return c`
      <div class="power-row">
        <div class="pv">
          <span class="pv-value ${t ? "producing" : "idle"}">
            ${this._unit(e.pvPower, _, "W")}
          </span>
          ${s === null ? d : c`<span class="pv-share">
                ${_(s)} % von ${Wt(r)} kWp
              </span>`}
        </div>
        <div class="temp">
          ${this._thermometer()}
          ${this._unit(e.inverterTemp, y, "°C")}
        </div>
      </div>
    `;
  }
  _renderStringBars(e) {
    const t = this._kwpString;
    return c`
      <div class="strings">
        ${e.strings.map((r, s) => {
      const n = (t[s] ?? 0) * 1e3, a = r.power !== null && n > 0 ? x(r.power / n * 100, 0, 100) : 0, o = e.imbalance[s];
      return c`
            <div class="string-row">
              <span class="string-label">PV${s + 1}</span>
              <div class="bar">
                <div
                  class="bar-fill ${o ? "warn" : ""}"
                  style="width: ${a}%"
                ></div>
              </div>
              <span class="string-power">
                ${this._unit(r.power, _, "W")}
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
      <div class="overlay details">
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
            <span class="num">${this._unit(t.voltage, y, "V")}</span>
            <span class="num">${this._unit(t.current, y, "A")}</span>
          `
    )}
      </div>
    `;
  }
  // B. Phases — grid flow, inverter output, voltage per phase, plus a Σ row.
  _renderPhasesTable(e) {
    const t = this._config?.invert_grid ? -1 : 1, r = e.phases.map(
      (a) => a.grid === null ? null : a.grid * t
    ), s = _e(r), n = _e(e.phases.map((a) => a.inverter));
    return c`
      <div class="grid phases-grid">
        <span class="col-head">Phasen</span>
        <span class="col-head num">Netz</span>
        <span class="col-head num">WR-Ausgang</span>
        <span class="col-head num">Spannung</span>

        ${e.phases.map((a, o) => {
      const l = r[o];
      return c`
            <span class="row-label">${br[o]}</span>
            <span class="num ${this._gridClass(l)}">
              ${this._unit(l, Ke, "W")}
            </span>
            <span class="num">${this._unit(a.inverter, _, "W")}</span>
            <span class="num">${this._unit(a.voltage, y, "V")}</span>
          `;
    })}

        <span class="row-label sum">Σ</span>
        <span class="num sum ${this._gridClass(s)}">
          ${this._unit(s, Ke, "W")}
        </span>
        <span class="num sum">${this._unit(n, _, "W")}</span>
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
                ${this._unit(e.dcTemp, y, "°C")}
              </span>
            </div>` : d}
        ${e.showFreqItem ? c`<div class="foot-item">
              <span class="foot-label">Netzfrequenz</span>
              <span class="foot-value">
                ${this._unit(e.gridFrequency, (t) => y(t, 2), "Hz")}
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
      ${Pt`<path
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
te.properties = {
  // Assigning `hass` is a reactive property write, so Home Assistant's state
  // updates re-render the card (same mechanism as the storage card).
  hass: { attribute: !1 },
  _config: { state: !0 },
  _expanded: { state: !0 }
}, te.styles = [
  Oe,
  Ne,
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

    /* A mouse click must not leave the ring standing; keyboard focus keeps it. */
    .chevron-row.clickable:focus {
      outline: none;
    }

    .chevron-row.clickable:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
      border-radius: 6px;
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
  `
];
let we = te;
const $r = /* @__PURE__ */ new Set([
  "normal",
  "night",
  "export"
]), kr = 40, rt = 4, Er = 12, Ar = {
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
function $(i) {
  return typeof i == "string" && i.trim().length > 0;
}
function Sr(i) {
  return Array.isArray(i) && i.some($);
}
const re = class re extends k {
  constructor() {
    super(), this._closer = new Re(this, () => this._collapse()), this._expanded = !1;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._closer.deactivate();
  }
  /** Keeps the `expanded` attribute in sync for the stacking rule. */
  updated() {
    this.toggleAttribute("expanded", this._expanded);
  }
  setConfig(e) {
    if (!e)
      throw new Error("des-house-card: Konfiguration fehlt");
    if (!e.name)
      throw new Error('des-house-card: "name" ist erforderlich');
    if (e.demo_state && !$r.has(e.demo_state))
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
  /** HA sections view: a third of the section, fixed height. */
  getGridOptions() {
    return { columns: Er, rows: rt, min_rows: rt };
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
    return e ? $(e.pv_power_entity) || $(e.load_power_entity) || $(e.grid_power_entity) || Sr(e.storage_power_entities) || $(e.today_consumption_entity) || $(e.today_import_entity) || $(e.today_export_entity) || $(e.autarky_entity) : !1;
  }
  /**
   * A configured entity's numeric value, rescaled onto the card's base unit
   * (W for power, kWh for energy). `null` for an unset, unavailable or
   * non-numeric slot - all of which render as a muted "–".
   */
  _num(e, t) {
    if (!$(e)) return null;
    const r = m(e, this.hass);
    if (r.kind !== "value") return null;
    let s = r.value;
    if (M(e)) {
      const n = Pe(e, this.hass);
      t === "power" ? n === "kw" ? s *= 1e3 : n === "mw" && (s *= 1e6) : t === "energy" && (n === "wh" ? s /= 1e3 : n === "mwh" && (s *= 1e3));
    }
    return Number.isFinite(s) ? s : null;
  }
  _rawInputs() {
    if (!this._entityMode)
      return Ar[this._config.demo_state ?? "normal"];
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
    const e = this._config, t = this._rawInputs(), r = e.invert_grid ? -1 : 1, n = (t.gridRaw === null ? null : t.gridRaw * r) ?? 0, a = Math.max(n, 0), o = Math.max(-n, 0), l = (e.storage_positive ?? "discharge") === "charge", u = t.storage.reduce((v, E) => E === null ? v : v + Math.max(l ? -E : E, 0), 0);
    let p = 0, h = 0, f = 0, w;
    if (t.pvPower !== null) {
      const v = t.storage.reduce((K, ce) => ce === null ? K : K + Math.max(l ? ce : -ce, 0), 0);
      f = Math.max(t.pvPower - o - v, 0), p = u, h = a;
      const E = f + p + h;
      w = (K) => E > 0 ? x(K / E * 100, 0, 100) : 0;
    } else {
      const v = t.load !== null && t.load > 0 ? t.load : 0;
      v > 0 && (p = Math.min(u, v), h = Math.min(a, v - p), f = Math.max(v - p - h, 0)), w = (E) => v > 0 ? x(E / v * 100, 0, 100) : 0;
    }
    return {
      load: t.load,
      gridIn: a,
      gridOut: o,
      solarShare: f,
      storageShare: p,
      gridShare: h,
      solarPct: w(f),
      storagePct: w(p),
      gridPct: w(h),
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
    return t === null || t <= 0 || r === null ? null : x((1 - r / t) * 100, 0, 100);
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
        <div class="card">${this._renderCollapsed(e, t)}</div>
        ${this._expanded && t.hasToday ? this._renderExpanded(t) : d}
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
    return c`${this._unit(e.todayConsumption, y, "kWh")} heute ·
    ${this._unit(e.autarky, _, "%")} autark`;
  }
  /**
   * feed-in (green) beats draw (red) beats a neutral "Netz … W". Grid flow
   * within ±`grid_min_w` reads neutral, since a hybrid inverter always trickles
   * a little from the grid and that should not paint the pill red.
   */
  _renderPill(e) {
    const t = this._config?.grid_min_w ?? kr, r = e.gridIn + e.gridOut, [s, n] = e.gridOut >= t ? [`Einspeisung ${_(e.gridOut)} W`, "pill-feed"] : e.gridIn >= t ? [`Netzbezug ${_(e.gridIn)} W`, "pill-draw"] : [`Netz ${_(r)} W`, "pill-idle"];
    return c`<span class="pill ${n}">
      <span class="pill-label">${s}</span>
    </span>`;
  }
  _renderPowerRow(e) {
    return c`
      <div class="power-row">
        <div class="load">
          <span class="load-value">${this._unit(e.load, _, "W")}</span>
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
        aria-label="Stromherkunft: Solar ${_(e.solarPct)} %, Speicher
        ${_(e.storagePct)} %, Netz ${_(e.gridPct)} %"
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
              <span class="legend-power">${_(r.power)} W</span>
              <span class="legend-pct">${_(r.pct)} %</span>
            </div>
          `
    )}
      </div>
    `;
  }
  // --- expanded ------------------------------------------------------------
  _renderExpanded(e) {
    return c`
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
    return t === null ? d : c`
      <span class="today-label">${e}</span>
      <span class="today-value ${r}">${y(t)} kWh</span>
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
    this._expanded = !this._expanded, this._expanded ? this._closer.activate() : this._closer.deactivate();
  }
  _collapse() {
    this._expanded && (this._expanded = !1, this._closer.deactivate());
  }
  _onKeydown(e) {
    (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this._toggleExpanded());
  }
};
re.properties = {
  // Assigning `hass` is a reactive property write, so Home Assistant's state
  // updates re-render the card (same mechanism as the other cards).
  hass: { attribute: !1 },
  _config: { state: !0 },
  _expanded: { state: !0 }
}, re.styles = [
  Oe,
  Ne,
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

    /* A mouse click must not leave the ring standing; keyboard focus keeps it. */
    .chevron-row.clickable:focus {
      outline: none;
    }

    .chevron-row.clickable:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
      border-radius: 6px;
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
      color: var(--success-color, #2e7d32);
    }
  `
];
let be = re;
const J = ["day", "week", "month", "year"], Cr = new Set(J), st = 4, Tr = 12, Pr = {
  day: "Tag",
  week: "Woche",
  month: "Monat",
  year: "Jahr"
}, O = [
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
const Mr = {
  day: Y([17.6, 22.4, 4.4, 3.1, 6.2, 5.8]),
  week: Y([148.2, 127.5, 38.6, 41, 32.1, 28.4]),
  month: Y([610, 590, 160, 175, 140, 128]),
  year: Y([5400, 8200, 1900, 4100, 1200, 1100])
};
function ft(i) {
  return Array.isArray(i) ? i.some(ft) : typeof i == "number" ? Number.isFinite(i) : typeof i == "string" && i.trim().length > 0;
}
const se = class se extends k {
  constructor() {
    super(), this._period = null;
  }
  setConfig(e) {
    if (!e)
      throw new Error("des-stats-card: Konfiguration fehlt");
    if (!e.name)
      throw new Error('des-stats-card: "name" ist erforderlich');
    if (e.default_period && !Cr.has(e.default_period))
      throw new Error(
        'des-stats-card: "default_period" muss "day", "week", "month" oder "year" sein'
      );
    this._config = e, this._period = null;
  }
  getCardSize() {
    const e = this._effectivePeriod(this._availablePeriods()), t = e ? O.filter((r) => this._periodValues(e)[r.key] !== null).length : 0;
    return 2 + Math.ceil(t / 2);
  }
  /** HA sections view: a third of the section, fixed height. */
  getGridOptions() {
    return { columns: Tr, rows: st, min_rows: st };
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
      return r !== void 0 && O.some((s) => ft(r[s.key]));
    }) : !1;
  }
  /**
   * A configured slot's numeric value, rescaled onto kWh (Wh → /1000,
   * MWh → ×1000). `null` for an unset, unavailable or non-numeric slot.
   */
  _num(e) {
    if (e === void 0 || typeof e == "string" && e.trim().length === 0) return null;
    const t = m(e, this.hass);
    if (t.kind !== "value") return null;
    let r = t.value;
    if (typeof e == "string" && M(e)) {
      const s = Pe(e, this.hass);
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
    if (!this._entityMode) return Mr[e];
    const t = this._config?.periods?.[e], r = {};
    for (const { key: s } of O) r[s] = this._metricValue(t, s);
    return r;
  }
  /** Periods that have at least one readable figure (all four in demo mode). */
  _availablePeriods() {
    return this._entityMode ? J.filter((e) => {
      const t = this._periodValues(e);
      return O.some((r) => t[r.key] !== null);
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
    return t === null || t <= 0 || e === null ? null : x((1 - e / t) * 100, 0, 100);
  }
  // =========================================================================
  // render
  // =========================================================================
  render() {
    const e = this._config;
    if (!e) return d;
    const t = this._availablePeriods(), r = this._effectivePeriod(t), s = r ? this._periodValues(r) : null, n = s ? this._ratio(s.import, s.consumption) : null, a = s ? this._ratio(s.export, s.production) : null;
    return c`
      <ha-card>
        <div class="card">
          <div class="header">
            <span class="name">${e.name}</span>
            ${t.length > 0 && r ? Q(
      t.map((o) => ({ value: o, label: Pr[o] })),
      r,
      (o) => this._setPeriod(o),
      "Zeitraum"
    ) : d}
          </div>

          ${n === null && a === null ? d : c`<div class="meta">
                ${this._pct(n)} % autark · ${this._pct(a)} %
                Eigenverbrauch
              </div>`}

          ${s ? this._renderRows(s) : d}
        </div>
      </ha-card>
    `;
  }
  _renderRows(e) {
    const r = O.map((s) => e[s.key]).filter(
      (s) => s !== null
    ).reduce((s, n) => Math.max(s, n), 0);
    return c`
      <div class="rows">
        ${O.map((s) => {
      const n = e[s.key];
      if (n === null) return d;
      const a = r > 0 ? x(n / r * 100, 0, 100) : 0;
      return c`
            <span class="row-label">${s.label}</span>
            <div class="bar">
              <div
                class="bar-fill ${s.cls}"
                style="width: ${a}%"
              ></div>
            </div>
            <span class="row-value">${y(n, 2)} kWh</span>
          `;
    })}
      </div>
    `;
  }
  /** Whole-number percent, or a muted "–" when it cannot be computed. */
  _pct(e) {
    return e === null ? c`<span class="unavail">–</span>` : c`${_(e)}`;
  }
  _setPeriod(e) {
    this._period = e;
  }
};
se.properties = {
  // Assigning `hass` is a reactive property write, so Home Assistant's state
  // updates re-render the card (same mechanism as the other cards).
  hass: { attribute: !1 },
  _config: { state: !0 },
  _period: { state: !0 }
}, se.styles = [
  Le,
  S`
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
let xe = se;
const $e = ["day", "week", "month", "year"], Lr = new Set($e), Or = {
  day: "Tag",
  week: "Woche",
  month: "Monat",
  year: "Jahr"
}, me = 6, Nr = 24, ie = class ie extends k {
  constructor() {
    super(), this._mountToken = 0, this._awaitingApex = !1, this._period = null;
  }
  setConfig(e) {
    if (!e)
      throw new Error("des-chart-card: Konfiguration fehlt");
    if (!e.name)
      throw new Error('des-chart-card: "name" ist erforderlich');
    if (e.default_period && !Lr.has(e.default_period))
      throw new Error(
        'des-chart-card: "default_period" muss "day", "week", "month" oder "year" sein'
      );
    if (e.periods !== void 0 && (typeof e.periods != "object" || e.periods === null))
      throw new Error('des-chart-card: "periods" muss ein Objekt sein');
    this._config = e, this._period = null, this._teardownChart();
  }
  getCardSize() {
    return me;
  }
  /** HA sections view: two thirds of the section wide, fixed height. */
  getGridOptions() {
    return { columns: Nr, rows: me, min_rows: me };
  }
  static getStubConfig() {
    return { type: "custom:des-chart-card", name: "Chart", default_period: "day" };
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._teardownChart();
  }
  firstUpdated() {
    !this._apexAvailable() && !this._awaitingApex && (this._awaitingApex = !0, customElements.whenDefined("apexcharts-card").then(() => this.requestUpdate()).catch(() => {
    }));
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
    return typeof t == "string" && t.trim().length > 0 ? t : Or[e];
  }
  /** Periods that carry a chart; empty means "demo" (no periods configured). */
  _realPeriods() {
    return $e.filter((e) => this._chartConfig(e) !== null);
  }
  get _isDemo() {
    return this._realPeriods().length === 0;
  }
  _available() {
    const e = this._realPeriods();
    return e.length > 0 ? e : [...$e];
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
    return c`
      <ha-card>
        <div class="card">
          <div class="header">
            <span class="name">${e.name}</span>
            ${Q(
      t.map((n) => ({ value: n, label: this._label(n) })),
      r,
      (n) => this._setPeriod(n),
      "Zeitraum"
    )}
          </div>
          ${s ? c`<div class="meta">${s}</div>` : d}
          ${this._renderChartArea(r)}
        </div>
      </ha-card>
    `;
  }
  _renderChartArea(e) {
    return this._isDemo || this._chartConfig(e) === null ? c`<div class="hint">Keine Chart-Config</div>` : this._apexAvailable() ? c`<div class="chart" id="chart"></div>` : c`<div class="hint">apexcharts-card nicht installiert</div>`;
  }
  _setPeriod(e) {
    this._period = e;
  }
  // =========================================================================
  // embedded chart lifecycle
  // =========================================================================
  updated() {
    this._syncChart();
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
    const n = await this._getHelpers();
    if (!n || s !== this._mountToken) return;
    let a;
    try {
      a = n.createCardElement(this._embedConfig(t));
    } catch (o) {
      console.error("des-chart-card: Chart konnte nicht erzeugt werden", o);
      return;
    }
    s === this._mountToken && (a.classList.add("embedded"), a.hass = this.hass, e.replaceChildren(a), this._chartEl = a, this._chartPeriod = r);
  }
  /** Adds the card type and forces the embedded card's own header off. */
  _embedConfig(e) {
    const t = e.header && typeof e.header == "object" ? e.header : {};
    return {
      ...e,
      type: "custom:apexcharts-card",
      header: { ...t, show: !1 }
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
ie.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 },
  _period: { state: !0 }
}, ie.styles = [
  Le,
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
        background: var(--card-background-color, var(--ha-card-background, #fff));
        color: var(--primary-text-color);
      }

      .card {
        flex: 1;
        display: flex;
        flex-direction: column;
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

      .chart {
        margin-top: 8px;
      }

      /* The embedded apexcharts-card renders its own ha-card; strip its frame
         so the chart sits flush inside ours. Custom properties pierce the
         embedded shadow root, so setting them here is enough. */
      .chart .embedded {
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
<<<<<<< HEAD
let ke = ie;
const Rr = "0.3.1", Ir = [
=======
let Ee = ne;
const Pr = "0.2.3", Mr = [
>>>>>>> 84c2ee9c84bd29f4fbd58208bbedbbf1668a5895
  {
    type: "des-storage-card",
    element: ye,
    name: "Daniels Speicherkarte",
    description: "Speicherkarte für Hausakkus (battery) und Wärmespeicher-Gruppen (thermal_group)."
  },
  {
    type: "des-inverter-card",
    element: we,
    name: "Daniels Wechselrichterkarte",
    description: "Wechselrichter-Übersicht: PV-Leistung, Strings und Phasen (Entities oder Demo-Werte)."
  },
  {
    type: "des-house-card",
    element: be,
    name: "Daniels Hauskarte",
    description: "Hausverbrauch und Stromherkunft: Solar, Speicher, Netz plus Tageswerte (Entities oder Demo-Werte)."
  },
  {
    type: "des-stats-card",
    element: xe,
    name: "Daniels Statistikkarte",
    description: "Energiestatistik je Zeitraum (Tag/Woche/Monat/Jahr): Verbrauch, Produktion, Import, Export, Laden, Entladen."
  },
  {
    type: "des-chart-card",
    element: ke,
    name: "Daniels Chartkarte",
    description: "Kopfzeile mit Zeitraum-Umschalter und eingebettetem ApexCharts-Chart je Zeitraum."
  }
];
window.customCards = window.customCards ?? [];
for (const i of Ir)
  customElements.get(i.type) || customElements.define(i.type, i.element), window.customCards.some((e) => e.type === i.type) || window.customCards.push({
    type: i.type,
    name: i.name,
    description: i.description,
    preview: !1
  });
console.info(
  `%c DANIELS-ENERGY-CARDS %c v${Rr} `,
  "background:#03a9f4;color:#fff;font-weight:700;border-radius:3px 0 0 3px;padding:2px 4px",
  "background:#555;color:#fff;border-radius:0 3px 3px 0;padding:2px 4px"
);
export {
  ke as DesChartCard,
  be as DesHouseCard,
  we as DesInverterCard,
  xe as DesStatsCard,
  ye as DesStorageCard
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const U = globalThis, V = U.ShadowRoot && (U.ShadyCSS === void 0 || U.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, q = Symbol(), Z = /* @__PURE__ */ new WeakMap();
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
      s && (t = Z.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Z.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const vt = (i) => new pt(typeof i == "string" ? i : i + "", void 0, q), yt = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, r, o) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + i[o + 1], i[0]);
  return new pt(e, i, q);
}, bt = (i, t) => {
  if (V) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), r = U.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = e.cssText, i.appendChild(s);
  }
}, X = V ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return vt(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: xt, defineProperty: wt, getOwnPropertyDescriptor: At, getOwnPropertyNames: Et, getOwnPropertySymbols: St, getPrototypeOf: kt } = Object, D = globalThis, Q = D.trustedTypes, Ct = Q ? Q.emptyScript : "", Mt = D.reactiveElementPolyfillSupport, k = (i, t) => i, W = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? Ct : null;
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
} }, ut = (i, t) => !xt(i, t), tt = { attribute: !0, type: String, converter: W, reflect: !1, useDefault: !1, hasChanged: ut };
Symbol.metadata ??= Symbol("metadata"), D.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let x = class extends HTMLElement {
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
    const { get: r, set: o } = At(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: r, set(n) {
      const l = r?.call(this);
      o?.call(this, n), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? tt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(k("elementProperties"))) return;
    const t = kt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(k("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(k("properties"))) {
      const e = this.properties, s = [...Et(e), ...St(e)];
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
    return bt(t, this.constructor.elementStyles), t;
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
      const o = (s.converter?.toAttribute !== void 0 ? s.converter : W).toAttribute(e, s.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const o = s.getPropertyOptions(r), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : W;
      this._$Em = r;
      const l = n.fromAttribute(e, o.type);
      this[r] = l ?? this._$Ej?.get(r) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, r = !1, o) {
    if (t !== void 0) {
      const n = this.constructor;
      if (r === !1 && (o = this[t]), s ??= n.getPropertyOptions(t), !((s.hasChanged ?? ut)(o, e) || s.useDefault && s.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: r, wrapped: o }, n) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, o] of s) {
        const { wrapped: n } = o, l = this[r];
        n !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, o, l);
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
x.elementStyles = [], x.shadowRootOptions = { mode: "open" }, x[k("elementProperties")] = /* @__PURE__ */ new Map(), x[k("finalized")] = /* @__PURE__ */ new Map(), Mt?.({ ReactiveElement: x }), (D.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const K = globalThis, et = (i) => i, R = K.trustedTypes, st = R ? R.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, ft = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, gt = "?" + $, Pt = `<${gt}>`, y = document, M = () => y.createComment(""), P = (i) => i === null || typeof i != "object" && typeof i != "function", G = Array.isArray, Tt = (i) => G(i) || typeof i?.[Symbol.iterator] == "function", B = `[ 	
\f\r]`, E = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, rt = /-->/g, it = />/g, _ = RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ot = /'/g, nt = /"/g, mt = /^(?:script|style|textarea|title)$/i, Ht = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), u = Ht(1), w = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), at = /* @__PURE__ */ new WeakMap(), v = y.createTreeWalker(y, 129);
function $t(i, t) {
  if (!G(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return st !== void 0 ? st.createHTML(t) : t;
}
const Nt = (i, t) => {
  const e = i.length - 1, s = [];
  let r, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = E;
  for (let l = 0; l < e; l++) {
    const a = i[l];
    let d, p, h = -1, f = 0;
    for (; f < a.length && (n.lastIndex = f, p = n.exec(a), p !== null); ) f = n.lastIndex, n === E ? p[1] === "!--" ? n = rt : p[1] !== void 0 ? n = it : p[2] !== void 0 ? (mt.test(p[2]) && (r = RegExp("</" + p[2], "g")), n = _) : p[3] !== void 0 && (n = _) : n === _ ? p[0] === ">" ? (n = r ?? E, h = -1) : p[1] === void 0 ? h = -2 : (h = n.lastIndex - p[2].length, d = p[1], n = p[3] === void 0 ? _ : p[3] === '"' ? nt : ot) : n === nt || n === ot ? n = _ : n === rt || n === it ? n = E : (n = _, r = void 0);
    const m = n === _ && i[l + 1].startsWith("/>") ? " " : "";
    o += n === E ? a + Pt : h >= 0 ? (s.push(d), a.slice(0, h) + ft + a.slice(h) + $ + m) : a + $ + (h === -2 ? l : m);
  }
  return [$t(i, o + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class T {
  constructor({ strings: t, _$litType$: e }, s) {
    let r;
    this.parts = [];
    let o = 0, n = 0;
    const l = t.length - 1, a = this.parts, [d, p] = Nt(t, e);
    if (this.el = T.createElement(d, s), v.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = v.nextNode()) !== null && a.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(ft)) {
          const f = p[n++], m = r.getAttribute(h).split($), N = /([.?@])?(.*)/.exec(f);
          a.push({ type: 1, index: o, name: N[2], strings: m, ctor: N[1] === "." ? Ut : N[1] === "?" ? Rt : N[1] === "@" ? zt : L }), r.removeAttribute(h);
        } else h.startsWith($) && (a.push({ type: 6, index: o }), r.removeAttribute(h));
        if (mt.test(r.tagName)) {
          const h = r.textContent.split($), f = h.length - 1;
          if (f > 0) {
            r.textContent = R ? R.emptyScript : "";
            for (let m = 0; m < f; m++) r.append(h[m], M()), v.nextNode(), a.push({ type: 2, index: ++o });
            r.append(h[f], M());
          }
        }
      } else if (r.nodeType === 8) if (r.data === gt) a.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = r.data.indexOf($, h + 1)) !== -1; ) a.push({ type: 7, index: o }), h += $.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const s = y.createElement("template");
    return s.innerHTML = t, s;
  }
}
function A(i, t, e = i, s) {
  if (t === w) return t;
  let r = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const o = P(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== o && (r?._$AO?.(!1), o === void 0 ? r = void 0 : (r = new o(i), r._$AT(i, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = r : e._$Cl = r), r !== void 0 && (t = A(i, r._$AS(i, t.values), r, s)), t;
}
class Ot {
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
    let o = v.nextNode(), n = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let d;
        a.type === 2 ? d = new H(o, o.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (d = new It(o, this, t)), this._$AV.push(d), a = s[++l];
      }
      n !== a?.index && (o = v.nextNode(), n++);
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
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    t = A(this, t, e), P(t) ? t === c || t == null || t === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : t !== this._$AH && t !== w && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Tt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== c && P(this._$AH) ? this._$AA.nextSibling.data = t : this.T(y.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = T.createElement($t(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(e);
    else {
      const o = new Ot(r, this), n = o.u(this.options);
      o.p(e), this.T(n), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = at.get(t.strings);
    return e === void 0 && at.set(t.strings, e = new T(t)), e;
  }
  k(t) {
    G(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, r = 0;
    for (const o of t) r === e.length ? e.push(s = new H(this.O(M()), this.O(M()), this, this.options)) : s = e[r], s._$AI(o), r++;
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
class L {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, r, o) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = c;
  }
  _$AI(t, e = this, s, r) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = A(this, t, e, 0), n = !P(t) || t !== this._$AH && t !== w, n && (this._$AH = t);
    else {
      const l = t;
      let a, d;
      for (t = o[0], a = 0; a < o.length - 1; a++) d = A(this, l[s + a], e, a), d === w && (d = this._$AH[a]), n ||= !P(d) || d !== this._$AH[a], d === c ? t = c : t !== c && (t += (d ?? "") + o[a + 1]), this._$AH[a] = d;
    }
    n && !r && this.j(t);
  }
  j(t) {
    t === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ut extends L {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === c ? void 0 : t;
  }
}
class Rt extends L {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== c);
  }
}
class zt extends L {
  constructor(t, e, s, r, o) {
    super(t, e, s, r, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = A(this, t, e, 0) ?? c) === w) return;
    const s = this._$AH, r = t === c && s !== c || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== c && (s === c || r);
    r && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class It {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    A(this, t);
  }
}
const Dt = K.litHtmlPolyfillSupport;
Dt?.(T, H), (K.litHtmlVersions ??= []).push("3.3.3");
const Lt = (i, t, e) => {
  const s = e?.renderBefore ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const o = e?.renderBefore ?? null;
    s._$litPart$ = r = new H(t.insertBefore(M(), o), o, void 0, e ?? {});
  }
  return r._$AI(i), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Y = globalThis;
class C extends x {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Lt(e, this.renderRoot, this.renderOptions);
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
C._$litElement$ = !0, C.finalized = !0, Y.litElementHydrateSupport?.({ LitElement: C });
const Bt = Y.litElementPolyfillSupport;
Bt?.({ LitElement: C });
(Y.litElementVersions ??= []).push("4.2.2");
const J = "de-DE";
function b(i) {
  return new Intl.NumberFormat(J, { maximumFractionDigits: 0 }).format(i);
}
function jt(i) {
  return new Intl.NumberFormat(J, {
    maximumFractionDigits: 0,
    signDisplay: "always"
  }).format(i);
}
function S(i, t = 1) {
  return new Intl.NumberFormat(J, {
    minimumFractionDigits: 0,
    maximumFractionDigits: t
  }).format(i);
}
function lt(i, t, e) {
  return Math.min(e, Math.max(t, i));
}
function g(i, t) {
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
const _t = {
  charging: "Lädt",
  discharging: "Entlädt",
  idle: "Bereit",
  heating: "Heizt",
  off: "Aus"
}, O = 10, ct = 80, j = 5, dt = 5, Wt = [
  { mode: "on", label: "An" },
  { mode: "auto", label: "Auto" },
  { mode: "off", label: "Aus" }
];
function Ft(i) {
  return i === !1 ? "off" : i === "standby" ? "idle" : typeof i == "string" && i in _t ? i : null;
}
function Vt(i) {
  return i === !0 ? "on" : i === !1 ? "off" : i === "on" || i === "auto" || i === "off" ? i : "auto";
}
const I = class I extends C {
  constructor() {
    super(), this._status = "idle", this._threshold = O, this._chargeMode = "auto", this._expanded = !1, this._itemModes = [];
  }
  setConfig(t) {
    if (!t)
      throw new Error("des-storage-card: Konfiguration fehlt");
    if (t.variant !== "battery" && t.variant !== "thermal_group")
      throw new Error(
        'des-storage-card: "variant" muss "battery" oder "thermal_group" sein'
      );
    if (!t.name)
      throw new Error('des-storage-card: "name" ist erforderlich');
    if (t.variant === "battery") {
      const e = Ft(t.status);
      if (e === null)
        throw new Error(
          'des-storage-card: "status" muss charging | discharging | idle | standby | heating | off sein'
        );
      this._status = e;
      const s = g(t.threshold_pct, this.hass);
      this._threshold = s === null ? O : lt(
        Math.round(s / j) * j,
        O,
        ct
      ), this._chargeMode = t.charge_mode === "charge" ? "charge" : "auto";
    } else {
      const e = t.items;
      if (!Array.isArray(e) || e.length === 0)
        throw new Error(
          'des-storage-card: "items" braucht mindestens einen Eintrag'
        );
      if (e.length > dt)
        throw new Error(
          `des-storage-card: "items" erlaubt höchstens ${dt} Einträge`
        );
      if (e.some((s) => !s || !s.name))
        throw new Error('des-storage-card: jeder Eintrag in "items" braucht "name"');
      this._itemModes = e.map((s) => Vt(s.mode));
    }
    this._config = t, this._expanded = !1;
  }
  getCardSize() {
    return this._config?.variant === "thermal_group" ? 1 + (this._config.items?.length ?? 0) : this._expanded ? 3 : 2;
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
      charge_mode: "auto",
      time_remaining: "4:36 h bis 20 %",
      time_at: "um 00:12",
      backup: "none"
    };
  }
  render() {
    const t = this._config;
    return t ? u`
      <ha-card>
        <div class="card">
          ${t.variant === "battery" ? this._renderBattery(t) : this._renderThermalGroup(t)}
        </div>
      </ha-card>
    ` : c;
  }
  // =========================================================================
  // variant: battery
  // =========================================================================
  _renderBattery(t) {
    const e = lt(g(t.soc, this.hass) ?? 0, 0, 100), s = g(t.energy_kwh, this.hass), r = g(t.power_w, this.hass), o = t.backup ?? "none", n = this._batteryTimes(t);
    return u`
      <div class="header">
        <div class="head-left">
          <span class="name">${t.name}</span>
          <span class="meta">${this._batteryMeta(t)}</span>
        </div>
        <div class="badges">
          ${o === "none" ? c : this._renderBackupBadge(o)}
          <span class="badge status-${this._status}">
            ${_t[this._status]}
          </span>
        </div>
      </div>

      <div
        class="main"
        role="button"
        tabindex="0"
        aria-expanded=${this._expanded ? "true" : "false"}
        @click=${this._toggleExpanded}
        @keydown=${this._onMainKeydown}
      >
        ${this._renderBatteryIcon(e)}
        <div class="readout">
          <span class="soc">${b(e)} %</span>
          ${s === null ? c : u`<span class="energy">${S(s)} kWh</span>`}
        </div>
        <div class="timing">
          ${r === null ? c : u`<div class=${this._powerClass(r)}>
                ${this._formatPower(r)}
              </div>`}
          ${n === null ? c : u`<div class="muted">${n}</div>`}
        </div>
        <ha-icon
          class="chevron ${this._expanded ? "open" : ""}"
          icon="mdi:chevron-down"
        ></ha-icon>
      </div>

      ${this._expanded ? u`<div class="controls">
            <button
              class="action ${this._chargeMode === "charge" ? "active" : ""}"
              type="button"
              @click=${this._toggleChargeMode}
            >
              ${this._chargeMode === "charge" ? "Auto" : "Jetzt laden"}
            </button>
            <div class="slider-wrap">
              <input
                class="slider"
                type="range"
                min=${O}
                max=${ct}
                step=${j}
                .value=${String(this._threshold)}
                aria-label="Entladeschwelle"
                @input=${this._onThresholdInput}
              />
              <span class="slider-value">${b(this._threshold)} %</span>
            </div>
          </div>` : c}
    `;
  }
  /** "10,2 kWh · 23,5 °C · Schwelle 20 %" - temp segment dropped when null. */
  _batteryMeta(t) {
    const e = g(t.capacity_kwh, this.hass), s = g(t.temp_c, this.hass), r = [];
    return e !== null && r.push(`${S(e)} kWh`), s !== null && r.push(`${S(s)} °C`), r.push(`Schwelle ${b(this._threshold)} %`), r.join(" · ");
  }
  /** "4:36 h bis 20 % · um 00:12" - null when neither is set. */
  _batteryTimes(t) {
    const e = [
      ht(t.time_remaining, this.hass),
      ht(t.time_at, this.hass)
    ].filter((s) => s !== null);
    return e.length > 0 ? e.join(" · ") : null;
  }
  /** Upright battery; the fill grows from the bottom. */
  _renderBatteryIcon(t) {
    const e = t > 50 ? "var(--success-color, #2e7d32)" : t >= 20 ? "var(--warning-color, #ff9800)" : "var(--error-color, #d32f2f)", s = 6, r = 26, o = r * t / 100, n = s + (r - o);
    return u`
      <svg
        class="battery"
        viewBox="0 0 22 36"
        width="22"
        height="36"
        role="img"
        aria-label="Ladestand ${b(t)} Prozent"
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
          y=${n}
          width="14"
          height=${o}
          rx="1.5"
          fill=${e}
        />
      </svg>
    `;
  }
  // =========================================================================
  // variant: thermal_group
  // =========================================================================
  _renderThermalGroup(t) {
    const e = t.items ?? [], s = e.map((l) => g(l.power_w, this.hass) ?? 0), r = e.reduce(
      (l, a) => l + (g(a.energy_kwh, this.hass) ?? 0),
      0
    ), o = s.reduce((l, a) => l + a, 0), n = s.filter((l) => l > 0).length;
    return u`
      <div class="header">
        <div class="head-left">
          <span class="name">${t.name}</span>
        </div>
        <div class="badges">
          <span class="badge ${n > 0 ? "status-heating" : "status-off"}">
            ${n > 0 ? `${b(n)} heizen` : "Aus"}
          </span>
        </div>
      </div>

      <div class="main">
        <ha-icon class="fish" icon="mdi:fish"></ha-icon>
        <div class="readout stacked">
          <span class="soc">${S(r)} kWh</span>
          <span class="energy">heute eingespeichert</span>
        </div>
        <div class="timing">
          <div class=${o > 0 ? "power heat" : "power neutral"}>
            ${this._formatPower(o)}
          </div>
        </div>
      </div>

      <div class="items">
        ${e.map((l, a) => this._renderItem(l, a, s[a]))}
      </div>
    `;
  }
  _renderItem(t, e, s) {
    const r = g(t.energy_kwh, this.hass), o = this._itemModes[e] ?? "auto";
    return u`
      <div class="item">
        <span class="item-name">${t.name}</span>
        <span class="item-energy">
          ${r === null ? "" : `${S(r)} kWh`}
        </span>
        <span class=${s > 0 ? "item-power heat" : "item-power"}>
          ${this._formatPower(s)}
        </span>
        <div class="seg" role="group" aria-label="Modus ${t.name}">
          ${Wt.map(
      ({ mode: n, label: l }) => u`
              <button
                type="button"
                class=${o === n ? "active" : ""}
                aria-pressed=${o === n ? "true" : "false"}
                @click=${() => this._setItemMode(e, n)}
              >
                ${l}
              </button>
            `
    )}
        </div>
      </div>
    `;
  }
  // =========================================================================
  // shared
  // =========================================================================
  _renderBackupBadge(t) {
    return t === "active" ? u`<span class="badge backup-active">NOTSTROM AKTIV</span>` : u`<span class="badge backup-ready">Notstrom bereit</span>`;
  }
  _powerClass(t) {
    return t === 0 ? "power neutral" : t < 0 ? "power negative" : "power positive";
  }
  _formatPower(t) {
    return `${t === 0 ? b(0) : jt(t)} W`;
  }
  // --- local-only interaction (phase 1 persists nothing) -------------------
  _toggleExpanded() {
    this._expanded = !this._expanded;
  }
  _onMainKeydown(t) {
    (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this._toggleExpanded());
  }
  _toggleChargeMode(t) {
    t.stopPropagation(), this._chargeMode = this._chargeMode === "charge" ? "auto" : "charge";
  }
  _onThresholdInput(t) {
    const e = t.target;
    this._threshold = Number(e.value);
  }
  _setItemMode(t, e) {
    const s = [...this._itemModes];
    s[t] = e, this._itemModes = s;
  }
};
I.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 },
  _threshold: { state: !0 },
  _chargeMode: { state: !0 },
  _expanded: { state: !0 },
  _itemModes: { state: !0 }
}, I.styles = yt`
    :host {
      display: block;
    }

    ha-card {
      background: var(--card-background-color, var(--ha-card-background, #fff));
      color: var(--primary-text-color);
    }

    .card {
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

    .badges {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }

    .badge {
      display: inline-block;
      padding: 2px 9px;
      border-radius: 11px;
      font-size: 11px;
      font-weight: 500;
      line-height: 1.5;
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

    /* --- main row --- */

    .main {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 8px;
    }

    [role='button'].main {
      cursor: pointer;
      outline: none;
    }

    [role='button'].main:focus-visible {
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
      color: var(--warning-color, #ff9800);
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

    .power.heat {
      color: var(--warning-color, #ff9800);
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
      gap: 12px;
      margin-top: 10px;
      padding-top: 10px;
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
      padding: 5px 13px;
      cursor: pointer;
      white-space: nowrap;
    }

    .action:hover {
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, transparent);
    }

    .action.active {
      background: var(--primary-color, #03a9f4);
      border-color: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
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
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
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

    .item-power.heat {
      color: var(--warning-color, #ff9800);
      font-weight: 500;
    }

    .seg {
      display: inline-flex;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.35));
      border-radius: 6px;
      overflow: hidden;
    }

    .seg button {
      font-family: inherit;
      font-size: 11px;
      line-height: 1.5;
      padding: 3px 8px;
      background: none;
      border: none;
      border-left: 1px solid var(--divider-color, rgba(127, 127, 127, 0.35));
      color: var(--secondary-text-color);
      cursor: pointer;
    }

    .seg button:first-child {
      border-left: none;
    }

    .seg button:hover {
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, transparent);
    }

    .seg button.active {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
    }

    .seg button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: -2px;
    }
  `;
let F = I;
const z = "des-storage-card", qt = "0.1.0";
customElements.get(z) || customElements.define(z, F);
window.customCards = window.customCards ?? [];
window.customCards.some((i) => i.type === z) || window.customCards.push({
  type: z,
  name: "Daniels Speicherkarte",
  description: "Speicherkarte für Hausakkus (battery) und Wärmespeicher-Gruppen (thermal_group).",
  preview: !1
});
console.info(
  `%c DANIELS-ENERGY-CARDS %c v${qt} `,
  "background:#03a9f4;color:#fff;font-weight:700;border-radius:3px 0 0 3px;padding:2px 4px",
  "background:#555;color:#fff;border-radius:0 3px 3px 0;padding:2px 4px"
);
export {
  F as DesStorageCard
};

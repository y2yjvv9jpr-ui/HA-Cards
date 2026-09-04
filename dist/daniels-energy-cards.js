/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const U = globalThis, V = U.ShadowRoot && (U.ShadyCSS === void 0 || U.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, G = Symbol(), Z = /* @__PURE__ */ new WeakMap();
let fe = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== G) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (V && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = Z.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && Z.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const we = (i) => new fe(typeof i == "string" ? i : i + "", void 0, G), Ae = (i, ...e) => {
  const t = i.length === 1 ? i[0] : e.reduce((s, r, o) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + i[o + 1], i[0]);
  return new fe(t, i, G);
}, Ee = (i, e) => {
  if (V) i.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), r = U.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = t.cssText, i.appendChild(s);
  }
}, J = V ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return we(t);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Se, defineProperty: ke, getOwnPropertyDescriptor: Ce, getOwnPropertyNames: Me, getOwnPropertySymbols: Te, getPrototypeOf: Pe } = Object, D = globalThis, Q = D.trustedTypes, Ne = Q ? Q.emptyScript : "", He = D.reactiveElementPolyfillSupport, k = (i, e) => i, W = { toAttribute(i, e) {
  switch (e) {
    case Boolean:
      i = i ? Ne : null;
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
} }, me = (i, e) => !Se(i, e), ee = { attribute: !0, type: String, converter: W, reflect: !1, useDefault: !1, hasChanged: me };
Symbol.metadata ??= Symbol("metadata"), D.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let x = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = ee) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(e, s, t);
      r !== void 0 && ke(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: r, set: o } = Ce(this.prototype, e) ?? { get() {
      return this[t];
    }, set(n) {
      this[t] = n;
    } };
    return { get: r, set(n) {
      const l = r?.call(this);
      o?.call(this, n), this.requestUpdate(e, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ee;
  }
  static _$Ei() {
    if (this.hasOwnProperty(k("elementProperties"))) return;
    const e = Pe(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(k("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(k("properties"))) {
      const t = this.properties, s = [...Me(t), ...Te(t)];
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
      for (const r of s) t.unshift(J(r));
    } else e !== void 0 && t.push(J(e));
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
    return Ee(e, this.constructor.elementStyles), e;
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
      const o = (s.converter?.toAttribute !== void 0 ? s.converter : W).toAttribute(t, s.type);
      this._$Em = e, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const s = this.constructor, r = s._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const o = s.getPropertyOptions(r), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : W;
      this._$Em = r;
      const l = n.fromAttribute(t, o.type);
      this[r] = l ?? this._$Ej?.get(r) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, t, s, r = !1, o) {
    if (e !== void 0) {
      const n = this.constructor;
      if (r === !1 && (o = this[e]), s ??= n.getPropertyOptions(e), !((s.hasChanged ?? me)(o, t) || s.useDefault && s.reflect && o === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, s)))) return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: r, wrapped: o }, n) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, n ?? t ?? this[e]), o !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)), r === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, o] of s) {
        const { wrapped: n } = o, l = this[r];
        n !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, o, l);
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
x.elementStyles = [], x.shadowRootOptions = { mode: "open" }, x[k("elementProperties")] = /* @__PURE__ */ new Map(), x[k("finalized")] = /* @__PURE__ */ new Map(), He?.({ ReactiveElement: x }), (D.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const q = globalThis, te = (i) => i, z = q.trustedTypes, se = z ? z.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, _e = "$lit$", _ = `lit$${Math.random().toFixed(9).slice(2)}$`, $e = "?" + _, Oe = `<${$e}>`, y = document, M = () => y.createComment(""), T = (i) => i === null || typeof i != "object" && typeof i != "function", K = Array.isArray, Re = (i) => K(i) || typeof i?.[Symbol.iterator] == "function", j = `[ 	
\f\r]`, E = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, re = /-->/g, ie = />/g, $ = RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), oe = /'/g, ne = /"/g, ve = /^(?:script|style|textarea|title)$/i, Ue = (i) => (e, ...t) => ({ _$litType$: i, strings: e, values: t }), u = Ue(1), w = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), ae = /* @__PURE__ */ new WeakMap(), b = y.createTreeWalker(y, 129);
function be(i, e) {
  if (!K(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return se !== void 0 ? se.createHTML(e) : e;
}
const ze = (i, e) => {
  const t = i.length - 1, s = [];
  let r, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = E;
  for (let l = 0; l < t; l++) {
    const a = i[l];
    let d, p, h = -1, f = 0;
    for (; f < a.length && (n.lastIndex = f, p = n.exec(a), p !== null); ) f = n.lastIndex, n === E ? p[1] === "!--" ? n = re : p[1] !== void 0 ? n = ie : p[2] !== void 0 ? (ve.test(p[2]) && (r = RegExp("</" + p[2], "g")), n = $) : p[3] !== void 0 && (n = $) : n === $ ? p[0] === ">" ? (n = r ?? E, h = -1) : p[1] === void 0 ? h = -2 : (h = n.lastIndex - p[2].length, d = p[1], n = p[3] === void 0 ? $ : p[3] === '"' ? ne : oe) : n === ne || n === oe ? n = $ : n === re || n === ie ? n = E : (n = $, r = void 0);
    const m = n === $ && i[l + 1].startsWith("/>") ? " " : "";
    o += n === E ? a + Oe : h >= 0 ? (s.push(d), a.slice(0, h) + _e + a.slice(h) + _ + m) : a + _ + (h === -2 ? l : m);
  }
  return [be(i, o + (i[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class P {
  constructor({ strings: e, _$litType$: t }, s) {
    let r;
    this.parts = [];
    let o = 0, n = 0;
    const l = e.length - 1, a = this.parts, [d, p] = ze(e, t);
    if (this.el = P.createElement(d, s), b.currentNode = this.el.content, t === 2 || t === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = b.nextNode()) !== null && a.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(_e)) {
          const f = p[n++], m = r.getAttribute(h).split(_), H = /([.?@])?(.*)/.exec(f);
          a.push({ type: 1, index: o, name: H[2], strings: m, ctor: H[1] === "." ? Be : H[1] === "?" ? De : H[1] === "@" ? Le : L }), r.removeAttribute(h);
        } else h.startsWith(_) && (a.push({ type: 6, index: o }), r.removeAttribute(h));
        if (ve.test(r.tagName)) {
          const h = r.textContent.split(_), f = h.length - 1;
          if (f > 0) {
            r.textContent = z ? z.emptyScript : "";
            for (let m = 0; m < f; m++) r.append(h[m], M()), b.nextNode(), a.push({ type: 2, index: ++o });
            r.append(h[f], M());
          }
        }
      } else if (r.nodeType === 8) if (r.data === $e) a.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(_, h + 1)) !== -1; ) a.push({ type: 7, index: o }), h += _.length - 1;
      }
      o++;
    }
  }
  static createElement(e, t) {
    const s = y.createElement("template");
    return s.innerHTML = e, s;
  }
}
function A(i, e, t = i, s) {
  if (e === w) return e;
  let r = s !== void 0 ? t._$Co?.[s] : t._$Cl;
  const o = T(e) ? void 0 : e._$litDirective$;
  return r?.constructor !== o && (r?._$AO?.(!1), o === void 0 ? r = void 0 : (r = new o(i), r._$AT(i, t, s)), s !== void 0 ? (t._$Co ??= [])[s] = r : t._$Cl = r), r !== void 0 && (e = A(i, r._$AS(i, e.values), r, s)), e;
}
class Ie {
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
    const { el: { content: t }, parts: s } = this._$AD, r = (e?.creationScope ?? y).importNode(t, !0);
    b.currentNode = r;
    let o = b.nextNode(), n = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let d;
        a.type === 2 ? d = new N(o, o.nextSibling, this, e) : a.type === 1 ? d = new a.ctor(o, a.name, a.strings, this, e) : a.type === 6 && (d = new je(o, this, e)), this._$AV.push(d), a = s[++l];
      }
      n !== a?.index && (o = b.nextNode(), n++);
    }
    return b.currentNode = y, r;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class N {
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
    e = A(this, e, t), T(e) ? e === c || e == null || e === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : e !== this._$AH && e !== w && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Re(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== c && T(this._$AH) ? this._$AA.nextSibling.data = e : this.T(y.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: s } = e, r = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = P.createElement(be(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(t);
    else {
      const o = new Ie(r, this), n = o.u(this.options);
      o.p(t), this.T(n), this._$AH = o;
    }
  }
  _$AC(e) {
    let t = ae.get(e.strings);
    return t === void 0 && ae.set(e.strings, t = new P(e)), t;
  }
  k(e) {
    K(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, r = 0;
    for (const o of e) r === t.length ? t.push(s = new N(this.O(M()), this.O(M()), this, this.options)) : s = t[r], s._$AI(o), r++;
    r < t.length && (this._$AR(s && s._$AB.nextSibling, r), t.length = r);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const s = te(e).nextSibling;
      te(e).remove(), e = s;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class L {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, r, o) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = c;
  }
  _$AI(e, t = this, s, r) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) e = A(this, e, t, 0), n = !T(e) || e !== this._$AH && e !== w, n && (this._$AH = e);
    else {
      const l = e;
      let a, d;
      for (e = o[0], a = 0; a < o.length - 1; a++) d = A(this, l[s + a], t, a), d === w && (d = this._$AH[a]), n ||= !T(d) || d !== this._$AH[a], d === c ? e = c : e !== c && (e += (d ?? "") + o[a + 1]), this._$AH[a] = d;
    }
    n && !r && this.j(e);
  }
  j(e) {
    e === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Be extends L {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === c ? void 0 : e;
  }
}
class De extends L {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== c);
  }
}
class Le extends L {
  constructor(e, t, s, r, o) {
    super(e, t, s, r, o), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = A(this, e, t, 0) ?? c) === w) return;
    const s = this._$AH, r = e === c && s !== c || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, o = e !== c && (s === c || r);
    r && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class je {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    A(this, e);
  }
}
const We = q.litHtmlPolyfillSupport;
We?.(P, N), (q.litHtmlVersions ??= []).push("3.3.3");
const Fe = (i, e, t) => {
  const s = t?.renderBefore ?? e;
  let r = s._$litPart$;
  if (r === void 0) {
    const o = t?.renderBefore ?? null;
    s._$litPart$ = r = new N(e.insertBefore(M(), o), o, void 0, t ?? {});
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
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Fe(t, this.renderRoot, this.renderOptions);
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
const Ve = Y.litElementPolyfillSupport;
Ve?.({ LitElement: C });
(Y.litElementVersions ??= []).push("4.2.2");
const X = "de-DE";
function v(i) {
  return new Intl.NumberFormat(X, { maximumFractionDigits: 0 }).format(i);
}
function Ge(i) {
  return new Intl.NumberFormat(X, {
    maximumFractionDigits: 0,
    signDisplay: "always"
  }).format(i);
}
function S(i, e = 1) {
  return new Intl.NumberFormat(X, {
    minimumFractionDigits: 0,
    maximumFractionDigits: e
  }).format(i);
}
function ye(i, e, t) {
  return Math.min(t, Math.max(e, i));
}
function g(i, e) {
  if (i == null) return null;
  if (typeof i == "number") return Number.isFinite(i) ? i : null;
  const t = Number(i);
  return Number.isFinite(t) ? t : null;
}
function le(i, e) {
  if (i == null) return null;
  const t = String(i).trim();
  return t.length > 0 ? t : null;
}
const xe = {
  charging: "Lädt",
  discharging: "Entlädt",
  idle: "Bereit",
  heating: "Heizt",
  off: "Aus"
}, O = 10, he = 80, ce = 5, de = 50, R = 100, pe = 5, ue = 5, qe = [
  { value: "charge", label: "Laden" },
  { value: "auto", label: "Auto" }
], Ke = [
  { value: "on", label: "An" },
  { value: "auto", label: "Auto" },
  { value: "off", label: "Aus" }
];
function Ye(i) {
  return i === !1 ? "off" : i === "standby" ? "idle" : typeof i == "string" && i in xe ? i : null;
}
function Xe(i) {
  return i === !0 ? "on" : i === !1 ? "off" : i === "on" || i === "auto" || i === "off" ? i : "auto";
}
function ge(i, e, t, s) {
  return ye(Math.round(i / s) * s, e, t);
}
function Ze(i) {
  return i < 4 || i > 50 ? "temp-alert" : i < 8 || i > 40 ? "temp-warn" : "";
}
const B = class B extends C {
  constructor() {
    super(), this._status = "idle", this._threshold = O, this._chargeTarget = R, this._chargeMode = "auto", this._expanded = !1, this._itemModes = [];
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
    if (e.variant === "battery") {
      const t = Ye(e.status);
      if (t === null)
        throw new Error(
          'des-storage-card: "status" muss charging | discharging | idle | standby | heating | off sein'
        );
      this._status = t;
      const s = g(e.threshold_pct, this.hass);
      this._threshold = s === null ? O : ge(s, O, he, ce);
      const r = g(e.charge_target_pct, this.hass);
      this._chargeTarget = r === null ? R : ge(r, de, R, pe), this._chargeMode = e.charge_mode === "charge" ? "charge" : "auto";
    } else {
      const t = e.items;
      if (!Array.isArray(t) || t.length === 0)
        throw new Error(
          'des-storage-card: "items" braucht mindestens einen Eintrag'
        );
      if (t.length > ue)
        throw new Error(
          `des-storage-card: "items" erlaubt höchstens ${ue} Einträge`
        );
      if (t.some((s) => !s || !s.name))
        throw new Error('des-storage-card: jeder Eintrag in "items" braucht "name"');
      this._itemModes = t.map((s) => Xe(s.mode));
    }
    this._config = e, this._expanded = !1;
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
      charge_target_pct: 90,
      charge_mode: "auto",
      time_remaining: "4:36 h bis 20 %",
      time_at: "um 00:12",
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
  // variant: battery
  // =========================================================================
  _renderBattery(e) {
    const t = ye(g(e.soc, this.hass) ?? 0, 0, 100), s = g(e.energy_kwh, this.hass), r = g(e.power_w, this.hass), o = e.backup ?? "none", n = this._batteryTimes(e);
    return u`
      <div class="header">
        <div class="head-left">
          <span class="name">${e.name}</span>
          <span class="meta">${this._renderBatteryMeta(e)}</span>
        </div>
        <div class="badges">
          ${o === "none" ? c : this._renderBackupBadge(o)}
          ${this._renderBadge(
      xe[this._status],
      `status-${this._status}`
    )}
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
        ${this._renderBatteryIcon(t)}
        <div class="readout">
          <span class="soc">${v(t)} %</span>
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

      ${this._expanded ? u`<div class="grow"></div>
            ${this._renderBatteryControls()}` : c}
    `;
  }
  /**
   * Two labelled slider rows on one grid, so labels, tracks and values line
   * up. The charge-mode control sits to their right, centred over both rows.
   */
  _renderBatteryControls() {
    const e = this._chargeMode === "charge";
    return u`
      <div class="controls">
        <div class="ctl-rows">
          <span class="ctl-label ${e ? "" : "disabled"}">Ladeziel</span>
          <input
            class="slider"
            type="range"
            min=${de}
            max=${R}
            step=${pe}
            .value=${String(this._chargeTarget)}
            ?disabled=${!e}
            aria-label="Ladeziel"
            @input=${this._onTargetInput}
          />
          <span class="ctl-value ${e ? "" : "disabled"}">
            ${v(this._chargeTarget)} %
          </span>

          <span class="ctl-label">min. SoC</span>
          <input
            class="slider"
            type="range"
            min=${O}
            max=${he}
            step=${ce}
            .value=${String(this._threshold)}
            aria-label="Minimaler Ladestand"
            @input=${this._onThresholdInput}
          />
          <span class="ctl-value">${v(this._threshold)} %</span>
        </div>
        ${this._renderSegmented(
      qe,
      this._chargeMode,
      (t) => this._setChargeMode(t),
      "Lademodus"
    )}
      </div>
    `;
  }
  /** "10,2 kWh · 23,5 °C · min. 20 % SoC" - temp segment dropped when null. */
  _renderBatteryMeta(e) {
    const t = g(e.capacity_kwh, this.hass), s = g(e.temp_c, this.hass), r = [];
    return t !== null && r.push(`${S(t)} kWh`), s !== null && r.push(
      u`<span class=${Ze(s)}>
          ${S(s)} °C
        </span>`
    ), r.push(`min. ${v(this._threshold)} % SoC`), u`${r.map(
      (o, n) => n === 0 ? o : u` · ${o}`
    )}`;
  }
  /** "4:36 h bis 20 % · um 00:12" - null when neither is set. */
  _batteryTimes(e) {
    const t = [
      le(e.time_remaining, this.hass),
      le(e.time_at, this.hass)
    ].filter((s) => s !== null);
    return t.length > 0 ? t.join(" · ") : null;
  }
  /** Upright battery; the fill grows from the bottom. */
  _renderBatteryIcon(e) {
    const t = e > 50 ? "var(--success-color, #2e7d32)" : e >= 20 ? "var(--warning-color, #ff9800)" : "var(--error-color, #d32f2f)", s = 6, r = 26, o = r * e / 100, n = s + (r - o);
    return u`
      <svg
        class="battery"
        viewBox="0 0 22 36"
        width="22"
        height="36"
        role="img"
        aria-label="Ladestand ${v(e)} Prozent"
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
          fill=${t}
        />
      </svg>
    `;
  }
  // =========================================================================
  // variant: thermal_group
  // =========================================================================
  _renderThermalGroup(e) {
    const t = e.items ?? [], s = t.map((l) => g(l.power_w, this.hass) ?? 0), r = t.reduce(
      (l, a) => l + (g(a.energy_kwh, this.hass) ?? 0),
      0
    ), o = s.reduce((l, a) => l + a, 0), n = s.filter((l) => l > 0).length;
    return u`
      <div class="header">
        <div class="head-left">
          <span class="name">${e.name}</span>
        </div>
        <div class="badges">
          <!-- Heating charges the heat store, so it reads as "charging". -->
          ${this._renderBadge(
      n > 0 ? `${v(n)} heizen` : "Aus",
      n > 0 ? "status-charging" : "status-off"
    )}
        </div>
      </div>

      <div class="main">
        <ha-icon class="fish" icon="mdi:fish"></ha-icon>
        <div class="readout stacked">
          <span class="soc">${S(r)} kWh</span>
          <span class="energy">heute eingespeichert</span>
        </div>
        <div class="timing">
          <div class=${this._powerClass(o)}>
            ${this._formatPower(o)}
          </div>
        </div>
      </div>

      <div class="items">
        ${t.map((l, a) => this._renderItem(l, a, s[a]))}
      </div>
    `;
  }
  _renderItem(e, t, s) {
    const r = g(e.energy_kwh, this.hass);
    return u`
      <div class="item">
        <span class="item-name">${e.name}</span>
        <span class="item-energy">
          ${r === null ? "" : `${S(r)} kWh`}
        </span>
        <span class=${s > 0 ? "item-power positive" : "item-power"}>
          ${this._formatPower(s)}
        </span>
        ${this._renderSegmented(
      Ke,
      this._itemModes[t] ?? "auto",
      (o) => this._setItemMode(t, o),
      `Modus ${e.name}`
    )}
      </div>
    `;
  }
  // =========================================================================
  // shared
  // =========================================================================
  /** One segmented control, used for both charge mode and item modes. */
  _renderSegmented(e, t, s, r) {
    return u`
      <div class="seg" role="group" aria-label=${r}>
        ${e.map(
      ({ value: o, label: n }) => u`
            <button
              type="button"
              class=${t === o ? "active" : ""}
              aria-pressed=${t === o ? "true" : "false"}
              @click=${(l) => {
        l.stopPropagation(), s(o);
      }}
            >
              ${n}
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
    return e === 0 ? "power neutral" : e < 0 ? "power negative" : "power positive";
  }
  _formatPower(e) {
    return `${e === 0 ? v(0) : Ge(e)} W`;
  }
  // --- local-only interaction (phase 1 persists nothing) -------------------
  _toggleExpanded() {
    this._expanded = !this._expanded;
  }
  _onMainKeydown(e) {
    (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this._toggleExpanded());
  }
  _setChargeMode(e) {
    this._chargeMode = e;
  }
  _onTargetInput(e) {
    const t = e.target;
    this._chargeTarget = Number(t.value);
  }
  _onThresholdInput(e) {
    const t = e.target;
    this._threshold = Number(t.value);
  }
  _setItemMode(e, t) {
    const s = [...this._itemModes];
    s[e] = t, this._itemModes = s;
  }
};
B.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 },
  _threshold: { state: !0 },
  _chargeTarget: { state: !0 },
  _chargeMode: { state: !0 },
  _expanded: { state: !0 },
  _itemModes: { state: !0 }
}, B.styles = Ae`
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
let F = B;
const I = "des-storage-card", Je = "0.1.0";
customElements.get(I) || customElements.define(I, F);
window.customCards = window.customCards ?? [];
window.customCards.some((i) => i.type === I) || window.customCards.push({
  type: I,
  name: "Daniels Speicherkarte",
  description: "Speicherkarte für Hausakkus (battery) und Wärmespeicher-Gruppen (thermal_group).",
  preview: !1
});
console.info(
  `%c DANIELS-ENERGY-CARDS %c v${Je} `,
  "background:#03a9f4;color:#fff;font-weight:700;border-radius:3px 0 0 3px;padding:2px 4px",
  "background:#555;color:#fff;border-radius:0 3px 3px 0;padding:2px 4px"
);
export {
  F as DesStorageCard
};

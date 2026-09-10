/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ye = globalThis, at = ye.ShadowRoot && (ye.ShadyCSS === void 0 || ye.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, lt = Symbol(), vt = /* @__PURE__ */ new WeakMap();
let ar = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== lt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (at && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = vt.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && vt.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Sr = (s) => new ar(typeof s == "string" ? s : s + "", void 0, lt), L = (s, ...e) => {
  const t = s.length === 1 ? s[0] : e.reduce((r, i, o) => r + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + s[o + 1], s[0]);
  return new ar(t, s, lt);
}, Er = (s, e) => {
  if (at) s.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const r = document.createElement("style"), i = ye.litNonce;
    i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, s.appendChild(r);
  }
}, bt = at ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const r of e.cssRules) t += r.cssText;
  return Sr(t);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ar, defineProperty: Tr, getOwnPropertyDescriptor: Lr, getOwnPropertyNames: Cr, getOwnPropertySymbols: Mr, getPrototypeOf: Or } = Object, Pe = globalThis, wt = Pe.trustedTypes, Pr = wt ? wt.emptyScript : "", Rr = Pe.reactiveElementPolyfillSupport, se = (s, e) => s, Ye = { toAttribute(s, e) {
  switch (e) {
    case Boolean:
      s = s ? Pr : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, e) {
  let t = s;
  switch (e) {
    case Boolean:
      t = s !== null;
      break;
    case Number:
      t = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(s);
      } catch {
        t = null;
      }
  }
  return t;
} }, lr = (s, e) => !Ar(s, e), yt = { attribute: !0, type: String, converter: Ye, reflect: !1, useDefault: !1, hasChanged: lr };
Symbol.metadata ??= Symbol("metadata"), Pe.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let V = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = yt) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = Symbol(), i = this.getPropertyDescriptor(e, r, t);
      i !== void 0 && Tr(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: i, set: o } = Lr(this.prototype, e) ?? { get() {
      return this[t];
    }, set(n) {
      this[t] = n;
    } };
    return { get: i, set(n) {
      const c = i?.call(this);
      o?.call(this, n), this.requestUpdate(e, c, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? yt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(se("elementProperties"))) return;
    const e = Or(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(se("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(se("properties"))) {
      const t = this.properties, r = [...Cr(t), ...Mr(t)];
      for (const i of r) this.createProperty(i, t[i]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [r, i] of t) this.elementProperties.set(r, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, r] of this.elementProperties) {
      const i = this._$Eu(t, r);
      i !== void 0 && this._$Eh.set(i, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const i of r) t.unshift(bt(i));
    } else e !== void 0 && t.push(bt(e));
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
    return Er(e, this.constructor.elementStyles), e;
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
    const r = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, r);
    if (i !== void 0 && r.reflect === !0) {
      const o = (r.converter?.toAttribute !== void 0 ? r.converter : Ye).toAttribute(t, r.type);
      this._$Em = e, o == null ? this.removeAttribute(i) : this.setAttribute(i, o), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const r = this.constructor, i = r._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const o = r.getPropertyOptions(i), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : Ye;
      this._$Em = i;
      const c = n.fromAttribute(t, o.type);
      this[i] = c ?? this._$Ej?.get(i) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, t, r, i = !1, o) {
    if (e !== void 0) {
      const n = this.constructor;
      if (i === !1 && (o = this[e]), r ??= n.getPropertyOptions(e), !((r.hasChanged ?? lr)(o, t) || r.useDefault && r.reflect && o === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, r)))) return;
      this.C(e, t, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: r, reflect: i, wrapped: o }, n) {
    r && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, n ?? t ?? this[e]), o !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [i, o] of this._$Ep) this[i] = o;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [i, o] of r) {
        const { wrapped: n } = o, c = this[i];
        n !== !0 || this._$AL.has(i) || c === void 0 || this.C(i, void 0, o, c);
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
V.elementStyles = [], V.shadowRootOptions = { mode: "open" }, V[se("elementProperties")] = /* @__PURE__ */ new Map(), V[se("finalized")] = /* @__PURE__ */ new Map(), Rr?.({ ReactiveElement: V }), (Pe.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ct = globalThis, xt = (s) => s, ke = ct.trustedTypes, kt = ke ? ke.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, cr = "$lit$", D = `lit$${Math.random().toFixed(9).slice(2)}$`, dr = "?" + D, Dr = `<${dr}>`, j = document, oe = () => j.createComment(""), ne = (s) => s === null || typeof s != "object" && typeof s != "function", dt = Array.isArray, zr = (s) => dt(s) || typeof s?.[Symbol.iterator] == "function", We = `[ 	
\f\r]`, te = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, $t = /-->/g, St = />/g, H = RegExp(`>|${We}(?:([^\\s"'>=/]+)(${We}*=${We}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Et = /'/g, At = /"/g, hr = /^(?:script|style|textarea|title)$/i, ur = (s) => (e, ...t) => ({ _$litType$: s, strings: e, values: t }), a = ur(1), F = ur(2), q = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), Tt = /* @__PURE__ */ new WeakMap(), U = j.createTreeWalker(j, 129);
function pr(s, e) {
  if (!dt(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return kt !== void 0 ? kt.createHTML(e) : e;
}
const Nr = (s, e) => {
  const t = s.length - 1, r = [];
  let i, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = te;
  for (let c = 0; c < t; c++) {
    const l = s[c];
    let h, u, p = -1, f = 0;
    for (; f < l.length && (n.lastIndex = f, u = n.exec(l), u !== null); ) f = n.lastIndex, n === te ? u[1] === "!--" ? n = $t : u[1] !== void 0 ? n = St : u[2] !== void 0 ? (hr.test(u[2]) && (i = RegExp("</" + u[2], "g")), n = H) : u[3] !== void 0 && (n = H) : n === H ? u[0] === ">" ? (n = i ?? te, p = -1) : u[1] === void 0 ? p = -2 : (p = n.lastIndex - u[2].length, h = u[1], n = u[3] === void 0 ? H : u[3] === '"' ? At : Et) : n === At || n === Et ? n = H : n === $t || n === St ? n = te : (n = H, i = void 0);
    const _ = n === H && s[c + 1].startsWith("/>") ? " " : "";
    o += n === te ? l + Dr : p >= 0 ? (r.push(h), l.slice(0, p) + cr + l.slice(p) + D + _) : l + D + (p === -2 ? c : _);
  }
  return [pr(s, o + (s[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class ae {
  constructor({ strings: e, _$litType$: t }, r) {
    let i;
    this.parts = [];
    let o = 0, n = 0;
    const c = e.length - 1, l = this.parts, [h, u] = Nr(e, t);
    if (this.el = ae.createElement(h, r), U.currentNode = this.el.content, t === 2 || t === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (i = U.nextNode()) !== null && l.length < c; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const p of i.getAttributeNames()) if (p.endsWith(cr)) {
          const f = u[n++], _ = i.getAttribute(p).split(D), b = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: o, name: b[2], strings: _, ctor: b[1] === "." ? Hr : b[1] === "?" ? Fr : b[1] === "@" ? Wr : Re }), i.removeAttribute(p);
        } else p.startsWith(D) && (l.push({ type: 6, index: o }), i.removeAttribute(p));
        if (hr.test(i.tagName)) {
          const p = i.textContent.split(D), f = p.length - 1;
          if (f > 0) {
            i.textContent = ke ? ke.emptyScript : "";
            for (let _ = 0; _ < f; _++) i.append(p[_], oe()), U.nextNode(), l.push({ type: 2, index: ++o });
            i.append(p[f], oe());
          }
        }
      } else if (i.nodeType === 8) if (i.data === dr) l.push({ type: 2, index: o });
      else {
        let p = -1;
        for (; (p = i.data.indexOf(D, p + 1)) !== -1; ) l.push({ type: 7, index: o }), p += D.length - 1;
      }
      o++;
    }
  }
  static createElement(e, t) {
    const r = j.createElement("template");
    return r.innerHTML = e, r;
  }
}
function Y(s, e, t = s, r) {
  if (e === q) return e;
  let i = r !== void 0 ? t._$Co?.[r] : t._$Cl;
  const o = ne(e) ? void 0 : e._$litDirective$;
  return i?.constructor !== o && (i?._$AO?.(!1), o === void 0 ? i = void 0 : (i = new o(s), i._$AT(s, t, r)), r !== void 0 ? (t._$Co ??= [])[r] = i : t._$Cl = i), i !== void 0 && (e = Y(s, i._$AS(s, e.values), i, r)), e;
}
class Ir {
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
    const { el: { content: t }, parts: r } = this._$AD, i = (e?.creationScope ?? j).importNode(t, !0);
    U.currentNode = i;
    let o = U.nextNode(), n = 0, c = 0, l = r[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let h;
        l.type === 2 ? h = new de(o, o.nextSibling, this, e) : l.type === 1 ? h = new l.ctor(o, l.name, l.strings, this, e) : l.type === 6 && (h = new Br(o, this, e)), this._$AV.push(h), l = r[++c];
      }
      n !== l?.index && (o = U.nextNode(), n++);
    }
    return U.currentNode = j, i;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}
class de {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, r, i) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = r, this.options = i, this._$Cv = i?.isConnected ?? !0;
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
    e = Y(this, e, t), ne(e) ? e === d || e == null || e === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : e !== this._$AH && e !== q && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : zr(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== d && ne(this._$AH) ? this._$AA.nextSibling.data = e : this.T(j.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: r } = e, i = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = ae.createElement(pr(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === i) this._$AH.p(t);
    else {
      const o = new Ir(i, this), n = o.u(this.options);
      o.p(t), this.T(n), this._$AH = o;
    }
  }
  _$AC(e) {
    let t = Tt.get(e.strings);
    return t === void 0 && Tt.set(e.strings, t = new ae(e)), t;
  }
  k(e) {
    dt(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let r, i = 0;
    for (const o of e) i === t.length ? t.push(r = new de(this.O(oe()), this.O(oe()), this, this.options)) : r = t[i], r._$AI(o), i++;
    i < t.length && (this._$AR(r && r._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const r = xt(e).nextSibling;
      xt(e).remove(), e = r;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class Re {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, r, i, o) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = o, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = d;
  }
  _$AI(e, t = this, r, i) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) e = Y(this, e, t, 0), n = !ne(e) || e !== this._$AH && e !== q, n && (this._$AH = e);
    else {
      const c = e;
      let l, h;
      for (e = o[0], l = 0; l < o.length - 1; l++) h = Y(this, c[r + l], t, l), h === q && (h = this._$AH[l]), n ||= !ne(h) || h !== this._$AH[l], h === d ? e = d : e !== d && (e += (h ?? "") + o[l + 1]), this._$AH[l] = h;
    }
    n && !i && this.j(e);
  }
  j(e) {
    e === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Hr extends Re {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === d ? void 0 : e;
  }
}
class Fr extends Re {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== d);
  }
}
class Wr extends Re {
  constructor(e, t, r, i, o) {
    super(e, t, r, i, o), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = Y(this, e, t, 0) ?? d) === q) return;
    const r = this._$AH, i = e === d && r !== d || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, o = e !== d && (r === d || i);
    i && this.element.removeEventListener(this.name, this, r), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Br {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Y(this, e);
  }
}
const Ur = ct.litHtmlPolyfillSupport;
Ur?.(ae, de), (ct.litHtmlVersions ??= []).push("3.3.3");
const jr = (s, e, t) => {
  const r = t?.renderBefore ?? e;
  let i = r._$litPart$;
  if (i === void 0) {
    const o = t?.renderBefore ?? null;
    r._$litPart$ = i = new de(e.insertBefore(oe(), o), o, void 0, t ?? {});
  }
  return i._$AI(s), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ht = globalThis;
class M extends V {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = jr(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return q;
  }
}
M._$litElement$ = !0, M.finalized = !0, ht.litElementHydrateSupport?.({ LitElement: M });
const Gr = ht.litElementPolyfillSupport;
Gr?.({ LitElement: M });
(ht.litElementVersions ??= []).push("4.2.2");
const De = "de-DE";
function m(s) {
  return new Intl.NumberFormat(De, { maximumFractionDigits: 0 }).format(s);
}
function Kr(s) {
  return new Intl.NumberFormat(De, {
    maximumFractionDigits: 0,
    signDisplay: "always"
  }).format(s);
}
function ge(s) {
  const e = Math.round(s), t = m(Math.abs(e));
  return e > 0 ? `+${t}` : e < 0 ? `−${t}` : t;
}
function Vr(s, e = 1) {
  return new Intl.NumberFormat(De, {
    minimumFractionDigits: 0,
    maximumFractionDigits: e
  }).format(s);
}
function $(s, e = 1) {
  return new Intl.NumberFormat(De, {
    minimumFractionDigits: e,
    maximumFractionDigits: e
  }).format(s);
}
function w(s, e, t) {
  return Math.min(t, Math.max(e, s));
}
const qr = /* @__PURE__ */ new Set(["unavailable", "unknown", "none", "null", ""]), Yr = /^[a-z][a-z0-9_]*\.[a-z0-9_]+$/;
function v(s) {
  return typeof s == "string" && Yr.test(s);
}
const Ze = { kind: "unset" }, ie = { kind: "unavailable" };
function C(s, e) {
  const t = e?.states?.[s];
  if (!t || typeof t.state != "string") return null;
  const r = t.state.trim();
  return qr.has(r.toLowerCase()) ? null : r;
}
function N(s, e, t) {
  const r = e?.states?.[s]?.attributes?.[t];
  if (typeof r == "number") return Number.isFinite(r) ? r : null;
  if (typeof r == "string") {
    const i = Number.parseFloat(r);
    return Number.isFinite(i) ? i : null;
  }
  return null;
}
function ut(s, e) {
  const t = e?.states?.[s]?.attributes?.unit_of_measurement;
  if (typeof t != "string") return null;
  const r = t.trim().toLowerCase();
  return r.length > 0 ? r : null;
}
function y(s, e) {
  if (s == null || typeof s == "boolean") return Ze;
  if (typeof s == "number")
    return Number.isFinite(s) ? { kind: "value", value: s } : ie;
  if (v(s)) {
    const r = C(s, e);
    if (r === null) return ie;
    const i = Number.parseFloat(r);
    return Number.isFinite(i) ? { kind: "value", value: i } : ie;
  }
  const t = Number.parseFloat(s);
  return Number.isFinite(t) ? { kind: "value", value: t } : ie;
}
function T(s, e) {
  if (s == null) return Ze;
  if (typeof s == "boolean") return { kind: "value", value: s ? "on" : "off" };
  if (typeof s == "number") return { kind: "value", value: String(s) };
  if (v(s)) {
    const r = C(s, e);
    return r === null ? ie : { kind: "value", value: r };
  }
  const t = s.trim();
  return t.length > 0 ? { kind: "value", value: t } : Ze;
}
const _r = /* @__PURE__ */ new Set(["number", "input_number"]), he = /* @__PURE__ */ new Set(["switch", "input_boolean"]), le = /* @__PURE__ */ new Set(["select", "input_select"]), gr = /* @__PURE__ */ new Set(["fan", "switch", "input_boolean"]), Zr = /* @__PURE__ */ new Set(["on", "true", "1", "yes", "an", "ein"]);
function A(s) {
  const e = s.indexOf(".");
  return e === -1 ? "" : s.slice(0, e);
}
function Z(s, e) {
  return typeof s == "string" && v(s) && e.has(A(s));
}
function fe(s) {
  return Z(s, _r);
}
function X(s) {
  return Z(s, he);
}
function Lt(s) {
  return Z(s, gr);
}
function Ct(s) {
  return typeof s == "string" && v(s) && A(s) === "humidifier";
}
function fr(s) {
  if (!s || typeof s != "object") return !1;
  const e = s.entity;
  return Z(e, le) || Z(e, he);
}
function O(s, e, t, r) {
  if (typeof s?.callService != "function")
    return Promise.reject(new Error("des-storage-card: hass.callService fehlt"));
  try {
    return Promise.resolve(s.callService(e, t, r));
  } catch (i) {
    return Promise.reject(i);
  }
}
function Mt(s, e, t) {
  const r = A(e);
  return _r.has(r) ? O(s, r, "set_value", { entity_id: e, value: t }) : Promise.reject(
    new Error(`des-storage-card: ${e} ist keine number-Entität`)
  );
}
function ce(s, e, t) {
  const r = A(e);
  return he.has(r) ? O(s, r, t ? "turn_on" : "turn_off", { entity_id: e }) : Promise.reject(
    new Error(`des-storage-card: ${e} ist kein Schalter`)
  );
}
function Xr(s, e, t) {
  const r = A(e);
  return gr.has(r) ? O(s, r, t ? "turn_on" : "turn_off", { entity_id: e }) : Promise.reject(
    new Error(`des-cards: ${e} kann nicht als Ein/Aus geschaltet werden`)
  );
}
function Jr(s, e, t) {
  return A(e) !== "humidifier" ? Promise.reject(
    new Error(`des-cards: ${e} ist keine humidifier-Entität`)
  ) : O(s, "humidifier", "set_humidity", {
    entity_id: e,
    humidity: t
  });
}
function mr(s, e, t) {
  const r = A(e);
  return le.has(r) ? O(s, r, "select_option", { entity_id: e, option: t }) : Promise.reject(
    new Error(`des-storage-card: ${e} ist keine select-Entität`)
  );
}
function Ot(s) {
  return typeof s == "string" && v(s) && A(s) === "cover";
}
function Qr(s, e, t) {
  return A(e) !== "cover" ? Promise.reject(new Error(`des-cards: ${e} ist keine cover-Entität`)) : O(s, "cover", t === "open" ? "open_cover" : t === "close" ? "close_cover" : "stop_cover", { entity_id: e });
}
function ei(s, e, t) {
  return A(e) !== "cover" ? Promise.reject(new Error(`des-cards: ${e} ist keine cover-Entität`)) : O(s, "cover", "set_cover_position", {
    entity_id: e,
    position: t
  });
}
function me(s) {
  return typeof s == "string" && v(s) && A(s) === "light";
}
function Pt(s, e, t, r) {
  if (A(e) !== "light")
    return Promise.reject(new Error(`des-cards: ${e} ist keine light-Entität`));
  if (!t) return O(s, "light", "turn_off", { entity_id: e });
  const i = { entity_id: e };
  if (r)
    for (const [o, n] of Object.entries(r))
      n !== void 0 && (i[o] = n);
  return O(s, "light", "turn_on", i);
}
function vr(s, e) {
  const t = e?.service;
  if (typeof t != "string")
    return Promise.reject(new Error('des-cards: Aktion ohne "service"'));
  const r = t.indexOf(".");
  if (r <= 0 || r === t.length - 1)
    return Promise.reject(
      new Error(`des-cards: "service" muss "domain.service" sein (ist: ${t})`)
    );
  const i = { ...e?.data ?? {}, ...e?.target ?? {} };
  return O(s, t.slice(0, r), t.slice(r + 1), i);
}
function br(s, e) {
  if (e === "off") return s.off_state;
  const t = e === "charge" ? s.charge_state : s.auto_state;
  return t !== void 0 ? t : Z(s.entity, he) ? e === "charge" ? "on" : "off" : void 0;
}
function ti(s, e) {
  const t = br(s, "charge");
  return t === void 0 ? !1 : t.trim().toLowerCase() === e.trim().toLowerCase();
}
function ri(s, e) {
  const t = s.off_state;
  return t === void 0 ? !1 : t.trim().toLowerCase() === e.trim().toLowerCase();
}
function ii(s) {
  if (s === null || typeof s != "object")
    return '"charge_mode_control" muss ein Objekt mit "entity" sein';
  const { entity: e, charge_state: t, auto_state: r, off_state: i } = s;
  if (typeof e != "string" || e.length === 0)
    return '"charge_mode_control" braucht "entity"';
  if (!fr(s))
    return `"charge_mode_control.entity" muss select, input_select, switch oder input_boolean sein (ist: ${e})`;
  if (i !== void 0 && !le.has(A(e)))
    return `"charge_mode_control.off_state" gibt es nur für select/input_select (ist: ${e})`;
  if (le.has(A(e))) {
    const o = [
      t === void 0 ? "charge_state" : null,
      r === void 0 ? "auto_state" : null
    ].filter((n) => n !== null);
    if (o.length > 0)
      return `"charge_mode_control" braucht ${o.join(" und ")} für ${e}`;
  }
  return null;
}
function si(s, e, t) {
  const r = e.entity, i = A(r), o = br(e, t);
  if (le.has(i)) {
    if (o === void 0) {
      const n = t === "charge" ? "charge_state" : t === "auto" ? "auto_state" : "off_state";
      return Promise.reject(
        new Error(
          `des-storage-card: charge_mode_control braucht ${n} für ${r}`
        )
      );
    }
    return mr(s, r, o);
  }
  return he.has(i) ? ce(s, r, Zr.has((o ?? "").toLowerCase())) : Promise.reject(
    new Error(`des-storage-card: ${r} wird als Lademodus nicht unterstützt`)
  );
}
const J = L`
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
function P(s, e, t, r, i = !1) {
  return a`
    <div
      class="seg ${i || e === null ? "unknown" : ""}"
      role="group"
      aria-label=${r}
      title=${i ? "Nicht verfügbar" : e === null ? "Zustand nicht lesbar" : d}
    >
      ${s.map(
    ({ value: n, label: c }) => a`
          <button
            type="button"
            class=${e === n ? "active" : ""}
            aria-pressed=${e === n ? "true" : "false"}
            ?disabled=${i}
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
const ue = L`
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
`, pe = L`
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
class _e {
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
const oi = {
  battery: { coldAlert: 4, coldWarn: 8, hotWarn: 40, hotAlert: 50 },
  inverter: { coldAlert: null, coldWarn: null, hotWarn: 60, hotAlert: 75 }
};
function Rt(s, e) {
  return typeof s == "number" && Number.isFinite(s) ? s : e;
}
function $e(s, e, t) {
  const r = oi[e], i = Rt(t?.warn, r.hotWarn), o = Rt(t?.alert, r.hotAlert);
  return r.coldAlert !== null && s < r.coldAlert || s > o ? "alert" : r.coldWarn !== null && s < r.coldWarn || s > i ? "warn" : "neutral";
}
const wr = L`
  .temp-pill {
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
    /* Fallback for browsers without color-mix(); overridden per level below. */
    background: rgba(127, 127, 127, 0.16);
    background: color-mix(
      in srgb,
      var(--secondary-text-color, #727272) 16%,
      transparent
    );
    color: var(--secondary-text-color);
  }

  .temp-pill.warn {
    background: rgba(255, 152, 0, 0.16);
    background: color-mix(in srgb, var(--warning-color, #ff9800) 16%, transparent);
    color: var(--warning-color, #ff9800);
  }

  .temp-pill.alert {
    background: rgba(211, 47, 47, 0.16);
    background: color-mix(in srgb, var(--error-color, #d32f2f) 16%, transparent);
    color: var(--error-color, #d32f2f);
  }

  /* Metric centring puts the glyphs visually too high with line-height:1; nudge
     the text down, exactly as the storage card's other badges do. */
  .temp-pill-label {
    display: block;
    transform: translateY(1px);
  }
`;
function Xe(s, e) {
  return a`<span class="temp-pill ${e}">
    <span class="temp-pill-label">${s}</span>
  </span>`;
}
const yr = {
  charging: "Lädt",
  discharging: "Entlädt",
  idle: "Bereit",
  heating: "Heizt",
  off: "Aus"
}, Be = { min: 10, max: 80, step: 5 }, Ue = { min: 50, max: 100, step: 5 }, je = { min: 100, max: 2400, step: 50 }, Dt = 5, ni = 12, ai = 2, li = 1, ci = 20, di = 1, hi = 300, ui = 6e4, pi = 3e4, zt = 5, Nt = 10, It = 48, _i = 500, gi = 8e3, fi = /* @__PURE__ */ new Set([
  "not charging",
  "not discharging",
  "unknown",
  "unavailable",
  "none",
  "-",
  "--"
]), mi = [
  { value: "charge", label: "Laden" },
  { value: "auto", label: "Auto" }
], vi = [
  { value: "charge", label: "Laden" },
  { value: "auto", label: "Auto" },
  { value: "off", label: "Aus" }
], bi = [
  { value: "on", label: "An" },
  { value: "auto", label: "Auto" },
  { value: "off", label: "Aus" }
], wi = {
  1: "on",
  2: "auto",
  3: "off"
}, yi = {
  on: 1,
  auto: 2,
  off: 3
};
function xi(s) {
  const e = s.trim().toLowerCase();
  return e === "standby" ? "idle" : e in yr ? e : null;
}
function ki(s) {
  const e = s.trim().toLowerCase();
  return e === "on" || e === "auto" || e === "off" ? e : "auto";
}
function ve(s, e) {
  const { min: t, max: r, step: i } = e;
  if (!(i > 0)) return w(s, t, r);
  const o = Math.round((s - t) / i), n = Number((t + o * i).toFixed(6));
  return w(n, t, r);
}
function $i(s) {
  if (!Number.isFinite(s) || Number.isInteger(s)) return 0;
  const e = String(s), t = e.indexOf(".");
  return t === -1 ? 0 : Math.min(3, e.length - t - 1);
}
function Ge(s, e) {
  const t = $i(e);
  return t === 0 ? m(s) : $(s, t);
}
function Si(s) {
  if (!Number.isFinite(s) || s <= 0) return null;
  if (s > It) return `> ${It} h`;
  const e = Math.round(s * 60 / zt) * zt;
  return e < Nt ? `< ${Nt} min` : `${Math.floor(e / 60)}h ${e % 60}m`;
}
const Se = class Se extends M {
  constructor() {
    super(), this._writeTimers = /* @__PURE__ */ new Map(), this._settleTimers = /* @__PURE__ */ new Map(), this._closer = new _e(this, () => this._collapse()), this._powerAverage = null, this._averageDirection = 0, this._averageStartedAt = 0, this._averageUpdatedAt = 0, this._pendingDirection = 0, this._pendingSince = 0, this._expanded = !1, this._thresholdLocal = null, this._targetLocal = null, this._dischargeLocal = null, this._chargeModeLocal = null, this._backupSwitchLocal = null, this._itemModesLocal = [];
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
      const t = ii(e.charge_mode_control);
      if (t !== null) throw new Error(`des-storage-card: ${t}`);
    }
    if (e.variant === "thermal_group") {
      const t = e.items;
      if (!Array.isArray(t) || t.length === 0)
        throw new Error(
          'des-storage-card: "items" braucht mindestens einen Eintrag'
        );
      if (t.length > Dt)
        throw new Error(
          `des-storage-card: "items" erlaubt höchstens ${Dt} Einträge`
        );
      if (t.some((r) => !r || !r.name))
        throw new Error('des-storage-card: jeder Eintrag in "items" braucht "name"');
      for (const r of t)
        if (r.mode_entity !== void 0 && !fe(r.mode_entity))
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
      }, gi)
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
        this._rangeFor(e.threshold_pct, Be)
      ) && (this._thresholdLocal = null, this._clearSettle("threshold")), this._targetLocal !== null && this._entityMatches(
        e.charge_target_pct,
        this._targetLocal,
        this._rangeFor(e.charge_target_pct, Ue)
      ) && (this._targetLocal = null, this._clearSettle("target")), this._dischargeLocal !== null && this._entityMatches(
        e.discharge_limit_entity,
        this._dischargeLocal,
        this._rangeFor(e.discharge_limit_entity, je)
      ) && (this._dischargeLocal = null, this._clearSettle("discharge"));
      const o = e.charge_mode_control;
      if (this._chargeModeLocal !== null && o?.entity) {
        const c = this._chargeModeFromEntity(o);
        c !== null && c === this._chargeModeLocal && (this._chargeModeLocal = null, this._clearSettle("chargeMode"));
      }
      const n = e.backup;
      if (this._backupSwitchLocal !== null && n && typeof n != "string" && n.switch_entity) {
        const c = T(n.switch_entity, this.hass);
        c.kind === "value" && c.value.trim().toLowerCase() === "on" === this._backupSwitchLocal && (this._backupSwitchLocal = null, this._clearSettle("backupSwitch"));
      }
      return;
    }
    const t = e.items ?? [];
    let r = !1;
    const i = [...this._itemModesLocal];
    t.forEach((o, n) => {
      const c = i[n];
      if (!c) return;
      const l = this._itemModeFromEntity(o);
      l === null || l !== c || (i[n] = null, r = !0, this._clearSettle(`item:${n}`));
    }), r && (this._itemModesLocal = i);
  }
  /** True when the slot is entity-bound and already carries exactly `local`. */
  _entityMatches(e, t, r) {
    if (typeof e != "string" || !v(e)) return !1;
    const i = y(e, this.hass);
    return i.kind === "value" && ve(i.value, r) === t;
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
    if (!fe(e)) return t;
    const r = e, i = N(r, this.hass, "min") ?? t.min, o = N(r, this.hass, "max") ?? t.max, n = N(r, this.hass, "step") ?? t.step;
    return !(i < o) || !(n > 0) ? t : { min: i, max: o, step: n };
  }
  getCardSize() {
    return this._config?.variant === "thermal_group" ? 1 + (this._config.items?.length ?? 0) : this._expanded ? 3 : 2;
  }
  /**
   * HA sections view: a third of the section wide, fixed height. A battery is
   * short; a thermal group grows with its item count (3 items → 4 rows).
   */
  getGridOptions() {
    const e = this._config?.variant === "thermal_group" ? li + (this._config.items?.length ?? 0) : ai;
    return { columns: ni, rows: e, min_rows: e };
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
    return a`
      <ha-card>
        <div class="card">
          ${e.variant === "battery" ? this._renderBattery(e) : this._renderThermalGroup(e)}
        </div>
        ${t && this._expanded ? a`<div class="overlay">${this._renderBatteryControls(e)}</div>` : d}
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
    let t = y(e.power_w, this.hass);
    if (t.kind === "unset" && e.voltage_entity && e.current_entity) {
      const o = y(e.voltage_entity, this.hass), n = y(e.current_entity, this.hass);
      t = o.kind === "value" && n.kind === "value" ? { kind: "value", value: o.value * n.value } : { kind: "unavailable" };
    }
    if (t.kind !== "value") return t;
    let r = e.invert_power ? -t.value : t.value;
    const i = y(e.power_share, this.hass);
    return i.kind === "unavailable" ? { kind: "unavailable" } : (r *= i.kind === "value" ? i.value : di, { kind: "value", value: r });
  }
  /** Absolute watts below which the battery reads as idle. */
  _idleThreshold(e) {
    const t = y(e.idle_threshold_w, this.hass);
    return t.kind === "value" && t.value >= 0 ? t.value : ci;
  }
  /** Configured status, else derived from the power sign. */
  _status(e, t) {
    const r = T(e.status, this.hass);
    if (r.kind === "value") {
      const i = xi(r.value);
      if (i !== null) return i;
    }
    if (t.kind === "value") {
      const i = this._idleThreshold(e);
      if (t.value <= -i) return "discharging";
      if (t.value >= i) return "charging";
    }
    return "idle";
  }
  /** `energy_kwh` if given, otherwise soc x capacity / 100. */
  _energy(e, t, r) {
    const i = y(e.energy_kwh, this.hass);
    return i.kind !== "unset" ? i : t.kind === "value" && r.kind === "value" ? { kind: "value", value: t.value * r.value / 100 } : t.kind === "unavailable" || r.kind === "unavailable" ? { kind: "unavailable" } : { kind: "unset" };
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
    const r = this._idleThreshold(e), i = t.value >= r ? 1 : t.value <= -r ? -1 : 0;
    if (i === 0) {
      this._pendingDirection = 0;
      return;
    }
    const o = Date.now();
    if (this._powerAverage === null || this._averageDirection === 0) {
      this._commitAverage(i, t.value, o);
      return;
    }
    if (i === this._averageDirection) {
      this._pendingDirection = 0;
      const n = Math.max(0, (o - this._averageUpdatedAt) / 1e3);
      this._averageUpdatedAt = o;
      const c = 1 - Math.exp(-n / hi);
      this._powerAverage += c * (t.value - this._powerAverage);
      return;
    }
    this._pendingDirection !== i && (this._pendingDirection = i, this._pendingSince = o), o - this._pendingSince >= pi && this._commitAverage(i, t.value, o);
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
    let i = e.time_remaining;
    if (i === void 0 && (i = r ? e.time_remaining_charging : e.time_remaining_discharging), i !== void 0) {
      const o = T(i, this.hass);
      return o.kind !== "value" ? { text: null, state: "device" } : fi.has(o.value.trim().toLowerCase()) ? { text: null, state: "device" } : { text: o.value, state: "device" };
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
    if (Date.now() - this._averageStartedAt < ui)
      return { text: null, state: "warmup" };
    const t = Math.abs(this._powerAverage);
    if (t < this._idleThreshold(e)) return { text: null, state: "idle" };
    const r = y(e.soc, this.hass), i = y(e.capacity_kwh, this.hass);
    if (r.kind !== "value" || i.kind !== "value")
      return { text: null, state: "no-soc" };
    const o = this._averageDirection > 0, n = o ? this._chargeTarget(e) : this._threshold(e);
    if (n === null) return { text: null, state: "no-limit" };
    const c = o ? n - r.value : r.value - n;
    if (c <= 0) return { text: null, state: "below-min" };
    const l = Si(
      c / 100 * i.value / (t / 1e3)
    );
    return l === null ? { text: null, state: "out-of-range" } : { text: l, state: this._pendingDirection !== 0 ? "flip" : "ok" };
  }
  _backup(e) {
    const t = e.backup;
    if (!t || t === "none") return "none";
    if (typeof t == "string")
      return t === "active" || t === "ready" || t === "off" ? t : "none";
    const r = T(t.entity, this.hass);
    return r.kind !== "value" ? "none" : (t.active_states ?? []).some(
      (o) => o.trim().toLowerCase() === r.value.toLowerCase()
    ) ? "ready" : "off";
  }
  _threshold(e) {
    if (this._thresholdLocal !== null) return this._thresholdLocal;
    const t = y(e.threshold_pct, this.hass);
    return t.kind === "value" ? ve(t.value, this._rangeFor(e.threshold_pct, Be)) : null;
  }
  _chargeTarget(e) {
    if (this._targetLocal !== null) return this._targetLocal;
    const t = y(e.charge_target_pct, this.hass);
    return t.kind === "value" ? ve(t.value, this._rangeFor(e.charge_target_pct, Ue)) : null;
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
    const t = y(e.discharge_limit_entity, this.hass);
    return t.kind === "value" ? ve(
      t.value,
      this._rangeFor(e.discharge_limit_entity, je)
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
    const r = T(e.charge_mode, this.hass);
    return r.kind === "value" && r.value.trim().toLowerCase() === "charge" ? "charge" : "auto";
  }
  /**
   * The mode the control's entity currently reports, ignoring any local
   * override. `off` only when an `off_state` matches; `null` when the entity
   * cannot be read (so no segment is highlighted).
   */
  _chargeModeFromEntity(e) {
    const t = T(e.entity, this.hass);
    return t.kind !== "value" ? null : ri(e, t.value) ? "off" : ti(e, t.value) ? "charge" : "auto";
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
    const i = T(e.mode, this.hass);
    return i.kind === "value" ? ki(i.value) : this._itemModeFromEntity(e) ?? "auto";
  }
  /**
   * The mode the entities currently report, ignoring any local override.
   * `null` when nothing readable says what the mode is.
   */
  _itemModeFromEntity(e) {
    if (e.mode_entity) {
      const t = T(e.mode_entity, this.hass);
      if (t.kind !== "value") return null;
      const r = Math.round(Number.parseFloat(t.value));
      return wi[r] ?? null;
    }
    if (e.switch_entity) {
      const t = T(e.switch_entity, this.hass);
      if (t.kind === "value")
        return t.value.trim().toLowerCase() === "on" ? "on" : "off";
    }
    return null;
  }
  // =========================================================================
  // variant: battery
  // =========================================================================
  _renderBattery(e) {
    const t = y(e.soc, this.hass), r = y(e.capacity_kwh, this.hass), i = this._power(e), o = this._energy(e, t, r), n = this._status(e, i), c = this._backup(e), l = this._timeRemaining(e, i), h = T(e.time_at, this.hass), u = [l.text, h.kind === "value" ? h.value : null].filter((f) => f !== null).join(" · "), p = e.controls !== !1;
    return a`
      <div class="header">
        <div class="head-left">
          <span class="name">${e.name}</span>
        </div>
        <div class="badges">
          ${this._renderCapacityBadge(r)}
          ${this._renderTemperatureBadge(e)}
          ${c === "none" ? d : this._renderBackupBadge(c)}
          ${this._renderBadge(yr[n], `status-${n}`)}
        </div>
      </div>

      <div class="main">
        ${this._renderBatteryIcon(t)}
        <div class="readout">
          <span class="soc">
            ${t.kind === "value" ? `${m(t.value)} %` : this._dash()}
          </span>
          ${o.kind === "unset" ? d : a`<span class="energy">
                ${o.kind === "value" ? `${$(o.value)} kWh` : this._dash()}
              </span>`}
        </div>
        <div class="timing">
          ${i.kind === "unset" ? d : a`<div class=${this._powerClass(i, this._idleThreshold(e))}>
                ${i.kind === "value" ? this._formatPower(i.value) : this._dash()}
              </div>`}
          <!-- Always in the DOM so a missing estimate is inspectable via
               data-eta-state; hidden (no layout) while there is nothing to show. -->
          <div class="muted" data-eta-state=${l.state} ?hidden=${u.length === 0}>
            ${u}
          </div>
        </div>
      </div>

      ${p ? a`<div
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
    const t = this._chargeMode(e), r = this._chargeTarget(e), i = this._threshold(e), o = this._rangeFor(e.charge_target_pct, Ue), n = this._rangeFor(e.threshold_pct, Be), c = typeof e.discharge_limit_entity == "string" && e.discharge_limit_entity.trim().length > 0, l = c ? this._dischargeLimit(e) : null, h = this._rangeFor(e.discharge_limit_entity, je), u = e.charge_mode_control?.off_state, p = typeof u == "string" && u.trim().length > 0, f = P(
      p ? vi : mi,
      t,
      (x) => this._setChargeMode(x),
      "Lademodus"
    ), _ = e.packs ?? [], b = e.backup, k = b && typeof b != "string" ? b.switch_entity : void 0;
    return a`
      <div class="controls">
        ${p ? a`<div class="mode-row">${f}</div>` : d}
        <div class="ctl-main">
          <div class="ctl-rows">
            <span class="ctl-label">Ladegrenze</span>
          <input
            class="slider"
            type="range"
            min=${o.min}
            max=${o.max}
            step=${o.step}
            .value=${String(r ?? o.min)}
            aria-label="Ladegrenze"
            @input=${this._onTargetInput}
            @change=${this._onTargetChange}
          />
          <span class="ctl-value">
            ${r === null ? this._dash() : `${Ge(r, o.step)} %`}
          </span>

          <span class="ctl-label">min. SoC</span>
          <input
            class="slider"
            type="range"
            min=${n.min}
            max=${n.max}
            step=${n.step}
            .value=${String(i ?? n.min)}
            aria-label="Minimaler Ladestand"
            @input=${this._onThresholdInput}
            @change=${this._onThresholdChange}
          />
          <span class="ctl-value">
            ${i === null ? this._dash() : `${Ge(i, n.step)} %`}
          </span>

          ${c ? a`
                <span class="ctl-label">max. Entladen</span>
                <input
                  class="slider"
                  type="range"
                  min=${h.min}
                  max=${h.max}
                  step=${h.step}
                  .value=${String(l ?? h.min)}
                  aria-label="Maximale Entladeleistung"
                  @input=${this._onDischargeInput}
                  @change=${this._onDischargeChange}
                />
                <span class="ctl-value">
                  ${l === null ? this._dash() : `${Ge(l, h.step)} W`}
                </span>
              ` : d}
          </div>
          ${p ? d : f}
        </div>
        ${k ? this._renderBackupSwitchRow(e, k) : d}
        ${_.length > 0 ? a`<table class="packs">
              <thead>
                <tr>
                  <th class="pack-col-name">Akku</th>
                  <th>Kapazität</th>
                  <th>Rest</th>
                  <th>SoC</th>
                  <th>°C</th>
                  <th>Zellen</th>
                </tr>
              </thead>
              <tbody>
                ${_.map(
      (x) => this._renderPack(x, this._tempOverride(e))
    )}
              </tbody>
            </table>` : d}
      </div>
    `;
  }
  /**
   * One pack table row: name, capacity, remaining energy, soc, temperature
   * (traffic-light coloured) and cell balance. The temperature unit lives in
   * the header; the two kWh columns carry their unit, like soc's "%". A value
   * the card cannot read shows a muted dash - and without `capacity_kwh` both
   * the capacity and the remaining-energy cell are dashes. (No SoH: the Zendure
   * does not expose a per-pack state of health locally.)
   */
  _renderPack(e, t) {
    const r = y(e.soc, this.hass), i = y(e.capacity_kwh, this.hass), o = y(e.temp_c, this.hass), n = T(e.balance, this.hass), c = r.kind === "value" && i.kind === "value" ? r.value * i.value / 100 : null, l = o.kind === "value" ? $e(o.value, "battery", t) : "neutral";
    return a`
      <tr>
        <td class="pack-col-name">${e.name}</td>
        <td>
          ${i.kind === "value" ? `${$(i.value)} kWh` : this._dash()}
        </td>
        <td>${c !== null ? `${$(c)} kWh` : this._dash()}</td>
        <td>${r.kind === "value" ? `${m(r.value)} %` : this._dash()}</td>
        <td class="pack-temp ${l}">
          ${o.kind === "value" ? $(o.value) : this._dash()}
        </td>
        <td>${n.kind === "value" ? n.value : this._dash()}</td>
      </tr>
    `;
  }
  /** "Notstromsteckdose" row with a switch, under the sliders / pack rows. */
  _renderBackupSwitchRow(e, t) {
    const r = this._backupSwitchOn(e), i = r !== null;
    return a`
      <div class="switch-row">
        <span class="ctl-label ${i ? "" : "disabled"}">Notstromsteckdose</span>
        <ha-switch
          .checked=${r === !0}
          .disabled=${!i}
          aria-label="Notstromsteckdose"
          title=${i ? d : "Zustand nicht lesbar"}
          @change=${(o) => this._setBackupSwitch(
      t,
      o.target.checked
    )}
        ></ha-switch>
      </div>
    `;
  }
  /** Capacity as a neutral pill; omitted when not configured. */
  _renderCapacityBadge(e) {
    return e.kind === "unset" ? d : this._renderBadge(
      e.kind === "value" ? `${$(e.value)} kWh` : a`${this._dash()} kWh`,
      "badge-neutral"
    );
  }
  /** Per-card override of the battery profile's upper temperature thresholds. */
  _tempOverride(e) {
    return { warn: e.temp_warn_c, alert: e.temp_alert_c };
  }
  /** Battery temperature level under the shared `battery` profile. */
  _tempLevel(e, t) {
    return $e(t, "battery", this._tempOverride(e));
  }
  /** Temperature as the shared pill, colour-coded on the `battery` profile. */
  _renderTemperatureBadge(e) {
    const t = y(e.temp_c, this.hass);
    return t.kind === "unset" ? d : t.kind === "unavailable" ? Xe(a`${this._dash()} °C`, "neutral") : Xe(
      `${$(t.value)} °C`,
      this._tempLevel(e, t.value)
    );
  }
  /** Upright battery; the fill grows from the bottom. */
  _renderBatteryIcon(e) {
    const t = e.kind === "value" ? w(e.value, 0, 100) : 0, r = e.kind !== "value" ? "transparent" : t > 50 ? "var(--success-color, #2e7d32)" : t >= 20 ? "var(--warning-color, #ff9800)" : "var(--error-color, #d32f2f)", i = 6, o = 26, n = o * t / 100, c = i + (o - n);
    return a`
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
    const t = e.items ?? [], r = t.map((l) => y(l.power_w, this.hass)), i = t.map((l) => y(l.energy_kwh, this.hass)), o = this._sum(i), n = this._sum(r), c = r.filter(
      (l) => l.kind === "value" && l.value > 0
    ).length;
    return a`
      <div class="header">
        <div class="head-left">
          <span class="name">${e.name}</span>
        </div>
        <div class="badges">
          <!-- Heating charges the heat store, so it reads as "charging". -->
          ${this._renderBadge(
      c > 0 ? `${m(c)} heizen` : "Aus",
      c > 0 ? "status-charging" : "status-off"
    )}
        </div>
      </div>

      <div class="main">
        <ha-icon class="fish" icon="mdi:fish"></ha-icon>
        <div class="readout stacked">
          <span class="soc">
            ${o === null ? this._dash() : `${$(o)} kWh`}
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
      (l, h) => this._renderItem(l, h, r[h], i[h])
    )}
      </div>
    `;
  }
  /** Sums the values that resolved; null when none of them did. */
  _sum(e) {
    const t = e.filter(
      (r) => r.kind === "value"
    );
    return t.length === 0 ? null : t.reduce((r, i) => r + i.value, 0);
  }
  /**
   * Status dot colour: only the `switch_entity` state counts (`on` → green),
   * never `power_w` or `mode_entity`. Missing/unavailable reads as off (grey).
   */
  _switchOn(e) {
    const t = T(e, this.hass);
    return t.kind === "value" && t.value.trim().toLowerCase() === "on";
  }
  _renderItem(e, t, r, i) {
    const o = r.kind === "value" && r.value > 0;
    return a`
      <div class="item">
        <div class="item-head">
          ${e.switch_entity ? a`<span
                class="dot ${this._switchOn(e.switch_entity) ? "dot-on" : ""}"
              ></span>` : d}
          <span class="item-name">${e.name}</span>
        </div>
        <span class="item-energy">
          ${i.kind === "value" ? `${$(i.value)} kWh` : i.kind === "unavailable" ? this._dash() : ""}
        </span>
        <span class=${o ? "item-power positive" : "item-power"}>
          ${r.kind === "value" ? this._formatPower(r.value) : r.kind === "unavailable" ? this._dash() : ""}
        </span>
        ${P(
      bi,
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
    return a`<span class="unavail">–</span>`;
  }
  /**
   * The label sits in its own element so it can be nudged down optically.
   * Metric centring alone reads as too high - see `.badge-label` in the styles.
   */
  _renderBadge(e, t) {
    return a`<span class="badge ${t}">
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
    return `${t === 0 ? m(0) : Kr(t)} W`;
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
    !t?.entity || !fr(t) || (this._holdOptimistic("chargeMode", () => {
      this._chargeModeLocal = null;
    }), this._write(si(this.hass, t, e), () => {
      this._clearSettle("chargeMode"), this._chargeModeLocal = null;
    }));
  }
  /** On/off of the emergency outlet; `null` when it cannot be read. */
  _backupSwitchOn(e) {
    if (this._backupSwitchLocal !== null) return this._backupSwitchLocal;
    const t = e.backup;
    if (!t || typeof t == "string" || !t.switch_entity) return null;
    const r = T(t.switch_entity, this.hass);
    return r.kind !== "value" ? null : r.value.trim().toLowerCase() === "on";
  }
  _setBackupSwitch(e, t) {
    this._backupSwitchLocal = t, X(e) && (this._holdOptimistic("backupSwitch", () => {
      this._backupSwitchLocal = null;
    }), this._write(ce(this.hass, e, t), () => {
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
    if (!fe(t)) return;
    const i = t, o = this._writeTimers.get(e);
    o !== void 0 && window.clearTimeout(o), this._writeTimers.set(
      e,
      window.setTimeout(() => {
        this._writeTimers.delete(e), this._holdOptimistic(e, () => this._clearSliderLocal(e)), this._write(Mt(this.hass, i, r), () => {
          this._clearSettle(e), this._clearSliderLocal(e);
        });
      }, _i)
    );
  }
  _setItemMode(e, t) {
    const r = [...this._itemModesLocal];
    r[e] = t, this._itemModesLocal = r;
    const i = this._config?.items?.[e], o = () => {
      const c = [...this._itemModesLocal];
      c[e] = null, this._itemModesLocal = c;
    };
    if (i?.mode_entity) {
      if (!fe(i.mode_entity)) return;
      this._holdOptimistic(`item:${e}`, o), this._write(
        Mt(this.hass, i.mode_entity, yi[t]),
        () => {
          this._clearSettle(`item:${e}`), o();
        }
      );
      return;
    }
    const n = i?.switch_entity;
    t === "auto" || !X(n) || (this._holdOptimistic(`item:${e}`, o), this._write(ce(this.hass, n, t === "on"), () => {
      this._clearSettle(`item:${e}`), o();
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
Se.properties = {
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
}, Se.styles = [
  J,
  ue,
  pe,
  wr,
  L`
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
let Je = Se;
const Q = L`
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
`, Ei = /* @__PURE__ */ new Set([
  "normal",
  "alarm",
  "night"
]), Ai = 12.5, Ti = 6.5, Li = 6, Ci = 0.5, Mi = 500, Oi = 40, Ht = 4, Pi = 12, Ri = ["L1", "L2", "L3"], Di = {
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
function g(s) {
  return typeof s == "string" && s.trim().length > 0;
}
function W(s) {
  return Array.isArray(s) && s.some(g);
}
function be(s) {
  const e = s.filter((t) => t !== null);
  return e.length > 0 ? e.reduce((t, r) => t + r, 0) : null;
}
const zi = 2, Ni = 6e4, Ii = 2500, z = (s) => String(s).padStart(2, "0");
function Hi(s) {
  const e = s.trim();
  if (e.length === 0) return null;
  const t = e.includes("T") ? e : e.replace(" ", "T"), r = new Date(t);
  return Number.isNaN(r.getTime()) ? null : r;
}
function Fi(s) {
  return `${z(s.getDate())}.${z(s.getMonth() + 1)}.${s.getFullYear()} ${z(s.getHours())}:${z(s.getMinutes())}`;
}
function Wi() {
  const s = /* @__PURE__ */ new Date();
  return `${s.getFullYear()}-${z(s.getMonth() + 1)}-${z(s.getDate())} ${z(s.getHours())}:${z(s.getMinutes())}:00`;
}
const Ee = class Ee extends M {
  constructor() {
    super(), this._closer = new _e(this, () => this._collapse()), this._expanded = !1, this._clockTick = 0, this._timeSetDone = !1;
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
    const e = g(this._config?.time_entity);
    e && this._clockTimer === void 0 ? this._clockTimer = window.setInterval(() => {
      this._clockTick += 1;
    }, Ni) : e || this._stopClockTimer();
  }
  _stopClockTimer() {
    this._clockTimer !== void 0 && (window.clearInterval(this._clockTimer), this._clockTimer = void 0);
  }
  _warnMinutes() {
    const e = this._config?.time_warn_minutes;
    return typeof e == "number" && Number.isFinite(e) && e >= 0 ? e : zi;
  }
  /** Signed deviation in minutes; positive means the inverter runs ahead. */
  _clockReading() {
    const e = this._config?.time_entity;
    if (!g(e)) return { kind: "off" };
    const t = this._text(e);
    if (t === null) return { kind: "unavailable" };
    const r = Hi(t);
    return r === null ? { kind: "unavailable" } : { kind: "value", at: r, minutes: (r.getTime() - Date.now()) / 6e4 };
  }
  _clockOffBy(e) {
    return e.kind === "value" && Math.abs(e.minutes) >= this._warnMinutes();
  }
  /** Amber only past the threshold; grey when the entity cannot be read. */
  _renderClockPill(e) {
    return e.kind === "off" ? d : e.kind === "unavailable" ? a`<span class="pill">
        <span class="pill-label">Uhr ?</span>
      </span>` : this._clockOffBy(e) ? a`<span class="pill pill-alarm">
      <span class="pill-label">
        Uhr ${ge(e.minutes)} min
      </span>
    </span>` : d;
  }
  _renderClockRow(e) {
    if (e.kind === "off") return d;
    const t = e.kind === "value", r = t && this._clockOffBy(e);
    return a`
      <div class="clock-row">
        <span class="foot-label">Wechselrichter-Uhr</span>
        <span class="clock-value">
          ${t ? a`${Fi(e.at)}
                <span class="clock-delta">
                  (Δ ${ge(e.minutes)} min)
                </span>` : a`<span class="unavail">–</span>`}
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
    !g(e) || typeof this.hass?.callService != "function" || Promise.resolve(
      this.hass.callService("datetime", "set_value", {
        entity_id: e,
        datetime: Wi()
      })
    ).then(() => {
      this._timeSetDone = !0, this._feedbackTimer !== void 0 && window.clearTimeout(this._feedbackTimer), this._feedbackTimer = window.setTimeout(() => {
        this._feedbackTimer = void 0, this._timeSetDone = !1;
      }, Ii);
    }).catch((t) => {
      console.error("des-inverter-card: Zeit konnte nicht gesetzt werden", t);
    });
  }
  setConfig(e) {
    if (!e)
      throw new Error("des-inverter-card: Konfiguration fehlt");
    if (!e.name)
      throw new Error('des-inverter-card: "name" ist erforderlich');
    if (e.demo_state && !Ei.has(e.demo_state))
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
    return { columns: Pi, rows: Ht, min_rows: Ht };
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
    return e ? g(e.pv_power_entity) || g(e.today_production_entity) || g(e.total_production_entity) || g(e.fault_entity) || g(e.alarm_entity) || g(e.device_state_entity) || g(e.inverter_temp_entity) || g(e.dc_temp_entity) || g(e.grid_frequency_entity) || g(e.pv1_power_entity) || g(e.pv1_voltage_entity) || g(e.pv1_current_entity) || g(e.pv2_power_entity) || g(e.pv2_voltage_entity) || g(e.pv2_current_entity) || W(e.grid_power_entities) || W(e.inverter_power_entities) || W(e.grid_voltage_entities) : !1;
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
      phases: W(e.grid_power_entities) || W(e.inverter_power_entities) || W(e.grid_voltage_entities),
      dc: e.show_dc_temp !== !1 && g(e.dc_temp_entity),
      freq: g(e.grid_frequency_entity)
    };
  }
  get _kwpTotal() {
    return this._config?.kwp_total ?? Ai;
  }
  get _kwpString() {
    return [
      this._config?.kwp_pv1 ?? Ti,
      this._config?.kwp_pv2 ?? Li
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
    const r = y(e, this.hass);
    if (r.kind !== "value") return null;
    let i = r.value;
    if (v(e)) {
      const o = ut(e, this.hass);
      t === "power" ? o === "kw" ? i *= 1e3 : o === "mw" && (i *= 1e6) : t === "energy" && (o === "wh" ? i /= 1e3 : o === "mwh" && (i *= 1e3));
    }
    return Number.isFinite(i) ? i : null;
  }
  /** A configured entity's text, or null when unset/unavailable. */
  _text(e) {
    if (!g(e)) return null;
    const t = T(e, this.hass);
    return t.kind === "value" ? t.value : null;
  }
  _view() {
    return this._entityMode ? this._entityView() : this._demoView();
  }
  /** Wraps the static demo dataset in the (non-null) view shape. */
  _demoView() {
    const e = this._config, t = Di[e.demo_state ?? "normal"];
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
    let i;
    g(e.pv_power_entity) ? i = this._num(e.pv_power_entity, "power") : i = be([t, r]);
    const o = [
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
      pvPower: i,
      inverterTemp: this._num(e.inverter_temp_entity, "plain"),
      dcTemp: this._num(e.dc_temp_entity, "plain"),
      gridFrequency: this._num(e.grid_frequency_entity, "plain"),
      strings: o,
      phases: [n(0), n(1), n(2)],
      imbalance: this._imbalance(t, r),
      exportW: this._exportW(
        (e.grid_power_entities ?? []).map((l) => this._num(l, "power"))
      ),
      showStrings: c.strings,
      showExport: W(e.grid_power_entities),
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
    const t = this._config?.invert_grid ? -1 : 1, r = be(e);
    return r === null ? null : -(r * t);
  }
  /** Per-string amber flags; skipped when a power is missing (would be NaN). */
  _imbalance(e, t) {
    const r = this._config;
    if (r?.imbalance_warn === !1) return [!1, !1];
    if (e === null || t === null) return [!1, !1];
    const i = r?.imbalance_ratio ?? Ci, o = r?.imbalance_min_w ?? Mi, n = (c, l) => c < i * l && l > o;
    return [n(e, t), n(t, e)];
  }
  // =========================================================================
  // render
  // =========================================================================
  render() {
    const e = this._config;
    if (!e) return d;
    const t = this._view(), r = t.showStrings || t.showPhases || this._hasFooter(t) || g(e.time_entity);
    return a`
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
    return a`
      <div class="header">
        <div class="head-left">
          <span class="name">${r.name}</span>
          <span class="meta">${this._renderMeta(e)}</span>
        </div>
        <div class="pills">
          ${this._renderClockPill(this._clockReading())}
          ${this._renderTempPill(e)}
          ${this._renderPill(e)}
        </div>
      </div>

      ${this._renderPowerRow(e)}
      ${e.showStrings || e.showExport ? this._renderStringBars(e) : d}

      ${t ? a`<div
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
    return e.model && t.push(a`${e.model}`), t.push(a`${this._unit(e.todayProduction, $, "kWh")} heute`), t.push(
      a`${this._unit(e.totalProduction, m, "kWh")} gesamt`
    ), a`${t.map((r, i) => i === 0 ? r : a` · ${r}`)}`;
  }
  /** fault beats alarm beats device state; "OK"/absent means no fault. */
  _renderPill(e) {
    const t = (c) => {
      if (c === null) return null;
      const l = c.trim();
      return l.length > 0 && l.toLowerCase() !== "ok" ? l : null;
    }, r = t(e.fault), i = t(e.alarm), [o, n] = r ? [`Fault: ${r}`, "pill-fault"] : i ? [`Alarm: ${i}`, "pill-alarm"] : [e.deviceState, "pill-ok"];
    return a`<span class="pill ${n}">
      <span class="pill-label">${o}</span>
    </span>`;
  }
  /** Per-card override of the `inverter` profile's upper temperature thresholds. */
  _tempOverride() {
    const e = this._config;
    return { warn: e?.temp_warn_c, alert: e?.temp_alert_c };
  }
  /**
   * Inverter (AC-board) temperature as the shared pill, left of the status pill.
   * Uses the `inverter` profile; omitted when there is no readable temperature.
   */
  _renderTempPill(e) {
    if (e.inverterTemp === null) return d;
    const t = $e(
      e.inverterTemp,
      "inverter",
      this._tempOverride()
    );
    return Xe(`${$(e.inverterTemp)} °C`, t);
  }
  _renderPowerRow(e) {
    const t = e.pvPower !== null && e.pvPower > 0, r = this._kwpTotal, i = e.pvPower !== null && r > 0 ? w(e.pvPower / (r * 1e3) * 100, 0, 999) : null;
    return a`
      <div class="power-row">
        <div class="pv">
          <span class="pv-value ${t ? "producing" : "idle"}">
            ${this._unit(e.pvPower, m, "W")}
          </span>
          ${i === null ? d : a`<span class="pv-share">
                ${m(i)} % von ${Vr(r)} kWp
              </span>`}
        </div>
      </div>
    `;
  }
  _renderStringBars(e) {
    const t = this._kwpString;
    return a`
      <div class="strings">
        ${e.showStrings ? e.strings.map((r, i) => {
      const o = (t[i] ?? 0) * 1e3, n = r.power !== null && o > 0 ? w(r.power / o * 100, 0, 100) : 0, c = e.imbalance[i];
      return a`
                <div class="string-row">
                  <span class="string-label">PV${i + 1}</span>
                  <div class="bar">
                    <div
                      class="bar-fill ${c ? "warn" : ""}"
                      style="width: ${n}%"
                    ></div>
                  </div>
                  <span class="string-power">
                    ${this._unit(r.power, m, "W")}
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
    const t = e.exportW, r = t !== null && t >= Oi, i = this._kwpTotal * 1e3, o = r && i > 0 ? w(t / i * 100, 0, 100) : 0;
    return a`
      <div class="string-row">
        <span class="string-label">Export</span>
        <div class="bar">
          <div class="bar-fill export" style="width: ${o}%"></div>
        </div>
        <span class="string-power">
          ${t === null ? a`<span class="unavail">–</span>` : a`${m(r ? t : 0)} W`}
        </span>
      </div>
    `;
  }
  // --- expanded ------------------------------------------------------------
  _renderExpanded(e) {
    return a`
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
    return a`
      <div class="grid strings-grid">
        <span class="col-head">Strings</span>
        <span class="col-head num">Spannung</span>
        <span class="col-head num">Strom</span>
        ${e.strings.map(
      (t, r) => a`
            <span class="row-label">PV${r + 1}</span>
            <span class="num">${this._unit(t.voltage, $, "V")}</span>
            <span class="num">${this._unit(t.current, $, "A")}</span>
          `
    )}
      </div>
    `;
  }
  // B. Phases — grid flow, inverter output, voltage per phase, plus a Σ row.
  _renderPhasesTable(e) {
    const t = this._config?.invert_grid ? -1 : 1, r = e.phases.map(
      (n) => n.grid === null ? null : n.grid * t
    ), i = be(r), o = be(e.phases.map((n) => n.inverter));
    return a`
      <div class="grid phases-grid">
        <span class="col-head">Phasen</span>
        <span class="col-head num">Netz</span>
        <span class="col-head num">WR-Ausgang</span>
        <span class="col-head num">Spannung</span>

        ${e.phases.map((n, c) => {
      const l = r[c];
      return a`
            <span class="row-label">${Ri[c]}</span>
            <span class="num ${this._gridClass(l)}">
              ${this._unit(l, ge, "W")}
            </span>
            <span class="num">${this._unit(n.inverter, m, "W")}</span>
            <span class="num">${this._unit(n.voltage, $, "V")}</span>
          `;
    })}

        <span class="row-label sum">Σ</span>
        <span class="num sum ${this._gridClass(i)}">
          ${this._unit(i, ge, "W")}
        </span>
        <span class="num sum">${this._unit(o, m, "W")}</span>
        <span class="num sum muted">–</span>
      </div>
    `;
  }
  // C. Footer — DC temperature (optional) and grid frequency.
  _renderFooter(e) {
    return a`
      <div class="footer">
        ${e.showDcItem ? a`<div class="foot-item">
              <span class="foot-label">DC-Temperatur</span>
              ${this._renderDcTemp(e)}
            </div>` : d}
        ${e.showFreqItem ? a`<div class="foot-item">
              <span class="foot-label">Netzfrequenz</span>
              <span class="foot-value">
                ${this._unit(e.gridFrequency, (t) => $(t, 2), "Hz")}
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
    return e === null ? a`<span class="unavail">–</span>` : a`${t(e)} ${r}`;
  }
  /** negative = feed-in (green), positive = import (red), zero/null = muted. */
  _gridClass(e) {
    return e === null || e === 0 ? "muted" : e < 0 ? "grid-feed" : "grid-draw";
  }
  /** DC-side temperature in the footer, coloured on the `inverter` profile. */
  _renderDcTemp(e) {
    if (e.dcTemp === null)
      return a`<span class="foot-value"><span class="unavail">–</span></span>`;
    const t = $e(e.dcTemp, "inverter", this._tempOverride());
    return a`<span class="foot-value ${t}">
      ${$(e.dcTemp)} °C
    </span>`;
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
Ee.properties = {
  // Assigning `hass` is a reactive property write, so Home Assistant's state
  // updates re-render the card (same mechanism as the storage card).
  hass: { attribute: !1 },
  _config: { state: !0 },
  _expanded: { state: !0 },
  _clockTick: { state: !0 },
  _timeSetDone: { state: !0 }
}, Ee.styles = [
  ue,
  pe,
  Q,
  wr,
  L`
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

    /* DC temperature colouring (inverter profile); neutral keeps primary text. */
    .foot-value.warn {
      color: var(--warning-color, #ff9800);
    }

    .foot-value.alert {
      color: var(--error-color, #d32f2f);
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
let Qe = Ee;
const Bi = /* @__PURE__ */ new Set([
  "normal",
  "night",
  "export"
]), Ft = 4, Ui = 4, ji = 12, Gi = "sensor.pv_helper_solar_direkt_leistung", Ki = "sensor.pv_helper_speicher_leistung", Vi = "sensor.inverter_external_power", Wt = "sensor.pv_helper_energie_solar_direkt", Bt = "sensor.pv_helper_energie_entladen_gesamt", Ut = "sensor.pv_helper_energie_import_gesamt", jt = "var(--success-color)", Gt = "#378ADD", Kt = "#E24B4A", qi = ["day", "week", "month", "year"], Yi = {
  day: "Tag",
  week: "Woche",
  month: "Monat",
  year: "Jahr"
}, Zi = 180, Xi = 2, Ji = ["_apexChart", "apexChart", "_chart"], Qi = {
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
function E(s) {
  return typeof s == "string" && s.trim().length > 0;
}
function es(s) {
  return Array.isArray(s) && s.some(E);
}
const Ae = class Ae extends M {
  constructor() {
    super(), this._closer = new _e(this, () => this._collapse()), this._mountToken = 0, this._awaitingApex = !1, this._expanded = !1, this._period = null;
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
    if (e.demo_state && !Bi.has(e.demo_state))
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
    return Ft;
  }
  /** HA sections view: a third of the section; the chart grows into the rows. */
  getGridOptions() {
    return { columns: ji, rows: Ft, min_rows: Ui };
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
    return e ? E(e.pv_power_entity) || E(e.load_power_entity) || E(e.grid_power_entity) || es(e.storage_power_entities) || E(e.today_consumption_entity) || E(e.today_import_entity) || E(e.today_export_entity) || E(e.autarky_entity) || E(e.solar_power_entity) || E(e.storage_power_entity) || E(e.solar_energy_entity) || E(e.storage_energy_entity) || E(e.grid_energy_entity) : !1;
  }
  /**
   * A configured entity's numeric value, rescaled onto the card's base unit
   * (W for power, kWh for energy). `null` for an unset, unavailable or
   * non-numeric slot - all of which render as a muted "–".
   */
  _num(e, t) {
    if (!E(e)) return null;
    const r = y(e, this.hass);
    if (r.kind !== "value") return null;
    let i = r.value;
    if (v(e)) {
      const o = ut(e, this.hass);
      t === "power" ? o === "kw" ? i *= 1e3 : o === "mw" && (i *= 1e6) : t === "energy" && (o === "wh" ? i /= 1e3 : o === "mwh" && (i *= 1e3));
    }
    return Number.isFinite(i) ? i : null;
  }
  _rawInputs() {
    if (!this._entityMode)
      return Qi[this._config.demo_state ?? "normal"];
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
    const e = this._config, t = this._rawInputs(), r = e.invert_grid ? -1 : 1, o = (t.gridRaw === null ? null : t.gridRaw * r) ?? 0, n = Math.max(o, 0), c = Math.max(-o, 0), l = (e.storage_positive ?? "discharge") === "charge", h = t.storage.reduce((b, k) => k === null ? b : b + Math.max(l ? -k : k, 0), 0);
    let u = 0, p = 0, f = 0, _;
    if (t.pvPower !== null) {
      const b = t.storage.reduce((x, R) => R === null ? x : x + Math.max(l ? R : -R, 0), 0);
      f = Math.max(t.pvPower - c - b, 0), u = h, p = n;
      const k = f + u + p;
      _ = (x) => k > 0 ? w(x / k * 100, 0, 100) : 0;
    } else {
      const b = t.load !== null && t.load > 0 ? t.load : 0;
      b > 0 && (u = Math.min(h, b), p = Math.min(n, b - u), f = Math.max(b - u - p, 0)), _ = (k) => b > 0 ? w(k / b * 100, 0, 100) : 0;
    }
    return {
      load: t.load,
      solarShare: f,
      storageShare: u,
      gridShare: p,
      solarPct: _(f),
      storagePct: _(u),
      gridPct: _(p),
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
    return t === null || t <= 0 || r === null ? null : w((1 - r / t) * 100, 0, 100);
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
    return E(this._chartEntity(e?.solar_energy_entity, Wt)) && E(this._chartEntity(e?.storage_energy_entity, Bt)) && E(this._chartEntity(e?.grid_energy_entity, Ut));
  }
  _availablePeriods() {
    return this._energyPeriodsAvailable() ? [...qi] : ["day"];
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
    const t = this._config, o = {
      chart: { height: this._chartHeight ?? Zi, stacked: !0 },
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
      apex_config: o,
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
          entity: this._chartEntity(t?.solar_power_entity, Gi),
          name: "Solar",
          color: jt
        },
        {
          entity: this._chartEntity(t?.storage_power_entity, Ki),
          name: "Speicher",
          color: Gt,
          transform: "return Math.max(0, x);"
        },
        {
          entity: this._chartEntity(t?.grid_power_entity, Vi),
          name: "Netz",
          color: Kt,
          transform: "return Math.max(0, x);"
        }
      ]
    } : {
      type: "custom:apexcharts-card",
      header: { show: !1 },
      graph_span: e === "week" ? "7d" : e === "month" ? "31d" : "366d",
      span: { start: e === "week" ? "isoWeek" : e === "month" ? "month" : "year" },
      stacked: !0,
      apex_config: o,
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
          entity: this._chartEntity(t?.solar_energy_entity, Wt),
          name: "Solar",
          color: jt
        },
        {
          entity: this._chartEntity(t?.storage_energy_entity, Bt),
          name: "Speicher",
          color: Gt
        },
        {
          entity: this._chartEntity(t?.grid_energy_entity, Ut),
          name: "Netz",
          color: Kt
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
    return a`
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
    return a`
      <div class="header">
        <div class="head-left">
          <span class="name">${e.name}</span>
          <span class="meta">${this._renderMeta(t)}</span>
        </div>
      </div>

      ${this._renderPowerRow(t)}
      ${this._renderMixBar(t)}
      ${this._renderLegend(t)}

      ${this._hasExpand(t) ? a`<div
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
    return a`${this._unit(e.todayConsumption, $, "kWh")} heute ·
    ${this._unit(e.autarky, m, "%")} autark`;
  }
  _renderPowerRow(e) {
    return a`
      <div class="power-row">
        <div class="load">
          <span class="load-value">${this._unit(e.load, m, "W")}</span>
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
    return a`
      <div class="legend">
        ${t.map(
      (r) => a`
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
  /** The Tag/Woche/Monat/Jahr switcher, shown above the chart in the dropdown. */
  _renderPeriodSwitcher() {
    const e = this._availablePeriods(), t = this._effectivePeriod(e);
    return P(
      e.map((r) => ({ value: r, label: Yi[r] })),
      t,
      (r) => this._setPeriod(r),
      "Zeitraum"
    );
  }
  _renderMixBar(e) {
    return a`
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
  // --- expanded dropdown: period switcher + chart + "Heute" ----------------
  _renderExpanded(e) {
    return a`
      <div class="overlay">
        ${this._entityMode ? a`
              <div class="chart-head">${this._renderPeriodSwitcher()}</div>
              ${this._apexAvailable() ? a`<div class="chart" id="chart"></div>` : a`<div class="hint">apexcharts-card nicht installiert</div>`}
            ` : d}
        ${e.hasToday ? a`<div class="today">
              ${this._todayRow("Verbrauch", e.todayConsumption, "")}
              ${this._todayRow("Netzbezug", e.todayImport, "draw")}
              ${this._todayRow("Einspeisung", e.todayExport, "feed")}
            </div>` : d}
      </div>
    `;
  }
  /** One "Heute" row, or nothing when its value is missing. */
  _todayRow(e, t, r) {
    return t === null ? d : a`
      <span class="today-label">${e}</span>
      <span class="today-value ${r}">${$(t)} kWh</span>
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
    t <= 0 || this._chartHeight !== void 0 && Math.abs(t - this._chartHeight) <= Xi || (this._chartHeight = t, this._resizeApex(t));
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
      for (const t of Ji) {
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
    const i = await this._getHelpers();
    if (!i || r !== this._mountToken) return;
    let o;
    try {
      o = i.createCardElement(this._apexCardConfig(t));
    } catch (n) {
      console.error("des-house-card: Chart konnte nicht erzeugt werden", n);
      return;
    }
    r === this._mountToken && (o.classList.add("embedded"), o.hass = this.hass, e.replaceChildren(o), this._chartEl = o, this._chartPeriod = t);
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
    return e === null ? a`<span class="unavail">–</span>` : a`${t(e)} ${r}`;
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
Ae.properties = {
  // Assigning `hass` is a reactive property write, so Home Assistant's state
  // updates re-render the card (same mechanism as the other cards).
  hass: { attribute: !1 },
  _config: { state: !0 },
  _expanded: { state: !0 },
  _period: { state: !0 }
}, Ae.styles = [
  ue,
  pe,
  Q,
  J,
  L`
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
let et = Ae;
const xe = ["day", "week", "month", "year"], ts = new Set(xe), Vt = 4, rs = 12, is = {
  day: "Tag",
  week: "Woche",
  month: "Monat",
  year: "Jahr"
}, K = [
  { key: "consumption", label: "Verbrauch", cls: "m-consumption" },
  { key: "production", label: "Produktion", cls: "m-production" },
  { key: "import", label: "Import", cls: "m-import" },
  { key: "export", label: "Export", cls: "m-export" },
  { key: "charge", label: "Laden", cls: "m-charge" },
  { key: "discharge", label: "Entladen", cls: "m-discharge" }
];
function we(s) {
  return {
    consumption: s[0],
    production: s[1],
    import: s[2],
    export: s[3],
    charge: s[4],
    discharge: s[5]
  };
}
const ss = {
  day: we([17.6, 22.4, 4.4, 3.1, 6.2, 5.8]),
  week: we([148.2, 127.5, 38.6, 41, 32.1, 28.4]),
  month: we([610, 590, 160, 175, 140, 128]),
  year: we([5400, 8200, 1900, 4100, 1200, 1100])
};
function xr(s) {
  return Array.isArray(s) ? s.some(xr) : typeof s == "number" ? Number.isFinite(s) : typeof s == "string" && s.trim().length > 0;
}
const Te = class Te extends M {
  constructor() {
    super(), this._period = null;
  }
  setConfig(e) {
    if (!e)
      throw new Error("des-stats-card: Konfiguration fehlt");
    if (!e.name)
      throw new Error('des-stats-card: "name" ist erforderlich');
    if (e.default_period && !ts.has(e.default_period))
      throw new Error(
        'des-stats-card: "default_period" muss "day", "week", "month" oder "year" sein'
      );
    this._config = e, this._period = null;
  }
  getCardSize() {
    const e = this._effectivePeriod(this._availablePeriods()), t = e ? K.filter((r) => this._periodValues(e)[r.key] !== null).length : 0;
    return 2 + Math.ceil(t / 2);
  }
  /** HA sections view: a third of the section, fixed height. */
  getGridOptions() {
    return { columns: rs, rows: Vt, min_rows: Vt };
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
    return e ? xe.some((t) => {
      const r = e[t];
      return r !== void 0 && K.some((i) => xr(r[i.key]));
    }) : !1;
  }
  /**
   * A configured slot's numeric value, rescaled onto kWh (Wh → /1000,
   * MWh → ×1000). `null` for an unset, unavailable or non-numeric slot.
   */
  _num(e) {
    if (e === void 0 || typeof e == "string" && e.trim().length === 0) return null;
    const t = y(e, this.hass);
    if (t.kind !== "value") return null;
    let r = t.value;
    if (typeof e == "string" && v(e)) {
      const i = ut(e, this.hass);
      i === "wh" ? r /= 1e3 : i === "mwh" && (r *= 1e3);
    }
    return Number.isFinite(r) ? r : null;
  }
  /** Sum of a single value or a list; `null` when nothing resolves. */
  _sumList(e) {
    if (e === void 0) return null;
    const r = (Array.isArray(e) ? e : [e]).map((i) => this._num(i)).filter((i) => i !== null);
    return r.length > 0 ? r.reduce((i, o) => i + o, 0) : null;
  }
  _metricValue(e, t) {
    return e ? t === "charge" || t === "discharge" ? this._sumList(e[t]) : this._num(e[t]) : null;
  }
  _periodValues(e) {
    if (!this._entityMode) return ss[e];
    const t = this._config?.periods?.[e], r = {};
    for (const { key: i } of K) r[i] = this._metricValue(t, i);
    return r;
  }
  /** Periods that have at least one readable figure (all four in demo mode). */
  _availablePeriods() {
    return this._entityMode ? xe.filter((e) => {
      const t = this._periodValues(e);
      return K.some((r) => t[r.key] !== null);
    }) : [...xe];
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
    return t === null || t <= 0 || e === null ? null : w((1 - e / t) * 100, 0, 100);
  }
  // =========================================================================
  // render
  // =========================================================================
  render() {
    const e = this._config;
    if (!e) return d;
    const t = this._availablePeriods(), r = this._effectivePeriod(t), i = r ? this._periodValues(r) : null, o = i ? this._ratio(i.import, i.consumption) : null, n = i ? this._ratio(i.export, i.production) : null;
    return a`
      <ha-card>
        <div class="card">
          <div class="header">
            <span class="name">${e.name}</span>
            ${t.length > 0 && r ? P(
      t.map((c) => ({ value: c, label: is[c] })),
      r,
      (c) => this._setPeriod(c),
      "Zeitraum"
    ) : d}
          </div>

          ${o === null && n === null ? d : a`<div class="meta">
                ${this._pct(o)} % autark · ${this._pct(n)} %
                Eigenverbrauch
              </div>`}

          ${i ? this._renderRows(i) : d}
        </div>
      </ha-card>
    `;
  }
  _renderRows(e) {
    const r = K.map((i) => e[i.key]).filter(
      (i) => i !== null
    ).reduce((i, o) => Math.max(i, o), 0);
    return a`
      <div class="rows">
        ${K.map((i) => {
      const o = e[i.key];
      if (o === null) return d;
      const n = r > 0 ? w(o / r * 100, 0, 100) : 0;
      return a`
            <span class="row-label">${i.label}</span>
            <div class="bar">
              <div
                class="bar-fill ${i.cls}"
                style="width: ${n}%"
              ></div>
            </div>
            <span class="row-value">${$(o, 2)} kWh</span>
          `;
    })}
      </div>
    `;
  }
  /** Whole-number percent, or a muted "–" when it cannot be computed. */
  _pct(e) {
    return e === null ? a`<span class="unavail">–</span>` : a`${m(e)}`;
  }
  _setPeriod(e) {
    this._period = e;
  }
};
Te.properties = {
  // Assigning `hass` is a reactive property write, so Home Assistant's state
  // updates re-render the card (same mechanism as the other cards).
  hass: { attribute: !1 },
  _config: { state: !0 },
  _period: { state: !0 }
}, Te.styles = [
  J,
  Q,
  L`
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
let tt = Te;
const rt = ["day", "week", "month", "year"], os = new Set(rt), ns = {
  day: "Tag",
  week: "Woche",
  month: "Monat",
  year: "Jahr"
}, qt = 4, as = 3, ls = 24, cs = 220, ds = 2, hs = ["_apexChart", "apexChart", "_chart"], Le = class Le extends M {
  constructor() {
    super(), this._mountToken = 0, this._awaitingApex = !1, this._period = null;
  }
  setConfig(e) {
    if (!e)
      throw new Error("des-chart-card: Konfiguration fehlt");
    if (!e.name)
      throw new Error('des-chart-card: "name" ist erforderlich');
    if (e.default_period && !os.has(e.default_period))
      throw new Error(
        'des-chart-card: "default_period" muss "day", "week", "month" oder "year" sein'
      );
    if (e.periods !== void 0 && (typeof e.periods != "object" || e.periods === null))
      throw new Error('des-chart-card: "periods" muss ein Objekt sein');
    this._config = e, this._period = null, this._teardownChart();
  }
  getCardSize() {
    return qt;
  }
  /** HA sections view: two thirds wide; the chart grows into the given rows. */
  getGridOptions() {
    return { columns: ls, rows: qt, min_rows: as };
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
    return typeof t == "string" && t.trim().length > 0 ? t : ns[e];
  }
  /** Periods that carry a chart; empty means "demo" (no periods configured). */
  _realPeriods() {
    return rt.filter((e) => this._chartConfig(e) !== null);
  }
  get _isDemo() {
    return this._realPeriods().length === 0;
  }
  _available() {
    const e = this._realPeriods();
    return e.length > 0 ? e : [...rt];
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
    const t = this._available(), r = this._effectivePeriod(t), i = this._isDemo ? null : this._config?.periods?.[r]?.meta;
    return a`
      <ha-card>
        <div class="card">
          <div class="header">
            <span class="name">${e.name}</span>
            ${P(
      t.map((o) => ({ value: o, label: this._label(o) })),
      r,
      (o) => this._setPeriod(o),
      "Zeitraum"
    )}
          </div>
          ${i ? a`<div class="meta">${i}</div>` : d}
          ${this._renderChartArea(r)}
        </div>
      </ha-card>
    `;
  }
  _renderChartArea(e) {
    return this._isDemo || this._chartConfig(e) === null ? a`<div class="hint">Keine Chart-Config</div>` : this._apexAvailable() ? a`<div class="chart" id="chart"></div>` : a`<div class="hint">apexcharts-card nicht installiert</div>`;
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
    t <= 0 || this._chartHeight !== void 0 && Math.abs(t - this._chartHeight) <= ds || (this._chartHeight = t, this._resizeApex(t));
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
      for (const t of hs) {
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
    const i = ++this._mountToken;
    this._removeChartEl();
    const o = await this._getHelpers();
    if (!o || i !== this._mountToken) return;
    let n;
    try {
      n = o.createCardElement(this._embedConfig(t));
    } catch (c) {
      console.error("des-chart-card: Chart konnte nicht erzeugt werden", c);
      return;
    }
    i === this._mountToken && (n.classList.add("embedded"), n.hass = this.hass, e.replaceChildren(n), this._chartEl = n, this._chartPeriod = r);
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
    const t = (_) => _ && typeof _ == "object" ? _ : {}, r = t(e.header), i = t(e.apex_config), o = t(i.chart), n = t(i.legend), c = t(n.markers), l = t(n.itemMargin), h = t(e.all_series_config), u = t(h.group_by), p = e.stacked === !0 || o.stacked === !0, f = p && "group_by" in h ? {
      all_series_config: {
        ...h,
        group_by: { fill: "last", ...u }
      }
    } : {};
    return {
      ...e,
      ...p ? { stacked: !0 } : {},
      ...f,
      type: "custom:apexcharts-card",
      header: { ...r, show: !1 },
      apex_config: {
        ...i,
        chart: {
          ...o,
          height: this._chartHeight ?? cs,
          ...p ? { stacked: !0 } : {}
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
Le.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 },
  _period: { state: !0 }
}, Le.styles = [
  J,
  L`
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
let it = Le;
const us = 12, Yt = 5, ps = 4, Zt = 30, Xt = 80, Jt = 5, _s = 24, Qt = "Luftentfeuchter", gs = "cancel", fs = /* @__PURE__ */ new Set(["cancel", "abbrechen"]), ms = 300, vs = 8e3, bs = 300 * 1e3, ws = { top: 6, right: 8, bottom: 18, left: 30 }, B = 10, Ke = 20, er = 6, tr = 2;
function re(s) {
  return s !== null && s.trim().toLowerCase() === "on";
}
function Ve(s, e) {
  const { min: t, max: r, step: i } = e;
  if (!(i > 0)) return w(s, t, r);
  const o = Math.round((s - t) / i), n = Number((t + o * i).toFixed(6));
  return w(n, t, r);
}
function ys(s) {
  const e = String(s.getHours()).padStart(2, "0"), t = String(s.getMinutes()).padStart(2, "0");
  return `${e}:${t}`;
}
function rr(s, e) {
  if (e) return "Aus";
  const t = s.trim().match(/^(\d+(?:[.,]\d+)?)/);
  return t ? `${t[1].replace(",", ".")} h` : s;
}
const Ce = class Ce extends M {
  constructor() {
    super(), this._closer = new _e(this, () => this._collapse()), this._settleTimers = /* @__PURE__ */ new Map(), this._historyStarted = !1, this._expanded = !1, this._targetLocal = null, this._powerLocal = null, this._countdownLocal = null, this._lockLocal = null, this._history = [], this._chartW = 0, this._chartH = 0;
  }
  setConfig(e) {
    if (!e)
      throw new Error("des-dehumidifier-card: Konfiguration fehlt");
    if (e.faults !== void 0) {
      if (!Array.isArray(e.faults))
        throw new Error('des-dehumidifier-card: "faults" muss eine Liste sein');
      for (const t of e.faults) {
        if (!t || typeof t.entity != "string" || !t.entity)
          throw new Error('des-dehumidifier-card: jeder "faults"-Eintrag braucht "entity"');
        if (!t.name)
          throw new Error('des-dehumidifier-card: jeder "faults"-Eintrag braucht "name"');
        if (t.severity !== void 0 && t.severity !== "error" && t.severity !== "warning")
          throw new Error(
            'des-dehumidifier-card: "severity" muss "error" oder "warning" sein'
          );
      }
    }
    this._config = e, this._expanded = !1, this._targetLocal = null, this._powerLocal = null, this._countdownLocal = null, this._lockLocal = null, this._historyStarted = !1, this._history = this._isDemo ? this._buildDemoHistory() : [];
  }
  getCardSize() {
    return Yt;
  }
  getGridOptions() {
    return { columns: us, rows: Yt, min_rows: ps };
  }
  static getStubConfig() {
    return {
      type: "custom:des-dehumidifier-card",
      name: Qt,
      location: "Arbeitszimmer"
    };
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._closer.deactivate(), this._writeTimer !== void 0 && window.clearTimeout(this._writeTimer);
    for (const e of this._settleTimers.values()) window.clearTimeout(e);
    this._settleTimers.clear(), this._historyTimer !== void 0 && window.clearInterval(this._historyTimer), this._historyTimer = void 0, this._historyStarted = !1, this._resizeObserver?.disconnect(), this._resizeObserver = void 0, this._observedChart = void 0;
  }
  /** Drops optimistic values the entity has meanwhile confirmed. */
  willUpdate() {
    const e = this._config;
    if (e) {
      if (this._targetLocal !== null && v(e.humidifier_entity)) {
        const t = N(
          e.humidifier_entity,
          this.hass,
          "humidity"
        );
        t !== null && Ve(t, this._targetRange()) === this._targetLocal && (this._targetLocal = null, this._clearSettle("target"));
      }
      if (this._powerLocal !== null && v(e.power_entity)) {
        const t = C(e.power_entity, this.hass);
        t !== null && re(t) === this._powerLocal && (this._powerLocal = null, this._clearSettle("power"));
      }
      if (this._countdownLocal !== null && v(e.countdown_entity)) {
        const t = C(e.countdown_entity, this.hass);
        t !== null && t === this._countdownLocal && (this._countdownLocal = null, this._clearSettle("countdown"));
      }
      if (this._lockLocal !== null && v(e.child_lock_entity)) {
        const t = C(e.child_lock_entity, this.hass);
        t !== null && re(t) === this._lockLocal && (this._lockLocal = null, this._clearSettle("lock"));
      }
    }
  }
  updated() {
    this.toggleAttribute("expanded", this._expanded), this._maybeStartHistory();
    const e = this.renderRoot?.querySelector("#chart");
    this._observeChartSize(e), this._measureChart();
  }
  // =========================================================================
  // demo / live
  // =========================================================================
  get _isDemo() {
    const e = this._config;
    return !e?.humidity_entity && !e?.humidifier_entity && !e?.power_entity && !e?.countdown_entity && !e?.child_lock_entity;
  }
  _targetRange() {
    const e = this._config, t = e?.target_min ?? Zt, r = e?.target_max ?? Xt, i = e?.target_step ?? Jt;
    return !(t < r) || !(i > 0) ? {
      min: Zt,
      max: Xt,
      step: Jt
    } : { min: t, max: r, step: i };
  }
  _historyHours() {
    const e = this._config?.history_hours;
    return typeof e == "number" && e > 0 ? e : _s;
  }
  _offOption() {
    const e = this._config?.countdown_off_option;
    return typeof e == "string" && e.trim().length > 0 ? e : gs;
  }
  /** True when a raw countdown state means "off" (case-insensitive; the
      configured option plus the "cancel"/"Abbrechen" aliases). */
  _isOffState(e) {
    const t = e.trim().toLowerCase();
    return t === this._offOption().trim().toLowerCase() || fs.has(t);
  }
  /**
   * The frontend-translated label for a raw countdown state
   * (`hass.formatEntityState`), falling back to the raw value. HA translates the
   * display ("cancel" → "Abbrechen", "1_hour" → "1 Stunde") while the state
   * stays canonical.
   */
  _countdownDisplay(e) {
    const t = this._config?.countdown_entity, r = v(t) ? this.hass?.states?.[t] : void 0, i = this.hass?.formatEntityState;
    if (r && typeof i == "function")
      try {
        const o = i(r, e);
        if (typeof o == "string" && o.length > 0) return o;
      } catch {
      }
    return e;
  }
  /** Current relative humidity. */
  _humidity() {
    return this._isDemo ? { kind: "value", value: 52 } : y(this._config?.humidity_entity, this.hass);
  }
  /** Target humidity, `null` when it cannot be read. */
  _target() {
    if (this._targetLocal !== null) return this._targetLocal;
    if (this._isDemo) return 45;
    const e = this._config?.humidifier_entity;
    if (!v(e)) return null;
    const t = N(e, this.hass, "humidity");
    return t === null ? null : t;
  }
  /** Device on/off, `null` when it cannot be read. */
  _powerOn() {
    if (this._powerLocal !== null) return this._powerLocal;
    if (this._isDemo) return !0;
    const e = this._config?.power_entity;
    if (!v(e)) return null;
    const t = C(e, this.hass);
    return t === null ? null : re(t);
  }
  /** Options the countdown select offers. */
  _countdownOptions() {
    if (this._isDemo)
      return [this._offOption(), "1 Stunde", "2 Stunden", "4 Stunden"];
    const e = this._config?.countdown_entity;
    if (!v(e)) return [];
    const t = this.hass?.states?.[e]?.attributes?.options;
    return Array.isArray(t) ? t.filter((r) => typeof r == "string") : [];
  }
  /** Current countdown option, `null` when it cannot be read. */
  _countdown() {
    if (this._countdownLocal !== null) return this._countdownLocal;
    if (this._isDemo) return this._offOption();
    const e = this._config?.countdown_entity;
    return v(e) ? C(e, this.hass) : null;
  }
  /** Child lock on/off, `null` when it cannot be read. */
  _lockOn() {
    if (this._lockLocal !== null) return this._lockLocal;
    if (this._isDemo) return !1;
    const e = this._config?.child_lock_entity;
    if (!v(e)) return null;
    const t = C(e, this.hass);
    return t === null ? null : re(t);
  }
  /** The active faults, in configured order. */
  _activeFaults() {
    const e = this._config?.faults ?? [];
    return this._isDemo ? [] : e.filter((t) => re(C(t.entity, this.hass)));
  }
  // =========================================================================
  // render
  // =========================================================================
  render() {
    const e = this._config;
    if (!e) return d;
    const t = this._humidity(), r = this._target(), i = this._powerOn(), o = this._targetRange(), n = this._activeFaults(), c = n.some((u) => (u.severity ?? "error") === "error"), l = i === !0 && t.kind === "value" && r !== null ? Math.round(t.value - r) : null, h = [
      e.location,
      `Ziel ${r === null ? "–" : `${Math.round(r)} %`}`
    ].filter((u) => typeof u == "string" && u.length > 0);
    return a`
      <ha-card>
        <div class="card">
          <div class="header">
            <div class="head-left">
              <span class="name">${e.name ?? Qt}</span>
              <div class="meta">${h.join(" · ")}</div>
            </div>
            <div class="badges">
              ${n.map((u) => this._renderFaultBadge(u))}
              ${this._renderLockBadge()}
              ${this._renderCountdownBadge()}
              ${c ? d : this._renderStatusBadge(i, t, r)}
            </div>
          </div>

          <div class="value-row">
            <div class="value-main">
              <span class="value-num">
                ${t.kind === "value" ? `${m(t.value)} %` : this._dash()}
              </span>
              <span class="value-label">Luftfeuchte</span>
            </div>
            ${l !== null && l > 0 ? a`<span class="value-over">${m(l)} % über Ziel</span>` : d}
          </div>

          ${this._renderBar(t, r, o)}
          ${this._renderChart(r)}

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
        </div>
        ${this._expanded ? a`<div class="overlay">${this._renderControls(o, r)}</div>` : d}
      </ha-card>
    `;
  }
  _dash() {
    return a`<span class="unavail">–</span>`;
  }
  _renderBadge(e, t) {
    return a`<span class="badge ${t}">
      <span class="badge-label">${e}</span>
    </span>`;
  }
  _renderFaultBadge(e) {
    const t = e.severity ?? "error";
    return this._renderBadge(
      e.name,
      t === "warning" ? "badge-warn" : "badge-error"
    );
  }
  /** "Max-Trocknen <Option>" in blue while the countdown is not off. */
  _renderCountdownBadge() {
    const e = this._countdown();
    if (e === null || this._isOffState(e)) return d;
    const t = rr(this._countdownDisplay(e), !1);
    return this._renderBadge(`Max-Trocknen ${t}`, "badge-info");
  }
  /** Child-lock indicator: a grey lock pill, only while the lock is on. */
  _renderLockBadge() {
    return this._lockOn() !== !0 ? d : a`<span
      class="badge badge-neutral badge-icon"
      title="Kindersicherung aktiv"
      aria-label="Kindersicherung aktiv"
    >
      <ha-icon icon="mdi:lock"></ha-icon>
    </span>`;
  }
  /**
   * "Läuft" (green, on and above target), "Bereit" (blue, on and at/below
   * target), "Aus" (grey, off). Omitted while an error fault is up (handled by
   * the caller) or while the power state is not readable.
   */
  _renderStatusBadge(e, t, r) {
    return e === null ? d : e === !1 ? this._renderBadge("Aus", "badge-neutral") : t.kind === "value" && r !== null && t.value > r ? this._renderBadge("Läuft", "badge-run") : this._renderBadge("Bereit", "badge-info");
  }
  /**
   * Horizontal bar over `target_min…target_max`, filled to the current humidity
   * and always blue (--primary-color), with a vertical target marker and a
   * scale line underneath. Unchanged by faults.
   */
  _renderBar(e, t, r) {
    const i = r.max - r.min, o = e.kind === "value" ? w((e.value - r.min) / i, 0, 1) * 100 : 0, n = t === null ? null : w((t - r.min) / i, 0, 1) * 100;
    return a`
      <div class="bar-wrap">
        <div class="bar">
          <div class="bar-fill" style="width:${o}%"></div>
          ${n === null ? d : a`<div class="bar-target" style="left:${n}%"></div>`}
        </div>
        <!-- Only the end values; the target reads from the meta line, and the
             vertical marker in the bar already shows where it sits. -->
        <div class="bar-scale">
          <span>${m(r.min)}</span>
          <span>${m(r.max)}</span>
        </div>
      </div>
    `;
  }
  // =========================================================================
  // chart
  // =========================================================================
  _observeChartSize(e) {
    typeof ResizeObserver > "u" || this._observedChart !== (e ?? void 0) && (this._resizeObserver?.disconnect(), this._observedChart = e ?? void 0, e && (this._resizeObserver ??= new ResizeObserver(() => this._measureChart()), this._resizeObserver.observe(e)));
  }
  _measureChart() {
    const e = this.renderRoot?.querySelector("#chart");
    if (!e) return;
    const t = e.clientWidth, r = e.clientHeight;
    t <= 0 || r <= 0 || Math.abs(t - this._chartW) <= tr && Math.abs(r - this._chartH) <= tr || (this._chartW = t, this._chartH = r);
  }
  _maybeStartHistory() {
    if (this._isDemo || this._historyStarted) return;
    const e = this._config?.humidity_entity;
    !this.hass?.callWS || !v(e) || (this._historyStarted = !0, this._fetchHistory(), this._historyTimer = window.setInterval(
      () => void this._fetchHistory(),
      bs
    ));
  }
  async _fetchHistory() {
    const e = this._config, t = this.hass, r = e?.humidity_entity;
    if (!e || !t?.callWS || !v(r)) return;
    const i = /* @__PURE__ */ new Date(), o = new Date(i.getTime() - this._historyHours() * 3600 * 1e3);
    try {
      const c = (await t.callWS({
        type: "history/history_during_period",
        start_time: o.toISOString(),
        end_time: i.toISOString(),
        entity_ids: [r],
        minimal_response: !0,
        no_attributes: !0,
        significant_changes_only: !1
      }))?.[r] ?? [], l = [];
      for (const h of c) {
        const u = h.s ?? h.state, p = h.lu ?? h.last_updated ?? h.last_changed;
        if (u == null || p === void 0) continue;
        const f = String(u).trim().toLowerCase();
        if (f === "unavailable" || f === "unknown" || f === "") continue;
        const _ = Number.parseFloat(String(u));
        Number.isFinite(_) && l.push({ t: p * 1e3, v: _ });
      }
      l.sort((h, u) => h.t - u.t), this._history = l;
    } catch (n) {
      console.warn("des-dehumidifier-card: Historie konnte nicht geladen werden", n);
    }
  }
  /** A plausible descending-then-steady 24-h trace for the editor preview. */
  _buildDemoHistory() {
    const e = this._historyHours(), t = Date.now(), r = 900 * 1e3, i = Math.round(e * 3600 * 1e3 / r), o = [];
    for (let n = 0; n <= i; n++) {
      const c = t - (i - n) * r, l = n / i, h = 62 - 10 * l, u = 3 * Math.sin(l * Math.PI * 4);
      o.push({ t: c, v: Math.round((h + u) * 10) / 10 });
    }
    return o;
  }
  /** y-axis bounds: data and target, rounded to 10 %, at least a 20 % span. */
  _yBounds(e) {
    const t = this._history.map((o) => o.v);
    if (e !== null && t.push(e), t.length === 0) return { lo: 40, hi: 60 };
    let r = Math.floor(Math.min(...t) / B) * B, i = Math.ceil(Math.max(...t) / B) * B;
    if (i - r < Ke) {
      const o = (r + i) / 2;
      r = Math.floor((o - Ke / 2) / B) * B, i = r + Ke;
    }
    return { lo: w(r, 0, 100), hi: w(i, 0, 100) };
  }
  _renderChart(e) {
    const t = this._chartW, r = this._chartH, i = t > 0 && r > 0 ? this._renderChartSvg(t, r, e) : d;
    return a`<div class="chart" id="chart">${i}</div>`;
  }
  _renderChartSvg(e, t, r) {
    const { top: i, right: o, bottom: n, left: c } = ws, l = Math.max(1, e - c - o), h = Math.max(1, t - i - n), { lo: u, hi: p } = this._yBounds(r), f = p - u || 1, _ = (S) => i + h * (1 - (S - u) / f), b = Date.now(), k = b - this._historyHours() * 3600 * 1e3, x = b - k || 1, R = (S) => c + l * w((S - k) / x, 0, 1), pt = [];
    for (let S = u; S <= p + 1e-3; S += B) {
      const I = _(S);
      pt.push(F`
        <line class="grid" x1=${c} y1=${I} x2=${c + l} y2=${I}></line>
        <text class="axis-label" x=${c - 8} y=${I + 3} text-anchor="end">${m(S)}</text>
      `);
    }
    const ze = [], _t = i + h + 13, Ne = 3600 * 1e3, kr = er * Ne, G = new Date(k);
    for (G.setMinutes(0, 0, 0); G.getTime() < k || G.getHours() % er !== 0; )
      G.setTime(G.getTime() + Ne);
    let gt = !0;
    for (let S = G.getTime(); S < b - 40 * Ne / 60; S += kr) {
      const I = gt ? "start" : "middle";
      gt = !1, ze.push(F`
        <text class="axis-label" x=${R(S)} y=${_t} text-anchor=${I}>${ys(new Date(S))}</text>
      `);
    }
    ze.push(F`
      <text class="axis-label" x=${c + l} y=${_t} text-anchor="end">jetzt</text>
    `);
    const ee = this._history.filter((S) => S.t >= k - x * 0.02);
    let Ie = "", He = "";
    if (ee.length > 0) {
      const S = ee.map((mt) => `${R(mt.t).toFixed(1)},${_(mt.v).toFixed(1)}`);
      Ie = `M${S.join(" L")}`;
      const I = R(ee[0].t).toFixed(1), $r = R(ee[ee.length - 1].t).toFixed(1), ft = (i + h).toFixed(1);
      He = `M${I},${ft} L${S.join(" L")} L${$r},${ft} Z`;
    }
    const Fe = r === null ? null : _(w(r, u, p));
    return F`
      <svg
        class="chart-svg"
        width=${e}
        height=${t}
        viewBox="0 0 ${e} ${t}"
        preserveAspectRatio="none"
        role="img"
        aria-label="Verlauf der Luftfeuchte"
      >
        ${pt}
        ${He ? F`<path class="area" d=${He}></path>` : d}
        ${Fe === null ? d : F`<line class="target-line" x1=${c} y1=${Fe} x2=${c + l} y2=${Fe}></line>`}
        ${Ie ? F`<path class="line" d=${Ie}></path>` : d}
        ${ze}
      </svg>
    `;
  }
  // =========================================================================
  // controls (expanded)
  // =========================================================================
  _renderControls(e, t) {
    const r = this._config;
    if (!r) return a``;
    const i = this._powerOn(), o = v(r.power_entity) && !Lt(r.power_entity), n = P(
      [
        { value: "on", label: "An" },
        { value: "off", label: "Aus" }
      ],
      i === null ? null : i ? "on" : "off",
      (x) => this._setPower(x === "on"),
      "Gerät",
      o
    ), c = v(r.humidifier_entity) && !Ct(r.humidifier_entity), l = this._countdownOptions(), h = this._countdown(), u = v(r.countdown_entity) && !["select", "input_select"].includes(A(r.countdown_entity)), p = l.length > 0 ? P(
      l.map((x) => ({
        value: x,
        label: rr(this._countdownDisplay(x), this._isOffState(x))
      })),
      h !== null && l.includes(h) ? h : null,
      (x) => this._setCountdown(x),
      "Max-Trocknen",
      u
    ) : null, f = typeof r.child_lock_entity == "string" && r.child_lock_entity.trim().length > 0, _ = this._lockOn(), b = v(r.child_lock_entity) && !X(r.child_lock_entity), k = P(
      [
        { value: "on", label: "An" },
        { value: "off", label: "Aus" }
      ],
      _ === null ? null : _ ? "on" : "off",
      (x) => this._setLock(x === "on"),
      "Kindersicherung",
      b
    );
    return a`
      <div class="controls">
        <div class="ctl-row">
          <span class="ctl-label">Gerät</span>
          <div class="ctl-control">${n}</div>
        </div>

        <div class="ctl-row">
          <span class="ctl-label ${c ? "disabled" : ""}">Zielfeuchte</span>
          <div class="ctl-control slider-control">
            <input
              class="slider"
              type="range"
              min=${e.min}
              max=${e.max}
              step=${e.step}
              .value=${String(t ?? e.min)}
              ?disabled=${c}
              aria-label="Zielfeuchte"
              @input=${this._onTargetInput}
              @change=${this._onTargetChange}
            />
            <span class="ctl-value">
              ${t === null ? this._dash() : `${m(Math.round(t))} %`}
            </span>
          </div>
        </div>

        ${p ? a`<div class="ctl-row">
              <span class="ctl-label">Max-Trocknen</span>
              <div class="ctl-control">${p}</div>
            </div>` : d}

        ${f ? a`<div class="ctl-row">
              <span class="ctl-label">Kindersicherung</span>
              <div class="ctl-control">${k}</div>
            </div>` : d}
      </div>
    `;
  }
  // =========================================================================
  // interaction
  // =========================================================================
  _toggleExpanded() {
    this._expanded = !this._expanded, this._expanded ? this._closer.activate() : this._closer.deactivate();
  }
  _collapse() {
    this._expanded && (this._expanded = !1, this._closer.deactivate());
  }
  _onKeydown(e) {
    (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this._toggleExpanded());
  }
  _holdOptimistic(e, t) {
    this._clearSettle(e), this._settleTimers.set(
      e,
      window.setTimeout(() => {
        this._settleTimers.delete(e), t();
      }, vs)
    );
  }
  _clearSettle(e) {
    const t = this._settleTimers.get(e);
    t !== void 0 && (window.clearTimeout(t), this._settleTimers.delete(e));
  }
  async _write(e, t) {
    try {
      await e;
    } catch (r) {
      t(), console.error("des-dehumidifier-card: Service-Call fehlgeschlagen", r);
    }
  }
  _setPower(e) {
    this._powerLocal = e;
    const t = this._config?.power_entity;
    Lt(t) && (this._holdOptimistic("power", () => {
      this._powerLocal = null;
    }), this._write(Xr(this.hass, t, e), () => {
      this._clearSettle("power"), this._powerLocal = null;
    }));
  }
  _setCountdown(e) {
    this._countdownLocal = e;
    const t = this._config?.countdown_entity;
    !v(t) || !["select", "input_select"].includes(A(t)) || (this._holdOptimistic("countdown", () => {
      this._countdownLocal = null;
    }), this._write(mr(this.hass, t, e), () => {
      this._clearSettle("countdown"), this._countdownLocal = null;
    }));
  }
  _setLock(e) {
    this._lockLocal = e;
    const t = this._config?.child_lock_entity;
    X(t) && (this._holdOptimistic("lock", () => {
      this._lockLocal = null;
    }), this._write(ce(this.hass, t, e), () => {
      this._clearSettle("lock"), this._lockLocal = null;
    }));
  }
  /** Dragging only moves the UI; the write happens on release (debounced). */
  _onTargetInput(e) {
    this._targetLocal = Ve(
      Number(e.target.value),
      this._targetRange()
    );
  }
  _onTargetChange(e) {
    const t = Ve(
      Number(e.target.value),
      this._targetRange()
    );
    this._targetLocal = t;
    const r = this._config?.humidifier_entity;
    Ct(r) && (this._writeTimer !== void 0 && window.clearTimeout(this._writeTimer), this._writeTimer = window.setTimeout(() => {
      this._writeTimer = void 0, this._holdOptimistic("target", () => {
        this._targetLocal = null;
      }), this._write(Jr(this.hass, r, t), () => {
        this._clearSettle("target"), this._targetLocal = null;
      });
    }, ms));
  }
};
Ce.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 },
  _expanded: { state: !0 },
  _targetLocal: { state: !0 },
  _powerLocal: { state: !0 },
  _countdownLocal: { state: !0 },
  _lockLocal: { state: !0 },
  _history: { state: !0 },
  _chartW: { state: !0 },
  _chartH: { state: !0 }
}, Ce.styles = [
  Q,
  J,
  ue,
  pe,
  L`
      :host {
        display: block;
        height: 100%;
      }

      ha-card {
        height: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        /* No overflow:hidden here - overlay.ts needs ha-card to keep
           overflow:visible so the expanded dropdown (top:100%) can hang below
           the card. The chart yields via its own min-height:0 + overflow:hidden,
           so the card never overflows in the first place. */
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

      /* Icon-only pill (child lock): tighter padding, small glyph. */
      .badge-icon {
        padding: 0 6px;
      }

      .badge-icon ha-icon {
        --mdc-icon-size: 14px;
        width: 14px;
        height: 14px;
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

      /* Takes the height left after header/value/bar and the chevron row.
         min-height:0 lets it yield rather than pushing the chevron past the
         bottom edge; the card is laid out at rows 5 so it stays tall enough. */
      .chart {
        flex: 1 1 auto;
        min-height: 0;
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
    `
];
let st = Ce;
const xs = L`
  .icon-btns {
    display: inline-flex;
    /* A real gap, not a negative margin: neighbours never overlap, so an
       active button's border stays fully visible. */
    gap: 3px;
    flex-shrink: 0;
  }

  .icon-btns button {
    box-sizing: border-box;
    width: 24px;
    height: 22px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    background: none;
    border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.28));
    border-radius: 5px;
    color: var(--secondary-text-color);
    cursor: pointer;
  }

  .icon-btns button:hover {
    color: var(--primary-text-color);
  }

  .icon-btns button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* Highlighted (e.g. the stop button while a cover is moving). */
  .icon-btns button.active {
    color: var(--primary-color, #03a9f4);
    border-color: var(--primary-color, #03a9f4);
  }

  .icon-btns button:focus-visible {
    outline: 2px solid var(--primary-color, #03a9f4);
    outline-offset: 1px;
  }

  .icon-btns ha-icon {
    --mdc-icon-size: 18px;
    width: 18px;
    height: 18px;
  }
`;
function ks(s, e, t) {
  return a`
    <div class="icon-btns" role="group" aria-label=${t ?? d}>
      ${s.map(
    (r) => a`
          <button
            type="button"
            class=${r.active ? "active" : ""}
            aria-label=${r.label}
            title=${r.label}
            ?disabled=${r.disabled}
            @click=${(i) => {
      i.stopPropagation(), e(r.value);
    }}
          >
            <ha-icon icon=${r.icon}></ha-icon>
          </button>
        `
  )}
    </div>
  `;
}
const $s = 12, ir = 3, Ss = 3, sr = "Rollläden", or = 6, Es = 300, As = 8e3, Ts = 100, qe = { entity: "cover.__demo_group__", position: 65 }, Ls = [
  {
    name: "Erdgeschoss",
    covers: [
      { entity: "cover.__demo_eg_flur__", name: "Flur", position: 100 },
      { entity: "cover.__demo_eg_wohnen__", name: "Wohnzimmer", position: 40 },
      { entity: "cover.__demo_eg_kueche__", name: "Küche", position: 0 }
    ]
  },
  {
    name: "Obergeschoss",
    covers: [
      { entity: "cover.__demo_og_bad__", name: "Bad", position: 65 },
      { entity: "cover.__demo_og_schlaf__", name: "Schlafzimmer", position: 0 },
      { entity: "cover.__demo_og_kind__", name: "Kinderzimmer", position: 100 }
    ]
  }
], Me = class Me extends M {
  constructor() {
    super(), this._closer = new _e(this, () => this._collapse()), this._writeTimers = /* @__PURE__ */ new Map(), this._settleTimers = /* @__PURE__ */ new Map(), this._expanded = !1, this._posLocal = {}, this._flashScene = null;
  }
  setConfig(e) {
    if (!e)
      throw new Error("des-cover-card: Konfiguration fehlt");
    if (e.scenes !== void 0) {
      if (!Array.isArray(e.scenes))
        throw new Error('des-cover-card: "scenes" muss eine Liste sein');
      if (e.scenes.length > or)
        throw new Error(`des-cover-card: höchstens ${or} "scenes"`);
      for (const t of e.scenes) {
        if (!t || !t.name)
          throw new Error('des-cover-card: jede Szene braucht "name"');
        if (typeof t.action?.service != "string")
          throw new Error(`des-cover-card: Szene "${t?.name}" braucht action.service`);
      }
    }
    if (e.sections !== void 0) {
      if (!Array.isArray(e.sections))
        throw new Error('des-cover-card: "sections" muss eine Liste sein');
      for (const t of e.sections) {
        if (!t || !t.name || !Array.isArray(t.covers))
          throw new Error('des-cover-card: jede Sektion braucht "name" und "covers"');
        for (const r of t.covers)
          if (!r || !r.entity || !r.name)
            throw new Error('des-cover-card: jeder Rollladen braucht "entity" und "name"');
      }
    }
    this._config = e, this._expanded = !1, this._posLocal = {};
  }
  getCardSize() {
    return ir;
  }
  getGridOptions() {
    return { columns: $s, rows: ir, min_rows: Ss };
  }
  static getStubConfig() {
    return { type: "custom:des-cover-card", name: sr };
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._closer.deactivate();
    for (const e of this._writeTimers.values()) window.clearTimeout(e);
    this._writeTimers.clear();
    for (const e of this._settleTimers.values()) window.clearTimeout(e);
    this._settleTimers.clear();
  }
  /** Drops optimistic positions the entity has meanwhile confirmed. */
  willUpdate() {
    if (this._isDemo) return;
    const e = Object.keys(this._posLocal);
    if (e.length === 0) return;
    let t = this._posLocal, r = !1;
    for (const i of e) {
      const o = N(i, this.hass, "current_position");
      o !== null && Math.round(w(o, 0, 100)) === this._posLocal[i] && (r || (t = { ...this._posLocal }, r = !0), delete t[i], this._clearSettle(i));
    }
    r && (this._posLocal = t);
  }
  updated() {
    this.toggleAttribute("expanded", this._expanded);
  }
  // =========================================================================
  // view model
  // =========================================================================
  get _isDemo() {
    const e = this._config;
    return !e?.group_entity && !(e?.sections && e.sections.length > 0);
  }
  /** Live position (local override wins), null when unreadable. */
  _livePosition(e) {
    const t = this._posLocal[e];
    if (t !== void 0) return t;
    const r = N(e, this.hass, "current_position");
    return r === null ? null : Math.round(w(r, 0, 100));
  }
  _coverView(e) {
    const t = this._livePosition(e.entity), r = C(e.entity, this.hass);
    return {
      entity: e.entity,
      name: e.name,
      position: t,
      state: r,
      readable: t !== null || r !== null
    };
  }
  _sectionViews() {
    return this._isDemo ? Ls.map((e) => ({
      name: e.name,
      covers: e.covers.map((t) => ({
        entity: t.entity,
        name: t.name,
        position: this._posLocal[t.entity] ?? t.position,
        state: null,
        readable: !0
      }))
    })) : (this._config?.sections ?? []).map((e) => ({
      name: e.name,
      covers: e.covers.map((t) => this._coverView(t))
    }));
  }
  _groupView() {
    if (this._isDemo)
      return {
        entity: qe.entity,
        name: "Haus",
        position: this._posLocal[qe.entity] ?? qe.position,
        state: null,
        readable: !0
      };
    const e = this._config?.group_entity;
    if (!v(e)) return null;
    const t = this._livePosition(e), r = C(e, this.hass);
    return {
      entity: e,
      name: "Haus",
      position: t,
      state: r,
      readable: t !== null || r !== null
    };
  }
  /** offen = 100, zu = 0, sonst teilweise; ohne Position nach state. */
  _counts(e) {
    let t = 0, r = 0, i = 0;
    for (const o of e)
      o.readable && (o.position !== null ? o.position >= 100 ? t++ : o.position <= 0 ? r++ : i++ : o.state === "open" ? t++ : o.state === "closed" ? r++ : i++);
    return { open: t, closed: r, partial: i };
  }
  _sceneAvailable(e) {
    const t = e.action?.target?.entity_id, r = Array.isArray(t) ? t[0] : t;
    return !this.hass || typeof r != "string" ? !0 : this.hass.states?.[r] !== void 0;
  }
  // =========================================================================
  // render
  // =========================================================================
  render() {
    const e = this._config;
    if (!e) return d;
    const t = this._sectionViews(), r = t.flatMap((l) => l.covers), i = this._counts(r), o = this._groupView(), n = e.scenes ?? [], c = `${i.open} offen · ${i.closed} zu · ${i.partial} teilweise`;
    return a`
      <ha-card>
        <div class="card">
          <div class="header">
            <span class="name">${e.name ?? sr}</span>
            <div class="meta">${c}</div>
          </div>

          ${o ? a`<div class="group-row">
                <span class="row-label group">Haus</span>
                ${this._renderPosControl(o)}
              </div>` : d}

          ${n.length > 0 ? a`<div class="tiles">
                ${n.map((l, h) => this._renderScene(l, h))}
              </div>` : d}

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
        </div>
        ${this._expanded ? a`<div class="overlay">${this._renderSections(t)}</div>` : d}
      </ha-card>
    `;
  }
  _dash() {
    return a`<span class="unavail">–</span>`;
  }
  _renderScene(e, t) {
    const r = this._sceneAvailable(e);
    return a`
      <button
        class="tile ${this._flashScene === t ? "flash" : ""}"
        ?disabled=${!r}
        title=${r ? d : "Nicht verfügbar"}
        @click=${() => this._onScene(e, t)}
      >
        ${e.icon ? a`<ha-icon icon=${e.icon}></ha-icon>` : d}
        <span class="tile-label">${e.name}</span>
      </button>
    `;
  }
  _renderSections(e) {
    return a`
      <div class="sections">
        ${e.map(
      (t) => a`
            <div class="section">
              <div class="section-title">${t.name}</div>
              ${t.covers.map((r) => this._renderCoverRow(r))}
            </div>
          `
    )}
      </div>
    `;
  }
  _renderCoverRow(e) {
    return a`
      <div class="cover-row ${e.readable ? "" : "dim"}">
        <span class="row-label cover">${e.name}</span>
        ${this._renderPosControl(e)}
      </div>
    `;
  }
  /** Position bar + percent + ▲ ■ ▼, shared by the group row and cover rows. */
  _renderPosControl(e) {
    const { entity: t, position: r, state: i, readable: o } = e, n = r ?? 0, c = i === "opening" || i === "closing";
    return a`
      <div class="pos" style="--fill:${n}%">
        <input
          class="pos-input"
          type="range"
          min="0"
          max="100"
          step="1"
          .value=${String(r ?? 0)}
          ?disabled=${!o}
          aria-label="Position ${e.name}"
          @input=${(l) => this._onPosInput(t, l)}
          @change=${(l) => this._onPosChange(t, l)}
        />
      </div>
      <span class="pos-pct">
        ${r === null ? this._dash() : `${m(r)} %`}
      </span>
      ${ks(
      [
        { value: "close", icon: "mdi:chevron-down", label: "Schließen", disabled: !o },
        {
          value: "stop",
          icon: "mdi:stop",
          label: "Stopp",
          active: c,
          disabled: !o
        },
        { value: "open", icon: "mdi:chevron-up", label: "Öffnen", disabled: !o }
      ],
      (l) => this._cover(t, l),
      `Rollladen ${e.name}`
    )}
    `;
  }
  // =========================================================================
  // interaction
  // =========================================================================
  _toggleExpanded() {
    this._expanded = !this._expanded, this._expanded ? this._closer.activate() : this._closer.deactivate();
  }
  _collapse() {
    this._expanded && (this._expanded = !1, this._closer.deactivate());
  }
  _onKeydown(e) {
    (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this._toggleExpanded());
  }
  _setPosLocal(e, t) {
    this._posLocal = { ...this._posLocal, [e]: w(Math.round(t), 0, 100) };
  }
  _clearPosLocal(e) {
    if (this._posLocal[e] === void 0) return;
    const t = { ...this._posLocal };
    delete t[e], this._posLocal = t;
  }
  /** Dragging only moves the UI; the write happens on release (debounced). */
  _onPosInput(e, t) {
    this._setPosLocal(e, Number(t.target.value));
  }
  _onPosChange(e, t) {
    const r = w(Math.round(Number(t.target.value)), 0, 100);
    if (this._setPosLocal(e, r), this._isDemo || !Ot(e)) return;
    const i = this._writeTimers.get(e);
    i !== void 0 && window.clearTimeout(i), this._writeTimers.set(
      e,
      window.setTimeout(() => {
        this._writeTimers.delete(e), this._holdOptimistic(e, () => this._clearPosLocal(e)), this._write(ei(this.hass, e, r), () => {
          this._clearSettle(e), this._clearPosLocal(e);
        });
      }, Es)
    );
  }
  _cover(e, t) {
    this._isDemo || !Ot(e) || this._write(Qr(this.hass, e, t), () => {
    });
  }
  _onScene(e, t) {
    this._flashScene = t, window.setTimeout(() => {
      this._flashScene === t && (this._flashScene = null);
    }, Ts), this._write(vr(this.hass, e.action), () => {
    });
  }
  _holdOptimistic(e, t) {
    this._clearSettle(e), this._settleTimers.set(
      e,
      window.setTimeout(() => {
        this._settleTimers.delete(e), t();
      }, As)
    );
  }
  _clearSettle(e) {
    const t = this._settleTimers.get(e);
    t !== void 0 && (window.clearTimeout(t), this._settleTimers.delete(e));
  }
  async _write(e, t) {
    try {
      await e;
    } catch (r) {
      t(), console.error("des-cover-card: Service-Call fehlgeschlagen", r);
    }
  }
};
Me.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 },
  _expanded: { state: !0 },
  _posLocal: { state: !0 },
  _flashScene: { state: !0 }
}, Me.styles = [
  Q,
  ue,
  pe,
  xs,
  L`
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
        flex: 0 0 auto;
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 8px;
      }

      .name {
        font-size: 15px;
        font-weight: 500;
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .meta {
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        flex-shrink: 0;
      }

      .unavail {
        color: var(--secondary-text-color);
        opacity: 0.7;
      }

      /* --- group row / cover row --- */

      .group-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 12px;
      }

      .row-label {
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        flex-shrink: 0;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .row-label.group {
        width: 44px;
        color: var(--primary-text-color);
      }

      .row-label.cover {
        width: 112px;
        color: var(--primary-text-color);
      }

      /* --- position bar --- */

      .pos {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
      }

      .pos-input {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        min-width: 0;
        height: 14px;
        background: none;
        cursor: pointer;
      }

      .pos-input:disabled {
        opacity: 0.35;
        cursor: not-allowed;
      }

      /* Webkit: the fill is painted into the track from the --fill percentage. */
      .pos-input::-webkit-slider-runnable-track {
        height: 6px;
        border-radius: 3px;
        background: linear-gradient(
          to right,
          var(--primary-color, #03a9f4) var(--fill, 0%),
          var(--divider-color, rgba(127, 127, 127, 0.3)) var(--fill, 0%)
        );
      }

      .pos-input::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--primary-color, #03a9f4);
        border: 2px solid var(--card-background-color, #fff);
        margin-top: -4px;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
      }

      /* Firefox: track + progress do the fill, thumb is the knob. */
      .pos-input::-moz-range-track {
        height: 6px;
        border-radius: 3px;
        background: var(--divider-color, rgba(127, 127, 127, 0.3));
      }

      .pos-input::-moz-range-progress {
        height: 6px;
        border-radius: 3px;
        background: var(--primary-color, #03a9f4);
      }

      .pos-input::-moz-range-thumb {
        width: 14px;
        height: 14px;
        border: 2px solid var(--card-background-color, #fff);
        border-radius: 50%;
        background: var(--primary-color, #03a9f4);
      }

      .pos-input:focus-visible {
        outline: 2px solid var(--primary-color, #03a9f4);
        outline-offset: 2px;
        border-radius: 3px;
      }

      .pos-pct {
        min-width: 34px;
        text-align: right;
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        flex-shrink: 0;
      }

      /* The ▼ ■ ▲ buttons come from the shared icon-buttons module. */

      /* --- scene tiles --- */

      .tiles {
        display: flex;
        gap: 6px;
        margin-top: 12px;
      }

      .tile {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 3px;
        padding: 8px 4px;
        background: none;
        border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.28));
        border-radius: 5px;
        color: var(--secondary-text-color);
        cursor: pointer;
        font-family: inherit;
        transition: background 0.1s ease-out;
      }

      .tile:hover {
        color: var(--primary-text-color);
      }

      .tile:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .tile.flash {
        background: rgba(3, 169, 244, 0.12);
        background: color-mix(in srgb, var(--primary-color, #03a9f4) 12%, transparent);
      }

      .tile:focus-visible {
        outline: 2px solid var(--primary-color, #03a9f4);
        outline-offset: -2px;
      }

      .tile ha-icon {
        --mdc-icon-size: 20px;
        width: 20px;
        height: 20px;
      }

      .tile-label {
        font-size: 11px;
        line-height: 1.1;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }

      /* --- expanded sections --- */

      .sections {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .section-title {
        font-size: 11px;
        color: var(--secondary-text-color);
        letter-spacing: 0.04em;
        margin-bottom: 2px;
      }

      .cover-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 0;
        border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.18));
      }

      .cover-row.dim {
        opacity: 0.5;
      }
    `
];
let ot = Me;
const Cs = 12, nr = 3, Ms = 2, Os = "Licht", Ps = 300, Rs = 8e3, Ds = [
  { entity: "light.__demo_spots__", name: "Spots", icon: "mdi:track-light", kind: "dim", on: !0, bright: 70 },
  {
    entity: "switch.__demo_essen__",
    name: "Essen",
    icon: "mdi:vanity-light",
    kind: "switch",
    on: !1,
    on_label: "Ambiente"
  },
  { entity: "switch.__demo_couch__", name: "Couch", icon: "mdi:ceiling-light", kind: "switch", on: !0 }
], Oe = class Oe extends M {
  constructor() {
    super(), this._writeTimers = /* @__PURE__ */ new Map(), this._settleTimers = /* @__PURE__ */ new Map(), this._onLocal = {}, this._brightLocal = {};
  }
  setConfig(e) {
    if (!e)
      throw new Error("des-light-card: Konfiguration fehlt");
    if (e.items !== void 0) {
      if (!Array.isArray(e.items))
        throw new Error('des-light-card: "items" muss eine Liste sein');
      for (const t of e.items) {
        if (!t || !t.entity || !t.name)
          throw new Error('des-light-card: jedes Item braucht "entity" und "name"');
        if (t.kind !== void 0 && t.kind !== "switch" && t.kind !== "dim")
          throw new Error('des-light-card: "kind" muss "switch" oder "dim" sein');
      }
    }
    this._config = e, this._onLocal = {}, this._brightLocal = {};
  }
  getCardSize() {
    return nr;
  }
  getGridOptions() {
    return { columns: Cs, rows: nr, min_rows: Ms };
  }
  static getStubConfig() {
    return { type: "custom:des-light-card", name: "Wohnzimmer" };
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    for (const e of this._writeTimers.values()) window.clearTimeout(e);
    this._writeTimers.clear();
    for (const e of this._settleTimers.values()) window.clearTimeout(e);
    this._settleTimers.clear();
  }
  /** Drops optimistic values the entity has confirmed. */
  willUpdate() {
    if (!this._isDemo) {
      if (Object.keys(this._onLocal).length > 0) {
        let e = this._onLocal, t = !1;
        for (const [r, i] of Object.entries(this._onLocal)) {
          const o = C(r, this.hass);
          o !== null && o.toLowerCase() === "on" === i && (t || (e = { ...this._onLocal }, t = !0), delete e[r], this._clearSettle(`on:${r}`));
        }
        t && (this._onLocal = e);
      }
      if (Object.keys(this._brightLocal).length > 0) {
        let e = this._brightLocal, t = !1;
        for (const [r, i] of Object.entries(this._brightLocal)) {
          const o = this._entityBrightness(r);
          o !== null && o === i && (t || (e = { ...this._brightLocal }, t = !0), delete e[r], this._clearSettle(`bright:${r}`));
        }
        t && (this._brightLocal = e);
      }
    }
  }
  // =========================================================================
  // view model
  // =========================================================================
  get _isDemo() {
    return !this._config?.items || this._config.items.length === 0;
  }
  /** On/off from the entity (local override wins), null when unreadable. */
  _on(e) {
    const t = this._onLocal[e];
    if (t !== void 0) return t;
    const r = C(e, this.hass);
    return r === null ? null : r.toLowerCase() === "on";
  }
  /** Brightness 0-100 from the entity's `brightness` (0-255), null if absent. */
  _entityBrightness(e) {
    const t = N(e, this.hass, "brightness");
    return t === null ? null : Math.round(w(t, 0, 255) / 255 * 100);
  }
  _bright(e) {
    const t = this._brightLocal[e];
    return t !== void 0 ? t : this._entityBrightness(e);
  }
  _views() {
    return this._isDemo ? Ds.map((e) => ({
      entity: e.entity,
      name: e.name,
      icon: e.icon,
      kind: e.kind,
      on_label: e.on_label,
      on: this._onLocal[e.entity] ?? e.on,
      bright: e.kind === "dim" ? this._brightLocal[e.entity] ?? e.bright ?? 0 : null
    })) : (this._config?.items ?? []).map((e) => {
      const t = e.kind === "dim" ? "dim" : "switch";
      return {
        entity: e.entity,
        name: e.name,
        icon: e.icon,
        kind: t,
        on_action: e.on_action,
        on_label: e.on_label,
        on: this._on(e.entity),
        bright: t === "dim" ? this._bright(e.entity) : null
      };
    });
  }
  // =========================================================================
  // render
  // =========================================================================
  render() {
    const e = this._config;
    if (!e) return d;
    const t = this._views(), r = t.length, i = t.filter((o) => o.on === !0).length;
    return a`
      <ha-card>
        <div class="card">
          <div class="header">
            <span class="name">${e.name ?? Os}</span>
            <div class="meta">${i} von ${r} an</div>
          </div>
          <div class="items">${t.map((o) => this._renderRow(o))}</div>
        </div>
      </ha-card>
    `;
  }
  _renderRow(e) {
    const { entity: t, on: r } = e, i = this._isDemo || me(t) || X(t) || e.on_action !== void 0, o = !this._isDemo && !me(t);
    return a`
      <div class="row ${r === null ? "dim" : ""}">
        <ha-icon class="row-icon ${r === !0 ? "on" : ""}" icon=${e.icon ?? "mdi:lightbulb"}></ha-icon>
        <span class="row-name">${e.name}</span>
        <div class="row-mid">
          ${e.kind === "dim" ? this._renderBrightness(e, o) : e.on_label ? a`<span class="row-hint">${e.on_label}</span>` : d}
        </div>
        ${P(
      [
        { value: "on", label: "An" },
        { value: "off", label: "Aus" }
      ],
      r === null ? null : r ? "on" : "off",
      (n) => n === "on" ? this._turnOn(e) : this._turnOff(e),
      e.name,
      !i
    )}
      </div>
    `;
  }
  _renderBrightness(e, t) {
    const r = e.bright;
    return a`
      <div class="bright" style="--fill:${r ?? 0}%">
        <input
          class="bright-input"
          type="range"
          min="0"
          max="100"
          step="1"
          .value=${String(r ?? 0)}
          ?disabled=${t}
          aria-label="Helligkeit ${e.name}"
          @input=${(o) => this._onBrightInput(e.entity, o)}
          @change=${(o) => this._onBrightChange(e.entity, o)}
        />
      </div>
      <span class="bright-pct">${r === null ? a`<span class="unavail">–</span>` : `${m(r)} %`}</span>
    `;
  }
  // =========================================================================
  // interaction
  // =========================================================================
  _turnOn(e) {
    if (this._setOnLocal(e.entity, !0), !this._isDemo) {
      if (e.on_action) {
        this._write(
          vr(this.hass, e.on_action),
          () => this._clearOnLocal(e.entity)
        ), this._holdOn(e.entity);
        return;
      }
      this._writeOnOff(e.entity, !0);
    }
  }
  _turnOff(e) {
    this._setOnLocal(e.entity, !1), !this._isDemo && this._writeOnOff(e.entity, !1);
  }
  _writeOnOff(e, t) {
    const r = me(e) ? Pt(this.hass, e, t) : X(e) ? ce(this.hass, e, t) : null;
    if (!r) {
      this._clearOnLocal(e);
      return;
    }
    this._holdOn(e), this._write(r, () => {
      this._clearSettle(`on:${e}`), this._clearOnLocal(e);
    });
  }
  _holdOn(e) {
    this._holdOptimistic(`on:${e}`, () => this._clearOnLocal(e));
  }
  _onBrightInput(e, t) {
    this._setBrightLocal(e, Number(t.target.value));
  }
  _onBrightChange(e, t) {
    const r = w(Math.round(Number(t.target.value)), 0, 100);
    if (this._setBrightLocal(e, r), this._setOnLocal(e, r > 0), this._isDemo || !me(e)) return;
    const i = this._writeTimers.get(e);
    i !== void 0 && window.clearTimeout(i), this._writeTimers.set(
      e,
      window.setTimeout(() => {
        this._writeTimers.delete(e), this._holdOptimistic(`bright:${e}`, () => this._clearBrightLocal(e)), this._write(
          Pt(this.hass, e, !0, { brightness_pct: r }),
          () => {
            this._clearSettle(`bright:${e}`), this._clearBrightLocal(e);
          }
        );
      }, Ps)
    );
  }
  _setOnLocal(e, t) {
    this._onLocal = { ...this._onLocal, [e]: t };
  }
  _clearOnLocal(e) {
    if (this._onLocal[e] === void 0) return;
    const t = { ...this._onLocal };
    delete t[e], this._onLocal = t;
  }
  _setBrightLocal(e, t) {
    this._brightLocal = { ...this._brightLocal, [e]: w(Math.round(t), 0, 100) };
  }
  _clearBrightLocal(e) {
    if (this._brightLocal[e] === void 0) return;
    const t = { ...this._brightLocal };
    delete t[e], this._brightLocal = t;
  }
  _holdOptimistic(e, t) {
    this._clearSettle(e), this._settleTimers.set(
      e,
      window.setTimeout(() => {
        this._settleTimers.delete(e), t();
      }, Rs)
    );
  }
  _clearSettle(e) {
    const t = this._settleTimers.get(e);
    t !== void 0 && (window.clearTimeout(t), this._settleTimers.delete(e));
  }
  async _write(e, t) {
    try {
      await e;
    } catch (r) {
      t(), console.error("des-light-card: Service-Call fehlgeschlagen", r);
    }
  }
};
Oe.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 },
  _onLocal: { state: !0 },
  _brightLocal: { state: !0 }
}, Oe.styles = [
  Q,
  J,
  L`
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

      .header {
        flex: 0 0 auto;
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 8px;
      }

      .name {
        font-size: 15px;
        font-weight: 500;
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .meta {
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        flex-shrink: 0;
      }

      .unavail {
        color: var(--secondary-text-color);
        opacity: 0.7;
      }

      .items {
        margin-top: 6px;
      }

      .row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 0;
        border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.18));
      }

      .row.dim {
        opacity: 0.5;
      }

      .row-icon {
        --mdc-icon-size: 18px;
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        color: var(--secondary-text-color);
      }

      .row-icon.on {
        color: var(--primary-color, #03a9f4);
      }

      .row-name {
        width: 64px;
        flex-shrink: 0;
        font-size: 13px;
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .row-mid {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .row-hint {
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* --- brightness bar (same look as the cover position bar) --- */

      .bright {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
      }

      .bright-input {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        min-width: 0;
        height: 14px;
        background: none;
        cursor: pointer;
      }

      .bright-input:disabled {
        opacity: 0.35;
        cursor: not-allowed;
      }

      .bright-input::-webkit-slider-runnable-track {
        height: 6px;
        border-radius: 3px;
        background: linear-gradient(
          to right,
          var(--primary-color, #03a9f4) var(--fill, 0%),
          var(--divider-color, rgba(127, 127, 127, 0.3)) var(--fill, 0%)
        );
      }

      .bright-input::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--primary-color, #03a9f4);
        border: 2px solid var(--card-background-color, #fff);
        margin-top: -4px;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
      }

      .bright-input::-moz-range-track {
        height: 6px;
        border-radius: 3px;
        background: var(--divider-color, rgba(127, 127, 127, 0.3));
      }

      .bright-input::-moz-range-progress {
        height: 6px;
        border-radius: 3px;
        background: var(--primary-color, #03a9f4);
      }

      .bright-input::-moz-range-thumb {
        width: 14px;
        height: 14px;
        border: 2px solid var(--card-background-color, #fff);
        border-radius: 50%;
        background: var(--primary-color, #03a9f4);
      }

      .bright-input:focus-visible {
        outline: 2px solid var(--primary-color, #03a9f4);
        outline-offset: 2px;
        border-radius: 3px;
      }

      .bright-pct {
        width: 32px;
        text-align: right;
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        flex-shrink: 0;
      }
    `
];
let nt = Oe;
const zs = "0.13.0", Ns = [
  {
    type: "des-storage-card",
    element: Je,
    name: "Daniels Speicherkarte",
    description: "Speicherkarte für Hausakkus (battery) und Wärmespeicher-Gruppen (thermal_group)."
  },
  {
    type: "des-inverter-card",
    element: Qe,
    name: "Daniels Wechselrichterkarte",
    description: "Wechselrichter-Übersicht: PV-Leistung, Strings und Phasen (Entities oder Demo-Werte)."
  },
  {
    type: "des-house-card",
    element: et,
    name: "Daniels Hauskarte",
    description: "Hausverbrauch und Stromherkunft: Solar, Speicher, Netz plus Tageswerte (Entities oder Demo-Werte)."
  },
  {
    type: "des-stats-card",
    element: tt,
    name: "Daniels Statistikkarte",
    description: "Energiestatistik je Zeitraum (Tag/Woche/Monat/Jahr): Verbrauch, Produktion, Import, Export, Laden, Entladen."
  },
  {
    type: "des-chart-card",
    element: it,
    name: "Daniels Chartkarte",
    description: "Kopfzeile mit Zeitraum-Umschalter und eingebettetem ApexCharts-Chart je Zeitraum."
  },
  {
    type: "des-dehumidifier-card",
    element: st,
    name: "Daniels Entfeuchterkarte",
    description: "Luftentfeuchter: Ist-Feuchte gegen Ziel, 24-h-Verlauf, Störungspillen und Bedienung (Entities oder Demo-Werte)."
  },
  {
    type: "des-cover-card",
    element: ot,
    name: "Daniels Rollladenkarte",
    description: "Rollläden: Gruppensteuerung, Szenen-Kacheln und Einzelrollläden nach Etage (Entities oder Demo-Werte)."
  },
  {
    type: "des-light-card",
    element: nt,
    name: "Daniels Lichtkarte",
    description: "Lichter je Raum: An/Aus, Helligkeit und Szenen je Zeile (Entities oder Demo-Werte)."
  }
];
window.customCards = window.customCards ?? [];
for (const s of Ns)
  customElements.get(s.type) || customElements.define(s.type, s.element), window.customCards.some((e) => e.type === s.type) || window.customCards.push({
    type: s.type,
    name: s.name,
    description: s.description,
    preview: !1
  });
console.info(
  `%c DANIELS-HOME-ASSISTANT-CARDS %c v${zs} `,
  "background:#03a9f4;color:#fff;font-weight:700;border-radius:3px 0 0 3px;padding:2px 4px",
  "background:#555;color:#fff;border-radius:0 3px 3px 0;padding:2px 4px"
);
export {
  it as DesChartCard,
  ot as DesCoverCard,
  st as DesDehumidifierCard,
  et as DesHouseCard,
  Qe as DesInverterCard,
  nt as DesLightCard,
  tt as DesStatsCard,
  Je as DesStorageCard
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const pt = globalThis, te = pt.ShadowRoot && (pt.ShadyCSS === void 0 || pt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ee = Symbol(), ce = /* @__PURE__ */ new WeakMap();
let Ge = class {
  constructor(t, e, r) {
    if (this._$cssResult$ = !0, r !== ee) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (te && t === void 0) {
      const r = e !== void 0 && e.length === 1;
      r && (t = ce.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && ce.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const or = (s) => new Ge(typeof s == "string" ? s : s + "", void 0, ee), L = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((r, i, n) => r + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + s[n + 1], s[0]);
  return new Ge(e, s, ee);
}, lr = (s, t) => {
  if (te) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const r = document.createElement("style"), i = pt.litNonce;
    i !== void 0 && r.setAttribute("nonce", i), r.textContent = e.cssText, s.appendChild(r);
  }
}, de = te ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const r of t.cssRules) e += r.cssText;
  return or(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: cr, defineProperty: dr, getOwnPropertyDescriptor: hr, getOwnPropertyNames: ur, getOwnPropertySymbols: pr, getPrototypeOf: _r } = Object, Et = globalThis, he = Et.trustedTypes, gr = he ? he.emptyScript : "", fr = Et.reactiveElementPolyfillSupport, J = (s, t) => s, jt = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? gr : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, Ke = (s, t) => !cr(s, t), ue = { attribute: !0, type: String, converter: jt, reflect: !1, useDefault: !1, hasChanged: Ke };
Symbol.metadata ??= Symbol("metadata"), Et.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let j = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = ue) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const r = Symbol(), i = this.getPropertyDescriptor(t, r, e);
      i !== void 0 && dr(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, r) {
    const { get: i, set: n } = hr(this.prototype, t) ?? { get() {
      return this[e];
    }, set(a) {
      this[e] = a;
    } };
    return { get: i, set(a) {
      const l = i?.call(this);
      n?.call(this, a), this.requestUpdate(t, l, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ue;
  }
  static _$Ei() {
    if (this.hasOwnProperty(J("elementProperties"))) return;
    const t = _r(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(J("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(J("properties"))) {
      const e = this.properties, r = [...ur(e), ...pr(e)];
      for (const i of r) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [r, i] of e) this.elementProperties.set(r, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, r] of this.elementProperties) {
      const i = this._$Eu(e, r);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const r = new Set(t.flat(1 / 0).reverse());
      for (const i of r) e.unshift(de(i));
    } else t !== void 0 && e.push(de(t));
    return e;
  }
  static _$Eu(t, e) {
    const r = e.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const r of e.keys()) this.hasOwnProperty(r) && (t.set(r, this[r]), delete this[r]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return lr(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, r) {
    this._$AK(t, r);
  }
  _$ET(t, e) {
    const r = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, r);
    if (i !== void 0 && r.reflect === !0) {
      const n = (r.converter?.toAttribute !== void 0 ? r.converter : jt).toAttribute(e, r.type);
      this._$Em = t, n == null ? this.removeAttribute(i) : this.setAttribute(i, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const r = this.constructor, i = r._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const n = r.getPropertyOptions(i), a = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : jt;
      this._$Em = i;
      const l = a.fromAttribute(e, n.type);
      this[i] = l ?? this._$Ej?.get(i) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, r, i = !1, n) {
    if (t !== void 0) {
      const a = this.constructor;
      if (i === !1 && (n = this[t]), r ??= a.getPropertyOptions(t), !((r.hasChanged ?? Ke)(n, e) || r.useDefault && r.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(a._$Eu(t, r)))) return;
      this.C(t, e, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: r, reflect: i, wrapped: n }, a) {
    r && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, a ?? e ?? this[t]), n !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || r || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [i, n] of this._$Ep) this[i] = n;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [i, n] of r) {
        const { wrapped: a } = n, l = this[i];
        a !== !0 || this._$AL.has(i) || l === void 0 || this.C(i, void 0, n, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((r) => r.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
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
j.elementStyles = [], j.shadowRootOptions = { mode: "open" }, j[J("elementProperties")] = /* @__PURE__ */ new Map(), j[J("finalized")] = /* @__PURE__ */ new Map(), fr?.({ ReactiveElement: j }), (Et.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const re = globalThis, pe = (s) => s, gt = re.trustedTypes, _e = gt ? gt.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, Ve = "$lit$", R = `lit$${Math.random().toFixed(9).slice(2)}$`, qe = "?" + R, mr = `<${qe}>`, U = document, tt = () => U.createComment(""), et = (s) => s === null || typeof s != "object" && typeof s != "function", ie = Array.isArray, vr = (s) => ie(s) || typeof s?.[Symbol.iterator] == "function", zt = `[ 	
\f\r]`, Y = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ge = /-->/g, fe = />/g, z = RegExp(`>|${zt}(?:([^\\s"'>=/]+)(${zt}*=${zt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), me = /'/g, ve = /"/g, Ye = /^(?:script|style|textarea|title)$/i, Ze = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), c = Ze(1), I = Ze(2), G = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), we = /* @__PURE__ */ new WeakMap(), W = U.createTreeWalker(U, 129);
function Xe(s, t) {
  if (!ie(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return _e !== void 0 ? _e.createHTML(t) : t;
}
const wr = (s, t) => {
  const e = s.length - 1, r = [];
  let i, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = Y;
  for (let l = 0; l < e; l++) {
    const o = s[l];
    let h, u, p = -1, _ = 0;
    for (; _ < o.length && (a.lastIndex = _, u = a.exec(o), u !== null); ) _ = a.lastIndex, a === Y ? u[1] === "!--" ? a = ge : u[1] !== void 0 ? a = fe : u[2] !== void 0 ? (Ye.test(u[2]) && (i = RegExp("</" + u[2], "g")), a = z) : u[3] !== void 0 && (a = z) : a === z ? u[0] === ">" ? (a = i ?? Y, p = -1) : u[1] === void 0 ? p = -2 : (p = a.lastIndex - u[2].length, h = u[1], a = u[3] === void 0 ? z : u[3] === '"' ? ve : me) : a === ve || a === me ? a = z : a === ge || a === fe ? a = Y : (a = z, i = void 0);
    const f = a === z && s[l + 1].startsWith("/>") ? " " : "";
    n += a === Y ? o + mr : p >= 0 ? (r.push(h), o.slice(0, p) + Ve + o.slice(p) + R + f) : o + R + (p === -2 ? l : f);
  }
  return [Xe(s, n + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class rt {
  constructor({ strings: t, _$litType$: e }, r) {
    let i;
    this.parts = [];
    let n = 0, a = 0;
    const l = t.length - 1, o = this.parts, [h, u] = wr(t, e);
    if (this.el = rt.createElement(h, r), W.currentNode = this.el.content, e === 2 || e === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (i = W.nextNode()) !== null && o.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const p of i.getAttributeNames()) if (p.endsWith(Ve)) {
          const _ = u[a++], f = i.getAttribute(p).split(R), v = /([.?@])?(.*)/.exec(_);
          o.push({ type: 1, index: n, name: v[2], strings: f, ctor: v[1] === "." ? br : v[1] === "?" ? xr : v[1] === "@" ? kr : St }), i.removeAttribute(p);
        } else p.startsWith(R) && (o.push({ type: 6, index: n }), i.removeAttribute(p));
        if (Ye.test(i.tagName)) {
          const p = i.textContent.split(R), _ = p.length - 1;
          if (_ > 0) {
            i.textContent = gt ? gt.emptyScript : "";
            for (let f = 0; f < _; f++) i.append(p[f], tt()), W.nextNode(), o.push({ type: 2, index: ++n });
            i.append(p[_], tt());
          }
        }
      } else if (i.nodeType === 8) if (i.data === qe) o.push({ type: 2, index: n });
      else {
        let p = -1;
        for (; (p = i.data.indexOf(R, p + 1)) !== -1; ) o.push({ type: 7, index: n }), p += R.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const r = U.createElement("template");
    return r.innerHTML = t, r;
  }
}
function K(s, t, e = s, r) {
  if (t === G) return t;
  let i = r !== void 0 ? e._$Co?.[r] : e._$Cl;
  const n = et(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== n && (i?._$AO?.(!1), n === void 0 ? i = void 0 : (i = new n(s), i._$AT(s, e, r)), r !== void 0 ? (e._$Co ??= [])[r] = i : e._$Cl = i), i !== void 0 && (t = K(s, i._$AS(s, t.values), i, r)), t;
}
class yr {
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
    const { el: { content: e }, parts: r } = this._$AD, i = (t?.creationScope ?? U).importNode(e, !0);
    W.currentNode = i;
    let n = W.nextNode(), a = 0, l = 0, o = r[0];
    for (; o !== void 0; ) {
      if (a === o.index) {
        let h;
        o.type === 2 ? h = new st(n, n.nextSibling, this, t) : o.type === 1 ? h = new o.ctor(n, o.name, o.strings, this, t) : o.type === 6 && (h = new $r(n, this, t)), this._$AV.push(h), o = r[++l];
      }
      a !== o?.index && (n = W.nextNode(), a++);
    }
    return W.currentNode = U, i;
  }
  p(t) {
    let e = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, e), e += r.strings.length - 2) : r._$AI(t[e])), e++;
  }
}
class st {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, r, i) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = r, this.options = i, this._$Cv = i?.isConnected ?? !0;
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
    t = K(this, t, e), et(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== G && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : vr(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && et(this._$AH) ? this._$AA.nextSibling.data = t : this.T(U.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: r } = t, i = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = rt.createElement(Xe(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === i) this._$AH.p(e);
    else {
      const n = new yr(i, this), a = n.u(this.options);
      n.p(e), this.T(a), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = we.get(t.strings);
    return e === void 0 && we.set(t.strings, e = new rt(t)), e;
  }
  k(t) {
    ie(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let r, i = 0;
    for (const n of t) i === e.length ? e.push(r = new st(this.O(tt()), this.O(tt()), this, this.options)) : r = e[i], r._$AI(n), i++;
    i < e.length && (this._$AR(r && r._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const r = pe(t).nextSibling;
      pe(t).remove(), t = r;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class St {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, r, i, n) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = n, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = d;
  }
  _$AI(t, e = this, r, i) {
    const n = this.strings;
    let a = !1;
    if (n === void 0) t = K(this, t, e, 0), a = !et(t) || t !== this._$AH && t !== G, a && (this._$AH = t);
    else {
      const l = t;
      let o, h;
      for (t = n[0], o = 0; o < n.length - 1; o++) h = K(this, l[r + o], e, o), h === G && (h = this._$AH[o]), a ||= !et(h) || h !== this._$AH[o], h === d ? t = d : t !== d && (t += (h ?? "") + n[o + 1]), this._$AH[o] = h;
    }
    a && !i && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class br extends St {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class xr extends St {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class kr extends St {
  constructor(t, e, r, i, n) {
    super(t, e, r, i, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = K(this, t, e, 0) ?? d) === G) return;
    const r = this._$AH, i = t === d && r !== d || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, n = t !== d && (r === d || i);
    i && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class $r {
  constructor(t, e, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    K(this, t);
  }
}
const Er = re.litHtmlPolyfillSupport;
Er?.(rt, st), (re.litHtmlVersions ??= []).push("3.3.3");
const Sr = (s, t, e) => {
  const r = e?.renderBefore ?? t;
  let i = r._$litPart$;
  if (i === void 0) {
    const n = e?.renderBefore ?? null;
    r._$litPart$ = i = new st(t.insertBefore(tt(), n), n, void 0, e ?? {});
  }
  return i._$AI(s), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const se = globalThis;
class M extends j {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Sr(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return G;
  }
}
M._$litElement$ = !0, M.finalized = !0, se.litElementHydrateSupport?.({ LitElement: M });
const Ar = se.litElementPolyfillSupport;
Ar?.({ LitElement: M });
(se.litElementVersions ??= []).push("4.2.2");
const At = "de-DE";
function m(s) {
  return new Intl.NumberFormat(At, { maximumFractionDigits: 0 }).format(s);
}
function Tr(s) {
  return new Intl.NumberFormat(At, {
    maximumFractionDigits: 0,
    signDisplay: "always"
  }).format(s);
}
function lt(s) {
  const t = Math.round(s), e = m(Math.abs(t));
  return t > 0 ? `+${e}` : t < 0 ? `−${e}` : e;
}
function Cr(s, t = 1) {
  return new Intl.NumberFormat(At, {
    minimumFractionDigits: 0,
    maximumFractionDigits: t
  }).format(s);
}
function b(s, t = 1) {
  return new Intl.NumberFormat(At, {
    minimumFractionDigits: t,
    maximumFractionDigits: t
  }).format(s);
}
function x(s, t, e) {
  return Math.min(e, Math.max(t, s));
}
const Lr = /* @__PURE__ */ new Set(["unavailable", "unknown", "none", "null", ""]), Mr = /^[a-z][a-z0-9_]*\.[a-z0-9_]+$/;
function y(s) {
  return typeof s == "string" && Mr.test(s);
}
const Gt = { kind: "unset" }, X = { kind: "unavailable" };
function O(s, t) {
  const e = t?.states?.[s];
  if (!e || typeof e.state != "string") return null;
  const r = e.state.trim();
  return Lr.has(r.toLowerCase()) ? null : r;
}
function Q(s, t, e) {
  const r = t?.states?.[s]?.attributes?.[e];
  if (typeof r == "number") return Number.isFinite(r) ? r : null;
  if (typeof r == "string") {
    const i = Number.parseFloat(r);
    return Number.isFinite(i) ? i : null;
  }
  return null;
}
function ne(s, t) {
  const e = t?.states?.[s]?.attributes?.unit_of_measurement;
  if (typeof e != "string") return null;
  const r = e.trim().toLowerCase();
  return r.length > 0 ? r : null;
}
function w(s, t) {
  if (s == null || typeof s == "boolean") return Gt;
  if (typeof s == "number")
    return Number.isFinite(s) ? { kind: "value", value: s } : X;
  if (y(s)) {
    const r = O(s, t);
    if (r === null) return X;
    const i = Number.parseFloat(r);
    return Number.isFinite(i) ? { kind: "value", value: i } : X;
  }
  const e = Number.parseFloat(s);
  return Number.isFinite(e) ? { kind: "value", value: e } : X;
}
function A(s, t) {
  if (s == null) return Gt;
  if (typeof s == "boolean") return { kind: "value", value: s ? "on" : "off" };
  if (typeof s == "number") return { kind: "value", value: String(s) };
  if (y(s)) {
    const r = O(s, t);
    return r === null ? X : { kind: "value", value: r };
  }
  const e = s.trim();
  return e.length > 0 ? { kind: "value", value: e } : Gt;
}
const Je = /* @__PURE__ */ new Set(["number", "input_number"]), nt = /* @__PURE__ */ new Set(["switch", "input_boolean"]), it = /* @__PURE__ */ new Set(["select", "input_select"]), Qe = /* @__PURE__ */ new Set(["fan", "switch", "input_boolean"]), Pr = /* @__PURE__ */ new Set(["on", "true", "1", "yes", "an", "ein"]);
function C(s) {
  const t = s.indexOf(".");
  return t === -1 ? "" : s.slice(0, t);
}
function V(s, t) {
  return typeof s == "string" && y(s) && t.has(C(s));
}
function ct(s) {
  return V(s, Je);
}
function ft(s) {
  return V(s, nt);
}
function ye(s) {
  return V(s, Qe);
}
function be(s) {
  return typeof s == "string" && y(s) && C(s) === "humidifier";
}
function tr(s) {
  if (!s || typeof s != "object") return !1;
  const t = s.entity;
  return V(t, it) || V(t, nt);
}
function at(s, t, e, r) {
  if (typeof s?.callService != "function")
    return Promise.reject(new Error("des-storage-card: hass.callService fehlt"));
  try {
    return Promise.resolve(s.callService(t, e, r));
  } catch (i) {
    return Promise.reject(i);
  }
}
function xe(s, t, e) {
  const r = C(t);
  return Je.has(r) ? at(s, r, "set_value", { entity_id: t, value: e }) : Promise.reject(
    new Error(`des-storage-card: ${t} ist keine number-Entität`)
  );
}
function mt(s, t, e) {
  const r = C(t);
  return nt.has(r) ? at(s, r, e ? "turn_on" : "turn_off", { entity_id: t }) : Promise.reject(
    new Error(`des-storage-card: ${t} ist kein Schalter`)
  );
}
function Or(s, t, e) {
  const r = C(t);
  return Qe.has(r) ? at(s, r, e ? "turn_on" : "turn_off", { entity_id: t }) : Promise.reject(
    new Error(`des-cards: ${t} kann nicht als Ein/Aus geschaltet werden`)
  );
}
function Rr(s, t, e) {
  return C(t) !== "humidifier" ? Promise.reject(
    new Error(`des-cards: ${t} ist keine humidifier-Entität`)
  ) : at(s, "humidifier", "set_humidity", {
    entity_id: t,
    humidity: e
  });
}
function er(s, t, e) {
  const r = C(t);
  return it.has(r) ? at(s, r, "select_option", { entity_id: t, option: e }) : Promise.reject(
    new Error(`des-storage-card: ${t} ist keine select-Entität`)
  );
}
function rr(s, t) {
  if (t === "off") return s.off_state;
  const e = t === "charge" ? s.charge_state : s.auto_state;
  return e !== void 0 ? e : V(s.entity, nt) ? t === "charge" ? "on" : "off" : void 0;
}
function Dr(s, t) {
  const e = rr(s, "charge");
  return e === void 0 ? !1 : e.trim().toLowerCase() === t.trim().toLowerCase();
}
function Nr(s, t) {
  const e = s.off_state;
  return e === void 0 ? !1 : e.trim().toLowerCase() === t.trim().toLowerCase();
}
function zr(s) {
  if (s === null || typeof s != "object")
    return '"charge_mode_control" muss ein Objekt mit "entity" sein';
  const { entity: t, charge_state: e, auto_state: r, off_state: i } = s;
  if (typeof t != "string" || t.length === 0)
    return '"charge_mode_control" braucht "entity"';
  if (!tr(s))
    return `"charge_mode_control.entity" muss select, input_select, switch oder input_boolean sein (ist: ${t})`;
  if (i !== void 0 && !it.has(C(t)))
    return `"charge_mode_control.off_state" gibt es nur für select/input_select (ist: ${t})`;
  if (it.has(C(t))) {
    const n = [
      e === void 0 ? "charge_state" : null,
      r === void 0 ? "auto_state" : null
    ].filter((a) => a !== null);
    if (n.length > 0)
      return `"charge_mode_control" braucht ${n.join(" und ")} für ${t}`;
  }
  return null;
}
function Ir(s, t, e) {
  const r = t.entity, i = C(r), n = rr(t, e);
  if (it.has(i)) {
    if (n === void 0) {
      const a = e === "charge" ? "charge_state" : e === "auto" ? "auto_state" : "off_state";
      return Promise.reject(
        new Error(
          `des-storage-card: charge_mode_control braucht ${a} für ${r}`
        )
      );
    }
    return er(s, r, n);
  }
  return nt.has(i) ? mt(s, r, Pr.has((n ?? "").toLowerCase())) : Promise.reject(
    new Error(`des-storage-card: ${r} wird als Lademodus nicht unterstützt`)
  );
}
const ot = L`
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
function N(s, t, e, r, i = !1) {
  return c`
    <div
      class="seg ${i || t === null ? "unknown" : ""}"
      role="group"
      aria-label=${r}
      title=${i ? "Nicht verfügbar" : t === null ? "Zustand nicht lesbar" : d}
    >
      ${s.map(
    ({ value: a, label: l }) => c`
          <button
            type="button"
            class=${t === a ? "active" : ""}
            aria-pressed=${t === a ? "true" : "false"}
            ?disabled=${i}
            @click=${(o) => {
      o.stopPropagation(), e(a);
    }}
          >
            ${l}
          </button>
        `
  )}
    </div>
  `;
}
const Tt = L`
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
`, Ct = L`
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
class Lt {
  constructor(t, e) {
    this._host = t, this._onClose = e, this._active = !1, this._onDocClick = (r) => {
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
const Hr = {
  battery: { coldAlert: 4, coldWarn: 8, hotWarn: 40, hotAlert: 50 },
  inverter: { coldAlert: null, coldWarn: null, hotWarn: 60, hotAlert: 75 }
};
function ke(s, t) {
  return typeof s == "number" && Number.isFinite(s) ? s : t;
}
function vt(s, t, e) {
  const r = Hr[t], i = ke(e?.warn, r.hotWarn), n = ke(e?.alert, r.hotAlert);
  return r.coldAlert !== null && s < r.coldAlert || s > n ? "alert" : r.coldWarn !== null && s < r.coldWarn || s > i ? "warn" : "neutral";
}
const ir = L`
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
function Kt(s, t) {
  return c`<span class="temp-pill ${t}">
    <span class="temp-pill-label">${s}</span>
  </span>`;
}
const sr = {
  charging: "Lädt",
  discharging: "Entlädt",
  idle: "Bereit",
  heating: "Heizt",
  off: "Aus"
}, It = { min: 10, max: 80, step: 5 }, Ht = { min: 50, max: 100, step: 5 }, Ft = { min: 100, max: 2400, step: 50 }, $e = 5, Fr = 12, Wr = 2, Ur = 1, Br = 20, jr = 1, Gr = 300, Kr = 6e4, Vr = 3e4, Ee = 5, Se = 10, Ae = 48, qr = 500, Yr = 8e3, Zr = /* @__PURE__ */ new Set([
  "not charging",
  "not discharging",
  "unknown",
  "unavailable",
  "none",
  "-",
  "--"
]), Xr = [
  { value: "charge", label: "Laden" },
  { value: "auto", label: "Auto" }
], Jr = [
  { value: "charge", label: "Laden" },
  { value: "auto", label: "Auto" },
  { value: "off", label: "Aus" }
], Qr = [
  { value: "on", label: "An" },
  { value: "auto", label: "Auto" },
  { value: "off", label: "Aus" }
], ti = {
  1: "on",
  2: "auto",
  3: "off"
}, ei = {
  on: 1,
  auto: 2,
  off: 3
};
function ri(s) {
  const t = s.trim().toLowerCase();
  return t === "standby" ? "idle" : t in sr ? t : null;
}
function ii(s) {
  const t = s.trim().toLowerCase();
  return t === "on" || t === "auto" || t === "off" ? t : "auto";
}
function dt(s, t) {
  const { min: e, max: r, step: i } = t;
  if (!(i > 0)) return x(s, e, r);
  const n = Math.round((s - e) / i), a = Number((e + n * i).toFixed(6));
  return x(a, e, r);
}
function si(s) {
  if (!Number.isFinite(s) || Number.isInteger(s)) return 0;
  const t = String(s), e = t.indexOf(".");
  return e === -1 ? 0 : Math.min(3, t.length - e - 1);
}
function Wt(s, t) {
  const e = si(t);
  return e === 0 ? m(s) : b(s, e);
}
function ni(s) {
  if (!Number.isFinite(s) || s <= 0) return null;
  if (s > Ae) return `> ${Ae} h`;
  const t = Math.round(s * 60 / Ee) * Ee;
  return t < Se ? `< ${Se} min` : `${Math.floor(t / 60)}h ${t % 60}m`;
}
const wt = class wt extends M {
  constructor() {
    super(), this._writeTimers = /* @__PURE__ */ new Map(), this._settleTimers = /* @__PURE__ */ new Map(), this._closer = new Lt(this, () => this._collapse()), this._powerAverage = null, this._averageDirection = 0, this._averageStartedAt = 0, this._averageUpdatedAt = 0, this._pendingDirection = 0, this._pendingSince = 0, this._expanded = !1, this._thresholdLocal = null, this._targetLocal = null, this._dischargeLocal = null, this._chargeModeLocal = null, this._backupSwitchLocal = null, this._itemModesLocal = [];
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
    if (t.variant === "battery" && t.charge_mode_control !== void 0) {
      const e = zr(t.charge_mode_control);
      if (e !== null) throw new Error(`des-storage-card: ${e}`);
    }
    if (t.variant === "thermal_group") {
      const e = t.items;
      if (!Array.isArray(e) || e.length === 0)
        throw new Error(
          'des-storage-card: "items" braucht mindestens einen Eintrag'
        );
      if (e.length > $e)
        throw new Error(
          `des-storage-card: "items" erlaubt höchstens ${$e} Einträge`
        );
      if (e.some((r) => !r || !r.name))
        throw new Error('des-storage-card: jeder Eintrag in "items" braucht "name"');
      for (const r of e)
        if (r.mode_entity !== void 0 && !ct(r.mode_entity))
          throw new Error(
            `des-storage-card: "mode_entity" muss eine number- oder input_number-Entität sein (ist: ${r.mode_entity})`
          );
      this._itemModesLocal = e.map(() => null);
    }
    this._config = t, this._expanded = !1, this._thresholdLocal = null, this._targetLocal = null, this._dischargeLocal = null, this._chargeModeLocal = null, this._backupSwitchLocal = null;
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    for (const t of this._writeTimers.values()) window.clearTimeout(t);
    this._writeTimers.clear();
    for (const t of this._settleTimers.values()) window.clearTimeout(t);
    this._settleTimers.clear(), this._closer.deactivate();
  }
  /** Keeps the `expanded` attribute in sync for the stacking rule. */
  updated() {
    this.toggleAttribute("expanded", this._expanded);
  }
  /** Drops an optimistic value that the entity never confirmed. */
  _holdOptimistic(t, e) {
    this._clearSettle(t), this._settleTimers.set(
      t,
      window.setTimeout(() => {
        this._settleTimers.delete(t), e();
      }, Yr)
    );
  }
  _clearSettle(t) {
    const e = this._settleTimers.get(t);
    e !== void 0 && (window.clearTimeout(e), this._settleTimers.delete(t));
  }
  /**
   * Drops an optimistic local value once the entity reports it back, so the
   * control follows the entity again (including changes made elsewhere).
   * Runs in `willUpdate` rather than `updated` so it costs no extra render.
   */
  willUpdate() {
    const t = this._config;
    if (!t) return;
    if (t.variant === "battery") {
      this._updatePowerAverage(t), this._thresholdLocal !== null && this._entityMatches(
        t.threshold_pct,
        this._thresholdLocal,
        this._rangeFor(t.threshold_pct, It)
      ) && (this._thresholdLocal = null, this._clearSettle("threshold")), this._targetLocal !== null && this._entityMatches(
        t.charge_target_pct,
        this._targetLocal,
        this._rangeFor(t.charge_target_pct, Ht)
      ) && (this._targetLocal = null, this._clearSettle("target")), this._dischargeLocal !== null && this._entityMatches(
        t.discharge_limit_entity,
        this._dischargeLocal,
        this._rangeFor(t.discharge_limit_entity, Ft)
      ) && (this._dischargeLocal = null, this._clearSettle("discharge"));
      const n = t.charge_mode_control;
      if (this._chargeModeLocal !== null && n?.entity) {
        const l = this._chargeModeFromEntity(n);
        l !== null && l === this._chargeModeLocal && (this._chargeModeLocal = null, this._clearSettle("chargeMode"));
      }
      const a = t.backup;
      if (this._backupSwitchLocal !== null && a && typeof a != "string" && a.switch_entity) {
        const l = A(a.switch_entity, this.hass);
        l.kind === "value" && l.value.trim().toLowerCase() === "on" === this._backupSwitchLocal && (this._backupSwitchLocal = null, this._clearSettle("backupSwitch"));
      }
      return;
    }
    const e = t.items ?? [];
    let r = !1;
    const i = [...this._itemModesLocal];
    e.forEach((n, a) => {
      const l = i[a];
      if (!l) return;
      const o = this._itemModeFromEntity(n);
      o === null || o !== l || (i[a] = null, r = !0, this._clearSettle(`item:${a}`));
    }), r && (this._itemModesLocal = i);
  }
  /** True when the slot is entity-bound and already carries exactly `local`. */
  _entityMatches(t, e, r) {
    if (typeof t != "string" || !y(t)) return !1;
    const i = w(t, this.hass);
    return i.kind === "value" && dt(i.value, r) === e;
  }
  /**
   * The bounds a slider actually uses.
   *
   * A bound `number`/`input_number` publishes its own min/max/step, and those
   * are authoritative - writing a value outside them would just be rejected.
   * Each attribute falls back on its own, so a partially described entity
   * still yields a usable range.
   */
  _rangeFor(t, e) {
    if (!ct(t)) return e;
    const r = t, i = Q(r, this.hass, "min") ?? e.min, n = Q(r, this.hass, "max") ?? e.max, a = Q(r, this.hass, "step") ?? e.step;
    return !(i < n) || !(a > 0) ? e : { min: i, max: n, step: a };
  }
  getCardSize() {
    return this._config?.variant === "thermal_group" ? 1 + (this._config.items?.length ?? 0) : this._expanded ? 3 : 2;
  }
  /**
   * HA sections view: a third of the section wide, fixed height. A battery is
   * short; a thermal group grows with its item count (3 items → 4 rows).
   */
  getGridOptions() {
    const t = this._config?.variant === "thermal_group" ? Ur + (this._config.items?.length ?? 0) : Wr;
    return { columns: Fr, rows: t, min_rows: t };
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
    const t = this._config;
    if (!t) return d;
    const e = t.variant === "battery" && t.controls !== !1;
    return c`
      <ha-card>
        <div class="card">
          ${t.variant === "battery" ? this._renderBattery(t) : this._renderThermalGroup(t)}
        </div>
        ${e && this._expanded ? c`<div class="overlay">${this._renderBatteryControls(t)}</div>` : d}
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
  _power(t) {
    let e = w(t.power_w, this.hass);
    if (e.kind === "unset" && t.voltage_entity && t.current_entity) {
      const n = w(t.voltage_entity, this.hass), a = w(t.current_entity, this.hass);
      e = n.kind === "value" && a.kind === "value" ? { kind: "value", value: n.value * a.value } : { kind: "unavailable" };
    }
    if (e.kind !== "value") return e;
    let r = t.invert_power ? -e.value : e.value;
    const i = w(t.power_share, this.hass);
    return i.kind === "unavailable" ? { kind: "unavailable" } : (r *= i.kind === "value" ? i.value : jr, { kind: "value", value: r });
  }
  /** Absolute watts below which the battery reads as idle. */
  _idleThreshold(t) {
    const e = w(t.idle_threshold_w, this.hass);
    return e.kind === "value" && e.value >= 0 ? e.value : Br;
  }
  /** Configured status, else derived from the power sign. */
  _status(t, e) {
    const r = A(t.status, this.hass);
    if (r.kind === "value") {
      const i = ri(r.value);
      if (i !== null) return i;
    }
    if (e.kind === "value") {
      const i = this._idleThreshold(t);
      if (e.value <= -i) return "discharging";
      if (e.value >= i) return "charging";
    }
    return "idle";
  }
  /** `energy_kwh` if given, otherwise soc x capacity / 100. */
  _energy(t, e, r) {
    const i = w(t.energy_kwh, this.hass);
    return i.kind !== "unset" ? i : e.kind === "value" && r.kind === "value" ? { kind: "value", value: e.value * r.value / 100 } : e.kind === "unavailable" || r.kind === "unavailable" ? { kind: "unavailable" } : { kind: "unset" };
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
  _updatePowerAverage(t) {
    const e = this._power(t);
    if (e.kind !== "value") return;
    const r = this._idleThreshold(t), i = e.value >= r ? 1 : e.value <= -r ? -1 : 0;
    if (i === 0) {
      this._pendingDirection = 0;
      return;
    }
    const n = Date.now();
    if (this._powerAverage === null || this._averageDirection === 0) {
      this._commitAverage(i, e.value, n);
      return;
    }
    if (i === this._averageDirection) {
      this._pendingDirection = 0;
      const a = Math.max(0, (n - this._averageUpdatedAt) / 1e3);
      this._averageUpdatedAt = n;
      const l = 1 - Math.exp(-a / Gr);
      this._powerAverage += l * (e.value - this._powerAverage);
      return;
    }
    this._pendingDirection !== i && (this._pendingDirection = i, this._pendingSince = n), n - this._pendingSince >= Vr && this._commitAverage(i, e.value, n);
  }
  /** Starts a fresh mean in `direction`, resetting the warm-up window. */
  _commitAverage(t, e, r) {
    this._averageDirection = t, this._powerAverage = e, this._averageStartedAt = r, this._averageUpdatedAt = r, this._pendingDirection = 0;
  }
  /**
   * Remaining time.
   *
   * A configured entity wins and is shown as-is - the device knows better than
   * any estimate. Only when nothing is configured for the current direction
   * does the card work it out from state of charge, capacity and the smoothed
   * power.
   */
  _timeRemaining(t, e) {
    if (e.kind !== "value") return { text: null, state: "no-power" };
    if (Math.abs(e.value) < this._idleThreshold(t))
      return { text: null, state: "idle" };
    const r = e.value > 0;
    let i = t.time_remaining;
    if (i === void 0 && (i = r ? t.time_remaining_charging : t.time_remaining_discharging), i !== void 0) {
      const n = A(i, this.hass);
      return n.kind !== "value" ? { text: null, state: "device" } : Zr.has(n.value.trim().toLowerCase()) ? { text: null, state: "device" } : { text: n.value, state: "device" };
    }
    return this._estimateResult(t);
  }
  /**
   * Discharging: how long until the minimum state of charge.
   * Charging:    how long until the charge target.
   *
   * Uses the smoothed power and the mean's own (committed) direction - not the
   * momentary sign, so a tentative flip keeps showing the last estimate. Stays
   * silent until the mean has enough history to mean anything.
   */
  _estimateResult(t) {
    if (this._powerAverage === null) return { text: null, state: "no-data" };
    if (Date.now() - this._averageStartedAt < Kr)
      return { text: null, state: "warmup" };
    const e = Math.abs(this._powerAverage);
    if (e < this._idleThreshold(t)) return { text: null, state: "idle" };
    const r = w(t.soc, this.hass), i = w(t.capacity_kwh, this.hass);
    if (r.kind !== "value" || i.kind !== "value")
      return { text: null, state: "no-soc" };
    const n = this._averageDirection > 0, a = n ? this._chargeTarget(t) : this._threshold(t);
    if (a === null) return { text: null, state: "no-limit" };
    const l = n ? a - r.value : r.value - a;
    if (l <= 0) return { text: null, state: "below-min" };
    const o = ni(
      l / 100 * i.value / (e / 1e3)
    );
    return o === null ? { text: null, state: "out-of-range" } : { text: o, state: this._pendingDirection !== 0 ? "flip" : "ok" };
  }
  _backup(t) {
    const e = t.backup;
    if (!e || e === "none") return "none";
    if (typeof e == "string")
      return e === "active" || e === "ready" || e === "off" ? e : "none";
    const r = A(e.entity, this.hass);
    return r.kind !== "value" ? "none" : (e.active_states ?? []).some(
      (n) => n.trim().toLowerCase() === r.value.toLowerCase()
    ) ? "ready" : "off";
  }
  _threshold(t) {
    if (this._thresholdLocal !== null) return this._thresholdLocal;
    const e = w(t.threshold_pct, this.hass);
    return e.kind === "value" ? dt(e.value, this._rangeFor(t.threshold_pct, It)) : null;
  }
  _chargeTarget(t) {
    if (this._targetLocal !== null) return this._targetLocal;
    const e = w(t.charge_target_pct, this.hass);
    return e.kind === "value" ? dt(e.value, this._rangeFor(t.charge_target_pct, Ht)) : null;
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
  _dischargeLimit(t) {
    if (this._dischargeLocal !== null) return this._dischargeLocal;
    const e = w(t.discharge_limit_entity, this.hass);
    return e.kind === "value" ? dt(
      e.value,
      this._rangeFor(t.discharge_limit_entity, Ft)
    ) : null;
  }
  /**
   * `null` means "cannot say" - the control is bound to an entity the card
   * cannot read right now, so no segment is highlighted. Showing a confident
   * "Laden" for an entity that never answered is how a wrong entity id stayed
   * invisible before.
   */
  _chargeMode(t) {
    if (this._chargeModeLocal !== null) return this._chargeModeLocal;
    const e = t.charge_mode_control;
    if (e?.entity)
      return this._chargeModeFromEntity(e);
    const r = A(t.charge_mode, this.hass);
    return r.kind === "value" && r.value.trim().toLowerCase() === "charge" ? "charge" : "auto";
  }
  /**
   * The mode the control's entity currently reports, ignoring any local
   * override. `off` only when an `off_state` matches; `null` when the entity
   * cannot be read (so no segment is highlighted).
   */
  _chargeModeFromEntity(t) {
    const e = A(t.entity, this.hass);
    return e.kind !== "value" ? null : Nr(t, e.value) ? "off" : Dr(t, e.value) ? "charge" : "auto";
  }
  /**
   * Local click wins, then `mode_entity`, then a static `mode`, then the
   * switch entity's on/off state. `null` means no segment is highlighted -
   * `mode_entity` carrying something outside 1/2/3 is the only way there.
   */
  _itemMode(t, e) {
    const r = this._itemModesLocal[e];
    if (r) return r;
    if (t.mode_entity)
      return this._itemModeFromEntity(t);
    const i = A(t.mode, this.hass);
    return i.kind === "value" ? ii(i.value) : this._itemModeFromEntity(t) ?? "auto";
  }
  /**
   * The mode the entities currently report, ignoring any local override.
   * `null` when nothing readable says what the mode is.
   */
  _itemModeFromEntity(t) {
    if (t.mode_entity) {
      const e = A(t.mode_entity, this.hass);
      if (e.kind !== "value") return null;
      const r = Math.round(Number.parseFloat(e.value));
      return ti[r] ?? null;
    }
    if (t.switch_entity) {
      const e = A(t.switch_entity, this.hass);
      if (e.kind === "value")
        return e.value.trim().toLowerCase() === "on" ? "on" : "off";
    }
    return null;
  }
  // =========================================================================
  // variant: battery
  // =========================================================================
  _renderBattery(t) {
    const e = w(t.soc, this.hass), r = w(t.capacity_kwh, this.hass), i = this._power(t), n = this._energy(t, e, r), a = this._status(t, i), l = this._backup(t), o = this._timeRemaining(t, i), h = A(t.time_at, this.hass), u = [o.text, h.kind === "value" ? h.value : null].filter((_) => _ !== null).join(" · "), p = t.controls !== !1;
    return c`
      <div class="header">
        <div class="head-left">
          <span class="name">${t.name}</span>
        </div>
        <div class="badges">
          ${this._renderCapacityBadge(r)}
          ${this._renderTemperatureBadge(t)}
          ${l === "none" ? d : this._renderBackupBadge(l)}
          ${this._renderBadge(sr[a], `status-${a}`)}
        </div>
      </div>

      <div class="main">
        ${this._renderBatteryIcon(e)}
        <div class="readout">
          <span class="soc">
            ${e.kind === "value" ? `${m(e.value)} %` : this._dash()}
          </span>
          ${n.kind === "unset" ? d : c`<span class="energy">
                ${n.kind === "value" ? `${b(n.value)} kWh` : this._dash()}
              </span>`}
        </div>
        <div class="timing">
          ${i.kind === "unset" ? d : c`<div class=${this._powerClass(i, this._idleThreshold(t))}>
                ${i.kind === "value" ? this._formatPower(i.value) : this._dash()}
              </div>`}
          <!-- Always in the DOM so a missing estimate is inspectable via
               data-eta-state; hidden (no layout) while there is nothing to show. -->
          <div class="muted" data-eta-state=${o.state} ?hidden=${u.length === 0}>
            ${u}
          </div>
        </div>
      </div>

      ${p ? c`<div
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
  _renderBatteryControls(t) {
    const e = this._chargeMode(t), r = this._chargeTarget(t), i = this._threshold(t), n = this._rangeFor(t.charge_target_pct, Ht), a = this._rangeFor(t.threshold_pct, It), l = typeof t.discharge_limit_entity == "string" && t.discharge_limit_entity.trim().length > 0, o = l ? this._dischargeLimit(t) : null, h = this._rangeFor(t.discharge_limit_entity, Ft), u = t.charge_mode_control?.off_state, p = typeof u == "string" && u.trim().length > 0, _ = N(
      p ? Jr : Xr,
      e,
      (T) => this._setChargeMode(T),
      "Lademodus"
    ), f = t.packs ?? [], v = t.backup, k = v && typeof v != "string" ? v.switch_entity : void 0;
    return c`
      <div class="controls">
        ${p ? c`<div class="mode-row">${_}</div>` : d}
        <div class="ctl-main">
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
            ${r === null ? this._dash() : `${Wt(r, n.step)} %`}
          </span>

          <span class="ctl-label">min. SoC</span>
          <input
            class="slider"
            type="range"
            min=${a.min}
            max=${a.max}
            step=${a.step}
            .value=${String(i ?? a.min)}
            aria-label="Minimaler Ladestand"
            @input=${this._onThresholdInput}
            @change=${this._onThresholdChange}
          />
          <span class="ctl-value">
            ${i === null ? this._dash() : `${Wt(i, a.step)} %`}
          </span>

          ${l ? c`
                <span class="ctl-label">max. Entladen</span>
                <input
                  class="slider"
                  type="range"
                  min=${h.min}
                  max=${h.max}
                  step=${h.step}
                  .value=${String(o ?? h.min)}
                  aria-label="Maximale Entladeleistung"
                  @input=${this._onDischargeInput}
                  @change=${this._onDischargeChange}
                />
                <span class="ctl-value">
                  ${o === null ? this._dash() : `${Wt(o, h.step)} W`}
                </span>
              ` : d}
          </div>
          ${p ? d : _}
        </div>
        ${k ? this._renderBackupSwitchRow(t, k) : d}
        ${f.length > 0 ? c`<table class="packs">
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
                ${f.map(
      (T) => this._renderPack(T, this._tempOverride(t))
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
  _renderPack(t, e) {
    const r = w(t.soc, this.hass), i = w(t.capacity_kwh, this.hass), n = w(t.temp_c, this.hass), a = A(t.balance, this.hass), l = r.kind === "value" && i.kind === "value" ? r.value * i.value / 100 : null, o = n.kind === "value" ? vt(n.value, "battery", e) : "neutral";
    return c`
      <tr>
        <td class="pack-col-name">${t.name}</td>
        <td>
          ${i.kind === "value" ? `${b(i.value)} kWh` : this._dash()}
        </td>
        <td>${l !== null ? `${b(l)} kWh` : this._dash()}</td>
        <td>${r.kind === "value" ? `${m(r.value)} %` : this._dash()}</td>
        <td class="pack-temp ${o}">
          ${n.kind === "value" ? b(n.value) : this._dash()}
        </td>
        <td>${a.kind === "value" ? a.value : this._dash()}</td>
      </tr>
    `;
  }
  /** "Notstromsteckdose" row with a switch, under the sliders / pack rows. */
  _renderBackupSwitchRow(t, e) {
    const r = this._backupSwitchOn(t), i = r !== null;
    return c`
      <div class="switch-row">
        <span class="ctl-label ${i ? "" : "disabled"}">Notstromsteckdose</span>
        <ha-switch
          .checked=${r === !0}
          .disabled=${!i}
          aria-label="Notstromsteckdose"
          title=${i ? d : "Zustand nicht lesbar"}
          @change=${(n) => this._setBackupSwitch(
      e,
      n.target.checked
    )}
        ></ha-switch>
      </div>
    `;
  }
  /** Capacity as a neutral pill; omitted when not configured. */
  _renderCapacityBadge(t) {
    return t.kind === "unset" ? d : this._renderBadge(
      t.kind === "value" ? `${b(t.value)} kWh` : c`${this._dash()} kWh`,
      "badge-neutral"
    );
  }
  /** Per-card override of the battery profile's upper temperature thresholds. */
  _tempOverride(t) {
    return { warn: t.temp_warn_c, alert: t.temp_alert_c };
  }
  /** Battery temperature level under the shared `battery` profile. */
  _tempLevel(t, e) {
    return vt(e, "battery", this._tempOverride(t));
  }
  /** Temperature as the shared pill, colour-coded on the `battery` profile. */
  _renderTemperatureBadge(t) {
    const e = w(t.temp_c, this.hass);
    return e.kind === "unset" ? d : e.kind === "unavailable" ? Kt(c`${this._dash()} °C`, "neutral") : Kt(
      `${b(e.value)} °C`,
      this._tempLevel(t, e.value)
    );
  }
  /** Upright battery; the fill grows from the bottom. */
  _renderBatteryIcon(t) {
    const e = t.kind === "value" ? x(t.value, 0, 100) : 0, r = t.kind !== "value" ? "transparent" : e > 50 ? "var(--success-color, #2e7d32)" : e >= 20 ? "var(--warning-color, #ff9800)" : "var(--error-color, #d32f2f)", i = 6, n = 26, a = n * e / 100, l = i + (n - a);
    return c`
      <svg
        class="battery"
        viewBox="0 0 22 36"
        width="22"
        height="36"
        role="img"
        aria-label=${t.kind === "value" ? `Ladestand ${m(e)} Prozent` : "Ladestand unbekannt"}
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
  _renderThermalGroup(t) {
    const e = t.items ?? [], r = e.map((o) => w(o.power_w, this.hass)), i = e.map((o) => w(o.energy_kwh, this.hass)), n = this._sum(i), a = this._sum(r), l = r.filter(
      (o) => o.kind === "value" && o.value > 0
    ).length;
    return c`
      <div class="header">
        <div class="head-left">
          <span class="name">${t.name}</span>
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
            ${n === null ? this._dash() : `${b(n)} kWh`}
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
        ${e.map(
      (o, h) => this._renderItem(o, h, r[h], i[h])
    )}
      </div>
    `;
  }
  /** Sums the values that resolved; null when none of them did. */
  _sum(t) {
    const e = t.filter(
      (r) => r.kind === "value"
    );
    return e.length === 0 ? null : e.reduce((r, i) => r + i.value, 0);
  }
  /**
   * Status dot colour: only the `switch_entity` state counts (`on` → green),
   * never `power_w` or `mode_entity`. Missing/unavailable reads as off (grey).
   */
  _switchOn(t) {
    const e = A(t, this.hass);
    return e.kind === "value" && e.value.trim().toLowerCase() === "on";
  }
  _renderItem(t, e, r, i) {
    const n = r.kind === "value" && r.value > 0;
    return c`
      <div class="item">
        <div class="item-head">
          ${t.switch_entity ? c`<span
                class="dot ${this._switchOn(t.switch_entity) ? "dot-on" : ""}"
              ></span>` : d}
          <span class="item-name">${t.name}</span>
        </div>
        <span class="item-energy">
          ${i.kind === "value" ? `${b(i.value)} kWh` : i.kind === "unavailable" ? this._dash() : ""}
        </span>
        <span class=${n ? "item-power positive" : "item-power"}>
          ${r.kind === "value" ? this._formatPower(r.value) : r.kind === "unavailable" ? this._dash() : ""}
        </span>
        ${N(
      Qr,
      this._itemMode(t, e),
      (a) => this._setItemMode(e, a),
      `Modus ${t.name}`
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
  _renderBadge(t, e) {
    return c`<span class="badge ${e}">
      <span class="badge-label">${t}</span>
    </span>`;
  }
  _renderBackupBadge(t) {
    return t === "active" ? this._renderBadge("NOTSTROM AKTIV", "backup-active") : t === "off" ? this._renderBadge("Notstrom aus", "backup-off") : this._renderBadge("Notstrom bereit", "backup-ready");
  }
  /**
   * Battery only - the thermal group colours its own row.
   *
   * Inside the dead band the reading is muted rather than coloured: a few
   * watts of standby current are not a direction worth signalling.
   */
  _powerClass(t, e) {
    return t.kind !== "value" || Math.abs(t.value) < e ? "power neutral" : t.value < 0 ? "power negative" : "power positive";
  }
  _formatPower(t) {
    const e = Math.round(t);
    return `${e === 0 ? m(0) : Tr(e)} W`;
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
  _onKeydown(t) {
    (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this._toggleExpanded());
  }
  _setChargeMode(t) {
    this._chargeModeLocal = t;
    const e = this._config?.charge_mode_control;
    !e?.entity || !tr(e) || (this._holdOptimistic("chargeMode", () => {
      this._chargeModeLocal = null;
    }), this._write(Ir(this.hass, e, t), () => {
      this._clearSettle("chargeMode"), this._chargeModeLocal = null;
    }));
  }
  /** On/off of the emergency outlet; `null` when it cannot be read. */
  _backupSwitchOn(t) {
    if (this._backupSwitchLocal !== null) return this._backupSwitchLocal;
    const e = t.backup;
    if (!e || typeof e == "string" || !e.switch_entity) return null;
    const r = A(e.switch_entity, this.hass);
    return r.kind !== "value" ? null : r.value.trim().toLowerCase() === "on";
  }
  _setBackupSwitch(t, e) {
    this._backupSwitchLocal = e, ft(t) && (this._holdOptimistic("backupSwitch", () => {
      this._backupSwitchLocal = null;
    }), this._write(mt(this.hass, t, e), () => {
      this._clearSettle("backupSwitch"), this._backupSwitchLocal = null;
    }));
  }
  /** Dragging only moves the UI; the write happens on release. */
  _onTargetInput(t) {
    this._targetLocal = Number(t.target.value);
  }
  _onThresholdInput(t) {
    this._thresholdLocal = Number(t.target.value);
  }
  _onDischargeInput(t) {
    this._dischargeLocal = Number(t.target.value);
  }
  _onTargetChange(t) {
    const e = Number(t.target.value);
    this._targetLocal = e, this._scheduleNumberWrite("target", this._config?.charge_target_pct, e);
  }
  _onThresholdChange(t) {
    const e = Number(t.target.value);
    this._thresholdLocal = e, this._scheduleNumberWrite("threshold", this._config?.threshold_pct, e);
  }
  _onDischargeChange(t) {
    const e = Number(t.target.value);
    this._dischargeLocal = e, this._scheduleNumberWrite("discharge", this._config?.discharge_limit_entity, e);
  }
  /** Drops the optimistic local value of one slider. */
  _clearSliderLocal(t) {
    t === "threshold" ? this._thresholdLocal = null : t === "target" ? this._targetLocal = null : this._dischargeLocal = null;
  }
  _scheduleNumberWrite(t, e, r) {
    if (!ct(e)) return;
    const i = e, n = this._writeTimers.get(t);
    n !== void 0 && window.clearTimeout(n), this._writeTimers.set(
      t,
      window.setTimeout(() => {
        this._writeTimers.delete(t), this._holdOptimistic(t, () => this._clearSliderLocal(t)), this._write(xe(this.hass, i, r), () => {
          this._clearSettle(t), this._clearSliderLocal(t);
        });
      }, qr)
    );
  }
  _setItemMode(t, e) {
    const r = [...this._itemModesLocal];
    r[t] = e, this._itemModesLocal = r;
    const i = this._config?.items?.[t], n = () => {
      const l = [...this._itemModesLocal];
      l[t] = null, this._itemModesLocal = l;
    };
    if (i?.mode_entity) {
      if (!ct(i.mode_entity)) return;
      this._holdOptimistic(`item:${t}`, n), this._write(
        xe(this.hass, i.mode_entity, ei[e]),
        () => {
          this._clearSettle(`item:${t}`), n();
        }
      );
      return;
    }
    const a = i?.switch_entity;
    e === "auto" || !ft(a) || (this._holdOptimistic(`item:${t}`, n), this._write(mt(this.hass, a, e === "on"), () => {
      this._clearSettle(`item:${t}`), n();
    }));
  }
  /** Awaits a service call and runs `onFailure` if it rejects. */
  async _write(t, e) {
    try {
      await t;
    } catch (r) {
      e(), console.error("des-storage-card: Service-Call fehlgeschlagen", r);
    }
  }
};
wt.properties = {
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
}, wt.styles = [
  ot,
  Tt,
  Ct,
  ir,
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
let Vt = wt;
const Mt = L`
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
`, ai = /* @__PURE__ */ new Set([
  "normal",
  "alarm",
  "night"
]), oi = 12.5, li = 6.5, ci = 6, di = 0.5, hi = 500, ui = 40, Te = 4, pi = 12, _i = ["L1", "L2", "L3"], gi = {
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
function H(s) {
  return Array.isArray(s) && s.some(g);
}
function ht(s) {
  const t = s.filter((e) => e !== null);
  return t.length > 0 ? t.reduce((e, r) => e + r, 0) : null;
}
const fi = 2, mi = 6e4, vi = 2500, D = (s) => String(s).padStart(2, "0");
function wi(s) {
  const t = s.trim();
  if (t.length === 0) return null;
  const e = t.includes("T") ? t : t.replace(" ", "T"), r = new Date(e);
  return Number.isNaN(r.getTime()) ? null : r;
}
function yi(s) {
  return `${D(s.getDate())}.${D(s.getMonth() + 1)}.${s.getFullYear()} ${D(s.getHours())}:${D(s.getMinutes())}`;
}
function bi() {
  const s = /* @__PURE__ */ new Date();
  return `${s.getFullYear()}-${D(s.getMonth() + 1)}-${D(s.getDate())} ${D(s.getHours())}:${D(s.getMinutes())}:00`;
}
const yt = class yt extends M {
  constructor() {
    super(), this._closer = new Lt(this, () => this._collapse()), this._expanded = !1, this._clockTick = 0, this._timeSetDone = !1;
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
    const t = g(this._config?.time_entity);
    t && this._clockTimer === void 0 ? this._clockTimer = window.setInterval(() => {
      this._clockTick += 1;
    }, mi) : t || this._stopClockTimer();
  }
  _stopClockTimer() {
    this._clockTimer !== void 0 && (window.clearInterval(this._clockTimer), this._clockTimer = void 0);
  }
  _warnMinutes() {
    const t = this._config?.time_warn_minutes;
    return typeof t == "number" && Number.isFinite(t) && t >= 0 ? t : fi;
  }
  /** Signed deviation in minutes; positive means the inverter runs ahead. */
  _clockReading() {
    const t = this._config?.time_entity;
    if (!g(t)) return { kind: "off" };
    const e = this._text(t);
    if (e === null) return { kind: "unavailable" };
    const r = wi(e);
    return r === null ? { kind: "unavailable" } : { kind: "value", at: r, minutes: (r.getTime() - Date.now()) / 6e4 };
  }
  _clockOffBy(t) {
    return t.kind === "value" && Math.abs(t.minutes) >= this._warnMinutes();
  }
  /** Amber only past the threshold; grey when the entity cannot be read. */
  _renderClockPill(t) {
    return t.kind === "off" ? d : t.kind === "unavailable" ? c`<span class="pill">
        <span class="pill-label">Uhr ?</span>
      </span>` : this._clockOffBy(t) ? c`<span class="pill pill-alarm">
      <span class="pill-label">
        Uhr ${lt(t.minutes)} min
      </span>
    </span>` : d;
  }
  _renderClockRow(t) {
    if (t.kind === "off") return d;
    const e = t.kind === "value", r = e && this._clockOffBy(t);
    return c`
      <div class="clock-row">
        <span class="foot-label">Wechselrichter-Uhr</span>
        <span class="clock-value">
          ${e ? c`${yi(t.at)}
                <span class="clock-delta">
                  (Δ ${lt(t.minutes)} min)
                </span>` : c`<span class="unavail">–</span>`}
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
    const t = this._config?.time_entity;
    !g(t) || typeof this.hass?.callService != "function" || Promise.resolve(
      this.hass.callService("datetime", "set_value", {
        entity_id: t,
        datetime: bi()
      })
    ).then(() => {
      this._timeSetDone = !0, this._feedbackTimer !== void 0 && window.clearTimeout(this._feedbackTimer), this._feedbackTimer = window.setTimeout(() => {
        this._feedbackTimer = void 0, this._timeSetDone = !1;
      }, vi);
    }).catch((e) => {
      console.error("des-inverter-card: Zeit konnte nicht gesetzt werden", e);
    });
  }
  setConfig(t) {
    if (!t)
      throw new Error("des-inverter-card: Konfiguration fehlt");
    if (!t.name)
      throw new Error('des-inverter-card: "name" ist erforderlich');
    if (t.demo_state && !ai.has(t.demo_state))
      throw new Error(
        'des-inverter-card: "demo_state" muss "normal", "alarm" oder "night" sein'
      );
    this._config = t, this._expanded = !1;
  }
  getCardSize() {
    const t = this._blocks();
    let e = 2;
    return t.strings && (e += 1), this._expanded && (t.strings && (e += 1), t.phases && (e += 2), (t.dc || t.freq) && (e += 1)), e;
  }
  /** HA sections view: a third of the section, fixed height. */
  getGridOptions() {
    return { columns: pi, rows: Te, min_rows: Te };
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
    const t = this._config;
    return t ? g(t.pv_power_entity) || g(t.today_production_entity) || g(t.total_production_entity) || g(t.fault_entity) || g(t.alarm_entity) || g(t.device_state_entity) || g(t.inverter_temp_entity) || g(t.dc_temp_entity) || g(t.grid_frequency_entity) || g(t.pv1_power_entity) || g(t.pv1_voltage_entity) || g(t.pv1_current_entity) || g(t.pv2_power_entity) || g(t.pv2_voltage_entity) || g(t.pv2_current_entity) || H(t.grid_power_entities) || H(t.inverter_power_entities) || H(t.grid_voltage_entities) : !1;
  }
  /** Which optional blocks are present, from config alone (no hass needed). */
  _blocks() {
    const t = this._config;
    return !t || !this._entityMode ? {
      strings: !0,
      phases: !0,
      dc: t?.show_dc_temp !== !1,
      freq: !0
    } : {
      strings: g(t.pv1_power_entity) || g(t.pv1_voltage_entity) || g(t.pv1_current_entity) || g(t.pv2_power_entity) || g(t.pv2_voltage_entity) || g(t.pv2_current_entity),
      phases: H(t.grid_power_entities) || H(t.inverter_power_entities) || H(t.grid_voltage_entities),
      dc: t.show_dc_temp !== !1 && g(t.dc_temp_entity),
      freq: g(t.grid_frequency_entity)
    };
  }
  get _kwpTotal() {
    return this._config?.kwp_total ?? oi;
  }
  get _kwpString() {
    return [
      this._config?.kwp_pv1 ?? li,
      this._config?.kwp_pv2 ?? ci
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
  _num(t, e) {
    if (!g(t)) return null;
    const r = w(t, this.hass);
    if (r.kind !== "value") return null;
    let i = r.value;
    if (y(t)) {
      const n = ne(t, this.hass);
      e === "power" ? n === "kw" ? i *= 1e3 : n === "mw" && (i *= 1e6) : e === "energy" && (n === "wh" ? i /= 1e3 : n === "mwh" && (i *= 1e3));
    }
    return Number.isFinite(i) ? i : null;
  }
  /** A configured entity's text, or null when unset/unavailable. */
  _text(t) {
    if (!g(t)) return null;
    const e = A(t, this.hass);
    return e.kind === "value" ? e.value : null;
  }
  _view() {
    return this._entityMode ? this._entityView() : this._demoView();
  }
  /** Wraps the static demo dataset in the (non-null) view shape. */
  _demoView() {
    const t = this._config, e = gi[t.demo_state ?? "normal"];
    return {
      model: t.model ?? e.model,
      todayProduction: e.todayProduction,
      totalProduction: e.totalProduction,
      fault: e.fault,
      alarm: e.alarm,
      deviceState: e.deviceState,
      pvPower: e.pvPower,
      inverterTemp: e.inverterTemp,
      dcTemp: e.dcTemp,
      gridFrequency: e.gridFrequency,
      strings: [e.strings[0], e.strings[1]],
      phases: [e.phases[0], e.phases[1], e.phases[2]],
      imbalance: this._imbalance(e.strings[0].power, e.strings[1].power),
      exportW: this._exportW(e.phases.map((r) => r.grid)),
      showStrings: !0,
      showExport: !0,
      showPhases: !0,
      showDcItem: t.show_dc_temp !== !1,
      showFreqItem: !0
    };
  }
  _entityView() {
    const t = this._config, e = this._num(t.pv1_power_entity, "power"), r = this._num(t.pv2_power_entity, "power");
    let i;
    g(t.pv_power_entity) ? i = this._num(t.pv_power_entity, "power") : i = ht([e, r]);
    const n = [
      {
        power: e,
        voltage: this._num(t.pv1_voltage_entity, "plain"),
        current: this._num(t.pv1_current_entity, "plain")
      },
      {
        power: r,
        voltage: this._num(t.pv2_voltage_entity, "plain"),
        current: this._num(t.pv2_current_entity, "plain")
      }
    ], a = (o) => ({
      grid: this._num(t.grid_power_entities?.[o], "power"),
      inverter: this._num(t.inverter_power_entities?.[o], "power"),
      voltage: this._num(t.grid_voltage_entities?.[o], "plain")
    }), l = this._blocks();
    return {
      model: t.model ?? "",
      todayProduction: this._num(t.today_production_entity, "energy"),
      totalProduction: this._num(t.total_production_entity, "energy"),
      fault: this._text(t.fault_entity),
      alarm: this._text(t.alarm_entity),
      deviceState: this._text(t.device_state_entity) ?? "Normal",
      pvPower: i,
      inverterTemp: this._num(t.inverter_temp_entity, "plain"),
      dcTemp: this._num(t.dc_temp_entity, "plain"),
      gridFrequency: this._num(t.grid_frequency_entity, "plain"),
      strings: n,
      phases: [a(0), a(1), a(2)],
      imbalance: this._imbalance(e, r),
      exportW: this._exportW(
        (t.grid_power_entities ?? []).map((o) => this._num(o, "power"))
      ),
      showStrings: l.strings,
      showExport: H(t.grid_power_entities),
      showPhases: l.phases,
      showDcItem: l.dc,
      showFreqItem: l.freq
    };
  }
  /**
   * Grid feed-in as a positive number, from the raw grid-phase powers.
   * The grid meter follows the Deye sign (positive = draw, negative = feed-in);
   * `invert_grid` flips that first, exactly as the phases table does, then the
   * result is negated so feed-in comes out positive. `null` stays `null`.
   */
  _exportW(t) {
    const e = this._config?.invert_grid ? -1 : 1, r = ht(t);
    return r === null ? null : -(r * e);
  }
  /** Per-string amber flags; skipped when a power is missing (would be NaN). */
  _imbalance(t, e) {
    const r = this._config;
    if (r?.imbalance_warn === !1) return [!1, !1];
    if (t === null || e === null) return [!1, !1];
    const i = r?.imbalance_ratio ?? di, n = r?.imbalance_min_w ?? hi, a = (l, o) => l < i * o && o > n;
    return [a(t, e), a(e, t)];
  }
  // =========================================================================
  // render
  // =========================================================================
  render() {
    const t = this._config;
    if (!t) return d;
    const e = this._view(), r = e.showStrings || e.showPhases || this._hasFooter(e) || g(t.time_entity);
    return c`
      <ha-card>
        <div class="card">${this._renderCollapsed(e, r)}</div>
        ${this._expanded && r ? this._renderExpanded(e) : d}
      </ha-card>
    `;
  }
  _hasFooter(t) {
    return t.showDcItem || t.showFreqItem;
  }
  // --- collapsed (always visible) ------------------------------------------
  _renderCollapsed(t, e) {
    const r = this._config;
    return c`
      <div class="header">
        <div class="head-left">
          <span class="name">${r.name}</span>
          <span class="meta">${this._renderMeta(t)}</span>
        </div>
        <div class="pills">
          ${this._renderClockPill(this._clockReading())}
          ${this._renderTempPill(t)}
          ${this._renderPill(t)}
        </div>
      </div>

      ${this._renderPowerRow(t)}
      ${t.showStrings || t.showExport ? this._renderStringBars(t) : d}

      ${e ? c`<div
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
  _renderMeta(t) {
    const e = [];
    return t.model && e.push(c`${t.model}`), e.push(c`${this._unit(t.todayProduction, b, "kWh")} heute`), e.push(
      c`${this._unit(t.totalProduction, m, "kWh")} gesamt`
    ), c`${e.map((r, i) => i === 0 ? r : c` · ${r}`)}`;
  }
  /** fault beats alarm beats device state; "OK"/absent means no fault. */
  _renderPill(t) {
    const e = (l) => {
      if (l === null) return null;
      const o = l.trim();
      return o.length > 0 && o.toLowerCase() !== "ok" ? o : null;
    }, r = e(t.fault), i = e(t.alarm), [n, a] = r ? [`Fault: ${r}`, "pill-fault"] : i ? [`Alarm: ${i}`, "pill-alarm"] : [t.deviceState, "pill-ok"];
    return c`<span class="pill ${a}">
      <span class="pill-label">${n}</span>
    </span>`;
  }
  /** Per-card override of the `inverter` profile's upper temperature thresholds. */
  _tempOverride() {
    const t = this._config;
    return { warn: t?.temp_warn_c, alert: t?.temp_alert_c };
  }
  /**
   * Inverter (AC-board) temperature as the shared pill, left of the status pill.
   * Uses the `inverter` profile; omitted when there is no readable temperature.
   */
  _renderTempPill(t) {
    if (t.inverterTemp === null) return d;
    const e = vt(
      t.inverterTemp,
      "inverter",
      this._tempOverride()
    );
    return Kt(`${b(t.inverterTemp)} °C`, e);
  }
  _renderPowerRow(t) {
    const e = t.pvPower !== null && t.pvPower > 0, r = this._kwpTotal, i = t.pvPower !== null && r > 0 ? x(t.pvPower / (r * 1e3) * 100, 0, 999) : null;
    return c`
      <div class="power-row">
        <div class="pv">
          <span class="pv-value ${e ? "producing" : "idle"}">
            ${this._unit(t.pvPower, m, "W")}
          </span>
          ${i === null ? d : c`<span class="pv-share">
                ${m(i)} % von ${Cr(r)} kWp
              </span>`}
        </div>
      </div>
    `;
  }
  _renderStringBars(t) {
    const e = this._kwpString;
    return c`
      <div class="strings">
        ${t.showStrings ? t.strings.map((r, i) => {
      const n = (e[i] ?? 0) * 1e3, a = r.power !== null && n > 0 ? x(r.power / n * 100, 0, 100) : 0, l = t.imbalance[i];
      return c`
                <div class="string-row">
                  <span class="string-label">PV${i + 1}</span>
                  <div class="bar">
                    <div
                      class="bar-fill ${l ? "warn" : ""}"
                      style="width: ${a}%"
                    ></div>
                  </div>
                  <span class="string-power">
                    ${this._unit(r.power, m, "W")}
                  </span>
                </div>
              `;
    }) : d}
        ${t.showExport ? this._renderExportBar(t) : d}
      </div>
    `;
  }
  /**
   * Export row under the strings: same build (label, bar, value), but only
   * feed-in is shown. Below `EXPORT_MIN_W` (or while drawing) the bar is empty
   * and the value reads "0 W"; the bar is scaled against `kwp_total`, like the
   * string bars against their own kWp.
   */
  _renderExportBar(t) {
    const e = t.exportW, r = e !== null && e >= ui, i = this._kwpTotal * 1e3, n = r && i > 0 ? x(e / i * 100, 0, 100) : 0;
    return c`
      <div class="string-row">
        <span class="string-label">Export</span>
        <div class="bar">
          <div class="bar-fill export" style="width: ${n}%"></div>
        </div>
        <span class="string-power">
          ${e === null ? c`<span class="unavail">–</span>` : c`${m(r ? e : 0)} W`}
        </span>
      </div>
    `;
  }
  // --- expanded ------------------------------------------------------------
  _renderExpanded(t) {
    return c`
      <div class="overlay details">
        ${t.showStrings ? this._renderStringsTable(t) : d}
        ${t.showPhases ? this._renderPhasesTable(t) : d}
        ${this._hasFooter(t) ? this._renderFooter(t) : d}
        ${this._renderClockRow(this._clockReading())}
      </div>
    `;
  }
  // A. Strings — voltage / current per MPPT input.
  _renderStringsTable(t) {
    return c`
      <div class="grid strings-grid">
        <span class="col-head">Strings</span>
        <span class="col-head num">Spannung</span>
        <span class="col-head num">Strom</span>
        ${t.strings.map(
      (e, r) => c`
            <span class="row-label">PV${r + 1}</span>
            <span class="num">${this._unit(e.voltage, b, "V")}</span>
            <span class="num">${this._unit(e.current, b, "A")}</span>
          `
    )}
      </div>
    `;
  }
  // B. Phases — grid flow, inverter output, voltage per phase, plus a Σ row.
  _renderPhasesTable(t) {
    const e = this._config?.invert_grid ? -1 : 1, r = t.phases.map(
      (a) => a.grid === null ? null : a.grid * e
    ), i = ht(r), n = ht(t.phases.map((a) => a.inverter));
    return c`
      <div class="grid phases-grid">
        <span class="col-head">Phasen</span>
        <span class="col-head num">Netz</span>
        <span class="col-head num">WR-Ausgang</span>
        <span class="col-head num">Spannung</span>

        ${t.phases.map((a, l) => {
      const o = r[l];
      return c`
            <span class="row-label">${_i[l]}</span>
            <span class="num ${this._gridClass(o)}">
              ${this._unit(o, lt, "W")}
            </span>
            <span class="num">${this._unit(a.inverter, m, "W")}</span>
            <span class="num">${this._unit(a.voltage, b, "V")}</span>
          `;
    })}

        <span class="row-label sum">Σ</span>
        <span class="num sum ${this._gridClass(i)}">
          ${this._unit(i, lt, "W")}
        </span>
        <span class="num sum">${this._unit(n, m, "W")}</span>
        <span class="num sum muted">–</span>
      </div>
    `;
  }
  // C. Footer — DC temperature (optional) and grid frequency.
  _renderFooter(t) {
    return c`
      <div class="footer">
        ${t.showDcItem ? c`<div class="foot-item">
              <span class="foot-label">DC-Temperatur</span>
              ${this._renderDcTemp(t)}
            </div>` : d}
        ${t.showFreqItem ? c`<div class="foot-item">
              <span class="foot-label">Netzfrequenz</span>
              <span class="foot-value">
                ${this._unit(t.gridFrequency, (e) => b(e, 2), "Hz")}
              </span>
            </div>` : d}
      </div>
    `;
  }
  // =========================================================================
  // shared
  // =========================================================================
  /** Formatted "value unit", or a muted "–" when the value is missing. */
  _unit(t, e, r) {
    return t === null ? c`<span class="unavail">–</span>` : c`${e(t)} ${r}`;
  }
  /** negative = feed-in (green), positive = import (red), zero/null = muted. */
  _gridClass(t) {
    return t === null || t === 0 ? "muted" : t < 0 ? "grid-feed" : "grid-draw";
  }
  /** DC-side temperature in the footer, coloured on the `inverter` profile. */
  _renderDcTemp(t) {
    if (t.dcTemp === null)
      return c`<span class="foot-value"><span class="unavail">–</span></span>`;
    const e = vt(t.dcTemp, "inverter", this._tempOverride());
    return c`<span class="foot-value ${e}">
      ${b(t.dcTemp)} °C
    </span>`;
  }
  _toggleExpanded() {
    this._expanded = !this._expanded, this._expanded ? this._closer.activate() : this._closer.deactivate();
  }
  _collapse() {
    this._expanded && (this._expanded = !1, this._closer.deactivate());
  }
  _onKeydown(t) {
    (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this._toggleExpanded());
  }
};
yt.properties = {
  // Assigning `hass` is a reactive property write, so Home Assistant's state
  // updates re-render the card (same mechanism as the storage card).
  hass: { attribute: !1 },
  _config: { state: !0 },
  _expanded: { state: !0 },
  _clockTick: { state: !0 },
  _timeSetDone: { state: !0 }
}, yt.styles = [
  Tt,
  Ct,
  Mt,
  ir,
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
let qt = yt;
const xi = /* @__PURE__ */ new Set([
  "normal",
  "night",
  "export"
]), Ce = 4, ki = 4, $i = 12, Ei = "sensor.pv_helper_solar_direkt_leistung", Si = "sensor.pv_helper_speicher_leistung", Ai = "sensor.inverter_external_power", Le = "sensor.pv_helper_energie_solar_direkt", Me = "sensor.pv_helper_energie_entladen_gesamt", Pe = "sensor.pv_helper_energie_import_gesamt", Oe = "var(--success-color)", Re = "#378ADD", De = "#E24B4A", Ti = ["day", "week", "month", "year"], Ci = {
  day: "Tag",
  week: "Woche",
  month: "Monat",
  year: "Jahr"
}, Li = 180, Mi = 2, Pi = ["_apexChart", "apexChart", "_chart"], Oi = {
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
function S(s) {
  return typeof s == "string" && s.trim().length > 0;
}
function Ri(s) {
  return Array.isArray(s) && s.some(S);
}
const bt = class bt extends M {
  constructor() {
    super(), this._closer = new Lt(this, () => this._collapse()), this._mountToken = 0, this._awaitingApex = !1, this._expanded = !1, this._period = null;
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
    const t = this.renderRoot?.querySelector("#chart");
    this._observeChartSize(t), this._applyChartHeight(), this._syncChart();
  }
  setConfig(t) {
    if (!t)
      throw new Error("des-house-card: Konfiguration fehlt");
    if (!t.name)
      throw new Error('des-house-card: "name" ist erforderlich');
    if (t.demo_state && !xi.has(t.demo_state))
      throw new Error(
        'des-house-card: "demo_state" muss "normal", "night" oder "export" sein'
      );
    if (t.storage_positive && t.storage_positive !== "discharge" && t.storage_positive !== "charge")
      throw new Error(
        'des-house-card: "storage_positive" muss "discharge" oder "charge" sein'
      );
    this._config = t, this._expanded = !1, this._period = null, this._teardownChart();
  }
  getCardSize() {
    return Ce;
  }
  /** HA sections view: a third of the section; the chart grows into the rows. */
  getGridOptions() {
    return { columns: $i, rows: Ce, min_rows: ki };
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
    const t = this._config;
    return t ? S(t.pv_power_entity) || S(t.load_power_entity) || S(t.grid_power_entity) || Ri(t.storage_power_entities) || S(t.today_consumption_entity) || S(t.today_import_entity) || S(t.today_export_entity) || S(t.autarky_entity) || S(t.solar_power_entity) || S(t.storage_power_entity) || S(t.solar_energy_entity) || S(t.storage_energy_entity) || S(t.grid_energy_entity) : !1;
  }
  /**
   * A configured entity's numeric value, rescaled onto the card's base unit
   * (W for power, kWh for energy). `null` for an unset, unavailable or
   * non-numeric slot - all of which render as a muted "–".
   */
  _num(t, e) {
    if (!S(t)) return null;
    const r = w(t, this.hass);
    if (r.kind !== "value") return null;
    let i = r.value;
    if (y(t)) {
      const n = ne(t, this.hass);
      e === "power" ? n === "kw" ? i *= 1e3 : n === "mw" && (i *= 1e6) : e === "energy" && (n === "wh" ? i /= 1e3 : n === "mwh" && (i *= 1e3));
    }
    return Number.isFinite(i) ? i : null;
  }
  _rawInputs() {
    if (!this._entityMode)
      return Oi[this._config.demo_state ?? "normal"];
    const t = this._config;
    return {
      load: this._num(t.load_power_entity, "power"),
      gridRaw: this._num(t.grid_power_entity, "power"),
      storage: (t.storage_power_entities ?? []).map((e) => this._num(e, "power")),
      pvPower: this._num(t.pv_power_entity, "power"),
      todayConsumption: this._num(t.today_consumption_entity, "energy"),
      todayImport: this._num(t.today_import_entity, "energy"),
      todayExport: this._num(t.today_export_entity, "energy"),
      autarky: this._num(t.autarky_entity, "plain")
    };
  }
  _view() {
    const t = this._config, e = this._rawInputs(), r = t.invert_grid ? -1 : 1, n = (e.gridRaw === null ? null : e.gridRaw * r) ?? 0, a = Math.max(n, 0), l = Math.max(-n, 0), o = (t.storage_positive ?? "discharge") === "charge", h = e.storage.reduce((v, k) => k === null ? v : v + Math.max(o ? -k : k, 0), 0);
    let u = 0, p = 0, _ = 0, f;
    if (e.pvPower !== null) {
      const v = e.storage.reduce((T, $) => $ === null ? T : T + Math.max(o ? $ : -$, 0), 0);
      _ = Math.max(e.pvPower - l - v, 0), u = h, p = a;
      const k = _ + u + p;
      f = (T) => k > 0 ? x(T / k * 100, 0, 100) : 0;
    } else {
      const v = e.load !== null && e.load > 0 ? e.load : 0;
      v > 0 && (u = Math.min(h, v), p = Math.min(a, v - u), _ = Math.max(v - u - p, 0)), f = (k) => v > 0 ? x(k / v * 100, 0, 100) : 0;
    }
    return {
      load: e.load,
      solarShare: _,
      storageShare: u,
      gridShare: p,
      solarPct: f(_),
      storagePct: f(u),
      gridPct: f(p),
      todayConsumption: e.todayConsumption,
      todayImport: e.todayImport,
      todayExport: e.todayExport,
      autarky: this._autarky(e),
      hasToday: e.todayConsumption !== null || e.todayImport !== null || e.todayExport !== null
    };
  }
  /** `autarky_entity` wins; otherwise 1 − import / consumption, in whole %. */
  _autarky(t) {
    if (t.autarky !== null) return t.autarky;
    const { todayConsumption: e, todayImport: r } = t;
    return e === null || e <= 0 || r === null ? null : x((1 - r / e) * 100, 0, 100);
  }
  // =========================================================================
  // chart period model
  // =========================================================================
  _chartEntity(t, e) {
    return t ?? e;
  }
  /** Week/Month/Year need the three energy entities; day needs only power. */
  _energyPeriodsAvailable() {
    const t = this._config;
    return S(this._chartEntity(t?.solar_energy_entity, Le)) && S(this._chartEntity(t?.storage_energy_entity, Me)) && S(this._chartEntity(t?.grid_energy_entity, Pe));
  }
  _availablePeriods() {
    return this._energyPeriodsAvailable() ? [...Ti] : ["day"];
  }
  _effectivePeriod(t) {
    return this._period && t.includes(this._period) ? this._period : t.includes("day") ? "day" : t[0];
  }
  _setPeriod(t) {
    this._period = t;
  }
  _apexAvailable() {
    return customElements.get("apexcharts-card") !== void 0;
  }
  /** The full apexcharts-card config for one period, built from the sources. */
  _apexCardConfig(t) {
    const e = this._config, n = {
      chart: { height: this._chartHeight ?? Li, stacked: !0 },
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
        }[t] }
      }
    };
    return t === "day" ? {
      type: "custom:apexcharts-card",
      header: { show: !1 },
      graph_span: "24h",
      span: { start: "day" },
      stacked: !0,
      apex_config: n,
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
          entity: this._chartEntity(e?.solar_power_entity, Ei),
          name: "Solar",
          color: Oe
        },
        {
          entity: this._chartEntity(e?.storage_power_entity, Si),
          name: "Speicher",
          color: Re,
          transform: "return Math.max(0, x);"
        },
        {
          entity: this._chartEntity(e?.grid_power_entity, Ai),
          name: "Netz",
          color: De,
          transform: "return Math.max(0, x);"
        }
      ]
    } : {
      type: "custom:apexcharts-card",
      header: { show: !1 },
      graph_span: t === "week" ? "7d" : t === "month" ? "31d" : "366d",
      span: { start: t === "week" ? "isoWeek" : t === "month" ? "month" : "year" },
      stacked: !0,
      apex_config: n,
      all_series_config: {
        type: "column",
        extend_to: !1,
        statistics: { type: "change", period: t === "year" ? "month" : "day", align: "start" },
        unit: "kWh",
        float_precision: t === "year" ? 0 : 1,
        show: { legend_value: !1 }
      },
      series: [
        {
          entity: this._chartEntity(e?.solar_energy_entity, Le),
          name: "Solar",
          color: Oe
        },
        {
          entity: this._chartEntity(e?.storage_energy_entity, Me),
          name: "Speicher",
          color: Re
        },
        {
          entity: this._chartEntity(e?.grid_energy_entity, Pe),
          name: "Netz",
          color: De
        }
      ]
    };
  }
  // =========================================================================
  // render
  // =========================================================================
  render() {
    const t = this._config;
    if (!t) return d;
    const e = this._view();
    return c`
      <ha-card>
        <div class="card">${this._renderCollapsed(t, e)}</div>
        ${this._expanded && this._hasExpand(e) ? this._renderExpanded(e) : d}
      </ha-card>
    `;
  }
  /** Something to expand into: the chart (entity mode) and/or "Heute" values. */
  _hasExpand(t) {
    return this._entityMode || t.hasToday;
  }
  // --- collapsed (always visible) ------------------------------------------
  //
  // The collapsed body is the classic house readout: name + meta, the big
  // consumption figure, the mix bar and the Solar/Speicher/Netz legend rows.
  // The chart and its period switcher live only in the expanded dropdown, so
  // the card stays as compact (rows 4) as its neighbours.
  _renderCollapsed(t, e) {
    return c`
      <div class="header">
        <div class="head-left">
          <span class="name">${t.name}</span>
          <span class="meta">${this._renderMeta(e)}</span>
        </div>
      </div>

      ${this._renderPowerRow(e)}
      ${this._renderMixBar(e)}
      ${this._renderLegend(e)}

      ${this._hasExpand(e) ? c`<div
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
  _renderMeta(t) {
    return c`${this._unit(t.todayConsumption, b, "kWh")} heute ·
    ${this._unit(t.autarky, m, "%")} autark`;
  }
  _renderPowerRow(t) {
    return c`
      <div class="power-row">
        <div class="load">
          <span class="load-value">${this._unit(t.load, m, "W")}</span>
          <span class="load-label">Verbrauch</span>
        </div>
      </div>
    `;
  }
  /** Solar / Speicher / Netz with colour swatch, current W and share in %. */
  _renderLegend(t) {
    const e = [
      { cls: "solar", label: "Solar", power: t.solarShare, pct: t.solarPct },
      {
        cls: "storage",
        label: "Speicher",
        power: t.storageShare,
        pct: t.storagePct
      },
      { cls: "grid", label: "Netz", power: t.gridShare, pct: t.gridPct }
    ];
    return c`
      <div class="legend">
        ${e.map(
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
  /** The Tag/Woche/Monat/Jahr switcher, shown above the chart in the dropdown. */
  _renderPeriodSwitcher() {
    const t = this._availablePeriods(), e = this._effectivePeriod(t);
    return N(
      t.map((r) => ({ value: r, label: Ci[r] })),
      e,
      (r) => this._setPeriod(r),
      "Zeitraum"
    );
  }
  _renderMixBar(t) {
    return c`
      <div
        class="mix"
        role="img"
        aria-label="Stromherkunft: Solar ${m(t.solarPct)} %, Speicher
        ${m(t.storagePct)} %, Netz ${m(t.gridPct)} %"
      >
        <div class="mix-seg solar" style="width: ${t.solarPct}%"></div>
        <div class="mix-seg storage" style="width: ${t.storagePct}%"></div>
        <div class="mix-seg grid" style="width: ${t.gridPct}%"></div>
      </div>
    `;
  }
  // --- expanded dropdown: period switcher + chart + "Heute" ----------------
  _renderExpanded(t) {
    return c`
      <div class="overlay">
        ${this._entityMode ? c`
              <div class="chart-head">${this._renderPeriodSwitcher()}</div>
              ${this._apexAvailable() ? c`<div class="chart" id="chart"></div>` : c`<div class="hint">apexcharts-card nicht installiert</div>`}
            ` : d}
        ${t.hasToday ? c`<div class="today">
              ${this._todayRow("Verbrauch", t.todayConsumption, "")}
              ${this._todayRow("Netzbezug", t.todayImport, "draw")}
              ${this._todayRow("Einspeisung", t.todayExport, "feed")}
            </div>` : d}
      </div>
    `;
  }
  /** One "Heute" row, or nothing when its value is missing. */
  _todayRow(t, e, r) {
    return e === null ? d : c`
      <span class="today-label">${t}</span>
      <span class="today-value ${r}">${b(e)} kWh</span>
    `;
  }
  // =========================================================================
  // embedded chart lifecycle (mirrors des-chart-card)
  // =========================================================================
  _observeChartSize(t) {
    typeof ResizeObserver > "u" || this._observedChart !== (t ?? void 0) && (this._resizeObserver?.disconnect(), this._observedChart = t ?? void 0, t && (this._resizeObserver ??= new ResizeObserver(() => this._applyChartHeight()), this._resizeObserver.observe(t)));
  }
  _applyChartHeight() {
    const t = this.renderRoot?.querySelector("#chart");
    if (!t) return;
    const e = t.clientHeight;
    e <= 0 || this._chartHeight !== void 0 && Math.abs(e - this._chartHeight) <= Mi || (this._chartHeight = e, this._resizeApex(e));
  }
  _resizeApex(t) {
    const e = this._apexInstance();
    if (e)
      try {
        e.updateOptions({ chart: { height: t } }, !1, !1);
      } catch (r) {
        console.warn("des-house-card: Chart-Höhe konnte nicht gesetzt werden", r);
      }
  }
  _apexInstance() {
    const t = this._chartEl;
    if (t)
      for (const e of Pi) {
        const r = t[e];
        if (r && typeof r.updateOptions == "function")
          return r;
      }
  }
  _syncChart() {
    if (!this._entityMode) {
      this._teardownChart();
      return;
    }
    const t = this._effectivePeriod(this._availablePeriods()), e = this.renderRoot?.querySelector("#chart");
    if (!this._apexAvailable() || !e) {
      this._teardownChart();
      return;
    }
    if (this._chartEl && this._chartPeriod === t) {
      this._chartEl.isConnected || e.replaceChildren(this._chartEl), this._chartEl.hass = this.hass;
      return;
    }
    this._mountChart(e, t);
  }
  async _mountChart(t, e) {
    const r = ++this._mountToken;
    this._removeChartEl();
    const i = await this._getHelpers();
    if (!i || r !== this._mountToken) return;
    let n;
    try {
      n = i.createCardElement(this._apexCardConfig(e));
    } catch (a) {
      console.error("des-house-card: Chart konnte nicht erzeugt werden", a);
      return;
    }
    r === this._mountToken && (n.classList.add("embedded"), n.hass = this.hass, t.replaceChildren(n), this._chartEl = n, this._chartPeriod = e);
  }
  _getHelpers() {
    if (!this._helpersPromise) {
      const t = window.loadCardHelpers;
      this._helpersPromise = typeof t == "function" ? t() : Promise.resolve(null);
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
  _unit(t, e, r) {
    return t === null ? c`<span class="unavail">–</span>` : c`${e(t)} ${r}`;
  }
  _toggleExpanded() {
    this._expanded = !this._expanded, this._expanded ? this._closer.activate() : this._closer.deactivate();
  }
  _collapse() {
    this._expanded && (this._expanded = !1, this._closer.deactivate());
  }
  _onKeydown(t) {
    (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this._toggleExpanded());
  }
};
bt.properties = {
  // Assigning `hass` is a reactive property write, so Home Assistant's state
  // updates re-render the card (same mechanism as the other cards).
  hass: { attribute: !1 },
  _config: { state: !0 },
  _expanded: { state: !0 },
  _period: { state: !0 }
}, bt.styles = [
  Tt,
  Ct,
  Mt,
  ot,
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
let Yt = bt;
const _t = ["day", "week", "month", "year"], Di = new Set(_t), Ne = 4, Ni = 12, zi = {
  day: "Tag",
  week: "Woche",
  month: "Monat",
  year: "Jahr"
}, B = [
  { key: "consumption", label: "Verbrauch", cls: "m-consumption" },
  { key: "production", label: "Produktion", cls: "m-production" },
  { key: "import", label: "Import", cls: "m-import" },
  { key: "export", label: "Export", cls: "m-export" },
  { key: "charge", label: "Laden", cls: "m-charge" },
  { key: "discharge", label: "Entladen", cls: "m-discharge" }
];
function ut(s) {
  return {
    consumption: s[0],
    production: s[1],
    import: s[2],
    export: s[3],
    charge: s[4],
    discharge: s[5]
  };
}
const Ii = {
  day: ut([17.6, 22.4, 4.4, 3.1, 6.2, 5.8]),
  week: ut([148.2, 127.5, 38.6, 41, 32.1, 28.4]),
  month: ut([610, 590, 160, 175, 140, 128]),
  year: ut([5400, 8200, 1900, 4100, 1200, 1100])
};
function nr(s) {
  return Array.isArray(s) ? s.some(nr) : typeof s == "number" ? Number.isFinite(s) : typeof s == "string" && s.trim().length > 0;
}
const xt = class xt extends M {
  constructor() {
    super(), this._period = null;
  }
  setConfig(t) {
    if (!t)
      throw new Error("des-stats-card: Konfiguration fehlt");
    if (!t.name)
      throw new Error('des-stats-card: "name" ist erforderlich');
    if (t.default_period && !Di.has(t.default_period))
      throw new Error(
        'des-stats-card: "default_period" muss "day", "week", "month" oder "year" sein'
      );
    this._config = t, this._period = null;
  }
  getCardSize() {
    const t = this._effectivePeriod(this._availablePeriods()), e = t ? B.filter((r) => this._periodValues(t)[r.key] !== null).length : 0;
    return 2 + Math.ceil(e / 2);
  }
  /** HA sections view: a third of the section, fixed height. */
  getGridOptions() {
    return { columns: Ni, rows: Ne, min_rows: Ne };
  }
  static getStubConfig() {
    return { type: "custom:des-stats-card", name: "Statistik", default_period: "day" };
  }
  // =========================================================================
  // mode + resolution
  // =========================================================================
  /** Any configured period figure switches the card from demo to reading. */
  get _entityMode() {
    const t = this._config?.periods;
    return t ? _t.some((e) => {
      const r = t[e];
      return r !== void 0 && B.some((i) => nr(r[i.key]));
    }) : !1;
  }
  /**
   * A configured slot's numeric value, rescaled onto kWh (Wh → /1000,
   * MWh → ×1000). `null` for an unset, unavailable or non-numeric slot.
   */
  _num(t) {
    if (t === void 0 || typeof t == "string" && t.trim().length === 0) return null;
    const e = w(t, this.hass);
    if (e.kind !== "value") return null;
    let r = e.value;
    if (typeof t == "string" && y(t)) {
      const i = ne(t, this.hass);
      i === "wh" ? r /= 1e3 : i === "mwh" && (r *= 1e3);
    }
    return Number.isFinite(r) ? r : null;
  }
  /** Sum of a single value or a list; `null` when nothing resolves. */
  _sumList(t) {
    if (t === void 0) return null;
    const r = (Array.isArray(t) ? t : [t]).map((i) => this._num(i)).filter((i) => i !== null);
    return r.length > 0 ? r.reduce((i, n) => i + n, 0) : null;
  }
  _metricValue(t, e) {
    return t ? e === "charge" || e === "discharge" ? this._sumList(t[e]) : this._num(t[e]) : null;
  }
  _periodValues(t) {
    if (!this._entityMode) return Ii[t];
    const e = this._config?.periods?.[t], r = {};
    for (const { key: i } of B) r[i] = this._metricValue(e, i);
    return r;
  }
  /** Periods that have at least one readable figure (all four in demo mode). */
  _availablePeriods() {
    return this._entityMode ? _t.filter((t) => {
      const e = this._periodValues(t);
      return B.some((r) => e[r.key] !== null);
    }) : [..._t];
  }
  /** The user's pick if still available, else `default_period`, else the first. */
  _effectivePeriod(t) {
    if (t.length === 0) return null;
    if (this._period && t.includes(this._period)) return this._period;
    const e = this._config?.default_period;
    return e && t.includes(e) ? e : t[0];
  }
  /** Percentage, whole number, or null when the denominator is unusable. */
  _ratio(t, e) {
    return e === null || e <= 0 || t === null ? null : x((1 - t / e) * 100, 0, 100);
  }
  // =========================================================================
  // render
  // =========================================================================
  render() {
    const t = this._config;
    if (!t) return d;
    const e = this._availablePeriods(), r = this._effectivePeriod(e), i = r ? this._periodValues(r) : null, n = i ? this._ratio(i.import, i.consumption) : null, a = i ? this._ratio(i.export, i.production) : null;
    return c`
      <ha-card>
        <div class="card">
          <div class="header">
            <span class="name">${t.name}</span>
            ${e.length > 0 && r ? N(
      e.map((l) => ({ value: l, label: zi[l] })),
      r,
      (l) => this._setPeriod(l),
      "Zeitraum"
    ) : d}
          </div>

          ${n === null && a === null ? d : c`<div class="meta">
                ${this._pct(n)} % autark · ${this._pct(a)} %
                Eigenverbrauch
              </div>`}

          ${i ? this._renderRows(i) : d}
        </div>
      </ha-card>
    `;
  }
  _renderRows(t) {
    const r = B.map((i) => t[i.key]).filter(
      (i) => i !== null
    ).reduce((i, n) => Math.max(i, n), 0);
    return c`
      <div class="rows">
        ${B.map((i) => {
      const n = t[i.key];
      if (n === null) return d;
      const a = r > 0 ? x(n / r * 100, 0, 100) : 0;
      return c`
            <span class="row-label">${i.label}</span>
            <div class="bar">
              <div
                class="bar-fill ${i.cls}"
                style="width: ${a}%"
              ></div>
            </div>
            <span class="row-value">${b(n, 2)} kWh</span>
          `;
    })}
      </div>
    `;
  }
  /** Whole-number percent, or a muted "–" when it cannot be computed. */
  _pct(t) {
    return t === null ? c`<span class="unavail">–</span>` : c`${m(t)}`;
  }
  _setPeriod(t) {
    this._period = t;
  }
};
xt.properties = {
  // Assigning `hass` is a reactive property write, so Home Assistant's state
  // updates re-render the card (same mechanism as the other cards).
  hass: { attribute: !1 },
  _config: { state: !0 },
  _period: { state: !0 }
}, xt.styles = [
  ot,
  Mt,
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
let Zt = xt;
const Xt = ["day", "week", "month", "year"], Hi = new Set(Xt), Fi = {
  day: "Tag",
  week: "Woche",
  month: "Monat",
  year: "Jahr"
}, ze = 4, Wi = 3, Ui = 24, Bi = 220, ji = 2, Gi = ["_apexChart", "apexChart", "_chart"], kt = class kt extends M {
  constructor() {
    super(), this._mountToken = 0, this._awaitingApex = !1, this._period = null;
  }
  setConfig(t) {
    if (!t)
      throw new Error("des-chart-card: Konfiguration fehlt");
    if (!t.name)
      throw new Error('des-chart-card: "name" ist erforderlich');
    if (t.default_period && !Hi.has(t.default_period))
      throw new Error(
        'des-chart-card: "default_period" muss "day", "week", "month" oder "year" sein'
      );
    if (t.periods !== void 0 && (typeof t.periods != "object" || t.periods === null))
      throw new Error('des-chart-card: "periods" muss ein Objekt sein');
    this._config = t, this._period = null, this._teardownChart();
  }
  getCardSize() {
    return ze;
  }
  /** HA sections view: two thirds wide; the chart grows into the given rows. */
  getGridOptions() {
    return { columns: Ui, rows: ze, min_rows: Wi };
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
  _observeChartSize(t) {
    typeof ResizeObserver > "u" || this._observedChart !== (t ?? void 0) && (this._resizeObserver?.disconnect(), this._observedChart = t ?? void 0, t && (this._resizeObserver ??= new ResizeObserver(() => this._applyChartHeight()), this._resizeObserver.observe(t)));
  }
  // =========================================================================
  // period model
  // =========================================================================
  _apexAvailable() {
    return customElements.get("apexcharts-card") !== void 0;
  }
  _chartConfig(t) {
    const e = this._config?.periods?.[t]?.chart;
    return e && typeof e == "object" ? e : null;
  }
  _label(t) {
    const e = this._config?.periods?.[t]?.label;
    return typeof e == "string" && e.trim().length > 0 ? e : Fi[t];
  }
  /** Periods that carry a chart; empty means "demo" (no periods configured). */
  _realPeriods() {
    return Xt.filter((t) => this._chartConfig(t) !== null);
  }
  get _isDemo() {
    return this._realPeriods().length === 0;
  }
  _available() {
    const t = this._realPeriods();
    return t.length > 0 ? t : [...Xt];
  }
  /** The user's pick if still available, else `default_period`, else the first. */
  _effectivePeriod(t) {
    if (this._period && t.includes(this._period)) return this._period;
    const e = this._config?.default_period;
    return e && t.includes(e) ? e : t[0];
  }
  // =========================================================================
  // render
  // =========================================================================
  render() {
    const t = this._config;
    if (!t) return d;
    const e = this._available(), r = this._effectivePeriod(e), i = this._isDemo ? null : this._config?.periods?.[r]?.meta;
    return c`
      <ha-card>
        <div class="card">
          <div class="header">
            <span class="name">${t.name}</span>
            ${N(
      e.map((n) => ({ value: n, label: this._label(n) })),
      r,
      (n) => this._setPeriod(n),
      "Zeitraum"
    )}
          </div>
          ${i ? c`<div class="meta">${i}</div>` : d}
          ${this._renderChartArea(r)}
        </div>
      </ha-card>
    `;
  }
  _renderChartArea(t) {
    return this._isDemo || this._chartConfig(t) === null ? c`<div class="hint">Keine Chart-Config</div>` : this._apexAvailable() ? c`<div class="chart" id="chart"></div>` : c`<div class="hint">apexcharts-card nicht installiert</div>`;
  }
  _setPeriod(t) {
    this._period = t;
  }
  // =========================================================================
  // embedded chart lifecycle
  // =========================================================================
  updated() {
    const t = this.renderRoot?.querySelector("#chart");
    this._observeChartSize(t), this._applyChartHeight(), this._syncChart();
  }
  /**
   * Takes the height flex handed the container and passes it to the chart.
   *
   * The container is never sized from here. It is a flex child with
   * `min-height: 0`, so the grid's height wins over the content; measuring it
   * and then writing to it would be measuring our own output.
   */
  _applyChartHeight() {
    const t = this.renderRoot?.querySelector("#chart");
    if (!t) return;
    const e = t.clientHeight;
    e <= 0 || this._chartHeight !== void 0 && Math.abs(e - this._chartHeight) <= ji || (this._chartHeight = e, this._resizeApex(e));
  }
  /** Resizes the mounted chart in place instead of rebuilding it. */
  _resizeApex(t) {
    const e = this._apexInstance();
    if (e)
      try {
        e.updateOptions({ chart: { height: t } }, !1, !1);
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
    const t = this._chartEl;
    if (t)
      for (const e of Gi) {
        const r = t[e];
        if (r && typeof r.updateOptions == "function")
          return r;
      }
  }
  _syncChart() {
    const t = this._effectivePeriod(this._available()), e = this._isDemo ? null : this._chartConfig(t), r = this.renderRoot?.querySelector("#chart");
    if (!e || !this._apexAvailable() || !r) {
      this._teardownChart();
      return;
    }
    if (this._chartEl && this._chartPeriod === t) {
      this._chartEl.isConnected || r.replaceChildren(this._chartEl), this._chartEl.hass = this.hass;
      return;
    }
    this._mountChart(r, e, t);
  }
  async _mountChart(t, e, r) {
    const i = ++this._mountToken;
    this._removeChartEl();
    const n = await this._getHelpers();
    if (!n || i !== this._mountToken) return;
    let a;
    try {
      a = n.createCardElement(this._embedConfig(e));
    } catch (l) {
      console.error("des-chart-card: Chart konnte nicht erzeugt werden", l);
      return;
    }
    i === this._mountToken && (a.classList.add("embedded"), a.hass = this.hass, t.replaceChildren(a), this._chartEl = a, this._chartPeriod = r);
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
  _embedConfig(t) {
    const e = (f) => f && typeof f == "object" ? f : {}, r = e(t.header), i = e(t.apex_config), n = e(i.chart), a = e(i.legend), l = e(a.markers), o = e(a.itemMargin), h = e(t.all_series_config), u = e(h.group_by), p = t.stacked === !0 || n.stacked === !0, _ = p && "group_by" in h ? {
      all_series_config: {
        ...h,
        group_by: { fill: "last", ...u }
      }
    } : {};
    return {
      ...t,
      ...p ? { stacked: !0 } : {},
      ..._,
      type: "custom:apexcharts-card",
      header: { ...r, show: !1 },
      apex_config: {
        ...i,
        chart: {
          ...n,
          height: this._chartHeight ?? Bi,
          ...p ? { stacked: !0 } : {}
        },
        legend: {
          ...a,
          // Default first, user's value spread on top wins per key.
          markers: { offsetX: -4, ...l },
          itemMargin: { horizontal: 10, ...o }
        }
      }
    };
  }
  _getHelpers() {
    if (!this._helpersPromise) {
      const t = window.loadCardHelpers;
      this._helpersPromise = typeof t == "function" ? t() : Promise.resolve(null);
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
kt.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 },
  _period: { state: !0 }
}, kt.styles = [
  ot,
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
let Jt = kt;
const Ki = 12, Ie = 5, Vi = 4, He = 30, Fe = 80, We = 5, qi = 24, Ue = "Luftentfeuchter", Yi = "Abbrechen", Zi = 300, Xi = 8e3, Ji = 300 * 1e3, Qi = 140, ts = { top: 6, right: 8, bottom: 18, left: 30 }, F = 10, Ut = 20, Be = 6, je = 2;
function Z(s) {
  return s !== null && s.trim().toLowerCase() === "on";
}
function Bt(s, t) {
  const { min: e, max: r, step: i } = t;
  if (!(i > 0)) return x(s, e, r);
  const n = Math.round((s - e) / i), a = Number((e + n * i).toFixed(6));
  return x(a, e, r);
}
function es(s) {
  const t = String(s.getHours()).padStart(2, "0"), e = String(s.getMinutes()).padStart(2, "0");
  return `${t}:${e}`;
}
function rs(s, t) {
  if (s.trim().toLowerCase() === t.trim().toLowerCase()) return "Aus";
  const e = s.trim().match(/^(\d+(?:[.,]\d+)?)/);
  return e ? `${e[1].replace(",", ".")} h` : s;
}
const $t = class $t extends M {
  constructor() {
    super(), this._closer = new Lt(this, () => this._collapse()), this._settleTimers = /* @__PURE__ */ new Map(), this._historyStarted = !1, this._expanded = !1, this._targetLocal = null, this._powerLocal = null, this._countdownLocal = null, this._lockLocal = null, this._history = [], this._chartW = 0, this._chartH = 0;
  }
  setConfig(t) {
    if (!t)
      throw new Error("des-dehumidifier-card: Konfiguration fehlt");
    if (t.faults !== void 0) {
      if (!Array.isArray(t.faults))
        throw new Error('des-dehumidifier-card: "faults" muss eine Liste sein');
      for (const e of t.faults) {
        if (!e || typeof e.entity != "string" || !e.entity)
          throw new Error('des-dehumidifier-card: jeder "faults"-Eintrag braucht "entity"');
        if (!e.name)
          throw new Error('des-dehumidifier-card: jeder "faults"-Eintrag braucht "name"');
        if (e.severity !== void 0 && e.severity !== "error" && e.severity !== "warning")
          throw new Error(
            'des-dehumidifier-card: "severity" muss "error" oder "warning" sein'
          );
      }
    }
    this._config = t, this._expanded = !1, this._targetLocal = null, this._powerLocal = null, this._countdownLocal = null, this._lockLocal = null, this._historyStarted = !1, this._history = this._isDemo ? this._buildDemoHistory() : [];
  }
  getCardSize() {
    return Ie;
  }
  getGridOptions() {
    return { columns: Ki, rows: Ie, min_rows: Vi };
  }
  static getStubConfig() {
    return {
      type: "custom:des-dehumidifier-card",
      name: Ue,
      location: "Arbeitszimmer"
    };
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._closer.deactivate(), this._writeTimer !== void 0 && window.clearTimeout(this._writeTimer);
    for (const t of this._settleTimers.values()) window.clearTimeout(t);
    this._settleTimers.clear(), this._historyTimer !== void 0 && window.clearInterval(this._historyTimer), this._historyTimer = void 0, this._historyStarted = !1, this._resizeObserver?.disconnect(), this._resizeObserver = void 0, this._observedChart = void 0;
  }
  /** Drops optimistic values the entity has meanwhile confirmed. */
  willUpdate() {
    const t = this._config;
    if (t) {
      if (this._targetLocal !== null && y(t.humidifier_entity)) {
        const e = Q(
          t.humidifier_entity,
          this.hass,
          "humidity"
        );
        e !== null && Bt(e, this._targetRange()) === this._targetLocal && (this._targetLocal = null, this._clearSettle("target"));
      }
      if (this._powerLocal !== null && y(t.power_entity)) {
        const e = O(t.power_entity, this.hass);
        e !== null && Z(e) === this._powerLocal && (this._powerLocal = null, this._clearSettle("power"));
      }
      if (this._countdownLocal !== null && y(t.countdown_entity)) {
        const e = O(t.countdown_entity, this.hass);
        e !== null && e === this._countdownLocal && (this._countdownLocal = null, this._clearSettle("countdown"));
      }
      if (this._lockLocal !== null && y(t.child_lock_entity)) {
        const e = O(t.child_lock_entity, this.hass);
        e !== null && Z(e) === this._lockLocal && (this._lockLocal = null, this._clearSettle("lock"));
      }
    }
  }
  updated() {
    this.toggleAttribute("expanded", this._expanded), this._maybeStartHistory();
    const t = this.renderRoot?.querySelector("#chart");
    this._observeChartSize(t), this._measureChart();
  }
  // =========================================================================
  // demo / live
  // =========================================================================
  get _isDemo() {
    const t = this._config;
    return !t?.humidity_entity && !t?.humidifier_entity && !t?.power_entity && !t?.countdown_entity && !t?.child_lock_entity;
  }
  _targetRange() {
    const t = this._config, e = t?.target_min ?? He, r = t?.target_max ?? Fe, i = t?.target_step ?? We;
    return !(e < r) || !(i > 0) ? {
      min: He,
      max: Fe,
      step: We
    } : { min: e, max: r, step: i };
  }
  _historyHours() {
    const t = this._config?.history_hours;
    return typeof t == "number" && t > 0 ? t : qi;
  }
  _offOption() {
    const t = this._config?.countdown_off_option;
    return typeof t == "string" && t.trim().length > 0 ? t : Yi;
  }
  /** Current relative humidity. */
  _humidity() {
    return this._isDemo ? { kind: "value", value: 52 } : w(this._config?.humidity_entity, this.hass);
  }
  /** Target humidity, `null` when it cannot be read. */
  _target() {
    if (this._targetLocal !== null) return this._targetLocal;
    if (this._isDemo) return 45;
    const t = this._config?.humidifier_entity;
    if (!y(t)) return null;
    const e = Q(t, this.hass, "humidity");
    return e === null ? null : e;
  }
  /** Device on/off, `null` when it cannot be read. */
  _powerOn() {
    if (this._powerLocal !== null) return this._powerLocal;
    if (this._isDemo) return !0;
    const t = this._config?.power_entity;
    if (!y(t)) return null;
    const e = O(t, this.hass);
    return e === null ? null : Z(e);
  }
  /** Options the countdown select offers. */
  _countdownOptions() {
    if (this._isDemo)
      return [this._offOption(), "1 Stunde", "2 Stunden", "4 Stunden"];
    const t = this._config?.countdown_entity;
    if (!y(t)) return [];
    const e = this.hass?.states?.[t]?.attributes?.options;
    return Array.isArray(e) ? e.filter((r) => typeof r == "string") : [];
  }
  /** Current countdown option, `null` when it cannot be read. */
  _countdown() {
    if (this._countdownLocal !== null) return this._countdownLocal;
    if (this._isDemo) return this._offOption();
    const t = this._config?.countdown_entity;
    return y(t) ? O(t, this.hass) : null;
  }
  /** Child lock on/off, `null` when it cannot be read. */
  _lockOn() {
    if (this._lockLocal !== null) return this._lockLocal;
    if (this._isDemo) return !1;
    const t = this._config?.child_lock_entity;
    if (!y(t)) return null;
    const e = O(t, this.hass);
    return e === null ? null : Z(e);
  }
  /** The active faults, in configured order. */
  _activeFaults() {
    const t = this._config?.faults ?? [];
    return this._isDemo ? [] : t.filter((e) => Z(O(e.entity, this.hass)));
  }
  // =========================================================================
  // render
  // =========================================================================
  render() {
    const t = this._config;
    if (!t) return d;
    const e = this._humidity(), r = this._target(), i = this._powerOn(), n = this._targetRange(), a = this._activeFaults(), l = a.some((u) => (u.severity ?? "error") === "error"), o = i === !0 && e.kind === "value" && r !== null ? Math.round(e.value - r) : null, h = [
      t.location,
      `Ziel ${r === null ? "–" : `${Math.round(r)} %`}`
    ].filter((u) => typeof u == "string" && u.length > 0);
    return c`
      <ha-card>
        <div class="card">
          <div class="header">
            <div class="head-left">
              <span class="name">${t.name ?? Ue}</span>
              <div class="meta">${h.join(" · ")}</div>
            </div>
            <div class="badges">
              ${a.map((u) => this._renderFaultBadge(u))}
              ${this._renderCountdownBadge()}
              ${l ? d : this._renderStatusBadge(i, e, r)}
            </div>
          </div>

          <div class="value-row">
            <div class="value-main">
              <span class="value-num">
                ${e.kind === "value" ? `${m(e.value)} %` : this._dash()}
              </span>
              <span class="value-label">Luftfeuchte</span>
            </div>
            ${o !== null && o > 0 ? c`<span class="value-over">${m(o)} % über Ziel</span>` : d}
          </div>

          ${this._renderBar(e, r, n)}
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
        ${this._expanded ? c`<div class="overlay">${this._renderControls(n, r)}</div>` : d}
      </ha-card>
    `;
  }
  _dash() {
    return c`<span class="unavail">–</span>`;
  }
  _renderBadge(t, e) {
    return c`<span class="badge ${e}">
      <span class="badge-label">${t}</span>
    </span>`;
  }
  _renderFaultBadge(t) {
    const e = t.severity ?? "error";
    return this._renderBadge(
      t.name,
      e === "warning" ? "badge-warn" : "badge-error"
    );
  }
  /** "Max-Trocknen <Option>" in blue while the countdown is not off. */
  _renderCountdownBadge() {
    const t = this._countdown();
    return t === null || t.trim().toLowerCase() === this._offOption().trim().toLowerCase() ? d : this._renderBadge(`Max-Trocknen ${t}`, "badge-info");
  }
  /**
   * "Läuft" (green, on and above target), "Bereit" (blue, on and at/below
   * target), "Aus" (grey, off). Omitted while an error fault is up (handled by
   * the caller) or while the power state is not readable.
   */
  _renderStatusBadge(t, e, r) {
    return t === null ? d : t === !1 ? this._renderBadge("Aus", "badge-neutral") : e.kind === "value" && r !== null && e.value > r ? this._renderBadge("Läuft", "badge-run") : this._renderBadge("Bereit", "badge-info");
  }
  /**
   * Horizontal bar over `target_min…target_max`, filled to the current humidity
   * and always blue (--primary-color), with a vertical target marker and a
   * scale line underneath. Unchanged by faults.
   */
  _renderBar(t, e, r) {
    const i = r.max - r.min, n = t.kind === "value" ? x((t.value - r.min) / i, 0, 1) * 100 : 0, a = e === null ? null : x((e - r.min) / i, 0, 1) * 100;
    return c`
      <div class="bar-wrap">
        <div class="bar">
          <div class="bar-fill" style="width:${n}%"></div>
          ${a === null ? d : c`<div class="bar-target" style="left:${a}%"></div>`}
        </div>
        <div class="bar-scale">
          <span>${m(r.min)}</span>
          <span>Ziel ${e === null ? "–" : m(Math.round(e))}</span>
          <span>${m(r.max)}</span>
        </div>
      </div>
    `;
  }
  // =========================================================================
  // chart
  // =========================================================================
  _observeChartSize(t) {
    typeof ResizeObserver > "u" || this._observedChart !== (t ?? void 0) && (this._resizeObserver?.disconnect(), this._observedChart = t ?? void 0, t && (this._resizeObserver ??= new ResizeObserver(() => this._measureChart()), this._resizeObserver.observe(t)));
  }
  _measureChart() {
    const t = this.renderRoot?.querySelector("#chart");
    if (!t) return;
    const e = t.clientWidth, r = t.clientHeight;
    e <= 0 || r <= 0 || Math.abs(e - this._chartW) <= je && Math.abs(r - this._chartH) <= je || (this._chartW = e, this._chartH = r);
  }
  _maybeStartHistory() {
    if (this._isDemo || this._historyStarted) return;
    const t = this._config?.humidity_entity;
    !this.hass?.callWS || !y(t) || (this._historyStarted = !0, this._fetchHistory(), this._historyTimer = window.setInterval(
      () => void this._fetchHistory(),
      Ji
    ));
  }
  async _fetchHistory() {
    const t = this._config, e = this.hass, r = t?.humidity_entity;
    if (!t || !e?.callWS || !y(r)) return;
    const i = /* @__PURE__ */ new Date(), n = new Date(i.getTime() - this._historyHours() * 3600 * 1e3);
    try {
      const l = (await e.callWS({
        type: "history/history_during_period",
        start_time: n.toISOString(),
        end_time: i.toISOString(),
        entity_ids: [r],
        minimal_response: !0,
        no_attributes: !0,
        significant_changes_only: !1
      }))?.[r] ?? [], o = [];
      for (const h of l) {
        const u = h.s ?? h.state, p = h.lu ?? h.last_updated ?? h.last_changed;
        if (u == null || p === void 0) continue;
        const _ = String(u).trim().toLowerCase();
        if (_ === "unavailable" || _ === "unknown" || _ === "") continue;
        const f = Number.parseFloat(String(u));
        Number.isFinite(f) && o.push({ t: p * 1e3, v: f });
      }
      o.sort((h, u) => h.t - u.t), this._history = o;
    } catch (a) {
      console.warn("des-dehumidifier-card: Historie konnte nicht geladen werden", a);
    }
  }
  /** A plausible descending-then-steady 24-h trace for the editor preview. */
  _buildDemoHistory() {
    const t = this._historyHours(), e = Date.now(), r = 900 * 1e3, i = Math.round(t * 3600 * 1e3 / r), n = [];
    for (let a = 0; a <= i; a++) {
      const l = e - (i - a) * r, o = a / i, h = 62 - 10 * o, u = 3 * Math.sin(o * Math.PI * 4);
      n.push({ t: l, v: Math.round((h + u) * 10) / 10 });
    }
    return n;
  }
  /** y-axis bounds: data and target, rounded to 10 %, at least a 20 % span. */
  _yBounds(t) {
    const e = this._history.map((n) => n.v);
    if (t !== null && e.push(t), e.length === 0) return { lo: 40, hi: 60 };
    let r = Math.floor(Math.min(...e) / F) * F, i = Math.ceil(Math.max(...e) / F) * F;
    if (i - r < Ut) {
      const n = (r + i) / 2;
      r = Math.floor((n - Ut / 2) / F) * F, i = r + Ut;
    }
    return { lo: x(r, 0, 100), hi: x(i, 0, 100) };
  }
  _renderChart(t) {
    const e = this._chartW, r = this._chartH, i = e > 0 && r > 0 ? this._renderChartSvg(e, r, t) : d;
    return c`<div class="chart" id="chart">${i}</div>`;
  }
  _renderChartSvg(t, e, r) {
    const { top: i, right: n, bottom: a, left: l } = ts, o = Math.max(1, t - l - n), h = Math.max(1, e - i - a), { lo: u, hi: p } = this._yBounds(r), _ = p - u || 1, f = (E) => i + h * (1 - (E - u) / _), v = Date.now(), k = v - this._historyHours() * 3600 * 1e3, T = v - k || 1, $ = (E) => l + o * x((E - k) / T, 0, 1), ae = [];
    for (let E = u; E <= p + 1e-3; E += F) {
      const P = f(E);
      ae.push(I`
        <line class="grid" x1=${l} y1=${P} x2=${l + o} y2=${P}></line>
        <text class="axis-label" x=${l - 5} y=${P + 3} text-anchor="end">${m(E)}</text>
      `);
    }
    const Pt = [], ar = Math.max(1, Math.floor(this._historyHours() / Be));
    for (let E = ar; E >= 1; E--) {
      const P = v - E * Be * 3600 * 1e3;
      if (P < k - 1) continue;
      const Nt = $(P);
      Pt.push(I`
        <text class="axis-label" x=${Nt} y=${i + h + 13} text-anchor="middle">${es(new Date(P))}</text>
      `);
    }
    Pt.push(I`
      <text class="axis-label" x=${l + o} y=${i + h + 13} text-anchor="end">jetzt</text>
    `);
    const q = this._history.filter((E) => E.t >= k - T * 0.02);
    let Ot = "", Rt = "";
    if (q.length > 0) {
      const E = q.map((le) => `${$(le.t).toFixed(1)},${f(le.v).toFixed(1)}`);
      Ot = `M${E.join(" L")}`;
      const P = $(q[0].t).toFixed(1), Nt = $(q[q.length - 1].t).toFixed(1), oe = (i + h).toFixed(1);
      Rt = `M${P},${oe} L${E.join(" L")} L${Nt},${oe} Z`;
    }
    const Dt = r === null ? null : f(x(r, u, p));
    return I`
      <svg
        class="chart-svg"
        width=${t}
        height=${e}
        viewBox="0 0 ${t} ${e}"
        preserveAspectRatio="none"
        role="img"
        aria-label="Verlauf der Luftfeuchte"
      >
        ${ae}
        ${Rt ? I`<path class="area" d=${Rt}></path>` : d}
        ${Dt === null ? d : I`<line class="target-line" x1=${l} y1=${Dt} x2=${l + o} y2=${Dt}></line>`}
        ${Ot ? I`<path class="line" d=${Ot}></path>` : d}
        ${Pt}
      </svg>
    `;
  }
  // =========================================================================
  // controls (expanded)
  // =========================================================================
  _renderControls(t, e) {
    const r = this._config;
    if (!r) return c``;
    const i = this._powerOn(), n = y(r.power_entity) && !ye(r.power_entity), a = N(
      [
        { value: "on", label: "An" },
        { value: "off", label: "Aus" }
      ],
      i === null ? null : i ? "on" : "off",
      ($) => this._setPower($ === "on"),
      "Gerät",
      n
    ), l = y(r.humidifier_entity) && !be(r.humidifier_entity), o = this._countdownOptions(), h = this._countdown(), u = this._offOption(), p = y(r.countdown_entity) && !["select", "input_select"].includes(C(r.countdown_entity)), _ = o.length > 0 ? N(
      o.map(($) => ({ value: $, label: rs($, u) })),
      h !== null && o.includes(h) ? h : null,
      ($) => this._setCountdown($),
      "Max-Trocknen",
      p
    ) : null, f = typeof r.child_lock_entity == "string" && r.child_lock_entity.trim().length > 0, v = this._lockOn(), k = y(r.child_lock_entity) && !ft(r.child_lock_entity), T = N(
      [
        { value: "on", label: "An" },
        { value: "off", label: "Aus" }
      ],
      v === null ? null : v ? "on" : "off",
      ($) => this._setLock($ === "on"),
      "Kindersicherung",
      k
    );
    return c`
      <div class="controls">
        <div class="ctl-row">
          <span class="ctl-label">Gerät</span>
          <div class="ctl-control">${a}</div>
        </div>

        <div class="ctl-row">
          <span class="ctl-label ${l ? "disabled" : ""}">Zielfeuchte</span>
          <div class="ctl-control slider-control">
            <input
              class="slider"
              type="range"
              min=${t.min}
              max=${t.max}
              step=${t.step}
              .value=${String(e ?? t.min)}
              ?disabled=${l}
              aria-label="Zielfeuchte"
              @input=${this._onTargetInput}
              @change=${this._onTargetChange}
            />
            <span class="ctl-value">
              ${e === null ? this._dash() : `${m(Math.round(e))} %`}
            </span>
          </div>
        </div>

        ${_ ? c`<div class="ctl-row">
              <span class="ctl-label">Max-Trocknen</span>
              <div class="ctl-control">${_}</div>
            </div>` : d}

        ${f ? c`<div class="ctl-row">
              <span class="ctl-label">Kindersicherung</span>
              <div class="ctl-control">${T}</div>
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
  _onKeydown(t) {
    (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this._toggleExpanded());
  }
  _holdOptimistic(t, e) {
    this._clearSettle(t), this._settleTimers.set(
      t,
      window.setTimeout(() => {
        this._settleTimers.delete(t), e();
      }, Xi)
    );
  }
  _clearSettle(t) {
    const e = this._settleTimers.get(t);
    e !== void 0 && (window.clearTimeout(e), this._settleTimers.delete(t));
  }
  async _write(t, e) {
    try {
      await t;
    } catch (r) {
      e(), console.error("des-dehumidifier-card: Service-Call fehlgeschlagen", r);
    }
  }
  _setPower(t) {
    this._powerLocal = t;
    const e = this._config?.power_entity;
    ye(e) && (this._holdOptimistic("power", () => {
      this._powerLocal = null;
    }), this._write(Or(this.hass, e, t), () => {
      this._clearSettle("power"), this._powerLocal = null;
    }));
  }
  _setCountdown(t) {
    this._countdownLocal = t;
    const e = this._config?.countdown_entity;
    !y(e) || !["select", "input_select"].includes(C(e)) || (this._holdOptimistic("countdown", () => {
      this._countdownLocal = null;
    }), this._write(er(this.hass, e, t), () => {
      this._clearSettle("countdown"), this._countdownLocal = null;
    }));
  }
  _setLock(t) {
    this._lockLocal = t;
    const e = this._config?.child_lock_entity;
    ft(e) && (this._holdOptimistic("lock", () => {
      this._lockLocal = null;
    }), this._write(mt(this.hass, e, t), () => {
      this._clearSettle("lock"), this._lockLocal = null;
    }));
  }
  /** Dragging only moves the UI; the write happens on release (debounced). */
  _onTargetInput(t) {
    this._targetLocal = Bt(
      Number(t.target.value),
      this._targetRange()
    );
  }
  _onTargetChange(t) {
    const e = Bt(
      Number(t.target.value),
      this._targetRange()
    );
    this._targetLocal = e;
    const r = this._config?.humidifier_entity;
    be(r) && (this._writeTimer !== void 0 && window.clearTimeout(this._writeTimer), this._writeTimer = window.setTimeout(() => {
      this._writeTimer = void 0, this._holdOptimistic("target", () => {
        this._targetLocal = null;
      }), this._write(Rr(this.hass, r, e), () => {
        this._clearSettle("target"), this._targetLocal = null;
      });
    }, Zi));
  }
};
$t.properties = {
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
}, $t.styles = [
  Mt,
  ot,
  Tt,
  Ct,
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

      .chart {
        flex: 1 1 auto;
        min-height: ${Qi}px;
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
let Qt = $t;
const is = "0.11.0", ss = [
  {
    type: "des-storage-card",
    element: Vt,
    name: "Daniels Speicherkarte",
    description: "Speicherkarte für Hausakkus (battery) und Wärmespeicher-Gruppen (thermal_group)."
  },
  {
    type: "des-inverter-card",
    element: qt,
    name: "Daniels Wechselrichterkarte",
    description: "Wechselrichter-Übersicht: PV-Leistung, Strings und Phasen (Entities oder Demo-Werte)."
  },
  {
    type: "des-house-card",
    element: Yt,
    name: "Daniels Hauskarte",
    description: "Hausverbrauch und Stromherkunft: Solar, Speicher, Netz plus Tageswerte (Entities oder Demo-Werte)."
  },
  {
    type: "des-stats-card",
    element: Zt,
    name: "Daniels Statistikkarte",
    description: "Energiestatistik je Zeitraum (Tag/Woche/Monat/Jahr): Verbrauch, Produktion, Import, Export, Laden, Entladen."
  },
  {
    type: "des-chart-card",
    element: Jt,
    name: "Daniels Chartkarte",
    description: "Kopfzeile mit Zeitraum-Umschalter und eingebettetem ApexCharts-Chart je Zeitraum."
  },
  {
    type: "des-dehumidifier-card",
    element: Qt,
    name: "Daniels Entfeuchterkarte",
    description: "Luftentfeuchter: Ist-Feuchte gegen Ziel, 24-h-Verlauf, Störungspillen und Bedienung (Entities oder Demo-Werte)."
  }
];
window.customCards = window.customCards ?? [];
for (const s of ss)
  customElements.get(s.type) || customElements.define(s.type, s.element), window.customCards.some((t) => t.type === s.type) || window.customCards.push({
    type: s.type,
    name: s.name,
    description: s.description,
    preview: !1
  });
console.info(
  `%c DANIELS-HOME-ASSISTANT-CARDS %c v${is} `,
  "background:#03a9f4;color:#fff;font-weight:700;border-radius:3px 0 0 3px;padding:2px 4px",
  "background:#555;color:#fff;border-radius:0 3px 3px 0;padding:2px 4px"
);
export {
  Jt as DesChartCard,
  Qt as DesDehumidifierCard,
  Yt as DesHouseCard,
  qt as DesInverterCard,
  Zt as DesStatsCard,
  Vt as DesStorageCard
};

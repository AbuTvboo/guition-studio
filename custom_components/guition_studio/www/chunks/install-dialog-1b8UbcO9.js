import { a as e, c as t, d as n, f as r, g as i, h as a, i as o, l as s, m as c, n as l, o as u, p as d, r as f, s as p, t as m, u as h } from "./styles-BHZDpTpt.js";
import { a as g, c as _, d as v, g as y, h as b, i as x, l as S, n as C, o as w, p as T, r as E, s as D, t as O, u as ee } from "./class-map-7fYjXT0k.js";
import { t as te } from "./rom-DDmPa0KG.js";
import { i as ne, r as re, s as ie } from "./directive-helpers-BJqCicWh.js";
// \0rolldown/runtime.js
var ae = Object.create, oe = Object.defineProperty, se = Object.getOwnPropertyDescriptor, ce = Object.getOwnPropertyNames, le = Object.getPrototypeOf, ue = Object.prototype.hasOwnProperty, de = (e, t) => () => (t || (e((t = { exports: {} }).exports, t, t.exports), e = null), t.exports), fe = (e, t) => {
	let n = {};
	for (var r in e) oe(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || oe(n, Symbol.toStringTag, { value: "Module" }), n;
}, pe = (e, t, n, r) => {
	if (t && typeof t == "object" || typeof t == "function") for (var i = ce(t), a = 0, o = i.length, s; a < o; a++) s = i[a], !ue.call(e, s) && s !== n && oe(e, s, {
		get: ((e) => t[e]).bind(null, s),
		enumerable: !(r = se(t, s)) || r.enumerable
	});
	return e;
}, me = (e, t, n) => (n = e == null ? {} : ae(le(e)), pe(t || !e || !e.__esModule || !ue.call(e, "default") ? oe(n, "default", {
	value: e,
	enumerable: !0
}) : n, e)), he;
function ge(e) {
	return (t, n) => i(t, n, { get() {
		return (this.renderRoot ?? (he ??= document.createDocumentFragment())).querySelectorAll(e);
	} });
}
// node_modules/@lit/reactive-element/decorators/query-assigned-nodes.js
function _e(e) {
	return (t, n) => {
		let { slot: r } = e ?? {}, a = "slot" + (r ? `[name=${r}]` : ":not([name])");
		return i(t, n, { get() {
			return (this.renderRoot?.querySelector(a))?.assignedNodes(e) ?? [];
		} });
	};
}
// node_modules/esp-web-tools/node_modules/@material/web/list/internal/list-navigation-helpers.js
function ve(e, t = Oe) {
	let n = xe(e, t);
	return n && (n.tabIndex = 0, n.focus()), n;
}
function ye(e, t = Oe) {
	let n = Se(e, t);
	return n && (n.tabIndex = 0, n.focus()), n;
}
function be(e, t = Oe) {
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		if (r.tabIndex === 0 && t(r)) return {
			item: r,
			index: n
		};
	}
	return null;
}
function xe(e, t = Oe) {
	for (let n of e) if (t(n)) return n;
	return null;
}
function Se(e, t = Oe) {
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		if (t(r)) return r;
	}
	return null;
}
function Ce(e, t, n = Oe, r = !0) {
	for (let i = 1; i < e.length; i++) {
		let a = (i + t) % e.length;
		if (a < t && !r) return null;
		let o = e[a];
		if (n(o)) return o;
	}
	return e[t] ? e[t] : null;
}
function we(e, t, n = Oe, r = !0) {
	for (let i = 1; i < e.length; i++) {
		let a = (t - i + e.length) % e.length;
		if (a > t && !r) return null;
		let o = e[a];
		if (n(o)) return o;
	}
	return e[t] ? e[t] : null;
}
function Te(e, t, n = Oe, r = !0) {
	if (t) {
		let i = Ce(e, t.index, n, r);
		return i && (i.tabIndex = 0, i.focus()), i;
	}
	return ve(e, n);
}
function Ee(e, t, n = Oe, r = !0) {
	if (t) {
		let i = we(e, t.index, n, r);
		return i && (i.tabIndex = 0, i.focus()), i;
	}
	return ye(e, n);
}
function De() {
	return new Event("request-activation", {
		bubbles: !0,
		composed: !0
	});
}
function Oe(e) {
	return !e.disabled;
}
// node_modules/esp-web-tools/node_modules/@material/web/list/internal/list-controller.js
var k = {
	ArrowDown: "ArrowDown",
	ArrowLeft: "ArrowLeft",
	ArrowUp: "ArrowUp",
	ArrowRight: "ArrowRight",
	Home: "Home",
	End: "End"
}, ke = class {
	constructor(e) {
		this.handleKeydown = (e) => {
			let t = e.key;
			if (e.defaultPrevented || !this.isNavigableKey(t)) return;
			let n = this.items;
			if (!n.length) return;
			let r = be(n, this.isActivatable);
			e.preventDefault();
			let i = this.isRtl(), a = i ? k.ArrowRight : k.ArrowLeft, o = i ? k.ArrowLeft : k.ArrowRight, s = null;
			switch (t) {
				case k.ArrowDown:
				case o:
					s = Te(n, r, this.isActivatable, this.wrapNavigation());
					break;
				case k.ArrowUp:
				case a:
					s = Ee(n, r, this.isActivatable, this.wrapNavigation());
					break;
				case k.Home:
					s = ve(n, this.isActivatable);
					break;
				case k.End: s = ye(n, this.isActivatable);
			}
			s && r && r.item !== s && (r.item.tabIndex = -1);
		}, this.onDeactivateItems = () => {
			let e = this.items;
			for (let t of e) this.deactivateItem(t);
		}, this.onRequestActivation = (e) => {
			this.onDeactivateItems();
			let t = e.target;
			this.activateItem(t), t.focus();
		}, this.onSlotchange = () => {
			let e = this.items, t = !1;
			for (let n of e) !n.disabled && n.tabIndex > -1 && !t ? (t = !0, n.tabIndex = 0) : n.tabIndex = -1;
			if (t) return;
			let n = xe(e, this.isActivatable);
			n && (n.tabIndex = 0);
		};
		let { isItem: t, getPossibleItems: n, isRtl: r, deactivateItem: i, activateItem: a, isNavigableKey: o, isActivatable: s, wrapNavigation: c } = e;
		this.isItem = t, this.getPossibleItems = n, this.isRtl = r, this.deactivateItem = i, this.activateItem = a, this.isNavigableKey = o, this.isActivatable = s, this.wrapNavigation = c ?? (() => !0);
	}
	get items() {
		let e = this.getPossibleItems(), t = [];
		for (let n of e) {
			if (this.isItem(n)) {
				t.push(n);
				continue;
			}
			let e = n.item;
			e && this.isItem(e) && t.push(e);
		}
		return t;
	}
	activateNextItem() {
		let e = this.items, t = be(e, this.isActivatable);
		return t && (t.item.tabIndex = -1), Te(e, t, this.isActivatable, this.wrapNavigation());
	}
	activatePreviousItem() {
		let e = this.items, t = be(e, this.isActivatable);
		return t && (t.item.tabIndex = -1), Ee(e, t, this.isActivatable, this.wrapNavigation());
	}
}, Ae = new Set(Object.values(k)), je = class extends _ {
	get items() {
		return this.listController.items;
	}
	constructor() {
		super(), this.listController = new ke({
			isItem: (e) => e.hasAttribute("md-list-item"),
			getPossibleItems: () => this.slotItems,
			isRtl: () => getComputedStyle(this).direction === "rtl",
			deactivateItem: (e) => {
				e.tabIndex = -1;
			},
			activateItem: (e) => {
				e.tabIndex = 0;
			},
			isNavigableKey: (e) => Ae.has(e),
			isActivatable: (e) => !e.disabled && e.type !== "text"
		}), this.internals = this.attachInternals(), this.internals.role = "list", this.addEventListener("keydown", this.listController.handleKeydown);
	}
	render() {
		return T`
      <slot
        @deactivate-items=${this.listController.onDeactivateItems}
        @request-activation=${this.listController.onRequestActivation}
        @slotchange=${this.listController.onSlotchange}>
      </slot>
    `;
	}
	activateNextItem() {
		return this.listController.activateNextItem();
	}
	activatePreviousItem() {
		return this.listController.activatePreviousItem();
	}
};
d([c({ flatten: !0 })], je.prototype, "slotItems", void 0);
// node_modules/esp-web-tools/node_modules/@material/web/list/internal/list-styles.js
var Me = y`:host{background:var(--md-list-container-color, var(--md-sys-color-surface, #fef7ff));color:unset;display:flex;flex-direction:column;outline:none;padding:8px 0;position:relative}
`, Ne = class extends je {};
Ne.styles = [Me], customElements.define("ew-list", Ne);
// node_modules/esp-web-tools/node_modules/@material/web/labs/item/internal/item.js
var Pe = class extends _ {
	constructor() {
		super(...arguments), this.multiline = !1;
	}
	render() {
		return T`
      <slot name="container"></slot>
      <slot class="non-text" name="start"></slot>
      <div class="text">
        <slot name="overline" @slotchange=${this.handleTextSlotChange}></slot>
        <slot
          class="default-slot"
          @slotchange=${this.handleTextSlotChange}></slot>
        <slot name="headline" @slotchange=${this.handleTextSlotChange}></slot>
        <slot
          name="supporting-text"
          @slotchange=${this.handleTextSlotChange}></slot>
      </div>
      <slot class="non-text" name="trailing-supporting-text"></slot>
      <slot class="non-text" name="end"></slot>
    `;
	}
	handleTextSlotChange() {
		let e = !1, t = 0;
		for (let n of this.textSlots) if (Fe(n) && (t += 1), t > 1) {
			e = !0;
			break;
		}
		this.multiline = e;
	}
};
d([w({
	type: Boolean,
	reflect: !0
})], Pe.prototype, "multiline", void 0), d([ge(".text slot")], Pe.prototype, "textSlots", void 0);
function Fe(e) {
	for (let t of e.assignedNodes({ flatten: !0 })) {
		let e = t.nodeType === Node.ELEMENT_NODE, n = t.nodeType === Node.TEXT_NODE && t.textContent?.match(/\S/);
		if (e || n) return !0;
	}
	return !1;
}
// node_modules/esp-web-tools/node_modules/@material/web/labs/item/internal/item-styles.js
var Ie = y`:host{color:var(--md-sys-color-on-surface, #1d1b20);font-family:var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-body-large-size, 1rem);font-weight:var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400));line-height:var(--md-sys-typescale-body-large-line-height, 1.5rem);align-items:center;box-sizing:border-box;display:flex;gap:16px;min-height:56px;overflow:hidden;padding:12px 16px;position:relative;text-overflow:ellipsis}:host([multiline]){min-height:72px}[name=overline]{color:var(--md-sys-color-on-surface-variant, #49454f);font-family:var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-label-small-size, 0.6875rem);font-weight:var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500));line-height:var(--md-sys-typescale-label-small-line-height, 1rem)}[name=supporting-text]{color:var(--md-sys-color-on-surface-variant, #49454f);font-family:var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-body-medium-size, 0.875rem);font-weight:var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400));line-height:var(--md-sys-typescale-body-medium-line-height, 1.25rem)}[name=trailing-supporting-text]{color:var(--md-sys-color-on-surface-variant, #49454f);font-family:var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-label-small-size, 0.6875rem);font-weight:var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500));line-height:var(--md-sys-typescale-label-small-line-height, 1rem)}[name=container]::slotted(*){inset:0;position:absolute}.default-slot{display:inline}.default-slot,.text ::slotted(*){overflow:hidden;text-overflow:ellipsis}.text{display:flex;flex:1;flex-direction:column;overflow:hidden}
`, Le = class extends Pe {};
Le.styles = [Ie], Le = d([D("md-item")], Le);
// node_modules/lit-html/static.js
var Re = Symbol.for(""), ze = (e) => {
	if (e?.r === Re) return e?._$litStatic$;
}, Be = (e, ...t) => ({
	_$litStatic$: t.reduce((t, n, r) => t + ((e) => {
		if (e._$litStatic$ !== void 0) return e._$litStatic$;
		throw Error(`Value passed to 'literal' function must be a 'literal' result: ${e}. Use 'unsafeStatic' to pass non-literal values, but\n            take care to ensure page security.`);
	})(n) + e[r + 1], e[0]),
	r: Re
}), Ve = /* @__PURE__ */ new Map(), He = ((e) => (t, ...n) => {
	let r = n.length, i, a, o = [], s = [], c, l = 0, u = !1;
	for (; l < r;) {
		for (c = t[l]; l < r && (a = n[l], (i = ze(a)) !== void 0);) c += i + t[++l], u = !0;
		l !== r && s.push(a), o.push(c), l++;
	}
	if (l === r && o.push(t[r]), u) {
		let e = o.join("$$lit$$");
		(t = Ve.get(e)) === void 0 && (o.raw = o, Ve.set(e, t = o)), n = s;
	}
	return e(t, ...n);
})(T), Ue = h(_), We = class extends Ue {
	constructor() {
		super(...arguments), this.disabled = !1, this.type = "text", this.isListItem = !0, this.href = "", this.target = "";
	}
	get isDisabled() {
		return this.disabled && this.type !== "link";
	}
	willUpdate(e) {
		this.href && (this.type = "link"), super.willUpdate(e);
	}
	render() {
		return this.renderListItem(T`
      <md-item>
        <div slot="container">
          ${this.renderRipple()} ${this.renderFocusRing()}
        </div>
        <slot name="start" slot="start"></slot>
        <slot name="end" slot="end"></slot>
        ${this.renderBody()}
      </md-item>
    `);
	}
	renderListItem(e) {
		let t = this.type === "link", n;
		switch (this.type) {
			case "link":
				n = Be`a`;
				break;
			case "button":
				n = Be`button`;
				break;
			default:
			case "text": n = Be`li`;
		}
		let r = this.type !== "text", i = t && this.target ? this.target : S;
		return He`
      <${n}
        id="item"
        tabindex="${this.isDisabled || !r ? -1 : 0}"
        ?disabled=${this.isDisabled}
        role="listitem"
        aria-selected=${this.ariaSelected || S}
        aria-checked=${this.ariaChecked || S}
        aria-expanded=${this.ariaExpanded || S}
        aria-haspopup=${this.ariaHasPopup || S}
        class="list-item ${O(this.getRenderClasses())}"
        href=${this.href || S}
        target=${i}
        @focus=${this.onFocus}
      >${e}</${n}>
    `;
	}
	renderRipple() {
		return this.type === "text" ? S : T` <md-ripple
      part="ripple"
      for="item"
      ?disabled=${this.isDisabled}></md-ripple>`;
	}
	renderFocusRing() {
		return this.type === "text" ? S : T` <md-focus-ring
      @visibility-changed=${this.onFocusRingVisibilityChanged}
      part="focus-ring"
      for="item"
      inward></md-focus-ring>`;
	}
	onFocusRingVisibilityChanged(e) {}
	getRenderClasses() {
		return { disabled: this.isDisabled };
	}
	renderBody() {
		return T`
      <slot></slot>
      <slot name="overline" slot="overline"></slot>
      <slot name="headline" slot="headline"></slot>
      <slot name="supporting-text" slot="supporting-text"></slot>
      <slot
        name="trailing-supporting-text"
        slot="trailing-supporting-text"></slot>
    `;
	}
	onFocus() {
		this.tabIndex === -1 && this.dispatchEvent(De());
	}
	focus() {
		this.listItemRoot?.focus();
	}
	click() {
		this.listItemRoot ? this.listItemRoot.click() : super.click();
	}
};
We.shadowRootOptions = {
	..._.shadowRootOptions,
	delegatesFocus: !0
}, d([w({
	type: Boolean,
	reflect: !0
})], We.prototype, "disabled", void 0), d([w({ reflect: !0 })], We.prototype, "type", void 0), d([w({
	type: Boolean,
	attribute: "md-list-item",
	reflect: !0
})], We.prototype, "isListItem", void 0), d([w()], We.prototype, "href", void 0), d([w()], We.prototype, "target", void 0), d([a(".list-item")], We.prototype, "listItemRoot", void 0);
// node_modules/esp-web-tools/node_modules/@material/web/list/internal/listitem/list-item-styles.js
var Ge = y`:host{display:flex;-webkit-tap-highlight-color:rgba(0,0,0,0);--md-ripple-hover-color: var(--md-list-item-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-hover-opacity: var(--md-list-item-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-list-item-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-pressed-opacity: var(--md-list-item-pressed-state-layer-opacity, 0.12)}:host(:is([type=button]:not([disabled]),[type=link])){cursor:pointer}md-focus-ring{z-index:1;--md-focus-ring-shape: 8px}a,button,li{background:none;border:none;cursor:inherit;padding:0;margin:0;text-align:unset;text-decoration:none}.list-item{border-radius:inherit;display:flex;flex:1;max-width:inherit;min-width:inherit;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0);width:100%}.list-item.interactive{cursor:pointer}.list-item.disabled{opacity:var(--md-list-item-disabled-opacity, 0.3);pointer-events:none}[slot=container]{pointer-events:none}md-ripple{border-radius:inherit}md-item{border-radius:inherit;flex:1;height:100%;color:var(--md-list-item-label-text-color, var(--md-sys-color-on-surface, #1d1b20));font-family:var(--md-list-item-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-list-item-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));line-height:var(--md-list-item-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));font-weight:var(--md-list-item-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));min-height:var(--md-list-item-one-line-container-height, 56px);padding-top:var(--md-list-item-top-space, 12px);padding-bottom:var(--md-list-item-bottom-space, 12px);padding-inline-start:var(--md-list-item-leading-space, 16px);padding-inline-end:var(--md-list-item-trailing-space, 16px)}md-item[multiline]{min-height:var(--md-list-item-two-line-container-height, 72px)}[slot=supporting-text]{color:var(--md-list-item-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-list-item-supporting-text-font, var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-list-item-supporting-text-size, var(--md-sys-typescale-body-medium-size, 0.875rem));line-height:var(--md-list-item-supporting-text-line-height, var(--md-sys-typescale-body-medium-line-height, 1.25rem));font-weight:var(--md-list-item-supporting-text-weight, var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400)))}[slot=trailing-supporting-text]{color:var(--md-list-item-trailing-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-list-item-trailing-supporting-text-font, var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-list-item-trailing-supporting-text-size, var(--md-sys-typescale-label-small-size, 0.6875rem));line-height:var(--md-list-item-trailing-supporting-text-line-height, var(--md-sys-typescale-label-small-line-height, 1rem));font-weight:var(--md-list-item-trailing-supporting-text-weight, var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500)))}:is([slot=start],[slot=end])::slotted(*){fill:currentColor}[slot=start]{color:var(--md-list-item-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}[slot=end]{color:var(--md-list-item-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}@media(forced-colors: active){.disabled slot{color:GrayText}.list-item.disabled{color:GrayText;opacity:1}}
`, Ke = class extends We {};
Ke.styles = [Ge], customElements.define("ew-list-item", Ke);
// node_modules/esp-web-tools/dist/components/ew-divider.js
var qe = class extends o {};
qe.styles = [f], customElements.define("ew-divider", qe);
// node_modules/esp-web-tools/node_modules/@material/web/labs/behaviors/constraint-validation.js
var Je = Symbol("createValidator"), Ye = Symbol("getValidityAnchor"), Xe = Symbol("privateValidator"), Ze = Symbol("privateSyncValidity"), Qe = Symbol("privateCustomValidationMessage");
function $e(e) {
	var n;
	class r extends e {
		constructor() {
			super(...arguments), this[n] = "";
		}
		get validity() {
			return this[Ze](), this[t].validity;
		}
		get validationMessage() {
			return this[Ze](), this[t].validationMessage;
		}
		get willValidate() {
			return this[Ze](), this[t].willValidate;
		}
		checkValidity() {
			return this[Ze](), this[t].checkValidity();
		}
		reportValidity() {
			return this[Ze](), this[t].reportValidity();
		}
		setCustomValidity(e) {
			this[Qe] = e, this[Ze]();
		}
		requestUpdate(e, t, n) {
			super.requestUpdate(e, t, n), this[Ze]();
		}
		firstUpdated(e) {
			super.firstUpdated(e), this[Ze]();
		}
		[(n = Qe, Ze)]() {
			this[Xe] || (this[Xe] = this[Je]());
			let { validity: e, validationMessage: n } = this[Xe].getValidity(), r = !!this[Qe], i = this[Qe] || n;
			this[t].setValidity({
				...e,
				customError: r
			}, i, this[Ye]() ?? void 0);
		}
		[Je]() {
			throw Error("Implement [createValidator]");
		}
		[Ye]() {
			throw Error("Implement [getValidityAnchor]");
		}
	}
	return r;
}
// node_modules/esp-web-tools/node_modules/@material/web/labs/behaviors/form-associated.js
var et = Symbol("getFormValue"), tt = Symbol("getFormState");
function nt(e) {
	class n extends e {
		get form() {
			return this[t].form;
		}
		get labels() {
			return this[t].labels;
		}
		get name() {
			return this.getAttribute("name") ?? "";
		}
		set name(e) {
			this.setAttribute("name", e);
		}
		get disabled() {
			return this.hasAttribute("disabled");
		}
		set disabled(e) {
			this.toggleAttribute("disabled", e);
		}
		attributeChangedCallback(e, t, n) {
			if (e === "name" || e === "disabled") {
				let n = e === "disabled" ? t !== null : t;
				this.requestUpdate(e, n);
			} else super.attributeChangedCallback(e, t, n);
		}
		requestUpdate(e, n, r) {
			super.requestUpdate(e, n, r), this[t].setFormValue(this[et](), this[tt]());
		}
		[et]() {
			throw Error("Implement [getFormValue]");
		}
		[tt]() {
			return this[et]();
		}
		formDisabledCallback(e) {
			this.disabled = e;
		}
	}
	return n.formAssociated = !0, d([w({ noAccessor: !0 })], n.prototype, "name", null), d([w({
		type: Boolean,
		noAccessor: !0
	})], n.prototype, "disabled", null), n;
}
// node_modules/esp-web-tools/node_modules/@material/web/labs/behaviors/validators/validator.js
var rt = class {
	constructor(e) {
		this.getCurrentState = e, this.currentValidity = {
			validity: {},
			validationMessage: ""
		};
	}
	getValidity() {
		let e = this.getCurrentState();
		if (this.prevState && this.equals(this.prevState, e)) return this.currentValidity;
		let { validity: t, validationMessage: n } = this.computeValidity(e);
		return this.prevState = this.copy(e), this.currentValidity = {
			validationMessage: n,
			validity: {
				badInput: t.badInput,
				customError: t.customError,
				patternMismatch: t.patternMismatch,
				rangeOverflow: t.rangeOverflow,
				rangeUnderflow: t.rangeUnderflow,
				stepMismatch: t.stepMismatch,
				tooLong: t.tooLong,
				tooShort: t.tooShort,
				typeMismatch: t.typeMismatch,
				valueMissing: t.valueMissing
			}
		}, this.currentValidity;
	}
}, it = class extends rt {
	computeValidity(e) {
		return this.checkboxControl || (this.checkboxControl = document.createElement("input"), this.checkboxControl.type = "checkbox"), this.checkboxControl.checked = e.checked, this.checkboxControl.required = e.required, {
			validity: this.checkboxControl.validity,
			validationMessage: this.checkboxControl.validationMessage
		};
	}
	equals(e, t) {
		return e.checked === t.checked && e.required === t.required;
	}
	copy({ checked: e, required: t }) {
		return {
			checked: e,
			required: t
		};
	}
}, at = h($e(nt(s(_)))), ot = class extends at {
	constructor() {
		super(), this.checked = !1, this.indeterminate = !1, this.required = !1, this.value = "on", this.prevChecked = !1, this.prevDisabled = !1, this.prevIndeterminate = !1, this.addEventListener("click", (t) => {
			u(t) && this.input && (this.focus(), e(this.input));
		});
	}
	update(e) {
		(e.has("checked") || e.has("disabled") || e.has("indeterminate")) && (this.prevChecked = e.get("checked") ?? this.checked, this.prevDisabled = e.get("disabled") ?? this.disabled, this.prevIndeterminate = e.get("indeterminate") ?? this.indeterminate), super.update(e);
	}
	render() {
		let e = !this.prevChecked && !this.prevIndeterminate, t = this.prevChecked && !this.prevIndeterminate, n = this.prevIndeterminate, r = this.checked && !this.indeterminate, i = this.indeterminate, a = O({
			disabled: this.disabled,
			selected: r || i,
			unselected: !r && !i,
			checked: r,
			indeterminate: i,
			"prev-unselected": e,
			"prev-checked": t,
			"prev-indeterminate": n,
			"prev-disabled": this.prevDisabled
		}), { ariaLabel: o, ariaInvalid: s } = this;
		return T`
      <div class="container ${a}">
        <input
          type="checkbox"
          id="input"
          aria-checked=${i ? "mixed" : S}
          aria-label=${o || S}
          aria-invalid=${s || S}
          ?disabled=${this.disabled}
          ?required=${this.required}
          .indeterminate=${this.indeterminate}
          .checked=${this.checked}
          @input=${this.handleInput}
          @change=${this.handleChange} />

        <div class="outline"></div>
        <div class="background"></div>
        <md-focus-ring part="focus-ring" for="input"></md-focus-ring>
        <md-ripple for="input" ?disabled=${this.disabled}></md-ripple>
        <svg class="icon" viewBox="0 0 18 18" aria-hidden="true">
          <rect class="mark short" />
          <rect class="mark long" />
        </svg>
      </div>
    `;
	}
	handleInput(e) {
		let t = e.target;
		this.checked = t.checked, this.indeterminate = t.indeterminate;
	}
	handleChange(e) {
		l(this, e);
	}
	[et]() {
		return !this.checked || this.indeterminate ? null : this.value;
	}
	[tt]() {
		return String(this.checked);
	}
	formResetCallback() {
		this.checked = this.hasAttribute("checked");
	}
	formStateRestoreCallback(e) {
		this.checked = e === "true";
	}
	[Je]() {
		return new it(() => this);
	}
	[Ye]() {
		return this.input;
	}
};
ot.shadowRootOptions = {
	..._.shadowRootOptions,
	delegatesFocus: !0
}, d([w({ type: Boolean })], ot.prototype, "checked", void 0), d([w({ type: Boolean })], ot.prototype, "indeterminate", void 0), d([w({ type: Boolean })], ot.prototype, "required", void 0), d([w()], ot.prototype, "value", void 0), d([g()], ot.prototype, "prevChecked", void 0), d([g()], ot.prototype, "prevDisabled", void 0), d([g()], ot.prototype, "prevIndeterminate", void 0), d([a("input")], ot.prototype, "input", void 0);
// node_modules/esp-web-tools/node_modules/@material/web/checkbox/internal/checkbox-styles.js
var st = y`:host{border-start-start-radius:var(--md-checkbox-container-shape-start-start, var(--md-checkbox-container-shape, 2px));border-start-end-radius:var(--md-checkbox-container-shape-start-end, var(--md-checkbox-container-shape, 2px));border-end-end-radius:var(--md-checkbox-container-shape-end-end, var(--md-checkbox-container-shape, 2px));border-end-start-radius:var(--md-checkbox-container-shape-end-start, var(--md-checkbox-container-shape, 2px));display:inline-flex;height:var(--md-checkbox-container-size, 18px);position:relative;vertical-align:top;width:var(--md-checkbox-container-size, 18px);-webkit-tap-highlight-color:rgba(0,0,0,0);cursor:pointer}:host([disabled]){cursor:default}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--md-checkbox-container-size, 18px))/2)}md-focus-ring{height:44px;inset:unset;width:44px}input{appearance:none;height:48px;margin:0;opacity:0;outline:none;position:absolute;width:48px;z-index:1;cursor:inherit}:host([touch-target=none]) input{height:100%;width:100%}.container{border-radius:inherit;display:flex;height:100%;place-content:center;place-items:center;position:relative;width:100%}.outline,.background,.icon{inset:0;position:absolute}.outline,.background{border-radius:inherit}.outline{border-color:var(--md-checkbox-outline-color, var(--md-sys-color-on-surface-variant, #49454f));border-style:solid;border-width:var(--md-checkbox-outline-width, 2px);box-sizing:border-box}.background{background-color:var(--md-checkbox-selected-container-color, var(--md-sys-color-primary, #6750a4))}.background,.icon{opacity:0;transition-duration:150ms,50ms;transition-property:transform,opacity;transition-timing-function:cubic-bezier(0.3, 0, 0.8, 0.15),linear;transform:scale(0.6)}:where(.selected) :is(.background,.icon){opacity:1;transition-duration:350ms,50ms;transition-timing-function:cubic-bezier(0.05, 0.7, 0.1, 1),linear;transform:scale(1)}md-ripple{border-radius:var(--md-checkbox-state-layer-shape, var(--md-sys-shape-corner-full, 9999px));height:var(--md-checkbox-state-layer-size, 40px);inset:unset;width:var(--md-checkbox-state-layer-size, 40px);--md-ripple-hover-color: var(--md-checkbox-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-hover-opacity: var(--md-checkbox-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-checkbox-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--md-ripple-pressed-opacity: var(--md-checkbox-pressed-state-layer-opacity, 0.12)}.selected md-ripple{--md-ripple-hover-color: var(--md-checkbox-selected-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--md-ripple-hover-opacity: var(--md-checkbox-selected-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-checkbox-selected-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-pressed-opacity: var(--md-checkbox-selected-pressed-state-layer-opacity, 0.12)}.icon{fill:var(--md-checkbox-selected-icon-color, var(--md-sys-color-on-primary, #fff));height:var(--md-checkbox-icon-size, 18px);width:var(--md-checkbox-icon-size, 18px)}.mark.short{height:2px;transition-property:transform,height;width:2px}.mark.long{height:2px;transition-property:transform,width;width:10px}.mark{animation-duration:150ms;animation-timing-function:cubic-bezier(0.3, 0, 0.8, 0.15);transition-duration:150ms;transition-timing-function:cubic-bezier(0.3, 0, 0.8, 0.15)}.selected .mark{animation-duration:350ms;animation-timing-function:cubic-bezier(0.05, 0.7, 0.1, 1);transition-duration:350ms;transition-timing-function:cubic-bezier(0.05, 0.7, 0.1, 1)}.checked .mark,.prev-checked.unselected .mark{transform:scaleY(-1) translate(7px, -14px) rotate(45deg)}.checked .mark.short,.prev-checked.unselected .mark.short{height:5.6568542495px}.checked .mark.long,.prev-checked.unselected .mark.long{width:11.313708499px}.indeterminate .mark,.prev-indeterminate.unselected .mark{transform:scaleY(-1) translate(4px, -10px) rotate(0deg)}.prev-unselected .mark{transition-property:none}.prev-unselected.checked .mark.long{animation-name:prev-unselected-to-checked}@keyframes prev-unselected-to-checked{from{width:0}}:where(:hover) .outline{border-color:var(--md-checkbox-hover-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-hover-outline-width, 2px)}:where(:hover) .background{background:var(--md-checkbox-selected-hover-container-color, var(--md-sys-color-primary, #6750a4))}:where(:hover) .icon{fill:var(--md-checkbox-selected-hover-icon-color, var(--md-sys-color-on-primary, #fff))}:where(:focus-within) .outline{border-color:var(--md-checkbox-focus-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-focus-outline-width, 2px)}:where(:focus-within) .background{background:var(--md-checkbox-selected-focus-container-color, var(--md-sys-color-primary, #6750a4))}:where(:focus-within) .icon{fill:var(--md-checkbox-selected-focus-icon-color, var(--md-sys-color-on-primary, #fff))}:where(:active) .outline{border-color:var(--md-checkbox-pressed-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-pressed-outline-width, 2px)}:where(:active) .background{background:var(--md-checkbox-selected-pressed-container-color, var(--md-sys-color-primary, #6750a4))}:where(:active) .icon{fill:var(--md-checkbox-selected-pressed-icon-color, var(--md-sys-color-on-primary, #fff))}:where(.disabled,.prev-disabled) :is(.background,.icon,.mark){animation-duration:0s;transition-duration:0s}:where(.disabled) .outline{border-color:var(--md-checkbox-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-disabled-outline-width, 2px);opacity:var(--md-checkbox-disabled-container-opacity, 0.38)}:where(.selected.disabled) .outline{visibility:hidden}:where(.selected.disabled) .background{background:var(--md-checkbox-selected-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-checkbox-selected-disabled-container-opacity, 0.38)}:where(.disabled) .icon{fill:var(--md-checkbox-selected-disabled-icon-color, var(--md-sys-color-surface, #fef7ff))}@media(forced-colors: active){.background{background-color:CanvasText}.selected.disabled .background{background-color:GrayText;opacity:1}.outline{border-color:CanvasText}.disabled .outline{border-color:GrayText;opacity:1}.icon{fill:Canvas}}
`, ct = class extends ot {};
ct.styles = [st], customElements.define("ew-checkbox", ct);
// node_modules/esp-web-tools/dist/util/console-color.js
var lt = class {
	constructor(e) {
		this.targetElement = e, this.state = {
			bold: !1,
			italic: !1,
			underline: !1,
			strikethrough: !1,
			foregroundColor: null,
			backgroundColor: null,
			carriageReturn: !1,
			lines: [],
			secret: !1
		};
	}
	logs() {
		return this.targetElement.innerText;
	}
	processLine(e) {
		let t = /(?:\033|\\033)(?:\[(.*?)[@-~]|\].*?(?:\007|\033\\))/g, n = 0, r = document.createElement("span");
		r.classList.add("line");
		let i = (e) => {
			if (e === "") return;
			let t = document.createElement("span");
			if (this.state.bold && t.classList.add("log-bold"), this.state.italic && t.classList.add("log-italic"), this.state.underline && t.classList.add("log-underline"), this.state.strikethrough && t.classList.add("log-strikethrough"), this.state.secret && t.classList.add("log-secret"), this.state.foregroundColor !== null && t.classList.add(`log-fg-${this.state.foregroundColor}`), this.state.backgroundColor !== null && t.classList.add(`log-bg-${this.state.backgroundColor}`), t.appendChild(document.createTextNode(e)), r.appendChild(t), this.state.secret) {
				let e = document.createElement("span");
				e.classList.add("log-secret-redacted"), e.appendChild(document.createTextNode("[redacted]")), r.appendChild(e);
			}
		};
		for (;;) {
			let r = t.exec(e);
			if (r === null) break;
			let a = r.index;
			if (i(e.substring(n, a)), n = a + r[0].length, r[1] !== void 0) for (let e of r[1].split(";")) switch (parseInt(e)) {
				case 0:
					this.state.bold = !1, this.state.italic = !1, this.state.underline = !1, this.state.strikethrough = !1, this.state.foregroundColor = null, this.state.backgroundColor = null, this.state.secret = !1;
					break;
				case 1:
					this.state.bold = !0;
					break;
				case 3:
					this.state.italic = !0;
					break;
				case 4:
					this.state.underline = !0;
					break;
				case 5:
					this.state.secret = !0;
					break;
				case 6:
					this.state.secret = !1;
					break;
				case 9:
					this.state.strikethrough = !0;
					break;
				case 22:
					this.state.bold = !1;
					break;
				case 23:
					this.state.italic = !1;
					break;
				case 24:
					this.state.underline = !1;
					break;
				case 29:
					this.state.strikethrough = !1;
					break;
				case 30:
					this.state.foregroundColor = "black";
					break;
				case 31:
					this.state.foregroundColor = "red";
					break;
				case 32:
					this.state.foregroundColor = "green";
					break;
				case 33:
					this.state.foregroundColor = "yellow";
					break;
				case 34:
					this.state.foregroundColor = "blue";
					break;
				case 35:
					this.state.foregroundColor = "magenta";
					break;
				case 36:
					this.state.foregroundColor = "cyan";
					break;
				case 37:
					this.state.foregroundColor = "white";
					break;
				case 39:
					this.state.foregroundColor = null;
					break;
				case 41:
					this.state.backgroundColor = "red";
					break;
				case 42:
					this.state.backgroundColor = "green";
					break;
				case 43:
					this.state.backgroundColor = "yellow";
					break;
				case 44:
					this.state.backgroundColor = "blue";
					break;
				case 45:
					this.state.backgroundColor = "magenta";
					break;
				case 46:
					this.state.backgroundColor = "cyan";
					break;
				case 47:
					this.state.backgroundColor = "white";
					break;
				case 40:
				case 49: this.state.backgroundColor = null;
			}
		}
		return i(e.substring(n)), r;
	}
	processLines() {
		let e = this.targetElement.scrollTop > this.targetElement.scrollHeight - this.targetElement.offsetHeight - 50, t = this.state.carriageReturn, n = document.createDocumentFragment();
		if (this.state.lines.length != 0) {
			for (let e of this.state.lines) this.state.carriageReturn && e !== "\n" && n.childElementCount && n.removeChild(n.lastChild), n.appendChild(this.processLine(e)), this.state.carriageReturn = e.includes("\r");
			t && this.state.lines[0] !== "\n" ? this.targetElement.replaceChild(n, this.targetElement.lastChild) : this.targetElement.appendChild(n), this.state.lines = [], e && (this.targetElement.scrollTop = this.targetElement.scrollHeight);
		}
	}
	addLine(e) {
		this.state.lines.length == 0 && setTimeout(() => this.processLines(), 0), this.state.lines.push(e);
	}
}, ut = "\n  .log {\n    flex: 1;\n    background-color: #1c1c1c;\n    font-family: \"SFMono-Regular\", Consolas, \"Liberation Mono\", Menlo, Courier,\n      monospace;\n    font-size: 12px;\n    padding: 16px;\n    overflow: auto;\n    line-height: 1.45;\n    border-radius: 3px;\n    white-space: pre-wrap;\n    overflow-wrap: break-word;\n    color: #ddd;\n  }\n\n  .log-bold {\n    font-weight: bold;\n  }\n  .log-italic {\n    font-style: italic;\n  }\n  .log-underline {\n    text-decoration: underline;\n  }\n  .log-strikethrough {\n    text-decoration: line-through;\n  }\n  .log-underline.log-strikethrough {\n    text-decoration: underline line-through;\n  }\n  .log-secret {\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n  }\n  .log-secret-redacted {\n    opacity: 0;\n    width: 1px;\n    font-size: 1px;\n  }\n  .log-fg-black {\n    color: rgb(128, 128, 128);\n  }\n  .log-fg-red {\n    color: rgb(255, 0, 0);\n  }\n  .log-fg-green {\n    color: rgb(0, 255, 0);\n  }\n  .log-fg-yellow {\n    color: rgb(255, 255, 0);\n  }\n  .log-fg-blue {\n    color: rgb(0, 0, 255);\n  }\n  .log-fg-magenta {\n    color: rgb(255, 0, 255);\n  }\n  .log-fg-cyan {\n    color: rgb(0, 255, 255);\n  }\n  .log-fg-white {\n    color: rgb(187, 187, 187);\n  }\n  .log-bg-black {\n    background-color: rgb(0, 0, 0);\n  }\n  .log-bg-red {\n    background-color: rgb(255, 0, 0);\n  }\n  .log-bg-green {\n    background-color: rgb(0, 255, 0);\n  }\n  .log-bg-yellow {\n    background-color: rgb(255, 255, 0);\n  }\n  .log-bg-blue {\n    background-color: rgb(0, 0, 255);\n  }\n  .log-bg-magenta {\n    background-color: rgb(255, 0, 255);\n  }\n  .log-bg-cyan {\n    background-color: rgb(0, 255, 255);\n  }\n  .log-bg-white {\n    background-color: rgb(255, 255, 255);\n  }\n", dt = (e) => new Promise((t) => setTimeout(t, e)), ft = class {
	constructor() {
		this.chunks = "";
	}
	transform(e, t) {
		this.chunks += e;
		let n = this.chunks.split(/\r?\n/);
		this.chunks = n.pop(), n.forEach((e) => t.enqueue(e + "\r\n"));
	}
	flush(e) {
		e.enqueue(this.chunks);
	}
}, pt = class {
	transform(e, t) {
		let n = /* @__PURE__ */ new Date(), r = n.getHours().toString().padStart(2, "0"), i = n.getMinutes().toString().padStart(2, "0"), a = n.getSeconds().toString().padStart(2, "0");
		t.enqueue(`[${r}:${i}:${a}]${e}`);
	}
}, A = class extends Error {}, mt = 4, ht = 0, gt = 1, _t = 2;
function vt(e) {
	let t = e.length;
	for (; --t >= 0;) e[t] = 0;
}
var yt = 29, bt = 256, xt = 286, St = 30, Ct = 19, wt = 573, Tt = 15, Et = 16, Dt = 7, Ot = 256, kt = 16, At = 17, jt = 18, Mt = new Uint8Array([
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	1,
	1,
	1,
	1,
	2,
	2,
	2,
	2,
	3,
	3,
	3,
	3,
	4,
	4,
	4,
	4,
	5,
	5,
	5,
	5,
	0
]), Nt = new Uint8Array([
	0,
	0,
	0,
	0,
	1,
	1,
	2,
	2,
	3,
	3,
	4,
	4,
	5,
	5,
	6,
	6,
	7,
	7,
	8,
	8,
	9,
	9,
	10,
	10,
	11,
	11,
	12,
	12,
	13,
	13
]), Pt = new Uint8Array([
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	2,
	3,
	7
]), Ft = new Uint8Array([
	16,
	17,
	18,
	0,
	8,
	7,
	9,
	6,
	10,
	5,
	11,
	4,
	12,
	3,
	13,
	2,
	14,
	1,
	15
]), It = 512, Lt = Array(576);
vt(Lt);
var Rt = Array(60);
vt(Rt);
var zt = Array(It);
vt(zt);
var Bt = Array(256);
vt(Bt);
var Vt = Array(yt);
vt(Vt);
var Ht = Array(St);
vt(Ht);
function Ut(e, t, n, r, i) {
	this.static_tree = e, this.extra_bits = t, this.extra_base = n, this.elems = r, this.max_length = i, this.has_stree = e && e.length;
}
var Wt, Gt, Kt;
function qt(e, t) {
	this.dyn_tree = e, this.max_code = 0, this.stat_desc = t;
}
var Jt = (e) => e < 256 ? zt[e] : zt[256 + (e >>> 7)], Yt = (e, t) => {
	e.pending_buf[e.pending++] = t & 255, e.pending_buf[e.pending++] = t >>> 8 & 255;
}, j = (e, t, n) => {
	e.bi_valid > Et - n ? (e.bi_buf |= t << e.bi_valid & 65535, Yt(e, e.bi_buf), e.bi_buf = t >> Et - e.bi_valid, e.bi_valid += n - Et) : (e.bi_buf |= t << e.bi_valid & 65535, e.bi_valid += n);
}, M = (e, t, n) => {
	j(e, n[t * 2], n[t * 2 + 1]);
}, Xt = (e, t) => {
	let n = 0;
	do
		n |= e & 1, e >>>= 1, n <<= 1;
	while (--t > 0);
	return n >>> 1;
}, Zt = (e) => {
	e.bi_valid === 16 ? (Yt(e, e.bi_buf), e.bi_buf = 0, e.bi_valid = 0) : e.bi_valid >= 8 && (e.pending_buf[e.pending++] = e.bi_buf & 255, e.bi_buf >>= 8, e.bi_valid -= 8);
}, Qt = (e, t) => {
	let n = t.dyn_tree, r = t.max_code, i = t.stat_desc.static_tree, a = t.stat_desc.has_stree, o = t.stat_desc.extra_bits, s = t.stat_desc.extra_base, c = t.stat_desc.max_length, l, u, d, f, p, m, h = 0;
	for (f = 0; f <= Tt; f++) e.bl_count[f] = 0;
	for (n[e.heap[e.heap_max] * 2 + 1] = 0, l = e.heap_max + 1; l < wt; l++) u = e.heap[l], f = n[n[u * 2 + 1] * 2 + 1] + 1, f > c && (f = c, h++), n[u * 2 + 1] = f, u > r || (e.bl_count[f]++, p = 0, u >= s && (p = o[u - s]), m = n[u * 2], e.opt_len += m * (f + p), a && (e.static_len += m * (i[u * 2 + 1] + p)));
	if (h !== 0) {
		do {
			for (f = c - 1; e.bl_count[f] === 0;) f--;
			e.bl_count[f]--, e.bl_count[f + 1] += 2, e.bl_count[c]--, h -= 2;
		} while (h > 0);
		for (f = c; f !== 0; f--) for (u = e.bl_count[f]; u !== 0;) d = e.heap[--l], d > r || (n[d * 2 + 1] !== f && (e.opt_len += (f - n[d * 2 + 1]) * n[d * 2], n[d * 2 + 1] = f), u--);
	}
}, $t = (e, t, n) => {
	let r = Array(16), i = 0, a, o;
	for (a = 1; a <= Tt; a++) i = i + n[a - 1] << 1, r[a] = i;
	for (o = 0; o <= t; o++) {
		let t = e[o * 2 + 1];
		t !== 0 && (e[o * 2] = Xt(r[t]++, t));
	}
}, en = () => {
	let e, t, n, r, i, a = Array(16);
	for (n = 0, r = 0; r < 28; r++) for (Vt[r] = n, e = 0; e < 1 << Mt[r]; e++) Bt[n++] = r;
	for (Bt[n - 1] = r, i = 0, r = 0; r < 16; r++) for (Ht[r] = i, e = 0; e < 1 << Nt[r]; e++) zt[i++] = r;
	for (i >>= 7; r < St; r++) for (Ht[r] = i << 7, e = 0; e < 1 << Nt[r] - 7; e++) zt[256 + i++] = r;
	for (t = 0; t <= Tt; t++) a[t] = 0;
	for (e = 0; e <= 143;) Lt[e * 2 + 1] = 8, e++, a[8]++;
	for (; e <= 255;) Lt[e * 2 + 1] = 9, e++, a[9]++;
	for (; e <= 279;) Lt[e * 2 + 1] = 7, e++, a[7]++;
	for (; e <= 287;) Lt[e * 2 + 1] = 8, e++, a[8]++;
	for ($t(Lt, 287, a), e = 0; e < St; e++) Rt[e * 2 + 1] = 5, Rt[e * 2] = Xt(e, 5);
	Wt = new Ut(Lt, Mt, 257, xt, Tt), Gt = new Ut(Rt, Nt, 0, St, Tt), Kt = new Ut([], Pt, 0, Ct, Dt);
}, tn = (e) => {
	let t = 0;
	for (; t < xt; t++) e.dyn_ltree[t * 2] = 0;
	for (t = 0; t < St; t++) e.dyn_dtree[t * 2] = 0;
	for (t = 0; t < Ct; t++) e.bl_tree[t * 2] = 0;
	e.dyn_ltree[Ot * 2] = 1, e.opt_len = e.static_len = 0, e.sym_next = e.matches = 0;
}, nn = (e) => {
	e.bi_valid > 8 ? Yt(e, e.bi_buf) : e.bi_valid > 0 && (e.pending_buf[e.pending++] = e.bi_buf), e.bi_buf = 0, e.bi_valid = 0;
}, rn = (e, t, n, r) => {
	let i = t * 2, a = n * 2;
	return e[i] < e[a] || e[i] === e[a] && r[t] <= r[n];
}, an = (e, t, n) => {
	let r = e.heap[n], i = n << 1;
	for (; i <= e.heap_len && (i < e.heap_len && rn(t, e.heap[i + 1], e.heap[i], e.depth) && i++, !rn(t, r, e.heap[i], e.depth));) e.heap[n] = e.heap[i], n = i, i <<= 1;
	e.heap[n] = r;
}, on = (e, t, n) => {
	let r, i, a = 0, o, s;
	if (e.sym_next !== 0) do
		r = e.pending_buf[e.sym_buf + a++] & 255, r += (e.pending_buf[e.sym_buf + a++] & 255) << 8, i = e.pending_buf[e.sym_buf + a++], r === 0 ? M(e, i, t) : (o = Bt[i], M(e, o + bt + 1, t), s = Mt[o], s !== 0 && (i -= Vt[o], j(e, i, s)), r--, o = Jt(r), M(e, o, n), s = Nt[o], s !== 0 && (r -= Ht[o], j(e, r, s)));
	while (a < e.sym_next);
	M(e, Ot, t);
}, sn = (e, t) => {
	let n = t.dyn_tree, r = t.stat_desc.static_tree, i = t.stat_desc.has_stree, a = t.stat_desc.elems, o, s, c = -1, l;
	for (e.heap_len = 0, e.heap_max = wt, o = 0; o < a; o++) n[o * 2] === 0 ? n[o * 2 + 1] = 0 : (e.heap[++e.heap_len] = c = o, e.depth[o] = 0);
	for (; e.heap_len < 2;) l = e.heap[++e.heap_len] = c < 2 ? ++c : 0, n[l * 2] = 1, e.depth[l] = 0, e.opt_len--, i && (e.static_len -= r[l * 2 + 1]);
	for (t.max_code = c, o = e.heap_len >> 1; o >= 1; o--) an(e, n, o);
	l = a;
	do
		o = e.heap[1], e.heap[1] = e.heap[e.heap_len--], an(e, n, 1), s = e.heap[1], e.heap[--e.heap_max] = o, e.heap[--e.heap_max] = s, n[l * 2] = n[o * 2] + n[s * 2], e.depth[l] = (e.depth[o] >= e.depth[s] ? e.depth[o] : e.depth[s]) + 1, n[o * 2 + 1] = n[s * 2 + 1] = l, e.heap[1] = l++, an(e, n, 1);
	while (e.heap_len >= 2);
	e.heap[--e.heap_max] = e.heap[1], Qt(e, t), $t(n, c, e.bl_count);
}, cn = (e, t, n) => {
	let r, i = -1, a, o = t[1], s = 0, c = 7, l = 4;
	for (o === 0 && (c = 138, l = 3), t[(n + 1) * 2 + 1] = 65535, r = 0; r <= n; r++) a = o, o = t[(r + 1) * 2 + 1], ++s < c && a === o || (s < l ? e.bl_tree[a * 2] += s : a === 0 ? s <= 10 ? e.bl_tree[34]++ : e.bl_tree[36]++ : (a !== i && e.bl_tree[a * 2]++, e.bl_tree[32]++), s = 0, i = a, o === 0 ? (c = 138, l = 3) : a === o ? (c = 6, l = 3) : (c = 7, l = 4));
}, ln = (e, t, n) => {
	let r, i = -1, a, o = t[1], s = 0, c = 7, l = 4;
	for (o === 0 && (c = 138, l = 3), r = 0; r <= n; r++) if (a = o, o = t[(r + 1) * 2 + 1], !(++s < c && a === o)) {
		if (s < l) do
			M(e, a, e.bl_tree);
		while (--s !== 0);
		else a === 0 ? s <= 10 ? (M(e, At, e.bl_tree), j(e, s - 3, 3)) : (M(e, jt, e.bl_tree), j(e, s - 11, 7)) : (a !== i && (M(e, a, e.bl_tree), s--), M(e, kt, e.bl_tree), j(e, s - 3, 2));
		s = 0, i = a, o === 0 ? (c = 138, l = 3) : a === o ? (c = 6, l = 3) : (c = 7, l = 4);
	}
}, un = (e) => {
	let t;
	for (cn(e, e.dyn_ltree, e.l_desc.max_code), cn(e, e.dyn_dtree, e.d_desc.max_code), sn(e, e.bl_desc), t = 18; t >= 3 && e.bl_tree[Ft[t] * 2 + 1] === 0; t--);
	return e.opt_len += 3 * (t + 1) + 5 + 5 + 4, t;
}, dn = (e, t, n, r) => {
	let i;
	for (j(e, t - 257, 5), j(e, n - 1, 5), j(e, r - 4, 4), i = 0; i < r; i++) j(e, e.bl_tree[Ft[i] * 2 + 1], 3);
	ln(e, e.dyn_ltree, t - 1), ln(e, e.dyn_dtree, n - 1);
}, fn = (e) => {
	let t = 4093624447, n = 0;
	for (; n <= 31; n++, t >>>= 1) if (t & 1 && e.dyn_ltree[n * 2] !== 0) return ht;
	if (e.dyn_ltree[18] !== 0 || e.dyn_ltree[20] !== 0 || e.dyn_ltree[26] !== 0) return gt;
	for (n = 32; n < bt; n++) if (e.dyn_ltree[n * 2] !== 0) return gt;
	return ht;
}, pn = !1, mn = (e) => {
	pn ||= (en(), !0), e.l_desc = new qt(e.dyn_ltree, Wt), e.d_desc = new qt(e.dyn_dtree, Gt), e.bl_desc = new qt(e.bl_tree, Kt), e.bi_buf = 0, e.bi_valid = 0, tn(e);
}, hn = (e, t, n, r) => {
	j(e, 0 + +!!r, 3), nn(e), Yt(e, n), Yt(e, ~n), n && e.pending_buf.set(e.window.subarray(t, t + n), e.pending), e.pending += n;
}, gn = {
	_tr_init: mn,
	_tr_stored_block: hn,
	_tr_flush_block: (e, t, n, r) => {
		let i, a, o = 0;
		e.level > 0 ? (e.strm.data_type === _t && (e.strm.data_type = fn(e)), sn(e, e.l_desc), sn(e, e.d_desc), o = un(e), i = e.opt_len + 3 + 7 >>> 3, a = e.static_len + 3 + 7 >>> 3, a <= i && (i = a)) : i = a = n + 5, n + 4 <= i && t !== -1 ? hn(e, t, n, r) : e.strategy === mt || a === i ? (j(e, 2 + +!!r, 3), on(e, Lt, Rt)) : (j(e, 4 + +!!r, 3), dn(e, e.l_desc.max_code + 1, e.d_desc.max_code + 1, o + 1), on(e, e.dyn_ltree, e.dyn_dtree)), tn(e), r && nn(e);
	},
	_tr_tally: (e, t, n) => (e.pending_buf[e.sym_buf + e.sym_next++] = t, e.pending_buf[e.sym_buf + e.sym_next++] = t >> 8, e.pending_buf[e.sym_buf + e.sym_next++] = n, t === 0 ? e.dyn_ltree[n * 2]++ : (e.matches++, t--, e.dyn_ltree[(Bt[n] + bt + 1) * 2]++, e.dyn_dtree[Jt(t) * 2]++), e.sym_next === e.sym_end),
	_tr_align: (e) => {
		j(e, 2, 3), M(e, Ot, Lt), Zt(e);
	}
}, _n = (e, t, n, r) => {
	let i = e & 65535, a = e >>> 16 & 65535, o = 0;
	for (; n !== 0;) {
		o = n > 2e3 ? 2e3 : n, n -= o;
		do
			i = i + t[r++] | 0, a = a + i | 0;
		while (--o);
		i %= 65521, a %= 65521;
	}
	return i | a << 16;
}, vn = new Uint32Array((() => {
	let e, t = [];
	for (var n = 0; n < 256; n++) {
		e = n;
		for (var r = 0; r < 8; r++) e = e & 1 ? 3988292384 ^ e >>> 1 : e >>> 1;
		t[n] = e;
	}
	return t;
})()), N = (e, t, n, r) => {
	let i = vn, a = r + n;
	e ^= -1;
	for (let n = r; n < a; n++) e = e >>> 8 ^ i[(e ^ t[n]) & 255];
	return e ^ -1;
}, yn = {
	2: "need dictionary",
	1: "stream end",
	0: "",
	"-1": "file error",
	"-2": "stream error",
	"-3": "data error",
	"-4": "insufficient memory",
	"-5": "buffer error",
	"-6": "incompatible version"
}, bn = {
	Z_NO_FLUSH: 0,
	Z_PARTIAL_FLUSH: 1,
	Z_SYNC_FLUSH: 2,
	Z_FULL_FLUSH: 3,
	Z_FINISH: 4,
	Z_BLOCK: 5,
	Z_TREES: 6,
	Z_OK: 0,
	Z_STREAM_END: 1,
	Z_NEED_DICT: 2,
	Z_ERRNO: -1,
	Z_STREAM_ERROR: -2,
	Z_DATA_ERROR: -3,
	Z_MEM_ERROR: -4,
	Z_BUF_ERROR: -5,
	Z_NO_COMPRESSION: 0,
	Z_BEST_SPEED: 1,
	Z_BEST_COMPRESSION: 9,
	Z_DEFAULT_COMPRESSION: -1,
	Z_FILTERED: 1,
	Z_HUFFMAN_ONLY: 2,
	Z_RLE: 3,
	Z_FIXED: 4,
	Z_DEFAULT_STRATEGY: 0,
	Z_BINARY: 0,
	Z_TEXT: 1,
	Z_UNKNOWN: 2,
	Z_DEFLATED: 8
}, { _tr_init: xn, _tr_stored_block: Sn, _tr_flush_block: Cn, _tr_tally: wn, _tr_align: Tn } = gn, { Z_NO_FLUSH: En, Z_PARTIAL_FLUSH: Dn, Z_FULL_FLUSH: On, Z_FINISH: P, Z_BLOCK: kn, Z_OK: F, Z_STREAM_END: An, Z_STREAM_ERROR: I, Z_DATA_ERROR: jn, Z_BUF_ERROR: Mn, Z_DEFAULT_COMPRESSION: Nn, Z_FILTERED: Pn, Z_HUFFMAN_ONLY: Fn, Z_RLE: In, Z_FIXED: Ln, Z_DEFAULT_STRATEGY: Rn, Z_UNKNOWN: zn, Z_DEFLATED: Bn } = bn, Vn = 9, Hn = 15, Un = 8, Wn = 573, L = 3, Gn = 258, R = 262, Kn = 32, qn = 42, Jn = 57, Yn = 69, Xn = 73, Zn = 91, Qn = 103, $n = 113, er = 666, z = 1, tr = 2, nr = 3, rr = 4, ir = 3, ar = (e, t) => (e.msg = yn[t], t), or = (e) => e * 2 - (e > 4 ? 9 : 0), sr = (e) => {
	let t = e.length;
	for (; --t >= 0;) e[t] = 0;
}, cr = (e) => {
	let t, n, r, i = e.w_size;
	t = e.hash_size, r = t;
	do
		n = e.head[--r], e.head[r] = n >= i ? n - i : 0;
	while (--t);
	t = i, r = t;
	do
		n = e.prev[--r], e.prev[r] = n >= i ? n - i : 0;
	while (--t);
}, lr = (e, t, n) => (t << e.hash_shift ^ n) & e.hash_mask, ur = (e, t) => {
	let n;
	if (e.legacy_hash) n = e.ins_h = lr(e, e.ins_h, e.window[t + L - 1]);
	else {
		let r = e.window, i = r[t] | r[t + 1] << 8 | r[t + 2] << 16 | r[t + 3] << 24;
		n = e.ins_h = Math.imul(i, 66521) + 66521 >>> 16 & e.hash_mask;
	}
	let r = e.prev[t & e.w_mask] = e.head[n];
	return e.head[n] = t, r;
}, B = (e) => {
	let t = e.state, n = t.pending;
	n > e.avail_out && (n = e.avail_out), n !== 0 && (e.output.set(t.pending_buf.subarray(t.pending_out, t.pending_out + n), e.next_out), e.next_out += n, t.pending_out += n, e.total_out += n, e.avail_out -= n, t.pending -= n, t.pending === 0 && (t.pending_out = 0));
}, V = (e, t) => {
	Cn(e, e.block_start >= 0 ? e.block_start : -1, e.strstart - e.block_start, t), e.block_start = e.strstart, B(e.strm);
}, H = (e, t) => {
	e.pending_buf[e.pending++] = t;
}, dr = (e, t) => {
	e.pending_buf[e.pending++] = t >>> 8 & 255, e.pending_buf[e.pending++] = t & 255;
}, fr = (e, t, n, r) => {
	let i = e.avail_in;
	return i > r && (i = r), i === 0 ? 0 : (e.avail_in -= i, t.set(e.input.subarray(e.next_in, e.next_in + i), n), e.state.wrap === 1 ? e.adler = _n(e.adler, t, i, n) : e.state.wrap === 2 && (e.adler = N(e.adler, t, i, n)), e.next_in += i, e.total_in += i, i);
}, pr = (e, t) => {
	let n = e.max_chain_length, r = e.strstart, i, a, o = e.prev_length, s = e.nice_match, c = e.strstart > e.w_size - R ? e.strstart - (e.w_size - R) : 0, l = e.window, u = e.w_mask, d = e.prev, f = e.strstart + Gn, p = l[r + o - 1], m = l[r + o];
	e.prev_length >= e.good_match && (n >>= 2), s > e.lookahead && (s = e.lookahead);
	do
		if (i = t, l[i + o] === m && l[i + o - 1] === p && l[i] === l[r] && l[++i] === l[r + 1]) {
			r += 2, i++;
			do;
			while (l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && r < f);
			if (a = Gn - (f - r), r = f - Gn, a > o) {
				if (e.match_start = t, o = a, a >= s) break;
				p = l[r + o - 1], m = l[r + o];
			}
		}
	while ((t = d[t & u]) > c && --n !== 0);
	return o <= e.lookahead ? o : e.lookahead;
}, mr = (e) => {
	let t = e.w_size, n, r, i;
	do {
		if (r = e.window_size - e.lookahead - e.strstart, e.strstart >= t + (t - R) && (e.window.set(e.window.subarray(t, t + t - r), 0), e.match_start -= t, e.strstart -= t, e.block_start -= t, e.insert > e.strstart && (e.insert = e.strstart), cr(e), r += t), e.strm.avail_in === 0) break;
		if (n = fr(e.strm, e.window, e.strstart + e.lookahead, r), e.lookahead += n, !e.legacy_hash) {
			if (e.lookahead + e.insert > L) for (i = e.strstart - e.insert; e.insert && (ur(e, i), i++, e.insert--, !(e.lookahead + e.insert <= L)););
		} else if (e.lookahead + e.insert >= L) for (i = e.strstart - e.insert, e.ins_h = e.window[i], e.ins_h = lr(e, e.ins_h, e.window[i + 1]); e.insert && (ur(e, i), i++, e.insert--, !(e.lookahead + e.insert < L)););
	} while (e.lookahead < R && e.strm.avail_in !== 0);
}, hr = (e, t) => {
	let n = e.pending_buf_size - 5 > e.w_size ? e.w_size : e.pending_buf_size - 5, r, i, a, o = 0, s = e.strm.avail_in;
	do {
		if (r = 65535, a = e.bi_valid + 42 >> 3, e.strm.avail_out < a || (a = e.strm.avail_out - a, i = e.strstart - e.block_start, r > i + e.strm.avail_in && (r = i + e.strm.avail_in), r > a && (r = a), r < n && (r === 0 && t !== P || t === En || r !== i + e.strm.avail_in))) break;
		o = +(t === P && r === i + e.strm.avail_in), Sn(e, 0, 0, o), e.pending_buf[e.pending - 4] = r, e.pending_buf[e.pending - 3] = r >> 8, e.pending_buf[e.pending - 2] = ~r, e.pending_buf[e.pending - 1] = ~r >> 8, B(e.strm), i && (i > r && (i = r), e.strm.output.set(e.window.subarray(e.block_start, e.block_start + i), e.strm.next_out), e.strm.next_out += i, e.strm.avail_out -= i, e.strm.total_out += i, e.block_start += i, r -= i), r && (fr(e.strm, e.strm.output, e.strm.next_out, r), e.strm.next_out += r, e.strm.avail_out -= r, e.strm.total_out += r);
	} while (o === 0);
	return s -= e.strm.avail_in, s && (s >= e.w_size ? (e.matches = 2, e.window.set(e.strm.input.subarray(e.strm.next_in - e.w_size, e.strm.next_in), 0), e.strstart = e.w_size, e.insert = e.strstart) : (e.window_size - e.strstart <= s && (e.strstart -= e.w_size, e.window.set(e.window.subarray(e.w_size, e.w_size + e.strstart), 0), e.matches < 2 && e.matches++, e.insert > e.strstart && (e.insert = e.strstart)), e.window.set(e.strm.input.subarray(e.strm.next_in - s, e.strm.next_in), e.strstart), e.strstart += s, e.insert += s > e.w_size - e.insert ? e.w_size - e.insert : s), e.block_start = e.strstart), e.high_water < e.strstart && (e.high_water = e.strstart), o ? rr : t !== En && t !== P && e.strm.avail_in === 0 && e.strstart === e.block_start ? tr : (a = e.window_size - e.strstart, e.strm.avail_in > a && e.block_start >= e.w_size && (e.block_start -= e.w_size, e.strstart -= e.w_size, e.window.set(e.window.subarray(e.w_size, e.w_size + e.strstart), 0), e.matches < 2 && e.matches++, a += e.w_size, e.insert > e.strstart && (e.insert = e.strstart)), a > e.strm.avail_in && (a = e.strm.avail_in), a && (fr(e.strm, e.window, e.strstart, a), e.strstart += a, e.insert += a > e.w_size - e.insert ? e.w_size - e.insert : a), e.high_water < e.strstart && (e.high_water = e.strstart), a = e.bi_valid + 42 >> 3, a = e.pending_buf_size - a > 65535 ? 65535 : e.pending_buf_size - a, n = a > e.w_size ? e.w_size : a, i = e.strstart - e.block_start, (i >= n || (i || t === P) && t !== En && e.strm.avail_in === 0 && i <= a) && (r = i > a ? a : i, o = +(t === P && e.strm.avail_in === 0 && r === i), Sn(e, e.block_start, r, o), e.block_start += r, B(e.strm)), o ? nr : z);
}, gr = (e, t) => {
	let n, r;
	for (;;) {
		if (e.lookahead < R) {
			if (mr(e), e.lookahead < R && t === En) return z;
			if (e.lookahead === 0) break;
		}
		if (n = 0, e.lookahead >= L && (n = ur(e, e.strstart)), n !== 0 && e.strstart - n <= e.w_size - R && (e.match_length = pr(e, n)), e.match_length >= L) {
			if (r = wn(e, e.strstart - e.match_start, e.match_length - L), e.lookahead -= e.match_length, e.match_length <= e.max_lazy_match && e.lookahead >= L) {
				e.match_length--;
				do
					e.strstart++, n = ur(e, e.strstart);
				while (--e.match_length !== 0);
				e.strstart++;
			} else e.strstart += e.match_length, e.match_length = 0, e.legacy_hash && (e.ins_h = e.window[e.strstart], e.ins_h = lr(e, e.ins_h, e.window[e.strstart + 1]));
		} else r = wn(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++;
		if (r && (V(e, !1), e.strm.avail_out === 0)) return z;
	}
	return e.insert = e.strstart < 2 ? e.strstart : 2, t === P ? (V(e, !0), e.strm.avail_out === 0 ? nr : rr) : e.sym_next && (V(e, !1), e.strm.avail_out === 0) ? z : tr;
}, _r = (e, t) => {
	let n, r, i;
	for (;;) {
		if (e.lookahead < R) {
			if (mr(e), e.lookahead < R && t === En) return z;
			if (e.lookahead === 0) break;
		}
		if (n = 0, e.lookahead >= L && (n = ur(e, e.strstart)), e.prev_length = e.match_length, e.prev_match = e.match_start, e.match_length = 2, n !== 0 && e.prev_length < e.max_lazy_match && e.strstart - n <= e.w_size - R && (e.match_length = pr(e, n), e.match_length <= 5 && (e.strategy === Pn || e.match_length === L && e.strstart - e.match_start > 4096) && (e.match_length = 2)), e.prev_length >= L && e.match_length <= e.prev_length) {
			i = e.strstart + e.lookahead - L, r = wn(e, e.strstart - 1 - e.prev_match, e.prev_length - L), e.lookahead -= e.prev_length - 1, e.prev_length -= 2;
			do
				++e.strstart <= i && (n = ur(e, e.strstart));
			while (--e.prev_length !== 0);
			if (e.match_available = 0, e.match_length = 2, e.strstart++, r && (V(e, !1), e.strm.avail_out === 0)) return z;
		} else if (e.match_available) {
			if (r = wn(e, 0, e.window[e.strstart - 1]), r && V(e, !1), e.strstart++, e.lookahead--, e.strm.avail_out === 0) return z;
		} else e.match_available = 1, e.strstart++, e.lookahead--;
	}
	return e.match_available &&= (r = wn(e, 0, e.window[e.strstart - 1]), 0), e.insert = e.strstart < 2 ? e.strstart : 2, t === P ? (V(e, !0), e.strm.avail_out === 0 ? nr : rr) : e.sym_next && (V(e, !1), e.strm.avail_out === 0) ? z : tr;
}, vr = (e, t) => {
	let n, r, i, a, o = e.window;
	for (;;) {
		if (e.lookahead <= Gn) {
			if (mr(e), e.lookahead <= Gn && t === En) return z;
			if (e.lookahead === 0) break;
		}
		if (e.match_length = 0, e.lookahead >= L && e.strstart > 0 && (i = e.strstart - 1, r = o[i], r === o[++i] && r === o[++i] && r === o[++i])) {
			a = e.strstart + Gn;
			do;
			while (r === o[++i] && r === o[++i] && r === o[++i] && r === o[++i] && r === o[++i] && r === o[++i] && r === o[++i] && r === o[++i] && i < a);
			e.match_length = Gn - (a - i), e.match_length > e.lookahead && (e.match_length = e.lookahead);
		}
		if (e.match_length >= L ? (n = wn(e, 1, e.match_length - L), e.lookahead -= e.match_length, e.strstart += e.match_length, e.match_length = 0) : (n = wn(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++), n && (V(e, !1), e.strm.avail_out === 0)) return z;
	}
	return e.insert = 0, t === P ? (V(e, !0), e.strm.avail_out === 0 ? nr : rr) : e.sym_next && (V(e, !1), e.strm.avail_out === 0) ? z : tr;
}, yr = (e, t) => {
	let n;
	for (;;) {
		if (e.lookahead === 0 && (mr(e), e.lookahead === 0)) {
			if (t === En) return z;
			break;
		}
		if (e.match_length = 0, n = wn(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++, n && (V(e, !1), e.strm.avail_out === 0)) return z;
	}
	return e.insert = 0, t === P ? (V(e, !0), e.strm.avail_out === 0 ? nr : rr) : e.sym_next && (V(e, !1), e.strm.avail_out === 0) ? z : tr;
};
function br(e, t, n, r, i) {
	this.good_length = e, this.max_lazy = t, this.nice_length = n, this.max_chain = r, this.func = i;
}
var xr = [
	new br(0, 0, 0, 0, hr),
	new br(4, 4, 8, 4, gr),
	new br(4, 5, 16, 8, gr),
	new br(4, 6, 32, 32, gr),
	new br(4, 4, 16, 16, _r),
	new br(8, 16, 32, 32, _r),
	new br(8, 16, 128, 128, _r),
	new br(8, 32, 128, 256, _r),
	new br(32, 128, 258, 1024, _r),
	new br(32, 258, 258, 4096, _r)
], Sr = (e) => {
	e.window_size = 2 * e.w_size, sr(e.head), e.max_lazy_match = xr[e.level].max_lazy, e.good_match = xr[e.level].good_length, e.nice_match = xr[e.level].nice_length, e.max_chain_length = xr[e.level].max_chain, e.strstart = 0, e.block_start = 0, e.lookahead = 0, e.insert = 0, e.match_length = e.prev_length = 2, e.match_available = 0, e.ins_h = 0;
};
function Cr() {
	this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = Bn, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.legacy_hash = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new Uint16Array(Wn * 2), this.dyn_dtree = /* @__PURE__ */ new Uint16Array(122), this.bl_tree = /* @__PURE__ */ new Uint16Array(78), sr(this.dyn_ltree), sr(this.dyn_dtree), sr(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = /* @__PURE__ */ new Uint16Array(16), this.heap = /* @__PURE__ */ new Uint16Array(573), sr(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = /* @__PURE__ */ new Uint16Array(573), sr(this.depth), this.sym_buf = 0, this.lit_bufsize = 0, this.sym_next = 0, this.sym_end = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
}
var wr = (e) => {
	if (!e) return 1;
	let t = e.state;
	return +(!t || t.strm !== e || t.status !== qn && t.status !== Jn && t.status !== Yn && t.status !== Xn && t.status !== Zn && t.status !== Qn && t.status !== $n && t.status !== er);
}, Tr = (e) => {
	if (wr(e)) return ar(e, I);
	e.total_in = e.total_out = 0, e.data_type = zn;
	let t = e.state;
	return t.pending = 0, t.pending_out = 0, t.wrap < 0 && (t.wrap = -t.wrap), t.status = t.wrap === 2 ? Jn : t.wrap ? qn : $n, e.adler = t.wrap === 2 ? 0 : 1, t.last_flush = -2, xn(t), F;
}, Er = (e) => {
	let t = Tr(e);
	return t === F && Sr(e.state), t;
}, Dr = (e, t) => wr(e) || e.state.wrap !== 2 ? I : (e.state.gzhead = t, F), Or = (e, t, n, r, i, a, o) => {
	if (!e) return I;
	let s = 1;
	if (t === Nn && (t = 6), r < 0 ? (s = 0, r = -r) : r > 15 && (s = 2, r -= 16), i < 1 || i > Vn || n !== Bn || r < 8 || r > 15 || t < 0 || t > 9 || a < 0 || a > Ln || r === 8 && s !== 1) return ar(e, I);
	r === 8 && (r = 9);
	let c = new Cr();
	return e.state = c, c.strm = e, c.status = qn, c.wrap = s, c.gzhead = null, c.w_bits = r, c.w_size = 1 << c.w_bits, c.w_mask = c.w_size - 1, c.legacy_hash = +!!o, c.hash_bits = i + 7, !c.legacy_hash && c.hash_bits < 15 && (c.hash_bits = 15), c.hash_size = 1 << c.hash_bits, c.hash_mask = c.hash_size - 1, c.hash_shift = ~~((c.hash_bits + L - 1) / L), c.window = new Uint8Array(c.w_size * 2), c.head = new Uint16Array(c.hash_size), c.prev = new Uint16Array(c.w_size), c.lit_bufsize = 1 << i + 6, c.pending_buf_size = c.lit_bufsize * 4, c.pending_buf = new Uint8Array(c.pending_buf_size), c.sym_buf = c.lit_bufsize, c.sym_end = (c.lit_bufsize - 1) * 3, c.level = t, c.strategy = a, c.method = n, Er(e);
}, kr = {
	deflateInit: (e, t) => Or(e, t, Bn, Hn, Un, Rn),
	deflateInit2: Or,
	deflateReset: Er,
	deflateResetKeep: Tr,
	deflateSetHeader: Dr,
	deflate: (e, t) => {
		if (wr(e) || t > kn || t < 0) return e ? ar(e, I) : I;
		let n = e.state;
		if (!e.output || e.avail_in !== 0 && !e.input || n.status === er && t !== P) return ar(e, e.avail_out === 0 ? Mn : I);
		let r = n.last_flush;
		if (n.last_flush = t, n.pending !== 0) {
			if (B(e), e.avail_out === 0) return n.last_flush = -1, F;
		} else if (e.avail_in === 0 && or(t) <= or(r) && t !== P) return ar(e, Mn);
		if (n.status === er && e.avail_in !== 0) return ar(e, Mn);
		if (n.status === qn && n.wrap === 0 && (n.status = $n), n.status === qn) {
			let t = Bn + (n.w_bits - 8 << 4) << 8, r = -1;
			if (r = n.strategy >= Fn || n.level < 2 ? 0 : n.level < 6 ? 1 : n.level === 6 ? 2 : 3, t |= r << 6, n.strstart !== 0 && (t |= Kn), t += 31 - t % 31, dr(n, t), n.strstart !== 0 && (dr(n, e.adler >>> 16), dr(n, e.adler & 65535)), e.adler = 1, n.status = $n, B(e), n.pending !== 0) return n.last_flush = -1, F;
		}
		if (n.status === Jn) {
			if (e.adler = 0, H(n, 31), H(n, 139), H(n, 8), n.gzhead) H(n, +!!n.gzhead.text + (n.gzhead.hcrc ? 2 : 0) + (n.gzhead.extra ? 4 : 0) + (n.gzhead.name ? 8 : 0) + (n.gzhead.comment ? 16 : 0)), H(n, n.gzhead.time & 255), H(n, n.gzhead.time >> 8 & 255), H(n, n.gzhead.time >> 16 & 255), H(n, n.gzhead.time >> 24 & 255), H(n, n.level === 9 ? 2 : n.strategy >= Fn || n.level < 2 ? 4 : 0), H(n, n.gzhead.os & 255), n.gzhead.extra && n.gzhead.extra.length && (H(n, n.gzhead.extra.length & 255), H(n, n.gzhead.extra.length >> 8 & 255)), n.gzhead.hcrc && (e.adler = N(e.adler, n.pending_buf, n.pending, 0)), n.gzindex = 0, n.status = Yn;
			else if (H(n, 0), H(n, 0), H(n, 0), H(n, 0), H(n, 0), H(n, n.level === 9 ? 2 : n.strategy >= Fn || n.level < 2 ? 4 : 0), H(n, ir), n.status = $n, B(e), n.pending !== 0) return n.last_flush = -1, F;
		}
		if (n.status === Yn) {
			if (n.gzhead.extra) {
				let t = n.pending, r = (n.gzhead.extra.length & 65535) - n.gzindex;
				for (; n.pending + r > n.pending_buf_size;) {
					let i = n.pending_buf_size - n.pending;
					if (n.pending_buf.set(n.gzhead.extra.subarray(n.gzindex, n.gzindex + i), n.pending), n.pending = n.pending_buf_size, n.gzhead.hcrc && n.pending > t && (e.adler = N(e.adler, n.pending_buf, n.pending - t, t)), n.gzindex += i, B(e), n.pending !== 0) return n.last_flush = -1, F;
					t = 0, r -= i;
				}
				let i = new Uint8Array(n.gzhead.extra);
				n.pending_buf.set(i.subarray(n.gzindex, n.gzindex + r), n.pending), n.pending += r, n.gzhead.hcrc && n.pending > t && (e.adler = N(e.adler, n.pending_buf, n.pending - t, t)), n.gzindex = 0;
			}
			n.status = Xn;
		}
		if (n.status === Xn) {
			if (n.gzhead.name) {
				let t = n.pending, r;
				do {
					if (n.pending === n.pending_buf_size) {
						if (n.gzhead.hcrc && n.pending > t && (e.adler = N(e.adler, n.pending_buf, n.pending - t, t)), B(e), n.pending !== 0) return n.last_flush = -1, F;
						t = 0;
					}
					r = n.gzindex < n.gzhead.name.length ? n.gzhead.name.charCodeAt(n.gzindex++) & 255 : 0, H(n, r);
				} while (r !== 0);
				n.gzhead.hcrc && n.pending > t && (e.adler = N(e.adler, n.pending_buf, n.pending - t, t)), n.gzindex = 0;
			}
			n.status = Zn;
		}
		if (n.status === Zn) {
			if (n.gzhead.comment) {
				let t = n.pending, r;
				do {
					if (n.pending === n.pending_buf_size) {
						if (n.gzhead.hcrc && n.pending > t && (e.adler = N(e.adler, n.pending_buf, n.pending - t, t)), B(e), n.pending !== 0) return n.last_flush = -1, F;
						t = 0;
					}
					r = n.gzindex < n.gzhead.comment.length ? n.gzhead.comment.charCodeAt(n.gzindex++) & 255 : 0, H(n, r);
				} while (r !== 0);
				n.gzhead.hcrc && n.pending > t && (e.adler = N(e.adler, n.pending_buf, n.pending - t, t));
			}
			n.status = Qn;
		}
		if (n.status === Qn) {
			if (n.gzhead.hcrc) {
				if (n.pending + 2 > n.pending_buf_size && (B(e), n.pending !== 0)) return n.last_flush = -1, F;
				H(n, e.adler & 255), H(n, e.adler >> 8 & 255), e.adler = 0;
			}
			if (n.status = $n, B(e), n.pending !== 0) return n.last_flush = -1, F;
		}
		if (e.avail_in !== 0 || n.lookahead !== 0 || t !== En && n.status !== er) {
			let r = n.level === 0 ? hr(n, t) : n.strategy === Fn ? yr(n, t) : n.strategy === In ? vr(n, t) : xr[n.level].func(n, t);
			if ((r === nr || r === rr) && (n.status = er), r === z || r === nr) return e.avail_out === 0 && (n.last_flush = -1), F;
			if (r === tr && (t === Dn ? Tn(n) : t !== kn && (Sn(n, 0, 0, !1), t === On && (sr(n.head), n.lookahead === 0 && (n.strstart = 0, n.block_start = 0, n.insert = 0))), B(e), e.avail_out === 0)) return n.last_flush = -1, F;
		}
		return t === P ? n.wrap <= 0 ? An : (n.wrap === 2 ? (H(n, e.adler & 255), H(n, e.adler >> 8 & 255), H(n, e.adler >> 16 & 255), H(n, e.adler >> 24 & 255), H(n, e.total_in & 255), H(n, e.total_in >> 8 & 255), H(n, e.total_in >> 16 & 255), H(n, e.total_in >> 24 & 255)) : (dr(n, e.adler >>> 16), dr(n, e.adler & 65535)), B(e), n.wrap > 0 && (n.wrap = -n.wrap), n.pending === 0 ? An : F) : F;
	},
	deflateEnd: (e) => {
		if (wr(e)) return I;
		let t = e.state.status;
		return e.state = null, t === $n ? ar(e, jn) : F;
	},
	deflateSetDictionary: (e, t) => {
		let n = t.length;
		if (wr(e)) return I;
		let r = e.state, i = r.wrap;
		if (i === 2 || i === 1 && r.status !== qn || r.lookahead) return I;
		if (i === 1 && (e.adler = _n(e.adler, t, n, 0)), r.wrap = 0, n >= r.w_size) {
			i === 0 && (sr(r.head), r.strstart = 0, r.block_start = 0, r.insert = 0);
			let e = new Uint8Array(r.w_size);
			e.set(t.subarray(n - r.w_size, n), 0), t = e, n = r.w_size;
		}
		let a = e.avail_in, o = e.next_in, s = e.input;
		for (e.avail_in = n, e.next_in = 0, e.input = t, mr(r); r.lookahead >= L;) {
			let e = r.strstart, t = r.lookahead - 2;
			do
				ur(r, e), e++;
			while (--t);
			r.strstart = e, r.lookahead = 2, mr(r);
		}
		return r.strstart += r.lookahead, r.block_start = r.strstart, r.insert = r.lookahead, r.lookahead = 0, r.match_length = r.prev_length = 2, r.match_available = 0, e.next_in = o, e.input = s, e.avail_in = a, r.wrap = i, F;
	},
	deflateInfo: "pako deflate (from Nodeca project)"
}, Ar = (e, t) => Object.prototype.hasOwnProperty.call(e, t), jr = {
	assign: function(e) {
		let t = Array.prototype.slice.call(arguments, 1);
		for (; t.length;) {
			let n = t.shift();
			if (n) {
				if (typeof n != "object") throw TypeError(n + "must be non-object");
				for (let t in n) Ar(n, t) && (e[t] = n[t]);
			}
		}
		return e;
	},
	flattenChunks: (e) => {
		let t = 0;
		for (let n = 0, r = e.length; n < r; n++) t += e[n].length;
		let n = new Uint8Array(t);
		for (let t = 0, r = 0, i = e.length; t < i; t++) {
			let i = e[t];
			n.set(i, r), r += i.length;
		}
		return n;
	}
}, Mr = !0;
try {
	String.fromCharCode.apply(null, /* @__PURE__ */ new Uint8Array(1));
} catch {
	Mr = !1;
}
var Nr = /* @__PURE__ */ new Uint8Array(256);
for (let e = 0; e < 256; e++) Nr[e] = e >= 252 ? 6 : e >= 248 ? 5 : e >= 240 ? 4 : e >= 224 ? 3 : e >= 192 ? 2 : 1;
Nr[254] = Nr[255] = 1;
var Pr = (e) => {
	if (typeof TextEncoder == "function" && TextEncoder.prototype.encode) return new TextEncoder().encode(e);
	let t, n, r, i, a, o = e.length, s = 0;
	for (i = 0; i < o; i++) n = e.charCodeAt(i), (n & 64512) == 55296 && i + 1 < o && (r = e.charCodeAt(i + 1), (r & 64512) == 56320 && (n = 65536 + (n - 55296 << 10) + (r - 56320), i++)), s += n < 128 ? 1 : n < 2048 ? 2 : n < 65536 ? 3 : 4;
	for (t = new Uint8Array(s), a = 0, i = 0; a < s; i++) n = e.charCodeAt(i), (n & 64512) == 55296 && i + 1 < o && (r = e.charCodeAt(i + 1), (r & 64512) == 56320 && (n = 65536 + (n - 55296 << 10) + (r - 56320), i++)), n < 128 ? t[a++] = n : n < 2048 ? (t[a++] = 192 | n >>> 6, t[a++] = 128 | n & 63) : n < 65536 ? (t[a++] = 224 | n >>> 12, t[a++] = 128 | n >>> 6 & 63, t[a++] = 128 | n & 63) : (t[a++] = 240 | n >>> 18, t[a++] = 128 | n >>> 12 & 63, t[a++] = 128 | n >>> 6 & 63, t[a++] = 128 | n & 63);
	return t;
}, Fr = (e, t) => {
	if (t < 65534 && e.subarray && Mr) return String.fromCharCode.apply(null, e.length === t ? e : e.subarray(0, t));
	let n = "";
	for (let r = 0; r < t; r++) n += String.fromCharCode(e[r]);
	return n;
}, Ir = {
	string2buf: Pr,
	buf2string: (e, t) => {
		let n = t || e.length;
		if (typeof TextDecoder == "function" && TextDecoder.prototype.decode) return new TextDecoder().decode(e.subarray(0, t));
		let r, i, a = Array(n * 2);
		for (i = 0, r = 0; r < n;) {
			let t = e[r++];
			if (t < 128) {
				a[i++] = t;
				continue;
			}
			let o = Nr[t];
			if (o > 4) a[i++] = 65533, r += o - 1;
			else {
				for (t &= o === 2 ? 31 : o === 3 ? 15 : 7; o > 1 && r < n;) t = t << 6 | e[r++] & 63, o--;
				o > 1 ? a[i++] = 65533 : t < 65536 ? a[i++] = t : (t -= 65536, a[i++] = 55296 | t >> 10 & 1023, a[i++] = 56320 | t & 1023);
			}
		}
		return Fr(a, i);
	},
	utf8border: (e, t) => {
		t ||= e.length, t > e.length && (t = e.length);
		let n = t - 1;
		for (; n >= 0 && (e[n] & 192) == 128;) n--;
		return n < 0 || n === 0 ? t : n + Nr[e[n]] > t ? n : t;
	}
};
function Lr() {
	this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
}
var Rr = Lr, zr = Object.prototype.toString, { Z_NO_FLUSH: Br, Z_SYNC_FLUSH: Vr, Z_FULL_FLUSH: Hr, Z_FINISH: Ur, Z_OK: Wr, Z_STREAM_END: Gr, Z_DEFAULT_COMPRESSION: Kr, Z_DEFAULT_STRATEGY: qr, Z_DEFLATED: Jr } = bn, Yr = {
	level: Kr,
	method: Jr,
	chunkSize: 16384,
	windowBits: 15,
	memLevel: 8,
	strategy: qr,
	legacyHash: !0
};
function Xr(e) {
	this.options = jr.assign({}, Yr, e || {});
	let t = this.options;
	t.raw && t.windowBits > 0 ? t.windowBits = -t.windowBits : t.gzip && t.windowBits > 0 && t.windowBits < 16 && (t.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new Rr(), this.strm.avail_out = 0;
	let n = kr.deflateInit2(this.strm, t.level, t.method, t.windowBits, t.memLevel, t.strategy, t.legacyHash);
	if (n !== Wr) throw Error(yn[n]);
	if (t.header && kr.deflateSetHeader(this.strm, t.header), t.dictionary) {
		let e;
		if (e = typeof t.dictionary == "string" ? Ir.string2buf(t.dictionary) : zr.call(t.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(t.dictionary) : t.dictionary, n = kr.deflateSetDictionary(this.strm, e), n !== Wr) throw Error(yn[n]);
		this._dict_set = !0;
	}
}
Xr.prototype.push = function(e, t) {
	let n = this.strm, r = this.options.chunkSize, i, a;
	if (this.ended) return !1;
	for (a = t === ~~t ? t : t === !0 ? Ur : Br, n.input = typeof e == "string" ? Ir.string2buf(e) : zr.call(e) === "[object ArrayBuffer]" ? new Uint8Array(e) : e, n.next_in = 0, n.avail_in = n.input.length;;) if (n.avail_out === 0 && (n.output = new Uint8Array(r), n.next_out = 0, n.avail_out = r), (a === Vr || a === Hr) && n.avail_out <= 6) this.onData(n.output.subarray(0, n.next_out)), n.avail_out = 0;
	else {
		if (i = kr.deflate(n, a), i === Gr) return n.next_out > 0 && this.onData(n.output.subarray(0, n.next_out)), i = kr.deflateEnd(this.strm), this.onEnd(i), this.ended = !0, i === Wr;
		if (n.avail_out === 0) this.onData(n.output);
		else if (a > 0 && n.next_out > 0) this.onData(n.output.subarray(0, n.next_out)), n.avail_out = 0;
		else if (n.avail_in === 0) break;
	}
	return !0;
}, Xr.prototype.onData = function(e) {
	this.chunks.push(e);
}, Xr.prototype.onEnd = function(e) {
	e === Wr && (this.result = jr.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg;
};
function Zr(e, t) {
	let n = new Xr(t);
	if (n.push(e, !0), n.err) throw n.msg || yn[n.err];
	return n.result;
}
function Qr(e, t) {
	return t ||= {}, t.raw = !0, Zr(e, t);
}
function $r(e, t) {
	return t ||= {}, t.gzip = !0, Zr(e, t);
}
var ei = {
	Deflate: Xr,
	deflate: Zr,
	deflateRaw: Qr,
	gzip: $r,
	constants: bn
}, ti = 16209, ni = 16191, ri = function(e, t) {
	let n, r, i, a, o, s, c, l, u, d, f, p, m, h, g, _, v, y, b, x, S, C, w, T, E = e.state;
	n = e.next_in, w = e.input, r = n + (e.avail_in - 5), i = e.next_out, T = e.output, a = i - (t - e.avail_out), o = i + (e.avail_out - 257), s = E.dmax, c = E.wsize, l = E.whave, u = E.wnext, d = E.window, f = E.hold, p = E.bits, m = E.lencode, h = E.distcode, g = (1 << E.lenbits) - 1, _ = (1 << E.distbits) - 1;
	top: do {
		p < 15 && (f += w[n++] << p, p += 8, f += w[n++] << p, p += 8), v = m[f & g];
		dolen: for (;;) {
			if (y = v >>> 24, f >>>= y, p -= y, y = v >>> 16 & 255, y === 0) T[i++] = v & 65535;
			else if (y & 16) {
				b = v & 65535, y &= 15, y && (p < y && (f += w[n++] << p, p += 8), b += f & (1 << y) - 1, f >>>= y, p -= y), p < 15 && (f += w[n++] << p, p += 8, f += w[n++] << p, p += 8), v = h[f & _];
				dodist: for (;;) {
					if (y = v >>> 24, f >>>= y, p -= y, y = v >>> 16 & 255, y & 16) {
						if (x = v & 65535, y &= 15, p < y && (f += w[n++] << p, p += 8, p < y && (f += w[n++] << p, p += 8)), x += f & (1 << y) - 1, x > s) {
							e.msg = "invalid distance too far back", E.mode = ti;
							break top;
						}
						if (f >>>= y, p -= y, y = i - a, x > y) {
							if (y = x - y, y > l && E.sane) {
								e.msg = "invalid distance too far back", E.mode = ti;
								break top;
							}
							if (S = 0, C = d, u === 0) {
								if (S += c - y, y < b) {
									b -= y;
									do
										T[i++] = d[S++];
									while (--y);
									S = i - x, C = T;
								}
							} else if (u < y) {
								if (S += c + u - y, y -= u, y < b) {
									b -= y;
									do
										T[i++] = d[S++];
									while (--y);
									if (S = 0, u < b) {
										y = u, b -= y;
										do
											T[i++] = d[S++];
										while (--y);
										S = i - x, C = T;
									}
								}
							} else if (S += u - y, y < b) {
								b -= y;
								do
									T[i++] = d[S++];
								while (--y);
								S = i - x, C = T;
							}
							for (; b > 2;) T[i++] = C[S++], T[i++] = C[S++], T[i++] = C[S++], b -= 3;
							b && (T[i++] = C[S++], b > 1 && (T[i++] = C[S++]));
						} else {
							S = i - x;
							do
								T[i++] = T[S++], T[i++] = T[S++], T[i++] = T[S++], b -= 3;
							while (b > 2);
							b && (T[i++] = T[S++], b > 1 && (T[i++] = T[S++]));
						}
					} else if (y & 64) {
						e.msg = "invalid distance code", E.mode = ti;
						break top;
					} else {
						v = h[(v & 65535) + (f & (1 << y) - 1)];
						continue dodist;
					}
					break;
				}
			} else if (!(y & 64)) {
				v = m[(v & 65535) + (f & (1 << y) - 1)];
				continue dolen;
			} else if (y & 32) {
				E.mode = ni;
				break top;
			} else {
				e.msg = "invalid literal/length code", E.mode = ti;
				break top;
			}
			break;
		}
	} while (n < r && i < o);
	b = p >> 3, n -= b, p -= b << 3, f &= (1 << p) - 1, e.next_in = n, e.next_out = i, e.avail_in = n < r ? 5 + (r - n) : 5 - (n - r), e.avail_out = i < o ? 257 + (o - i) : 257 - (i - o), E.hold = f, E.bits = p;
}, ii = 15, ai = 852, oi = 592, si = 0, ci = 1, li = 2, ui = new Uint16Array([
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	13,
	15,
	17,
	19,
	23,
	27,
	31,
	35,
	43,
	51,
	59,
	67,
	83,
	99,
	115,
	131,
	163,
	195,
	227,
	258,
	0,
	0
]), di = new Uint8Array([
	16,
	16,
	16,
	16,
	16,
	16,
	16,
	16,
	17,
	17,
	17,
	17,
	18,
	18,
	18,
	18,
	19,
	19,
	19,
	19,
	20,
	20,
	20,
	20,
	21,
	21,
	21,
	21,
	16,
	199,
	75
]), fi = new Uint16Array([
	1,
	2,
	3,
	4,
	5,
	7,
	9,
	13,
	17,
	25,
	33,
	49,
	65,
	97,
	129,
	193,
	257,
	385,
	513,
	769,
	1025,
	1537,
	2049,
	3073,
	4097,
	6145,
	8193,
	12289,
	16385,
	24577,
	0,
	0
]), pi = new Uint8Array([
	16,
	16,
	16,
	16,
	17,
	17,
	18,
	18,
	19,
	19,
	20,
	20,
	21,
	21,
	22,
	22,
	23,
	23,
	24,
	24,
	25,
	25,
	26,
	26,
	27,
	27,
	28,
	28,
	29,
	29,
	64,
	64
]), mi = (e, t, n, r, i, a, o, s) => {
	let c = s.bits, l = 0, u = 0, d = 0, f = 0, p = 0, m = 0, h = 0, g = 0, _ = 0, v = 0, y, b, x, S, C, w = null, T, E = /* @__PURE__ */ new Uint16Array(16), D = /* @__PURE__ */ new Uint16Array(16), O = null, ee, te, ne;
	for (l = 0; l <= ii; l++) E[l] = 0;
	for (u = 0; u < r; u++) E[t[n + u]]++;
	for (p = c, f = ii; f >= 1 && E[f] === 0; f--);
	if (p > f && (p = f), f === 0) return i[a++] = 20971520, i[a++] = 20971520, s.bits = 1, 0;
	for (d = 1; d < f && E[d] === 0; d++);
	for (p < d && (p = d), g = 1, l = 1; l <= ii; l++) if (g <<= 1, g -= E[l], g < 0) return -1;
	if (g > 0 && (e === si || f !== 1)) return -1;
	for (D[1] = 0, l = 1; l < ii; l++) D[l + 1] = D[l] + E[l];
	for (u = 0; u < r; u++) t[n + u] !== 0 && (o[D[t[n + u]]++] = u);
	if (e === si ? (w = O = o, T = 20) : e === ci ? (w = ui, O = di, T = 257) : (w = fi, O = pi, T = 0), v = 0, u = 0, l = d, C = a, m = p, h = 0, x = -1, _ = 1 << p, S = _ - 1, e === ci && _ > ai || e === li && _ > oi) return 1;
	for (;;) {
		ee = l - h, o[u] + 1 < T ? (te = 0, ne = o[u]) : o[u] >= T ? (te = O[o[u] - T], ne = w[o[u] - T]) : (te = 96, ne = 0), y = 1 << l - h, b = 1 << m, d = b;
		do
			b -= y, i[C + (v >> h) + b] = ee << 24 | te << 16 | ne;
		while (b !== 0);
		for (y = 1 << l - 1; v & y;) y >>= 1;
		if (y === 0 ? v = 0 : (v &= y - 1, v += y), u++, --E[l] === 0) {
			if (l === f) break;
			l = t[n + o[u]];
		}
		if (l > p && (v & S) !== x) {
			for (h === 0 && (h = p), C += d, m = l - h, g = 1 << m; m + h < f && (g -= E[m + h], !(g <= 0));) m++, g <<= 1;
			if (_ += 1 << m, e === ci && _ > ai || e === li && _ > oi) return 1;
			x = v & S, i[x] = p << 24 | m << 16 | C - a;
		}
	}
	return v !== 0 && (i[C + v] = l - h << 24 | 4194304), s.bits = p, 0;
}, hi = 0, gi = 1, _i = 2, { Z_FINISH: vi, Z_BLOCK: yi, Z_TREES: bi, Z_OK: xi, Z_STREAM_END: Si, Z_NEED_DICT: Ci, Z_STREAM_ERROR: U, Z_DATA_ERROR: wi, Z_MEM_ERROR: Ti, Z_BUF_ERROR: Ei, Z_DEFLATED: Di } = bn, Oi = 16180, ki = 16181, Ai = 16182, ji = 16183, Mi = 16184, Ni = 16185, Pi = 16186, Fi = 16187, Ii = 16188, Li = 16189, Ri = 16190, zi = 16191, Bi = 16192, Vi = 16193, Hi = 16194, Ui = 16195, Wi = 16196, Gi = 16197, Ki = 16198, qi = 16199, Ji = 16200, Yi = 16201, Xi = 16202, Zi = 16203, Qi = 16204, $i = 16205, ea = 16206, ta = 16207, na = 16208, W = 16209, ra = 16210, ia = 16211, aa = 852, oa = 592, sa = 15, ca = (e) => (e >>> 24 & 255) + (e >>> 8 & 65280) + ((e & 65280) << 8) + ((e & 255) << 24);
function la() {
	this.strm = null, this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = /* @__PURE__ */ new Uint16Array(320), this.work = /* @__PURE__ */ new Uint16Array(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
}
var ua = (e) => {
	if (!e) return 1;
	let t = e.state;
	return +(!t || t.strm !== e || t.mode < Oi || t.mode > ia);
}, da = (e) => {
	if (ua(e)) return U;
	let t = e.state;
	return e.total_in = e.total_out = t.total = 0, e.msg = "", t.wrap && (e.adler = t.wrap & 1), t.mode = Oi, t.last = 0, t.havedict = 0, t.flags = -1, t.dmax = 32768, t.head = null, t.hold = 0, t.bits = 0, t.lencode = t.lendyn = new Int32Array(aa), t.distcode = t.distdyn = new Int32Array(oa), t.sane = 1, t.back = -1, xi;
}, fa = (e) => {
	if (ua(e)) return U;
	let t = e.state;
	return t.wsize = 0, t.whave = 0, t.wnext = 0, da(e);
}, pa = (e, t) => {
	let n;
	if (ua(e)) return U;
	let r = e.state;
	return t < 0 ? (n = 0, t = -t) : (n = (t >> 4) + 5, t < 48 && (t &= 15)), t && (t < 8 || t > 15) ? U : (r.window !== null && r.wbits !== t && (r.window = null), r.wrap = n, r.wbits = t, fa(e));
}, ma = (e, t) => {
	if (!e) return U;
	let n = new la();
	e.state = n, n.strm = e, n.window = null, n.mode = Oi;
	let r = pa(e, t);
	return r !== xi && (e.state = null), r;
}, ha = (e) => ma(e, sa), ga = !0, _a, va, ya = (e) => {
	if (ga) {
		_a = /* @__PURE__ */ new Int32Array(512), va = /* @__PURE__ */ new Int32Array(32);
		let t = 0;
		for (; t < 144;) e.lens[t++] = 8;
		for (; t < 256;) e.lens[t++] = 9;
		for (; t < 280;) e.lens[t++] = 7;
		for (; t < 288;) e.lens[t++] = 8;
		for (mi(gi, e.lens, 0, 288, _a, 0, e.work, { bits: 9 }), t = 0; t < 32;) e.lens[t++] = 5;
		mi(_i, e.lens, 0, 32, va, 0, e.work, { bits: 5 }), ga = !1;
	}
	e.lencode = _a, e.lenbits = 9, e.distcode = va, e.distbits = 5;
}, ba = (e, t, n, r) => {
	let i, a = e.state;
	return a.window === null && (a.window = new Uint8Array(1 << a.wbits)), a.wsize === 0 && (a.wsize = 1 << a.wbits, a.wnext = 0, a.whave = 0), r >= a.wsize ? (a.window.set(t.subarray(n - a.wsize, n), 0), a.wnext = 0, a.whave = a.wsize) : (i = a.wsize - a.wnext, i > r && (i = r), a.window.set(t.subarray(n - r, n - r + i), a.wnext), r -= i, r ? (a.window.set(t.subarray(n - r, n), 0), a.wnext = r, a.whave = a.wsize) : (a.wnext += i, a.wnext === a.wsize && (a.wnext = 0), a.whave < a.wsize && (a.whave += i))), 0;
}, xa = {
	inflateReset: fa,
	inflateReset2: pa,
	inflateResetKeep: da,
	inflateInit: ha,
	inflateInit2: ma,
	inflate: (e, t) => {
		let n, r, i, a, o, s, c, l, u, d, f, p, m, h, g = 0, _, v, y, b, x, S, C, w, T = /* @__PURE__ */ new Uint8Array(4), E, D, O = new Uint8Array([
			16,
			17,
			18,
			0,
			8,
			7,
			9,
			6,
			10,
			5,
			11,
			4,
			12,
			3,
			13,
			2,
			14,
			1,
			15
		]);
		if (ua(e) || !e.output || !e.input && e.avail_in !== 0) return U;
		n = e.state, n.mode === zi && (n.mode = Bi), o = e.next_out, i = e.output, c = e.avail_out, a = e.next_in, r = e.input, s = e.avail_in, l = n.hold, u = n.bits, d = s, f = c, w = xi;
		inf_leave: for (;;) switch (n.mode) {
			case Oi:
				if (n.wrap === 0) {
					n.mode = Bi;
					break;
				}
				for (; u < 16;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				if (n.wrap & 2 && l === 35615) {
					n.wbits === 0 && (n.wbits = 15), n.check = 0, T[0] = l & 255, T[1] = l >>> 8 & 255, n.check = N(n.check, T, 2, 0), l = 0, u = 0, n.mode = ki;
					break;
				}
				if (n.head && (n.head.done = !1), !(n.wrap & 1) || (((l & 255) << 8) + (l >> 8)) % 31) {
					e.msg = "incorrect header check", n.mode = W;
					break;
				}
				if ((l & 15) !== Di) {
					e.msg = "unknown compression method", n.mode = W;
					break;
				}
				if (l >>>= 4, u -= 4, C = (l & 15) + 8, n.wbits === 0 && (n.wbits = C), C > 15 || C > n.wbits) {
					e.msg = "invalid window size", n.mode = W;
					break;
				}
				n.dmax = 1 << n.wbits, n.flags = 0, e.adler = n.check = 1, n.mode = l & 512 ? Li : zi, l = 0, u = 0;
				break;
			case ki:
				for (; u < 16;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				if (n.flags = l, (n.flags & 255) !== Di) {
					e.msg = "unknown compression method", n.mode = W;
					break;
				}
				if (n.flags & 57344) {
					e.msg = "unknown header flags set", n.mode = W;
					break;
				}
				n.head && (n.head.text = l >> 8 & 1), n.flags & 512 && n.wrap & 4 && (T[0] = l & 255, T[1] = l >>> 8 & 255, n.check = N(n.check, T, 2, 0)), l = 0, u = 0, n.mode = Ai;
			case Ai:
				for (; u < 32;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				n.head && (n.head.time = l), n.flags & 512 && n.wrap & 4 && (T[0] = l & 255, T[1] = l >>> 8 & 255, T[2] = l >>> 16 & 255, T[3] = l >>> 24 & 255, n.check = N(n.check, T, 4, 0)), l = 0, u = 0, n.mode = ji;
			case ji:
				for (; u < 16;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				n.head && (n.head.xflags = l & 255, n.head.os = l >> 8), n.flags & 512 && n.wrap & 4 && (T[0] = l & 255, T[1] = l >>> 8 & 255, n.check = N(n.check, T, 2, 0)), l = 0, u = 0, n.mode = Mi;
			case Mi:
				if (n.flags & 1024) {
					for (; u < 16;) {
						if (s === 0) break inf_leave;
						s--, l += r[a++] << u, u += 8;
					}
					n.length = l, n.head && (n.head.extra_len = l), n.flags & 512 && n.wrap & 4 && (T[0] = l & 255, T[1] = l >>> 8 & 255, n.check = N(n.check, T, 2, 0)), l = 0, u = 0;
				} else n.head && (n.head.extra = null);
				n.mode = Ni;
			case Ni:
				if (n.flags & 1024 && (p = n.length, p > s && (p = s), p && (n.head && (C = n.head.extra_len - n.length, n.head.extra || (n.head.extra = new Uint8Array(n.head.extra_len)), n.head.extra.set(r.subarray(a, a + p), C)), n.flags & 512 && n.wrap & 4 && (n.check = N(n.check, r, p, a)), s -= p, a += p, n.length -= p), n.length)) break inf_leave;
				n.length = 0, n.mode = Pi;
			case Pi:
				if (n.flags & 2048) {
					if (s === 0) break inf_leave;
					p = 0;
					do
						C = r[a + p++], n.head && C && n.length < 65536 && (n.head.name += String.fromCharCode(C));
					while (C && p < s);
					if (n.flags & 512 && n.wrap & 4 && (n.check = N(n.check, r, p, a)), s -= p, a += p, C) break inf_leave;
				} else n.head && (n.head.name = null);
				n.length = 0, n.mode = Fi;
			case Fi:
				if (n.flags & 4096) {
					if (s === 0) break inf_leave;
					p = 0;
					do
						C = r[a + p++], n.head && C && n.length < 65536 && (n.head.comment += String.fromCharCode(C));
					while (C && p < s);
					if (n.flags & 512 && n.wrap & 4 && (n.check = N(n.check, r, p, a)), s -= p, a += p, C) break inf_leave;
				} else n.head && (n.head.comment = null);
				n.mode = Ii;
			case Ii:
				if (n.flags & 512) {
					for (; u < 16;) {
						if (s === 0) break inf_leave;
						s--, l += r[a++] << u, u += 8;
					}
					if (n.wrap & 4 && l !== (n.check & 65535)) {
						e.msg = "header crc mismatch", n.mode = W;
						break;
					}
					l = 0, u = 0;
				}
				n.head && (n.head.hcrc = n.flags >> 9 & 1, n.head.done = !0), e.adler = n.check = 0, n.mode = zi;
				break;
			case Li:
				for (; u < 32;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				e.adler = n.check = ca(l), l = 0, u = 0, n.mode = Ri;
			case Ri:
				if (n.havedict === 0) return e.next_out = o, e.avail_out = c, e.next_in = a, e.avail_in = s, n.hold = l, n.bits = u, Ci;
				e.adler = n.check = 1, n.mode = zi;
			case zi: if (t === yi || t === bi) break inf_leave;
			case Bi:
				if (n.last) {
					l >>>= u & 7, u -= u & 7, n.mode = ea;
					break;
				}
				for (; u < 3;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				switch (n.last = l & 1, l >>>= 1, --u, l & 3) {
					case 0:
						n.mode = Vi;
						break;
					case 1:
						if (ya(n), n.mode = qi, t === bi) {
							l >>>= 2, u -= 2;
							break inf_leave;
						}
						break;
					case 2:
						n.mode = Wi;
						break;
					case 3: e.msg = "invalid block type", n.mode = W;
				}
				l >>>= 2, u -= 2;
				break;
			case Vi:
				for (l >>>= u & 7, u -= u & 7; u < 32;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				if ((l & 65535) != (l >>> 16 ^ 65535)) {
					e.msg = "invalid stored block lengths", n.mode = W;
					break;
				}
				if (n.length = l & 65535, l = 0, u = 0, n.mode = Hi, t === bi) break inf_leave;
			case Hi: n.mode = Ui;
			case Ui:
				if (p = n.length, p) {
					if (p > s && (p = s), p > c && (p = c), p === 0) break inf_leave;
					i.set(r.subarray(a, a + p), o), s -= p, a += p, c -= p, o += p, n.length -= p;
					break;
				}
				n.mode = zi;
				break;
			case Wi:
				for (; u < 14;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				if (n.nlen = (l & 31) + 257, l >>>= 5, u -= 5, n.ndist = (l & 31) + 1, l >>>= 5, u -= 5, n.ncode = (l & 15) + 4, l >>>= 4, u -= 4, n.nlen > 286 || n.ndist > 30) {
					e.msg = "too many length or distance symbols", n.mode = W;
					break;
				}
				n.have = 0, n.mode = Gi;
			case Gi:
				for (; n.have < n.ncode;) {
					for (; u < 3;) {
						if (s === 0) break inf_leave;
						s--, l += r[a++] << u, u += 8;
					}
					n.lens[O[n.have++]] = l & 7, l >>>= 3, u -= 3;
				}
				for (; n.have < 19;) n.lens[O[n.have++]] = 0;
				if (n.lencode = n.lendyn, n.lenbits = 7, E = { bits: n.lenbits }, w = mi(hi, n.lens, 0, 19, n.lencode, 0, n.work, E), n.lenbits = E.bits, w) {
					e.msg = "invalid code lengths set", n.mode = W;
					break;
				}
				n.have = 0, n.mode = Ki;
			case Ki:
				for (; n.have < n.nlen + n.ndist;) {
					for (; g = n.lencode[l & (1 << n.lenbits) - 1], _ = g >>> 24, v = g >>> 16 & 255, y = g & 65535, !(_ <= u);) {
						if (s === 0) break inf_leave;
						s--, l += r[a++] << u, u += 8;
					}
					if (y < 16) l >>>= _, u -= _, n.lens[n.have++] = y;
					else {
						if (y === 16) {
							for (D = _ + 2; u < D;) {
								if (s === 0) break inf_leave;
								s--, l += r[a++] << u, u += 8;
							}
							if (l >>>= _, u -= _, n.have === 0) {
								e.msg = "invalid bit length repeat", n.mode = W;
								break;
							}
							C = n.lens[n.have - 1], p = 3 + (l & 3), l >>>= 2, u -= 2;
						} else if (y === 17) {
							for (D = _ + 3; u < D;) {
								if (s === 0) break inf_leave;
								s--, l += r[a++] << u, u += 8;
							}
							l >>>= _, u -= _, C = 0, p = 3 + (l & 7), l >>>= 3, u -= 3;
						} else {
							for (D = _ + 7; u < D;) {
								if (s === 0) break inf_leave;
								s--, l += r[a++] << u, u += 8;
							}
							l >>>= _, u -= _, C = 0, p = 11 + (l & 127), l >>>= 7, u -= 7;
						}
						if (n.have + p > n.nlen + n.ndist) {
							e.msg = "invalid bit length repeat", n.mode = W;
							break;
						}
						for (; p--;) n.lens[n.have++] = C;
					}
				}
				if (n.mode === W) break;
				if (n.lens[256] === 0) {
					e.msg = "invalid code -- missing end-of-block", n.mode = W;
					break;
				}
				if (n.lenbits = 9, E = { bits: n.lenbits }, w = mi(gi, n.lens, 0, n.nlen, n.lencode, 0, n.work, E), n.lenbits = E.bits, w) {
					e.msg = "invalid literal/lengths set", n.mode = W;
					break;
				}
				if (n.distbits = 6, n.distcode = n.distdyn, E = { bits: n.distbits }, w = mi(_i, n.lens, n.nlen, n.ndist, n.distcode, 0, n.work, E), n.distbits = E.bits, w) {
					e.msg = "invalid distances set", n.mode = W;
					break;
				}
				if (n.mode = qi, t === bi) break inf_leave;
			case qi: n.mode = Ji;
			case Ji:
				if (s >= 6 && c >= 258) {
					e.next_out = o, e.avail_out = c, e.next_in = a, e.avail_in = s, n.hold = l, n.bits = u, ri(e, f), o = e.next_out, i = e.output, c = e.avail_out, a = e.next_in, r = e.input, s = e.avail_in, l = n.hold, u = n.bits, n.mode === zi && (n.back = -1);
					break;
				}
				for (n.back = 0; g = n.lencode[l & (1 << n.lenbits) - 1], _ = g >>> 24, v = g >>> 16 & 255, y = g & 65535, !(_ <= u);) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				if (v && !(v & 240)) {
					for (b = _, x = v, S = y; g = n.lencode[S + ((l & (1 << b + x) - 1) >> b)], _ = g >>> 24, v = g >>> 16 & 255, y = g & 65535, !(b + _ <= u);) {
						if (s === 0) break inf_leave;
						s--, l += r[a++] << u, u += 8;
					}
					l >>>= b, u -= b, n.back += b;
				}
				if (l >>>= _, u -= _, n.back += _, n.length = y, v === 0) {
					n.mode = $i;
					break;
				}
				if (v & 32) {
					n.back = -1, n.mode = zi;
					break;
				}
				if (v & 64) {
					e.msg = "invalid literal/length code", n.mode = W;
					break;
				}
				n.extra = v & 15, n.mode = Yi;
			case Yi:
				if (n.extra) {
					for (D = n.extra; u < D;) {
						if (s === 0) break inf_leave;
						s--, l += r[a++] << u, u += 8;
					}
					n.length += l & (1 << n.extra) - 1, l >>>= n.extra, u -= n.extra, n.back += n.extra;
				}
				n.was = n.length, n.mode = Xi;
			case Xi:
				for (; g = n.distcode[l & (1 << n.distbits) - 1], _ = g >>> 24, v = g >>> 16 & 255, y = g & 65535, !(_ <= u);) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				if (!(v & 240)) {
					for (b = _, x = v, S = y; g = n.distcode[S + ((l & (1 << b + x) - 1) >> b)], _ = g >>> 24, v = g >>> 16 & 255, y = g & 65535, !(b + _ <= u);) {
						if (s === 0) break inf_leave;
						s--, l += r[a++] << u, u += 8;
					}
					l >>>= b, u -= b, n.back += b;
				}
				if (l >>>= _, u -= _, n.back += _, v & 64) {
					e.msg = "invalid distance code", n.mode = W;
					break;
				}
				n.offset = y, n.extra = v & 15, n.mode = Zi;
			case Zi:
				if (n.extra) {
					for (D = n.extra; u < D;) {
						if (s === 0) break inf_leave;
						s--, l += r[a++] << u, u += 8;
					}
					n.offset += l & (1 << n.extra) - 1, l >>>= n.extra, u -= n.extra, n.back += n.extra;
				}
				if (n.offset > n.dmax) {
					e.msg = "invalid distance too far back", n.mode = W;
					break;
				}
				n.mode = Qi;
			case Qi:
				if (c === 0) break inf_leave;
				if (p = f - c, n.offset > p) {
					if (p = n.offset - p, p > n.whave && n.sane) {
						e.msg = "invalid distance too far back", n.mode = W;
						break;
					}
					p > n.wnext ? (p -= n.wnext, m = n.wsize - p) : m = n.wnext - p, p > n.length && (p = n.length), h = n.window;
				} else h = i, m = o - n.offset, p = n.length;
				p > c && (p = c), c -= p, n.length -= p;
				do
					i[o++] = h[m++];
				while (--p);
				n.length === 0 && (n.mode = Ji);
				break;
			case $i:
				if (c === 0) break inf_leave;
				i[o++] = n.length, c--, n.mode = Ji;
				break;
			case ea:
				if (n.wrap) {
					for (; u < 32;) {
						if (s === 0) break inf_leave;
						s--, l |= r[a++] << u, u += 8;
					}
					if (f -= c, e.total_out += f, n.total += f, n.wrap & 4 && f && (e.adler = n.check = n.flags ? N(n.check, i, f, o - f) : _n(n.check, i, f, o - f)), f = c, n.wrap & 4 && (n.flags ? l : ca(l)) !== n.check) {
						e.msg = "incorrect data check", n.mode = W;
						break;
					}
					l = 0, u = 0;
				}
				n.mode = ta;
			case ta:
				if (n.wrap && n.flags) {
					for (; u < 32;) {
						if (s === 0) break inf_leave;
						s--, l += r[a++] << u, u += 8;
					}
					if (n.wrap & 4 && l !== (n.total | 0)) {
						e.msg = "incorrect length check", n.mode = W;
						break;
					}
					l = 0, u = 0;
				}
				n.mode = na;
			case na:
				w = Si;
				break inf_leave;
			case W:
				w = wi;
				break inf_leave;
			case ra: return Ti;
			case ia:
			default: return U;
		}
		return e.next_out = o, e.avail_out = c, e.next_in = a, e.avail_in = s, n.hold = l, n.bits = u, (n.wsize || f !== e.avail_out && n.mode < W && (n.mode < ea || t !== vi)) && ba(e, e.output, e.next_out, f - e.avail_out), d -= e.avail_in, f -= e.avail_out, e.total_in += d, e.total_out += f, n.total += f, n.wrap & 4 && f && (e.adler = n.check = n.flags ? N(n.check, i, f, e.next_out - f) : _n(n.check, i, f, e.next_out - f)), e.data_type = n.bits + (n.last ? 64 : 0) + (n.mode === zi ? 128 : 0) + (n.mode === qi || n.mode === Hi ? 256 : 0), (d === 0 && f === 0 || t === vi) && w === xi && (w = Ei), w;
	},
	inflateEnd: (e) => {
		if (ua(e)) return U;
		let t = e.state;
		return t.window &&= null, e.state = null, xi;
	},
	inflateGetHeader: (e, t) => {
		if (ua(e)) return U;
		let n = e.state;
		return n.wrap & 2 ? (n.head = t, t.done = !1, xi) : U;
	},
	inflateSetDictionary: (e, t) => {
		let n = t.length, r, i, a;
		return ua(e) || (r = e.state, r.wrap !== 0 && r.mode !== Ri) ? U : r.mode === Ri && (i = 1, i = _n(i, t, n, 0), i !== r.check) ? wi : (a = ba(e, t, n, n), a ? (r.mode = ra, Ti) : (r.havedict = 1, xi));
	},
	inflateInfo: "pako inflate (from Nodeca project)"
};
function Sa() {
	this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
}
var Ca = Sa, wa = Object.prototype.toString, { Z_NO_FLUSH: Ta, Z_FINISH: Ea, Z_OK: Da, Z_STREAM_END: Oa, Z_NEED_DICT: ka, Z_STREAM_ERROR: Aa, Z_DATA_ERROR: ja, Z_MEM_ERROR: Ma, Z_BUF_ERROR: Na } = bn, Pa = {
	chunkSize: 65536,
	windowBits: 15,
	to: ""
};
function Fa(e) {
	this.options = jr.assign({}, Pa, e || {});
	let t = this.options;
	t.raw && t.windowBits >= 0 && t.windowBits < 16 && (t.windowBits = -t.windowBits, t.windowBits === 0 && (t.windowBits = -15)), t.windowBits >= 0 && t.windowBits < 16 && !(e && e.windowBits) && (t.windowBits += 32), t.windowBits > 15 && t.windowBits < 48 && (t.windowBits & 15 || (t.windowBits |= 15)), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new Rr(), this.strm.avail_out = 0;
	let n = xa.inflateInit2(this.strm, t.windowBits);
	if (n !== Da || (this.header = new Ca(), xa.inflateGetHeader(this.strm, this.header), t.dictionary && (typeof t.dictionary == "string" ? t.dictionary = Ir.string2buf(t.dictionary) : wa.call(t.dictionary) === "[object ArrayBuffer]" && (t.dictionary = new Uint8Array(t.dictionary)), t.raw && (n = xa.inflateSetDictionary(this.strm, t.dictionary), n !== Da)))) throw Error(yn[n]);
}
Fa.prototype.push = function(e, t) {
	let n = this.strm, r = this.options.chunkSize, i = this.options.dictionary, a, o, s;
	if (this.ended) return !1;
	for (o = t === ~~t ? t : t === !0 ? Ea : Ta, n.input = wa.call(e) === "[object ArrayBuffer]" ? new Uint8Array(e) : e, n.next_in = 0, n.avail_in = n.input.length;;) {
		for (n.avail_out === 0 && (n.output = new Uint8Array(r), n.next_out = 0, n.avail_out = r), a = xa.inflate(n, o), a === ka && i && (a = xa.inflateSetDictionary(n, i), a === Da ? a = xa.inflate(n, o) : a === ja && (a = ka)); n.avail_in > 0 && a === Oa && n.state.wrap & 2 && n.state.flags !== 0 && n.input[n.next_in] !== 0;) xa.inflateReset(n), a = xa.inflate(n, o);
		switch (a) {
			case Aa:
			case ja:
			case ka:
			case Ma: return this.onEnd(a), this.ended = !0, !1;
		}
		if (s = n.avail_out, n.next_out && (n.avail_out === 0 || a === Oa || o > 0)) {
			if (this.options.to === "string") {
				let e = Ir.utf8border(n.output, n.next_out), t = n.next_out - e, i = Ir.buf2string(n.output, e);
				n.next_out = t, n.avail_out = r - t, t && n.output.set(n.output.subarray(e, e + t), 0), this.onData(i);
			} else this.onData(n.output.length === n.next_out ? n.output : n.output.subarray(0, n.next_out)), n.avail_out = 0, n.next_out = 0;
		}
		if (a !== Da && a !== Na || s !== 0) {
			if (a === Oa) return a = xa.inflateEnd(this.strm), this.onEnd(a), this.ended = !0, !0;
			if (n.avail_in === 0) {
				if (o === Ea) return a = xa.inflateEnd(this.strm), this.onEnd(a === Da ? Na : a), this.ended = !0, !1;
				break;
			}
		}
	}
	return !0;
}, Fa.prototype.onData = function(e) {
	this.chunks.push(e);
}, Fa.prototype.onEnd = function(e) {
	e === Da && (this.result = this.options.to === "string" ? this.chunks.join("") : jr.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg;
};
function Ia(e, t) {
	let n = new Fa(t);
	if (n.push(e, !0), n.err) throw n.msg || yn[n.err];
	return n.result;
}
function La(e, t) {
	return t ||= {}, t.raw = !0, Ia(e, t);
}
var Ra = {
	Inflate: Fa,
	inflate: Ia,
	inflateRaw: La,
	ungzip: Ia,
	constants: bn
}, { Deflate: za, deflate: Ba, deflateRaw: Va, gzip: Ha } = ei, { Inflate: Ua, inflate: Wa, inflateRaw: Ga, ungzip: Ka } = Ra, qa = Ba, Ja = Ua;
// node_modules/esptool-js/lib/util.js
function Ya(e, t, n = 255) {
	let r = e.length % t;
	if (r !== 0) {
		let i = new Uint8Array(t - r).fill(n), a = new Uint8Array(e.length + i.length);
		return a.set(e), a.set(i, e.length), a;
	}
	return e;
}
function Xa(e, t = 239) {
	for (let n = 0; n < e.length; n++) t ^= e[n];
	return t;
}
function Za(e) {
	let t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	return t;
}
function Qa(e) {
	return new Promise((t) => setTimeout(t, e));
}
// node_modules/esptool-js/lib/webserial.js
var $a = class {
	constructor(e, t = !1, n = !0) {
		this.device = e, this.tracing = t, this.slipReaderEnabled = !1, this.baudrate = 0, this.traceLog = "", this.lastTraceTime = Date.now(), this.buffer = /* @__PURE__ */ new Uint8Array(), this.onDeviceLostCallback = null, this.SLIP_END = 192, this.SLIP_ESC = 219, this.SLIP_ESC_END = 220, this.SLIP_ESC_ESC = 221, this._DTR_state = !1, this.slipReaderEnabled = n;
	}
	setDeviceLostCallback(e) {
		this.onDeviceLostCallback = e;
	}
	updateDevice(e) {
		this.device = e, this.trace("Device reference updated");
	}
	getInfo() {
		let e = this.device.getInfo();
		return e.usbVendorId && e.usbProductId ? `WebSerial VendorID 0x${e.usbVendorId.toString(16)} ProductID 0x${e.usbProductId.toString(16)}` : "";
	}
	getPid() {
		return this.device.getInfo().usbProductId;
	}
	trace(e) {
		let t = `${`TRACE ${(Date.now() - this.lastTraceTime).toFixed(3)}`} ${e}`;
		console.log(t), this.traceLog += t + "\n";
	}
	async returnTrace() {
		try {
			await navigator.clipboard.writeText(this.traceLog), console.log("Text copied to clipboard!");
		} catch (e) {
			console.error("Failed to copy text:", e);
		}
	}
	hexify(e) {
		return Array.from(e).map((e) => e.toString(16).padStart(2, "0")).join("").padEnd(16, " ");
	}
	hexConvert(e, t = !0) {
		if (t && e.length > 16) {
			let t = "", n = e;
			for (; n.length > 0;) {
				let e = n.slice(0, 16), r = String.fromCharCode(...e).split("").map((e) => e === " " || e >= " " && e <= "~" && e !== "  " ? e : ".").join("");
				n = n.slice(16), t += `\n    ${this.hexify(e.slice(0, 8))} ${this.hexify(e.slice(8))} | ${r}`;
			}
			return t;
		}
		return this.hexify(e);
	}
	slipWriter(e) {
		let t = [];
		t.push(192);
		for (let n = 0; n < e.length; n++) e[n] === 219 ? t.push(219, 221) : e[n] === 192 ? t.push(219, 220) : t.push(e[n]);
		return t.push(192), new Uint8Array(t);
	}
	async write(e) {
		let t = this.slipWriter(e);
		if (this.device.writable) {
			let e = this.device.writable.getWriter();
			this.tracing && this.trace(`Write ${t.length} bytes: ${this.hexConvert(t)}`), await e.write(t), e.releaseLock();
		}
	}
	appendArray(e, t) {
		let n = new Uint8Array(e.length + t.length);
		return n.set(e), n.set(t, e.length), n;
	}
	async readLoop() {
		for (; this.device.readable;) {
			this.reader = this.device.readable?.getReader();
			try {
				let { value: e, done: t } = await this.reader.read();
				if (t) {
					this.trace("Serial port done");
					break;
				}
				if (e && e.length) {
					let t = Uint8Array.from(e);
					this.buffer = this.appendArray(this.buffer, t);
				}
			} catch (e) {
				if (e instanceof Error) {
					if ([
						"BufferOverrunError",
						"FramingError",
						"BreakError",
						"ParityError"
					].includes(e.name)) {
						this.trace(`Recoverable serial port error: ${e.message}`);
						continue;
					}
					this.trace(`Unrecoverable serial port error: ${e.message}`);
					break;
				}
				if (e instanceof DOMException) {
					this.onDeviceLostCallback ? this.onDeviceLostCallback() : this.trace(`Unrecoverable serial port error: ${e.message}`);
					break;
				}
				this.trace(`Unrecoverable serial port error: ${e}`);
				break;
			} finally {
				this.reader.releaseLock();
			}
		}
		this.trace("readLoop exited");
	}
	flushInput() {
		this.buffer = /* @__PURE__ */ new Uint8Array();
	}
	async flushOutput() {
		try {
			if (this.device.writable) {
				let e = this.device.writable.getWriter();
				await e.close(), e.releaseLock();
			}
		} catch (e) {
			this.trace(`Error while flushing output: ${e}`);
		}
	}
	inWaiting() {
		return this.buffer.length;
	}
	peek() {
		return this.buffer;
	}
	detectPanicHandler(e) {
		let t = /G?uru Meditation Error: (?:Core \d panic'ed \(([a-zA-Z ]*)\))?/, n = /F?atal exception \(\d+\): (?:([a-zA-Z ]*)?.*epc)?/, r = new TextDecoder("utf-8").decode(e), i = r.match(t) || r.match(n);
		if (i) {
			let e = i[1] || i[2], t = `Guru Meditation Error detected${e ? ` (${e})` : ""}`;
			throw Error(t);
		}
	}
	async read(e) {
		let t = null, n = !1, r = null;
		for (;;) {
			let i = Date.now();
			for (r = /* @__PURE__ */ new Uint8Array(); Date.now() - i < e;) if (this.buffer.length > 0) {
				r = this.buffer, this.buffer = /* @__PURE__ */ new Uint8Array();
				break;
			} else await Qa(1);
			if (!r || r.length === 0) {
				let e = t === null ? "Serial data stream stopped: Possible serial noise or corruption." : "No serial data received.";
				throw this.tracing && this.trace(e), Error(e);
			}
			this.tracing && this.trace(`Read ${r.length} bytes: ${this.hexConvert(r)}`);
			for (let e = 0; e < r.length; e++) {
				let i = r[e];
				if (t === null) {
					if (i === this.SLIP_END) t = /* @__PURE__ */ new Uint8Array();
					else {
						this.tracing && this.trace(`Read invalid data: ${this.hexConvert(r)}`);
						let e = this.buffer;
						throw this.tracing && this.trace(`Remaining data in serial buffer: ${this.hexConvert(e)}`), this.detectPanicHandler(new Uint8Array([...r, ...e || []])), Error(`Invalid head of packet (0x${i.toString(16)}): Possible serial noise or corruption.`);
					}
				} else if (n) {
					if (n = !1, i === this.SLIP_ESC_END) t = this.appendArray(t, new Uint8Array([this.SLIP_END]));
					else if (i === this.SLIP_ESC_ESC) t = this.appendArray(t, new Uint8Array([this.SLIP_ESC]));
					else {
						this.tracing && this.trace(`Read invalid data: ${this.hexConvert(r)}`);
						let e = this.buffer;
						throw this.tracing && this.trace(`Remaining data in serial buffer: ${this.hexConvert(e)}`), this.detectPanicHandler(new Uint8Array([...r, ...e || []])), Error(`Invalid SLIP escape (0xdb, 0x${i.toString(16)})`);
					}
				} else if (i === this.SLIP_ESC) n = !0;
				else if (i === this.SLIP_END) {
					if (this.tracing && this.trace(`Received full packet: ${this.hexConvert(t)}`), e + 1 < r.length) {
						let t = r.slice(e + 1);
						this.buffer = this.appendArray(t, this.buffer);
					}
					return t;
				} else t = this.appendArray(t, new Uint8Array([i]));
			}
		}
	}
	async rawRead(e, t) {
		let n;
		try {
			if (!this.device.readable) return;
			for (n = this.device.readable.getReader(), this.reader = n; !t();) {
				let { value: t, done: r } = await n.read();
				if (r || !t) break;
				this.tracing && this.trace(`Read ${t.length} bytes: ${this.hexConvert(t)}`), e(t);
			}
		} catch (e) {
			this.trace(`Error reading from serial port: ${e}`), e instanceof Error && e.name === "NetworkError" && e.message.includes("device has been lost") && (this.trace("Device lost detected (NetworkError)"), this.onDeviceLostCallback && this.onDeviceLostCallback());
		} finally {
			n?.releaseLock(), this.reader === n && (this.reader = void 0);
		}
	}
	async setRTS(e) {
		await this.device.setSignals({ requestToSend: e }), await this.setDTR(this._DTR_state);
	}
	async setDTR(e) {
		this._DTR_state = e, await this.device.setSignals({ dataTerminalReady: e });
	}
	async connect(e = 115200, t = {}) {
		await this.device.open({
			baudRate: e,
			dataBits: t?.dataBits,
			stopBits: t?.stopBits,
			bufferSize: t?.bufferSize,
			parity: t?.parity,
			flowControl: t?.flowControl
		}), this.baudrate = e;
	}
	async waitForUnlock(e) {
		for (; this.device.readable && this.device.readable.locked || this.device.writable && this.device.writable.locked;) await Qa(e);
	}
	async disconnect() {
		this.device.readable?.locked && await this.reader?.cancel(), await this.waitForUnlock(400), await this.device.close(), this.reader = void 0;
	}
};
// node_modules/esptool-js/lib/reset.js
function eo(e) {
	return new Promise((t) => setTimeout(t, e));
}
var to = class {
	constructor(e, t) {
		this.resetDelay = t, this.transport = e;
	}
	async reset() {
		await this.transport.setDTR(!1), await this.transport.setRTS(!0), await eo(100), await this.transport.setDTR(!0), await this.transport.setRTS(!1), await eo(this.resetDelay), await this.transport.setDTR(!1);
	}
}, no = class {
	constructor(e) {
		this.transport = e;
	}
	async reset() {
		await this.transport.setRTS(!1), await this.transport.setDTR(!1), await eo(100), await this.transport.setDTR(!0), await this.transport.setRTS(!1), await eo(100), await this.transport.setRTS(!0), await this.transport.setDTR(!1), await this.transport.setRTS(!0), await eo(100), await this.transport.setRTS(!1), await this.transport.setDTR(!1);
	}
}, ro = class {
	constructor(e, t = !1) {
		this.transport = e, this.usingUsbOtg = t, this.transport = e;
	}
	async reset() {
		this.usingUsbOtg ? (await eo(200), await this.transport.setRTS(!1), await eo(200)) : (await eo(100), await this.transport.setRTS(!1));
	}
};
function io(e) {
	let t = [
		"D",
		"R",
		"W"
	], n = e.split("|");
	for (let e of n) {
		let n = e[0], r = e.slice(1);
		if (!t.includes(n)) return !1;
		if (n === "D" || n === "R") {
			if (r !== "0" && r !== "1") return !1;
		} else if (n === "W") {
			let e = parseInt(r);
			if (isNaN(e) || e <= 0) return !1;
		}
	}
	return !0;
}
var ao = class {
	constructor(e, t) {
		this.transport = e, this.sequenceString = t, this.transport = e;
	}
	async reset() {
		let e = {
			D: async (e) => await this.transport.setDTR(e),
			R: async (e) => await this.transport.setRTS(e),
			W: async (e) => await eo(e)
		};
		try {
			if (!io(this.sequenceString)) return;
			let t = this.sequenceString.split("|");
			for (let n of t) {
				let t = n[0], r = n.slice(1);
				t === "W" ? await e.W(Number(r)) : (t === "D" || t === "R") && await e[t](r === "1");
			}
		} catch {
			throw Error("Invalid custom reset sequence");
		}
	}
}, oo = /* @__PURE__ */ me((/* @__PURE__ */ de(((e, t) => {
	t.exports = function(e) {
		return atob(e);
	};
})))());
async function so(e, t) {
	let n;
	switch (e) {
		case "ESP32":
			n = await import("./stub_flasher_32-QwmIcHIz.js");
			break;
		case "ESP32-C2":
			n = await import("./stub_flasher_32c2-DKiFleJ-.js");
			break;
		case "ESP32-C3":
			n = await import("./stub_flasher_32c3-C7zoDBsM.js");
			break;
		case "ESP32-C5":
			n = await import("./stub_flasher_32c5-CSz_BALR.js");
			break;
		case "ESP32-C6":
			n = await import("./stub_flasher_32c6-DFGgn7cV.js");
			break;
		case "ESP32-C61":
			n = await import("./stub_flasher_32c61-DejNUdFk.js");
			break;
		case "ESP32-H2":
			n = await import("./stub_flasher_32h2-jTGwALAF.js");
			break;
		case "ESP32-P4":
			n = t && t < 300 ? await import("./stub_flasher_32p4rc1-CfmI8raz.js") : await import("./stub_flasher_32p4-D4cYfdu3.js");
			break;
		case "ESP32-S2":
			n = await import("./stub_flasher_32s2-BQddEncd.js");
			break;
		case "ESP32-S3":
			n = await import("./stub_flasher_32s3-C0FFy-jX.js");
			break;
		case "ESP8266": n = await import("./stub_flasher_8266-CMlSPTeX.js");
	}
	if (n) return {
		bss_start: n.bss_start,
		data: n.data,
		data_start: n.data_start,
		entry: n.entry,
		text: n.text,
		text_start: n.text_start,
		decodedData: co(n.data),
		decodedText: co(n.text)
	};
}
function co(e) {
	let t = (0, oo.default)(e).split("").map(function(e) {
		return e.charCodeAt(0);
	});
	return new Uint8Array(t);
}
// node_modules/esptool-js/lib/targets/esp8266.js
var lo = class extends te {
	constructor() {
		super(...arguments), this.CHIP_NAME = "ESP8266", this.CHIP_DETECT_MAGIC_VALUE = [4293968129], this.EFUSE_RD_REG_BASE = 1072693328, this.UART_CLKDIV_REG = 1610612756, this.UART_CLKDIV_MASK = 1048575, this.XTAL_CLK_DIVIDER = 2, this.FLASH_WRITE_SIZE = 16384, this.BOOTLOADER_FLASH_OFFSET = 0, this.UART_DATE_REG_ADDR = 0, this.FLASH_SIZES = {
			"512KB": 0,
			"256KB": 16,
			"1MB": 32,
			"2MB": 48,
			"4MB": 64,
			"2MB-c1": 80,
			"4MB-c1": 96,
			"8MB": 128,
			"16MB": 144
		}, this.FLASH_FREQUENCY = {
			"80m": 15,
			"40m": 0,
			"26m": 1,
			"20m": 2
		}, this.MEMORY_MAP = [
			[
				1072693248,
				1072693264,
				"DPORT"
			],
			[
				1073643520,
				1073741824,
				"DRAM"
			],
			[
				1074790400,
				1074823168,
				"IRAM"
			],
			[
				1075843088,
				1076760592,
				"IROM"
			]
		], this.SPI_REG_BASE = 1610613248, this.SPI_USR_OFFS = 28, this.SPI_USR1_OFFS = 32, this.SPI_USR2_OFFS = 36, this.SPI_MOSI_DLEN_OFFS = 0, this.SPI_MISO_DLEN_OFFS = 0, this.SPI_W0_OFFS = 64, this.getChipFeatures = async (e) => {
			let t = ["WiFi"];
			return await this.getChipDescription(e) == "ESP8285" && t.push("Embedded Flash"), t;
		};
	}
	async readEfuse(e, t) {
		let n = this.EFUSE_RD_REG_BASE + 4 * t;
		return e.debug("Read efuse " + n), await e.readReg(n);
	}
	async getChipDescription(e) {
		let t = await this.readEfuse(e, 2);
		return await this.readEfuse(e, 0) & 16 | t & 65536 ? "ESP8285" : "ESP8266EX";
	}
	async getCrystalFreq(e) {
		let t = await e.readReg(this.UART_CLKDIV_REG) & this.UART_CLKDIV_MASK, n = e.transport.baudrate * t / 1e6 / this.XTAL_CLK_DIVIDER, r;
		return r = n > 33 ? 40 : 26, Math.abs(r - n) > 1 && e.info("WARNING: Detected crystal freq " + n + "MHz is quite different to normalized freq " + r + "MHz. Unsupported crystal in use?"), r;
	}
	_d2h(e) {
		let t = (+e).toString(16);
		return t.length === 1 ? "0" + t : t;
	}
	async readMac(e) {
		let t = await this.readEfuse(e, 0);
		t >>>= 0;
		let n = await this.readEfuse(e, 1);
		n >>>= 0;
		let r = await this.readEfuse(e, 3);
		r >>>= 0;
		let i = /* @__PURE__ */ new Uint8Array(6);
		return r == 0 ? n >> 16 & 255 ? (n >> 16 & 255) == 1 ? (i[0] = 172, i[1] = 208, i[2] = 116) : e.error("Unknown OUI") : (i[0] = 24, i[1] = 254, i[2] = 52) : (i[0] = r >> 16 & 255, i[1] = r >> 8 & 255, i[2] = r & 255), i[3] = n >> 8 & 255, i[4] = n & 255, i[5] = t >> 24 & 255, this._d2h(i[0]) + ":" + this._d2h(i[1]) + ":" + this._d2h(i[2]) + ":" + this._d2h(i[3]) + ":" + this._d2h(i[4]) + ":" + this._d2h(i[5]);
	}
	getEraseSize(e, t) {
		return t;
	}
};
lo.IROM_MAP_START = 1075838976, lo.IROM_MAP_END = 1076887552;
function uo(e, t) {
	return e + (t - 1 - e % t);
}
function fo(e, t) {
	return e[t] | e[t + 1] << 8 | e[t + 2] << 16 | e[t + 3] << 24;
}
var po = class e {
	constructor(e, t, n = null, r = 0) {
		this.addr = e, this.data = t, this.fileOffs = n, this.flags = r, this.includeInChecksum = !0, this.addr !== 0 && this.padToAlignment(4);
	}
	copyWithNewAddr(t) {
		return new e(t, this.data, 0);
	}
	splitImage(t) {
		let n = new e(this.addr, this.data.slice(0, t), 0);
		return this.data = this.data.slice(t), this.addr += t, this.fileOffs = null, n;
	}
	toString() {
		let e = `len 0x${this.data.length.toString(16).padStart(5, "0")} load 0x${this.addr.toString(16).padStart(8, "0")}`;
		return this.fileOffs !== null && (e += ` file_offs 0x${this.fileOffs.toString(16).padStart(8, "0")}`), e;
	}
	getMemoryType(e) {
		return e.ROM_LOADER.MEMORY_MAP.filter((e) => e[0] <= this.addr && this.addr < e[1]).map((e) => e[2]);
	}
	padToAlignment(e) {
		this.data = Ya(this.data, e, 0);
	}
}, mo = class extends po {
	constructor(e, t, n, r) {
		super(t, n, null, r), this.name = e;
	}
	toString() {
		return `${this.name} ${super.toString()}`;
	}
}, ho = class {
	constructor(e) {
		this.SEG_HEADER_LEN = 8, this.SHA256_DIGEST_LEN = 32, this.ELF_FLAG_WRITE = 1, this.ELF_FLAG_READ = 2, this.ELF_FLAG_EXEC = 4, this.segments = [], this.entrypoint = 0, this.elfSha256 = null, this.elfSha256Offset = 0, this.padToSize = 0, this.flashMode = 0, this.flashSizeFreq = 0, this.checksum = 0, this.datalength = 0, this.IROM_ALIGN = 0, this.MMU_PAGE_SIZE_CONF = [], this.ROM_LOADER = e;
	}
	loadCommonHeader(e, t, n) {
		let r = e[t], i = e[t + 1];
		if (this.flashMode = e[t + 2], this.flashSizeFreq = e[t + 3], this.entrypoint = fo(e, t + 4), r !== n) throw new A(`Invalid firmware image magic=0x${r.toString(16)}`);
		return i;
	}
	verify() {
		if (this.segments.length > 16) throw new A(`Invalid segment count ${this.segments.length} (max 16). Usually this indicates a linker script problem.`);
	}
	loadSegment(e, t, n = !1) {
		let r = t, i = fo(e, t), a = fo(e, t + 4);
		this.warnIfUnusualSegment(i, a, n);
		let o = e.slice(t + 8, t + 8 + a);
		if (o.length < a) throw new A(`End of file reading segment 0x${i.toString(16)}, length ${a} (actual length ${o.length})`);
		let s = new po(i, o, r);
		return this.segments.push(s), s;
	}
	warnIfUnusualSegment(e, t, n) {
		n || (e > 1075838976 || e < 1073610752 || t > 65536) && console.warn(`WARNING: Suspicious segment 0x${e.toString(16)}, length ${t}`);
	}
	maybePatchSegmentData(e, t) {
		let n = e.length;
		if (this.elfSha256Offset >= t && this.elfSha256Offset < t + n) {
			let r = this.elfSha256Offset - t;
			if (r < this.SEG_HEADER_LEN || r + this.SHA256_DIGEST_LEN > n) throw new A(`Cannot place SHA256 digest on segment boundary(elf_sha256_offset=${this.elfSha256Offset}, file_pos=${t}, segment_size=${n})`);
			let i = r - this.SEG_HEADER_LEN;
			if (!e.slice(i, i + this.SHA256_DIGEST_LEN).every((e) => e === 0)) throw new A(`Contents of segment at SHA256 digest offset 0x${this.elfSha256Offset.toString(16)} are not all zero. Refusing to overwrite.`);
			if (!this.elfSha256 || this.elfSha256.length !== this.SHA256_DIGEST_LEN) throw new A("ELF SHA256 digest is not properly initialized");
			let a = e.slice(0, i), o = e.slice(i + this.SHA256_DIGEST_LEN), s = a.length + this.elfSha256.length + o.length, c = new Uint8Array(s);
			return c.set(a, 0), c.set(this.elfSha256, a.length), c.set(o, a.length + this.elfSha256.length), c;
		}
		return e;
	}
	saveSegment(e, t, n, r = null) {
		let i = this.maybePatchSegmentData(n.data, t), a = new DataView(e.buffer, t);
		return a.setUint32(0, n.addr, !0), a.setUint32(4, i.length, !0), e.set(i, t + 8), r === null ? 0 : Xa(i, r);
	}
	saveFlashSegment(e, t, n, r = null) {
		if (this.ROM_LOADER.CHIP_NAME === "ESP32") {
			let e = (t + n.data.length + this.SEG_HEADER_LEN) % this.IROM_ALIGN;
			if (e < 36) {
				let t = new Uint8Array(n.data.length + (36 - e));
				t.set(n.data), t.fill(0, n.data.length), n.data = t;
			}
		}
		return this.saveSegment(e, t, n, r);
	}
	readChecksum(e, t) {
		return e[uo(t, 16)];
	}
	calculateChecksum() {
		let e = 239;
		for (let t of this.segments) t.includeInChecksum && (e = Xa(t.data, e));
		return e;
	}
	appendChecksum(e, t, n) {
		let r = uo(t, 16);
		e[r] = n;
	}
	writeCommonHeader(e, t, n) {
		e[t] = 233, e[t + 1] = n, e[t + 2] = this.flashMode, e[t + 3] = this.flashSizeFreq, new DataView(e.buffer, t + 4).setUint32(0, this.entrypoint, !0);
	}
	isIromAddr(e) {
		return lo.IROM_MAP_START <= e && e < lo.IROM_MAP_END;
	}
	getIromSegment() {
		let e = this.segments.filter((e) => this.isIromAddr(e.addr));
		if (e.length > 0) {
			if (e.length !== 1) throw new A(`Found ${e.length} segments that could be irom0. Bad ELF file?`);
			return e[0];
		}
		return null;
	}
	getNonIromSegments() {
		let e = this.getIromSegment();
		return this.segments.filter((t) => t !== e);
	}
	sortSegments() {
		this.segments.length && this.segments.sort((e, t) => e.addr - t.addr);
	}
	mergeAdjacentSegments() {
		if (!this.segments.length) return;
		let e = [];
		for (let t = this.segments.length - 1; t > 0; t--) {
			let n = this.segments[t - 1], r = this.segments[t];
			if (n.getMemoryType(this).join(",") === r.getMemoryType(this).join(",") && n.includeInChecksum === r.includeInChecksum && r.addr === n.addr + n.data.length && (r.flags & this.ELF_FLAG_EXEC) === (n.flags & this.ELF_FLAG_EXEC)) {
				let e = new Uint8Array(n.data.length + r.data.length);
				e.set(n.data), e.set(r.data, n.data.length), n.data = e;
			} else e.unshift(r);
		}
		e.unshift(this.segments[0]), this.segments = e;
	}
	setMmuPageSize(e) {
		if (!this.MMU_PAGE_SIZE_CONF && e !== this.IROM_ALIGN) console.warn(`WARNING: Changing MMU page size is not supported on ${this.ROM_LOADER.CHIP_NAME}! ` + (this.IROM_ALIGN === 0 ? "" : `Defaulting to ${this.IROM_ALIGN / 1024}KB.`));
		else if (this.MMU_PAGE_SIZE_CONF && !this.MMU_PAGE_SIZE_CONF.includes(e)) {
			let t = this.MMU_PAGE_SIZE_CONF.map((e) => `${e / 1024}KB`).join(", ");
			throw new A(`${e} bytes is not a valid ${this.ROM_LOADER.CHIP_NAME} page size, select from ${t}.`);
		} else this.IROM_ALIGN = e;
	}
}, go = class extends ho {
	constructor(e, t = null, n = !0, r = !1) {
		super(e), this.securePad = null, this.flashMode = 0, this.flashSizeFreq = 0, this.version = 1, this.WP_PIN_DISABLED = 238, this.wpPin = this.WP_PIN_DISABLED, this.clkDrv = 0, this.qDrv = 0, this.dDrv = 0, this.csDrv = 0, this.hdDrv = 0, this.wpDrv = 0, this.chipId = 0, this.minRev = 0, this.minRevFull = 0, this.maxRevFull = 0, this.storedDigest = null, this.calcDigest = null, this.dataLength = 0, this.IROM_ALIGN = 65536, this.ROM_LOADER = e, this.appendDigest = n, this.ramOnlyHeader = r, t !== null && this.loadFromFile(t);
	}
	async loadFromFile(e) {
		let t = e instanceof Uint8Array ? e : Za(e), n = 0, r = this.loadCommonHeader(t, n, 233);
		n += 8, this.loadExtendedHeader(t, n), n += 16;
		for (let e = 0; e < r; e++) {
			let e = this.loadSegment(t, n);
			n += 8 + e.data.length;
		}
		if (this.checksum = this.readChecksum(t, n), n = uo(n, 16), this.appendDigest) {
			let e = n;
			this.storedDigest = t.slice(n, n + this.SHA256_DIGEST_LEN);
			let r = await crypto.subtle.digest("SHA-256", t.slice(0, e));
			this.calcDigest = new Uint8Array(r), this.dataLength = e - 0;
		}
		this.verify();
	}
	isFlashAddr(e) {
		return this.ROM_LOADER.IROM_MAP_START <= e && e < this.ROM_LOADER.IROM_MAP_END || this.ROM_LOADER.DROM_MAP_START <= e && e < this.ROM_LOADER.DROM_MAP_END;
	}
	async save() {
		let e = 0, t = /* @__PURE__ */ new Uint8Array(1048576), n = 0;
		this.writeCommonHeader(t, n, this.segments.length), n += 8, this.saveExtendedHeader(t, n), n += 16;
		let r = 239, i = this.segments.filter((e) => this.isFlashAddr(e.addr)).sort((e, t) => e.addr - t.addr), a = this.segments.filter((e) => !this.isFlashAddr(e.addr)).sort((e, t) => e.addr - t.addr);
		for (let e = 0; e < i.length; e++) {
			let t = i[e];
			if (t instanceof mo && t.name === ".flash.appdesc") {
				i.splice(e, 1), i.unshift(t);
				break;
			}
		}
		for (let e = 0; e < a.length; e++) {
			let t = a[e];
			if (t instanceof mo && t.name === ".dram0.bootdesc") {
				a.splice(e, 1), a.unshift(t);
				break;
			}
		}
		if (i.length > 0) {
			let e = i[0].addr;
			for (let t of i.slice(1)) {
				if (Math.floor(t.addr / this.IROM_ALIGN) === Math.floor(e / this.IROM_ALIGN)) throw new A(`Segment loaded at 0x${t.addr.toString(16)} lands in same 64KB flash mapping as segment loaded at 0x${e.toString(16)}. Can't generate binary. Suggest changing linker script or ELF to merge sections.`);
				e = t.addr;
			}
		}
		if (this.ramOnlyHeader) {
			for (let i of a) r = this.saveSegment(t, n, i, r), n += 8 + i.data.length, e++;
			this.appendChecksum(t, n, r), n = uo(n, 16);
			for (let a of i.reverse()) {
				let i = this.getAlignmentDataNeeded(a, n);
				if (i > 0) {
					let a = this.ROM_LOADER.BOOTLOADER_FLASH_OFFSET - this.SEG_HEADER_LEN;
					i < a && (i += this.IROM_ALIGN), i -= this.ROM_LOADER.BOOTLOADER_FLASH_OFFSET;
					let o = new po(0, new Uint8Array(i).fill(0), n);
					r = this.saveSegment(t, n, o, r), n += 8 + i, e++;
				}
				this.saveFlashSegment(t, n, a), n += 8 + a.data.length, e++;
			}
		} else {
			for (; i.length > 0;) {
				let o = i[0], s = this.getAlignmentDataNeeded(o, n);
				if (s > 0) {
					if (a.length > 0 && s > this.SEG_HEADER_LEN) {
						let e = a[0].splitImage(s);
						a[0].data.length === 0 && a.shift(), r = this.saveSegment(t, n, e, r);
					} else {
						let e = new po(0, new Uint8Array(s).fill(0), n);
						r = this.saveSegment(t, n, e, r);
					}
					n += 8 + s, e++;
				} else {
					if ((n + 8) % this.IROM_ALIGN !== o.addr % this.IROM_ALIGN) throw Error("Flash segment alignment mismatch");
					r = this.saveFlashSegment(t, n, o, r), i.shift(), n += 8 + o.data.length, e++;
				}
			}
			for (let i of a) r = this.saveSegment(t, n, i, r), n += 8 + i.data.length, e++;
		}
		if (this.securePad) {
			if (!this.appendDigest) throw Error("secure_pad only applies if a SHA-256 digest is also appended to the image");
			let i = (n + this.SEG_HEADER_LEN) % this.IROM_ALIGN, a = 0;
			this.securePad === "1" ? a = 112 : this.securePad === "2" && (a = 32);
			let o = (this.IROM_ALIGN - i - 16 - a) % this.IROM_ALIGN, s = new po(0, new Uint8Array(o).fill(0), n);
			r = this.saveSegment(t, n, s, r), n += 8 + o, e++;
		}
		this.ramOnlyHeader || (this.appendChecksum(t, n, r), n = uo(n, 16));
		let o = n;
		if (t[1] = this.ramOnlyHeader ? a.length : e, this.appendDigest) {
			let e = await crypto.subtle.digest("SHA-256", t.slice(0, o)), r = new Uint8Array(e);
			t.set(r, o), n += 32;
		}
		if (this.padToSize && n % this.padToSize !== 0) {
			let e = this.padToSize - n % this.padToSize, r = new Uint8Array(e);
			r.fill(255), t.set(r, n), n += e;
		}
		return t;
	}
	loadExtendedHeader(e, t) {
		let n = new DataView(e.buffer, t);
		this.wpPin = n.getUint8(0);
		let r = n.getUint8(1);
		[this.clkDrv, this.qDrv] = this.splitByte(r);
		let i = n.getUint8(2);
		[this.dDrv, this.csDrv] = this.splitByte(i);
		let a = n.getUint8(3);
		[this.hdDrv, this.wpDrv] = this.splitByte(a), this.chipId = n.getUint8(4), this.chipId !== this.ROM_LOADER.IMAGE_CHIP_ID && console.warn(`Unexpected chip id in image. Expected ${this.ROM_LOADER.IMAGE_CHIP_ID} but value was ${this.chipId}. Is this image for a different chip model?`), this.minRev = n.getUint8(5), this.minRevFull = n.getUint16(6, !0), this.maxRevFull = n.getUint16(8, !0);
		let o = n.getUint8(15);
		if (o === 0 || o === 1) this.appendDigest = o === 1;
		else throw Error(`Invalid value for append_digest field (0x${o.toString(16)}). Should be 0 or 1.`);
	}
	saveExtendedHeader(e, t) {
		let n = /* @__PURE__ */ new ArrayBuffer(16), r = new DataView(n);
		r.setUint8(0, this.wpPin), r.setUint8(1, this.joinByte(this.clkDrv, this.qDrv)), r.setUint8(2, this.joinByte(this.dDrv, this.csDrv)), r.setUint8(3, this.joinByte(this.hdDrv, this.wpDrv)), r.setUint8(4, this.ROM_LOADER.IMAGE_CHIP_ID), r.setUint8(5, this.minRev), r.setUint16(6, this.minRevFull, !0), r.setUint16(8, this.maxRevFull, !0);
		for (let e = 9; e < 15; e++) r.setUint8(e, 0);
		r.setUint8(15, +!!this.appendDigest), e.set(new Uint8Array(n), t);
	}
	splitByte(e) {
		return [e & 15, e >> 4 & 15];
	}
	joinByte(e, t) {
		return e & 15 | (t & 15) << 4;
	}
	getAlignmentDataNeeded(e, t) {
		let n = e.addr % this.IROM_ALIGN - this.SEG_HEADER_LEN, r = this.IROM_ALIGN - t % this.IROM_ALIGN + n;
		return r === 0 || r === this.IROM_ALIGN ? 0 : (r -= this.SEG_HEADER_LEN, r < 0 && (r += this.IROM_ALIGN), r);
	}
}, _o = class extends ho {
	constructor(e, t = null) {
		super(e), this.version = 1, this.ROM_LOADER = e, this.flashMode = 0, this.flashSizeFreq = 0, t !== null && this.loadFromFile(t);
	}
	loadFromFile(e) {
		let t = e instanceof Uint8Array ? e : Za(e), n = 0, r = this.loadCommonHeader(t, n, 233);
		n += 8;
		for (let e = 0; e < r; e++) {
			let e = this.loadSegment(t, n);
			n += 8 + e.data.length;
		}
		this.checksum = this.readChecksum(t, n), this.verify();
	}
	defaultOutputName(e) {
		return e + "-";
	}
}, vo = class e extends ho {
	constructor(e, t = null) {
		super(e), this.version = 2, this.ROM_LOADER = e, this.flashMode = 0, this.flashSizeFreq = 0, t !== null && this.loadFromFile(t);
	}
	async loadFromFile(t) {
		let n = t instanceof Uint8Array ? t : Za(t), r = 0, i = this.loadCommonHeader(n, r, e.IMAGE_V2_MAGIC);
		r += 8, i !== e.IMAGE_V2_SEGMENT && console.warn(`Warning: V2 header has unexpected "segment" count ${i} (usually 4)`);
		let a = this.flashMode, o = this.flashSizeFreq, s = this.entrypoint, c = this.loadSegment(n, r, !0);
		c.addr = 0, c.includeInChecksum = !1, r += 8 + c.data.length;
		let l = this.loadCommonHeader(n, r, 233);
		r += 8, a !== this.flashMode && console.warn(`WARNING: Flash mode value in first header (0x${a.toString(16)}) disagrees with second (0x${this.flashMode.toString(16)}). Using second value.`), o !== this.flashSizeFreq && console.warn(`WARNING: Flash size/freq value in first header (0x${o.toString(16)}) disagrees with second (0x${this.flashSizeFreq.toString(16)}). Using second value.`), s !== this.entrypoint && console.warn(`WARNING: Entrypoint address in first header (0x${s.toString(16)}) disagrees with second header (0x${this.entrypoint.toString(16)}). Using second value.`);
		for (let e = 0; e < l; e++) {
			let e = this.loadSegment(n, r);
			r += 8 + e.data.length;
		}
		this.checksum = this.readChecksum(n, r), this.verify();
	}
	defaultOutputName(e) {
		let t = this.getIromSegment(), n = 0;
		return t !== null && (n = t.addr - lo.IROM_MAP_START), `${e.replace(/\.[^/.]+$/, "")}-0x${(n & -4096).toString(16).padStart(5, "0")}.bin`;
	}
};
vo.IMAGE_V2_MAGIC = 234, vo.IMAGE_V2_SEGMENT = 4;
// node_modules/esptool-js/lib/image/others.js
var yo = class extends go {
	constructor(e, t = null, n = !0, r = !1) {
		super(e, t, n, r), this.ROM_LOADER = e;
	}
}, bo = class extends go {
	constructor(e, t = null, n = !0, r = !1) {
		super(e, t, n, r), this.ROM_LOADER = e;
	}
}, xo = class extends go {
	constructor(e, t = null, n = !0, r = !1) {
		super(e, t, n, r), this.ROM_LOADER = e;
	}
}, So = class extends go {
	constructor(e, t = null, n = !0, r = !1) {
		super(e, t, n, r), this.MMU_PAGE_SIZE_CONF = [
			16384,
			32768,
			65536
		], this.ROM_LOADER = e;
	}
}, Co = class extends go {
	constructor(e, t = null, n = !0, r = !1) {
		super(e, t, n, r), this.MMU_PAGE_SIZE_CONF = [
			8192,
			16384,
			32768,
			65536
		], this.ROM_LOADER = e;
	}
}, wo = class extends Co {
	constructor(e, t = null, n = !0, r = !1) {
		super(e, t, n, r), this.ROM_LOADER = e;
	}
}, To = class extends go {
	constructor(e, t = null, n = !0, r = !1) {
		super(e, t, n, r), this.ROM_LOADER = e;
	}
}, Eo = class extends go {
	constructor(e, t = null, n = !0, r = !1) {
		super(e, t, n, r), this.ROM_LOADER = e;
	}
}, Do = class extends Co {
	constructor(e, t = null, n = !0, r = !1) {
		super(e, t, n, r), this.ROM_LOADER = e;
	}
};
// node_modules/esptool-js/lib/image/index.js
async function Oo(e, t) {
	let n = t instanceof Uint8Array ? t : Za(t), r = e.CHIP_NAME.toLowerCase().replace(/[-()]/g, ""), i;
	if (r !== "esp8266") switch (r) {
		case "esp32":
			i = go;
			break;
		case "esp32s2":
			i = yo;
			break;
		case "esp32s3":
			i = bo;
			break;
		case "esp32c3":
			i = xo;
			break;
		case "esp32c2":
			i = So;
			break;
		case "esp32c6":
			i = Co;
			break;
		case "esp32c61":
			i = wo;
			break;
		case "esp32c5":
			i = To;
			break;
		case "esp32h2":
			i = Do;
			break;
		case "esp32p4":
			i = Eo;
			break;
		default: throw new A(`Unsupported chip name: ${r}`);
	}
	else {
		let e = n[0];
		if (e === 233) i = _o;
		else if (e === vo.IMAGE_V2_MAGIC) i = vo;
		else throw new A(`Invalid image magic number: ${e}`);
	}
	let a = new i(e), o = a;
	if (typeof o.loadFromFile == "function") {
		let e = o.loadFromFile(n);
		e instanceof Promise && await e;
	}
	return a;
}
// node_modules/esptool-js/lib/esploader.js
async function ko(e) {
	switch (e) {
		case 15736195: {
			let { ESP32ROM: e } = await import("./esp32-CzEAlFt3.js").then((e) => e.n);
			return new e();
		}
		case 203546735:
		case 1867591791:
		case 2084675695: {
			let { ESP32C2ROM: e } = await import("./esp32c2-Bsay6B7b.js");
			return new e();
		}
		case 1763790959:
		case 456216687:
		case 1216438383:
		case 1130455151: {
			let { ESP32C3ROM: e } = await import("./esp32c3-DtJNtsZg.js").then((e) => e.n);
			return new e();
		}
		case 752910447: {
			let { ESP32C6ROM: e } = await import("./esp32c6-DiZPy7Ep.js");
			return new e();
		}
		case 606167151:
		case 871374959:
		case 1333878895: {
			let { ESP32C61ROM: e } = await import("./esp32c61-BHdfroRI.js");
			return new e();
		}
		case 285294703:
		case 1675706479:
		case 1607549039: {
			let { ESP32C5ROM: e } = await import("./esp32c5-C1ZKNFfX.js");
			return new e();
		}
		case 3619110528:
		case 2548236392: {
			let { ESP32H2ROM: e } = await import("./esp32h2-D--1iMj3.js");
			return new e();
		}
		case 9: {
			let { ESP32S3ROM: e } = await import("./esp32s3-Cgo6oYOg.js");
			return new e();
		}
		case 1990: {
			let { ESP32S2ROM: e } = await import("./esp32s2-CmsggfLR.js");
			return new e();
		}
		case 4293968129: {
			let { ESP8266ROM: e } = await import("./esp8266-Ch7zn0m0.js");
			return new e();
		}
		case 0:
		case 182303440:
		case 117676761: {
			let { ESP32P4ROM: e } = await import("./esp32p4-C1arxSWL.js");
			return new e();
		}
		default: return null;
	}
}
var Ao = class {
	constructor(e) {
		this.ESP_RAM_BLOCK = 6144, this.ESP_FLASH_BEGIN = 2, this.ESP_FLASH_DATA = 3, this.ESP_FLASH_END = 4, this.ESP_MEM_BEGIN = 5, this.ESP_MEM_END = 6, this.ESP_MEM_DATA = 7, this.ESP_WRITE_REG = 9, this.ESP_READ_REG = 10, this.ESP_SPI_ATTACH = 13, this.ESP_CHANGE_BAUDRATE = 15, this.ESP_FLASH_DEFL_BEGIN = 16, this.ESP_FLASH_DEFL_DATA = 17, this.ESP_FLASH_DEFL_END = 18, this.ESP_SPI_FLASH_MD5 = 19, this.ESP_ERASE_FLASH = 208, this.ESP_ERASE_REGION = 209, this.ESP_READ_FLASH = 210, this.ESP_RUN_USER_CODE = 211, this.ESP_IMAGE_MAGIC = 233, this.ESP_CHECKSUM_MAGIC = 239, this.ROM_INVALID_RECV_MSG = 5, this.DEFAULT_TIMEOUT = 3e3, this.ERASE_REGION_TIMEOUT_PER_MB = 3e4, this.ERASE_WRITE_TIMEOUT_PER_MB = 4e4, this.MD5_TIMEOUT_PER_MB = 8e3, this.CHIP_ERASE_TIMEOUT = 12e4, this.FLASH_READ_TIMEOUT = 1e5, this.MAX_TIMEOUT = this.CHIP_ERASE_TIMEOUT * 2, this.WRITE_BLOCK_ATTEMPTS = 3, this.WRITE_BLOCK_RETRY_DELAY_MS = 150, this.SPI_ADDR_REG_MSB = !0, this.CHIP_DETECT_MAGIC_REG_ADDR = 1073745920, this.DETECTED_FLASH_SIZES = {
			18: "256KB",
			19: "512KB",
			20: "1MB",
			21: "2MB",
			22: "4MB",
			23: "8MB",
			24: "16MB",
			25: "32MB",
			26: "64MB",
			27: "128MB",
			28: "256MB",
			32: "64MB",
			33: "128MB",
			34: "256MB",
			50: "256KB",
			51: "512KB",
			52: "1MB",
			53: "2MB",
			54: "4MB",
			55: "8MB",
			56: "16MB",
			57: "32MB",
			58: "64MB"
		}, this.USB_JTAG_SERIAL_PID = 4097, this.romBaudrate = 115200, this.debugLogging = !1, this.syncStubDetected = !1, this.IS_STUB = !1, this.FLASH_WRITE_SIZE = 16384, this.transport = e.transport, this.baudrate = e.baudrate, this.resetConstructors = {
			classicReset: (e, t) => new to(e, t),
			customReset: (e, t) => new ao(e, t),
			hardReset: (e, t) => new ro(e, t),
			usbJTAGSerialReset: (e) => new no(e)
		}, e.serialOptions && (this.serialOptions = e.serialOptions), e.terminal && (this.terminal = e.terminal, this.terminal.clean()), e.debugLogging !== void 0 && (this.debugLogging = e.debugLogging), e.port && (this.transport = new $a(e.port)), e.enableTracing !== void 0 && (this.transport.tracing = e.enableTracing), e.resetConstructors?.classicReset && (this.resetConstructors.classicReset = e.resetConstructors?.classicReset), e.resetConstructors?.customReset && (this.resetConstructors.customReset = e.resetConstructors?.customReset), e.resetConstructors?.hardReset && (this.resetConstructors.hardReset = e.resetConstructors?.hardReset), e.resetConstructors?.usbJTAGSerialReset && (this.resetConstructors.usbJTAGSerialReset = e.resetConstructors?.usbJTAGSerialReset), this.info("esptool.js"), this.info("Serial port " + this.transport.getInfo());
	}
	write(e, t = !0) {
		this.terminal ? t ? this.terminal.writeLine(e) : this.terminal.write(e) : console.log(e);
	}
	error(e, t = !0) {
		this.write(`Error: ${e}`, t);
	}
	info(e, t = !0) {
		this.write(e, t);
	}
	debug(e, t = !0) {
		this.debugLogging && this.write(`Debug: ${e}`, t);
	}
	_shortToBytearray(e) {
		return new Uint8Array([e & 255, e >> 8 & 255]);
	}
	_intToByteArray(e) {
		return new Uint8Array([
			e & 255,
			e >> 8 & 255,
			e >> 16 & 255,
			e >> 24 & 255
		]);
	}
	_byteArrayToShort(e, t) {
		return e | t >> 8;
	}
	_byteArrayToInt(e, t, n, r) {
		return e | t << 8 | n << 16 | r << 24;
	}
	_appendBuffer(e, t) {
		let n = new Uint8Array(e.byteLength + t.byteLength);
		return n.set(new Uint8Array(e), 0), n.set(new Uint8Array(t), e.byteLength), n.buffer;
	}
	_appendArray(e, t) {
		let n = new Uint8Array(e.length + t.length);
		return n.set(e, 0), n.set(t, e.length), n;
	}
	ui8ToBstr(e) {
		let t = "";
		for (let n = 0; n < e.length; n++) t += String.fromCharCode(e[n]);
		return t;
	}
	bstrToUi8(e) {
		let t = new Uint8Array(e.length);
		for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
		return t;
	}
	async readPacket(e = null, t = this.DEFAULT_TIMEOUT) {
		for (let n = 0; n < 100; n++) {
			let n = await this.transport.read(t);
			if (!n || n.length < 8) continue;
			let r = n[0];
			if (r !== 1) continue;
			let i = n[1], a = this._byteArrayToInt(n[4], n[5], n[6], n[7]), o = n.slice(8);
			if (r == 1) {
				if (e == null || i == e) return [a, o];
				if (o[0] != 0 && o[1] == this.ROM_INVALID_RECV_MSG) throw this.transport.flushInput(), new A("unsupported command error");
			}
		}
		throw new A("invalid response");
	}
	async command(e = null, t = /* @__PURE__ */ new Uint8Array(), n = 0, r = !0, i = this.DEFAULT_TIMEOUT) {
		if (e != null) {
			this.transport.tracing && this.transport.trace(`command op:0x${e.toString(16).padStart(2, "0")} data len=${t.length} wait_response=${+!!r} timeout=${(i / 1e3).toFixed(3)} data=${this.transport.hexConvert(t)}`);
			let a = new Uint8Array(8 + t.length);
			a[0] = 0, a[1] = e, a[2] = this._shortToBytearray(t.length)[0], a[3] = this._shortToBytearray(t.length)[1], a[4] = this._intToByteArray(n)[0], a[5] = this._intToByteArray(n)[1], a[6] = this._intToByteArray(n)[2], a[7] = this._intToByteArray(n)[3];
			let o = 0;
			for (; o < t.length; o++) a[8 + o] = t[o];
			await this.transport.write(a);
		}
		return r ? this.readPacket(e, i) : [0, /* @__PURE__ */ new Uint8Array()];
	}
	async readReg(e, t = this.DEFAULT_TIMEOUT) {
		this.debug(`Read Register:${this.toHex(e)}`);
		let n = this._intToByteArray(e), r = await this.command(this.ESP_READ_REG, n, void 0, void 0, t);
		return this.debug(`Read Register Value:${r[0]}`), r[0];
	}
	async writeReg(e, t, n = 4294967295, r = 0, i = 0) {
		let a = this._appendArray(this._intToByteArray(e), this._intToByteArray(t));
		a = this._appendArray(a, this._intToByteArray(n)), a = this._appendArray(a, this._intToByteArray(r)), i > 0 && (a = this._appendArray(a, this._intToByteArray(this.chip.UART_DATE_REG_ADDR)), a = this._appendArray(a, this._intToByteArray(0)), a = this._appendArray(a, this._intToByteArray(0)), a = this._appendArray(a, this._intToByteArray(i))), await this.checkCommand("write target memory", this.ESP_WRITE_REG, a);
	}
	async sync() {
		this.debug("Sync");
		let e = /* @__PURE__ */ new Uint8Array(36), t;
		for (e[0] = 7, e[1] = 7, e[2] = 18, e[3] = 32, t = 0; t < 32; t++) e[4 + t] = 85;
		try {
			let t = await this.command(8, e, void 0, void 0, 100);
			this.syncStubDetected = t[0] === 0;
			for (let e = 0; e < 7; e++) t = await this.readPacket(8, 100), this.syncStubDetected = this.syncStubDetected && t[0] === 0;
			return t;
		} catch (e) {
			throw this.debug("Sync err " + e), e;
		}
	}
	async _connectAttempt(e = "default_reset", t) {
		this.debug("_connect_attempt " + e), t && await t.reset();
		let n = this.transport.peek(), r = Array.from(n, (e) => String.fromCharCode(e)).join("").match(/boot:(0x[0-9a-fA-F]+)([\s\S]*?waiting for download)?/), i = !1, a = "", o = !1;
		r && (i = !0, a = r[1], o = !!r[2]), this.debug(`bootMode:${a} downloadMode:${o}`);
		let s = "";
		for (let e = 0; e < 5; e++) try {
			this.debug(`Sync connect attempt ${e}`), this.transport.flushInput();
			let t = await this.sync();
			return this.debug(t[0].toString()), "success";
		} catch (e) {
			this.debug(`Error at sync ${e}`), s = e instanceof Error ? e.message : typeof e == "string" ? e : JSON.stringify(e);
		}
		return i && (s = `Wrong boot mode detected (${a}).
        This chip needs to be in download mode.`, o && (s = "Download mode successfully detected, but getting no sync reply:\n           The serial TX path seems to be down.")), s;
	}
	constructResetSequence(e) {
		if (e !== "no_reset") {
			if (e === "usb_reset" || this.transport.getPid() === this.USB_JTAG_SERIAL_PID) {
				if (this.resetConstructors.usbJTAGSerialReset) return this.debug("using USB JTAG Serial Reset"), [this.resetConstructors.usbJTAGSerialReset(this.transport)];
			} else if (this.resetConstructors.classicReset) return this.debug("using Classic Serial Reset"), [this.resetConstructors.classicReset(this.transport, 50), this.resetConstructors.classicReset(this.transport, 550)];
		}
		return [];
	}
	async connect(e = "default_reset", t = 7, n = !0) {
		let r;
		this.info("Connecting...", !1), await this.transport.connect(this.romBaudrate, this.serialOptions), this.transport.readLoop();
		let i = this.constructResetSequence(e);
		for (let n = 0; n < t; n++) {
			let t = i.length > 0 ? i[n % i.length] : null;
			if (r = await this._connectAttempt(e, t), r === "success") break;
		}
		if (r !== "success") throw new A("Failed to connect with the device");
		if (this.debug("Connect attempt successful."), this.info("\n\r", !1), n) {
			let e = await this.readReg(this.CHIP_DETECT_MAGIC_REG_ADDR) >>> 0;
			this.debug("Chip Magic " + e.toString(16));
			let t = await ko(e);
			if (t === null) throw new A(`Unexpected CHIP magic value 0x${e.toString(16)}. Failed to autodetect chip type.`);
			this.chip = t;
		}
	}
	async detectChip(e = "default_reset") {
		await this.connect(e), this.info("Detecting chip type... ", !1), this.chip == null ? this.info("unknown!") : this.info(this.chip.CHIP_NAME);
	}
	async checkCommand(e = "", t = null, n = /* @__PURE__ */ new Uint8Array(), r = 0, i = 0, a = this.DEFAULT_TIMEOUT) {
		this.debug("check_command " + e);
		let o = await this.command(t, n, r, void 0, a);
		if (o && o[1] && o[1].length < i + 2) {
			let t = o[1].slice(0, 2);
			throw t[0] === 0 ? new A(`Failed to ${e}.\n Only got ${o[1].length} bytes of data.`) : new A(`Failed to ${e} failed with status ${t}`);
		}
		let s = o[1].slice(i, i + 2);
		if (s[0] !== 0) throw new A(`Failed to ${e} failed with status ${s}`);
		return i > 0 ? o[1].slice(0, i) : o[0];
	}
	async memBegin(e, t, n, r) {
		if (this.IS_STUB) {
			let t = r, n = r + e, i = this.chip.getChipRevision ? await this.chip.getChipRevision(this) : void 0, a = await so(this.chip.CHIP_NAME, i);
			if (a) {
				let e = [[a.bss_start || a.data_start, a.data_start + a.decodedData.length], [a.text_start, a.text_start + a.decodedText.length]];
				for (let [r, i] of e) if (t < i && n > r) throw new A(`Software loader is resident at 0x${r.toString(16).padStart(8, "0")}-0x${i.toString(16).padStart(8, "0")}.
            Can't load binary at overlapping address range 0x${t.toString(16).padStart(8, "0")}-0x${n.toString(16).padStart(8, "0")}.
            Either change binary loading address, or use the no-stub option to disable the software loader.`);
			}
		}
		this.debug("mem_begin " + e + " " + t + " " + n + " " + r.toString(16));
		let i = this._appendArray(this._intToByteArray(e), this._intToByteArray(t));
		i = this._appendArray(i, this._intToByteArray(n)), i = this._appendArray(i, this._intToByteArray(r)), await this.checkCommand("enter RAM download mode", this.ESP_MEM_BEGIN, i);
	}
	checksum(e, t = this.ESP_CHECKSUM_MAGIC) {
		for (let n = 0; n < e.length; n++) t ^= e[n];
		return t;
	}
	async memBlock(e, t) {
		let n = this._appendArray(this._intToByteArray(e.length), this._intToByteArray(t));
		n = this._appendArray(n, this._intToByteArray(0)), n = this._appendArray(n, this._intToByteArray(0)), n = this._appendArray(n, e);
		let r = this.checksum(e);
		await this.checkCommand("write to target RAM", this.ESP_MEM_DATA, n, r);
	}
	async memFinish(e) {
		let t = +(e === 0), n = this._appendArray(this._intToByteArray(t), this._intToByteArray(e));
		await this.checkCommand("leave RAM download mode", this.ESP_MEM_END, n, void 0, void 0, 200);
	}
	async flashSpiAttach(e) {
		let t = this._intToByteArray(e);
		await this.checkCommand("configure SPI flash pins", this.ESP_SPI_ATTACH, t);
	}
	timeoutPerMb(e, t) {
		let n = t / 1e6 * e;
		return n < 3e3 ? 3e3 : n;
	}
	async flashBegin(e, t) {
		let n = Math.floor((e + this.FLASH_WRITE_SIZE - 1) / this.FLASH_WRITE_SIZE), r = this.chip.getEraseSize(t, e), i = /* @__PURE__ */ new Date(), a = i.getTime(), o = 3e3;
		this.IS_STUB == 0 && (o = this.timeoutPerMb(this.ERASE_REGION_TIMEOUT_PER_MB, e)), this.debug("flash begin " + r + " " + n + " " + this.FLASH_WRITE_SIZE + " " + t + " " + e);
		let s = this._appendArray(this._intToByteArray(r), this._intToByteArray(n));
		s = this._appendArray(s, this._intToByteArray(this.FLASH_WRITE_SIZE)), s = this._appendArray(s, this._intToByteArray(t)), this.IS_STUB == 0 && (s = this._appendArray(s, this._intToByteArray(0))), await this.checkCommand("enter Flash download mode", this.ESP_FLASH_BEGIN, s, void 0, void 0, o);
		let c = i.getTime();
		return e != 0 && this.IS_STUB == 0 && this.info("Took " + (c - a) / 1e3 + "." + (c - a) % 1e3 + "s to erase flash block"), n;
	}
	async flashDeflBegin(e, t, n) {
		let r = Math.floor((t + this.FLASH_WRITE_SIZE - 1) / this.FLASH_WRITE_SIZE), i = Math.floor((e + this.FLASH_WRITE_SIZE - 1) / this.FLASH_WRITE_SIZE), a = /* @__PURE__ */ new Date(), o = a.getTime(), s, c;
		this.IS_STUB ? (s = e, c = this.DEFAULT_TIMEOUT) : (s = i * this.FLASH_WRITE_SIZE, c = this.timeoutPerMb(this.ERASE_REGION_TIMEOUT_PER_MB, s)), this.info("Compressed " + e + " bytes to " + t + "...");
		let l = this._appendArray(this._intToByteArray(s), this._intToByteArray(r));
		l = this._appendArray(l, this._intToByteArray(this.FLASH_WRITE_SIZE)), l = this._appendArray(l, this._intToByteArray(n)), (this.chip.CHIP_NAME === "ESP32-S2" || this.chip.CHIP_NAME === "ESP32-S3" || this.chip.CHIP_NAME === "ESP32-C3" || this.chip.CHIP_NAME === "ESP32-C2") && this.IS_STUB === !1 && (l = this._appendArray(l, this._intToByteArray(0))), await this.checkCommand("enter compressed flash mode", this.ESP_FLASH_DEFL_BEGIN, l, void 0, void 0, c);
		let u = a.getTime();
		return e != 0 && this.IS_STUB === !1 && this.info("Took " + (u - o) / 1e3 + "." + (u - o) % 1e3 + "s to erase flash block"), r;
	}
	async flashBlock(e, t, n) {
		let r = this._appendArray(this._intToByteArray(e.length), this._intToByteArray(t));
		r = this._appendArray(r, this._intToByteArray(0)), r = this._appendArray(r, this._intToByteArray(0)), r = this._appendArray(r, e);
		let i = this.checksum(e);
		for (let e = this.WRITE_BLOCK_ATTEMPTS - 1; e >= 0; e--) try {
			await this.checkCommand("write to target Flash after seq " + t, this.ESP_FLASH_DATA, r, i, void 0, n);
			return;
		} catch (n) {
			if (e === 0) throw n;
			this.debug(`Block ${t} write failed (${n}), retrying with ${e} attempts left...`), await Qa(this.WRITE_BLOCK_RETRY_DELAY_MS);
		}
	}
	async flashDeflBlock(e, t, n) {
		let r = this._appendArray(this._intToByteArray(e.length), this._intToByteArray(t));
		r = this._appendArray(r, this._intToByteArray(0)), r = this._appendArray(r, this._intToByteArray(0)), r = this._appendArray(r, e);
		let i = this.checksum(e);
		this.debug(`flash_defl_block ${Array.from(e.slice(0, 2)).map((e) => e.toString(16)).join(" ")}`);
		for (let e = this.WRITE_BLOCK_ATTEMPTS - 1; e >= 0; e--) try {
			await this.checkCommand("write compressed data to flash after seq " + t, this.ESP_FLASH_DEFL_DATA, r, i, void 0, n);
			return;
		} catch (n) {
			if (e === 0) throw n;
			this.debug(`Compressed block ${t} write failed (${n}), retrying with ${e} attempts left...`), await Qa(this.WRITE_BLOCK_RETRY_DELAY_MS);
		}
	}
	async flashFinish(e = !1, t = this.DEFAULT_TIMEOUT) {
		let n = +!e, r = this._intToByteArray(n);
		await this.checkCommand("leave Flash mode", this.ESP_FLASH_END, r, void 0, void 0, t);
	}
	async flashDeflFinish(e = !1, t = this.DEFAULT_TIMEOUT) {
		let n = +!e, r = this._intToByteArray(n);
		await this.checkCommand("leave compressed flash mode", this.ESP_FLASH_DEFL_END, r, void 0, void 0, t);
	}
	async runSpiflashCommand(e, t, n, r = null, i = 0, a = 0) {
		let o = this.chip.SPI_REG_BASE, s = o + 0, c = o + 4, l = o + this.chip.SPI_USR_OFFS, u = o + this.chip.SPI_USR1_OFFS, d = o + this.chip.SPI_USR2_OFFS, f = o + this.chip.SPI_W0_OFFS, p;
		p = this.chip.SPI_MOSI_DLEN_OFFS == null ? async (e, t) => {
			let n = u, r = e === 0 ? 0 : e - 1, o = (t === 0 ? 0 : t - 1) << 8 | r << 17;
			a > 0 && (o |= a - 1), i > 0 && (o |= i - 1 << h), await this.writeReg(n, o);
		} : async (e, t) => {
			let n = o + this.chip.SPI_MOSI_DLEN_OFFS, r = o + this.chip.SPI_MISO_DLEN_OFFS;
			e > 0 && await this.writeReg(n, e - 1), t > 0 && await this.writeReg(r, t - 1);
			let s = 0;
			a > 0 && (s |= a - 1), i > 0 && (s |= i - 1 << h), s && await this.writeReg(u, s);
		};
		let m = 1 << 18, h = 26;
		if (n > 32) throw new A("Reading more than 32 bits back from a SPI flash operation is unsupported");
		if (t.length > 64) throw new A("Writing more than 64 bytes of data with one SPI command is unsupported");
		let g = t.length * 8, _ = await this.readReg(l), v = await this.readReg(d), y = -2147483648;
		n > 0 && (y |= 268435456), g > 0 && (y |= 134217728), i > 0 && (y |= 1073741824), a > 0 && (y |= 536870912), await p(g, n), await this.writeReg(l, y);
		let b = 7 << 28 | e;
		if (await this.writeReg(d, b), r && i > 0 && (this.SPI_ADDR_REG_MSB && (r <<= 32 - i), await this.writeReg(c, r)), g == 0) await this.writeReg(f, 0);
		else {
			t = Ya(t, 4, 0);
			let e = [];
			for (let n = 0; n < t.length; n += 4) e.push((t[n] | t[n + 1] << 8 | t[n + 2] << 16 | t[n + 3] << 24) >>> 0);
			let n = f;
			for (let t of e) await this.writeReg(n, t), n += 4;
		}
		await this.writeReg(s, m);
		let x = 0;
		for (; x < 10 && (b = await this.readReg(s) & m, b != 0); x++);
		if (x === 10) throw new A("SPI command did not complete in time");
		let S = await this.readReg(f);
		return await this.writeReg(l, _), await this.writeReg(d, v), S;
	}
	async readFlashId() {
		let e = /* @__PURE__ */ new Uint8Array();
		return await this.runSpiflashCommand(159, e, 24);
	}
	async eraseFlash() {
		this.info("Erasing flash (this may take a while)...");
		let e = /* @__PURE__ */ new Date(), t = e.getTime(), n = await this.checkCommand("erase flash", this.ESP_ERASE_FLASH, void 0, void 0, void 0, this.CHIP_ERASE_TIMEOUT);
		e = /* @__PURE__ */ new Date();
		let r = e.getTime();
		return this.info("Chip erase completed successfully in " + (r - t) / 1e3 + "s"), n;
	}
	toHex(e) {
		return Array.prototype.map.call(e, (e) => ("00" + e.toString(16)).slice(-2)).join("");
	}
	async flashMd5sum(e, t) {
		let n = this.timeoutPerMb(this.MD5_TIMEOUT_PER_MB, t), r = this._appendArray(this._intToByteArray(e), this._intToByteArray(t));
		r = this._appendArray(r, this._intToByteArray(0)), r = this._appendArray(r, this._intToByteArray(0));
		let i = this.IS_STUB ? 16 : 32, a = await this.checkCommand("calculate md5sum", this.ESP_SPI_FLASH_MD5, r, void 0, i, n);
		return this.toHex(a);
	}
	async readFlash(e, t, n = null) {
		let r = this._appendArray(this._intToByteArray(e), this._intToByteArray(t));
		r = this._appendArray(r, this._intToByteArray(4096)), r = this._appendArray(r, this._intToByteArray(1024));
		let i = await this.checkCommand("read flash", this.ESP_READ_FLASH, r);
		if (i != 0) throw new A("Failed to read memory: " + i);
		let a = /* @__PURE__ */ new Uint8Array();
		for (; a.length < t;) {
			let e = await this.transport.read(this.FLASH_READ_TIMEOUT);
			if (e instanceof Uint8Array) e.length > 0 && (a = this._appendArray(a, e), await this.transport.write(this._intToByteArray(a.length)), n && n(e, a.length, t));
			else throw new A("Failed to read memory: " + e);
		}
		return a;
	}
	async runStub() {
		if (this.syncStubDetected) return this.info("Stub is already running. No upload is necessary."), this.chip;
		this.info("Uploading stub...");
		let e = this.chip.getChipRevision ? await this.chip.getChipRevision(this) : void 0, t = await so(this.chip.CHIP_NAME, e);
		if (t === void 0) throw this.debug("Error loading Stub json"), Error("Error loading Stub json");
		let n = [t.decodedText, t.decodedData];
		for (let e = 0; e < n.length; e++) if (n[e]) {
			let r = e === 0 ? t.text_start : t.data_start, i = n[e].length, a = Math.floor((i + this.ESP_RAM_BLOCK - 1) / this.ESP_RAM_BLOCK);
			await this.memBegin(i, a, this.ESP_RAM_BLOCK, r);
			for (let t = 0; t < a; t++) {
				let r = t * this.ESP_RAM_BLOCK, i = r + this.ESP_RAM_BLOCK;
				await this.memBlock(n[e].slice(r, i), t);
			}
		}
		this.info("Running stub..."), await this.memFinish(t.entry);
		let r = await this.transport.read(this.DEFAULT_TIMEOUT), i = String.fromCharCode(...r);
		if (i !== "OHAI") throw new A(`Failed to start stub. Unexpected response ${i}`);
		return this.info("Stub running..."), this.IS_STUB = !0, this.chip;
	}
	async changeBaud() {
		this.info("Changing baudrate to " + this.baudrate);
		let e = this.IS_STUB ? this.romBaudrate : 0, t = this._appendArray(this._intToByteArray(this.baudrate), this._intToByteArray(e));
		await this.command(this.ESP_CHANGE_BAUDRATE, t), this.info("Changed"), this.info("If the chip does not respond to any further commands, consider using a lower baud rate."), await Qa(50), await this.transport.disconnect(), await Qa(50), await this.transport.connect(this.baudrate, this.serialOptions), await Qa(50), this.transport.readLoop();
	}
	async main(e = "default_reset") {
		await this.detectChip(e);
		let t = await this.chip.getChipDescription(this);
		if (this.chip.getChipRevision) {
			let e = await this.chip.getChipRevision(this);
			this.info("Chip Revision: " + e);
		}
		this.info("Chip is " + t), this.info("Features: " + await this.chip.getChipFeatures(this)), this.info("Crystal is " + await this.chip.getCrystalFreq(this) + "MHz"), this.info("MAC: " + await this.chip.readMac(this)), await this.chip.readMac(this), this.chip.postConnect !== void 0 && await this.chip.postConnect(this), await this.runStub(), this.romBaudrate !== this.baudrate && await this.changeBaud();
		try {
			let e = await this.readFlashId();
			this.info("Flash ID: " + e.toString(16)), (e === 16777215 || e === 0) && this.info("WARNING: Failed to communicate with the flash chip,\nread/write operations will fail.\nTry checking the chip connections or removing\nany other hardware connected to IOs.");
		} catch (e) {
			throw new A("Unable to verify flash chip connection " + e);
		}
		return t;
	}
	flashSizeBytes(e) {
		let t = -1;
		return this.transport.trace(`Flash size string ${e}`), e.toString().indexOf("KB") === -1 ? e.toString().indexOf("MB") !== -1 && (t = parseInt(e.toString().slice(0, e.toString().indexOf("MB"))) * 1024 * 1024) : t = parseInt(e.toString().slice(0, e.toString().indexOf("KB"))) * 1024, this.transport.trace(`Flash size in bytes ${t}`), t;
	}
	parseFlashSizeArg(e) {
		if (this.chip.FLASH_SIZES[e] === void 0) throw new A("Flash size " + e + " is not supported by this chip type. Supported sizes: " + this.chip.FLASH_SIZES);
		return this.chip.FLASH_SIZES[e];
	}
	async _updateImageFlashParams(e, t, n = "keep", r = "keep", i = "keep") {
		if (this.debug(`_update_image_flash_params ${i} ${n} ${r}`), e.length < 8 || t != this.chip.BOOTLOADER_FLASH_OFFSET) return e;
		if (i === "keep" && n === "keep" && r === "keep") return this.info("Not changing the image"), e;
		let a = e[0], o = e[2], s = e[3];
		if (a !== this.ESP_IMAGE_MAGIC) return this.info("Warning: Image file at 0x" + t.toString(16) + " doesn't look like an image file, so not changing any flash settings."), e;
		try {
			(await Oo(this.chip, e)).verify();
		} catch {
			return this.debug(`Warning: Image file at 0x${t.toString(16)} is not a valid ${this.chip.CHIP_NAME} image, so not changing any flash settings.`), e;
		}
		let c = this.chip.CHIP_NAME !== "ESP8266" && e[23] === 49;
		n !== "keep" && (o = {
			qio: 0,
			qout: 1,
			dio: 2,
			dout: 3
		}[n]);
		let l = s & 15;
		r !== "keep" && (l = {
			"40m": 0,
			"26m": 1,
			"20m": 2,
			"80m": 15
		}[r]);
		let u = s & 240;
		if (i !== "keep") {
			if (i === "detect") {
				this.info("Configuring flash size...");
				let e = await this.detectFlashSize();
				this.info("Detected flash size set to " + e), u = this.parseFlashSizeArg(e);
			} else u = this.parseFlashSizeArg(i);
		}
		let d = o << 8 | l + u;
		this.info("Flash params set to " + d.toString(16));
		let f = new Uint8Array(e);
		if (e[2] !== o && (f[2] = o), e[3] !== l + u && (f[3] = l + u), c) {
			let e = await Oo(this.chip, f), t = f.slice(0, e.datalength), n = f.slice(e.datalength + e.SHA256_DIGEST_LEN), r = await crypto.subtle.digest("SHA-256", n), i = new Uint8Array(r), a = new Uint8Array(t.length + i.length + n.length);
			a.set(t, 0), a.set(i, t.length), a.set(n, t.length + i.length);
			let o = a.slice(e.datalength, e.datalength + e.SHA256_DIGEST_LEN);
			return this.transport.hexify(i) === this.transport.hexify(o) ? this.info("SHA digest in image updated") : this.info(`WARNING: SHA recalculation for binary failed!
\tExpected calculated SHA: ${this.transport.hexify(i)}\n\tSHA stored in binary:    ${this.transport.hexify(o)}`), a;
		}
		return f;
	}
	async writeFlash(e) {
		if (this.debug("EspLoader program"), e.flashSize !== "keep") {
			let t = this.flashSizeBytes(e.flashSize);
			for (let n = 0; n < e.fileArray.length; n++) if (e.fileArray[n].data.length + e.fileArray[n].address > t) throw new A(`File ${n + 1} doesn't fit in the available flash`);
		}
		this.IS_STUB === !0 && e.eraseAll === !0 && await this.eraseFlash();
		let t, n;
		for (let r = 0; r < e.fileArray.length; r++) {
			if (this.debug("Data Length " + e.fileArray[r].data.length), t = e.fileArray[r].data, this.debug("Image Length " + t.length), t.length === 0) {
				this.debug("Warning: File is empty");
				continue;
			}
			t = Ya(t, 4), n = e.fileArray[r].address, t = await this._updateImageFlashParams(t, n, e.flashMode, e.flashFreq, e.flashSize);
			let i = null;
			e.calculateMD5Hash && (i = e.calculateMD5Hash(t), this.debug("Image MD5 " + i));
			let a = t.length, o;
			e.compress ? (t = qa(t, { level: 9 }), o = await this.flashDeflBegin(a, t.length, n)) : o = await this.flashBegin(a, n);
			let s = 0, c = 0, l = t.length;
			e.reportProgress && e.reportProgress(r, 0, l);
			let u = /* @__PURE__ */ new Date(), d = u.getTime(), f = 5e3, p = new Ja({ chunkSize: 1 }), m = 0;
			p.onData = function(e) {
				m += e.byteLength;
			};
			let h = 0;
			for (; h < t.length;) {
				this.debug("Write loop " + n + " " + s + " " + o), this.info("Writing at 0x" + (n + (e.compress ? m : c)).toString(16) + "... (" + Math.floor(100 * (s + 1) / o) + "%)");
				let i = Math.min(this.FLASH_WRITE_SIZE, t.length - h), a = t.slice(h, h + i), u = h + i >= t.length;
				if (e.compress) {
					let e = m;
					p.push(a, u);
					let t = m - e, n = 3e3;
					this.timeoutPerMb(this.ERASE_WRITE_TIMEOUT_PER_MB, t) > 3e3 && (n = this.timeoutPerMb(this.ERASE_WRITE_TIMEOUT_PER_MB, t)), this.IS_STUB === !1 && (f = n), await this.flashDeflBlock(a, s, f), this.IS_STUB && (f = n);
				} else {
					let e = a;
					a.length < this.FLASH_WRITE_SIZE && (e = new Uint8Array(this.FLASH_WRITE_SIZE).fill(255), e.set(a));
					let t = 3e3;
					this.timeoutPerMb(this.ERASE_WRITE_TIMEOUT_PER_MB, e.length) > 3e3 && (t = this.timeoutPerMb(this.ERASE_WRITE_TIMEOUT_PER_MB, e.length)), this.IS_STUB === !1 && (f = t), await this.flashBlock(e, s, f), this.IS_STUB && (f = t);
				}
				c += a.length, h += i, s++, e.reportProgress && e.reportProgress(r, c, l);
			}
			this.IS_STUB && (e.compress ? await this.flashDeflFinish(!1, f) : await this.flashFinish(!1, f)), u = /* @__PURE__ */ new Date();
			let g = u.getTime() - d;
			if (e.compress ? this.info("Wrote " + a + " bytes (" + c + " compressed) at 0x" + n.toString(16) + " in " + g / 1e3 + " seconds.") : this.info("Wrote " + c + " bytes at 0x" + n.toString(16) + " in " + g / 1e3 + " seconds."), i) {
				this.info("File  md5: " + i);
				let e = await this.flashMd5sum(n, a);
				if (this.info("Flash md5: " + e), new String(e).valueOf() != new String(i).valueOf()) throw new A("MD5 of file does not match data in flash!");
				this.info("Hash of data verified.");
			}
		}
		this.info("Leaving...");
	}
	async flashId() {
		this.debug("flash_id");
		let e = await this.readFlashId();
		this.info("Manufacturer: " + (e & 255).toString(16));
		let t = e >> 16 & 255;
		this.info("Device: " + (e >> 8 & 255).toString(16) + t.toString(16)), this.info("Detected flash size: " + this.DETECTED_FLASH_SIZES[t]);
	}
	async detectFlashSize() {
		this.debug("detectFlashSize");
		let e = await this.readFlashId() >> 16 & 255, t = this.DETECTED_FLASH_SIZES[e];
		return t ? this.info("Auto-detected Flash size: " + t) : (t = "4MB", this.info("Could not auto-detect Flash size. defaulting to 4MB")), t;
	}
	async softReset(e) {
		if (!this.IS_STUB) {
			if (e) return;
			await this.flashBegin(0, 0), await this.flashFinish(!1);
		} else if (this.chip.CHIP_NAME != "ESP8266") throw new A("Soft resetting is currently only supported on ESP8266");
		else e ? (await this.flashBegin(0, 0), await this.flashFinish(!0)) : await this.command(this.ESP_RUN_USER_CODE, void 0, void 0, !1);
	}
	async after(e = "hard_reset", t, n) {
		switch (e) {
			case "hard_reset":
				this.resetConstructors.hardReset && (this.info("Hard resetting via RTS pin..."), await this.resetConstructors.hardReset(this.transport, t).reset());
				break;
			case "soft_reset":
				this.info("Soft resetting..."), await this.softReset(!1);
				break;
			case "no_reset_stub":
				this.info("Staying in flasher stub.");
				break;
			case "custom_reset":
				n || this.info("Custom reset sequence not provided, doing nothing."), this.resetConstructors.customReset || this.info("Custom reset constructor not available, doing nothing."), this.resetConstructors.customReset && n && (this.info("Custom resetting using sequence " + n), await this.resetConstructors.customReset(this.transport, n).reset());
				break;
			default: this.info("Staying in bootloader."), this.IS_STUB && this.softReset(!0);
		}
	}
}, jo = class extends HTMLElement {
	constructor() {
		super(...arguments), this.allowInput = !0;
	}
	logs() {
		return this._console?.logs() || "";
	}
	connectedCallback() {
		if (this._console) return;
		let e = this.attachShadow({ mode: "open" });
		if (e.innerHTML = `
      <style>
        :host, input {
          background-color: #1c1c1c;
          color: #ddd;
          font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier,
            monospace;
          line-height: 1.45;
          display: flex;
          flex-direction: column;
        }
        form {
          display: flex;
          align-items: center;
          padding: 0 8px 0 16px;
        }
        input {
          flex: 1;
          padding: 4px;
          margin: 0 8px;
          border: 0;
          outline: none;
        }
        ${ut}
      </style>
      <div class="log"></div>
      ${this.allowInput ? "<form>\n                >\n                <input autofocus>\n              </form>\n            " : ""}
    `, this._console = new lt(this.shadowRoot.querySelector("div")), this.allowInput) {
			let e = this.shadowRoot.querySelector("input");
			this.addEventListener("click", () => {
				getSelection()?.toString() === "" && e.focus();
			}), e.addEventListener("keydown", (e) => {
				e.key === "Enter" && (e.preventDefault(), e.stopPropagation(), this._sendCommand());
			});
		}
		let t = new AbortController(), n = this._connect(t.signal);
		this._cancelConnection = () => (t.abort(), n);
	}
	async _connect(e) {
		this.logger.debug("Starting console read loop");
		try {
			await this.port.readable.pipeThrough(new TextDecoderStream(), { signal: e }).pipeThrough(new TransformStream(new ft())).pipeThrough(new TransformStream(new pt())).pipeTo(new WritableStream({ write: (e) => {
				this._console.addLine(e.replace("\r", ""));
			} })), e.aborted || (this._console.addLine(""), this._console.addLine(""), this._console.addLine("Terminal disconnected"));
		} catch (e) {
			this._console.addLine(""), this._console.addLine(""), this._console.addLine(`Terminal disconnected: ${e}`);
		} finally {
			await dt(100), this.logger.debug("Finished console read loop");
		}
	}
	async _sendCommand() {
		let e = this.shadowRoot.querySelector("input"), t = e.value, n = new TextEncoder(), r = this.port.writable.getWriter();
		await r.write(n.encode(t + "\r\n")), this._console.addLine(`> ${t}\r\n`), e.value = "", e.focus();
		try {
			r.releaseLock();
		} catch (e) {
			console.error("Ignoring release lock error", e);
		}
	}
	async disconnect() {
		this._cancelConnection &&= (await this._cancelConnection(), void 0);
	}
	async reset() {
		this.logger.debug("Triggering reset");
		let e = new $a(this.port);
		await e.setRTS(!0), await dt(100), await new ro(e).reset();
	}
};
customElements.define("ewt-console", jo);
// node_modules/esp-web-tools/node_modules/@material/web/internal/controller/is-rtl.js
function Mo(e, t = !0) {
	return t && getComputedStyle(e).getPropertyValue("direction").trim() === "rtl";
}
// node_modules/esp-web-tools/node_modules/@material/web/iconbutton/internal/icon-button.js
var No = h(s(_)), G = class extends No {
	get name() {
		return this.getAttribute("name") ?? "";
	}
	set name(e) {
		this.setAttribute("name", e);
	}
	get form() {
		return this[t].form;
	}
	get labels() {
		return this[t].labels;
	}
	constructor() {
		super(), this.disabled = !1, this.softDisabled = !1, this.flipIconInRtl = !1, this.href = "", this.download = "", this.target = "", this.ariaLabelSelected = "", this.toggle = !1, this.selected = !1, this.type = "submit", this.value = "", this.flipIcon = Mo(this, this.flipIconInRtl), this.addEventListener("click", this.handleClick.bind(this));
	}
	willUpdate() {
		this.href && (this.disabled = !1, this.softDisabled = !1);
	}
	render() {
		let e = this.href ? Be`div` : Be`button`, { ariaLabel: t, ariaHasPopup: n, ariaExpanded: r } = this, i = t && this.ariaLabelSelected, a = this.toggle ? this.selected : S, o = S;
		return this.href || (o = i && this.selected ? this.ariaLabelSelected : t), He`<${e}
        class="icon-button ${O(this.getRenderClasses())}"
        id="button"
        aria-label="${o || S}"
        aria-haspopup="${!this.href && n || S}"
        aria-expanded="${!this.href && r || S}"
        aria-pressed="${a}"
        aria-disabled=${!this.href && this.softDisabled || S}
        ?disabled="${!this.href && this.disabled}"
        @click="${this.handleClickOnChild}">
        ${this.renderFocusRing()}
        ${this.renderRipple()}
        ${this.selected ? S : this.renderIcon()}
        ${this.selected ? this.renderSelectedIcon() : S}
        ${this.href ? this.renderLink() : this.renderTouchTarget()}
  </${e}>`;
	}
	renderLink() {
		let { ariaLabel: e } = this;
		return T`
      <a
        class="link"
        id="link"
        href="${this.href}"
        download="${this.download || S}"
        target="${this.target || S}"
        aria-label="${e || S}">
        ${this.renderTouchTarget()}
      </a>
    `;
	}
	getRenderClasses() {
		return {
			"flip-icon": this.flipIcon,
			selected: this.toggle && this.selected
		};
	}
	renderIcon() {
		return T`<span class="icon"><slot></slot></span>`;
	}
	renderSelectedIcon() {
		return T`<span class="icon icon--selected"
      ><slot name="selected"><slot></slot></slot
    ></span>`;
	}
	renderTouchTarget() {
		return T`<span class="touch"></span>`;
	}
	renderFocusRing() {
		return T`<md-focus-ring
      part="focus-ring"
      for=${this.href ? "link" : "button"}></md-focus-ring>`;
	}
	renderRipple() {
		let e = !this.href && (this.disabled || this.softDisabled);
		return T`<md-ripple
      for=${this.href ? "link" : S}
      ?disabled="${e}"></md-ripple>`;
	}
	connectedCallback() {
		this.flipIcon = Mo(this, this.flipIconInRtl), super.connectedCallback();
	}
	handleClick(e) {
		!this.href && this.softDisabled && (e.stopImmediatePropagation(), e.preventDefault());
	}
	async handleClickOnChild(e) {
		await 0, !this.toggle || this.disabled || this.softDisabled || e.defaultPrevented || (this.selected = !this.selected, this.dispatchEvent(new InputEvent("input", {
			bubbles: !0,
			composed: !0
		})), this.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
p(G), G.formAssociated = !0, G.shadowRootOptions = {
	mode: "open",
	delegatesFocus: !0
}, d([w({
	type: Boolean,
	reflect: !0
})], G.prototype, "disabled", void 0), d([w({
	type: Boolean,
	attribute: "soft-disabled",
	reflect: !0
})], G.prototype, "softDisabled", void 0), d([w({
	type: Boolean,
	attribute: "flip-icon-in-rtl"
})], G.prototype, "flipIconInRtl", void 0), d([w()], G.prototype, "href", void 0), d([w()], G.prototype, "download", void 0), d([w()], G.prototype, "target", void 0), d([w({ attribute: "aria-label-selected" })], G.prototype, "ariaLabelSelected", void 0), d([w({ type: Boolean })], G.prototype, "toggle", void 0), d([w({
	type: Boolean,
	reflect: !0
})], G.prototype, "selected", void 0), d([w()], G.prototype, "type", void 0), d([w({ reflect: !0 })], G.prototype, "value", void 0), d([g()], G.prototype, "flipIcon", void 0);
// node_modules/esp-web-tools/node_modules/@material/web/iconbutton/internal/shared-styles.js
var Po = y`:host{display:inline-flex;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0);height:var(--_container-height);width:var(--_container-width);justify-content:center}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_container-height))/2) max(0px,(48px - var(--_container-width))/2)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}:host(:is([disabled],[soft-disabled])){pointer-events:none}.icon-button{place-items:center;background:none;border:none;box-sizing:border-box;cursor:pointer;display:flex;place-content:center;outline:none;padding:0;position:relative;text-decoration:none;user-select:none;z-index:0;flex:1;border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}.icon ::slotted(*){font-size:var(--_icon-size);height:var(--_icon-size);width:var(--_icon-size);font-weight:inherit}md-ripple{z-index:-1;border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}.flip-icon .icon{transform:scaleX(-1)}.icon{display:inline-flex}.link{display:grid;height:100%;outline:none;place-items:center;position:absolute;width:100%}.touch{position:absolute;height:max(48px,100%);width:max(48px,100%)}:host([touch-target=none]) .touch{display:none}@media(forced-colors: active){:host(:is([disabled],[soft-disabled])){--_disabled-icon-color: GrayText;--_disabled-icon-opacity: 1}}
`, Fo = y`:host{--_disabled-icon-color: var(--md-icon-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-icon-button-disabled-icon-opacity, 0.38);--_icon-size: var(--md-icon-button-icon-size, 24px);--_selected-focus-icon-color: var(--md-icon-button-selected-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-icon-color: var(--md-icon-button-selected-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-state-layer-color: var(--md-icon-button-selected-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-state-layer-opacity: var(--md-icon-button-selected-hover-state-layer-opacity, 0.08);--_selected-icon-color: var(--md-icon-button-selected-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-icon-color: var(--md-icon-button-selected-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-state-layer-color: var(--md-icon-button-selected-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-state-layer-opacity: var(--md-icon-button-selected-pressed-state-layer-opacity, 0.12);--_state-layer-height: var(--md-icon-button-state-layer-height, 40px);--_state-layer-shape: var(--md-icon-button-state-layer-shape, var(--md-sys-shape-corner-full, 9999px));--_state-layer-width: var(--md-icon-button-state-layer-width, 40px);--_focus-icon-color: var(--md-icon-button-focus-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-icon-color: var(--md-icon-button-hover-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-icon-button-hover-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-opacity: var(--md-icon-button-hover-state-layer-opacity, 0.08);--_icon-color: var(--md-icon-button-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-icon-color: var(--md-icon-button-pressed-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-color: var(--md-icon-button-pressed-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-opacity: var(--md-icon-button-pressed-state-layer-opacity, 0.12);--_container-shape-start-start: 0;--_container-shape-start-end: 0;--_container-shape-end-end: 0;--_container-shape-end-start: 0;--_container-height: 0;--_container-width: 0;height:var(--_state-layer-height);width:var(--_state-layer-width)}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_state-layer-height))/2) max(0px,(48px - var(--_state-layer-width))/2)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_state-layer-shape);--md-focus-ring-shape-start-end: var(--_state-layer-shape);--md-focus-ring-shape-end-end: var(--_state-layer-shape);--md-focus-ring-shape-end-start: var(--_state-layer-shape)}.standard{background-color:rgba(0,0,0,0);color:var(--_icon-color);--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.standard:hover{color:var(--_hover-icon-color)}.standard:focus{color:var(--_focus-icon-color)}.standard:active{color:var(--_pressed-icon-color)}.standard:is(:disabled,[aria-disabled=true]){color:var(--_disabled-icon-color)}md-ripple{border-radius:var(--_state-layer-shape)}.standard:is(:disabled,[aria-disabled=true]){opacity:var(--_disabled-icon-opacity)}.selected:not(:disabled,[aria-disabled=true]){color:var(--_selected-icon-color)}.selected:not(:disabled,[aria-disabled=true]):hover{color:var(--_selected-hover-icon-color)}.selected:not(:disabled,[aria-disabled=true]):focus{color:var(--_selected-focus-icon-color)}.selected:not(:disabled,[aria-disabled=true]):active{color:var(--_selected-pressed-icon-color)}.selected{--md-ripple-hover-color: var(--_selected-hover-state-layer-color);--md-ripple-hover-opacity: var(--_selected-hover-state-layer-opacity);--md-ripple-pressed-color: var(--_selected-pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_selected-pressed-state-layer-opacity)}
`, Io = class extends G {};
Io.styles = [Po, Fo], customElements.define("ew-icon-button", Io);
// node_modules/esp-web-tools/node_modules/@material/web/textfield/internal/filled-styles.js
var Lo = y`:host{--_active-indicator-color: var(--md-filled-text-field-active-indicator-color, var(--md-sys-color-on-surface-variant, #49454f));--_active-indicator-height: var(--md-filled-text-field-active-indicator-height, 1px);--_caret-color: var(--md-filled-text-field-caret-color, var(--md-sys-color-primary, #6750a4));--_container-color: var(--md-filled-text-field-container-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_disabled-active-indicator-color: var(--md-filled-text-field-disabled-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-active-indicator-height: var(--md-filled-text-field-disabled-active-indicator-height, 1px);--_disabled-active-indicator-opacity: var(--md-filled-text-field-disabled-active-indicator-opacity, 0.38);--_disabled-container-color: var(--md-filled-text-field-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-opacity: var(--md-filled-text-field-disabled-container-opacity, 0.04);--_disabled-input-text-color: var(--md-filled-text-field-disabled-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-input-text-opacity: var(--md-filled-text-field-disabled-input-text-opacity, 0.38);--_disabled-label-text-color: var(--md-filled-text-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-filled-text-field-disabled-label-text-opacity, 0.38);--_disabled-leading-icon-color: var(--md-filled-text-field-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-icon-opacity: var(--md-filled-text-field-disabled-leading-icon-opacity, 0.38);--_disabled-supporting-text-color: var(--md-filled-text-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-supporting-text-opacity: var(--md-filled-text-field-disabled-supporting-text-opacity, 0.38);--_disabled-trailing-icon-color: var(--md-filled-text-field-disabled-trailing-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-trailing-icon-opacity: var(--md-filled-text-field-disabled-trailing-icon-opacity, 0.38);--_error-active-indicator-color: var(--md-filled-text-field-error-active-indicator-color, var(--md-sys-color-error, #b3261e));--_error-focus-active-indicator-color: var(--md-filled-text-field-error-focus-active-indicator-color, var(--md-sys-color-error, #b3261e));--_error-focus-caret-color: var(--md-filled-text-field-error-focus-caret-color, var(--md-sys-color-error, #b3261e));--_error-focus-input-text-color: var(--md-filled-text-field-error-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_error-focus-label-text-color: var(--md-filled-text-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-leading-icon-color: var(--md-filled-text-field-error-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-focus-supporting-text-color: var(--md-filled-text-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-trailing-icon-color: var(--md-filled-text-field-error-focus-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_error-hover-active-indicator-color: var(--md-filled-text-field-error-hover-active-indicator-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-input-text-color: var(--md-filled-text-field-error-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-label-text-color: var(--md-filled-text-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-leading-icon-color: var(--md-filled-text-field-error-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-hover-state-layer-color: var(--md-filled-text-field-error-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-state-layer-opacity: var(--md-filled-text-field-error-hover-state-layer-opacity, 0.08);--_error-hover-supporting-text-color: var(--md-filled-text-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-hover-trailing-icon-color: var(--md-filled-text-field-error-hover-trailing-icon-color, var(--md-sys-color-on-error-container, #410e0b));--_error-input-text-color: var(--md-filled-text-field-error-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_error-label-text-color: var(--md-filled-text-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_error-leading-icon-color: var(--md-filled-text-field-error-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-supporting-text-color: var(--md-filled-text-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-trailing-icon-color: var(--md-filled-text-field-error-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_focus-active-indicator-color: var(--md-filled-text-field-focus-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_focus-active-indicator-height: var(--md-filled-text-field-focus-active-indicator-height, 3px);--_focus-input-text-color: var(--md-filled-text-field-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_focus-label-text-color: var(--md-filled-text-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_focus-leading-icon-color: var(--md-filled-text-field-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-supporting-text-color: var(--md-filled-text-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-trailing-icon-color: var(--md-filled-text-field-focus-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-active-indicator-color: var(--md-filled-text-field-hover-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-active-indicator-height: var(--md-filled-text-field-hover-active-indicator-height, 1px);--_hover-input-text-color: var(--md-filled-text-field-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-label-text-color: var(--md-filled-text-field-hover-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-leading-icon-color: var(--md-filled-text-field-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-filled-text-field-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-state-layer-opacity: var(--md-filled-text-field-hover-state-layer-opacity, 0.08);--_hover-supporting-text-color: var(--md-filled-text-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-trailing-icon-color: var(--md-filled-text-field-hover-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-color: var(--md-filled-text-field-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_input-text-font: var(--md-filled-text-field-input-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_input-text-line-height: var(--md-filled-text-field-input-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_input-text-placeholder-color: var(--md-filled-text-field-input-text-placeholder-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-prefix-color: var(--md-filled-text-field-input-text-prefix-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-size: var(--md-filled-text-field-input-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_input-text-suffix-color: var(--md-filled-text-field-input-text-suffix-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-weight: var(--md-filled-text-field-input-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_label-text-color: var(--md-filled-text-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-font: var(--md-filled-text-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-filled-text-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_label-text-populated-line-height: var(--md-filled-text-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_label-text-populated-size: var(--md-filled-text-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_label-text-size: var(--md-filled-text-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_label-text-weight: var(--md-filled-text-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_leading-icon-color: var(--md-filled-text-field-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_leading-icon-size: var(--md-filled-text-field-leading-icon-size, 24px);--_supporting-text-color: var(--md-filled-text-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_supporting-text-font: var(--md-filled-text-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_supporting-text-line-height: var(--md-filled-text-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_supporting-text-size: var(--md-filled-text-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_supporting-text-weight: var(--md-filled-text-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_trailing-icon-color: var(--md-filled-text-field-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_trailing-icon-size: var(--md-filled-text-field-trailing-icon-size, 24px);--_container-shape-start-start: var(--md-filled-text-field-container-shape-start-start, var(--md-filled-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-start-end: var(--md-filled-text-field-container-shape-start-end, var(--md-filled-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-end: var(--md-filled-text-field-container-shape-end-end, var(--md-filled-text-field-container-shape, var(--md-sys-shape-corner-none, 0px)));--_container-shape-end-start: var(--md-filled-text-field-container-shape-end-start, var(--md-filled-text-field-container-shape, var(--md-sys-shape-corner-none, 0px)));--_icon-input-space: var(--md-filled-text-field-icon-input-space, 16px);--_leading-space: var(--md-filled-text-field-leading-space, 16px);--_trailing-space: var(--md-filled-text-field-trailing-space, 16px);--_top-space: var(--md-filled-text-field-top-space, 16px);--_bottom-space: var(--md-filled-text-field-bottom-space, 16px);--_input-text-prefix-trailing-space: var(--md-filled-text-field-input-text-prefix-trailing-space, 2px);--_input-text-suffix-leading-space: var(--md-filled-text-field-input-text-suffix-leading-space, 2px);--_with-label-top-space: var(--md-filled-text-field-with-label-top-space, 8px);--_with-label-bottom-space: var(--md-filled-text-field-with-label-bottom-space, 8px);--_focus-caret-color: var(--md-filled-text-field-focus-caret-color, var(--md-sys-color-primary, #6750a4));--_with-leading-icon-leading-space: var(--md-filled-text-field-with-leading-icon-leading-space, 12px);--_with-trailing-icon-trailing-space: var(--md-filled-text-field-with-trailing-icon-trailing-space, 12px);--md-filled-field-active-indicator-color: var(--_active-indicator-color);--md-filled-field-active-indicator-height: var(--_active-indicator-height);--md-filled-field-bottom-space: var(--_bottom-space);--md-filled-field-container-color: var(--_container-color);--md-filled-field-container-shape-end-end: var(--_container-shape-end-end);--md-filled-field-container-shape-end-start: var(--_container-shape-end-start);--md-filled-field-container-shape-start-end: var(--_container-shape-start-end);--md-filled-field-container-shape-start-start: var(--_container-shape-start-start);--md-filled-field-content-color: var(--_input-text-color);--md-filled-field-content-font: var(--_input-text-font);--md-filled-field-content-line-height: var(--_input-text-line-height);--md-filled-field-content-size: var(--_input-text-size);--md-filled-field-content-space: var(--_icon-input-space);--md-filled-field-content-weight: var(--_input-text-weight);--md-filled-field-disabled-active-indicator-color: var(--_disabled-active-indicator-color);--md-filled-field-disabled-active-indicator-height: var(--_disabled-active-indicator-height);--md-filled-field-disabled-active-indicator-opacity: var(--_disabled-active-indicator-opacity);--md-filled-field-disabled-container-color: var(--_disabled-container-color);--md-filled-field-disabled-container-opacity: var(--_disabled-container-opacity);--md-filled-field-disabled-content-color: var(--_disabled-input-text-color);--md-filled-field-disabled-content-opacity: var(--_disabled-input-text-opacity);--md-filled-field-disabled-label-text-color: var(--_disabled-label-text-color);--md-filled-field-disabled-label-text-opacity: var(--_disabled-label-text-opacity);--md-filled-field-disabled-leading-content-color: var(--_disabled-leading-icon-color);--md-filled-field-disabled-leading-content-opacity: var(--_disabled-leading-icon-opacity);--md-filled-field-disabled-supporting-text-color: var(--_disabled-supporting-text-color);--md-filled-field-disabled-supporting-text-opacity: var(--_disabled-supporting-text-opacity);--md-filled-field-disabled-trailing-content-color: var(--_disabled-trailing-icon-color);--md-filled-field-disabled-trailing-content-opacity: var(--_disabled-trailing-icon-opacity);--md-filled-field-error-active-indicator-color: var(--_error-active-indicator-color);--md-filled-field-error-content-color: var(--_error-input-text-color);--md-filled-field-error-focus-active-indicator-color: var(--_error-focus-active-indicator-color);--md-filled-field-error-focus-content-color: var(--_error-focus-input-text-color);--md-filled-field-error-focus-label-text-color: var(--_error-focus-label-text-color);--md-filled-field-error-focus-leading-content-color: var(--_error-focus-leading-icon-color);--md-filled-field-error-focus-supporting-text-color: var(--_error-focus-supporting-text-color);--md-filled-field-error-focus-trailing-content-color: var(--_error-focus-trailing-icon-color);--md-filled-field-error-hover-active-indicator-color: var(--_error-hover-active-indicator-color);--md-filled-field-error-hover-content-color: var(--_error-hover-input-text-color);--md-filled-field-error-hover-label-text-color: var(--_error-hover-label-text-color);--md-filled-field-error-hover-leading-content-color: var(--_error-hover-leading-icon-color);--md-filled-field-error-hover-state-layer-color: var(--_error-hover-state-layer-color);--md-filled-field-error-hover-state-layer-opacity: var(--_error-hover-state-layer-opacity);--md-filled-field-error-hover-supporting-text-color: var(--_error-hover-supporting-text-color);--md-filled-field-error-hover-trailing-content-color: var(--_error-hover-trailing-icon-color);--md-filled-field-error-label-text-color: var(--_error-label-text-color);--md-filled-field-error-leading-content-color: var(--_error-leading-icon-color);--md-filled-field-error-supporting-text-color: var(--_error-supporting-text-color);--md-filled-field-error-trailing-content-color: var(--_error-trailing-icon-color);--md-filled-field-focus-active-indicator-color: var(--_focus-active-indicator-color);--md-filled-field-focus-active-indicator-height: var(--_focus-active-indicator-height);--md-filled-field-focus-content-color: var(--_focus-input-text-color);--md-filled-field-focus-label-text-color: var(--_focus-label-text-color);--md-filled-field-focus-leading-content-color: var(--_focus-leading-icon-color);--md-filled-field-focus-supporting-text-color: var(--_focus-supporting-text-color);--md-filled-field-focus-trailing-content-color: var(--_focus-trailing-icon-color);--md-filled-field-hover-active-indicator-color: var(--_hover-active-indicator-color);--md-filled-field-hover-active-indicator-height: var(--_hover-active-indicator-height);--md-filled-field-hover-content-color: var(--_hover-input-text-color);--md-filled-field-hover-label-text-color: var(--_hover-label-text-color);--md-filled-field-hover-leading-content-color: var(--_hover-leading-icon-color);--md-filled-field-hover-state-layer-color: var(--_hover-state-layer-color);--md-filled-field-hover-state-layer-opacity: var(--_hover-state-layer-opacity);--md-filled-field-hover-supporting-text-color: var(--_hover-supporting-text-color);--md-filled-field-hover-trailing-content-color: var(--_hover-trailing-icon-color);--md-filled-field-label-text-color: var(--_label-text-color);--md-filled-field-label-text-font: var(--_label-text-font);--md-filled-field-label-text-line-height: var(--_label-text-line-height);--md-filled-field-label-text-populated-line-height: var(--_label-text-populated-line-height);--md-filled-field-label-text-populated-size: var(--_label-text-populated-size);--md-filled-field-label-text-size: var(--_label-text-size);--md-filled-field-label-text-weight: var(--_label-text-weight);--md-filled-field-leading-content-color: var(--_leading-icon-color);--md-filled-field-leading-space: var(--_leading-space);--md-filled-field-supporting-text-color: var(--_supporting-text-color);--md-filled-field-supporting-text-font: var(--_supporting-text-font);--md-filled-field-supporting-text-line-height: var(--_supporting-text-line-height);--md-filled-field-supporting-text-size: var(--_supporting-text-size);--md-filled-field-supporting-text-weight: var(--_supporting-text-weight);--md-filled-field-top-space: var(--_top-space);--md-filled-field-trailing-content-color: var(--_trailing-icon-color);--md-filled-field-trailing-space: var(--_trailing-space);--md-filled-field-with-label-bottom-space: var(--_with-label-bottom-space);--md-filled-field-with-label-top-space: var(--_with-label-top-space);--md-filled-field-with-leading-content-leading-space: var(--_with-leading-icon-leading-space);--md-filled-field-with-trailing-content-trailing-space: var(--_with-trailing-icon-trailing-space)}
`, K = class extends _ {
	constructor() {
		super(...arguments), this.disabled = !1, this.error = !1, this.focused = !1, this.label = "", this.noAsterisk = !1, this.populated = !1, this.required = !1, this.resizable = !1, this.supportingText = "", this.errorText = "", this.count = -1, this.max = -1, this.hasStart = !1, this.hasEnd = !1, this.isAnimating = !1, this.refreshErrorAlert = !1, this.disableTransitions = !1;
	}
	get counterText() {
		let e = this.count ?? -1, t = this.max ?? -1;
		return e < 0 || t <= 0 ? "" : `${e} / ${t}`;
	}
	get supportingOrErrorText() {
		return this.error && this.errorText ? this.errorText : this.supportingText;
	}
	reannounceError() {
		this.refreshErrorAlert = !0;
	}
	update(e) {
		e.has("disabled") && e.get("disabled") !== void 0 && (this.disableTransitions = !0), this.disabled && this.focused && (e.set("focused", !0), this.focused = !1), this.animateLabelIfNeeded({
			wasFocused: e.get("focused"),
			wasPopulated: e.get("populated")
		}), super.update(e);
	}
	render() {
		let e = this.renderLabel(!0), t = this.renderLabel(!1), n = this.renderOutline?.(e), r = {
			disabled: this.disabled,
			"disable-transitions": this.disableTransitions,
			error: this.error && !this.disabled,
			focused: this.focused,
			"with-start": this.hasStart,
			"with-end": this.hasEnd,
			populated: this.populated,
			resizable: this.resizable,
			required: this.required,
			"no-label": !this.label
		};
		return T`
      <div class="field ${O(r)}">
        <div class="container-overflow">
          ${this.renderBackground?.()}
          <slot name="container"></slot>
          ${this.renderStateLayer?.()} ${this.renderIndicator?.()} ${n}
          <div class="container">
            <div class="start">
              <slot name="start"></slot>
            </div>
            <div class="middle">
              <div class="label-wrapper">
                ${t} ${n ? S : e}
              </div>
              <div class="content">
                <slot></slot>
              </div>
            </div>
            <div class="end">
              <slot name="end"></slot>
            </div>
          </div>
        </div>
        ${this.renderSupportingText()}
      </div>
    `;
	}
	updated(e) {
		(e.has("supportingText") || e.has("errorText") || e.has("count") || e.has("max")) && this.updateSlottedAriaDescribedBy(), this.refreshErrorAlert && requestAnimationFrame(() => {
			this.refreshErrorAlert = !1;
		}), this.disableTransitions && requestAnimationFrame(() => {
			this.disableTransitions = !1;
		});
	}
	renderSupportingText() {
		let { supportingOrErrorText: e, counterText: t } = this;
		if (!e && !t) return S;
		let n = T`<span>${e}</span>`, r = t ? T`<span class="counter">${t}</span>` : S, i = this.error && this.errorText && !this.refreshErrorAlert ? "alert" : S;
		return T`
      <div class="supporting-text" role=${i}>${n}${r}</div>
      <slot
        name="aria-describedby"
        @slotchange=${this.updateSlottedAriaDescribedBy}></slot>
    `;
	}
	updateSlottedAriaDescribedBy() {
		for (let e of this.slottedAriaDescribedBy) ee(T`${this.supportingOrErrorText} ${this.counterText}`, e), e.setAttribute("hidden", "");
	}
	renderLabel(e) {
		if (!this.label) return S;
		let t;
		t = e ? this.focused || this.populated || this.isAnimating : !this.focused && !this.populated && !this.isAnimating;
		let n = {
			hidden: !t,
			floating: e,
			resting: !e
		}, r = `${this.label}${this.required && !this.noAsterisk ? "*" : ""}`;
		return T`
      <span class="label ${O(n)}" aria-hidden=${!t}
        >${r}</span
      >
    `;
	}
	animateLabelIfNeeded({ wasFocused: e, wasPopulated: t }) {
		this.label && (e ??= this.focused, t ??= this.populated, (e || t) !== (this.focused || this.populated) && (this.isAnimating = !0, this.labelAnimation?.cancel(), this.labelAnimation = this.floatingLabelEl?.animate(this.getLabelKeyframes(), {
			duration: 150,
			easing: n.STANDARD
		}), this.labelAnimation?.addEventListener("finish", () => {
			this.isAnimating = !1;
		})));
	}
	getLabelKeyframes() {
		let { floatingLabelEl: e, restingLabelEl: t } = this;
		if (!e || !t) return [];
		let { x: n, y: r, height: i } = e.getBoundingClientRect(), { x: a, y: o, height: s } = t.getBoundingClientRect(), c = e.scrollWidth, l = t.scrollWidth, u = l / c, d = `translateX(${a - n}px) translateY(${o - r + Math.round((s - i * u) / 2)}px) scale(${u})`, f = "translateX(0) translateY(0) scale(1)", p = t.clientWidth, m = l > p ? `${p / u}px` : "";
		return this.focused || this.populated ? [{
			transform: d,
			width: m
		}, {
			transform: f,
			width: m
		}] : [{
			transform: f,
			width: m
		}, {
			transform: d,
			width: m
		}];
	}
	getSurfacePositionClientRect() {
		return this.containerEl.getBoundingClientRect();
	}
};
d([w({ type: Boolean })], K.prototype, "disabled", void 0), d([w({ type: Boolean })], K.prototype, "error", void 0), d([w({ type: Boolean })], K.prototype, "focused", void 0), d([w()], K.prototype, "label", void 0), d([w({
	type: Boolean,
	attribute: "no-asterisk"
})], K.prototype, "noAsterisk", void 0), d([w({ type: Boolean })], K.prototype, "populated", void 0), d([w({ type: Boolean })], K.prototype, "required", void 0), d([w({ type: Boolean })], K.prototype, "resizable", void 0), d([w({ attribute: "supporting-text" })], K.prototype, "supportingText", void 0), d([w({ attribute: "error-text" })], K.prototype, "errorText", void 0), d([w({ type: Number })], K.prototype, "count", void 0), d([w({ type: Number })], K.prototype, "max", void 0), d([w({
	type: Boolean,
	attribute: "has-start"
})], K.prototype, "hasStart", void 0), d([w({
	type: Boolean,
	attribute: "has-end"
})], K.prototype, "hasEnd", void 0), d([c({ slot: "aria-describedby" })], K.prototype, "slottedAriaDescribedBy", void 0), d([g()], K.prototype, "isAnimating", void 0), d([g()], K.prototype, "refreshErrorAlert", void 0), d([g()], K.prototype, "disableTransitions", void 0), d([a(".label.floating")], K.prototype, "floatingLabelEl", void 0), d([a(".label.resting")], K.prototype, "restingLabelEl", void 0), d([a(".container")], K.prototype, "containerEl", void 0);
// node_modules/esp-web-tools/node_modules/@material/web/field/internal/filled-field.js
var Ro = class extends K {
	renderBackground() {
		return T` <div class="background"></div> `;
	}
	renderStateLayer() {
		return T` <div class="state-layer"></div> `;
	}
	renderIndicator() {
		return T`<div class="active-indicator"></div>`;
	}
}, zo = y`@layer styles{:host{--_active-indicator-color: var(--md-filled-field-active-indicator-color, var(--md-sys-color-on-surface-variant, #49454f));--_active-indicator-height: var(--md-filled-field-active-indicator-height, 1px);--_bottom-space: var(--md-filled-field-bottom-space, 16px);--_container-color: var(--md-filled-field-container-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_content-color: var(--md-filled-field-content-color, var(--md-sys-color-on-surface, #1d1b20));--_content-font: var(--md-filled-field-content-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_content-line-height: var(--md-filled-field-content-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_content-size: var(--md-filled-field-content-size, var(--md-sys-typescale-body-large-size, 1rem));--_content-space: var(--md-filled-field-content-space, 16px);--_content-weight: var(--md-filled-field-content-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_disabled-active-indicator-color: var(--md-filled-field-disabled-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-active-indicator-height: var(--md-filled-field-disabled-active-indicator-height, 1px);--_disabled-active-indicator-opacity: var(--md-filled-field-disabled-active-indicator-opacity, 0.38);--_disabled-container-color: var(--md-filled-field-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-opacity: var(--md-filled-field-disabled-container-opacity, 0.04);--_disabled-content-color: var(--md-filled-field-disabled-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-content-opacity: var(--md-filled-field-disabled-content-opacity, 0.38);--_disabled-label-text-color: var(--md-filled-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-filled-field-disabled-label-text-opacity, 0.38);--_disabled-leading-content-color: var(--md-filled-field-disabled-leading-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-content-opacity: var(--md-filled-field-disabled-leading-content-opacity, 0.38);--_disabled-supporting-text-color: var(--md-filled-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-supporting-text-opacity: var(--md-filled-field-disabled-supporting-text-opacity, 0.38);--_disabled-trailing-content-color: var(--md-filled-field-disabled-trailing-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-trailing-content-opacity: var(--md-filled-field-disabled-trailing-content-opacity, 0.38);--_error-active-indicator-color: var(--md-filled-field-error-active-indicator-color, var(--md-sys-color-error, #b3261e));--_error-content-color: var(--md-filled-field-error-content-color, var(--md-sys-color-on-surface, #1d1b20));--_error-focus-active-indicator-color: var(--md-filled-field-error-focus-active-indicator-color, var(--md-sys-color-error, #b3261e));--_error-focus-content-color: var(--md-filled-field-error-focus-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-focus-label-text-color: var(--md-filled-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-leading-content-color: var(--md-filled-field-error-focus-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-focus-supporting-text-color: var(--md-filled-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-trailing-content-color: var(--md-filled-field-error-focus-trailing-content-color, var(--md-sys-color-error, #b3261e));--_error-hover-active-indicator-color: var(--md-filled-field-error-hover-active-indicator-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-content-color: var(--md-filled-field-error-hover-content-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-label-text-color: var(--md-filled-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-leading-content-color: var(--md-filled-field-error-hover-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-hover-state-layer-color: var(--md-filled-field-error-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-state-layer-opacity: var(--md-filled-field-error-hover-state-layer-opacity, 0.08);--_error-hover-supporting-text-color: var(--md-filled-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-hover-trailing-content-color: var(--md-filled-field-error-hover-trailing-content-color, var(--md-sys-color-on-error-container, #410e0b));--_error-label-text-color: var(--md-filled-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_error-leading-content-color: var(--md-filled-field-error-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-supporting-text-color: var(--md-filled-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-trailing-content-color: var(--md-filled-field-error-trailing-content-color, var(--md-sys-color-error, #b3261e));--_focus-active-indicator-color: var(--md-filled-field-focus-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_focus-active-indicator-height: var(--md-filled-field-focus-active-indicator-height, 3px);--_focus-content-color: var(--md-filled-field-focus-content-color, var(--md-sys-color-on-surface, #1d1b20));--_focus-label-text-color: var(--md-filled-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_focus-leading-content-color: var(--md-filled-field-focus-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-supporting-text-color: var(--md-filled-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-trailing-content-color: var(--md-filled-field-focus-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-active-indicator-color: var(--md-filled-field-hover-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-active-indicator-height: var(--md-filled-field-hover-active-indicator-height, 1px);--_hover-content-color: var(--md-filled-field-hover-content-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-label-text-color: var(--md-filled-field-hover-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-leading-content-color: var(--md-filled-field-hover-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-filled-field-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-state-layer-opacity: var(--md-filled-field-hover-state-layer-opacity, 0.08);--_hover-supporting-text-color: var(--md-filled-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-trailing-content-color: var(--md-filled-field-hover-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-color: var(--md-filled-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-font: var(--md-filled-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-filled-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_label-text-populated-line-height: var(--md-filled-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_label-text-populated-size: var(--md-filled-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_label-text-size: var(--md-filled-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_label-text-weight: var(--md-filled-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_leading-content-color: var(--md-filled-field-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_leading-space: var(--md-filled-field-leading-space, 16px);--_supporting-text-color: var(--md-filled-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_supporting-text-font: var(--md-filled-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_supporting-text-leading-space: var(--md-filled-field-supporting-text-leading-space, 16px);--_supporting-text-line-height: var(--md-filled-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_supporting-text-size: var(--md-filled-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_supporting-text-top-space: var(--md-filled-field-supporting-text-top-space, 4px);--_supporting-text-trailing-space: var(--md-filled-field-supporting-text-trailing-space, 16px);--_supporting-text-weight: var(--md-filled-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_top-space: var(--md-filled-field-top-space, 16px);--_trailing-content-color: var(--md-filled-field-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_trailing-space: var(--md-filled-field-trailing-space, 16px);--_with-label-bottom-space: var(--md-filled-field-with-label-bottom-space, 8px);--_with-label-top-space: var(--md-filled-field-with-label-top-space, 8px);--_with-leading-content-leading-space: var(--md-filled-field-with-leading-content-leading-space, 12px);--_with-trailing-content-trailing-space: var(--md-filled-field-with-trailing-content-trailing-space, 12px);--_container-shape-start-start: var(--md-filled-field-container-shape-start-start, var(--md-filled-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-start-end: var(--md-filled-field-container-shape-start-end, var(--md-filled-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-end: var(--md-filled-field-container-shape-end-end, var(--md-filled-field-container-shape, var(--md-sys-shape-corner-none, 0px)));--_container-shape-end-start: var(--md-filled-field-container-shape-end-start, var(--md-filled-field-container-shape, var(--md-sys-shape-corner-none, 0px)))}.background,.state-layer{border-radius:inherit;inset:0;pointer-events:none;position:absolute}.background{background:var(--_container-color)}.state-layer{visibility:hidden}.field:not(.disabled):hover .state-layer{visibility:visible}.label.floating{position:absolute;top:var(--_with-label-top-space)}.field:not(.with-start) .label-wrapper{margin-inline-start:var(--_leading-space)}.field:not(.with-end) .label-wrapper{margin-inline-end:var(--_trailing-space)}.active-indicator{inset:auto 0 0 0;pointer-events:none;position:absolute;width:100%;z-index:1}.active-indicator::before,.active-indicator::after{border-bottom:var(--_active-indicator-height) solid var(--_active-indicator-color);inset:auto 0 0 0;content:"";position:absolute;width:100%}.active-indicator::after{opacity:0;transition:opacity 150ms cubic-bezier(0.2, 0, 0, 1)}.focused .active-indicator::after{opacity:1}.field:not(.with-start) .content ::slotted(*){padding-inline-start:var(--_leading-space)}.field:not(.with-end) .content ::slotted(*){padding-inline-end:var(--_trailing-space)}.field:not(.no-label) .content ::slotted(:not(textarea)){padding-bottom:var(--_with-label-bottom-space);padding-top:calc(var(--_with-label-top-space) + var(--_label-text-populated-line-height))}.field:not(.no-label) .content ::slotted(textarea){margin-bottom:var(--_with-label-bottom-space);margin-top:calc(var(--_with-label-top-space) + var(--_label-text-populated-line-height))}:hover .active-indicator::before{border-bottom-color:var(--_hover-active-indicator-color);border-bottom-width:var(--_hover-active-indicator-height)}.active-indicator::after{border-bottom-color:var(--_focus-active-indicator-color);border-bottom-width:var(--_focus-active-indicator-height)}:hover .state-layer{background:var(--_hover-state-layer-color);opacity:var(--_hover-state-layer-opacity)}.disabled .active-indicator::before{border-bottom-color:var(--_disabled-active-indicator-color);border-bottom-width:var(--_disabled-active-indicator-height);opacity:var(--_disabled-active-indicator-opacity)}.disabled .background{background:var(--_disabled-container-color);opacity:var(--_disabled-container-opacity)}.error .active-indicator::before{border-bottom-color:var(--_error-active-indicator-color)}.error:hover .active-indicator::before{border-bottom-color:var(--_error-hover-active-indicator-color)}.error:hover .state-layer{background:var(--_error-hover-state-layer-color);opacity:var(--_error-hover-state-layer-opacity)}.error .active-indicator::after{border-bottom-color:var(--_error-focus-active-indicator-color)}.resizable .container{bottom:var(--_focus-active-indicator-height);clip-path:inset(var(--_focus-active-indicator-height) 0 0 0)}.resizable .container>*{top:var(--_focus-active-indicator-height)}}@layer hcm{@media(forced-colors: active){.disabled .active-indicator::before{border-color:GrayText;opacity:1}}}
`, Bo = y`:host{display:inline-flex;resize:both}.field{display:flex;flex:1;flex-direction:column;writing-mode:horizontal-tb;max-width:100%}.container-overflow{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-end-radius:var(--_container-shape-end-end);border-end-start-radius:var(--_container-shape-end-start);display:flex;height:100%;position:relative}.container{align-items:center;border-radius:inherit;display:flex;flex:1;max-height:100%;min-height:100%;min-width:min-content;position:relative}.field,.container-overflow{resize:inherit}.resizable:not(.disabled) .container{resize:inherit;overflow:hidden}.disabled{pointer-events:none}slot[name=container]{border-radius:inherit}slot[name=container]::slotted(*){border-radius:inherit;inset:0;pointer-events:none;position:absolute}@layer styles{.start,.middle,.end{display:flex;box-sizing:border-box;height:100%;position:relative}.start{color:var(--_leading-content-color)}.end{color:var(--_trailing-content-color)}.start,.end{align-items:center;justify-content:center}.with-start .start{margin-inline:var(--_with-leading-content-leading-space) var(--_content-space)}.with-end .end{margin-inline:var(--_content-space) var(--_with-trailing-content-trailing-space)}.middle{align-items:stretch;align-self:baseline;flex:1}.content{color:var(--_content-color);display:flex;flex:1;opacity:0;transition:opacity 83ms cubic-bezier(0.2, 0, 0, 1)}.no-label .content,.focused .content,.populated .content{opacity:1;transition-delay:67ms}:is(.disabled,.disable-transitions) .content{transition:none}.content ::slotted(*){all:unset;color:currentColor;font-family:var(--_content-font);font-size:var(--_content-size);line-height:var(--_content-line-height);font-weight:var(--_content-weight);width:100%;overflow-wrap:revert;white-space:revert}.content ::slotted(:not(textarea)){padding-top:var(--_top-space);padding-bottom:var(--_bottom-space)}.content ::slotted(textarea){margin-top:var(--_top-space);margin-bottom:var(--_bottom-space)}:hover .content{color:var(--_hover-content-color)}:hover .start{color:var(--_hover-leading-content-color)}:hover .end{color:var(--_hover-trailing-content-color)}.focused .content{color:var(--_focus-content-color)}.focused .start{color:var(--_focus-leading-content-color)}.focused .end{color:var(--_focus-trailing-content-color)}.disabled .content{color:var(--_disabled-content-color)}.disabled.no-label .content,.disabled.focused .content,.disabled.populated .content{opacity:var(--_disabled-content-opacity)}.disabled .start{color:var(--_disabled-leading-content-color);opacity:var(--_disabled-leading-content-opacity)}.disabled .end{color:var(--_disabled-trailing-content-color);opacity:var(--_disabled-trailing-content-opacity)}.error .content{color:var(--_error-content-color)}.error .start{color:var(--_error-leading-content-color)}.error .end{color:var(--_error-trailing-content-color)}.error:hover .content{color:var(--_error-hover-content-color)}.error:hover .start{color:var(--_error-hover-leading-content-color)}.error:hover .end{color:var(--_error-hover-trailing-content-color)}.error.focused .content{color:var(--_error-focus-content-color)}.error.focused .start{color:var(--_error-focus-leading-content-color)}.error.focused .end{color:var(--_error-focus-trailing-content-color)}}@layer hcm{@media(forced-colors: active){.disabled :is(.start,.content,.end){color:GrayText;opacity:1}}}@layer styles{.label{box-sizing:border-box;color:var(--_label-text-color);overflow:hidden;max-width:100%;text-overflow:ellipsis;white-space:nowrap;z-index:1;font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);width:min-content}.label-wrapper{inset:0;pointer-events:none;position:absolute}.label.resting{position:absolute;top:var(--_top-space)}.label.floating{font-size:var(--_label-text-populated-size);line-height:var(--_label-text-populated-line-height);transform-origin:top left}.label.hidden{opacity:0}.no-label .label{display:none}.label-wrapper{inset:0;position:absolute;text-align:initial}:hover .label{color:var(--_hover-label-text-color)}.focused .label{color:var(--_focus-label-text-color)}.disabled .label{color:var(--_disabled-label-text-color)}.disabled .label:not(.hidden){opacity:var(--_disabled-label-text-opacity)}.error .label{color:var(--_error-label-text-color)}.error:hover .label{color:var(--_error-hover-label-text-color)}.error.focused .label{color:var(--_error-focus-label-text-color)}}@layer hcm{@media(forced-colors: active){.disabled .label:not(.hidden){color:GrayText;opacity:1}}}@layer styles{.supporting-text{color:var(--_supporting-text-color);display:flex;font-family:var(--_supporting-text-font);font-size:var(--_supporting-text-size);line-height:var(--_supporting-text-line-height);font-weight:var(--_supporting-text-weight);gap:16px;justify-content:space-between;padding-inline-start:var(--_supporting-text-leading-space);padding-inline-end:var(--_supporting-text-trailing-space);padding-top:var(--_supporting-text-top-space)}.supporting-text :nth-child(2){flex-shrink:0}:hover .supporting-text{color:var(--_hover-supporting-text-color)}.focus .supporting-text{color:var(--_focus-supporting-text-color)}.disabled .supporting-text{color:var(--_disabled-supporting-text-color);opacity:var(--_disabled-supporting-text-opacity)}.error .supporting-text{color:var(--_error-supporting-text-color)}.error:hover .supporting-text{color:var(--_error-hover-supporting-text-color)}.error.focus .supporting-text{color:var(--_error-focus-supporting-text-color)}}@layer hcm{@media(forced-colors: active){.disabled .supporting-text{color:GrayText;opacity:1}}}
`, Vo = class extends Ro {};
Vo.styles = [Bo, zo], Vo = d([D("md-filled-field")], Vo);
// node_modules/lit-html/directives/live.js
var Ho = C(class extends E {
	constructor(e) {
		if (super(e), e.type !== x.PROPERTY && e.type !== x.ATTRIBUTE && e.type !== x.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
		if (!ne(e)) throw Error("`live` bindings can only contain a single expression");
	}
	render(e) {
		return e;
	}
	update(e, [t]) {
		if (t === v || t === S) return t;
		let n = e.element, r = e.name;
		if (e.type === x.PROPERTY) {
			if (t === n[r]) return v;
		} else if (e.type === x.BOOLEAN_ATTRIBUTE) {
			if (!!t === n.hasAttribute(r)) return v;
		} else if (e.type === x.ATTRIBUTE && n.getAttribute(r) === t + "") return v;
		return re(e), t;
	}
}), Uo = {
	fromAttribute(e) {
		return e ?? "";
	},
	toAttribute(e) {
		return e || null;
	}
}, Wo = Symbol("onReportValidity"), Go = Symbol("privateCleanupFormListeners"), Ko = Symbol("privateDoNotReportInvalid"), qo = Symbol("privateIsSelfReportingValidity"), Jo = Symbol("privateCallOnReportValidity");
function Yo(e) {
	var n, r, i;
	class a extends e {
		constructor(...e) {
			super(...e), this[n] = new AbortController(), this[r] = !1, this[i] = !1, this.addEventListener("invalid", (e) => {
				!this[Ko] && e.isTrusted && this.addEventListener("invalid", () => {
					this[Jo](e);
				}, { once: !0 });
			}, { capture: !0 });
		}
		checkValidity() {
			this[Ko] = !0;
			let e = super.checkValidity();
			return this[Ko] = !1, e;
		}
		reportValidity() {
			this[qo] = !0;
			let e = super.reportValidity();
			return e && this[Jo](null), this[qo] = !1, e;
		}
		[(n = Go, r = Ko, i = qo, Jo)](e) {
			let n = e?.defaultPrevented;
			n || (this[Wo](e), !n && e?.defaultPrevented && (this[qo] || $o(this[t].form, this)) && this.focus());
		}
		[Wo](e) {
			throw Error("Implement [onReportValidity]");
		}
		formAssociatedCallback(e) {
			super.formAssociatedCallback && super.formAssociatedCallback(e), this[Go].abort(), e && (this[Go] = new AbortController(), Xo(this, e, () => {
				this[Jo](null);
			}, this[Go].signal));
		}
	}
	return a;
}
function Xo(e, t, n, r) {
	let i = Qo(t), a = !1, o, s = !1;
	i.addEventListener("before", () => {
		s = !0, o = new AbortController(), a = !1, e.addEventListener("invalid", () => {
			a = !0;
		}, { signal: o.signal });
	}, { signal: r }), i.addEventListener("after", () => {
		s = !1, o?.abort(), a || n();
	}, { signal: r }), t.addEventListener("submit", () => {
		s || n();
	}, { signal: r });
}
var Zo = /* @__PURE__ */ new WeakMap();
function Qo(e) {
	if (!Zo.has(e)) {
		let t = new EventTarget();
		Zo.set(e, t);
		for (let n of ["reportValidity", "requestSubmit"]) {
			let r = e[n];
			e[n] = function() {
				t.dispatchEvent(new Event("before"));
				let e = Reflect.apply(r, this, arguments);
				return t.dispatchEvent(new Event("after")), e;
			};
		}
	}
	return Zo.get(e);
}
function $o(e, t) {
	if (!e) return !0;
	let n;
	for (let t of e.elements) if (t.matches(":invalid")) {
		n = t;
		break;
	}
	return n === t;
}
// node_modules/esp-web-tools/node_modules/@material/web/labs/behaviors/validators/text-field-validator.js
var es = class extends rt {
	computeValidity({ state: e, renderedControl: t }) {
		let n = t;
		ts(e) && !n ? (n = this.inputControl || document.createElement("input"), this.inputControl = n) : n || (n = this.textAreaControl || document.createElement("textarea"), this.textAreaControl = n);
		let r = ts(e) ? n : null;
		if (r && (r.type = e.type), n.value !== e.value && (n.value = e.value), n.required = e.required, r) {
			let t = e;
			t.pattern ? r.pattern = t.pattern : r.removeAttribute("pattern"), t.min ? r.min = t.min : r.removeAttribute("min"), t.max ? r.max = t.max : r.removeAttribute("max"), t.step ? r.step = t.step : r.removeAttribute("step");
		}
		return (e.minLength ?? -1) > -1 ? n.setAttribute("minlength", String(e.minLength)) : n.removeAttribute("minlength"), (e.maxLength ?? -1) > -1 ? n.setAttribute("maxlength", String(e.maxLength)) : n.removeAttribute("maxlength"), {
			validity: n.validity,
			validationMessage: n.validationMessage
		};
	}
	equals({ state: e }, { state: t }) {
		let n = e.type === t.type && e.value === t.value && e.required === t.required && e.minLength === t.minLength && e.maxLength === t.maxLength;
		return !ts(e) || !ts(t) ? n : n && e.pattern === t.pattern && e.min === t.min && e.max === t.max && e.step === t.step;
	}
	copy({ state: e }) {
		return {
			state: ts(e) ? this.copyInput(e) : this.copyTextArea(e),
			renderedControl: null
		};
	}
	copyInput(e) {
		let { type: t, pattern: n, min: r, max: i, step: a } = e;
		return {
			...this.copySharedState(e),
			type: t,
			pattern: n,
			min: r,
			max: i,
			step: a
		};
	}
	copyTextArea(e) {
		return {
			...this.copySharedState(e),
			type: e.type
		};
	}
	copySharedState({ value: e, required: t, minLength: n, maxLength: r }) {
		return {
			value: e,
			required: t,
			minLength: n,
			maxLength: r
		};
	}
};
function ts(e) {
	return e.type !== "textarea";
}
// node_modules/esp-web-tools/node_modules/@material/web/textfield/internal/text-field.js
var ns = h(Yo($e(nt(s(_))))), q = class extends ns {
	constructor() {
		super(...arguments), this.error = !1, this.errorText = "", this.label = "", this.noAsterisk = !1, this.required = !1, this.value = "", this.prefixText = "", this.suffixText = "", this.hasLeadingIcon = !1, this.hasTrailingIcon = !1, this.supportingText = "", this.textDirection = "", this.rows = 2, this.cols = 20, this.inputMode = "", this.max = "", this.maxLength = -1, this.min = "", this.minLength = -1, this.noSpinner = !1, this.pattern = "", this.placeholder = "", this.readOnly = !1, this.multiple = !1, this.step = "", this.type = "text", this.autocomplete = "", this.dirty = !1, this.focused = !1, this.nativeError = !1, this.nativeErrorText = "";
	}
	get selectionDirection() {
		return this.getInputOrTextarea().selectionDirection;
	}
	set selectionDirection(e) {
		this.getInputOrTextarea().selectionDirection = e;
	}
	get selectionEnd() {
		return this.getInputOrTextarea().selectionEnd;
	}
	set selectionEnd(e) {
		this.getInputOrTextarea().selectionEnd = e;
	}
	get selectionStart() {
		return this.getInputOrTextarea().selectionStart;
	}
	set selectionStart(e) {
		this.getInputOrTextarea().selectionStart = e;
	}
	get valueAsNumber() {
		let e = this.getInput();
		return e ? e.valueAsNumber : NaN;
	}
	set valueAsNumber(e) {
		let t = this.getInput();
		t && (t.valueAsNumber = e, this.value = t.value);
	}
	get valueAsDate() {
		let e = this.getInput();
		return e ? e.valueAsDate : null;
	}
	set valueAsDate(e) {
		let t = this.getInput();
		t && (t.valueAsDate = e, this.value = t.value);
	}
	get hasError() {
		return this.error || this.nativeError;
	}
	select() {
		this.getInputOrTextarea().select();
	}
	setRangeText(...e) {
		this.getInputOrTextarea().setRangeText(...e), this.value = this.getInputOrTextarea().value;
	}
	setSelectionRange(e, t, n) {
		this.getInputOrTextarea().setSelectionRange(e, t, n);
	}
	showPicker() {
		let e = this.getInput();
		e && e.showPicker();
	}
	stepDown(e) {
		let t = this.getInput();
		t && (t.stepDown(e), this.value = t.value);
	}
	stepUp(e) {
		let t = this.getInput();
		t && (t.stepUp(e), this.value = t.value);
	}
	reset() {
		this.dirty = !1, this.value = this.getAttribute("value") ?? "", this.nativeError = !1, this.nativeErrorText = "";
	}
	attributeChangedCallback(e, t, n) {
		e === "value" && this.dirty || super.attributeChangedCallback(e, t, n);
	}
	render() {
		let e = {
			disabled: this.disabled,
			error: !this.disabled && this.hasError,
			textarea: this.type === "textarea",
			"no-spinner": this.noSpinner
		};
		return T`
      <span class="text-field ${O(e)}">
        ${this.renderField()}
      </span>
    `;
	}
	updated(e) {
		let t = this.getInputOrTextarea().value;
		this.value !== t && (this.value = t);
	}
	renderField() {
		return He`<${this.fieldTag}
      class="field"
      count=${this.value.length}
      ?disabled=${this.disabled}
      ?error=${this.hasError}
      error-text=${this.getErrorText()}
      ?focused=${this.focused}
      ?has-end=${this.hasTrailingIcon}
      ?has-start=${this.hasLeadingIcon}
      label=${this.label}
      ?no-asterisk=${this.noAsterisk}
      max=${this.maxLength}
      ?populated=${!!this.value}
      ?required=${this.required}
      ?resizable=${this.type === "textarea"}
      supporting-text=${this.supportingText}
    >
      ${this.renderLeadingIcon()}
      ${this.renderInputOrTextarea()}
      ${this.renderTrailingIcon()}
      <div id="description" slot="aria-describedby"></div>
      <slot name="container" slot="container"></slot>
    </${this.fieldTag}>`;
	}
	renderLeadingIcon() {
		return T`
      <span class="icon leading" slot="start">
        <slot name="leading-icon" @slotchange=${this.handleIconChange}></slot>
      </span>
    `;
	}
	renderTrailingIcon() {
		return T`
      <span class="icon trailing" slot="end">
        <slot name="trailing-icon" @slotchange=${this.handleIconChange}></slot>
      </span>
    `;
	}
	renderInputOrTextarea() {
		let e = { direction: this.textDirection }, t = this.ariaLabel || this.label || S, n = this.autocomplete, r = (this.maxLength ?? -1) > -1, i = (this.minLength ?? -1) > -1;
		if (this.type === "textarea") return T`
        <textarea
          class="input"
          style=${ie(e)}
          aria-describedby="description"
          aria-invalid=${this.hasError}
          aria-label=${t}
          autocomplete=${n || S}
          name=${this.name || S}
          ?disabled=${this.disabled}
          maxlength=${r ? this.maxLength : S}
          minlength=${i ? this.minLength : S}
          placeholder=${this.placeholder || S}
          ?readonly=${this.readOnly}
          ?required=${this.required}
          rows=${this.rows}
          cols=${this.cols}
          .value=${Ho(this.value)}
          @change=${this.redispatchEvent}
          @focus=${this.handleFocusChange}
          @blur=${this.handleFocusChange}
          @input=${this.handleInput}
          @select=${this.redispatchEvent}></textarea>
      `;
		let a = this.renderPrefix(), o = this.renderSuffix(), s = this.inputMode;
		return T`
      <div class="input-wrapper">
        ${a}
        <input
          class="input"
          style=${ie(e)}
          aria-describedby="description"
          aria-invalid=${this.hasError}
          aria-label=${t}
          autocomplete=${n || S}
          name=${this.name || S}
          ?disabled=${this.disabled}
          inputmode=${s || S}
          max=${this.max || S}
          maxlength=${r ? this.maxLength : S}
          min=${this.min || S}
          minlength=${i ? this.minLength : S}
          pattern=${this.pattern || S}
          placeholder=${this.placeholder || S}
          ?readonly=${this.readOnly}
          ?required=${this.required}
          ?multiple=${this.multiple}
          step=${this.step || S}
          type=${this.type}
          .value=${Ho(this.value)}
          @change=${this.redispatchEvent}
          @focus=${this.handleFocusChange}
          @blur=${this.handleFocusChange}
          @input=${this.handleInput}
          @select=${this.redispatchEvent} />
        ${o}
      </div>
    `;
	}
	renderPrefix() {
		return this.renderAffix(this.prefixText, !1);
	}
	renderSuffix() {
		return this.renderAffix(this.suffixText, !0);
	}
	renderAffix(e, t) {
		return e ? T`<span class="${O({
			suffix: t,
			prefix: !t
		})}">${e}</span>` : S;
	}
	getErrorText() {
		return this.error ? this.errorText : this.nativeErrorText;
	}
	handleFocusChange() {
		this.focused = this.inputOrTextarea?.matches(":focus") ?? !1;
	}
	handleInput(e) {
		this.dirty = !0, this.value = e.target.value;
	}
	redispatchEvent(e) {
		l(this, e);
	}
	getInputOrTextarea() {
		return this.inputOrTextarea || (this.connectedCallback(), this.scheduleUpdate()), this.isUpdatePending && this.scheduleUpdate(), this.inputOrTextarea;
	}
	getInput() {
		return this.type === "textarea" ? null : this.getInputOrTextarea();
	}
	handleIconChange() {
		this.hasLeadingIcon = this.leadingIcons.length > 0, this.hasTrailingIcon = this.trailingIcons.length > 0;
	}
	[et]() {
		return this.value;
	}
	formResetCallback() {
		this.reset();
	}
	formStateRestoreCallback(e) {
		this.value = e;
	}
	focus() {
		this.getInputOrTextarea().focus();
	}
	[Je]() {
		return new es(() => ({
			state: this,
			renderedControl: this.inputOrTextarea
		}));
	}
	[Ye]() {
		return this.inputOrTextarea;
	}
	[Wo](e) {
		e?.preventDefault();
		let t = this.getErrorText();
		this.nativeError = !!e, this.nativeErrorText = this.validationMessage, t === this.getErrorText() && this.field?.reannounceError();
	}
};
q.shadowRootOptions = {
	..._.shadowRootOptions,
	delegatesFocus: !0
}, d([w({
	type: Boolean,
	reflect: !0
})], q.prototype, "error", void 0), d([w({ attribute: "error-text" })], q.prototype, "errorText", void 0), d([w()], q.prototype, "label", void 0), d([w({
	type: Boolean,
	attribute: "no-asterisk"
})], q.prototype, "noAsterisk", void 0), d([w({
	type: Boolean,
	reflect: !0
})], q.prototype, "required", void 0), d([w()], q.prototype, "value", void 0), d([w({ attribute: "prefix-text" })], q.prototype, "prefixText", void 0), d([w({ attribute: "suffix-text" })], q.prototype, "suffixText", void 0), d([w({
	type: Boolean,
	attribute: "has-leading-icon"
})], q.prototype, "hasLeadingIcon", void 0), d([w({
	type: Boolean,
	attribute: "has-trailing-icon"
})], q.prototype, "hasTrailingIcon", void 0), d([w({ attribute: "supporting-text" })], q.prototype, "supportingText", void 0), d([w({ attribute: "text-direction" })], q.prototype, "textDirection", void 0), d([w({ type: Number })], q.prototype, "rows", void 0), d([w({ type: Number })], q.prototype, "cols", void 0), d([w({ reflect: !0 })], q.prototype, "inputMode", void 0), d([w()], q.prototype, "max", void 0), d([w({ type: Number })], q.prototype, "maxLength", void 0), d([w()], q.prototype, "min", void 0), d([w({ type: Number })], q.prototype, "minLength", void 0), d([w({
	type: Boolean,
	attribute: "no-spinner"
})], q.prototype, "noSpinner", void 0), d([w()], q.prototype, "pattern", void 0), d([w({
	reflect: !0,
	converter: Uo
})], q.prototype, "placeholder", void 0), d([w({
	type: Boolean,
	reflect: !0
})], q.prototype, "readOnly", void 0), d([w({
	type: Boolean,
	reflect: !0
})], q.prototype, "multiple", void 0), d([w()], q.prototype, "step", void 0), d([w({ reflect: !0 })], q.prototype, "type", void 0), d([w({ reflect: !0 })], q.prototype, "autocomplete", void 0), d([g()], q.prototype, "dirty", void 0), d([g()], q.prototype, "focused", void 0), d([g()], q.prototype, "nativeError", void 0), d([g()], q.prototype, "nativeErrorText", void 0), d([a(".input")], q.prototype, "inputOrTextarea", void 0), d([a(".field")], q.prototype, "field", void 0), d([c({ slot: "leading-icon" })], q.prototype, "leadingIcons", void 0), d([c({ slot: "trailing-icon" })], q.prototype, "trailingIcons", void 0);
// node_modules/esp-web-tools/node_modules/@material/web/textfield/internal/filled-text-field.js
var rs = class extends q {
	constructor() {
		super(...arguments), this.fieldTag = Be`md-filled-field`;
	}
}, is = y`:host{display:inline-flex;outline:none;resize:both;text-align:start;-webkit-tap-highlight-color:rgba(0,0,0,0)}.text-field,.field{width:100%}.text-field{display:inline-flex}.field{cursor:text}.disabled .field{cursor:default}.text-field,.textarea .field{resize:inherit}slot[name=container]{border-radius:inherit}.icon{color:currentColor;display:flex;align-items:center;justify-content:center;fill:currentColor;position:relative}.icon ::slotted(*){display:flex;position:absolute}[has-start] .icon.leading{font-size:var(--_leading-icon-size);height:var(--_leading-icon-size);width:var(--_leading-icon-size)}[has-end] .icon.trailing{font-size:var(--_trailing-icon-size);height:var(--_trailing-icon-size);width:var(--_trailing-icon-size)}.input-wrapper{display:flex}.input-wrapper>*{all:inherit;padding:0}.input{caret-color:var(--_caret-color);overflow-x:hidden;text-align:inherit}.input::placeholder{color:currentColor;opacity:1}.input::-webkit-calendar-picker-indicator{display:none}.input::-webkit-search-decoration,.input::-webkit-search-cancel-button{display:none}@media(forced-colors: active){.input{background:none}}.no-spinner .input::-webkit-inner-spin-button,.no-spinner .input::-webkit-outer-spin-button{display:none}.no-spinner .input[type=number]{-moz-appearance:textfield}:focus-within .input{caret-color:var(--_focus-caret-color)}.error:focus-within .input{caret-color:var(--_error-focus-caret-color)}.text-field:not(.disabled) .prefix{color:var(--_input-text-prefix-color)}.text-field:not(.disabled) .suffix{color:var(--_input-text-suffix-color)}.text-field:not(.disabled) .input::placeholder{color:var(--_input-text-placeholder-color)}.prefix,.suffix{text-wrap:nowrap;width:min-content}.prefix{padding-inline-end:var(--_input-text-prefix-trailing-space)}.suffix{padding-inline-start:var(--_input-text-suffix-leading-space)}
`, as = class extends rs {
	constructor() {
		super(...arguments), this.fieldTag = Be`md-filled-field`;
	}
};
as.styles = [is, Lo], customElements.define("ew-filled-text-field", as);
// node_modules/esp-web-tools/node_modules/@material/web/elevation/internal/elevation.js
var os = class extends _ {
	connectedCallback() {
		super.connectedCallback(), this.setAttribute("aria-hidden", "true");
	}
	render() {
		return T`<span class="shadow"></span>`;
	}
}, ss = y`:host,.shadow,.shadow::before,.shadow::after{border-radius:inherit;inset:0;position:absolute;transition-duration:inherit;transition-property:inherit;transition-timing-function:inherit}:host{display:flex;pointer-events:none;transition-property:box-shadow,opacity}.shadow::before,.shadow::after{content:"";transition-property:box-shadow,opacity;--_level: var(--md-elevation-level, 0);--_shadow-color: var(--md-elevation-shadow-color, var(--md-sys-color-shadow, #000))}.shadow::before{box-shadow:0px calc(1px*(clamp(0,var(--_level),1) + clamp(0,var(--_level) - 3,1) + 2*clamp(0,var(--_level) - 4,1))) calc(1px*(2*clamp(0,var(--_level),1) + clamp(0,var(--_level) - 2,1) + clamp(0,var(--_level) - 4,1))) 0px var(--_shadow-color);opacity:.3}.shadow::after{box-shadow:0px calc(1px*(clamp(0,var(--_level),1) + clamp(0,var(--_level) - 1,1) + 2*clamp(0,var(--_level) - 2,3))) calc(1px*(3*clamp(0,var(--_level),2) + 2*clamp(0,var(--_level) - 2,3))) calc(1px*(clamp(0,var(--_level),4) + 2*clamp(0,var(--_level) - 4,1))) var(--_shadow-color);opacity:.15}
`, cs = class extends os {};
cs.styles = [ss], cs = d([D("md-elevation")], cs);
// node_modules/esp-web-tools/node_modules/@material/web/menu/internal/controllers/shared.js
function ls(e, t) {
	return new CustomEvent("close-menu", {
		bubbles: !0,
		composed: !0,
		detail: {
			initiator: e,
			reason: t,
			itemPath: [e]
		}
	});
}
var us = ls, ds = {
	SPACE: "Space",
	ENTER: "Enter"
}, fs = {
	CLICK_SELECTION: "click-selection",
	KEYDOWN: "keydown"
}, ps = {
	ESCAPE: "Escape",
	SPACE: ds.SPACE,
	ENTER: ds.ENTER
};
function ms(e) {
	return Object.values(ps).some((t) => t === e);
}
function hs(e) {
	return Object.values(ds).some((t) => t === e);
}
function gs(e, t) {
	let n = new Event("md-contains", {
		bubbles: !0,
		composed: !0
	}), r = [], i = (e) => {
		r = e.composedPath();
	};
	return t.addEventListener("md-contains", i), e.dispatchEvent(n), t.removeEventListener("md-contains", i), r.length > 0;
}
var J = {
	NONE: "none",
	LIST_ROOT: "list-root",
	FIRST_ITEM: "first-item",
	LAST_ITEM: "last-item"
}, _s = {
	END_START: "end-start",
	END_END: "end-end",
	START_START: "start-start",
	START_END: "start-end"
}, vs = class {
	constructor(e, t) {
		this.host = e, this.getProperties = t, this.surfaceStylesInternal = { display: "none" }, this.lastValues = { isOpen: !1 }, this.host.addController(this);
	}
	get surfaceStyles() {
		return this.surfaceStylesInternal;
	}
	async position() {
		let { surfaceEl: e, anchorEl: t, anchorCorner: n, surfaceCorner: r, positioning: i, xOffset: a, yOffset: o, disableBlockFlip: s, disableInlineFlip: c, repositionStrategy: l } = this.getProperties(), u = n.toLowerCase().trim(), d = r.toLowerCase().trim();
		if (!e || !t) return;
		let f = window.innerWidth, p = window.innerHeight, m = document.createElement("div");
		m.style.opacity = "0", m.style.position = "fixed", m.style.display = "block", m.style.inset = "0", document.body.appendChild(m);
		let h = m.getBoundingClientRect();
		m.remove();
		let g = window.innerHeight - h.bottom, _ = window.innerWidth - h.right;
		this.surfaceStylesInternal = {
			display: "block",
			opacity: "0"
		}, this.host.requestUpdate(), await this.host.updateComplete, e.popover && e.isConnected && e.showPopover();
		let v = e.getSurfacePositionClientRect ? e.getSurfacePositionClientRect() : e.getBoundingClientRect(), y = t.getSurfacePositionClientRect ? t.getSurfacePositionClientRect() : t.getBoundingClientRect(), [b, x] = d.split("-"), [S, C] = u.split("-"), w = getComputedStyle(e).direction === "ltr", { blockInset: T, blockOutOfBoundsCorrection: E, surfaceBlockProperty: D } = this.calculateBlock({
			surfaceRect: v,
			anchorRect: y,
			anchorBlock: S,
			surfaceBlock: b,
			yOffset: o,
			positioning: i,
			windowInnerHeight: p,
			blockScrollbarHeight: g
		});
		if (E && !s) {
			let e = b === "start" ? "end" : "start", t = S === "start" ? "end" : "start", n = this.calculateBlock({
				surfaceRect: v,
				anchorRect: y,
				anchorBlock: t,
				surfaceBlock: e,
				yOffset: o,
				positioning: i,
				windowInnerHeight: p,
				blockScrollbarHeight: g
			});
			E > n.blockOutOfBoundsCorrection && (T = n.blockInset, E = n.blockOutOfBoundsCorrection, D = n.surfaceBlockProperty);
		}
		let { inlineInset: O, inlineOutOfBoundsCorrection: ee, surfaceInlineProperty: te } = this.calculateInline({
			surfaceRect: v,
			anchorRect: y,
			anchorInline: C,
			surfaceInline: x,
			xOffset: a,
			positioning: i,
			isLTR: w,
			windowInnerWidth: f,
			inlineScrollbarWidth: _
		});
		if (ee && !c) {
			let e = x === "start" ? "end" : "start", t = C === "start" ? "end" : "start", n = this.calculateInline({
				surfaceRect: v,
				anchorRect: y,
				anchorInline: t,
				surfaceInline: e,
				xOffset: a,
				positioning: i,
				isLTR: w,
				windowInnerWidth: f,
				inlineScrollbarWidth: _
			});
			Math.abs(ee) > Math.abs(n.inlineOutOfBoundsCorrection) && (O = n.inlineInset, ee = n.inlineOutOfBoundsCorrection, te = n.surfaceInlineProperty);
		}
		l === "move" && (T -= E, O -= ee), this.surfaceStylesInternal = {
			display: "block",
			opacity: "1",
			[D]: `${T}px`,
			[te]: `${O}px`
		}, l === "resize" && (E && (this.surfaceStylesInternal.height = `${v.height - E}px`), ee && (this.surfaceStylesInternal.width = `${v.width - ee}px`)), this.host.requestUpdate();
	}
	calculateBlock(e) {
		let { surfaceRect: t, anchorRect: n, anchorBlock: r, surfaceBlock: i, yOffset: a, positioning: o, windowInnerHeight: s, blockScrollbarHeight: c } = e, l = +(o === "fixed" || o === "document"), u = +(o === "document"), d = +(i === "start"), f = +(i === "end"), p = (r === i ? 0 : 1) * n.height + a, m = d * n.top + f * (s - n.bottom - c), h = d * window.scrollY - f * window.scrollY, g = Math.abs(Math.min(0, s - m - p - t.height));
		return {
			blockInset: l * m + u * h + p,
			blockOutOfBoundsCorrection: g,
			surfaceBlockProperty: i === "start" ? "inset-block-start" : "inset-block-end"
		};
	}
	calculateInline(e) {
		let { isLTR: t, surfaceInline: n, anchorInline: r, anchorRect: i, surfaceRect: a, xOffset: o, positioning: s, windowInnerWidth: c, inlineScrollbarWidth: l } = e, u = +(s === "fixed" || s === "document"), d = +(s === "document"), f = +!!t, p = +!t, m = +(n === "start"), h = +(n === "end"), g = (r === n ? 0 : 1) * i.width + o, _ = m * i.left + h * (c - i.right - l), v = m * (c - i.right - l) + h * i.left, y = f * _ + p * v, b = m * window.scrollX - h * window.scrollX, x = h * window.scrollX - m * window.scrollX, S = f * b + p * x, C = Math.abs(Math.min(0, c - y - g - a.width)), w = u * y + g + d * S, T = n === "start" ? "inset-inline-start" : "inset-inline-end";
		return (s === "document" || s === "fixed") && (T = n === "start" && t || n === "end" && !t ? "left" : "right"), {
			inlineInset: w,
			inlineOutOfBoundsCorrection: C,
			surfaceInlineProperty: T
		};
	}
	hostUpdate() {
		this.onUpdate();
	}
	hostUpdated() {
		this.onUpdate();
	}
	async onUpdate() {
		let e = this.getProperties(), t = !1;
		for (let [n, r] of Object.entries(e)) if (t ||= r !== this.lastValues[n], t) break;
		let n = this.lastValues.isOpen !== e.isOpen, r = !!e.anchorEl, i = !!e.surfaceEl;
		t && r && i && (this.lastValues.isOpen = e.isOpen, e.isOpen ? (this.lastValues = e, await this.position(), e.onOpen()) : n && (await e.beforeClose(), this.close(), e.onClose()));
	}
	close() {
		this.surfaceStylesInternal = { display: "none" }, this.host.requestUpdate();
		let e = this.getProperties().surfaceEl;
		e?.popover && e?.isConnected && e.hidePopover();
	}
}, Y = {
	INDEX: 0,
	ITEM: 1,
	TEXT: 2
}, ys = class {
	constructor(e) {
		this.getProperties = e, this.typeaheadRecords = [], this.typaheadBuffer = "", this.cancelTypeaheadTimeout = 0, this.isTypingAhead = !1, this.lastActiveRecord = null, this.onKeydown = (e) => {
			this.isTypingAhead ? this.typeahead(e) : this.beginTypeahead(e);
		}, this.endTypeahead = () => {
			this.isTypingAhead = !1, this.typaheadBuffer = "", this.typeaheadRecords = [];
		};
	}
	get items() {
		return this.getProperties().getItems();
	}
	get active() {
		return this.getProperties().active;
	}
	beginTypeahead(e) {
		this.active && (e.code === "Space" || e.code === "Enter" || e.code.startsWith("Arrow") || e.code === "Escape" || (this.isTypingAhead = !0, this.typeaheadRecords = this.items.map((e, t) => [
			t,
			e,
			e.typeaheadText.trim().toLowerCase()
		]), this.lastActiveRecord = this.typeaheadRecords.find((e) => e[Y.ITEM].tabIndex === 0) ?? null, this.lastActiveRecord && (this.lastActiveRecord[Y.ITEM].tabIndex = -1), this.typeahead(e)));
	}
	typeahead(e) {
		if (e.defaultPrevented) return;
		if (clearTimeout(this.cancelTypeaheadTimeout), e.code === "Enter" || e.code.startsWith("Arrow") || e.code === "Escape") {
			this.endTypeahead(), this.lastActiveRecord && (this.lastActiveRecord[Y.ITEM].tabIndex = -1);
			return;
		}
		e.code === "Space" && e.preventDefault(), this.cancelTypeaheadTimeout = setTimeout(this.endTypeahead, this.getProperties().typeaheadBufferTime), this.typaheadBuffer += e.key.toLowerCase();
		let t = this.lastActiveRecord ? this.lastActiveRecord[Y.INDEX] : -1, n = this.typeaheadRecords.length, r = (e) => (e[Y.INDEX] + n - t) % n, i = this.typeaheadRecords.filter((e) => !e[Y.ITEM].disabled && e[Y.TEXT].startsWith(this.typaheadBuffer)).sort((e, t) => r(e) - r(t));
		if (i.length === 0) {
			clearTimeout(this.cancelTypeaheadTimeout), this.lastActiveRecord && (this.lastActiveRecord[Y.ITEM].tabIndex = -1), this.endTypeahead();
			return;
		}
		let a = this.typaheadBuffer.length === 1, o;
		o = this.lastActiveRecord === i[0] && a ? i[1] ?? i[0] : i[0], this.lastActiveRecord && (this.lastActiveRecord[Y.ITEM].tabIndex = -1), this.lastActiveRecord = o, o[Y.ITEM].tabIndex = 0, o[Y.ITEM].focus();
	}
}, bs = /* @__PURE__ */ new Set([
	k.ArrowDown,
	k.ArrowUp,
	k.Home,
	k.End
]), xs = /* @__PURE__ */ new Set([
	k.ArrowLeft,
	k.ArrowRight,
	...bs
]);
function Ss(e = document) {
	let t = e.activeElement;
	for (; t && t?.shadowRoot?.activeElement;) t = t.shadowRoot.activeElement;
	return t;
}
var X = class extends _ {
	get openDirection() {
		return this.menuCorner.split("-")[0] === "start" ? "DOWN" : "UP";
	}
	get anchorElement() {
		return this.anchor ? this.getRootNode().querySelector(`#${this.anchor}`) : this.currentAnchorElement;
	}
	set anchorElement(e) {
		this.currentAnchorElement = e, this.requestUpdate("anchorElement");
	}
	constructor() {
		super(), this.anchor = "", this.positioning = "absolute", this.quick = !1, this.hasOverflow = !1, this.open = !1, this.xOffset = 0, this.yOffset = 0, this.noHorizontalFlip = !1, this.noVerticalFlip = !1, this.typeaheadDelay = 200, this.anchorCorner = _s.END_START, this.menuCorner = _s.START_START, this.stayOpenOnOutsideClick = !1, this.stayOpenOnFocusout = !1, this.skipRestoreFocus = !1, this.defaultFocus = J.FIRST_ITEM, this.noNavigationWrap = !1, this.typeaheadActive = !0, this.isSubmenu = !1, this.pointerPath = [], this.isRepositioning = !1, this.openCloseAnimationSignal = r(), this.listController = new ke({
			isItem: (e) => e.hasAttribute("md-menu-item"),
			getPossibleItems: () => this.slotItems,
			isRtl: () => getComputedStyle(this).direction === "rtl",
			deactivateItem: (e) => {
				e.selected = !1, e.tabIndex = -1;
			},
			activateItem: (e) => {
				e.selected = !0, e.tabIndex = 0;
			},
			isNavigableKey: (e) => this.isSubmenu ? e === (getComputedStyle(this).direction === "rtl" ? k.ArrowLeft : k.ArrowRight) || bs.has(e) : xs.has(e),
			wrapNavigation: () => !this.noNavigationWrap
		}), this.lastFocusedElement = null, this.typeaheadController = new ys(() => ({
			getItems: () => this.items,
			typeaheadBufferTime: this.typeaheadDelay,
			active: this.typeaheadActive
		})), this.currentAnchorElement = null, this.internals = this.attachInternals(), this.menuPositionController = new vs(this, () => ({
			anchorCorner: this.anchorCorner,
			surfaceCorner: this.menuCorner,
			surfaceEl: this.surfaceEl,
			anchorEl: this.anchorElement,
			positioning: this.positioning === "popover" ? "document" : this.positioning,
			isOpen: this.open,
			xOffset: this.xOffset,
			yOffset: this.yOffset,
			disableBlockFlip: this.noVerticalFlip,
			disableInlineFlip: this.noHorizontalFlip,
			onOpen: this.onOpened,
			beforeClose: this.beforeClose,
			onClose: this.onClosed,
			repositionStrategy: this.hasOverflow && this.positioning !== "popover" ? "move" : "resize"
		})), this.onWindowResize = () => {
			this.isRepositioning || this.positioning !== "document" && this.positioning !== "fixed" && this.positioning !== "popover" || (this.isRepositioning = !0, this.reposition(), this.isRepositioning = !1);
		}, this.handleFocusout = async (e) => {
			let t = this.anchorElement;
			if (this.stayOpenOnFocusout || !this.open || this.pointerPath.includes(t)) return;
			if (e.relatedTarget) {
				if (gs(e.relatedTarget, this) || this.pointerPath.length !== 0 && gs(e.relatedTarget, t)) return;
			} else if (this.pointerPath.includes(this)) return;
			let n = this.skipRestoreFocus;
			this.skipRestoreFocus = !0, this.close(), await this.updateComplete, this.skipRestoreFocus = n;
		}, this.onOpened = async () => {
			this.lastFocusedElement = Ss();
			let e = this.items, t = be(e);
			t && this.defaultFocus !== J.NONE && (t.item.tabIndex = -1);
			let n = !this.quick;
			switch (this.quick ? this.dispatchEvent(new Event("opening")) : n = !!await this.animateOpen(), this.defaultFocus) {
				case J.FIRST_ITEM:
					let t = xe(e);
					t && (t.tabIndex = 0, t.focus(), await t.updateComplete);
					break;
				case J.LAST_ITEM:
					let n = Se(e);
					n && (n.tabIndex = 0, n.focus(), await n.updateComplete);
					break;
				case J.LIST_ROOT:
					this.focus();
					break;
				default:
				case J.NONE:
			}
			n || this.dispatchEvent(new Event("opened"));
		}, this.beforeClose = async () => {
			this.open = !1, this.skipRestoreFocus || this.lastFocusedElement?.focus?.(), this.quick || await this.animateClose();
		}, this.onClosed = () => {
			this.quick && (this.dispatchEvent(new Event("closing")), this.dispatchEvent(new Event("closed")));
		}, this.onWindowPointerdown = (e) => {
			this.pointerPath = e.composedPath();
		}, this.onDocumentClick = (e) => {
			if (!this.open) return;
			let t = e.composedPath();
			this.stayOpenOnOutsideClick || t.includes(this) || t.includes(this.anchorElement) || (this.open = !1);
		}, this.internals.role = "menu", this.addEventListener("keydown", this.handleKeydown), this.addEventListener("keydown", this.captureKeydown, { capture: !0 }), this.addEventListener("focusout", this.handleFocusout);
	}
	get items() {
		return this.listController.items;
	}
	willUpdate(e) {
		e.has("open") && (this.open ? this.removeAttribute("aria-hidden") : this.setAttribute("aria-hidden", "true"));
	}
	update(e) {
		e.has("open") && (this.open ? this.setUpGlobalEventListeners() : this.cleanUpGlobalEventListeners()), e.has("positioning") && this.positioning === "popover" && !this.showPopover && (this.positioning = "fixed"), super.update(e);
	}
	connectedCallback() {
		super.connectedCallback(), this.open && this.setUpGlobalEventListeners();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.cleanUpGlobalEventListeners();
	}
	getBoundingClientRect() {
		return this.surfaceEl ? this.surfaceEl.getBoundingClientRect() : super.getBoundingClientRect();
	}
	getClientRects() {
		return this.surfaceEl ? this.surfaceEl.getClientRects() : super.getClientRects();
	}
	render() {
		return this.renderSurface();
	}
	renderSurface() {
		return T`
      <div
        class="menu ${O(this.getSurfaceClasses())}"
        style=${ie(this.menuPositionController.surfaceStyles)}
        popover=${this.positioning === "popover" ? "manual" : S}>
        ${this.renderElevation()}
        <div class="items">
          <div class="item-padding"> ${this.renderMenuItems()} </div>
        </div>
      </div>
    `;
	}
	renderMenuItems() {
		return T`<slot
      @close-menu=${this.onCloseMenu}
      @deactivate-items=${this.onDeactivateItems}
      @request-activation=${this.onRequestActivation}
      @deactivate-typeahead=${this.handleDeactivateTypeahead}
      @activate-typeahead=${this.handleActivateTypeahead}
      @stay-open-on-focusout=${this.handleStayOpenOnFocusout}
      @close-on-focusout=${this.handleCloseOnFocusout}
      @slotchange=${this.listController.onSlotchange}></slot>`;
	}
	renderElevation() {
		return T`<md-elevation part="elevation"></md-elevation>`;
	}
	getSurfaceClasses() {
		return {
			open: this.open,
			fixed: this.positioning === "fixed",
			"has-overflow": this.hasOverflow
		};
	}
	captureKeydown(e) {
		e.target === this && !e.defaultPrevented && ms(e.code) && (e.preventDefault(), this.close()), this.typeaheadController.onKeydown(e);
	}
	async animateOpen() {
		let e = this.surfaceEl, t = this.slotEl;
		if (!e || !t) return !0;
		let r = this.openDirection;
		this.dispatchEvent(new Event("opening")), e.classList.toggle("animating", !0);
		let i = this.openCloseAnimationSignal.start(), a = e.offsetHeight, o = r === "UP", s = this.items, c = 250 / s.length, l = e.animate([{ height: "0px" }, { height: `${a}px` }], {
			duration: 500,
			easing: n.EMPHASIZED
		}), u = t.animate([{ transform: o ? `translateY(-${a}px)` : "" }, { transform: "" }], {
			duration: 500,
			easing: n.EMPHASIZED
		}), d = e.animate([{ opacity: 0 }, { opacity: 1 }], 50), f = [];
		for (let e = 0; e < s.length; e++) {
			let t = s[o ? s.length - 1 - e : e], n = t.animate([{ opacity: 0 }, { opacity: 1 }], {
				duration: 250,
				delay: c * e
			});
			t.classList.toggle("md-menu-hidden", !0), n.addEventListener("finish", () => {
				t.classList.toggle("md-menu-hidden", !1);
			}), f.push([t, n]);
		}
		let p = (e) => {}, m = new Promise((e) => {
			p = e;
		});
		return i.addEventListener("abort", () => {
			l.cancel(), u.cancel(), d.cancel(), f.forEach(([e, t]) => {
				e.classList.toggle("md-menu-hidden", !1), t.cancel();
			}), p(!0);
		}), l.addEventListener("finish", () => {
			e.classList.toggle("animating", !1), this.openCloseAnimationSignal.finish(), p(!1);
		}), await m;
	}
	animateClose() {
		let e, t = new Promise((t) => {
			e = t;
		}), r = this.surfaceEl, i = this.slotEl;
		if (!r || !i) return e(!1), t;
		let a = this.openDirection === "UP";
		this.dispatchEvent(new Event("closing")), r.classList.toggle("animating", !0);
		let o = this.openCloseAnimationSignal.start(), s = r.offsetHeight, c = this.items, l = 50 / c.length, u = r.animate([{ height: `${s}px` }, { height: `${s * .35}px` }], {
			duration: 150,
			easing: n.EMPHASIZED_ACCELERATE
		}), d = i.animate([{ transform: "" }, { transform: a ? `translateY(-${s * .65}px)` : "" }], {
			duration: 150,
			easing: n.EMPHASIZED_ACCELERATE
		}), f = r.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: 50,
			delay: 100
		}), p = [];
		for (let e = 0; e < c.length; e++) {
			let t = c[a ? e : c.length - 1 - e], n = t.animate([{ opacity: 1 }, { opacity: 0 }], {
				duration: 50,
				delay: 50 + l * e
			});
			n.addEventListener("finish", () => {
				t.classList.toggle("md-menu-hidden", !0);
			}), p.push([t, n]);
		}
		return o.addEventListener("abort", () => {
			u.cancel(), d.cancel(), f.cancel(), p.forEach(([e, t]) => {
				t.cancel(), e.classList.toggle("md-menu-hidden", !1);
			}), e(!1);
		}), u.addEventListener("finish", () => {
			r.classList.toggle("animating", !1), p.forEach(([e]) => {
				e.classList.toggle("md-menu-hidden", !1);
			}), this.openCloseAnimationSignal.finish(), this.dispatchEvent(new Event("closed")), e(!0);
		}), t;
	}
	handleKeydown(e) {
		this.pointerPath = [], this.listController.handleKeydown(e);
	}
	setUpGlobalEventListeners() {
		document.addEventListener("click", this.onDocumentClick, { capture: !0 }), window.addEventListener("pointerdown", this.onWindowPointerdown), document.addEventListener("resize", this.onWindowResize, { passive: !0 }), window.addEventListener("resize", this.onWindowResize, { passive: !0 });
	}
	cleanUpGlobalEventListeners() {
		document.removeEventListener("click", this.onDocumentClick, { capture: !0 }), window.removeEventListener("pointerdown", this.onWindowPointerdown), document.removeEventListener("resize", this.onWindowResize), window.removeEventListener("resize", this.onWindowResize);
	}
	onCloseMenu() {
		this.close();
	}
	onDeactivateItems(e) {
		e.stopPropagation(), this.listController.onDeactivateItems();
	}
	onRequestActivation(e) {
		e.stopPropagation(), this.listController.onRequestActivation(e);
	}
	handleDeactivateTypeahead(e) {
		e.stopPropagation(), this.typeaheadActive = !1;
	}
	handleActivateTypeahead(e) {
		e.stopPropagation(), this.typeaheadActive = !0;
	}
	handleStayOpenOnFocusout(e) {
		e.stopPropagation(), this.stayOpenOnFocusout = !0;
	}
	handleCloseOnFocusout(e) {
		e.stopPropagation(), this.stayOpenOnFocusout = !1;
	}
	close() {
		this.open = !1, this.slotItems.forEach((e) => {
			e.close?.();
		});
	}
	show() {
		this.open = !0;
	}
	activateNextItem() {
		return this.listController.activateNextItem() ?? null;
	}
	activatePreviousItem() {
		return this.listController.activatePreviousItem() ?? null;
	}
	reposition() {
		this.open && this.menuPositionController.position();
	}
};
d([a(".menu")], X.prototype, "surfaceEl", void 0), d([a("slot")], X.prototype, "slotEl", void 0), d([w()], X.prototype, "anchor", void 0), d([w()], X.prototype, "positioning", void 0), d([w({ type: Boolean })], X.prototype, "quick", void 0), d([w({
	type: Boolean,
	attribute: "has-overflow"
})], X.prototype, "hasOverflow", void 0), d([w({
	type: Boolean,
	reflect: !0
})], X.prototype, "open", void 0), d([w({
	type: Number,
	attribute: "x-offset"
})], X.prototype, "xOffset", void 0), d([w({
	type: Number,
	attribute: "y-offset"
})], X.prototype, "yOffset", void 0), d([w({
	type: Boolean,
	attribute: "no-horizontal-flip"
})], X.prototype, "noHorizontalFlip", void 0), d([w({
	type: Boolean,
	attribute: "no-vertical-flip"
})], X.prototype, "noVerticalFlip", void 0), d([w({
	type: Number,
	attribute: "typeahead-delay"
})], X.prototype, "typeaheadDelay", void 0), d([w({ attribute: "anchor-corner" })], X.prototype, "anchorCorner", void 0), d([w({ attribute: "menu-corner" })], X.prototype, "menuCorner", void 0), d([w({
	type: Boolean,
	attribute: "stay-open-on-outside-click"
})], X.prototype, "stayOpenOnOutsideClick", void 0), d([w({
	type: Boolean,
	attribute: "stay-open-on-focusout"
})], X.prototype, "stayOpenOnFocusout", void 0), d([w({
	type: Boolean,
	attribute: "skip-restore-focus"
})], X.prototype, "skipRestoreFocus", void 0), d([w({ attribute: "default-focus" })], X.prototype, "defaultFocus", void 0), d([w({
	type: Boolean,
	attribute: "no-navigation-wrap"
})], X.prototype, "noNavigationWrap", void 0), d([c({ flatten: !0 })], X.prototype, "slotItems", void 0), d([g()], X.prototype, "typeaheadActive", void 0);
// node_modules/esp-web-tools/node_modules/@material/web/menu/internal/menu-styles.js
var Cs = y`:host{--md-elevation-level: var(--md-menu-container-elevation, 2);--md-elevation-shadow-color: var(--md-menu-container-shadow-color, var(--md-sys-color-shadow, #000));min-width:112px;color:unset;display:contents}md-focus-ring{--md-focus-ring-shape: var(--md-menu-container-shape, var(--md-sys-shape-corner-extra-small, 4px))}.menu{border-radius:var(--md-menu-container-shape, var(--md-sys-shape-corner-extra-small, 4px));display:none;inset:auto;border:none;padding:0px;overflow:visible;background-color:rgba(0,0,0,0);color:inherit;opacity:0;z-index:20;position:absolute;user-select:none;max-height:inherit;height:inherit;min-width:inherit;max-width:inherit;scrollbar-width:inherit}.menu::backdrop{display:none}.fixed{position:fixed}.items{display:block;list-style-type:none;margin:0;outline:none;box-sizing:border-box;background-color:var(--md-menu-container-color, var(--md-sys-color-surface-container, #f3edf7));height:inherit;max-height:inherit;overflow:auto;min-width:inherit;max-width:inherit;border-radius:inherit;scrollbar-width:inherit}.item-padding{padding-block:var(--md-menu-top-space, 8px) var(--md-menu-bottom-space, 8px)}.has-overflow:not([popover]) .items{overflow:visible}.has-overflow.animating .items,.animating .items{overflow:hidden}.has-overflow.animating .items{pointer-events:none}.animating ::slotted(.md-menu-hidden){opacity:0}slot{display:block;height:inherit;max-height:inherit}::slotted(:is(md-divider,[role=separator])){margin:8px 0}@media(forced-colors: active){.menu{border-style:solid;border-color:CanvasText;border-width:1px}}
`, ws = class extends X {};
ws.styles = [Cs], ws = d([D("md-menu")], ws);
// node_modules/esp-web-tools/node_modules/@material/web/labs/behaviors/validators/select-validator.js
var Ts = class extends rt {
	computeValidity(e) {
		return this.selectControl ||= document.createElement("select"), ee(T`<option value=${e.value}></option>`, this.selectControl), this.selectControl.value = e.value, this.selectControl.required = e.required, {
			validity: this.selectControl.validity,
			validationMessage: this.selectControl.validationMessage
		};
	}
	equals(e, t) {
		return e.value === t.value && e.required === t.required;
	}
	copy({ value: e, required: t }) {
		return {
			value: e,
			required: t
		};
	}
};
// node_modules/esp-web-tools/node_modules/@material/web/select/internal/shared.js
function Es(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		r.selected && t.push([r, n]);
	}
	return t;
}
// node_modules/esp-web-tools/node_modules/@material/web/select/internal/select.js
var Ds, Os = Symbol("value"), ks = h(Yo($e(nt(s(_))))), Z = class extends ks {
	get value() {
		return this[Os];
	}
	set value(e) {
		this.lastUserSetValue = e, this.select(e);
	}
	get options() {
		return this.menu?.items ?? [];
	}
	get selectedIndex() {
		let [e, t] = (this.getSelectedOptions() ?? [])[0] ?? [];
		return t ?? -1;
	}
	set selectedIndex(e) {
		this.lastUserSetSelectedIndex = e, this.selectIndex(e);
	}
	get selectedOptions() {
		return (this.getSelectedOptions() ?? []).map(([e]) => e);
	}
	get hasError() {
		return this.error || this.nativeError;
	}
	constructor() {
		super(), this.quick = !1, this.required = !1, this.errorText = "", this.label = "", this.noAsterisk = !1, this.supportingText = "", this.error = !1, this.menuPositioning = "popover", this.clampMenuWidth = !1, this.typeaheadDelay = 200, this.hasLeadingIcon = !1, this.displayText = "", this.menuAlign = "start", this[Ds] = "", this.lastUserSetValue = null, this.lastUserSetSelectedIndex = null, this.lastSelectedOption = null, this.lastSelectedOptionRecords = [], this.nativeError = !1, this.nativeErrorText = "", this.focused = !1, this.open = !1, this.defaultFocus = J.NONE, this.prevOpen = this.open, this.selectWidth = 0, this.addEventListener("focus", this.handleFocus.bind(this)), this.addEventListener("blur", this.handleBlur.bind(this));
	}
	select(e) {
		let t = this.options.find((t) => t.value === e);
		t && this.selectItem(t);
	}
	selectIndex(e) {
		let t = this.options[e];
		t && this.selectItem(t);
	}
	reset() {
		for (let e of this.options) e.selected = e.hasAttribute("selected");
		this.updateValueAndDisplayText(), this.nativeError = !1, this.nativeErrorText = "";
	}
	showPicker() {
		this.open = !0;
	}
	[(Ds = Os, Wo)](e) {
		e?.preventDefault();
		let t = this.getErrorText();
		this.nativeError = !!e, this.nativeErrorText = this.validationMessage, t === this.getErrorText() && this.field?.reannounceError();
	}
	update(e) {
		if (this.hasUpdated || this.initUserSelection(), this.prevOpen !== this.open && this.open) {
			let e = this.getBoundingClientRect();
			this.selectWidth = e.width;
		}
		this.prevOpen = this.open, super.update(e);
	}
	render() {
		return T`
      <span
        class="select ${O(this.getRenderClasses())}"
        @focusout=${this.handleFocusout}>
        ${this.renderField()} ${this.renderMenu()}
      </span>
    `;
	}
	async firstUpdated(e) {
		await this.menu?.updateComplete, this.lastSelectedOptionRecords.length || this.initUserSelection(), !this.lastSelectedOptionRecords.length && !this.options.length && setTimeout(() => {
			this.updateValueAndDisplayText();
		}), super.firstUpdated(e);
	}
	getRenderClasses() {
		return {
			disabled: this.disabled,
			error: this.error,
			open: this.open
		};
	}
	renderField() {
		let e = this.ariaLabel || this.label;
		return He`
      <${this.fieldTag}
          aria-haspopup="listbox"
          role="combobox"
          part="field"
          id="field"
          tabindex=${this.disabled ? "-1" : "0"}
          aria-label=${e || S}
          aria-describedby="description"
          aria-expanded=${this.open ? "true" : "false"}
          aria-controls="listbox"
          class="field"
          label=${this.label}
          ?no-asterisk=${this.noAsterisk}
          .focused=${this.focused || this.open}
          .populated=${!!this.displayText}
          .disabled=${this.disabled}
          .required=${this.required}
          .error=${this.hasError}
          ?has-start=${this.hasLeadingIcon}
          has-end
          supporting-text=${this.supportingText}
          error-text=${this.getErrorText()}
          @keydown=${this.handleKeydown}
          @click=${this.handleClick}>
         ${this.renderFieldContent()}
         <div id="description" slot="aria-describedby"></div>
      </${this.fieldTag}>`;
	}
	renderFieldContent() {
		return [
			this.renderLeadingIcon(),
			this.renderLabel(),
			this.renderTrailingIcon()
		];
	}
	renderLeadingIcon() {
		return T`
      <span class="icon leading" slot="start">
        <slot name="leading-icon" @slotchange=${this.handleIconChange}></slot>
      </span>
    `;
	}
	renderTrailingIcon() {
		return T`
      <span class="icon trailing" slot="end">
        <slot name="trailing-icon" @slotchange=${this.handleIconChange}>
          <svg height="5" viewBox="7 10 10 5" focusable="false">
            <polygon
              class="down"
              stroke="none"
              fill-rule="evenodd"
              points="7 10 12 15 17 10"></polygon>
            <polygon
              class="up"
              stroke="none"
              fill-rule="evenodd"
              points="7 15 12 10 17 15"></polygon>
          </svg>
        </slot>
      </span>
    `;
	}
	renderLabel() {
		return T`<div id="label">${this.displayText || T`&nbsp;`}</div>`;
	}
	renderMenu() {
		let e = this.label || this.ariaLabel;
		return T`<div class="menu-wrapper">
      <md-menu
        id="listbox"
        .defaultFocus=${this.defaultFocus}
        role="listbox"
        tabindex="-1"
        aria-label=${e || S}
        stay-open-on-focusout
        part="menu"
        exportparts="focus-ring: menu-focus-ring"
        anchor="field"
        style=${ie({
			"--__menu-min-width": `${this.selectWidth}px`,
			"--__menu-max-width": this.clampMenuWidth ? `${this.selectWidth}px` : void 0
		})}
        no-navigation-wrap
        .open=${this.open}
        .quick=${this.quick}
        .positioning=${this.menuPositioning}
        .typeaheadDelay=${this.typeaheadDelay}
        .anchorCorner=${this.menuAlign === "start" ? "end-start" : "end-end"}
        .menuCorner=${this.menuAlign === "start" ? "start-start" : "start-end"}
        @opening=${this.handleOpening}
        @opened=${this.redispatchEvent}
        @closing=${this.redispatchEvent}
        @closed=${this.handleClosed}
        @close-menu=${this.handleCloseMenu}
        @request-selection=${this.handleRequestSelection}
        @request-deselection=${this.handleRequestDeselection}>
        ${this.renderMenuContent()}
      </md-menu>
    </div>`;
	}
	renderMenuContent() {
		return T`<slot></slot>`;
	}
	handleKeydown(e) {
		if (this.open || this.disabled || !this.menu) return;
		let t = this.menu.typeaheadController, n = e.code === "Space" || e.code === "ArrowDown" || e.code === "ArrowUp" || e.code === "End" || e.code === "Home" || e.code === "Enter";
		if (!t.isTypingAhead && n) switch (e.preventDefault(), this.open = !0, e.code) {
			case "Space":
			case "ArrowDown":
			case "Enter":
				this.defaultFocus = J.NONE;
				break;
			case "End":
				this.defaultFocus = J.LAST_ITEM;
				break;
			case "ArrowUp":
			case "Home": this.defaultFocus = J.FIRST_ITEM;
		}
		else if (e.key.length === 1) {
			t.onKeydown(e), e.preventDefault();
			let { lastActiveRecord: n } = t;
			if (!n) return;
			this.labelEl?.setAttribute?.("aria-live", "polite"), this.selectItem(n[Y.ITEM]) && this.dispatchInteractionEvents();
		}
	}
	handleClick() {
		this.open = !this.open;
	}
	handleFocus() {
		this.focused = !0;
	}
	handleBlur() {
		this.focused = !1;
	}
	handleFocusout(e) {
		e.relatedTarget && gs(e.relatedTarget, this) || (this.open = !1);
	}
	getSelectedOptions() {
		if (!this.menu) return this.lastSelectedOptionRecords = [], null;
		let e = this.menu.items;
		return this.lastSelectedOptionRecords = Es(e), this.lastSelectedOptionRecords;
	}
	async getUpdateComplete() {
		return await this.menu?.updateComplete, super.getUpdateComplete();
	}
	updateValueAndDisplayText() {
		let e = this.getSelectedOptions() ?? [], t = !1;
		if (e.length) {
			let [n] = e[0];
			t = this.lastSelectedOption !== n, this.lastSelectedOption = n, this[Os] = n.value, this.displayText = n.displayText;
		} else t = this.lastSelectedOption !== null, this.lastSelectedOption = null, this[Os] = "", this.displayText = "";
		return t;
	}
	async handleOpening(e) {
		if (this.labelEl?.removeAttribute?.("aria-live"), this.redispatchEvent(e), this.defaultFocus !== J.NONE) return;
		let t = this.menu.items, n = be(t)?.item, [r] = this.lastSelectedOptionRecords[0] ?? [null];
		n && n !== r && (n.tabIndex = -1), r ??= t[0], r && (r.tabIndex = 0, r.focus());
	}
	redispatchEvent(e) {
		l(this, e);
	}
	handleClosed(e) {
		this.open = !1, this.redispatchEvent(e);
	}
	handleCloseMenu(e) {
		let t = e.detail.reason, n = e.detail.itemPath[0];
		this.open = !1;
		let r = !1;
		t.kind === "click-selection" || t.kind === "keydown" && hs(t.key) ? r = this.selectItem(n) : (n.tabIndex = -1, n.blur()), r && this.dispatchInteractionEvents();
	}
	selectItem(e) {
		return (this.getSelectedOptions() ?? []).forEach(([t]) => {
			e !== t && (t.selected = !1);
		}), e.selected = !0, this.updateValueAndDisplayText();
	}
	handleRequestSelection(e) {
		let t = e.target;
		this.lastSelectedOptionRecords.some(([e]) => e === t) || this.selectItem(t);
	}
	handleRequestDeselection(e) {
		let t = e.target;
		this.lastSelectedOptionRecords.some(([e]) => e === t) && this.updateValueAndDisplayText();
	}
	initUserSelection() {
		this.lastUserSetValue && !this.lastSelectedOptionRecords.length ? this.select(this.lastUserSetValue) : this.lastUserSetSelectedIndex !== null && !this.lastSelectedOptionRecords.length ? this.selectIndex(this.lastUserSetSelectedIndex) : this.updateValueAndDisplayText();
	}
	handleIconChange() {
		this.hasLeadingIcon = this.leadingIcons.length > 0;
	}
	dispatchInteractionEvents() {
		this.dispatchEvent(new Event("input", {
			bubbles: !0,
			composed: !0
		})), this.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	getErrorText() {
		return this.error ? this.errorText : this.nativeErrorText;
	}
	[et]() {
		return this.value;
	}
	formResetCallback() {
		this.reset();
	}
	formStateRestoreCallback(e) {
		this.value = e;
	}
	click() {
		this.field?.click();
	}
	[Je]() {
		return new Ts(() => this);
	}
	[Ye]() {
		return this.field;
	}
};
Z.shadowRootOptions = {
	..._.shadowRootOptions,
	delegatesFocus: !0
}, d([w({ type: Boolean })], Z.prototype, "quick", void 0), d([w({ type: Boolean })], Z.prototype, "required", void 0), d([w({
	type: String,
	attribute: "error-text"
})], Z.prototype, "errorText", void 0), d([w()], Z.prototype, "label", void 0), d([w({
	type: Boolean,
	attribute: "no-asterisk"
})], Z.prototype, "noAsterisk", void 0), d([w({
	type: String,
	attribute: "supporting-text"
})], Z.prototype, "supportingText", void 0), d([w({
	type: Boolean,
	reflect: !0
})], Z.prototype, "error", void 0), d([w({ attribute: "menu-positioning" })], Z.prototype, "menuPositioning", void 0), d([w({
	type: Boolean,
	attribute: "clamp-menu-width"
})], Z.prototype, "clampMenuWidth", void 0), d([w({
	type: Number,
	attribute: "typeahead-delay"
})], Z.prototype, "typeaheadDelay", void 0), d([w({
	type: Boolean,
	attribute: "has-leading-icon"
})], Z.prototype, "hasLeadingIcon", void 0), d([w({ attribute: "display-text" })], Z.prototype, "displayText", void 0), d([w({ attribute: "menu-align" })], Z.prototype, "menuAlign", void 0), d([w()], Z.prototype, "value", null), d([w({
	type: Number,
	attribute: "selected-index"
})], Z.prototype, "selectedIndex", null), d([g()], Z.prototype, "nativeError", void 0), d([g()], Z.prototype, "nativeErrorText", void 0), d([g()], Z.prototype, "focused", void 0), d([g()], Z.prototype, "open", void 0), d([g()], Z.prototype, "defaultFocus", void 0), d([a(".field")], Z.prototype, "field", void 0), d([a("md-menu")], Z.prototype, "menu", void 0), d([a("#label")], Z.prototype, "labelEl", void 0), d([c({
	slot: "leading-icon",
	flatten: !0
})], Z.prototype, "leadingIcons", void 0);
// node_modules/esp-web-tools/node_modules/@material/web/select/internal/filled-select.js
var As = class extends Z {
	constructor() {
		super(...arguments), this.fieldTag = Be`md-filled-field`;
	}
}, js = y`:host{--_text-field-active-indicator-color: var(--md-filled-select-text-field-active-indicator-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-active-indicator-height: var(--md-filled-select-text-field-active-indicator-height, 1px);--_text-field-container-color: var(--md-filled-select-text-field-container-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_text-field-disabled-active-indicator-color: var(--md-filled-select-text-field-disabled-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-active-indicator-height: var(--md-filled-select-text-field-disabled-active-indicator-height, 1px);--_text-field-disabled-active-indicator-opacity: var(--md-filled-select-text-field-disabled-active-indicator-opacity, 0.38);--_text-field-disabled-container-color: var(--md-filled-select-text-field-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-container-opacity: var(--md-filled-select-text-field-disabled-container-opacity, 0.04);--_text-field-disabled-input-text-color: var(--md-filled-select-text-field-disabled-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-input-text-opacity: var(--md-filled-select-text-field-disabled-input-text-opacity, 0.38);--_text-field-disabled-label-text-color: var(--md-filled-select-text-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-label-text-opacity: var(--md-filled-select-text-field-disabled-label-text-opacity, 0.38);--_text-field-disabled-leading-icon-color: var(--md-filled-select-text-field-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-leading-icon-opacity: var(--md-filled-select-text-field-disabled-leading-icon-opacity, 0.38);--_text-field-disabled-supporting-text-color: var(--md-filled-select-text-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-supporting-text-opacity: var(--md-filled-select-text-field-disabled-supporting-text-opacity, 0.38);--_text-field-disabled-trailing-icon-color: var(--md-filled-select-text-field-disabled-trailing-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-trailing-icon-opacity: var(--md-filled-select-text-field-disabled-trailing-icon-opacity, 0.38);--_text-field-error-active-indicator-color: var(--md-filled-select-text-field-error-active-indicator-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-active-indicator-color: var(--md-filled-select-text-field-error-focus-active-indicator-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-input-text-color: var(--md-filled-select-text-field-error-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-focus-label-text-color: var(--md-filled-select-text-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-leading-icon-color: var(--md-filled-select-text-field-error-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-error-focus-supporting-text-color: var(--md-filled-select-text-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-trailing-icon-color: var(--md-filled-select-text-field-error-focus-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_text-field-error-hover-active-indicator-color: var(--md-filled-select-text-field-error-hover-active-indicator-color, var(--md-sys-color-on-error-container, #410e0b));--_text-field-error-hover-input-text-color: var(--md-filled-select-text-field-error-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-hover-label-text-color: var(--md-filled-select-text-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_text-field-error-hover-leading-icon-color: var(--md-filled-select-text-field-error-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-error-hover-state-layer-color: var(--md-filled-select-text-field-error-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-hover-state-layer-opacity: var(--md-filled-select-text-field-error-hover-state-layer-opacity, 0.08);--_text-field-error-hover-supporting-text-color: var(--md-filled-select-text-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-hover-trailing-icon-color: var(--md-filled-select-text-field-error-hover-trailing-icon-color, var(--md-sys-color-on-error-container, #410e0b));--_text-field-error-input-text-color: var(--md-filled-select-text-field-error-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-label-text-color: var(--md-filled-select-text-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-leading-icon-color: var(--md-filled-select-text-field-error-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-error-supporting-text-color: var(--md-filled-select-text-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-trailing-icon-color: var(--md-filled-select-text-field-error-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_text-field-focus-active-indicator-color: var(--md-filled-select-text-field-focus-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_text-field-focus-active-indicator-height: var(--md-filled-select-text-field-focus-active-indicator-height, 3px);--_text-field-focus-input-text-color: var(--md-filled-select-text-field-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-focus-label-text-color: var(--md-filled-select-text-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_text-field-focus-leading-icon-color: var(--md-filled-select-text-field-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-focus-supporting-text-color: var(--md-filled-select-text-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-focus-trailing-icon-color: var(--md-filled-select-text-field-focus-trailing-icon-color, var(--md-sys-color-primary, #6750a4));--_text-field-hover-active-indicator-color: var(--md-filled-select-text-field-hover-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-active-indicator-height: var(--md-filled-select-text-field-hover-active-indicator-height, 1px);--_text-field-hover-input-text-color: var(--md-filled-select-text-field-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-label-text-color: var(--md-filled-select-text-field-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-leading-icon-color: var(--md-filled-select-text-field-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-hover-state-layer-color: var(--md-filled-select-text-field-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-state-layer-opacity: var(--md-filled-select-text-field-hover-state-layer-opacity, 0.08);--_text-field-hover-supporting-text-color: var(--md-filled-select-text-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-hover-trailing-icon-color: var(--md-filled-select-text-field-hover-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-input-text-color: var(--md-filled-select-text-field-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-input-text-font: var(--md-filled-select-text-field-input-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_text-field-input-text-line-height: var(--md-filled-select-text-field-input-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_text-field-input-text-size: var(--md-filled-select-text-field-input-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_text-field-input-text-weight: var(--md-filled-select-text-field-input-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_text-field-label-text-color: var(--md-filled-select-text-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-label-text-font: var(--md-filled-select-text-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_text-field-label-text-line-height: var(--md-filled-select-text-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_text-field-label-text-populated-line-height: var(--md-filled-select-text-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_text-field-label-text-populated-size: var(--md-filled-select-text-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_text-field-label-text-size: var(--md-filled-select-text-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_text-field-label-text-weight: var(--md-filled-select-text-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_text-field-leading-icon-color: var(--md-filled-select-text-field-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-leading-icon-size: var(--md-filled-select-text-field-leading-icon-size, 24px);--_text-field-supporting-text-color: var(--md-filled-select-text-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-supporting-text-font: var(--md-filled-select-text-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_text-field-supporting-text-line-height: var(--md-filled-select-text-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_text-field-supporting-text-size: var(--md-filled-select-text-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_text-field-supporting-text-weight: var(--md-filled-select-text-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_text-field-trailing-icon-color: var(--md-filled-select-text-field-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-trailing-icon-size: var(--md-filled-select-text-field-trailing-icon-size, 24px);--_text-field-container-shape-start-start: var(--md-filled-select-text-field-container-shape-start-start, var(--md-filled-select-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_text-field-container-shape-start-end: var(--md-filled-select-text-field-container-shape-start-end, var(--md-filled-select-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_text-field-container-shape-end-end: var(--md-filled-select-text-field-container-shape-end-end, var(--md-filled-select-text-field-container-shape, var(--md-sys-shape-corner-none, 0px)));--_text-field-container-shape-end-start: var(--md-filled-select-text-field-container-shape-end-start, var(--md-filled-select-text-field-container-shape, var(--md-sys-shape-corner-none, 0px)));--md-filled-field-active-indicator-color: var(--_text-field-active-indicator-color);--md-filled-field-active-indicator-height: var(--_text-field-active-indicator-height);--md-filled-field-container-color: var(--_text-field-container-color);--md-filled-field-container-shape-end-end: var(--_text-field-container-shape-end-end);--md-filled-field-container-shape-end-start: var(--_text-field-container-shape-end-start);--md-filled-field-container-shape-start-end: var(--_text-field-container-shape-start-end);--md-filled-field-container-shape-start-start: var(--_text-field-container-shape-start-start);--md-filled-field-content-color: var(--_text-field-input-text-color);--md-filled-field-content-font: var(--_text-field-input-text-font);--md-filled-field-content-line-height: var(--_text-field-input-text-line-height);--md-filled-field-content-size: var(--_text-field-input-text-size);--md-filled-field-content-weight: var(--_text-field-input-text-weight);--md-filled-field-disabled-active-indicator-color: var(--_text-field-disabled-active-indicator-color);--md-filled-field-disabled-active-indicator-height: var(--_text-field-disabled-active-indicator-height);--md-filled-field-disabled-active-indicator-opacity: var(--_text-field-disabled-active-indicator-opacity);--md-filled-field-disabled-container-color: var(--_text-field-disabled-container-color);--md-filled-field-disabled-container-opacity: var(--_text-field-disabled-container-opacity);--md-filled-field-disabled-content-color: var(--_text-field-disabled-input-text-color);--md-filled-field-disabled-content-opacity: var(--_text-field-disabled-input-text-opacity);--md-filled-field-disabled-label-text-color: var(--_text-field-disabled-label-text-color);--md-filled-field-disabled-label-text-opacity: var(--_text-field-disabled-label-text-opacity);--md-filled-field-disabled-leading-content-color: var(--_text-field-disabled-leading-icon-color);--md-filled-field-disabled-leading-content-opacity: var(--_text-field-disabled-leading-icon-opacity);--md-filled-field-disabled-supporting-text-color: var(--_text-field-disabled-supporting-text-color);--md-filled-field-disabled-supporting-text-opacity: var(--_text-field-disabled-supporting-text-opacity);--md-filled-field-disabled-trailing-content-color: var(--_text-field-disabled-trailing-icon-color);--md-filled-field-disabled-trailing-content-opacity: var(--_text-field-disabled-trailing-icon-opacity);--md-filled-field-error-active-indicator-color: var(--_text-field-error-active-indicator-color);--md-filled-field-error-content-color: var(--_text-field-error-input-text-color);--md-filled-field-error-focus-active-indicator-color: var(--_text-field-error-focus-active-indicator-color);--md-filled-field-error-focus-content-color: var(--_text-field-error-focus-input-text-color);--md-filled-field-error-focus-label-text-color: var(--_text-field-error-focus-label-text-color);--md-filled-field-error-focus-leading-content-color: var(--_text-field-error-focus-leading-icon-color);--md-filled-field-error-focus-supporting-text-color: var(--_text-field-error-focus-supporting-text-color);--md-filled-field-error-focus-trailing-content-color: var(--_text-field-error-focus-trailing-icon-color);--md-filled-field-error-hover-active-indicator-color: var(--_text-field-error-hover-active-indicator-color);--md-filled-field-error-hover-content-color: var(--_text-field-error-hover-input-text-color);--md-filled-field-error-hover-label-text-color: var(--_text-field-error-hover-label-text-color);--md-filled-field-error-hover-leading-content-color: var(--_text-field-error-hover-leading-icon-color);--md-filled-field-error-hover-state-layer-color: var(--_text-field-error-hover-state-layer-color);--md-filled-field-error-hover-state-layer-opacity: var(--_text-field-error-hover-state-layer-opacity);--md-filled-field-error-hover-supporting-text-color: var(--_text-field-error-hover-supporting-text-color);--md-filled-field-error-hover-trailing-content-color: var(--_text-field-error-hover-trailing-icon-color);--md-filled-field-error-label-text-color: var(--_text-field-error-label-text-color);--md-filled-field-error-leading-content-color: var(--_text-field-error-leading-icon-color);--md-filled-field-error-supporting-text-color: var(--_text-field-error-supporting-text-color);--md-filled-field-error-trailing-content-color: var(--_text-field-error-trailing-icon-color);--md-filled-field-focus-active-indicator-color: var(--_text-field-focus-active-indicator-color);--md-filled-field-focus-active-indicator-height: var(--_text-field-focus-active-indicator-height);--md-filled-field-focus-content-color: var(--_text-field-focus-input-text-color);--md-filled-field-focus-label-text-color: var(--_text-field-focus-label-text-color);--md-filled-field-focus-leading-content-color: var(--_text-field-focus-leading-icon-color);--md-filled-field-focus-supporting-text-color: var(--_text-field-focus-supporting-text-color);--md-filled-field-focus-trailing-content-color: var(--_text-field-focus-trailing-icon-color);--md-filled-field-hover-active-indicator-color: var(--_text-field-hover-active-indicator-color);--md-filled-field-hover-active-indicator-height: var(--_text-field-hover-active-indicator-height);--md-filled-field-hover-content-color: var(--_text-field-hover-input-text-color);--md-filled-field-hover-label-text-color: var(--_text-field-hover-label-text-color);--md-filled-field-hover-leading-content-color: var(--_text-field-hover-leading-icon-color);--md-filled-field-hover-state-layer-color: var(--_text-field-hover-state-layer-color);--md-filled-field-hover-state-layer-opacity: var(--_text-field-hover-state-layer-opacity);--md-filled-field-hover-supporting-text-color: var(--_text-field-hover-supporting-text-color);--md-filled-field-hover-trailing-content-color: var(--_text-field-hover-trailing-icon-color);--md-filled-field-label-text-color: var(--_text-field-label-text-color);--md-filled-field-label-text-font: var(--_text-field-label-text-font);--md-filled-field-label-text-line-height: var(--_text-field-label-text-line-height);--md-filled-field-label-text-populated-line-height: var(--_text-field-label-text-populated-line-height);--md-filled-field-label-text-populated-size: var(--_text-field-label-text-populated-size);--md-filled-field-label-text-size: var(--_text-field-label-text-size);--md-filled-field-label-text-weight: var(--_text-field-label-text-weight);--md-filled-field-leading-content-color: var(--_text-field-leading-icon-color);--md-filled-field-supporting-text-color: var(--_text-field-supporting-text-color);--md-filled-field-supporting-text-font: var(--_text-field-supporting-text-font);--md-filled-field-supporting-text-line-height: var(--_text-field-supporting-text-line-height);--md-filled-field-supporting-text-size: var(--_text-field-supporting-text-size);--md-filled-field-supporting-text-weight: var(--_text-field-supporting-text-weight);--md-filled-field-trailing-content-color: var(--_text-field-trailing-icon-color)}[has-start] .icon.leading{font-size:var(--_text-field-leading-icon-size);height:var(--_text-field-leading-icon-size);width:var(--_text-field-leading-icon-size)}.icon.trailing{font-size:var(--_text-field-trailing-icon-size);height:var(--_text-field-trailing-icon-size);width:var(--_text-field-trailing-icon-size)}
`, Ms = y`:host{color:unset;min-width:210px;display:flex}.field{cursor:default;outline:none}.select{position:relative;flex-direction:column}.icon.trailing svg,.icon ::slotted(*){fill:currentColor}.icon ::slotted(*){width:inherit;height:inherit;font-size:inherit}.icon slot{display:flex;height:100%;width:100%;align-items:center;justify-content:center}.icon.trailing :is(.up,.down){opacity:0;transition:opacity 75ms linear 75ms}.select:not(.open) .down,.select.open .up{opacity:1}.field,.select,md-menu{min-width:inherit;width:inherit;max-width:inherit;display:flex}md-menu{min-width:var(--__menu-min-width);max-width:var(--__menu-max-width, inherit)}.menu-wrapper{width:0px;height:0px;max-width:inherit}md-menu ::slotted(:not[disabled]){cursor:pointer}.field,.select{width:100%}:host{display:inline-flex}:host([disabled]){pointer-events:none}
`, Ns = class extends As {};
Ns.styles = [Ms, js], customElements.define("ew-filled-select", Ns);
// node_modules/esp-web-tools/node_modules/@material/web/menu/internal/menuitem/menu-item-styles.js
var Ps = y`:host{display:flex;--md-ripple-hover-color: var(--md-menu-item-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-hover-opacity: var(--md-menu-item-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-menu-item-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-pressed-opacity: var(--md-menu-item-pressed-state-layer-opacity, 0.12)}:host([disabled]){opacity:var(--md-menu-item-disabled-opacity, 0.3);pointer-events:none}md-focus-ring{z-index:1;--md-focus-ring-shape: 8px}a,button,li{background:none;border:none;padding:0;margin:0;text-align:unset;text-decoration:none}.list-item{border-radius:inherit;display:flex;flex:1;max-width:inherit;min-width:inherit;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.list-item:not(.disabled){cursor:pointer}[slot=container]{pointer-events:none}md-ripple{border-radius:inherit}md-item{border-radius:inherit;flex:1;color:var(--md-menu-item-label-text-color, var(--md-sys-color-on-surface, #1d1b20));font-family:var(--md-menu-item-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-menu-item-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));line-height:var(--md-menu-item-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));font-weight:var(--md-menu-item-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));min-height:var(--md-menu-item-one-line-container-height, 56px);padding-top:var(--md-menu-item-top-space, 12px);padding-bottom:var(--md-menu-item-bottom-space, 12px);padding-inline-start:var(--md-menu-item-leading-space, 16px);padding-inline-end:var(--md-menu-item-trailing-space, 16px)}md-item[multiline]{min-height:var(--md-menu-item-two-line-container-height, 72px)}[slot=supporting-text]{color:var(--md-menu-item-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-menu-item-supporting-text-font, var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-menu-item-supporting-text-size, var(--md-sys-typescale-body-medium-size, 0.875rem));line-height:var(--md-menu-item-supporting-text-line-height, var(--md-sys-typescale-body-medium-line-height, 1.25rem));font-weight:var(--md-menu-item-supporting-text-weight, var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400)))}[slot=trailing-supporting-text]{color:var(--md-menu-item-trailing-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-menu-item-trailing-supporting-text-font, var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-menu-item-trailing-supporting-text-size, var(--md-sys-typescale-label-small-size, 0.6875rem));line-height:var(--md-menu-item-trailing-supporting-text-line-height, var(--md-sys-typescale-label-small-line-height, 1rem));font-weight:var(--md-menu-item-trailing-supporting-text-weight, var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500)))}:is([slot=start],[slot=end])::slotted(*){fill:currentColor}[slot=start]{color:var(--md-menu-item-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}[slot=end]{color:var(--md-menu-item-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}.list-item{background-color:var(--md-menu-item-container-color, transparent)}.list-item.selected{background-color:var(--md-menu-item-selected-container-color, var(--md-sys-color-secondary-container, #e8def8))}.selected:not(.disabled) ::slotted(*){color:var(--md-menu-item-selected-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b))}@media(forced-colors: active){:host([disabled]),:host([disabled]) slot{color:GrayText;opacity:1}.list-item{position:relative}.list-item.selected::before{content:"";position:absolute;inset:0;box-sizing:border-box;border-radius:inherit;pointer-events:none;border:3px double CanvasText}}
`, Fs = class {
	constructor(e, t) {
		this.host = e, this.internalTypeaheadText = null, this.onClick = () => {
			this.host.keepOpen || this.host.dispatchEvent(us(this.host, { kind: fs.CLICK_SELECTION }));
		}, this.onKeydown = (e) => {
			if (this.host.href && e.code === "Enter") {
				let e = this.getInteractiveElement();
				e instanceof HTMLAnchorElement && e.click();
			}
			if (e.defaultPrevented) return;
			let t = e.code;
			this.host.keepOpen && t !== "Escape" || ms(t) && (e.preventDefault(), this.host.dispatchEvent(us(this.host, {
				kind: fs.KEYDOWN,
				key: t
			})));
		}, this.getHeadlineElements = t.getHeadlineElements, this.getSupportingTextElements = t.getSupportingTextElements, this.getDefaultElements = t.getDefaultElements, this.getInteractiveElement = t.getInteractiveElement, this.host.addController(this);
	}
	get typeaheadText() {
		if (this.internalTypeaheadText !== null) return this.internalTypeaheadText;
		let e = this.getHeadlineElements(), t = [];
		return e.forEach((e) => {
			e.textContent && e.textContent.trim() && t.push(e.textContent.trim());
		}), t.length === 0 && this.getDefaultElements().forEach((e) => {
			e.textContent && e.textContent.trim() && t.push(e.textContent.trim());
		}), t.length === 0 && this.getSupportingTextElements().forEach((e) => {
			e.textContent && e.textContent.trim() && t.push(e.textContent.trim());
		}), t.join(" ");
	}
	get tagName() {
		switch (this.host.type) {
			case "link": return "a";
			case "button": return "button";
			default:
			case "menuitem":
			case "option": return "li";
		}
	}
	get role() {
		return this.host.type === "option" ? "option" : "menuitem";
	}
	hostConnected() {
		this.host.toggleAttribute("md-menu-item", !0);
	}
	hostUpdate() {
		this.host.href && (this.host.type = "link");
	}
	setTypeaheadText(e) {
		this.internalTypeaheadText = e;
	}
};
// node_modules/esp-web-tools/node_modules/@material/web/select/internal/selectoption/selectOptionController.js
function Is() {
	return new Event("request-selection", {
		bubbles: !0,
		composed: !0
	});
}
function Ls() {
	return new Event("request-deselection", {
		bubbles: !0,
		composed: !0
	});
}
var Rs = class {
	get role() {
		return this.menuItemController.role;
	}
	get typeaheadText() {
		return this.menuItemController.typeaheadText;
	}
	setTypeaheadText(e) {
		this.menuItemController.setTypeaheadText(e);
	}
	get displayText() {
		return this.internalDisplayText === null ? this.menuItemController.typeaheadText : this.internalDisplayText;
	}
	setDisplayText(e) {
		this.internalDisplayText = e;
	}
	constructor(e, t) {
		this.host = e, this.internalDisplayText = null, this.firstUpdate = !0, this.onClick = () => {
			this.menuItemController.onClick();
		}, this.onKeydown = (e) => {
			this.menuItemController.onKeydown(e);
		}, this.lastSelected = this.host.selected, this.menuItemController = new Fs(e, t), e.addController(this);
	}
	hostUpdate() {
		this.lastSelected !== this.host.selected && (this.host.ariaSelected = this.host.selected ? "true" : "false");
	}
	hostUpdated() {
		this.lastSelected !== this.host.selected && !this.firstUpdate && (this.host.selected ? this.host.dispatchEvent(Is()) : this.host.dispatchEvent(Ls())), this.lastSelected = this.host.selected, this.firstUpdate = !1;
	}
}, zs = h(_), Q = class extends zs {
	constructor() {
		super(...arguments), this.disabled = !1, this.isMenuItem = !0, this.selected = !1, this.value = "", this.type = "option", this.selectOptionController = new Rs(this, {
			getHeadlineElements: () => this.headlineElements,
			getSupportingTextElements: () => this.supportingTextElements,
			getDefaultElements: () => this.defaultElements,
			getInteractiveElement: () => this.listItemRoot
		});
	}
	get typeaheadText() {
		return this.selectOptionController.typeaheadText;
	}
	set typeaheadText(e) {
		this.selectOptionController.setTypeaheadText(e);
	}
	get displayText() {
		return this.selectOptionController.displayText;
	}
	set displayText(e) {
		this.selectOptionController.setDisplayText(e);
	}
	render() {
		return this.renderListItem(T`
      <md-item>
        <div slot="container">
          ${this.renderRipple()} ${this.renderFocusRing()}
        </div>
        <slot name="start" slot="start"></slot>
        <slot name="end" slot="end"></slot>
        ${this.renderBody()}
      </md-item>
    `);
	}
	renderListItem(e) {
		return T`
      <li
        id="item"
        tabindex=${this.disabled ? -1 : 0}
        role=${this.selectOptionController.role}
        aria-label=${this.ariaLabel || S}
        aria-selected=${this.ariaSelected || S}
        aria-checked=${this.ariaChecked || S}
        aria-expanded=${this.ariaExpanded || S}
        aria-haspopup=${this.ariaHasPopup || S}
        class="list-item ${O(this.getRenderClasses())}"
        @click=${this.selectOptionController.onClick}
        @keydown=${this.selectOptionController.onKeydown}
        >${e}</li
      >
    `;
	}
	renderRipple() {
		return T` <md-ripple
      part="ripple"
      for="item"
      ?disabled=${this.disabled}></md-ripple>`;
	}
	renderFocusRing() {
		return T` <md-focus-ring
      part="focus-ring"
      for="item"
      inward></md-focus-ring>`;
	}
	getRenderClasses() {
		return {
			disabled: this.disabled,
			selected: this.selected
		};
	}
	renderBody() {
		return T`
      <slot></slot>
      <slot name="overline" slot="overline"></slot>
      <slot name="headline" slot="headline"></slot>
      <slot name="supporting-text" slot="supporting-text"></slot>
      <slot
        name="trailing-supporting-text"
        slot="trailing-supporting-text"></slot>
    `;
	}
	focus() {
		this.listItemRoot?.focus();
	}
};
Q.shadowRootOptions = {
	..._.shadowRootOptions,
	delegatesFocus: !0
}, d([w({
	type: Boolean,
	reflect: !0
})], Q.prototype, "disabled", void 0), d([w({
	type: Boolean,
	attribute: "md-menu-item",
	reflect: !0
})], Q.prototype, "isMenuItem", void 0), d([w({ type: Boolean })], Q.prototype, "selected", void 0), d([w()], Q.prototype, "value", void 0), d([a(".list-item")], Q.prototype, "listItemRoot", void 0), d([c({ slot: "headline" })], Q.prototype, "headlineElements", void 0), d([c({ slot: "supporting-text" })], Q.prototype, "supportingTextElements", void 0), d([_e({ slot: "" })], Q.prototype, "defaultElements", void 0), d([w({ attribute: "typeahead-text" })], Q.prototype, "typeaheadText", null), d([w({ attribute: "display-text" })], Q.prototype, "displayText", null);
// node_modules/esp-web-tools/dist/components/ew-select-option.js
var Bs = class extends Q {};
Bs.styles = [Ps], customElements.define("ew-select-option", Bs);
// node_modules/esp-web-tools/node_modules/@material/web/progress/internal/progress.js
var Vs = h(_), Hs = class extends Vs {
	constructor() {
		super(...arguments), this.value = 0, this.max = 1, this.indeterminate = !1, this.fourColor = !1;
	}
	render() {
		let { ariaLabel: e } = this;
		return T`
      <div
        class="progress ${O(this.getRenderClasses())}"
        role="progressbar"
        aria-label="${e || S}"
        aria-valuemin="0"
        aria-valuemax=${this.max}
        aria-valuenow=${this.indeterminate ? S : this.value}
        >${this.renderIndicator()}</div
      >
    `;
	}
	getRenderClasses() {
		return {
			indeterminate: this.indeterminate,
			"four-color": this.fourColor
		};
	}
};
d([w({ type: Number })], Hs.prototype, "value", void 0), d([w({ type: Number })], Hs.prototype, "max", void 0), d([w({ type: Boolean })], Hs.prototype, "indeterminate", void 0), d([w({
	type: Boolean,
	attribute: "four-color"
})], Hs.prototype, "fourColor", void 0);
// node_modules/esp-web-tools/node_modules/@material/web/progress/internal/circular-progress.js
var Us = class extends Hs {
	renderIndicator() {
		return this.indeterminate ? this.renderIndeterminateContainer() : this.renderDeterminateContainer();
	}
	renderDeterminateContainer() {
		let e = (1 - this.value / this.max) * 100;
		return T`
      <svg viewBox="0 0 4800 4800">
        <circle class="track" pathLength="100"></circle>
        <circle
          class="active-track"
          pathLength="100"
          stroke-dashoffset=${e}></circle>
      </svg>
    `;
	}
	renderIndeterminateContainer() {
		return T` <div class="spinner">
      <div class="left">
        <div class="circle"></div>
      </div>
      <div class="right">
        <div class="circle"></div>
      </div>
    </div>`;
	}
}, Ws = y`:host{--_active-indicator-color: var(--md-circular-progress-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_active-indicator-width: var(--md-circular-progress-active-indicator-width, 10);--_four-color-active-indicator-four-color: var(--md-circular-progress-four-color-active-indicator-four-color, var(--md-sys-color-tertiary-container, #ffd8e4));--_four-color-active-indicator-one-color: var(--md-circular-progress-four-color-active-indicator-one-color, var(--md-sys-color-primary, #6750a4));--_four-color-active-indicator-three-color: var(--md-circular-progress-four-color-active-indicator-three-color, var(--md-sys-color-tertiary, #7d5260));--_four-color-active-indicator-two-color: var(--md-circular-progress-four-color-active-indicator-two-color, var(--md-sys-color-primary-container, #eaddff));--_size: var(--md-circular-progress-size, 48px);display:inline-flex;vertical-align:middle;width:var(--_size);height:var(--_size);position:relative;align-items:center;justify-content:center;contain:strict;content-visibility:auto}.progress{flex:1;align-self:stretch;margin:4px}.progress,.spinner,.left,.right,.circle,svg,.track,.active-track{position:absolute;inset:0}svg{transform:rotate(-90deg)}circle{cx:50%;cy:50%;r:calc(50%*(1 - var(--_active-indicator-width)/100));stroke-width:calc(var(--_active-indicator-width)*1%);stroke-dasharray:100;fill:rgba(0,0,0,0)}.active-track{transition:stroke-dashoffset 500ms cubic-bezier(0, 0, 0.2, 1);stroke:var(--_active-indicator-color)}.track{stroke:rgba(0,0,0,0)}.progress.indeterminate{animation:linear infinite linear-rotate;animation-duration:1568.2352941176ms}.spinner{animation:infinite both rotate-arc;animation-duration:5332ms;animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.left{overflow:hidden;inset:0 50% 0 0}.right{overflow:hidden;inset:0 0 0 50%}.circle{box-sizing:border-box;border-radius:50%;border:solid calc(var(--_active-indicator-width)/100*(var(--_size) - 8px));border-color:var(--_active-indicator-color) var(--_active-indicator-color) rgba(0,0,0,0) rgba(0,0,0,0);animation:expand-arc;animation-iteration-count:infinite;animation-fill-mode:both;animation-duration:1333ms,5332ms;animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.four-color .circle{animation-name:expand-arc,four-color}.left .circle{rotate:135deg;inset:0 -100% 0 0}.right .circle{rotate:100deg;inset:0 0 0 -100%;animation-delay:-666.5ms,0ms}@media(forced-colors: active){.active-track{stroke:CanvasText}.circle{border-color:CanvasText CanvasText Canvas Canvas}}@keyframes expand-arc{0%{transform:rotate(265deg)}50%{transform:rotate(130deg)}100%{transform:rotate(265deg)}}@keyframes rotate-arc{12.5%{transform:rotate(135deg)}25%{transform:rotate(270deg)}37.5%{transform:rotate(405deg)}50%{transform:rotate(540deg)}62.5%{transform:rotate(675deg)}75%{transform:rotate(810deg)}87.5%{transform:rotate(945deg)}100%{transform:rotate(1080deg)}}@keyframes linear-rotate{to{transform:rotate(360deg)}}@keyframes four-color{0%{border-top-color:var(--_four-color-active-indicator-one-color);border-right-color:var(--_four-color-active-indicator-one-color)}15%{border-top-color:var(--_four-color-active-indicator-one-color);border-right-color:var(--_four-color-active-indicator-one-color)}25%{border-top-color:var(--_four-color-active-indicator-two-color);border-right-color:var(--_four-color-active-indicator-two-color)}40%{border-top-color:var(--_four-color-active-indicator-two-color);border-right-color:var(--_four-color-active-indicator-two-color)}50%{border-top-color:var(--_four-color-active-indicator-three-color);border-right-color:var(--_four-color-active-indicator-three-color)}65%{border-top-color:var(--_four-color-active-indicator-three-color);border-right-color:var(--_four-color-active-indicator-three-color)}75%{border-top-color:var(--_four-color-active-indicator-four-color);border-right-color:var(--_four-color-active-indicator-four-color)}90%{border-top-color:var(--_four-color-active-indicator-four-color);border-right-color:var(--_four-color-active-indicator-four-color)}100%{border-top-color:var(--_four-color-active-indicator-one-color);border-right-color:var(--_four-color-active-indicator-one-color)}}
`, Gs = class extends Us {};
Gs.styles = [Ws], customElements.define("ew-circular-progress", Gs);
// node_modules/esp-web-tools/dist/pages/ewt-page-progress.js
var Ks = class extends _ {
	render() {
		return T`
      <div>
        <ew-circular-progress
          active
          ?indeterminate=${this.progress === void 0}
          .value=${this.progress === void 0 ? void 0 : this.progress / 100}
        ></ew-circular-progress>
        ${this.progress === void 0 ? "" : T`<div>${this.progress}%</div>`}
      </div>
      ${this.label}
    `;
	}
};
Ks.styles = y`
    :host {
      display: flex;
      flex-direction: column;
      text-align: center;
    }
    ew-circular-progress {
      margin-bottom: 16px;
    }
  `, d([w()], Ks.prototype, "label", void 0), d([w()], Ks.prototype, "progress", void 0), customElements.define("ewt-page-progress", Ks);
// node_modules/esp-web-tools/dist/pages/ewt-page-message.js
var qs = class extends _ {
	render() {
		return T`
      <div class="icon">${this.icon}</div>
      ${this.label}
    `;
	}
};
qs.styles = y`
    :host {
      display: flex;
      flex-direction: column;
      text-align: center;
    }
    .icon {
      font-size: 50px;
      line-height: 80px;
      color: black;
    }
  `, d([w()], qs.prototype, "icon", void 0), d([w()], qs.prototype, "label", void 0), customElements.define("ewt-page-message", qs);
// node_modules/esp-web-tools/dist/components/svg.js
var Js = b`
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
    />
  </svg>
`, Ys = b`
  <svg viewBox="0 -960 960 960">
    <path
      fill="currentColor"
      d="M480-120 0-600q95-97 219.5-148.5T480-800q137 0 261 51t219 149L480-120ZM174-540q67-48 145-74t161-26q83 0 161 26t145 74l58-58q-79-60-172-91t-192-31q-99 0-192 31t-172 91l58 58Z"
    />
  </svg>
`, Xs = b`
  <svg viewBox="0 -960 960 960">
    <path
      fill="currentColor"
      d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM232-482q53-38 116-59.5T480-563q69 0 132 21.5T728-482l116-116q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l116 116Z"
    />
  </svg>
`, Zs = b`
  <svg viewBox="0 -960 960 960">
    <path
      fill="currentColor"
      d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM299-415q38-28 84-43.5t97-15.5q51 0 97 15.5t84 43.5l183-183q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l183 183Z"
    />
  </svg>
`, Qs = b`
  <svg viewBox="0 -960 960 960">
    <path
      fill="currentColor"
      d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM361-353q25-18 55.5-28t63.5-10q33 0 63.5 10t55.5 28l245-245q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l245 245Z"
    />
  </svg>
`, $s = b`
  <svg viewBox="0 -960 960 960">
    <path
      fill="currentColor"
      d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"
    />
  </svg>
`, ec = b`
  <svg viewBox="0 -960 960 960">
    <path
      fill="currentColor"
      d="M240-160h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM240-160v-400 400Zm0 80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h280v-80q0-83 58.5-141.5T720-920q83 0 141.5 58.5T920-720h-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80h120q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Z"
    />
  </svg>
`, tc = b`
  <svg slot="start" viewBox="0 0 24 24">
    <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
  </svg>
`, nc = b`
  <svg slot="start" viewBox="0 0 24 24">
    <path d="M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z" />
  </svg>
`, rc = b`
  <svg slot="start" viewBox="0 0 24 24">
    <path d="M20,19V7H4V19H20M20,3A2,2 0 0,1 22,5V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V5C2,3.89 2.9,3 4,3H20M13,17V15H18V17H13M9.58,13L5.57,9H8.4L11.7,12.3C12.09,12.69 12.09,13.33 11.7,13.72L8.42,17H5.59L9.58,13Z" />
  </svg>
`, ic = b`
  <svg slot="start" viewBox="0 0 24 24">
  <path d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
  </svg>
`, ac = b`
  <svg slot="start" viewBox="0 0 24 24">
    <path d="m12.151 1.5882c-.3262 0-.6523.1291-.8996.3867l-8.3848 8.7354c-.0619.0644-.1223.1368-.1807.2154-.0588.0789-.1151.1638-.1688.2534-.2593.4325-.4552.9749-.5232 1.4555-.0026.018-.0076.0369-.0094.0548-.0121.0987-.0184.1944-.0184.2857v8.0124a1.2731 1.2731 0 001.2731 1.2731h7.8313l-3.4484-3.593a1.7399 1.7399 0 111.0803-1.125l2.6847 2.7972v-10.248a1.7399 1.7399 0 111.5276-0v7.187l2.6702-2.782a1.7399 1.7399 0 111.0566 1.1505l-3.7269 3.8831v2.7299h8.174a1.2471 1.2471 0 001.2471-1.2471v-8.0375c0-.0912-.0059-.1868-.0184-.2855-.0603-.4935-.2636-1.0617-.5326-1.5105-.0537-.0896-.1101-.1745-.1684-.253-.0588-.079-.1191-.1513-.181-.2158l-8.3848-8.7363c-.2473-.2577-.5735-.3866-.8995-.3864" />
  </svg>
`, oc = b`
  <svg slot="start" viewBox="0 0 24 24">
    <path d="M15,14C17.67,14 23,15.33 23,18V20H7V18C7,15.33 12.33,14 15,14M15,12A4,4 0 0,1 11,8A4,4 0 0,1 15,4A4,4 0 0,1 19,8A4,4 0 0,1 15,12M5,9.59L7.12,7.46L8.54,8.88L6.41,11L8.54,13.12L7.12,14.54L5,12.41L2.88,14.54L1.46,13.12L3.59,11L1.46,8.88L2.88,7.46L5,9.59Z" />
  </svg>
`, sc = b`
  <svg slot="start" viewBox="0 0 24 24">
    <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
  </svg>
`, cc = [
	73,
	77,
	80,
	82,
	79,
	86,
	1
], lc;
(function(e) {
	e[e.CURRENT_STATE = 1] = "CURRENT_STATE", e[e.ERROR_STATE = 2] = "ERROR_STATE", e[e.RPC = 3] = "RPC", e[e.RPC_RESULT = 4] = "RPC_RESULT";
})(lc ||= {});
var uc;
(function(e) {
	e[e.STOPPED = 0] = "STOPPED", e[e.READY = 2] = "READY", e[e.PROVISIONING = 3] = "PROVISIONING", e[e.PROVISIONED = 4] = "PROVISIONED";
})(uc ||= {});
var dc = {
	0: "NO_ERROR",
	1: "INVALID_RPC_PACKET",
	2: "UNKNOWN_RPC_COMMAND",
	3: "UNABLE_TO_CONNECT",
	5: "BAD_HOSTNAME",
	254: "TIMEOUT",
	255: "UNKNOWN_ERROR"
}, fc = class extends Error {
	constructor() {
		super("Port is not ready");
	}
}, pc = (e, t = 2) => {
	let n = e.toString(16).toUpperCase();
	return n.startsWith("-") ? "-0x" + n.substring(1).padStart(t, "0") : "0x" + n.padStart(t, "0");
}, mc = (e) => "[" + e.map((e) => pc(e)).join(", ") + "]", hc = (e) => e.sort((e, t) => e.name.toLocaleLowerCase().localeCompare(t.name.toLocaleLowerCase())), gc = (e, t) => {
	let n = /* @__PURE__ */ new Map();
	for (let t of e) n.set(t.name, t);
	for (let e of t) n.set(e.name, e);
	return hc(Array.from(n.values()));
}, _c = 3e3, vc = 3e4, yc = 3e4, bc = (e, t) => e.length !== t.length || e.some((e, n) => e.name !== t[n].name || e.rssi !== t[n].rssi || e.secured !== t[n].secured), xc = class extends EventTarget {
	get error() {
		return this._error;
	}
	set error(e) {
		this._error = e, this.dispatchEvent(new CustomEvent("error-changed", { detail: this._error }));
	}
	constructor(e, t) {
		if (super(), this.port = e, this.logger = t, this._error = 0, this._rpcLock = Promise.resolve(), e.readable === null) throw Error("Port is not readable");
		if (e.writable === null) throw Error("Port is not writable");
	}
	async initialize(e = 1e3) {
		if (this.logger.log("Initializing Improv Serial"), this._processInput(), this._reader === void 0) throw new fc();
		let t;
		try {
			await new Promise(async (n, r) => {
				setTimeout(() => r(/* @__PURE__ */ Error("Improv Wi-Fi Serial not detected")), e), t = setInterval(() => this._sendRPC(2, []), 1e3), await this.requestCurrentState(), n(void 0);
			}), clearInterval(t), await this.requestInfo();
		} catch (e) {
			throw await this.close(), e;
		} finally {
			clearInterval(t);
		}
		return this.info;
	}
	async close() {
		this._reader && await new Promise((e) => {
			this._reader.cancel(), this.addEventListener("disconnect", e, { once: !0 });
		});
	}
	async requestCurrentState() {
		var e;
		let t = new AbortController(), n;
		try {
			await new Promise((e, r) => {
				this.addEventListener("state-changed", () => e(), {
					once: !0,
					signal: t.signal
				}), n = this._sendRPCWithResponse(2, []), n.catch(r);
			});
		} catch (e) {
			throw Error(`Error fetching current state: ${e}`);
		} finally {
			t.abort();
		}
		this.state === uc.PROVISIONED ? this.nextUrl = (await n)[0] : (e = this._rpcFeedback) == null || e.resolve([]);
	}
	async requestInfo(e) {
		let t = await this._sendRPCWithResponse(3, [], e);
		this.info = {
			firmware: t[0],
			version: t[1],
			name: t[3],
			chipFamily: t[2],
			osName: t.length > 4 ? t[4] : null,
			osVersion: t.length > 5 ? t[5] : null
		};
	}
	async provision(e, t, n) {
		let r = new TextEncoder(), i = r.encode(e), a = r.encode(t), o = [
			i.length,
			...i,
			a.length,
			...a
		], s = await this._sendRPCWithResponse(1, o, n);
		this.nextUrl = s[0];
	}
	async scan(e) {
		return hc((await this._sendRPCWithMultipleResponses(4, [], e)).map(([e, t, n]) => ({
			name: e,
			rssi: parseInt(t),
			secured: n !== "NO"
		})));
	}
	subscribeSSIDs(e) {
		let t = !0, n, r, i = (async () => {
			for (; t;) {
				let i;
				try {
					i = await this.scan(vc);
				} catch (r) {
					this.logger.error("Error while scanning for Wi-Fi networks", r), t && n === void 0 && e(null);
					break;
				}
				if (!t) break;
				let a = n === void 0 ? i : gc(n, i);
				(n === void 0 || bc(n, a)) && (n = a, e(a)), await new Promise((e) => {
					r = e, setTimeout(e, _c);
				});
			}
		})();
		return () => (t = !1, r?.(), i);
	}
	async getHostname(e) {
		return (await this._sendRPCWithResponse(5, [], e))[0];
	}
	async setHostname(e, t) {
		let n = new TextEncoder();
		return (await this._sendRPCWithResponse(5, [...n.encode(e)], t))[0];
	}
	async getDeviceName(e) {
		return (await this._sendRPCWithResponse(6, [], e))[0];
	}
	async setDeviceName(e, t) {
		let n = new TextEncoder(), r = await this._sendRPCWithResponse(6, [...n.encode(e)], t);
		return this.info && (this.info.name = r[0]), r[0];
	}
	async requestNetworkState(e) {
		let t = await this._sendRPCWithResponse(7, [], e), n = parseInt(t[0]);
		return {
			online: !!(n & 1),
			supportsWifi: !!(n & 2),
			supportsEthernet: !!(n & 4),
			supportsThread: !!(n & 8),
			supportsModem: !!(n & 16),
			urls: t.slice(1)
		};
	}
	_sendRPC(e, t) {
		this.writePacketToStream(lc.RPC, [
			e,
			t.length,
			...t
		]);
	}
	_enqueueRPC(e, t) {
		let n = () => this._awaitRPCResultWithTimeout(e(), t).finally(() => {
			this._rpcFeedback = void 0;
		}), r = this._rpcLock.then(n, n);
		return this._rpcLock = r.catch(() => {}), r;
	}
	_sendRPCWithResponse(e, t, n = yc) {
		return this._enqueueRPC(() => new Promise((n, r) => {
			this._rpcFeedback = {
				command: e,
				resolve: n,
				reject: r
			}, this._sendRPC(e, t);
		}), n);
	}
	_sendRPCWithMultipleResponses(e, t, n = yc) {
		return this._enqueueRPC(() => new Promise((n, r) => {
			this._rpcFeedback = {
				command: e,
				resolve: n,
				reject: r,
				receivedData: []
			}, this._sendRPC(e, t);
		}), n);
	}
	async _awaitRPCResultWithTimeout(e, t) {
		if (!t) return await e;
		let n = setTimeout(() => this._setError(254), t);
		try {
			return await e;
		} finally {
			clearTimeout(n);
		}
	}
	async _processInput() {
		this.logger.debug("Starting read loop"), this._reader = this.port.readable.getReader();
		try {
			let e = [], t, n = 0;
			for (;;) {
				let { value: r, done: i } = await this._reader.read();
				if (i) break;
				if (r && r.length !== 0) for (let i of r) t === !1 ? i === 10 && (t = void 0) : t === !0 ? (e.push(i), e.length === n && (this._handleIncomingPacket(e), t = void 0, e = [])) : i === 10 ? e = [] : (e.push(i), e.length === 9 && (t = String.fromCharCode(...e.slice(0, 6)) === "IMPROV", t ? n = 9 + e[8] + 1 : e = []));
			}
		} catch (e) {
			this.logger.error("Error while reading serial port", e);
		} finally {
			this._reader.releaseLock(), this._reader = void 0;
		}
		this.logger.debug("Finished read loop"), this.dispatchEvent(new Event("disconnect"));
	}
	_handleIncomingPacket(e) {
		let t = e.slice(6), n = t[0], r = t[1], i = t[2], a = t.slice(3, 3 + i);
		if (this.logger.debug("PROCESS", {
			version: n,
			packetType: r,
			packetLength: i,
			data: mc(a)
		}), n !== 1) {
			this.logger.error("Received unsupported version", n);
			return;
		}
		let o = t[3 + i], s = 0;
		for (let t = 0; t < e.length - 1; t++) s += e[t];
		if (s &= 255, s !== o) this.logger.error(`Received invalid checksum ${o}. Expected ${s}`);
		else if (r === lc.CURRENT_STATE) this.state = a[0], this.dispatchEvent(new CustomEvent("state-changed", { detail: this.state }));
		else if (r === lc.ERROR_STATE) this._setError(a[0]);
		else if (r === lc.RPC_RESULT) {
			if (!this._rpcFeedback) {
				this.logger.error("Received result while not waiting for one");
				return;
			}
			let e = a[0];
			if (e !== this._rpcFeedback.command) {
				this.logger.error(`Received result for command ${e} but expected ${this._rpcFeedback.command}`);
				return;
			}
			let t = [], n = a[1], r = new TextDecoder("utf-8"), i = 2;
			for (; i < 2 + n;) t.push(r.decode(new Uint8Array(a.slice(i + 1, i + a[i] + 1)))), i += a[i] + 1;
			"receivedData" in this._rpcFeedback ? t.length > 0 ? this._rpcFeedback.receivedData.push(t) : this._rpcFeedback.resolve(this._rpcFeedback.receivedData) : this._rpcFeedback.resolve(t);
		} else this.logger.error("Unable to handle packet", t);
	}
	async writePacketToStream(e, t) {
		let n = new Uint8Array([
			...cc,
			e,
			t.length,
			...t,
			0,
			0
		]);
		n[n.length - 2] = n.reduce((e, t) => e + t, 0) & 255, n[n.length - 1] = 10, this.logger.debug("Writing to stream:", mc(new Array(...n)));
		let r = this.port.writable.getWriter();
		await r.write(n);
		try {
			r.releaseLock();
		} catch (e) {
			console.error("Ignoring release lock error", e);
		}
	}
	_setError(e) {
		e > 0 && this._rpcFeedback && this._rpcFeedback.reject(dc[e] || `UNKNOWN_ERROR (${e})`), this.error = e;
	}
}, Sc = async (e, t) => {
	await e.setRTS(!0), await dt(100), await t.after();
}, Cc = async (e, t, n, r, i) => {
	let a, o, s = (t) => e({
		...t,
		manifest: r,
		build: a,
		chipFamily: o
	}), c = new $a(t), l = t.getInfo(), u = l && l.usbVendorId === 12346 && l.usbProductId !== void 0 && [
		4097,
		4098,
		4099,
		2,
		3
	].includes(l.usbProductId), d = new Ao({
		transport: c,
		baudrate: 115200,
		enableTracing: !1
	});
	window.esploader = d, s({
		state: "initializing",
		message: "Initializing...",
		details: { done: !1 }
	});
	try {
		await d.main(), await d.flashId();
	} catch (e) {
		console.error(e), s({
			state: "error",
			message: "Failed to initialize. Try resetting your device or holding the BOOT button while clicking INSTALL.",
			details: {
				error: "failed_initialize",
				details: e
			}
		}), await Sc(c, d), await c.disconnect();
		return;
	}
	o = d.chip.CHIP_NAME, s({
		state: "initializing",
		message: `Initialized. Found ${o}`,
		details: { done: !0 }
	});
	let f = u ? "cdc" : "uart";
	if (a = r.builds.find((e) => e.chipFamily === o && e.serialType === f) || r.builds.find((e) => e.chipFamily === o && e.serialType === void 0), !a) {
		s({
			state: "error",
			message: `Your ${o} board is not supported.`,
			details: {
				error: "not_supported",
				details: o
			}
		}), await Sc(c, d), await c.disconnect();
		return;
	}
	s({
		state: "preparing",
		message: "Preparing installation...",
		details: { done: !1 }
	});
	let p = n.startsWith("blob:") || n.startsWith("data:") ? location.toString() : new URL(n, location.toString()).toString(), m = a.parts.map(async (e) => {
		let t = new URL(e.path, p).toString(), n = await fetch(t);
		if (!n.ok) throw Error(`Downloading firmware ${e.path} failed: ${n.status}`);
		let r = new FileReader(), i = await n.blob();
		return new Promise((e) => {
			r.addEventListener("load", () => e(r.result)), r.readAsArrayBuffer(i);
		});
	}), h = [], g = 0;
	for (let e = 0; e < m.length; e++) try {
		let t = await m[e], n = new Uint8Array(t, 0, t.byteLength);
		h.push({
			data: n,
			address: a.parts[e].offset
		}), g += n.length;
	} catch (e) {
		s({
			state: "error",
			message: e.message,
			details: {
				error: "failed_firmware_download",
				details: e.message
			}
		}), await Sc(c, d), await c.disconnect();
		return;
	}
	s({
		state: "preparing",
		message: "Installation prepared",
		details: { done: !0 }
	}), i && (s({
		state: "erasing",
		message: "Erasing device...",
		details: { done: !1 }
	}), await d.eraseFlash(), s({
		state: "erasing",
		message: "Device erased",
		details: { done: !0 }
	})), s({
		state: "writing",
		message: "Writing progress: 0%",
		details: {
			bytesTotal: g,
			bytesWritten: 0,
			percentage: 0
		}
	});
	let _ = 0;
	try {
		await d.writeFlash({
			fileArray: h,
			flashSize: "keep",
			flashMode: "keep",
			flashFreq: "keep",
			eraseAll: !1,
			compress: !0,
			reportProgress: (e, t, n) => {
				let r = t / n * h[e].data.length, i = Math.floor((_ + r) / g * 100);
				t === n ? _ += r : s({
					state: "writing",
					message: `Writing progress: ${i}%`,
					details: {
						bytesTotal: g,
						bytesWritten: _ + t,
						percentage: i
					}
				});
			}
		});
	} catch (e) {
		s({
			state: "error",
			message: e.message,
			details: {
				error: "write_failed",
				details: e
			}
		}), await Sc(c, d), await c.disconnect();
		return;
	}
	s({
		state: "writing",
		message: "Writing complete",
		details: {
			bytesTotal: g,
			bytesWritten: _,
			percentage: 100
		}
	}), await Sc(c, d), console.log("DISCONNECT"), await c.disconnect(), s({
		state: "finished",
		message: "All done!"
	});
}, wc = (e, t = "") => {
	let n = document.createElement("a");
	n.target = "_blank", n.href = e, n.download = t, document.body.appendChild(n), n.dispatchEvent(new MouseEvent("click")), document.body.removeChild(n);
}, Tc = (e, t = "") => {
	let n = new Blob([e], { type: "text/plain" }), r = URL.createObjectURL(n);
	wc(r, t), setTimeout(() => URL.revokeObjectURL(r), 0);
}, Ec = (e, t, n, r) => {
	r ||= {};
	let i = new CustomEvent(t, {
		bubbles: r.bubbles === void 0 || r.bubbles,
		cancelable: !!r.cancelable,
		composed: r.composed === void 0 || r.composed,
		detail: n
	});
	e.dispatchEvent(i);
}, Dc = async (e) => {
	let t = new URL(e, location.toString()).toString(), n = await (await fetch(t)).json();
	return "new_install_skip_erase" in n && (console.warn("Manifest option \"new_install_skip_erase\" is deprecated. Use \"new_install_prompt_erase\" instead."), n.new_install_skip_erase && (n.new_install_prompt_erase = !0)), n;
};
// node_modules/esp-web-tools/dist/install-dialog.js
console.log("ESP Web Tools 10.4.0 by Open Home Foundation; https://esphome.github.io/esp-web-tools/");
var Oc = "⚠️", kc = "🎉", Ac = 9100, jc = (e) => e.length ? e.reduce((e, t) => t.rssi > e.rssi ? t : e).name : null, Mc = (e) => e >= -50 ? {
	icon: Ys,
	class: "signal-excellent"
} : e >= -60 ? {
	icon: Xs,
	class: "signal-good"
} : e >= -70 ? {
	icon: Zs,
	class: "signal-fair"
} : {
	icon: Qs,
	class: "signal-weak"
}, $ = class extends _ {
	constructor() {
		super(...arguments), this.logger = console, this._state = "DASHBOARD", this._installErase = !1, this._installConfirmed = !1, this._provisionForce = !1, this._wasProvisioned = !1, this._busy = !1, this._selectedSsid = null, this._manualSsid = "", this._bodyOverflow = null, this._handleDisconnect = () => {
			this._state = "ERROR", this._error = "Disconnected";
		};
	}
	render() {
		if (!this.port) return T``;
		let e, t, n = !1;
		return this._client === void 0 && this._state !== "INSTALL" && this._state !== "LOGS" ? this._error ? [e, t] = this._renderError(this._error) : t = this._renderProgress("Connecting") : this._state === "INSTALL" ? [e, t, n] = this._renderInstall() : this._state === "ASK_ERASE" ? [e, t] = this._renderAskErase() : this._state === "ERROR" ? [e, t] = this._renderError(this._error) : this._state === "DASHBOARD" ? [e, t, n] = this._client ? this._renderDashboard() : this._renderDashboardNoImprov() : this._state === "PROVISION" ? [e, t] = this._renderProvision() : this._state === "LOGS" && ([e, t] = this._renderLogs()), T`
      <ew-dialog
        open
        .heading=${e}
        @cancel=${this._preventDefault}
        @closed=${this._handleClose}
      >
        ${e ? T`<div slot="headline">${e}</div>` : ""}
        ${n ? T`
              <ew-icon-button slot="headline" @click=${this._closeDialog}>
                ${Js}
              </ew-icon-button>
            ` : ""}
        ${t}
      </ew-dialog>
    `;
	}
	_renderProgress(e, t) {
		return T`
      <ewt-page-progress
        slot="content"
        .label=${e}
        .progress=${t}
      ></ewt-page-progress>
    `;
	}
	_renderError(e) {
		return ["Error", T`
      <ewt-page-message
        slot="content"
        .icon=${Oc}
        .label=${e}
      ></ewt-page-message>
      <div slot="actions">
        <ew-text-button @click=${this._closeDialog}>Close</ew-text-button>
      </div>
    `];
	}
	_renderDashboard() {
		let e = this._manifest.name, t;
		return t = T`
      <div slot="content">
        <ew-list>
          <ew-list-item>
            <div slot="headline">Connected to ${this._info.name}</div>
            <div slot="supporting-text">
              ${this._info.firmware}&nbsp;${this._info.version}
              (${this._info.chipFamily})
            </div>
          </ew-list-item>
          ${this._isSameVersion ? "" : T`
                <ew-list-item
                  type="button"
                  @click=${() => {
			this._isSameFirmware ? this._startInstall(!1) : this._manifest.new_install_prompt_erase ? this._state = "ASK_ERASE" : this._startInstall(!0);
		}}
                >
                  ${tc}
                  <div slot="headline">
                    ${this._isSameFirmware ? `Update ${this._manifest.name}` : `Install ${this._manifest.name}`}
                  </div>
                </ew-list-item>
              `}
          ${this._client.nextUrl === void 0 ? "" : T`
                <ew-list-item
                  type="link"
                  href=${this._client.nextUrl}
                  target="_blank"
                >
                  ${ic}
                  <div slot="headline">Visit Device</div>
                </ew-list-item>
              `}
          ${!this._manifest.home_assistant_domain || this._client.state !== uc.PROVISIONED ? "" : T`
                <ew-list-item
                  type="link"
                  href=${`https://my.home-assistant.io/redirect/config_flow_start/?domain=${this._manifest.home_assistant_domain}`}
                  target="_blank"
                >
                  ${ac}
                  <div slot="headline">Add to Home Assistant</div>
                </ew-list-item>
              `}
          <ew-list-item
            type="button"
            @click=${() => {
			this._state = "PROVISION", this._client.state === uc.PROVISIONED && (this._provisionForce = !0);
		}}
          >
            ${nc}
            <div slot="headline">
              ${this._client.state === uc.PROVISIONED ? "Change Wi-Fi" : "Connect to Wi-Fi"}
            </div>
          </ew-list-item>
          <ew-list-item
            type="button"
            @click=${async () => {
			let e = this._client;
			e && (await this._closeClientWithoutEvents(e), await dt(100)), this._client = void 0, this._state = "LOGS";
		}}
          >
            ${rc}
            <div slot="headline">Logs & Console</div>
          </ew-list-item>
          ${this._isSameFirmware && this._manifest.funding_url ? T`
                <ew-list-item
                  type="link"
                  href=${this._manifest.funding_url}
                  target="_blank"
                >
                  ${sc}
                  <div slot="headline">Fund Development</div>
                </ew-list-item>
              ` : ""}
          ${this._isSameVersion ? T`
                <ew-list-item
                  type="button"
                  class="danger"
                  @click=${() => this._startInstall(!0)}
                >
                  ${oc}
                  <div slot="headline">Erase User Data</div>
                </ew-list-item>
              ` : ""}
        </ew-list>
      </div>
    `, [
			e,
			t,
			!0
		];
	}
	_renderDashboardNoImprov() {
		let e = this._manifest.name, t;
		return t = T`
      <div slot="content">
        <ew-list>
          <ew-list-item
            type="button"
            @click=${() => {
			this._manifest.new_install_prompt_erase ? this._state = "ASK_ERASE" : this._startInstall(!0);
		}}
          >
            ${tc}
            <div slot="headline">${`Install ${this._manifest.name}`}</div>
          </ew-list-item>
          <ew-list-item
            type="button"
            @click=${async () => {
			this._client = void 0, this._state = "LOGS";
		}}
          >
            ${rc}
            <div slot="headline">Logs & Console</div>
          </ew-list-item>
        </ew-list>
      </div>
    `, [
			e,
			t,
			!0
		];
	}
	_renderProvision() {
		let e = "Configure Wi-Fi", t;
		if (this._busy) return [e, this._renderProgress("Trying to connect")];
		if (this._client.state === uc.STOPPED) e = void 0, t = T`
        <div slot="content">
          <ewt-page-message
            .icon=${Oc}
            .label=${T`The connected device has Wi-Fi turned off, so it can't
              be configured right now.<br />Enable the device's Wi-Fi, then try
              again.`}
          ></ewt-page-message>
        </div>
        <div slot="actions">
          <ew-text-button
            @click=${() => {
			this._state = "DASHBOARD";
		}}
          >
            Back
          </ew-text-button>
        </div>
      `;
		else if (!this._provisionForce && this._client.state === uc.PROVISIONED) {
			e = void 0;
			let n = !this._wasProvisioned && (this._client.nextUrl !== void 0 || "home_assistant_domain" in this._manifest);
			t = T`
        <div slot="content">
          <ewt-page-message
            .icon=${kc}
            label="Device connected to the network!"
          ></ewt-page-message>
          ${n ? T`
                <ew-list>
                  ${this._client.nextUrl === void 0 ? "" : T`
                        <ew-list-item
                          type="link"
                          href=${this._client.nextUrl}
                          target="_blank"
                          @click=${() => {
				this._state = "DASHBOARD";
			}}
                        >
                          ${ic}
                          <div slot="headline">Visit Device</div>
                        </ew-list-item>
                      `}
                  ${this._manifest.home_assistant_domain ? T`
                        <ew-list-item
                          type="link"
                          href=${`https://my.home-assistant.io/redirect/config_flow_start/?domain=${this._manifest.home_assistant_domain}`}
                          target="_blank"
                          @click=${() => {
				this._state = "DASHBOARD";
			}}
                        >
                          ${ac}
                          <div slot="headline">Add to Home Assistant</div>
                        </ew-list-item>
                      ` : ""}
                  <ew-list-item
                    type="button"
                    @click=${() => {
				this._state = "DASHBOARD";
			}}
                  >
                    <div slot="start" class="fake-icon"></div>
                    <div slot="headline">Skip</div>
                  </ew-list-item>
                </ew-list>
              ` : ""}
        </div>

        ${n ? "" : T`
              <div slot="actions">
                <ew-text-button
                  @click=${() => {
				this._state = "DASHBOARD";
			}}
                >
                  Continue
                </ew-text-button>
              </div>
            `}
      `;
		} else if (this._ssids === void 0) t = this._renderProgress("Scanning for networks");
		else {
			let e;
			switch (this._client.error) {
				case 3:
					e = "Unable to connect";
					break;
				case 254:
					e = "Timeout";
					break;
				case 0:
				case 2: break;
				default: e = `Unknown error (${this._client.error})`;
			}
			let n = this._ssids?.find((e) => e.name === this._selectedSsid);
			t = T`
        <div slot="content">
          <div>Connect your device to the network to start using it.</div>
          ${e ? T`<p class="error">${e}</p>` : ""}
          ${this._ssids === null ? "" : T`
                <ew-filled-select
                  menu-positioning="fixed"
                  label="Network"
                  @change=${(e) => {
				let t = e.target.selectedIndex;
				this._selectedSsid = t === this._ssids.length ? null : this._ssids[t].name, this._manualSsid = "";
			}}
                >
                  ${this._ssids.map((e) => {
				let t = Mc(e.rssi);
				return T`
                      <ew-select-option
                        .selected=${n === e}
                        .value=${e.name}
                      >
                        <span slot="start" class=${t.class}>
                          ${t.icon}
                        </span>
                        <span slot="headline">${e.name}</span>
                        <span slot="end" class="network-details">
                          <span class="signal-strength">${e.rssi}dB</span>
                          <span
                            class=${e.secured ? "lock-secured" : "lock-unsecured"}
                          >
                            ${e.secured ? $s : ec}
                          </span>
                        </span>
                      </ew-select-option>
                    `;
			})}
                  <ew-divider></ew-divider>
                  <ew-select-option .selected=${!n}>
                    Join other…
                  </ew-select-option>
                </ew-filled-select>
              `}
          ${n ? "" : T`
                  <ew-filled-text-field
                    label="Network Name"
                    name="ssid"
                    .value=${this._manualSsid}
                  ></ew-filled-text-field>
                `}
          ${!n || n.secured ? T`
                <ew-filled-text-field
                  label="Password"
                  name="password"
                  type="password"
                  @keydown=${(e) => {
				e.key === "Enter" && this._doProvision();
			}}
                ></ew-filled-text-field>
              ` : ""}
        </div>
        <div slot="actions">
          <ew-text-button
            @click=${() => {
				this._state = "DASHBOARD";
			}}
          >
            ${this._installState && this._installErase ? "Skip" : "Back"}
          </ew-text-button>
          <ew-text-button @click=${this._doProvision}>Connect</ew-text-button>
        </div>
      `;
		}
		return [e, t];
	}
	_renderAskErase() {
		return ["Erase device", T`
      <div slot="content">
        <div>
          Do you want to erase the device before installing
          ${this._manifest.name}? All data on the device will be lost.
        </div>
        <label class="formfield">
          <ew-checkbox touch-target="wrapper" class="danger"></ew-checkbox>
          Erase device
        </label>
      </div>
      <div slot="actions">
        <ew-text-button
          @click=${() => {
			this._state = "DASHBOARD";
		}}
        >
          Back
        </ew-text-button>
        <ew-text-button
          @click=${() => {
			let e = this.shadowRoot.querySelector("ew-checkbox");
			this._startInstall(e.checked);
		}}
        >
          Next
        </ew-text-button>
      </div>
    `];
	}
	_renderInstall() {
		let e, t, n = !this._installErase && this._isSameFirmware;
		if (!this._installConfirmed && this._isSameVersion) e = "Erase User Data", t = T`
        <div slot="content">
          Do you want to reset your device and erase all user data from your
          device?
        </div>
        <div slot="actions">
          <ew-text-button class="danger" @click=${this._confirmInstall}>
            Erase User Data
          </ew-text-button>
        </div>
      `;
		else if (!this._installConfirmed) {
			e = "Confirm Installation";
			let r = n ? "update to" : "install";
			t = T`
        <div slot="content">
          ${n ? T`Your device is running
                ${this._info.firmware}&nbsp;${this._info.version}.<br /><br />` : ""}
          Do you want to ${r}
          ${this._manifest.name}&nbsp;${this._manifest.version}?
          ${this._installErase ? T`<br /><br />All data on the device will be erased.` : ""}
        </div>
        <div slot="actions">
          <ew-text-button
            @click=${() => {
				this._state = "DASHBOARD";
			}}
          >
            Back
          </ew-text-button>
          <ew-text-button @click=${this._confirmInstall}>
            Install
          </ew-text-button>
        </div>
      `;
		} else if (!this._installState || this._installState.state === "initializing" || this._installState.state === "preparing") e = "Installing", t = this._renderProgress("Preparing installation");
		else if (this._installState.state === "erasing") e = "Installing", t = this._renderProgress("Erasing");
		else if (this._installState.state === "writing" || this._installState.state === "finished" && this._client === void 0) {
			e = "Installing";
			let n, r;
			this._installState.state === "finished" ? r = "Wrapping up" : this._installState.details.percentage < 4 ? r = "Installing" : n = this._installState.details.percentage, t = this._renderProgress(T`
          ${r ? T`${r}<br />` : ""}
          <br />
          This will take
          ${this._installState.chipFamily === "ESP8266" ? "a minute" : "2 minutes"}.<br />
          Keep this page visible to prevent slow down
        `, n);
		} else if (this._installState.state === "finished") {
			e = void 0;
			let n = this._client !== null;
			t = T`
        <ewt-page-message
          slot="content"
          .icon=${kc}
          label="Installation complete!"
        ></ewt-page-message>

        <div slot="actions">
          <ew-text-button
            @click=${() => {
				this._state = n && this._installErase ? "PROVISION" : "DASHBOARD";
			}}
          >
            Next
          </ew-text-button>
        </div>
      `;
		} else this._installState.state === "error" && (e = "Installation failed", t = T`
        <ewt-page-message
          slot="content"
          .icon=${Oc}
          .label=${this._installState.message}
        ></ewt-page-message>
        <div slot="actions">
          <ew-text-button
            @click=${async () => {
			this._initialize(), this._state = "DASHBOARD";
		}}
          >
            Back
          </ew-text-button>
        </div>
      `);
		return [
			e,
			t,
			!1
		];
	}
	_renderLogs() {
		let e;
		return e = T`
      <div slot="content">
        <ewt-console .port=${this.port} .logger=${this.logger}></ewt-console>
      </div>
      <div slot="actions">
        <ew-text-button
          @click=${async () => {
			await this.shadowRoot.querySelector("ewt-console").reset();
		}}
        >
          Reset Device
        </ew-text-button>
        <ew-text-button
          @click=${() => {
			Tc(this.shadowRoot.querySelector("ewt-console").logs(), "esp-web-tools-logs.txt"), this.shadowRoot.querySelector("ewt-console").reset();
		}}
        >
          Download Logs
        </ew-text-button>
        <ew-text-button
          @click=${async () => {
			await this.shadowRoot.querySelector("ewt-console").disconnect(), this._state = "DASHBOARD", this._initialize();
		}}
        >
          Back
        </ew-text-button>
      </div>
    `, ["Logs", e];
	}
	willUpdate(e) {
		e.has("_state") && (this._state !== "ERROR" && (this._error = void 0), this._state === "PROVISION" ? this._ssids = void 0 : this._provisionForce = !1, this._state === "INSTALL" && (this._installConfirmed = !1, this._installState = void 0));
	}
	get _showsProvisionForm() {
		let e = this._client?.state;
		return e !== void 0 && e !== uc.STOPPED && (this._provisionForce || e !== uc.PROVISIONED);
	}
	_syncScanning() {
		let e = this._state === "PROVISION" && !this._busy && this._showsProvisionForm;
		e !== !!this._unsubSSIDs && (e ? (this._scanGraceTimeout = setTimeout(() => {
			this._scanGraceTimeout = void 0, this._ssids === void 0 && (this._ssids = [], this._selectedSsid = null);
		}, Ac), this._unsubSSIDs = this._client.subscribeSSIDs((e) => {
			this._ssids === void 0 && e?.length === 0 && this._scanGraceTimeout || e === null && this._ssids || (this._ssids === void 0 ? this._selectedSsid = e === null ? null : jc(e) : this._selectedSsid !== null && !e?.some((e) => e.name === this._selectedSsid) && (this._manualSsid = this._selectedSsid, this._selectedSsid = null), this._ssids = e);
		})) : this._stopScanning());
	}
	async _stopScanning() {
		clearTimeout(this._scanGraceTimeout), this._scanGraceTimeout = void 0;
		let e = this._unsubSSIDs;
		e && (this._unsubSSIDs = void 0, await e());
	}
	firstUpdated(e) {
		super.firstUpdated(e), this._bodyOverflow = document.body.style.overflow, document.body.style.overflow = "hidden", this._initialize();
	}
	updated(e) {
		super.updated(e), e.has("_state") && this.setAttribute("state", this._state), this._syncScanning(), this._state === "PROVISION" && (e.has("_selectedSsid") && this._selectedSsid === null ? this._focusFormElement("ew-filled-text-field[name=ssid]") : e.has("_ssids") && e.get("_ssids") === void 0 && this._focusFormElement());
	}
	_focusFormElement(e = "ew-filled-text-field, ew-filled-select") {
		let t = this.shadowRoot.querySelector(e);
		t && t.updateComplete.then(() => setTimeout(() => t.focus(), 100));
	}
	async _initialize(e = !1) {
		if (this.port.readable === null || this.port.writable === null) {
			this._state = "ERROR", this._error = "Serial port is not readable/writable. Close any other application using it and try again.";
			return;
		}
		try {
			this._manifest = await Dc(this.manifestPath);
		} catch {
			this._state = "ERROR", this._error = "Failed to download manifest";
			return;
		}
		if (this._manifest.new_install_improv_wait_time === 0) {
			this._client = null;
			return;
		}
		let t = new xc(this.port, this.logger);
		t.addEventListener("state-changed", () => {
			this.requestUpdate();
		}), t.addEventListener("error-changed", () => this.requestUpdate());
		try {
			let n = e ? this._manifest.new_install_improv_wait_time === void 0 ? 1e4 : this._manifest.new_install_improv_wait_time * 1e3 : 1500;
			this._info = await t.initialize(n), this._client = t, t.addEventListener("disconnect", this._handleDisconnect);
		} catch (e) {
			this._info = void 0, e instanceof fc ? (this._state = "ERROR", this._error = "Serial port is not ready. Close any other application using it and try again.") : (this._client = null, this.logger.error("Improv initialization failed.", e));
		}
	}
	_startInstall(e) {
		this._state = "INSTALL", this._installErase = e, this._installConfirmed = !1;
	}
	async _confirmInstall() {
		this._installConfirmed = !0, this._installState = void 0, this._client && await this._closeClientWithoutEvents(this._client), this._client = void 0, await this.port.close(), Cc((e) => {
			this._installState = e, e.state === "finished" ? dt(100).then(() => this.port.open({
				baudRate: 115200,
				bufferSize: 8192
			})).then(() => this._initialize(!0)).then(() => this.requestUpdate()) : e.state === "error" && dt(100).then(() => this.port.open({
				baudRate: 115200,
				bufferSize: 8192
			}));
		}, this.port, this.manifestPath, this._manifest, this._installErase);
	}
	async _doProvision() {
		let e = this._selectedSsid === null ? this.shadowRoot.querySelector("ew-filled-text-field[name=ssid]").value : this._selectedSsid, t = this.shadowRoot.querySelector("ew-filled-text-field[name=password]")?.value || "";
		this._busy = !0, this._wasProvisioned = this._client.state === uc.PROVISIONED, await this._stopScanning();
		try {
			await this._client.provision(e, t, 45e3);
		} catch {
			return;
		} finally {
			this._busy = !1, this._provisionForce = !1;
		}
	}
	_closeDialog() {
		this.shadowRoot.querySelector("ew-dialog").close();
	}
	async _handleClose() {
		this._client && await this._closeClientWithoutEvents(this._client), Ec(this, "closed"), document.body.style.overflow = this._bodyOverflow, this.parentNode.removeChild(this);
	}
	get _isSameFirmware() {
		return this._info ? this.overrides?.checkSameFirmware ? this.overrides.checkSameFirmware(this._manifest, this._info) : this._info.firmware === this._manifest.name : !1;
	}
	get _isSameVersion() {
		return this._isSameFirmware && this._info.version === this._manifest.version;
	}
	async _closeClientWithoutEvents(e) {
		await this._stopScanning(), e.removeEventListener("disconnect", this._handleDisconnect), await e.close();
	}
	_preventDefault(e) {
		e.preventDefault();
	}
};
$.styles = [m, y`
      :host {
        --mdc-dialog-max-width: 390px;
      }
      div[slot="headline"] {
        padding-right: 48px;
      }
      ew-icon-button[slot="headline"] {
        position: absolute;
        right: 4px;
        top: 8px;
      }
      ew-icon-button[slot="headline"] svg {
        padding: 8px;
        color: var(--text-color);
      }
      .dialog-nav svg {
        color: var(--text-color);
      }
      .table-row {
        display: flex;
      }
      .table-row.last {
        margin-bottom: 16px;
      }
      .table-row svg {
        width: 20px;
        margin-right: 8px;
      }
      ew-filled-text-field,
      ew-filled-select {
        display: block;
        margin-top: 16px;
      }
      ew-select-option svg {
        width: 24px;
        height: 24px;
        display: block;
      }
      .network-details {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: 16px;
        color: var(--text-color);
        font-size: 12px;
      }
      .signal-excellent,
      .signal-good,
      .lock-secured {
        color: #34a853;
      }
      .signal-fair {
        color: #fbbc04;
      }
      .signal-weak,
      .lock-unsecured {
        color: var(--danger-color);
      }
      label.formfield {
        display: inline-flex;
        align-items: center;
        padding-right: 8px;
      }
      ew-list {
        margin: 0 -24px;
        padding: 0;
      }
      ew-list-item svg {
        height: 24px;
      }
      ewt-page-message + ew-list {
        padding-top: 16px;
      }
      .fake-icon {
        width: 24px;
      }
      .error {
        color: var(--danger-color);
      }
      .danger {
        --mdc-theme-primary: var(--danger-color);
        --mdc-theme-secondary: var(--danger-color);
        --md-sys-color-primary: var(--danger-color);
        --md-sys-color-on-surface: var(--danger-color);
      }
      button.link {
        background: none;
        color: inherit;
        border: none;
        padding: 0;
        font: inherit;
        text-align: left;
        text-decoration: underline;
        cursor: pointer;
      }
      :host([state="LOGS"]) ew-dialog {
        max-width: 90vw;
        max-height: 90vh;
      }
      ewt-console {
        width: calc(80vw - 48px);
        height: calc(90vh - 168px);
      }
    `], d([g()], $.prototype, "_client", void 0), d([g()], $.prototype, "_state", void 0), d([g()], $.prototype, "_installErase", void 0), d([g()], $.prototype, "_installConfirmed", void 0), d([g()], $.prototype, "_installState", void 0), d([g()], $.prototype, "_provisionForce", void 0), d([g()], $.prototype, "_error", void 0), d([g()], $.prototype, "_busy", void 0), d([g()], $.prototype, "_ssids", void 0), d([g()], $.prototype, "_selectedSsid", void 0), customElements.define("ewt-install-dialog", $);
export { $ as EwtInstallDialog, fe as n, lo as t };

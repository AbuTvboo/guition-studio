import { a as e, c as t, g as n, l as r, o as i, p as a, s as o, t as s } from "./class-map-7fYjXT0k.js";
// node_modules/@lit/reactive-element/decorators/base.js
var c = (e, t, n) => (n.configurable = !0, n.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, n), n);
// node_modules/@lit/reactive-element/decorators/query.js
function l(e, t) {
	return (n, r, i) => {
		let a = (t) => t.renderRoot?.querySelector(e) ?? null;
		if (t) {
			let { get: e, set: t } = typeof r == "object" ? n : i ?? (() => {
				let e = Symbol();
				return {
					get() {
						return this[e];
					},
					set(t) {
						this[e] = t;
					}
				};
			})();
			return c(n, r, { get() {
				let n = e.call(this);
				return n === void 0 && (n = a(this), (n !== null || this.hasUpdated) && t.call(this, n)), n;
			} });
		}
		return c(n, r, { get() {
			return a(this);
		} });
	};
}
// node_modules/@lit/reactive-element/decorators/query-assigned-elements.js
function u(e) {
	return (t, n) => {
		let { slot: r, selector: i } = e ?? {}, a = "slot" + (r ? `[name=${r}]` : ":not([name])");
		return c(t, n, { get() {
			let t = (this.renderRoot?.querySelector(a))?.assignedElements(e) ?? [];
			return i === void 0 ? t : t.filter((e) => e.matches(i));
		} });
	};
}
// node_modules/tslib/tslib.es6.mjs
function d(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
// node_modules/esp-web-tools/node_modules/@material/web/button/internal/shared-styles.js
var f = n`:host{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end);box-sizing:border-box;cursor:pointer;display:inline-flex;gap:8px;min-height:var(--_container-height);outline:none;padding-block:calc((var(--_container-height) - max(var(--_label-text-line-height),var(--_icon-size)))/2);padding-inline-start:var(--_leading-space);padding-inline-end:var(--_trailing-space);place-content:center;place-items:center;position:relative;font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);text-overflow:ellipsis;text-wrap:nowrap;user-select:none;-webkit-tap-highlight-color:rgba(0,0,0,0);vertical-align:top;--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}:host(:is([disabled],[soft-disabled])){cursor:default;pointer-events:none}.button{border-radius:inherit;cursor:inherit;display:inline-flex;align-items:center;justify-content:center;border:none;outline:none;-webkit-appearance:none;vertical-align:middle;background:rgba(0,0,0,0);text-decoration:none;min-width:calc(64px - var(--_leading-space) - var(--_trailing-space));width:100%;z-index:0;height:100%;font:inherit;color:var(--_label-text-color);padding:0;gap:inherit;text-transform:inherit}.button::-moz-focus-inner{padding:0;border:0}:host(:hover) .button{color:var(--_hover-label-text-color)}:host(:focus-within) .button{color:var(--_focus-label-text-color)}:host(:active) .button{color:var(--_pressed-label-text-color)}.background{background:var(--_container-color);border-radius:inherit;inset:0;position:absolute}.label{overflow:hidden}:is(.button,.label,.label slot),.label ::slotted(*){text-overflow:inherit}:host(:is([disabled],[soft-disabled])) .label{color:var(--_disabled-label-text-color);opacity:var(--_disabled-label-text-opacity)}:host(:is([disabled],[soft-disabled])) .background{background:var(--_disabled-container-color);opacity:var(--_disabled-container-opacity)}@media(forced-colors: active){.background{border:1px solid CanvasText}:host(:is([disabled],[soft-disabled])){--_disabled-icon-color: GrayText;--_disabled-icon-opacity: 1;--_disabled-container-opacity: 1;--_disabled-label-text-color: GrayText;--_disabled-label-text-opacity: 1}}:host([has-icon]:not([trailing-icon])){padding-inline-start:var(--_with-leading-icon-leading-space);padding-inline-end:var(--_with-leading-icon-trailing-space)}:host([has-icon][trailing-icon]){padding-inline-start:var(--_with-trailing-icon-leading-space);padding-inline-end:var(--_with-trailing-icon-trailing-space)}::slotted([slot=icon]){display:inline-flex;position:relative;writing-mode:horizontal-tb;fill:currentColor;flex-shrink:0;color:var(--_icon-color);font-size:var(--_icon-size);inline-size:var(--_icon-size);block-size:var(--_icon-size)}:host(:hover) ::slotted([slot=icon]){color:var(--_hover-icon-color)}:host(:focus-within) ::slotted([slot=icon]){color:var(--_focus-icon-color)}:host(:active) ::slotted([slot=icon]){color:var(--_pressed-icon-color)}:host(:is([disabled],[soft-disabled])) ::slotted([slot=icon]){color:var(--_disabled-icon-color);opacity:var(--_disabled-icon-opacity)}.touch{position:absolute;top:50%;height:48px;left:0;right:0;transform:translateY(-50%)}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_container-height))/2) 0}:host([touch-target=none]) .touch{display:none}
`, p = Symbol("attachableController"), m = new MutationObserver((e) => {
	for (let t of e) t.target[p]?.hostConnected();
}), h = class {
	get htmlFor() {
		return this.host.getAttribute("for");
	}
	set htmlFor(e) {
		e === null ? this.host.removeAttribute("for") : this.host.setAttribute("for", e);
	}
	get control() {
		return this.host.hasAttribute("for") ? !this.htmlFor || !this.host.isConnected ? null : this.host.getRootNode().querySelector(`#${this.htmlFor}`) : this.currentControl || this.host.parentElement;
	}
	set control(e) {
		e ? this.attach(e) : this.detach();
	}
	constructor(e, t) {
		this.host = e, this.onControlChange = t, this.currentControl = null, e.addController(this), e[p] = this, m?.observe(e, { attributeFilter: ["for"] });
	}
	attach(e) {
		e !== this.currentControl && (this.setCurrentControl(e), this.host.removeAttribute("for"));
	}
	detach() {
		this.setCurrentControl(null), this.host.setAttribute("for", "");
	}
	hostConnected() {
		this.setCurrentControl(this.control);
	}
	hostDisconnected() {
		this.setCurrentControl(null);
	}
	setCurrentControl(e) {
		this.onControlChange(this.currentControl, e), this.currentControl = e;
	}
}, ee = [
	"focusin",
	"focusout",
	"pointerdown"
], g = class extends t {
	constructor() {
		super(...arguments), this.visible = !1, this.inward = !1, this.attachableController = new h(this, this.onControlChange.bind(this));
	}
	get htmlFor() {
		return this.attachableController.htmlFor;
	}
	set htmlFor(e) {
		this.attachableController.htmlFor = e;
	}
	get control() {
		return this.attachableController.control;
	}
	set control(e) {
		this.attachableController.control = e;
	}
	attach(e) {
		this.attachableController.attach(e);
	}
	detach() {
		this.attachableController.detach();
	}
	connectedCallback() {
		super.connectedCallback(), this.setAttribute("aria-hidden", "true");
	}
	handleEvent(e) {
		if (!e[_]) {
			switch (e.type) {
				default: return;
				case "focusin":
					this.visible = this.control?.matches(":focus-visible") ?? !1;
					break;
				case "focusout":
				case "pointerdown": this.visible = !1;
			}
			e[_] = !0;
		}
	}
	onControlChange(e, t) {
		for (let n of ee) e?.removeEventListener(n, this), t?.addEventListener(n, this);
	}
	update(e) {
		e.has("visible") && this.dispatchEvent(new Event("visibility-changed")), super.update(e);
	}
};
d([i({
	type: Boolean,
	reflect: !0
})], g.prototype, "visible", void 0), d([i({
	type: Boolean,
	reflect: !0
})], g.prototype, "inward", void 0);
var _ = Symbol("handledByFocusRing"), te = n`:host{animation-delay:0s,calc(var(--md-focus-ring-duration, 600ms)*.25);animation-duration:calc(var(--md-focus-ring-duration, 600ms)*.25),calc(var(--md-focus-ring-duration, 600ms)*.75);animation-timing-function:cubic-bezier(0.2, 0, 0, 1);box-sizing:border-box;color:var(--md-focus-ring-color, var(--md-sys-color-secondary, #625b71));display:none;pointer-events:none;position:absolute}:host([visible]){display:flex}:host(:not([inward])){animation-name:outward-grow,outward-shrink;border-end-end-radius:calc(var(--md-focus-ring-shape-end-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-end-start-radius:calc(var(--md-focus-ring-shape-end-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-start-end-radius:calc(var(--md-focus-ring-shape-start-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-start-start-radius:calc(var(--md-focus-ring-shape-start-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));inset:calc(-1*var(--md-focus-ring-outward-offset, 2px));outline:var(--md-focus-ring-width, 3px) solid currentColor}:host([inward]){animation-name:inward-grow,inward-shrink;border-end-end-radius:calc(var(--md-focus-ring-shape-end-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-end-start-radius:calc(var(--md-focus-ring-shape-end-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-start-end-radius:calc(var(--md-focus-ring-shape-start-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-start-start-radius:calc(var(--md-focus-ring-shape-start-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border:var(--md-focus-ring-width, 3px) solid currentColor;inset:var(--md-focus-ring-inward-offset, 0px)}@keyframes outward-grow{from{outline-width:0}to{outline-width:var(--md-focus-ring-active-width, 8px)}}@keyframes outward-shrink{from{outline-width:var(--md-focus-ring-active-width, 8px)}}@keyframes inward-grow{from{border-width:0}to{border-width:var(--md-focus-ring-active-width, 8px)}}@keyframes inward-shrink{from{border-width:var(--md-focus-ring-active-width, 8px)}}@media(prefers-reduced-motion){:host{animation:none}}
`, v = class extends g {};
v.styles = [te], v = d([o("md-focus-ring")], v);
// node_modules/esp-web-tools/node_modules/@material/web/internal/motion/animation.js
var y = {
	STANDARD: "cubic-bezier(0.2, 0, 0, 1)",
	STANDARD_ACCELERATE: "cubic-bezier(.3,0,1,1)",
	STANDARD_DECELERATE: "cubic-bezier(0,0,0,1)",
	EMPHASIZED: "cubic-bezier(.3,0,0,1)",
	EMPHASIZED_ACCELERATE: "cubic-bezier(.3,0,.8,.15)",
	EMPHASIZED_DECELERATE: "cubic-bezier(.05,.7,.1,1)"
};
function b() {
	let e = null;
	return {
		start() {
			return e?.abort(), e = new AbortController(), e.signal;
		},
		finish() {
			e = null;
		}
	};
}
// node_modules/esp-web-tools/node_modules/@material/web/ripple/internal/ripple.js
var x = 450, S = 225, ne = .2, re = 10, ie = 75, C = .35, ae = "::after", oe = "forwards", w;
(function(e) {
	e[e.INACTIVE = 0] = "INACTIVE", e[e.TOUCH_DELAY = 1] = "TOUCH_DELAY", e[e.HOLDING = 2] = "HOLDING", e[e.WAITING_FOR_CLICK = 3] = "WAITING_FOR_CLICK";
})(w ||= {});
var se = [
	"click",
	"contextmenu",
	"pointercancel",
	"pointerdown",
	"pointerenter",
	"pointerleave",
	"pointerup"
], T = 150, E = window.matchMedia("(forced-colors: active)"), D = class extends t {
	constructor() {
		super(...arguments), this.disabled = !1, this.hovered = !1, this.pressed = !1, this.rippleSize = "", this.rippleScale = "", this.initialSize = 0, this.state = w.INACTIVE, this.attachableController = new h(this, this.onControlChange.bind(this));
	}
	get htmlFor() {
		return this.attachableController.htmlFor;
	}
	set htmlFor(e) {
		this.attachableController.htmlFor = e;
	}
	get control() {
		return this.attachableController.control;
	}
	set control(e) {
		this.attachableController.control = e;
	}
	attach(e) {
		this.attachableController.attach(e);
	}
	detach() {
		this.attachableController.detach();
	}
	connectedCallback() {
		super.connectedCallback(), this.setAttribute("aria-hidden", "true");
	}
	render() {
		let e = {
			hovered: this.hovered,
			pressed: this.pressed
		};
		return a`<div class="surface ${s(e)}"></div>`;
	}
	update(e) {
		e.has("disabled") && this.disabled && (this.hovered = !1, this.pressed = !1), super.update(e);
	}
	handlePointerenter(e) {
		this.shouldReactToEvent(e) && (this.hovered = !0);
	}
	handlePointerleave(e) {
		this.shouldReactToEvent(e) && (this.hovered = !1, this.state !== w.INACTIVE && this.endPressAnimation());
	}
	handlePointerup(e) {
		this.shouldReactToEvent(e) && (this.state === w.HOLDING ? this.state = w.WAITING_FOR_CLICK : this.state === w.TOUCH_DELAY && (this.state = w.WAITING_FOR_CLICK, this.startPressAnimation(this.rippleStartEvent)));
	}
	async handlePointerdown(e) {
		this.shouldReactToEvent(e) && (this.rippleStartEvent = e, this.isTouch(e) ? (this.state = w.TOUCH_DELAY, await new Promise((e) => {
			setTimeout(e, T);
		}), this.state === w.TOUCH_DELAY && (this.state = w.HOLDING, this.startPressAnimation(e))) : (this.state = w.WAITING_FOR_CLICK, this.startPressAnimation(e)));
	}
	handleClick() {
		this.disabled || (this.state === w.WAITING_FOR_CLICK ? this.endPressAnimation() : this.state === w.INACTIVE && (this.startPressAnimation(), this.endPressAnimation()));
	}
	handlePointercancel(e) {
		this.shouldReactToEvent(e) && this.endPressAnimation();
	}
	handleContextmenu() {
		this.disabled || this.endPressAnimation();
	}
	determineRippleSize() {
		let { height: e, width: t } = this.getBoundingClientRect(), n = Math.max(e, t), r = Math.max(C * n, ie), i = this.currentCSSZoom ?? 1, a = Math.floor(n * ne / i), o = Math.sqrt(t ** 2 + e ** 2) + re;
		this.initialSize = a;
		let s = (o + r) / a;
		this.rippleScale = `${s / i}`, this.rippleSize = `${a}px`;
	}
	getNormalizedPointerEventCoords(e) {
		let { scrollX: t, scrollY: n } = window, { left: r, top: i } = this.getBoundingClientRect(), a = t + r, o = n + i, { pageX: s, pageY: c } = e, l = this.currentCSSZoom ?? 1;
		return {
			x: (s - a) / l,
			y: (c - o) / l
		};
	}
	getTranslationCoordinates(e) {
		let { height: t, width: n } = this.getBoundingClientRect(), r = this.currentCSSZoom ?? 1, i = {
			x: (n / r - this.initialSize) / 2,
			y: (t / r - this.initialSize) / 2
		}, a;
		return a = e instanceof PointerEvent ? this.getNormalizedPointerEventCoords(e) : {
			x: n / r / 2,
			y: t / r / 2
		}, a = {
			x: a.x - this.initialSize / 2,
			y: a.y - this.initialSize / 2
		}, {
			startPoint: a,
			endPoint: i
		};
	}
	startPressAnimation(e) {
		if (!this.mdRoot) return;
		this.pressed = !0, this.growAnimation?.cancel(), this.determineRippleSize();
		let { startPoint: t, endPoint: n } = this.getTranslationCoordinates(e), r = `${t.x}px, ${t.y}px`, i = `${n.x}px, ${n.y}px`;
		this.growAnimation = this.mdRoot.animate({
			top: [0, 0],
			left: [0, 0],
			height: [this.rippleSize, this.rippleSize],
			width: [this.rippleSize, this.rippleSize],
			transform: [`translate(${r}) scale(1)`, `translate(${i}) scale(${this.rippleScale})`]
		}, {
			pseudoElement: ae,
			duration: x,
			easing: y.STANDARD,
			fill: oe
		});
	}
	async endPressAnimation() {
		this.rippleStartEvent = void 0, this.state = w.INACTIVE;
		let e = this.growAnimation, t = Infinity;
		typeof e?.currentTime == "number" ? t = e.currentTime : e?.currentTime && (t = e.currentTime.to("ms").value), t >= S ? this.pressed = !1 : (await new Promise((e) => {
			setTimeout(e, S - t);
		}), this.growAnimation === e && (this.pressed = !1));
	}
	shouldReactToEvent(e) {
		if (this.disabled || !e.isPrimary || this.rippleStartEvent && this.rippleStartEvent.pointerId !== e.pointerId) return !1;
		if (e.type === "pointerenter" || e.type === "pointerleave") return !this.isTouch(e);
		let t = e.buttons === 1;
		return this.isTouch(e) || t;
	}
	isTouch({ pointerType: e }) {
		return e === "touch";
	}
	async handleEvent(e) {
		if (!E?.matches) switch (e.type) {
			case "click":
				this.handleClick();
				break;
			case "contextmenu":
				this.handleContextmenu();
				break;
			case "pointercancel":
				this.handlePointercancel(e);
				break;
			case "pointerdown":
				await this.handlePointerdown(e);
				break;
			case "pointerenter":
				this.handlePointerenter(e);
				break;
			case "pointerleave":
				this.handlePointerleave(e);
				break;
			case "pointerup": this.handlePointerup(e);
		}
	}
	onControlChange(e, t) {
		for (let n of se) e?.removeEventListener(n, this), t?.addEventListener(n, this);
	}
};
d([i({
	type: Boolean,
	reflect: !0
})], D.prototype, "disabled", void 0), d([e()], D.prototype, "hovered", void 0), d([e()], D.prototype, "pressed", void 0), d([l(".surface")], D.prototype, "mdRoot", void 0);
// node_modules/esp-web-tools/node_modules/@material/web/ripple/internal/ripple-styles.js
var O = n`:host{display:flex;margin:auto;pointer-events:none}:host([disabled]){display:none}@media(forced-colors: active){:host{display:none}}:host,.surface{border-radius:inherit;position:absolute;inset:0;overflow:hidden}.surface{-webkit-tap-highlight-color:rgba(0,0,0,0)}.surface::before,.surface::after{content:"";opacity:0;position:absolute}.surface::before{background-color:var(--md-ripple-hover-color, var(--md-sys-color-on-surface, #1d1b20));inset:0;transition:opacity 15ms linear,background-color 15ms linear}.surface::after{background:radial-gradient(closest-side, var(--md-ripple-pressed-color, var(--md-sys-color-on-surface, #1d1b20)) max(100% - 70px, 65%), transparent 100%);transform-origin:center center;transition:opacity 375ms linear}.hovered::before{background-color:var(--md-ripple-hover-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-ripple-hover-opacity, 0.08)}.pressed::after{opacity:var(--md-ripple-pressed-opacity, 0.12);transition-duration:105ms}
`, k = class extends D {};
k.styles = [O], k = d([o("md-ripple")], k);
// node_modules/esp-web-tools/node_modules/@material/web/internal/aria/aria.js
var A = /* @__PURE__ */ "role.ariaAtomic.ariaAutoComplete.ariaBusy.ariaChecked.ariaColCount.ariaColIndex.ariaColSpan.ariaCurrent.ariaDisabled.ariaExpanded.ariaHasPopup.ariaHidden.ariaInvalid.ariaKeyShortcuts.ariaLabel.ariaLevel.ariaLive.ariaModal.ariaMultiLine.ariaMultiSelectable.ariaOrientation.ariaPlaceholder.ariaPosInSet.ariaPressed.ariaReadOnly.ariaRequired.ariaRoleDescription.ariaRowCount.ariaRowIndex.ariaRowSpan.ariaSelected.ariaSetSize.ariaSort.ariaValueMax.ariaValueMin.ariaValueNow.ariaValueText".split("."), j = A.map(N);
function M(e) {
	return j.includes(e);
}
function N(e) {
	return e.replace("aria", "aria-").replace(/Elements?/g, "").toLowerCase();
}
// node_modules/esp-web-tools/node_modules/@material/web/internal/aria/delegate.js
var P = Symbol("privateIgnoreAttributeChangesFor");
function F(e) {
	var t;
	class n extends e {
		constructor() {
			super(...arguments), this[t] = /* @__PURE__ */ new Set();
		}
		attributeChangedCallback(e, t, n) {
			if (!M(e)) {
				super.attributeChangedCallback(e, t, n);
				return;
			}
			if (this[P].has(e)) return;
			this[P].add(e), this.removeAttribute(e), this[P].delete(e);
			let r = L(e);
			n === null ? delete this.dataset[r] : this.dataset[r] = n, this.requestUpdate(L(e), t);
		}
		getAttribute(e) {
			return M(e) ? super.getAttribute(I(e)) : super.getAttribute(e);
		}
		removeAttribute(e) {
			super.removeAttribute(e), M(e) && (super.removeAttribute(I(e)), this.requestUpdate());
		}
	}
	return t = P, ce(n), n;
}
function ce(e) {
	for (let t of A) {
		let n = N(t), r = I(n), i = L(n);
		e.createProperty(t, {
			attribute: n,
			noAccessor: !0
		}), e.createProperty(Symbol(r), {
			attribute: r,
			noAccessor: !0
		}), Object.defineProperty(e.prototype, t, {
			configurable: !0,
			enumerable: !0,
			get() {
				return this.dataset[i] ?? null;
			},
			set(e) {
				let n = this.dataset[i] ?? null;
				e !== n && (e === null ? delete this.dataset[i] : this.dataset[i] = e, this.requestUpdate(t, n));
			}
		});
	}
}
function I(e) {
	return `data-${e}`;
}
function L(e) {
	return e.replace(/-\w/, (e) => e[1].toUpperCase());
}
// node_modules/esp-web-tools/node_modules/@material/web/labs/behaviors/element-internals.js
var R = Symbol("internals"), z = Symbol("privateInternals");
function B(e) {
	class t extends e {
		get [R]() {
			return this[z] || (this[z] = this.attachInternals()), this[z];
		}
	}
	return t;
}
// node_modules/esp-web-tools/node_modules/@material/web/internal/controller/form-submitter.js
function V(e) {
	e.addInitializer((e) => {
		let t = e;
		t.addEventListener("click", async (e) => {
			let { type: n, [R]: r } = t, { form: i } = r;
			i && n !== "button" && (await new Promise((e) => {
				setTimeout(e);
			}), e.defaultPrevented || (n === "reset" ? i.reset() : (i.addEventListener("submit", (e) => {
				Object.defineProperty(e, "submitter", {
					configurable: !0,
					enumerable: !0,
					get: () => t
				});
			}, {
				capture: !0,
				once: !0
			}), r.setFormValue(t.value), i.requestSubmit())));
		});
	});
}
// node_modules/esp-web-tools/node_modules/@material/web/internal/events/form-label-activation.js
function H(e) {
	let t = new MouseEvent("click", { bubbles: !0 });
	return e.dispatchEvent(t), t;
}
function U(e) {
	return e.currentTarget !== e.target || e.composedPath()[0] !== e.target || e.target.disabled ? !1 : !W(e);
}
function W(e) {
	let t = G;
	return t && (e.preventDefault(), e.stopImmediatePropagation()), le(), t;
}
var G = !1;
async function le() {
	G = !0, await null, G = !1;
}
// node_modules/esp-web-tools/node_modules/@material/web/button/internal/button.js
var ue = F(B(t)), K = class extends ue {
	get name() {
		return this.getAttribute("name") ?? "";
	}
	set name(e) {
		this.setAttribute("name", e);
	}
	get form() {
		return this[R].form;
	}
	constructor() {
		super(), this.disabled = !1, this.softDisabled = !1, this.href = "", this.download = "", this.target = "", this.trailingIcon = !1, this.hasIcon = !1, this.type = "submit", this.value = "", this.addEventListener("click", this.handleClick.bind(this));
	}
	focus() {
		this.buttonElement?.focus();
	}
	blur() {
		this.buttonElement?.blur();
	}
	render() {
		let e = this.disabled || this.softDisabled, t = this.href ? this.renderLink() : this.renderButton(), n = this.href ? "link" : "button";
		return a`
      ${this.renderElevationOrOutline?.()}
      <div class="background"></div>
      <md-focus-ring part="focus-ring" for=${n}></md-focus-ring>
      <md-ripple
        part="ripple"
        for=${n}
        ?disabled="${e}"></md-ripple>
      ${t}
    `;
	}
	renderButton() {
		let { ariaLabel: e, ariaHasPopup: t, ariaExpanded: n } = this;
		return a`<button
      id="button"
      class="button"
      ?disabled=${this.disabled}
      aria-disabled=${this.softDisabled || r}
      aria-label="${e || r}"
      aria-haspopup="${t || r}"
      aria-expanded="${n || r}">
      ${this.renderContent()}
    </button>`;
	}
	renderLink() {
		let { ariaLabel: e, ariaHasPopup: t, ariaExpanded: n } = this;
		return a`<a
      id="link"
      class="button"
      aria-label="${e || r}"
      aria-haspopup="${t || r}"
      aria-expanded="${n || r}"
      aria-disabled=${this.disabled || this.softDisabled || r}
      tabindex="${this.disabled && !this.softDisabled ? -1 : r}"
      href=${this.href}
      download=${this.download || r}
      target=${this.target || r}
      >${this.renderContent()}
    </a>`;
	}
	renderContent() {
		let e = a`<slot
      name="icon"
      @slotchange="${this.handleSlotChange}"></slot>`;
		return a`
      <span class="touch"></span>
      ${this.trailingIcon ? r : e}
      <span class="label"><slot></slot></span>
      ${this.trailingIcon ? e : r}
    `;
	}
	handleClick(e) {
		this.softDisabled || this.disabled && this.href ? (e.stopImmediatePropagation(), e.preventDefault()) : U(e) && this.buttonElement && (this.focus(), H(this.buttonElement));
	}
	handleSlotChange() {
		this.hasIcon = this.assignedIcons.length > 0;
	}
};
V(K), K.formAssociated = !0, K.shadowRootOptions = {
	mode: "open",
	delegatesFocus: !0
}, d([i({
	type: Boolean,
	reflect: !0
})], K.prototype, "disabled", void 0), d([i({
	type: Boolean,
	attribute: "soft-disabled",
	reflect: !0
})], K.prototype, "softDisabled", void 0), d([i()], K.prototype, "href", void 0), d([i()], K.prototype, "download", void 0), d([i()], K.prototype, "target", void 0), d([i({
	type: Boolean,
	attribute: "trailing-icon",
	reflect: !0
})], K.prototype, "trailingIcon", void 0), d([i({
	type: Boolean,
	attribute: "has-icon",
	reflect: !0
})], K.prototype, "hasIcon", void 0), d([i()], K.prototype, "type", void 0), d([i({ reflect: !0 })], K.prototype, "value", void 0), d([l(".button")], K.prototype, "buttonElement", void 0), d([u({
	slot: "icon",
	flatten: !0
})], K.prototype, "assignedIcons", void 0);
// node_modules/esp-web-tools/node_modules/@material/web/button/internal/text-button.js
var de = class extends K {}, fe = n`:host{--_container-height: var(--md-text-button-container-height, 40px);--_disabled-label-text-color: var(--md-text-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-text-button-disabled-label-text-opacity, 0.38);--_focus-label-text-color: var(--md-text-button-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-label-text-color: var(--md-text-button-hover-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-color: var(--md-text-button-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-opacity: var(--md-text-button-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-text-button-label-text-color, var(--md-sys-color-primary, #6750a4));--_label-text-font: var(--md-text-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-text-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-text-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-text-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_pressed-label-text-color: var(--md-text-button-pressed-label-text-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-color: var(--md-text-button-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity: var(--md-text-button-pressed-state-layer-opacity, 0.12);--_disabled-icon-color: var(--md-text-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-text-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-text-button-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-icon-color: var(--md-text-button-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-color: var(--md-text-button-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-size: var(--md-text-button-icon-size, 18px);--_pressed-icon-color: var(--md-text-button-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_container-shape-start-start: var(--md-text-button-container-shape-start-start, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-text-button-container-shape-start-end, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-text-button-container-shape-end-end, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-text-button-container-shape-end-start, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_leading-space: var(--md-text-button-leading-space, 12px);--_trailing-space: var(--md-text-button-trailing-space, 12px);--_with-leading-icon-leading-space: var(--md-text-button-with-leading-icon-leading-space, 12px);--_with-leading-icon-trailing-space: var(--md-text-button-with-leading-icon-trailing-space, 16px);--_with-trailing-icon-leading-space: var(--md-text-button-with-trailing-icon-leading-space, 16px);--_with-trailing-icon-trailing-space: var(--md-text-button-with-trailing-icon-trailing-space, 12px);--_container-color: none;--_disabled-container-color: none;--_disabled-container-opacity: 0}
`, q = class extends de {};
q.styles = [f, fe], customElements.define("ew-text-button", q);
// node_modules/esp-web-tools/node_modules/@material/web/divider/internal/divider.js
var J = class extends t {
	constructor() {
		super(...arguments), this.inset = !1, this.insetStart = !1, this.insetEnd = !1;
	}
};
d([i({
	type: Boolean,
	reflect: !0
})], J.prototype, "inset", void 0), d([i({
	type: Boolean,
	reflect: !0,
	attribute: "inset-start"
})], J.prototype, "insetStart", void 0), d([i({
	type: Boolean,
	reflect: !0,
	attribute: "inset-end"
})], J.prototype, "insetEnd", void 0);
// node_modules/esp-web-tools/node_modules/@material/web/divider/internal/divider-styles.js
var Y = n`:host{box-sizing:border-box;color:var(--md-divider-color, var(--md-sys-color-outline-variant, #cac4d0));display:flex;height:var(--md-divider-thickness, 1px);width:100%}:host([inset]),:host([inset-start]){padding-inline-start:16px}:host([inset]),:host([inset-end]){padding-inline-end:16px}:host::before{background:currentColor;content:"";height:100%;width:100%}@media(forced-colors: active){:host::before{background:CanvasText}}
`;
// node_modules/esp-web-tools/node_modules/@material/web/internal/events/redispatch-event.js
function X(e, t) {
	t.bubbles && (!e.shadowRoot || t.composed) && t.stopPropagation();
	let n = Reflect.construct(t.constructor, [t.type, t]), r = e.dispatchEvent(n);
	return r || t.preventDefault(), r;
}
// node_modules/esp-web-tools/node_modules/@material/web/divider/divider.js
var Z = class extends J {};
Z.styles = [Y], Z = d([o("md-divider")], Z);
// node_modules/esp-web-tools/node_modules/@material/web/dialog/internal/animations.js
var pe = {
	dialog: [[[{ transform: "translateY(-50px)" }, { transform: "translateY(0)" }], {
		duration: 500,
		easing: y.EMPHASIZED
	}]],
	scrim: [[[{ opacity: 0 }, { opacity: .32 }], {
		duration: 500,
		easing: "linear"
	}]],
	container: [[[{ opacity: 0 }, { opacity: 1 }], {
		duration: 50,
		easing: "linear",
		pseudoElement: "::before"
	}], [[{ height: "35%" }, { height: "100%" }], {
		duration: 500,
		easing: y.EMPHASIZED,
		pseudoElement: "::before"
	}]],
	headline: [[[
		{ opacity: 0 },
		{
			opacity: 0,
			offset: .2
		},
		{ opacity: 1 }
	], {
		duration: 250,
		easing: "linear",
		fill: "forwards"
	}]],
	content: [[[
		{ opacity: 0 },
		{
			opacity: 0,
			offset: .2
		},
		{ opacity: 1 }
	], {
		duration: 250,
		easing: "linear",
		fill: "forwards"
	}]],
	actions: [[[
		{ opacity: 0 },
		{
			opacity: 0,
			offset: .5
		},
		{ opacity: 1 }
	], {
		duration: 300,
		easing: "linear",
		fill: "forwards"
	}]]
}, me = {
	dialog: [[[{ transform: "translateY(0)" }, { transform: "translateY(-50px)" }], {
		duration: 150,
		easing: y.EMPHASIZED_ACCELERATE
	}]],
	scrim: [[[{ opacity: .32 }, { opacity: 0 }], {
		duration: 150,
		easing: "linear"
	}]],
	container: [[[{ height: "100%" }, { height: "35%" }], {
		duration: 150,
		easing: y.EMPHASIZED_ACCELERATE,
		pseudoElement: "::before"
	}], [[{ opacity: "1" }, { opacity: "0" }], {
		delay: 100,
		duration: 50,
		easing: "linear",
		pseudoElement: "::before"
	}]],
	headline: [[[{ opacity: 1 }, { opacity: 0 }], {
		duration: 100,
		easing: "linear",
		fill: "forwards"
	}]],
	content: [[[{ opacity: 1 }, { opacity: 0 }], {
		duration: 100,
		easing: "linear",
		fill: "forwards"
	}]],
	actions: [[[{ opacity: 1 }, { opacity: 0 }], {
		duration: 100,
		easing: "linear",
		fill: "forwards"
	}]]
}, he = F(t), Q = class extends he {
	get open() {
		return this.isOpen;
	}
	set open(e) {
		e !== this.isOpen && (this.isOpen = e, e ? (this.setAttribute("open", ""), this.show()) : (this.removeAttribute("open"), this.close()));
	}
	constructor() {
		super(), this.quick = !1, this.returnValue = "", this.noFocusTrap = !1, this.getOpenAnimation = () => pe, this.getCloseAnimation = () => me, this.isOpen = !1, this.isOpening = !1, this.isConnectedPromise = this.getIsConnectedPromise(), this.isAtScrollTop = !1, this.isAtScrollBottom = !1, this.nextClickIsFromContent = !1, this.hasHeadline = !1, this.hasActions = !1, this.hasIcon = !1, this.escapePressedWithoutCancel = !1, this.treewalker = document.createTreeWalker(this, NodeFilter.SHOW_ELEMENT), this.addEventListener("submit", this.handleSubmit);
	}
	async show() {
		this.isOpening = !0, await this.isConnectedPromise, await this.updateComplete;
		let e = this.dialog;
		e.open || !this.isOpening ? this.isOpening = !1 : this.dispatchEvent(new Event("open", { cancelable: !0 })) ? (e.showModal(), this.open = !0, this.scroller && (this.scroller.scrollTop = 0), this.querySelector("[autofocus]")?.focus(), await this.animateDialog(this.getOpenAnimation()), this.dispatchEvent(new Event("opened")), this.isOpening = !1) : (this.open = !1, this.isOpening = !1);
	}
	async close(e = this.returnValue) {
		if (this.isOpening = !1, !this.isConnected) {
			this.open = !1;
			return;
		}
		await this.updateComplete;
		let t = this.dialog;
		if (!t.open || this.isOpening) {
			this.open = !1;
			return;
		}
		let n = this.returnValue;
		this.returnValue = e, this.dispatchEvent(new Event("close", { cancelable: !0 })) ? (await this.animateDialog(this.getCloseAnimation()), t.close(e), this.open = !1, this.dispatchEvent(new Event("closed"))) : this.returnValue = n;
	}
	connectedCallback() {
		super.connectedCallback(), this.isConnectedPromiseResolve();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.isConnectedPromise = this.getIsConnectedPromise();
	}
	render() {
		let e = this.open && !(this.isAtScrollTop && this.isAtScrollBottom), t = {
			"has-headline": this.hasHeadline,
			"has-actions": this.hasActions,
			"has-icon": this.hasIcon,
			scrollable: e,
			"show-top-divider": e && !this.isAtScrollTop,
			"show-bottom-divider": e && !this.isAtScrollBottom
		}, n = this.open && !this.noFocusTrap, i = a`
      <div
        class="focus-trap"
        tabindex="0"
        aria-hidden="true"
        @focus=${this.handleFocusTrapFocus}></div>
    `, { ariaLabel: o } = this;
		return a`
      <div class="scrim"></div>
      <dialog
        class=${s(t)}
        aria-label=${o || r}
        aria-labelledby=${this.hasHeadline ? "headline" : r}
        role=${this.type === "alert" ? "alertdialog" : r}
        @cancel=${this.handleCancel}
        @click=${this.handleDialogClick}
        @close=${this.handleClose}
        @keydown=${this.handleKeydown}
        .returnValue=${this.returnValue || r}>
        ${n ? i : r}
        <div class="container" @click=${this.handleContentClick}>
          <div class="headline">
            <div class="icon" aria-hidden="true">
              <slot name="icon" @slotchange=${this.handleIconChange}></slot>
            </div>
            <h2 id="headline" aria-hidden=${!this.hasHeadline || r}>
              <slot
                name="headline"
                @slotchange=${this.handleHeadlineChange}></slot>
            </h2>
            <md-divider></md-divider>
          </div>
          <div class="scroller">
            <div class="content">
              <div class="top anchor"></div>
              <slot name="content"></slot>
              <div class="bottom anchor"></div>
            </div>
          </div>
          <div class="actions">
            <md-divider></md-divider>
            <slot name="actions" @slotchange=${this.handleActionsChange}></slot>
          </div>
        </div>
        ${n ? i : r}
      </dialog>
    `;
	}
	firstUpdated() {
		this.intersectionObserver = new IntersectionObserver((e) => {
			for (let t of e) this.handleAnchorIntersection(t);
		}, { root: this.scroller }), this.intersectionObserver.observe(this.topAnchor), this.intersectionObserver.observe(this.bottomAnchor);
	}
	handleDialogClick() {
		this.nextClickIsFromContent ? this.nextClickIsFromContent = !1 : this.dispatchEvent(new Event("cancel", { cancelable: !0 })) && this.close();
	}
	handleContentClick() {
		this.nextClickIsFromContent = !0;
	}
	handleSubmit(e) {
		let t = e.target, { submitter: n } = e;
		t.getAttribute("method") === "dialog" && n && this.close(n.getAttribute("value") ?? this.returnValue);
	}
	handleCancel(e) {
		if (e.target !== this.dialog) return;
		this.escapePressedWithoutCancel = !1;
		let t = !X(this, e);
		e.preventDefault(), t || this.close();
	}
	handleClose() {
		this.escapePressedWithoutCancel && (this.escapePressedWithoutCancel = !1, this.dialog?.dispatchEvent(new Event("cancel", { cancelable: !0 })));
	}
	handleKeydown(e) {
		e.key === "Escape" && (this.escapePressedWithoutCancel = !0, setTimeout(() => {
			this.escapePressedWithoutCancel = !1;
		}));
	}
	async animateDialog(e) {
		if (this.cancelAnimations?.abort(), this.cancelAnimations = new AbortController(), this.quick) return;
		let { dialog: t, scrim: n, container: r, headline: i, content: a, actions: o } = this;
		if (!t || !n || !r || !i || !a || !o) return;
		let { container: s, dialog: c, scrim: l, headline: u, content: d, actions: f } = e, p = [
			[t, c ?? []],
			[n, l ?? []],
			[r, s ?? []],
			[i, u ?? []],
			[a, d ?? []],
			[o, f ?? []]
		], m = [];
		for (let [e, t] of p) for (let n of t) {
			let t = e.animate(...n);
			this.cancelAnimations.signal.addEventListener("abort", () => {
				t.cancel();
			}), m.push(t);
		}
		await Promise.all(m.map((e) => e.finished.catch(() => {})));
	}
	handleHeadlineChange(e) {
		let t = e.target;
		this.hasHeadline = t.assignedElements().length > 0;
	}
	handleActionsChange(e) {
		let t = e.target;
		this.hasActions = t.assignedElements().length > 0;
	}
	handleIconChange(e) {
		let t = e.target;
		this.hasIcon = t.assignedElements().length > 0;
	}
	handleAnchorIntersection(e) {
		let { target: t, isIntersecting: n } = e;
		t === this.topAnchor && (this.isAtScrollTop = n), t === this.bottomAnchor && (this.isAtScrollBottom = n);
	}
	getIsConnectedPromise() {
		return new Promise((e) => {
			this.isConnectedPromiseResolve = e;
		});
	}
	handleFocusTrapFocus(e) {
		let [t, n] = this.getFirstAndLastFocusableChildren();
		if (!t || !n) {
			this.dialog?.focus();
			return;
		}
		let r = e.target === this.firstFocusTrap, i = !r, a = e.relatedTarget === t, o = e.relatedTarget === n, s = !a && !o;
		i && o || r && s ? t.focus() : (r && a || i && s) && n.focus();
	}
	getFirstAndLastFocusableChildren() {
		if (!this.treewalker) return [null, null];
		let e = null, t = null;
		for (this.treewalker.currentNode = this.treewalker.root; this.treewalker.nextNode();) {
			let n = this.treewalker.currentNode;
			ge(n) && (e ||= n, t = n);
		}
		return [e, t];
	}
};
d([i({ type: Boolean })], Q.prototype, "open", null), d([i({ type: Boolean })], Q.prototype, "quick", void 0), d([i({ attribute: !1 })], Q.prototype, "returnValue", void 0), d([i()], Q.prototype, "type", void 0), d([i({
	type: Boolean,
	attribute: "no-focus-trap"
})], Q.prototype, "noFocusTrap", void 0), d([l("dialog")], Q.prototype, "dialog", void 0), d([l(".scrim")], Q.prototype, "scrim", void 0), d([l(".container")], Q.prototype, "container", void 0), d([l(".headline")], Q.prototype, "headline", void 0), d([l(".content")], Q.prototype, "content", void 0), d([l(".actions")], Q.prototype, "actions", void 0), d([e()], Q.prototype, "isAtScrollTop", void 0), d([e()], Q.prototype, "isAtScrollBottom", void 0), d([l(".scroller")], Q.prototype, "scroller", void 0), d([l(".top.anchor")], Q.prototype, "topAnchor", void 0), d([l(".bottom.anchor")], Q.prototype, "bottomAnchor", void 0), d([l(".focus-trap")], Q.prototype, "firstFocusTrap", void 0), d([e()], Q.prototype, "hasHeadline", void 0), d([e()], Q.prototype, "hasActions", void 0), d([e()], Q.prototype, "hasIcon", void 0);
function ge(e) {
	let t = ":not(:disabled,[disabled])";
	return e.matches(":is(button,input,select,textarea,object,:is(a,area)[href],[tabindex],[contenteditable=true])" + t + ":not([tabindex^=\"-\"])") ? !0 : !e.localName.includes("-") || !e.matches(t) ? !1 : e.shadowRoot?.delegatesFocus ?? !1;
}
// node_modules/esp-web-tools/node_modules/@material/web/dialog/internal/dialog-styles.js
var _e = n`:host{border-start-start-radius:var(--md-dialog-container-shape-start-start, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));border-start-end-radius:var(--md-dialog-container-shape-start-end, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));border-end-end-radius:var(--md-dialog-container-shape-end-end, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));border-end-start-radius:var(--md-dialog-container-shape-end-start, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));display:contents;margin:auto;max-height:min(560px,100% - 48px);max-width:min(560px,100% - 48px);min-height:140px;min-width:280px;position:fixed;height:fit-content;width:fit-content}dialog{background:rgba(0,0,0,0);border:none;border-radius:inherit;flex-direction:column;height:inherit;margin:inherit;max-height:inherit;max-width:inherit;min-height:inherit;min-width:inherit;outline:none;overflow:visible;padding:0;width:inherit}dialog[open]{display:flex}::backdrop{background:none}.scrim{background:var(--md-sys-color-scrim, #000);display:none;inset:0;opacity:32%;pointer-events:none;position:fixed;z-index:1}:host([open]) .scrim{display:flex}h2{all:unset;align-self:stretch}.headline{align-items:center;color:var(--md-dialog-headline-color, var(--md-sys-color-on-surface, #1d1b20));display:flex;flex-direction:column;font-family:var(--md-dialog-headline-font, var(--md-sys-typescale-headline-small-font, var(--md-ref-typeface-brand, Roboto)));font-size:var(--md-dialog-headline-size, var(--md-sys-typescale-headline-small-size, 1.5rem));line-height:var(--md-dialog-headline-line-height, var(--md-sys-typescale-headline-small-line-height, 2rem));font-weight:var(--md-dialog-headline-weight, var(--md-sys-typescale-headline-small-weight, var(--md-ref-typeface-weight-regular, 400)));position:relative}slot[name=headline]::slotted(*){align-items:center;align-self:stretch;box-sizing:border-box;display:flex;gap:8px;padding:24px 24px 0}.icon{display:flex}slot[name=icon]::slotted(*){color:var(--md-dialog-icon-color, var(--md-sys-color-secondary, #625b71));fill:currentColor;font-size:var(--md-dialog-icon-size, 24px);margin-top:24px;height:var(--md-dialog-icon-size, 24px);width:var(--md-dialog-icon-size, 24px)}.has-icon slot[name=headline]::slotted(*){justify-content:center;padding-top:16px}.scrollable slot[name=headline]::slotted(*){padding-bottom:16px}.scrollable.has-headline slot[name=content]::slotted(*){padding-top:8px}.container{border-radius:inherit;display:flex;flex-direction:column;flex-grow:1;overflow:hidden;position:relative;transform-origin:top}.container::before{background:var(--md-dialog-container-color, var(--md-sys-color-surface-container-high, #ece6f0));border-radius:inherit;content:"";inset:0;position:absolute}.scroller{display:flex;flex:1;flex-direction:column;overflow:hidden;z-index:1}.scrollable .scroller{overflow-y:scroll}.content{color:var(--md-dialog-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-dialog-supporting-text-font, var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-dialog-supporting-text-size, var(--md-sys-typescale-body-medium-size, 0.875rem));line-height:var(--md-dialog-supporting-text-line-height, var(--md-sys-typescale-body-medium-line-height, 1.25rem));flex:1;font-weight:var(--md-dialog-supporting-text-weight, var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400)));height:min-content;position:relative}slot[name=content]::slotted(*){box-sizing:border-box;padding:24px}.anchor{position:absolute}.top.anchor{top:0}.bottom.anchor{bottom:0}.actions{position:relative}slot[name=actions]::slotted(*){box-sizing:border-box;display:flex;gap:8px;justify-content:flex-end;padding:16px 24px 24px}.has-actions slot[name=content]::slotted(*){padding-bottom:8px}md-divider{display:none;position:absolute}.has-headline.show-top-divider .headline md-divider,.has-actions.show-bottom-divider .actions md-divider{display:flex}.headline md-divider{bottom:0}.actions md-divider{top:0}@media(forced-colors: active){dialog{outline:2px solid WindowText}}
`, $ = class extends Q {};
$.styles = [_e], customElements.define("ew-dialog", $);
// node_modules/esp-web-tools/dist/styles.js
var ve = n`
  :host {
    --roboto-font: Roboto, system-ui;
    --text-color: rgba(0, 0, 0, 0.6);
    --danger-color: #db4437;

    --md-sys-color-primary: #03a9f4;
    --md-sys-color-on-primary: #fff;
    --md-ref-typeface-brand: var(--roboto-font);
    --md-ref-typeface-plain: var(--roboto-font);

    --md-sys-color-surface: #fff;
    --md-sys-color-surface-container: #fff;
    --md-sys-color-surface-container-high: #fff;
    --md-sys-color-surface-container-highest: #f5f5f5;
    --md-sys-color-secondary-container: #e0e0e0;

    --md-sys-typescale-headline-font: var(--roboto-font);
    --md-sys-typescale-title-font: var(--roboto-font);
  }

  a {
    color: var(--md-sys-color-primary);
  }
`;
export { H as a, R as c, y as d, b as f, c as g, l as h, J as i, B as l, u as m, X as n, U as o, d as p, Y as r, V as s, ve as t, F as u };

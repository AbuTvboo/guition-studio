import { d as e, i as t, m as n, n as r, r as i } from "./class-map-7fYjXT0k.js";
// node_modules/lit-html/directives/style-map.js
var a = "important", o = " !" + a, s = r(class extends i {
	constructor(e) {
		if (super(e), e.type !== t.ATTRIBUTE || e.name !== "style" || e.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
	}
	render(e) {
		return Object.keys(e).reduce((t, n) => {
			let r = e[n];
			return r == null ? t : t + `${n = n.includes("-") ? n : n.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${r};`;
		}, "");
	}
	update(t, [n]) {
		let { style: r } = t.element;
		if (this.ft === void 0) return this.ft = new Set(Object.keys(n)), this.render(n);
		for (let e of this.ft) n[e] ?? (this.ft.delete(e), e.includes("-") ? r.removeProperty(e) : r[e] = null);
		for (let e in n) {
			let t = n[e];
			if (t != null) {
				this.ft.add(e);
				let n = typeof t == "string" && t.endsWith(o);
				e.includes("-") || n ? r.setProperty(e, n ? t.slice(0, -11) : t, n ? a : "") : r[e] = t;
			}
		}
		return e;
	}
}), { I: c } = n, l = (e) => e, u = (e) => e.strings === void 0, d = () => document.createComment(""), f = (e, t, n) => {
	let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
	if (n === void 0) n = new c(r.insertBefore(d(), i), r.insertBefore(d(), i), e, e.options);
	else {
		let t = n._$AB.nextSibling, a = n._$AM, o = a !== e;
		if (o) {
			let t;
			n._$AQ?.(e), n._$AM = e, n._$AP !== void 0 && (t = e._$AU) !== a._$AU && n._$AP(t);
		}
		if (t !== i || o) {
			let e = n._$AA;
			for (; e !== t;) {
				let t = l(e).nextSibling;
				l(r).insertBefore(e, i), e = t;
			}
		}
	}
	return n;
}, p = (e, t, n = e) => (e._$AI(t, n), e), m = {}, h = (e, t = m) => e._$AH = t, g = (e) => e._$AH, _ = (e) => {
	e._$AR(), e._$AA.remove();
};
export { p as a, u as i, _ as n, f as o, h as r, s, g as t };

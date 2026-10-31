// node_modules/esp-web-tools/dist/connect.js
var e = async (t) => {
	import("./install-dialog-1b8UbcO9.js");
	let n;
	try {
		n = await navigator.serial.requestPort();
	} catch (n) {
		if (n.name === "NotFoundError") {
			import("./no-port-picked-DY2VCTWw.js").then((n) => n.openNoPortPickedDialog(() => e(t)));
			return;
		}
		alert(`Error: ${n.message}`);
		return;
	}
	if (!n) return;
	try {
		await n.open({
			baudRate: 115200,
			bufferSize: 8192
		});
	} catch (e) {
		alert(e.message);
		return;
	}
	let r = document.createElement("ewt-install-dialog");
	r.port = n, r.manifestPath = t.manifest || t.getAttribute("manifest"), r.overrides = t.overrides, r.addEventListener("closed", () => {
		n.close();
	}, { once: !0 }), document.body.appendChild(r);
}, t = class t extends HTMLElement {
	connectedCallback() {
		if (this.renderRoot) return;
		if (this.renderRoot = this.attachShadow({ mode: "open" }), !t.isSupported || !t.isAllowed) {
			this.toggleAttribute("install-unsupported", !0), this.renderRoot.innerHTML = t.isAllowed ? "<slot name='unsupported'>Your browser does not support installing things on ESP devices. Use Mozilla Firefox, Google Chrome or Microsoft Edge.</slot>" : "<slot name='not-allowed'>You can only install ESP devices on HTTPS websites or on the localhost.</slot>";
			return;
		}
		this.toggleAttribute("install-supported", !0);
		let n = document.createElement("slot");
		n.addEventListener("click", async (t) => {
			t.preventDefault(), e(this);
		}), n.name = "activate";
		let r = document.createElement("button");
		if (r.innerText = "Connect", n.append(r), "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype) {
			let e = new CSSStyleSheet();
			e.replaceSync(t.style), this.renderRoot.adoptedStyleSheets = [e];
		} else {
			let e = document.createElement("style");
			e.innerText = t.style, this.renderRoot.append(e);
		}
		this.renderRoot.append(n);
	}
};
t.isSupported = "serial" in navigator, t.isAllowed = window.isSecureContext, t.style = "\n  button {\n    position: relative;\n    cursor: pointer;\n    font-size: 14px;\n    font-weight: 500;\n    padding: 10px 24px;\n    color: var(--esp-tools-button-text-color, #fff);\n    background-color: var(--esp-tools-button-color, #03a9f4);\n    border: none;\n    border-radius: var(--esp-tools-button-border-radius, 9999px);\n  }\n  button::before {\n    content: \" \";\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    opacity: 0.2;\n    border-radius: var(--esp-tools-button-border-radius, 9999px);\n  }\n  button:hover::before {\n    background-color: rgba(255,255,255,.8);\n  }\n  button:focus {\n    outline: none;\n  }\n  button:focus::before {\n    background-color: white;\n  }\n  button:active::before {\n    background-color: grey;\n  }\n  :host([active]) button {\n    color: rgba(0, 0, 0, 0.38);\n    background-color: rgba(0, 0, 0, 0.12);\n    box-shadow: none;\n    cursor: unset;\n    pointer-events: none;\n  }\n  .hidden {\n    display: none;\n  }", customElements.define("esp-web-install-button", t);

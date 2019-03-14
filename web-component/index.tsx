import {
	installReCaptchaSDK,
	renderReCaptchaWidget,

	ReCaptchaWidgetParams,
	ReCaptchaWidget,
} from '../src/api/api';
import { getWidgetParams } from '../src/utils/types';


class ReCaptcha extends HTMLElement implements ReCaptchaWidgetParams {
	private _unmounted = false;
	private _ref: HTMLDivElement = null;
	private _widget: ReCaptchaWidget = null;
	private _loading: Element = null;

	get sitekey() {
		return this.getAttribute('sitekey');
	}

	set sitekey(val: string) {
		this.setAttribute('sitekey', val);
	}

	get lang() {
		return (this.getAttribute('lang') || 'ru') as ReCaptchaWidgetParams['lang'];
	}

	set lang(val: ReCaptchaWidgetParams['lang']) {
		this.setAttribute('lang', val);
	}

	get theme() {
		return (this.getAttribute('theme') || 'light') as ReCaptchaWidgetParams['theme'];
	}

	set theme(val: ReCaptchaWidgetParams['theme']) {
		this.setAttribute('theme', val);
	}

	get type() {
		return (this.getAttribute('type') || 'image') as ReCaptchaWidgetParams['type'];
	}

	set type(val: ReCaptchaWidgetParams['type']) {
		this.setAttribute('type', val);
	}

	get size() {
		return (this.getAttribute('size') || 'normal') as ReCaptchaWidgetParams['size'];
	}

	set size(val: ReCaptchaWidgetParams['size']) {
		this.setAttribute('size', val);
	}

	get badge() {
		return (this.getAttribute('badge') || 'bottonright') as ReCaptchaWidgetParams['badge'];
	}

	set badge(val: ReCaptchaWidgetParams['badge']) {
		this.setAttribute('badge', val);
	}

	get delayBeforeReady() {
		return parseInt(this.getAttribute('delay-before-ready'), 10) || 0;
	}

	set delayBeforeReady(val: number) {
		this.setAttribute('delay-before-ready', String(val));
	}

	constructor() {
		super();

		this.attachShadow({mode: 'open'});
	}

	private _dispose() {
		if (this._ref) {
			document.body.removeChild(this._ref);
			this._widget.dispose();
		}

		this._ref = null;
		this._widget = null;
	}

	private _render() {
		this._ref = document.createElement('div');

		this._widget = renderReCaptchaWidget({
			el: this._ref,
			params: getWidgetParams(this),
			handle: (type, code, err) => {
				console.log(type, code, err);
			}
		});

		document.body.appendChild(this._ref);
	}

	protected connectedCallback() {
		this._dispose();
		this._unmounted = false;

		let loading = this.querySelector('slot[name="loading"]');
		loading && this.shadowRoot.appendChild(loading);

		installReCaptchaSDK().then(() => {
			if (!this._unmounted) {
				setTimeout(() => {
					if (!this._unmounted) {
						loading && this.shadowRoot.removeChild(loading);
						loading = null;
						this._render();
					}
				}, this.delayBeforeReady);
			}
		});
	}

	protected adoptedCallback() {
		this._dispose();
		this._render();
	}

	protected disconnectedCallback() {
		this._dispose();
		this._unmounted = true;
	}
}

export const ELEMENT_NODE_NAME = 'x-artifact-recaptcha';

if (customElements.get(ELEMENT_NODE_NAME)) {
	console.warn(`<${ELEMENT_NODE_NAME}/> — defined`);
} else {
	customElements.define(ELEMENT_NODE_NAME, ReCaptcha);
}

export {
	ReCaptcha,
	ReCaptcha as default,
};
export type ReCaptchaWidgetParams = {
	sitekey: string;
	tabIndex?: number;
	type?: 'image' | 'audio';
	theme?: 'dark' | 'light';
	size?: 'compact' | 'normal' | 'invisible';
	badge?: 'bottomright' | 'bottomleft' | 'inline';
}

export type ReCaptchaWidgetCallbacks = {
	callback: () => void;
	'expired-callback': () => void,
	'error-callback': (error: any) => void;
}

export type ReCaptchaWidgetOptions = ReCaptchaWidgetParams & ReCaptchaWidgetCallbacks;

export type ReCaptchaWidget = {
	id: string;
	ready: Promise<ReCaptchaWidget>;
	getResponse(): string;
	reset(): void;
	dispose(): void;
}

export type RecaptchaSDK = {
	render(host: HTMLElement, options: ReCaptchaWidgetOptions): string;
	getResponse(id: string): string;
	reset(id: string): void;
}

declare global {
	interface Window {
		grecaptcha: RecaptchaSDK;
	}
}

const defaultParams: Partial<ReCaptchaWidgetParams> = {
	type: 'image',
	theme: 'light',
	size: 'normal',
	badge: 'bottomright',
};

let _interactive = false;
let _resolve: (sdk: RecaptchaSDK) => void;
let _reject: (err: Error) => void;

const _ready = new Promise<RecaptchaSDK>((resolve, reject) => {
	_resolve = resolve;
	_reject = reject;
});
const expando = '__recaptcha_' + Date.now();

(window as any)[expando] = () => _resolve(window.grecaptcha);

export function installReCaptchaSDK(lang?: string) {
	if (_interactive) {
		return _ready;
	}

	_interactive = true;

	const head = document.getElementsByTagName('head')[0];
	const script = document.createElement('script');
	let src = 'https://www.google.com/recaptcha/api.js?onload=' + expando + '&render=explicit';

	if (lang) {
		src += '&hl=' + lang;
	}

	script.type = 'text/javascript';
	script.async = true;
	script.defer = true;
	script.onerror = () => {
		_reject(new Error('Install Failed: net error'));
	};

	script.src = src;
	head.appendChild(script);

	setTimeout(() => {
		!window.grecaptcha && _reject(new Error('Install Failed: timeout'));
	}, 30000);

	return _ready;
}

export function renderReCaptchaWidget(cfg: {
	el: HTMLElement;
	params: ReCaptchaWidgetParams;
	handle: (type: 'change' | 'expired' | 'error', code: string | null, error: any) => void;
}): ReCaptchaWidget {
	let id: string = null;
	let code: string = null;
	let disposed = false;
	let widgetResolve: (w: ReCaptchaWidget) => void;
	let widgetReject: (err: Error) => void;
	let widgetReady = new Promise<ReCaptchaWidget>((resolve, reject) => {
		widgetResolve = resolve;
		widgetReject = reject;
	});

	const widget: ReCaptchaWidget = {
		id: null,
		ready: widgetReady,
		getResponse: () => code,
		reset: () => {},
		dispose: () => {
			disposed = true;
		},
	};

	installReCaptchaSDK()
		.then((recaptcha) => {
			if (disposed) {
				return;
			}

			id = recaptcha.render(cfg.el, {
				...defaultParams,
				...cfg.params,

				callback() {
					code = recaptcha.getResponse(id);
					cfg.handle('change', code, null);
				},

				'expired-callback'() {
					code = null;
					cfg.handle('change', code, null);
				},

				'error-callback'(err: any) {
					code = null;
					cfg.handle('change', null, err);
				},
			});

			widget.id = id;
			widget.reset = () => {
				recaptcha.reset(id);
			};

			widgetResolve(widget);
		})
		.catch(widgetReject)
	;

	return widget;
}

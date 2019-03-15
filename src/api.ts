import { ReCaptchaLanguageCodes, LanguageLocale, reLang } from './language';

export type ReCaptchaLang = ReCaptchaLanguageCodes | LanguageLocale;

export type ReCaptchaWidgetParams = {
	sitekey: string;
	tabIndex?: number;
	lang?: ReCaptchaLang;
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

export type ReCaptchaWidgetOptions = ReCaptchaWidgetParams & ReCaptchaWidgetCallbacks & {
	hl?: ReCaptchaLanguageCodes;
};

export type ReCaptchaWidget = {
	id: string;
	ready: Promise<ReCaptchaWidget>;
	getResponse(): string;
	reset(): void;
	dispose(): void;
}

export type ReCaptchaSDK = {
	render(host: HTMLElement, options: ReCaptchaWidgetOptions): string;
	getResponse(id: string): string;
	reset(id: string): void;
}

declare global {
	interface Window {
		grecaptcha: ReCaptchaSDK;
	}
}

export const defaultParams: Partial<ReCaptchaWidgetParams> = {
	lang: 'en',
	type: 'image',
	theme: 'light',
	size: 'normal',
	badge: 'bottomright',
};

let installPromise: Promise<ReCaptchaSDK>;

function getPromise(
	factory: (
		resolve: (sdk: ReCaptchaSDK) => void,
		reject: (reason: any) => void,
	) => void,
) {
	if (!installPromise) {
		installPromise = new Promise<ReCaptchaSDK>(factory);
	}

	return installPromise;
}

export function installReCaptchaSDK() {
	return getPromise((resolve, reject) => {
		const expando = `__recaptcha_${Date.now()}`;
		const head = document.getElementsByTagName('head')[0];
		const script = document.createElement('script');
		const src = `https://www.google.com/recaptcha/api.js?onload=${expando}&render=explicit`;

		window.grecaptcha = undefined;

		script.type = 'text/javascript';
		script.async = true;
		script.defer = true;
		script.onerror = () => {
			reject(new Error('[recaptcha] Install Failed: net error'));
		};
		script.src = src;

		head.appendChild(script);

		(window as any)[expando] = () => {
			resolve(window.grecaptcha);
			window.grecaptcha = undefined;
			(window as any)[expando] = null;
		};

		setTimeout(() => {
			reject(new Error('[recaptcha] Install Failed: timeout'));
			(window as any)[expando] = null;
		}, 30000);
	});
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
	const widgetParams = {
		...defaultParams,
		...cfg.params,
	};

	installReCaptchaSDK()
		.then((recaptcha) => {
			if (disposed) {
				return;
			}

			id = recaptcha.render(cfg.el, {
				...widgetParams,
				hl: reLang(cfg.params.lang),

				callback() {
					code = recaptcha.getResponse(id);
					cfg.handle('change', code, null);
				},

				'expired-callback'() {
					code = null;
					cfg.handle('expired', code, null);
				},

				'error-callback'(err: any) {
					code = null;
					cfg.handle('error', null, err);
				},
			});

			widget.id = id;
			widget.reset = () => {
				recaptcha.reset(id);
			};

			widgetResolve(widget);
		})
		.catch((reason) => {
			cfg.handle('error', null, reason);
			widgetReject(reason);
		})
	;

	return widget;
}

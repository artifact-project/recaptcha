export type ReCaptchaWidgetParams = {
	sitekey: string;
	tabIndex?: number;
	lang?: string;
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

const defaultParams: Partial<ReCaptchaWidgetParams> = {
	lang: 'en',
	type: 'image',
	theme: 'light',
	size: 'normal',
	badge: 'bottomright',
};

let gid = 0;
let promisesQueue = Promise.resolve<ReCaptchaSDK>(null as ReCaptchaSDK);
const promises = {} as {
	[lang:string]: Promise<ReCaptchaSDK>;
};

function getPromise(
	lang: string,
	factory: (
		resolve: (sdk: ReCaptchaSDK) => void,
		reject: (reason: any) => void,
	) => void,
) {
	if (!promises.hasOwnProperty(lang)) {
		const task = () => new Promise<ReCaptchaSDK>(factory);
		promisesQueue = promisesQueue.then(task, task)
		promises[lang] = promisesQueue;
	}

	return promises[lang];
}

export function installReCaptchaSDK(lang: string = defaultParams.lang) {
	return getPromise(lang, (resolve, reject) => {
		const expando = `__recaptcha_${Date.now()}_${++gid}`;
		const head = document.getElementsByTagName('head')[0];
		const script = document.createElement('script');
		const src = `https://www.google.com/recaptcha/api.js?hl=${lang}&onload=${expando}&render=explicit`;

		console.log('load:', src);
		window.grecaptcha = undefined;

		script.type = 'text/javascript';
		script.async = true;
		script.defer = true;
		script.onerror = () => {
			reject(new Error('Install Failed: net error'));
		};
		script.src = src;

		head.appendChild(script);

		(window as any)[expando] = () => {
			console.log('lang:', lang, window.grecaptcha);
			resolve(window.grecaptcha);
			window.grecaptcha = undefined;
			(window as any)[expando] = null;
		};

		setTimeout(() => {
			reject(new Error('Install Failed: timeout'));
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

	installReCaptchaSDK(widgetParams.lang)
		.then((recaptcha) => {
			if (disposed) {
				return;
			}

			id = recaptcha.render(cfg.el, {
				...widgetParams,

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

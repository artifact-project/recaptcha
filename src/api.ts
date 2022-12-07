import { ReCaptchaLanguageCodes, LanguageLocale, reLang } from './language';

declare global {
	interface Window {
		grecaptcha: ReCaptchaSDK & EnterpriseReCaptchaSDK;
	}
}

export type ReCaptchaLang = ReCaptchaLanguageCodes | LanguageLocale;

export type ReCaptchaWidgetParams = {
	sitekey: string;
	tabIndex?: number;
	lang?: ReCaptchaLang;
	type?: 'image' | 'audio';
	theme?: 'dark' | 'light';
	size?: 'compact' | 'normal' | 'invisible';
	badge?: 'bottomright' | 'bottomleft' | 'inline';
	isEnterprise?: boolean;
}

export type ReCaptchaWidgetCallbacks = {
	callback: () => void;
	'expired-callback': () => void,
	'error-callback': (error: any) => void;
}

export type ReCaptchaWidgetOptions = ReCaptchaWidgetParams & ReCaptchaWidgetCallbacks & {
	hl?: ReCaptchaLanguageCodes;
}

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

export type EnterpriseReCaptchaSDK = {
	enterprise: ReCaptchaSDK;
};

export type ReCatpchaAttempt = {
	state: 'start' | 'verified' | 'expired' | 'cancelled' | 'error' | 'reset';
	start: number;
	duration: number;
};

export type ReCaptchaWidgetCfg = {
	el: HTMLElement;
	params: ReCaptchaWidgetParams;
	handle: (type: 'change' | 'expired' | 'error', code: string | null, error: any) => void;
	onchallengeshow?: () => void;
	onchallengehide?: () => void;
	onstartattempt?: (attempt: ReCatpchaAttempt) => void;
	onattempt?: (attempt: ReCatpchaAttempt) => void;
}

export const defaultParams: Partial<ReCaptchaWidgetParams> = {
	lang: 'en',
	type: 'image',
	theme: 'light',
	size: 'normal',
	badge: 'bottomright',
	isEnterprise: false,
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

export function installReCaptchaSDK(isEnterprise?: boolean) {
	return getPromise((resolve, reject) => {
		const expando = `__recaptcha_${Date.now()}`;
		const head = document.getElementsByTagName('head')[0];
		const script = document.createElement('script');
		const scriptName = isEnterprise ? 'enterprise' : 'api';
		const src = `https://www.google.com/recaptcha/${scriptName}.js?onload=${expando}&render=explicit`;

		window.grecaptcha = undefined;

		script.type = 'text/javascript';
		script.async = true;
		script.defer = true;
		script.onerror = () => {
			reject(new Error('[recaptcha] Install Failed: net error'));
		};
		script.src = src;
		head.appendChild(script);

		window[expando] = () => {
			const grecaptcha = isEnterprise ? window.grecaptcha.enterprise : window.grecaptcha;
			resolve(grecaptcha);
			window.grecaptcha = undefined;
		};

		setTimeout(() => {
			reject(new Error('[recaptcha] Install Failed: timeout'));
			window[expando] = null;
		}, 30000);
	});
}

export function renderReCaptchaWidget(cfg: ReCaptchaWidgetCfg): ReCaptchaWidget {
	let id: string = null;
	let code: string = null;
	let disposed = false;
	let widgetResolve: (w: ReCaptchaWidget) => void;
	let widgetReject: (err: Error) => void;
	let widgetReady = new Promise<ReCaptchaWidget>((resolve, reject) => {
		widgetResolve = resolve;
		widgetReject = reject;
	});
	const {
		challengeObserver,
		resolveAttempt,
	} = createChallengeObserver(cfg);
	const widget: ReCaptchaWidget = {
		id: null,
		ready: widgetReady,
		getResponse: () => code,
		reset: () => {},
		dispose: () => {
			challengeObserver.dispose();
			disposed = true;
		},
	};
	const widgetParams = {
		...defaultParams,
		...cfg.params,
	};

	challengeObserver.start();

	installReCaptchaSDK(widgetParams.isEnterprise)
		.then((recaptcha) => {
			if (disposed) {
				return;
			}

			id = recaptcha.render(cfg.el, {
				...widgetParams,
				hl: reLang(cfg.params.lang),

				callback() {
					code = recaptcha.getResponse(id);
					resolveAttempt('verified');
					cfg.handle('change', code, null);
				},

				'expired-callback'() {
					code = null;
					challengeObserver.reset();
					resolveAttempt('expired');
					cfg.handle('expired', code, null);
				},

				'error-callback'(err: any) {
					code = null;
					challengeObserver.reset();
					resolveAttempt('error');
					cfg.handle('error', null, err);
				},
			});

			widget.id = id;
			widget.reset = () => {
				resolveAttempt('reset');
				challengeObserver.reset();
				recaptcha.reset(id);
			};

			widgetResolve(widget);
		})
		.catch((reason) => {
			resolveAttempt('error');
			cfg.handle('error', null, reason);
			widgetReject(reason);
		})
	;

	return widget;
}

function noop() {
}

function createChallengeObserver(cfg: ReCaptchaWidgetCfg) {
	try {
		let attempt = null as ReCatpchaAttempt
		let challengeLock = false;
		let challenge = null as HTMLElement;
		let challengeVisible = false;

		const startAttempt = (start: number) => {
			attempt = {
				state: 'start',
				start,
				duration: 0,
			};
			(cfg.onstartattempt || noop)(attempt);
		};

		const resolveAttempt = (state: ReCatpchaAttempt['state']) => {
			if (!attempt || attempt.state !== 'start' && state === 'verified') {
				startAttempt(Date.now() - 1000);
			}

			if (state !== 'cancelled' || attempt.state === 'start') {
				attempt.duration = Date.now() - attempt.start;
				attempt.state = state;
				(cfg.onattempt || noop)(attempt);
			}
		};

		const checkChallengeElement = () => {
			if (!challenge) {
				return;
			}

			challenge = document.querySelector('[src*="recaptcha/api2/bframe"]')
				|| document.querySelector('iframe[title*="challenge"][src*="/recaptcha/api2/"]');

			if (!challenge) {
				return;
			}

			while (!(parseInt(challenge.style.top) < 0) && challenge.parentElement.tagName !== 'BODY') {
				challenge = challenge.parentElement;
			}

			challengeObserver.disconnect();
			challengeObserver.observe(challenge, {attributes: true, attributeFilter: ['style'] });
		};

		const checkChallengeVisibilityState = () => {
			const visible = !(parseInt(challenge.style.top) < 0);
			if (visible === challengeVisible) {
				return;
			}

			challengeVisible = visible;

			if (visible) {
				startAttempt(Date.now());
				(cfg.onchallengeshow || noop)();
			} else {
				setTimeout(resolveAttempt, 50, 'cancelled');
				challenge = null;
				(cfg.onchallengehide || noop)();
			}
		};

		const challengeChanged = () => {
			challengeLock = false;
			
			checkChallengeElement();

			if (challenge) {
				checkChallengeVisibilityState();
			}
		};

		const challengeObserver = new MutationObserver(() => {
			if (!challengeLock) {
				challengeLock = true;
				setTimeout(challengeChanged, 50);
			}
		});

		return {
			resolveAttempt,
			challengeObserver: {
				start() {
					challengeObserver.observe(document, {childList: true, subtree: true});
				},

				dispose() {
					challenge = null;
					challengeObserver.disconnect();
				},

				reset() {
					this.dispose();
					this.start();
				},
			},
		};
	} catch (_) {
		return {
			resolveAttempt: noop,
			challengeObserver: {
				start: noop,
				dispose: noop,
				reset: noop,
			},
		};
	}
}

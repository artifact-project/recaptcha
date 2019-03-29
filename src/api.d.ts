import { ReCaptchaLanguageCodes, LanguageLocale } from './language';
export declare type ReCaptchaLang = ReCaptchaLanguageCodes | LanguageLocale;
export declare type ReCaptchaWidgetParams = {
    sitekey: string;
    tabIndex?: number;
    lang?: ReCaptchaLang;
    type?: 'image' | 'audio';
    theme?: 'dark' | 'light';
    size?: 'compact' | 'normal' | 'invisible';
    badge?: 'bottomright' | 'bottomleft' | 'inline';
};
export declare type ReCaptchaWidgetCallbacks = {
    callback: () => void;
    'expired-callback': () => void;
    'error-callback': (error: any) => void;
};
export declare type ReCaptchaWidgetOptions = ReCaptchaWidgetParams & ReCaptchaWidgetCallbacks & {
    hl?: ReCaptchaLanguageCodes;
};
export declare type ReCaptchaWidget = {
    id: string;
    ready: Promise<ReCaptchaWidget>;
    getResponse(): string;
    reset(): void;
    dispose(): void;
};
export declare type ReCaptchaSDK = {
    render(host: HTMLElement, options: ReCaptchaWidgetOptions): string;
    getResponse(id: string): string;
    reset(id: string): void;
};
declare global {
    interface Window {
        grecaptcha: ReCaptchaSDK;
    }
}
export declare type ReCatpchaAttempt = {
    state: 'start' | 'verified' | 'expired' | 'cancelled' | 'error' | 'reset';
    start: number;
    duration: number;
};
export declare type ReCaptchaWidgetCfg = {
    el: HTMLElement;
    params: ReCaptchaWidgetParams;
    handle: (type: 'change' | 'expired' | 'error', code: string | null, error: any) => void;
    onchallengeshow?: () => void;
    onchallengehide?: () => void;
    onstartattempt?: (attempt: ReCatpchaAttempt) => void;
    onattempt?: (attempt: ReCatpchaAttempt) => void;
};
export declare const defaultParams: Partial<ReCaptchaWidgetParams>;
export declare function installReCaptchaSDK(): Promise<ReCaptchaSDK>;
export declare function renderReCaptchaWidget(cfg: ReCaptchaWidgetCfg): ReCaptchaWidget;

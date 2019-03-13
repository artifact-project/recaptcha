export declare type ReCaptchaWidgetParams = {
    sitekey: string;
    tabIndex?: number;
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
export declare type ReCaptchaWidgetOptions = ReCaptchaWidgetParams & ReCaptchaWidgetCallbacks;
export declare type ReCaptchaWidget = {
    id: string;
    ready: Promise<ReCaptchaWidget>;
    getResponse(): string;
    reset(): void;
    dispose(): void;
};
export declare type RecaptchaSDK = {
    render(host: HTMLElement, options: ReCaptchaWidgetOptions): string;
    getResponse(id: string): string;
    reset(id: string): void;
};
declare global {
    interface Window {
        grecaptcha: RecaptchaSDK;
    }
}
export declare function installReCaptchaSDK(lang?: string): Promise<RecaptchaSDK>;
export declare function renderReCaptchaWidget(cfg: {
    el: HTMLElement;
    params: ReCaptchaWidgetParams;
    handle: (type: 'change' | 'expired' | 'error', code: string | null, error: any) => void;
}): ReCaptchaWidget;

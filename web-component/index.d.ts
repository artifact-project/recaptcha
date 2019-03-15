import { ReCaptchaWidgetParams } from '../src/api';
declare class ReCaptcha extends HTMLElement implements ReCaptchaWidgetParams {
    private _unmounted;
    private _ref;
    private _widget;
    sitekey: string;
    lang: ReCaptchaWidgetParams['lang'];
    theme: ReCaptchaWidgetParams['theme'];
    type: ReCaptchaWidgetParams['type'];
    size: ReCaptchaWidgetParams['size'];
    badge: ReCaptchaWidgetParams['badge'];
    delayBeforeReady: number;
    constructor();
    private _dispose;
    private _render;
    protected connectedCallback(): void;
    protected adoptedCallback(): void;
    protected disconnectedCallback(): void;
}
export declare const ELEMENT_NODE_NAME = "x-artifact-recaptcha";
export { ReCaptcha, ReCaptcha as default, };

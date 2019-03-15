/// <reference types="react" />
import { ReCaptchaWidgetParams } from './api';
export interface ReCaptchaProps extends ReCaptchaWidgetParams {
    loading?: React.ReactNode;
    hostStyle?: React.CSSProperties;
    hostClassName?: string;
    delayBeforeReady?: number;
    onReady?: () => void;
    onChange?: (code: string) => void;
    onExpired?: () => void;
    onError?: (err: Error) => void;
}
export declare function getWidgetParams(props: ReCaptchaWidgetParams): ReCaptchaWidgetParams;
export declare function getWidgetKey(props: ReCaptchaProps): string;

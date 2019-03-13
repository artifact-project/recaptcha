import * as React from 'react';
import { ReCaptchaWidgetParams } from '../src/api/api';
interface ReCaptchaProps extends ReCaptchaWidgetParams {
    loading?: React.ReactNode;
    hostClassName?: string;
    delayBeforeReady?: number;
    onReady?: () => void;
    onChange?: (code: string) => void;
    onExpired?: () => void;
    onError?: (err: Error) => void;
}
declare const ReCaptchaContextMock: React.Context<{
    code: string;
    ctrlProps: {
        [key: string]: string;
    };
    okProps?: {
        [key: string]: string;
    };
}>;
declare class ReCaptcha extends React.PureComponent<ReCaptchaProps> {
    private _hostRef;
    private _widget;
    private _unmounted;
    state: {
        code: string;
        ready: boolean;
    };
    constructor(props: ReCaptchaProps, context: object);
    _updRefHost: (el: HTMLElement) => void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export { ReCaptcha, ReCaptcha as default, ReCaptchaProps, ReCaptchaContextMock, };

import * as React from 'react';
import { ReCaptchaProps } from '../src/utils';
declare const ReCaptchaContextMock: React.Context<{
    code: string;
    ctrlProps: {
        [key: string]: string;
    };
    hostProps?: {
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
    private _reset;
    private _updRefHost;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export { ReCaptcha, ReCaptcha as default, ReCaptchaProps, ReCaptchaContextMock, };

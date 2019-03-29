import { PerfKeeper } from '@perf-tools/keeper';
import { ReCatpchaAttempt, ReCaptchaWidgetCfg } from './src/api';
import { ReCaptchaProps } from './react';
export declare type ReCaptchaAnalyticsOptions = {
    keeper?: PerfKeeper;
    keeperGroupName?: string;
    keeperSendBySubmit?: boolean;
};
export declare type ReCaptchaAnalytics = Record<Exclude<ReCatpchaAttempt['state'] | 'show' | 'hide', 'start'>, number> & {
    attempts: ReCatpchaAttempt[];
};
export declare type ReCaptchaAnalyticsMixin = {
    native: Pick<ReCaptchaWidgetCfg, 'onchallengeshow' | 'onchallengehide' | 'onstartattempt' | 'onattempt'>;
    react: Pick<ReCaptchaProps, 'onChallengeShow' | 'onChallengeHide' | 'onStartAttempt' | 'onAttempt'>;
};
export declare function createReCaptchaAnalytics<N extends string>(name: N, options?: ReCaptchaAnalyticsOptions): {
    name: N;
    clear: () => void;
    get: () => ReCaptchaAnalytics;
    mixin<K extends "native" | "react", R extends ReCaptchaAnalyticsMixin[K]>(type: K, override?: Partial<R>): R;
};

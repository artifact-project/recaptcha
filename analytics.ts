import { PerfKeeper, PerfEntry } from '@perf-tools/keeper';
import { ReCatpchaAttempt, ReCaptchaWidgetCfg } from './src/api';
import { ReCaptchaProps } from './react';

export type ReCaptchaAnalyticsOptions = {
	keeper?: PerfKeeper;
	keeperGroupName?: string;
	keeperSendBySubmit?: boolean;
}

export type ReCaptchaAnalytics<N extends string> = {
	name: N;
	clear: () => void;
	get: () => ReCaptchaAnalyticsStats;
	mixin<
		K extends keyof ReCaptchaAnalyticsMixin,
		R extends ReCaptchaAnalyticsMixin[K],
	>(type: K, override?: Partial<R>): R;
}

export type ReCaptchaAnalyticsStats = Record<
	Exclude<ReCatpchaAttempt['state'] | 'show' | 'hide', 'start'>,
	number
> & {
	attempts: ReCatpchaAttempt[];
}

export type ReCaptchaAnalyticsMixin = {
	native: Pick<ReCaptchaWidgetCfg,
		| 'onchallengeshow'
		| 'onchallengehide'
		| 'onstartattempt'
		| 'onattempt'
	>;

	react: Pick<ReCaptchaProps,
		| 'onChallengeShow'
		| 'onChallengeHide'
		| 'onStartAttempt'
		| 'onAttempt'
	>;
}

export function createReCaptchaAnalytics<N extends string>(
	name: N,
	options: ReCaptchaAnalyticsOptions = {},
): ReCaptchaAnalytics<N> {
	let stats: ReCaptchaAnalyticsStats;
	let timer: PerfEntry | undefined;
	const {
		keeper,
		keeperGroupName = 'recaptcha',
		keeperSendBySubmit = true,
	} = options;
	const onChallengeShow = () => { stats.show++; };
	const onChallengeHide = () => { stats.hide++; };
	const onStartAttempt = (attempt: ReCatpchaAttempt) => {
		timer = keeper && keeper.group(keeperGroupName, true).group(name).time('try');
		stats.attempts.push(attempt);
	};
	const onAttempt = (attempt: ReCatpchaAttempt) => {
		if (timer) {
			timer.stop();
			timer.parent.add(`try_${attempt.state}`, attempt.start, attempt.start + attempt.duration);
			timer.parent.stop();
			timer.parent.parent.stop();
			timer = undefined;
		}
		stats[attempt.state]++;
	};

	function clear() {
		stats = {
			show: 0,
			hide: 0,
			verified: 0,
			cancelled: 0,
			expired: 0,
			error: 0,
			reset: 0,
			attempts: [],
		};
	}

	if (keeper) {
		const send = () => {
			const count = stats.attempts.length;

			if (count > 0) {
				const group = keeper.group(keeperGroupName, 0).group(name, 0);

				group.unit = 'raw';

				Object.keys(stats).forEach(key => {
					if (key !== 'attempts') {
						group.add(key, 0, stats[key]);
					}
				});

				let min = Number.POSITIVE_INFINITY;
				let max = Number.NEGATIVE_INFINITY;
				let avg = 0;

				stats.attempts.forEach(({duration}) => {
					min = Math.min(min, duration);
					max = Math.max(max, duration);
					avg += duration;
				});

				group.add('attempts', 0, count);

				group.unit = 'ms';
				group.add('time_min', 0, min);
				group.add('time_max', 0, max);
				group.add('time_avg', 0, avg / count);

				group.stop(max);
				group.parent.stop(max);
				clear();
			}
		};

		window.addEventListener('beforeunload', send);
		keeperSendBySubmit && document.addEventListener('submit', send, true);
	}

	clear();
	return {
		name,
		clear,
		get: () => stats,

		mixin<
			K extends keyof ReCaptchaAnalyticsMixin,
			R extends ReCaptchaAnalyticsMixin[K],
		>(type: K, override?: Partial<R>): R {
			let props: R;
			if (type === 'native') {
				props = {
					onchallengeshow: onChallengeShow,
					onchallengehide: onChallengeHide,
					onstartattempt: onStartAttempt,
					onattempt: onAttempt,
				} as R;
			} else if (type === 'react') {
				props = {
					onChallengeShow,
					onChallengeHide,
					onStartAttempt,
					onAttempt,
				} as R;
			}

			override && Object.keys(override).forEach(key => {
				const fn = props[key];
				props[key] = function () {
					fn.apply(this, arguments);
					override[key].apply(this, arguments);
				};
			});

			return props;
		},
	};
}
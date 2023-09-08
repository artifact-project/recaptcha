import * as React from 'react';

import {
	installReCaptchaSDK,
	renderReCaptchaWidget,
	ReCaptchaWidget,
} from '../src/api';
import { getWidgetParams, ReCaptchaProps, getWidgetKey } from '../src/utils';

const defaultStyle = {
	display: 'inline-block',
};

const ReCaptchaContextMock = React.createContext<{
	code: string;
	ctrlProps: {[key:string]: string;};
	hostProps?: {[key:string]: string;};
	okProps?: {[key:string]: string;};
}>(null);

const canUseDOM = !!(
	(typeof window !== 'undefined' &&
	window.document && window.document.createElement)
);

class ReCaptcha extends React.PureComponent<ReCaptchaProps> {
	private _hostRef: HTMLElement;
	private _widget: ReCaptchaWidget;
	private _unmounted = false;

	state = {
		code: null as string,
		ready: false,
	};

	constructor(props: ReCaptchaProps, context: object) {
		super(props, context);

		canUseDOM && installReCaptchaSDK().then(() => {
			if (!this._unmounted) {
				setTimeout(() => {
					if (!this._unmounted) {
						this.setState({ready: true});
						this.props.onReady && this.props.onReady();
					}
				}, this.props.delayBeforeReady);
			}
		});
	}

	public reset() {
		try {
			this._widget && this._widget.reset();
		} catch (err) {
			console.error('Error while trying to manually reset recaptcha', err);
		}
	}

	private _dispose() {
		if (this._widget) {
			this._widget.reset();
			this._widget.dispose();
		}

		this._hostRef = null;
		this._widget = null;
	}

	private _updRefHost = (el: HTMLElement) => {
		if (this._hostRef !== el && canUseDOM) {
			this._dispose();

			if (!el) {
				return;
			}

			this._hostRef = el;

			const { props } = this;
			const {
				onChange,
				onExpired,
				onError,

				onChallengeShow,
				onChallengeHide,
				onStartAttempt,
				onAttempt,
			} = props;

			this._widget = renderReCaptchaWidget({
				el,
				params: getWidgetParams(props),
				handle: (type, code, err) => {
					onChange && onChange(code);
					(type === 'expired') && onExpired && onExpired();
					(type === 'error') && onError && onError(err);
				},

				onchallengeshow: onChallengeShow,
				onchallengehide: onChallengeHide,
				onstartattempt: onStartAttempt,
				onattempt: onAttempt,
			});
		}
	}

	componentWillUnmount() {
		this._unmounted = true;
	}

	render() {
		const {
			loading,
			hostStyle = defaultStyle,
			hostClassName,
		} = this.props;

		return (
			<ReCaptchaContextMock.Consumer>{(mock) => {
				if (mock) {
					return (
						<div
							style={hostStyle}
							className={hostClassName}
							{...Object(mock.hostProps)}
						>
							{!this.state.code
								? <button
									style={{fontSize: '150%'}}
									{...mock.ctrlProps}
									onClick={() => {
										this.props.onChange(mock.code);
										this.setState({code: mock.code});
									}
								}>I'm not a bot, rly!</button>
								: <span {...Object(mock.okProps)}>Welcome, human! 👍</span>
							}

							<input type="hidden" name="g-recaptcha-response" defaultValue={mock.code}/>
						</div>
					);
				} else {
					if (!this.state.ready && loading) {
						return loading;
					}

					return (
						<div
							key={getWidgetKey(this.props)}
							ref={this._updRefHost}
							style={hostStyle}
							className={hostClassName}
						/>
					);
				}
			}}</ReCaptchaContextMock.Consumer>
		);
	}
}

export {
	ReCaptcha,
	ReCaptcha as default,

	ReCaptchaProps,
	ReCaptchaContextMock,
};
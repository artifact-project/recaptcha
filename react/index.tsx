import * as React from 'react';

import {
	installReCaptchaSDK,
	renderReCaptchaWidget,

	ReCaptchaWidgetParams,
	ReCaptchaWidget,
} from '../src/api/api';

interface ReCaptchaProps extends ReCaptchaWidgetParams {
	loading?: React.ReactNode;
	hostClassName?: string;
	delayBeforeReady?: number;
	onReady?: () => void;
	onChange?: (code: string) => void;
	onExpired?: () => void;
	onError?: (err: Error) => void;
}

const ReCaptchaContextMock = React.createContext<{
	code: string;
	ctrlProps: {[key:string]: string;};
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

	_updRefHost = (el: HTMLElement) => {
		if (this._hostRef !== el && canUseDOM) {
			this._hostRef = el;

			const { props } = this;
			const {
				onChange,
				onExpired,
				onError,
			} = props;

			this._widget = renderReCaptchaWidget({
				el,

				params: {
					sitekey: props.sitekey,
					type: props.type,
					tabIndex: props.tabIndex,
					theme: props.theme,
					size: props.size,
					badge: props.badge,
				},

				handle: (type, code, err) => {
					onChange && onChange(code);
					(type === 'expired') && onExpired && onExpired();
					(type === 'error') && onError && onError(err);
				},
			});
		}
	}

	componentWillUnmount() {
		if (this._widget) {
			this._widget.reset();
			this._widget.dispose();
		}

		this._hostRef = null;
		this._widget = null;
		this._unmounted = true;
	}

	render() {
		const {
			loading,
			hostClassName,
		} = this.props;

		return (
			<ReCaptchaContextMock.Consumer>{(mock) => {
				if (mock) {
					return (
						<div className={hostClassName}>
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
						<div ref={this._updRefHost} className={hostClassName}/>
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
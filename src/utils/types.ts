import { ReCaptchaWidgetParams } from '../api/api';

export interface ReCaptchaProps extends ReCaptchaWidgetParams {
	loading?: React.ReactNode;
	hostClassName?: string;
	delayBeforeReady?: number;
	onReady?: () => void;
	onChange?: (code: string) => void;
	onExpired?: () => void;
	onError?: (err: Error) => void;
}

export function getWidgetParams(props: ReCaptchaWidgetParams): ReCaptchaWidgetParams {
	return {
		sitekey: props.sitekey,
		lang: props.lang,
		type: props.type,
		tabIndex: props.tabIndex,
		theme: props.theme,
		size: props.size,
		badge: props.badge,
	};
}
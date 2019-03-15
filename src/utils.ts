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

export function getWidgetParams(props: ReCaptchaWidgetParams): ReCaptchaWidgetParams {
	const params: ReCaptchaWidgetParams = {sitekey: props.sitekey};

	(props.lang != null) && (params.lang = props.lang);
	(props.type != null) && (params.type = props.type);
	(props.tabIndex != null) && (params.tabIndex = props.tabIndex);
	(props.theme != null) && (params.theme = props.theme);;
	(props.size != null) && (params.size = props.size);
	(props.badge != null) && (params.badge = props.badge)

	return params;
}

export function getWidgetKey(props: ReCaptchaProps): string {
	return [
		props.sitekey,
		props.tabIndex,
		props.lang,
		props.type,
		props.theme,
		props.size,
		props.badge,
	].join('-');
}

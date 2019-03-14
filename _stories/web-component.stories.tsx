import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { ReCaptchaWidgetParams } from '../src/api/api';
import { ReCaptcha as CustomReCaptcha } from '../web-component';
import { ReCaptchaProps } from '../react';
import { getWidgetParams } from '../src/utils/types';

const V2_KEY = '6LdfVpcUAAAAAJ9h8NiRbklJWcGF1akc5orZU4I_';

const ReCaptcha = (props: ReCaptchaProps) => <Wrapper
	sitekey={V2_KEY}
	onChange={action('code')}
	{...props}
/>;

function setProps(el: CustomReCaptcha, props: ReCaptchaProps) {
	if (el) {
		Object.entries(getWidgetParams(props)).forEach(([key, val]) => {
			(val !== undefined) && (el[key] = val);
		});

		props.delayBeforeReady && (el.delayBeforeReady = props.delayBeforeReady);
	}
}

function Wrapper(props: ReCaptchaProps) {
	const ref = React.useRef(null as HTMLDivElement);
	const recaptcha = React.useRef(null as CustomReCaptcha);

	setProps(recaptcha.current, props);

	React.useEffect(() => {
		recaptcha.current = new CustomReCaptcha();

		if (props.delayBeforeReady) {
			recaptcha.current.innerHTML = `<slot name="loading">
				<h3 style="font-family: 'Arial'">⏳ReCaptcha...</h3>
			</slot>`;
		}

		setProps(recaptcha.current, props);
		ref.current.appendChild(recaptcha.current);

		return () => {
			ref.current.removeChild(recaptcha.current);
		};
	}, []);

	return <div ref={ref}/>
}

storiesOf('WebComponent', module)
	.add('default', () => <ReCaptcha
		sitekey={V2_KEY}
	/>)
	.add('loading', () => <ReCaptcha
		sitekey={V2_KEY}
		delayBeforeReady={1000}
	/>)

;
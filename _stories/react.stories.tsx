import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import {
	ReCaptcha as BaseReCaptcha,
	ReCaptchaProps,
	ReCaptchaContextMock,
} from '../react';

const V2_KEY = '6LeIYGQUAAAAAF_qWAw_E5VQdLHE29V-RYtN2HQv';
const V2_INVISIBLE_KEY = '6LehTZcUAAAAAAaj7CjzWJ2wDRSS8eXN6km6FSkz'

const ReCaptcha = (props: Partial<ReCaptchaProps> = {}) => <BaseReCaptcha
	sitekey={V2_KEY}
	onChange={action('code')}
	{...props}
/>;

storiesOf('ReCaptcha', module)
	.add('theme: light (default)', () => <ReCaptcha/>)
	.add('theme: dark', () => <ReCaptcha theme="dark"/>)
	.add('loading', () => <ReCaptcha
		loading={<h3 style={{fontFamily: 'Arial'}}>⏳ReCaptcha...</h3>}
		delayBeforeReady={1000}
		onReady={action('ready')}
	/>)
	.add('type: image (default)', () => <ReCaptcha type="image"/>)
	.add('type: audio', () => <ReCaptcha type="audio"/>)
	.add('size: normal (default)', () => <ReCaptcha />)
	.add('size: compact', () => <ReCaptcha size="compact" />)
	.add('size: invisible', () => <ReCaptcha
		size="invisible"
		sitekey={V2_INVISIBLE_KEY}
	/>)
	.add('invisible: bottomleft', () => <ReCaptcha
		badge="bottomright"
		size="invisible"
		sitekey={V2_INVISIBLE_KEY}
	/>)
	.add('invisible: bottomright (default)', () => <ReCaptcha
		badge="bottomright"
		size="invisible"
		sitekey={V2_INVISIBLE_KEY}
	/>)
	.add('invisible: inline', () => <ReCaptcha
		badge="inline"
		size="invisible"
		sitekey={V2_INVISIBLE_KEY}
	/>)
	.add('testing (mock)', () =>
		<ReCaptchaContextMock.Provider value={{code: '123', ctrlProps: {'data-qa': 're-btn'}}}>
			<ReCaptcha
				badge="inline"
				size="invisible"
				sitekey={V2_INVISIBLE_KEY}
			/>
		</ReCaptchaContextMock.Provider>
	)
;

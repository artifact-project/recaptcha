import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import {
	ReCaptcha as BaseReCaptcha,
	ReCaptchaProps,
	ReCaptchaContextMock,
} from '../react';
import { ReCaptchaLang } from '../src/api';

const V2_KEY = '6LdfVpcUAAAAAJ9h8NiRbklJWcGF1akc5orZU4I_';
const V2_INVISIBLE_KEY = '6LehTZcUAAAAAAaj7CjzWJ2wDRSS8eXN6km6FSkz'

const ReCaptcha = (props: Partial<ReCaptchaProps> = {}) => <BaseReCaptcha
	sitekey={V2_KEY}
	onReady={action('ready')}
	onChange={action('change')}
	onExpired={action('expired')}
	onError={action('error')}
	{...props}
/>;

storiesOf('React', module)
	.add('default', () => <ReCaptcha/>)
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
	.add('multi language', () =>
		<div>
			<h2>English</h2>
			<ReCaptcha lang="en" />

			<h2>Russian</h2>
			<ReCaptcha lang="ru" />

			<h2>Chinese (Hong Kong)	</h2>
			<ReCaptcha lang="zh-HK" />
		</div>
	)
	.add('switch language', () =>
		<State value={{lang: 'en' as ReCaptchaLang}}>{({lang}, setState) => <>
			<h2>lang: {lang}</h2>
			<div><ReCaptcha lang={lang} /></div>
			<button onClick={() => setState({lang: lang == 'ru' ? 'en' : 'ru'})}>
				switch to {lang == 'ru' ? 'en' : 'ru'}
			</button>
		</>}</State>
	)
	.add('testing (mock)', () =>
		<ReCaptchaContextMock.Provider value={{code: '123', ctrlProps: {'data-qa': 're-btn'}}}>
			<ReCaptcha
				badge="inline"
				size="invisible"
				sitekey={V2_INVISIBLE_KEY}
			/>
		</ReCaptchaContextMock.Provider>
	)
	.add('error: sitekey', () =>
		<State value={{key: 'XXX'}}>{({key}, setState) => <>
			<h2>sitekey: {key}</h2>
			<div><ReCaptcha sitekey={key} onError={action('error')} /></div>
			<button onClick={() => setState({key: V2_KEY})}>Fix</button>
		</>}</State>
	)
	.add('mount/unmount', () =>
		<State value={{mount: true}}>{({mount}, setState) => <>
			<button onClick={() => setState({mount: !mount})}>{!mount ? 'mount' : 'unmount'}</button>
			<div>{mount && <ReCaptcha />}</div>
		</>}</State>
	)
;

export function State<S extends object>(
	props: {
		value: S;
		children: (state: S, setState: (state: S) => void) => React.ReactElement;
	},
) {
	const [state, setState] = React.useState(props.value);
	return props.children(state, setState);
}

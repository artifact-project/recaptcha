import Vue from 'vue';
import * as React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { ReCaptchaProps } from '../react';
import { default as CustomReCaptcha } from '../vue/index.vue';
import { State } from './react.stories';
import { ReCaptchaLang } from '../src/api';

const V2_KEY = '6LdfVpcUAAAAAJ9h8NiRbklJWcGF1akc5orZU4I_';

const ReCaptcha = (props: ReCaptchaProps) => <Wrapper
	sitekey={V2_KEY}
	{...props}
/>;

function Wrapper(props: ReCaptchaProps) {
	const ref = React.useRef(null as HTMLDivElement);
	const data = React.useRef(props);
	const recaptcha = React.useRef(null as Vue);

	if (recaptcha.current) {
		data.current = props;
		recaptcha.current.$forceUpdate();
	}

	React.useEffect(() => {
		const host = document.createElement('div');

		recaptcha.current = new Vue({
			render: (h) => {
				return h(CustomReCaptcha, {
					props: data.current,
					on: {
						ready: action('ready'),
						change: action('change'),
						expired: action('expired'),
						error: action('error'),
					},
				}, props.delayBeforeReady ? [
					h('h3', {style: {fontFamily: 'Arial'}}, [`⏳ReCaptcha...`]),
				] : []);
			},
		});

		ref.current.appendChild(host);
		recaptcha.current.$mount(host);

		return () => {
			recaptcha.current.$destroy();
			recaptcha.current = null;
		};
	}, []);

	return <div ref={ref}/>
}

storiesOf('Vue', module)
	.add('default', () =>
		<State value={{lang: 'en' as ReCaptchaLang}}>{({lang}, setState) => <>
			<h2>lang: {lang}</h2>
			<div><ReCaptcha sitekey={V2_KEY} lang={lang} /></div>
			<button onClick={() => setState({lang: lang == 'ru' ? 'en' : 'ru'})}>
				switch to {lang == 'ru' ? 'en' : 'ru'}
			</button>
		</>}</State>
	)
	.add('loading', () => <ReCaptcha
		sitekey={V2_KEY}
		delayBeforeReady={1000}
	/>)
;
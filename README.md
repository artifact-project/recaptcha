reCAPTCHA
---------
[reCAPTCHA API](https://developers.google.com/recaptcha/) & [Components](https://artifact-project.github.io/recaptcha/)

```sh
npm i --save-dev @artifact-project/recaptcha
```

---

### Features

 - API 🛠
 - Multi language 🇷🇺🇺🇸🇨🇳
 - Support mock for testing 🔬
 - Events💡& [Analytics](#analytics) 📊(support ⚡️[@perf-tools/keeper](https://github.com/artifact-project/perf-tools/tree/master/keeper))
 - Components
   - [React](https://artifact-project.github.io/recaptcha/?path=/story/react--default) (ready to use)
     - Server side render
     - Dynamic properties
   - [Vue](https://artifact-project.github.io/recaptcha/?path=/story/vue--default) (in progress, help wanted)
   - [WebComponent](https://artifact-project.github.io/recaptcha/?path=/story/webcomponent--default) (in progress, help wanted)

---

### Usage
[See examples](https://artifact-project.github.io/recaptcha/)


```tsx
// As API
import { renderReCaptchaWidget } from '@artifact-project/recaptcha';

const widget = renderReCaptchaWidget({
	el: document.getElementById('captcha-box'),

	params: { // https://developers.google.com/recaptcha/docs/display#render_param
		sitekey: 'XXXX',
		theme: 'dark',
	},

	handle(type, code, error) {
		console.log('type:', type); // Enum('change', 'expired', 'error')
		console.log('code:', code); // 'XXXX' or null
	},

	// Events
	onchallengeshow() {},
	onchallengehide() {},
	onstartattempt(attempt) {
		console.log('attempt.start:', attempt); // {state: 'start', start: 132314124, duration: 0};
	},
	onattempt(attempt) {
		console.log('attempt.resolved:', attempt); // {state: 'verified', start: 132314124, duration: 325325};
	},
});

// As React Compomnent
import { ReCaptcha } from '@artifact-project/recaptcha/react';

const captcha = (
	<ReCaptcha
		sitekey={'XXXX'}
		loading={<span>⏳Loading...</span>}
		onReady={() => console.log('reCAPTCHA is ready')}
		onChange={(code) => console.log('reCAPTCHA code:', code)}
		onExpired={(code) => { /* ... */ }}
		onError={(err) => { /* ... */ }}

		onChallengeShow={() => { /* ... */ }}
		onChallengeHide={() => { /* ... */ }}
		onStartAttempt={(attempt) => { /* ... */ }}
		onAttempt={(attempt) => { /* ... */ }}
	/>
);
```

---

### Advanced API

```ts
import {
	installReCaptchaSDK,
	renderReCaptchaWidget,
} from '@artifact-project/recaptcha';

installReCaptchaSDK().then(() => {
	console.log('reCAPTCHA SDK —> loaded');
});

renderReCaptchaWidget({ ... }).ready.then(widget => {
	console.lof('reCAPTCHA SDK —> loaded');
	console.lof('reCAPTCHA Widget —> rendered');
})
```

---

### Testing / Mock

#### React component
[See example](https://artifact-project.github.io/recaptcha/?path=/story/react--testing-mock)

```tsx
import { ReCaptcha, ReCaptchaContextMock } from '@artifact-project/recaptcha/react';

const captchaWithMock = (
	<ReCaptchaContextMock.Provider value={{
		code: 'xx123xx',
		ctrlProps: {'data-qa': 'recaptcha-btn'},
		okProps: {'data-qa': 'recaptcha-successfully'},
	}}>
		<ReCaptcha
			sitekey={'XXXX'}
			onChange={(code) => {
				console.log('reCAPTCHA code:', code); // always: 'xx123xx'
			}}
		/>
	</ReCaptchaContextMock.Provider>
);
```

---

<a name="analytics"></a>

### Analytics

```ts
import { renderReCaptchaWidget } from '@artifact-project/recaptcha';
import { createReCaptchaAnalytics } from '@artifact-project/recaptcha/analytics';

const analytics = createReCaptchaAnalytics('LoginPage');

renderReCaptchaWidget({
	el: document.getElementById('captcha-box'),
	params: { /*...*/ },
	...analytics.mixin('native'), // added `on`-props
});

document.getElementById('login-form').addEventListener('submit', () => {
	const stats = analytics.get();

	sendToMyAnalytics(analytics.name, stats);
	analytics.clear();

	// ...
});
```

#### Using with ⚡️[@perf-tools/keeper](https://github.com/artifact-project/perf-tools/

```ts
import { system as systemKepper } from '@perf-tools/keeper';
import { createReCaptchaAnalytics } from '@artifact-project/recaptcha/analytics';

const analytics = createReCaptchaAnalytics('Login', {
	keeper: systemKepper,
});

// ... bla-bla-bla
```

![Analytics in keeper](https://habrastorage.org/webt/vy/hk/7y/vyhk7y0gkcamxykvtfdivmc2hdg.png)
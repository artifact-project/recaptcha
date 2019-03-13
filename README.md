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

// https://developers.google.com/recaptcha/docs/language
installReCaptchaSDK('ru').then(() => {
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
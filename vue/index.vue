<template>
	<div class="hostClassName" :style="hostStyle">
		<div v-if="!ready"><slot/></div>
		<div ref="host" v-show="ready"/>
	</div>
</template>

<script>
import {
	installReCaptchaSDK,
	renderReCaptchaWidget,
	defaultParams,
} from '../src/api';

import {
	getWidgetKey,
	getWidgetParams,
} from '../src/utils';

const ReCaptcha = {
	name: 'ReCaptcha',

	props: {
		hostStyle: {type: Object, default: () => ({display: 'inline-block'})},
		hostClassName: String,
		sitekey: String,
		lang: {type: String, default: defaultParams.lang},
		type: {type: String, default: defaultParams.type},
		tabIndex: Number,
		theme: {type: String, default: defaultParams.theme},
		size: {type: String, default: defaultParams.size},
		badge: {type: String, default: defaultParams.badge},
		delayBeforeReady: Number,
	},

	created() {
		installReCaptchaSDK().then(() => {
			setTimeout(() => {
				if (!this.unmounted) {
					this.ready = true;
					this.$emit('ready');
				}
			}, this.delayBeforeReady);
		});
	},

	mounted() {
		this.unmounted = false;
		this._create();
	},

	beforeDestroy() {
		this._reset();
		this.unmounted = true;
	},

	data: () => ({
		ready: false,
		unmounted: false,
	}),

	computed: {
		key() {
			return getWidgetKey(this);
		},
	},

	watch: {
		key() {
			this._reset();
			this._create();
		},
	},

	methods: {
		_create() {
			this._ref = document.createElement('div');
			this.$refs.host.appendChild(this._ref);

			this._widget = renderReCaptchaWidget({
				el: this._ref,
				params: getWidgetParams(this),
				handle: (type, code, error) => {
					this.$emit('change', {code, error});
					(type !== 'change') && this.$emit(type, {code, error});
				},
			});
		},

		_reset() {
			if (this._widget) {
				this._widget.dispose();
				this._widget = null;

				this.$refs.host.removeChild(this._ref);
				this._ref = null
			}
		},
	},
};

export {
	ReCaptcha,
	ReCaptcha as default,
};
</script>

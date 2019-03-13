const baseConfig = require('../webpack.config');

module.exports = (storybookBaseConfig) => {
	const config = Object.assign({}, storybookBaseConfig.config, {
		resolve: baseConfig.resolve,
		node: baseConfig.node,
		module: {
			rules: baseConfig.module.rules
		},
		devtool: 'cheap-eval-source-map', // enum
	});

	config.output.filename = '[name].bundle.js?[hash]';

	return config;
};

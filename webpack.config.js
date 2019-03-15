
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'awesome-typescript-loader',
				options: {
					getCustomTransformers: () => ({
						before: [],
						after: [],
					}),
				},
			},

			{
				test: /\.vue$/,
				loader: 'vue-loader',
			},
		],
	},

	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},

	node: {
		Buffer: false,
	},

	plugins: [
		new VueLoaderPlugin(),
	],
};

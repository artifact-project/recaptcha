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
		],
	},

	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},

	node: {
		Buffer: false,
	},

	plugins: [],
};

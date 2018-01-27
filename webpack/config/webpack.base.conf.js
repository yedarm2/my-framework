const webpack = require('webpack');
const UglifyJs = require('uglifyjs-webpack-plugin');
const createStyleLoader = require('../utils/create-style-loader');
const isProduction = process.env.NODE_ENV === 'production';
let rules = [];

rules = [
	{
		test: /\.vue$/,
		loader: 'vue-loader',
		exclude: /node_modules/,
		options: {
			cssSourceMap: isProduction,
			preserveWhitespace: true,
			extractCSS: isProduction,
			loaders: {
				css: createStyleLoader.stack('css', true),
				less: createStyleLoader.stack('less', true)
			},
			transformToRequire: {
				img: 'src',
				image: 'xlink:href',
				video: 'src'
			}
		}
	},
	{
		test: /\.(png|jpg|gif|svg|otf|ttf)$/,
		loader: 'file-loader',
		options: {
			name: '[name].[ext]'
		}
	},
	{
		test: /\.(js)$/,
		loader: 'babel-loader',
		exclude: /node_modules/
	}
];

module.exports = (() => ({
	resolve: {
		extensions: ['.ts', '.js', '.vue', '.json'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js'
		}
	},
	module: {
		rules
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV)
			}
		}),
		new UglifyJs({
			sourceMap: true,
			test: /\.(js)$/,
			uglifyOptions: {
				ecma: 8,
				compress: {
					warnings: false
				}
			}
		})
	]
}))();
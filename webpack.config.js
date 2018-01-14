/**
 * 升级webpack为3
 * author: whr
 * time: 2018.1.14
 */
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const uglifyjsPlugin = require('uglifyjs-webpack-plugin');

module.exports = (err, webpackConfig) => {
	const production = process.env.NODE_ENV === 'production';
	const plugins = production ? [
		new uglifyjsPlugin(),
		new ExtractTextPlugin({
			filename: 'build.min.css',
			allChunks: true,
		}),
		new CopyWebpackPlugin([
			{
				from: './src/img',
				to: path.resolve(__dirname, 'dist') + '/img'
			}
		]),
	] : [
		new webpack.HotModuleReplacementPlugin(),
	];
	return {
		entry: ['babel-polyfill', './src/index'],
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'bubble.js'
		},
		module: {
			rules: [
				{
					test: '/\.js$/',
					exclude: /node_modules/,
					use: 'bable-loader',
				},
				{
					test: /(\.less|\.css)$/,
					exclude: /node_modules/,
					use: [
						{
							loader: 'style-loader',
						},
						{
							loader: 'css-loader',
						},
						{
							loader: 'postcss-loader'
						}
					]
				}
			]
		},
		plugins: plugins.concat([
			new HtmlWebpackPlugin({
				title: '用canvas画的直播间态度气泡-摇摆冒泡-酷炫实用的点赞态度气泡',
				template: './index.ejs',
				minify: production ? {
					collapseWhitespace: true,
				} : null,
				hash: true,
				inject: true,
			}),
		]),
		devtool: '#source-map', //#source-map或者#inline-source-map
		resolve: {
			//自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
			extensions: ['.js', '.json', '.css', '.less'],
		},
		devServer: {
			contentBase: path.join(__dirname, "dist"),
			compress: true,
			port: 8081,
			open: true,
		}
	}
	
}
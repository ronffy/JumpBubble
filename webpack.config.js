const webpack = require('webpack');

module.exports = {
	entry: ['babel-polyfill','./src/js/index'],
	output: {
		path: __dirname + '/dist',
		filename: 'bubble.js' 
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'eslint-loader!babel-loader'
			},
			{
				test: /\.less$/,
				loader: 'style!css!postcss!less'
			}
		]
	},
	devtool: '#source-map', //#source-map或者#inline-source-map
	resolve: {
	    //查找模块的话从这里开始查找
	    root: 'E:/Personal/login+signup/src', //绝对路径
	    //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
	    extensions: ['', '.js', '.json', '.less'],
	    //模块别名定义，方便后续直接引用别名，无须多写长长的地址
	}
}
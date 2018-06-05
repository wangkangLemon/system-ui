var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var manifiest = require('./manifest.json')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({sourceMap: config.dev.cssSourceMap})
    },
    // cheap-module-eval-source-map is faster for development
    devtool: 'source-map',
    plugins: [
        new webpack.DllReferencePlugin({
            context: path.resolve('./'),
            manifest: manifiest,
        }),
        new webpack.ProvidePlugin({
            Promise: "promise",
            "window.Promise": "promise"
        }),
        new webpack.DefinePlugin({
            'process.env': config.dev.env,
            'process.apiHost': config.dev.apiHost,
            'process.buildTime': '"' + new Date().toLocaleString() + '"'
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            //filename: 'index.html',
            template: 'src/index.html',
            inject: true,
            vendorjs: config.dev.assetsPublicPath + config.dev.assetsSubDirectory + '/' + manifiest.name + '.js?v=' + utils.getMd5(path.resolve('./public/vendor.js'))
        }),
        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../public'),
                to: config.build.assetsSubDirectory,
                ignore: ['.*']
            }
        ]),
        new FriendlyErrorsPlugin()
    ]
})

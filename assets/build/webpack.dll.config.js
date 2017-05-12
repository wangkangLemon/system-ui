/**
 * Created by huanghuixin on 2017/5/8.
 */
const webpack = require('webpack');
const path = require('path');

const vendors = [
    "@fdaciuk/ajax",
    "cropperjs",
    "echarts",
    "element-ui",
    "eventsource-polyfill",
    "promise",
    "vue",
    "vue-router",
    "vuex",
    "vuex-router-sync",
    './src/assets/city.js'
]

module.exports = {
    output: {
        path: path.resolve('./public'),
        filename: '[name].js',
        library: '[name]',
    },
    entry: {
        vendor: vendors,
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
        }),
        new webpack.DllPlugin({
            path: './build/manifest.json',
            name: '[name]',
            context: path.resolve('./'),
        }),
    ],
};

console.info(__dirname)
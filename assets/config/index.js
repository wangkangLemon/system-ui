// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
let fs = require('fs')

module.exports = {
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../../public/index.html'),
        assetsRoot: path.resolve(__dirname, '../../public'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        productionSourceMap: true,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report,
        // 获取接口地址
        getApiHost: function () {
            let apiHost = ''
            var options = process.argv;
            for (let i = 0; i < options.length; i++) {
                if (options[i] === '-h') {
                    return `'${options[i + 1]}'`
                }
            }
            throw new Error('请指定接口地址参数 如 npm run build -- -h http://yst.com')
        },
    },
    dev: {
        env: require('./dev.env'),
        port: 7010,
        autoOpenBrowser: false,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            '/vendor': {
                target: 'http://localhost:8001',
                changeOrigin: true
            }
        },
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false,
        apiHost: "'http://10.1.2.140'"
        // apiHost: "'http://10.1.2.13:8002'"
    }
}

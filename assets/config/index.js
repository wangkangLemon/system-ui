// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
let fs = require('fs')

let apiHost = ''
let content = fs.readFileSync(path.resolve('../conf/app.ini'))
content.toString().split('\n').map((item) => {
    let arrRet = item.split('=')
    if (arrRet.length > 1 && arrRet[0].indexOf('apiHost') > -1) {
        apiHost = arrRet[1].trim()
    }
})

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
        apiHost: apiHost,
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
        cssSourceMap: false
    }
}

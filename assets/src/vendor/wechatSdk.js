window.WxLogin = function (wxconfig) {
    var redirect = 'default'
    wxconfig.self_redirect === !0 ? redirect = 'true' : wxconfig.self_redirect === !1 && (redirect = 'false')
    var iframe = document.createElement('iframe')
    var uri = 'https://open.weixin.qq.com/connect/qrconnect?appid=' + wxconfig.appid + '&scope=' + wxconfig.scope + '&redirect_uri=' + wxconfig.redirect_uri + '&state=' + wxconfig.state + '&login_type=jssdk&self_redirect=' + redirect
    uri += wxconfig.style ? '&style=' + wxconfig.style : ''
    uri += wxconfig.href ? '&href=' + wxconfig.href : ''
    iframe.sandbox = 'allow-forms allow-popups allow-scripts allow-top-navigation'
    iframe.frameBorder = '0'
    iframe.allowTransparency = 'true'
    iframe.scrolling = 'no'
    iframe.width = '300px'
    iframe.height = '400px'
    iframe.src = uri
    var dom = document.getElementById(wxconfig.id)
    dom.innerHTML = ''
    dom.appendChild(iframe)
}

let currMsgListener = void 0
let wechatSdk = {
    // 初始化二维码
    initLogin (wechatConfig) {
        return new Promise((resolve, reject) => {
            if (window.WxLogin) {
                resolve(true)
                return
            }

            let script = document.createElement('script')
            script.src = '//res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js'
            document.head.appendChild(script)
            script.onload = function () {
                resolve(true)
            }
        }).then(() => {
            // mine/two-step/wechat/callback?verify=
            wechatConfig = Object.assign({}, wechatConfig, {
                style: 'white',
                href: ''
            })

            wechatConfig.redirect_uri = encodeURIComponent(wechatConfig.redirect_uri)
            return new window.WxLogin(wechatConfig)
        }).catch(err => {
            console.info('微信二维码初始化失败', err)
        })
    },

    buildUrl ({appid, scope, redirect_uri, state}) {
        return `https://open.weixin.qq.com/connect/qrconnect?state=${state}&appid=${appid}&scope=${scope}&redirect_uri=${encodeURIComponent(redirect_uri)}&login_type=jssdk&style=white`
    },

    openWechatLogin ({appid, scope, redirect_uri, state, verify}, callback) {
        // 先移除事件
        currMsgListener && window.removeEventListener('message', currMsgListener)

        if (verify)
            redirect_uri = redirect_uri.replace('verify=', 'verify=' + verify)

        // 打开登录tab
        let tab = window.open(wechatSdk.buildUrl({appid, scope, redirect_uri, state}))
        // 回调事件
        currMsgListener = (e) => {
            callback(e.data)
            tab.close()
            window.removeEventListener('message', currMsgListener)
            tab = null
            currMsgListener = null
        }
        window.addEventListener('message', currMsgListener, false)
    }
}

export default wechatSdk

window.WxLogin = function d(wxconfig) {
    var redirect = 'default'
    wxconfig.self_redirect === !0 ? redirect = 'true' : wxconfig.self_redirect === !1 && (redirect = 'false')
    var d = document.createElement('iframe')
    var e = 'https://open.weixin.qq.com/connect/qrconnect?appid=' + wxconfig.appid + '&scope=' + wxconfig.scope + '&redirect_uri=' + wxconfig.redirect_uri + '&state=' + wxconfig.state + '&login_type=jssdk&self_redirect=' + redirect
    e += wxconfig.style ? '&style=' + wxconfig.style : ''
    e += wxconfig.href ? '&href=' + wxconfig.href : ''
    d.src = e
    d.frameBorder = '0'
    d.allowTransparency = 'true'
    d.scrolling = 'no'
    d.width = '300px'
    d.height = '400px'
    d.setAttribute('allow-top-navigation', '')
    var f = document.getElementById(wxconfig.id)
    f.innerHTML = ''
    f.appendChild(d)
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
            let d = new window.WxLogin(wechatConfig)
            window.setTimeout(() => {
                let f = document.getElementById(wechatConfig.id).getElementsByTagName('iframe')
                f[0].setAttribute('allow-top-navigation', '') // 设置允许跳转
            }, 100)
            return d
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

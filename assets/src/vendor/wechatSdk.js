/**
 * Created by huanghuixin on 2017/4/13.
 */

import config from '../utils/config'
let currMsgListener = void 0
let wechatSdk = {
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
            if (config.debug) {
                wechatConfig.redirect_uri = 'http://sys.yst.vodjk.com/mine/two-step/wechat/callback?verify='
            } else {
                wechatConfig.redirect_uri = encodeURIComponent(wechatConfig.redirect_uri)
            }
            return new window.WxLogin(wechatConfig)
        })
    },

    buildUrl ({appid, scope, redirect_uri, state}) {
        config.debug && (redirect_uri = 'http://sys.yst.vodjk.com/mine/two-step/wechat/callback?verify=')
        return `https://open.weixin.qq.com/connect/qrconnect?state=${state}&appid=${appid}&scope=${scope}&redirect_uri=${encodeURIComponent(redirect_uri)}&login_type=jssdk&style=white`
    },

    openWechatLogin ({appid, scope, redirect_uri, state}, callback) {
        // 先移除事件
        currMsgListener && window.removeEventListener('message', currMsgListener)

        // 打开登录tab
        let tab = window.open(wechatSdk.buildUrl({appid, scope, redirect_uri, state}))
        // 回调事件
        currMsgListener = (e) => {
            callback(e.data)
            // tab.close()
            window.removeEventListener('message', currMsgListener)
            tab = null
            currMsgListener = null
        }
        window.addEventListener('message', currMsgListener, false)
    }
}

export default wechatSdk
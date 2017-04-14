/**
 * Created by huanghuixin on 2017/4/13.
 */

export default {
    initSdk () {
        return new Promise((resolve, reject) => {
            if (WxLogin) {
                resolve(true)
                return
            }

            let script = document.createElement('script')
            script.src = '//res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js'
            document.head.appendChild(script)
            script.onload = function () {
                resolve(true)
            }
        })
    }
}
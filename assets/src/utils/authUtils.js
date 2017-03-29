/**
 * Created by huanghuixin on 2017/3/20.
 */

const KEY_AUTHTOKEN = 'KEY_AUTHTOKEN'
const KEY_AUTHUSERINFO = 'KEY_AUTHUSERINFO'
import * as userApi from '../services/userService'
import config from '../utils/config'

let intervalId = null
let authUtls = {
    // 身份凭证操作
    getAuthToken () {
        return localStorage.getItem(KEY_AUTHTOKEN)
    },
    setAuthToken (token) {
        localStorage.setItem(KEY_AUTHTOKEN, token)
    },
    getUserInfo () {
        let str = localStorage.getItem(KEY_AUTHUSERINFO)
        if (str)
            return JSON.parse(str)
        else
            return null
    },
    setUserInfo (userInfo) {
        localStorage.setItem(KEY_AUTHUSERINFO, JSON.stringify(userInfo))
    },
    // 自动更新用户的token
    authRefreshtoken () {
        intervalId && clearInterval(intervalId)

        intervalId = setInterval(() => {
            let userinfo = authUtls.getUserInfo()
            if (userinfo && userinfo.id) {
                userApi.refreshToken(userinfo.id)
            } else {
                xmview.showTip('error', '登录超时,请重新登录')
                // 记录当前的url
                xmrouter.push({name: 'login', query: {returnUrl: window.location.href}})
            }
        }, config.debug ? 1000 * 60 : 1000 * 60 * 5) // 5分钟一请求
    },
    // 清理自动更新任务
    clearAuthRefreshToken () {
        clearInterval(intervalId)
    }
}

export default authUtls

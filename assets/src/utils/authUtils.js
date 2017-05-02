/**
 * Created by huanghuixin on 2017/3/20.
 */

const KEY_AUTHTOKEN = 'KEY_AUTH_UTILS_TOKEN' // jwt的token
const KEY_AUTHUSERINFO = 'KEY_AUTH_UTILS_USERINFO' // 用户信息
const KEY_AUTHSETNAVMENU = 'KEY_AUTH_UTILS_SETNAVMENU' // 菜单
const KEY_TWICE_AUTH = 'KEY_AUTH_UTILS_TWICEAUTH' // 二次验证的key
const KEY_AUTHTOKEN_TTL = 3600 // jwt的token 有效期，过期作废，一个小时

import message from './message'
import * as userApi from '../services/userService'
// import config from '../utils/config'

let refreshIntervalId
let authUtls = {
    // 身份凭证操作
    getAuthToken () {
        let str = localStorage.getItem(KEY_AUTHTOKEN)
        if (str == '') {
            return null
        }
        // try是为了兼容旧代码
        try {
            str = JSON.parse(str)
            if (str && str.ttl > Date.now()) {
                return str.token
            }
            return null
        } catch (e) {
            return null
        }
    },
    setAuthToken (token) {
        localStorage.setItem(KEY_AUTHTOKEN, JSON.stringify({token: token, ttl: Date.now() + KEY_AUTHTOKEN_TTL * 1000}))
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
    // 保存获取菜单
    getNavMenu () {
        let str = localStorage.getItem(KEY_AUTHSETNAVMENU)
        if (str)
            return JSON.parse(str)
        else
            return null
    },
    setNavMenu (navData) {
        localStorage.setItem(KEY_AUTHSETNAVMENU, JSON.stringify(navData))
    },
    // 设置获取二次绑定的key
    getTwiceToken () {
        return localStorage.getItem(KEY_TWICE_AUTH)
    },
    setTwiceToken (val) {
        return localStorage.setItem(KEY_TWICE_AUTH, val)
    },
    // 自动更新用户的token
    authRefreshtoken () {
        authUtls.clearAuthRefreshToken()
        setTimeout(() => {
            authUtls.refreshToken()
        }, 1000 * 10)
        refreshIntervalId = setInterval(() => {
            authUtls.refreshToken()
        }, 1000 * 60 * 20) // 20分钟一请求
    },
    refreshToken () {
        let userinfo = authUtls.getUserInfo()
        if (userinfo && userinfo.id) {
            userApi.refreshToken(userinfo.id).then((ret) => {
                authUtls.setAuthToken(ret.data.auth_token)
            })
        } else {
            if (xmrouter.history.current.name === 'login') {
                return
            }
            xmview.showTip('error', message.MESSAGE_AUTH_INVALID)
            // 记录当前的url
            xmrouter.push({name: 'login', query: {returnUrl: window.location.href}})
        }
    },
    clearAuthRefreshToken () {
        refreshIntervalId && clearInterval(refreshIntervalId)
    },
    clearAuthInfo () {
        authUtls.setAuthToken('')
        authUtls.setNavMenu('')
        authUtls.setUserInfo('')
    }
}

export default authUtls

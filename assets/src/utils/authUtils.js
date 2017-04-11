/**
 * Created by huanghuixin on 2017/3/20.
 */

const KEY_AUTHTOKEN = 'KEY_AUTH_UTILS_TOKEN'
const KEY_AUTHUSERINFO = 'KEY_AUTH_UTILS_USERINFO'
const KEY_AUTHSETNAVMENU = 'KEY_AUTH_UTILS_SETNAVMENU'
import * as userApi from '../services/userService'
// import config from '../utils/config'

let refreshIntervalId
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
            xmview.showTip('error', '登录超时,请重新登录')
            // 记录当前的url
            xmrouter.push({name: 'login', query: {returnUrl: window.location.href}})
        }
    },
    clearAuthRefreshToken () {
        refreshIntervalId && clearInterval(refreshIntervalId)
    }
}

export default authUtls

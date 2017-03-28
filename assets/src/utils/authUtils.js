/**
 * Created by huanghuixin on 2017/3/20.
 */

const KEY_AUTHTOKEN = 'KEY_AUTHTOKEN'
const KEY_AUTHUSERINFO = 'KEY_AUTHUSERINFO'
import * as userApi from '../services/userService'

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
        let str = localStorage.getItem(KEY_AUTHUSERINFO).trim()
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
            userApi.refreshToken(authUtls.getUserInfo().id)
        }, 1000 * 60 * 2) // 2分钟一请求
    },
    // 清理自动更新任务
    clearAuthRefreshToken () {
        clearInterval(intervalId)
    }
}

export default authUtls

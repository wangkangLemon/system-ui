/**
 * Created by huanghuixin on 2017/3/20.
 */

const KEY_AUTHTOKEN = 'KEY_AUTHTOKEN'
const KEY_AUTHUSERINFO = 'KEY_AUTHUSERINFO'
export default {
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
            return JSON.stringify(str)
        else
            return null
    },
    setUserInfo (userInfo) {
        localStorage.setItem(KEY_AUTHUSERINFO, JSON.stringify(userInfo))
    }
}

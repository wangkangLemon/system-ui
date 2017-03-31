/**
 * Created by huanghuixin on 2017/3/20.
 */

import * as api from './api'
import config from '../utils/config'
import authUtils from '../utils/authUtils'
const urlPre = config.apiHost + '/auth'

export function login (username, password) {
    let url = urlPre + '/login'
    return api.post(url, {username, password}, true).then(ret => {
        if (ret.code == 0) {
            return ret.data
        } else {
            return Promise.reject(ret)
        }
    })
}

export function refreshToken (userid) {
    let url = urlPre + '/refresh'
    api.get(url, {id: userid}).catch((e) => {
        e.tipCom && e.tipCom.close()
    })
}

export function loginout () {
    authUtils.setAuthToken(null)
}

/**
 * Created by huanghuixin on 2017/3/20.
 */

import * as api from './api'
const host = 'http://10.1.3.228:8002'
export function login (username, password) {
    let url = host + '/auth/login'
    return api.post(url, {username, password}).then(ret => {
        if (ret.code == 0) {
            return ret
        } else {
            return Promise.reject(ret)
        }
    })
}

/**
 * Created by huanghuixin on 2017/3/20.
 */
import * as api from './api'
import config from '../utils/config'
const host = config.apiHost

export function getCitys () {
    let url = host + '/api/city'
    return api.get(url, {code: 110000}).then(ret => {
        if (ret.code == 0) {
            return ret.data
        } else {
            return Promise.reject(ret)
        }
    })
}

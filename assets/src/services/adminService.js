/**
 * Created by huangrui on 2017/3/31.
 */
import * as api from './api'
import config from '../utils/config'
const urlPre = config.apiHost + '/sys/admin'

// 获取管理员列表
export function adminList(keyword, page, pageSize) {
    let url = urlPre + '/search'
    return api.get(url, {keyword, page, page_size: pageSize}, false).then(ret => {
        if (ret.code == 0) {
            return ret.data
        } else {
            return Promise.reject(ret)
        }
    })
}

/**
 * Created by huangrui on 2017/3/31.
 */
import * as api from './api'
import config from '../utils/config'
const urlPre = config.apiHost + '/sys/admin'

class AdminService {
    // 获取管理员列表
    adminList(keyword, page, pageSize) {
        let url = urlPre + '/search'
        return api.get(url, {keyword, page, page_size: pageSize}, false).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
        })
    }
    // 删除管理员
    adminDelete(userID) {
        let finalUrl = `${urlPre}/${userID}`
        return api.del(finalUrl).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
}
export default new AdminService()

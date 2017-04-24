/**
 * Created by huangrui on 2017/4/14.
 */
import * as api from './api'
import config from '../utils/config'
const urlPre = config.apiHost + '/sys/push'

class PushService {
    // 获取消息列表
    getPushList ({page, page_size, target, modelid, status, time_start, time_end, keyword}) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, {page, page_size, target, modelid, status, time_start, time_end, keyword}).then((ret) => {
            return ret.data
        })
    }
    // 获取详情接口
    getPushDetail (id) {
        let finalUrl = `${urlPre}/${id}/view`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }
    // 新建消息
    createPush (reqObj) {
        return api.post(urlPre, reqObj).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
}
export default new PushService()

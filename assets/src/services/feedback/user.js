/**
 * Created by huangrui on 2017/4/11.
 */
import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/feedback'

class FeedbackUserService {
    // 获取我的工单列表
    search({page, page_size, keyword, time_start, time_end}) {
        let url = `${urlPre}/search`
        return api.get(url, {page, page_size, keyword, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }

    // 查看工单
    view(id) {
        let url = `${urlPre}/${id}`
        return api.get(url, {}).then((ret) => {
            return ret.data
        })
    }

    // 提交工单
    create({category_id, content, images, contact}) {
        let url = `${urlPre}/create`
        return api.post(url, {category_id, content, images, contact}).then((ret) => {
            return ret.data
        })
    }


    // 确认已解决
    confirm(id) {
        let url = `${urlPre}/${id}/confirm`
        return api.put(url, {}).then((ret) => {
            return ret.data
        })
    }

    // 删除工单
    delete(id) {
        let url = `${urlPre}/${id}`
        return api.del(url, {}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
}

export default new FeedbackUserService()

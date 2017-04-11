/**
 * Created by huangrui on 2017/4/11.
 */
import * as api from './api'
import config from '../utils/config'
const urlPre = config.apiHost + '/sys/feedback'

class FeedBackService {
    // 获取连锁后台列表
    getChainBackList ({page, page_size, keyword = ''}) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, {page, page_size, keyword}).then((ret) => {
            return ret.data
        })
    }
    // 查看连锁后台数据详情
    getChainBackDetail (feedbackId) {
        let finalUrl = `${urlPre}/${feedbackId}/view`
        return api.get(finalUrl, {}).then((ret) => {
            return ret.data
        })
    }
    // 连锁后台数据修改
    updateChainBack ({
        id,
        status = ''
    }) {
        let finalUrl = `${urlPre}/${id}`
        return api.put(finalUrl, {status}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 连锁后台删除数据
    deleteData (id) {
        let finalUrl = `${urlPre}/${id}`
        return api.del(finalUrl, {}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 客户端查询
    getMobileList ({
        page,
        page_size,
        category = '',
        keyword = '',
        status = '',
        time_start = '',
        time_end = ''
    }) {
        let finalUrl = `${urlPre}/mobile/search`
        return api.get(finalUrl, {page, page_size, category, keyword, status, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }

    // 客户端删除数据
    deleteMobileData (id) {
        let finalUrl = `${urlPre}/mobile/${id}`
        return api.del(finalUrl, {}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 查看客户端数据详情
    getMobileDetail (feedbackId) {
        let finalUrl = `${urlPre}/mobile/${feedbackId}/view`
        return api.get(finalUrl, {}).then((ret) => {
            return ret.data
        })
    }

    // 客户端数据修改
    updateMobile ({
        id,
        status = '',
        note = ''
    }) {
        let finalUrl = `${urlPre}/mobile/${id}`
        return api.put(finalUrl, {status, note}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
}

export default new FeedBackService()

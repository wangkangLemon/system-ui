/**
 * Created by huangrui on 2017/4/11.
 */
import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/sys/feedback'

class FeedbackSystemService {
    // 管理工单列表
    search({page, page_size, status, category_id, keyword, time_start, time_end}) {
        let url = `${urlPre}/search`
        if (status == '') {
            status = -1
        }
        return api.get(url, {page, page_size, status, category_id, keyword, time_start, time_end}).then((ret) => {
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

    // 更新状态
    update({id, status}) {
        let url = `${urlPre}/${id}`
        return api.put(url, {status}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            } else {
                return ret.data
            }
        })
    }

    // 回复工单
    reply({id, status, content, images, confirm}) {
        let url = `${urlPre}/${id}/reply`
        if (images) {
            images = JSON.stringify(images)
        }
        if (confirm) {
            confirm = 1
        } else {
            confirm = 0
        }
        return api.put(url, {status, content, images, confirm}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            } else {
                return ret.data
            }
        })
    }

    // 设为开始处理
    processing(id) {
        let url = `${urlPre}/${id}/processing`
        return api.put(url, {}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 确认已解决
    confirm(id) {
        let url = `${urlPre}/${id}/confirm`
        return api.put(url, {}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 删除数据
    remove(id) {
        let url = `${urlPre}/${id}`
        return api.del(url, {}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 获取上传图片地址
    uploadImageUrl() {
        return `${urlPre}/image`
    }

    // =====================================
    // 客户端
    // =====================================

    // 客户端查询
    mobileSearch({
                     page,
                     page_size,
                     category_id = '',
                     keyword = '',
                     status = '',
                     time_start = '',
                     time_end = ''
                 }) {
        let url = `${urlPre}/mobile/search`
        return api.get(url, {page, page_size, category_id, keyword, status, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }

    // 查看客户端数据详情
    mobileView(id) {
        let url = `${urlPre}/mobile/${id}`
        return api.get(url, {}).then((ret) => {
            return ret.data
        })
    }

    // 客户端数据修改
    mobileUpdate({
                     id,
                     status = '',
                     note = ''
                 }) {
        let url = `${urlPre}/mobile/${id}`
        return api.put(url, {status, note}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 客户端删除数据
    mobileRemove(id) {
        let url = `${urlPre}/mobile/${id}`
        return api.del(url, {}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
}

export default new FeedbackSystemService()

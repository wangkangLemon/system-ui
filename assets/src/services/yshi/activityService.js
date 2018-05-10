/**
 * Created by kangcc@vodjk.com at 2018/04/12
 */

import * as api from '../api'
import config from 'utils/config'
const urlPre = config.apiHost + '/activity'

class ActivityService {
    // 搜索
    searchActivity ({
        name,
        status,
        start_time,
        end_time,
        page,
        page_size
    }) {
        let url = `${urlPre}/list`
        return api.get(url, { name, status, start_time, end_time, page, page_size }, false).then(ret => ret.data)
    }
    // 上下线
    statusline (id, status) {
        let url = `${urlPre}/status`
        return api.put(url, JSON.stringify({id, status}))
    }
    // 上下线
    offline (id) {
        let url = `${urlPre}/${id}/offline`
        return api.put(url, {})
    }
    // 上下线
    online (id) {
        let url = `${urlPre}/${id}/online`
        return api.put(url, {})
    }
    // 删除
    delete (id) {
        let url = `${urlPre}/${id}`
        return api.del(url, {}).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
    // 创建
    createActivity ({ status = 1, name, cover, show_type, show_video_id, show_video_name, introduce, order, favorable_price, end_time, goods_ids }) {
        let url = urlPre
        return api.post(url, JSON.stringify({ status, name, cover, show_type, show_video_id, show_video_name, introduce, order, favorable_price, end_time, goods_ids })).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
        })
    }
    // 获取商品详情
    getActivityInfo ({id}) {
        let url = `${urlPre}/${id}`
        return api.get(url).then((ret) => {
            return ret.data.activity
        })
    }
    // 更新
    updateActivity ({ id, status, name, cover, show_type, show_video_id, show_video_name, introduce, order, favorable_price, end_time, goods_ids }) {
        let url = `${urlPre}`
        return api.put(url, JSON.stringify({ id, status, name, cover, show_type, show_video_id, show_video_name, introduce, order, favorable_price, end_time, goods_ids })).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
    // 获取添加编辑课程上传图片的url
    getUploadUrl ({image, alias}) {
        let url = `${urlPre}/upload`
        return api.post(url, {image, alias}).then((ret) => {
            return ret.data
        })
    }
    // 获取课程下拉列表
    courseList (keyword, page, pageSize, type = '', is_task = -1) {
        let url = `${urlPre}/search/name`
        return api.get(url, { keyword, page, page_size: pageSize, type, is_task }).then(ret => {
            return ret.data
        })
    }
    // 批量删除课程
    deleteMulty (ids) {
        let url = `${urlPre}/batchdel`
        return api.put(url, { ids })
    }

    // 批量移动课程到指定分类
    moveToCategoryMulty ({ ids, category_id }) {
        let url = `${urlPre}/batchmove`
        return api.put(url, { ids, category_id })
    }

    // 课程
    setLesson ({ id, data }) {
        let url = `${urlPre}/${id}/setlesson`
        return api.put(url, data).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
    // 设置课时
    setLessons ({course_id, jsonstr}) {
        let url = `${urlPre}/${course_id}/lesson`
        return api.put(url, jsonstr)
    }
}
export default new ActivityService()

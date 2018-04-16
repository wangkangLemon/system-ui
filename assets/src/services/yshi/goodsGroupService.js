/**
 * Created by kangcc@vodjk.com at 2018/04/12
 */

import * as api from '../api'
import config from 'utils/config'
const urlPre = config.apiHost + '/goods_group'

class GoodsGroupService {
    // 搜索
    searchGoodsGroup ({
        name,
        status,
        start_time,
        end_time,
        page,
        page_size
    }) {
        let url = `${urlPre}/list`
        return api.get(url, { name, status, start_time, end_time, page, page_size }, false).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
        })
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
    createGoodGroup ({ name, cover, show_type, show_video_id, show_video_name, introduce, goods_ids, favorable }) {
        debugger
        let url = urlPre
        return api.post(url, { name, cover, show_type, show_video_id, show_video_name, introduce, goods_ids, favorable }).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
        })
    }
    // 获取商品组合详情
    getGoodGroupInfo ({id}) {
        let url = `${urlPre}/${id}`
        return api.get(url).then((ret) => {
            return ret.data
        })
    }
    // 更新
    updateGoodGroup ({ id, name, cover, show_type, show_video_id, show_video_name, introduce, goods_ids, favorable }) {
        debugger
        let url = `${urlPre}`
        return api.put(url, { id, name, cover, show_type, show_video_id, show_video_name, introduce, goods_ids, favorable }).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
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
    // 获取添加编辑课程上传图片的url
    getUploadUrl ({image, alias}) {
        let url = `${urlPre}/upload`
        return api.post(url, {image, alias}).then((ret) => {
            return ret.data
        })
    }

    // 设置课时
    setLessons ({course_id, jsonstr}) {
        let url = `${urlPre}/${course_id}/lesson`
        return api.put(url, jsonstr)
    }
}
export default new GoodsGroupService()
/**
 * Created by kangcc@vodjk.com at 2018/04/12
 */

import * as api from '../api'
import config from 'utils/config'
const urlPre = config.apiHost + '/goods'

class GoodsService {
    // 搜索
    searchGoods ({
        name,
        start_time,
        end_time,
        page,
        page_size
    }) {
        let url = `${urlPre}/list`
        return api.get(url, { name, start_time, end_time, page, page_size }, false).then(ret => ret.list)
    }

    // 获取课程下拉列表
    courseList (keyword, page, pageSize, type = '', is_task = -1) {
        let url = `${urlPre}/search/name`
        return api.get(url, { keyword, page, page_size: pageSize, type, is_task }).then(ret => {
            return ret.data
        })
    }

    // 创建
    create ({ category_id, name, image, description, tags, company_id, price, lesson_type, award_type, award_price, publish_type, publish_list }) {
        let url = urlPre
        return api.post(url, { category_id, name, image, description, tags, company_id, price, lesson_type, award_type, award_price, publish_type, publish_list }).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
        })
    }

    // 更新
    update ({ id, category_id, name, image, description, tags, company_id, price, lesson_type, award_type, award_price, publish_type, publish_list }) {
        let url = `${urlPre}/${id}`
        return api.put(url, { category_id, name, image, description, tags, company_id, price, lesson_type, award_type, award_price, publish_type, publish_list }).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
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

    // 上下线课程
    offline (id) {
        let url = `${urlPre}/${id}/offline`
        return api.put(url, {})
    }

    // 上下线课程
    online (id) {
        let url = `${urlPre}/${id}/online`
        return api.put(url, {})
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

    // 获取课程信息
    getCourseInfo ({course_id}) {
        let url = `${urlPre}/${course_id}`
        return api.get(url).then((ret) => {
            return ret.data
        })
    }
}
export default new GoodsService()

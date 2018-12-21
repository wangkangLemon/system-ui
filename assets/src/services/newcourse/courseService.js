import * as api from '../api'
import authUtils from '../../utils/authUtils'
import config from '../../utils/config'
const urlPre = config.apiHost + '/newcourse'

class CourseService {
    // 搜索
    search({ keyword = '', status = -1, category_id = 0, course_type = '', album_id = -1, time_start, time_end, po_course, page, page_size, company_id }) {
        let url = urlPre + '/search'
        return api.get(url, { keyword, status, category_id, time_start, time_end, po_course, page, page_size, course_type, album_id, company_id }, false).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
        })
    }

    // 创建
    create({ category_id, name, image, description, tags, company_id, price, lesson_type }) {
        let url = urlPre + '/'
        company_id = company_id || authUtils.getUserInfo().company_id
        return api.post(url, { category_id, name, image, description, tags, company_id, price, lesson_type }).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
        })
    }

    // 更新
    update({ id, category_id, name, image, description, tags, company_id, price, lesson_type, update_time }) {
        let url = `${urlPre}/${id}`
        company_id = company_id || authUtils.getUserInfo().company_id
        return api.put(url, { category_id, name, image, description, tags, company_id, price, lesson_type, update_time }).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 删除
    delete(id) {
        let url = `${urlPre}/${id}/`
        return api.del(url, {}).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 批量删除课程
    deleteMulty(ids) {
        let url = `${urlPre}/batchdel`
        return api.put(url, { ids })
    }

    // 批量移动课程到指定分类
    moveToCategoryMulty({ ids, category_id }) {
        let url = `${urlPre}/batchmove`
        return api.put(url, { ids, category_id })
    }

    // 课程
    setLesson({ id, data }) {
        let url = `${urlPre}/${id}/setlesson`
        return api.put(url, data).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 上下线课程
    offline(id) {
        let url = `${urlPre}/${id}/offline`
        return api.put(url, {})
    }

    // 上下线课程
    online(id) {
        let url = `${urlPre}/${id}/online`
        return api.put(url, {})
    }
    // 发布
    publish ({
        id,
        publish_status
    }) {
        let url = `${urlPre}/${id}/publish`
        let txt = publish_status == 1 ? '撤回' : '发布'
        return api.put(url, { publish_status }).then(ret => {
            xmview.showTip('success', ret.message || `${txt}成功`)
        })
    }
    // 获取添加编辑课程上传图片的url
    getUploadUrl({image, alias}) {
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
export default new CourseService()

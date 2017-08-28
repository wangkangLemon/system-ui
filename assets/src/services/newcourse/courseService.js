import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/newcourse'

class CourseService {
    // 搜索
    search({ keyword = '', status = -1, category_id = 0, time_start, time_end, page, page_size }) {
        let url = urlPre + '/search'
        return api.get(url, { keyword, status, category_id, time_start, time_end, page, page_size }, false).then(ret => {
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
        return api.post(url, { category_id, name, image, description, tags, company_id, price, lesson_type }).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
        })
    }

    // 更新
    update({ id, category_id, name, image, description, tags, company_id, price, lesson_type }) {
        let url = `${urlPre}/${id}`
        return api.post(url, { category_id, name, image, description, tags, company_id, price, lesson_type }).then(ret => {
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

    // 获取添加编辑课程上传图片的url
    getUploadUrl({ companyid } = {}) {
        return `${urlPre}/upload`
    }
}
export default new CourseService()

/**
 * Created by huangrui on 2017/3/31.
 */
import * as api from './api'
import config from '../utils/config'
const urlPre = config.apiHost + '/sys/course'

class CourseService {
    // 获取管理员列表
    courseList (keyword, page, pageSize) {
        let url = urlPre + '/search/name'
        return api.get(url, {keyword, page, page_size: pageSize}, false).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
        })
    }

    // 获取课程列表
    getCourseList ({status, category, company_id, course_id, page, page_size, time_start, time_end, keyword}) {
        let url = urlPre + '/search'
        return api.get(url, {
            status, // 2- 视屏转码中 1-下线 0-正常
            category, // 1-工业 默认-公开课
            course_id,
            company_id,
            page,
            page_size,
            time_start,
            time_end,
            keyword
        }).then(ret => {
            return ret.data
        })
    }
}
export default new CourseService()

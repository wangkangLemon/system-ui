/**
 * Created by huangrui on 2017/3/31.
 */
import * as api from './api'
import authUtils from '../utils/authUtils'
import config from '../utils/config'
const urlPre = config.apiHost + '/sys/course'

class CourseService {
    // 获取管理员列表
    courseList (keyword, page, pageSize) {
        let url = `${urlPre}/search/name`
        return api.get(url, {keyword, page, page_size: pageSize}, false).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
        })
    }

    // 获取公开课列表
    getPublicCourselist ({companyid, page, page_size, status, keyword, time_start, time_end, category_id, need_testing}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/search`
        return api.get(finalUrl, {
            page,
            page_size,
            status, // 课程状态 不赋值则表示全部，0为正常，1为下线，2为视频转码中
            keyword, // 课程名称
            time_start,
            time_end,
            category_id,
            need_testing // 课后考试 不赋值则表示全部，0为不需要，1为需要
        }).then(ret => {
            return ret.data
        })
    }

    // 获取课程列表
    getCourseList ({status, category, company_id, category_id, page, page_size, time_start, time_end, keyword}) {
        let url = urlPre + '/search'
        return api.get(url, {
            status, // 2- 视屏转码中 1-下线 0-正常
            category, // 1-工业 默认-公开课
            category_id,
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

    // 获取课程栏目树
    getCategoryTree ({companyid, id = 'tree', filter = true}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/category/children`
        return api.get(finalUrl, {id, filter})
    }
}
export default new CourseService()

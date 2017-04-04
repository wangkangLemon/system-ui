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
    getCourseList ({date, store_id, type, course_id, page, page_size}) {
        let url = urlPre + '/stat/search'
        return api.get(url, {
            date, // yesterday 为昨日，week为本周，prevweek 为上周，month为本月，prevmonth 为上月
            store_id,
            type, // public 为公开课，private 为私有课，industry为工业课，不赋值则表示全部
            course_id,
            page,
            page_size
        }).then(ret => {
            return ret.data
        })
    }
}
export default new CourseService()

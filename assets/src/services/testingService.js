/**
 * Created by huanghuixin on 2017/4/1.
 */
import * as api from './api'
import config from '../utils/config'
import authUtils from '../utils/authUtils'

const urlPre = config.apiHost + '/sys/testing'

class TestingService {
    // 获取管理员列表
    getAmount () {
        let url = urlPre
        return api.get(url).then(ret => {
            return ret.data.analytics
        })
    }

    // 获取考试记录
    getHistory ({enterprise_id, page, page_size, course_id, company_id, department_id, account, time_start, time_end, grade}) {
        let finalUrl = urlPre + '/history/search'
        return api.get(finalUrl, {
            page,
            page_size,
            course_id,
            company_id, // 连锁
            department_id,
            account,
            time_start,
            time_end,
            enterprise_id,
            grade, // 不赋值则为未选择，1位满分，2为及格，3为不及格
        }).then((ret) => {
            return ret.data
        })
    }

    // 获取考试分析列表
    getTestingList ({date, page, page_size}) {
        let finalUrl = urlPre + '/search'
        return api.get(finalUrl, {date, page, page_size}).then((ret) => {
            return ret.data
        })
    }

    // 导出考试记录
    exportTesting (reqObj) {
        let finalUrl = urlPre + '/history/search'
        api.downLoad(finalUrl, Object.assign(reqObj, {export: 1}), '考试记录.xls')
    }

    // 异步导出考试记录
    exportTestingHistoryAsync ({name = '全部_考试记录'} = {}) {
        let companyid = authUtils.getUserInfo().company_id
        let url = `${config.apiHost}/com/${companyid}/export/testing`
        return api.post(url, {name})
    }
}
export default new TestingService()

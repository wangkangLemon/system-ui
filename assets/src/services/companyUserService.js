/**
 * Created by huangrui on 2017/4/8.
 */
// 店员
import * as api from './api'
import config from '../utils/config'
const urlPre = config.apiHost + '/sys/user'
class CompanyUserService {
    // 查看店员详情
    userDetail (userID) {
        let finalUrl = `${urlPre}/${userID}`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }

    // 获取店员列表
    getUserList ({
        page = '',
        page_size = '',
        company_id = '',
        keyword = '',
        mobile = '',
        email = '',
        user_type = '',
        time_start = '',
        time_end = '',
        last_appstart = '',
        nologin_timestart = ''
    }) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, {page, page_size, company_id, keyword, mobile, email, user_type, time_start, time_end, last_appstart, nologin_timestart}).then((ret) => {
            return ret.data
        })
    }

    // 连锁统计
    getCompanyState ({
        page = '',
        page_size = '',
        time_start = ''
    }) {
        let finalUrl = `${urlPre}/stat/search`
        return api.get(finalUrl, {page, page_size, time_start}).then((ret) => {
            return ret.data
        })
    }

    // 地域统计
    getAreaState ({
        page = '',
        page_size = '',
        time_start = ''
    }) {
        let finalUrl = `${urlPre}/stat/area/search`
        return api.get(finalUrl, {page, page_size, time_start}).then((ret) => {
            return ret.data
        })
    }
}
export default new CompanyUserService()

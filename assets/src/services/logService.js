/**
 * Created by huangrui on 2017/4/11.
 */
import * as api from './api'
import config from '../utils/config'
const urlPre = config.apiHost + '/sys/log'
class LogService {
    // 系统管理查询
    getSystemManageList ({
        page,
        page_size,
        admin_id = '',
        ip = '',
        time_start = '',
        time_end = ''
    }) {
        let finalUrl = `${urlPre}/admin/search`
        return api.get(finalUrl, {page, page_size, admin_id, ip, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }
    // 系统管理后台查询
    getSystemBackList ({
        page,
        page_size,
        admin_id = '',
        ip = '',
        time_start = '',
        time_end = '',
        account_type = ''
    }) {
        let finalUrl = `${urlPre}/admin/login/search`
        return api.get(finalUrl, {page, page_size, admin_id, ip, account_type, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }
    // 企业后台登录查询
    getCompanyLoginList ({
        page,
        page_size,
        admin_id = '',
        ip = '',
        time_start = '',
        time_end = '',
        account_type = '',
        company_id = ''
    }) {
        let finalUrl = `${urlPre}/company/login/search`
        return api.get(finalUrl, {page, page_size, admin_id, ip, account_type, time_start, time_end, company_id}).then((ret) => {
            return ret.data
        })
    }

    // 前台登录
    getUserLoginList ({
        page,
        page_size,
        admin_id = '',
        ip = '',
        time_start = '',
        time_end = '',
        account_type = ''
    }) {
        let finalUrl = `${urlPre}/user/login/search`
        return api.get(finalUrl, {page, page_size, admin_id, ip, account_type, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }
    // 手机验证码
    getSmsCodeList ({
        page,
        page_size,
        success = '',
        ip = '',
        mobile = '',
        time_start = '',
        time_end = '',
    }) {
        let finalUrl = `${urlPre}/sms/code/search`
        return api.get(finalUrl, {page, page_size, success, ip, mobile, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }
    // 邮件验证码
    getMailCodeList ({
        page,
        page_size,
        email = '',
        ip = '',
        time_start = '',
        time_end = '',
    }) {
        let finalUrl = `${urlPre}/mail/code/search`
        return api.get(finalUrl, {page, page_size, email, ip, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }

    // 行为日志
    getBehaviorList ({
         page,
         page_size,
         company_id,
         department_id,
         action,
         time_start,
         time_end,
         level,
         user_id,
         admin_id,
    }) {
        let finalUrl = `${urlPre}/behavior/search`
        return api.get(finalUrl, {page,
            page_size,
            company_id,
            department_id,
            action,
            time_start,
            time_end,
            level,
            user_id,
            admin_id,
        }).then((ret) => {
            return ret.data
        })
    }

    // 获取详细行为日志
    getBehaviorInfo ({
        record_id,
    }) {
        let finalUrl = `${urlPre}/behavior/${record_id}/steps`
        return api.get(finalUrl, {}).then((ret) => {
            return ret.data
        })
    }
}
export default new LogService()

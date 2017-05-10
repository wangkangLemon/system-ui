/**
 * Created by huangrui on 2017/5/9.
 */
// 药我说统计
import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/sys/speaking/stat'

class SpeakingStatService {
    // 系统药我说查询
    systemSpeakingSearch ({date, speaking_id, page, page_size}) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, {speaking_id, date, page, page_size}).then((ret) => {
            return ret.data
        })
    }
    // 系统连锁查询
    systemCompanySearch ({speaking_id, date, store_id, page, page_size}) {
        let finalUrl = `${urlPre}/${speaking_id}/store/search`
        return api.get(finalUrl, {date, store_id, page, page_size}).then((ret) => {
            return ret.data
        })
    }
    // 系统门店查询
    systemDepartmentSearch ({speaking_id, company_id, date, department_id, page, page_size}) {
        let finalUrl = `${urlPre}/${speaking_id}/${company_id}/department/search`
        return api.get(finalUrl, {date, page, department_id, page_size}).then((ret) => {
            return ret.data
        })
    }
    // 系统店员查询
    systemUserSearch ({speaking_id, company_id, department_id, user_id, date, page, page_size}) {
        let finalUrl = `${urlPre}/${speaking_id}/${company_id}/${department_id}/user/search`
        return api.get(finalUrl, {user_id, date, page, page_size}).then((ret) => {
            return ret.data
        })
    }

    // 企业统计查询
    companySearch ({store_id, status, date, page, page_size}) {
        let finalUrl = `${urlPre}/com/search`
        return api.get(finalUrl, {store_id, status, date, page, page_size}).then((ret) => {
            return ret.data
        })
    }
    // 企业下药我说统计查询
    companySpeakingSearch ({store_id, speaking_id, date, page, page_size}) {
        let finalUrl = `${urlPre}/com/${store_id}/speaking/search`
        return api.get(finalUrl, {speaking_id, date, page, page_size}).then((ret) => {
            return ret.data
        })
    }
}
export default new SpeakingStatService()

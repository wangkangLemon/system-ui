import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/sys/tools'

class SystemToolsService {
    batSetPasswd({ company_id, department_id, set_type, passwd }) {
        let finalUrl = `${urlPre}/batchsetpasswd`
        return api.post(finalUrl, { company_id, department_id, set_type, passwd }).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
    getSignAnalytics() {
        let finalUrl = `${urlPre}/signanalytics`
        return api.get(finalUrl, {}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
            return ret.data
        })
    }
    setSignAnalytics({ department_total, department_today, department_yesterday, user_total, user_today, user_yesterday }) {
        let finalUrl = `${urlPre}/signanalytics`
        return api.post(finalUrl, { department_total, department_today, department_yesterday, user_total, user_today, user_yesterday }).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
}

export default new SystemToolsService()

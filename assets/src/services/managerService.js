/**
 * Created by huangrui on 2017/4/8.
 */
import * as api from './api'
import config from '../utils/config'
const urlPre = config.apiHost + '/sys/manager'

class ManagerService {
    // 获取店长列表
    getManager ({
        page = '',
        page_size = '',
        company_id = '',
        deleted = '',
        manager_name = '',
        manager_mobile = '',
        time_start = '',
        time_end = ''
    }) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, {page, page_size, company_id, deleted, manager_name, manager_mobile, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }
    exportManager (reqObj) {
        let parmas = api.processParams(reqObj)
        let finalUrl = `${urlPre}/search?export=1&${parmas}`
        return finalUrl
    }
}

export default new ManagerService()

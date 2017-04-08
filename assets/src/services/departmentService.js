/**
 * Created by huangrui on 2017/4/7.
 */
import * as api from './api'
import config from '../utils/config'
const urlPre = config.apiHost + '/sys/department'

class DepartmentService {
    // 获取门店列表
    getDepartment ({
        page = '',
        page_size = '',
        company_id = '',
        province = '',
        city = '',
        area = '',
        keyword = '',
        concact = '',
        time_start = '',
        time_end = ''}) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, {page, page_size, company_id, province, city, area, keyword, concact, time_start, time_end}, false).then((ret) => {
            return ret.data
        })
    }
    // 获取详情接口
    getDepInfo (val) {
        let finalUrl = `${urlPre}/${val}`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }
    // 删除门店
    depDelete(userID) {
        let finalUrl = `${urlPre}/${userID}`
        return api.del(finalUrl, {}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
}
export default new DepartmentService()

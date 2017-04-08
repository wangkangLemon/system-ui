/**
 * Created by huangrui on 2017/4/7.
 */
import * as api from './api'
import config from '../utils/config'
const urlPre = config.apiHost + '/sys/department'

class DepartmentService {
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
}
export default new DepartmentService()

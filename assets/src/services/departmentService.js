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
        contact = '',
        time_start = '',
        time_end = ''}) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, {page, page_size, company_id, province, city, area, keyword, contact, time_start, time_end}, false).then((ret) => {
            return ret.data
        })
    }
    //获取门店列表2
     getDepartmentTwo ({
        page = '',
        page_size = '',
        company_id = '',
        department_id='',
        keyword = ''
     }) {
        let finalUrl = config.apiHost+'/com/'+company_id+'/department/'+department_id+'/tree'
        return api.get(finalUrl, {page, page_size, company_id, keyword}, false).then((ret) => {
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
    exportDepartment (reqObj) {
        let finalUrl = `${urlPre}/search`
        api.downLoad(finalUrl, Object.assign(reqObj, {export: 1}), 'department.xls')
    }
}
export default new DepartmentService()

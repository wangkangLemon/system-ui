/**
 * Created by huanghuixin on 2017/3/30.
 */
import * as api from './api'
import config from '../utils/config'
const urlPre = config.apiHost + '/sys/company'

class CompanyService {
    // 获取工业连锁店
    // category - 0-企业 1-工业 2-连锁
    getIndrustrySelectList ({
        category = '',
        page_size = '',
        page = '',
        province = '',
        city = '',
        area = '',
        time_start = '',
        time_end = '',
        keyword = ''}) {
        let finalUrl = urlPre + '/search'
        return api.get(finalUrl, {category, page, page_size, province, city, area, time_start, time_end, keyword}, false).then((ret) => {
            return ret.data
        })
    }

    // 获取详情接口
    getCompanyInfo (val) {
        let finalUrl = `${urlPre}/${val}`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }
    // 添加企业
    addCompany ({category, name, concact, mobile, email, tel, fax, province, city, area, address, zip, url, description, department_number, user_number, user_name, sign_time, expire_time}) {
        return api.post(urlPre, {category, name, concact, mobile, email, tel, fax, province, city, area, address, zip, url, description, department_number, user_number, user_name, sign_time, expire_time}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
    // 修改企业信息
    editCompany (val) {
        let finalUrl = `${urlPre}/${val}/edit`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }
    // 更新企业信息
    updateCompany ({category, name, concact, mobile, email, tel, fax, province, city, area, address, zip, url, description, department_number, user_number, user_name, sign_time, expire_time, company_id}) {
        let finalUrl = `${urlPre}/${company_id}`
        return api.put(finalUrl, {category, name, concact, mobile, email, tel, fax, province, city, area, address, zip, url, description, department_number, user_number, user_name, sign_time, expire_time}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
    // 企业管理员查询接口
    companyAdmin ({keyword, company_id, page, page_size}) {
        let finalUrl = `${urlPre}/${company_id}/admin/search`
        return api.get(finalUrl, {keyword, page, page_size}).then((ret) => {
            return ret.data
        })
    }
    // 新增管理员
    addCompanyAdmin ({department_id, name, sex, mobile, passwd, birthday, address, company_id}) {
        let finalUrl = `${urlPre}/${company_id}/admin`
        return api.post(finalUrl, {department_id, name, sex, mobile, passwd, birthday, address}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
}

export default new CompanyService()

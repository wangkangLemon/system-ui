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
    addCompany ({
        category,
        name,
        concact,
        mobile,
        email,
        tel,
        fax,
        province,
        city,
        area,
        address,
        zip,
        url,
        description,
        department_number,
        user_number,
        user_name,
        sign_time,
        expire_time}) {
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

    // 获取公告列表
    getAnnounceList ({
        page = '',
        page_size = '',
        company_id = '',
        keyword = '',
        status = '',
        type = ''
    }) {
        let finalUrl = `${urlPre}/announce/search`
        return api.get(finalUrl, {page, page_size, company_id, keyword, status, type}).then((ret) => {
            return ret.data
        })
    }

    // 拿药练习
    getMedicineList ({
        page = '',
        page_size = ''
    }) {
        let finalUrl = config.apiHost + '/sys/medicine/company/search'
        return api.get(finalUrl, {page, page_size}).then((ret) => {
            return ret.data
        })
    }

    // 课程任务
    getCourseTaskList ({
        page = '',
        page_size = ''
    }) {
        let finalUrl = config.apiHost + '/sys/coursetask/company/search'
        return api.get(finalUrl, {page, page_size}).then((ret) => {
            return ret.data
        })
    }

    // 统计列表
    getStatList ({
        page = '',
        page_size = ''
    }) {
        let finalUrl = `${urlPre}/analytics/grow/search`
        return api.get(finalUrl, {page, page_size}).then((ret) => {
            return ret.data
        })
    }
    // 导出统计表
    exportStat () {
        let finalUrl = `${urlPre}/search?export=1`
        return finalUrl
    }

    // 审计列表
    getAuditList ({
        page = '',
        page_size = '',
        keyword = '',
        status = '',
        time_start = '',
        time_end = ''
    }) {
        let finalUrl = `${urlPre}/audit/search`
        return api.get(finalUrl, {page, page_size, keyword, status, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }

    // 查询审计详情
    getAuditDetail (id) {
        let finalUrl = `${urlPre}/audit/${id}`
        return api.get(finalUrl, {}).then((ret) => {
            return ret.data
        })
    }

    // 审计审核提交
    addAudit ({
        audit_id,
        status,
        note = ''
    }) {
        let finalUrl = `${urlPre}/audit/${audit_id}`
        return api.put(finalUrl, {status, note}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 获取企业签约信息接口
    getCompanySignList ({
        page,
        page_size,
        keyword = '',
        isdepartment = '',
        isuser = '',
        signatory = '',
        time_start = '',
        time_end = ''
    }) {
        let finalUrl = `${urlPre}/sign/search`
        return api.get(finalUrl, {page, page_size, keyword, isdepartment, isuser, signatory, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }

    // 企业签约信息导入
    importData () {
        return `${urlPre}/sign/import`
    }

    // 获取签约信息预览的 上面三大板块
    getSignMessage () {
        let finalUrl = `${urlPre}/sign/`
        return api.get(finalUrl, {}).then((ret) => {
            return ret.data
        })
    }

    // 获取连锁信息的接口
    getSignDetail (signID) {
        let finalUrl = `${urlPre}/sign/view/${signID}`
        return api.get(finalUrl, {}).then((ret) => {
            return ret.data
        })
    }
    // 删除管理员接口
    delAdmin ({
        company_id,
        id
    }) {
        let finalUrl = `${urlPre}/${company_id}/admin/${id}`
        return api.del(finalUrl)
    }
}

export default new CompanyService()

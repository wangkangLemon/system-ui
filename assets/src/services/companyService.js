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
                                keyword = ''
                            }) {
        let finalUrl = urlPre + '/search'
        return api.get(finalUrl, {
            category,
            page,
            page_size,
            province,
            city,
            area,
            time_start,
            time_end,
            keyword
        }, false).then((ret) => {
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
                    contact,
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
                    department_count,
                    user_number,
                    signatory,
                    sign_time,
                    expire_time
                }) {
        return api.post(urlPre, {
            category,
            name,
            contact,
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
             department_count,
            user_number,
            signatory,
            sign_time,
            expire_time
        }).then((ret) => {
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
        }).catch((err)=>{
        	return  reject({err, xhr})
        })
    }
    //企业关联
    corporate({company_id,ids}) {
        let finalUrl = config.apiHost+'/com/'+company_id+'/department/link'
        return api.post(finalUrl, {
           ids
        }).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
    // 更新企业信息
    updateCompany ({category, name, contact, mobile, email, tel, fax, province, city, area, address, zip, url, description, department_number, department_count, user_number, signatory, sign_time, expire_time, company_id}) {
        let finalUrl = `${urlPre}/${company_id}`
        return api.put(finalUrl, {
            category,
            name,
            contact,
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
             department_count,
            user_number,
            signatory,
            sign_time,
            expire_time
        }).then((ret) => {
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

    // 编辑时获取文章内容
    getCourseTaskTemplateEditDetail (id) {
        let finalUrl = config.apiHost + '/sys/coursetask/template/' + id
        return api.get(finalUrl, {}).then((ret) => {
            return ret.data
        })
    }

    // 课程任务模板管理
    getCourseTaskTemplateList ({
                                   category_id = '',
                                   title = '',
                                   page = '',
                                   page_size = ''
                               }) {
        let finalUrl = config.apiHost + '/sys/coursetask/template/search'
        return api.get(finalUrl, {category_id, title, page, page_size}).then((ret) => {
            return ret.data
        })
    }

    // 获取课程任务模板上传图片url
    CourseTaskTemplateUploadUrl ({avatar, alias}) {
        let url = config.apiHost + `/sys/coursetask/template/cover`
        return api.post(url, {avatar, alias})
    }

    // 创建课程任务模板
    addCourseTaskTemplate ({category_id, title, description, image, course_id, sort, status}) {
        let finalUrl = config.apiHost + `/sys/coursetask/template`
        return api.post(finalUrl, {category_id, title, description, image, course_id, sort, status}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 更新课程任务模板
    updateCourseTaskTemplate ({category_id, title, description, image, course_id, sort, id, status}) {
        let finalUrl = config.apiHost + `/sys/coursetask/template/${id}`
        return api.put(finalUrl, {
            category_id,
            title,
            description,
            image,
            course_id,
            sort,
            id,
            status
        }).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 删除课程任务模板
    deleteCourseTaskTemplate (task_id) {
        let finalUrl = config.apiHost + `/sys/coursetask/template/${task_id}`
        return api.del(finalUrl, {})
    }

    // 上线课程任务模板
    publishCourseTaskTemplate (task_id) {
        let finalUrl = config.apiHost + `/sys/coursetask/template/${task_id}/publish`
        return api.put(finalUrl, {})
    }

    // 下线课程任务模板
    revokeCourseTaskTemplate (task_id) {
        let finalUrl = config.apiHost + `/sys/coursetask/template/${task_id}/revoke`
        return api.put(finalUrl, {})
    }

    // 获取课程任务模板分类
    getCategoryTree ({id = 'tree', filter = true}) {
        let finalUrl = config.apiHost + '/sys/coursetask/template/category/children'
        return api.get(finalUrl, {id, filter}).catch((ret) => {
            ret.tipCom && ret.tipCom.close()
            return ret
        })
    }

    // 创建分类
    createCategory ({parent_id, name, image, sort}) {
        let finalUrl = config.apiHost + `/sys/coursetask/template/category`
        let reqParam = {parent_id, name, image, sort}
        if (parent_id === 0) delete reqParam['parent_id']
        return api.post(finalUrl, reqParam)
    }

    // 修改分类
    updateCategory ({name, image, sort, id}) {
        let finalUrl = config.apiHost + `/sys/coursetask/template/category/${id}`
        return api.put(finalUrl, {name, image, sort})
    }

    // 删除分类
    delCategory ({id}) {
        let finalUrl = config.apiHost + `/sys/coursetask/template/category/${id}`
        return api.del(finalUrl).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 获取分类上传图片地址
    getCategoryImageUrl () {
        let finalUrl = config.apiHost + `/sys/coursetask/template/category/image`
        return finalUrl
    }

    // 移动分类
    moveCategory ({id, to}) {
        let finalUrl = config.apiHost + `/sys/coursetask/template/category/${id}/move`
        return api.put(finalUrl, {to})
    }

    // 移动分类内容
    moveCategoryContent ({id, to}) {
        let finalUrl = config.apiHost + `/sys/coursetask/template/category/${id}/move/content`
        return api.put(finalUrl, {to})
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
        let finalUrl = `${urlPre}/analytics/grow/search`
        api.downLoad(finalUrl, {export: 1}, 'stat.xls')
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
                            time_end = '',
                            time_active_start = '',
                            time_active_end = '',
                            province = ''
                        }) {
        let finalUrl = `${urlPre}/sign/search`
        return api.get(finalUrl, {
            page,
            page_size,
            keyword,
            isdepartment,
            isuser,
            signatory,
            time_start,
            time_end,
            time_active_start,
            time_active_end,
            province
        }).then((ret) => {
            return ret.data
        })
    }

    // 导出企业签约信息
    exportSign (reqObj) {
        let finalUrl = `${urlPre}/sign/search`
        api.downLoad(finalUrl, Object.assign(reqObj, {export: 1}), 'company_sign.xls')
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

    // 上传企业logo
    CompanyLogoUpload ({company_id, image, alias}) {
        let finalUrl = `${config.apiHost}/com/${company_id}/mobile/logo/upload`
        return api.post(finalUrl, {image, alias}).then((ret) => {
            return ret.data
        })
    }

    // 获取企业logo
    getCompanyLogo ({company_id}) {
        let finalUrl = `${config.apiHost}/com/${company_id}/mobile/logo`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }

    // 设置企业logo
    setCompanyLogo ({company_id, logo}) {
        let finalUrl = `${config.apiHost}/com/${company_id}/mobile/logo`
        return api.put(finalUrl, {logo})
    }

    // 管理员活跃情况
    getCompanyManage({
                         page,
                         page_size,
                         name = '',
                         user_name = '',
                         company_id,
                         role = '',
                         time_start = '',
                         time_end = '',
                     }) {
        let finalUrl = `${urlPre}/login/search`
        return api.get(finalUrl, {page, page_size, name, user_name, company_id, role, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }
    // 管理员综合统计情况
    getCompanyManageStat () {
        let finalUrl = `${urlPre}/login/stat`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }

    // 企业活跃情况
    getCompanyStat ({
                      page,
                      page_size,
                      store_id,
                      stat_date,
                  }) {
        let finalUrl = `${urlPre}/stat/search`
        return api.get(finalUrl, {page, page_size, store_id, stat_date}).then((ret) => {
            return ret.data
        })
    }

    // 企业活跃情况 详细内容
    getCompanyStatView ({
                        page,
                        page_size,
                        store_id,
                        start_date,
                        end_date,
                    }) {
        let finalUrl = `${urlPre}/stat/search/company`
        return api.get(finalUrl, {page, page_size, store_id, start_date, end_date}).then((ret) => {
            return ret.data
        })
    }

    // 企业活跃情况 图表信息
    getCompanyStatChart ({
                            store_id,
                            start_date,
                            end_date,
                        }) {
        let finalUrl = `${urlPre}/stat/chart`
        return api.get(finalUrl, {store_id, start_date, end_date}).then((ret) => {
            return ret.data
        })
    }

    // 获取公告统计数据
    getCompanyAppAnnounceStat () {
        let finalUrl = `${urlPre}/app/announce`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }

    // 获取公告统计数据
    getCompanyAppAnnounceDetail ({
                                     company_id,
                                     department_id,
                                     type,
                                 }) {
        let finalUrl = `${urlPre}/app/announce/detail`
        return api.get(finalUrl, {company_id, department_id, type}).then((ret) => {
            return ret.data
        })
    }

    // 获取公告内容
    getAnnounceView ({
                       company_id,
                       announce_id
                    }) {
        let finalUrl = `${urlPre}/app/announce/view`
        return api.get(finalUrl, {company_id, announce_id}).then((ret) => {
            return ret.data
        })
    }

    // 获取公告统计列表
    getCompanyAnnounce({
                         page,
                         page_size,
                         company_id,
                         department_id,
                         type,
                         time_start = '',
                         time_end = '',
                     }) {
        let finalUrl = `${urlPre}/app/announce/search`
        return api.get(finalUrl, {page, page_size, company_id, department_id, type, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }

    // 获取课程任务统计数据
    getCompanyAppCourseTaskStat () {
        let finalUrl = `${urlPre}/app/coursetask`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }

    // 获取课程任务统计数据
    getCompanyAppCourseTaskDetail ({
                                     company_id,
                                     department_id,
                                     type,
                                 }) {
        let finalUrl = `${urlPre}/app/coursetask/detail`
        return api.get(finalUrl, {company_id, department_id, type}).then((ret) => {
            return ret.data
        })
    }

    // 获取课程任务统计列表
    getCompanyCourseTask({
                           page,
                           page_size,
                           company_id,
                           department_id,
                           time_start = '',
                           time_end = '',
                       }) {
        let finalUrl = `${urlPre}/app/coursetask/search`
        return api.get(finalUrl, {page, page_size, company_id, department_id, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }

    // 获取拿药练习统计数据
    getCompanyAppMedicineTaskStat () {
        let finalUrl = `${urlPre}/app/medicinetask`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }
    // 获取拿药练习统计数据
    getCompanyAppMedicineTaskDetail ({
                                       company_id,
                                       department_id,
                                       type,
                                   }) {
        let finalUrl = `${urlPre}/app/medicinetask/detail`
        return api.get(finalUrl, {company_id, department_id, type}).then((ret) => {
            return ret.data
        })
    }
    // 获取拿药练习统计列表
    getCompanyMedicineTask({
                             page,
                             page_size,
                             company_id,
                             department_id,
                             time_start = '',
                             time_end = '',
                         }) {
        let finalUrl = `${urlPre}/app/medicinetask/search`
        return api.get(finalUrl, {page, page_size, company_id, department_id, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }

    // 获取启动图统计列表
    getCompanyStartLogo({
                               page,
                               page_size,
                               company_id,
                               time_start = '',
                               time_end = '',
                           }) {
        let finalUrl = `${urlPre}/app/startlogo/search`
        return api.get(finalUrl, {page, page_size, company_id, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }

    // 获取资讯统计列表
    getCompanyArticle({
                            page,
                            page_size,
                            company_id,
                            time_start = '',
                            time_end = '',
                        }) {
        let finalUrl = `${urlPre}/app/article/search`
        return api.get(finalUrl, {page, page_size, company_id, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }

    // 获取资讯统计数据
    getCompanyAppArticleDetail ({company_id}) {
        let finalUrl = `${urlPre}/app/article/detail`
        return api.get(finalUrl, {company_id}).then((ret) => {
            return ret.data
        })
    }

    // 获取小应用统计列表
    getCompanyAppList({
                          page,
                          page_size,
                          company_id,
                          time_start = '',
                          time_end = '',
                      }) {
        let finalUrl = `${urlPre}/app/companyapp/search`
        return api.get(finalUrl, {page, page_size, company_id, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }

    // 获取小应用统计数据
    getCompanyAppDetail ({company_id}) {
        let finalUrl = `${urlPre}/app/companyapp/detail`
        return api.get(finalUrl, {company_id}).then((ret) => {
            return ret.data
        })
    }
}

export default new CompanyService()

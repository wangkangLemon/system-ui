/**
 * Created by huangrui on 2017/3/31.
 */
import * as api from './api'
import authUtils from '../utils/authUtils'
import config from '../utils/config'
const urlPre = config.apiHost + '/sys/course'

class CourseService {
    // 获取课程分析列表
    getAnalysis ({type, course_id, date, page, page_size}) {
        let url = `${urlPre}/stat/search`
        return api.get(url, {type, course_id, date, page, page_size}).then(ret => {
            return ret.data
        })
    }

    // 导出课程分析
    exportAnalysis ({type, course_id, date, page, page_size}) {
        let url = `${urlPre}/stat/search`
        return api.downLoad(url, {type, course_id, date, page, page_size, export: 1}, '课程分析.xls')
    }

    // 获取连锁学习情况
    getStoreLearn ({date, page, page_size, store_id, course_id}) {
        let url = `${urlPre}/stat/${course_id}/store/search`
        return api.get(url, {date, store_id, page, page_size}).then(ret => {
            return ret.data
        })
    }

    // 导出连锁学习情况
    exportStoreLearn ({date, page, page_size, store_id, course_id}) {
        let url = `${urlPre}/stat/${course_id}/store/search`
        return api.downLoad(url, {date, store_id, page, page_size, export: 1}, '连锁店学习情况.xls')
    }

    // 获取门店学习情况
    getDepLearn ({date, page, page_size, department_id, store_id, course_id}) {
        let url = `${urlPre}/stat/${course_id}/${store_id}/department/search`
        return api.get(url, {date, page, page_size, department_id}).then(ret => {
            return ret.data
        })
    }

    // 导出门店学习情况
    exportDepLearn ({date, page, page_size, department_id, store_id, course_id}) {
        let url = `${urlPre}/stat/${course_id}/${store_id}/department/search`
        return api.downLoad(url, {date, page, page_size, department_id, export: 1}, '门店学习情况.xls')
    }

    // 获取店员学习情况
    getUserLearn ({date, page, page_size, department_id, store_id, course_id}) {
        let url = `${urlPre}/stat/${course_id}/${store_id}/${department_id}/user/search`
        return api.get(url, {date, page, page_size}).then(ret => {
            return ret.data
        })
    }

    // 导出店员学习情况
    exportUserLearn ({date, page, page_size, department_id, store_id, course_id}) {
        let url = `${urlPre}/stat/${course_id}/${store_id}/${department_id}/user/search`
        return api.downLoad(url, {date, page, page_size, export: 1}, '店员学习情况.xls')
    }

    // 获取课程下拉列表
    courseList (keyword, page, pageSize) {
        let url = `${urlPre}/search/name`
        return api.get(url, {keyword, page, page_size: pageSize}).then(ret => {
            return ret.data
        })
    }

    // 获取公开课列表
    getPublicCourselist ({companyid = '', page = '', page_size = '', status = '', keyword = '', time_start = '', time_end = '', category_id = '', need_testing = '', albumid = ''}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        status = status || 0
        let finalUrl = `${config.apiHost}/com/${companyid}/course/search`
        return api.get(finalUrl, {
            page,
            page_size,
            status, // 课程状态 不赋值则表示全部，0为正常，1为下线，2为视频转码中
            keyword, // 课程名称
            time_start,
            time_end,
            category_id,
            need_testing, // 课后考试 不赋值则表示全部，0为不需要，1为需要
            albumid,
        }).then(ret => {
            return ret.data
        })
    }

    // 获取课程列表
    getCourseList ({status, category, company_id, page, page_size, time_start, time_end, keyword}) {
        let url = urlPre + '/search'
        return api.get(url, {
            status, // 2- 视屏转码中 1-下线 0-正常
            category, // 1-工业 2-连锁
            company_id,
            page,
            page_size,
            time_start,
            time_end,
            keyword
        }).then(ret => {
            return ret.data
        })
    }

    // 添加课程
    addCourse ({companyid, category_id, name, image, material_type, material_id, albumid, description, need_testing, limit_time, limit_repeat, score_pass, price_enabled, price, price_float}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course`
        return api.post(finalUrl, {
            category_id,
            name,
            image,
            material_type,
            material_id,
            albumid,
            description,
            need_testing,
            limit_time,
            limit_repeat,
            score_pass,
            price_enabled,
            price,
            price_float
        }).then((ret) => {
            return ret.data
        })
    }

    // 修改课程获取课程信息接口
    getCourseInfo ({course_id}) {
        let companyid = authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/${course_id}/edit`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }
    // 修改课程
    editCourse ({companyid, id, category_id, name, image, material_type, material_id, albumid, description, need_testing, limit_time, limit_repeat, score_pass, price_enabled, price, price_float}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/${id}`
        return api.put(finalUrl, {
            category_id,
            name,
            image,
            material_type,
            material_id,
            albumid,
            description,
            need_testing,
            limit_time,
            limit_repeat,
            score_pass,
            price_enabled,
            price,
            price_float
        }).then((ret) => {
            return ret.data
        })
    }

    // 上下线课程
    offlineCourse ({companyid, course_id, disabled}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/${course_id}/disable`
        return api.put(finalUrl, {disabled})
    }

    // 获取添加编辑课程上传图片的url (与题目里的上传图片的url为同一个)
    getManageImgUploadUrl ({companyid} = {}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        return `${config.apiHost}/com/${companyid}/course/image`
    }

    // 删除课程
    deleteCourse ({companyid, course_id}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/${course_id}`
        return api.del(finalUrl, {})
    }

    // 批量删除课程
    deleteCourseMulty ({companyid, id}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/batchdel`
        return api.post(finalUrl, {id})
    }

    // 批量移动课程到指定分类
    moveCourseToCategoryMulty ({companyid, id, catid}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/batchmove`
        return api.post(finalUrl, {id, catid})
    }

    // 弹出框请求的视频列表
    getVideo4Dialog ({companyid, status, keyword, page, page_size}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/video/search`
        return api.get(finalUrl, {keyword, status, page, page_size})
    }

    // 获取文档上传url
    getCourseDocUploadUrl ({companyid} = {}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        return `${config.apiHost}/com/${companyid}/course/doc/upload`
    }

    // 添加编辑课程上传图片
    uploadCover4addCourse ({companyid, avatar, alias = Date.now() + '.jpg'}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let url = `${config.apiHost}/com/${companyid}/course/image`
        return api.post(url, {avatar, alias}).then((ret) => {
            return ret.data
        })
    }

    // 获取课程题目
    getTestingInfo ({companyid, course_id}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/${course_id}/subject/edit`
        return api.get(finalUrl).then((ret) => {
            return ret.data.subjects
        })
    }

    // 添加或修改题目
    addOrEditTesting ({companyid, course_id, subjects}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/${course_id}/subject/`
        return api.put(finalUrl, subjects).then((ret) => {
            return ret.data
        })
    }

    // ============================================= 栏目 开始 ======================================================
    // 获取课程栏目树
    getCategoryTree ({companyid, id = 'tree', filter = true}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/category/children`
        return api.get(finalUrl, {id, filter}).catch((ret) => {
            ret.tipCom.close()
            return ret
        })
    }

    // 获取上传栏目图片的url
    getUploadCategoryImgUrl ({companyid} = {}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/category/image`
        return finalUrl
    }

    // 添加栏目
    addCategory ({companyid, parent_id, name, image, sort}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let reqParam = {parent_id, name, image, sort}
        if (parent_id === 0) delete reqParam['parent_id']

        let finalUrl = `${config.apiHost}/com/${companyid}/course/category`
        return api.post(finalUrl, reqParam)
    }

    // 修改栏目
    updateCategory ({companyid, name, image, sort, id}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/category/${id}`
        return api.put(finalUrl, {name, image, sort})
    }

    // 删除栏目
    deleteCategory ({companyid, id}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/category/${id}`
        return api.del(finalUrl, {})
    }

    // 移动栏目
    moveCategory ({companyid, id, to}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/category/${id}/move`
        return api.put(finalUrl, {to})
    }

    // 移动栏目下内容
    moveCategoryContent ({companyid, id, to}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/category/${id}/move/content`
        return api.put(finalUrl, {to})
    }

    // ============================================= 专辑 开始 ======================================================
    // 获取专辑
    getAlbumList ({companyid, page, page_size, keyword, time_start, time_end}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/album/search`
        return api.get(finalUrl, {page, page_size, keyword, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }

    // 删除专辑
    deleteAlbum ({companyid, id}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/album/${id}`
        return api.del(finalUrl, {})
    }

    // 批量删除专辑 ids: id数组
    deleteAlbumMulty ({companyid, ids}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/album/batchdel`
        return api.post(finalUrl, {id: ids.join(',')})
    }

    // 新增专辑
    addAlbum ({companyid, course_id, name}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/album/add`
        return api.post(finalUrl, {course_id: course_id.join(','), name})
    }

    // 编辑专辑
    editAlbum ({companyid, course_id, name}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/album/edit`
        return api.post(finalUrl, {course_id: course_id.join(','), name})
    }

    // ============================================= 视频页面部分 开始 ======================================================
    // 获取视频
    getVideo ({company_id, status, keyword, page, page_size, time_start, time_end}) {
        let url = `${urlPre}/video/search`
        return api.get(url, {company_id, status, keyword, page, page_size, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }

    // 添加视频
    addVideo ({name, company_id, tags, source_type, source_url}) {
        company_id = company_id || authUtils.getUserInfo().company_id
        let url = `${config.apiHost}/com/${company_id}/course/video`
        return api.post(url, {name, company_id, tags, source_type, source_url})
    }

    // 修改视频
    updateVideo ({name, company_id, tags, cover, duration, id}) {
        company_id = company_id || authUtils.getUserInfo().company_id
        let url = `${urlPre}/video/${id}`
        return api.put(url, {name, comid: company_id, tags, cover, duration})
    }

    // 获取oss的上传token
    getOssToken ({companyid} = {}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/video/upload`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }

    // 刷新视频状态
    refreshVideoStatus ({companyid, id} = {}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/video/refresh/aliyun/status`
        return api.post(finalUrl, {id})
    }

    // 获取上传封面的url
    getVideoUploadCoverUrl () {
        return `${urlPre}/video/cover`
    }

    deleteVideo ({id}) {
        let url = `${urlPre}/video/${id}`
        return api.del(url)
    }

    // 获取视频预览地址
    getVideoPreviewUrl (id) {
        let url = `${urlPre}/video/${id}/preview`
        return api.get(url).then((ret) => {
            return ret.data
        })
    }

    // ============================================= 文档管理部分 开始 ======================================================
    getDocList ({page, page_size, keyword, company_id, file_type, time_start, time_end}) {
        let url = `${urlPre}/doc/search`
        return api.get(url, {page, page_size, keyword, company_id, file_type, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }

    deleteDoc ({id}) {
        let url = `${urlPre}/doc/${id}`
        return api.del(url)
    }

    // 批量删除
    deleteDocMulty ({id}) {
        let url = `${urlPre}/doc/batchdel`
        return api.del(url, {id: id.join(',')})
    }

    // 获取课程信息以及选项列表
    getCourseSubject ({id}) {
        let finalUrl = `${urlPre}/${id}/subject/stat`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }

    // 获取课程题目答案分析
    getSubjectAnswer ({c_id, s_id}) {
        let finalUrl = `${urlPre}/${c_id}/subject/${s_id}/stat`
        return api.get(finalUrl).then((ret) => {
            return ret.data.stat
        })
    }

    // 查看文档
    readDoc ({doc_id}) {
        let finalUrl = `${urlPre}/doc/${doc_id}/view`
        return api.get(finalUrl)
    }

    // 下载文档
    downloadDoc ({id, name}) {
        let finalUrl = `${urlPre}/doc/${id}/download`
        return api.downLoad(finalUrl, {}, name)
    }

    // 查询状态
    refreshDoc({id}) {
        let finalUrl = `${urlPre}/doc/${id}/refresh`
        return api.get(finalUrl)
    }

    // 重试转码
    retryDoc({id}) {
        let finalUrl = `${urlPre}/doc/${id}/retry`
        return api.get(finalUrl)
    }
}

export default new CourseService()

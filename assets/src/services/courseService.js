/**
 * Created by huangrui on 2017/3/31.
 */
import * as api from './api'
import authUtils from '../utils/authUtils'
import config from '../utils/config'
const urlPre = config.apiHost + '/sys/course'

class CourseService {
    // 获取管理员列表
    courseList (keyword, page, pageSize) {
        let url = `${urlPre}/search/name`
        return api.get(url, {keyword, page, page_size: pageSize}, false).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
        })
    }

    // 获取公开课列表
    getPublicCourselist ({companyid, page, page_size, status, keyword, time_start, time_end, category_id, need_testing}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/search`
        return api.get(finalUrl, {
            page,
            page_size,
            status, // 课程状态 不赋值则表示全部，0为正常，1为下线，2为视频转码中
            keyword, // 课程名称
            time_start,
            time_end,
            category_id,
            need_testing // 课后考试 不赋值则表示全部，0为不需要，1为需要
        }).then(ret => {
            return ret.data
        })
    }

    // 获取课程列表
    getCourseList ({status, category, company_id, category_id, page, page_size, time_start, time_end, keyword}) {
        let url = urlPre + '/search'
        return api.get(url, {
            status, // 2- 视屏转码中 1-下线 0-正常
            category, // 1-工业 默认-公开课
            category_id,
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
    addCourse ({companyid, category_id, name, image, material_type, material_id, album_id, description, need_testing, limit_time, limit_repeat, score_pass, price_enabled, price, price_float}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course`
        return api.post(finalUrl, {
            category_id,
            name,
            image,
            material_type,
            material_id,
            album_id,
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

    // 修改课程
    editCourse ({companyid, id, category_id, name, image, material_type, material_id, album_id, description, need_testing, limit_time, limit_repeat, score_pass, price_enabled, price, price_float}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/${id}`
        return api.put(finalUrl, {
            category_id,
            name,
            image,
            material_type,
            material_id,
            album_id,
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

    // 获取添加编辑课程上传图片的url
    getManageImgUploadUrl ({companyid} = {}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        return `${config.apiHost}/com/${companyid}/course/image`
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
    addOrEditTesting ({companyid, course_id, fetchParam}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/${course_id}/subject`
        return api.post(finalUrl, fetchParam).then((ret) => {
            return ret.data
        })
    }

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

    // 获取专辑
    getAlbumList ({companyid, page, page_size, keyword, time_start, time_end}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/album/search`
        return api.get(finalUrl, {page, page_size, keyword, time_start, time_end})
    }

    // 删除专辑
    deleteAlbumList ({companyid, id}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/album/${id}`
        return api.del(finalUrl, {})
    }

    // 批量删除专辑 ids: id数组
    deleteBatchAlbumList ({companyid, ids}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/album/batchdel`
        return api.post(finalUrl, {id: ids.join(',')})
    }

    // 新增专辑
    addAlbum ({companyid, course_id, name}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/album/add`
        return api.post(finalUrl, {course_id, name})
    }

    // 编辑专辑
    editAlbum ({companyid, course_id, name}) {
        companyid = companyid || authUtils.getUserInfo().company_id
        let finalUrl = `${config.apiHost}/com/${companyid}/course/album/edit`
        return api.post(finalUrl, {course_id, name})
    }
}
export default new CourseService()

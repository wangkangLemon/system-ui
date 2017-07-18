/**
 * Created by huangrui on 2017/4/12.
 */
// 客户端-区块管理
import * as api from './api'
import config from '../utils/config'
const urlPre = config.apiHost + '/sys/section'

class SectionService {
    // 获取分类节点
    getSectionCategoryTree ({
        id = 'tree'
    }) {
        let finalUrl = `${urlPre}/category/children`
        return api.get(finalUrl, {id}).catch((ret) => {
            ret.tipCom.close()
            return ret
        })
    }
    // 获取区块列表
    getSectionList ({
        keyword = '',
        category_id = '',
        page = '',
        page_size = ''
    }) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, {keyword, category_id, page, page_size}).then((ret) => {
            return ret.data
        })
    }
    // 创建区块
    createSection ({
        category_id,
        name,
        sort = '',
        course_category_id,
        // disabled
    }) {
        let finalUrl = `${urlPre}/create`
        return api.post(finalUrl, {category_id, name, sort, course_category_id}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
    // 更新区块
    updateSection ({
        id,
        category_id,
        name,
        sort = '',
        course_category_id,
        // disabled
    }) {
        let finalUrl = `${urlPre}/${id}`
        return api.put(finalUrl, {category_id, name, sort, course_category_id}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
    // 删除区块
    delSection (id) {
        let finalUrl = `${urlPre}/${id}`
        return api.del(finalUrl, {})
    }
    // 获取区块数据列表
    getSectionDataList ({
        section_id,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/data/search`
        return api.get(finalUrl, {section_id, page, page_size}).then((ret) => {
            return ret.data
        })
    }

    // 创建区块内容数据
    createSectionData ({
        section_id,
        ref_type = '',
        ref_id = '',
        ref_sync = '',
        title,
        url,
        image = '',
        desc = '',
        tags = '',
        date = '',
        sort = ''
    }) {
        let finalUrl = `${urlPre}/${section_id}/data/create`
        return api.post(finalUrl, {ref_type, ref_id, ref_sync, title, url, image, desc, tags, date, sort}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 修改区块内容数据
    updateSectionData ({
        id,
        section_id,
        ref_type = '',
        ref_id = '',
        ref_sync = '',
        title,
        url,
        image = '',
        desc = '',
        tags = '',
        date = '',
        sort = ''
    }) {
        let finalUrl = `${urlPre}/${section_id}/data/${id}`
        return api.put(finalUrl, {ref_type, ref_id, ref_sync, title, url, image, desc, tags, date, sort}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
    // 删除区块内容
    delSectionData ({id, section_id}) {
        let finalUrl = `${urlPre}/${section_id}/data/${id}`
        return api.del(finalUrl, {})
    }
    // 创建分类
    createCategory ({parent_id, name, image, sort}) {
        let finalUrl = `${urlPre}/category`
        let reqParam = {parent_id, name, image, sort}
        if (parent_id === 0) delete reqParam['parent_id']
        return api.post(finalUrl, reqParam)
    }
    // 修改分类
    updateCategory ({name, image, sort, id}) {
        let finalUrl = `${urlPre}/category/${id}`
        return api.put(finalUrl, {name, image, sort})
    }
    // 删除分类
    delCategory ({id}) {
        let finalUrl = `${urlPre}/category/${id}`
        return api.del(finalUrl).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
    // 获取分类上传图片地址
    getCategoryImageUrl () {
        let finalUrl = `${urlPre}/category/image`
        return finalUrl
    }
    // 移动分类
    moveCategory ({id, to}) {
        let finalUrl = `${urlPre}/category/${id}/move`
        return api.put(finalUrl, {to})
    }
    // 移动分类内容
    moveCategoryContent ({id, to}) {
        let finalUrl = `${urlPre}/category/${id}/move/content`
        return api.put(finalUrl, {to})
    }
    // 上传区块封面图片
    uploadSectionImage ({section_id, alias, image}) {
        let finalUrl = `${urlPre}/${section_id}/data/image`
        return api.post(finalUrl, {alias, image}).then((ret) => {
            return ret.data
        })
    }
}
export default new SectionService()

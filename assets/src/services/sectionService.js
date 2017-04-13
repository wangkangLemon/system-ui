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
        course_category_id
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
        course_category_id
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
}
export default new SectionService()

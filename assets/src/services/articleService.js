/**
 * Created by huangrui on 2017/4/10.
 */
import * as api from './api'
import config from '../utils/config'
const urlPre = config.apiHost + '/sys/article'

class ArticleService {
    // 获取文章列表
    getArticleList ({
        page,
        page_size,
        category_id = '',
        title = '',
        start_time = '',
        end_time = ''}) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, {page, page_size, title, category_id, start_time, end_time}).then((ret) => {
            return ret.data
        })
    }

    // 删除文章
    deleteArticle (articleID) {
        let finalUrl = `${urlPre}/${articleID}`
        return api.del(finalUrl, {})
    }

    // 获取文章分类
    getCategoryTree ({id = 'tree', filter = true}) {
        let finalUrl = `${urlPre}/category/children`
        return api.get(finalUrl, {id, filter}).catch((ret) => {
            ret.tipCom.close()
            return ret
        })
    }

    // 获取文章上传图片url
    getArticleUploadUrl () {
        return `${urlPre}/cover`
    }

    // 创建文章
    addArticle ({
        title,
        category,
        draft,
        content = '',
        cover = ''
    }) {
        return api.post(urlPre, {title, category, draft, content, cover}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 修改文章
    updateArticle ({
        id,
        title,
        category,
        draft,
        content = '',
        cover = ''
    }) {
        let finalUrl = `${urlPre}/${id}`
        return api.put(finalUrl, {title, category, draft, content, cover}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 编辑时获取文章内容
    getEditDetail (id) {
        let finalUrl = `${config.apiHost}/article/${id}`
        return api.get(finalUrl, {}).then((ret) => {
            return ret.data
        })
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
}

export default new ArticleService()

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
    getCategoryTree ({id = 'tree'}) {
        let finalUrl = `${urlPre}/category/children`
        return api.get(finalUrl, {id}).catch((ret) => {
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
}

export default new ArticleService()

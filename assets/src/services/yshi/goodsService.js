/**
 * Created by kangcc@vodjk.com at 2018/04/12
 */

import * as api from '../api'
import config from 'utils/config'
const urlPre = config.apiHost + '/goods'

class GoodsService {
    // 搜索
    searchGoods ({
        name,
        start_time,
        end_time,
        category_id,
        page,
        page_size
    }) {
        let url = `${urlPre}/list`
        return api.get(url, { name, start_time, end_time, category_id, page, page_size }, false).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
        })
    }
    // 创建
    createGood ({ 
        name,
        cover,
        show_type,
        show_video_id,
        show_video_name,
        introduce,
        object_type,
        objects,
        price,
        favorable_price,
        price_app,
        favorable_price_app,
        category_id,
        sort,
        group_buying
    }) {
        let url = urlPre
        return api.post(url, JSON.stringify({ name, cover, show_type, show_video_id, show_video_name, introduce, object_type, objects, price, favorable_price, price_app, favorable_price_app, category_id, sort, group_buying })).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
        })
    }
    // 获取商品详情
    getGoodInfo ({id}) {
        let url = `${urlPre}/${id}`
        return api.get(url).then((ret) => {
            return ret.data.goods
        })
    }
    // 更新
    updateGood ({
        id,
        name,
        cover,
        show_type,
        show_video_id,
        show_video_name,
        introduce,
        object_type,
        objects,
        price,
        favorable_price,
        price_app,
        favorable_price_app,
        category_id,
        sort,
        group_buying
    }) {
        let url = `${urlPre}`
        return api.put(url, JSON.stringify({ id, name, cover, show_type, show_video_id, show_video_name, introduce, object_type, objects, price, favorable_price, price_app, favorable_price_app, category_id, sort, group_buying })).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
    // 获取添加编辑课程上传图片的url
    getUploadUrl ({image, alias}) {
        let url = `${urlPre}/upload`
        return api.post(url, {image, alias}).then((ret) => {
            return ret.data
        })
    }
    // 获取课程下拉列表
    courseList (keyword, page, pageSize, type = '', is_task = -1) {
        let url = `${urlPre}/search/name`
        return api.get(url, { keyword, page, page_size: pageSize, type, is_task }).then(ret => {
            return ret.data
        })
    }
    // 删除
    delete (id) {
        let url = `${urlPre}/${id}`
        return api.del(url, {}).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 批量删除课程
    deleteMulty (ids) {
        let url = `${urlPre}/batchdel`
        return api.put(url, { ids })
    }

    // 批量移动课程到指定分类
    moveToCategoryMulty ({ ids, category_id }) {
        let url = `${urlPre}/batchmove`
        return api.put(url, { ids, category_id })
    }

    // 课程
    setLesson ({ id, data }) {
        let url = `${urlPre}/${id}/setlesson`
        return api.put(url, data).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
    // 上下线
    statusline (id, status) {
        let url = `${urlPre}/status`
        return api.put(url, JSON.stringify({id, status})).then(ret => {
            xmview.showTip('success', ret.message || '操作成功')
        })
    }

    // 优惠数详情列表
    searchFavorableCount (id) {
        let url = `${urlPre}/${id}/favorable`
        return api.get(url).then(ret => ret.data)
    }
    // 素材树详情列表
    searchObjectCount (id) {
        let url = `${urlPre}/${id}/material`
        return api.get(url).then(ret => ret.data)
    }
    // 设置课时
    setLessons ({course_id, jsonstr}) {
        let url = `${urlPre}/${course_id}/lesson`
        return api.put(url, jsonstr)
    }
    // 获取文章分类
    getCategoryTree ({id = 'tree', filter = true}) {
        let finalUrl = `${urlPre}/category/children`
        return api.get(finalUrl, {id, filter}).catch((ret) => {
            ret.tipCom && ret.tipCom.close()
            return ret
        })
    }
    // 创建分类
    createCategory ({
        parent_id,
        name,
        sort,
        show_in_app,
        show_in_com,
    }) {
        let finalUrl = `${urlPre}/category`
        let reqParam = {parent_id, name, show_in_app, show_in_com, sort}
        if (parent_id === 0) delete reqParam['parent_id']
        return api.post(finalUrl, reqParam)
    }
    // 修改分类
    updateCategory ({
        id,
        name,
        sort,
        show_in_app,
        show_in_com,
    }) {
        let finalUrl = `${urlPre}/category/${id}`
        return api.put(finalUrl, {name, sort, show_in_app, show_in_com})
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
    // getCategoryImageUrl () {
    //     let finalUrl = `${urlPre}/category/image`
    //     return finalUrl
    // }
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
export default new GoodsService()

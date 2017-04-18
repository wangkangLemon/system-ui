/**
 * Created by huanghuixin on 2017/4/15.
 */

// 服务号部分

/**
 * Created by huanghuixin on 2017/3/20.
 */

import * as api from './api'
import config from '../utils/config'
import authUtils from '../utils/authUtils'
const urlPre = config.apiHost + '/sys/im/' + authUtils.getUserInfo().id

class IMService {
    // 更换头像
    changeAvatar ({avatar, alias = Date.now() + '.jpg'}) {
        let url = urlPre + '/login'
        return api.post(url, {avatar, alias}).then(ret => {
            return ret.data.url
        })
    }

    // 增加图文消息
    addNews (arrParam) {
        let ret = []

        // 取出只需要的参数
        arrParam.forEach((item) => {
            ret.push({
                content: item.content,
                title: item.title,
                cover: item.cover,
                thumb: item.thumb
            })
        })

        let url = urlPre + '/media/news'
        return api.post(url, {articles: JSON.stringify(arrParam)})
    }

    editNews (arrParam, id) {
        let ret = []

        // 取出只需要的参数
        arrParam.forEach((item) => {
            ret.push({
                content: item.content,
                title: item.title,
                cover: item.cover,
                thumb: item.thumb
            })
        })

        let url = urlPre + '/media/news/' + id
        return api.put(url, {articles: JSON.stringify(arrParam)})
    }

    getNewsUploadImgUrl () {
        return `${urlPre}/media/image/upload`
    }

    // 获取图文列表
    getMaterialList ({page, page_size}) {
        let url = urlPre + '/media/news/search'
        return api.get(url, {page, page_size}).then(ret => {
            return ret.data
        })
    }

    // 删除图文素材
    deleteMaterial ({id}) {
        let url = urlPre + '/media/news/' + id
        return api.del(url)
    }

    // 获取图片素材列表
    getImgList ({keyword, page, page_size}) {
        let url = urlPre + '/media/image/search'
        return api.get(url, {keyword, page, page_size}).then(ret => {
            return ret.data
        })
    }

    // 编辑图片素材
    editImg ({name, id}) {
        let url = urlPre + '/media/image/' + id
        return api.put(url, {name})
    }

    // 删除图片素材
    delImg (id) {
        let url = urlPre + '/media/image/' + id
        return api.del(url)
    }

    // 群发消息
    mass (reqParam) {
        let url = urlPre + '/mass/'
        return api.post(url, reqParam)
    }

    // 已经发送的群消息列表
    getMassSendedMList ({page, page_size, type, receiver, time_start, time_end}) {
        let url = urlPre + '/mass/search'
        return api.get(url, {page, page_size, type, receiver, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }

    // 删除群发消息
    delMassSended (id) {
        let url = urlPre + '/mass/' + id
        return api.del(url)
    }
}

export default new IMService()

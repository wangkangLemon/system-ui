/**
 * Created by huanghuixin on 2017/4/15.
 */

// 服务号部分

/**
 * Created by huanghuixin on 2017/3/20.
 */

import * as api from './api'
import config from '../utils/config'
// import authUtils from '../utils/authUtils'
const urlPre = config.apiHost + '/sys/im/1' // + authUtils.getUserInfo().id

class IMService {
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

    // 图文和图片列表的图片上传url
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
    mass ({type, receiver, media_id, text, receiver_mobile}) {
        let url = urlPre + '/mass/'
        return api.post(url, {type, receiver, media_id, text, receiver_mobile}).then(ret => {
            if(ret.code === 0) {
                return ret
            }
        })
    }

    // 发送预览
    sendPreview ({mobile, type, media_id, text}) {
        let url = urlPre + '/mass/preview'
        return api.post(url, {mobile, type, media_id, text})
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

    // 获取资料设置信息
    getProfileInfo () {
        let url = urlPre + '/edit'
        return api.get(url).then((ret) => {
            return ret.data.imAccount
        })
    }

    // 更换资料设置的头像
    changeProfileAvatar ({alias = Date.now() + '.jpg', avatar}) {
        let url = urlPre + '/avatar'
        return api.post(url, {alias, avatar}).then((ret) => {
            return ret.data.url
        })
    }

    // 修改资料设置
    editProfile ({name, mobile, email, address, intro, avatar}) {
        return api.put(urlPre, {name, mobile, email, address, intro, avatar})
    }
}

export default new IMService()

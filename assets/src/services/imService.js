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

    getNewsUploadImgUrl () {
        return `${urlPre}/media/image/upload`
    }
}

export default new IMService()

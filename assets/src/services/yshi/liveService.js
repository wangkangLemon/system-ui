/**
 * Created by kangcc@vodjk.com at 2018/04/12
 */

import * as api from '../api'
import config from 'utils/config'
const urlPre = config.apiHost + '/live'

class LiveService {
    // 搜索
    searchLiveGroup ({
        name,
        status,
        start_time,
        end_time,
        page,
        page_size
    }) {
        let url = `${urlPre}/search`
        return api.get(url, { name, status, start_time, end_time, page, page_size }, false).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
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
    // 创建
    createLive ({ name, cover, teacher_name, teacher_image, teacher_description, description, start_time}) {
        let url = urlPre
        return api.post(url, JSON.stringify({ name, cover, teacher_name, teacher_image, teacher_description, description, start_time })).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
        })
    }
    // 更新
    updateLive ({ id, name, cover, teacher_name, teacher_image, teacher_description, description, start_time}) {
        let url = `${urlPre}`
        return api.put(url, JSON.stringify({ id, name, cover, teacher_name, teacher_image, teacher_description, description, start_time })).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
    // 获取直播课详情
    getLiveInfo ({id}) {
        let url = `${urlPre}/${id}`
        return api.get(url).then((ret) => {
            return ret.data.live
        })
    }
    // 获取添加编辑课程上传图片的url
    getUploadUrl ({image, alias}) {
        let url = `${urlPre}/upload`
        return api.post(url, {image, alias}).then((ret) => {
            return ret.data
        })
    }

}
export default new LiveService()

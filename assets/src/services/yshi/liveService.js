/**
 * Created by kangcc@vodjk.com at 2018/04/12
 */

import * as api from '../api'
import config from 'utils/config'
const urlPre = config.apiHost + '/live'

class LiveService {
    // 搜索
    searchLive ({
        name,
        status,
        start_date,
        end_date,
        page,
        page_size
    }) {
        let url = `${urlPre}/search`
        return api.get(url, { name, status, start_date, end_date, page, page_size }, false).then(ret => {
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
            if (ret.code == 0) {
                return ret.data
            } else {
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
        let url = `${urlPre}/${id}`
        return api.put(url, JSON.stringify({ name, cover, teacher_name, teacher_image, teacher_description, description, start_time })).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
        })
    }
    // 获取直播课详情
    getLiveInfo ({id}) {
        let url = `${urlPre}/${id}`
        return api.get(url).then((ret) => {
            if (ret.code == 0) {
                return ret.data.live
            } else {
                return Promise.reject(ret)
            }
        })
    }
    // 获取添加编辑课程上传图片的url
    getUploadUrl ({image, alias, upload_type = 'image'}) {
        let url = `${config.apiHost}/sys/image/base64`
        return api.post(url, {image, alias}).then((ret) => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
        })
    }

    // 获取直播视频相关信息
    getLiveVideoInfo ({live_id}) {
        let url = `${urlPre}/${live_id}/video`
        return api.get(url).then((ret) => {
            if (ret.code == 0) {
                return ret.data.video
            } else {
                return Promise.reject(ret)
            }
        })
    }

    // 开始直播
    openLive ({ live_id, url}) {
        let urls = `${urlPre}/${live_id}/open`
        return api.put(urls, JSON.stringify({ url})).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
        })
    }

    // 结束直播
    closeLive ({ live_id}) {
        let url = `${urlPre}/${live_id}/close`
        return api.put(url).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
        })
    }

    // 添加视频
    addVideo ({ video_type = 'live_video', name, tags, source_type, source_url }) {
        let url = `${config.apiHost}/video`
        return api.post(url, JSON.stringify({ name, video_type, tags, source_type, source_url })).then(ret => {
            if (ret.code == 0) {
                return ret.data.id
            } else {
                return Promise.reject(ret)
            }
        })
    }

    // 绑定录播视频id 
    bindVideo ({ live_id, video_id}) {
        let url = `${urlPre}/${live_id}/video`
        return api.put(url,JSON.stringify({video_id})).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
        })
    }

    // 刷新转码状态
    videoRefresh({video_id}) {
        let url = `${config.apiHost}/video/${video_id}/refresh`
        return api.post(url).then(ret => {
            if (ret.code == 0) {
                return ret.data.status
            } else {
                return Promise.reject(ret)
            }
        })
    }
}
export default new LiveService()

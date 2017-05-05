/**
 * Created by gaohj on 2017/4/11.
 */
import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/sys/speaking'

class SpeakingContentService {
    // 录音记录列表
    search({page, page_size, status = -1, price_enabled = -1, keyword, time_start, time_end}) {
        let url = `${urlPre}/search`
        if (status == '') {
            status = -1
        }
        if (price_enabled == '') {
            price_enabled = -1
        }
        return api.get(url, {page, page_size, status, price_enabled, keyword, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }

    // 删除药我说
    deleteSpeaking ({speaking_id}) {
        let finalUrl = `${urlPre}/${speaking_id}/delete`
        return api.del(finalUrl, {})
    }

    // 上下线药我说
    offlineSpeaking ({speaking_id, disabled}) {
        let finalUrl = `${urlPre}/${speaking_id}/disable`
        return api.put(finalUrl, {disabled})
    }

    // 上传红包图片
    speakingImageUpload ({image, alias}) {
        let finalUrl = `${urlPre}/cover`
        return api.post(finalUrl, {image, alias})
    }

    // 根据药我说id获取具体的药我说
    getSpeakingById ({speaking_id}) {
        let finalUrl = `${urlPre}/${speaking_id}/view`
        return api.get(finalUrl, {})
    }

    // 新增药我说
    addSpeaking ({id, title, image, content, end_time, price_enabled, price_company_id, price_total, price, price_float, status}) {
        let finalUrl = `${urlPre}/`
        return api.post(finalUrl, {id, title, image, content, end_time, price_enabled, price_company_id, price_total, price, price_float, status})
    }

    // 修改药我说
    updateSpeaking ({id, title, image, content, end_time, price_enabled, price_company_id, price_total, price, price_float, status}) {
        let finalUrl = `${urlPre}/${id}`
        return api.put(finalUrl, {id, title, image, content, end_time, price_enabled, price_company_id, price_total, price, price_float, status})
    }
}

export default new SpeakingContentService()

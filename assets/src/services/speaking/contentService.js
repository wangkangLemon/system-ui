/**
 * Created by gaohj on 2017/4/11.
 */
import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/sys/speaking'

class SpeakingContentService {
    // 药我说记录列表
    search({page, page_size, status = -1, price_enabled = -1, keyword, time_start, time_end, sender_type = ''}) {
        let url = `${urlPre}/search`
        if (status == undefined) {
            status = -1
        }
        if (price_enabled === '') {
            price_enabled = -1
        }
        return api.get(url, {page, page_size, status, price_enabled, keyword, time_start, time_end, sender_type}).then((ret) => {
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
    addSpeaking ({id, title, image, content, end_time, price_enabled, price_company_id, price_total, price, price_float, status, limit}) {
        let finalUrl = `${urlPre}/`
        return api.post(finalUrl, {id, title, image, content, end_time, price_enabled, price_company_id, price_total, price, price_float, status, limit})
    }

    // 修改药我说
    updateSpeaking ({id, title, image, content, end_time, price_enabled, price_company_id, price_total, price, price_float, status, limit}) {
        let finalUrl = `${urlPre}/${id}`
        return api.put(finalUrl, {id, title, image, content, end_time, price_enabled, price_company_id, price_total, price, price_float, status, limit})
    }

    // 根据红包赞助企业的ID获取该企业的账户余额
    getBalanceByCompantID ({company_id}) {
        let finalUrl = config.apiHost + '/sys/finance/company/balance'
        return api.get(finalUrl, {company_id})
    }
}

export default new SpeakingContentService()

import * as api from '../api'
import config from '../../utils/config'

const urlPre = config.apiHost + '/sys/advert/video'

class TestAdvertVideoService {
    search({company_id, keyword, status, created_start, created_end, updated_start, updated_end, page, page_size}) {
        let url = `${urlPre}/search`
        return api.get(url, {company_id, keyword, status, created_start, created_end, updated_start, updated_end, page, page_size}).then((ret) => {
            return ret.data
        })
    }
    // 更改状态
    updateAdvertStatus (id, status) {
        let url = `${urlPre}/${id}/audit`
        return api.put(url, JSON.stringify({status: status})).then((ret) => {
            return ret.data
        })
    }
    // 获取视频
    getVideoPreviewUrl (id) {
        let url = `${urlPre}/${id}/preview`
        return api.get(url).then((ret) => {
            return ret.data
        })
    }
}

export default new TestAdvertVideoService()


import * as api from './api'
import config from '../utils/config'
const urlPre = config.apiHost + '/sys/hot'

class HotWordService {
    // 获取热词数据
    getHotwordList({ page, page_size }) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, { page, page_size })
    }
    // 删除热词
    delHotword(HotwordID) {
        let finalUrl = `${urlPre}/${HotwordID}`
        return api.del(finalUrl, {})
    }
    addHotword(reqParam) {
        let finalUrl = `${urlPre}/`
        return api.post(finalUrl, reqParam)
    }
    changeHotword(reqParam) {
        let HotwordID = reqParam.id
        let fianlUrl = `${urlPre}/${HotwordID}`
        return api.put(fianlUrl, reqParam)
    }
}

export default new HotWordService()

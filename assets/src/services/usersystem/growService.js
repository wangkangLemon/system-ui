/**
 * Created by gaohj on 2017/4/11.
 */
import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/sys/user/grow'

class GrowService {
    // 用户行为成长值记录列表
    search({page, page_size, name = ''}) {
        let url = `${urlPre}/behavior/search`
        return api.get(url, {page, page_size, name}).then((ret) => {
            return ret.data
        })
    }
    // 修改用户行为
    updateBehavior ({id, name, description, growth, limit}) {
        let finalUrl = `${urlPre}/behavior/`
        return api.put(finalUrl, {id, name, description, growth, limit})
    }
    // 特权等级查询
    gradeSearch ({page, page_size, name}) {
        let finalUrl = `${urlPre}/grad/search`
        return api.get(finalUrl, {page, page_size, name}).then((ret) => {
            return ret.data
        })
    }
}

export default new GrowService()

/**
 * Created by gaohj on 2017/4/11.
 */
import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/sys/grow'

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
    gradeSearch ({page, page_size}) {
        let finalUrl = `${urlPre}/grade/search`
        return api.get(finalUrl, {page, page_size}).then((ret) => {
            return ret.data
        })
    }
    // 修改特权等级
    updateGrade ({id, level, description, growth_times, credit_times, growth, limit}) {
        let finalUrl = `${urlPre}/grade/`
        return api.put(finalUrl, {id, level, description, growth_times, credit_times, growth, limit})
    }
    // 新增特权等级
    addGrade ({id, level, description, growth_times, credit_times, growth, limit}) {
        let finalUrl = `${urlPre}/grade/`
        return api.post(finalUrl, {id, level, description, growth_times, credit_times, growth, limit})
    }
}

export default new GrowService()

/**
 * Created by gaohj on 2017/4/11.
 */
import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/sys/speaking/history'

class SpeakingRecordService {
    // 录音记录列表
    search({page, page_size, company_id, department_id, user_id, speaking_company_id, keyword, time_start, time_end}) {
        let url = `${urlPre}/search`
        if (speaking_company_id == '') {
            speaking_company_id = -1
        }
        return api.get(url, {page, page_size, company_id, department_id, user_id, speaking_company_id, keyword, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }
}

export default new SpeakingRecordService()

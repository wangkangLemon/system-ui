/**
 * Created by gaohj on 2017/4/11.
 */
import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/sys/money'

class CompanyMoneyService {
    // 录音记录列表
    getIndrustrySelectList ({page, page_size, keyword}) {
        let url = `${urlPre}/company/search`
        return api.get(url, {page, page_size, keyword}).then((ret) => {
            return ret.data
        })
    }
}

export default new CompanyMoneyService()

/**
 * Created by huanghuixin on 2017/3/30.
 */
import * as api from './api'
import config from '../utils/config'
const urlPre = config.apiHost + '/sys/company'

class CompanyService {
    // 获取工业连锁店
    // category - 0-企业 1-工业 2-连锁
    getIndrustrySelectList ({category = '', page_size = '', page = '', keyword = ''}) {
        let finalUrl = urlPre + '/search'
        return api.get(finalUrl, {category, page, page_size, keyword}, false).then((ret) => {
            return ret.data
        })
    }
}

export default new CompanyService()

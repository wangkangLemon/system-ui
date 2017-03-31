/**
 * Created by huanghuixin on 2017/3/30.
 */
import * as api from './api'
import config from '../utils/config'
const urlPre = config.apiHost + '/sys/company'

class CompanyService {
    // 获取工业连锁店
    getIndrustrySelectList(category, pageSize) {
        let finalUrl = urlPre + '/search'
        return api.get(finalUrl, {category, page: 1, page_size: pageSize}, false).then((ret) => {
            return ret.data
        })
    }
}

export default new CompanyService()

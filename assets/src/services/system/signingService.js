/**
 * Created by kangcc@vodjk.com at 2018/04/12
 */

import * as api from '../api'
import config from 'utils/config'
const urlPre = config.apiHost + '/sys/signing'

class SigningService {
    // 搜索
    searchList ({
        status = 0,
        start_date,
        end_date,
        keyword,
        page,
        page_size
    }) {
        let url = `${urlPre}/search`
        return api.get(url, { status, start_date, end_date, keyword, page, page_size }, false).then(ret => ret.data)
    }
    // 获取详情
    getSigningInfo (id) {
        let url = `${urlPre}/${id}`
        return api.get(url,{}).then((ret) => {
            return ret.data
        })
    }

    // 审核结果更新
    updateResult ({id, status, remark}) {
        let url = `${urlPre}/${id}/result`
        return api.put(url,{status,remark}).then((ret) => {
            return ret.data
        })
    }
    
}
export default new SigningService()

import * as api from '../api'
import config from '../../utils/config'

const urlPre = config.apiHost + '/sys/image'

class TestAdvertPicService {
    search({company_id, keyword, status, created_start, created_end, updated_start, updated_end, page, page_size}) {
        let url = `${urlPre}/search`
        if (company_id === '' || company_id === undefined) company_id = -1
        if (status === '' || status === undefined) status = -1
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
}

export default new TestAdvertPicService()

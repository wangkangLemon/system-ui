
import * as api from '../api'
import config from '../../utils/config'

const urlPre = config.apiHost

class TestUnversalService {
    search({page, page_size}) {
        let url = `${urlPre}/sys/finance/pricing/search`
        return api.get(url, {page, page_size}).then((ret) => {
            return ret.data
        })
    }

    update(id, {price}) {
        let url = `${urlPre}/sys/finance/pricing/${id}`
        return api.put(url, JSON.stringify({price})).then((ret) => {
            return ret.data
        })
    }
    searchHistory({key, page, page_size}) {
        let url = `${urlPre}/sys/finance/pricing/history`
        return api.get(url, {key, page, page_size}).then((ret) => {
            return ret.data
        })
    }
}

export default new TestUnversalService()

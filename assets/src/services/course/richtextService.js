import * as api from '../api'
import config from 'utils/config'
const urlPre = config.apiHost + '/material/richtexts'

class RichtextService {
    search ({
        title,
        start_date,
        end_date,
        status,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, { title, start_date, end_date, status, page, page_size }).then(ret => {
            return ret.data
        })
    }
    del (id) {
        let finalUrl = `${urlPre}/${id}`
        return api.del(finalUrl)
    }
    get (id) {
        let finalUrl = `${urlPre}/${id}`
        return api.get(finalUrl).then(ret => ret.data)
    }
    create ({
        title,
        content,
        status
    }) {
        let finalUrl = `${urlPre}`
        return api.post(finalUrl, JSON.stringify({ title, content, status }))
    }
    edit ({
        title,
        content,
        status,
        id
    }) {
        let finalUrl = `${urlPre}/${id}`
        return api.put(finalUrl, JSON.stringify({ title, content, status }))
    }
}
export default new RichtextService()

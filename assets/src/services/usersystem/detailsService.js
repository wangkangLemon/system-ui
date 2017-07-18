import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/sys/task'

class DetailsService {
    getAll(fetchParam) {
        let url = `${urlPre}/history`
        return api.get(url, fetchParam).then(ret => ret.data)
    }
    export(fetchParam) {
        let url = `${urlPre}/history`
        return api.downLoad(url, Object.assign(fetchParam, {export: 1}), 'history.xls')
    }
}
export default new DetailsService()

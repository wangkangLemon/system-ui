import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/sys/activity'

class PrizeService {
    getAll(fetchParam) {
        let url = `${urlPre}/reward/history`
        return api.get(url, fetchParam).then(ret => ret.data)
    }
    export(fetchParam) {
        let url = `${urlPre}/reward/history`
        return api.downLoad(url, Object.assign(fetchParam, {export: 1}), 'history.xls')
    }
}
export default new PrizeService()

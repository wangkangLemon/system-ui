import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/sys/grow'

class StatService {
    getAll(fetchParam) {
        let url = `${urlPre}/analysis`
        return api.get(url, fetchParam).then(ret => ret.data)
    }
    exportStat (fetchParam) {
        let finalUrl = `${urlPre}/analysis`
        api.downLoad(finalUrl, {export: 1}, 'stat.xls')
    }
}
export default new StatService()

import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/sys/task'
class AuditService {
    search(fetchParam) {
        let url = `${urlPre}/upload/image/search/`
        return api.get(url, fetchParam).then((ret) => {
            return ret.data
        })
    }
    update({id, status, note}) {
        let url = `${urlPre}/upload/image/${id}`
        return api.put(url, {status, note})
    }
    exportData() {
        let url = `${urlPre}/upload/image/search/`
        api.downLoad(url, {export: 1}, 'audit.xls')
    }
}
export default new AuditService()

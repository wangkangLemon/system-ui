import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/sys/task'
class AuditService {
    search({
        id,
        user_name,
        status = 0,
        time_start,
        time_end,
        page,
        page_size
    }) {
        let url = `${urlPre}/${id}/upload/image/search/`
        console.log(url)
        return api.get(url, {
            id,
            user_name,
            status,
            time_start,
            time_end,
            page,
            page_size
        }).then((ret) => {
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

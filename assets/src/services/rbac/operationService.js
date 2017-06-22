/**
 * Created by gaohj on 2017/4/11.
 */
import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/sys/rbac/operation'

class OperationService {
    // 用户行为成长值记录列表
    search({page, page_size, owner = ''}) {
        let url = `${urlPre}/search`
        return api.get(url, {page, page_size, owner}).then((ret) => {
            return ret.data
        })
    }
}

export default new OperationService()

/**
 * Created by gaohj on 2017/4/11.
 */
import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/com/rbac'

class OperationService {
    // 搜索
    search ({ category, page, page_size, owner = '', operation_name = '', operation_url = '', operation_method = '' }) {
        let url = `${urlPre}/${category}/operation/search`
        return api.get(url, { page, page_size, owner, operation_name, operation_url, operation_method }).then((ret) => {
            return ret.data
        })
    }
    // 新增
    add ({ category, operation_name, operation_url, operation_method = '', owner = '', limit }) {
        let url = `${urlPre}/${category}/operation/`
        return api.post(url, { operation_name, operation_url, operation_method, owner, limit })
    }
    // 修改
    update ({ category, id, operation_name, operation_url, operation_method = '', owner = '', limit }) {
        let url = `${urlPre}/${category}/operation/${id}/`
        return api.put(url, { operation_name, operation_url, operation_method, owner, limit })
    }
    // 删除
    delete ({ category, id }) {
        let url = `${urlPre}/${category}/operation/${id}/`
        return api.del(url)
    }
}

export default new OperationService()

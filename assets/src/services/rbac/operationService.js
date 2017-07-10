/**
 * Created by gaohj on 2017/4/11.
 */
import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/sys/rbac/operation'

class OperationService {
    // 用户行为成长值记录列表
    search({page, page_size, owner = '', operation_name = '', operation_url = '', operation_method = ''}) {
        let url = `${urlPre}/search`
        return api.get(url, {page, page_size, owner, operation_name, operation_url,operation_method}).then((ret) => {
            return ret.data
        })
    }
    // 删除
    delete(id) {
        let url = `${urlPre}/${id}/`
        return api.del(url)
    }
    // 新增
    add({id, operation_name = '', operation_url = '', operation_method = '', owner = '', limit}) {
        let url = `${urlPre}/`
        return api.post(url, {operation_name, operation_url, operation_method, owner, limit})
    }
    // 修改
    update({id, operation_name = '', operation_url = '', operation_method = '', owner = '', limit}) {
        let url = `${urlPre}/${id}/`
        return api.put(url, {operation_name, operation_url, operation_method, owner, limit})
    }
}

export default new OperationService()

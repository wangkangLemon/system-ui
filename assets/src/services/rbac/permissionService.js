/**
 * Created by gaohj on 2017/4/11.
 */
import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/sys/rbac/permission'

class PermissionService {
    // 用户行为成长值记录列表
    search({page, page_size, disabled}) {
        let url = `${urlPre}/search`
        return api.get(url, {page, page_size, disabled}).then((ret) => {
            return ret.data
        })
    }
    // 禁用
    disable({id, disabled}) {
        let url = `${urlPre}/${id}/disable`
        return api.put(url, {disabled})
    }
    // 删除
    delete(id) {
        let url = `${urlPre}/${id}/`
        return api.del(url)
    }
    // 新增
    add({id, permission_name = '', disabled}) {
        let url = `${urlPre}/`
        return api.post(url, {permission_name, disabled})
    }
    // 修改
    update({id, permission_name = '', disabled}) {
        let url = `${urlPre}/${id}/`
        return api.put(url, {permission_name, disabled})
    }
}

export default new PermissionService()

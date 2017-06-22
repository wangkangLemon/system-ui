/**
 * Created by gaohj on 2017/4/11.
 */
import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/sys/rbac/role'

class RoleService {
    // 角色查询
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
}

export default new RoleService()

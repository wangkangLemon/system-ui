/**
 * Created by gaohj on 2017/4/11.
 */
import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/com/rbac'

class RoleService {
    // 角色查询
    search ({ category, disabled, page, page_size }) {
        let url = `${urlPre}/${category}/role/search`
        return api.get(url, { disabled, page, page_size }).then((ret) => {
            return ret.data
        })
    }
    // 新增
    add ({ category, role_name, disabled }) {
        let url = `${urlPre}/${category}/role/`
        return api.post(url, { role_name, disabled })
    }
    // 修改
    update ({ category, id, role_name, disabled }) {
        let url = `${urlPre}/${category}/role/${id}/`
        return api.put(url, { role_name, disabled })
    }
    // 禁用
    disable ({ category, id, disabled }) {
        let url = `${urlPre}/${category}/role/${id}/disable`
        return api.put(url, { disabled })
    }
    // 删除
    delete ({ category, id }) {
        let url = `${urlPre}/${category}/role/${id}/`
        return api.del(url)
    }
    // 获取指定角色已经关联的权限
    searchPermission ({ category, id }) {
        let url = `${urlPre}/${category}/role/${id}/permission/search`
        return api.get(url).then((ret) => {
            return ret.data
        })
    }
    // 更新指定角色的关联权限
    permission ({ category, id, ids }) {
        let url = `${urlPre}/${category}/role/${id}/permission/`
        return api.post(url, { ids })
    }
}

export default new RoleService()

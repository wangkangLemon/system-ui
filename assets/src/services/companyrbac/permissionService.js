/**
 * Created by gaohj on 2017/4/11.
 */
import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/com/rbac'

class PermissionService {
    // 列出
    search (category) {
        let url = `${urlPre}/${category}/permission/search`
        return api.get(url).then((ret) => {
            return ret.data
        })
    }
    // 新增
    add ({ category, parent_id, permission_name = '', disabled }) {
        let url = `${urlPre}/${category}/permission/`
        return api.post(url, { parent_id, permission_name, disabled })
    }
    // 修改
    update ({ category, id, parent_id, permission_name = '', disabled }) {
        let url = `${urlPre}/${category}/permission/${id}/`
        return api.put(url, { parent_id, permission_name, disabled })
    }
    // 禁用
    disable ({ category, id, disabled }) {
        let url = `${urlPre}/${category}/permission/${id}/disable`
        return api.put(url, { disabled })
    }
    // 删除
    delete ({ category, id }) {
        let url = `${urlPre}/${category}/permission/${id}/`
        return api.del(url)
    }
    // 获取 单个权限信息
    getInfo ({ category, id }) {
        let url = `${urlPre}/${category}/permission/${id}/`
        return api.get(url)
    }
    // 获取指定权限已经关联的操作
    searchOperation ({ category, id }) {
        let url = `${urlPre}/${category}/permission/${id}/operation/search`
        return api.get(url).then((ret) => {
            return ret.data
        })
    }
    // 获取指定权限已经关联的菜单
    searchMenu ({ category, id }) {
        let url = `${urlPre}/${category}/permission/${id}/menu/search`
        return api.get(url).then((ret) => {
            return ret.data
        })
    }
    // 更新指定权限的关联操作
    operation ({ category, id, ids }) {
        let url = `${urlPre}/${category}/permission/${id}/operation/`
        return api.post(url, { ids })
    }
    // 更新指定权限的关联菜单 其中ids逗号分隔
    menu ({ category, id, ids }) {
        let url = `${urlPre}/${category}/permission/${id}/menu/`
        return api.post(url, { ids })
    }
}

export default new PermissionService()

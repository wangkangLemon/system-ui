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
    // 删除
    delete(id) {
        let url = `${urlPre}/${id}/`
        return api.del(url)
    }
    // 新增
    add({id, role_name = '', disabled}) {
        let url = `${urlPre}/`
        return api.post(url, {role_name, disabled})
    }
    // 修改
    update({id, role_name = '', disabled}) {
        let url = `${urlPre}/${id}/`
        return api.put(url, {role_name, disabled})
    }
    // 获取所有启用的权限
    all() {
        let url = `${urlPre}/all`
        return api.get(url).then((ret) => {
            return ret.data
        })
    }
    // 获取指定角色已经关联的权限
    permission(id) {
        let url = `${urlPre}/${id}/permission`
        return api.get(url).then((ret) => {
            return ret.data
        })
    }
}

export default new RoleService()

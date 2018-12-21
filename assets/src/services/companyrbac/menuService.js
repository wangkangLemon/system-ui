/**
 * Created by gaohj on 2017/4/11.
 */
import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/com/rbac'

class MenuService {
    // 用户行为成长值记录列表
    search (category) {
        let url = `${urlPre}/${category}/menu/search`
        return api.get(url).then((ret) => {
            return ret.data
        })
    }
    // 新增
    add ({ category, parent_id, menu_name = '', menu_url = '', menu_icon = '', menu_order, disabled }) {
        let url = `${urlPre}/${category}/menu/`
        return api.post(url, { parent_id, menu_name, menu_url, menu_icon, menu_order, disabled })
    }
    // 修改
    update ({ category, id, parent_id, menu_name = '', menu_url = '', menu_icon = '', menu_order, disabled }) {
        let url = `${urlPre}/${category}/menu/${id}/`
        return api.put(url, { parent_id, menu_name, menu_url, menu_icon, menu_order, disabled })
    }
    // 禁用
    disable ({ category, id, disabled }) {
        let url = `${urlPre}/${category}/menu/${id}/disable`
        return api.put(url, { disabled })
    }
    // 删除
    delete ({ category, id }) {
        let url = `${urlPre}/${category}/menu/${id}/`
        return api.del(url)
    }
    // 获取指定菜单信息
    getInfo ({ category, id }) {
        let url = `${urlPre}/${category}/menu/${id}/`
        return api.get(url)
    }
}

export default new MenuService()

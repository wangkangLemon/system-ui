/**
 * Created by gaohj on 2017/4/11.
 */
import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/sys/rbac/menu'

class MenuService {
    // 用户行为成长值记录列表
    search() {
        let url = `${urlPre}/search`
        return api.get(url).then((ret) => {
            return ret.data
        })
    }
    // 获取指定菜单信息
    getInfo(id) {
        let url = `${urlPre}/${id}/`
        return api.get(url)
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
    add({id, parent_id, menu_name = '', menu_url = '', menu_icon = '', menu_order, disabled}) {
        let url = `${urlPre}/`
        return api.post(url, {parent_id, menu_name, menu_url, menu_icon, menu_order, disabled})
    }
    // 修改
    update({id, parent_id, menu_name = '', menu_url = '', menu_icon = '', menu_order, disabled}) {
        let url = `${urlPre}/${id}/`
        return api.put(url, {parent_id, menu_name, menu_url, menu_icon, menu_order, disabled})
    }
}

export default new MenuService()

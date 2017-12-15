/**
 * Created by huangrui on 2017/3/31.
 */
import * as api from './api'
import config from '../utils/config'
const urlPre = config.apiHost + '/sys/admin'

class AdminService {
    // 获取管理员列表
    adminList ({ keyword = '', page, page_size }) {
        let url = urlPre + '/search'
        return api.get(url, { keyword, page, page_size }, false).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
        })
    }

    // 新增管理员
    addAdmin ({ name, sex = '', mobile = '', passwd, email = '', address = '', disabled = '', roles = '' }) {
        let url = urlPre + '/'
        return api.post(url, { name, sex, mobile, email, passwd, address, disabled, roles }).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 编辑管理员获取信息
    editAdmin (adminID) {
        let finalUrl = `${urlPre}/${adminID}/`
        return api.get(finalUrl, {}).then((ret) => {
            return ret.data.data
        })
    }

    // 修改管理员获取信息
    updateAdmin ({ id, name, sex = '', mobile = '', passwd = '', email = '', address = '', disabled = '', roles = '' }) {
        let finalUrl = `${urlPre}/${id}/`
        return api.put(finalUrl, { name, sex, mobile, passwd, email, address, disabled, roles }).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 删除管理员
    adminDelete (userID) {
        let finalUrl = `${urlPre}/${userID}/`
        return api.del(finalUrl, {}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 获取管理员详情
    adminDetail (adminID) {
        let finalUrl = `${urlPre}/${adminID}/`
        return api.get(finalUrl, {}).then((ret) => {
            return ret.data
        })
    }

    // 禁用管理员
    adminDisable ({ adminID, disabled }) {
        let finalUrl = `${urlPre}/${adminID}/disable`
        return api.put(finalUrl, { disabled }).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 获取签约人
    getSignatoryList ({ page, page_size, keyword = '' }) {
        let finalUrl = `${urlPre}/search/sale`
        return api.get(finalUrl, { page, page_size, keyword }).then((ret) => {
            return ret.data
        })
    }

    // 获取指定用户关联的角色
    searchRoles (id) {
        let url = `${urlPre}/${id}/role/search`
        return api.get(url).then((ret) => {
            return ret.data
        })
    }

    // 更新指定用户的关联角色
    // role({id, ids}) {
    //     let url = `${urlPre}/${id}/role/`
    //     return api.post(url, {ids})
    // }
    getAllroles () {
        let url = `${config.apiHost}/sys/rbac/role/all`
        return api.get(url).then(ret => ret.data)
    }
    // ============================内测应用部分============================
    // 获取内测应用申请列表
    getAlphaApplyList ({ page, page_size, appid }) {
        appid = appid || -1
        let finalUrl = `${config.apiHost}/sys/alpha/companyapp/search`
        return api.get(finalUrl, { page, page_size, appid }).then((ret) => {
            return ret.data
        })
    }

    // 删除内测应用申请
    delAlphaApply (id) {
        let finalUrl = `${config.apiHost}/sys/alpha/companyapp/${id}/`
        return api.del(finalUrl)
    }
}
export default new AdminService()

/**
 * Created by huanghuixin on 2017/4/13.
 */
import * as api from './api'
import config from '../utils/config'

const urlPre = config.apiHost + '/mine'
class MineService {
    getProfile () {
        let url = `${urlPre}/profile`
        return api.get(url).then(ret => {
            return ret.data.data
        })
    }

    getSafeSetInfo () {
        let url = `${urlPre}/two-step/`
        return api.get(url).then(ret => {
            return ret.data.stepTypes
        })
    }
    // 修改个人信息
    updateProfile ({
        name,
        address,
        sex
    }) {
        let url = `${urlPre}/profile`
        return api.put(url, {name, address, sex}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
    // 上传头像
    uploadAvatar ({
        avatar = '',
        alias = ''
    }) {
        let url = `${urlPre}/profile/avatar`
        return api.post(url, {avatar, alias}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
    // 获取公司信息接口
    getCompanyInfo () {
        let url = `${urlPre}/company`
        return api.get(url).then((ret) => {
            return ret.data.data
        })
    }
    modifyCompany ({
        name,
        concact,
        mobile,
        email,
        tel = '',
        fax = '',
        province = '',
        city = '',
        area = '',
        address = '',
        zip = '',
        url = '',
        description = ''
    }) {
        let finalUrl = `${urlPre}/company`
        return api.put(finalUrl, {name, concact, mobile, email, tel, fax, province, city, area, address, zip, url, description}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 获取密码接口
    getPassword () {
        let url = `${urlPre}/password`
        return api.get(url).then((ret) => {
            return ret.data.data
        })
    }
    // 修改密码
    modifyPassword ({
        origin_password,
        new_password,
        re_password
    }) {
        let url = `${urlPre}/password`
        return api.put(url, {origin_password, new_password, re_password}).then((ret) => {
            return ret.data.data
        })
    }
}

export default new MineService()

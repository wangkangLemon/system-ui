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
}

export default new MineService()

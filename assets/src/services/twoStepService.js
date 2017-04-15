/**
 * Created by huanghuixin on 2017/4/13.
 */
import * as api from './api'
import config from '../utils/config'

const urlPre = config.apiHost + '/two-step'

class TwoStepService {
    // 获取校验信息
    getSafeSetInfo () {
        let url = `${urlPre}/`
        return api.get(url).then(ret => {
            return ret.data
        })
    }

    // 发送邮箱验证码
    sendEmailValidcode () {
        let url = `${urlPre}/email/send`
        return api.post(url)
    }

    // 发送短信验证码
    sendSmsValidcode () {
        let url = `${urlPre}/sms/verify`
        return api.post(url)
    }

    // 绑定或者更换绑定
    bindOrChange ({code, type, receiver}) {
        let url = `${urlPre}/code/bind`
        return api.put(url, {code, type, receiver})
    }

    // 获取微信登录的配置
    getWechatLoginConfig () {
        let url = `${urlPre}/wechat`
        return api.get(url).then((ret) => {
            return ret.data.wechatConfig
        })
    }
}

export default new TwoStepService()

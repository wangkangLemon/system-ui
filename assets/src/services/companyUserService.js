/**
 * Created by huangrui on 2017/4/8.
 */
// 店员
import * as api from './api'
import config from '../utils/config'
const urlPre = config.apiHost + '/sys/user'
class CompanyUserService {
    // 查看店员
    userDetail (userID) {
        let finalUrl = `${urlPre}/${userID}`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }
}
export default new CompanyUserService()

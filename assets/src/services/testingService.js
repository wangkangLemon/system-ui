/**
 * Created by huanghuixin on 2017/4/1.
 */
import * as api from './api'
import config from '../utils/config'
const urlPre = config.apiHost + '/sys/testing'

class TestingService {
    // 获取管理员列表
    getAmount () {
        let url = urlPre
        return api.get(url).then(ret => {
            return ret.analytics
        })
    }
}
export default new TestingService()

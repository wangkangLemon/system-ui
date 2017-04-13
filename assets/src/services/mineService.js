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
}

export default new MineService()

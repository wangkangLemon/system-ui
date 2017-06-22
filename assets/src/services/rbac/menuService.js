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
}

export default new MenuService()
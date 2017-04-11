/**
 * Created by huangrui on 2017/4/11.
 */
import * as api from './api'
import config from '../utils/config'
const urlPre = config.apiHost + '/sys/setting'
class SettingService {
    // 查询列表
    getSettingList ({
        page,
        page_size,
        keyword = ''
    }) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, {page, page_size, keyword}).then((ret) => {
            return ret.data
        })
    }
}

export default new SettingService()

/**
 * Created by huanghuixin on 2017/3/29.
 */
import * as api from './api'
import config from '../utils/config'
const urlPre = config.apiHost + '/mobile'

class MobileService {
    uploadboot ({company_id, image}) {
        let finalUrl = urlPre + '/uploadboot'
        return api.post(finalUrl, {company_id, image, alias: +new Date() + '.png'}, false)
    }
}

export default new MobileService()

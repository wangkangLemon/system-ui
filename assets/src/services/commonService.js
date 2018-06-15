import * as api from './api'
import config from '../utils/config'
const urlPre = config.apiHost + '/sys'

class CommonService {
    uploadCover ({
        upload_type,  // image
        alias,
        image
    }) {
        const finalUrl = `${urlPre}/image/base64`
        return api.post(finalUrl, { upload_type, alias, image }).then(ret => {
            xmview.showTip('success', '图片上传成功')
            return ret.data
        })
    }
}

export default new CommonService()

/**
 * Created by huanghuixin on 2017/3/29.
 */
import * as api from './api'
import config from '../utils/config'
const urlPre = config.apiHost + '/sys/mobile'

class MobileService {
    uploadboot ({company_id, image}) {
        let finalUrl = `${config.apiHost}/com/${company_id}/mobile/boot/upload`
        return api.post(finalUrl, {company_id, image, alias: +new Date() + '.png'}, false)
    }
    // 获取启动图
    getBoot ({company_id}) {
        let finalUrl = `${urlPre}/boot`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }
    // 更新启动图
    updateBoot ({company_id, image, url, status}) {
        let finalUrl = `${urlPre}/boot`
        return api.put(finalUrl, {image, url, status})
    }
    // 查询接口
    menuSearch ({page, page_size}) {
        let finalUrl = `${urlPre}/menu/scheme/search`
        return api.get(finalUrl, {page, page_size}).then((ret) => {
            return ret.data
        })
    }
    // 应用导航方案
    applyMenu (id) {
        let finalUrl = `${urlPre}/menu/scheme/${id}/enable`
        return api.put(finalUrl)
    }
    // 克隆导航
    menuClone (id) {
        let finalUrl = `${urlPre}/menu/scheme/${id}/copy`
        return api.put(finalUrl)
    }
    // 删除导航方案
    menuDelete (id) {
        let finalUrl = `${urlPre}/menu/scheme/${id}`
        return api.del(finalUrl)
    }
    // 上传导航图标
    uploadNavIcon ({image, alias}) {
        let finalUrl = `${urlPre}/menu/scheme/cover`
        return api.post(finalUrl, {image, alias}).then((ret) => {
            return ret.data
        })
    }
    // 更新方案
    updateMenu ({info, scheme_id}) {
        let finalUrl = `${urlPre}/menu/scheme/${scheme_id}`
        return api.put(finalUrl, info)
    }
}

export default new MobileService()

/**
 * Created by huangrui on 2017/6/2.
 */
import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/sys/activity'

class ActivityService {
    /**
     * 获取活动的相关信息
     * @param type 1 转盘 3 签到 2 连续七天
     */
    getActivity({play_id}) {
        let url = `${urlPre}/${play_id}/view`
        return api.get(url).then((ret) => {
            return ret.data
        })
    }
    /**
     * 修改活动的相关信息
     * @param type 1 转盘 3 签到 2 连续七天
     */
    updateActivity({play_id, title, limit, description}) {
        let url = `${urlPre}/${play_id}`
        return api.put(url, {title, limit, description})
    }
    /**
     * 获取奖品设置列表
     * @param play_type wheel 转盘 sign_weekly 连续七天 sign_month 累计一个月
     */
    rewardSearch ({play_type}) {
        let url = `${urlPre}/reward/search`
        return api.get(url, {play_type}).then((ret) => {
            return ret.data
        })
    }
    // 新增活动奖品
    addReward ({type, category, play_type, product_id, quota, limit, sort, weight}) {
        let url = `${urlPre}/reward`
        return api.post(url, {type, category, play_type, product_id, quota, limit, sort, weight})
    }
    // 修改活动奖品
    updateReward ({id, type, category, play_type, product_id, quota, limit, sort, weight}) {
        let url = `${urlPre}/reward/${id}`
        return api.put(url, {type, category, play_type, product_id, quota, limit, sort, weight})
    }
    // 删除奖品
    delReward ({id}) {
        let url = `${urlPre}/reward/${id}`
        return api.del(url)
    }
    // 根据商品类型获取产品
    productSearch ({category, status}) {
        let url = `${config.apiHost}/sys/product/search`
        return api.get(url, {category, status}).then((ret) => {
            return ret.data
        })
    }
    // 获取签到活动指定月积分设置
    getSignSetting ({year, month}) {
        let url = `${urlPre}/sign/view`
        return api.get(url, {year, month}).then((ret) => {
            return ret.data
        })
    }
    // 修改签到活动指定月积分设置
    updateSignSetting ({year, month, setting}) {
        let url = `${urlPre}/sign`
        return api.put(url, {year, month, setting})
    }
    // 新增签到活动指定月积分设置
    addSignSetting ({year, month, setting}) {
        let url = `${urlPre}/sign`
        return api.post(url, {year, month, setting})
    }
}

export default new ActivityService()

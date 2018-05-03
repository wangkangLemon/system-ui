import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/sys/coupon'

class CouponService {
    // 搜索优惠券列表
    search({
        name,
        page,
        page_size
    }) {
        let url = urlPre + '/search'
        return api.get(url, { name, page, page_size }, false).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
        })
    }
    // 搜索优惠券名称
    searchName () {
        let url = urlPre + '/search/name'
        return api.get(url).then(ret => ret.data)
    }
    // 发放优惠券
    putCoupon ({
        coupon_id,
        mobile
    }) {
        let url = urlPre + '/put'
        return api.post(url, JSON.stringify({ coupon_id, mobile })).then(ret => {
            xmview.showTip('success', ret.message || '发放成功')
        })
    }
    // 上下线
    offAndOnline ({
        status,  // 1上线 2下线
        coupon_id
    }) {
        let url = `${urlPre}/${coupon_id}`
        return api.put(url, JSON.stringify({ status })).then(ret => {
            xmview.showTip('success', ret.message || '失败')
        })
    }
    // 删除
    delete ({
        coupon_id
    }) {
        let url = `${urlPre}/${coupon_id}`
        return api.del(url).then(ret => {
            xmview.showTip('success', ret.message || '删除失败')
        })
    }
    // 添加优惠券
    addCoupon ({
        name,
        money,
        threshold,
        start_time,
        end_time,
        goods_list
    }) {
        let url = urlPre + '/create'
        return api.post(url, JSON.stringify({ name, money, threshold, start_time, end_time, goods_list })).then(ret => {
            xmview.showTip('success', ret.message || '添加成功')
        })
    }
    // 查看优惠券
    view ({
        coupon_id
    }) {
        let url = `${urlPre}/${coupon_id}`
        return api.get(url).then(ret => ret.data)
    }
}
export default new CouponService()

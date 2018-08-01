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
    searchName ({
        name,
        page,
        page_size
    }) {
        let url = urlPre + '/search/name'
        return api.get(url, { name, page, page_size }, false).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
        })
    }
    // 发放优惠券
    putCoupon ({
        coupon_id,
        mobile,
        receive_hints
    }) {
        let url = urlPre + '/put'
        return api.post(url, JSON.stringify({ coupon_id, mobile, receive_hints })).then(ret => {
            return ret.data
        })
    }
    // 上下线
    offAndOnline ({
        status,  // 1上线 2下线
        coupon_id
    }) {
        let url = `${urlPre}/${coupon_id}`
        return api.put(url, JSON.stringify({ status })).then(ret => {
            xmview.showTip('success', ret.message || `${status === 1 ? '上线' : '下线'}成功`)
        })
    }
    // 删除
    delete ({
        coupon_id
    }) {
        let url = `${urlPre}/${coupon_id}`
        return api.del(url).then(ret => {
            xmview.showTip('success', ret.message || '删除成功')
        })
    }
    // 添加优惠券
    addCoupon ({
        name,
        money,
        threshold,
        start_date,
        end_date,
        goods_list,
        expire_hints
    }) {
        let url = urlPre + '/create'
        return api.post(url, JSON.stringify({ name, money, threshold, start_date, end_date, goods_list, expire_hints })).then(ret => {
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
    // 查看指定商品
    viewGoods ({
        coupon_id
    }) {
        let url = `${urlPre}/${coupon_id}/goods`
        return api.get(url).then(ret => ret.data)
    }
    // 领取/发放次数
    viewUser ({
        coupon_id,
        type,  // 1发放 2领取
        page,
        page_size
    }) {
        let url = `${urlPre}/${coupon_id}/user`
        return api.get(url, { type, page, page_size }).then(ret => ret.data)
    }
}
export default new CouponService()

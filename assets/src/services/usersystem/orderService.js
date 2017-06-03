/**
 * Created by gaohj on 2017/4/11.
 */
import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/sys/product/order'

class OrderService {
    // 订单记录列表
    search({page, page_size, status, channel = '', product_name = '', product_category = '', product_order_no = '', product_id}) {
        let url = `${urlPre}/search`
        return api.get(url, {page, page_size, status, channel, product_name, product_category, product_order_no, product_id}).then((ret) => {
            return ret.data
        })
    }
    // 查看物流信息
    view(val) {
        let url = `${urlPre}/express/${val}`
        return api.get(url, {}).then((ret) => {
            return ret.data
        })
    }
    // 完善物流信息
    complete(val, {phone, address, postcode, receiver, shipper, shipper_no}) {
        let url = `${urlPre}/express/${val}`
        return api.put(url, {phone, address, postcode, receiver, shipper, shipper_no}).then((ret) => {
            return ret.data
        })
    }
}

export default new OrderService()

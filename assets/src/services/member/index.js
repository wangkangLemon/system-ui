import * as api from '../api'
import config from 'utils/config'
const urlPre = config.apiHost + '/member/order'

class Member {
    searchOrder ({
        trade_no,
        user_mobile,
        pay_method,
        time_start,
        time_end,
        pay_time_start,
        pay_time_end,
        status,
        expire_time_start,
        expire_time_end,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, { trade_no, user_mobile, pay_method, time_start, time_end, pay_time_start, pay_time_end, status, expire_time_start, expire_time_end, page, page_size }).then(ret => {
            return ret.data
        })
    }

    editOrder ({
        order_id,
        pay_method,
        pay_trade_no
    }) {
        let finalUrl = `${urlPre}/${order_id}/pay`
        return api.put(finalUrl, { pay_method, pay_trade_no }).then(ret => xmview.showTip('success', ret.message))
    }
}
export default new Member()

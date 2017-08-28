import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/newcourse/order'

class OrderService {
    // 搜索
    search({ course_id, user_id, user_mobile, pay_method, status, time_start, time_end, page, page_size }) {
        let url = urlPre + '/search'
        return api.get(url, { course_id, user_id, user_mobile, pay_method, status, time_start, time_end, page, page_size }, false).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
        })
    }
}
export default new OrderService()

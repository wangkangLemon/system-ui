import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/order'

class OrderService {
    // 搜索
    search({ user_id, trade_no, pay_method, status, order_type, object_type, in_company, start_date, end_date, page, page_size }) {
        let url = urlPre + '/search'
        return api.get(url, { user_id, trade_no, pay_method, status, order_type, object_type, in_company, start_date, end_date, page, page_size }, false).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
        })
    }

    // 更新备注
    updateNote({id, note}) {
        let url = `${urlPre}/${id}`
        return api.put(url, JSON.stringify({note})).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 获取用户列表
    userList (keyword, page, page_size) {
        let url = config.apiHost + '/common/user/search'
        return api.get(url, {keyword, page, page_size}, false).then(ret => {
            if (ret.code == 0) {
                return ret.data
            } else {
                return Promise.reject(ret)
            }
        })
    }
}

export default new OrderService()

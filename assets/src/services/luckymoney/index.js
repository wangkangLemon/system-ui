/**
 * Created by kangchen at 2018/01/09
 */
import * as api from '../api'
import config from 'utils/config'
const urlPre = config.apiHost + '/sys/money'
class LuckyMoney {
    searchRemainingMoney ({
        user_name,
        mobile,
        page,
        page_size,
    }) {
        let finalUrl = `${urlPre}/user/search`
        return api.get(finalUrl, { user_name, mobile, page, page_size }).then(ret => {
            return ret.data
        })
    }

    searchDrawMoney ({
        mobile,
        status,
        withdraw_type,
        page,
        page_size,
    }) {
        let finalUrl = `${urlPre}/draw/search`
        return api.get(finalUrl, { mobile, status, withdraw_type, page, page_size }).then(ret => ret.data)
    }

    draw ({
        draw_id,
        bank_trade_no
    }) {
        let finalUrl = `${urlPre}/draw/${draw_id}`
        return api.put(finalUrl, { bank_trade_no }).then(ret => {
            xmview.showTip('success', ret.message || '操作成功')
        })
    }
}
export default new LuckyMoney()

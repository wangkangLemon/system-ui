/**
 * Created by huangrui on 2017/3/30.
 */
import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/sys/finance'

// 余额和累计支出接口
export function getfinance() {
    let url = urlPre
    return api.get(url).then(ret => {
        if (ret.code == 0) {
            return ret.data
        } else {
            return Promise.reject(ret)
        }
    })
}

// 收支趋势接口
export function incomeConsume() {
    let url = urlPre + '/analytics/datetime'
    return api.get(url).then(ret => {
        if (ret.code == 0) {
            return ret.data.data
        } else {
            return Promise.reject(ret)
        }
    })
}

// 工业账户查询
export function industry(start, length, companyId) {
    let url = urlPre + '/company/fund/search'
    return api.get(url, {start, length, company_id: companyId}).then(ret => {
        if (ret.code == 0) {
            return ret.data
        } else {
            return Promise.reject(ret)
        }
    })
}

// 流水记录
export function history(start, length, courseId, companyId, timeStart, timeEnd, userId) {
    let url = urlPre + '/history/search'
    return api.get(url, {
        start,
        length,
        course_id: courseId,
        company_id: companyId,
        time_start: timeStart,
        time_end: timeEnd,
        user_id: userId
    }).then(ret => {
        if (ret.code == 0) {
            return ret.data
        } else {
            return Promise.reject(ret)
        }
    })
}

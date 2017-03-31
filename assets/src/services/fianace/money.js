/**
 * Created by huangrui on 2017/3/30.
 */
import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/sys/money'

// 余额和累计支出接口
export function getMoney() {
    let url = urlPre
    return api.get(url).then(ret => {
        if (ret.code == 0) {
            return ret.data
        } else {
            return Promise.reject(ret)
        }
    })
}

// 工业账户查询
export function industry(page, pageSize) {
    let url = urlPre + '/company/money/search'
    return api.get(url, {page, page_size: pageSize}).then(ret => {
        if (ret.code == 0) {
            return ret.data
        } else {
            return Promise.reject(ret)
        }
    })
}

// 充值记录列表
export function chargeData(reqObj) {
    let url = urlPre + '/charge/search'
    return api.get(url, reqObj).then(ret => {
        if (ret.code == 0) {
            return ret.data
        } else {
            return Promise.reject(ret)
        }
    })
}

// 流水记录
export function history(reqObj) {
    let url = urlPre + '/income/search'
    return api.get(url, reqObj).then(ret => {
        if (ret.code == 0) {
            return ret.data
        } else {
            return Promise.reject(ret)
        }
    })
}

// 流水记录导出接口
export function exportData(reqObj) {
    let url = '/sys/finance/charge/search?export=1'
    return api.get(url, reqObj).then(ret => {
        if (ret.code == 0) {
            return ret.data
        } else {
            return Promise.reject(ret)
        }
    })
}

// 提现记录
export function drawList(reqObj) {
    let url = urlPre + '/draw/search'
    return api.get(url, reqObj).then(ret => {
        if (ret.code == 0) {
            return ret.data
        } else {
            return Promise.reject(ret)
        }
    })
}

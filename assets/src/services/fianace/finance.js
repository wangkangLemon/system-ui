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
export function industry(start, length) {
    let url = urlPre + '/company/fund/search'
    return api.get(url, {start, length}).then(ret => {
        if (ret.code == 0) {
            return ret.data
        } else {
            return Promise.reject(ret)
        }
    })
}

// 流水记录
export function history(reqObj) {
    let url = urlPre + '/history/search'
    return api.get(url, reqObj).then(ret => {
        if (ret.code == 0) {
            return ret.data
        } else {
            return Promise.reject(ret)
        }
    })
}

// 流水记录导出接口
export function exportHistory (reqObj) {
    let finalUrl = `${urlPre}/history/search`
    api.downLoad(finalUrl, Object.assign(reqObj, {export: 1}), '流水记录.xls')
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

// 充值接口
export function charge(reqObj) {
    let url = urlPre + '/charge'
    return api.post(url, reqObj).then(ret => {
        if (ret.code == 0) {
            return ret.data
        } else {
            return Promise.reject(ret)
        }
    })
}
// 充值导出
export function exportCharge (reqObj) {
    let finalUrl = `${urlPre}/charge/search`
    api.downLoad(finalUrl, Object.assign(reqObj, {export: 1}), '充值记录.xls')
}

// 价格调整列表
export function priceData(reqObj) {
    let url = urlPre + '/price/search'
    return api.get(url, reqObj).then(ret => {
        if (ret.code == 0) {
            return ret.data
        } else {
            return Promise.reject(ret)
        }
    })
}

// 调整价格接口
export function price(reqObj) {
    let url = urlPre + '/price'
    return api.post(url, reqObj).then(ret => {
        if (ret.code == 0) {
            return ret.data
        } else {
            return Promise.reject(ret)
        }
    })
}
// 价格导出
export function exportPrice (reqObj) {
    let finalUrl = `${urlPre}/price/search`
    api.downLoad(finalUrl, Object.assign(reqObj, {export: 1}), '价格调整.xls')
}

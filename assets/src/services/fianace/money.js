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

// 充值导出接口
export function exportCharge(reqObj) {
    let finalUrl = `${urlPre}/charge/search`
    api.downLoad(finalUrl, Object.assign(reqObj, {export: 1}), '红包充值.xls')
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
    let finalUrl = `${urlPre}/income/search`
    api.downLoad(finalUrl, Object.assign(reqObj, {export: 1}), '红包流水记录.xls')
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
// 提现导出接口
export function exportDraw(reqObj) {
    let finalUrl = `${urlPre}/draw/search`
    api.downLoad(finalUrl, Object.assign(reqObj, {export: 1}), '提现记录.xls')
}
// 红包充值接口
export function moneyCharge({
    company_id,
    money,
    desc
}) {
    let url = `${urlPre}/charge`
    return api.post(url, {company_id, money, desc}).then((ret) => {
        if (ret.code) {
            return Promise.reject(ret)
        }
    })
}

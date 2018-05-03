import * as typeUtils from './typeUtils'
class FormCheckUtils {
    // 整数部分不大于7位 小数部分不大于2位
    checkPrice(rule, value, callback) {
        if (!limitTwoFloatReg.test(value)) {
            return callback(new Error('大于零的最多两位小数'))
        }
        let valuestr = value.toString()
        let moneystr = ''
        if (valuestr.indexOf('.') != -1) {
            moneystr = valuestr.split('.')[0]
        } else {
            moneystr = valuestr
        }
        if (moneystr.length > 7) {
            callback(new Error('金额不能高于百万'))
        }
        callback()
    }

    // 价格不高于
    checkMoney (rule, value, callback) {
        let value1 = this.fetchParam.price
        setTimeout(() => {
            if (value > parseFloat(value1)) {
                callback(new Error('优惠价格不能高于商品定价'))
            } else {
                callback()
            }
        }, 1000)
    }
}
let limitTwoFloatReg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/

let serialize = function serialize (data, keyName = 'subjects', arrayNeedKey) {
    let ret = ''
    if (typeUtils.isArray(data)) {
        data.forEach((item, index) => {
            ret += produceData4serialize(arrayNeedKey ? index : '', item, keyName, arrayNeedKey)
        })
    } else if (typeUtils.isObject(data)) {
        for (let key in data) {
            ret += produceData4serialize(key, data[key], keyName, arrayNeedKey)
        }
    }

    return ret
}

function produceData4serialize (key, val, keyName, arrayNeedKey) {
    let ret = ''
    if (typeUtils.isArray(val) || typeUtils.isObject(val)) {
        ret += serialize(val, `${keyName}[${key}]`, arrayNeedKey)
    } else {
        val = val == null ? '' : val
        ret += `${keyName}[${key}]=${val}&`
    }

    return ret
}

export default new FormCheckUtils()

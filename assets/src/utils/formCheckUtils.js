class FormCheckUtils {
    // 正整数
    checkNumber(rule, value, callback) {
        if (!limitNumberReg.test(value)) {
            return callback(new Error('只能输入正整数'))
        }
        callback()
    }
    _checkPrice (value) {
        if (!limitTwoFloatReg.test(value)) {
            return {
                status: false,
                msg: '大于零的最多两位小数'
            }
        }
        let valuestr = value.toString()
        let moneystr = ''
        if (valuestr.indexOf('.') != -1) {
            moneystr = valuestr.split('.')[0]
        } else {
            moneystr = valuestr
        }
        if (moneystr.length > 7) {
            return {
                status: false,
                msg: '金额不能高于百万'
            }
        }
        return {
            status: true,
            msg: ''
        }
    }
    // 整数部分不大于7位 小数部分不大于2位
    checkPrice(rule, value, callback) {
        let a = this._checkPrice(value)
        if (a.status) {
            callback()
        } else {
            callback(new Error(this._checkPrice(value).msg))
        }
    }
    // 价格不高于
    checkMoney (rule, value, price, errorMsg, callback) {
        if (this._checkPrice(value).status) {
            setTimeout(() => {
                if (value > parseFloat(price)) {
                    callback(new Error(errorMsg))
                } else {
                    callback()
                }
            }, 1000)
        } else {
            callback(new Error(this._checkPrice(value).msg))
        }
    }
    // 检查视频是否选择 单选框
    checkHasShow (rule, value, callback, videoname, cb) {
        console.log(videoname)
        if (value === 2) {
            if (videoname) {
                callback()
            } else {
                callback(new Error('请选择视频'))
            }
        } else {
            cb()
            callback()
        }
    }

    // 检查是否是空
    checkHas (rule, value, value2, callback) {
        if (!value2.length) {
            return callback(new Error('不能是空'))
        } else {
            callback()
        }
    }

    // 检查是否是 URL 只能以 http:// https:// yst:// 开头
    checkUrl(rule, value, callback) {
        if (!urlReg.test(value)) {
            return callback(new Error('只能以 http:// 或者 https:// 或者 yst:// 开头'))
        }
        callback()
    }
 }
let limitTwoFloatReg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
let limitNumberReg = /^[1-9][0-9]*$/
let urlReg = /^(http||https||yst):\/\//
export default new FormCheckUtils()

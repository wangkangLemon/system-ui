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
    }

    // 价格不高于
    checkMoney (rule, value, price, callback) {
        this.checkPrice(rule, value, callback)
        setTimeout(() => {
            if (value > parseFloat(price)) {
                callback(new Error('优惠价格不能高于商品定价'))
            } else {
                callback()
            }
        }, 1000)
    }

    // 检查视频是否选择 单选框
    checkHasShow (rule, value, callback, videoname, cb) {
        console.log(videoname)
        if (value === 1) {
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
}
let limitTwoFloatReg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
export default new FormCheckUtils()

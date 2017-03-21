/**
 * Created by huangrui on 2017/3/21.
 */
import * as typeUtls from './typeUtls'

// 在字符串前面填充0
export function fillZero (orignStr, maxLength = 2) {
    orignStr = orignStr + '' // 将非字符串转为字符串
    let zeroCount = maxLength - orignStr.length
    let zeroStr = ''
    for (let i = 0; i < zeroCount; i++) {
        zeroStr = zeroStr + '0'
    }

    return zeroStr + orignStr
}

/**
 * 日期转字符串
 * @param date
 * @param split 日期分割方式 默认 -
 * @param hashour 是否需要转时分秒
 * @param hasDay 是否有日
 */
export function date2Str (date, split = '-', {hashour = false, hasDay = true} = {}) {
    if (!typeUtls.isDate(date)) {
        return date
    }

    let ret = [date.getFullYear(), fillZero((date.getMonth() + 1), 2)]
    if (hasDay) {
        ret.push(fillZero(date.getDate(), 2))
    }

    ret = ret.join(split)
    return ret
}

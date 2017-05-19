/**
 * Created by huangrui on 2017/4/8.
 */
import Vue from 'vue'
import * as timeUtils from '../utils/timeUtils'
import config from '../../config/config'

// 默认头像
export const defaultAvatar = Vue.filter('defaultAvatar', function (urlObj) {
    if (!urlObj) return ''
    if (urlObj.url && urlObj.url.indexOf('/user-default') == -1) {
        let apiUrl = config.API_HOST_PROD.replace(/(^")|("$)/g, '')
        return urlObj.url.indexOf('http://') > -1 ? urlObj.url : apiUrl + urlObj.url
    } else {
        if (urlObj.sex) {
            // 男默认头像
            return require('../assets/user-default-male.jpg')
        }
        // 女默认头像
        return require('../assets/user-default-female.jpg')
    }
})

// 时间戳转字符串
export const tamp2Str = Vue.filter('tamp2Str', function (timetamp) {
    return timeUtils.getTimespanDesc(timetamp, false)
})

// 填充图片的url
export const fillImgPath = Vue.filter('fillImgPath', function (url) {
    if (!url) return url
    let apiUrl = config.API_HOST_PROD.replace(/(^")|("$)/g, '')
    return url.indexOf('http://') > -1 ? url : apiUrl + url
})

export const fillZero = Vue.filter('fillZero', function (orignStr, maxLength = 2) {
    if (!orignStr) {
        return
    }
    orignStr = orignStr + '' // 将非字符串转为字符串
    let zeroCount = maxLength - orignStr.length
    let zeroStr = ''
    for (let i = 0; i < zeroCount; i++) {
        zeroStr = zeroStr + '0'
    }

    return zeroStr + orignStr
})

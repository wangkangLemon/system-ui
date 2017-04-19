/**
 * Created by huangrui on 2017/4/8.
 */
import Vue from 'vue'
import * as timeUtils from '../utils/timeUtils'
import config from '../utils/config'

// 默认头像
export const defaultAvatar = Vue.filter('defaultAvatar', function (urlObj) {
    if (!urlObj) return ''
    if (urlObj.url && urlObj.url.indexOf('http') != -1) {
        return urlObj.url
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

// 填充图片的ur
export const fillImgPath = Vue.filter('fillImgPath', function (url) {
    if (!url) return url
    return url.indexOf(config.apiHost) > -1 ? url : config.apiHost + url
})

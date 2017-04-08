/**
 * Created by huangrui on 2017/4/8.
 */
import Vue from 'vue'
// 默认头像
export const defaultAvatar = Vue.filter('defaultAvatar', function (urlObj) {
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

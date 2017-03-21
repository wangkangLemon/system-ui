/**
 * Created by huanghuixin on 2017/3/20.
 */

import authUtils from '../utils/authUtils'
function getTimeoutPromise (url) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 如果该url还未处理完毕
            if (!requestedUrls[url]) {
                xmview.setLoading(false)
                xmview.showTip('error', '请求超时! 请重试')
                reject(new Error({message: '请求超时', code: -9}))
            } else {
                console.info('该url处理完毕', url)
            }

            // 删除这个url的引用
            delete requestedUrls[url]
        }, 20000)
    })
}

// 请求完毕的url
let requestedUrls = {}
export function get (url, params, needLoading = true) {
    url = url + '?' + processParams(params)

    let pRequest = new Promise(function (resolve, reject) {
        needLoading && xmview.setLoading(true)
        fetch(url, {
            method: 'GET',
            credentials: 'include', // pass cookies, for authentication
            headers: {
                'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                'Authorization': 'Bearer ' + authUtils.getAuthToken()
            }
        }).then(function (response) {
            return response.json()
        }).then(json => {
            processCodeError(json, url)
            resolve(json)
        }).catch(function (ex) {
            requestedUrls[url] = true
            xmview.setLoading(false)
            ex.tipCom = xmview.showTip('error', '服务器请求失败! 请重试')  // 提示框的实例
            reject(ex)
        })
    })

    return Promise.race([getTimeoutPromise(url), pRequest])
}

export function post (url, params, needLoading = true) {
    let pRequest = new Promise(function (resolve, reject) {
        needLoading && xmview.setLoading(true)
        fetch(url, {
            credentials: 'include', // pass cookies, for authentication
            method: 'POST',
            headers: {
                'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                'Authorization': 'Bearer ' + authUtils.getAuthToken()
            },
            body: processParams(params)
        }).then(response => { // 转json
            return response.json()
        }).then(json => { // 拿到json数据并判断是否返回错误码
            processCodeError(json, url)
            resolve(json)
        }).catch(function (ex) { // 处理error的情况
            requestedUrls[url] = true // 设置请求处理完毕
            xmview.setLoading(false)
            ex.tipCom = xmview.showTip('error', '服务器请求失败! 请重试')  // 提示框的实例
            reject(ex)
        })
    })

    return Promise.race([getTimeoutPromise(url), pRequest])
}

// 处理结果的异常和一些预处理
function processCodeError (ret, url) {
    requestedUrls[url] = true

    // 如果过期
    if (ret.code === 1102) {
        xmview.showTip('error', '登录超时,请重新登录')
        // 记录当前的url
        xmrouter.push({name: 'login', query: {returnUrl: window.location.href}})
    } else if (ret.code >= 100) {
        xmview.showTip('error', ret.message)
    }
}

function processParams (params) {
    let data = []
    for (let k in params) {
        data.push(k + '=' + params[k])
    }

    return data.join('&')
}

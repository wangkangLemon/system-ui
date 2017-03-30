/**
 * Created by huanghuixin on 2017/3/20.
 */

import authUtils from '../utils/authUtils'
import config from '../utils/config'
let requestId = 0
function getTimeoutPromise (url) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 如果该url还未处理完毕
            if (!requestedUrls[url]) {
                xmview.setLoading(false)
                xmview.showTip('error', '请求超时! 请重试')
                reject(new Error({message: '请求超时', code: -9}))
            } else {
                config.debug && console.info('该url处理完毕', url)
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

    needLoading && xmview.setLoading(true)
    let pRequest = fetch(url, {
        method: 'GET',
        credentials: 'include', // pass cookies, for authentication
        headers: {
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Authorization': 'Bearer ' + authUtils.getAuthToken()
        }
    })

    url += '|' + requestId++

    return Promise.race([getTimeoutPromise(url), processResponse(pRequest, url)])
}

export function post (url, params, needLoading = true) {
    needLoading && xmview.setLoading(true)
    let pRequest = fetch(url, {
        credentials: 'include', // pass cookies, for authentication
        method: 'POST',
        headers: {
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Authorization': 'Bearer ' + authUtils.getAuthToken()
        },
        body: processParams(params)
    })

    url += '#urlid=' + requestId++

    return Promise.race([getTimeoutPromise(url), processResponse(pRequest, url)])
}

// 处理请求后的response数据
function processResponse (promise, url) {
    return promise.then(function (response) {
        // 如果登录验证失败
        if (response.status === 401) {
            xmview.showTip('error', '登录超时,请重新登录')
            // 记录当前的url
            xmrouter.push({name: 'login', query: {returnUrl: window.location.href}})
            return true
        }

        // 如果是其他错误
        if (response.status < 200 || response.status > 299)
            return Promise.reject({message: '服务器错误'})
        return response.json()
    }).then(json => {
        processCodeError(json, url)
        return json
    }).catch(function (ex) {
        requestedUrls[url] = true
        xmview.setLoading(false)
        ex.tipCom = xmview.showTip('error', '服务器请求失败! 请重试')  // 提示框的实例
        return Promise.reject(ex)
    })
}

// 处理正常返回后的结果的异常和一些预处理
function processCodeError (ret, url) {
    requestedUrls[url] = true

    // 如果过期
    if (ret.code === 10000 || ret.code === 10001 || ret.code === 10002) {
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

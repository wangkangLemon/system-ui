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
export function get (url, params, needLoading = false) {
    return sendRequest('GET', url, params, needLoading)
}

export function post (url, params, needLoading = false) {
    return sendRequest('POST', url, params, needLoading)
}

export function put (url, params, needLoading) {
    return sendRequest('PUT', url, params, needLoading)
}

export function del (url, params, needLoading) {
    return sendRequest('DELETE', url, params, needLoading)
}

// 共用的请求数据方法
function sendRequest (method, url, params, needLoding = false) {
    if (method === 'GET')
        url = url + '?' + processParams(params)

    needLoding && xmview.setLoading(true)
    let pRequest = fetch(url, {
        method: method,
        credentials: 'include', // pass cookies, for authentication
        headers: {
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Authorization': 'Bearer ' + authUtils.getAuthToken()
        },
        body: method === 'GET' ? {} : processParams(params)
    })

    url += '|' + requestId++

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
        let p = processCodeError(json, url)
        if (p)
            return p
        return json
    }, ex => {
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
        ret.tipCom = xmview.showTip('error', ret.message)
        return Promise.reject(ret)
    } else if (ret.code != 0) {
        ret.tipCom = xmview.showTip('error', '远程服务器出现问题!')
        return Promise.reject(ret)
    }
}

function processParams (params) {
    let data = []
    for (let k in params) {
        let val = params[k] == null ? '' : params[k]
        data.push(k + '=' + val)
    }

    return data.join('&')
}

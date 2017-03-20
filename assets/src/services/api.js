/**
 * Created by huanghuixin on 2017/3/20.
 */

function getTimeoutPromise () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            xmview.setLoading(false)
            xmview.showTip('error', '错误', '请求超时! 请重试')
            reject(new Error({message: '请求超时', code: -9}))
        }, 10000)
    })
}

export function get (url, params, needLoading = true) {
    let pRequest = new Promise(function (resolve, reject) {
        needLoading && xmview.setLoading(true)
        fetch(url, {
            credentials: 'include', // pass cookies, for authentication
            headers: {
                'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            body: processParams(params)
        }).then(function (response) {
            return response.json()
        }).then(json => {
            processCodeError(json)
            resolve(json)
        }).catch(function (ex) {
            reject(ex)
        })
    })

    return Promise.race([getTimeoutPromise(), pRequest])
}

export function post (url, params, needLoading = true) {
    let pRequest = new Promise(function (resolve, reject) {
        needLoading && xmview.setLoading(true)
        fetch(url, {
            credentials: 'include', // pass cookies, for authentication
            method: 'POST',
            headers: {
                'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            body: processParams(params)
        }).then(response => {
            return response.json()
        }).then(json => {
            processCodeError(json)
            resolve(json)
        }).catch(function (ex) {
            setTimeout(() => {
                xmview.setLoading(false)
                xmview.showTip('error', '错误', '服务器请求失败! 请重试')
            }, 200)
            reject(ex)
        })
    })

    return Promise.race([getTimeoutPromise(), pRequest])
}

function processCodeError (ret) {
    if (ret.code >= 100) {
        xmview.showTip('error', '错误', ret.message)
    }
}

function processParams (params) {
    let data = []
    for (let k in params) {
        data.push(k + '=' + params[k])
    }

    return data.join('&')
}

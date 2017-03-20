/**
 * Created by huanghuixin on 2017/3/20.
 */

import 'whatwg-fetch'
export function get (url, params) {
    fetch(url)
        .then(function(response) {
            return response.json()
        }).then(function(json) {
        console.log('parsed json', json)
    }).catch(function(ex) {
        console.log('parsing failed', ex)
    })
}
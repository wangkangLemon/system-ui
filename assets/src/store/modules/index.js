/**
 * Created by huanghuixin on 2017/3/29.
 */
import {
    INDEX_SETWEBPATH
} from '../mutations'

const Auth = {
    state: {
        webpathMain: '主页',
        webpathSub: ''
    },

    mutations: {
        [INDEX_SETWEBPATH] (state, {main, sub}) {
            state.webpathMain = main
            state.webpathSub = sub
        }
    }
}

export default Auth

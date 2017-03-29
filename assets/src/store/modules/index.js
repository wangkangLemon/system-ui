/**
 * Created by huanghuixin on 2017/3/29.
 */
import {
    INDEX_SETWEBPATH,
    INDEX_SET_NAVMENU
} from '../mutations'

const Auth = {
    state: {
        webpathMain: '主页',
        webpathSub: '',
        navMenu: [], // 导航菜单
    },

    mutations: {
        [INDEX_SETWEBPATH] (state, {main, sub}) {
            state.webpathMain = main
            state.webpathSub = sub
        },
        [INDEX_SET_NAVMENU](state, {menu}) {
            state.navMenu = menu
        }
    }
}

export default Auth

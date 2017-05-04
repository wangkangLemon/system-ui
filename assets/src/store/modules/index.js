/**
 * Created by huanghuixin on 2017/3/29.
 */
import {
    INDEX_SETWEBPATH,
    INDEX_SET_NAVMENU,
    INDEX_SET__MENU_ACTIVE
} from '../mutations'

const Auth = {
    state: {
        webpathMain: '主页',
        webpathSub: '',
        navMenu: [], // 导航菜单
        navMenueActive: '', // 当前菜单的选中项
    },

    mutations: {
        [INDEX_SETWEBPATH] (state, {main, sub}) {
            state.webpathMain = main
            state.webpathSub = sub
        },
        [INDEX_SET_NAVMENU](state, {menu}) {
            state.navMenu = menu
        },
        [INDEX_SET__MENU_ACTIVE] (state, url) {
            state.navMenueActive = url
        }
    }
}

export default Auth

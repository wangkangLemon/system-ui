import * as types from './mutations'

const actions = {
    // 设置首页网站路径
    setIndexWebpath (store, {main, sub}) {
        store.commit(types.INDEX_SETWEBPATH, {main, sub})
    },
    setIndexNavMenu (store, {menu}) {
        store.commit(types.INDEX_SET_NAVMENU, {menu})
    },
}

export default actions

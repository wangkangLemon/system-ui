import * as types from './mutations'

const actions = {
    // 设置首页网站路径
    setIndexWebpath (store, {main, sub}) {
        store.commit(types.INDEX_SETWEBPATH, {main, sub})
    }
}

export default actions

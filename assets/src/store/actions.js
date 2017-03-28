import * as types from './mutations'

const actions = {
    setUserInfo (store, userInfo) {
        store.commit(types.AUTH_SET_USER, userInfo)
    }
}

export default actions

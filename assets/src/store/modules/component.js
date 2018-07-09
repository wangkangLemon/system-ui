/**
 * Created by huanghuixin on 2017/3/29.
 */
import {
    YSHI_GROUP_SUCCES,
    YSHI_GROUP_ERROR
} from '../mutations'

const Auth = {
    state: {
        yshiGroupSussess: true
    },

    mutations: {
        [YSHI_GROUP_SUCCES] (state) {
            state.yshiGroupSussess = true
        },
        [YSHI_GROUP_ERROR] (state) {
            state.yshiGroupSussess = false
        }
    }
}

export default Auth

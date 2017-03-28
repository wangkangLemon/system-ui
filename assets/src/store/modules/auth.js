import {
    AUTH_SET_USER
} from '../mutations'

const Auth = {
    state: {
        user: {}
    },

    mutations: {
        [AUTH_SET_USER] (state, user) {
            state.user = user
        }
    }
}

export default Auth

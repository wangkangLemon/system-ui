import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import config from '../utils/config'
import actions from './actions'
import auth from './modules/auth'
import index from './modules/index'
import component from './modules/component'
Vue.use(Vuex)

const store = new Vuex.Store({
    actions,
    modules: {
        auth,
        index,
        component
    },
    strict: config.debug,
    plugins: config.debug ? [createLogger()] : []
})

export default store

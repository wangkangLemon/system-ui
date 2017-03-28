import Vue from 'vue'
import '../theme/index.css'
import ElementUI from 'element-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import {sync} from 'vuex-router-sync'
import 'whatwg-fetch'
import config from './utils/config'
import authUtls from './utils/authUtils'

authUtls.authRefreshtoken() // 开启自动更新token

// keep router and vuex store in sync
sync(store, router)
Vue.config.devtools = config.debug

Vue.use(ElementUI)
window.xmview = {}
window.xmrouter = router
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render: h => h(App)
})

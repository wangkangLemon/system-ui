import Vue from 'vue'
import '../theme/index.css'
import ElementUI from 'element-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import {sync} from 'vuex-router-sync'
import config from './utils/config'
import authUtils from './utils/authUtils'

console.info(config.apiHost, '指定接口地址')
// keep router and vuex store in sync
sync(store, router)
Vue.config.devtools = config.debug

document.documentElement.style.fontSize = window.innerWidth / 21.6 + 'px'
Vue.use(ElementUI)
window.xmview = {}
window.xmrouter = router
window.xmconfig = {
    apiHost: config.apiHost,
    getAuthToken: authUtils.getAuthToken,
    getTwiceToken: authUtils.getTwiceToken
}
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render: h => h(App)
})

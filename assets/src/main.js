import Vue from 'vue'
import '../theme/index.css'
import ElementUI from 'element-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import {sync} from 'vuex-router-sync'
import config from './utils/config'

// keep router and vuex store in sync
sync(store, router)
Vue.config.devtools = config.debug

document.documentElement.style.fontSize = window.innerWidth / 21.6 + 'px'
Vue.use(ElementUI)
window.xmview = {}
window.xmrouter = router
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render: h => h(App)
})

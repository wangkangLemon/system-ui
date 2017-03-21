import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'
import router from './router'
import 'whatwg-fetch'

Vue.use(ElementUI)
window.xmview = {}
window.xmrouter = router
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render: h => h(App)
})

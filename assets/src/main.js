import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'
import router from './router'

Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render: h => h(App)
})

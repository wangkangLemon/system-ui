import ElementUI, {Message} from 'element-ui'
import Vue from 'vue'
import '../theme/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import {sync} from 'vuex-router-sync'
import config from './utils/config'
import authUtils from './utils/authUtils'
import VueDND from 'awe-dnd'

// keep router and vuex store in sync
sync(store, router)
Vue.config.devtools = config.debug

document.documentElement.style.fontSize = window.innerWidth / 21.6 + 'px'
Vue.use(ElementUI)
Vue.use(VueDND)

window.xmview = {
    // success/warning/info/error
    showTip: function (type, msg, msgDuring = 3000) {
        return Message({
            type,
            message: msg,
            duration: msgDuring
        })
    },
    closeAllTip () {
        Message.closeAll()
    }
}

// ===保留此处=== 每次构建打印一个日期, 避免app.js的hash值没有变化
console.info(process.buildTime, 'buildTime')

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

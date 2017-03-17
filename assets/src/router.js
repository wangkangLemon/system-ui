import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const scrollBehavior = (to, from, savedPosition) => {
    if (to.meta && to.meta.savePosition && savedPosition) {
        return savedPosition
    }

    const position = {}
    if (to.hash) {
        position.selector = to.hash
    } else {
        position.x = 0
        position.y = 0
    }

    return position
}

const routes = [
    {   // 首页
        path: '/',
        name: 'index',
        component: require('./views/Index.vue')
    },
    {   // 设置考勤方式
        path: '/login',
        name: 'login',
        component: require('./views/login/Login.vue'),
        meta: {
            title: '登录',
            notAuth: true, //  不需要身份验证
        }
    },
]

const router = new VueRouter({
    base: '/',
    mode: 'history',
    scrollBehavior,
    routes
})

router.afterEach((route) => {
    let title = route.meta.title
    if (title) {
        document.title = title + ' - 药视通'
    }
})

router.beforeEach((to, from, next) => {
    document.documentElement.style.fontSize = window.innerWidth / 21.6 + 'px'
    next()
})

export default router

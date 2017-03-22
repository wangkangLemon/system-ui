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
        component: require('./views/Index.vue'),
        children: [
            // 首页
            {
                path: '/index/main',
                name: 'main',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('./views/index/main'))
                    })
                }
            },
            // 管理
            {
                path: '/system/admin',
                name: 'admin',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('./views/system/admin'))
                    })
                }
            }
        ]
    },
    {   // 登录
        path: '/login',
        name: 'login',
        component: require('./views/login/Login.vue'),
        meta: {
            title: '登录',
            notAuth: true, //  不需要身份验证
        }
    },
    {
        path: '/test',
        name: 'test',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('./views/Test.vue'))
            })
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
    console.info('路由跳转 router.js')
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

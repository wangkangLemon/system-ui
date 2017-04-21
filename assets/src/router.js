import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import action from './store/actions'
import article from './routers/article'
import admin from './routers/admin'
import dataAnalysis from './routers/dataAnalysis'
import course from './routers/course' // 培训管理
import client from './routers/client' // 客户端
import finance from './routers/finance' // 财务
import sales from './routers/sales' // 晒单
import company from './routers/company' // 企业
import user from './routers/user' // 企业
import im from './routers/im'

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
    {
        path: '/', redirect: '/main'
    },
    {
        path: '/showdoc', // 文档管理
        name: 'showdoc',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('./views/course/manage/DocShow.vue'))
            })
        }
    },
    {   // 首页
        path: '/',
        name: 'index',
        component: require('./views/Index.vue'),
        children: [
            // 首页
            {
                path: '/main',
                name: 'main',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('./views/index/Main.vue'))
                    })
                },
                meta: {
                    title: '控制台'
                }
            },
            // ============系统==================
            ...admin,
            // ============数据分析==================
            ...dataAnalysis,
            // ============客户端部分==================
            ...client,
            // ============晒单==================
            ...sales,
            // ============财务管理部分==================
            ...finance,
            // ============文章管理部分==================
            ...article,
            // ============培训管理==================
            course,
            // ============企业管理==================
            company,
            // ============当前登录用户==================
            ...user,
            // ============服务号==================
            im,
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
    {   // 二次认证 登录
        path: '/login/twice',
        name: 'login-twice',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('./views/login/TwiceValid.vue'))
            })
        },
        meta: {
            title: '二次认证-微信登录',
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
        },
        meta: {
            title: '二次认证-微信登录',
            notAuth: true, //  不需要身份验证
        }
    },
]

const router = new VueRouter({
    base: '/view',
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
    xmview.setContentLoading && xmview.setContentLoading(true)
    setTitle(to.meta.title)

    next()
})

function setTitle (title) {
    // 设置标题
    if (!title) {
        return
    }
    let titles = title.split('-')
    if (titles.length < 2) {
        titles[1] = ''
    }
    action.setIndexWebpath(store, {main: titles[0], sub: titles[1]})
}

export default router

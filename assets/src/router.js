import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import action from './store/actions'
import article from './routers/article'
import admin from './routers/admin'
import dataAnalysis from './routers/dataAnalysis'
import course from './routers/course' // 培训管理
import client from './routers/client' // 客户端
import feedback from './routers/feedback' // 工单系统
import finance from './routers/finance' // 财务
import sales from './routers/sales' // 晒单
import company from './routers/company' // 企业
import user from './routers/user' // 企业
import usersystem from './routers/usersystem' // 用户体系
import im from './routers/im'
import speaking from './routers/speaking' // 药我说
import systemTools from './routers/system/tools' // 系统工具
import newCourse from './routers/newcourse/course' // 系列课程
import examPaper from './routers/exam/paper' // 试卷管理
import examLibrary from './routers/exam/library' // 题库管理
import examQuestion from './routers/exam/question' // 试题管理
import courseCommnet from './routers/comment' // 评论管理
import authUtils from './utils/authUtils'
import * as typeUtils from './utils/typeUtils'

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

// 拿到左边的叶子节点
let item = authUtils.getNavMenu()
let firstLeafMenu
if (item) {
    item = item[0]
    while (item.children && item.children.length > 0)
        item = item.children[0]
    firstLeafMenu = item.item.menu_url
} else {
    firstLeafMenu = '/login'
}

const routes = [
    {
        path: '/', redirect: firstLeafMenu || '/main'
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
    {
        path: '/articleshow/:id', // 文章详情
        name: 'articleshow',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('./views/article/ContentShow.vue'))
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
                    title: '控制台',
                    noback: true
                }
            },
            // ============系统==================
            admin,
            // ============数据分析==================
            dataAnalysis,
            // ============客户端部分==================
            client,
            // ============晒单==================
            sales,
            // ============ 工单系统 ==================
            feedback,
            // ============财务管理部分==================
            finance,
            // ============文章管理部分==================
            article,
            // ============培训管理==================
            course,
            // ============企业管理==================
            company,
            // ============当前登录用户==================
            ...user,
            // ============服务号==================
            im,
            // ============药我说==================
            speaking,
            // ============用户体系==================
            usersystem,
            // 系统工具
            systemTools,
            // 系列课程
            newCourse,
            // 试卷管理
            examPaper,
            // 题库管理
            examLibrary,
            // 试题管理
            examQuestion,
            // 评论管理
            courseCommnet,
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
            title: '测试页面',
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

let loginouted = false
router.afterEach((route) => {
    let title = route.meta.title
    if (title) {
        document.title = title + ' - 药视通'
    }

    // 设置选中的菜单
    if (route.matched.some(record => record.meta.noback)) store.dispatch('setIndexMenuActive', route.path)
})

router.beforeEach((to, from, next) => {
    // 如果需要登录
    if (!to.matched.some(record => record.meta.notAuth) && (!authUtils.getUserInfo() || !authUtils.getAuthToken())) {
        // 第一次进来不提示超时
        loginouted && xmview.showTip('error', '未登录或登录已超时, 请重新登录!')
        loginouted = true
        next({name: 'login'})
        return
    }

    xmview.setContentLoading && xmview.setContentLoading(true)
    setTitle(to.meta.title)

    showBackContent(to, from, next)

    // 如果需要清空筛选条件
    if (store.state.index.clearFetchParam) {
        store.dispatch('clearFetchParam', false)
        let vm
        if (from.matched.length < 3) {
            return
        } else if (from.matched.length === 3) {
            vm = from.matched[2].instances.default
        } else if (from.matched.length === 4) {
            vm = from.matched[3].instances.default
        }
        vm.initFetchParam ? vm.initFetchParam() : clearObj([vm.fetchParam, vm.fetchParams])
    }

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

    !xmview.setContentTile && (xmview.setContentTile = setTitle)
}

let backContentTimeoutid
// 设置是否显示返回按钮
function showBackContent (to, from, next) {
    clearTimeout(backContentTimeoutid)
    if (!xmview.setContentBack) {
        backContentTimeoutid = setTimeout(() => {
            showBackContent(to)
        }, 30)
        return
    }
    xmview.setContentBack(true)
    // 如果不需要back 则干掉返回按钮
    if (to.matched.some(record => record.meta.noback)) {
        xmview.setContentBack && xmview.setContentBack(false)
    }
}

function clearObj (obj) {
    if (!obj) return
    if (typeUtils.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) clearObj(obj[i])
    } else {
        for (let k in obj) {
            if (k !== 'page' && k !== 'page_size') obj[k] = void 0
        }
    }
}

export default router

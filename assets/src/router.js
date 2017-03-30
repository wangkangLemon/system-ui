import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import action from './store/actions'
import client from './routers/client'

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
                path: '/sys/admin',
                name: 'sys-admin',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('./views/system/admin'))
                    })
                },
                meta: {
                    title: '管理员-系统',
                }
            },
            // 设置
            {
                path: '/sys/setting',
                name: 'sys-setting',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('./views/system/set'))
                    })
                },
                meta: {
                    title: '设置',
                }
            },
            // 日志
            {
                path: '/sys/log',
                name: 'sys-log',
                component: require('./views/system/Log.vue'),
                children: [
                    {   // 系统管理
                        path: 'systemManage',
                        name: 'systemManage',
                        component: resolve => {
                            require.ensure([], () => {
                                resolve(require('./views/system/logSub/SystemManage'))
                            })
                        },
                        meta: {
                            title: '系统管理操作-日志',
                        }
                    },
                    {   // 企业管理
                        path: 'companyManage',
                        name: 'companyManage',
                        component: resolve => {
                            require.ensure([], () => {
                                resolve(require('./views/system/logSub/CompanyManage'))
                            })
                        },
                        meta: {
                            title: '企业管理操作-日志',
                        }
                    },
                    {   // 系统后台登录
                        path: 'systemBack',
                        name: 'systemBack',
                        component: resolve => {
                            require.ensure([], () => {
                                resolve(require('./views/system/logSub/SystemBack'))
                            })
                        },
                        meta: {
                            title: '系统后台登录-日志',
                        }
                    },
                    {   // 企业后台登录
                        path: 'companyBack',
                        name: 'companyBack',
                        component: resolve => {
                            require.ensure([], () => {
                                resolve(require('./views/system/logSub/CompanyBack'))
                            })
                        },
                        meta: {
                            title: '企业后台登录-日志',
                        }
                    },
                    {   // 前台登录
                        path: 'frontDest',
                        name: 'frontDest',
                        component: resolve => {
                            require.ensure([], () => {
                                resolve(require('./views/system/logSub/FrontDest'))
                            })
                        },
                        meta: {
                            title: '前台登录-日志',
                        }
                    },
                    {   // 手机验证码
                        path: 'mobileCode',
                        name: 'mobileCode',
                        component: resolve => {
                            require.ensure([], () => {
                                resolve(require('./views/system/logSub/MobileCode'))
                            })
                        },
                        meta: {
                            title: '手机验证码-日志',
                        }
                    },
                    {   // 邮箱验证码
                        path: 'emailCode',
                        name: 'emailCode',
                        component: resolve => {
                            require.ensure([], () => {
                                resolve(require('./views/system/logSub/EmailCode'))
                            })
                        },
                        meta: {
                            title: '邮件验证码-日志',
                        }
                    },
                ]
            },
            // 连锁后台
            {
                path: '/system/feedBack/admin',
                name: 'system-feedBack-admin',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('./views/system/feedBack/ChainBack'))
                    })
                },
                meta: {
                    title: '问题反馈-连锁后台',
                }
            },
            // 客户端
            {
                path: '/system/feedBack/mobile',
                name: 'system-feedBack-mobile',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('./views/system/feedBack/App'))
                    })
                },
                meta: {
                    title: '问题反馈-客户端',
                }
            },
            // 导出
            {
                path: '/dataAnalysis/export',
                name: 'dataAnalysis-export',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('./views/dataAnalysis/Export'))
                    })
                },
                meta: {
                    title: '导出',
                }
            },
            // 企业签约信息
            {
                path: '/dataAnalysis/sign',
                name: 'dataAnalysis-sign',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('./views/dataAnalysis/ContractMessage'))
                    })
                },
                meta: {
                    title: '企业签约信息',
                }
            },
            // ============客户端部分==================
            ...client
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
    let title = route.meta.title
    if (title) {
        document.title = title + ' - 药视通'
    }

    setTimeout(() => {
        xmview.setContentLoading && xmview.setContentLoading(false)
    }, 1000)
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

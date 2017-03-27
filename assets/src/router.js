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
            },
            // 设置
            {
                path: '/system/set',
                name: 'set',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('./views/system/set'))
                    })
                }
            },
            // 日志
            {
                path: '/system/log',
                name: 'log',
                component: require('./views/system/Log.vue'),
                children: [
                    {   // 系统管理
                        path: '/system/logSub/systemManage',
                        name: 'systemManage',
                        component: resolve => {
                            require.ensure([], () => {
                                resolve(require('./views/system/logSub/SystemManage'))
                            })
                        }
                    },
                    {   // 企业管理
                        path: '/system/logSub/companyManage',
                        name: 'companyManage',
                        component: resolve => {
                            require.ensure([], () => {
                                resolve(require('./views/system/logSub/CompanyManage'))
                            })
                        }
                    },
                    {   // 系统后台登录
                        path: '/system/logSub/systemBack',
                        name: 'systemBack',
                        component: resolve => {
                            require.ensure([], () => {
                                resolve(require('./views/system/logSub/SystemBack'))
                            })
                        }
                    },
                    {   // 企业后台登录
                        path: '/system/logSub/companyBack',
                        name: 'companyBack',
                        component: resolve => {
                            require.ensure([], () => {
                                resolve(require('./views/system/logSub/CompanyBack'))
                            })
                        }
                    },
                    {   // 前台登录
                        path: '/system/logSub/frontDest',
                        name: 'frontDest',
                        component: resolve => {
                            require.ensure([], () => {
                                resolve(require('./views/system/logSub/FrontDest'))
                            })
                        }
                    },
                    {   // 手机验证码
                        path: '/system/logSub/mobileCode',
                        name: 'mobileCode',
                        component: resolve => {
                            require.ensure([], () => {
                                resolve(require('./views/system/logSub/MobileCode'))
                            })
                        }
                    },
                    {   // 邮箱验证码
                        path: '/system/logSub/emailCode',
                        name: 'emailCode',
                        component: resolve => {
                            require.ensure([], () => {
                                resolve(require('./views/system/logSub/EmailCode'))
                            })
                        }
                    },
                ]
            },
            // 连锁后台
            {
                path: '/system/feedBack/chainBack',
                name: 'chainBack',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('./views/system/feedBack/ChainBack'))
                    })
                }
            },
            // 客户端
            {
                path: '/system/feedBack/app',
                name: 'app',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('./views/system/feedBack/App'))
                    })
                }
            },
            // 导出
            {
                path: '/dataAnalysis/export',
                name: 'export',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('./views/dataAnalysis/Export'))
                    })
                }
            },
            // 企业签约信息
            {
                path: '/dataAnalysis/contractMessage',
                name: 'contractMessage',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('./views/dataAnalysis/ContractMessage'))
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
    let title = route.meta.title
    if (title) {
        document.title = title + ' - 药视通'
    }

    setTimeout(() => {
        xmview.setContentLoading && xmview.setContentLoading(false)
    }, 1000)
})

router.beforeEach((to, from, next) => {
    document.documentElement.style.fontSize = window.innerWidth / 21.6 + 'px'
    xmview.setContentLoading && xmview.setContentLoading(true)
    next()
})

export default router

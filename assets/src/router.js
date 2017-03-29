import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import action from './store/actions'

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
                        path: 'systemManage',
                        name: 'systemManage',
                        component: resolve => {
                            require.ensure([], () => {
                                resolve(require('./views/system/logSub/SystemManage'))
                            })
                        }
                    },
                    {   // 企业管理
                        path: 'companyManage',
                        name: 'companyManage',
                        component: resolve => {
                            require.ensure([], () => {
                                resolve(require('./views/system/logSub/CompanyManage'))
                            })
                        }
                    },
                    {   // 系统后台登录
                        path: 'systemBack',
                        name: 'systemBack',
                        component: resolve => {
                            require.ensure([], () => {
                                resolve(require('./views/system/logSub/SystemBack'))
                            })
                        }
                    },
                    {   // 企业后台登录
                        path: 'companyBack',
                        name: 'companyBack',
                        component: resolve => {
                            require.ensure([], () => {
                                resolve(require('./views/system/logSub/CompanyBack'))
                            })
                        }
                    },
                    {   // 前台登录
                        path: 'frontDest',
                        name: 'frontDest',
                        component: resolve => {
                            require.ensure([], () => {
                                resolve(require('./views/system/logSub/FrontDest'))
                            })
                        }
                    },
                    {   // 手机验证码
                        path: 'mobileCode',
                        name: 'mobileCode',
                        component: resolve => {
                            require.ensure([], () => {
                                resolve(require('./views/system/logSub/MobileCode'))
                            })
                        }
                    },
                    {   // 邮箱验证码
                        path: 'emailCode',
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
            },
            // ============客户端部分================== 开始
            {
                path: '/client/contentManage', // 内容维护
                name: 'contentManage',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('./views/client/contentManage'))
                    })
                }
            },
            {
                path: '/client/bootad', // 启动广告
                name: 'client-bootad',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('./views/client/BootAd.vue'))
                    })
                },
                meta: {
                    title: '启动广告-手机客户端',
                }
            },
            {
                path: '/client/companylogo', // 企业logo
                name: 'client-companylogo',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('./views/client/CompanyLogo.vue'))
                    })
                },
                meta: {
                    title: '企业LOGO-手机客户端',
                }
            }
            // ============客户端部分================== 结束
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

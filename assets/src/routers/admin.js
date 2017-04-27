/**
 * Created by huangrui on 2017/4/1.
 */
const pathPre = '/sys'
// 系统栏目下路由
export default [
    // 管理
    {
        path: pathPre + '/admin',
        name: 'sys-admin',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/system/Admin.vue'))
            })
        },
        meta: {
            title: '管理员-系统',
            noback: true
        }
    },
    // 设置
    {
        path: pathPre + '/setting',
        name: 'sys-setting',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/system/Set.vue'))
            })
        },
        meta: {
            title: '设置-系统',
            noback: true
        }
    },
    // 日志
    {
        path: pathPre + '/log',
        name: 'sys-log',
        component: require('../views/system/Log.vue'),
        children: [
            {   // 系统管理
                path: 'systemManage',
                name: 'systemManage',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('../views/system/logSub/SystemManage.vue'))
                    })
                },
                meta: {
                    title: '系统管理操作-日志',
                    noback: true
                }
            },
            {   // 企业管理
                path: 'companyManage',
                name: 'companyManage',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('../views/system/logSub/CompanyManage.vue'))
                    })
                },
                meta: {
                    title: '企业管理操作-日志',
                    noback: true
                }
            },
            {   // 系统后台登录
                path: 'systemBack',
                name: 'systemBack',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('../views/system/logSub/SystemBack.vue'))
                    })
                },
                meta: {
                    title: '系统后台登录-日志',
                    noback: true
                }
            },
            {   // 企业后台登录
                path: 'companyBack',
                name: 'companyBack',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('../views/system/logSub/CompanyBack.vue'))
                    })
                },
                meta: {
                    title: '企业后台登录-日志',
                    noback: true
                }
            },
            {   // 前台登录
                path: 'frontDest',
                name: 'frontDest',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('../views/system/logSub/FrontDest.vue'))
                    })
                },
                meta: {
                    title: '前台登录-日志',
                    noback: true
                }
            },
            {   // 手机验证码
                path: 'mobileCode',
                name: 'mobileCode',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('../views/system/logSub/MobileCode.vue'))
                    })
                },
                meta: {
                    title: '手机验证码-日志',
                    noback: true
                }
            },
            {   // 邮箱验证码
                path: 'emailCode',
                name: 'emailCode',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('../views/system/logSub/EmailCode.vue'))
                    })
                },
                meta: {
                    title: '邮件验证码-日志',
                    noback: true
                }
            },
            {   // 操作行为
                path: 'operationBehavior',
                name: 'operationBehavior',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('../views/system/logSub/OperationBehavior.vue'))
                    })
                },
                meta: {
                    title: '操作行为-日志',
                    noback: true
                }
            },
        ]
    },
    // 连锁后台
    {
        path: pathPre + '/feedback/admin',
        name: 'sys-feedback-admin',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/system/feedback/index.vue'))
            })
        },
        meta: {
            title: '工单系统 - 连锁后台',
            noback: true
        }
    },
    // 客户端
    {
        path: pathPre + '/feedback/mobile',
        name: 'sys-feedback-mobile',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/system/feedback/App.vue'))
            })
        },
        meta: {
            title: '问题反馈 - 客户端',
            noback: true
        }
    },
    // 内测应用管理
    {
        path: pathPre + '/alpha',
        name: 'sys-alpha',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/system/Alpha.vue'))
            })
        },
        meta: {
            title: '内测应用管理-系统',
            noback: true
        }
    }
]

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
        meta: {
            title: '系统管理操作-日志',
            noback: true
        }
    },
    // 工单管理
    {
        path: pathPre + '/feedback',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/system/feedback/Main.vue'))
            })
        },
        children: [
            {
                path: 'admin',
                name: 'sys-feedback-admin',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('../views/system/feedback/Admin.vue'))
                    })
                },
                meta: {
                    title: '工单管理 - 工单系统',
                    noback: true
                }
            },
            {
                path: 'view',
                name: 'sys-feedback-view',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('../views/system/feedback/View.vue'))
                    })
                },
                meta: {
                    title: '工单详情 - 工单系统',
                    noback: true,
                }
            },
            {
                path: 'mobile',
                name: 'sys-feedback-mobile',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('../views/system/feedback/App.vue'))
                    })
                },
                meta: {
                    title: '客户端意见反馈 - 工单系统',
                    noback: true,
                }
            },
        ]
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

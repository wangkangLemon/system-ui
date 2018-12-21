/**
 * Created by huangrui on 2017/4/1.
 */
const pathPre = '/sys'
// 系统栏目下路由
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../views/system/Index.vue'))
        })
    },
    children: [
        // RBAC
        {
            path: 'rbac',
            name: 'sys-rbac',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/rbac/Index.vue'))
                })
            },
            meta: {
                title: 'RBAC-系统',
                noback: true
            }
        },
        // 管理员管理
        {
            path: 'admin',
            name: 'sys-admin',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/system/Admin.vue'))
                })
            },
            meta: {
                title: '管理员-RBAC',
                noback: true
            }
        },
        // 角色管理
        {
            path: 'rbac/role',
            name: 'sys-rbac-role',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/rbac/role/Role.vue'))
                })
            },
            meta: {
                title: '角色管理-RBAC',
                noback: true
            }
        },
         // 权限管理
        {
            path: 'rbac/permission',
            name: 'sys-rbac-permission',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/rbac/permission/Permission.vue'))
                })
            },
            meta: {
                title: '权限管理-RBAC',
                noback: true
            }
        },
         // api管理
        {
            path: 'rbac/operation',
            name: 'sys-rbac-operation',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/rbac/operation/Operation.vue'))
                })
            },
            meta: {
                title: 'API管理-RBAC',
                noback: true
            }
        },
         // 菜单管理
        {
            path: 'rbac/menu',
            name: 'sys-rbac-menu',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/rbac/menu/Menu.vue'))
                })
            },
            meta: {
                title: '菜单管理-RBAC',
                noback: true
            }
        },
        // 设置
        {
            path: 'setting',
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
            path: 'log',
            name: 'sys-log',
            component: require('../views/system/Log.vue'),
            meta: {
                title: '系统管理操作-日志',
                noback: true
            }
        },
        // 工单管理
        {
            path: 'feedback',
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
                        title: '后台问题反馈 - 问题反馈',
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
                        title: '反馈详情 - 问题反馈',
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
                        title: '客户端意见反馈 - 问题反馈',
                        noback: true,
                    }
                },
            ]
        },
        // 内测应用管理
        {
            path: 'alpha',
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
}

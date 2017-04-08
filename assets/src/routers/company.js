/**
 * Created by huangrui on 2017/4/5.
 */
const pathPre = '/company'

export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../views/company/Index.vue'))
        })
    },
    children: [
        {
            path: 'index',
            name: 'company-index',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/company/Company.vue'))
                })
            },
            meta: {
                title: '企业',
            }
        },
        {
            path: 'admin/:company_id',
            name: 'company-admin',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/company/Admin.vue'))
                })
            },
            meta: {
                title: '管理员',
            }
        },
        {
            path: 'department',
            name: 'company-department',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/company/Department.vue'))
                })
            },
            meta: {
                title: '门店',
            }
        },
        {
            path: 'manager',
            name: 'company-manager',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/company/Manager.vue'))
                })
            },
            meta: {
                title: '店长管理',
            }
        },
        {
            path: 'user',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/company/User.vue'))
                })
            },
            children: [
                {
                    path: 'list',
                    name: 'company-user-list',
                    component: resolve => {
                        require.ensure([], () => {
                            resolve(require('../views/company/subUser/List.vue'))
                        })
                    },
                    meta: {
                        title: '店员列表-店员',
                    }
                },
                {
                    path: 'department',
                    name: 'company-user-department',
                    component: resolve => {
                        require.ensure([], () => {
                            resolve(require('../views/company/subUser/Department.vue'))
                        })
                    },
                    meta: {
                        title: '连锁统计-店员',
                    }
                },
                {
                    path: 'area',
                    name: 'company-user-area',
                    component: resolve => {
                        require.ensure([], () => {
                            resolve(require('../views/company/subUser/Area.vue'))
                        })
                    },
                    meta: {
                        title: '地域统计-店员',
                    }
                }
            ]
        },
        {
            path: 'announce',
            name: 'company-announce',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/company/Announce.vue'))
                })
            },
            meta: {
                title: '公告-企业',
            }
        },
        {
            path: 'medicine',
            name: 'company-medicine',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/company/Medicine.vue'))
                })
            },
            meta: {
                title: '拿药练习-企业',
            }
        },
        {
            path: 'coursetask',
            name: 'company-coursetask',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/company/Coursetask.vue'))
                })
            },
            meta: {
                title: '课程任务-企业',
            }
        },
        {
            path: 'analytics',
            name: 'company-analytics',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/company/Analytics.vue'))
                })
            },
            meta: {
                title: '新增统计-企业',
            }
        },
        {
            path: 'audit',
            name: 'company-audit',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/company/Audit.vue'))
                })
            },
            meta: {
                title: '入驻审核-企业',
            }
        },
    ]
}

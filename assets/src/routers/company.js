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
                noback: true
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
                noback: true
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
                noback: true
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
                        noback: true
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
                noback: true
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
                noback: true
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
                noback: true
            }
        },
        {
            path: 'coursetask/template',
            name: 'company-coursetasktemplate',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/company/Coursetasktemplate.vue'))
                })
            },
            meta: {
                title: '课程任务模板-企业',
                noback: true
            }
        },
        {
            path: 'coursetask/template/category',
            name: 'company-coursetasktemplate-category',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/company/Coursetasktemplatecategory.vue'))
                })
            },
            meta: {
                title: '课程任务模板分类-企业',
                noback: true
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
                noback: true
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
                noback: true
            }
        },
    ]
}

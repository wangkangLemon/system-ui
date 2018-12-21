/**
 * Created by huangrui on 2017/4/5.
 */
const pathPre = '/company'
import comrbac from './comrbac' // 企业权限管理

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
        comrbac,
        {
            path: 'operate/add',
            name: 'company-add',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/company/CompanyOperate.vue'))
                })
            },
            meta: {
                title: '企业-添加',
            }
        },
        {
            path: 'operate/correlation',
            name: 'company-correlation',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/company/correlation.vue'))
                })
            },
            meta: {
                title: '企业-关联',
                noback: false
            }
        },
        {
            path: 'edit/:id',
            name: 'company-edit',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/company/CompanyOperate.vue'))
                })
            },
            meta: {
                title: '内容管理-编辑',
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
            name: 'company-user',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/company/User.vue'))
                })
            },
            meta: {
                title: '店员管理',
                noback: true
            }
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
                    resolve(require('../views/company/courseTask/Coursetask.vue'))
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
                    resolve(require('../views/company/courseTask/Coursetasktemplate.vue'))
                })
            },
            meta: {
                title: '课程任务模板-企业',
                noback: true
            }
        },
        // 添加修改课程任务模板
        {
            path: 'coursetask/template/add',
            name: 'coursetask-template-add',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/company/courseTask/AddCoursetasktemplate.vue'))
                })
            },
            meta: {
                title: '添加课程任务模板-企业',
            }
        },
        {
            path: 'coursetask/template/category',
            name: 'company-coursetasktemplate-category',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/company/courseTask/Coursetasktemplatecategory.vue'))
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
        {
            path: 'audit/:id',
            name: 'company-audit-show',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/company/AuditShow.vue'))
                })
            },
            meta: {
                title: '入驻审核(审核)'
            }
        },
        {
            path: 'resources/review',
            name: 'company-video-show',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/company/audit/advertAuditVideo.vue'))
                })
            },
            meta: {
                title: '视频素材审核'
            }
        },
        {
            path: 'picture/review',
            name: 'company-picture-show',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/company/audit/advertAuditPic.vue'))
                })
            },
            meta: {
                title: '图片素材审核'
            }
        }
    ]
}

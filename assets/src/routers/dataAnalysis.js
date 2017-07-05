/**
 * Created by huangrui on 2017/4/1.
 */
// 数据分析路由
const pathPre = '/analysis'
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../views/dataAnalysis/Index.vue'))
        })
    },
    children: [
        // 导出
        {
            path: 'export',
            name: 'dataAnalysis-export',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/dataAnalysis/Export.vue'))
                })
            },
            meta: {
                title: '导出',
                noback: true
            }
        },
        // 企业签约信息
        {
            path: 'sign',
            name: 'dataAnalysis-sign',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/dataAnalysis/ContractMessage.vue'))
                })
            },
            meta: {
                title: '企业签约信息',
                noback: true
            }
        },
        {
            path: 'company/stat',
            name: 'analysis-company-stat',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/dataAnalysis/companyStat/Index.vue'))
                })
            },
            meta: {
                title: '行为统计',
                noback: true
            }
        },
        {
            path: 'company/stat/view',
            name: 'analysis-company-stat-view',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/dataAnalysis/companyStat/View.vue'))
                })
            },
            meta: {
                title: '趋势',
                noback: true
            }
        },
        {
            path: 'company/manage',
            name: 'analysis-company-manage',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/dataAnalysis/company/Manage.vue'))
                })
            },
            meta: {
                title: '管理员',
                noback: true
            }
        },
        {
            path: 'company/coursetask',
            name: 'analysis-company-coursetask',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/dataAnalysis/company/CourseTask.vue'))
                })
            },
            meta: {
                title: '课程任务',
                noback: true
            }
        },
        {
            path: 'company/startimg',
            name: 'analysis-company-startimg',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/dataAnalysis/company/StartImage.vue'))
                })
            },
            meta: {
                title: '客户端启动图',
                noback: true
            }
        },
        {
            path: 'company/dynamic',
            name: 'analysis-company-dynamic',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/dataAnalysis/company/Dynamic.vue'))
                })
            },
            meta: {
                title: '企业动态',
                noback: true
            }
        },
        {
            path: 'app/announce',
            name: 'analysis-app-announce',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/dataAnalysis/company/Announce.vue'))
                })
            },
            meta: {
                title: '公告',
                noback: true
            }
        },
        {
            path: 'company/hybrid',
            name: 'analysis-company-hybrid',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/dataAnalysis/company/Hybrid.vue'))
                })
            },
            meta: {
                title: '小应用',
                noback: true
            }
        },
        {
            path: 'company/attendance',
            name: 'analysis-company-attendance',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/dataAnalysis/company/Attendance.vue'))
                })
            },
            meta: {
                title: '考勤打卡',
                noback: true
            }
        },
        {
            path: 'company/medicine',
            name: 'analysis-company-medicine',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/dataAnalysis/company/Medicine.vue'))
                })
            },
            meta: {
                title: '拿药练习',
                noback: true
            }
        },
        {
            path: 'company/approval',
            name: 'analysis-company-approval',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/dataAnalysis/company/Approval.vue'))
                })
            },
            meta: {
                title: '流程审批',
                noback: true
            }
        }
    ]
}

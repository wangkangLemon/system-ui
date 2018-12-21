/**
 * Created by huangrui on 2017/5/22.
 */
const pathPre = 'task'
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../views/usersystem/task/Index.vue'))
        })
    },
    children: [
        {
            path: 'daily',
            name: 'daily',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/usersystem/task/Main.vue'))
                })
            },
            meta: {
                title: '任务中心-日常任务',
                noback: true
            }
        },
        {
            path: 'activity',
            name: 'play',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/usersystem/task/Main.vue'))
                })
            },
            meta: {
                title: '任务中心-活动任务',
                noback: true
            }
        },
        {
            path: 'audit',
            name: 'play-audit',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/usersystem/task/Audit.vue'))
                })
            },
            meta: {
                title: '活动任务-审核',
                noback: true
            }
        },
        {
            path: 'audit_details',
            name: 'play-audit-details',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/usersystem/task/AuditDetails.vue'))
                })
            },
            meta: {
                title: '审核详情',
            }
        },
        {
            path: 'new',
            name: 'newbie',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/usersystem/task/Main.vue'))
                })
            },
            meta: {
                title: '任务中心-新手任务',
                noback: true
            }
        },
        {
            path: 'grow',
            name: 'growth',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/usersystem/task/Main.vue'))
                })
            },
            meta: {
                title: '任务中心-成长任务',
                noback: true
            }
        },
        {
            path: 'details', // 任务完成详情
            name: 'task-details',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/usersystem/task/Details.vue'))
                })
            },
            meta: {
                title: '完成详情',
            }
        }
    ]
}

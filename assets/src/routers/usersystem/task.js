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
            name: 'task-daily',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/usersystem/task/Daily.vue'))
                })
            },
            meta: {
                title: '任务中心-日常任务',
                noback: true
            }
        },
        {
            path: 'activity',
            name: 'task-activity',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/usersystem/task/Activity.vue'))
                })
            },
            meta: {
                title: '任务中心-活动任务',
                noback: true
            }
        },
        {
            path: 'new',
            name: 'task-new',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/usersystem/task/New.vue'))
                })
            },
            meta: {
                title: '任务中心-新手任务',
                noback: true
            }
        },
        {
            path: 'grow',
            name: 'task-grow',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/usersystem/task/Grow.vue'))
                })
            },
            meta: {
                title: '任务中心-成长任务',
                noback: true
            }
        }
    ]
}

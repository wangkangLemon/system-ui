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
        }
    ]
}

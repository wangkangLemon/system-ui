// 工单系统
const pathPre = '/feedback'
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../views/feedback/Main.vue'))
        })
    },
    children: [
        {
            path: 'index',
            name: 'feedback-index',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/feedback/Index.vue'))
                })
            },
            meta: {
                title: '我的反馈 - 问题反馈',
                noback: true
            }
        },
        {
            path: 'add',
            name: 'feedback-add',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/feedback/Add.vue'))
                })
            },
            meta: {
                title: '提交问题 - 问题反馈',
                noback: true,
            }
        },
        {
            path: 'view',
            name: 'feedback-view',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/feedback/View.vue'))
                })
            },
            meta: {
                title: '反馈详情 - 问题反馈',
                noback: true,
            }
        },
    ]
}

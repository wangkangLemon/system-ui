/**
 * Created by huangrui on 2017/3/30.
 */
// 财务管理
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
                title: '我的工单 - 工单系统',
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
                title: '提交工单 - 工单系统',
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
                title: '工单详情 - 工单系统',
                noback: true,
            }
        },
    ]
}

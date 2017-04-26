/**
 * Created by huangrui on 2017/3/30.
 */
// 财务管理
const pathPre = '/feedback'
export default [
    {
        path: pathPre + '/index',
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
        path: pathPre + '/add',
        name: 'feedback-add',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/feedback/Add.vue'))
            })
        },
        meta: {
            title: '提交工单 - 工单系统',
        }
    },
    {
        path: pathPre + '/view',
        name: 'feedback-view',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/feedback/View.vue'))
            })
        },
        meta: {
            title: '工单详情 - 工单系统',
        }
    },
]

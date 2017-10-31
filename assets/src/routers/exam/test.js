/**
 * Created by Pavle Lee on 2017/10/31.
 */
const pathPre = '/test'
// 试题管理
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../views/exam/Main.vue'))
        })
    },
    children: [
        {
            path: 'index',
            name: 'test-index',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/exam/test/Index.vue'))
                })
            },
            meta: {
                title: '试题管理',
                noback: true
            }
        },
        {
            path: 'view/:id',
            name: 'test-view',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/exam/test/View.vue'))
                })
            },
            meta: {
                title: '试题管理-详情',
            }
        },
        {
            path: 'add',
            name: 'test-add',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/exam/test/Add.vue'))
                })
            },
            meta: {
                title: '试题管理-添加',
            }
        },
        {
            path: 'edit',
            name: 'test-edit',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/exam/test/Edit.vue'))
                })
            },
            meta: {
                title: '试题管理-编辑',
            }
        }
    ]
}

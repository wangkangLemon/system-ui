/**
 * Created by Pavle Lee on 2017/10/31.
 */
const pathPre = '/exam/paper'
// 试卷管理
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../views/exam/Layout.vue'))
        })
    },
    children: [
        {
            path: 'index',
            name: 'test-paper-index',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/exam/paper/Index.vue'))
                })
            },
            meta: {
                title: '试卷管理',
                noback: true
            }
        },
        {
            path: 'view/:id',
            name: 'test-paper-view',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/exam/paper/View.vue'))
                })
            },
            meta: {
                title: '试卷管理-详情',
            }
        },
        {
            path: 'add',
            name: 'test-paper-add',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/exam/paper/Add.vue'))
                })
            },
            meta: {
                title: '试卷管理-添加',
            }
        },
        {
            path: 'edit/:exam_id',
            name: 'test-paper-edit',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/exam/paper/Edit.vue'))
                })
            },
            meta: {
                title: '试卷管理-编辑',
            }
        }
    ]
}

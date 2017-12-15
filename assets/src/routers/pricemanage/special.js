/*
 * Created by Pavle Lee on 2017/10/31.
 */
// 分类管理
const pathPre = 'finance/manager/'
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../views/exam/Layout.vue'))
        })
    },
    children: [
        {
            path: 'special',
            name: 'test-special-index',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/financeManage/priceManage/special.vue'))
                })
            },
            meta: {
                title: '特殊定价模板管理',
                noback: true
            }
        },
        {
            path: 'add',
            name: 'test-special-add',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/financeManage/priceManage/add.vue'))
                })
            },
            meta: {
                title: '新增模板',
            }
        },
        {
            path: 'edit/:id',
            name: 'test-special-edit',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/financeManage/priceManage/edit.vue'))
                })
            },
            meta: {
                title: '编辑模板',
            }
        }
    ]
}

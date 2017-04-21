/**
 * Created by huanghuixin on 2017/3/30.
 */
// 晒单部分
const pathPre = '/sales'
export default [
    {
        path: pathPre + '/amount', // 内容维护
        name: 'sales-amount',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/sales/Amount.vue'))
            })
        },
        meta: {
            title: '晒单总览-晒单',
            noback: true
        }
    },
    {
        path: pathPre + '/product', // 内容维护
        name: 'sales-product',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/sales/Product.vue'))
            })
        },
        meta: {
            title: '药品列表-晒单',
            noback: true
        }
    },
    {
        path: pathPre + '/history', // 内容维护
        name: 'sales-history',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/sales/History.vue'))
            })
        },
        meta: {
            title: '流水记录-晒单',
            noback: true
        }
    },
]

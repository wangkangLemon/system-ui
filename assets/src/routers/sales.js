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
        }
    },
]

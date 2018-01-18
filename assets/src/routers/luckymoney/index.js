const path = 'luckymoney'

export default {
    path: `${path}`,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/views/financeManage/luckymoney/Index.vue'))
        })
    },
    children: [
        {
            path: 'index',
            name: 'luckymoney-remaining',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/financeManage/luckymoney/remaining/Index.vue'))
                })
            },
            meta: {
                title: '红包余额管理',
                noback: 'true'
            }
        },
        {
            path: 'draw',
            name: 'luckymoney-draw',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/financeManage/luckymoney/draw/Index.vue'))
                })
            },
            meta: {
                title: '红包提现记录',
                noback: 'true'
            }
        }
    ]
}

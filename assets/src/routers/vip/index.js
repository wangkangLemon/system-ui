const pathPre = '/vip'

export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/views/vip/Index.vue'))
        })
    },
    children: [
        {
            path: 'order',
            name: 'vip-order',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/vip/order/Index.vue'))
                })
            },
            meta: {
                title: '付费权限购买订单',
                noback: true
            }
        }
    ]
}

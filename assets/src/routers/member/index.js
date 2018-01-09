const pathPre = '/member'

export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/views/member/Index.vue'))
        })
    },
    children: [
        {
            path: 'order',
            name: 'member-order',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/member/order/Index.vue'))
                })
            },
            meta: {
                title: '会员购买订单',
                noback: true
            }
        }
    ]
}

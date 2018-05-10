export default [
    {
        path: 'coupon',
        name: 'yshi-coupon',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/coupon/Index.vue'))
            })
        },
        meta: {
            title: '优惠券',
            noback: true
        }
    },
    {
        path: 'coupon/add',
        name: 'yshi-coupon-add',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/coupon/Add.vue'))
            })
        },
        meta: {
            title: '优惠券设置'
        }
    },
    {
        path: 'coupon/view',
        name: 'yshi-coupon-view',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/coupon/View.vue'))
            })
        },
        meta: {
            title: '优惠券查看'
        }
    }
]

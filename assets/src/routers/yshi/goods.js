export default [
    {
        path: 'goods',
        name: 'yshi-goods',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/goods/Index.vue'))
            })
        },
        meta: {
            title: '单品管理',
            noback: true
        }
    },
    {
        path: 'goods/add',
        name: 'yshi-goods-add',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/goods/Form.vue'))
            })
        },
        meta: {
            title: '添加售卖商品'
        }
    },
    {
        path: 'goods/edit/:good_id',
        name: 'yshi-goods-edit',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/goods/Form.vue'))
            })
        },
        meta: {
            title: '编辑售卖商品'
        }
    },
    {
        path: 'goods/preview/:good_id',
        name: 'yshi-goods-preview',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/goods/Form.vue'))
            })
        },
        meta: {
            title: '查看售卖商品'
        }
    }
]

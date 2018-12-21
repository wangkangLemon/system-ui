export default [
    {
        path: 'favorable',
        name: 'yshi-favorable',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/favorable/Index.vue'))
            })
        },
        meta: {
            title: '优惠管理',
            noback: true
        }
    },
    {
        path: 'favorable/add',
        name: 'yshi-favorable-add',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/favorable/Form.vue'))
            })
        },
        meta: {
            title: '创建优惠'
        }
    },
    {
        path: 'favorable/edit/:group_id',
        name: 'yshi-favorable-edit',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/favorable/Form.vue'))
            })
        },
        meta: {
            title: '编辑优惠'
        }
    },
    {
        path: 'favorable/preview/:group_id',
        name: 'yshi-favorable-preview',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/favorable/Form.vue'))
            })
        },
        meta: {
            title: '查看优惠'
        }
    }
]

export default [
    {
        path: 'group',
        name: 'yshi-group',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/group/Index.vue'))
            })
        },
        meta: {
            title: '组合售卖管理',
            noback: true
        }
    },
    {
        path: 'group/add',
        name: 'yshi-group-add',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/group/Form.vue'))
            })
        },
        meta: {
            title: '创建组合售卖'
        }
    },
    {
        path: 'group/edit/:group_id',
        name: 'yshi-group-edit',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/group/Form.vue'))
            })
        },
        meta: {
            title: '编辑组合售卖'
        }
    },
    {
        path: 'group/preview/:group_id',
        name: 'yshi-group-preview',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/group/Form.vue'))
            })
        },
        meta: {
            title: '查看组合售卖'
        }
    }
]

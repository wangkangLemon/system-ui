//  职业药师
const pathPre = '/yshi'

export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/views/yshi/Index.vue'))
        })
    },
    children: [
        // 商品管理
        {
            path: 'goods',
            name: 'yshi-goods',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/yshi/goods/Index.vue'))
                })
            },
            meta: {
                title: '商品管理',
                noback: true
            }
        },
        {
            path: 'goods/add',
            name: 'yshi-goods-add',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/yshi/goods/form.vue'))
                })
            },
            meta: {
                title: '添加售卖商品'
            }
        },
        {
            path: 'goods/edit',
            name: 'yshi-goods-edit',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/yshi/goods/form.vue'))
                })
            },
            meta: {
                title: '编辑售卖商品'
            }
        },
        // 组合售卖
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
                    resolve(require('@/views/yshi/group/form.vue'))
                })
            },
            meta: {
                title: '创建组合售卖'
            }
        },
        {
            path: 'group/edit',
            name: 'yshi-group-edit',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/yshi/group/form.vue'))
                })
            },
            meta: {
                title: '编辑组合售卖'
            }
        },
        // 活动管理
        {
            path: 'activity',
            name: 'yshi-activity',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/yshi/activity/Index.vue'))
                })
            },
            meta: {
                title: '活动管理',
                noback: true
            }
        },
        {
            path: 'activity/add',
            name: 'yshi-activity-add',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/yshi/activity/form.vue'))
                })
            },
            meta: {
                title: '创建活动'
            }
        },
        {
            path: 'activity/edit',
            name: 'yshi-activity-edit',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/yshi/activity/form.vue'))
                })
            },
            meta: {
                title: '编辑活动'
            }
        }
    ]
}

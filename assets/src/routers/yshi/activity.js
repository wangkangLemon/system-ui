export default [
    {
        path: 'activity',
        name: 'yshi-activity',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/activity/Index.vue'))
            })
        },
        meta: {
            title: '打包售卖',
            noback: true
        }
    },
    {
        path: 'activity/add',
        name: 'yshi-activity-add',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/activity/Form.vue'))
            })
        },
        meta: {
            title: '创建打包售卖'
        }
    },
    {
        path: 'activity/edit/:activity_id',
        name: 'yshi-activity-edit',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/activity/Form.vue'))
            })
        },
        meta: {
            title: '编辑打包售卖'
        }
    },
    {
        path: 'activity/preview/:activity_id',
        name: 'yshi-activity-preview',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/activity/Form.vue'))
            })
        },
        meta: {
            title: '查看打包售卖'
        }
    }
]

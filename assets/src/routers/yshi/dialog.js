export default [
    {
        path: 'dialog',
        name: 'yshi-dialog',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/dialogSetting/Index.vue'))
            })
        },
        meta: {
            title: '弹框设置',
            noback: true
        }
    },
    {
        path: 'dialog/add',
        name: 'yshi-dialog-add',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/dialogSetting/Form.vue'))
            })
        },
        meta: {
            title: '创建弹框'
        }
    },
    {
        path: 'dialog/edit/:dialog_id',
        name: 'yshi-dialog-edit',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/dialogSetting/Form.vue'))
            })
        },
        meta: {
            title: '编辑弹框'
        }
    },
    {
        path: 'dialog/preview/:dialog_id',
        name: 'yshi-dialog-preview',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/dialogSetting/Form.vue'))
            })
        },
        meta: {
            title: '查看弹框'
        }
    }
]

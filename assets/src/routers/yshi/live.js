export default [
    {
        path: 'live',
        name: 'yshi-live',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/live/Index.vue'))
            })
        },
        meta: {
            title: '直播课',
            noback: true
        }
    },
    {
        path: 'live/add',
        name: 'yshi-live-add',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/live/Form.vue'))
            })
        },
        meta: {
            title: '创建直播课'
        }
    },
    {
        path: 'live/edit/:live_id',
        name: 'yshi-live-edit',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/live/Form.vue'))
            })
        },
        meta: {
            title: '编辑直播课'
        }
    },
    {
        path: 'live/preview/:live_id',
        name: 'yshi-live-preview',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/live/Form.vue'))
            })
        },
        meta: {
            title: '查看直播课'
        }
    },
    {
        path: 'live/video/:live_id',
        name: 'yshi-live-video',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/yshi/live/LiveVideo.vue'))
            })
        },
        meta: {
            title: '直播课'
        }
    }
]

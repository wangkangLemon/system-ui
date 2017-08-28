const pathPre = '/newcourse'
// 新课程-课程路由
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../views/newcourse/Main.vue'))
        })
    },
    children: [
        {
            path: 'public',
            name: 'newcourse-course-public',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/newcourse/Public.vue'))
                })
            },
            meta: {
                title: '系列课程 - 公开课 - 课程管理',
                noback: true
            }
        },
        {
            path: 'add',
            name: 'newcourse-course-add',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/newcourse/Form.vue'))
                })
            },
            meta: {
                title: '添加课程 - 系列课程 - 公开课 - 课程管理',
                noback: true
            }
        },
        {
            path: 'edit/:course_id',
            name: 'newcourse-course-edit',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/newcourse/Form.vue'))
                })
            },
            meta: {
                title: '更新课程 - 系列课程 - 公开课 - 课程管理',
                noback: true
            }
        },
        {
            path: 'order',
            name: 'newcourse-course-order',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/newcourse/Order.vue'))
                })
            },
            meta: {
                title: '订单查询 - 系列课程 - 公开课 - 课程管理',
                noback: true
            }
        },
    ]
}

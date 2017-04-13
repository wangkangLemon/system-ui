/**
 * Created by huanghuixin on 2017/3/30.
 */
// 个人信息
const pathPre = '/user'
export default [
    {
        path: pathPre + '/safeset',
        name: 'user-safeset',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/user/SafeSet.vue'))
            })
        },
        meta: {
            title: '安全设置-我的',
        }
    },
    {
        path: pathPre + '/profile',
        name: 'user-profile',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/user/Profile.vue'))
            })
        },
        meta: {
            title: '个人信息',
        }
    },
]

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
            noback: true, //  不需要身份验证
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
            noback: true
        }
    },
    {
        path: pathPre + '/company',
        name: 'user-company',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/user/Company.vue'))
            })
        },
        meta: {
            title: '企业信息',
            noback: true
        }
    },
    {
        path: pathPre + '/password',
        name: 'user-password',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/user/Password.vue'))
            })
        },
        meta: {
            title: '修改密码',
            noback: true
        }
    },
]

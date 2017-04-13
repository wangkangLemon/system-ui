/**
 * Created by huanghuixin on 2017/3/30.
 */
// 晒单部分
const pathPre = '/user'
export default [
    {
        path: pathPre + '/safeset', // 内容维护
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
]

/**
 * Created by huanghuixin on 2017/3/30.
 */

const pathPre = '/activity'
// 用户体系-活动
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../views/usersystem/activity/Index.vue'))
        })
    },
    children: [
        {
            path: 'sign', // 签到
            name: 'usersys-activity-sign',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/usersystem/activity/Sign.vue'))
                })
            },
            meta: {
                title: '文档管理-用户体系',
                noback: true
            }
        },
    ]
}

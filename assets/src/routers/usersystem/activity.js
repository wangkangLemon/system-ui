/**
 * Created by huanghuixin on 2017/3/30.
 */

const pathPre = 'activity'
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
            name: 'sys-user-activity-sign',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/usersystem/activity/Sign.vue'))
                })
            },
            meta: {
                title: '活动管理-签到设置',
                noback: true
            }
        },
    ]
}

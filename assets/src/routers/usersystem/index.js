/**
 * Created by huanghuixin on 2017/3/30.
 */

const pathPre = '/sys/user'
import activity from './activity' // 活动
import integral from './integral' // 积分乐园
// 用户体系
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../views/usersystem/Index.vue'))
        })
    },
    children: [
        activity, // 活动
        integral, // 积分乐园
    ]
}

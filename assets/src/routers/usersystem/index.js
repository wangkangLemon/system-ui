/**
 * Created by huanghuixin on 2017/3/30.
 */

const pathPre = '/sys/user'
import activity from './activity' // 活动
import park from './park' // 积分乐园
import grow from './grow' // 成长值管理
import task from './task' // 任务中心
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
        park, // 积分乐园
        grow, // 成长值
        task  // 任务中心
    ]
}

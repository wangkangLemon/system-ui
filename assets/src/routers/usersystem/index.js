/**
 * Created by huanghuixin on 2017/3/30.
 */

const pathPre = '/usersystem'
import activity from './activity' // 活动
// 用户体系
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../views/usersystem/Index.vue'))
        })
    },
    children: [
        activity, // 活动
    ]
}

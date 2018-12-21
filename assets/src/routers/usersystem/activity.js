/**
 * Created by huanghuixin on 2017/3/30.
 */
import store from '../../store'
import action from '../../store/actions'
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
            name: 'activity-sign',
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
        {
            path: 'turntable', // 转盘设置
            name: 'activity-turntable',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/usersystem/activity/Turntable.vue'))
                })
            },
            meta: {
                title: '活动管理-转盘设置',
                noback: true
            }
        },
        {
            path: 'prize',  // 领取详情
            name: 'activity-prize',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/usersystem/activity/Prize.vue'))
                })
            },
            beforeEnter: (to, from, next) => {
                action.setIndexWebpath(store, {sub: to.query.product_name})
                next()
            },
            meta: {
                title: '领取详情',
            }
        }
    ]
}

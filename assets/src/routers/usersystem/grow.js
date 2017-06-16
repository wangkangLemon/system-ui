/**
 * Created by huanghuixin on 2017/3/30.
 */

const pathPre = 'grow'
// 用户体系-活动
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../views/usersystem/grow/Index.vue'))
        })
    },
    children: [
        {
            path: 'behavior', // 成长值方式设置
            name: 'usersys-grow-behavior',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/usersystem/grow/Behavior.vue'))
                })
            },
            meta: {
                title: '获取方式设置-用户体系',
                noback: true
            }
        },
        {
            path: 'grade',
            name: 'grow-grade',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/usersystem/grow/Grade.vue'))
                })
            },
            meta: {
                title: '等级特权设置-用户体系',
                noback: true
            }
        },
    ]
}

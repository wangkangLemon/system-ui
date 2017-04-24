/**
 * Created by huanghuixin on 2017/3/30.
 */
const pathPre = '/im'
const ystAssistantPre = 'ystAssistant'
// 培训管理
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../views/im/Index.vue'))
        })
    },
    children: [
        {
            path: ystAssistantPre + '/mass', // 群发
            name: 'im-ystAssistant-mass',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/im/ystAssistant/Mass.vue'))
                })
            },
            meta: {
                title: '群发功能-服务号管理',
                noback: true
            }
        },
        {
            path: ystAssistantPre + '/material', // 素材信息
            name: 'im-ystAssistant-material',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/im/ystAssistant/Material.vue'))
                })
            },
            meta: {
                title: '素材信息-服务号管理',
            }
        },
        {
            path: ystAssistantPre + '/materialmanage', // 素材信息
            name: 'im-ystAssistant-materialmanage',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/im/ystAssistant/MaterialManage.vue'))
                })
            },
            meta: {
                title: '素材管理-服务号管理',
                noback: true
            }
        },
        {
            path: ystAssistantPre + '/profile', // 素材信息
            name: 'im-ystAssistant-profile',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/im/ystAssistant/Profile.vue'))
                })
            },
            meta: {
                title: '资料设置-服务号管理',
                noback: true
            }
        },
    ]
}

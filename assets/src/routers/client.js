/**
 * Created by huanghuixin on 2017/3/30.
 */
const pathPre = '/client'
// 客户端部分
export default [
    {
        path: pathPre + '/recommend/contentManage', // 内容维护
        name: 'client-recommend-contentManage',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/client/recommend/ContentManage.vue'))
            })
        },
        meta: {
            title: '内容维护-推荐',
            noback: true
        }
    },
    {
        path: pathPre + '/recommend/blockManage', // 区块管理
        name: 'client-recommend-blockManage',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/client/recommend/BlockManage.vue'))
            })
        },
        meta: {
            title: '区块管理-推荐',
            noback: true
        }
    },
    {
        path: pathPre + '/recommend/classifyManage', // 分类管理
        name: 'client-recommend-classifyManage',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/client/recommend/ClassifyManage.vue'))
            })
        },
        meta: {
            title: '分类管理-推荐',
            noback: true
        }
    },
    {
        path: pathPre + '/bootad', // 启动广告
        name: 'client-bootad',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/client/BootAd.vue'))
            })
        },
        meta: {
            title: '启动广告-手机客户端',
            noback: true
        }
    },
    {
        path: pathPre + '/companylogo', // 企业logo
        name: 'client-companylogo',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/client/CompanyLogo.vue'))
            })
        },
        meta: {
            title: '企业LOGO-手机客户端',
            noback: true
        }
    },
    {
        path: pathPre + '/indexnav',
        name: 'client-indexnav',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/client/IndexNav.vue'))
            })
        },
        meta: {
            title: '首页导航管理-手机客户端',
            noback: true
        }
    },
    {
        path: pathPre + '/push',
        name: 'client-push',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/client/Push.vue'))
            })
        },
        meta: {
            title: '消息推送',
            noback: true
        }
    },
    {
        path: pathPre + '/push/create',
        name: 'client-push-create',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/client/CreatePush.vue'))
            })
        },
        meta: {
            title: '新建消息推送',
        }
    }
]

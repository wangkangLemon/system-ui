/**
 * Created by huanghuixin on 2017/3/30.
 */
const pathPre = '/client'
// 客户端部分
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../views/client/Index.vue'))
        })
    },
    children: [
        {
            path: 'recommend/content', // 内容维护
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
            path: 'recommend/block', // 区块管理
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
            path: 'recommend/classify', // 分类管理
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
            path: 'bootad', // 启动广告
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
            path: 'companylogo', // 企业logo
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
            path: 'indexnav',
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
            path: 'push',
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
            path: 'hotword',
            name: 'client-hotword',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/client/Hotword.vue'))
                })
            },
            meta: {
                title: '热词管理',
                noback: true
            }
        },
        {
            path: 'push/create',
            name: 'client-push-create',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/client/CreatePush.vue'))
                })
            },
            meta: {
                title: '新建消息推送',
            }
        },
        {
            path: 'navigation/index',
            name: 'client-navigation-index',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/client/navigation/Index.vue'))
                })
            },
            meta: {
                title: '首页导航',
                noback: true
            }
        },
        {
            path: 'navigation/company',
            name: 'client-navigation-company',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/client/navigation/Company.vue'))
                })
            },
            meta: {
                title: '企业导航',
                noback: true
            }
        },
        {
            path: 'navigation/discover',
            name: 'client-navigation-discover',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/client/navigation/Discover.vue'))
                })
            },
            meta: {
                title: '发现导航',
                noback: true
            }
        }
    ]
}

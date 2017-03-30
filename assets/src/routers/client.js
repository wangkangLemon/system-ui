/**
 * Created by huanghuixin on 2017/3/30.
 */
export default [
    {
        path: '/client/contentManage', // 内容维护
        name: 'contentManage',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/client/contentManage'))
            })
        },
        meta: {
            title: '内容维护-推荐',
        }
    },
    {
        path: '/client/blockManage', // 区块管理
        name: 'blockManage',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/client/BlockManage'))
            })
        },
        meta: {
            title: '区块管理-推荐',
        }
    },
    {
        path: '/client/classifyManage', // 分类管理
        name: 'classifyManage',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/client/ClassifyManage'))
            })
        },
        meta: {
            title: '分类管理-推荐',
        }
    },
    {
        path: '/client/bootad', // 启动广告
        name: 'client-bootad',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/client/BootAd.vue'))
            })
        },
        meta: {
            title: '启动广告-手机客户端',
        }
    },
    {
        path: '/client/companylogo', // 企业logo
        name: 'client-companylogo',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/client/CompanyLogo.vue'))
            })
        },
        meta: {
            title: '企业LOGO-手机客户端',
        }
    },
    {
        path: '/client/indexnav', // 企业logo
        name: 'client-indexnav',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/client/IndexNav.vue'))
            })
        },
        meta: {
            title: '企业导航-手机客户端',
        }
    }
]

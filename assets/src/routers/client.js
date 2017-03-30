/**
 * Created by huanghuixin on 2017/3/30.
 */
const pathPre = '/client'
// 客户端部分
export default [
    {
        path: pathPre + '/contentManage', // 内容维护
        name: 'client-contentManage',
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
        path: pathPre + '/blockManage', // 区块管理
        name: 'client-blockManage',
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
        path: pathPre + '/classifyManage', // 分类管理
        name: 'client-classifyManage',
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
        path: pathPre + '/bootad', // 启动广告
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
        path: pathPre + '/companylogo', // 企业logo
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
        path: pathPre + '/indexnav', // 企业logo
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

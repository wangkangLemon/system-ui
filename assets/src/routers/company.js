/**
 * Created by huangrui on 2017/4/5.
 */
const pathPre = '/company'

export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../views/company/Index.vue'))
        })
    },
    children: [
        {
            path: 'index',
            name: 'company-index',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/company/Company.vue'))
                })
            },
            meta: {
                title: '企业',
            }
        },
        {
            path: 'admin/:company_id',
            name: 'company-admin',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/company/Admin.vue'))
                })
            },
            meta: {
                title: '管理员',
            }
        },
    ]
}

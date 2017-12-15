// 企业权限管理
const pathPre = 'rbac/:category'

export default {

    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../views/company/rbac/Index.vue'))
        })
    },
    children: [
        // 角色管理
        {
            path: 'role',
            name: 'company-rbac-role',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/company/rbac/role/Role.vue'))
                })
            },
            meta: {
                title: '角色管理-RBAC',
                noback: true
            }
        },
        // 权限管理
        {
            path: 'permission',
            name: 'company-rbac-permission',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/company/rbac/permission/Permission.vue'))
                })
            },
            meta: {
                title: '权限管理-RBAC',
                noback: true
            }
        },
        // 菜单管理
        {
            path: 'menu',
            name: 'company-rbac-menu',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/company/rbac/menu/Menu.vue'))
                })
            },
            meta: {
                title: '菜单管理-RBAC',
                noback: true
            }
        },
        // 操作管理
        {
            path: 'operation',
            name: 'company-rbac-operation',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/company/rbac/operation/Operation.vue'))
                })
            },
            meta: {
                title: 'API管理-RBAC',
                noback: true
            }
        }
    ]
}

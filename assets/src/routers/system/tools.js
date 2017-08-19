const pathPre = '/sys/tools'
// 系统，工具
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../views/system/tools/Main.vue'))
        })
    },
    children: [
        // 批量设置用户密码
        {
            path: 'batchsetpasswd',
            name: 'sys-tools-batchsetpasswd',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/system/tools/BatchSetPasswd.vue'))
                })
            },
            meta: {
                title: '批量设置密码 - 工具 - 系统',
                noback: true
            }
        },
        // 设置签约统计信息
        {
            path: 'signanalytics',
            name: 'sys-tools-signanalytics',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/system/tools/SignAnalytics.vue'))
                })
            },
            meta: {
                title: '设置签约统计 - 工具 - 系统',
                noback: true
            }
        },
    ]
}

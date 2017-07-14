// 积分统计

const pathPre = 'data'

export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../views/usersystem/data/Index.vue'))
        })
    },
    children: [
        {
            path: 'stat',
            name: 'usersys-data-stat',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/usersystem/data/Stat.vue'))
                })
            },
            meta: {
                title: '数据统计-积分统计',
                noback: true
            }

        }
    ]
}

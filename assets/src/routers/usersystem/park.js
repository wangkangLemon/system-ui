/**
 * Created by huanghuixin on 2017/3/30.
 */

const pathPre = 'park'
const namePre = `usersys-${pathPre}-`
// 用户体系-积分乐园
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../views/usersystem/park/Index.vue'))
        })
    },
    children: [
        {
            path: 'selling', // 出售中
            name: `${namePre}selling`,
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/usersystem/park/Selling.vue'))
                })
            },
            meta: {
                title: '出售中-用户体系',
                noback: true
            }
        },
    ]
}

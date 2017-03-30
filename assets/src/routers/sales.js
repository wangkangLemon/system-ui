/**
 * Created by huanghuixin on 2017/3/30.
 */
// 晒单部分
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
]
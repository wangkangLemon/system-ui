/**
 * User: zhangxiuxiu
 * Date: 2017/11/23
 * Time: 上午12:00
 */

const pathPre = '/comment/list'
export default {
    path: pathPre,
    name: 'test-comment-index',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../views/comment/Index.vue'))
        })
    },
    meta: {
        title: '评论管理',
        noback: true
    }
}

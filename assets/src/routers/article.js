/**
 * Created by huangrui on 2017/4/1.
 */
const pathPre = '/article'

// 文章管理部分
export default [
    {
        path: pathPre + '/category',
        name: 'article-category',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/article/Category.vue'))
            })
        },
        meta: {
            title: '分类管理',
        }
    },
    {
        path: pathPre + '/content',
        name: 'article-content',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/article/Content.vue'))
            })
        },
        meta: {
            title: '内容管理',
        }
    }
]

/**
 * Created by huangrui on 2017/4/1.
 */
const pathPre = '/article'

// 文章管理部分
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../views/article/Index.vue'))
        })
    },
    children: [
        {
            path: 'category',
            name: 'article-category',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/article/Category.vue'))
                })
            },
            meta: {
                title: '分类管理',
                noback: true
            }
        },
        {
            path: 'content',
            name: 'article-content',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/article/Content.vue'))
                })
            },
            meta: {
                title: '内容管理',
                noback: true
            }
        },
        {
            path: 'content/show/:id',
            name: 'article-content-show',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/article/ContentShow.vue'))
                })
            },
            meta: {
                title: '内容管理-详情',
            }
        },
        {
            path: 'content/:id',
            name: 'article-content-edit',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/article/ContentOperate.vue'))
                })
            },
            meta: {
                title: '内容管理-编辑',
            }
        },
        {
            path: 'content/add',
            name: 'article-content-add',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/article/ContentOperate.vue'))
                })
            },
            meta: {
                title: '内容管理-添加',
            }
        }
    ]
}

/**
 * Created by gaohj on 2017/3/30.
 */
const pathPre = '/speaking'
// 客户端部分
export default {
    path: pathPre, // 内容管理
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../views/speaking/Index.vue'))
        })
    },
    children: [
        {
            path: 'content', // 内容管理
            name: 'speaking-content-index',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/speaking/content/Index.vue'))
                })
            },
            meta: {
                title: '内容管理-药我说',
                noback: true,
            }
        },
        {
            path: 'content/add', // 药我说添加或编辑
            name: 'speaking-content-add',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/speaking/content/Add.vue'))
                })
            },
            meta: {
                title: '添加药我说-药我说',
            }
        },
        {
            path: 'record', // 录音记录
            name: 'speaking-record-index',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/speaking/record/Index.vue'))
                })
            },
            meta: {
                title: '录音记录-药我说',
                noback: true,
            }
        }
    ]
}

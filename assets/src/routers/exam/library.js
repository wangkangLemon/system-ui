/**
 * User: Pavle Lee <523260513@qq.com>
 * Date: 2017/10/31
 * Time: 下午2:45
 */

 const pathPre = '/exam/library'
 // 题库管理
 export default {
     path: pathPre,
     component: resolve => {
         require.ensure([], () => {
             resolve(require('../../views/exam/Layout.vue'))
         })
     },
     children: [
         {
             path: 'index',
             name: 'test-library-index',
             component: resolve => {
                 require.ensure([], () => {
                     resolve(require('../../views/exam/library/Index.vue'))
                 })
             },
             meta: {
                 title: '题库管理',
                 noback: true
             }
         },
     ]
 }

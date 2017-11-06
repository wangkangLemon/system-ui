/**
 * User: Pavle Lee <523260513@qq.com>
 * Date: 2017/10/31
 * Time: 下午2:45
 */

 const pathPre = '/exam/question'
 // 试题管理
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
             name: 'test-question-index',
             component: resolve => {
                 require.ensure([], () => {
                     resolve(require('../../views/exam/question/Index.vue'))
                 })
             },
             meta: {
                 title: '试题管理',
             }
         },
     ]
 }

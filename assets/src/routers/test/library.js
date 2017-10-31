/**
 * User: Pavle Lee <523260513@qq.com>
 * Date: 2017/10/31
 * Time: 下午2:45
 */

 const pathPre = '/test/library'
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
             name: 'test-index',
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
         {
             path: 'view/:id',
             name: 'test-view',
             component: resolve => {
                 require.ensure([], () => {
                     resolve(require('../../views/exam/library/View.vue'))
                 })
             },
             meta: {
                 title: '题库管理-详情',
             }
         },
         {
             path: 'add',
             name: 'test-add',
             component: resolve => {
                 require.ensure([], () => {
                     resolve(require('../../views/exam/library/Add.vue'))
                 })
             },
             meta: {
                 title: '题库管理-添加',
             }
         },
         {
             path: 'edit',
             name: 'test-edit',
             component: resolve => {
                 require.ensure([], () => {
                     resolve(require('../../views/exam/library/Edit.vue'))
                 })
             },
             meta: {
                 title: '题库管理-编辑',
             }
         }
     ]
 }

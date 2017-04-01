/**
 * Created by huanghuixin on 2017/3/30.
 */
const pathPre = '/course'
// 培训管理
export default [
    {
        path: pathPre + '/recommend/contentManage', // 内容维护
        name: 'course-recommend-contentManage',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/course/Analysis.vue'))
            })
        },
        meta: {
            title: '课程分析-培训',
        }
    }
]

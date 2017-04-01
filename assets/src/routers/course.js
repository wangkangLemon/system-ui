/**
 * Created by huanghuixin on 2017/3/30.
 */
const pathPre = '/course'
// 培训管理
export default [
    {
        path: pathPre + '/analysis', // 课程分析
        name: 'course-analysis',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/course/Analysis.vue'))
            })
        },
        meta: {
            title: '课程分析-培训',
        }
    },
    {
        path: pathPre + '/history', // 考试记录
        name: 'course-history',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/course/History.vue'))
            })
        },
        meta: {
            title: '考试记录-培训',
        }
    }
]

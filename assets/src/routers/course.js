/**
 * Created by huanghuixin on 2017/3/30.
 */
const pathPre = '/course'
// 培训管理
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../views/course/Index.vue'))
        })
    },
    children: [
        {
            path: 'analysis', // 课程分析
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
            path: 'history', // 考试记录
            name: 'course-history',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/course/History.vue'))
                })
            },
            meta: {
                title: '考试记录-培训',
            }
        },
        {
            path: 'manage/public', // 公开课管理
            name: 'course-manage-public',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/course/manage/Public.vue'))
                })
            },
            meta: {
                title: '公开课管理-培训',
            }
        },
        {
            path: 'manage/add-course', // 添加课程
            name: 'course-manage-addCourse',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/course/manage/AddCourse.vue'))
                })
            },
            meta: {
                title: '添加课程-培训',
            }
        },
        {
            path: 'manage/course-category-manage', // 栏目管理
            name: 'course-manage-course-category-manage',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/course/manage/CategoryManage.vue'))
                })
            },
            meta: {
                title: '栏目管理-培训',
            }
        },
        {
            path: 'manage/course-album-manage', // 栏目管理
            name: 'course-manage-course-album-manage',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/course/manage/AlbumManage.vue'))
                })
            },
            meta: {
                title: '专辑管理-培训',
            }
        },
        {
            path: 'manage/industry', // 工业课
            name: 'course-manage-industry',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/course/manage/Industry.vue'))
                })
            },
            meta: {
                title: '工业课管理-培训',
            }
        }]
}

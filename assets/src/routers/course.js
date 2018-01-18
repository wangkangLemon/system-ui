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
                noback: true
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
                noback: true
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
                title: '公开课 - 课程管理',
                noback: true
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
            path: 'manage/course-answer-analysis/:id', // 答案分析
            name: 'course-manage-course-answer-analysis',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/course/manage/AnswerAnalysis.vue'))
                })
            },
            meta: {
                title: '课程题目分析',
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
                title: '企业课管理-培训',
                noback: true
            }
        },
        {
            path: 'manage/video', // 视频管理
            name: 'course-manage-video',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/course/manage/Video.vue'))
                })
            },
            meta: {
                title: '视频管理-培训',
                noback: true
            }
        },
        {
            path: 'manage/video/add', // 视频添加
            name: 'course-manage-video-add',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/course/manage/VideoAdd.vue'))
                })
            },
            meta: {
                title: '视频添加-培训',
            }
        },
        {
            path: 'manage/doc', // 文档管理
            name: 'course-manage-doc',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/course/manage/Doc.vue'))
                })
            },
            meta: {
                title: '文档管理-培训',
                noback: true
            }
        },
    ]
}

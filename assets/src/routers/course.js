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
        {
            path: 'teaching',
            name: 'course-teaching',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/course/teaching/Main.vue'))
                })
            },
            meta: {
                title: '带教模版管理',
                noback: true
            }
        },
        {
            path: 'teaching/add',
            name: 'course-teaching-add',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/course/teaching/Add.vue'))
                })
            },
            meta: {
                title: '创建带教模版',
            }
        },
        {
            path: 'teaching/edit',
            name: 'course-teaching-edit',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/course/teaching/Add.vue'))
                })
            },
            meta: {
                title: '修改带教模版'
            }
        },
        {
            path: 'teaching/view',
            name: 'course-teaching-view',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/course/teaching/Add.vue'))
                })
            },
            meta: {
                title: '查看带教模版'
            }
        },
        {
            path: 'learnmap',
            name: 'course-learnmap',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/course/learnmap/Main.vue'))
                })
            },
            meta: {
                title: '学习地图模版管理',
                noback: true
            }
        },
        {
            path: 'learnmap/add',
            name: 'course-learnmap-add',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/course/learnmap/Add.vue'))
                })
            },
            meta: {
                title: '创建学习地图模版',
            }
        },
        {
            path: 'learnmap/edit',
            name: 'course-learnmap-edit',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/course/learnmap/Add.vue'))
                })
            },
            meta: {
                title: '编辑学习地图模版',
            }
        },
        {
            path: 'learnmap/view',
            name: 'course-learnmap-view',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/course/learnmap/Add.vue'))
                })
            },
            meta: {
                title: '查看学习地图模版',
            }
        },
        {
            path: 'manage/richtexts',
            name: 'course-manage-richtexts',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/course/manage/richtexts/Main.vue'))
                })
            },
            meta: {
                title: '图文管理-培训',
                noback: true
            }
        },
        {
            path: 'manage/richtexts/add',
            name: 'course-manage-richtexts-add',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/course/manage/richtexts/Add.vue'))
                })
            },
            meta: {
                title: '图文管理-添加'
            }
        },
        {
            path: 'manage/richtexts/edit',
            name: 'course-manage-richtexts-edit',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/course/manage/richtexts/Add.vue'))
                })
            },
            meta: {
                title: '图文管理-编辑'
            }
        },
        {
            path: 'manage/richtexts/view',
            name: 'course-manage-richtexts-view',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/course/manage/richtexts/Show.vue'))
                })
            },
            meta: {
                title: '图文管理-查看'
            }
        },
        {
            path: 'drug',
            name: 'course-drug',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/course/drug/Index.vue'))
                })
            },
            children: [
                {
                    path: '',
                    name: 'course-drug-main',
                    component: resolve => {
                        require.ensure([], () => {
                            resolve(require('@/views/course/drug/Main.vue'))
                        })
                    },
                    meta: {
                        title: '药品库',
                        noback: true
                    }
                },
                {
                    path: 'add',
                    name: 'course-drug-add',
                    component: resolve => {
                        require.ensure([], () => {
                            resolve(require('@/views/course/drug/add.vue'))
                        })
                    },
                    meta: {
                        title: '新增药品'
                    }
                },
                {
                    path: 'view',
                    name: 'course-drug-view',
                    component: resolve => {
                        require.ensure([], () => {
                            resolve(require('@/views/course/drug/add.vue'))
                        })
                    },
                    meta: {
                        title: '查看药品'
                    }
                },
                {
                    path: 'edit',
                    name: 'course-drug-edit',
                    component: resolve => {
                        require.ensure([], () => {
                            resolve(require('@/views/course/drug/add.vue'))
                        })
                    },
                    meta: {
                        title: '编辑药品'
                    }
                }
            ]
        },

    ]
}

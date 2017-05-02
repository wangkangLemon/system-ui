/**
 * Created by huangrui on 2017/4/1.
 */
// 数据分析路由
const pathPre = '/analysis'
export default [
    // 导出
    {
        path: pathPre + '/export',
        name: 'dataAnalysis-export',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/dataAnalysis/Export.vue'))
            })
        },
        meta: {
            title: '导出',
            noback: true
        }
    },
    // 企业签约信息
    {
        path: pathPre + '/sign',
        name: 'dataAnalysis-sign',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/dataAnalysis/ContractMessage.vue'))
            })
        },
        meta: {
            title: '企业签约信息',
            noback: true
        }
    }
]

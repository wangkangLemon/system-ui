// 分类管理
const pathPre = 'finance/manager/universal'
export default {
    path: pathPre,
    name: 'test-universal-index',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../views/financeManage/priceManage/universal.vue'))
        })
    },
    meta: {
        title: '通用价格模板管理',
        noback: true
    }
}

/**
 * Created by huangrui on 2017/3/30.
 */
// 财务管理
const pathPre = '/financemanage'
export default [
    {
        path: pathPre + '/finance/amount',
        name: 'financeManage-finance-amount',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/financeManage/finance/Amount.vue'))
            })
        },
        meta: {
            title: '财务总览-财务',
            noback: true
        }
    },
    {
        path: pathPre + '/finance/history',
        name: 'financeManage-finance-history',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/financeManage/finance/History.vue'))
            })
        },
        meta: {
            title: '流水记录-财务',
            noback: true
        }
    },
    {
        path: pathPre + '/finance/charge',
        name: 'financeManage-finance-charge',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/financeManage/finance/Charge.vue'))
            })
        },
        meta: {
            title: '充值管理-财务',
            noback: true
        }
    },
    {
        path: pathPre + '/finance/price',
        name: 'financeManage-finance-price',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/financeManage/finance/Price.vue'))
            })
        },
        meta: {
            title: '价格调整-财务',
            noback: true
        }
    },
    {
        path: pathPre + '/money/amount',
        name: 'financeManage-money-amount',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/financeManage/money/Amount.vue'))
            })
        },
        meta: {
            title: '红包总览-红包',
            noback: true
        }
    },
    {
        path: pathPre + '/money/draw',
        name: 'financeManage-money-draw',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/financeManage/money/Draw.vue'))
            })
        },
        meta: {
            title: '提现管理-红包',
            noback: true
        }
    },
    {
        path: pathPre + '/money/income',
        name: 'financeManage-money-income',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/financeManage/money/Income.vue'))
            })
        },
        meta: {
            title: '流水记录-红包',
            noback: true
        }
    },
    {
        path: pathPre + '/money/charge',
        name: 'financeManage-money-charge',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/financeManage/money/Charge.vue'))
            })
        },
        meta: {
            title: '充值管理-红包',
            noback: true
        }
    },
]

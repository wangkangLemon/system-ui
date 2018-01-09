/**
 * Created by huangrui on 2017/3/30.
 */
// 财务管理
const pathPre = '/financemanage'
import store from '../store'
import action from '../store/actions'
import special from './pricemanage/special'
import universal from './pricemanage/universal'
import luckymoney from './luckymoney'
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../views/financeManage/Index.vue'))
        })
    },
    children: [
        {
            path: 'finance/amount',
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
            path: 'finance/history',
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
            path: 'finance/charge',
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
            path: 'finance/price',
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
            path: 'money/amount',
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
            path: 'money/draw',
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
            path: 'money/draw_details',
            name: 'financeManage-money-details',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/financeManage/money/DrawDetails.vue'))
                })
            },
            beforeEnter: (to, from, next) => {
                action.setIndexWebpath(store, {sub: to.query.user_name})
                next()
            },
            meta: {
                title: '充值管理',
            }
        },
        {
            path: 'money/income/course',
            name: 'financeManage-money-income-course',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/financeManage/money/CourseIncome.vue'))
                })
            },
            meta: {
                title: '流水记录-课程红包',
                noback: true
            }
        },
        {
            path: 'money/income/speaking',
            name: 'financeManage-money-income-speaking',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/financeManage/money/SpeakingIncome.vue'))
                })
            },
            meta: {
                title: '流水记录-药我说红包',
                noback: true
            }
        },
        {
            path: 'money/charge',
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
        special,
        universal,
        luckymoney
    ]
}

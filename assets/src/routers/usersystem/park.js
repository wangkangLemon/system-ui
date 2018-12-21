/**
 * Created by huanghuixin on 2017/3/30.
 */

const pathPre = 'park'
const namePre = `usersys-${pathPre}-`
// 用户体系-积分乐园
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../views/usersystem/park/Index.vue'))
        })
    },
    children: [
        {
            path: 'product', // 商品管理
            name: `${namePre}product`,
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/usersystem/park/Product.vue'))
                })
            },
            meta: {
                title: '商品管理-用户体系',
                noback: true
            }
        },
        {
            path: 'publishprod', // 销售总量
            name: `${namePre}publishprod`,
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/usersystem/park/PublishProd.vue'))
                })
            },
            meta: {
                title: '发布商品-用户体系',
            }
        },
        {
            path: 'selling-count', // 销售总量
            name: `${namePre}sellingcount`,
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/usersystem/park/SellingCount.vue'))
                })
            },
            meta: {
                title: '销量查看-用户体系',
            }
        },
        {
            path: 'stock', // 销售总量
            name: `${namePre}stock`,
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/usersystem/park/Stock.vue'))
                })
            },
            meta: {
                title: '库存管理-用户体系',
            }
        },
        {
            path: 'order', // 销售总量
            name: `${namePre}order`,
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/usersystem/park/Order.vue'))
                })
            },
            meta: {
                title: '订单管理-用户体系',
                noback: true
            }
        },
    ]
}

//  职业药师
const pathPre = '/yshi'
import goods from './goods'
import group from './group'
import activity from './activity'
import dialog from './dialog'
import coupon from './coupon'
import live from './live'


export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/views/yshi/Index.vue'))
        })
    },
    children: [
        // 商品管理
        ...goods,
        // 组合售卖
        ...group,
        // 活动管理
        ...activity,
        // 弹框管理
        ...dialog,
        // 优惠券设置
        ...coupon,
        // 直播
        ...live

    ]
}

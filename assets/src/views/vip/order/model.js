export default class Order {
}

Order.statusList = [
    {
        label: '已支付',
        value: 1,
        tag: 'success',
    },
    {
        label: '未支付',
        value: 0,
        tag: 'danger',

    },
    {
        label: '已关闭',
        value: 2,
        tag: 'warning',
    },
    {
        label: '已删除',
        value: 4,
        tag: 'info',
    }
]

Order.payMethodList = [
    {
        label: '微信支付',
        value: 'wechat',
        tag: 'success',
    },
    {
        label: '支付宝支付',
        value: 'alipay',
        tag: 'primary',
    },
    {
        label: '药丸支付',
        value: 'money',
        tag: 'info',
    }
]

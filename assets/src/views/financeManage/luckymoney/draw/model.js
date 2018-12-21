export default class Draw {}

Draw.withdrawTypeList = [
    {
        label: '银联',
        value: 'bank',
        tag: 'primary'
    },
    {
        label: '微信',
        value: 'wechat',
        tag: 'success'
    },
]
Draw.statusList = [
    {
        label: '提现成功',
        value: 'complete',
        tag: 'success'
    },
    {
        label: '提现失败',
        value: 'close',
        tag: 'danger'
    },
    {
        label: '等待提现',
        value: 'pending',
        tag: 'warning'
    },
]

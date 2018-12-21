<!--月历-->
<style lang='scss' rel="stylesheet/scss">
    @import "../../../utils/mixins/mixins";

    .monthcalendor-container {
        border-right: 1px solid #ededed;
        border-left: 1px solid #ededed;
        width: 100%;
        background: #fff;
        border-bottom: 1px solid #ededed;
        @extend %clear-inlineblock-marginRight;
        a {
            position: relative;
            display: inline-block;
            width: 14.28%;
            height: 50px;
            padding: 10px 0 0 10px;
            font-size: 15px;
            border-right: 1px solid #ededed;
            border-top: 1px solid #ededed;
            vertical-align: top;
            color: #888;
            &.active {
                background: #eee !important;

                > i {
                    /*background: #fff;*/
                }
            }

            &.today {
                background: #eee;
            }

            &:nth-of-type(7n) {
                border-right: none;
            }
            > i {
                font-size: 15px;
                display: block;
            }
            .operate {
                position: absolute;
                width: 80px;
                right: 0;
                bottom: 5px;
                text-align: center;
                &.gift {
                    top: 2px;
                }
                > * {
                    display: inline-block;
                    vertical-align: top;
                }
                > i {
                    font-size: 12px;
                }
                > input {
                    width: 30%;
                    text-align: center;
                    color: #20a0ff;
                    &.noEdit {
                        border: none;
                        background: none;
                    }
                }
            }
        }
        .title {
            vertical-align: top;
            background: #f8f8f8;
            a {
                border: none;
                color: #bbb;
            }
        }
    }
</style>

<template>
    <article class="monthcalendor-container">
        <a class="day" v-for="item in dateArr">
            {{item && item.day}}
            <div class="gift operate" v-if="item && item.day && item.isMonthEnd">
                <!--礼包-->
            </div>
            <div class="operate" v-if="item && item.day">
                <i>积分</i>
                <!--当天以前的不可编辑-->
                <input :class="{'noEdit': !calendarEdit}" :disabled="item.disabled || !calendarEdit" type="text"  :value="item.value" />
            </div>
        </a>
    </article>
</template>

<script>
    export default{
        // date:当前的日期  listChecked:设置积分列表
        props: ['date', 'listChecked', 'isEdit'],
        data () {
            return {
                disable: true,
                dateArr: [],
                isRending: false, // 是否正在渲染
                firstLoad: true, // 是否第一次加载
            }
        },
        computed: {
            calendarEdit () {
                return this.isEdit
            }
        },
        watch: {
            // 监听变化 更改日历显示
            date (newDate) {
                this.$emit('changeEditStatus', false)
                this.initData(newDate)
            },
            listChecked (val) {
                this.initData(this.date, true)
            },
        },
        mounted () {
            if (this.date) {
                this.initData(this.date)
            }
        },
        methods: {
            initData (date, force = false) {
                this.isRending = true

                let year = date.getFullYear()
                let month = date.getMonth()
                // 存储日历数据的数组
                let calenderArr = []
                // 获取本月的第一天是星期几 周日 0 周一 1...
                let firstDay = new Date(year, month, 1).getDay() // 参数的月份是从0开始
                // 获取本月一共多少天
                let curMonthdays = new Date(year, month + 1, 0).getDate() // 参数的月份从1开始
                let n = 0
                // 行
                for (let i = 0; i < 6; i++) {
                    // 列
                    for (let j = 0; j < 7; j++) {
                        if (j === firstDay || n > 0) {
                            n++
                        }
                        if (!n && j < firstDay) {
                            calenderArr.push(null)
                        } else if (n && n <= curMonthdays) {
                            let disabled = new Date(year, month, n).getTime() < Date.now()
                            let isMonthEnd = (curMonthdays == n)
                            let value = this.listChecked[n - 1] == undefined ? 5 : this.listChecked[n - 1]
                            calenderArr.push({year: year, month: month, day: n, isMonthEnd, value, disabled})
                        } else if (n && n >= curMonthdays) {
                            calenderArr.push(null)
                        }
                    }
                    if (n >= curMonthdays) {
                        break
                    }
                }
                // 每一行的数据为一组
                let newCalenderData = []
                let trData = []
                calenderArr.forEach((item, index) => {
                    trData.push(item)
                    if ((index + 1) % 7 == 0) {
                        newCalenderData.push(trData)
                        trData = []
                    }
                })

                this.firstLoad = false
                this.dateArr = calenderArr
                this.isRending = false
            }
        }
    }
</script>

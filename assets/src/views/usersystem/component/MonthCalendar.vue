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
    <article class="monthcalendor-container" ref="calendar">
        <a class="day" v-for="item in dateArr" @click="dayClick($event, item.day, item)">
            {{item && item.day}}
            <div class="gift operate" v-if="item && item.day && item.isMonthEnd">
                礼包
            </div>
            <div class="operate" v-if="item && item.day">
                <i>积分</i>
                <!--小与当前月不可编辑-->
                <!--大于当前月并且isEdit=false不可编辑-->
                <input :class="{'noEdit':(date.getMonth() < new Date().getMonth() && date < new Date())
                                   || ((date.getMonth() == new Date().getMonth()
                                   || date > new Date()) && calendarEdit == false)}"
                       :disabled="(date.getMonth() < new Date().getMonth() && date < new Date())
                                   || ((date.getMonth() == new Date().getMonth()
                                   || date > new Date()) && calendarEdit == false)" type="text" :value="item.value" />
            </div>
        </a>
    </article>
</template>

<script>
//    import {date2Str} from 'base/vue/utls/timeUtls'

//    let date2StrMonth = function (date) {
//        date2Str(date, '-', {hasMonth: false})
//    }
    let todayDate,
        rendedDate // 已经渲染过的日期
    export default{
        // date:当前的日期  listChecked:被选中的日期(蓝色小点) calendarClick:点击回调
        props: ['date', 'listChecked', 'calendarClick', 'isEdit'],
        data () {
            return {
                disable: true,
                dateArr: [],
                isRending: false, // 是否正在渲染
                currSelectedDay: -1, // 选中的日期
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
                console.log(val)
                this.initData(this.date, true)
            },
        },
        mounted () {
            todayDate = new Date()
            if (this.date) {
                this.initData(this.date)
            }
        },
        methods: {
            // 每一个日期被点击后触发
            dayClick (e, day) {
                // 设置选中日期
//                this.$set(this, 'currSelectedDay', day)
                this.calendarClick && this.calendarClick(day)
            },
            initData (date, force = false) {
                // 同一个月不在渲染第二次
//                if (!force && (this.isRending && !date || date2StrMonth(rendedDate) == date2StrMonth(date))) {
//                    return
//                }

                // 如果不在同一天
                if (rendedDate != date) {
                    this.currSelectedDay = -1
                }

                rendedDate = date

                this.isRending = true

                let year = date.getFullYear()
                let month = date.getMonth()
                let checkedDate = date.getDate()
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
                            let isMonthEnd = (curMonthdays == n)
                            let value = this.listChecked[n - 1] == undefined ? 5 : this.listChecked[n - 1]
                            if (this.firstLoad && n == checkedDate && month == todayDate.getMonth() && year == todayDate.getFullYear()) {
                                this.currSelectedDay = n
                            }

                            calenderArr.push({year: year, month: month, day: n, isMonthEnd, value})
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

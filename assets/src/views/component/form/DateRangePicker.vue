<!--使用示例-->
<!--<DateRange title="晒单时间" :start="fetchParam.time_start" :end="fetchParam.time_end"-->
<!--v-on:changeStart="val=> fetchParam.time_start=val "-->
<!--v-on:changeEnd="val=> fetchParam.time_end=val "-->
<!--:change="fetchData">-->
<template>
    <section>
        <i>{{title}}</i>
        <el-date-picker @change="setCurrVal(0)"
                        v-model="timespan[0]"
                        align="right"
                        type="date"
                        :picker-options="pickerOptionsStart"
                        placeholder="开始日期">
        </el-date-picker>
        <el-date-picker
                @change="setCurrVal(1)"
                v-model="timespan[1]"
                align="right"
                type="date"
                :picker-options="pickerOptionsEnd"
                placeholder="结束日期">
        </el-date-picker>
    </section>
</template>

<script>
    import * as timeUtls from '../../../utils/timeUtils'
    let _this
    export default{
        props: {
            title: String,
            start: {}, // 开始时间
            end: {}, // 结束时间
            change: Function
        },
        watch: {
            'start'(val) {
                this.setCurrVal(0, val)
            },
            'end'(val) {
                this.setCurrVal(1, val)
            }
        },
        data () {
            return {
                timespan: [this.start, this.end],
                pickerOptionsStart: {
                    disabledDate(time) {
                        return !_this.timespan[1] ? null
                            : time.getTime() > new Date(_this.timespan[1]).getTime()
                    }
                },
                pickerOptionsEnd: {
                    disabledDate(time) {
                        return !_this.timespan[0] ? null
                            : time.getTime() < new Date(_this.timespan[0]).getTime()
                    }
                },
            }
        },
        beforeCreate () {
            _this = this
        },
        methods: {
            setCurrVal (type, val) {
                if (this.timespan[type] === val && this.timespan[type] != undefined) return

                val = (val || this.timespan[type]) ? timeUtls.date2Str(new Date(val || this.timespan[type])) : ''

                const emitArr = ['changeStart', 'changeEnd']

                this.timespan[type] = val
                this.$emit(emitArr[type], val)
                this.change && this.change()
            }
        }
    }
</script>

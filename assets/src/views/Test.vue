<style lang='scss' rel='stylesheet/scss'>
    #testview-container {

    }

</style>

<template>
    <div id="testview-container">
        <DateRange title="晒单时间" :start="fetchParam.time_start" :end="fetchParam.time_end"
                   v-on:changeStart="val=> fetchParam.time_start=val "
                   v-on:changeEnd="val=> fetchParam.time_end=val "
                   :change="fetchData">
        </DateRange>
        <button @click="removedate">干掉日期</button>
    </div>
</template>

<script>
    import DateRange from './component/form/DateRangePicker.vue'
    export default {
        data() {
            return {
                courseList: [],
                selected: void 0,
                fetchParam: {
                    time_start: void 0,
                    time_end: void 0,
                }
            }
        },
        created () {
        },
        mounted () {
        },
        methods: {
            fetchData () {
                console.info(this.fetchParam)
            },
            removedate () {
                this.fetchParam.time_start = void 0
                this.fetchParam.time_end = void 0
//                this.fetchParam.time_end = void 0
            }
        },
        components: {DateRange}
    }
</script>

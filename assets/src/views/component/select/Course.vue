<template>
    <SelectScroll :changeCb="handleChange" :requestCb="fetchData">
    </SelectScroll>
</template>

<script>
    import courseService from '../../../services/courseService'
    import SelectScroll from '../../component/form/SelectScroll.vue'
    export default{
        props: ['value', 'change'],
        components: {
            SelectScroll
        },
        data () {
            return {
                currVal: this.value,
                pageSize: 10
            }
        },
        watch: {
            'value'(val, oldValue) {
                this.setCurrentValue(val)
            }
        },
        methods: {
            handleChange(val) {
                this.setCurrentValue(val)
                this.change && this.change()
            },
            setCurrentValue (val) {
                if (this.curVal == val) return
                this.currVal = val
                this.$emit('change', val)
                this.$emit('input', val)
            },
            fetchData (val, length) {
                let keyword = val
                let page = parseInt(length / this.pageSize) + 1
                return courseService.courseList(keyword, page, this.pageSize)
            }
        }
    }
</script>

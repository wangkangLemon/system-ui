<template>
    <SelectScroll :changeCb="handleChange" :requestCb="fetchData" :placeholder="placeholder"
                  v-model="currVal" :disabled="disabled">
    </SelectScroll>
</template>

<script>
    import courseService from '../../../services/courseService'
    import SelectScroll from '../../component/form/SelectScroll.vue'
    export default{
        props: {
            value: [String, Number],
            change: Function,
            placeholder: String,
            list: Array,
            disabled: {
                type: Boolean,
                default: false
            },
        },
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
                this.currVal !== val && (this.currVal = val)
            },
        },
        methods: {
            handleChange(val) {
                this.currVal = val
                this.$emit('input', val)
                this.$emit('change', val)
                this.change && this.change()
            },
            fetchData (val, length) {
                let keyword = val
                let page = parseInt(length / this.pageSize) + 1
                return courseService.courseList(keyword, page, this.pageSize)
            }
        }
    }
</script>

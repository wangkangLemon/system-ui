<template>
    <SelectScroll 
        ref="selectScroll"
        :changeCb="handleChange" 
        :requestCb="fetchData" 
        :placeholder="placeholder"
        v-model="currVal" 
        :disabled="disabled">
    </SelectScroll>
</template>

<script>
    import courseService from 'services/newcourse/courseService'
    import SelectScroll from 'components/form/SelectScroll.vue'
    export default{
        props: {
            po_course: Number,
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
            handleChange(val, name) {
                this.currVal = val
                this.$emit('input', val)
                this.$emit('change', val, name)
                this.change && this.change()
            },
            fetchData (val, length) {
                let keyword = val
                let page = parseInt(length / this.pageSize) + 1
                let page_size = this.pageSize
                return courseService.search({keyword, po_course: this.po_course, page, page_size})
            },
            // 手动清除选中状态
            clear () {
                this.$refs.selectScroll.clear()
            }
        }
    }
</script>

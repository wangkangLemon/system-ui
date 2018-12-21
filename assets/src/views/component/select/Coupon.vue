<template>
    <SelectScroll :changeCb="handleChange" :requestCb="fetchData" :placeholder="placeholder"
                  v-model="currVal" :disabled="disabled">
    </SelectScroll>
</template>

<script>
    import couponService from '../../../services/yshi/couponService'
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
                let name = val
                let page = parseInt(length / this.pageSize) + 1
                let page_size = this.pageSize
                return couponService.searchName({name, page, page_size})
            }
        }
    }
</script>

<template>
    <SelectScroll :changeCb="handleChange" :requestCb="fetchData" :placeholder="placeholder"
                  v-model="currVal" :disabled="disabled">
    </SelectScroll>
</template>

<script>
    import parkService from '../../../services/usersystem/parkService'
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
                pageSize: 10,
                fetchParam: {
                    name: void 0,
                    status: void 0,
                    category: 'discount_coupon',
                    page: 1,
                    page_size: 10
                },
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
                this.fetchParam.name = val
                this.fetchParam.page = parseInt(length / this.pageSize) + 1
                return parkService.prodSearch(this.fetchParam)
            }
        }
    }
</script>

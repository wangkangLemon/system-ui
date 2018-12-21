<template>
    <SelectScroll ref="scroll" :changeCb="handleChange" :requestCb="fetchData" :placeholder="currPlaceholder"
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
                currPlaceholder: this.placeholder,
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
            'value': {
                handler (val, oldValue) {
                    this.currVal !== val && (this.currVal = val)
                },
                immediate: true
            },
            'placeholder' (val) {
                this.currPlaceholder !== val && (this.currPlaceholder = val)
            }
            // 'value' (val, oldValue) {
            //     debugger
            //     this.currVal !== val && (this.currVal = val)                
            // }
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

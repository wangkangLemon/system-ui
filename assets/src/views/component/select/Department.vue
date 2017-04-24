<!--门店下拉框-->

<template>
    <SelectScroll @changeVal="setCurrentValue" :changeCb="handleChange" :requestCb="fetchData">
    </SelectScroll>
</template>

<script>
    import SelectScroll from '../../component/form/SelectScroll.vue'
    import depService from '../../../services/departmentService'
    export default{
        props: ['value', 'change'],
        data () {
            return {
                currVal: this.value,
                pageSize: 20
            }
        },
        watch: {
            'value'(val, oldValue) {
                this.setCurrentValue(val)
            }
        },
        methods: {
            fetchData (val, length) {
                return depService.getDepartment({
                    keyword: val,
                    page_size: this.pageSize,
                    page: parseInt(length / this.pageSize) + 1
                })
            },
            handleChange(val) {
                this.setCurrentValue(val)
                this.change && this.change()
            },
            setCurrentValue (val) {
                if (this.curVal == val) return
                this.currVal = val
                this.$emit('input', val)
                this.$emit('change', val)
            }
        },
        components: {
            SelectScroll
        }
    }
</script>

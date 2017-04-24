<!--签约人下拉框-->
<template>
    <SelectScroll @changeVal="setCurrentValue" :changeCb="handleChange" :requestCb="fetchData" v-model="currVal">
    </SelectScroll>
</template>

<script>
    import SelectScroll from '../../component/form/SelectScroll.vue'
    import adminService from '../../../services/adminService'
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
                return adminService.getSignatoryList({
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
            }
        },
        components: {
            SelectScroll
        }
    }
</script>

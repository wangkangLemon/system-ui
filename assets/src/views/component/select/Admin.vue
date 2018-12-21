<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/topSearch";
</style>

<template>
    <SelectScroll  :changeCb="handleChange" :requestCb="fetchData"></SelectScroll>
</template>

<script>
    import adminService from '../../../services/adminService'
    import SelectScroll from '../../component/form/SelectScroll.vue'
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
                return adminService.adminList({
                    keyword: val,
                    page: parseInt(length / this.pageSize) + 1,
                    page_size: this.pageSize
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
        components: {SelectScroll}
    }
</script>

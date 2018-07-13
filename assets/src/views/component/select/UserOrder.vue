<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/topSearch";
</style>

<template>
    <SelectScroll 
        :inputPlaceholder="inputPlaceholder"
        :changeCb="handleChange" :requestCb="fetchData" ></SelectScroll>
</template>

<script>
    import orderService from 'services/newcourse/orderService'
    import SelectScroll from '../../component/form/SelectScroll.vue'
    export default{
        components: {
            SelectScroll
        },
        props: ['value', 'change'],
        data () {
            return {
                currVal: this.value,
                page_size: 10,
                inputPlaceholder: '姓名或者手机号'
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
                this.$emit('input', val)
            },
            fetchData (val, length) {
                let keyword = val
                let page = parseInt(length / this.page_size) + 1
                return orderService.userList(keyword, page, this.page_size)
            }
        }
    }
</script>

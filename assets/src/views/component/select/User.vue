<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/topSearch";
</style>

<template>
    <SelectScroll :changeCb="handleChange" :requestCb="fetchData" ></SelectScroll>
</template>

<script>
    import {userList} from '../../../services/userService'
    import SelectScroll from '../../component/form/SelectScroll.vue'
    export default{
        components: {
            SelectScroll
        },
        props: ['value', 'change'],
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
                this.$emit('input', val)
            },
            fetchData (val, length) {
                let keyword = val
                let page = parseInt(length / this.pageSize) + 1
                return userList(keyword, page, this.pageSize)
            }
        }
    }
</script>

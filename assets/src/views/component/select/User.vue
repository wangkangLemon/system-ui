<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/topSearch";
</style>

<template>
    <section>
        <i>用户</i>
        <SelectScroll @changeVal="setCurrentValue" :changeCb="handleChange" :requestCb="fetchData" v-model="currVal">
        </SelectScroll>
    </section>
</template>

<script lang='babel'>
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
                this.$emit('change', val)
            },
            fetchData (val, length) {
                let keyword = val
                let page = parseInt(length / this.pageSize) + 1
                return userList(keyword, page, this.pageSize)
            }
        }
    }
</script>

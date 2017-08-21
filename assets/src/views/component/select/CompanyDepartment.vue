<!--企业-管理员-添加-门店下拉框-->

<template>
    <SelectScroll ref="selectScroll" :changeCb="handleChange" @changeVal="setCurrentValue" :requestCb="fetchData" v-model="currVal">
    </SelectScroll>
</template>

<script>
    import SelectScroll from '../../component/form/SelectScroll.vue'
    import departmentService from '../../../services/departmentService'
    export default{
        props: ['value', 'type'],
        data () {
            return {
                currVal: this.value,
                pageSize: 20
            }
        },
        watch: {
            'value'(val, oldValue) {
                this.setCurrentValue(val)
            },
            'type'(val, oldValue) {
                this.setCurrentValue('')
                this.$refs['selectScroll'].filter('')
            }
        },
        methods: {
            fetchData (val, length) {
                return departmentService.getDepartment({
                    keyword: val,
                    company_id: this.type,
                    page_size: this.pageSize,
                    page: parseInt(length / this.pageSize) + 1
                })
            },
            handleChange(val) {
                this.setCurrentValue(val)
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

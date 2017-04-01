<!--门店下拉框 未完成-->

<template>
    <section>
        <i>门店</i>
        <SelectScroll @changeVal="setCurrentValue" :changeCb="handleChange" :requestCb="fetchData" v-model="value">
        </SelectScroll>
    </section>
</template>

<script>
    import SelectScroll from '../../component/form/SelectScroll.vue'
    import companyService from '../../../services/companyService'
    export default{
        props: ['value', 'change', 'type'],
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
                return companyService.getIndrustrySelectList({
                    keyword: val,
                    category: this.type,
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
                this.$emit('change', val)
            }
        },
        components: {
            SelectScroll
        }
    }
</script>

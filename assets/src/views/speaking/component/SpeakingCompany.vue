<!--工业存值有余额-->

<!--使用示范:-->
<!--<IndustryCompanySelect v-model="fetchParam.enterprise_id"-->
<!--v-on:change="val=>fetchParam.enterprise_id=val"-->
<!--:change="fetchData">-->
<!--</IndustryCompanySelect>-->

<template>
    <SelectScroll :changeCb="handleChange" :requestCb="fetchData" :placeholder="placeholder" :list="list"
                  v-model="currVal">
    </SelectScroll>
</template>

<script>
    import SelectScroll from '../../component/form/SelectScroll.vue'
    import companyMoneyService from '../../../services/speaking/companyMoneyService'
    export default{
        props: ['value', 'change', 'placeholder', 'list'],
        data () {
            return {
                currVal: this.value,
                pageSize: 20
            }
        },
        watch: {
            'value'(val, oldValue) {
                this.currVal !== val && (this.currVal = val)
            }
        },
        methods: {
            fetchData (val, length) {
                return companyMoneyService.getIndrustrySelectList({
                    keyword: val,
                    page_size: this.pageSize,
                    page: parseInt(length / this.pageSize) + 1
                }).then((ret) => {
                    this.$emit('changelist', ret.data)
                    return ret
                })
            },
            handleChange(val) {
                this.setCurrentValue(val)
                this.change && this.change()
            },
            setCurrentValue (val) {
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

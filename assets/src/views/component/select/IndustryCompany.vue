<!--工业连锁店-->

<!--使用示范:-->
<!--<IndustryCompanySelect v-model="fetchParam.enterprise_id"-->
<!--v-on:change="val=>fetchParam.enterprise_id=val"-->
<!--:change="fetchData">-->
<!--</IndustryCompanySelect>-->

<template>
    <SelectScroll :changeCb="handleChange" :requestCb="fetchData" :placeholder="placeholder" :list="list" v-model="currVal">
    </SelectScroll>
</template>

<script>
    import SelectScroll from '../../component/form/SelectScroll.vue'
    import companyService from '../../../services/companyService'
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
            // 0-企业 1-工业 2-连锁
            type: [String, Number]
        },
        data () {
            return {
                currVal: this.value,
                pageSize: 15
            }
        },
        watch: {
            'value'(val, oldValue) {
                this.currVal !== val && (this.currVal = val)
            }
        },
        methods: {
            fetchData (val, length) {
                return companyService.getIndrustrySelectList({
                    keyword: val,
                    category: this.type,
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

<!--工业连锁店-->

<!--使用示范:-->
<!--<IndustryCompanySelect v-model="fetchParam.enterprise_id"-->
<!--v-on:change="val=>fetchParam.enterprise_id=val"-->
<!--:change="fetchData">-->
<!--</IndustryCompanySelect>-->

<style lang='scss' scoped rel='stylesheet/scss'></style>

<template>
    <section>
        <i v-if="type == 1">工业</i>
        <i v-else-if="type == 2">连锁</i>
        <i v-else>企业</i>
        <SelectScroll :changeCb="handleChange" :requestCb="fetchData" v-model="currVal">
        </SelectScroll>
    </section>
</template>

<script>
    import SelectScroll from '../../component/form/SelectScroll.vue'
    import companyService from '../../../services/companyService'
    export default{
        //                          1-工业 2-连锁 3-企业
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
                this.$emit('input', val)
                this.$emit('change', val)
            }
        },
        components: {
            SelectScroll
        }
    }
</script>

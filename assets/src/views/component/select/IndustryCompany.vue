<!--工业连锁店-->

<!--使用示范:-->
<!--<IndustryCompanySelect v-model="fetchParam.enterprise_id"-->
                       <!--v-on:change="val=>fetchParam.enterprise_id=val"-->
                       <!--:change="fetchData">-->
<!--</IndustryCompanySelect>-->

<style lang='scss' scoped rel='stylesheet/scss'></style>

<template>
    <section>
        <i>工业</i>
        <el-select v-loading="loading"
                   @visible-change="handleIndustrySelChange"
                   @change="handleChange"
                   v-model="currVal"
                   placeholder="请选择">
            <el-option
                    v-for="item in data"
                    :label="item.name"
                    :value="item.id" :key="item.id">
            </el-option>
        </el-select>
    </section>
</template>

<script lang='babel'>
    import companyService from '../../../services/companyService'
    export default{
        props: ['value', 'change'],
        data () {
            return {
                loading: false,
                data: [{name: '全部'}],
                currVal: this.value
            }
        },
        watch: {
            'value'(val, oldValue) {
                this.setCurrentValue(val)
            }
        },
        methods: {
            // 处理工业下拉框点击
            handleIndustrySelChange () {
                if (this.data.length > 1)
                    return

                this.loading = true
                companyService.getIndrustrySelectList().then(ret => {
                    this.data.push(...ret.data)
                    this.loading = false
                }).catch(() => {
                    this.loading = false
                })
            },
            handleChange(val) {
                this.setCurrentValue(val)
                this.change && this.change()
            },
            setCurrentValue (val) {
                this.currVal = val
                this.$emit('change', val)
            }
        }
    }
</script>

<!--商品类型-->

<!--使用示范:-->
<!--<IndustryCompanySelect v-model="fetchParam.enterprise_id"-->
<!--v-on:change="val=>fetchParam.enterprise_id=val"-->
<!--:change="fetchData">-->
<!--</IndustryCompanySelect>-->

<template>
    <el-select v-model="currVal" :placeholder="placeholder" :disabled="disabled" :clearable="true"
               v-loading="loading" @visible-change="fetchData">
        <el-option
                v-for="(item,index) in data"
                :key="index"
                :label="item.alias"
                :value="item.name">
        </el-option>
    </el-select>
</template>

<script>
    import SelectScroll from '../../component/form/SelectScroll.vue'
    import parkService from '../../../services/usersystem/parkService'
    export default{
        props: {
            value: [String, Number],
            change: Function,
            placeholder: String,
            disabled: {
                type: Boolean,
                default: false
            },
        },
        data () {
            return {
                currVal: this.value,
                data: [],
                loading: false
            }
        },
        watch: {
            'value'(val, oldValue) {
                this.currVal !== val && (this.currVal = val)
            },
            'currVal' (val) {
                this.handleChange(val)
            }
        },
        methods: {
            fetchData () {
                if (this.data.length > 0) return Promise.resolve(true)
                this.loading = true
                return parkService.prodCategory().then((ret) => {
                    this.data = ret.data
                    this.loading = false
                })
            },
            handleChange(val) {
                this.currVal = val
                this.$emit('input', val)
                this.$emit('change', val)
                this.change && this.change()
            },
        },
        components: {
            SelectScroll
        }
    }
</script>

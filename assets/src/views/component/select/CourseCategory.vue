<!--课程栏目-->
<style lang='scss' rel='stylesheet/scss'></style>

<template>
    <el-select v-model="currVal" placeholder="请选择" @change="setCurrVal">
        <el-option
                v-for="item in cities"
                :label="item.label"
                :value="item.value">
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
        </el-option>
    </el-select>
</template>

<script>
    export default{
        props: {
            value: [String, Number]
        },
        data () {
            return {
                currVal: this.value
            }
        },
        watch: {
            'value'(val) {
                val !== this.currVal && this.setCurrVal(val)
            }
        },
        created () {
        },
        activated () {
        },
        methods: {
            setCurrVal (val) {
                this.currVal = val
                this.$emit('input', val)
            }
        },
        components: {}
    }
</script>

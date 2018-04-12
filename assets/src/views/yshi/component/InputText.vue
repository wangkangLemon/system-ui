<!--组合优惠-->
<style lang='scss' rel='stylesheet/scss'>
    #component-from-input-text {
        display: inline-block;
        .input-new-tag {
            display: inline-block;
            width: 80px !important;
        }
    }
</style>

<template>
    <article id="component-from-input-text">
        <i>{{textLeft}}</i>
        <el-input type="Number" size="mini" class="input-new-tag" ref="input" v-model="inputValue"></el-input>
        <i>{{textRight}}</i>
    </article>
</template>

<script>
    export default{
        props: {
            value: [String, Number],
            textLeft: String,
            textRight: String
        },
        data () {
            return {
                inputValue: this.value
            }
        },
        created () {
        },
        activated () {
        },
        watch: {
            inputValue (val) {
                this.$emit('input', val)
            },
            value (val) {
                this.inputValue = val
            }
        },
        methods: {},
        components: {}
    }
</script>

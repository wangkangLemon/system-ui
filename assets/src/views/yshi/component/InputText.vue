<!--组合优惠-->
<style lang='scss' rel='stylesheet/scss'>
    #component-from-input-text {
        display: inline-block;
        .input-new-tag {
            display: inline-block;
            width: 100px !important;
        }
        .err-red{
            color: red;
            font-size: 12px;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
        }
        input[type="number"]{
            -moz-appearance: textfield;
        }
    }
</style>

<template>
    <article id="component-from-input-text">
        <div style="display: inline-block;">
            <el-input 
                v-if="textRight === '人' || textRight === '元'"
                type="tel" 
                size="small" 
                v-pnumberOnly 
                style="width:180px;" 
                ref="input" 
                v-model="inputValue" 
                :disabled="disable">
                <template slot="prepend">{{textLeft}}</template>
                <template slot="append">{{textRight}}</template>
            </el-input>
            <el-input 
                v-else
                type="tel" 
                size="small" 
                v-numberOnly 
                style="width:180px;" 
                ref="input" 
                v-model="inputValue" 
                :disabled="disable">
                <template slot="prepend">{{textLeft}}</template>
                <template slot="append">{{textRight}}</template>
            </el-input>
        </div>
        <i v-if="error" class="err-red">{{msg}}</i>
    </article>
</template>

<script>
    export default {
        props: {
            value: [String, Number],
            textLeft: String,
            textRight: String,
            disable: {
                type: Boolean,
                default: false
            },
            isdis: {
                type: Boolean,
                default:false
            }
        },
        data () {
            return {
                inputValue: this.value,
                error: true,
                msg: ''
            }
        },
        created () {
        },
        activated () {
        },
        watch: {
            inputValue (val) {
                if(val){
                    if (this.isdis){
                        var re = /^(?=0\.[1-9]|[1-9]\.\d).{3}$|^([1-9])$/
                        if (!re.test(val)) {
                            this.error = true
                            this.msg = '0-9最多1位小数'
                            this.$emit('err', true)
                        } else {
                            this.error = false
                            this.$emit('input', val)
                        }
                    } else if (this.textRight === '人' || this.textRight === '元') {
                        this.error = false
                        this.$emit('input', parseInt(val))
                    } else {
                        var re = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
                        if (!re.test(val)) {
                            this.error = true
                            this.msg = '最多两位小数的数字'
                            this.$emit('err', true)
                        } else {
                            this.error = false
                            this.$emit('input', val)
                        }
                    }
                } else {
                    this.error = true
                    this.msg = '不能是空'
                    this.$emit('err', true)
                }
                
            },
            value (val) {
                this.inputValue = val
            }
        },
        methods: {
        },
        components: {},
        directives: {}
    }
</script>

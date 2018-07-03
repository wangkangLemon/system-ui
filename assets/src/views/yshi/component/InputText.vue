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
                type="tel" 
                size="small" 
                v-numbera 
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
                error: false,
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
                            this.$store.dispatch('setYshiGroupError')
                        } else {
                            this.error = false
                            this.$store.dispatch('setYshiGroupSuccess')
                            this.$emit('input', val)
                        }
                    } else {
                        var re = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
                        if (!re.test(val)) {
                            this.error = true
                            this.msg = '最多两位小数的数字'
                            this.$store.dispatch('setYshiGroupError')
                        } else {
                            this.error = false
                            this.$store.dispatch('setYshiGroupSuccess')
                            this.$emit('input', val)
                        }
                    }
                } else {
                    this.error = true
                    this.msg = '不能是空'
                    this.$store.dispatch('setYshiGroupError')
                }
                
            },
            value (val) {
                this.inputValue = val
            }
        },
        methods: {
        },
        components: {},
        directives: {
            numbera: {
                bind: function (el) {
                    el.addEventListener('keyup', () => {
                        let input = el.querySelector('.el-input__inner')
                        let value = input.value
                        const newVal = value === '' ? undefined : Number(value)
                        if (isNaN(newVal)) {
                            value.replace(/([^.\d+])|(\d*\.?\d*)/, (match, p1, p2, p3) => {
                                console.log(match + '-' + p1 + '-' + p2 + '-' + p3)
                                if (p2 != undefined) {
                                    input.value = p2
                                } else {
                                    input.value = ''
                                }
                            })
                        }
                        // input.value = newVal.replace(/[^.\d+]|(\d+\.)\.?$/, '$1')
                    })
                },
            }
        }
    }
</script>

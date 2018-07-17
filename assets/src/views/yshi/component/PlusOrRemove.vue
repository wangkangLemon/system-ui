<!--组合优惠-->
<style lang='scss' rel='stylesheet/scss'>
    #component-form-group {
        display: inline-block;
        .input-new-tag {
            display: inline-block;
            width: 80px !important;
        }
        .icon-btn{
            border-radius: 50%;
            height: 25px;
            width: 25px;
            line-height: 6px;
            padding-left: 2px;
            padding-right: 0;
            &.plus{
                color: #6495ed;
                border:1px solid #6495ed;
            }
            &.minus{
                color: #ed143d;
                border: 1px solid #ed143d;
                line-height: 3px;
                margin-left: 10px;
            }
        }
        
    }
</style>

<template>
    <article id="component-form-group">
        <div v-for="( item , index ) in set_money">
            <InputText 
                textLeft="满" 
                :textRight="textRight" 
                :value="item.reach" 
                @input="inputFn(arguments[0], 'reach', index)"
                @err="showErr(arguments[0], index)"
                :disable="disable">
            </InputText>
            <InputText 
                textLeft="打" 
                textRight="折" 
                :value="item.discount" 
                @input="inputFn(arguments[0], 'discount', index)" 
                @err="showErr(arguments[0], index)"
                :disable="disable" 
                :isdis="isdis">
            </InputText>
            <el-button 
                v-if="index !== 0" 
                class="el-icon-minus icon-btn minus" 
                @click="del(index)" 
                :disabled="disable">
            </el-button>
            <el-button 
                size="small" 
                class="el-icon-plus icon-btn plus" 
                @click="plus" 
                :disabled="disable">
            </el-button>
        </div>
    </article>
</template>

<script>
    import InputText from './InputText.vue'
    export default{
        props: {
            textRight: {
                type: String,
                default: '元'
            },
            disable: {
                type: Boolean,
                default: false
            },
            select: Array,
        },
        data () {
            return {
                dataArr: this.favorable,
                moneyValue: this.money,
                discountValue: this.discount,
                isdis: true,
                set_money: initPusher(this.select)
            }
        },
        created () {
        },
        activated () {
        },
        computed: {
        },
        watch: {
            select (val) {
                this.set_money = initPusher(val)
            }
        },
        methods: {
            del (index) {
                this.set_money.splice(index, 1)
            },
            plus () {
                this.set_money.push(initSet())
            },
            inputFn (val, data, index) {
                this.set_money[index][data] = Number(val)
                this.set_money[index].error = false
            },
            showErr(val, index) {
                this.set_money[index].error = val
            }
        },
        components: {
            InputText
        }
    }
    function initPusher (select) {
        let res = select || []
        !res.length && res.push(initSet())
        return res
    }
    function initSet () {
        return {
            reach: void '',
            discount: void '',
            error: false
        }
    }
</script>

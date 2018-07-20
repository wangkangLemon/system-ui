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
                :value="item.reach.value" 
                @input="inputFn(arguments[0], reach, index)"
                @err="showErr(arguments[0], reach, index)"
                :disable="disable">
            </InputText>
            <InputText 
                textLeft="打" 
                textRight="折" 
                :value="item.discount.value" 
                @input="inputFn(arguments[0], discount, index)" 
                @err="showErr(arguments[0], discount, index)"
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
    const DISCOUNT = 'discount'
    const REACH = 'reach'
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
                isdis: true,
                set_money: initPusher(this.select),
                reach: REACH,
                discount: DISCOUNT
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
                // this.$emit('res', this.set_money)
            },
            set_money (val) {
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
                this.set_money[index][data].value = Number(val)
                this.set_money[index][data].error = false
                // debugger
                this.$emit('res', this.set_money)
            },
            showErr(val, data, index) {
                this.set_money[index][data].error = val
            }
        },
        components: {
            InputText
        }
    }
    function initPusher (select) {
        // debugger
        let res = select || []
        if (!res.length) {
            res.push(initSet())
        } else {
            res = initSet2(res)
        }
        // checkEmptySelect(res) && res.push(initSet())
        // !res.length && res.push(initSet())
        return res
    }
    function initSet () {
        return {
            [REACH]: {
                value: void '',
                error: false
            },
            [DISCOUNT]: {
                value: void '',
                error: false
            }
        }
    }
    function initSet2(res) {
        let objarr = []
        res.forEach( item => {
            let obj = initSet()
            if (item[REACH].value !== '' || item[DISCOUNT].value !== '') {
                obj[REACH].value = item[REACH]
                obj[DISCOUNT].value = item[DISCOUNT]
            }
            objarr.push(obj)
        })
        return objarr
    }
    // function checkEmptySelect (res) {
    //     let pass = false
    //     // res = [{}]
    //     // return !res.length // false
    //     res.forEach(item => {
    //         if (!(DISCOUNT in item && DISCOUNT in item)) {
    //             pass = true
    //             res.
    //             return
    //         }
    //     })
    //     return pass
    // }
</script>

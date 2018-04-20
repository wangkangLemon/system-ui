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
            line-height: 9px;
            padding-left: 0;
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
        <div v-for="( item , index ) in dataArr">
            <InputText textLeft="满" textRight="元" :value="moneyValue[index]" @input="inputFn(arguments[0], moneyValue, index)" :disable="disable"></InputText>
            <InputText textLeft="打" textRight="折" :value="discountValue[index]" @input="inputFn(arguments[0], discountValue, index)" :disable="disable" :isdis="isdis"></InputText>
            <el-button v-if="dataArr.length > 1" class="el-icon-minus icon-btn minus" @click="removeitem(index)" :disabled="disable" ></el-button>
            <el-button v-if="dataArr.length == 1 || dataArr.length == index+1" size="small" class="el-icon-plus icon-btn plus" @click="additem(moneyValue[index], discountValue[index])" :disabled="disable"></el-button>
        </div>
    </article>
</template>

<script>
    import InputText from './InputText.vue'
    export default{
        props: {
            money: Array,
            discount: Array,
            favorable: Array,
            disable: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                dataArr: this.favorable,
                moneyValue: this.money,
                discountValue: this.discount,
                isdis: true
            }
        },
        created () {
        },
        activated () {
        },
        computed: {
        },
        watch: {
            moneyValue() {
                this.$emit('res', this.getRes())
            },
            discountValue() {
                this.$emit('res', this.getRes())
            }
        },
        methods: {
            additem(moneyValue, discountValue) {
                this.dataArr.push('')
            },
            removeitem(index) {
                this.dataArr.pop(index)
                this.moneyValue.splice(index, 1)
                this.discountValue.splice(index, 1)
            },
            inputFn (val, array, index) {
                this.$set(array, index, val)
                // var re = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
                // if (!re.test(val)) {
                //     xmview.showTip('error', '价格只能是最多两位小数')
                // }
                // let a = this.getRes()
                // console.log(a)
                // this.$emit('res', this.getRes())
            },
            getRes () {
                let _discountValue = this.discountValue.map(item => {
                    return {discount: Number(item)}
                })
                let _moneyValue = this.moneyValue.map(item => {
                    return {reach: Number(item)}
                })
                _moneyValue.forEach((item, index) => {
                    item.discount = _discountValue[index] && _discountValue[index].discount
                })
                return _moneyValue
            }
        },
        components: {
            InputText
        }
    }
</script>

<!--使用示例-->
<!--<v-input @changeVal="val=>fetchParam.username=val" :enter="fetchData" v-model="fetchParam.username"-->
         <!--placeholder="请输入内容"></v-input>-->
<template>
    <el-input ref="container" :placeholder="placeholder" @change="setVal"></el-input>
</template>

<script lang='babel'>
    export default{
        props: {
            enter: Function,
            placeholder: String,
            value: [String, Number]
        },
        watch: {
            'value'(val) {
                this.setVal(val)
            }
        },
        mounted () {
            this.$refs.container.$el.querySelector('input').onkeyup = (e) => {
                e.keyCode === 13 && this.enter && this.enter()
            }
        },
        data () {
            return {
                currVal: this.value
            }
        },
        methods: {
            setVal (val) {
                if (val == this.currVal) return
                this.currVal = val
                this.$emit('changeVal', val)
            }
        }
    }
</script>

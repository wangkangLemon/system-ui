<style lang='scss' scoped rel='stylesheet/scss'></style>

<template>
    <div>
        <button @click="getData">点击获取数据</button>
    </div>
</template>

<script lang='babel'>
    import * as testService from '../services/testService'
    export default{
        created () {
        },
        methods: {
            getData () {
                testService.getCitys().then(ret => {
                    console.info(ret)
                })
            }
        }
    }
</script>

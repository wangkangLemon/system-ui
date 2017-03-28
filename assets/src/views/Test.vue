<style lang='scss' scoped rel='stylesheet/scss'>
    .div {
        color: red;
    }
</style>

<template>
    <div>
        <ImageEcropperInput></ImageEcropperInput>
    </div>
</template>

<script lang='babel'>
    import * as testService from '../services/testService'
    import ImageEcropperInput from './component/upload/ImagEcropperInput.vue'
    export default{
        created () {
        },
        methods: {
            getData () {
                testService.getCitys().then(ret => {
                    console.info(ret)
                })
            }
        },
        components: {
            ImageEcropperInput
        }
    }
</script>

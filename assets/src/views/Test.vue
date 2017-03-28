<style lang='scss' scoped rel='stylesheet/scss'>
    .div {
        color: red;
    }
</style>

<template>
    <div>
        <ImageEcropperInput :confirmFn="getData" :aspectRatio="4/7"></ImageEcropperInput>
    </div>
</template>

<script lang='babel'>
    import ImageEcropperInput from './component/upload/ImagEcropperInput.vue'
    export default{
        created () {
        },
        methods: {
            getData (data) {
                console.info('test.vue 获取裁切内容' + data)
            }
        },
        components: {
            ImageEcropperInput
        }
    }
</script>

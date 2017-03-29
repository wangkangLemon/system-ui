<!--首页导航-->
<style lang='scss' scoped rel='stylesheet/scss'>
    .container {
        background: #fff;
        padding: 15px;
    }
</style>

<template>
    <article class="container">
        <button @click="startCropper"></button>
        <ImagEcropperInput v-show="0">

        </ImagEcropperInput>
    </article>
</template>

<script lang='babel'>
    import ImagEcropperInput from '../component/upload/ImagEcropperInput.vue'
    export default{
        methods: {
            startCropper() {
                ImagEcropperInput.chooseImg()
            }
        },
        components: {ImagEcropperInput}
    }
</script>

<style lang='scss' scoped rel='stylesheet/scss'>
    .div {
        color: red;
    }

    .container {
        padding: 20px;
    }
</style>

<template>
    <div class="container">
        <Upload :on-success="successCb"></Upload>
    </div>
</template>

<script>
    import Upload from './component/upload/UploadImg.vue'
    export default {
        data() {
            return {}
        },
        methods: {
            successCb (response) {
                console.info(response)
            }
        },
        components: {Upload}
    }
</script>

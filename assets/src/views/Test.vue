<style lang='scss' rel='stylesheet/scss'>
    #testview-container {
        .div {
            color: red;
        }

        .container {
            padding: 20px;
        }

        .upload {
            width: 300px;
            height: 300px
        }
    }

</style>

<template>
    <div id="testview-container">
        <Upload class="upload" :on-success="successCb"
                defaultImg="http://localhost:8002/assets/build/img/logo.png"></Upload>
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

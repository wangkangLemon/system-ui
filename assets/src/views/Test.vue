<style lang='scss' rel='stylesheet/scss'>
    #testview-container {

    }

</style>

<template>
    <div id="testview-container">
        <UploadFile v-model="isShow" ref="container"></UploadFile>
        <el-button @click="() => isShow = true">显示</el-button>
    </div>
</template>

<script>
    import UploadFile from './course/component/DialogVideo.vue'

    export default {
        data() {
            return {
                isShow: true,
                file: '/upload/1.docx'
            }
        },
        mounted () {
            this.$refs.container.fetchData()
            console.info(this.$refs.container.fetchData)
        },
        methods: {
            handleChange (val) {
                console.info(val)
            }
        },
        components: {UploadFile}
    }
</script>

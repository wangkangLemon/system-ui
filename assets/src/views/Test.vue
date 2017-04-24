<style lang='scss' rel='stylesheet/scss'>
    #testview-container {

    }

</style>

<template>
    <div id="testview-container">
        <el-button @click="$refs.preview.show()">点击出现</el-button>
        <VideoPreview url="http://vodcdn.yst.vodjk.com/201704241854/8a4fadbe211fb7f98ff4bde6c1f2014b/company/1/2017/3/27/174034t3m0mnm9ria30qmy4x6r/sd/5adbbde5630845629772657d6f143636.m3u8" ref="preview"></VideoPreview>
    </div>
</template>

<script>
    import VideoPreview from './component/dialog/VideoPreview.vue'
    export default {
        data() {
            return {
                isShow: false
            }
        },
        mounted () {
        },
        methods: {},
        components: {VideoPreview}
    }
</script>

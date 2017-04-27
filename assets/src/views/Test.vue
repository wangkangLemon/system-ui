<style lang='scss' rel='stylesheet/scss'>
    #testview-container {

    }

</style>

<template>
    <div id="testview-container">
        <VideoPreview ref="videopreview"
                      url="http://vodcdn.yst.vodjk.com/201704262042/ff5e19c59b89b2d600bd016980dfe450/company/93/2017/4/21/15242uv6en6r5mf4yikxx0f6r/sd/993dda18b8f54dc98302e2158f1bd2a5.m3u8"></VideoPreview>

    </div>
</template>

<script>
    import VideoPreview from './component/dialog/VideoPreview.vue'
    export default {
        data() {
            return {
                inoutVal: 11,
                isShow: false,
                list: [{name: '11', age: 18}, {name: '12', age: 18}]
            }
        },
        created () {
        },
        mounted () {
            this.$refs.videopreview.show()
        },
        methods: {},
        components: {VideoPreview}
    }
</script>

<style lang='scss' rel='stylesheet/scss'>
    #testview-container {

    }

</style>

<template>
    <div id="testview-container">
        <UploadImg :defaultImg="defaultImg"></UploadImg>
        <Tags v-model="tags"></Tags>

        <div id="qrcode"></div>
    </div>
</template>

<script>
    import UploadImg from './component/upload/UploadImg.vue'
    import Tags from './component/form/Tags.vue'
    import wechatSdk from '../vendor/wechatSdk'

    export default {
        data() {
            return {
                isShow: true,
                defaultImg: 'http://images2015.cnblogs.com/news/24442/201703/24442-20170323175419330-619990066.jpg',
                tags: []
            }
        },
        mounted () {
            /* eslint-disable no-new */
            wechatSdk.initSdk().then(() => {
                new window.WxLogin({
                    id: 'qrcode',
                    appid: '',
                    scope: '',
                    redirect_uri: '',
                    state: '',
                    style: '',
                    href: ''
                })
            })
        },
        methods: {
            handleChange (val) {
                console.info(val)
            }
        },
        components: {UploadImg, Tags}
    }
</script>

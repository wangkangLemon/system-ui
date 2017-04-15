<style lang='scss' rel='stylesheet/scss'>
    #testview-container {

    }

</style>

<template>
    <div id="testview-container">
        <UploadImg :defaultImg="defaultImg"></UploadImg>
        <Tags v-model="tags"></Tags>

        <div id="qrcode"></div>

        <el-button @click="openWechat">打开open</el-button>
        <el-button @click="closetab">关闭open</el-button>

    </div>
</template>

<script>
    import UploadImg from './component/upload/UploadImg.vue'
    import Tags from './component/form/Tags.vue'
    import wechatSdk from '../vendor/wechatSdk'
    import mineService from '../services/mineService'

    export default {
        data() {
            return {
                isShow: true,
                defaultImg: 'http://images2015.cnblogs.com/news/24442/201703/24442-20170323175419330-619990066.jpg',
                tags: [],
                wechatUrl: '',
                newTab: void 0,
            }
        },
        mounted () {
            mineService.getWechatLoginConfig().then((ret) => {
                this.wechatConfig = ret
            })
        },
        methods: {
            handleChange (val) {
                console.info(val)
            },
            closetab () {
                console.info(this.newTab)
                this.newTab.close()
            },
            openWechat () {
                wechatSdk.openWechatLogin(this.wechatConfig, (data) => {
                    console.info(data, '请求完毕')
                })
//
//                window.open('http://localhost:8080/Scripts/1.html')
//                window.addEventListener('message', (e) => {
//                    console.info('接收消息', e, wechatSdk)
//                }, false)
            }
        },
        components: {UploadImg, Tags}
    }
</script>

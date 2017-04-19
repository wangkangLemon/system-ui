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

        {{url}}
        <a :href="url" download="aaa.xls" ref="link">跳转</a>
        <input type="file" @change="changefile($event)">
    </div>
</template>

<script>
    import UploadImg from './component/upload/UploadImg.vue'
    import Tags from './component/form/Tags.vue'
    //    import wechatSdk from '../vendor/wechatSdk'
    //    import mineService from '../services/mineService'
    import * as api from '../services/api'

    export default {
        data() {
            return {
                isShow: true,
                defaultImg: 'http://images2015.cnblogs.com/news/24442/201703/24442-20170323175419330-619990066.jpg',
                tags: [],
                wechatUrl: '',
                newTab: void 0,
                url: void 0,
            }
        },
        mounted () {
//            mineService.getWechatLoginConfig().then((ret) => {
//                this.wechatConfig = ret
//            })
//            api.downLoad('http://localhost:8080/home/export', {export: 1}).then((ret, xhr) => {
//                console.info(ret)
//                let blob = new window.Blob([ret])
//                this.url = window.URL.createObjectURL(blob)
//            }).catch((err) => {
//                console.info(err)
//            })
//
//            var xhr = new window.XMLHttpRequest()
//            xhr.open('GET', 'http://localhost:8080/home/export', true)
//            xhr.responseType = 'arraybuffer'
//            let _this = this
//            xhr.onload = function () {
//                if (xhr.status === 200) {
//                    let blob = new window.Blob([xhr.response])
//                    _this.url = window.URL.createObjectURL(blob)
//                }
//            }
//            xhr.send()
            api.downLoad('http://10.1.2.13:8002/sys/finance/history/search', {export: 1}, '到处.xls').then((ret) => {
                console.info(ret)
            }).catch((err) => {
                debugger
                console.info(err)
            })
        },
        methods: {
            changefile (e) {
                let _this = this
                let reader = new window.FileReader()
                reader.readAsArrayBuffer(e.target.files[0])
                reader.onload = function () {
                    debugger
                    let blob = new window.Blob([this.result])
                    _this.url = window.URL.createObjectURL(blob)
                }
            },
            handleChange (val) {
                console.info(val)
            },
            closetab () {
                console.info(this.newTab)
                this.newTab.close()
            },
            openWechat () {

            }
        },
        components: {UploadImg, Tags}
    }
</script>

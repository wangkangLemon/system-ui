<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";

    #im-ystassistant-materia {
        @extend %content-container;
        overflow: hidden;
        position: relative;

        > * {
            vertical-align: top;
            display: inline-block;
        }

        .right-container {
            height: 500px;
            width: 600px;
        }
    }
</style>

<template>
    <article id="im-ystassistant-materia">
        <NewsInfo v-model="articles" :nodeClick="itemClick" class="left-container"></NewsInfo>

        <section class="right-container">
            <el-form label-position="right" label-width="80px">
                <el-form-item label="标题">
                    <el-input v-model="model.title"></el-input>
                </el-form-item>
                <el-form-item label="封面图片">
                    <UploadImg :defaultImg="model.cover" :url="uploadImgUrl"
                               :on-success="uploadImgSucc"></UploadImg>
                </el-form-item>
                <el-form-item label="内容">
                    <textarea name="" id="" cols="30" rows="10" v-model="model.content"></textarea>
                </el-form-item>
            </el-form>
        </section>

        <el-button @click="save">保存</el-button>
    </article>
</template>

<script>
    // 获取测试数据
    //    function getTestData (index) {
    //        return {
    //            'title': index || Date.now(),
    //            'digest': '',
    //            'cover': '/upload/im/image/1/1492228225351392.png',
    //            'thumb': '/upload/im/image/1/1492228225351392t.png',
    //            'hits': 2,
    //            'source_url': 'http://demo.yst.vodjk.com/im/news/73',
    //        }
    //    }

    import NewsInfo from './components/NewsInfo.vue'
    import imService from '../../../services/imService'
    import UploadImg from '../../component/upload/UploadImg.vue'

    export default{
        name: 'im-ystassistant-material',
        data () {
            return {
                uploadImgUrl: '', // 上传图片的url
                articles: [],
                model: {
                    title: '',
                    cover: '',
                    thumb: '',
                    content: '',
                }
            }
        },
        created () {
            this.articles = this.$route.params.articles || []
            this.uploadImgUrl = imService.getNewsUploadImgUrl()
            xmview.setContentLoading(false)
        },
        methods: {
            itemClick(index, item) {
                console.info('点击每一项', index, item)
                this.model = item
            },
            save () {
                imService.addNews()
            },
            // 图片上传完毕的回调
            uploadImgSucc (res) {
                this.model.cover = res.data.url
                this.model.thumb = res.data.thumb
            }
        },
        components: {NewsInfo, UploadImg}
    }
</script>

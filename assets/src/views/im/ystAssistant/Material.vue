<!--素材信息-->
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
            height: 800px;
            width: 700px;
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
                    <UploadImg :defaultImg="model.thumb" :url="uploadImgUrl"
                               :on-success="uploadImgSucc"></UploadImg>
                </el-form-item>
                <el-form-item label="内容">
                    <UEditor ref="ue" v-model="model.content"></UEditor>
                </el-form-item>
                <el-form-item>
                    <el-button @click="save" type="primary">保存</el-button>
                </el-form-item>
            </el-form>
        </section>
    </article>
</template>

<script>
    import NewsInfo from './components/NewsInfo.vue'
    import imService from '../../../services/imService'
    import UploadImg from '../../component/upload/UploadImg.vue'
    import UEditor from '../../component/form/UEditor.vue'
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
                },
                id: void 0,
            }
        },
        created () {
            this.id = this.$route.query.id
            /* eslint-disable indent */
            this.articles = this.$route.params.articles || []
            this.uploadImgUrl = imService.getNewsUploadImgUrl()
            xmview.setContentLoading(false)
        },
        mounted () {

        },
        methods: {
            itemClick(index, item) {
                this.model = item
                this.$refs.ue && this.$refs.ue.setContent(item.content)
            },
            save () {
                let p = this.id ? imService.editNews(this.articles, this.id) : imService.addNews(this.articles)
                p.then(() => {
                    xmview.showTip('success', '保存成功')
                    // 跳转到列表页面
                    this.$router.back()
                })
            },
            // 图片上传完毕的回调
            uploadImgSucc (res) {
                this.model.cover = res.data.url
                this.model.thumb = res.data.thumb
            },
        },
        components: {NewsInfo, UploadImg, UEditor}
    }
</script>

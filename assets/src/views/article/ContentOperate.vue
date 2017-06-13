<style lang="scss" rel="stylesheet/scss">
    .article-content-operate {
        background: #fff;
        padding: 20px;
        .addForm {
            .dialog-footer {
                text-align: center;
            }
        }
    }
</style>
<template>
    <article class="article-content-operate">
        <!--添加/编辑表单-->
        <section class="addForm">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item prop="category" label="分类" :label-width="formLabelWidth">
                    <ArticleCategorySelect :placeholder="currCategoryName"
                                           v-model="form.category"></ArticleCategorySelect>
                </el-form-item>
                <el-form-item prop="title" label="标题" :label-width="formLabelWidth">
                    <el-input v-model="form.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="imgUrl" label="封面" :label-width="formLabelWidth">
                    <div class="img-wrap" v-if="form.cover">
                        <img :src="form.cover | fillImgPath" alt=""/>
                    </div>
                    <ImagEcropperInput :isRound="false" :aspectRatio="550/380" :confirmFn="cropperFn"
                                       class="upload-btn"></ImagEcropperInput>
                </el-form-item>
                <el-form-item prop="content" label="正文内容" id="editor" :label-width="formLabelWidth">
                    <vue-editor v-model="form.content" @ready="ueReady"></vue-editor>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit('form')">确 定</el-button>
                <el-button type="warning" @click="submit('form', 1)">存为草稿</el-button>
            </div>
        </section>
    </article>
</template>
<script>
    import VueEditor from '../component/form/UEditor.vue'
    import ArticleService from '../../services/articleService'
    import ArticleCategorySelect from '../component/select/ArticleCategory.vue'
    import ImagEcropperInput from '../component/upload/ImagEcropperInput.vue'
    import {fillImgPath} from '../../utils/filterUtils'
    export default {
        name: 'content-operate',
        data () {
            return {
                editor: null,
                currCategoryName: '',
                form: {                // 表单属性值
                    title: '',          // 标题
                    category: '',       // 分类
                    cover: '',        // 图片地址
                    content: '',         // 正文内容
                },
                rules: {
                    title: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    category: {type: 'number', required: true, message: '请选择栏目', trigger: 'change'}
                },
                formLabelWidth: '120px', // 表单label的宽度
            }
        },
        filters: {
            fillImgPath
        },
        components: {
            VueEditor,
            ArticleCategorySelect,
            ImagEcropperInput
        },
        computed: {
            articleID () {
                return this.$route.params.id
            }
        },
        created () {
            xmview.setContentLoading(false)
            if (isNaN(this.articleID)) return
            ArticleService.getEditDetail(this.articleID).then((ret) => {
                this.addForm = true
                this.form.category = ret.data.category_id
                this.form.title = ret.data.title
                this.form.cover = ret.data.cover
                this.form.content = ret.data.content
                this.form.id = ret.data.id
                this.currCategoryName = ret.category.name
                this.editor && this.editor.setContent(ret.data.content)
            })
        },
        methods: {
            cropperFn(data, ext) {
                ArticleService.ArticleUploadUrl({
                    avatar: data,
                    alias: `${Date.now()}.${this.ext}`
                }).then((ret) => {
                    xmview.showTip('success', '上传成功')
                    this.form.cover = ret.data.url // 显示图片
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            ueReady (ue) {
                this.editor = ue
            },
            submit (form, status = 0) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        if (!this.editor.getContentTxt()) {
                            xmview.showTip('error', '请填写正文内容')
                            return
                        }
                        this.form.content = this.editor.getContent()
                        this.form.draft = status
                        let reqFn = ArticleService.addArticle
                        let msg = '发布成功'
                        if (this.form.id) {
                            reqFn = ArticleService.updateArticle
                            msg = '修改成功'
                        }
                        reqFn(this.form).then((ret) => {
                            xmview.showTip('success', msg)
                            this.addForm = false
                            this.$router.push({name: 'article-content'})
                        }).catch((ret) => {
                            xmview.showTip('error', ret.message)
                        })
                    } else {
                        return false
                    }
                })
            },
        }
    }
</script>

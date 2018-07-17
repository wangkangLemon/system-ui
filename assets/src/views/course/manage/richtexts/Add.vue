<style lang="scss" rel="stylesheet/scss">
    .course-manage-richtexts-content-operate {
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
    <article class="course-manage-richtexts-content-operate">
        <!--添加/编辑表单-->
        <section class="addForm">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item prop="title" label="标题" :label-width="formLabelWidth">
                    <el-input v-model="form.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="content" label="正文内容" id="editor" :label-width="formLabelWidth">
                    <vue-editor v-model="form.content" @ready="ueReady"></vue-editor>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit('form', 21)">确 定</el-button>
                <el-button type="warning" @click="submit('form', 20)">存为草稿</el-button>
            </div>
        </section>
    </article>
</template>
<script>
    import VueEditor from 'components/form/UEditor.vue'
    import richtextService from 'services/course/richtextService'
    export default {
        name: 'content-operate',
        data () {
            return {
                editor: null,
                form: {                // 表单属性值
                    title: '',          // 标题
                    content: '',         // 正文内容
                },
                rules: {
                    title: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                },
                formLabelWidth: '120px', // 表单label的宽度
            }
        },
        components: {
            VueEditor,
        },
        computed: {
            articleID () {
                return this.$route.query.id
            }
        },
        created () {
            xmview.setContentLoading(false)
            if (isNaN(this.articleID)) return
            richtextService.get(this.articleID).then((ret) => {
                this.addForm = true
                this.form.title = ret.data.title
                this.form.content = ret.data.content
                this.form.id = ret.data.id
                this.editor && this.editor.setContent(ret.data.content)
            })
        },
        methods: {
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
                        this.form.status = status
                        let reqFn = richtextService.create
                        let msg = '发布成功'
                        if (this.form.id) {
                            reqFn = richtextService.edit
                            msg = '修改成功'
                        }
                        reqFn(this.form).then((ret) => {
                            xmview.showTip('success', msg)
                            this.addForm = false
                            this.$router.replace({name: 'course-manage-richtexts'})
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

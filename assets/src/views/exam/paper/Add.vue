<template>
    <div>
        <AddForm ref="form" :paper="form">
            <el-form-item slot="formFooter">
                <el-button type="primary" @click="submitForm">发布试卷</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </AddForm>
    </div>
</template>
<script>
    import AddForm from './Form.vue'
    import testPagerService from '../../../services/testPagerService'
    import Paper from '../../../models/paper'

    let paper = new Paper()
    paper.type = 'exam'

    export default {
        components: {AddForm},
        data() {
            return {
                form: paper
            }
        },
        activated () {
            xmview.setContentLoading(false)
        },
        methods: {
            submitForm() {
                this.$refs['form'].validateForm((pass) => {
                    if (!pass) {
                        return
                    }

                    let paper = Object.assign({}, this.form)
                    if (paper.answer_show_time instanceof Date) {
                        paper.answer_show_time = this.format(paper.answer_show_time, 'yyyy-MM-dd hh:mm:ss')
                    }

                    if (paper.id) {
                        testPagerService.update(paper.id, paper).then((ret) => {
                            let data = []
                            paper.questions.forEach((question) => {
                                data.push(question.format)
                            })
                            this.$message({
                                type: 'success',
                                message: '修改成功',
                            })
                        })
                    } else {
                        testPagerService.create(paper).then((ret) => {
                            let examId = ret.id
                            let data = []
                            paper.questions.forEach((question) => {
                                data.push(question.format)
                            })
                            testPagerService.batchCreateQuestion(examId, data).then((ret) => {
                                this.$message({
                                    type: 'success',
                                    message: '创建成功'
                                })
                            })
                        })
                    }
                })
            },
        }
    }
</script>

<template>
    <div>
        <EditForm ref="form" :paper="form">
            <el-form-item slot="formFooter">
                <el-button type="primary" @click="submitForm">更新试卷</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </EditForm>
    </div>
</template>
<script>
    import EditForm from './Form.vue'
    import Paper from '../../../models/paper'

    export default {
        name: 'exam-paper-edit',
        components: {EditForm},
        data() {
            let paper = new Paper()
            paper.findById(this.$route.params.exam_id)

            return {
                form: paper
            }
        },
        created () {
            xmview.setContentLoading(false)
        },
        methods: {
            submitForm() {
                this.$refs['form'].validateForm((pass) => {
                    if (!pass) {
                        xmview.showTip('error', '您填写的数据不对，请检查红色项')
                        return
                    }
                    this.form.save().then(() => {
                        xmview.showTip('success', '操作成功')
                        this.$router.push({name: 'test-paper-index'})
                    })
                })
            },
        }
    }
</script>

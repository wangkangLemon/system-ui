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

                    this.form.save().then(() => {
                        xmview.showTip('success', '操作成功')
                        this.$router.push({name: 'test-paper-index'})
                    })
                })
            },
        }
    }
</script>

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
        components: {EditForm},
        data() {
            let paper = new Paper()
            paper.findById(this.$route.params.exam_id)

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
                    this.form.save()
                })
            },
        }
    }
</script>

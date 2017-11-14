<template>
    <div>
        <AddForm ref="form" :paper="paper">
            <el-form-item slot="formFooter">
                <el-button type="primary" @click="submitForm">插入试卷</el-button>
            </el-form-item>
        </AddForm>
    </div>
</template>
<script>
    import AddForm from '../exam/paper/Form.vue'

    export default {
        components: {AddForm},
        props: {
            onSubmit: Function,
            paper: {
                type: Object,
                required: true
            }
        },
        methods: {
            submitForm() {
                this.$refs['form'].validateForm((pass) => {
                    if (!pass) {
                        return
                    }

                    this.onSubmit(this.paper)
                })
            },
        }
    }
</script>

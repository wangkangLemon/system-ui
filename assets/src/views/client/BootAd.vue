<!--启动广告-->
<style lang='scss' scoped rel='stylesheet/scss'></style>

<template>
    <article>
        <el-form :model="ruleForm" :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
            <el-form-item label="跳转链接" prop="logo_app_boot">
                <el-input type="password" v-model="ruleForm.logo_app_boot" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
                <el-button @click="resetForm('ruleForm2')">重置</el-button>
            </el-form-item>
        </el-form>
    </article>
</template>

<script lang='babel'>
    export default{
        data() {
            return {
                ruleForm: {
                    logo_app_boot: '',
                },
                rules: {
                    logo_app_boot: [
                        {required: true, message: '请输入跳转链接', trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            submitForm() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        alert('submit!')
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            }
        }
    }
</script>

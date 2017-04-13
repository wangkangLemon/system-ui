<!--修改密码-->
<style lang="scss">
    @import "../../utils/mixins/_mixins.scss";

    .user-password {
        background: #fff;
        padding:20px 200px;
        .subButton {
            text-align: center;
        }
    }
</style>
<template>
    <article class="user-password">
        <section class="submit-form">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="手机号码" :label-width="formLabelWidth">
                    {{form.mobile}}
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    {{form.email}}
                </el-form-item>
                <el-form-item label="所属企业" :label-width="formLabelWidth">
                    {{form.company}}
                </el-form-item>
                <el-form-item prop="origin_password" label="原密码" :label-width="formLabelWidth">
                    <el-input type="password" v-model="form.origin_password" placeholder="原密码" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="new_password" label="新密码" :label-width="formLabelWidth">
                    <el-input type="password" v-model="form.new_password" placeholder="新密码" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="re_password" label="确认密码" :label-width="formLabelWidth">
                    <el-input type="password" v-model="form.re_password" placeholder="确认密码" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item class="subButton">
                    <el-button type="primary" @click="submit('form')">提交修改</el-button>
                </el-form-item>
            </el-form>
        </section>
    </article>
</template>
<script>
    import mineService from '../../services/mineService'
    export default {
        data () {
            return {
                imgUrl: '',
                form: {
                    mobile: '',
                    email: '',
                    name: '',
                    address: '',
                    sex: 0
                },
                rules: {
                    name: {required: true, message: '必须填写', trigger: 'blur'},
                    address: {required: true, message: '必须填写', trigger: 'blur'}
                },
                formLabelWidth: '120px', // 表单label的宽度
            }
        },
        created () {
            // 获取个人信息
            mineService.getProfile().then((ret) => {
                this.form = ret
            }).then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            // 裁切后的回调
            cropperFn(data) {
                this.imgUrl = data
                mineService.uploadAvatar({
                    avatar: data,
                    alias: Date.now() + '.jpg'
                }).then(() => {
                    xmview.showTip('success', '上传成功')
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            submit (form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        mineService.updateProfile(this.form).then(() => {
                            xmview.showTip('success', '修改成功')
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

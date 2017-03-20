<style lang='scss' scoped rel="stylesheet/scss">
    @import "../../utils/mixins/mixins";

    .login-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #666 url("./images/bg.jpg") no-repeat;
        background-size: cover;
        .login-mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);

            .content {
                margin-top: 15%;
                .login-header {
                    width: 90%;
                    margin-bottom: 15%;
                    img {
                        width: 28px;
                        height: 28px;
                        margin-right: 5%;
                    }
                    * {
                        color: #fff;
                    }
                    h1 {
                        font-weight: normal;
                        font-size: 22px;
                        * {
                            display: inline-block;
                            vertical-align: top;
                        }
                    }
                    p {
                        font-size: 12px;
                    }
                    > i {
                        float: right;
                        margin-top: 5%;
                    }
                }
                .form {
                    margin-top: px2rem(30);
                    border-radius: 5px;
                    padding: px2rem(40) 0;
                    padding-top: px2rem(10);
                    background: rgba(0, 0, 0, 0.6);
                    width: 100%;
                    display: block;
                    margin: 0 auto !important;
                    text-align: center;
                    > * {
                        display: block;
                        margin: 0 auto;
                        width: 80%;
                        margin-top: px2rem(30);
                    }
                    .submit {
                        width: 100%;
                    }
                }
                @media (max-width: 767px) {
                    .login-header {
                        margin-bottom: 20%;
                        > div {
                            width: 50%;
                        }
                    }
                    .form {
                        > * {
                            margin-top: px2rem(60);
                        }
                        padding-bottom: px2rem(80);
                    }
                }
            }
        }
    }
</style>

<template>
    <article class="login-container">
        <section class="login-mask">
            <el-row :gutter="10" type="flex" justify="center">
                <el-col :xs="23" :sm="13" :md="10" :lg="6" class="content">
                    <div class="login-header">
                        <el-col :offset="2" :span="10" class="title">
                            <h1><img src="../images/logo.png"/>药视通 </h1>
                            <p>登录到系统管理平台</p>
                        </el-col>
                        <i class="el-icon-d-arrow-right"></i>
                    </div>
                    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" class="demo-ruleForm form">
                        <el-form-item prop="account">
                            <el-input size="large" placeholder="手机号或邮箱" type="text" v-model="ruleForm2.account"
                                      auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item prop="checkPass">
                            <el-input size="large" placeholder="管理密码" type="password" v-model="ruleForm2.checkPass"
                                      auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="submit" type="primary" @click="submitForm('ruleForm2')">登录</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </section>
    </article>
</template>

<script lang='babel'>
    import {login} from '../../services/userService'
    import authUtils from '../../utils/authUtils'
    export default {
        data () {
            var validateAccount = (rule, value, callback) => {
                let newValue = value || ''
                if (newValue === '') {
                    callback(new Error('请输入手机号或邮箱'))
                }
                if (newValue.indexOf('@') != -1) {
                    if (!newValue.match(/^\w+([-+.]\w+)*@\w+([-+.]\w+)*.\w+([-+.]\w+)*$/)) {
                        callback(new Error('请输入正确的邮箱'))
                    }
                } else {
                    if (!newValue.match(/^1[34578]\d{9}$/)) {
                        callback(new Error('请输入正确的手机号'))
                    }
                }
                if (this.ruleForm2.checkPass !== '') {
                    this.$refs.ruleForm2.validateField('checkPass')
                }
                callback()
            }
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入管理员密码'))
                }
                callback()
            }
            return {
                ruleForm2: {
                    account: '',
                    checkPass: ''
                },
                rules2: {
                    account: [
                        {validator: validateAccount, trigger: 'blur'}
                    ],
                    checkPass: [
                        {validator: validatePass2, trigger: 'blur'}
                    ]
                }
            }
        },
        created () {
            console.info(this.$route.params, 'lloginvue')
        },
        methods: {
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // 请求接口
                        login(this.ruleForm2.account, this.ruleForm2.checkPass).then((ret) => {
                            authUtils.setAuthToken(ret.auth_token)
                            setTimeout(() => {
                                // 判断是否需要回到上个页面
                                if (this.$route.query.returnUrl) {
                                    window.location.href = this.$route.query.returnUrl
                                } else {
                                    this.$router.replace({name: 'index'})
                                }
                            }, 200)
                        }).catch((ret) => {
                        }).then(() => {
                            xmview.setLoading(false)
                        })
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            }
        }
    }
</script>

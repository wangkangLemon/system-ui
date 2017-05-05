<style lang='scss' rel="stylesheet/scss">
    @import "../../utils/mixins/mixins";

    .login-container {
        position: fixed;
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
            background: rgba(0, 0, 0, 0.4);
            .content {
                margin-top: px2rem(100);
                .login-header {
                    position: relative;
                    width: 90%;
                    margin-bottom: 80px;
                    img {
                        width: 28px;
                        height: 28px;
                        margin-right: 5%;
                    }
                    * {
                        color: #fff;
                        font-weight: 300;
                    }
                    h1 {
                        font-size: 22px;
                        * {
                            display: inline-block;
                            vertical-align: top;
                        }
                    }
                    p {
                        margin-top: 5px;
                        font-size: 14px;
                    }
                    .icon {
                        position: absolute;
                        right: 0;
                        top: 0;
                        opacity: .4;
                        filter: alpha(opacity=40);
                    }
                    .icon > i {
                        font-size: 50px;
                        line-height: 52px;
                        color: #ccc;
                    }
                }
                .form {
                    border-radius: 5px;
                    padding: 30px 0;
                    background: rgba(0, 0, 0, 0.4);
                    width: 100%;
                    display: block;
                    margin: 0 auto !important;
                    text-align: center;
                    > * {
                        display: block;
                        margin: 0 auto;
                        width: 80%;
                        margin-top: px2rem(15);
                        &:first-of-type {
                            margin-top: 0;
                        }
                    }
                    input {
                        background: rgba(0, 0, 0, 0.4);
                        color: #fff;
                        border: none;
                    }
                    input:focus {
                        box-shadow: none;
                    }
                    ::-webkit-input-placeholder {
                        color: #999;
                    }
                    .submit {
                        width: 100%;
                    }
                }
            }
            @media (max-width: 767px) {
                .content {
                    margin-top: 20px;
                    .login-header {
                        > div {
                            width: 50%;
                        }
                    }
                    .form {
                        padding: px2rem(80) 0;
                        > * {
                            margin-top: px2rem(60);
                        }
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
                        <el-col :offset="1" :span="20" class="title">
                            <h1><img src="../images/logo.png"/>药视通 </h1>
                            <p>登录到系统管理平台</p>
                        </el-col>
                        <div class="icon">
                            <i class="iconfont icon-signin"></i>
                        </div>
                    </div>
                    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" class="demo-ruleForm form">
                        <el-form-item prop="account">
                            <el-input size="large" placeholder="手机号或邮箱" type="text" v-model="ruleForm2.account"
                                      auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item prop="checkPass">
                            <!--<el-input size="large" placeholder="管理密码" type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>-->
                            <div class="el-form-item">
                                <div class="el-form-item__content">
                                    <div class="el-input el-input--large">
                                        <input type="password" v-model="ruleForm2.checkPass" placeholder="管理密码"
                                               @keyup.enter="submitForm('ruleForm2')" autocomplete="off"
                                               class="el-input__inner">
                                    </div>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="submit" type="primary" @click="submitForm('ruleForm2')"
                                       :disabled="logining">
                                <i v-if="logining">登录中...</i>
                                <i v-else>登录</i>
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </section>
    </article>
</template>

<script>
    import {login} from '../../services/userService'
    import authUtils from '../../utils/authUtils'
    import treeUtls from '../../utils/treeUtils'

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
                },
                logining: false, // 是否正在登录
            }
        },
        created () {
            authUtils.clearAuthRefreshToken()
            authUtils.clearAuthInfo()
            xmview.setLoading(false)
        },
        beforeDestroy () {
            xmview.closeAllTip()
        },
        methods: {
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.logining = true
                        // 请求接口
                        login(this.ruleForm2.account, this.ruleForm2.checkPass).then((ret) => {
                            authUtils.setNavMenu(treeUtls.arr2Tree(ret.auth_menu)) // 保存菜单
                            authUtils.setAuthToken(ret.auth_token) // 保存token
                            authUtils.setUserInfo(ret.auth_user) // 保存用户信息
                            xmview.showTip('success', '登录成功, 正在跳转...', 1e9)
                            setTimeout(() => {
                                // 如果需要二次登录
                                if (ret.need_two_step || !authUtils.getTwiceToken()) {
                                    this.$router.replace({name: 'login-twice'})
                                } else if (this.$route.query.returnUrl) {  // 判断是否需要回到上个页面
                                    window.location.href = this.$route.query.returnUrl
                                } else {
//                                    this.$router.replace({name: 'main'})
                                    // 拿到左边的叶子节点
                                    let item = treeUtls.arr2Tree(ret.auth_menu)[0]
                                    while (item.children && item.children.length > 0)
                                        item = item.children[0]
//                                    window.location = item.item.menu_url
                                    this.$router.push({path: item.item.menu_url})
                                }
                            }, 400)
                        }).catch((ret) => {
                            this.logining = false
                        }).then(() => {
                            xmview.setLoading(false)
                        })
                    } else {
                        return false
                    }
                })
            }
        }
    }
</script>

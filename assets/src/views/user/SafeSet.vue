<!--安全设置-->
<style lang='scss' rel='stylesheet/scss'>
    #user-sefeset-container {
        .el-card__header {
            background: #f8f8f8;
            padding: 10px;
        }

        .content-container {
            > section {
                font-size: 13px;
                color: #333;
                margin-bottom: 25px;
                &:last-of-type {
                    margin-bottom: 0;
                }

                > * {
                    display: inline-block;
                    vertical-align: top;
                }

                > i {
                    padding-top: 5px;
                    width: 7em;
                    text-align: right;
                }
                > div {
                    margin-left: 20px;
                    > div {
                        margin-top: 5px;
                        color: #666;
                    }
                }
            }
        }
    }
</style>

<template>
    <article id="user-sefeset-container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>二次验证</span>
            </div>
            <article class="content-container">
                <section>
                    <i>
                        <el-tag type="danger">推荐</el-tag>
                        微信:
                    </i>
                    <div>
                        <span>
                            <el-tag type="gray">未绑定</el-tag>
                            <el-button type="text">绑定</el-button>
                        </span>
                        <div>绑定后，登录药视通平台可用绑定微信账号扫码进行安全验证。</div>
                    </div>
                </section>
                <section>
                    <i>手机号码:</i>
                    <div>
                        <span v-if="!sms || !sms.data">
                            <el-tag type="gray">未绑定</el-tag>
                            <el-button type="text">绑定</el-button>
                        </span>
                        <span v-else>
                            <el-tag type="primary">已绑定手机号码: {{sms.data}}</el-tag>
                            <el-button type="text">更换</el-button>
                        </span>
                        <div>绑定后，登录药视通平台用该手机号码接收登录验证码。</div>
                    </div>
                </section>
                <section>
                    <i>电子邮件:</i>
                    <div>
                        <span v-if="!email || !email.data">
                            <el-tag type="gray">未绑定</el-tag>
                            <el-button type="text" @click="bindEmail">绑定</el-button>
                        </span>
                        <span v-else>
                            <el-tag type="primary">已绑定电子邮箱: {{email.data}}</el-tag>
                            <el-button type="text" @click="changeEmail">更换</el-button>
                        </span>
                        <div>绑定后，登录药视通平台可用该邮箱接收登录验证码。</div>
                    </div>
                </section>
            </article>
        </el-card>

        <el-dialog :title="dialog.title" v-model="dialog.isShow" size="tiny">
            <el-form label-width="80px">
                <el-form-item :label="dialog.showKey">
                    <el-input auto-complete="off" v-show="dialog.type == 0"
                              :placeholder="dialog.placeholder"></el-input>
                    <i v-show="dialog.type == 1">{{dialog.showVal}}</i>
                </el-form-item>
                <el-form-item label="验证码">
                    <div style="display: inline-block;width: 60%">
                        <el-input placeholder="输入验证码"></el-input>
                    </div>
                    <el-button @click="dialog.sendValidcode">发送验证码</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button @click="bindFn" type="primary">确定</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <span>如果您已绑定电子邮箱无法接收验证码，请联系我们：400-686-5262</span>
            </div>
        </el-dialog>
    </article>
</template>

<script>
    import twoStepService from '../../services/twoStepService'

    export default {
        data () {
            return {
                email: {},
                sms: {},
                wechat: {},
                fetchParam: {
                    type: 'email',
                    code: '',
                    receiver: ''
                },
                dialog: {
                    title: '更换',
                    isShow: false,
                    confirmFn: {},
                    type: 0, // 0 绑定 1-更换
                    showKey: '电子邮箱', // 显示的key
                    showVal: '24xxx@qq.com', // 显示的val
                    placeholder: '', // 文本框的placeholder
                    sendValidcode: {}, //  发送验证码
                },
            }
        },
        created () {
            twoStepService.getSafeSetInfo().then((ret) => {
                this.sms = ret.sms
                this.sms.data = processMobile(this.sms.data)

                this.email = ret.email
                this.email.data = processEmail(this.email.data)
                xmview.setContentLoading(false)
            })
        },
        methods: {
            // 更换邮箱
            changeEmail () {
                this.fetchParam.type = 'email'
                this.dialog.isShow = true
                this.dialog.sendValidcode = twoStepService.sendEmailValidcode
            },
            // 绑定邮箱
            bindEmail () {
                this.fetchParam.type = 'email'
                let dialog = this.dialog
                dialog.isShow = true
                dialog.title = '绑定电子邮箱'
                dialog.showKey = '电子邮箱'
                dialog.placeholder = '请输入要绑定的电子邮箱'
                dialog.sendValidcode = twoStepService.sendEmailValidcode
            },
            bindFn () {
                twoStepService.bindOrChange(this.fetchParam).then(() => {
                    this.dialog.isShow = false
                    xmview.showTip('success', '操作成功')
                })
            }
        },
        components: {}
    }

    function processEmail (str) {
        if (!str) return str
        let first = str.split('@')[0]
        return `${first[0]}***${first[first.length - 1]}@${str.split('@')[1]}`
    }

    function processMobile (mobile) {
        if (!mobile) return

        return `${mobile.slice(0, 3)}****${mobile.slice(-4, mobile.length)}`
    }
</script>

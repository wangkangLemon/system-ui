<!--二次验证-->
<style lang='scss' rel='stylesheet/scss'>
    #login-twice {
        position: absolute;
        min-height: 100%;
        width: 100%;
        background: #d9e0e7;

        > * {
            width: 500px;
            margin: 0 auto;
        }
        h5 {
            margin-top: 35px;
            text-align: right;
        }

        .el-card__header {
            padding: 10px;
            background: #f8f8f8;
        }
    }
</style>

<template>
    <article id="login-twice">
        <h5>
            <i>高会军，</i>
            <el-button type="text" @click="$router.replace({name:'login'})">切换账号</el-button>
        </h5>

        <el-card class="box-card">
            <div slot="header" class="head">
                <i>二次验证</i>
            </div>
            <div>
                <el-tabs type="card" value="first">
                    <el-tab-pane label="微信扫码登录" name="first">
                        <div></div>
                    </el-tab-pane>
                    <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
                </el-tabs>
            </div>
        </el-card>
    </article>
</template>

<script>
    import wechatSdk from '../../vendor/wechatSdk'
    import twoStepService from '../../services/twoStepService'

    export default{
        data () {
            return {
                wechatUrl: ''
            }
        },
        created () {
            // 获取微信的登录url
            twoStepService.getWechatLoginConfig().then((ret) => {
                wechatSdk.initLogin(Object.assign({}, ret))
                xmview.setContentLoading(false)
            })
        },
        activated () {
        },
        methods: {},
        components: {}
    }
</script>

<!--日志-->
<template>
    <article>
        <el-tabs v-model="defaultTab"  type="border-card" @tab-click="tabClick">
            <el-tab-pane label="系统管理操作" name="1">
                <SystemManage></SystemManage>
            </el-tab-pane>
            <el-tab-pane label="企业管理" name="2">
                <CompanyManage></CompanyManage>
            </el-tab-pane>
            <el-tab-pane label="系统后台登录" name="3">
                <SystemBack></SystemBack>
            </el-tab-pane>
            <el-tab-pane label="企业后台登录" name="4">
                <CompanyBack></CompanyBack>
            </el-tab-pane>
            <el-tab-pane label="前台登录" name="5">
                <FrontDest></FrontDest>
            </el-tab-pane>
            <el-tab-pane label="手机验证码" name="6">
                <MobileCode></MobileCode>
            </el-tab-pane>
            <el-tab-pane label="邮件验证码" name="7">
                <EmailCode></EmailCode>
            </el-tab-pane>
            <el-tab-pane label="操作行为" name="8">
                <OperationBehavior></OperationBehavior>
            </el-tab-pane>
        </el-tabs>
    </article>
</template>
<script>
    import SystemManage from './logSub/SystemManage.vue'
    import CompanyManage from './logSub/CompanyManage.vue'
    import SystemBack from './logSub/SystemBack.vue'
    import CompanyBack from './logSub/CompanyBack.vue'
    import FrontDest from './logSub/FrontDest.vue'
    import MobileCode from './logSub/MobileCode.vue'
    import EmailCode from './logSub/EmailCode.vue'
    import OperationBehavior from './logSub/OperationBehavior.vue'
    export default {
        components: {
            SystemManage,
            CompanyManage,
            SystemBack,
            CompanyBack,
            FrontDest,
            MobileCode,
            EmailCode,
            OperationBehavior
        },
        data () {
            return {}
        },
        watch: {
            '$route' () {
                xmview.setContentLoading(false)
            }
        },
        computed: {
            defaultTab () {
                return this.$route.query.tabIndex || '1'
            }
        },
        activated () {
            xmview.setContentLoading(false)
        },
        methods: {
            tabClick (target) {
                this.$router.replace({name: 'sys-log', query: {tabIndex: target.name}})
            }
        }
    }
</script>

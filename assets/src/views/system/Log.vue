<!--日志-->
<template>
    <article>
        <el-tabs v-model="defaultTab"  type="border-card" @tab-click="tabClick">
            <el-tab-pane
                    v-for="(item, index) in menu"
                    :label="item.title"
                    :name="item.name">
                <router-view></router-view>
            </el-tab-pane>
        </el-tabs>
    </article>
</template>
<script lang="babel">
    export default {
        data () {
            return {
                menu: [
                    {
                        title: '系统管理操作',
                        name: '1'
                    },
                    {
                        title: '企业管理操作',
                        name: '2'
                    },
                    {
                        title: '系统后台登录',
                        name: '3'
                    },
                    {
                        title: '企业后台登录',
                        name: '4'
                    },
                    {
                        title: '前台登录',
                        name: '5'
                    },
                    {
                        title: '手机验证码',
                        name: '6'
                    },
                    {
                        title: '邮件验证码',
                        name: '7'
                    }
                ],
            }
        },
        computed: {
            defaultTab () {
                return this.$route.query.tabIndex || '1'
            }
        },
        mounted () {
            this.$router.push({name: 'systemManage', query: {tabIndex: '1'}})
        },
        methods: {
            tabClick (target) {
                let urlArr = ['', 'systemManage', 'companyManage', 'systemBack', 'companyBack', 'frontDest', 'mobileCode', 'emailCode']
                this.$router.push({name: urlArr[parseInt(target.name)], query: {tabIndex: target.name}})
            }
        }
    }
</script>

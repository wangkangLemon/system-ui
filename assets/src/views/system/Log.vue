<!--日志-->
<template>
    <article>
        <el-tabs v-model="defaultTab"  type="border-card" @tab-click="tabClick">
            <el-tab-pane
                    v-for="(item, index) in menu"
                    :label="item.title"
                    :name="item.name"
                    :key="item.id">
            </el-tab-pane>
            <router-view></router-view>
        </el-tabs>
    </article>
</template>
<script lang="babel">
    export default {
        data () {
            return {
                menu: [
                    {
                        id: 1,
                        title: '系统管理操作',
                        name: '1'
                    },
                    {
                        id: 2,
                        title: '企业管理操作',
                        name: '2'
                    },
                    {
                        id: 3,
                        title: '系统后台登录',
                        name: '3'
                    },
                    {
                        id: 4,
                        title: '企业后台登录',
                        name: '4'
                    },
                    {
                        id: 5,
                        title: '前台登录',
                        name: '5'
                    },
                    {
                        id: 6,
                        title: '手机验证码',
                        name: '6'
                    },
                    {
                        id: 7,
                        title: '邮件验证码',
                        name: '7'
                    },
                    {
                        id: 8,
                        title: '操作行为记录',
                        name: '8'
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
                let urlArr = ['', 'systemManage', 'companyManage', 'systemBack', 'companyBack', 'frontDest', 'mobileCode', 'emailCode', 'operationBehavior']
                this.$router.push({name: urlArr[parseInt(target.name)], query: {tabIndex: target.name}})
            }
        }
    }
</script>

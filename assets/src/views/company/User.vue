<!--店员-->
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
<script>
    export default {
        data () {
            return {
                menu: [
                    {
                        id: 1,
                        title: '店员列表',
                        name: '1'
                    },
                    {
                        id: 2,
                        title: '连锁统计',
                        name: '2'
                    },
                    {
                        id: 3,
                        title: '地域统计',
                        name: '3'
                    }
                ],
            }
        },
        computed: {
            defaultTab () {
                return this.$route.query.tabIndex || '1'
            }
        },
        activated () {
            this.$router.push({name: 'company-user-list', query: {tabIndex: '1'}})
        },
        methods: {
            tabClick (target) {
                let urlArr = ['', 'company-user-list', 'company-user-department', 'company-user-area']
                this.$router.push({name: urlArr[parseInt(target.name)], query: {tabIndex: target.name}})
            }
        }
    }
</script>

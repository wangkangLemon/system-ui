<!--店员-->
<template>
    <article>
        <el-tabs v-model="defaultTab"  type="border-card" @tab-click="tabClick">
            <el-tab-pane label="店员列表" name="1">
                <UserlistComponent></UserlistComponent>
            </el-tab-pane>
            <el-tab-pane label="连锁统计" name="2">
                <DepartmentComponent></DepartmentComponent>
            </el-tab-pane>
            <el-tab-pane label="地域统计" name="3">
                <AreaComponent></AreaComponent>
            </el-tab-pane>
        </el-tabs>
    </article>
</template>
<script>
    import AreaComponent from './usercomponent/Area.vue'
    import DepartmentComponent from './usercomponent/Department.vue'
    import UserlistComponent from './usercomponent/List.vue'
    export default {
        components: {
            AreaComponent,
            DepartmentComponent,
            UserlistComponent
        },
        data () {
            return {}
        },
        computed: {
            defaultTab () {
                return this.$route.query.tabIndex || '1'
            }
        },
        watch: {
            '$route' () {
                xmview.setContentLoading(false)
            }
        },
        activated () {
            xmview.setContentLoading(false)
        },
        methods: {
            tabClick (target) {
                this.$router.replace({name: 'company-user', query: {tabIndex: target.name}})
            }
        }
    }
</script>

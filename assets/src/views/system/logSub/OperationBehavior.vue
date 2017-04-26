<!--日志-操作行为-->
<style>

</style>

<template>
    <article class="system-manage">
        <el-card class="box-card">
            <section class="search">
                Search...
            </section>
            <el-table
                    v-loading="loading"
                    border
                    @row-click="fullBehaviorChain"
                    :data="listData">
                <el-table-column
                        prop="user_name"
                        label="管理员"
                        width="130">
                </el-table-column>
                <el-table-column
                        prop="company_name"
                        label="企业名称">
                </el-table-column>
                <el-table-column
                        prop="role_name"
                        label="权限级别"
                        width="130">
                </el-table-column>
                <el-table-column
                        prop="action"
                        label="行为类型"
                        width="130">
                </el-table-column>
                <el-table-column
                        prop="from"
                        label="触发行为">
                </el-table-column>
                <el-table-column
                        prop="remote_address"
                        label="IP 地址"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        label="创建时间">
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[15, 30, 60, 100]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next"
                        :total="total">
                </el-pagination>
            </div>
        </el-card>
        <BehaviorChain ref="behaviorChain"></BehaviorChain>
    </article>
</template>

<script>
    import logService from '../../../services/logService'
    import BehaviorChain from './component/BehaviorChain.vue'

    export default {
        components: {
            BehaviorChain
        },
        data () {
            return {
                listData: [],
                total: 0,
                currentPage: 1,
                pageSize: 15,
            }
        },
        created () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            handleSizeChange (val) {
                this.pageSize = val
                this.getData()
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getData()
            },
            getData() {
                this.loading = true
                let params = {
                    page: this.currentPage,
                    page_size: this.pageSize
                }
                return logService.getBehaviorList(params).then((ret) => {
                    this.listData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            },
            fullBehaviorChain(item) {
                this.$refs.behaviorChain.setRecord(item.id)
                this.$refs.behaviorChain.getData()
            }
        }
    }
</script>

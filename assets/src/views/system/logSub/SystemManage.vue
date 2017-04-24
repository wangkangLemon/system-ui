<!--日志-系统管理-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/topSearch";
    .system-manage {
        .box-card {
            margin-bottom: 20px;
            .clearfix {
                text-align: right;
            }
            .el-card__header {
                padding: 10px 15px;
                background: #f0f3f5;
                .icon-iconfontexcel {
                    position: relative;
                    top: -2px;
                    margin-right: 5px;
                }
            }
            .search {
                @extend %top-search-container;
            }
        }
        .block {
            text-align: right;
            margin-top: 15px;
        }
    }
</style>
<template>
    <article class="system-manage">
        <el-card class="box-card">
            <section class="search">
                <AdminSelect v-model="search.admin_id" :change="getData"></AdminSelect>
                <section>
                    <i>操作IP</i>
                    <el-input @change="getData" v-model="search.ip"></el-input>
                </section>
                <DateRange title="操作时间" :start="search.time_start" :end="search.time_end"
                v-on:changeStart="val=> search.time_start=val "
                v-on:changeEnd="val=> search.time_end=val "
                :change="getData"></DateRange>
            </section>
            <el-table
                    v-loading="loading"
                    border
                    :data="listData">
                <el-table-column
                        prop="owner_name"
                        label="管理员"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="action_name"
                        label="操作"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="target_type"
                        label="目标类型">
                </el-table-column>
                <el-table-column
                        prop="create_ip"
                        label="操作IP">
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        label="操作时间">
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
    </article>
</template>
<script lang="babel">
    import logService from '../../../services/logService'
    import DateRange from '../../component/form/DateRangePicker.vue'
    import AdminSelect from '../../component/select/Admin.vue'
    export default {
        components: {
            DateRange,
            AdminSelect
        },
        data () {
            return {
                loading: false,
                currentPage: 1,
                pageSize: 15,
                listData: [],
                total: 0,
                search: {
                    admin_id: '',
                    ip: '',
                    time_start: '',
                    time_end: ''
                }
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
            getData () {
                this.loading = true
                let params = {
                    page: this.currentPage,
                    page_size: this.pageSize,
                    admin_id: this.search.admin_id,
                    ip: this.search.ip,
                    time_start: this.search.time_start,
                    time_end: this.search.time_end
                }
                return logService.getSystemManageList(params).then((ret) => {
                    this.listData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            },
        }
    }
</script>

<!--打卡-->
<style lang="scss" rel="stylesheet/scss">
    .analysis-company-attendance {
        .box-card {
            margin-top: 20px;
            .el-card__header {
                padding: 10px 15px;
                background: #f0f3f5;
            }
            .block {
                text-align: right;
                margin-top: 15px;
            }
        }
    }
</style>
<template>
    <article class="analysis-company-attendance">
        <el-card class="box-card">
            <el-table
                    v-loading="loading"
                    border
                    :data="attendanceData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="title"
                        min-width="300"
                        label="企业">
                </el-table-column>
                <el-table-column
                        prop="company"
                        width="170"
                        label="第一次使用时间">
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        width="170"
                        label="最后使用时间">
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
<script>
    export default {
        data () {
            return {
                loading: false,
                attendanceData: [],
                currentPage: 1,
                pageSize: 15,
                total: 0
            }
        },
        created () {
            xmview.setContentLoading(false)
        },
        methods: {
            handleSizeChange (val) {
                this.pageSize = val
            },
            handleCurrentChange (val) {
                this.currentPage = val
            },
            getData () {
                console.log(1)
            }
        }
    }
</script>

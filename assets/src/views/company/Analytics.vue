<!--统计-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../utils/mixins/mixins";
    .company-manager {
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
        }
        .block {
            text-align: right;
            margin-top: 15px;
        }
    }
</style>
<template>
    <article class="company-manager">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-button><i class="iconfont icon-iconfontexcel"></i>导出Excel</el-button>
            </div>
            <el-table
                    v-loading="loading"
                    border
                    :data="statData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="date"
                        label="月份">
                </el-table-column>
                <el-table-column
                        prop="company"
                        label="新增企业"
                        width="180">
                </el-table-column>
                <el-table-column
                        width="180"
                        prop="ent"
                        label="新增工业">
                </el-table-column>
                <el-table-column
                        width="180"
                        prop="store"
                        label="新增连锁">
                </el-table-column>
                <el-table-column
                        width="180"
                        prop="department"
                        label="新增门店">
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
    import companyService from '../../services/companyService'
    export default {
        data () {
            return {
                loading: false,
                currentPage: 1,
                pageSize: 10,
                statData: [],
                total: 0,
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
                    page_size: this.pageSize
                }
                return companyService.getStatList(params).then((ret) => {
                    this.statData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            },
        }
    }
</script>

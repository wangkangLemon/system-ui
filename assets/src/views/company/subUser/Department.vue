<!--店员-连锁统计-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/topSearch";
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
    <article class="company-manager">
        <el-card class="box-card">
            <section class="search">
                <section>
                    <i>统计时间</i>
                    <el-date-picker
                            @change="getData"
                            v-model="searchParams.staticTime"
                            type="date"
                            :placeholder="searchParams.currentDate">
                    </el-date-picker>
                </section>
            </section>
            <el-table
                    v-loading="loading"
                    border
                    :data="historyData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="name"
                        label="连锁">
                </el-table-column>
                <el-table-column
                        prop="increased"
                        label="新增店员"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="tested"
                        label="参与考试店员">
                </el-table-column>
                <el-table-column
                        prop="total"
                        label="当前店员总数">
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
    import {history} from '../../../services/fianace/finance'
    import {date2Str} from '../../../utils/timeUtils'
    export default {
        data () {
            return {
                loading: false,
                currentPage: 1,
                pageSize: 10,
                historyData: [],
                total: 0,
                searchParams: {
                    staticTime: '',
                    currentDate: date2Str(new Date())
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
                    course_id: this.courseSelect,
                    company_id: this.companySelect,
                    time_start: date2Str(this.createTime),
                    time_end: date2Str(this.endTime),
                    user_id: this.userSelect
                }
                return history(params).then((ret) => {
                    this.historyData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            },
        }
    }
</script>

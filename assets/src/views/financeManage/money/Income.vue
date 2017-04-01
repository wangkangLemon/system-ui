<style lang="scss" rel='stylesheet/scss'>
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/topSearch";
    .financeManage-finance-history {
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
    <article class="financeManage-finance-history">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-button @click="exportData"><i class="iconfont icon-iconfontexcel"></i>导出Excel</el-button>
            </div>
            <section class="search">
                <IndustryCompanySelect v-model="companySelect"
                                       v-on:change="val=>companySelect=val"
                                       :change="getData">
                </IndustryCompanySelect>
                <course-list v-model="courseSelect"
                             v-on:change="val=>courseSelect=val"
                             :change="getData">
                </course-list>
                <UserList v-model="userSelect"
                          v-on:change="val=>userSelect=val"
                          :change="getData">
                </UserList>
                <DateRange title="创建时间" :start="createTime" :end="endTime"
                           v-on:changeStart="val=> createTime=val"
                           v-on:changeEnd="val=> endTime"
                           :change="getData">
                </DateRange>
            </section>
            <el-table
                    v-loading="loading"
                    border
                    :data="historyData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="user_name"
                        label="用户">
                </el-table-column>
                <el-table-column
                        prop="money"
                        label="金额"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="ent_name"
                        label="工业">
                </el-table-column>
                <el-table-column
                        prop="course_name"
                        label="课程">
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
    </article>
</template>
<script lang="babel">
    import {history, exportData} from '../../../services/fianace/money'
    import {date2Str} from '../../../utils/timeUtils'
    import IndustryCompanySelect from '../../component/select/IndustryCompany'
    import CourseList from '../../component/select/Course'
    import UserList from '../../component/select/User'
    import DateRange from '../../component/form/DateRangePicker.vue'
    export default {
        components: {
            IndustryCompanySelect,
            CourseList,
            UserList,
            DateRange
        },
        data () {
            return {
                loading: false,
                companySelect: '',
                courseSelect: '',
                userSelect: '',
                createTime: '',
                endTime: '',
                currentPage: 1,
                pageSize: 10,
                historyData: [],
                total: 0
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
            getData () { // 获取列表数据
                this.loading = true
                let params = {
                    page: this.currentPage,
                    page_size: this.pageSize,
                    course_id: this.courseSelect,
                    enterprise_id: this.companySelect,
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
            exportData () { // 导出数据
                exportData({
                    company_id: this.companySelect,
                    time_start: date2Str(this.createTime),
                    time_end: date2Str(this.endTime),
                    user_id: this.userSelect
                }).then((ret) => {
                    console.log(ret)
                })
            }
        }
    }
</script>

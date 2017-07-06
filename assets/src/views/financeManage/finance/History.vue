<!--流水-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";
    .financeManage-finance-history {
        @extend %content-container;
        .header-button {
            @extend %right-top-btnContainer;
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
        .block {
            text-align: right;
            margin-top: 15px;
        }
    }
</style>
<template>
    <article class="financeManage-finance-history">
        <div class="header-button">
            <el-button type="primary" @click="exportData"><i class="iconfont icon-iconfontexcel"></i>导出Excel</el-button>
        </div>
        <section class="search">
            <section>
                <i>企业</i>
                <IndustryCompanySelect v-model="fetchParam.companySelect"
                                       v-on:change="val=>fetchParam.companySelect=val"
                                       :change="getData">
                </IndustryCompanySelect>
            </section>
            <section>
                <i>课程</i>
                <course-list v-model="fetchParam.courseSelect"
                             v-on:change="val=>fetchParam.courseSelect=val"
                             :change="getData">
                </course-list>
            </section>
            <section>
                <i>用户</i>
                <UserList v-model="fetchParam.userSelect"
                          v-on:change="val=>fetchParam.userSelect=val"
                          :change="getData">
                </UserList>
            </section>
            <DateRange title="创建时间" :start="fetchParam.createTime" :end="fetchParam.endTime"
                       v-on:changeStart="val=>fetchParam.createTime=val"
                       v-on:changeEnd="val=>fetchParam.endTime=val"
                       :change="getData">
            </DateRange>
        </section>
        <el-table
                v-loading="loading"
                border
                :data="historyData"
                stripe>
            <el-table-column
                    min-width="200"
                    prop="tradeno"
                    label="流水号">
            </el-table-column>
            <el-table-column
                    prop="ent_name"
                    label="企业"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="course_name"
                    width="180"
                    label="课程">
            </el-table-column>
            <el-table-column
                    prop="store_name"
                    width="180"
                    label="连锁">
            </el-table-column>
            <el-table-column
                    prop="department_name"
                    width="160"
                    label="门店">
            </el-table-column>
            <el-table-column
                    prop="user_name"
                    width="80"
                    label="店员">
            </el-table-column>
            <el-table-column
                    prop="price"
                    width="80"
                    label="金额">
            </el-table-column>
            <el-table-column
                    prop="balance"
                    width="100"
                    label="余额">
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
    </article>
</template>
<script>
    import {history, exportHistory} from '../../../services/fianace/finance'
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
                fetchParam: {
                    companySelect: '',
                    courseSelect: '',
                    userSelect: '',
                    createTime: '',
                    endTime: '',
                },
                currentPage: 1,
                pageSize: 15,
                historyData: [],
                total: 0
            }
        },
        activated () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            initFetchParam () {
                this.currentPage = 1
            },
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
                    course_id: this.fetchParam.courseSelect,
                    company_id: this.fetchParam.companySelect,
                    time_start: this.fetchParam.createTime,
                    time_end: this.fetchParam.endTime,
                    user_id: this.fetchParam.userSelect
                }
                return history(params).then((ret) => {
                    this.historyData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            },
            exportData () {
                exportHistory({
                    course_id: this.fetchParam.courseSelect,
                    company_id: this.fetchParam.companySelect,
                    time_start: this.fetchParam.createTime,
                    time_end: this.fetchParam.endTime,
                    user_id: this.fetchParam.userSelect
                })
            }
        }
    }
</script>

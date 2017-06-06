<!--课程红包流水-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";
    .financeManage-finance-course-history {
        @extend %content-container;
        .search {
            @extend %top-search-container;
        }
        .header-button {
            @extend %right-top-btnContainer;
        }
        .block {
            text-align: right;
            margin-top: 15px;
        }
    }
</style>
<template>
    <article class="financeManage-finance-course-history">
        <div class="header-button">
            <el-button type="warning" @click="exportData"><i class="iconfont icon-iconfontexcel"></i>导出Excel</el-button>
        </div>
        <section class="search">
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
            <section>
                <i>用户所属企业</i>
                <IndustryCompanySelect v-model="fetchParam.companySelect"
                                       v-on:change="val=>fetchParam.companySelect=val"
                                       :change="getData">
                </IndustryCompanySelect>
            </section>
            <section>
                <i>赞助企业</i>
                <IndustryCompanySelect v-model="fetchParam.moneycompanySelect"
                                       v-on:change="val=>fetchParam.moneycompanySelect=val"
                                       :change="getData">
                </IndustryCompanySelect>
            </section>
            <DateRange title="创建时间" :start="fetchParam.createTime" :end="fetchParam.endTime"
                       v-on:changeStart="val=> fetchParam.createTime=val"
                       v-on:changeEnd="val=> fetchParam.endTime=val"
                       :change="getData">
            </DateRange>
        </section>
        <el-table
                v-loading="loading"
                border
                :data="historyData">
            <el-table-column
                    width="100"
                    prop="user_name"
                    label="用户">
            </el-table-column>
             <el-table-column
                     min-width="200"
                    prop="company_name"
                    label="用户所属企业">
            </el-table-column>
            <el-table-column
                    width="180"
                    prop="type_name"
                    label="课程">
            </el-table-column>
            <el-table-column
                    prop="money"
                    label="金额"
                    width="180">
            </el-table-column>
            <el-table-column
                    width="180"
                    prop="money_company_name"
                    label="红包赞助企业">
            </el-table-column>
            <el-table-column
                    width="180"
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
    </article>
</template>
<script>
    import {history, exportData} from '../../../services/fianace/money'
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
                fetchParam: {
                    companySelect: '',
                    moneycompanySelect: '',
                    courseSelect: '',
                    userSelect: '',
                    createTime: '',
                    endTime: '',
                },
                loading: false,
                currentPage: 1,
                pageSize: 10,
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
                    type: 'course',
                    type_id: this.fetchParam.courseSelect,
                    company_id: this.fetchParam.companySelect,
                    money_company_id: this.fetchParam.moneycompanySelect,
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
            exportData () { // 导出数据
                exportData({
                    type: 'course',
                    company_id: this.fetchParam.companySelect,
                    time_start: this.fetchParam.createTime,
                    time_end: this.fetchParam.endTime,
                    user_id: this.fetchParam.userSelect
                })
            }
        }
    }
</script>

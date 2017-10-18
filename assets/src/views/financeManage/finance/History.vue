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
                <i>支出类型</i>
                <el-select v-model="fetchParam.trade_type" placeholder="请选择" clearable>
                    <el-option v-for="item in tradeTypes" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
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
                    prop="trade_no"
                    label="流水号">
            </el-table-column>
            <el-table-column
                    prop="money_company_name"
                    label="企业"
                    width="180">
            </el-table-column>
            <el-table-column
                    width="180"
                    label="支出类型">
                <template scope="scope">
                    <span v-if="scope.row.trade_type == 'course_testing'">培训服务费</span>
                    <span v-else-if="scope.row.trade_type == 'course_lucky_money'">课程红包费</span>
                    <span v-else-if="scope.row.trade_type == 'speaking_lucky_money'">药我说赞助</span>
                    <span v-else>其他费用</span>
                </template>
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
                    prop="money"
                    width="80"
                    label="金额">
            </el-table-column>
            <el-table-column
                    prop="balance"
                    width="100"
                    label="余额">
            </el-table-column>
             <el-table-column
                    prop="create_time_name"
                    min-width="100"
                    label="添加时间">
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
    import {history, exportHistory} from '../../../services/finance/finance'
    import IndustryCompanySelect from '../../component/select/IndustryCompany'
    import CourseList from '../../component/select/Course'
    import UserList from '../../component/select/User'
    import DateRange from '../../component/form/DateRangePicker.vue'
    function clearFn() {
        return {
            companySelect: '',
            courseSelect: '',
            userSelect: '',
            createTime: '',
            endTime: '',
        }
    }
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
                fetchParam: clearFn(),
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
                this.fetchParam = clearFn()
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

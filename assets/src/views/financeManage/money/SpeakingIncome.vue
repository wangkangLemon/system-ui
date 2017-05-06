<!--课程红包流水-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";
    .financeManage-finance-speaking-history {
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
    <article class="financeManage-finance-speaking-history">
        <div class="header-button">
            <el-button type="warning" @click="exportData"><i class="iconfont icon-iconfontexcel"></i>导出Excel</el-button>
        </div>
        <section class="search">
            <section>
                <i>药我说</i>
                <speaking-list v-model="speakingSelect"
                             v-on:change="val=>speakingSelect=val"
                             :change="getData">
                </speaking-list>
            </section>
            <UserList v-model="userSelect"
                      v-on:change="val=>userSelect=val"
                      :change="getData">
            </UserList>
            <section>
                <i>用户所属企业</i>
                <IndustryCompanySelect v-model="companySelect"
                                       v-on:change="val=>companySelect=val"
                                       :change="getData">
                </IndustryCompanySelect>
            </section>
            <section>
                <i>赞助企业</i>
                <IndustryCompanySelect v-model="moneycompanySelect"
                                       v-on:change="val=>moneycompanySelect=val"
                                       :change="getData">
                </IndustryCompanySelect>
            </section>   
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
                    prop="company_name"
                    label="用户所属企业">
            </el-table-column>
            <el-table-column
                    prop="type_name"
                    label="标题">
            </el-table-column>
            <el-table-column
                    prop="money"
                    label="金额"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="money_company_name"
                    label="红包赞助企业">
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
    </article>
</template>
<script>
    import {history, exportData} from '../../../services/fianace/money'
    import IndustryCompanySelect from '../../component/select/IndustryCompany'
    import DateRange from '../../component/form/DateRangePicker.vue'
    import UserList from '../../component/select/User'
    import SpeakingList from '../../component/select/Speaking'
    export default {
        components: {
            IndustryCompanySelect,
            DateRange,
            UserList,
            SpeakingList
        },
        data () {
            return {
                loading: false,
                companySelect: '',
                moneycompanySelect: '',
                speakingSelect: '',
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
                    type: 'speaking',
                    type_id: this.speakingSelect,
                    company_id: this.companySelect,
                    money_company_id: this.moneycompanySelect,
                    user_id: this.userSelect,
                    time_start: this.createTime,
                    time_end: this.endTime
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
                    type: 'speaking',
                    company_id: this.companySelect,
                    money_company_id: this.moneycompanySelect,
                    time_start: this.createTime,
                    time_end: this.endTime
                })
            }
        }
    }
</script>

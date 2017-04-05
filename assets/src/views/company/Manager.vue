<style lang="scss" rel='stylesheet/scss'>
    @import "../../utils/mixins/mixins";
    @import "../../utils/mixins/topSearch";
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
            <div slot="header" class="clearfix">
                <el-button @click="exportData"><i class="iconfont icon-iconfontexcel"></i>导出Excel</el-button>
            </div>
            <section class="search">
                <section>
                    <i>姓名</i>
                    <el-input @change="getData" v-model="searchParams.name" auto-complete="off"></el-input>
                </section>
                <section>
                    <i>手机</i>
                    <el-input @change="getData" v-model="searchParams.mobile" auto-complete="off"></el-input>
                </section>
                <IndustryCompanySelect :type="2" v-model="searchParams.companySelect"
                                       v-on:change="val=>searchParams.companySelect=val"
                                       :change="getData">
                </IndustryCompanySelect>
                <section>
                    <i>是否删除</i>
                    <el-select v-model="searchParams.status" @change="getData">
                        <el-option label="未删除" value="0"></el-option>
                        <el-option label="已删除" value="1"></el-option>
                    </el-select>
                </section>
                <DateRange title="创建时间" :start="searchParams.createTime" :end="searchParams.endTime"
                           v-on:changeStart="val=> searchParams.createTime = val"
                           v-on:changeEnd="val=> searchParams.endTime = val"
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
                        prop="company_name"
                        label="连锁">
                </el-table-column>
                <el-table-column
                        prop="department_name"
                        label="门店"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="manager_name"
                        label="姓名">
                </el-table-column>
                <el-table-column
                        prop="manager_mobile"
                        label="手机">
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        label="注册时间">
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
    import {history, exportData} from '../../services/fianace/finance'
    import {date2Str} from '../../utils/timeUtils'
    import IndustryCompanySelect from '../component/select/IndustryCompany'
    import DateRange from '../component/form/DateRangePicker.vue'
    export default {
        components: {
            IndustryCompanySelect,
            DateRange
        },
        data () {
            return {
                loading: false,
                currentPage: 1,
                pageSize: 10,
                historyData: [],
                total: 0,
                searchParams: {
                    companySelect: '',
                    createTime: '',
                    endTime: '',
                    name: '',
                    mobile: '',
                    status: ''
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
            exportData () {
                exportData({
                    course_id: this.courseSelect,
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

<!--店员-店员列表-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/topSearch";
    .company-user-list {
        .status {
            padding: 2px 5px;
            background: #00acac;
            border-radius: 5px;
            color: #fff;
        }
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
    <article class="company-user-list">
        <el-card class="box-card">
            <section class="search">
                <section>
                    <i>姓名</i>
                    <el-input @change="getData" v-model="searchParams.name" auto-complete="off"></el-input>
                </section>
                <section>
                    <i>手机</i>
                    <el-input @change="getData" v-model="searchParams.mobile" auto-complete="off"></el-input>
                </section>
                <section>
                    <i>邮箱</i>
                    <el-input @change="getData" v-model="searchParams.email" auto-complete="off"></el-input>
                </section>
                <section>
                    <i>连锁</i>
                    <IndustryCompanySelect :type="2" v-model="searchParams.companySelect"
                                           v-on:change="val=>searchParams.companySelect=val"
                                           :change="getData">
                    </IndustryCompanySelect>
                </section>
                <section>
                    <i>属性</i>
                    <el-select clearable v-model="searchParams.status" @change="getData">
                        <el-option label="店员" :value="1"></el-option>
                        <el-option label="注册用户" :value="2"></el-option>
                    </el-select>
                </section>
                <DateRange title="创建时间" :start="searchParams.createTime" :end="searchParams.endTime"
                           v-on:changeStart="val=> searchParams.createTime = val"
                           v-on:changeEnd="val=> searchParams.endTime = val"
                           :change="getData">
                </DateRange>
                <section>
                    <i>使用环境</i>
                    <el-select clearable v-model="searchParams.last_appstart" @change="getData">
                        <el-option label="WAP" :value="1"></el-option>
                        <el-option label="IOS" :value="2"></el-option>
                        <el-option label="Android" :value="3"></el-option>
                    </el-select>
                </section>
                <DatePicker title="未活跃" :start="searchParams.nologin_timestart"
                    v-on:changeStart="val=> searchParams.nologin_timestart = val"
                    :change="getData">
                </DatePicker>
                <el-button type="primary" @click="clearFn">清空</el-button>
            </section>
            <el-table
                    v-loading="loading"
                    border
                    :data="companyUserData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="name"
                        min-width="120"
                        label="姓名">
                </el-table-column>
                <el-table-column
                        prop="mobile"
                        width="130"
                        label="手机">
                </el-table-column>
                <el-table-column
                        prop="company"
                        min-width="180"
                        label="连锁">
                </el-table-column>
                <el-table-column
                        prop="dep_name"
                        min-width="180"
                        label="门店">
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        width="180"
                        label="注册时间">
                </el-table-column>
                <el-table-column
                        prop="last_active_time_name"
                        width="180"
                        label="最后活跃时间">
                    <template slot-scope="scope">
                        {{scope.row.last_active_time_name ? scope.row.last_active_time_name : '未激活'}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="last_appstart"
                        width="100"
                        label="使用环境">
                </el-table-column>
                <el-table-column
                        prop="operate"
                        width="80"
                        label="操作"
                        fixed="right"
                        align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="showFn(scope.row)">
                            详情
                        </el-button>
                    </template>
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

        <UserDetail v-model="showDetail" :id="detailUserID"></UserDetail>

    </article>
</template>
<script>
    import IndustryCompanySelect from '../../component/select/IndustryCompany'
    import DateRange from '../../component/form/DateRangePicker.vue'
    import DatePicker from '../../component/form/DatePicker.vue'
    import UserDetail from './Detail.vue'
    import CompanyUserService from '../../../services/companyUserService'
    import {defaultAvatar} from '../../../utils/filterUtils'
    export default {
        filters: {
            defaultAvatar
        },
        components: {
            IndustryCompanySelect,
            DateRange,
            DatePicker,
            UserDetail
        },
        data () {
            return {
                showDetail: false,
                details: null,
                detailUserID: void 0,
                loading: false,
                currentPage: 1,
                pageSize: 15,
                companyUserData: [],
                total: 0,
                searchParams: {
                    companySelect: '',
                    createTime: this.$route.query.yesterday == undefined ? '' : this.$route.query.yesterday,
                    endTime: this.$route.query.yesterday == undefined ? '' : this.$route.query.yesterday,
                    name: '',
                    mobile: '',
                    status: this.$route.query.status ? this.$route.query.status : '',
                    email: '',
                    last_appstart: '',
                    nologin_timestart: '', // 自指定日期起，就没有登录过
                }
            }
        },
        activated () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            clearFn () {
                this.searchParams = {
                    companySelect: '',
                    createTime: '',
                    endTime: '',
                    name: '',
                    mobile: '',
                    status: '',
                    email: '',
                    last_appstart: '',
                    nologin_timestart: ''
                }
                this.getData()
            },
            // 显示详情
            showFn (row) {
                this.detailUserID = row.id
                this.showDetail = true
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
                    keyword: this.searchParams.name,
                    company_id: this.searchParams.companySelect,
                    time_start: this.searchParams.createTime,
                    time_end: this.searchParams.endTime,
                    mobile: this.searchParams.mobile,
                    email: this.searchParams.email,
                    user_type: this.searchParams.status,
                    last_appstart: this.searchParams.last_appstart,
                    nologin_timestart: this.searchParams.nologin_timestart
                }
                return CompanyUserService.getUserList(params).then((ret) => {
                    this.companyUserData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            }
        }
    }
</script>

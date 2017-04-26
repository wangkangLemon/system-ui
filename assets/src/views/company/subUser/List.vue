<!--店员-店员列表-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/topSearch";
    @import "../../../utils/mixins/showDetail";
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
        <!--详情-->
        <el-dialog class="showDetail" title="查看店员" v-model="showDetail">
            <div class="avatar" v-if="details != null">
                <img :src="{url: details.avatar, sex: details.sex} | defaultAvatar"/>
            </div>
            <div class="info" v-if="details != null">
                <h2>{{details.name}}({{details.company}})</h2>
                <p><i class="title">所属门店：</i><span class="value">{{details.dep_name || '无'}}</span></p>
                <p><i class="title">Mobile：</i><span class="value">{{details.mobile || '无'}}</span></p>
                <p><i class="title">Email：</i><span class="value">{{details.email || '无'}}</span></p>
                <p><i class="title">状态：</i><span class="value"><el-tag
                        type="success">{{details.disabled ? '异常' : '正常'}}</el-tag></span></p>
                <p><i class="title">性别：</i> <span class="value">{{details.sex ? '男' : '女'}}</span></p>
                <p><i class="title">生日：</i><span class="value">{{details.birthday || '无'}}</span></p>
                <p><i class="title">地址：</i> <span class="value">{{details.address || '无'}}</span></p>
                <p><i class="title">注册时间：</i><span class="value">{{details.create_time_name || '无'}}</span></p>
            </div>
        </el-dialog>
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
            </section>
            <el-table
                    v-loading="loading"
                    border
                    :data="companyUserData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="name"
                        label="姓名">
                </el-table-column>
                <el-table-column
                        prop="mobile"
                        label="手机">
                </el-table-column>
                <el-table-column
                        prop="company"
                        label="连锁">
                </el-table-column>
                <el-table-column
                        prop="dep_name"
                        label="门店">
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        label="注册时间">
                </el-table-column>
                <el-table-column
                        prop="disabled"
                        label="状态">
                    <template scope="scope">
                        <el-tag type="success" v-if="!scope.row.disabled">正常</el-tag>
                        <el-tag type="danger" v-if="scope.row.disabled">异常</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="operate"
                        label="操作">
                    <template scope="scope">
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
    </article>
</template>
<script>
    import IndustryCompanySelect from '../../component/select/IndustryCompany'
    import DateRange from '../../component/form/DateRangePicker.vue'
    import CompanyUserService from '../../../services/companyUserService'
    import {defaultAvatar} from '../../../utils/filterUtils'
    export default {
        filters: {
            defaultAvatar
        },
        components: {
            IndustryCompanySelect,
            DateRange
        },
        data () {
            return {
                showDetail: false,
                details: null,
                loading: false,
                currentPage: 1,
                pageSize: 15,
                companyUserData: [],
                total: 0,
                searchParams: {
                    companySelect: '',
                    createTime: '',
                    endTime: '',
                    name: '',
                    mobile: '',
                    status: '',
                    email: ''
                }
            }
        },
        activated () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            // 显示详情
            showFn (row) {
                CompanyUserService.userDetail(row.id).then((ret) => {
                    this.details = ret.data
                }).then(() => {
                    this.showDetail = true
                })
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
                    user_type: this.searchParams.status
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

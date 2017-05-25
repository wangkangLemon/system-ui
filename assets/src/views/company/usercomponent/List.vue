<!--店员-店员列表-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/topSearch";
    @import "../../../utils/mixins/showDetail";

    .company-user-list {
        padding: 20px;
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
    <article class="company-user-list">
        <!--详情-->
        <el-dialog class="show-detail" title="查看店员" v-model="showDetail">
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
        <section class="search">
            <section>
                <i>姓名</i>
                <el-input @keyup.enter.native="getData" v-model="fetchParam.name" auto-complete="off"></el-input>
            </section>
            <section>
                <i>手机</i>
                <el-input @keyup.enter.native="getData" v-model="fetchParam.mobile" auto-complete="off"></el-input>
            </section>
            <section>
                <i>邮箱</i>
                <el-input @keyup.enter.native="getData" v-model="fetchParam.email" auto-complete="off"></el-input>
            </section>
            <section>
                <i>连锁</i>
                <IndustryCompanySelect :type="2" v-model="fetchParam.companySelect"
                                       v-on:change="val=>fetchParam.companySelect=val"
                                       :change="getData">
                </IndustryCompanySelect>
            </section>
            <section>
                <i>属性</i>
                <el-select clearable v-model="fetchParam.status" @change="getData">
                    <el-option label="店员" :value="1"></el-option>
                    <el-option label="注册用户" :value="2"></el-option>
                </el-select>
            </section>
            <DateRange title="创建时间" :start="fetchParam.createTime" :end="fetchParam.endTime"
                       v-on:changeStart="val=> fetchParam.createTime = val"
                       v-on:changeEnd="val=> fetchParam.endTime = val"
                       :change="getData">
            </DateRange>
            <section>
                <i>使用环境</i>
                <el-select clearable v-model="fetchParam.last_appstart" @change="getData">
                    <el-option label="App" :value="1"></el-option>
                    <el-option label="IOS" :value="2"></el-option>
                    <el-option label="Android" :value="3"></el-option>
                </el-select>
            </section>
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
                    width="150"
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
                <template scope="scope">
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
                fetchParam: {
                    companySelect: '',
                    createTime: this.$route.query.yesterday == undefined ? '' : this.$route.query.yesterday,
                    endTime: this.$route.query.yesterday == undefined ? '' : this.$route.query.yesterday,
                    name: '',
                    mobile: '',
                    status: this.$route.query.status ? this.$route.query.status : '',
                    email: '',
                    last_appstart: ''
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
                    keyword: this.fetchParam.name,
                    company_id: this.fetchParam.companySelect,
                    time_start: this.fetchParam.createTime,
                    time_end: this.fetchParam.endTime,
                    mobile: this.fetchParam.mobile,
                    email: this.fetchParam.email,
                    user_type: this.fetchParam.status,
                    last_appstart: this.fetchParam.last_appstart
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

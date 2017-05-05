<!--日志-企业后台登录-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/topSearch";
    .system-manage {
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
    <article class="system-manage">
        <el-card class="box-card">
            <section class="search">
                <section>
                    <i>企业</i>
                    <CompanySelect v-model="search.company_id" :change="getData"></CompanySelect>
                </section>
                <section>
                    <i>用户</i>
                    <UserSelect v-model="search.admin_id" :change="getData"></UserSelect>
                </section>
                <section>
                    <i>登录方式</i>
                    <el-select clearable @change="getData" v-model="search.account_type">
                        <el-option label="手机号" value="mobile"></el-option>
                        <el-option label="邮箱" value="email"></el-option>
                    </el-select>
                </section>
                <section>
                    <i>登录IP</i>
                    <el-input @change="getData" v-model="search.ip"></el-input>
                </section>
                <DateRange title="登录时间" :start="search.time_start" :end="search.time_end"
                           v-on:changeStart="val=> search.time_start=val "
                           v-on:changeEnd="val=> search.time_end=val "
                           :change="getData"></DateRange>
            </section>
            <el-table
                    v-loading="loading"
                    border
                    :data="listData">
                <el-table-column
                        prop="company"
                        label="企业"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="user_name"
                        label="用户"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="account_type"
                        label="登录方式" width="100">
                    <template scope="scope">
                        <el-tag type="primary" v-if="scope.row.account_type == 'email'">邮箱</el-tag>
                        <el-tag type="success" v-if="scope.row.account_type == 'mobile'">手机号</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="login_ip_name"
                        label="登录IP">
                </el-table-column>
                <el-table-column
                        prop="login_time_name"
                        label="登录时间">
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
    import logService from '../../../services/logService'
    import DateRange from '../../component/form/DateRangePicker.vue'
    import UserSelect from '../../component/select/User.vue'
    import CompanySelect from '../../component/select/IndustryCompany.vue'
    export default {
        components: {
            DateRange,
            UserSelect,
            CompanySelect
        },
        data () {
            return {
                loading: false,
                currentPage: 1,
                pageSize: 15,
                listData: [],
                total: 0,
                search: {
                    admin_id: '',
                    ip: '',
                    time_start: '',
                    time_end: '',
                    account_type: '',
                    company_id: ''
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
                    admin_id: this.search.admin_id,
                    ip: this.search.ip,
                    time_start: this.search.time_start,
                    time_end: this.search.time_end,
                    account_type: this.search.account_type,
                    company_id: this.search.company_id
                }
                return logService.getCompanyLoginList(params).then((ret) => {
                    this.listData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            },
        }
    }
</script>

<!--店长-->
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
                    <i>连锁</i>
                    <IndustryCompanySelect :type="2" v-model="fetchParam.companySelect"
                                           v-on:change="val=>fetchParam.companySelect=val"
                                           :change="getData"></IndustryCompanySelect>

                </section>
                <!--<section>
                    <i>是否删除</i>
                    <el-select v-model="fetchParam.status" @change="getData">
                        <el-option label="未删除" :value="0"></el-option>
                        <el-option label="已删除" :value="1"></el-option>
                    </el-select>
                </section>-->
                <DateRange title="创建时间" :start="fetchParam.createTime" :end="fetchParam.endTime"
                           v-on:changeStart="val=> fetchParam.createTime = val"
                           v-on:changeEnd="val=> fetchParam.endTime = val"
                           :change="getData">
                </DateRange>
            </section>
            <el-table
                    v-loading="loading"
                    border
                    :data="managerData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        width="200"
                        prop="company_name"
                        label="连锁">
                </el-table-column>
                <el-table-column
                        min-width="200"
                        prop="department_name"
                        label="门店">
                </el-table-column>
                <el-table-column
                        width="100"
                        prop="manager_name"
                        label="姓名">
                </el-table-column>
                <el-table-column
                        width="150"
                        prop="manager_mobile"
                        label="手机">
                </el-table-column>
                <el-table-column
                        width="180"
                        prop="last_login_time_name"
                        label="上次登录时间">
                </el-table-column>
                <el-table-column
                        width="120"
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
<script>
    import IndustryCompanySelect from '../component/select/IndustryCompany'
    import DateRange from '../component/form/DateRangePicker.vue'
    import ManagerService from '../../services/managerService'
    export default {
        components: {
            IndustryCompanySelect,
            DateRange
        },
        data () {
            return {
                loading: false,
                currentPage: 1,
                pageSize: 15,
                managerData: [],
                total: 0,
                fetchParam: clearSearch()
            }
        },
        activated () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            initFetchParam() {
                this.currentPage = 1
                this.fetchParam = clearSearch()
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
                    company_id: this.fetchParam.companySelect,
                    time_start: this.fetchParam.createTime,
                    time_end: this.fetchParam.endTime,
                    deleted: this.fetchParam.status,
                    manager_name: this.fetchParam.name,
                    manager_mobile: this.fetchParam.mobile,
                }
                return ManagerService.getManager(params).then((ret) => {
                    this.managerData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            }
        }
    }
    function clearSearch() {
        return {
            companySelect: '',
            createTime: '',
            endTime: '',
            name: '',
            mobile: '',
            status: 0
        }
    }
</script>

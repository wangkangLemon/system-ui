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
                    <el-input @change="getData" v-model="searchParams.name" auto-complete="off"></el-input>
                </section>
                <section>
                    <i>手机</i>
                    <el-input @change="getData" v-model="searchParams.mobile" auto-complete="off"></el-input>
                </section>
                <section>
                    <i>连锁</i>
                    <IndustryCompanySelect :type="2" v-model="searchParams.companySelect"
                                           v-on:change="val=>searchParams.companySelect=val"
                                           :change="getData"></IndustryCompanySelect>

                </section>
                <section>
                    <i>是否删除</i>
                    <el-select v-model="searchParams.status" @change="getData">
                        <el-option label="未删除" :value="0"></el-option>
                        <el-option label="已删除" :value="1"></el-option>
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
                    :data="managerData"
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
                pageSize: 10,
                managerData: [],
                total: 0,
                searchParams: {
                    companySelect: '',
                    createTime: '',
                    endTime: '',
                    name: '',
                    mobile: '',
                    status: 0
                }
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
            getData () {
                this.loading = true
                let params = {
                    page: this.currentPage,
                    page_size: this.pageSize,
                    company_id: this.searchParams.companySelect,
                    time_start: this.searchParams.createTime,
                    time_end: this.searchParams.endTime,
                    deleted: this.searchParams.status,
                    manager_name: this.searchParams.name,
                    manager_mobile: this.searchParams.mobile,
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
</script>

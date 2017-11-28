<!--小应用-->
<style lang="scss" rel="stylesheet/scss">
    @import "../../../utils/mixins/topSearch";
    .analysis-company-startimg {
        .search {
            @extend %top-search-container;
        }
        .box-card {
            margin-top: 20px;
            .clearfix {
                font-size: 16px;
                font-weight: bold;
            }
            .el-card__header {
                padding: 10px 15px;
                background: #f0f3f5;
            }
            .block {
                text-align: right;
                margin-top: 15px;
            }
        }
    }
</style>
<template>
    <article class="analysis-company-startimg">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>截止到{{date}}日，共{{companyCount}}家连锁设置小应用</span>
            </div>
            <section class="search">
                <section>
                    <i>企业</i>
                    <CompanySelect  :change="getData" v-model="search.company_id"
                                    v-on:change="val=>search.company_id=val">
                    </CompanySelect>
                </section>
                <DateRange title="创建时间" :start="search.createTime" :end="search.endTime"
                           v-on:changeStart="val=> search.createTime=val"
                           v-on:changeEnd="val=> search.endTime=val"
                           :change="getData">
                </DateRange>
            </section>
            <el-dialog class="show-detail" title="企业公告信息" v-model="showCompany">
                <div class="info" v-if="appCompany">
                    <h2>{{appCompany.company_name}}</h2>
                    <p><i class="title">第一次发布时间：</i><span class="value">{{appCompany.first_time}}</span></p>
                    <p><i class="title">上一次发布时间：</i><span class="value">{{appCompany.last_time}}</span></p>
                    <p><i class="title">共发布条数：</i><span class="value">{{appCompany.app_count}}条</span></p>
                </div>
            </el-dialog>
            <el-table
                    v-loading="loading"
                    border
                    :data="hybridData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="name"
                        min-width="300"
                        label="应用名称">
                </el-table-column>
                <el-table-column
                        prop="path"
                        min-width="180"
                        label="链接">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="linkHref(scope.row)">
                            {{scope.row.path}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="company_name"
                        min-width="180"
                        label="企业">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="showCompanyFn(scope.row)">
                            {{scope.row.company_name}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        width="170"
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
        </el-card>
    </article>
</template>
<script>
    import DateRange from '../../component/form/DateRangePicker.vue'
    import CompanySelect from '../../component/select/IndustryCompany.vue'
    import companyService from '../../../services/companyService'
    function clearFn() {
        return {
            company_id: '',
            createTime: '',
            endTime: '',
        }
    }
    export default {
        components: {
            CompanySelect,
            DateRange
        },
        data () {
            return {
                loading: false,
                hybridData: [],
                currentPage: 1,
                pageSize: 15,
                total: 0,
                date: '',
                companyCount: 0,
                showCompany: false,
                appCompany: null,
                search: clearFn()
            }
        },
        created () {
            xmview.setContentLoading(false)
        },
        activated () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            initFetchParam() {
                this.currentPage = 1
                this.search = clearFn()
            },
            showCompanyFn (item) {
                companyService.getCompanyAppDetail({
                    company_id: item.company_id,
                }).then((ret) => {
                    this.appCompany = ret.data
                }).then(() => {
                    this.showCompany = true
                })
            },
            linkHref(item) {
                window.open(item.path)
            },
            handleSizeChange (val) {
                this.pageSize = val
                this.getData()
            },
            handleCurrentChange (val) {
                this.currentPage = val
                this.getData()
            },
            getData () {
                this.loading = true
                return companyService.getCompanyAppList({
                    page: this.currentPage,
                    page_size: this.pageSize,
                    company_id: this.search.company_id,
                    time_start: this.search.createTime,
                    time_end: this.search.endTime,
                }).then((ret) => {
                    this.total = ret.total
                    this.hybridData = ret.data
                    this.date = ret.date
                    this.companyCount = ret.company_count
                }).then(() => {
                    this.loading = false
                })
            }
        }
    }
</script>

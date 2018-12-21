<!--审计-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../utils/mixins/mixins";
    @import "../../utils/mixins/topSearch";
    .company-user-list {
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
        .show-link {
            font-size: 12px;
            color: #20a0ff;
            text-decoration: none;
        }
    }
</style>
<template>
    <article class="company-user-list">
        <el-card class="box-card">
            <section class="search">
                <section>
                    <i>状态</i>
                    <el-select clearable v-model="fetchParam.status" @change="getData">
                        <el-option label="资质待审核" :value="signStatus.checking"></el-option>
                        <el-option label="资质未通过" :value="signStatus.reject"></el-option>
                        <el-option label="资质通过" :value="signStatus.pass"></el-option>
                        <el-option label="待付款" :value="signStatus.unpay"></el-option>
                        <el-option label="付款关闭" :value="signStatus.payclose"></el-option>
                        <el-option label="线下支付待确认" :value="signStatus.payline"></el-option>
                        <el-option label="线下支付确认失败" :value="signStatus.paylinefail"></el-option>
                        <el-option label="已付款" :value="signStatus.paid"></el-option>
                        <el-option label="发票待付款" :value="signStatus.invoiceunpay"></el-option>
                        <el-option label="发票待处理" :value="signStatus.uninvoice"></el-option>
                        <el-option label="发票已处理" :value="signStatus.invoice"></el-option>
                    </el-select>
                </section>
                <DateRange title="日期查找" :start="fetchParam.start_date" :end="fetchParam.end_date"
                           v-on:changeStart="val=> fetchParam.start_date=val"
                           v-on:changeEnd="val=> fetchParam.end_date=val"
                           :change="getData">
                </DateRange>
                <section>
                    <i>关键字</i>
                    <el-input @keyup.enter.native="getData" v-model="fetchParam.keyword" auto-complete="off"></el-input>
                </section>
            </section>
            <el-table
                    v-loading="loading"
                    border
                    :data="signList">
                <el-table-column
                        min-width="250"
                        prop="company_name"
                        label="企业名称">
                </el-table-column>
                <el-table-column
                        min-width="200"
                        prop="company_address"
                        label="企业地址">
                </el-table-column>
                <el-table-column
                        width="100"
                        prop="user_name"
                        label="联系人">
                </el-table-column>
                <el-table-column
                        width="150"
                        prop="mobile"
                        label="联系电话">
                </el-table-column>
                <el-table-column
                        prop="status"
                        width="150"
                        label="状态">
                    <template slot-scope="scope">
                        <el-tag type="primary" v-if="scope.row.status == signStatus.checking">资质待审核</el-tag>
                        <el-tag type="danger" v-if="scope.row.status == signStatus.reject">资质未通过</el-tag>
                        <el-tag type="success" v-if="scope.row.status == signStatus.pass">资质通过</el-tag>
                        <el-tag type="primary" v-if="scope.row.status == signStatus.unpay">待付款</el-tag>
                        <el-tag type="primary" v-if="scope.row.status == signStatus.payclose">付款关闭</el-tag>
                        <el-tag type="primary" v-if="scope.row.status == signStatus.payline">线下支付待确认</el-tag>
                        <el-tag type="primary" v-if="scope.row.status == signStatus.paylinefail">线下支付确认失败</el-tag>
                        <el-tag type="success" v-if="scope.row.status == signStatus.paid">已付款</el-tag>
                        <el-tag type="warning" v-if="scope.row.status == signStatus.invoiceunpay">发票待付款</el-tag>
                        <el-tag type="danger" v-if="scope.row.status == signStatus.uninvoice">发票待处理</el-tag>
                        <el-tag type="success" v-if="scope.row.status == signStatus.invoice">发票已处理</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        width="170"
                        prop="created_at"
                        label="申请时间">
                </el-table-column>
                <el-table-column
                        prop="operate"
                        width="80"
                        label="操作"
                        fixed="right"
                        align="center">
                    <template slot-scope="scope">
                        <router-link class="show-link" :to="{name: 'company-audit-show', params: {id: scope.row.id}}">
                            查看
                        </router-link>
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
    import companyService from '../../services/companyService'
    import signingService from 'services/system/signingService'
    import DateRange from '../component/form/DateRangePicker'
    export default {
        components: {
            DateRange
        },
        data () {
            return {
                loading: false,
                currentPage: 1,
                pageSize: 15,
                signList: [],
                total: 0,
                fetchParam: clearSearch(),
                signStatus: {
                    checking: 10,
                    reject: 11,
                    pass: 12,
                    unpay: 20,
                    payclose: 21,
                    payline: 22,
                    paylinefail: 23,
                    paid: 25,
                    invoiceunpay: 30,
                    uninvoice: 35,
                    invoice: 38
                }
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
                    keyword: this.fetchParam.keyword,
                    status: this.fetchParam.status,
                    start_date: this.fetchParam.start_date,
                    end_date: this.fetchParam.end_date
                }
                return signingService.searchList(params).then((ret) => {
                    this.signList = ret.list
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            }
        }
    }
    function clearSearch() {
        return {
            start_date: '',
            end_date: '',
            keyword: '', // 关键字
            status: '', // 审核结果
        }
    }
</script>

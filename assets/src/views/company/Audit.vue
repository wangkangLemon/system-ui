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
                    <i>审核结果</i>
                    <el-select clearable v-model="searchParams.result" @change="getData">
                        <el-option label="待审核" :value="1"></el-option>
                        <el-option label="审核通过" :value="2"></el-option>
                        <el-option label="审核失败" :value="3"></el-option>
                    </el-select>
                </section>
                <DateRange title="日期查找" :start="searchParams.createTime" :end="searchParams.endTime"
                           v-on:changeStart="val=> searchParams.createTime=val"
                           v-on:changeEnd="val=> searchParams.endTime=val"
                           :change="getData">
                </DateRange>
                <section>
                    <i>关键字</i>
                    <el-input @change="getData" v-model="searchParams.keyword" auto-complete="off"></el-input>
                </section>
                <el-button type="primary" @click="clearFn">清空</el-button>
            </section>
            <el-table
                    v-loading="loading"
                    border
                    :data="auditData">
                <el-table-column
                        width="200"
                        prop="name"
                        label="企业名称">
                </el-table-column>
                <el-table-column
                        min-width="200"
                        prop="address"
                        label="企业地址">
                </el-table-column>
                <el-table-column
                        width="100"
                        prop="contact"
                        label="联系人">
                </el-table-column>
                <el-table-column
                        width="150"
                        prop="phone"
                        label="联系电话">
                </el-table-column>
                <el-table-column
                        width="180"
                        prop="create_time_name"
                        label="申请时间">
                </el-table-column>
                <el-table-column
                        prop="status"
                        width="100"
                        label="状态">
                    <template scope="scope">
                        <el-tag type="primary" v-if="scope.row.status == 1">待审核</el-tag>
                        <el-tag type="success" v-if="scope.row.status == 2">审核通过</el-tag>
                        <el-tag type="danger" v-if="scope.row.status == 3">审核失败</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="operate"
                        width="80"
                        label="操作">
                    <template scope="scope">
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
                auditData: [],
                total: 0,
                searchParams: clearSearch()
            }
        },
        activated () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            clearFn () {
                this.searchParams = clearSearch()
                this.getData()
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
                    keyword: this.searchParams.keyword,
                    status: this.searchParams.result,
                    time_start: this.searchParams.createTime,
                    time_end: this.searchParams.endTime
                }
                return companyService.getAuditList(params).then((ret) => {
                    this.auditData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            }
        }
    }
    function clearSearch() {
        return {
            createTime: '',
            endTime: '',
            keyword: '', // 关键字
            result: '', // 审核结果
        }
    }
</script>

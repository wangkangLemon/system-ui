<style lang="scss" rel='stylesheet/scss'>
    @import "../../utils/mixins/mixins";
    @import "../../utils/mixins/topSearch";
    .company-user-list {
        .showDetail {
            .avatar {
                border: 1px solid #ededed;
                display: inline-block;
                vertical-align: top;
            }
            .info {
                display: inline-block;
                vertical-align: top;
                > p {
                    > span {
                        display: inline-block;
                        width:px2rem(100);
                        text-align: right;
                        padding-right: px2rem(10);
                    }
                }
            }
        }
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
        <el-dialog class="showDetail" title="查看公告" v-model="showDetail">
            <div>查看公告：标题</div>
            <div>内容</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="showDetail = false">关 闭</el-button>
            </div>
        </el-dialog>
        <el-card class="box-card">
            <section class="search">
                <IndustryCompanySelect :type="2" v-model="searchParams.companySelect"
                                       v-on:change="val=>searchParams.companySelect=val"
                                       :change="getData">
                </IndustryCompanySelect>
                <section>
                    <i>类型</i>
                    <el-select v-model="searchParams.type" @change="getData">
                        <el-option label="企业公告" value="0"></el-option>
                        <el-option label="分店公告" value="1"></el-option>
                    </el-select>
                </section>
                <section>
                    <i>标题</i>
                    <el-input @change="getData" v-model="searchParams.title" auto-complete="off"></el-input>
                </section>
                <section>
                    <i>状态</i>
                    <el-select v-model="searchParams.status" @change="getData">
                        <el-option label="正常" value="0"></el-option>
                        <el-option label="草稿" value="1"></el-option>
                        <el-option label="撤销" value="2"></el-option>
                    </el-select>
                </section>
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
                        prop="type"
                        label="类型">
                </el-table-column>
                <el-table-column
                        prop="title"
                        label="标题">
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="状态">
                </el-table-column>
                <el-table-column
                        prop="operate"
                        label="操作">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="showDetail = true">
                            查看公告
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
<script lang="babel">
    import {history} from '../../services/fianace/finance'
    import {date2Str} from '../../utils/timeUtils'
    import IndustryCompanySelect from '../component/select/IndustryCompany'
    export default {
        components: {
            IndustryCompanySelect
        },
        data () {
            return {
                showDetail: false,
                loading: false,
                currentPage: 1,
                pageSize: 10,
                historyData: [],
                total: 0,
                searchParams: {
                    companySelect: '',
                    title: '',
                    type: '',
                    status: '',
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
            }
        }
    }
</script>

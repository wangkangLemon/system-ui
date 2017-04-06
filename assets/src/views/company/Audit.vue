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
                    margin-bottom: 10px;
                    > span {
                        display: inline-block;
                        width:40%;
                        text-align: right;
                        vertical-align: top;
                        padding-right: px2rem(10);
                    }
                    .el-select, .el-textarea {
                        display: inline-block;
                        width: 58%;
                        vertical-align: top;
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
        <el-dialog class="showDetail" :title="show.title" v-model="show.showDetail">
            <div class="info">
                <p><span>药店地址：</span></p>
                <p><span>门店数量：</span></p>
                <p><span>店员数量：</span></p>
                <p><span>运营联系人：</span></p>
                <p><span>联系人电话：</span></p>
                <p><span>联系人邮箱：</span></p>
                <p><span>营业执照：</span></p>
                <p><span>经营许可证：</span></p>
                <p><span>GSP/GSM认证：</span></p>
                <p><span>负责人身份证：</span></p>
                <p>
                    <span>审核结果：</span>
                    <el-select v-model="searchParams.result" @change="getData">
                        <el-option label="待审核" value="0"></el-option>
                        <el-option label="审核通过" value="1"></el-option>
                        <el-option label="审核失败" value="2"></el-option>
                    </el-select>
                </p>
                <p>
                    <span>备注：</span>
                    <el-input type="textarea" :rows="3"></el-input>
                </p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="show.showDetail = false">提 交</el-button>
            </div>
        </el-dialog>
        <el-card class="box-card">
            <section class="search">
                <section>
                    <i>审核结果</i>
                    <el-select v-model="searchParams.result" @change="getData">
                        <el-option label="待审核" value="0"></el-option>
                        <el-option label="审核通过" value="1"></el-option>
                        <el-option label="审核失败" value="2"></el-option>
                    </el-select>
                </section>
                <DateRange title="日期查找" :start="searchParams.createTime" :end="searchParams.endTime"
                           v-on:changeStart="val=> searchParams.createTime=val"
                           v-on:changeEnd="val=> searchParams.endTime"
                           :change="getData">
                </DateRange>
                <section>
                    <i>关键字</i>
                    <el-input @change="getData" v-model="searchParams.keyword" auto-complete="off"></el-input>
                </section>
            </section>
            <el-table
                    v-loading="loading"
                    border
                    :data="historyData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="name"
                        label="企业名称">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="企业地址">
                </el-table-column>
                <el-table-column
                        prop="concact"
                        label="联系人">
                </el-table-column>
                <el-table-column
                        prop="phone"
                        label="联系电话">
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        label="申请时间">
                </el-table-column>
                <el-table-column
                        prop="operate"
                        label="操作">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="checkDetail(scope.$index, scope.row)">
                            待审核
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
    import DateRange from '../component/form/DateRangePicker'
    export default {
        components: {
            DateRange
        },
        data () {
            return {
                show: {
                    showDetail: false,
                    detial: null,
                    title: ''
                },
                loading: false,
                currentPage: 1,
                pageSize: 10,
                historyData: [],
                total: 0,
                searchParams: {
                    createTime: '',
                    endTime: '',
                    keyword: '', // 关键字
                    result: '', // 审核结果
                }
            }
        },
        created () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            checkDetail (index, item) {
                this.show.showDetail = true
                this.show.title = item.name || '标题'
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

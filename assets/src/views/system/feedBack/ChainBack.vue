<!--日志-企业后台登录-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/topSearch";
    .system-manage {
        .showDetail {
            .info {
                display: inline-block;
                vertical-align: top;
                text-align: center;
                width: 100%;
                h2 {
                    margin-bottom: 10px;
                }
                p {
                    text-align: left;
                    line-height:35px;
                    > * {
                        display: inline-block;
                        vertical-align: top;
                    }
                    i.title {
                        width: 16%;
                        margin-right: 10px;
                        text-align: right;
                    }
                    span.value {
                        text-align: left;
                    }
                }
                > p.question {
                    .value {
                        width: 70%;
                        .img-wrap {
                            img {
                                width: 100px;
                                height: 100px;
                            }
                        }
                    }
                }
            }
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
    <article class="system-manage">
        <!--详情-->
        <el-dialog title="查看详情" class="showDetail" v-model="showDetail">
            <div class="info" v-if="details != null">
                <p><i class="title">企业名称：</i><span class="value">{{details.company_name}}</span></p>
                <p><i class="title">门店：</i><span class="value">{{details.department_name}}</span></p>
                <p><i class="title">提交人：</i><span class="value">{{details.user_name}}</span></p>
                <p><i class="title">联系方式：</i> <span class="value">{{details.contact}}</span></p>
                <p><i class="title">问题描述：</i> <span class="value">{{details.description}}</span></p>
                <p class="question">
                    <i class="title">问题截取：</i>
                    <span class="value">
                        <div class="img-wrap">
                            <img :src="item" alt="" v-for="item in details.image_group">
                        </div>
                    </span>
                </p>
                <p>
                    <i class="title">状态：</i>
                    <span class="value">
                        <el-select clearable v-model="form.status">
                            <el-option label="待处理" :value="0"></el-option>
                            <el-option label="处理中" :value="1"></el-option>
                            <el-option label="已处理" :value="2"></el-option>
                            <el-option label="待分配" :value="3"></el-option>
                        </el-select>
                    </span>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateFn(details.id)">提交修改</el-button>
            </span>
        </el-dialog>
        <el-card class="box-card">
            <section class="search">
                <section>
                    <i>关键字</i>
                    <el-input @change="getData" v-model="search.keyword"></el-input>
                </section>
                <DateRange title="提交时间" :start="search.createTime" :end="search.endTime"
                           v-on:changeStart="val=> search.createTime=val"
                           v-on:changeEnd="val=> search.endTime=val"
                           :change="getData">
                </DateRange>
            </section>
            <el-table
                    v-loading="loading"
                    border
                    :data="listData">
                <el-table-column
                        prop="description"
                        label="问题描述"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="company_name"
                        label="连锁"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="department_name"
                        label="门店"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="user_name"
                        label="提交人"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="contact"
                        label="联系方式"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        label="提交时间"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="status_name"
                        label="状态">
                    <template scope="scope">
                        <el-tag type="gray" v-if="scope.row.status == 0">待处理</el-tag>
                        <el-tag type="primary" v-if="scope.row.status == 1">处理中</el-tag>
                        <el-tag type="success" v-if="scope.row.status == 2">已处理</el-tag>
                        <el-tag type="warning" v-if="scope.row.status == 3">待分配</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="operate"
                        label="操作">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="showFn(scope.row)">
                            查看
                        </el-button>
                        <el-button type="text" size="small" @click="deleteFn(scope.row)">
                            删除
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
    import feedBackService from '../../../services/feedBackService'
    import DateRange from '../../component/form/DateRangePicker.vue'
    export default {
        components: {
            DateRange
        },
        data () {
            return {
                showDetail: false,
                details: null,
                loading: false,
                currentPage: 1,
                pageSize: 15,
                listData: [],
                total: 0,
                search: {
                    keyword: '',
                    createTime: '',
                    endTime: ''
                },
                form: {
                    status: 0
                }
            }
        },
        created () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            deleteFn (row) {
                xmview.showDialog('你将要执行删除操作且不可恢复确认吗？', () => {
                    feedBackService.deleteData(row.id).then(() => {
                        xmview.showTip('success', '删除成功')
                        this.getData()
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message)
                    })
                })
            },
            updateFn (id) {
                feedBackService.updateChainBack({
                    id,
                    status: this.form.status
                }).then((ret) => {
                    this.showDetail = false
                    xmview.showTip('success', '提交成功')
                    this.getData()
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            showFn (row) {
                feedBackService.getChainBackDetail(row.id).then((ret) => {
                    this.details = ret.data
                    this.form.status = ret.data.status
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
                    keyword: this.search.keyword,
                    time_start: this.search.createTime,
                    time_end: this.search.endTime
                }
                return feedBackService.getChainBackList(params).then((ret) => {
                    this.listData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            },
        }
    }
</script>

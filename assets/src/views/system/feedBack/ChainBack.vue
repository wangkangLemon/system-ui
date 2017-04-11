<!--日志-企业后台登录-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/topSearch";
    .system-manage {
        .showDetail {
            .info {
                p {
                    line-height: 30px;
                }
                .question {
                    > * {
                        display: inline-block;
                        vertical-align: top;
                    }
                    span {
                        line-height: 30px;
                    }
                    .img-wrap {
                        img {
                            width: 200px;
                            height: 150px;
                            margin-right: 5px;
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
                <p><span>企业名称：</span>{{details.company_name}}</p>
                <p><span>门店：</span>{{details.department_name}}</p>
                <p><span>提交人：</span>{{details.user_name}}</p>
                <p><span>联系方式：</span> {{details.contact}}</p>
                <p><span>问题描述：</span> {{details.description}}</p>
                <div class="question">
                    <span>问题截取：</span>
                    <div class="img-wrap">
                        <img :src="item" alt="" v-for="item in details.image_group">
                    </div>
                </div>
                <p>
                    <span>状态：</span>
                    <el-select clearable v-model="form.status">
                        <el-option label="待处理" :value="0"></el-option>
                        <el-option label="处理中" :value="1"></el-option>
                        <el-option label="已处理" :value="2"></el-option>
                        <el-option label="待分配" :value="3"></el-option>
                    </el-select>
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
            </section>
            <el-table
                    v-loading="loading"
                    border
                    :data="listData">
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
<script lang="babel">
    import feedBackService from '../../../services/feedBackService'
    export default {
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
                    keyword: ''
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
                    keyword: this.search.keyword
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

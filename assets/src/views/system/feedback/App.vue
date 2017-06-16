<!--日志-企业后台登录-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/topSearch";
    @import "../../../utils/mixins/showDetail";
    .system-manage {
        .show-detail {
            .info {
                padding-bottom: 40px;
                p.select {
                    span.value {
                        > div {
                            width: 100%;
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
        <el-dialog title="查看详情" class="show-detail" v-model="showDetail">
            <div class="info" v-if="detail != null">
                <p><i class="title">问题类型：</i><span class="value">{{detail.category_name}}</span></p>
                <p><i class="title">提交时间：</i><span class="value">{{detail.create_time_name}}</span></p>
                <p><i class="title">提交人：</i><span class="value">{{detail.user_name}}</span></p>
                <p><i class="title">联系方式：</i> <span class="value">{{detail.contact}}</span></p>
                <p><i class="title">问题描述：</i> <span class="value">{{detail.content}}</span></p>
                <p><i class="title">手机型号：</i> <span class="value">{{detail.Device}}</span></p>
                <p><i class="title">APP版本：</i> <span class="value">{{detail.app_version}}</span></p>
                <p><i class="title">系统版本：</i> <span class="value">{{detail.system_version}}</span></p>
                <p class="select remark">
                    <i class="title">备注：</i>
                    <span class="value">
                        <el-input type="textarea" :rows="6" v-model="form.note"></el-input>
                    </span>
                </p>
                <p class="select">
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
                <el-button type="primary" @click="updateFn(detail.id)">提交修改</el-button>
            </span>
        </el-dialog>
        <el-card class="box-card">
            <section class="search">
                <section>
                    <i>关键字</i>
                    <el-input @keyup.enter.native="getData" v-model="fetchParam.keyword"></el-input>
                </section>
                <section>
                    <i>类型：</i>
                    <el-select clearable @change="getData" v-model="fetchParam.category_id">
                        <el-option label="全部" :value="0"></el-option>
                        <el-option label="建议" :value="1"></el-option>
                        <el-option label="操作体验不好" :value="2"></el-option>
                        <el-option label="闪退" :value="3"></el-option>
                        <el-option label="视频无法播放" :value="4"></el-option>
                    </el-select>
                </section>
                <section>
                    <i>状态：</i>
                    <el-select @change="getData" clearable v-model="fetchParam.status">
                        <el-option label="全部" :value="-1"></el-option>
                        <el-option label="待处理" :value="0"></el-option>
                        <el-option label="处理中" :value="1"></el-option>
                        <el-option label="已处理" :value="2"></el-option>
                    </el-select>
                </section>
                <DateRange title="日期" :start="fetchParam.time_start" :end="fetchParam.time_end"
                           v-on:changeStart="val=>fetchParam.time_start=val "
                           v-on:changeEnd="val=>fetchParam.time_end=val "
                           :change="getData"></DateRange>
            </section>
            <el-table
                    v-loading="loading"
                    border
                    :data="listData">
                <el-table-column
                        prop="category_name"
                        label="类型"
                        width="180">
                </el-table-column>
                <el-table-column
                        min-width="200"
                        prop="content"
                        label="问题描述">
                </el-table-column>
                <el-table-column
                        prop="app_version"
                        label="APP版本"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="system_version"
                        label="系统版本"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        label="时间"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="状态" width="100">
                    <template scope="scope">
                        <el-tag type="gray" v-if="scope.row.status == 0">待处理</el-tag>
                        <el-tag type="primary" v-if="scope.row.status == 1">处理中</el-tag>
                        <el-tag type="success" v-if="scope.row.status == 2">已处理</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="operate"
                        label="操作" width="100">
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
    import feedbackSystemService from '../../../services/feedback/system'
    import DateRange from '../../component/form/DateRangePicker.vue'
    export default {
        components: {
            DateRange
        },
        data () {
            return {
                showDetail: false,
                detail: null,
                loading: false,
                currentPage: 1,
                pageSize: 15,
                listData: [],
                total: 0,
                fetchParam: {
                    keyword: '',
                    status: -1,
                    category_id: 0,
                    time_start: '',
                    time_end: ''
                },
                form: {
                    note: '',
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
            deleteFn (row) {
                xmview.showDialog('你将要执行删除操作且不可恢复确认吗？', () => {
                    feedbackSystemService.mobileRemove(row.id).then(() => {
                        xmview.showTip('success', '删除成功')
                        this.getData()
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message)
                    })
                })
            },
            updateFn (id) {
                feedbackSystemService.mobileUpdate({
                    id,
                    status: this.form.status,
                    note: this.form.note
                }).then((ret) => {
                    this.showDetail = false
                    xmview.showTip('success', '提交成功')
                    this.getData()
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            showFn (row) {
                feedbackSystemService.mobileView(row.id).then((ret) => {
                    this.detail = ret.data
                    this.form.status = ret.data.status
                    this.form.note = ret.data.note
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
                    keyword: this.fetchParam.keyword,
                    category_id: this.fetchParam.category_id,
                    status: this.fetchParam.status,
                    time_start: this.fetchParam.time_start,
                    time_end: this.fetchParam.time_end
                }
                return feedbackSystemService.mobileSearch(params).then((ret) => {
                    this.listData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            },
        }
    }
</script>

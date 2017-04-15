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
                .remark {
                    margin-bottom: 10px;
                    > * {
                        display: inline-block;
                        vertical-align: top;
                    }
                    textarea {
                        width: 40%;
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
        接口显示状态 说明不详
        <!--详情-->
        <el-dialog title="查看详情" class="showDetail" v-model="showDetail">
            <div class="info" v-if="details != null">
                <p><span>问题类型：</span>{{details.category}}</p>
                <p><span>提交时间：</span>{{details.create_time}}</p>
                <p><span>提交人：</span>{{details.ContactName}}</p>
                <p><span>联系方式：</span> {{details.contact}}</p>
                <p><span>问题描述：</span> {{details.content}}</p>
                <p><span>手机型号：</span> {{details.app_version}}</p>
                <p><span>系统版本：</span> {{details.system_version}}</p>
                <p class="remark">
                    <span>备注：</span>
                    <el-input type="textarea" :rows="3" v-model="form.note"></el-input>
                </p>
                <p>
                    <span>状态：</span>
                    <el-select clearable v-model="form.status">
                        <el-option label="待处理" :value="1"></el-option>
                        <el-option label="已处理" :value="2"></el-option>
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
                <section>
                    <i>类型：</i>
                    <el-select clearable @change="getData" v-model="search.category">
                        <el-option label="建议" :value="1"></el-option>
                        <el-option label="操作体验不好" :value="2"></el-option>
                        <el-option label="闪退" :value="3"></el-option>
                        <el-option label="视频无法播放" :value="4"></el-option>
                    </el-select>
                </section>
                <section>
                    <i>状态：</i>
                    <el-select @change="getData" clearable v-model="search.status">
                        <el-option label="待处理" :value="1"></el-option>
                        <el-option label="已处理" :value="2"></el-option>
                    </el-select>
                </section>
                <DateRange title="日期" :start="search.time_start" :end="search.time_end"
                           v-on:changeStart="val=>search.time_start=val "
                           v-on:changeEnd="val=>search.time_end=val "
                           :change="getData"></DateRange>
            </section>
            <el-table
                    v-loading="loading"
                    border
                    :data="listData">
                <el-table-column
                        prop="category"
                        label="类型"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="content"
                        label="说明"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="app_version"
                        label="APP版本"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="system_version"
                        label="系统版本"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="create_time"
                        label="时间"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="状态">
                    <template scope="scope">
                        <el-tag type="primary" v-if="scope.row.status == 1">待处理</el-tag>
                        <el-tag type="success" v-if="scope.row.status == 2">已处理</el-tag>
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
                    status: '',
                    category: '',
                    time_start: '',
                    time_end: ''
                },
                form: {
                    note: '',
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
                    feedBackService.deleteMobileData(row.id).then(() => {
                        xmview.showTip('success', '删除成功')
                        this.getData()
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message)
                    })
                })
            },
            updateFn (id) {
                feedBackService.updateMobile({
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
                feedBackService.getMobileDetail(row.id).then((ret) => {
                    this.details = ret.data
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
                    keyword: this.search.keyword,
                    category: this.search.category,
                    status: this.search.status,
                    time_start: this.search.time_start,
                    time_end: this.search.time_end
                }
                return feedBackService.getMobileList(params).then((ret) => {
                    this.listData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            },
        }
    }
</script>

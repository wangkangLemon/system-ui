<!--审计-->
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
        <el-card class="box-card">
            <section class="search">
                <section>
                    <label>状态</label>
                    <el-select clearable @change="getData" v-model="search.statusSelect">
                        <el-option label="已完成" :value="0"></el-option>
                        <el-option label="待处理" :value="1"></el-option>
                        <el-option label="进行中" :value="2"></el-option>
                        <el-option label="失败" :value="3"></el-option>
                    </el-select>
                </section>
                <DateRange title="日期" :start="search.createTime" :end="search.endTime"
                           v-on:changeStart="val=> search.createTime=val"
                           v-on:changeEnd="val=> search.endTime"
                           :change="getData">
                </DateRange>
            </section>
            <el-table
                    :data="exportData" border v-loading="loading">
                <el-table-column
                        prop="name"
                        label="名称">
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="状态"
                        width="180">
                    <template scope="scope">
                        <el-tag type="gray" v-if="scope.row.status == 3">{{statusArr[scope.row.status]}}</el-tag>
                        <el-tag type="primary" v-if="scope.row.status == 1">{{statusArr[scope.row.status]}}</el-tag>
                        <el-tag type="success" v-if="scope.row.status == 0">{{statusArr[scope.row.status]}}</el-tag>
                        <el-tag type="warning" v-if="scope.row.status == 2">{{statusArr[scope.row.status]}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        label="创建时间"
                        width="180">
                </el-table-column>
                <el-table-column prop="operate" label="操作" width="180">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="downLoad(scope.row)">
                            下载
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
    import DateRange from '../component/form/DateRangePicker.vue'
    import analysisService from '../../services/analysisService'
    import authUtils from '../../utils/authUtils'
    export default {
        components: {
            DateRange
        },
        data () {
            return {
                statusArr: ['已完成', '待处理', '进行中', '失败'],
                loading: false,
                total: 0,
                pageSize: 15,
                currentPage: 1,
                search: {
                    statusSelect: '',
                    createTime: '',
                    endTime: '',
                },
                exportData: []
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
                return analysisService.getExportList({
                    page: this.currentPage,
                    page_size: this.pageSize,
                    status: this.search.statusSelect,
                    time_start: this.search.createTime,
                    time_end: this.search.endTime,
                    company_id: authUtils.getUserInfo().company_id
                }).then((ret) => {
                    this.exportData = ret.data
                }).then(() => {
                    this.loading = false
                })
            },
            downLoad (item) {
                analysisService.exportDownload({
                    company_id: item.company_id,
                    job_id: item.last_run.job_id
                })
            }
        }
    }
</script>

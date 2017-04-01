<style lang='scss' scoped rel='stylesheet/scss'>
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/table";
</style>
<style lang="scss">
    .financeManage-money-draw {
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
                padding: 15px;
                padding-top: 0;
                > div {
                    display: inline-block;
                    vertical-align: top;
                    label {
                        margin-right: 2%;
                    }
                    .el-input, .el-select {
                        width: 75%;
                    }
                    .el-date-editor {
                        width: 40%;
                    }
                    @media (max-width: 767px) {
                        .el-input, .el-select, .el-date-editor {
                            width: 100%;
                            margin-top: 10px;
                        }
                    }
                    .time-container {
                        width: 80%;
                        display: inline-block;
                        @media (max-width: 767px) {
                            width: 100%;
                        }
                    }
                }
                @media (min-width: 768px) {
                    display: flex;
                }
                @media (max-width: 767px) {
                    display: block;
                    > div {
                        margin-top: 10px;
                    }
                }
            }
        }
        .block {
            text-align: right;
            margin-top: 15px;
        }
    }
</style>
<template>
    <article class="financeManage-money-draw">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-button><i class="iconfont icon-iconfontexcel"></i>导出Excel</el-button>
            </div>
            <section class="search">
                <UserList v-model="userSelect"
                          v-on:change="val=>userSelect=val"
                          :change="getData">
                </UserList>
                <div>
                    <label>提现状态</label>
                    <el-select @change="getData" clearable v-model="drawStatusSelect" placeholder="未选择">
                        <el-option
                                v-for="(item, index) in drawStatus"
                                :label="item.name"
                                :value="item.value"
                                :key="item.id">
                        </el-option>
                    </el-select>
                </div>
                <DateRange title="申请时间" :start="createTime" :end="endTime"
                           v-on:changeStart="val=> createTime=val"
                           v-on:changeEnd="val=> endTime"
                           :change="getData">
                </DateRange>
            </section>
            <el-table
                    v-loading="loading"
                    border
                    :data="drawData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="draw_no"
                        label="编号">
                </el-table-column>
                <el-table-column
                        prop="money"
                        label="金额"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="user_name"
                        label="姓名">
                </el-table-column>
                <el-table-column
                        prop="bank_name"
                        label="银行">
                </el-table-column>
                <el-table-column
                        prop="card_name"
                        label="卡号">
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="状态">
                </el-table-column>
                <el-table-column
                        prop="admin_name"
                        label="管理员">
                </el-table-column>
                <el-table-column
                        prop="completed_name"
                        label="申请时间">
                </el-table-column>
                <el-table-column
                        prop="operate"
                        label="操作">
                    <template scope="scope">
                        <el-button type="text" size="small">
                            查看数据
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
    import {drawList} from '../../../services/fianace/money'
    import {date2Str} from '../../../utils/timeUtils'
    import UserList from '../../component/select/User'
    import DateRange from '../../component/form/DateRangePicker.vue'
    export default {
        components: {
            UserList,
            DateRange
        },
        data () {
            return {
                loading: false,
                drawStatusSelect: '',
                userSelect: '',
                createTime: '',
                endTime: '',
                currentPage: 1,
                pageSize: 10,
                drawData: [],
                drawStatus: [
                    {
                        id: 1,
                        name: '全部',
                        value: ''
                    },
                    {
                        id: 2,
                        name: '待提现',
                        value: 'pending'
                    },
                    {
                        id: 3,
                        name: '已完成',
                        value: 'complete'
                    },
                    {
                        id: 4,
                        name: '已关闭',
                        value: 'close'
                    }
                ],
                total: 0
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
            getData () { // 获取列表数据
                this.loading = true
                let params = {
                    page: this.currentPage,
                    page_size: this.pageSize,
                    status: this.drawStatusSelect,
                    time_start: date2Str(this.createTime),
                    time_end: date2Str(this.endTime),
                    user_id: this.userSelect
                }
                return drawList(params).then((ret) => {
                    let status = {pending: '待提现', complete: '已完成', close: '已关闭'}
                    this.drawData = ret.data
                    ret.data.forEach((item) => {
                        item.status = status[item.status]
                    })
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            }
        }
    }
</script>

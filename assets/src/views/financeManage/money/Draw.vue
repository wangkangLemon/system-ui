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
                <div>
                    <label>用户</label>
                    <el-select clearable v-model="userSelect" placeholder="未选择">
                        <el-option
                                v-for="(item, index) in users"
                                :label="item.name"
                                :value="item.id"
                                :key="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    <label>提现状态</label>
                    <el-select clearable v-model="drawStatusSelect" placeholder="未选择">
                        <el-option
                                v-for="(item, index) in drawStatus"
                                :label="item.name"
                                :value="item.id"
                                :key="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    <label>申请时间</label>
                    <div class="time-container">
                        <el-date-picker
                                @change="getData"
                                v-model="createTime"
                                type="date"
                                :picker-options="pickerOptionsStart"
                                placeholder="开始时间">
                        </el-date-picker>
                        <el-date-picker
                                @change="getData"
                                v-model="endTime"
                                type="date"
                                :picker-options="pickerOptionsEnd"
                                placeholder="结束时间">
                        </el-date-picker>
                    </div>
                </div>
            </section>
            <el-table
                    border
                    :data="drawData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="drawno"
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
                        prop="course_name"
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
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="pageSize"
                        layout="total, prev, pager, next"
                        :total="total">
                </el-pagination>
            </div>
        </el-card>
    </article>
</template>
<script lang="babel">
    import {drawList} from '../../../services/fianace/money'
    import {date2Str} from '../../../utils/timeUtils'
    let _this
    export default {
        data () {
            return {
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
                users: [
                    {
                        id: 1,
                        name: '用户1',
                    }
                ],
                total: 0,
                pickerOptionsStart: {
                    disabledDate(time) {
                        return !_this.endTime ? null
                                : time.getTime() > _this.endTime.getTime() - 8.64e7
                    }
                },
                pickerOptionsEnd: {
                    disabledDate(time) {
                        return !_this.createTime ? null
                                : time.getTime() < _this.createTime.getTime() + 8.64e7
                    }
                },
            }
        },
        beforeCreate () {
            _this = this
        },
        mounted () {
            this.getData()
        },
        methods: {
            handleCurrentChange(val) {
                this.currentPage = val
                this.getData()
            },
            getData () { // 获取列表数据
                let params = {
                    page: this.currentPage,
                    page_size: this.pageSize,
                    status: this.drawStatusSelect,
                    time_start: date2Str(this.createTime),
                    time_end: date2Str(this.endTime),
                    user_id: this.userSelect
                }
                drawList(params).then((ret) => {
                    this.drawData = ret.data
                    this.total = ret.total
                }).then(() => {
                    xmview.setContentLoading(false)
                })
            }
        }
    }
</script>

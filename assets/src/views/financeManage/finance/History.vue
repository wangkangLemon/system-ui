<style lang='scss' scoped rel='stylesheet/scss'>
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/table";


</style>
<style lang="scss">
    .financeManage-finance-history {
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
                        width: 80%;
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
    <article class="financeManage-finance-history">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-button @click="exportData"><i class="iconfont icon-iconfontexcel"></i>导出Excel</el-button>
            </div>
            <section class="search">
                <div>
                    <label>企业</label>
                    <el-select clearable v-model="companySelect" placeholder="未选择">
                        <el-option
                                v-for="(item, index) in companys"
                                :label="item.name"
                                :value="item.id"
                                :key="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    <label>课程</label>
                    <el-select clearable v-model="courseSelect" placeholder="未选择">
                        <el-option
                                v-for="(item, index) in courses"
                                :label="item.name"
                                :value="item.id"
                                :key="item.id">
                        </el-option>
                    </el-select>
                </div>
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
                    <label>创建时间</label>
                    <div class="time-container">
                        <el-date-picker
                                v-model="createTime"
                                type="date"
                                placeholder="开始时间">
                        </el-date-picker>
                        <el-date-picker
                                v-model="endTime"
                                type="date"
                                placeholder="结束时间">
                        </el-date-picker>
                    </div>
                </div>
            </section>
            <el-table
                    border
                    :data="historyData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="tradeno"
                        label="流水号">
                </el-table-column>
                <el-table-column
                        prop="ent_name"
                        label="企业"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="course_name"
                        label="课程">
                </el-table-column>
                <el-table-column
                        prop="store_name"
                        label="连锁">
                </el-table-column>
                <el-table-column
                        prop="department_name"
                        label="门店">
                </el-table-column>
                <el-table-column
                        prop="user_name"
                        label="店员">
                </el-table-column>
                <el-table-column
                        prop="price"
                        label="金额">
                </el-table-column>
                <el-table-column
                        prop="balance"
                        label="余额">
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
    import {history, exportData} from '../../../services/fianace/finance'
    import {date2Str} from '../../../utils/timeUtils'

    export default {
        data () {
            return {
                companySelect: '',
                courseSelect: '',
                userSelect: '',
                createTime: '',
                endTime: '',
                currentPage: 1,
                pageSize: 10,
                historyData: [],
                companys: [
                    {
                        id: 1,
                        name: '企业1',
                    }
                ],
                users: [
                    {
                        id: 1,
                        name: '用户1',
                    }
                ],
                courses: [
                    {
                        id: 1,
                        name: '课程',
                    }
                ],
                total: 0
            }
        },
        watch: {
            createTime (value) {
                this.createTime = date2Str(value)
                this.pageSize = 1
                this.getData()
            },
            endTime (value) {
                this.endTime = date2Str(value)
                this.pageSize = 1
                this.getData()
            }
        },
        mounted () {
            this.getData()
        },
        methods: {
            handleCurrentChange(val) {
                this.currentPage = val
                this.getData()
            },
            getData (currentPage) {
                let params = {
                    start: this.currentPage,
                    length: this.pageSize,
                    course_id: this.courseSelect,
                    company_id: this.companySelect,
                    time_start: this.createTime,
                    time_end: this.endTime,
                    user_id: this.userSelect
                }
                history(params).then((ret) => {
                    this.historyData = ret.data
                    this.total = ret.total
                }).then(() => {
                    xmview.setContentLoading(false)
                })
            },
            exportData () {
                exportData({
                    course_id: this.courseSelect,
                    company_id: this.companySelect,
                    time_start: this.createTime,
                    time_end: this.endTime,
                    user_id: this.userSelect
                }).then((ret) => {
                    console.log(ret)
                })
            }
        }
    }
</script>

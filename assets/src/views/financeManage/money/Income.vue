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
                <IndustryCompanySelect v-model="companySelect"
                                       v-on:change="val=>companySelect=val"
                                       :change="getData">
                </IndustryCompanySelect>
                <course-list v-model="courseSelect"
                             v-on:change="val=>courseSelect=val"
                             :change="getData">
                </course-list>
                <UserList v-model="userSelect"
                          v-on:change="val=>userSelect=val"
                          :change="getData">
                </UserList>
                <div>
                    <label>创建时间</label>
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
                    v-loading="loading"
                    border
                    :data="historyData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="user_name"
                        label="用户">
                </el-table-column>
                <el-table-column
                        prop="money"
                        label="金额"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="ent_name"
                        label="工业">
                </el-table-column>
                <el-table-column
                        prop="course_name"
                        label="课程">
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        label="创建时间">
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
    import {history, exportData} from '../../../services/fianace/money'
    import {date2Str} from '../../../utils/timeUtils'
    import IndustryCompanySelect from '../../component/select/IndustryCompany'
    import CourseList from '../../component/select/Course'
    import UserList from '../../component/select/User'
    let _this
    export default {
        components: {
            IndustryCompanySelect,
            CourseList,
            UserList
        },
        data () {
            return {
                loading: false,
                companySelect: '',
                courseSelect: '',
                userSelect: '',
                createTime: '',
                endTime: '',
                currentPage: 1,
                pageSize: 10,
                historyData: [],
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
                    course_id: this.courseSelect,
                    enterprise_id: this.companySelect,
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
            },
            exportData () { // 导出数据
                exportData({
                    company_id: this.companySelect,
                    time_start: date2Str(this.createTime),
                    time_end: date2Str(this.endTime),
                    user_id: this.userSelect
                }).then((ret) => {
                    console.log(ret)
                })
            }
        }
    }
</script>

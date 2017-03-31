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
            getData () {
                let params = {
                    page: this.currentPage,
                    page_size: this.pageSize,
                    course_id: this.courseSelect,
                    company_id: this.companySelect,
                    time_start: date2Str(this.createTime),
                    time_end: date2Str(this.endTime),
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

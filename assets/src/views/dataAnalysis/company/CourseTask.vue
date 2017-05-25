<!--课程任务-->
<style lang="scss" rel="stylesheet/scss">
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/topSearch";
    .analysis-company-coursetask {
        .department-analytics {
            height:120px;
            @extend %justify;
            > div {
                height: 100%;
                color: #fff;
                position: relative;
                width: 24%;
                display: inline-block;
                vertical-align: top;
                border-radius: 5px;
                font-size: 12px;
                text-align: right;
                text-align-last: right;
                &:first-of-type {
                    background: #FF9966;
                }
                &:nth-child(2) {
                    background: #2DB6F4;
                }
                &:nth-child(3) {
                    background: #7DC856;
                }
                &:nth-child(4) {
                    background: #5D6977;
                }
                > i {
                    display: block;
                    line-height: 82px;
                    width: 55px;
                    height: 55px;
                    position: absolute;
                    left: 20px;
                    top: 25px;
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 50%;
                    text-align: center;
                    text-align-last: center;
                    .icon-xiaoxizhongxin:before {
                        font-size: 30px;
                    }
                    img {
                        width: 35px;
                        height: 35px;
                    }
                }
                > h2 {
                    margin-top: 20px;
                    font-size: 25px;
                    padding-right: 10px;
                }
                p {
                    font-size: 16px;
                    padding-right: 10px;
                    cursor: pointer;
                }
                > div {
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    background: rgba(255, 255, 255, 0.3);
                    padding: 5px 10px;
                    text-align: left;
                    text-align-last: left;
                    > a {
                        float: right;
                        color: #fff;
                    }
                }
            }
        }
        .search {
            @extend %top-search-container;
        }
        .box-card {
            margin-top: 20px;
            .el-card__header {
                padding: 10px 15px;
                background: #f0f3f5;
            }
            .block {
                text-align: right;
                margin-top: 15px;
            }
        }
    }
</style>
<template>
    <article class="analysis-company-coursetask">
        <section class="department-analytics">
            <div>
                <i><img src="./images/company.png" /></i>
                <h2>134</h2>
                <router-link tag="p" :to="{name: 'company-index'}">使用连锁数量</router-link>
                <div>
                    <i>占连锁总数的12%</i>
                </div>
            </div>
            <div>
                <i><img src="./images/department.png" /></i>
                <h2>222</h2>
                <router-link tag="p" :to="{name: 'company-department'}">使用门店数量</router-link>
                <div>
                    <i>占门店总数的12%</i>
                </div>
            </div>
            <div>
                <i><img src="./images/user.png" /></i>
                <h2>454</h2>
                <router-link tag="p" :to="{name: 'company-user', query: {status: 1}}">企业任务数量</router-link>
                <div>
                    <i>占任务总数的12%</i>
                </div>
            </div>
            <div>
                <i><img src="./images/r_user.png" /></i>
                <h2>1212</h2>
                <router-link tag="p" :to="{name: 'company-user', query: {status: 2}}">分店任务数量</router-link>
                <div>
                    <i>占任务总数的12</i>
                </div>
            </div>
        </section>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>课程任务概览</span>
            </div>
            <section class="search">
                <section>
                    <i>企业</i>
                    <CompanySelect  :change="getData" v-model="search.company_id"
                                           v-on:change="val=>search.company_id=val">
                    </CompanySelect>
                </section>
                <section>
                    <i>门店</i>
                    <DepSelect v-model="search.department_id" :change="getData"></DepSelect>
                </section>
                <DateRange title="发送时间" :start="search.createTime" :end="search.endTime"
                           v-on:changeStart="val=> search.createTime=val"
                           v-on:changeEnd="val=> search.endTime=val"
                           :change="getData">
                </DateRange>
            </section>
            <el-table
                    v-loading="loading"
                    border
                    :data="courseTaskData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="title"
                        min-width="200"
                        label="任务标题">
                </el-table-column>
                <el-table-column
                        prop="course_num"
                        label="课程数量"
                        min-width="100">
                </el-table-column>
                <el-table-column
                        prop="company"
                        min-width="180"
                        label="企业">
                </el-table-column>
                <el-table-column
                        prop="department"
                        min-width="180"
                        label="门店">
                </el-table-column>
                <el-table-column
                        prop="total"
                        min-width="150"
                        label="完成店员/覆盖店员">
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        min-width="180"
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
<script>
    import DateRange from '../../component/form/DateRangePicker.vue'
    import CompanySelect from '../../component/select/IndustryCompany.vue'
    import DepSelect from '../../component/select/Department.vue'
    export default {
        components: {
            DepSelect,
            CompanySelect,
            DateRange
        },
        data () {
            return {
                loading: false,
                courseTaskData: [],
                currentPage: 1,
                pageSize: 15,
                total: 0,
                search: {
                    company_id: '',
                    createTime: '',
                    endTime: '',
                    department_id: ''
                }
            }
        },
        created () {
            xmview.setContentLoading(false)
        },
        methods: {
            handleSizeChange (val) {
                this.pageSize = val
            },
            handleCurrentChange (val) {
                this.currentPage = val
            },
            getData () {
                console.log(1)
            }
        }
    }
</script>

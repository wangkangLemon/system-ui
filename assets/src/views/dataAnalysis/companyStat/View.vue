<!--课程分析-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";

    #analysis-company-stat-view {

        .yestoday-container {
            height: 134px;
            margin-bottom: 5px;
            i {

            }
        }

        .export {
            float: right;
            margin-top: 7px;
        }

        .el-tabs {
            display: inline-block;
        }

        .table-container {
            @extend %content-container;

            .search {
                @extend %top-search-container;
            }
        }
        .tags {
            margin-bottom: 10px;
            overflow: hidden;
        }
        .tags li {
            float: left;
            list-style-type: none;
            padding: 5px 20px;
            border: 1px solid #ccc;
            cursor: pointer;
        }
        .tags .activate{
            background-color: #4db3ff;
            color: #fff;
        }
        .box-card section {
            width: 100%;
            height: 300px;
            display: none;
        }
        #active_user {
            display: block;
        }
    }
</style>

<template>
    <article id="analysis-company-stat-view">
        <el-button type="warning" class="export" @click="exportClick"><i class="iconfont icon-iconfontexcel"></i>
            <i>导出</i></el-button>

        <article class="table-container">
            <article class="search">
                <DateRange title="日期" :start="fetchParam.start_date" :end="fetchParam.end_date"
                           v-on:changeStart="val=> fetchParam.start_date=val"
                           v-on:changeEnd="val=> fetchParam.end_date=val"
                           :change="fetchData">
                </DateRange>
            </article>

            <template>
                <el-tabs v-model="this.tagName" type="card" @tab-click="handleClick">
                    <el-tab-pane label="活跃人数" name="active_user"></el-tab-pane>
                    <el-tab-pane label="学习人数" name="course_user"></el-tab-pane>
                    <el-tab-pane label="考试人数" name="testing_user"></el-tab-pane>
                    <el-tab-pane label="考试次数" name="testing_number"></el-tab-pane>
                    <el-tab-pane label="私有课数量" name="private_number"></el-tab-pane>
                    <el-tab-pane label="私有课考试人数" name="private_testing_user"></el-tab-pane>
                    <el-tab-pane label="私有课考试次数" name="private_testing"></el-tab-pane>
                </el-tabs>
            </template>

            <el-card class="box-card" id="box-card">
                <section id="active_user"></section>
                <section id="course_user"></section>
                <section id="testing_user"></section>
                <section id="testing_number"></section>
                <section id="private_number"></section>
                <section id="private_testing_user"></section>
                <section id="private_testing"></section>
            </el-card>


            <el-table class="data-table" v-loading="loadingData"
                      :data="tableData"
                      :fit="true"
                      border>
                <el-table-column
                        prop="stat_date"
                        min-width="100"
                        label="日期">
                </el-table-column>
                <el-table-column
                        prop="active_user"
                        min-width="100"
                        label="活跃店员数量">
                </el-table-column>
                <el-table-column
                        prop="course_user"
                        min-width="100"
                        label="学习人数">
                </el-table-column>
                <el-table-column
                        prop="testing_user"
                        min-width="100"
                        label="考试人数">
                </el-table-column>
                <el-table-column
                        prop="testing_number"
                        min-width="100"
                        label="考试次数">
                </el-table-column>
                <el-table-column
                        prop="private_number"
                        min-width="100"
                        label="私有课数量">
                </el-table-column>
                <el-table-column
                        prop="private_testing"
                        min-width="100"
                        label="私有课考试次数">
                </el-table-column>
                <el-table-column
                        prop="private_testing_user"
                        min-width="100"
                        label="私有课考试人数">
                </el-table-column>
            </el-table>

            <el-pagination class="pagin"
                           @size-change="val => {fetchParam.page_size = val; fetchData() }"
                           @current-change="val => {fetchParam.page = val; fetchData() }"
                           :current-page="fetchParam.page"
                           :page-size="fetchParam.page_size"
                           :page-sizes="[15, 30, 60, 100]"
                           layout="sizes,total, prev, pager, next"
                           :total="total">
            </el-pagination>
        </article>
    </article>
</template>

<script>
    import Echars from 'echarts'
    import companyService from '../../../services/companyService'
    import CourseSelect from '../../component/select/Course.vue'
    import DepSelect from '../../component/select/Department.vue'
    import StoreSelect from '../../component/select/IndustryCompany.vue'
    import DateRange from '../../component/form/DateRangePicker.vue'

    export default{
        filters: {
            passedPercent (val) {
                if (val) return parseInt(val * 100) + '%'
                else return '-'
            }
        },
        data () {
            return {
                analysis: {},
                total: 0,
                loadingData: false,
                tableData: [],
                type: 0,
                xData: [],
                chart_data: [],
                maxResult: 0,
                chartData: [],
                tagName: 'active_user',
                fetchParam: getFetchParam()
            }
        },
        activated () {
            this.type = parseInt(this.$route.query.type) || 0
            this.fetchParam.course_id = this.$route.query.course_id
            this.fetchParam.department_id = this.$route.query.department_id
            this.fetchParam.store_id = this.$route.query.store_id
            // 页面加载一次
            this.fetchData()

            xmview.setContentBack(this.type > 0)
        },
        methods: {
            handleClick(tab, event) {
                var e = event
                this.xData = []
                this.chart_data = []
                this.chartData.forEach((item) => {
                    this.xData.push(item.day)
                    if (e.target.innerText == '活跃人数') {
                        this.chart_data.push(item.active_user)
                    } else if (e.target.innerText == '学习人数') {
                        this.chart_data.push(item.course_user)
                    } else if (e.target.innerText == '考试人数') {
                        this.chart_data.push(item.testing_user)
                    } else if (e.target.innerText == '考试次数') {
                        this.chart_data.push(item.testing_number)
                    } else if (e.target.innerText == '私有课数量') {
                        this.chart_data.push(item.private_number)
                    } else if (e.target.innerText == '私有课考试人数') {
                        this.chart_data.push(item.private_testing_user)
                    } else if (e.target.innerText == '私有课考试次数') {
                        this.chart_data.push(item.private_testing)
                    }
                })
                if (e.target.innerText == '活跃人数') {
                    this.getLineChart('active_user')
                } else if (e.target.innerText == '学习人数') {
                    this.getLineChart('course_user')
                } else if (e.target.innerText == '考试人数') {
                    this.getLineChart('testing_user')
                } else if (e.target.innerText == '考试次数') {
                    this.getLineChart('testing_number')
                } else if (e.target.innerText == '私有课数量') {
                    this.getLineChart('private_number')
                } else if (e.target.innerText == '私有课考试人数') {
                    this.getLineChart('private_testing_user')
                } else if (e.target.innerText == '私有课考试次数') {
                    this.getLineChart('private_testing')
                }
                var max1 = this.chart_data.reduce(function(a, b) {
                    return Math.max(a, b)
                })
                var arr = [max1]
                this.maxResult = arr.reduce(function(a, b) {
                    return Math.max(a, b)
                })
            },
            getLineChart (id) { // 线性
                var section = document.getElementById('box-card').getElementsByTagName('section')
                for (var i = 0; i < section.length; i++) {
                    section[i].style.display = 'none'
                }
                var documentid = document.getElementById(id)
                documentid.style.display = 'block'
                this.$nextTick(() => {
                    let myChart = Echars.init(documentid)
                    let option = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: []
                        },
                        grid: {
                            left: '3%',
                            right: '0%',
                            bottom: 20, // 通过bottom调整图表的高度 使得x轴label可以全部显示
                            containLabel: true,
                        },
                        xAxis: [
                            {
                                type: 'category',
                                boundaryGap: true,
                                data: this.xData,
                                axisLabel: {
                                    interval: 0,
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                max: Math.ceil(this.maxResult * 1.2)
                            }
                        ],
                        series: [
                            {
                                name: '活跃人数',
                                type: 'line',
                                areaStyle: {
                                    normal: {
                                        color: 'rgba(0, 0, 0, 0)'
                                    }
                                },
                                data: this.chart_data
                            }
                        ]
                    }
                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option)
                    window.onresize = myChart.resize
                })
            },
            initFetchParam () {
                this.fetchParam = getFetchParam()
            },
            handleSizeChange (val) {
                this.fetchParam.page_size = val
                this.fetchParam.getData()
            },
            handleCurrentChange (val) {
                this.page = val
                this.getData()
            },
            fetchData () {
                this.loadingData = true
                this.xData = []
                this.chart_data = []
                return companyService.getCompanyStatView({
                    page: this.fetchParam.page,
                    page_size: this.fetchParam.page_size,
                    store_id: this.$route.query.store_id,
                    start_date: this.fetchParam.start_date,
                    end_date: this.fetchParam.end_date,
                }).then((ret) => {
                    this.total = ret.total
                    this.tableData = ret.data
                    this.loadingData = false
                }),
                companyService.getCompanyStatChart({
                    store_id: this.$route.query.store_id,
                    start_date: this.fetchParam.start_date,
                    end_date: this.fetchParam.end_date,
                }).then((ret) => {
                    this.chartData = ret.data
                    this.chartData.forEach((item) => {
                        this.xData.push(item.day)
                        this.chart_data.push(item.active_user)
                    })
                }).then(() => {
                    this.getLineChart('active_user')
                    var max1 = this.chart_data.reduce(function(a, b) {
                        return Math.max(a, b)
                    })
                    var arr = [max1]
                    this.maxResult = arr.reduce(function(a, b) {
                        return Math.max(a, b)
                    })
                }).then(() => {
                    xmview.setContentBack(true)
                    xmview.setContentLoading(false)
                })
            },
            // 导出点击
            exportClick () {
//                if (this.type == 0) courseService.exportAnalysis(this.fetchParam)
//                else if (this.type == 1) courseService.exportStoreLearn(this.fetchParam)
//                else if (this.type == 2) courseService.exportDepLearn(this.fetchParam)
//                else courseService.exportUserLearn(this.fetchParam)
            }
        },
        components: {CourseSelect, DepSelect, StoreSelect, DateRange}
    }

    function getFetchParam () {
        return {
            date: 'yesterday',
            page: 1,
            page_size: 15,
            type: void 0,
            store_id: void 0,
            start_date: '',
            end_date: '',
        }
    }
</script>

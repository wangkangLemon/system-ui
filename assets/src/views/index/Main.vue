<style lang='scss' rel="stylesheet/scss">
    @import "../../utils/mixins/mixins";
    .index-main-container {
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
        .course-analytics {
            @extend %justify;
            margin: 15px 0;
            height: 120px;
            border: 1px solid #ddd;
            background: #fff;
            border-radius: 5px;
            padding: 25px 0;
            > div {
                display: inline-block;
                vertical-align: top;
                height: 100%;
                border-right: 1px solid #ddd;
                &:last-of-type {
                    border-right: none;
                }
                width: 24%;
                > * {
                    display: inline-block;
                    vertical-align: top;
                }
                .sign {
                    width: 55px;
                    height: 55px;
                    text-align: center;
                    text-align-last: center;
                    border-radius: 50%;
                    margin:10px 20px;
                    &.test {
                        background: #2DB7F5;
                    }
                    &.public {
                        background: #808BC6;
                    }
                    &.primary {
                        background: #7DC856;
                    }
                    &.industry {
                        background: #F9BF00;
                    }
                    line-height: 76px;
                    img {
                        width: 30px;
                        height: 30px;
                    }
                }
                > div {
                    margin-top: 10px;
                    > i {
                        font-size: 12px;
                        color: #666;
                    }
                    > p {
                        font-size: 25px;
                        color: #333;
                    }
                }
            }
        }
        .box-card {
            margin-bottom: 15px;
            color: #333;
            .clearfix {
                text-align: left;
            }
            .el-card__header {
                padding: 10px 15px;
                background: #f0f3f5;
                font-size: 16px;
            }
            #lineChart {
                width: 100%;
                height: 300px;
            }
        }
        .analyics-list {
            @extend %justify;
            > .box-card {
                width: 32%;
                display: inline-block;
                vertical-align: top;
                .el-table {
                    border: none;
                    th {
                        font-weight: normal;
                    }
                    .cell {
                        text-align: left;
                        text-align-last: left;
                        height: 30px !important;
                        line-height: 30px !important;
                        @extend %singline;
                        padding-right: 0;
                    }
                    td {
                        height: 20px !important;
                        line-height: 20px !important;
                        border-bottom: none;
                    }
                }
                .el-card__body {
                    padding: 0;
                }
                th {
                    background: none;
                }
                thead{
                    div {
                        background: none;
                    }
                }
            }
        }
    }
</style>
<template>
    <article class="index-main-container" v-if="mainData != null">
        <section class="department-analytics">
            <div>
                <i><img src="./images/company.png" /></i>
                <h2>{{mainData.company}}</h2>
                <router-link tag="p" :to="{name: 'company-index'}">连锁总数量</router-link>
                <div>
                    <i>昨日新增{{mainData.company_inc}}</i>
                    <router-link tag="a" :to="{name: 'company-index', query: {yesterday}}">查看详情</router-link>
                </div>
            </div>
            <div>
                <i><img src="./images/department.png" /></i>
                <h2>{{mainData.department}}</h2>
                <router-link tag="p" :to="{name: 'company-department'}">门店总数量</router-link>
                <div>
                    <i>昨日新增{{mainData.department_inc}}</i>
                    <router-link tag="a" :to="{name: 'company-department', query: {yesterday}}">查看详情</router-link>
                </div>
            </div>
            <div>
                <i><img src="./images/user.png" /></i>
                <h2>{{mainData.user}}</h2>
                <router-link tag="p" :to="{name: 'company-user', query: {status: 1}}">店员总数量</router-link>
                <div>
                    <i>昨日新增{{mainData.user_inc}}</i>
                    <router-link tag="a" :to="{name: 'company-user', query: {status: 1, yesterday}}">查看详情</router-link>
                </div>
            </div>
            <div>
                <i><img src="./images/r_user.png" /></i>
                <h2>{{mainData.register_user}}</h2>
                <router-link tag="p" :to="{name: 'company-user', query: {status: 2}}">用户总数量</router-link>
                <div>
                    <i>昨日新增{{mainData.register_user_inc}}</i>
                    <router-link tag="a" :to="{name: 'company-user', query: {status: 2, yesterday}}">查看详情</router-link>
                </div>
            </div>
        </section>
        <section class="course-analytics">
            <div>
                <i class="sign test"><img src="./images/testing.png" /></i>
                <div>
                    <i>考试次数</i>
                    <p>{{mainData.testing}}</p>
                </div>
            </div>
            <div>
                <i class="sign public"><img src="./images/public.png" /></i>
                <div>
                    <i>公开课数量</i>
                    <p>{{mainData.public_course}}</p>
                </div>
            </div>
            <div>
                <i class="sign primary"><img src="./images/primary.png" /></i>
                <div>
                    <i>私有课数量</i>
                    <p>{{mainData.private_course}}</p>
                </div>
            </div>
            <div>
                <i class="sign industry"><img src="./images/industry.png" /></i>
                <div>
                    <i>工业课数量</i>
                    <p>{{mainData.industry_course}}</p>
                </div>
            </div>
        </section>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                近30天活跃人数/考试人数/考试次数
            </div>
            <section id="lineChart"></section>
        </el-card>
        <section class="analyics-list">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    昨日考试课程TOP 10
                </div>
                <el-table
                        :data="mainData.test_course_list"
                        style="width: 100%">
                    <el-table-column
                            :show-overflow-tooltip="true"
                            prop="item1"
                            label="课程名称">
                    </el-table-column>
                    <el-table-column
                            prop="item2"
                            width="90"
                            label="课程类型">
                    </el-table-column>
                    <el-table-column
                            prop="num1"
                            width="90"
                            label="考试次数">
                    </el-table-column>
                    <el-table-column
                            prop="num2"
                            width="90"
                            label="考试人数">
                    </el-table-column>
                </el-table>
            </el-card>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    昨日考试连锁TOP 10
                </div>
                <el-table
                        :data="mainData.test_company_list"
                        style="width: 100%">
                    <el-table-column
                            :show-overflow-tooltip="true"
                            prop="item1"
                            label="连锁名称">
                    </el-table-column>
                    <el-table-column
                            prop="num1"
                            width="90"
                            label="考试次数">
                    </el-table-column>
                    <el-table-column
                            prop="num2"
                            width="90"
                            label="考试人数">
                    </el-table-column>
                </el-table>
            </el-card>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    昨日活跃连锁TOP 10
                </div>
                <el-table
                        :data="mainData.act_company_list"
                        style="width: 100%">
                    <el-table-column
                            :show-overflow-tooltip="true"
                            prop="item1"
                            label="连锁名称">
                    </el-table-column>
                    <el-table-column
                            prop="num1"
                            width="90"
                            label="活跃店员">
                    </el-table-column>
                    <el-table-column
                            prop="num2"
                            width="90"
                            label="录入店员">
                    </el-table-column>
                </el-table>
            </el-card>
        </section>
    </article>
</template>
<script>
    import Echars from 'echarts'
    import mainService from '../../services/mainService'
    import * as timeUtils from '../../utils/timeUtils'
    let d = new Date()
    export default {
        data () {
            return {
                yesterday: timeUtils.date2Str(new Date(d.setTime(Date.now() - 24 * 60 * 60 * 1000))),
                mainData: null,
                xData: [],
                wapData: [],
                appData: [],
                testData: [],
                timeData: [],
                maxResult: 0
            }
        },
        mounted () {
            mainService.getMain().then((ret) => {
                this.mainData = ret.stat
                let chartData = ret.chart.active
                chartData.forEach((item) => {
                    this.xData.push(item.day)
                    this.appData.push(item.x)  // x: app活跃
                    this.wapData.push(item.h)  // h: wap活跃
                    this.testData.push(item.y) // y: 考试人数
                    this.timeData.push(item.z) // z: 考试次数
                })
            }).then(() => {
                this.getLineChart()
                var max1 = this.appData.reduce(function(a, b) {
                    return Math.max(a, b)
                })
                var max2 = this.wapData.reduce(function(a, b) {
                    return Math.max(a, b)
                })
                var max3 = this.testData.reduce(function(a, b) {
                    return Math.max(a, b)
                })
                var max4 = this.timeData.reduce(function(a, b) {
                    return Math.max(a, b)
                })
                var arr = [max1, max2, max3, max4]
                this.maxResult = arr.reduce(function(a, b) {
                    return Math.max(a, b)
                })
            }).then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            getLineChart () { // 线性
                this.$nextTick(() => {
                    let myChart = Echars.init(document.getElementById('lineChart'))
                    let option = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['app活跃人数', 'wap活跃人数', '考试人数', '考试次数']
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
                                boundaryGap: false,
                                data: this.xData,
                                axisLabel: {
                                    interval: 1,
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
                                name: 'app活跃人数',
                                type: 'line',
                                areaStyle: {
                                    normal: {
                                        color: 'rgba(0, 0, 0, 0)'
                                    }
                                },
                                data: this.appData
                            },
                            {
                                name: 'wap活跃人数',
                                type: 'line',
                                areaStyle: {
                                    normal: {
                                        color: 'rgba(0, 0, 0, 0)'
                                    }
                                },
                                data: this.wapData
                            },
                            {
                                name: '考试人数',
                                type: 'line',
                                areaStyle: {
                                    normal: {
                                        color: 'rgba(0, 0, 0, 0)'
                                    }
                                },
                                data: this.testData
                            },
                            {
                                name: '考试次数',
                                type: 'line',
                                areaStyle: {
                                    normal: {
                                        color: 'rgba(0, 0, 0, 0)'
                                    }
                                },
                                data: this.timeData
                            }
                        ]
                    }
                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option)
                    window.onresize = myChart.resize
                })
            }
        }
    }
</script>

<style lang='scss' rel="stylesheet/scss">
    @import "../../utils/mixins/mixins";
    .main-container {
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
                    width: 55px;
                    height: 55px;
                    position: absolute;
                    left: 20px;
                    top: 25px;
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 50%;
                    text-align: center;
                    text-align-last: center;
                    line-height: 60px;
                    .icon-xiaoxizhongxin:before {
                        font-size: 30px;
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
                    line-height: 55px;
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
                        text-align: center;
                        text-align-last: center;
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
    <article class="main-container">
        <section class="department-analytics">
            <div>
                <i><i class="iconfont icon-xiaoxizhongxin"></i></i>
                <h2>120</h2>
                <p>连锁总数量</p>
                <div>
                    <i>昨日新增12</i>
                    <a href="#">查看详情</a>
                </div>
            </div>
            <div>
                <i></i>
                <h2>120</h2>
                <p>连锁总数量</p>
                <div>
                    <i>昨日新增12</i>
                    <a href="#">查看详情</a>
                </div>
            </div>
            <div>
                <i></i>
                <h2>120</h2>
                <p>连锁总数量</p>
                <div>
                    <i>昨日新增12</i>
                    <a href="#">查看详情</a>
                </div>
            </div>
            <div>
                <i></i>
                <h2>120</h2>
                <p>连锁总数量</p>
                <div>
                    <i>昨日新增12</i>
                    <a href="#">查看详情</a>
                </div>
            </div>
        </section>
        <section class="course-analytics">
            <div>
                <i class="sign test"></i>
                <div>
                    <i>考试次数</i>
                    <p>123,45</p>
                </div>
            </div>
            <div>
                <i class="sign public"></i>
                <div>
                    <i>公开课数量</i>
                    <p>123,45</p>
                </div>
            </div>
            <div>
                <i class="sign primary"></i>
                <div>
                    <i>私有课数量</i>
                    <p>123,45</p>
                </div>
            </div>
            <div>
                <i class="sign industry"></i>
                <div>
                    <i>工业课数量</i>
                    <p>123,45</p>
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
                        :data="tableData"
                        style="width: 100%">
                    <el-table-column
                            prop="date"
                            label="课程名称">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            width="90"
                            label="课程类型">
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            width="90"
                            label="考试次数">
                    </el-table-column>
                    <el-table-column
                            prop="address"
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
                        :data="tableData"
                        style="width: 100%">
                    <el-table-column
                            prop="date"
                            label="连锁名称">
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            width="90"
                            label="考试次数">
                    </el-table-column>
                    <el-table-column
                            prop="address"
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
                        :data="tableData"
                        style="width: 100%">
                    <el-table-column
                            prop="date"
                            label="连锁名称">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            width="90"
                            label="活跃店员">
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            width="90"
                            label="录入店员">
                    </el-table-column>
                </el-table>
            </el-card>
        </section>
    </article>
</template>
<script lang="babel">
    import Echars from 'echarts'
    import {date2Str} from '../../utils/timeUtils'
    export default {
        data () {
            return {
                pillarData: [],
                tableData: [
                    {
                        date: '上海市普陀区金沙江路 1518 弄',
                        name: '王小虎',
                        address: '2'
                    },
                    {
                        date: '上海市普陀区金沙江路 1518 弄',
                        name: '王小虎',
                        address: '2'
                    }
                ]
            }
        },
        mounted () {
            for (let i = 1; i < 31; i++) {
                let curDate = date2Str(new Date(new Date().setTime(Date.now() - 24 * 60 * 60 * 1000 * i)), '-', {hashour: false, hasDay: true})
//                let curDate = new Date().setTime(Date.now() - 24 * 60 * 60 * 1000 * i)
                this.pillarData.push(curDate)
            }
            this.pillarData = this.pillarData.reverse()

            this.getLineCahrt()
        },
        created () {
            xmview.setContentLoading(false)
        },
        methods: {
            getLineCahrt () { // 线性
                let myChart = Echars.init(document.getElementById('lineChart'))
                let option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['app活跃人数', 'wap活跃人数', '考试人数', '考试次数']
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
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
                            data: this.pillarData,
                            axisLabel: {
                                interval: 1,
                                rotate: 60,
                                formatter: function (value, index) {
                                    // 格式化成月/日，只在第一个刻度显示年份
                                    var date = new Date(value)
                                    var texts = [date.getMonth() + 1, date.getDate()]
                                    return texts.join('/')
                                }
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            max: 4000
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
                            data: [1200, 1320, 1010, 1340, 900, 2300, 2100, 1200, 1320, 1010, 1340, 900, 2300, 2100, 1200, 1320, 1010, 1340, 900, 2300, 2100, 1200, 1320, 1010, 1340, 900, 2300, 2100, 430, 540]
                        },
                        {
                            name: 'wap活跃人数',
                            type: 'line',
                            areaStyle: {
                                normal: {
                                    color: 'rgba(0, 0, 0, 0)'
                                }
                            },
                            data: [1200, 1820, 1910, 2340, 2900, 3300, 3100]
                        },
                        {
                            name: '考试人数',
                            type: 'line',
                            areaStyle: {
                                normal: {
                                    color: 'rgba(0, 0, 0, 0)'
                                }
                            },
                            data: [220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            name: '考试次数',
                            type: 'line',
                            areaStyle: {
                                normal: {
                                    color: 'rgba(0, 0, 0, 0)'
                                }
                            },
                            data: [1500, 2320, 2010, 1540, 1900, 3300, 4000]
                        }
                    ]
                }
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option)
            }
        }
    }
</script>

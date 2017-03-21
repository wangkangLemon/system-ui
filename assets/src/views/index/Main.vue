<style lang="scss">
    @import "../../utils/mixins/mixins";
    .main-container {
         color: #fff;
        .sum-data {
            @extend %justify;
            > div {
                vertical-align: top;
                display: inline-block;
                height: px2rem(60);
                width: 32%;
                &.department {
                    background: green;
                }
                &.clerk {
                    background: blue;
                }
                &.exam {
                    background: purple;
                }
            }
        }
        .exam-echars {
            height: px2rem(200);
            display: flex;
            .exam-left {
                width: 80%;
            }
            .exam-right {
                width: 20%;
            }
        }
        #lineChart {
            margin-top: px2rem(40);
            width: 100%;
            height: px2rem(200);
        }
    }
</style>
<template>
    <article class="main-container">
        <section class="sum-data">
            <div class="department">门店数量</div>
            <div class="clerk">店员数量</div>
            <div class="exam">考试人次</div>
        </section>
        <section class="exam-echars">
            <div class="exam-left" id="pillar"></div>
            <div class="exam-right" id="pieChart"></div>
        </section>
        <section id="lineChart"></section>
    </article>
</template>
<script lang="babel">
    import Echars from 'echarts'
    import {date2Str} from '../../utils/timeUtils'
    export default {
        data () {
            return {
                pillarData: []
            }
        },
        mounted () {
            for (let i = 1; i < 31; i++) {
                let curDate = date2Str(new Date(new Date().setTime(Date.now() - 24 * 60 * 60 * 1000 * i)), '-', {hashour: false, hasDay: true})
                this.pillarData.push(curDate)
            }
//            this.pillarData = this.pillarData.reverse()
            this.getPillarChart()
            this.getPieChart()
            this.getLineCahrt()
        },
        methods: {
            getPillarChart () {
                // 基于准备好的dom，初始化echarts实例
                let myChart = Echars.init(document.getElementById('pillar'))
                // 柱状图
                let option = {
                    title: {
                        text: '近30天考试人数',
                        subtext: '及格率统计'
                    },
                    tooltip: {
                        trigger: 'axis',
                    },
                    legend: {
                        data: ['及格的人数', '不及格的人数']
                    },
                    grid: {
                        left: '3%',
                        right: '1%',
                        bottom: '0',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: this.pillarData,
                            axisLabel: {
                                interval: 2,
                            },
                            axisTick: {
                                alignWithLabel: true // 柱在刻度中间
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            max: 2
                        }
                    ],
                    series: [
                        {
                            name: '及格的人数',
                            type: 'bar',
                            barWidth: '30%',
                            data: [1, 2, 1, 1, 1, 2]
                        },
                        {
                            name: '不及格的人数',
                            type: 'bar',
                            barWidth: '30%',
                            data: [2, 0, 0, 0, 0, 0]
                        }
                    ]
                }
                myChart.setOption(option)
            },
            getPieChart () {
                let myChart = Echars.init(document.getElementById('pieChart'))
                let option = {
                    title: {
                        text: '共976人考试',
                        subtext: '总及格率'
                    },
                    tooltip: {
                        show: false,
//                        trigger: 'item',
//                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                    },
                    grid: {
                        bottom: '0'
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        y: 'bottom',
                        data: [{icon: 'circle', name: '及格'}, {icon: 'circle', name: '不及格'}]
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            label: {
                                normal: {
                                    formatter: '{b} \n {c}',
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: [
                                {
                                    value: 3350,
                                    name: '及格',
                                    label: {
                                        normal: {
                                            textStyle: {
                                                fontSize: 24
                                            }
                                        }
                                    }
                                },
                                {
                                    value: 310,
                                    name: '不及格',
                                    selected: true,
                                    label: {
                                        normal: {
                                            position: 'center',
                                            textStyle: {
                                                fontSize: 24
                                            }
                                        }
                                    }
                                },
                            ]
                        }
                    ]
                }
                myChart.setOption(option)
            },
            getLineCahrt () {
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
                        bottom: '0',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: this.pillarData,
                            axisLabel: {
                                interval: 2,
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

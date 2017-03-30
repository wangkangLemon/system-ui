<style lang='scss' scoped rel='stylesheet/scss'>
    @import "../../../utils/mixins/mixins";

    .financeManage-finance-amount {
        .panel {
            @extend %justify;
            > div {
                width: 49%;
                display: inline-block;
                vertical-align: top;
            }
        }
    }

    #incomeLine {
        width: 100%;
        height: 350px;
    }
</style>
<style lang="scss">
    .financeManage-finance-amount {
        .box-card {
            margin-bottom: 20px;
            .el-card__header {
                padding: 10px 15px;
                background: #f0f3f5;
            }
        }
        .block {
            text-align: right;
            margin-top: 15px;
        }
    }
</style>
<template>
    <article class="financeManage-finance-amount">
        <section class="panel">
            <div>
                <amount-panel :title="balance.title" :content="balance.content" :bgColor="balance.bgColor"
                              :footer="balance.footer"></amount-panel>
            </div>
            <div>
                <amount-panel :title="expend.title" :content="expend.content" :bgColor="expend.bgColor"
                              :footer="expend.footer"></amount-panel>
            </div>
        </section>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>收支趋势</span>
            </div>
            <section id="incomeLine"></section>
        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>工业账户</span>
            </div>
            <el-table
                    border
                    :data="industryData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="name"
                        label="工业">
                </el-table-column>
                <el-table-column
                        prop="balance"
                        label="账户余额"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="expend"
                        label="累计支出">
                </el-table-column>
                <el-table-column
                        prop="price"
                        label="课程单价">
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="pageSize"
                        layout="total, prev, pager, next"
                        :total="1000">
                </el-pagination>
            </div>
        </el-card>
    </article>
</template>
<script lang="babel">
    import AmountPanel from '../../component/panel/AmountPanel'
    import Echars from 'echarts'
    import {date2Str} from '../../../utils/timeUtils'
    export default {
        components: {
            AmountPanel
        },
        data () {
            return {
                pageSize: 10,
                balance: {
                    title: '当前余额',
                    content: '223.00',
                    bgColor: '#348fe2',
                    footer: '累计充值'
                },
                expend: {
                    title: '当前余额',
                    content: '223.00',
                    bgColor: '#348fe2',
                    footer: '累计充值'
                },
                pillarData: [],
                industryData: [
                    {
                        id: 1,
                        name: '演示用制药企业',
                        balance: '222.22',
                        expend: '89.00',
                        price: '2.00'
                    },
                    {
                        id: 2,
                        name: '演示用制药企业',
                        balance: '222.22',
                        expend: '89.00',
                        price: '2.00'
                    }
                ],
                currentPage: 1, // 当前页
            }
        },
        mounted () {
            for (let i = 1; i < 31; i++) {
                let curDate = date2Str(new Date(new Date().setTime(Date.now() - 24 * 60 * 60 * 1000 * i)), '-', {
                    hashour: false,
                    hasDay: true
                })
//                let curDate = new Date().setTime(Date.now() - 24 * 60 * 60 * 1000 * i)
                this.pillarData.push(curDate)
            }
            this.pillarData = this.pillarData.reverse()
            this.getLineCahrt()
        },
        methods: {
            getLineCahrt () { // 线性
                let myChart = Echars.init(document.getElementById('incomeLine'))
                let option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    grid: {
                        left: '1%',
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
                                interval: 2,
                                textStyle: {
                                    color: '#000'
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    color: 'green',
                                    width: 2,
                                }
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            max: 1,
                            min: 0
                        }
                    ],
                    series: [
                        {
                            name: '收入',
                            type: 'line',
                            areaStyle: {
                                normal: {
                                    color: 'rgba(0, 0, 0, 0)'
                                }
                            },
                            lineStyle: {
                                normal: {
                                    color: 'green'
                                }
                            },
                            data: [0.2, 0.8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        },
                        {
                            name: '支出',
                            type: 'line',
                            lineStyle: {
                                normal: {
                                    color: 'green'
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: 'rgba(0, 0, 0, 0)'
                                }
                            },
                            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        }
                    ]
                }
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option)
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`)
            },
            handleCurrentChange(val) {
                this.currentPage = val
                console.log(`当前页: ${val}`)
            }
        }
    }
</script>

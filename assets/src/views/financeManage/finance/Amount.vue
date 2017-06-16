<style lang='scss' rel='stylesheet/scss'>
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

    #incomeLine {
        width: 100%;
        height: 350px;
    }
</style>
<template>
    <article class="financeManage-finance-amount">
        <section class="panel">
            <div>
                <amount-panel title="当前余额" :content="balance.content" bgColor="#348fe2"
                              :footer="balance.footer"></amount-panel>
            </div>
            <div>
                <amount-panel title="今日支出" :content="expend.content" bgColor="#00acac"
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
                    v-loading="loading"
                    :data="industryData">
                <el-table-column
                        min-width="200"
                        prop="company"
                        label="工业">
                </el-table-column>
                <el-table-column
                        prop="balance"
                        label="账户余额"
                        width="150">
                </el-table-column>
                <el-table-column
                        width="150"
                        prop="consume"
                        label="累计支出">
                </el-table-column>
                <el-table-column
                        width="150"
                        prop="price"
                        label="课程单价">
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
                        :total="dataTotal">
                </el-pagination>
            </div>
        </el-card>
    </article>
</template>
<script>
    import AmountPanel from '../../component/panel/AmountPanel'
    import Echars from 'echarts'
    import * as finance from '../../../services/fianace/finance'
    export default {
        components: {
            AmountPanel
        },
        data () {
            return {
                loading: false,
                companyId: JSON.parse(localStorage.getItem('KEY_AUTH_UTILS_USERINFO')).company_id,
                pageSize: 15,
                balance: {
                    content: '',
                    footer: '累计充值 '
                },
                expend: {
                    content: '',
                    footer: '累计支出 '
                },
                charge: [], // 收入
                consume: [], // 支出
                pillarData: [], // X轴数据
                industryData: [],
                currentPage: 1, // 当前页
                dataTotal: 0
            }
        },
        activated () {
            // 余额和累计支出接口
            finance.getfinance().then((ret) => {
                this.balance.content = ret.balance
                this.balance.footer = this.balance.footer + ret.charge
                this.expend.content = ret.consumeToday
                this.expend.footer = this.expend.footer + ret.consume
                // 余额的百分比
                // percentCharge
                // 支出的百分比
                // percentConsume
            }).then(() => {
                xmview.setContentLoading(false)
            })

            // 收支趋势
            finance.incomeConsume().then((ret) => {
                ret.forEach((item) => {
                    this.pillarData.push(item.created)
                    this.charge.push(item.charge)
                    this.consume.push(item.consume)
                })
            }).then(() => {
                // 初始化数据图表
                this.getLineCahrt()
            })

            // 工业查询
            this.getData(this.currentPage)
        },
        methods: {
            handleSizeChange (val) {
                this.pageSize = val
                this.getData()
            },
            getLineCahrt () { // 线性
                let myChart = Echars.init(document.getElementById('incomeLine'))
                let option = {
                    tooltip: {
                        trigger: 'axis'
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
                            data: this.charge
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
                            data: this.consume
                        }
                    ]
                }
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option)
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getData(val)
            },
            getData () {
                this.loading = true
                finance.industry(this.currentPage, this.pageSize).then((ret) => {
                    this.industryData = ret.data
                    this.dataTotal = ret.total
                    this.loading = false
                })
            }
        }
    }
</script>

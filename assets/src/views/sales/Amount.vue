<style lang='scss' scoped rel='stylesheet/scss'>
    #sales-amount-container {
        padding: 15px;
    }

    // 头部晒单和返现的container
    .shaidan-fanxian-container {
    }

    .tabs {
        margin-top: 11px;
    }
</style>

<style lang="scss" rel="stylesheet/scss">
    #sales-amount-container {
        .el-card__header {
            background: #f8f8f8;
            padding: 10px 20px;
        }
    }
</style>

<template>
    <article id="sales-amount-container">
        <el-row class="shaidan-fanxian-container" :gutter="20">
            <el-col :span="12">
                <AmountPanel title="今日晒单" :content="amount.recordsToday" :footer="'累计晒单 ' + amount.records"
                             bgColor="#348fe2">
                </AmountPanel>
            </el-col>
            <el-col :span="12">
                <AmountPanel title="今日返现" :content="amount.rebateToday" :footer="'累计返现 ' + amount.rebate"
                             bgColor="#00acac">
                </AmountPanel>
            </el-col>
        </el-row>

        <el-tabs v-model="activeName" class="tabs">
            <el-tab-pane label="今日" name="today"></el-tab-pane>
            <el-tab-pane label="昨日" name="yestoday"></el-tab-pane>
            <el-tab-pane label="本周" name="week"></el-tab-pane>
            <el-tab-pane label="本月" name="month"></el-tab-pane>
        </el-tabs>

        <!--工业分析表格-->
        <el-card class="box-card">
            <div slot="header">
                <span>工业分析</span>
            </div>
            <div class="text item">
                <el-table v-loading="loadingIndustry"
                          :data="industry"
                          border
                          style="width: 100%"
                          :default-sort="{prop: 'records', order: 'descending'}">
                    <el-table-column
                            prop="ent_name"
                            label="工业">
                    </el-table-column>
                    <el-table-column
                            prop="records"
                            label="晒单总数"
                            sortable>
                    </el-table-column>
                    <el-table-column
                            sortable
                            prop="amount"
                            label="卖出数量">
                    </el-table-column>
                    <el-table-column
                            sortable
                            prop="money"
                            label="卖出总额">
                    </el-table-column>
                    <el-table-column
                            sortable
                            prop="rebate"
                            label="返现总额">
                    </el-table-column>
                </el-table>
            </div>
        </el-card>

        <!--药品分析表格-->
        <el-card class="box-card" style="margin-top: 25px">
            <div slot="header">
                <span>药品分析</span>
            </div>
            <div class="text item">
                <el-table v-loading="loadingDrug"
                          :data="drug"
                          border
                          style="width: 100%"
                          :default-sort="{prop: 'records', order: 'descending'}">
                    <el-table-column
                            prop="product_name"
                            label="药品">
                    </el-table-column>
                    <el-table-column
                            prop="ent_name"
                            label="工业">
                    </el-table-column>
                    <el-table-column
                            prop="records"
                            label="晒单总数"
                            sortable>
                    </el-table-column>
                    <el-table-column
                            sortable
                            prop="amount"
                            label="卖出数量">
                    </el-table-column>
                    <el-table-column
                            sortable
                            prop="money"
                            label="卖出总额">
                    </el-table-column>
                    <el-table-column
                            sortable
                            prop="rebate"
                            label="返现总额">
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </article>
</template>

<script lang='babel'>
    import AmountPanel from '../component/panel/AmountPanel.vue'
    import salesService from '../../services/salesService'
    export default{
        data () {
            return {
                amount: {}, // 总览信息
                activeName: 'today',
                industry: [], // 工业分析
                drug: [], // 药品分析
                loadingIndustry: false, // 加载工业分析
                loadingDrug: false, // 加载药品
            }
        },
        created () {
            // 加载数据
            Promise.all([this.getIndustryData(this.activeName),
                this.getDrugData(this.activeName),
                salesService.getAmount().then((ret) => {
                    this.amount = ret.analytics
                    return true
                })])
                .then(() => {
                    xmview.setContentLoading(false)
                }, () => {
                    xmview.setContentLoading(false)
                })
        },
        watch: {
            'activeName': function (val) {
                this.getIndustryData(val)
                this.getDrugData(val)
            }
        },
        methods: {
            // 获取工业分析数据
            getIndustryData (type) {
                this.loadingIndustry = true
                return salesService.getIndustryAnalysis({type}).then((ret) => {
                    this.industry = ret.data
                    setTimeout(() => {
                        this.loadingIndustry = false
                    }, 200)
                })
            },
            // 获取药品分析数据
            getDrugData (type) {
                this.loadingDrug = true
                return salesService.getDrugAnalysis({type}).then((ret) => {
                    this.drug = ret.data
                    setTimeout(() => {
                        this.loadingDrug = false
                    }, 200)
                })
            }
        },
        components: {AmountPanel}
    }
</script>

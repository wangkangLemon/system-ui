<style lang='scss' scoped rel='stylesheet/scss'>
    @import "../../../utils/mixins/mixins";

    .financeManage-money-amount {
        .panel {
            @extend %justify;
            > div {
                width: 49%;
                display: inline-block;
                vertical-align: top;
            }
        }
    }
</style>
<style lang="scss">
    .financeManage-money-amount {
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
    <article class="financeManage-money-amount">
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
                <span>工业账户</span>
            </div>
            <el-table
                    v-loading="loading"
                    border
                    :data="industryData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="company"
                        label="工业">
                </el-table-column>
                <el-table-column
                        prop="balance"
                        label="账户余额"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="total"
                        label="累计充值">
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
    import AmountPanel from '../../component/panel/AmountPanel'
    import {getMoney, industry} from '../../../services/fianace/money'
    export default {
        components: {
            AmountPanel
        },
        data () {
            return {
                loading: false,
                companyId: JSON.parse(localStorage.getItem('KEY_AUTH_UTILS_USERINFO')).company_id,
                balance: {
                    content: '',
                    footer: '累计充值 '
                },
                expend: {
                    content: '',
                    footer: '累计支出 '
                },
                industryData: [],
                currentPage: 1,
                total: 0,
                pageSize: 10
            }
        },
        mounted () {
            getMoney().then((ret) => {
                this.balance.content = ret.balance
                this.balance.footer = this.balance.footer + ret.total
                this.expend.content = ret.consume
                this.expend.footer = this.expend.footer + ret.consumeToday
            }).then(() => {
                xmview.setContentLoading(false)
            })
            this.getData()
        },
        methods: {
            handleSizeChange (val) {
                this.pageSize = val
                this.getData()
            },
            handleCurrentChange (val) {
                this.currentPage = val
            },
            getData () {
                this.loading = true
                industry(this.currentPage, this.pageSize).then((ret) => {
                    this.industryData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            }
        }
    }
</script>

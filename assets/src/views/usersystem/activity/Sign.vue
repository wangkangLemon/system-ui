<!--签到-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/mixins";
    .activity-sign-container {
        .el-card {
            margin-bottom: 10px;
            .el-card__header {
                padding: 10px 15px;
                background: #f0f3f5;
                .tip {
                    color: #999;
                    font-size: 12px;
                }
                .right-button {
                    float: right;
                }
            }
            .calendar-main {
                margin: 0 auto;
                width: 70%;
                .calendar-header {
                    text-align: center;
                    > * {
                        display: inline-block;
                        vertical-align: top;
                    }
                    .operate {
                        float: right;
                    }
                }
            }
            .introduce {
                border: 1px solid #ededed;
                .title {
                    border-bottom: 1px solid #ededed;
                    font-size: 14px;
                    padding: 15px;
                    position: relative;
                    .right-button {
                        position: absolute;
                        right: 15px;
                        @extend %verticalCenter;
                    }
                }
            }
        }
    }
</style>

<template>
    <article class="activity-sign-container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">签到积分设置<i class="tip">（每天签到随机获得5、10、15积分）</i></div>
            <div class="calendar-main">
                <section class="calendar-header">
                    <!--月份切换-->
                    <ToggleMonth @toggleMonth="toggleMonth"></ToggleMonth>
                    <div class="operate">
                        <el-button type="warning">复制</el-button>
                        <el-button type="primary"
                                   v-if="currDate > new Date() || currDate.getMonth() == new Date().getMonth()"
                                   @click="isEdit = true">编辑</el-button>
                        <el-button type="success" @click="setIntegral">保存</el-button>
                    </div>
                </section>
                <!--月历-->
                <MonthCalendar @changeEditStatus="val => isEdit = val" :isEdit="isEdit" :listChecked="days" :date="currDate"></MonthCalendar>
            </div>
        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">月末礼包设置</div>
            <el-table
                    border
                    :data="monthGift">
                <el-table-column
                        prop="company"
                        label="奖品">
                </el-table-column>
                <el-table-column
                        prop="balance"
                        label="中奖概率"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="total"
                        label="库存剩余">
                </el-table-column>
                <el-table-column
                        prop="operate"
                        label="操作">
                    <template scope="scope">
                        <el-button type="text">修改</el-button>
                        <el-button type="text" v-if="monthGift.length > 1">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">连续签到七天</div>
            <el-table
                    border
                    :data="sevenDaysGift">
                <el-table-column
                        prop="company"
                        label="奖品">
                </el-table-column>
                <el-table-column
                        prop="balance"
                        label="中奖概率"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="total"
                        label="库存剩余">
                </el-table-column>
                <el-table-column
                        prop="operate"
                        label="操作">
                    <template scope="scope">
                        <el-button type="text">修改</el-button>
                        <el-button type="text" v-if="sevenDaysGift.length > 1">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">签到说明</div>
            <div class="introduce">
                <div class="title">
                    客户端签到页面底部说明
                    <div class="right-button">
                        <el-button type="primary">编辑</el-button>
                        <el-button type="success">保存</el-button>
                    </div>
                </div>
                <div class="content">

                </div>
            </div>
            <!--<el-input type="textarea" :rows="3"></el-input>-->
        </el-card>
    </article>
</template>

<script>
    import ToggleMonth from '../component/ToggleMonth.vue'
    import MonthCalendar from '../component/MonthCalendar'
    export default {
        components: {
            ToggleMonth,
            MonthCalendar
        },
        data () {
            return {
                isEdit: false,
                currDate: new Date(),
                days: [],
                monthGift: [], // 月末礼包数据
                sevenDaysGift: [], // 7天奖品设置
            }
        },
        activated () {
            xmview.setContentLoading(false)
        },
        methods: {
            toggleMonth (val) {
                this.currDate = val
            },
            // 设置积分
            setIntegral () {
                this.isEdit = false
            }
        }
    }
</script>

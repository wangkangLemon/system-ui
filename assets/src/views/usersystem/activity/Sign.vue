<!--签到-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/mixins";

    .activity-sign-container {
        .el-card {
            margin-bottom: 10px;
            .el-card__header {
                padding: 15px;
                background: #f0f3f5;
                position: relative;
                .tip {
                    color: #999;
                    font-size: 12px;
                }
                .right-button {
                    position: absolute;
                    right: 15px;
                    @extend %verticalCenter;
                }
            }
            .calendar-main {
                margin: 0 auto;
                width: 70%;
                .calendar-header {
                    text-align: center;
                    position: relative;
                    > * {
                        display: inline-block;
                        vertical-align: top;
                    }
                    .operate {
                        position: absolute;
                        right: 0;
                        @extend %verticalCenter;
                    }
                }
            }
            .introduce {
                border: 1px solid #ededed;
                .insEdit {
                    textarea {
                        resize: none;
                        border: none;
                        outline: none;
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
                        <!--<el-button type="warning" @click="copyData">复制</el-button>-->
                        <el-button type="primary"
                                   v-if="currDate > new Date() || currDate.getMonth() == new Date().getMonth()"
                                   @click="isEdit = true">编辑
                        </el-button>
                        <el-button type="success"
                                   v-if="currDate > new Date() || currDate.getMonth() == new Date().getMonth()"
                                   @click="setIntegral">保存
                        </el-button>
                    </div>
                </section>
                <!--月历-->
                <MonthCalendar @changeEditStatus="val => isEdit = val" :isEdit="isEdit" :listChecked="days"
                               :date="currDate"></MonthCalendar>
            </div>
        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                月末礼包设置
                <el-button @click="setAward('monthEnd')" type="primary" class="right-button el-icon-plus">选择奖品
                </el-button>
            </div>
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
            <div slot="header" class="clearfix">
                连续签到七天
                <el-button @click="setAward('sevenDay')" type="primary" class="right-button el-icon-plus">选择奖品
                </el-button>
            </div>
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
            <div slot="header" class="clearfix">
                签到说明
                <i class="tip">客户端签到页面底部说明</i>
                <div class="right-button">
                    <el-button type="primary" @click="insEdit = false">编辑</el-button>
                    <el-button type="success" @click="setIns">保存</el-button>
                </div>
            </div>
            <div class="introduce">
                <el-input
                        :class="{'insEdit': insEdit}"
                        :readonly="insEdit"
                        type="textarea"
                        :rows="5"
                        v-model="instruction">
                </el-input>
            </div>
        </el-card>
        <!--选择奖品-->
        <el-dialog v-model="addForm" title="选择奖品" size="tiny">
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                <el-form-item label="奖品设置" prop="storeid">
                    <el-select v-model="form.storeid">
                        <el-option label="充值卡" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="库存量">
                    100
                </el-form-item>
                <el-form-item label="中奖概率" prop="percent">
                    <el-input type="number" v-model="form.percent">
                        <template slot="append">%</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addForm=false">取消</el-button>
                <el-button type="primary" @click="submit('form')">保存</el-button>
            </div>
        </el-dialog>
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
                addForm: false,
                insEdit: true,
                instruction: '', // 签到说明
                isEdit: false,
                currDate: new Date(),
                days: [],
                monthGift: [], // 月末礼包数据
                sevenDaysGift: [], // 7天奖品设置
                form: clearForm(),
                rules: {
                    storeid: [
                        {type: 'number', required: true, message: '必填项', trigger: 'change'}
                    ],
                    percent: [
                        {
                            required: true,
                            message: '必填项',
                            trigger: 'blur'
                        }
                    ]
                },
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
            },
            // 设置签到
            setIns () {
                this.insEdit = true
                console.log(this.instruction)
            },
            submit (form) { // 表单提交
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        console.log(valid)
                    } else {
                        return false
                    }
                })
            },
            // 设置月末礼包
            setAward (category) {
                this.addForm = true
                this.form = clearForm()
                this.form.category = category
                setTimeout(() => {
                    this.$refs.form.resetFields()
                }, 0)
                console.log(this.form)
            }
        }
    }
    function clearForm() {
        return {
            category: '',
            storeid: '',
            percent: ''
        }
    }
</script>

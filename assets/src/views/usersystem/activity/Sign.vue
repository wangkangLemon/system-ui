<!--签到-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/mixins";

    .activity-sign-container {
        .el-select {
            width: 30% !important;
        }
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
                <MonthCalendar ref="calendar" @changeEditStatus="val => isEdit = val" :isEdit="isEdit" :listChecked="calendarValues"
                               :date="currDate"></MonthCalendar>
            </div>
        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                月末礼包设置
                <el-button @click="setAward('sign_month')" type="primary" class="right-button el-icon-plus">添加奖品</el-button>
            </div>
            <el-table
                    v-loading="monthLoading"
                    border
                    :data="monthGift">
                <el-table-column
                        prop="product_name"
                        label="奖品">
                </el-table-column>
                <el-table-column
                        prop="weight"
                        label="中奖概率"
                        width="180">
                    <template scope="scope">{{scope.row.weight}}%</template>
                </el-table-column>
                <el-table-column
                        prop="limit"
                        label="发放量">
                    <template scope="scope">
                        <span v-if="scope.row.type == 'product'">{{scope.row.limit}}</span>
                        <span v-if="scope.row.type == 'credit' && scope.row.limit == 0">无限</span>
                        <span v-if="scope.row.type == 'credit' && scope.row.limit > 0">{{scope.row.limit}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="operate"
                        label="操作">
                    <template scope="scope">
                        <el-button type="text" @click="editFn(scope.row)">修改</el-button>
                        <el-button type="text" @click="delReward(scope.row)" v-if="monthGift.length > 1">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                连续签到七天
                <el-button @click="setAward('sign_weekly')" type="primary" class="right-button el-icon-plus">添加奖品
                </el-button>
            </div>
            <el-table
                    v-loading="seventDayLoading"
                    border
                    :data="sevenDaysGift">
                <el-table-column
                        prop="product_name"
                        label="奖品">
                </el-table-column>
                <el-table-column
                        prop="weight"
                        label="中奖概率"
                        width="180">
                    <template scope="scope">{{scope.row.weight}}%</template>
                </el-table-column>
                <el-table-column
                        prop="limit"
                        label="发放量">
                    <template scope="scope">
                        <span v-if="scope.row.type == 'product'">{{scope.row.limit}}</span>
                        <span v-if="scope.row.type == 'credit' && scope.row.limit == 0">无限</span>
                        <span v-if="scope.row.type == 'credit' && scope.row.limit > 0">{{scope.row.limit}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="operate"
                        label="操作">
                    <template scope="scope">
                        <el-button type="text" @click="editFn(scope.row)">修改</el-button>
                        <el-button type="text" @click="delReward(scope.row)" v-if="sevenDaysGift.length > 1">删除</el-button>
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
        <el-dialog v-model="addForm" title="选择奖品" size="small">
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                <el-form-item label="奖品类型" prop="type">
                    <el-select @change="changeProduct" v-model="form.type">
                        <el-option label="商品" value="product"></el-option>
                        <!--<el-option label="谢谢参与" value="thanks"></el-option>-->
                        <el-option label="积分" value="credit"></el-option>
                    </el-select>
                    <el-select @change="getSelectPorduct" v-model="form.category" v-if="form.type == 'product'">
                        <el-option label="补签卡" value="sign_card"></el-option>
                        <el-option label="转盘卡" value="wheel_card"></el-option>
                        <el-option label="红包加成卡" value="price_plus_card"></el-option>
                        <el-option label="成长值充值卡" value="growth_charge_card"></el-option>
                        <el-option label="成长值加倍卡" value="growth_plus_card"></el-option>
                        <el-option label="实物" value="entity"></el-option>
                        <el-option label="外部虚拟卡券" value="coupon"></el-option>
                    </el-select>
                    <el-select @change="getStockCount" v-if="form.product_id && form.type == 'product'" v-model="form.product_id">
                        <el-option :label="item.name" :value="item.id" v-for="(item,index) in products" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="库存量" v-if="!isNaN(form.product_id) && form.product_id > 0">
                    {{stockCount}}
                </el-form-item>
                <el-form-item label="积分面值" prop="quota" v-if="form.type == 'credit'">
                    <el-input v-model.number="form.quota"></el-input>
                </el-form-item>
                <el-form-item label="发放量" prop="limit">
                    <el-input type="number" v-model.number="form.limit" :placeholder="form.type == 'credit' ? '请填写发放量，不填默认为无限' : ''"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input type="number" v-model="form.sort"></el-input>
                </el-form-item>
                <el-form-item label="中奖概率" prop="weight">
                    <el-input type="number" v-model.number="form.weight">
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
    import ActivityService from '../../../services/usersystem/activityService'
    import ParkService from '../../../services/usersystem/parkService'
    import ToggleMonth from '../component/ToggleMonth.vue'
    import MonthCalendar from '../component/MonthCalendar'
    import clone from 'clone'
    export default {
        components: {
            ToggleMonth,
            MonthCalendar
        },
        data () {
            return {
                stockCount: 0,
                addForm: false,
                insEdit: true,
                instruction: '', // 签到说明
                isEdit: false,
                currDate: new Date(),
                calendarValues: [],
                monthLoading: false,
                monthGift: [], // 月末礼包数据
                seventDayLoading: false,
                sevenDaysGift: [], // 7天奖品设置
                products: [],
                form: clearForm(),
                cloneForm1: '',
                rules: {
                    type: {required: true, message: '必填项'}, // 类型
                    category: {required: true, message: '必填项'}, // 分类
                    product_id: {required: true, message: '必填项'}, // 产品
                    weight: {type: 'number', required: true, message: '必填项'},
                    quota: {type: 'number', required: true, message: '必填项'},
                    limit: {max: this.stockCount, type: 'number', required: true, message: '必填项'}
                },
            }
        },
        watch: {
            'form.limit' (val) {
                if (this.form.type == 'product') {
                    this.rules['limit'] = [
                        {max: this.stockCount, required: true, type: 'number', message: '发放量不得大于库存量', trigger: 'blur'},
                    ]
                }
            }
        },
        activated () {
            this.getActivity().then(() => {
                xmview.setContentLoading(false)
            })
            // 获取月末奖品列表
            this.getMonthAward()

            // 获取连续七天奖品列表
            this.getSeventDayAward()

            // 获取日历积分设置
            this.getCalendarValue()

            this.getSelectPorduct()
        },
        methods: {
            // 编辑奖品
            editFn (row) {
                this.addForm = true
                this.$nextTick(() => {
                    this.$refs.form.resetFields()
                    this.form = clone(row)
                    this.cloneForm1 = clone(row)
                    this.getStockCount()
                })
            },
            // 获取活动的基本信息
            getActivity () {
                return ActivityService.getActivity({play_id: 3}).then((ret) => {
                    this.instruction = ret.play.description
                })
            },
            // 获取月末奖励
            getMonthAward () {
                this.monthLoading = true
                return ActivityService.rewardSearch({play_type: 'sign_month'}).then((ret) => {
                    this.monthGift = ret.rewards
                    this.monthLoading = false
                })
            },
            // 获取七天奖励
            getSeventDayAward () {
                this.seventDayLoading = true
                return ActivityService.rewardSearch({play_type: 'sign_weekly'}).then((ret) => {
                    this.sevenDaysGift = ret.rewards
                    this.seventDayLoading = false
                })
            },
            // 切换月份
            toggleMonth (val) {
                this.currDate = val
                this.getCalendarValue()
            },
            // 设置积分
            setIntegral () {
                if (!this.isEdit) return
                let calendarDom = this.$refs.calendar.$el.querySelectorAll('input')
                let settings = []
                Array.from(calendarDom).forEach((item) => {
                    settings.push(item.value)
                })
                return ActivityService.addSignSetting({year: this.currDate.getFullYear(), month: this.currDate.getMonth() + 1, setting: JSON.stringify(settings)}).then((ret) => {
                    xmview.showTip('success', '保存成功')
                    this.calendarValues = settings
                    this.isEdit = false
                })
            },
            // 设置签到
            setIns () {
                ActivityService.updateActivity({play_id: 3, description: this.instruction}).then((ret) => {
                    xmview.showTip('success', '修改成功')
                    this.insEdit = true
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            // 添加或修改奖品
            submit (form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        // 判断库存
                        if (this.form.type == 'product' && this.stockCount < this.form.quota) {
                            xmview.showTip('error', '库存不足')
                            return
                        }
                        // 判断概率
                        let sumWeight = 0
                        let dataList = []
                        if (this.form.play_type == 'sign_weekly') dataList = this.sevenDaysGift
                        else dataList = this.monthGift
                        dataList.forEach((item) => {
                            sumWeight += item.weight
                        })
                        if (this.form.weight + sumWeight > 100) {
                            xmview.showTip('error', '总概率不得超过100%')
                            return
                        }
                        // 请求接口
                        let msg = '添加成功'
                        let reqFn = ActivityService.addReward
                        if (this.form.id) {
                            msg = '修改成功'
                            reqFn = ActivityService.updateReward
                        }
                        reqFn(this.form).then((ret) => {
                            xmview.showTip('success', msg)
                            this.addForm = false
                            if (this.form.play_type == 'sign_weekly') this.getSeventDayAward()
                            else this.getMonthAward()
                        })
                    } else {
                        return false
                    }
                })
            },
            // 删除奖品
            delReward (row) {
                xmview.showDialog('确定要删除该奖品吗？', () => {
                    ActivityService.delReward({id: row.id}).then(() => {
                        xmview.showTip('success', '删除成功')
                        if (row.play_type == 'sign_month') this.getMonthAward()
                        else this.getSeventDayAward()
                    })
                })
            },
            // 设置月末礼包
            setAward (category) {
                this.addForm = true
                this.form = clearForm()
                this.form.play_type = category
                setTimeout(() => {
                    this.$refs.form.resetFields()
                }, 0)
            },
            changeProduct () {
                if (this.form.type == 'credit') {
                    this.form.category = ''
                    this.form.product_id = ''
                }
            },
            // select获取选择分类的产品列表
            getSelectPorduct () {
                if (this.form.category != this.cloneForm1.category) this.form.product_id = ' '
                // 获取选中产品列表 products
                ActivityService.productSearch({category: this.form.category}).then((ret) => {
                    this.products = ret.data
                })
            },
            // 获取库存值
            getStockCount () {
                if (this.form.product_id && this.form.product_id != ' ') {
                    // 获取库存量
                    ParkService.prodDetail({id: this.form.product_id}).then((ret) => {
                        this.stockCount = ret.stock_count
                    })
                }
            },
            // 获取日历积分值
            getCalendarValue () {
                return ActivityService.getSignSetting(
                    {
                        year: this.currDate.getFullYear(),
                        month: this.currDate.getMonth() + 1
                    }).then((ret) => {
                        this.calendarValues = ret.setting ? JSON.parse(ret.setting) : []
                    }).catch((ret) => {
                        if (ret.message === 'record not found') {
                            ret.tipCom.close()
                            this.calendarValues = []
                        }
                    })
            }
        }
    }
    function clearForm() {
        return {
            play_type: '', // sign_weekly，sign_month
            type: '', // product thanks credit
            category: '',
            product_id: '',
            quota: '',
            limit: '',
            sort: '',
            weight: '' // 中奖率
        }
    }
</script>

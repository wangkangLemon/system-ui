<style lang="scss">
    @import "~utils/mixins/common";
    #yshi-coupon-add-container {
       @extend %content-container;
        .form {
            width: 55%;
            .line {
                text-align: center;
            }
            .input-append {
                vertical-align: text-bottom;
            }
        }
    }
</style>

<template>
    <main id="yshi-coupon-add-container">
        <el-form :model="ruleForm" ref="ruleForm" :rules="rules"  class="form" label-width="180px">
            <el-form-item label="优惠券名称" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="优惠金额" prop="money">
                <el-input-number :controls="false" type="number" v-model="ruleForm.money">
                </el-input-number>
                <span class="input-append">元</span>
            </el-form-item>
            <el-form-item label="使用门槛" prop="threshold">
                <el-input-number :controls="false" type="number" v-model="ruleForm.threshold">
                </el-input-number>
                <span class="input-append">元</span>
            </el-form-item>
            <el-form-item label="使用时间" prop="start_date">
                <DateRange 
                    :start="ruleForm.start_date" 
                    :end="ruleForm.end_date" 
                    @changeStart="val => {ruleForm.start_date=val}" 
                    @changeEnd="val => {ruleForm.end_date=val}">
                </DateRange>
                <!-- <el-col :span="11">
                    <el-form-item prop="start_time">
                        <el-date-picker type="datetime" placeholder="选择日期" v-model="ruleForm.start_time" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                    <el-form-item prop="end_time">
                        <el-date-picker type="datetime" placeholder="选择日期" v-model="ruleForm.end_time" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col> -->
            </el-form-item>
            <el-form-item label="指定商品" prop="">
                <el-button type='primary' @click="chooseGoods">选择商品</el-button>
                <template v-if="transferRight.length">
                    <GoodsList :data="transferRight" columnType="type" columnName="name"></GoodsList>
                </template>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
            </el-form-item>
        </el-form>
        <Task
            ref="goods"
            title="选取商品"
            :visible.sync="showGoodsDialog"
            defaultTabs="goods"
            :selected="transferRight"
            :keys="['goods', 'group', 'activity']"
            :customStyle="{ top: '33px' }"
            @submit="getTaskData">
        </Task>
    </main>
</template>

<script>
    import couponService from 'services/yshi/couponService'
    import DateRange from 'components/form/DateRangePicker.vue'
    import GoodsList from '../component/GoodsList.vue'
    import Task from 'components/dialog/task/Main.vue'
    // import { date2Str } from 'utils/timeUtils'

    export default {
        components: {
            DateRange,
            Task,
            GoodsList
        },
        props: {},
        activated () {},
        created () {
            xmview.setContentLoading(false)
        },
        mounted () {},
        computed: {},
        watch: {},
        data () {
            // const timeValidator = (rule, value, callback) => {
            //     let start_time = Date.parse(this.ruleForm.start_time)
            //     let end_time = Date.parse(this.ruleForm.end_time)
            //     let handleTime = new HandleTime()
            //     rule.field === 'start_time'
            //         ? handleTime.handleStartTime(start_time, end_time, callback)
            //         : handleTime.handleEndTime(start_time, end_time, callback)
            // }
            let self = this
            let date = new Date()
            
            // 相对于本地时区的时间
            let now = new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`).getTime() 
            const timeValidator = (rule, value, callback) => {
                // UTC时间，显示的时间会加上本地时区（东八区）的 8 小时偏移
                let start_date = self.ruleForm.start_date ? new Date(self.ruleForm.start_date).getTime() : now
                let end_date = self.ruleForm.end_date ? new Date(self.ruleForm.end_date).getTime() : now
                if (start_date - now < 0 || end_date - now < 0) {
                    callback(new Error('必须大于等于今天'))
                } else {
                    callback()
                }
            }
            return {
                ruleForm: {
                    name: '',
                    money: '',
                    threshold: '',
                    start_date: '',
                    end_date: '',
                    // goods_list: [],
                },
                rules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    money: { required: true, message: '请输入金额' },
                    start_date: { validator: timeValidator },
                    // end_time: { validator: timeValidator },
                },
                transferRight: [],  // 从组件功能上命名，即transfer右边选中的数据
                showGoodsDialog: false,
            }
        },
        methods: {
            chooseGoods () {
                this.showGoodsDialog = true
            },
            getTaskData () {
                this.showGoodsDialog = false
            },
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let param = this.handleParam(this.ruleForm)
                        couponService.addCoupon(param).then(() => {
                            this.$router.back()
                        })
                    }
                })
            },
            handleParam (param) {
                let result = {}
                result.goods_list = this.transferRight.map(item => {
                    return {
                        goods_id: item.id,
                        goods_type: item.type,
                        goods_name: item.name
                    }
                })
                for (let i in param) {
                    // if (~['start_time', 'end_time'].indexOf(i)) {
                    //     result[i] = date2Str(param[i], '-', { hashour: true })
                    // } else {
                    //     result[i] = param[i]
                    // }
                    result[i] = param[i]
                }
                return result
            }
        },
        filters: {},
        directives: {},
    }
    // class HandleTime {
    //     constructor () {
    //         if (!HandleTime.single) {
    //             HandleTime.single = this
    //         }
    //         return HandleTime.single
    //     }
    //     handleStartTime (start_time, end_time, callback) {
    //         if (start_time > end_time) {
    //             callback(new Error('开始时间大于结束时间，请修改'))
    //         } else {
    //             callback()
    //         }
    //     }
    //     handleEndTime (start_time, end_time, callback) {
    //         if (end_time < start_time) {
    //             callback(new Error('结束时间小于开始时间，请修改'))
    //         } else {
    //             callback()
    //         }
    //     }
    // }
    // HandleTime.single = null
</script>

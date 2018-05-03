<style lang="scss">
    @import "~utils/mixins/common";
    #yshi-coupon-add-container {
       @extend %content-container;
        .form {
            width: 50%;
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
                <el-input-number :controls="false" type="number" v-model="ruleForm.money"></el-input-number>
            </el-form-item>
            <el-form-item label="使用门槛" prop="threshold">
                <el-input-number :controls="false" type="number" v-model="ruleForm.threshold"></el-input-number>
            </el-form-item>
            <el-form-item label="使用时间">
                <DateRange 
                    :start="ruleForm.start_time" 
                    :end="ruleForm.end_time" 
                    @changeStart="val => {ruleForm.start_time=val}" 
                    @changeEnd="val => {ruleForm.end_time=val}">
                </DateRange>
                <!-- <el-col :span="11">
                    <el-form-item prop="start_time">
                        <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.start_time" style="width: 100%;"></el-date-picker>

                    </el-form-item>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                    <el-form-item prop="end_time">
                        <el-time-picker type="fixed-time" placeholder="选择时间" v-model="ruleForm.end_time" style="width: 100%;"></el-time-picker>
                    </el-form-item>
                </el-col> -->
            </el-form-item>
            <el-form-item label="指定商品" prop="">
                <el-button type='primary' @click="chooseGoods">选择商品</el-button>
                <template v-if="transferRight.length">
                    <el-table class="data-table" :data="transferRight" :fit="true" border style="margin-top: 5px;">
                        <el-table-column 
                            label="类型" 
                            prop="type"
                            width="100">
                            <el-tag slot-scope="scope" :type="scope.row.type | taskType('tag')">
                                {{scope.row.type | taskType('label')}}
                            </el-tag>
                        </el-table-column>
                        <el-table-column 
                            label="名称" 
                            prop="name">
                        </el-table-column>
                    </el-table>
                    <el-tag>总计：{{transferRight.length}}个商品</el-tag>
                </template>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
            </el-form-item>
        </el-form>
        <Task
            ref="goods"
            :visible.sync="showGoodsDialog"
            :selected="transferRight"
            @submit="getTaskData">
        </Task>
    </main>
</template>

<script>
    import couponService from 'services/yshi/couponService'
    import DateRange from 'components/form/DateRangePicker.vue'
    import Task from 'components/dialog/task2/Main.vue'

    export default {
        components: {
            DateRange,
            Task
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
            return {
                ruleForm: {
                    name: '',
                    money: '',
                    threshold: '',
                    start_time: '',
                    end_time: '',
                    goods_list: [],
                },
                rules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    money: { required: true, message: '请输入金额' },
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
                        this.ruleForm.goods_list = this.transferRight.map(item => {
                            return {
                                goods_id: item.id,
                                goods_type: item.type
                            }
                        })
                        couponService.addCoupon(this.ruleForm).then(() => {
                            this.$router.back()
                        })
                    }
                })
            }
        },
        filters: {},
        directives: {},
    }
</script>

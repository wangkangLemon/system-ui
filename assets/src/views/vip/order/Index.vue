<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #member-order-container {
        @extend %content-container;
        .search {
            @extend %top-search-container;
        }
        .top-btn {
            @extend %right-top-btnContainer;
        }

        .block {
            float: right;
            margin-top: 15px;
        }
    }

    .u-loadmore {
        color: #63bdea;
        margin-left: 10px;
        padding-top: 4px;
        display: block;
        cursor: pointer;
    }
</style>

<template>
    <main id="member-order-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>订单编号</i>
                <el-input
                    v-model="fetchParam.trade_no"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <i>用户手机号</i>
                <el-input
                    v-model="fetchParam.user_mobile"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <DateRange 
                    title="下单时间" :start="fetchParam.time_start" :end="fetchParam.time_end"
                    v-on:changeStart="val=> {fetchParam.time_start=val}"
                    v-on:changeEnd="val=>{fetchParam.time_end=val}"
                    :change="fetchData">
                </DateRange>
            </section>
            <section>
                <i>支付方式</i>
                <el-select v-model="fetchParam.pay_method" filterable clearable placeholder="请选择支付方式" @change="fetchData">
                    <el-option 
                        v-for="item in payMethodList" 
                        :key="item.value"
                        :label="item.label" 
                        :value="item.value">
                    </el-option>
                </el-select>
            </section>
            <section>
                <DateRange 
                    title="交易时间" :start="fetchParam.pay_time_start" :end="fetchParam.pay_time_end"
                    v-on:changeStart="val=> {fetchParam.pay_time_start=val}"
                    v-on:changeEnd="val=>{fetchParam.pay_time_end=val}"
                    :change="fetchData">
                </DateRange>
            </section>
            <section>
                <i>订单状态</i>
                <el-select v-model="fetchParam.status" filterable clearable placeholder="请选择订单状态" @change="fetchData">
                    <el-option 
                        v-for="item in statusList" 
                        :key="item.value"
                        :label="item.label" 
                        :value="item.value">
                    </el-option>
                </el-select>
            </section>
            <section>
                <DateRange 
                    title="到期时间" :start="fetchParam.expire_time_start" :end="fetchParam.expire_time_end"
                    v-on:changeStart="val=> {fetchParam.expire_time_start=val}"
                    v-on:changeEnd="val=>{fetchParam.expire_time_end=val}"
                    :change="fetchData">
                </DateRange>
            </section>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    label="订单编号" 
                    prop="trade_no" 
                    min-width="150">
                </el-table-column>
                <el-table-column 
                    label="用户手机号" 
                    prop="user_mobile" 
                    width="130">
                </el-table-column>
                <el-table-column 
                    label="下单时间" 
                    prop="create_time" 
                    width="170">
                </el-table-column>
                <el-table-column 
                    label="交易时间" 
                    prop="pay_time" 
                    width="170">
                </el-table-column>
                <el-table-column 
                    label="订单金额" 
                    prop="price" 
                    width="100">
                </el-table-column>
                <el-table-column 
                    label="支付方式" 
                    prop="pay_method" 
                    width="110">
                    <el-tag v-if="scope.row.pay_method!=='none'" slot-scope="scope" :type="scope.row.pay_method | payMethodMap('tag')">{{scope.row.pay_method | payMethodMap('label')}}</el-tag>
                </el-table-column>
                <el-table-column 
                    label="支付流水" 
                    prop="pay_trade_no" 
                    min-width="140">
                </el-table-column>
                <el-table-column 
                    label="订单状态" 
                    prop="status" 
                    width="100">
                    <el-tag slot-scope="scope" :type="scope.row.status | statusMap('tag')">{{scope.row.status | statusMap('label')}}</el-tag>
                </el-table-column>
                <el-table-column 
                    label="到期时间" 
                    prop="object_expire_time" 
                    width="170">
                </el-table-column>
                <el-table-column 
                    label="操作" 
                    prop="operate" 
                    width="70" 
                    fixed="right">
                    <el-button slot-scope="scope" type="text" size="small" :disabled="scope.row.status!==0" @click="edit(scope.row)">修改</el-button>
                </el-table-column>
            </el-table>
            <el-pagination class="block"
                @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                @current-change="val=> {fetchParam.page=val; fetchData()}"
                :current-page="fetchParam.page"
                :page-size="fetchParam.page_size"
                :page-sizes="[15, 30, 60, 100]"
                layout="sizes, total, prev, pager, next" 
                :total="total">
            </el-pagination>
        </section>

        <el-dialog 
            size="tiny"
            v-if="showDialog"
            :title="修改订单" 
            :visible.sync="showDialog">
            <el-form :model="ruleForm" ref="ruleForm" :rules="rules" labelWidth="100px">
                <el-form-item label="订单编号">{{row.trade_no}}</el-form-item>
                <el-form-item label="用户手机号">{{row.user_mobile}}</el-form-item>
                <el-form-item label="订单金额">{{row.price}}</el-form-item>
                <el-form-item label="支付方式" prop="pay_method">
                    <el-select v-model="ruleForm.pay_method" filterable clearable placeholder="请选择支付方式">
                        <el-option 
                            v-for="item in payMethodList" 
                            :key="item.value"
                            :label="item.label" 
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="支付流水" prop="pay_trade_no">
                    <el-input
                        style="max-width: 200px;"
                        v-model.number="ruleForm.pay_trade_no">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="showDialog = false">取消</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </main>
</template>

<script>
    import memberService from 'services/vip'
    import DateRange from 'components/form/DateRangePicker.vue'
    import * as _ from 'utils/common'
    import Order from './model'

    export default {
        components: {
            DateRange
        },
        props: {},
        activated () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        created () {},
        mounted () {},
        computed: {},
        watch: {},
        data () {
            return {
                loading: false,
                data: [],
                total: 0,
                fetchParam: {
                    trade_no: '',
                    user_mobile: '',
                    pay_method: '',
                    time_start: '',
                    time_end: '',
                    pay_time_start: '',
                    pay_time_end: '',
                    status: '',
                    expire_time_start: '',
                    expire_time_end: '',
                    page: 1,
                    page_size: 15,
                },
                showDialog: false,
                statusList: Order.statusList,
                payMethodList: Order.payMethodList,
                row: {},
                ruleForm: {
                    order_id: '',
                    pay_method: '',
                    pay_trade_no: '',
                },
                rules: {
                    pay_method: { required: true, message: '请选择支付方式', trigger: 'change' },
                    pay_trade_no: [
                        { required: true, message: '请输入支付流水' },
                        { type: 'number', message: '请输入数字' },
                    ],
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                let fetchParam = _.clone(this.fetchParam)
                fetchParam.status = !fetchParam.status && fetchParam.status !== 0 ? -1 : fetchParam.status
                return memberService.searchOrder(fetchParam).then(ret => {
                    this.data = ret.list
                    this.total = ret.total
                    this.loading = false
                })
            },
            edit (row) {
                Object.keys(this.ruleForm).forEach(item => { this.ruleForm[item] = '' })
                this.row = row
                this.ruleForm.order_id = row.id
                this.showDialog = true
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        memberService.editOrder(this.ruleForm).then(ret => {
                            xmview.showTip('success', ret.message || '修改成功')
                            this.fetchData()
                            this.showDialog = false
                        })
                    }
                })
            },
        },
        filters: {
            statusMap (val, type) {
                let result = Order.statusList.filter(item => item.value === val)
                return result.length > 0 ? result[0][type] : ''
            },
            payMethodMap (val, type) {
                let result = Order.payMethodList.filter(item => item.value === val)
                return result.length > 0 ? result[0][type] : ''
            }

        },
        directives: {},
    }
</script>

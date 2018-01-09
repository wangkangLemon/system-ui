<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #index-container {
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
    <main id="index-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>用户账号</i>
                <el-input
                    v-model="fetchParam.mobile"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <i>提现方式</i>
                <el-select v-model="fetchParam.withdraw_type" filterable clearable placeholder="请选择提现方式" @change="fetchData">
                    <el-option 
                        v-for="item in withdrawTypeList" 
                        :key="item.value"
                        :label="item.label" 
                        :value="item.value">
                    </el-option>
                </el-select>
            </section>
            <section>
                <i>当前状态</i>
                <el-select v-model="fetchParam.status" filterable clearable placeholder="请选择状态" @change="fetchData">
                    <el-option 
                        v-for="item in statusList" 
                        :key="item.value"
                        :label="item.label" 
                        :value="item.value">
                    </el-option>
                </el-select>
            </section>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    label="用户账号" 
                    prop="mobile" 
                    width="120">
                    <el-button slot-scope="scope" type='text' @click="showAccount(scope.row)">{{scope.row.mobile}}</el-button>
                </el-table-column>
                <el-table-column 
                    label="提现金额" 
                    prop="money" 
                    width="150">
                </el-table-column>
                <el-table-column 
                    label="个税金额" 
                    prop="taxes" 
                    width="150">
                </el-table-column>
                <el-table-column 
                    label="到账金额" 
                    prop="actual_money" 
                    width="150">
                </el-table-column>
                <el-table-column 
                    label="提现方式" 
                    prop="withdraw_type" 
                    width="100">
                </el-table-column>
                <el-table-column 
                    label="流水号" 
                    prop="withdraw_type_no" 
                    min-width="220">
                </el-table-column>
                <el-table-column 
                    label="当前状态" 
                    prop="status" 
                    width="100">
                </el-table-column>
                <el-table-column 
                    label="提现发起时间" 
                    prop="create_time" 
                    width="170">
                </el-table-column>
                <el-table-column 
                    label="提现完成时间" 
                    prop="complete_time" 
                    width="170">
                </el-table-column>
                <el-table-column 
                    label="操作" 
                    prop="operate" 
                    width="100" 
                    fixed="right">
                    <el-button slot-scope="scope" type="text" size="small" @click="deposit(scope.row)" :disabled="scope.row.status=='complete'">提现</el-button>
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
        
        <!-- 提现 -->
        <el-dialog 
            v-if="showDepositDialog"
            title="操作提示" 
            size="tiny"
            :visible.sync="showDepositDialog">
            <p>完成体现后，当前状态将变更为“提现成功”，您是否确定操作？</p>
            <el-form :model="ruleForm" ref="ruleForm" :rules="rules" labelWidth="70px">
                <el-form-item label="流水号" prop="bank_trade_no">
                    <el-input
                        v-model.number="ruleForm.bank_trade_no"
                        placeholder="请输入银行转账流水号">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">确认操作</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog 
            v-if="showAccountDialog"
            title="操作提示" 
            size="tiny"
            :visible.sync="showAccountDialog">
            <el-form>
                <el-form-item label="用户账号：">{{row.mobile}}</el-form-item>
                <el-form-item label="真实姓名：">{{row.user_name}}</el-form-item>
                <el-form-item label="身份证号：">{{row.identity_no}}</el-form-item>
                <el-form-item label="开户银行">{{row.bank_name}}</el-form-item>
                <el-form-item label="银联卡账户：">{{row.bank_card_no}}</el-form-item>
                <el-form-item label="微信OpenId：">{{row.wechat_openid}}</el-form-item>
            </el-form>
        </el-dialog>
    </main>
</template>

<script>
    import luckymoney from 'services/luckymoney'

    export default {
        components: {},
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
                showDepositDialog: false,
                showAccountDialog: false,
                data: [],
                total: 0,
                fetchParam: {
                    mobile: '',
                    withdraw_type: '',
                    status: '',
                    page: 1,
                    page_size: 15,
                },
                withdrawTypeList: [
                    {
                        label: '银联',
                        value: 'bank',
                    },
                    {
                        label: '微信',
                        value: 'wechat',
                    },
                ],
                statusList: [
                    {
                        label: '提现成功',
                        value: 'complete'
                    },
                    {
                        label: '提现失败',
                        value: 'close'
                    },
                    {
                        label: '等待提现',
                        value: 'pending'
                    },
                ],
                row: null,
                ruleForm: {
                    bank_trade_no: '',
                    draw_id: '',
                },
                rules: {
                    bank_trade_no: [
                        { required: true, message: '请输入流水号' },
                        { type: 'number', message: '请输入数字' },
                    ]
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return luckymoney.searchDrawMoney(this.fetchParam).then(ret => {
                    this.data = ret.list
                    this.total = ret.total
                    this.loading = false
                })
            },
            deposit (row) {
                this.ruleForm.draw_id = row.id
                this.ruleForm.bank_trade_no = ''
                if (row.withdraw_type === 'wechat') {
                    return luckymoney.draw(this.ruleForm)
                }
                this.showDepositDialog = true
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        luckymoney.draw(this.ruleForm).then(() => {
                            this.showDepositDialog = false
                        })
                    }
                })
            },
            showAccount (row) {
                this.showAccountDialog = true
                this.row = row
            }
        },
        filters: {},
        directives: {},
    }
</script>

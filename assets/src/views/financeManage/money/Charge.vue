<style lang="scss" rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";
    .financeManage-finance-charge {
        @extend %content-container;
        .header-button {
            @extend %right-top-btnContainer;
        }
        .search {
            @extend %top-search-container;
        }
        .block {
            text-align: right;
            margin-top: 15px;
        }
    }
</style>
<template>
    <article class="financeManage-finance-charge">
        <!--详情-->
        <el-dialog width="30%" class="show-detail" title="充值收据" :visible.sync="showDetail">
            <div v-if="currentData">{{currentData.desc}}</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="showDetail = false">关 闭</el-button>
            </div>
        </el-dialog>
        <!--充值表单-->
        <el-dialog :visible.sync="addForm" :title="form.category == 'transfer' ? '财务转入' : '充值'" width="30%">
            <el-form class="addForm" :model="form" :rules="rules" ref="form" label-width="100px">
                <!--转入表单-->
                <el-form-item v-if="form.category == 'transfer'" prop="companyID" label="选择企业">
                    <IndustryCompanySelect type="1" v-model="form.companyID"
                                           v-on:change="formIndustryChange">
                    </IndustryCompanySelect>
                </el-form-item>
                <el-form-item v-if="form.category == 'transfer'" label="转入方式">
                    企业财务余额转入
                </el-form-item>
                <el-form-item v-if="form.category == 'transfer'" label="企业财务余额">
                    {{balance}}元
                </el-form-item>
                <el-form-item v-if="form.category == 'transfer'" prop="money" label="转入金额">
                    <el-input v-model="form.money" type="number" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="form.category == 'transfer'" prop="desc" label="操作凭证">
                    <el-input type="textarea" :rows="3" v-model="form.desc" auto-complete="off"></el-input>
                </el-form-item>

                <!--充值-->
                <el-form-item v-if="!form.category" label="" prop="companyID" label="工业">
                    <IndustryCompanySelect type="1" v-model="form.companyID"
                                           v-on:change="formIndustryChange">
                    </IndustryCompanySelect>
                </el-form-item>
                <el-form-item v-if="!form.category" prop="money" label="充值金额">
                    <el-input v-model="form.money" type="number" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="!form.category" prop="desc" label="充值收据">
                    <el-input type="textarea" :rows="3" v-model="form.desc" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit('form')">充值</el-button>
            </div>
        </el-dialog>
        <div class="header-button">
            <el-button type="success" class="recharge" @click="accountFn"><i class="iconfont icon-zhuanzhang"></i>转入</el-button>
            <el-button type="primary" class="recharge" @click="chargeFn"><i class="el-icon-plus"></i>充值</el-button>
            <el-button type="warning" @click="exportData"><i class="iconfont icon-iconfontexcel"></i>导出Excel</el-button>
        </div>
        <section class="search">
            <section>
                <i>工业</i>
                <IndustryCompanySelect type="1" v-model="fetchParam.industrySelect"
                                       v-on:change="val=>fetchParam.industrySelect=val"
                                       :change="getData">
                </IndustryCompanySelect>
            </section>
            <section>
                <i>管理员</i>
                <admin v-model="fetchParam.managerSelect"
                       v-on:change="val=>fetchParam.managerSelect=val"
                       :change="getData">
                </admin>
            </section>
            <section>
                <i>类型</i>
                <el-select v-model="fetchParam.category" placeholder="全部" @change="getData" :clearable="true">
                    <el-option label="充值" value="balance"></el-option>
                    <el-option label="转入" value="transfer_in"></el-option>
                    <el-option label="转出" value="transfer_out"></el-option>
                </el-select>
            </section>
            <DateRange title="创建时间" :start="fetchParam.createTime" :end="fetchParam.endTime"
                       v-on:changeStart="val=> fetchParam.createTime=val"
                       v-on:changeEnd="val=> fetchParam.endTime=val"
                       :change="getData">
            </DateRange>
        </section>
        <el-table
                v-loading="loading"
                border
                :data="industryData">
            <el-table-column
                    min-width="200"
                    prop="company"
                    label="工业">
            </el-table-column>
            <el-table-column
                    prop="admin_name"
                    label="管理员"
                    width="100">
            </el-table-column>
            <el-table-column
                    width="180"
                    prop="category"
                    label="类型">
            </el-table-column>
            <el-table-column
                    width="120"
                    prop="val_old"
                    label="变更前余额">
            </el-table-column>
            <el-table-column
                    width="120"
                    prop="money"
                    label="变更金额">
            </el-table-column>
            <el-table-column
                    width="120"
                    prop="val_new"
                    label="变更后余额">
            </el-table-column>
            <el-table-column
                    width="180"
                    prop="create_time_name"
                    label="变更时间">
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="operate"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="showFn(scope.row)">
                        查看收据
                    </el-button>
                </template>
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
    </article>
</template>
<script>
    import {chargeData, moneyCharge, exportCharge} from '../../../services/finance/money'
    import {balance} from '../../../services/finance/finance'
    import Admin from '../../component/select/Admin'
    import IndustryCompanySelect from '../../component/select/IndustryCompany.vue'
    import DateRange from '../../component/form/DateRangePicker.vue'

    function clearFn() {
        return {
            category: '', // 类型
            industrySelect: '',
            managerSelect: '',
            createTime: '',
            endTime: '',
        }
    }
    export default {
        components: {
            Admin,
            IndustryCompanySelect,
            DateRange
        },
        data () {
            return {
                fetchParam: clearFn(),
                balance: 0, // 余额
                showDetail: false,
                currentData: null,
                loading: false,
                currentPage: 1,
                pageSize: 10,
                industryData: [],
                addForm: false, // 表单弹窗是否显示
                formLabelWidth: '50px', // 表单label的宽度
                form: clearForm(),
                rules: {
                    company_id: [
                        {type: 'number', required: true, message: '必填项', trigger: 'change'}
                    ],
                    money: [
                        {
                            required: true,
                            message: '必填项',
                            trigger: 'blur'
                        }
                    ],
                    desc: [
                        {
                            required: true,
                            message: '必填项',
                            trigger: 'blur'
                        }
                    ]
                },
                total: 0
            }
        },
        activated () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            initFetchParam () {
                this.currentPage = 1
                this.fetchParam = clearFn()
            },
            accountFn () {
                this.addForm = true
                this.form = clearForm()
                setTimeout(() => {
                    this.$refs.form.resetFields()
                }, 0)
                this.form.category = 'transfer'
            },
            chargeFn () {
                this.addForm = true
                this.form = clearForm()
                setTimeout(() => {
                    this.$refs.form.resetFields()
                }, 0)
            },
            showFn (row) {
                this.showDetail = true
                this.currentData = row
            },
            addFn () {
                if (!this.loading) {
                    this.addForm = true
                }
            },
            handleSizeChange (val) {
                this.pageSize = val
                this.getData()
            },
            formIndustryChange (val) {
                this.form.company_id = val
                if (this.form.company_id) {
                    balance(this.form.company_id).then((ret) => {
                        this.balance = ret.balance
                    })
                }
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getData()
            },
            submit (form) { // 表单提交
                console.log(this.form)
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        moneyCharge(this.form).then(() => {
                            this.addForm = false
                            if (this.form.category == 'transfer') xmview.showTip('success', '转入成功')
                            else xmview.showTip('success', '充值成功')
                            this.getData()
                        }).catch((ret) => {
                            xmview.showTip('error', ret.message)
                        })
                    } else {
                        return false
                    }
                })
            },
            getData () {
                this.loading = true
                return chargeData({
                    page: this.currentPage,
                    page_size: this.pageSize,
                    admin_id: this.fetchParam.managerSelect,
                    company_id: this.fetchParam.industrySelect,
                    time_start: this.fetchParam.createTime,
                    time_end: this.fetchParam.endTime,
                    category: this.fetchParam.category
                }).then((ret) => {
                    this.industryData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            },
            exportData () {
                exportCharge({
                    admin_id: this.fetchParam.managerSelect,
                    company_id: this.fetchParam.industrySelect,
                    time_start: this.fetchParam.createTime,
                    time_end: this.fetchParam.endTime,
                    category: this.fetchParam.category
                })
            }
        }
    }
    function clearForm() {
        return {                // 表单属性值
            companyID: '',          // 工业ID
            money: '',          // 要充值的金额
            desc: '',       // 收据
            category: ''
        }
    }
</script>

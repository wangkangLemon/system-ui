<!--充值-->
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
        <el-dialog size="tiny" class="show-detail" title="充值收据" v-model="showDetail">
            <div v-if="currentData">{{currentData.desc}}</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="showDetail = false">关 闭</el-button>
            </div>
        </el-dialog>
        <!--充值表单-->
        <el-dialog v-model="addForm" :title="form.category == 'transfer' ? '财务转入' : '充值'" size="tiny">
            <el-form class="addForm" :model="form" :rules="rules" ref="form" label-width="100px">
                <!--转入表单-->
                <el-form-item v-if="form.category == 'transfer'" prop="companyID" label="选择企业">
                    <IndustryCompanySelect type="1" v-model="form.companyID"
                                           v-on:change="formIndustryChange">
                    </IndustryCompanySelect>
                </el-form-item>
                <el-form-item v-if="form.category == 'transfer'" label="转入方式">
                    企业红包余额转入
                </el-form-item>
                <el-form-item v-if="form.category == 'transfer'" label="企业红包余额">
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
            <el-button class="recharge" @click="accountFn"><i class="iconfont icon-zhuanzhang"></i>转入</el-button>
            <el-button type="primary" class="recharge" @click="chargeFn"><i class="el-icon-plus"></i>充值</el-button>
            <el-button type="warning" @click="exportData"><i class="iconfont icon-iconfontexcel"></i>导出Excel</el-button>
        </div>
        <section class="search">
            <section>
                <i>工业</i>
                <IndustryCompanySelect type="1" v-model="industrySelect"
                                       v-on:change="val=>industrySelect=val"
                                       :change="getData">
                </IndustryCompanySelect>
            </section>
            <section>
                <i>管理员</i>
                <admin v-model="managerSelect"
                       v-on:change="val=>managerSelect=val"
                       :change="getData">
                </admin>
            </section>
            <DateRange title="创建时间" :start="createTime" :end="endTime"
                       v-on:changeStart="val=> createTime=val"
                       v-on:changeEnd="val=> endTime = val"
                       :change="getData">
            </DateRange>
        </section>
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
                    prop="admin_name"
                    label="管理员"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="category"
                    label="类型"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="val_old"
                    label="充值前余额">
            </el-table-column>
            <el-table-column
                    prop="money"
                    label="充值金额">
            </el-table-column>
            <el-table-column
                    prop="val_new"
                    label="充值后余额">
            </el-table-column>
            <el-table-column
                    prop="create_time_name"
                    label="充值时间">
            </el-table-column>
            <el-table-column
                    prop="operate"
                    label="操作">
                <template scope="scope">
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
    import {chargeData, charge, exportCharge, balance} from '../../../services/fianace/finance'
    import Admin from '../../component/select/Admin'
    import IndustryCompanySelect from '../../component/select/IndustryCompany.vue'
    import DateRange from '../../component/form/DateRangePicker.vue'
    export default {
        components: {
            Admin,
            IndustryCompanySelect,
            DateRange
        },
        data () {
            return {
                balance: 0, // 显示余额
                currentData: null,
                showDetail: false,
                loading: false,
                industrySelect: '',
                managerSelect: '',
                createTime: '',
                endTime: '',
                currentPage: 1,
                pageSize: 15,
                industryData: [],
                addForm: false, // 表单弹窗是否显示
                form: clearForm(),
                rules: {
                    companyID: [
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
        created () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
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
            handleSizeChange (val) {
                this.pageSize = val
                this.getData()
            },
            formIndustryChange (value) {
                this.form.companyID = value
                this.form.company_id = value
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
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        charge(this.form).then((ret) => {
                            this.addForm = false
                            if (this.form.category == 'transfer') xmview.showTip('success', '转入成功')
                            else xmview.showTip('success', '调整成功')
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
                    admin_id: this.managerSelect,
                    company_id: this.industrySelect,
                    time_start: this.createTime,
                    time_end: this.endTime
                }).then((ret) => {
                    this.industryData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            },
            exportData () {
                exportCharge({
                    admin_id: this.managerSelect,
                    company_id: this.industrySelect,
                    time_start: this.createTime,
                    time_end: this.endTime
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

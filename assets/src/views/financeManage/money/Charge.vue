<style lang="scss" rel='stylesheet/scss'>
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/topSearch";
    .financeManage-finance-charge {
        .box-card {
            margin-bottom: 20px;
            .clearfix {
                text-align: right;
            }
            .el-card__header {
                padding: 10px 15px;
                background: #f0f3f5;
                .icon-iconfontexcel {
                    position: relative;
                    top: -2px;
                    margin-right: 5px;
                }
                .recharge {
                    float: left;
                }
            }
            .search {
                @extend %top-search-container;
            }
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
        <el-dialog size="tiny"  class="showDetail" title="充值收据" v-model="showDetail">
            <div v-if="currentData">{{currentData.desc}}</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="showDetail = false">关 闭</el-button>
            </div>
        </el-dialog>
        <!--充值表单-->
        <el-dialog v-model="addForm" title="充值" size="tiny">
            <el-form label-position="top" class="addForm" :model="form" :rules="rules" ref="form">
                <el-form-item label="" prop="company_id">
                    <IndustryCompanySelect type="1" v-model="form.company_id"
                                           v-on:change="formIndustryChange">
                    </IndustryCompanySelect>
                </el-form-item>
                <el-form-item prop="money" label="充值金额" :label-width="formLabelWidth">
                    <el-input v-model="form.money" type="number" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="desc" label="充值收据" :label-width="formLabelWidth">
                    <el-input type="textarea" :rows="3" v-model="form.desc" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit('form')">充值</el-button>
            </div>
        </el-dialog>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-button class="recharge" @click="addFn"><i class="el-icon-plus"></i>充值</el-button>
                <el-button @click="exportData"><i class="iconfont icon-iconfontexcel"></i>导出Excel</el-button>
            </div>
            <section class="search">
                <IndustryCompanySelect type="1" v-model="industrySelect"
                                       v-on:change="val=>industrySelect=val"
                                       :change="getData">
                </IndustryCompanySelect>
                <admin v-model="managerSelect"
                       v-on:change="val=>managerSelect=val"
                       :change="getData">
                </admin>
                <DateRange title="创建时间" :start="createTime" :end="endTime"
                           v-on:changeStart="val=> createTime=val"
                           v-on:changeEnd="val=> endTime"
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
                            查看数据
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
        </el-card>
    </article>
</template>
<script>
    import {chargeData, moneyCharge, exportCharge} from '../../../services/fianace/money'
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
                showDetail: false,
                currentData: null,
                loading: false,
                industrySelect: '',
                managerSelect: '',
                createTime: '',
                endTime: '',
                currentPage: 1,
                pageSize: 10,
                industryData: [],
                addForm: false, // 表单弹窗是否显示
                formLabelWidth: '50px', // 表单label的宽度
                form: {                // 表单属性值
                    company_id: '',          // 工业名称
                    money: '',          // 要充值的金额
                    desc: ''       // 收据
                },
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
        created () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
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
                this.form.name = val
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getData()
            },
            submit (form) { // 表单提交
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        moneyCharge(this.form).then(() => {
                            this.addForm = false
                            xmview.showTip('success', '充值成功')
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
</script>

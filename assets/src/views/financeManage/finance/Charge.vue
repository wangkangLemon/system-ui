<style lang='scss' scoped rel='stylesheet/scss'>
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/table";
</style>
<style lang="scss">
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
                padding: 15px;
                padding-top: 0;
                > div {
                    display: inline-block;
                    vertical-align: top;
                    label {
                        margin-right: 2%;
                    }
                    .el-input, .el-select {
                        width: 80%;
                    }
                    .el-date-editor {
                        width: 40%;
                    }
                    @media (max-width: 767px) {
                        .el-input, .el-select, .el-date-editor {
                            width: 100%;
                            margin-top: 10px;
                        }
                    }
                    .time-container {
                        width: 80%;
                        display: inline-block;
                        @media (max-width: 767px) {
                            width: 100%;
                        }
                    }
                }
                @media (min-width: 768px) {
                    display: flex;
                }
                @media (max-width: 767px) {
                    display: block;
                    > div {
                        margin-top: 10px;
                    }
                }
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
        <!--充值表单-->
        <el-dialog v-model="addForm" title="充值" size="tiny">
            <el-form label-position="top" class="addForm" :model="form" :rules="rules" ref="form">
                <el-form-item label="" prop="companyID">
                    <IndustryCompanySelect type="1" v-model="form.companyID"
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
                <el-button class="recharge" @click="addForm = true"><i class="el-icon-plus"></i>充值</el-button>
                <el-button><i class="iconfont icon-iconfontexcel"></i>导出Excel</el-button>
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
                <div>
                    <label>创建时间</label>
                    <div class="time-container">
                        <el-date-picker
                                @change="getData"
                                v-model="createTime"
                                type="date"
                                :picker-options="pickerOptionsStart"
                                placeholder="开始时间">
                        </el-date-picker>
                        <el-date-picker
                                @change="getData"
                                v-model="endTime"
                                type="date"
                                :picker-options="pickerOptionsEnd"
                                placeholder="结束时间">
                        </el-date-picker>
                    </div>
                </div>
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
                        <el-button type="text" size="small">
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
<script lang="babel">
    import {chargeData, charge} from '../../../services/fianace/finance'
    import {date2Str} from '../../../utils/timeUtils'
    import Admin from '../../component/select/Admin'
    import IndustryCompanySelect from '../../component/select/IndustryCompany.vue'
    let _this
    export default {
        components: {
            Admin,
            IndustryCompanySelect
        },
        data () {
            return {
                loading: false,
                industrySelect: '',
                managerSelect: '',
                createTime: '',
                endTime: '',
                currentPage: 1,
                pageSize: 15,
                industryData: [],
                addForm: false, // 表单弹窗是否显示
                formLabelWidth: '50px', // 表单label的宽度
                form: {                // 表单属性值
                    companyID: '',          // 工业ID
                    money: '',          // 要充值的金额
                    desc: ''       // 收据
                },
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
                total: 0,
                pickerOptionsStart: {
                    disabledDate(time) {
                        return !_this.endTime ? null
                                : time.getTime() > _this.endTime.getTime() - 8.64e7
                    }
                },
                pickerOptionsEnd: {
                    disabledDate(time) {
                        return !_this.createTime ? null
                                : time.getTime() < _this.createTime.getTime() + 8.64e7
                    }
                },
            }
        },
        beforeCreate () {
            _this = this
        },
        created () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            handleSizeChange (val) {
                this.pageSize = val
                this.getData()
            },
            formIndustryChange (value) {
                this.form.companyID = value
                this.form.company_id = value
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
                            xmview.showTip('success', '调整成功')
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
                    time_start: date2Str(this.createTime),
                    time_end: date2Str(this.endTime)
                }).then((ret) => {
                    this.industryData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            }
        }
    }
</script>

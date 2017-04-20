<!--价格调整-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/topSearch";
    .financeManage-finance-charge {
        .search {
            @extend %top-search-container;
            margin-bottom: 20px;
        }
        .box-card {
            margin: 20px 0;
            .clearfix {
                text-align: right;
            }
            .el-card__header {
                padding: 10px 15px;
                background: #f0f3f5;
                i {
                    position: relative;
                    top: -1px;
                    margin-right: 5px;
                    font-size: 12px;
                }
                .recharge {
                    float: left;
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
        <!--详情-->
        <el-dialog class="showDetail" title="调整依据" v-model="showDetail">
            <div v-if="currentData != null">{{currentData.desc}}</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="showDetail = false">关 闭</el-button>
            </div>
        </el-dialog>
        <!--充值表单-->
        <el-dialog v-model="addForm" title="调整" size="tiny">
            <el-form label-position="top" class="addForm" :model="form" :rules="rules" ref="form">
                <el-form-item label="" prop="name">
                    <IndustryCompanySelect type="1" v-model="form.company_id"
                                           v-on:change="formIndustryChange">
                    </IndustryCompanySelect>
                </el-form-item>
                <el-form-item prop="price" label="调整单价为" :label-width="formLabelWidth">
                    <el-input v-model="form.price" type="number" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="desc" label="调整依据" :label-width="formLabelWidth">
                    <el-input type="textarea" :rows="3" v-model="form.desc" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit('form')">调整</el-button>
            </div>
        </el-dialog>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-button class="recharge" @click="addForm = true"><i class="iconfont icon-edit"></i>调整</el-button>
                <el-button @click="exportData"><i class="iconfont icon-iconfontexcel"></i>导出Excel</el-button>
            </div>
            <section class="search">
                <IndustryCompanySelect
                        type="1"
                        v-model="industrySelect"
                        v-on:change="val=>industrySelect=val"
                        :change="fetchData">
                </IndustryCompanySelect>
                <admin
                        :change="fetchData"
                        v-on:change="val=>managerSelect=val"
                        v-model="managerSelect">
                </admin>
                <DateRange title="创建时间" :start="createTime" :end="endTime"
                           v-on:changeStart="val=> createTime=val"
                           v-on:changeEnd="val=> endTime"
                           :change="fetchData">
                </DateRange>
            </section>
            <el-table
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
                        label="调整前单价">
                </el-table-column>
                <el-table-column
                        prop="val_new"
                        label="调整后单价">
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        label="调整时间">
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
    import {priceData, price, exportPrice} from '../../../services/fianace/finance'
    import IndustryCompanySelect from '../../component/select/IndustryCompany'
    import Admin from '../../component/select/Admin.vue'
    import DateRange from '../../component/form/DateRangePicker.vue'
    export default {
        components: {
            IndustryCompanySelect,
            Admin,
            DateRange
        },
        data () {
            return {
                currentData: null,
                showDetail: false,
                loading: false,
                industrySelect: '',
                managerSelect: '',
                createTime: '',
                endTime: '',
                currentPage: 1,
                pageSize: 15,
                total: 0,
                industryData: [],
                addForm: false, // 表单弹窗是否显示
                formLabelWidth: '50px', // 表单label的宽度
                form: {                // 表单属性值
                    name: '',          // 工业
                    price: '',          // 要充值的金额
                    desc: ''       // 收据
                },
                rules: {
                    name: [
                        {type: 'number', required: true, message: '必填项', trigger: 'change'}
                    ],
                    price: [
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
                }
            }
        },
        created () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            showFn (row) {
                this.showDetail = true
                this.currentData = row
            },
            handleSizeChange (val) {
                this.pageSize = val
                this.fetchData()
            },
            formIndustryChange (val) {
                this.form.name = val
                console.log(val)
            },
            handleCurrentChange(val) {
                this.currentPage = val
                console.log(`当前页: ${val}`)
            },
            submit (form) { // 表单提交
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.form.company_id = this.form.name
                        price(this.form).then((ret) => {
                            this.addForm = false
                            xmview.showTip('success', '调整成功')
                            this.fetchData()
                        }).catch((ret) => {
                            xmview.showTip('error', ret.message)
                        })
                    } else {
                        return false
                    }
                })
            },
            fetchData () {
                this.loading = true
                return priceData({
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
                exportPrice({
                    admin_id: this.managerSelect,
                    company_id: this.industrySelect,
                    time_start: this.createTime,
                    time_end: this.endTime
                })
            }
        }
    }
</script>

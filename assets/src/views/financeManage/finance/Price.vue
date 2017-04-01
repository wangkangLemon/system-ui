<style lang='scss' scoped rel='stylesheet/scss'>
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/topSearch";

    .search {
        @extend %top-search-container;
        margin-bottom: 20px;
    }
</style>
<style lang="scss">
    .financeManage-finance-charge {
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
                <el-button><i class="iconfont icon-iconfontexcel"></i>导出Excel</el-button>
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
                <section>
                    <span>创建时间</span>
                    <el-date-picker
                            @change="fetchData"
                            v-model="createTime"
                            type="date"
                            :picker-options="pickerOptionsStart"
                            placeholder="开始时间">
                    </el-date-picker>
                    <el-date-picker
                            @change="fetchData"
                            v-model="endTime"
                            type="date"
                            :picker-options="pickerOptionsEnd"
                            placeholder="结束时间">
                    </el-date-picker>
                </section>
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
    import {priceData, price} from '../../../services/fianace/finance'
    import {date2Str} from '../../../utils/timeUtils'
    import IndustryCompanySelect from '../../component/select/IndustryCompany'
    import Admin from '../../component/select/Admin.vue'
    let _this
    export default {
        components: {
            IndustryCompanySelect,
            Admin
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
                },
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
        mounted () {
            this.fetchData()
        },
        methods: {
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
                priceData({
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

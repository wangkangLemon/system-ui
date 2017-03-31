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
                <el-form-item label="要充值的工业" prop="name">
                    <el-select v-model="form.name" placeholder="未选择">
                        <el-option
                                v-for="(item, index) in industry"
                                :label="item.name"
                                :value="item.name"
                                :key="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="money" label="充值金额" :label-width="formLabelWidth">
                    <el-input v-model="form.money" type="number" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="receipt" label="充值收据" :label-width="formLabelWidth">
                    <el-input type="textarea" :rows="3" v-model="form.receipt" auto-complete="off"></el-input>
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
                <div>
                    <label>工业</label>
                    <el-select clearable v-model="industrySelect" placeholder="未选择">
                        <el-option
                                v-for="(item, index) in industry"
                                :label="item.name"
                                :value="item.id"
                                :key="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    <label>管理员</label>
                    <el-select clearable v-model="managerSelect" placeholder="未选择">
                        <el-option
                                v-for="(item, index) in managers"
                                :label="item.name"
                                :value="item.id"
                                :key="item.id">
                        </el-option>
                    </el-select>
                </div>
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
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="pageSize"
                        layout="total, prev, pager, next"
                        :total="total">
                </el-pagination>
            </div>
        </el-card>
    </article>
</template>
<script lang="babel">
    import {chargeData} from '../../../services/fianace/money'
    import {date2Str} from '../../../utils/timeUtils'
    let _this
    export default {
        data () {
            return {
                industrySelect: '',
                managerSelect: '',
                createTime: '',
                endTime: '',
                currentPage: 1,
                pageSize: 10,
                industryData: [],
                industry: [
                    {
                        id: 1,
                        name: '企业1'
                    }
                ],
                managers: [
                    {
                        id: 1,
                        name: '用户1',
                    }
                ],
                addForm: false, // 表单弹窗是否显示
                formLabelWidth: '50px', // 表单label的宽度
                form: {                // 表单属性值
                    name: '',          // 工业名称
                    money: '',          // 要充值的金额
                    receipt: ''       // 收据
                },
                rules: {
                    name: [
                        {required: true, message: '必填项', trigger: 'change'}
                    ],
                    money: [
                        {
                            required: true,
                            message: '必填项',
                            trigger: 'blur'
                        }
                    ],
                    receipt: [
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
        mounted () {
            this.getData()
        },
        methods: {
            handleCurrentChange(val) {
                this.currentPage = val
                this.getData()
            },
            submit (form) { // 表单提交
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        console.log(1)
                    } else {
                        return false
                    }
                })
            },
            getData () {
                chargeData({
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
                    xmview.setContentLoading(false)
                })
            }
        }
    }
</script>

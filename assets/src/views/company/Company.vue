<!--企业列表-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../utils/mixins/mixins";
    @import "../../utils/mixins/topSearch";
    .company-index {
        .box-card {
            margin-bottom: 20px;
            .el-card__header {
                padding: 10px 15px;
                background: #f0f3f5;
            }
            .search {
                @extend %top-search-container;
            }
        }
        .block {
            text-align: right;
            margin-top: 15px;
        }
        .addForm {
            .tip {
                text-align: center;
                border-top: 1px solid #ddd;
                color: #ff0000;
                line-height: 50px;
            }
        }
        .showDetail {
            h2 {
                margin-bottom: 10px;
            }
            p {
                i {
                    display: inline-block;
                    width: 90px;
                    margin-right: 10px;
                    text-align: right;
                }
            }
        }
    }
</style>
<template>
    <article class="company-index">
        <!--详情-->
        <el-dialog class="showDetail" v-model="showDetail" title="企业信息">
            <h2>陕西众信大药房</h2>
            <p><i>门店数量：</i>45</p>
            <p><i>店员数量：</i>45</p>
            <p><i>联系人：</i>45</p>
            <p><i>联系人手机：</i>45</p>
            <p><i>联系人邮箱：</i>45</p>
            <p><i>企业电话：</i>45</p>
            <p><i>传真：</i>45</p>
            <p><i>地区：</i>45</p>
            <p><i>地址：</i>45</p>
            <p><i>邮编：</i>45</p>
            <p><i>企业网址：</i>45</p>
            <p><i>企业介绍：</i>45</p>
        </el-dialog>
        <!--添加表单-->
        <el-dialog v-model="addForm" title="添加企业" >
            <el-form class="addForm" :model="form" :rules="rules" ref="form" :label-width="formLabelWidth">
                <el-form-item prop="type" label="企业类型">
                    <el-select v-model="form.type">
                        <el-option v-for="(item, index) in searchParms.types"
                        :label="item.name" :value="item.id" :key="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="name" label="企业名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" type="number" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="concact" label="联系人" :label-width="formLabelWidth">
                    <el-input v-model="form.concact" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="mobile" label="联系人手机" :label-width="formLabelWidth">
                    <el-input v-model="form.mobile" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="email" label="联系人邮箱" :label-width="formLabelWidth">
                    <el-input v-model="form.email" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="phone" label="电话" :label-width="formLabelWidth">
                    <el-input v-model="form.phone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="fax" label="传真" :label-width="formLabelWidth">
                    <el-input v-model="form.fax" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="地区" :label-width="formLabelWidth">
                    <el-select clearable placeholder="全部">
                        <el-option v-for="(item, index) in searchParms.provinces"
                                   :label="item.name"
                                   :value="item.id"
                                   :key="item.id">
                        </el-option>
                    </el-select>
                    <el-select clearable placeholder="全部">
                        <el-option v-for="(item, index) in searchParms.citys"
                                   :label="item.name"
                                   :value="item.id"
                                   :key="item.id">
                        </el-option>
                    </el-select>
                    <el-select clearable placeholder="全部">
                        <el-option v-for="(item, index) in searchParms.areas"
                                   :label="item.name"
                                   :value="item.id"
                                   :key="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="address" label="地址" :label-width="formLabelWidth">
                    <el-input v-model="form.address" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="postcode" label="邮编" :label-width="formLabelWidth">
                    <el-input v-model="form.postcode" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="website" label="企业网址" :label-width="formLabelWidth">
                    <el-input v-model="form.website" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="introduce" label="企业介绍" :label-width="formLabelWidth">
                    <el-input type="textarea" :rows="3" v-model="form.introduce" auto-complete="off"></el-input>
                </el-form-item>
                <div class="tip">
                    * 以下信息会关联到营销数据中心，如果是营销人员签约连锁，请务必填写。
                </div>
                <el-form-item prop="department_number" label="签约门店数量" :label-width="formLabelWidth">
                    <el-input placeholder="签约门店数量" v-model="form.department_number" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="user_number" label="签约店员数量" :label-width="formLabelWidth">
                    <el-input placeholder="签约店员数量" v-model="form.user_number" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="member" label="签约人" :label-width="formLabelWidth">
                    <el-input placeholder="签约店员数量" v-model="form.member" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="signTime" label="签约时间" :label-width="formLabelWidth">
                    <el-date-picker v-model="form.signTime"
                                    type="date"
                                    placeholder="开始日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="overTime" label="合同到期日" :label-width="formLabelWidth">
                    <el-date-picker v-model="form.overTime"
                                    type="date"
                                    :picker-options="pickerOptionsEnd"
                                    placeholder="合同到期日">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit('form')">提交</el-button>
            </div>
        </el-dialog>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-button class="recharge" @click="add"><i class="el-icon-plus"></i>添加</el-button>
            </div>
            <section class="search">
                <section>
                    <i>类型</i>
                    <el-select @change="getData" clearable v-model="searchParms.typeSelect" placeholder="未选择">
                        <el-option
                                v-for="(item, index) in searchParms.types"
                                :label="item.name"
                                :value="item.id"
                                :key="item.id">
                        </el-option>
                    </el-select>
                </section>
                <Region v-on:provinceChange="val => provinceSelect = val"
                        v-on:cityChange="val => citySelect = val"
                        v-on:areaChange="val => areaChange = val"
                        :change="getData"></Region>
                <section>
                    <i>名称：</i>
                    <el-input v-model="searchParms.name" auto-complete="off"></el-input>
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
                    :data="companyData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="name"
                        label="名称">
                </el-table-column>
                <el-table-column
                        prop="site"
                        label="地区"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="concact"
                        label="联系人">
                </el-table-column>
                <el-table-column
                        prop="mobile"
                        label="手机">
                </el-table-column>
                <el-table-column
                        prop="email"
                        label="邮箱">
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        prop="operate"
                        label="操作">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="adminPage(scope.$index, scope.row)">
                            管理员
                        </el-button>
                        <el-button type="text" size="small" @click="showDetail = true">
                            详情
                        </el-button>
                        <el-button type="text" size="small">
                            修改
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
<script lang='babel'>
    import {chargeData, charge} from '../../services/fianace/finance'
    import {date2Str} from '../../utils/timeUtils'
    import Admin from '../component/select/Admin'
    import IndustryCompanySelect from '../component/select/IndustryCompany.vue'
    import DateRange from '../component/form/DateRangePicker.vue'
    import Region from '../component/select/Region.vue'
    let _this
    export default {
        components: {
            Admin,
            IndustryCompanySelect,
            DateRange,
            Region
        },
        data () {
            let validateEmail = (rule, value, callback) => {
                if (!(value || '').match(/^\w+([-+.]\w+)*@\w+([-+.]\w+)*.\w+([-+.]\w+)*$/)) {
                    callback(new Error('请输入一个有效的电子邮箱地址'))
                }
                callback()
            }
            return {
                showDetail: false, // 显示详情弹窗
                formLabelWidth: '100px',
                loading: false,
                createTime: '',
                endTime: '',
                currentPage: 1,
                pageSize: 15,
                companyData: [],
                addForm: false, // 表单弹窗是否显示
                searchParms: {
                    typeSelect: '',
                    types: [ // 类型
                        {
                            name: '工业',
                            id: 1
                        },
                        {
                            name: '连锁',
                            id: 2
                        },
                        {
                            name: '平台',
                            id: 3
                        }
                    ],
                    provinceSelect: '',
                    citySelect: '',
                    areaSelect: '',
                    name: ''
                },
                form: {
                    type: '', // 类型
                    name: '', // 名称
                    concact: '', // 联系人
                    mobile: '', // 联系人手机
                    phone: '', // 电话
                    email: '', // 联系人邮箱
                    fax: '', // 传真
                    province: '', // 省
                    city: '', // 市
                    area: '', // 区
                    address: '', // 地址
                    postcode: '', // 邮编
                    website: '', // 企业网址
                    introduce: '', // 企业介绍
                    department_number: '', // 门店数量
                    user_number: '', // 店员数量
                    member: '', // 签约人
                    signTime: '', // 签约日期
                    endTime: '' // 合同到期日
                },
                pickerOptionsEnd: {
                    disabledDate(time) {
                        return !_this.form.signTime ? null
                                : time.getTime() < new Date(_this.form.signTime).getTime()
                    }
                },
                rules: {
                    name: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    concact: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '必填项', trigger: 'blur'},
                        {validator: validateEmail, trigger: 'blur'}
                    ]
                },
                total: 0
            }
        },
        created () {
            _this = this
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            adminPage (index, item) {
                this.$router.push({name: 'company-admin', params: {company_id: item.id || 1}})
            },
            // 添加
            add () {
                this.addForm = true
                let _this = this
                setTimeout(() => {
                    _this.$refs['form'].resetFields()
                }, 0)
            },
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
                    this.companyData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            }
        }
    }
</script>

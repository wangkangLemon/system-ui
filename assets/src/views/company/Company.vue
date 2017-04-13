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
        <el-dialog v-if="details != null" class="showDetail" v-model="showDetail" title="企业信息">
            <h2>
                {{details.name}}
                <el-tag type="success">{{companyType[details.category]}}</el-tag>
            </h2>
            <p><i>门店数量：</i>{{details.department_count}}</p>
            <p><i>店员数量：</i>{{details.user_count}}</p>
            <p><i>联系人：</i>{{details.concact}}</p>
            <p><i>联系人手机：</i>{{details.mobile}}</p>
            <p><i>联系人邮箱：</i>{{details.email}}</p>
            <p><i>企业电话：</i>{{details.tel}}</p>
            <p><i>传真：</i>{{details.fax}}</p>
            <p><i>地区：</i>{{details.area_name}}</p>
            <p><i>地址：</i>{{details.address}}</p>
            <p><i>邮编：</i>{{details.zip}}</p>
            <p><i>企业网址：</i>{{details.url}}</p>
            <p><i>企业介绍：</i>{{details.description}}</p>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="showDetail = false">确 定</el-button>
            </div>
        </el-dialog>
        <!--添加表单-->
        <el-dialog v-model="addForm" title="添加企业" v-loading="editloading">
            <el-form class="addForm" :model="form" :rules="rules" ref="form" :label-width="formLabelWidth">
                <el-form-item prop="category" label="企业类型">
                    <el-select v-model="form.category">
                        <el-option v-for="(item, index) in searchParms.types"
                                   :label="item.name" :value="item.id" :key="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="name" label="企业名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="concact" label="联系人" :label-width="formLabelWidth">
                    <el-input v-model="form.concact" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="mobile" type="number" label="联系人手机" :label-width="formLabelWidth">
                    <el-input v-model="form.mobile" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="email" label="联系人邮箱" :label-width="formLabelWidth">
                    <el-input v-model="form.email" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="tel" label="电话" :label-width="formLabelWidth">
                    <el-input v-model="form.tel" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="fax" label="传真" :label-width="formLabelWidth">
                    <el-input v-model="form.fax" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="地区" :label-width="formLabelWidth">
                    <Region :placeholder="[form.province, form.city, form.area]" title="" v-on:provinceChange="val => form.province = val"
                            v-on:cityChange="val => form.city = val"
                            v-on:areaChange="val => form.area = val"></Region>
                </el-form-item>
                <el-form-item prop="address" label="地址" :label-width="formLabelWidth">
                    <el-input v-model="form.address" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="zip" label="邮编" :label-width="formLabelWidth">
                    <el-input v-model="form.zip" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="url" label="企业网址" :label-width="formLabelWidth">
                    <el-input v-model="form.url" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="description" label="企业介绍" :label-width="formLabelWidth">
                    <el-input type="textarea" :rows="3" v-model="form.description" auto-complete="off"></el-input>
                </el-form-item>
                <div class="tip">
                    * 以下信息会关联到营销数据中心，如果是营销人员签约连锁，请务必填写。
                </div>
                <el-form-item prop="department_number" label="签约门店数量" :label-width="formLabelWidth">
                    <el-input placeholder="签约门店数量" type="number" v-model="sign.department_number" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="user_number" label="签约店员数量" :label-width="formLabelWidth">
                    <el-input placeholder="签约店员数量" type="number" v-model="sign.user_number" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="signatory" label="签约人" :label-width="formLabelWidth">
                    <SignatorySelect v-model="sign.signatory"></SignatorySelect>
                </el-form-item>
                <el-form-item prop="sign_time" label="签约时间" :label-width="formLabelWidth">
                    <el-date-picker v-model="sign.sign_time"
                                    type="date"
                                    :picker-options="pickerOptionsStart"
                                    placeholder="开始日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="expire_time" label="合同到期日" :label-width="formLabelWidth">
                    <el-date-picker v-model="sign.expire_time"
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
                <Region title="地区" v-on:provinceChange="val => searchParms.provinceSelect = val"
                        v-on:cityChange="val => searchParms.citySelect = val"
                        v-on:areaChange="val => searchParms.areaSelect = val"
                        :change="getData"></Region>
                <section>
                    <i>名称：</i>
                    <el-input @change="getData" v-model="searchParms.name" auto-complete="off"></el-input>
                </section>
                <DateRange title="创建时间" :start="searchParms.createTime" :end="searchParms.endTime"
                           v-on:changeStart="val=> searchParms.createTime = val"
                           v-on:changeEnd="val=> searchParms.endTime = val"
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
                    <template scope="scope">
                        <el-tag type="gray">{{companyType[scope.row.category]}}</el-tag>
                        {{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="area_name"
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
                        <el-button type="text" size="small" @click="showFn(scope.$index, scope.row)">
                            详情
                        </el-button>
                        <el-button type="text" size="small" @click="editCompany(scope.$index, scope.row)">
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
    import companyService from '../../services/companyService'
    import IndustryCompanySelect from '../component/select/IndustryCompany.vue'
    import DateRange from '../component/form/DateRangePicker.vue'
    import Region from '../component/select/Region.vue'
    import SignatorySelect from '../component/select/Signatory.vue'
    import * as timeUtils from '../../utils/timeUtils'
    let _this
    export default {
        components: {
            IndustryCompanySelect,
            DateRange,
            Region,
            SignatorySelect
        },
        data () {
            let validateEmail = (rule, value, callback) => {
                if (!(value || '').match(/^\w+([-+.]\w+)*@\w+([-+.]\w+)*.\w+([-+.]\w+)*$/)) {
                    callback(new Error('请输入一个有效的电子邮箱地址'))
                }
                callback()
            }
            let validateMobile = (rule, value, callback) => {
                if (!(value || '').match(/^1[34578]\d{9}$/)) {
                    callback(new Error('请输入正确的手机号'))
                }
                callback()
            }
            return {
                companyType: ['', '工业', '连锁'],
                editloading: false,
                companyID: '',
                details: null,
                showDetail: false, // 显示详情弹窗
                formLabelWidth: '100px',
                loading: false,
                currentPage: 1,
                pageSize: 15,
                companyData: [],
                addForm: false, // 表单弹窗是否显示
                searchParms: {
                    createTime: '',
                    endTime: '',
                    typeSelect: '',
                    types: [ // 类型
                        {
                            name: '工业',
                            id: 1
                        },
                        {
                            name: '连锁',
                            id: 2
                        }
                    ],
                    provinceSelect: '',
                    citySelect: '',
                    areaSelect: '',
                    name: ''
                },
                form: {
                    category: 1, // 类型
                    name: '', // 名称
                    concact: '', // 联系人
                    mobile: '', // 联系人手机
                    tel: '', // 电话
                    email: '', // 联系人邮箱
                    fax: '', // 传真
                    province: '', // 省
                    city: '', // 市
                    area: '', // 区
                    address: '', // 地址
                    zip: '', // 邮编
                    url: '', // 企业网址
                    description: '', // 企业介绍
                },
                sign: {
                    department_number: '', // 门店数量
                    user_number: '', // 店员数量
                    signatory: '', // 签约人
                    sign_time: '', // 签约日期
                    expire_time: '' // 合同到期日
                },
                pickerOptionsStart: {
                    disabledDate(time) {
                        return !_this.sign.sign_time ? null
                                : time.getTime() > new Date(_this.sign.sign_time).getTime()
                    }
                },
                pickerOptionsEnd: {
                    disabledDate(time) {
                        return !_this.sign.expire_time ? null
                                : time.getTime() < new Date(_this.sign.expire_time).getTime()
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
                        {required: true, message: '必填项', trigger: 'blur'},
                        {validator: validateMobile, trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '必填项', trigger: 'blur'},
                        {validator: validateEmail, trigger: 'blur'}
                    ]
                },
                total: 0
            }
        },
        activated () {
            _this = this
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            // 修改企业信息
            editCompany (index, row) {
                this.add()
                this.editloading = true
                companyService.editCompany(row.id).then((ret) => {
                    this.form = ret.data
                    this.sign = ret.sign
                    this.companyID = row.id
                }).then(() => {
                    this.editloading = false
                })
            },
            // 显示详情
            showFn (index, row) {
                companyService.getCompanyInfo(row.id).then((ret) => {
                    this.details = ret.data
                    this.showDetail = true
                })
            },
            adminPage (index, item) {
                this.$router.push({name: 'company-admin', params: {company_id: item.id || 1}})
            },
            // 添加
            add () {
                this.addForm = true
                this.companyID = ''
                setTimeout(() => {
                    this.$refs['form'].resetFields()
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
                        this.form = Object.assign(this.form, this.sign)
                        let reqFn = companyService.addCompany
                        let msg = '添加成功'
                        if (this.form.sign_time) {
                            this.form.sign_time = timeUtils.date2Str(this.form.sign_time)
                        }
                        if (this.form.expire_time) {
                            this.form.expire_time = timeUtils.date2Str(this.form.expire_time)
                        }
                        if (this.companyID) {
                            this.form.company_id = this.companyID
                            reqFn = companyService.updateCompany
                            msg = '修改成功'
                        }
                        reqFn(this.form).then(() => {
                            xmview.showTip('success', msg)
                        }).then(() => {
                            this.addForm = false
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
                return companyService.getIndrustrySelectList({
                    page_size: this.pageSize,
                    page: this.currentPage,
                    category: this.searchParms.typeSelect,
                    keyword: this.searchParms.name,
                    time_start: this.searchParms.createTime,
                    time_end: this.searchParms.endTime,
                    province: this.searchParms.provinceSelect,
                    city: this.searchParms.citySelect,
                    area: this.searchParms.areaSelect
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

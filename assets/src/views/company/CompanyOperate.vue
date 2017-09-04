<!--编辑/添加企业-->
<style lang="scss" rel="stylesheet/scss">
    .company-operate-container {
        background: #fff;
        padding: 20px 200px;
        .addForm {
            .tip {
                text-align: center;
                border-top: 1px solid #ddd;
                color: #ff0000;
                line-height: 50px;
            }
        }
        .dialog-footer {
            text-align: center;
        }
    }
</style>
<template>
    <article class="company-operate-container">
        <section>
            <el-form class="addForm" :model="form" :rules="rules" ref="form" :label-width="formLabelWidth">
                <el-form-item prop="category" label="企业类型">
                    <el-select v-model="form.category">
                        <el-option v-for="(item, index) in companyTypes"
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
                    <Region :province="form.province"
                            :city="form.city"
                            :area="form.area"
                            title=""
                            v-on:provinceChange="val => form.province = val"
                            v-on:cityChange="val => form.city = val"
                            v-on:areaChange="val => form.area = val">
                    </Region>
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
                <div v-if="form.category===2">
                <div  class="tip">
                    * 以下信息会关联到营销数据中心，如果是营销人员签约连锁，请务必填写。
                </div>
                <el-form-item prop="department_number" label="签约门店数量" :label-width="formLabelWidth">
                    <el-input min="0" placeholder="签约门店数量" type="number" v-model="sign.department_number"
                              auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="user_number" label="签约店员数量" :label-width="formLabelWidth">
                    <el-input min="0" placeholder="签约店员数量" type="number" v-model="sign.user_number"
                              auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="signatory" label="签约人" :label-width="formLabelWidth">
                    <SignatorySelect :placeholder="sign.user_name" v-model="sign.signatory"></SignatorySelect>
                </el-form-item>
                <el-form-item prop="sign_time" label="签约时间" :label-width="formLabelWidth">
                    <el-date-picker
                            :editable="false"
                            v-model="sign.sign_time"
                            type="date"
                            :picker-options="pickerOptionsStart"
                            placeholder="开始日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="expire_time" label="合同到期日" :label-width="formLabelWidth">
                    <el-date-picker v-model="sign.expire_time"
                                    :editable="false"
                                    type="date"
                                    :picker-options="pickerOptionsEnd"
                                    placeholder="合同到期日">
                    </el-date-picker>
                </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit('form')">提交</el-button>
            </div>
        </section>
    </article>
</template>
<script>
    import companyService from '../../services/companyService'
    import Region from '../component/select/Region.vue'
    import SignatorySelect from '../component/select/Signatory.vue'
    import * as timeUtils from '../../utils/timeUtils'
    let _this
    export default {
        components: {
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
                companyTypes: [ // 类型
                    {
                        name: '提供商',
                        id: 3
                    },
                    {
                        name: '连锁',
                        id: 2
                    },
                    {
                        name: '工业',
                        id: 1
                    }
                ],
                formLabelWidth: '100px',
                form: {
                    category: '', // 类型
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
                }
            }
        },
        computed: {
            companyID () {
                return this.$route.params.id
            }
        },
        activated () {
            _this = this
            xmview.setContentLoading(false)
            if (this.companyID == undefined) {
                this.sign = {
                    department_number: '', // 门店数量
                    user_number: '', // 店员数量
                    signatory: '', // 签约人
                    sign_time: '', // 签约日期
                    expire_time: '' // 合同到期日
                }
                this.form = {
                    category: '', // 类型
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
                }
                return false
            }
            companyService.editCompany(this.companyID).then((ret) => {
                this.form = ret.data
                this.sign = ret.sign
                this.sign.sign_time = ret.sign.sign_time_str
                this.sign.expire_time = ret.sign.expire_time_str
                this.companyID = this.companyID
            })
        },
        methods: {
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
                        // 如果没有签约人 清空其他签约选项
                        if (!this.sign.signatory) {
                            this.sign = {
                                department_number: '', // 门店数量
                                user_number: '', // 店员数量
                                signatory: '', // 签约人
                                sign_time: '', // 签约日期
                                expire_time: '' // 合同到期日
                            }
                        }
                        reqFn(this.form).then(() => {
                            xmview.showTip('success', msg)
                        }).then(() => {
                            this.$router.push({name: 'company-index'})
                        }).catch((ret) => {
                            xmview.showTip('error', ret.message)
                        })
                    } else {
                        return false
                    }
                })
            }
        }
    }
</script>

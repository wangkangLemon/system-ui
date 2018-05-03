<template>
    <el-dialog 
        :title="title"
        :visible.sync="showDialog">
        <main>
            <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="90px">
                <el-form-item label="选择优惠券" prop="">
                    <el-select v-model="ruleForm.couponIds" multiple placeholder="请选择">
                        <el-option
                            v-for="item in couponOption"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="指定人员" prop="mobile">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="输入手机号，多个手机号逗号分开"
                        v-model="ruleForm.mobile">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                    <el-button @click="showDialog = false">取消</el-button>
                </el-form-item>
            </el-form>
        </main>
    </el-dialog>
</template>

<script>
    import couponService from 'services/yshi/couponService'

    export default {
        props: {
            visible: Boolean,
            title: {
                type: String,
                default: '发放优惠券'
            }
        },
        created () {
            this.getCouponOption()
        },
        watch: {
            visible (val) {
                this.showDialog = val
            },
            showDialog (val) {
                this.$emit('update:visible', val)
            }
        },
        data () {
            const validatePass = (rule, value, callback) => {
                if (/^(1[345789]\d{9},?)+$/.test(value)) {
                    callback()
                } else {
                    callback(new Error('请输入正确的手机号并且用逗号分隔'))
                }
            }
            return {
                showDialog: this.visible,
                ruleForm: initRuleForm(),
                couponOption: [],
                rules: {
                    mobile: [
                        // {required: true, message: '', trigger: 'blur'},
                        { validator: validatePass, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            getCouponOption () {
                couponService.searchName().then(ret => {
                    this.couponOption = ret.list
                })
            },
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let coupon_id = this.ruleForm.couponIds.join(',')
                        let mobile = ~this.ruleForm.mobile.search(/,$/) ? this.ruleForm.mobile.slice(0, -1) : this.ruleForm.mobile
                        couponService.putCoupon({coupon_id, mobile}).then(() => {
                            this.showDialog = false
                            this.ruleForm = initRuleForm()
                        })
                    }
                })
            }
        }
    }

    function initRuleForm () {
        return {
            couponIds: [],
            mobile: '',
        }
    }
</script>

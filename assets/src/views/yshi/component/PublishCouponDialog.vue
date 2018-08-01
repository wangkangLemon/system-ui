<style lang="scss" scoped>
    .el-select {
        width: 50%;
    } 
    .u-loadmore {
        color: #63bdea;
        margin-left: 10px;
        padding-top: 4px;
        display: block;
        cursor: pointer;
    }
    .warning-tx {
        color: #666;
        margin-left: 5px;
        font-size: 12px;
    }
</style>
<template>
    <el-dialog 
        :title="title"
        :visible.sync="showDialog">
        <main>
            <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="100px">
                <el-form-item label="选择优惠券" prop="couponIds">
                    <el-select v-model="ruleForm.couponIds" multiple filterable placeholder="请选择">
                        <el-option 
                            v-for="item in multiSelectModel.data"
                            :key="item.id"
                            :label="item.name" 
                            :value="item.id">
                        </el-option>
                        <span class="u-loadmore" v-if="multiSelectModel.total/multiSelectModel.data.length > 1" type="text" @click="getSelectData('more')">点击加载</span>
                    </el-select>
                </el-form-item>
                <el-form-item label="指定人员" prop="mobile">
                    <el-input
                        type="textarea"
                        :rows="8"
                        placeholder="输入手机号，多个手机号逗号分开"
                        v-model="ruleForm.mobile">
                    </el-input>
                </el-form-item>
                <el-form-item label="异常手机号" class="is-error" v-if="ruleForm.mobileFailure">
                    <el-input
                        type="textarea"
                        :rows="2"
                        readonly
                        v-model="ruleForm.mobileFailure">
                    </el-input>
                </el-form-item>
                <el-form-item label="成功手机号" v-if="ruleForm.mobileSuccess">
                    <el-input
                        type="textarea"
                        :rows="2"
                        readonly
                        v-model="ruleForm.mobileSuccess">
                    </el-input>
                </el-form-item>
                <el-form-item label="提醒">
                    <el-switch v-model="ruleForm.receive_hints"></el-switch>
                    <i class="warning-tx">客户端优惠券到账提示</i>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">立即发放</el-button>
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
            this.getSelectData()
        },
        watch: {
            visible (val) {
                this.showDialog = val
                // this.ruleForm = initRuleForm()
            },
            showDialog (val) {
                this.$emit('update:visible', val)
            }
        },
        data () {
            const validatePass = (rule, value, callback) => {
                if (/^(1[345789]\d{9}(,|，)?)+$/.test(value)) {
                    callback()
                } else {
                    callback(new Error('请输入正确的手机号并且用逗号分隔'))
                }
            }
            return {
                showDialog: this.visible,
                ruleForm: initRuleForm(),
                multiSelectModel: {
                    data: [],
                    total: [],
                    fetchParam: {
                        page: 1,
                        page_size: 15
                    }
                },
                rules: {
                    mobile: [
                        // {required: true, message: '', trigger: 'blur'},
                        { required: true, validator: validatePass, trigger: 'change' }
                    ],
                    couponIds: { required: true, message: '请选择优惠券' }
                }
            }
        },
        methods: {
            getSelectData (type) {
                if (type) {
                    this.multiSelectModel.fetchParam.page += 1
                }
                return couponService.searchName({
                    page: this.multiSelectModel.fetchParam.page,
                    page_size: this.multiSelectModel.fetchParam.page_size
                }).then(ret => {
                    this.multiSelectModel.data = this.multiSelectModel.data.concat(ret.list || [])
                    this.multiSelectModel.total = ret.total
                })
            },
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let coupon_id = this.ruleForm.couponIds.join(',')
                        let mobile = ~this.ruleForm.mobile.search(/(,|，)$/) ? this.ruleForm.mobile.slice(0, -1) : this.ruleForm.mobile
                        let receive_hints = this.ruleForm.receive_hints ? 1 : 2
                        couponService.putCoupon({coupon_id, mobile, receive_hints}).then(ret => {
                            this.$emit('confirm')
                            if (ret.failure > 0) {
                                this.ruleForm.mobileFailure = ret.mobileFailure
                                this.ruleForm.mobileSuccess = ret.mobileSuccess
                                this.ruleForm.mobile = ''
                                xmview.showTip('warning', ret.message || '部分手机号不存在')
                            } else {
                                xmview.showTip('success', ret.message || '发放成功')
                                this.showDialog = false
                                this.ruleForm = initRuleForm()
                            }
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
            mobileFailure: '',
            mobileSuccess: '',
            receive_hints: true
        }
    }
</script>

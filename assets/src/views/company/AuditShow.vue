<style lang="scss" rel='stylesheet/scss'>
    @import "../../utils/mixins/showDetail";
    .company-audit-show {
        padding: 20px;
        background: #fff;
        .show-detail {
            .info {
                p.select {
                    span.value {
                        .note {
                            width: 100%;
                        }
                        &.invoice{
                            padding: 20px;
                            background: #eee;
                        }
                        &.ck{
                            line-height: 30px;
                            font-size: 16px;
                            margin-left: 20px;
                            .ck-item {
                                margin-right:20px;
                                input {
                                    margin-right:10px;
                                }
                            }
                        }

                    }
                    .audit-show-select {
                        width: 130px;
                    }
                    
                }
            }
            .dialog-footer {
                text-align: center;
            }
        }
        
    }
</style>
<template>
    <article class="company-audit-show">
        <el-tabs v-model="activeTab" type="card" @tab-click="handleClick">
            <el-tab-pane label="资质审核" name="signing">
                <section class="show-detail">
                    <div class="info" v-if="detail">
                        <p><i class="title">连锁名称：</i><span class="value">{{detail.company_name}}</span></p>
                        <p><i class="title">连锁地址：</i><span class="value">{{detail.company_address}}</span></p>
                        <p><i class="title">门店数量：</i><span class="value">{{detail.department_count}}</span></p>
                        <p><i class="title">店员数量：</i><span class="value">{{detail.user_count}}</span></p>
                        <!-- <p><i class="title">运营联系人：</i><span class="value">{{detail.user_name}}</span></p> -->
                        <p><i class="title">联系人电话：</i><span class="value">{{detail.mobile}}</span></p>
                        <p><i class="title">联系人邮箱：</i><span class="value">{{detail.email}}</span></p>
                        <p>
                            <i class="title">营业执照：</i>
                            <span class="value">
                                <img :src="detail.business_license_image | fillImgPath" alt="" @click="screenImg(detail.business_license_image)">
                            </span>
                        </p>
                        <p>
                            <i class="title">经营许可证：</i>
                            <span class="value">
                                <img :src="detail.business_certificate_image | fillImgPath" alt="" @click="screenImg(detail.business_certificate_image)">
                            </span>
                        </p>
                        <p>
                            <i class="title">GSP/GSM认证：</i>
                            <span class="value">
                                <img :src="detail.gsp_image | fillImgPath" alt="" @click="screenImg(detail.gsp_image)">
                            </span>
                        </p>
                        <p>
                            <i class="title">负责人身份证(正)：</i>
                            <span class="value">
                                <img :src="detail.idcard_front_image | fillImgPath" alt="" @click="screenImg(detail.idcard_front_image)">
                            </span>
                        </p>
                        <p>
                            <i class="title">负责人身份证(反)：</i>
                            <span class="value">
                                <img :src="detail.idcard_reverse_image | fillImgPath" alt="" @click="screenImg(detail.idcard_reverse_image)">
                            </span>
                        </p>
                        <p class="select">
                            <i class="title">审核结果：</i>
                            <span class="value">
                                <el-select class="audit-show-select" v-model="signS" :disabled="curStatus > signStatus.checking">
                                    <el-option label="请选择" :value="signStatus.checking"></el-option>
                                    <el-option label="资质未通过" :value="signStatus.reject"></el-option>
                                    <el-option label="资质通过" :value="signStatus.pass"></el-option>
                                </el-select>
                            </span>
                        </p>
                        <p class="select">
                            <i class="title">备注：</i>
                            <span class="value">
                                <el-input class="note" type="textarea" v-model="signNote" :rows="6" :disabled="curStatus > signStatus.checking"></el-input>
                            </span>
                        </p>
                    </div>
                    <div slot="footer" class="dialog-footer" v-if="curStatus === signStatus.checking">
                        <el-button type="primary" @click="submit">提 交</el-button>
                    </div>
                </section>
                <screenImg></screenImg>
            </el-tab-pane>
            <el-tab-pane :disabled="!(curStatus === signStatus.payline || curStatus >= signStatus.paid)" label="付款审核" name="payinfo">
                <section class="show-detail">
                    <div class="info" v-if="curStatus === signStatus.payline">
                        <p><i class="title">应付款金额: </i><span class="value">{{payinfo.real_money}}元</span></p>
                        <p class="select">
                            <i class="title">财务是否已收到汇款: </i>
                            <span class="value ck">
                                <label class="ck-item"><input type="radio" name="papertype"
                                    :value="signStatus.paid" @change="val => {this.payS = signStatus.paid}" 
                                    :checked="payS === signStatus.paid" />是</label>  
                                <label class="ck-item"><input type="radio" name="papertype" 
                                    :value="signStatus.paylinefail" @change="val => {this.payS = signStatus.paylinefail}" 
                                    :checked="payS === signStatus.paylinefail"/>否</label> 
                            </span> 
                        </p>
                        <p class="select">
                            <i class="title">付款流水号: </i>
                            <span class="value">{{payinfo.trade_no}}</span>
                        </p>
                        <p class="select">
                            <i class="title">备注: </i>
                            <span class="value">
                                <el-input class="note" type="textarea" v-model="payNote" :rows="6"></el-input>
                            </span>
                        </p>
                    </div>
                    <div class="info" v-if="curStatus >= signStatus.paid">
                        <p><i class="title">付款状态: </i><span class="value">已付款</span></p>
                        <p><i class="title">付款方式: </i><span class="value">{{payinfo.pay_method}}</span></p>
                        <p><i class="title">付款金额: </i><span class="value">{{payinfo.real_money}}元</span></p>
                        <p><i class="title">付款方: </i><span class="value">{{payinfo.pay_user_name}}</span></p>
                        <p><i class="title">付款交易号: </i><span class="value">{{payinfo.trade_no}}</span></p>
                        <p><i class="title">付款时间: </i><span class="value">{{payinfo.pay_time}}</span></p>
                    </div>
                    <div slot="footer" class="dialog-footer" v-if="curStatus === signStatus.payline">
                        <el-button type="primary" @click="submitPay">确认</el-button>
                    </div>
                </section>
            </el-tab-pane>
            <el-tab-pane :disabled="!(curStatus === signStatus.uninvoice || curStatus === signStatus.invoice)" label="发票邮寄" name="invoice">
                <section class="show-detail">
                    <div class="info" v-if="invoice.id">
                        <p class="select">
                            <i class="title">发票信息</i>
                            <span class="value invoice">
                                <p>发票类型 ：{{invoice.type === 'electronics'?'电子发票':'纸质发票'}}</p>
                                <p>单位名称 ：{{invoice.company_name}}</p>
                                <p>纳税人识别号 ：{{invoice.number}}</p>
                                <div v-if="invoice.category !== 'normal'">
                                    <p>地址 ：{{invoice.company_address}}</p>
                                    <p>电话 ：{{invoice.company_mobile}}</p>
                                    <p>开户行 ：{{invoice.opening_bank}}</p>
                                    <p>账号 ：{{invoice.bank_card}}</p>
                                </div>
                            </span>
                        </p>
                        <p class="select" >
                            <i class="title">收件信息</i>
                            <span class="value invoice">
                                <div v-if="invoice.type === 'paper'">
                                    <p>收件人 ：{{invoice.recipients.name}}</p>
                                    <p>联系电话 ：{{invoice.recipients.mobile}}</p>
                                    <p>所在地区 ：{{invoice.recipients.province_name + invoice.recipients.city_name + invoice.recipients.district_name}}</p>
                                    <p>详细地址 ：{{invoice.recipients.address}}</p>
                                </div>
                                <p v-else>电子邮箱 : {{invoice.recipients.email}}</p>
                            </span>
                        </p>
                        <p class="select">
                            <i class="title">处理状态</i>
                            <span class="value">
                                <el-select class="audit-show-select" :disabled="curStatus === signStatus.invoice">
                                    <el-option label="已发邮箱" v-if="invoice.type === 'electronics'?true:false"></el-option>
                                    <el-option label="已寄出" v-if="invoice.type === 'paper'?true:false"></el-option>
                                </el-select>
                            </span>
                        </p>
                        <p class="select">
                            <i class="title">备注：</i>
                            <span class="value">
                                <el-input class="note" type="textarea" v-model="invoiceNote" :rows="3" 
                                    :disabled="curStatus === signStatus.invoice"></el-input>
                            </span>
                        </p>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="submit2" v-if="curStatus === signStatus.uninvoice">提 交</el-button>
                    </div>
                </section>
            </el-tab-pane>
        </el-tabs>
        
    </article>
</template>
<script>
    import screenImg from '../component/dialog/FullScreenImg.vue'
    import companyService from '../../services/companyService'
    import signingService from 'services/system/signingService'
    export default {
        components: {
            screenImg
        },
        data () {
            return {
                signNote:'',
                signS:'',
                invoiceNote: '',
                payNote: '',
                payS: '',
                detail: null,
                activeTab: 'signing',
                invoice: {},
                signingId: '',
                signStatus: {
                    checking: 10,
                    reject: 11,
                    pass: 12,
                    unpay: 20,
                    payclose: 21,
                    payline: 22,
                    paylinefail: 23,
                    paid: 25,
                    uninvoice: 30,
                    invoice: 31
                },
                hasMoney: 1,
                payinfo: {},
                curStatus: ''
            }
        },
        // keep-alive 相应使用activated,deactivated
        activated () {
            if(this.$route.params.id){
                this.signingId = this.$route.params.id
                signingService.getSigningInfo(this.signingId).then((ret) => {
                    this.detail = ret.signing
                    if(ret.signing.status >= this.signStatus.pass) {
                        this.signS = this.signStatus.pass
                    }else {
                        this.signS = ret.signing.status
                    }
                    this.curStatus = ret.signing.status
                    if(ret.signing.remark) this.signNote = ret.signing.remark
                    if(ret.signing.status === this.signStatus.uninvoice || ret.signing.status === this.signStatus.invoice){
                        this.invoice = ret.invoice
                        if(ret.invoice.remark) this.invoiceNote = ret.invoice.remark
                        this.payinfo = ret.payinfo
                        this.activeTab = 'invoice'
                    }else if(ret.signing.status === this.signStatus.payline || ret.signing.status === this.signStatus.paid){
                        if(ret.payinfo.remark) this.payNote = ret.payinfo.remark
                        this.payinfo = ret.payinfo
                        this.payS = ret.payinfo.status
                        this.activeTab = 'payinfo'
                    }else {
                        this.activeTab = 'signing'
                    }
                }).then(() => {
                    xmview.setContentLoading(false)
                })
            }
        },
        deactivated() {
            // this.activeTab = 'signing'
            // this.invoice = {}
            // this.signingId = ''
            this.signNote = ''
            this.invoiceNote = ''
            this.payNote = ''
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            },
            submit () {
                if(this.signS === this.signStatus.checking){
                    xmview.showTip('warning', '请选择审核结果')
                    return
                }
                signingService.updateResult({
                    id: this.signingId,
                    status: this.signS,
                    remark: this.signNote
                }).then((ret) => {
                    xmview.showTip('success', '提交成功')
                    this.$router.push({name: 'company-audit'})
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            submit2 () {
                signingService.updateInvoice({
                    id: this.signingId,
                    remark: this.invoiceNote
                }).then((ret) => {
                    xmview.showTip('success', '提交成功')
                    this.$router.push({name: 'company-audit'})
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            submitPay() {
                signingService.offlinePay({
                    id: this.signingId,
                    remark: this.payNote,
                    status: this.payS
                }).then((ret) => {
                    xmview.showTip('success', '提交成功')
                    this.$router.push({name: 'company-audit'})
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            screenImg (image) {
                screenImg.setShow(image)
            },
        }
    }
</script>

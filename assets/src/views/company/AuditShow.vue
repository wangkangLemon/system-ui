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
                    }
                    .audit-show-select {
                        width: 110px;
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
                        <p><i class="title">运营联系人：</i><span class="value">{{detail.user_name}}</span></p>
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
                                <img :src="detail.GSP_image | fillImgPath" alt="" @click="screenImg(detail.GSP_image)">
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
                                <el-select class="audit-show-select" v-model="form.status">
                                    <el-option label="资质待审核" :value="signStatus.checking"></el-option>
                                    <el-option label="资质未通过" :value="signStatus.reject"></el-option>
                                    <el-option label="资质通过" :value="signStatus.pass"></el-option>
                                </el-select>
                            </span>
                        </p>
                        <p class="select">
                            <i class="title">备注：</i>
                            <span class="value">
                                <el-input class="note" type="textarea" v-model="form.note" :rows="6"></el-input>
                            </span>
                        </p>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="submit">提 交</el-button>
                    </div>
                </section>
                <screenImg></screenImg>
            </el-tab-pane>
            <el-tab-pane :disabled="!(form.status === signStatus.uninvoice || form.status === signStatus.invoice)" label="发票邮寄" name="invoice">
                <section class="show-detail">
                    <div class="info" v-if="invoice">
                        <p class="select">
                            <i class="title">发票信息</i>
                            <span class="value invoice">
                                <p>发票类型 ：{{invoice.type === 'electronics'?'电子发票':'纸质发票'}}</p>
                                <p>单位名称 ：{{invoice.company_name}}</p>
                                <p>纳税人识别号 ：{{invoice.number}}</p>
                                <p>地址 ：{{invoice.company_address}}</p>
                                <p>电话 ：{{invoice.company_mobile}}</p>
                                <p>开户行 ：{{invoice.opening_bank}}</p>
                                <p>账号 ：{{invoice.bank_card}}</p>
                            </span>
                        </p>
                        <p class="select" v-if="invoice.type === 'paper'">
                            <i class="title">收件信息</i>
                            <span class="value invoice">
                                <p>收件人 ：{{invoice.recipients.name}}</p>
                                <p>联系电话 ：{{invoice.recipients.mobile}}</p>
                                <p>所在地区 ：{{invoice.recipients.province_name + invoice.recipients.city_name + invoice.recipients.district_name}}</p>
                                <p>详细地址 ：{{invoice.recipients.address}}</p>
                            </span>
                        </p>
                        <p class="select">
                            <i class="title">处理状态</i>
                            <span class="value">
                                <el-select class="audit-show-select">
                                    <el-option label="已发邮箱" v-if="invoice.type === 'electronics'?true:false"></el-option>
                                    <el-option label="已寄出" v-if="invoice.type === 'paper'?true:false"></el-option>
                                </el-select>
                            </span>
                        </p>
                        <p class="select">
                            <i class="title">备注：</i>
                            <span class="value">
                                <el-input class="note" type="textarea" v-model="form1.note" :rows="3" 
                                    :disabled="form.status === signStatus.invoice"></el-input>
                            </span>
                        </p>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="submit2" :disabled="form.status === signStatus.invoice">提 交</el-button>
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
                form: {
                    status: '',
                    note: ''
                },
                form1: {
                    note: ''
                },
                detail: null,
                activeTab: 'signing',
                invoice: {},
                signingId: '',
                signStatus: {
                    checking: 10,
                    reject: 11,
                    pass: 12,
                    unpay: 20,
                    paid: 22,
                    uninvoice: 30,
                    invoice: 31
                }
            }
        },
        // keep-alive 相应使用activated,deactivated
        activated () {
            if(this.$route.params.id){
                this.signingId = this.$route.params.id
                signingService.getSigningInfo(this.signingId).then((ret) => {
                    this.detail = ret.signing
                    this.form.status = ret.signing.status
                    this.form.note = ret.signing.remark
                    if(ret.signing.status === this.signStatus.uninvoice || ret.signing.status === this.signStatus.invoice){
                        this.invoice = ret.invoice
                        this.form1.note = ret.invoice.remark
                        this.activeTab = 'invoice'
                    }else {
                        this.activeTab = 'signing'
                    }
                }).then(() => {
                    xmview.setContentLoading(false)
                })
            }
        },
        deactivated() {
            this.activeTab = 'signing'
            this.invoice = {}
            this.signingId = ''
            this.form = {}
            this.form1 = {}
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            },
            submit () {
                signingService.updateResult({
                    id: this.signingId,
                    status: this.form.status,
                    remark: this.form.note
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
                    remark: this.form1.note
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

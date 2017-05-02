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
        <section class="show-detail">
            <div class="info" v-if="detail">
                <p><i class="title">药店名称：</i><span class="value">{{detail.name}}</span></p>
                <p><i class="title">药店地址：</i><span class="value">{{detail.address}}</span></p>
                <p><i class="title">门店数量：</i><span class="value">{{detail.department_range}}</span></p>
                <p><i class="title">店员数量：</i><span class="value">{{detail.user_range}}</span></p>
                <p><i class="title">运营联系人：</i><span class="value">{{detail.contact}}</span></p>
                <p><i class="title">联系人电话：</i><span class="value">{{detail.phone}}</span></p>
                <p><i class="title">联系人邮箱：</i><span class="value">{{detail.email}}</span></p>
                <p>
                    <i class="title">营业执照：</i><span class="value">
                    <img :src="detail.business_license | fillImgPath" alt="" @click="screenImg(detail.business_license)"></span></p>
                <p><i class="title">经营许可证：</i><span class="value"><img :src="detail.business_permit | fillImgPath" alt="" @click="screenImg(detail.business_permit)"></span></p>
                <p><i class="title">GSP/GSM认证：</i><span class="value"><img :src="detail.gsp | fillImgPath" alt="" @click="screenImg(detail.gsp)"></span></p>
                <p><i class="title">负责人身份证：</i><span class="value"><img :src="detail.id_card | fillImgPath" alt="" @click="screenImg(detail.id_card)"></span></p>
                <p class="select">
                    <i class="title">审核结果：</i>
                    <span class="value">
                        <el-select class="audit-show-select" v-model="form.status">
                            <el-option label="待审核" :value="1"></el-option>
                            <el-option label="审核通过" :value="2"></el-option>
                            <el-option label="审核失败" :value="3"></el-option>
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
    </article>
</template>
<script>
    import screenImg from '../component/dialog/FullScreenImg.vue'
    import companyService from '../../services/companyService'
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
                detail: null,
//                auditID: this.$route.params.id
            }
        },
        computed: {
            auditID () {
                return this.$route.params.id
            }
        },
        activated () {
            companyService.getAuditDetail(this.auditID).then((ret) => {
                this.detail = ret.data
                this.form.status = ret.data.status
                this.form.note = ret.data.note
            }).then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            submit () {
                companyService.addAudit({
                    audit_id: this.auditID,
                    status: this.form.status,
                    note: this.form.note
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

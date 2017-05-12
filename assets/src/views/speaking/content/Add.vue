<!--添加任务模板-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/mixins";

    #speaking-content-addspeaking {
        @extend %content-container;
        .img-wrap {
            width: 70%;
            img {
                width: 100%;
            }
        }
        .course-search {
            margin-bottom: 12px;
            .el-input {
                width: 150px;
                ::-webkit-input-placeholder {
                    font-size: 13px
                }
            }
        }
    }
</style>

<template>
    <article id="speaking-content-addspeaking">
        <el-form :model="form" :rules="rules" label-position="right" ref="form" label-width="120px" style="width: 60%">
            <el-form-item prop="title" label="标题">
                <el-input v-model="form.title" auto-complete="off" :maxlength="15" placeholder="标题设置不得超过15个字"></el-input>
            </el-form-item>
            <el-form-item prop="content" label="内容">
                <el-input v-model="form.content" auto-complete="off" :rows="6" type="textarea" :maxlength="50" placeholder="内容设置不得超过50个字"></el-input>
            </el-form-item>
            <el-form-item prop="image" label="图片">
                <div class="img-wrap" v-if="form.image">
                    <img :src="form.image | fillImgPath" alt=""/>
                    <!--<img src="http://sysapidemo.yst.vodjk.com/upload/speaking/images/1494573841285123.jpg" alt="">-->
                </div>
                <ImagEcropperInput :isRound="false" :aspectRatio="2/1" :confirmFn="cropperFn"
                                   class="upload-btn"></ImagEcropperInput>
            </el-form-item>
            <el-form-item prop="end_time" label="截止日期">
                <el-date-picker
                        v-model="form.end_time"
                        type="date"
                        placeholder="选择截止日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="price_enabled" label="是否设置红包">
                <template>
                    <el-radio class="radio" v-model="form.price_enabled" :label="1">是</el-radio>
                    <el-radio class="radio" v-model="form.price_enabled" :label="0">否</el-radio>
                </template>
            </el-form-item>
            <el-form-item prop="price_company_id" label="红包赞助工业">
                <!--<CompanySelect v-model="form.price_company_id"-->
                <!--:placeholder="form.price_company_name"-->
                <!--:disabled="!form.price_enabled"></CompanySelect>-->

                <IndustryCompanySelect v-model="form.price_company_id" :type="1" :placeholder="form.price_company_name"
                                       :disabled="!form.price_enabled">
                </IndustryCompanySelect>
            </el-form-item>
            <el-form-item label="赞助企业余额">
                <el-tag type="primary">{{this.balance}} 元</el-tag>
            </el-form-item>
            <!--el-form-item label="红包设置">
                <span style="color: red">*为药我说添加红包可在下面填写，不填写默认为不添加红包，药我说满分后用户可领取该红包</span>
            </el-form-item-->
            <el-form-item prop="price_total" label="总额预算">
                <el-input-number v-model="form.price_total" auto-complete="off"
                                 :disabled="!form.price_enabled"></el-input-number>
            </el-form-item>
            <el-form-item prop="price" label="单价">
                <el-input-number v-model="form.price" auto-complete="off"
                                 :disabled="!form.price_enabled"></el-input-number>
            </el-form-item>
            <el-form-item prop="price_float" label="浮动">
                <el-input-number v-model="form.price_float" auto-complete="off"
                                 :disabled="!form.price_enabled"></el-input-number>
            </el-form-item>
            <el-form-item prop="sort">
                <el-button type="primary" @click="submit(0)" :disabled="submiting">保存并上线</el-button>
                <!--<el-button type="warning" @click="submit(1)">存草稿</el-button>-->
            </el-form-item>
        </el-form>
    </article>
</template>

<script>
    import ImagEcropperInput from '../../component/upload/ImagEcropperInput.vue'
    import IndustryCompanySelect from '../../component/select/IndustryCompany.vue'
    import speakingContentService from '../../../services/speaking/contentService'
    import * as timeUtls from '../../../utils/timeUtils'

    export default{
        name: 'speaking-content-add',
        data () {
            return {
                submiting: false, // 提交中
                form: {                // 表单属性值
                    id: void 0,
                    title: void '',          // 标题
                    image: void '',        // 图片地址
                    content: void '',  // 内容
                    end_time: void 0,         // 截止日期
                    price_enabled: void 0,     // 是否启用红包
                    price_company_name: void 0, // 赞助企业名
                    price_company_id: void 0,       // 红包赞助工业
                    price_total: void 0, // 总额预算
                    price: void 0, // 红包单价
                    price_float: void 0, // 红包浮动范围
                    status: void 0, // 状态
                },
                rules: {
                    title: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    content: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    image: [
                        {required: true, message: '必须上传图片', trigger: 'blur'}
                    ],
                    price_enabled: {required: true, type: 'number', message: '请选择是否设置红包', trigger: 'blur'}
                },
                dialogCourse: {
                    loading: false,
                    isShow: false,
                    keyword: void 0,
                },
                balance: 0, // 账户余额
            }
        },
        watch: {
            'form.price_enabled' (val) {
                if (val) {
                    this.rules.price_company_id = {
                        type: 'number',
                        required: true,
                        message: '请选择红包赞助企业',
                        trigger: 'change'
                    }
                } else {
                    delete this.rules.price_company_id
                    this.form.price_company_id = this.form.price_total = this.form.price = this.form.price_float = this.form.price_company_name = void 0
                }
            },
            'form.price_company_id' (val) {
                if (val) {
                    this.getbalance(val)
                }
            }
        },
        created () {
            if (this.$route.query.id) {
                speakingContentService.getSpeakingById({
                    speaking_id: this.$route.query.id
                }).then((ret) => {
                    this.form = ret.data.speaking
                }, () => {
                }).then(() => {
                    xmview.setContentLoading(false)
                })
                xmview.setContentTile('编辑药我说-药我说')
            } else {
                xmview.setContentLoading(false)
            }
        },
        methods: {
            cropperFn(data) {
                speakingContentService.speakingImageUpload({
                    image: data,
                    alias: Date.now() + '.jpg'
                }).then((ret) => {
                    xmview.showTip('success', '上传成功')
                    this.form.image = ret.data.url // 显示图片
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            getbalance(data) {
                speakingContentService.getBalanceByCompantID({
                    company_id: data
                }).then((ret) => {
                    this.balance = ret.data.balance
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            submit(s) {
                this.$refs.form.validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    this.submiting = true
                    let reqFn = speakingContentService.addSpeaking
                    if (this.form.id) {
                        reqFn = speakingContentService.updateSpeaking
                    }

                    this.form.end_time = timeUtls.date2Str(this.form.end_time)
                    reqFn(this.form).then((ret) => {
                        xmview.showTip('success', '保存成功')
                        this.$router.back()
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message)
                        this.submiting = false
                    })
                })
            }
        },
        components: {ImagEcropperInput, IndustryCompanySelect}
    }
</script>

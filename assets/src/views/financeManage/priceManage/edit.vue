<style lang='scss' rel='stylesheet/scss'>
    #form {
        width: 630px;
        hr{
            margin-bottom: 15px;
        }
        .multy-choose-item{
            padding: 5px 0;
        }
        .el-button + .el-button{
            margin-left: 0;
        }
        .title{
            padding: 5px 0 15px 0;
        }
        .text_warning{
            color: #ff4949;
            font-size: 12px;
            line-height: 0.5;
            padding-top: 15px;
        }
    }
</style>
<template>
    <div>
        <el-form id="form" ref="form" :model="specialInfo" :rules="rules" label-width="150px">
            <section class="title">
                <h2>基本信息</h2>
            </section>    
            <div class="el-form-item">
                <label for="score" class="el-form-item__label" style="width: 150px;">工业名称：</label>
                <div class="el-form-item__content" style="margin-left: 80px;">
                    {{specialInfo.company_name}}
                </div>
            </div>
            <div class="el-form-item">
                <label for="score" class="el-form-item__label" style="width: 150px;">连锁名称：</label>
                <div class="el-form-item__content" style="margin-left: 80px;">
                    {{specialInfo.store_name == '' ? '全部连锁' : specialInfo.store_name}}
                </div>
            </div>
            <el-form-item label="优惠截止日期：" prop="deadline" v-if="specialInfo.store_name != ''">
                <el-date-picker
                        v-model="specialInfo.deadline"
                        type="datetime"
                        placeholder="选择截止日期">
                </el-date-picker>
                <div class="text_warning">截止日期为所选日期当日00:00:00</div>
            </el-form-item>
            <el-form-item label="优惠截止日期：" prop="deadline1" v-if="specialInfo.store_name == ''">
                <el-date-picker
                        v-model="specialInfo.deadline"
                        type="datetime"
                        placeholder="选择截止日期">
                </el-date-picker>
                <div class="text_warning">截止日期为所选日期当日00:00:00</div>
            </el-form-item>
            <hr>
            <section class="title">
                <h2>投放定价信息</h2>
            </section>
            <el-form-item label="工业药我说：" prop="speaking_price">
                <el-input v-model.number="specialInfo.speaking_price" placeholder="请输入工业药我说定价"
                @blur="validateSpeaking">
                    <template slot="append">元/人</template>
                </el-input>
            </el-form-item>
             <el-form-item label="独立红包：" prop="lucky_money_price">
                <el-input v-model.number="specialInfo.lucky_money_price" placeholder="请输入独立红包定价"
                @blur="validateLucky">
                    <template slot="append">元/人</template>
                </el-input>
            </el-form-item>
             <el-form-item label="工业课：" prop="industry_course_price">
                <el-input v-model.number="specialInfo.industry_course_price" placeholder="请输入工业课定价"
                @blur="validateIndustry">
                    <template slot="append">元/人</template>
                </el-input>
                <div class="text_warning">投放定价信息未填写的项目按照默认定价收费</div>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import TestSpecialService from '../../../services/finance/specialService'
    import * as timeUtils from '../../../utils/timeUtils'

    export default{
        data () {
            return {
                specialInfo: {
                    store_name: '',
                    store_id: '',
                    company_name: '',
                    company_id: '',
                    deadline: '',
                    industry_course_price: void 0,
                    speaking_price: void 0,
                    lucky_money_price: void 0
                },
                rules: {
                    deadline: [
                        { type: 'date', required: true, message: '请选择截止日期', trigger: 'change' },
                    ],
                    speaking_price: [
                        { type: 'number', min: 0, message: '请输入正整数', trigger: 'blur' },
                    ],
                    lucky_money_price: [
                        { type: 'number', min: 0, message: '请输入正整数', trigger: 'blur' },
                    ],
                    industry_course_price: [
                        { type: 'number', min: 0, message: '请输入正整数', trigger: 'blur' },
                    ]
                }
            }
        },
        activated () {
            xmview.setContentLoading(false)
            this.getSpecialById()
        },
        mounted () {
        },
        methods: {
            getSpecialById () {
                let id = this.$route.params.id
                TestSpecialService.getSpecialById(id).then((ret) => {
                    if (ret.pricing_company.deadline && ret.pricing_company.deadline != '') {
                        ret.pricing_company.deadline = timeUtils.formatDate(ret.pricing_company.deadline, 'yyyy-MM-dd hh:mm:ss')
                    }
                    ret.pricing_company.industry_course_price = ret.pricing_company.industry_course_price == 0 ? void 0 : ret.pricing_company.industry_course_price
                    ret.pricing_company.lucky_money_price = ret.pricing_company.lucky_money_price == 0 ? void 0 : ret.pricing_company.lucky_money_price
                    ret.pricing_company.speaking_price = ret.pricing_company.speaking_price == 0 ? void 0 : ret.pricing_company.speaking_price
                    this.specialInfo = ret.pricing_company
                    xmview.setContentLoading(false)
                })
            },
            submitForm () {
                this.$refs['form'].validate((pass) => {
                    if (!pass) {
                        xmview.showTip('error', '您填写的数据不对，请检查红色项')
                        return
                    }
                    if (this.specialInfo.deadline && this.specialInfo.deadline != '') {
                        this.specialInfo.deadline = timeUtils.formatDate(this.specialInfo.deadline, 'yyyy-MM-dd hh:mm:ss')
                    }
                    TestSpecialService.update(this.$route.params.id, this.specialInfo).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.$refs['form'].resetFields()
                        this.$router.push({name: 'test-special-index'})
                    })
                })
            },
            cancel () {
                this.$refs['form'].resetFields()
                this.$router.go(-1)
            },
            validateIndustry () {
                this.specialInfo.industry_course_price === '' && (this.specialInfo.industry_course_price = void 0)
            },
            validateSpeaking () {
                this.specialInfo.speaking_price === '' && (this.specialInfo.speaking_price = void 0)
            },
            validateLucky () {
                this.specialInfo.lucky_money_price === '' && (this.specialInfo.lucky_money_price = void 0)
            }
        },
        components: {},
        directives: {
        }
    }
</script>

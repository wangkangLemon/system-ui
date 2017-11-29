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
        <el-form id="form" ref="addForm" :model="specialInfo" :rules="rules" label-width="120px">
            <section class="title">
                <h2>基本信息</h2>
            </section>    
            <el-form-item prop="store_id" label="工业名称">
                <IndustryCompanySelect type="1" v-model="specialInfo.store_id"
                                       v-on:change="val=>specialInfo.store_id=val">
                </IndustryCompanySelect>
            </el-form-item>
            <el-form-item label="连锁名称" prop="company_id">
                <IndustryCompanySelect type="2" v-model="specialInfo.company_id"
                    v-on:change="val=>specialInfo.company_id=val">
                </IndustryCompanySelect>
                <div class="text_warning">若不填写连锁名称，则该工业对所有连锁优惠生效</div>
            </el-form-item>

            <el-form-item label="优惠截止日期" prop="deadline">
                <el-date-picker
                        v-model="specialInfo.deadline"
                        type="date"
                        placeholder="选择截止日期">
                </el-date-picker>
                <div class="text_warning">截止日期为所选日期当日00:00:00</div>
            </el-form-item>
            <hr>
            <section class="title">
                <h2>投放定价信息</h2>
            </section>
            <el-form-item label="工业药我说" prop="vedio_course">
                <el-input v-model.number="specialInfo.speaking_price" placeholder="请输入工业药我说定价">
                    <template slot="append">元/人</template>
                </el-input>
            </el-form-item>
             <el-form-item label="独立红包" prop="vedio_course">
                <el-input v-model.number="specialInfo.lucky_money_price" placeholder="请输入独立红包定价">
                    <template slot="append">元/人</template>
                </el-input>
            </el-form-item>
             <el-form-item label="工业课" prop="vedio_course">
                <el-input v-model.number="specialInfo.industry_course_price" placeholder="请输入工业课定价">
                    <template slot="append">元/人</template>
                </el-input>
                <div class="text_warning">投放定价信息未填写的项目按照默认定价收费</div>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

    import IndustryCompanySelect from '../../component/select/IndustryCompany.vue'
    import TestSpecialService from '../../../services/finance/specialService'
    import * as timeUtils from '../../../utils/timeUtils'

    export default{
        data () {
            return {
                specialInfo: this.newSpecialInfo(),
                rules: {
                    store_id: [
                        { type: 'number', required: true, message: '请选择工业', trigger: 'change' },
                    ],
                    deadline: [
                        { type: 'date', required: true, message: '请选择截止日期', trigger: 'change' },
                    ],
                }
            }
        },
        activated () {
            xmview.setContentLoading(false)
        },
        methods: {
            // 提交表单
            submitForm () {
                this.$refs['addForm'].validate((pass) => {
                    if (!pass) {
                        return
                    }
                    this.specialInfo.deadline = timeUtils.formatDate(this.specialInfo.deadline, 'yyyy-MM-dd hh:mm:ss')
                    return TestSpecialService.create(this.specialInfo).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.$router.push({name: 'test-special-index'})
                    })
                })
            },
            newSpecialInfo () {
                return {
                    store_id: '',
                    company_id: '',
                    deadline: '',
                    industry_course_price: '',
                    speaking_price: '',
                    lucky_money_price: ''
                }
            }
        },
        components: {
            IndustryCompanySelect
        },
        directives: {
        }
    }
</script>

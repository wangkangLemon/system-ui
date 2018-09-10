<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #course-drug-add-container {
        @extend %content-container;
        .search {
            @extend %top-search-container;
        }
        .top-btn {
            @extend %right-top-btnContainer;
        }
    }

    .u-loadmore {
        color: #63bdea;
        margin-left: 10px;
        padding-top: 4px;
        display: block;
        cursor: pointer;
    }
</style>

<template>
    <main id="course-drug-add-container">
        <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="80px">
            <el-form-item label="通用名" prop="common_name">
                <el-input
                    v-model="ruleForm.common_name">
                </el-input>
            </el-form-item>
            <el-form-item label="厂家" prop="manufacturer">
                <el-input
                    v-model="ruleForm.manufacturer">
                </el-input>
            </el-form-item>
            <el-form-item label="商品名" prop="trade_name">
                <el-input
                    v-model="ruleForm.trade_name">
                </el-input>
            </el-form-item>
            <el-form-item label="别名" prop="another_name">
                <el-input
                    v-model="ruleForm.another_name">
                </el-input>
            </el-form-item>
            <el-form-item label="系统分类" prop="category_system">
<!--                 <el-select 
                    v-model="ruleForm.category_system" 
                    filterable 
                    clearable 
                    placeholder="请选择">
                    <el-option 
                        v-for="item in " 
                        :key="item.value"
                        :label="item.label" 
                        :value="item.value">
                    </el-option>
                </el-select> -->
            </el-form-item>
            <el-form-item label="柜组分类" prop="category_group">
    
            </el-form-item>
            <el-form-item label="药品分类" prop="category_drug">
            
            </el-form-item>
            <el-form-item label="品类" prop="category">
                <el-radio v-model="ruleForm.category" :label="1">重点品种</el-radio>
                <el-radio v-model="ruleForm.category" :label="2">常用品种</el-radio>
            </el-form-item>
            <el-form-item label="疗程用药" prop="treatment_course">
                <el-input
                    v-model="ruleForm.treatment_course">
                </el-input>
            </el-form-item>            
            <el-form-item label="服药天数" prop="day_count">
                <el-input
                    v-model="ruleForm.day_count">
                </el-input>
            </el-form-item>            
            <el-form-item label="关联说明书" prop="instructions">
                
            </el-form-item>
            <el-form-item label="规格" prop="specification">
                <el-input
                    v-model="ruleForm.specification"
                    type="textarea">
                </el-input>
            </el-form-item>
            <el-form-item label="功能主治" prop="treatment">
                <el-input
                    v-model="ruleForm.treatment"
                    type="textarea">
                </el-input>
            </el-form-item>
            <el-form-item label="疗程用药适应症" prop="disease">
                <el-input
                    v-model="ruleForm.disease"
                    type="textarea">
                </el-input>
            </el-form-item>
            <el-form-item label="联合用药" prop="drug_combination">
                <el-input
                    v-model="ruleForm.drug_combination"
                    type="textarea">
                </el-input>
            </el-form-item>
            <el-form-item label="一句话卖点" prop="selling_point">
                <el-input
                    v-model="ruleForm.selling_point"
                    type="textarea">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button 
                    v-if="!isView"
                    type="primary" 
                    @click="submitForm('ruleForm')">
                    {{isEdit ? '更新' : '添加'}}
                </el-button>
            </el-form-item>
        </el-form>
    </main>
</template>

<script>
    import drugService from 'services/course/drugService'

    export default {
        components: {},
        props: {},
        activated () {},
        created () {
            if (this.isView || this.isEdit) {
                this.getDrugDetail().then(() => {
                    xmview.setContentLoading(false)
                })
            }
        },
        mounted () {},
        computed: {},
        watch: {},
        data () {
            return {
                isView: this.$route.query.isView,
                isEdit: this.$route.query.isEdit,
                ruleForm: {
                    id: this.$route.query.id,
                    common_name: '',
                    trade_name: '',
                    another_name: '',
                    category_system: '',
                    category_group: '',
                    category_drug: '',
                    manufacturer: '',
                    category: '',
                    treatment_course: '',
                    day_count: '',
                    instructions: '',
                    specification: '',
                    treatment: '',
                    disease: '',
                    drug_combination: '',
                    selling_point: ''
                },
                rules: {
                    common_name: {required: true, message: '请输入通用名', trigger: 'blur'},
                    manufacturer: {required: true, message: '请输入厂家', trigger: 'blur'},
                    category_system: {required: true, message: '请选择系统分类', trigger: 'change'},
                    category_group: {required: true, message: '请选择柜组分类', trigger: 'change'},
                    category_drug: {required: true, message: '请选择药品类别', trigger: 'change'},
                    category: {required: true, message: '请选择品类', trigger: 'change'},
                    instructions: {required: true, message: '请选择关联说明书', trigger: 'change'},
                }
            }
        },
        methods: {
            getDrugDetail () {
                return drugService.getDrugDetail(this.ruleForm.id).then(ret => {
                    this.ruleForm = ret.data || {}
                })
            },
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let service = !isEdit ? 'add' : 'update'
                        drugService[service](this.ruleForm)
                    }
                })
            }
        },
        filters: {},
        directives: {},
    }
</script>

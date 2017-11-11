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
    }
</style>
<template>
    <el-form  id="form" ref="form" :model="paper" :rules="rules" label-width="120px">
        <el-form-item label="试卷名称" prop="name">
            <el-input v-model="paper.name" placeholder="请输入试卷名称"></el-input>
        </el-form-item>
        <el-form-item label="试卷封面" prop="image">
            <img :src="paper.image | fillImgPath" width="200" height="112" v-show="paper.image">
            <CropperImg ref="imgCropper" :aspectRatio="16/9" :confirmFn="cropperImgSuccess"></CropperImg>
        </el-form-item>
        <!--<el-form-item label="题目数量" prop="number">-->
        <!--<el-input class="number" v-model="paper.number"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="试卷总分" prop="score">-->
        <!--<el-input class="number" v-model="paper.score"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="判断题" prop="judge_score">
            <el-input type="number" v-model.number="paper.judge_score" style="width: 300px" v-number-only>
                <template slot="prepend">每题</template>
                <template slot="append">分</template>
            </el-input>
        </el-form-item>
        <el-form-item label="单选题" prop="single_score">
            <el-input type="number" v-model.number="paper.single_score" style="width: 300px" v-number-only>
                <template slot="prepend">每题</template>
                <template slot="append">分</template>
            </el-input>
        </el-form-item>
        <el-form-item label="多选题" prop="multi_score">
            <el-input type="number" v-model.number="paper.multi_score" style="width: 300px" v-number-only>
                <template slot="prepend">每题</template>
                <template slot="append">分</template>
            </el-input>
        </el-form-item>
        <el-form-item label="考试时间" prop="limit_time">
            <el-input type="number" v-model.number="paper.limit_time" style="width: 300px" v-number-only>
                <template slot="append">分钟</template>
            </el-input>
        </el-form-item>
        <el-form-item label="及格分数" prop="score_pass">
            <el-input type="number" v-model.number="paper.score_pass" style="width: 300px" v-number-only>
                <template slot="append">分</template>
            </el-input>
        </el-form-item>
        <el-form-item label="试题解析时间" prop="answer_show_type">
            <el-radio-group v-model="paper.answer_show_type">
                <el-radio label="now">立即</el-radio>
                <el-radio label="timing">延迟</el-radio>
            </el-radio-group>
            <el-form-item prop="answer_show_time" v-if="paper.answer_show_type == 'timing'" style="display: inline-block">
                至
                <el-date-picker
                        v-model="paper.answer_show_time"
                        type="datetime"
                        placeholder="选择日期时间">
                </el-date-picker>
                之后显示
            </el-form-item>
        </el-form-item>
        <el-form-item label="考试次数限制" prop="limit_repeat">
            <el-input type="number" v-model.number="paper.limit_repeat" style="width: 300px" placeholder="留空或为0表示不限制" v-number-only>
                <template slot="append">次</template>
            </el-input>
        </el-form-item>
        <el-form-item label="课程归属" prop="company_id">
            <CompanySelect type="3" v-model.number="paper.company_id">
            </CompanySelect>
        </el-form-item>

        <ImportQuestion :questions="paper.questions" :scores="paper"></ImportQuestion>

        <slot name="formFooter"></slot>
    </el-form>
</template>

<script>
    import CropperImg from '../../component/upload/ImagEcropperInput.vue'
    import ImportQuestion from '../ImportQuestion.vue'
    import testPaperService from '../../../services/testPagerService'
    import CompanySelect from '../../component/select/IndustryCompany.vue'
    import NumberOnly from '../../../directives/numberOnly'

    export default{
        props: {
            paper: {
                type: Object,
                required: true
            }
        },
        data () {
            return {
                rules: {
                    name: [
                        { required: true, message: '请输入试卷名称', trigger: 'blur' },
                    ],
//                    image: [
//                        { required: true, message: '请上传试卷封面', trigger: 'blur' },
//                    ],
                    single_score: [
                        { type: 'number', required: true, message: '请输入单选题分数', trigger: 'blur' },
                        { type: 'number', min: 0, message: '请输入正整数', trigger: 'blur' },
                    ],
                    multi_score: [
                        { type: 'number', required: true, message: '请输入多选题分数', trigger: 'blur' },
                        { type: 'number', min: 0, message: '请输入正整数', trigger: 'blur' },
                    ],
                    judge_score: [
                        { type: 'number', required: true, message: '请输入判断题分数', trigger: 'blur' },
                        { type: 'number', min: 0, message: '请输入正整数', trigger: 'blur' },
                    ],
                    limit_time: [
                        { type: 'number', required: true, message: '请输入考试时间', trigger: 'blur' },
                        { type: 'number', min: 0, message: '请输入正整数', trigger: 'blur' },
                    ],
                    score_pass: [
                        { type: 'number', required: true, message: '请输入及格分数', trigger: 'blur' },
                        { type: 'number', min: 0, message: '请输入正整数', trigger: 'blur' },
                    ],
                    answer_show_type: [
                        { required: true, message: '请选择试题解析类型', trigger: 'blur' },
                    ],
                    answer_show_time: [
                        { type: 'date', required: true, message: '请输入试题解析时间', trigger: 'blur' },
                    ],
                }
            }
        },
        methods: {
            validateForm(func) {
                return this.$refs['form'].validate(func)
            },
            cropperImgSuccess (data, ext) {
                testPaperService.getUploadUrl({
                    image: data,
                    alias: Date.now() + ext
                }).then((ret) => {
                    this.paper.image = ret.url
                })
            },
        },
        components: {CropperImg, ImportQuestion, CompanySelect},
        directives: {
            numberOnly: NumberOnly
        }
    }
</script>

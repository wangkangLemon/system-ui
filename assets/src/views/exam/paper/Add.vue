<style lang='scss' rel='stylesheet/scss'>
    #form {
        width: 650px;
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
    <el-form  id="form" ref="form" :model="form"  label-width="120px">
        <el-form-item label="试卷名称" prop="name">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="试卷封面" prop="image">
            <img :src="form.image | fillImgPath" width="200" height="112" v-show="form.image">
            <CropperImg ref="imgCropper" :aspectRatio="16/9"></CropperImg>
        </el-form-item>
        <!--<el-form-item label="题目数量" prop="number">-->
            <!--<el-input class="number" v-model="form.number"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="试卷总分" prop="score">-->
            <!--<el-input class="number" v-model="form.score"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="单选题" prop="single_score">
            <el-input class="number" v-model="form.single_score" style="width: 300px">
                <template slot="prepend">每题</template>
                <template slot="append">分</template>
            </el-input>
        </el-form-item>
        <el-form-item label="多选题" prop="multi_score">
            <el-input class="number" v-model="form.multi_score" style="width: 300px">
                <template slot="prepend">每题</template>
                <template slot="append">分</template>
            </el-input>
        </el-form-item>
        <el-form-item label="判断题" prop="judge_score">
            <el-input class="number" v-model="form.judge_score" style="width: 300px">
                <template slot="prepend">每题</template>
                <template slot="append">分</template>
            </el-input>
        </el-form-item>
        <el-form-item label="考试时间" prop="limit_time">
            <el-input class="number" v-model.number="form.limit_time" style="width: 300px">
                <template slot="append">分钟</template>
            </el-input>
        </el-form-item>
        <el-form-item label="及格分数" prop="score_pass">
            <el-input class="number" v-model="form.score_pass" style="width: 300px">
                <template slot="append">分</template>
            </el-input>
        </el-form-item>
        <el-form-item label="试题解析时间" prop="answer_show_time">
            <el-date-picker
                    v-model="form.answer_show_time"
                    type="datetime"
                    placeholder="选择日期时间">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="考试次数限制" prop="limit_repeat">
            <el-input class="number" v-model="form.limit_repeat" style="width: 300px">
                <template slot="append">次</template>
            </el-input>
        </el-form-item>

        <ImportQuestion :questions="questions"></ImportQuestion>

        <el-form-item>
            <el-button type="primary" @click="submitForm">发布试卷</el-button>
            <el-button>取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import CropperImg from '../../component/upload/ImagEcropperInput.vue'
    import ImportQuestion from '../ImportQuestion.vue'
    import testPagerService from '../../../services/testPagerService'
    import Paper from '../../../models/paper'

    let paper = new Paper()
    paper.type = 'exam'

    export default{
        data () {
            return {
                form: paper,
                questions: [],
                rules: {
                    name: [
                        { required: true, message: '请输入试卷名称', trigger: 'blur' },
                    ],
//                    image: [
//                        { required: true, message: '请上传试卷封面', trigger: 'blur' },
//                    ],
                    single_score: [
                        { required: true, message: '请输入单选题分数', trigger: 'blur' },
                    ],
                    multi_score: [
                        { required: true, message: '请输入多选题分数', trigger: 'blur' },
                    ],
                    judge_score: [
                        { required: true, message: '请输入判断题分数', trigger: 'blur' },
                    ],
                    limit_time: [
                        { required: true, message: '请输入考试时间', trigger: 'blur' },
                    ],
                    score_pass: [
                        { required: true, message: '请输入及格分数', trigger: 'blur' },
                    ],
                    answer_show_time: [
                        { required: true, message: '请输入试题解析时间', trigger: 'blur' },
                    ],
                    limit_repeat: [
                        { required: true, message: '请输入考试次数', trigger: 'blur' },
                    ],
                }
            }
        },
        activated () {
            xmview.setContentLoading(false)
        },
        methods: {
            submitForm() {
                let data = Object.assign({}, this.form)
                if (data.answer_show_time) {
                    data.answer_show_time = this.format(this.form.answer_show_time, 'yyyy-MM-dd hh:mm:ss')
                }
                testPagerService.create(data).then((ret) => {
                    let examId = ret.id
                    let data = []
                    this.questions.forEach((question) => {
                        data.push(question.format)
                    })
                    testPagerService.batchCreateQuestion(examId, data).then((ret) => {
                        alert('ok')
                    })
                })
//                this.$refs['form'].validate((pass) => {
//                    if (pass) {
//
//                    } else {
//                        console.log('error submit!!')
//                        return false
//                    }
//                })
            },
            format (date, fmt) {
                var o = {
                    'M+': date.getMonth() + 1, // 月份
                    'd+': date.getDate(), // 日
                    'h+': date.getHours(), // 小时
                    'm+': date.getMinutes(), // 分
                    's+': date.getSeconds(), // 秒
                    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
                    'S': date.getMilliseconds() // 毫秒
                }
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
                for (var k in o)
                    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
                return fmt
            }
        },
        components: {CropperImg, ImportQuestion}
    }
</script>

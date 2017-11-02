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
    <el-form  id="form" ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="试卷名称" prop="name">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="试卷封面" prop="image">
            <img :src="form.image | fillImgPath" width="200" height="112" v-show="form.image">
            <CropperImg ref="imgCropper" :aspectRatio="16/9"></CropperImg>
        </el-form-item>
        <el-form-item label="题目数量" prop="number">
            <el-input class="number" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="试卷总分" prop="score">
            <el-input class="number" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="考试时间" prop="long">
            <el-input class="number" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="及格分数" prop="pass_score">
            <el-input class="number" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="考试后" prop="wait_resolve">
            <el-input class="number" v-model="form.name">
                <template slot="append">分钟开启试题解析</template>
            </el-input>
        </el-form-item>
        <el-form-item label="考试次数" prop="times">
            <el-input class="number" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="学分奖励" prop="award_score">
            <el-input class="number" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="适用对象" prop="suit">
            <el-select v-model="form.name" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
            </el-select>
        </el-form-item>

        <LibraryImportDialog ref="libraryImportDialog" :confirmFn="importQuestion"></LibraryImportDialog>
        <!--<LocalImportDialog ref="localImportDialog" confirmFn="addTesting(2, index)"></LocalImportDialog>-->
        <el-form label-width="120px" v-for="(item,index) in form.questions" :key="index">
            <hr>
            <el-form-item>
                <el-button icon="plus" @click='addTesting(0, index)' size="small">判断题</el-button>
                <el-button icon="plus" @click='addTesting(1, index)' size="small">单选题</el-button>
                <el-button icon="plus" @click='addTesting(2, index)' size="small">多选题</el-button>
                <el-button icon="plus" @click="$refs['localImportDialog'].open()" size="small">本地导入</el-button>
                <el-button icon="plus" @click='addTesting(2, index)' size="small">题库导入</el-button>
                <el-button icon="plus" @click='addTesting(2, index)' size="small">课程导入</el-button>
                <el-button icon="delete" type="danger" @click='deleteTesting(index, item)' size="small"></el-button>
            </el-form-item>
            <el-form-item :label="'第' + (index+1) + '题'">
                <span v-if="item.type == 0">判断题</span>
                <span v-else-if="item.type == 1">单选题</span>
                <span v-else>多选题</span>
            </el-form-item>
            <el-form-item label="题目">
                <el-input v-model="item.description" :disabled="!item.editable" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容">
                </el-input>
            </el-form-item>
            <el-form-item label="分数">
                <el-input placeholder="为该题设置分数" :disabled="!item.editable" v-model="item.score"></el-input>
            </el-form-item>
            <el-form-item label="配图">
                <UploadImg :defaultImg="item.image" :url="item.image" :disabled="!item.editable" :onSuccess="res => item.image = res.data.url"></UploadImg>
            </el-form-item>

            <el-form-item label="选项">
                <!--判断题的正确错误选项-->
                <div v-if="item.type == 0">
                    <el-radio class="radio" v-model="item.correct" :label="1">
                        <i>正确</i>
                    </el-radio>
                    <el-radio class="radio" v-model="item.correct" :label="0">
                        <i>错误</i>
                    </el-radio>
                </div>
                <!--单选的答案部分-->
                <div v-if="item.type == 1">
                    <h5>请在正确答案前面打勾</h5>
                    <div class="multy-choose-item" v-for="(option, index) in item.options" :key="index">
                        <el-radio v-model="item.correct" :label="index">&nbsp;</el-radio>
                        <el-input placeholder="填写描述" v-model="option.description" style="width: 460px;"></el-input>
                        <el-button type="text" @click="option.options.splice(index, 1)">
                            删除
                        </el-button>
                    </div>
                    <div class="multy-choose-item">
                        <el-button type="text" @click="addMoreTestingOption(item)">添加更多选项</el-button>
                    </div>
                </div>
                <!--多选的答案部分-->
                <div v-if="item.type == 2">
                    <h5>请在正确答案前面打勾</h5>
                    <div class="multy-choose-item" v-for="(option, index) in item.options" :key="index">
                        <el-checkbox v-model="option.correct" :true-label="1">&nbsp;</el-checkbox>
                        <el-input placeholder="填写描述" v-model="option.description" style="width: 430px;"></el-input>
                        <el-button type="text" @click="option.option.splice(index, 1)">
                            删除
                        </el-button>
                    </div>
                    <div class="multy-choose-item">
                        <el-button type="text" @click="addMoreTestingOption(item)">添加更多选项</el-button>
                    </div>
                </div>
            </el-form-item>

            <el-form-item label="答案详解">
                <el-input v-model="item.explain" :disabled="!item.editable" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容">
                </el-input>
            </el-form-item>
        </el-form>

        <el-form label-width="120px">
            <hr>
            <el-form-item label="">
                <el-button icon="plus" @click='addTesting(0)' size="small">判断题</el-button>
                <el-button icon="plus" @click='addTesting(1)' size="small">单选题</el-button>
                <el-button icon="plus" @click='addTesting(2)' size="small">多选题</el-button>
                <el-button icon="plus" @click="$refs['localImportDialog'].open()" size="small">本地导入</el-button>
                <el-button icon="plus" @click="$refs['libraryImportDialog'].open()" size="small">题库导入</el-button>
                <el-button icon="plus" @click='addTesting(2)' size="small">课程导入</el-button>
            </el-form-item>
        </el-form>

        <el-form-item>
            <el-button type="primary" @click="submitForm">发布试卷</el-button>
            <el-button>取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import CropperImg from '../../component/upload/ImagEcropperInput.vue'
    import UploadImg from '../../component/upload/UploadImg.vue'
    import LocalImportDialog from '../LocalImportDialog.vue'
    import LibraryImportDialog from './LibraryImportDialog.vue'
    import Question from '../../../models/quesion'
    import Option from '../../../models/option'

    export default{
        data () {
            return {
                form: {
                    name: '',
                    image: '',
                    number: '',
                    score: '',
                    long: '',
                    pass_score: '',
                    wait_resolve: '',
                    times: '',
                    award_score: '',
                    suit: '',
                    questions: []
                },
                rules: {
                    name: [
                        { required: true, message: '请输入试卷名称', trigger: 'blur' },
                    ],
                    image: [
                        { required: true, message: '请上传试卷封面', trigger: 'blur' },
                    ],
                    number: [
                        { required: true, message: '请输入题目数量', trigger: 'blur' },
                    ],
                    score: [
                        { required: true, message: '请输入题目数量', trigger: 'blur' },
                    ],
                    long: [
                        { required: true, message: '请输入题目数量', trigger: 'blur' },
                    ],
                    pass_score: [
                        { required: true, message: '请输入题目数量', trigger: 'blur' },
                    ],
                    wait_resolve: [
                        { required: true, message: '请输入题目数量', trigger: 'blur' },
                    ],
                    times: [
                        { required: true, message: '请输入题目数量', trigger: 'blur' },
                    ],
                    award_score: [
                        { required: true, message: '请输入题目数量', trigger: 'blur' },
                    ],
                    suit: [
                        { required: true, message: '请输入题目数量', trigger: 'blur' },
                    ],
                }
            }
        },
        activated () {
            xmview.setContentLoading(false)
        },
        methods: {
            addTesting(type, index) {
                if (index == undefined) {
                    index = this.form.questions.length
                }

                let question = new Question()
                question.type = type
                this.form.questions.splice(index, 1, question)
            },
            // 添加多选 单选的选项
            addMoreTestingOption(question) {
                let option = new Option()
                question.addOption(option)
            },
            deleteTesting(index, question) {
                this.form.questions.splice(index, 1)
            },
            submitForm() {
                this.$refs['form'].validate((pass) => {
                    if (pass) {
                        alert('submit!')
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            importQuestion(questions) {
                this.form.questions.push(...questions)
            }
        },
        components: {CropperImg, UploadImg, LocalImportDialog, LibraryImportDialog}
    }
</script>

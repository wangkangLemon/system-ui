<template>
    <div id="import-question">
        <el-form label-width="120px" v-for="(item,index) in questions" :key="index" :model="item" :rules="rules" ref="question">
            <hr>
            <el-form-item>
                <el-button icon="plus" @click='addTesting(0, index)' size="small">判断题</el-button>
                <el-button icon="plus" @click='addTesting(1, index)' size="small">单选题</el-button>
                <el-button icon="plus" @click='addTesting(2, index)' size="small">多选题</el-button>
                <el-button icon="plus" @click="$refs['localImportDialog'].open()" size="small">本地导入</el-button>
                <el-button icon="plus" @click="$refs['libraryImportDialog'].open()" size="small">题库导入</el-button>
                <!--<el-button icon="plus" @click='addTesting(2, index)' size="small">课程导入</el-button>-->
                <el-button icon="delete" type="danger" @click='deleteTesting(index, item)' size="small"></el-button>
            </el-form-item>
            <el-form-item :label="'第' + (index+1) + '题'">
                <span v-if="item.type == 0">判断题</span>
                <span v-else-if="item.type == 1">单选题</span>
                <span v-else>多选题</span>
            </el-form-item>
            <el-form-item label="题目" prop="description">
                <el-input v-model="item.description" :disabled="!item.editable" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容">
                </el-input>
            </el-form-item>
            <el-form-item label="分数" prop="score">
                <el-input v-model.number="item.score" :disabled="!item.editable" type="number" placeholder="请输入分数">
                </el-input>
            </el-form-item>
            <el-form-item label="配图" prop="image">
                <UploadImg :defaultImg="item.image" :url="uploadImageUrl" :disabled="!item.editable" :onSuccess="res => item.image = res.data.url"></UploadImg>
            </el-form-item>

            <el-form-item label="选项">
                <!--判断题的正确错误选项-->
                <div v-if="item.type == 0">
                    <el-radio class="radio" v-model="item.correct" :label="1" :disabled="!item.editable">
                        <i>正确</i>
                    </el-radio>
                    <el-radio class="radio" v-model="item.correct" :label="0" :disabled="!item.editable">
                        <i>错误</i>
                    </el-radio>
                </div>
                <!--单选的答案部分-->
                <div v-if="item.type == 1">
                    <h5>请在正确答案前面打勾</h5>
                    <div class="multy-choose-item" v-for="(option, index) in item.options" :key="index">
                        <el-radio v-model="item.correct" :label="index" :disabled="!item.editable">&nbsp;</el-radio>
                        <el-input placeholder="填写描述" v-model="option.description" style="width: 430px;" :disabled="!item.editable"></el-input>
                        <el-button type="text" @click="item.options.splice(index, 1)" :disabled="!item.editable">
                            删除
                        </el-button>
                    </div>
                    <div class="multy-choose-item">
                        <el-button type="text" @click="addMoreTestingOption(item)" :disabled="!item.editable">添加更多选项</el-button>
                    </div>
                </div>
                <!--多选的答案部分-->
                <div v-if="item.type == 2">
                    <h5>请在正确答案前面打勾</h5>
                    <div class="multy-choose-item" v-for="(option, index) in item.options" :key="index">
                        <el-checkbox v-model="option.correct" :true-label="1" :disabled="!item.editable">&nbsp;</el-checkbox>
                        <el-input placeholder="填写描述" v-model="option.description" style="width: 430px;" :disabled="!item.editable"></el-input>
                        <el-button type="text" @click="item.options.splice(index, 1)" :disabled="!item.editable">
                            删除
                        </el-button>
                    </div>
                    <div class="multy-choose-item">
                        <el-button type="text" @click="addMoreTestingOption(item)" :disabled="!item.editable">添加更多选项</el-button>
                    </div>
                </div>
            </el-form-item>

            <el-form-item label="答案详解" prop="explain">
                <el-input v-model="item.explain" :disabled="!item.editable" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容">
                </el-input>
            </el-form-item>
        </el-form>

        <LibraryImportDialog ref="libraryImportDialog" :confirmFn="libraryImportQuestion"></LibraryImportDialog>
        <LocalImportDialog
                :onSuccess="localImportQuestion"
                ref="localImportDialog"
                title="导入题库"
                :uploadUrl="uploadUrl"
                templateUrl="/upload/templates/import/subject.xlsx">
            <article slot="footer">
                <hr style="margin-bottom: 15px;">
                <h5>注意事项：</h5>
                <h5>1.模板中字段轻对照填写，不能为空</h5>
                <h5>2.如果有某些内容为空，导入时将跳过</h5>
            </article>
        </LocalImportDialog>
        <el-form label-width="120px">
            <hr>
            <el-form-item label="">
                <el-button icon="plus" @click='addTesting(0)' size="small">判断题</el-button>
                <el-button icon="plus" @click='addTesting(1)' size="small">单选题</el-button>
                <el-button icon="plus" @click='addTesting(2)' size="small">多选题</el-button>
                <el-button icon="plus" @click="$refs['localImportDialog'].open()" size="small">本地导入</el-button>
                <el-button icon="plus" @click="$refs['libraryImportDialog'].open()" size="small">题库导入</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import LibraryImportDialog from './LibraryImportDialog.vue'
    import LocalImportDialog from './LocalImportDialog.vue'
    import Question from '../../models/quesion'
    import Option from '../../models/option'
    import UploadImg from '../component/upload/UploadImg.vue'
    import config from '../../utils/config'

    export default {
        props: {
            questions: Array,
            scores: {
                type: Object,
                default() {
                    return {
                        single_score: 0,
                        multi_score: 0,
                        judge_score: 0,
                    }
                }
            }
        },
        data() {
            return {
                uploadUrl: `${config.apiHost}/exam/subject/excel`,
                uploadImageUrl: `${config.apiHost}/subject/image`,
                rules: {
                    description: [
                        { required: true, message: '请输入题目', trigger: 'blur' },
                    ],
                    score: [
                        { type: 'number', required: true, message: '请输入分数', trigger: 'blur' },
                    ],
                    explain: [
                        { required: true, message: '请输入答案详解', trigger: 'blur' },
                    ],
                }
            }
        },
        components: {LibraryImportDialog, LocalImportDialog, UploadImg},
        methods: {
            importQuestion(questions) {
                this.questions.push(...questions)
            },
            // 添加多选 单选的选项
            addMoreTestingOption(question) {
                let option = new Option()
                question.addOption(option)
            },
            deleteTesting(index) {
                this.questions.splice(index, 1)
            },
            addTesting(type, index) {
                if (index == undefined) {
                    index = this.questions.length
                }

                let question = new Question()
                question.type = type
                if (type === 0) {
                    question.score = this.scores.judge_score
                }
                if (type === 1) {
                    question.score = this.scores.single_score
                }
                if (type === 2) {
                    question.score = this.scores.multi_score
                }
                this.questions.splice(index, 1, question)
            },
            localImportQuestion(response) {
                return new Promise((resolve, reject) => {
                    if (response.errs) {
                        reject({
                            error: -1,
                            reasons: [
                                {message: response.errs[0]}
                            ]
                        })
                    } else {
                        let questions = []
                        response.data.forEach((item) => {
                            let question = new Question()
                            question.setModel(item)
                            questions.push(question)
                        })
                        this.importQuestion(questions)

                        resolve({
                            success: response.data.length,
                        })
                    }
                })
            },
            libraryImportQuestion(questions) {
                questions.forEach((question) => {
                    question.id = 0
                    question.options.forEach((option) => {
                        option.id = 0
                    })
                    this.importQuestion([question])
                })
            },
            validateQuestionForm() {
                let flag = true
                this.$refs['question'].forEach((form) => {
                    form.validate((pass) => {
                        if (!pass) flag = false
                        return false
                    })
                })

                return flag
            }
        }
    }
</script>

<template>
    <NestedDialog id="dialog-library-import" title="试题导入" :visible.sync="isOpen" @click.native.stop>
        <el-form :inline="true" :model="search" class="demo-form-inline">
            <el-form-item label="题库名称">
                <SelectScroll :requestCb="fetchLibrary" v-model="search.subject_group_id" :changeCb="changeLibrary"></SelectScroll>
            </el-form-item>
            <el-form-item label="题库类型">
                <el-select v-model="search.type" placeholder="题库类型">
                    <el-option label="判断题" value="0"></el-option>
                    <el-option label="单选题" value="1"></el-option>
                    <el-option label="多选题" value="2"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-row :gutter="10">
            <el-col :span="10">
                <el-table
                        :data="questionList.data"
                        :show-header="false"
                        height="400">
                    <el-table-column
                            width="84">
                        <template scope="scope">
                            <el-tag type="primary" v-if="scope.row.type == 0">判断题</el-tag>
                            <el-tag type="warning" v-if="scope.row.type == 2">多选题</el-tag>
                            <el-tag type="danger" v-if="scope.row.type == 3">单选题</el-tag>
                            <el-checkbox :label="scope.row.id" @change="choiceQuestion">&nbsp;</el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template scope="scope">
                            <p>{{ scope.row.description }}</p>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        style="text-align: right"
                        @size-change="fetchQuestion"
                        @current-change="fetchQuestion"
                        layout="prev, pager, next"
                        :current-page="search.page"
                        :page-size="search.page_size"
                        :page-sizes="[15, 30, 60, 100]"
                        :total="questionList.total">
                </el-pagination>
            </el-col>
            <el-col :span="14">
                <el-table
                        :data="choiceList"
                        :show-header="false"
                        height="400">
                    <el-table-column
                            width="84">
                        <template scope="scope">
                            <el-tag type="primary" v-if="scope.row.type == 0">判断题</el-tag>
                            <el-tag type="warning" v-if="scope.row.type == 2">多选题</el-tag>
                            <el-tag type="danger" v-if="scope.row.type == 3">单选题</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template scope="scope">
                            <p>{{ scope.row.description }}</p>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-button type="primary" @click="importQuestion">插入</el-button>
    </NestedDialog>
</template>
<script>
    import testLibraryService from '../../services/exam/libraryService'
    import testQuestionService from '../../services/exam/questionService'
    import SelectScroll from '../component/form/SelectScroll.vue'
    import Question from '../../models/quesion'
    import NestedDialog from '../component/dialog/NestedDialog.vue'

    export default {
        props: {
            confirmFn: Function
        },
        data() {
            return {
                isOpen: false,
                questionList: {
                    data: [],
                    total: 0,
                },
                choiceList: [],
                search: {
                    type: '',
                    subject_group_id: '',
                    page: 0,
                    page_size: 15,
                }
            }
        },
        methods: {
            open() {
                this.isOpen = true
            },
            close() {
                this.isOpen = false
            },
            importQuestion() {
                this.close()
                this.confirmFn(this.choiceList)
            },
            fetchLibrary(keyword, page) {
                return testLibraryService.search({keyword, page}).then((ret) => {
                    let result = {
                        data: [],
                        total: ret.total
                    }
                    if (ret.list == null) {
                        ret.list = []
                    }
                    ret.list.forEach((value) => {
                        result.data.push({
                            id: value.id,
                            name: value.name,
                        })
                    })
                    return result
                })
            },
            fetchQuestion() {
                return testQuestionService.search(this.search).then((ret) => {
                    this.questionList.total = ret.total
                    this.questionList.data = ret.list
                })
            },
            changeLibrary(id) {
                this.search.subject_group_id = id
                this.fetchQuestion()
            },
            choiceQuestion(val) {
                let question = new Question()
                question.findById(val.target.value)
                this.choiceList.push(question)
            },
        },
        components: {SelectScroll, NestedDialog}
    }
</script>

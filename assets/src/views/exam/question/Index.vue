<style lang='scss' rel='stylesheet/scss'>
    #question-content-container {
        .el-form-item{
            margin-bottom: 15px;
        }
        .multy-choose-item{
            padding: 5px 0;
        }
    }
</style>
<template>
    <div id="question-content-container">
        <section class="manage-container">
            <el-button type="warning" icon="plus" @click="openImportDialog()"><i>导入试题</i></el-button>
            <el-button type="primary" icon="plus" @click="openAddDialog()"><i>新增试题</i></el-button>
        </section>

        <el-form :inline="true" :model="fetchParam" class="search">
            <el-form-item label="所属题库">
                <el-input v-model="fetchParam.keyword" placeholder="课程名称" @keyup.enter.native="fetchData"></el-input>
            </el-form-item>
            <el-form-item label="试题标签">
                <el-select v-model="fetchParam.status" placeholder="未选择" @change="fetchData" :clearable="true">
                    <el-option label="单选题" value="0"></el-option>
                    <el-option label="多选题" value="1"></el-option>
                    <el-option label="判断题" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="试题类型">
                <el-select v-model="fetchParam.status" placeholder="未选择" @change="fetchData" :clearable="true">
                    <el-option label="单选题" value="0"></el-option>
                    <el-option label="多选题" value="1"></el-option>
                    <el-option label="判断题" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <DateRange title="创建时间" :start="fetchParam.time_start" :end="fetchParam.time_end"
                           @changeStart="val=> fetchParam.time_start=val"
                           @changeEnd="val=> fetchParam.time_end=val" :change="fetchData">
                </DateRange>
            </el-form-item>
        </el-form>

        <el-table class="data-table" v-loading="loadingData"
                  :data="data"
                  :fit="true"
                  @select="selectRow"
                  @select-all="selectRow"
                  border>
            <el-table-column type="selection"></el-table-column>
            <el-table-column
                    prop="name"
                    label="题库名称">
            </el-table-column>
            <el-table-column
                    width="80"
                    label="题目数">
                <template scope="scope">
                    <el-button style="width: 100%"
                               @click="$router.push({name: 'course-manage-addCourse', params: {courseInfo: scope.row, tab:'second'}})"
                               type="text" size="small">{{scope.row.subject_num}}  <!--a-->
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column
                    prop="create_time_name"
                    label="创建时间">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    width="207"
                    label="操作">
                <template scope="scope">
                    <el-button @click="preview(scope.$index, scope.row)" type="text" size="small">详情</el-button>
                    <el-button @click="edit(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="del(scope.$index, scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-row :gutter="20" class="utils-top-15">
            <el-col :span="6">
                <!--底部的批量删除和移动两个按钮-->
                <el-button :disabled='selectedIds.length < 1' @click="delMulti">批量删除</el-button>
            </el-col>
            <el-col :span="6" :offset="12">
                <el-pagination
                        style="text-align: right"
                        @size-change="fetchData"
                        @current-change="fetchData"
                        layout="sizes,total, prev, pager, next"
                        :current-page="fetchParam.page"
                        :page-size="fetchParam.page_size"
                        :page-sizes="[15, 30, 60, 100]"
                        :total="fetchParam.page_total">
                </el-pagination>
            </el-col>
        </el-row>

        <el-dialog :title="editDialog" :visible.sync="dialog.edit">
            <el-form v-model="model" label-width="80px">
                <el-form-item label="试题类型" prop="resource">
                    <el-radio-group v-model="model.type">
                        <el-radio :label="1">单选题</el-radio>
                        <el-radio :label="2">多选题</el-radio>
                        <el-radio :label="0">判断题</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="试题题目">
                    <el-input type="textarea" v-model="model.description" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="配图">
                    <UploadImg :defaultImg="model.image" :url="uploadImgUrl" :onSuccess="res => model.image = res.data.url"></UploadImg>
                </el-form-item>
                <el-form-item label="答案选项">
                    <!--判断题的正确错误选项-->
                    <div v-if="model.type == 0">
                        <el-radio class="radio" v-model="model.correct" :label="1">
                            <i>正确</i>
                        </el-radio>
                        <el-radio class="radio" v-model="model.correct" :label="0">
                            <i>错误</i>
                        </el-radio>
                    </div>
                    <!--单选的答案部分-->
                    <div v-if="model.type == 1">
                        <h5>请在正确答案前面打勾</h5>
                        <div class="multy-choose-item" v-for="(option, index) in model.option" :key="index">
                            <el-radio v-model="model.correct" :label="index">&nbsp;</el-radio>
                            <el-input placeholder="填写描述" v-model="option.description" style="width: 530px;"></el-input>
                            <el-button type="text" @click="model.option.splice(index, 1)">
                                删除
                            </el-button>
                        </div>
                        <div class="multy-choose-item">
                            <el-button type="text" @click="addMoreTestingOption(model.option)">添加更多选项</el-button>
                        </div>
                    </div>
                    <!--多选的答案部分-->
                    <div v-if="model.type == 2">
                        <h5>请在正确答案前面打勾</h5>
                        <div class="multy-choose-item" v-for="(option, index) in model.option" :key="index">
                            <el-checkbox v-model="option.correct" :true-label="1">&nbsp;</el-checkbox>
                            <el-input placeholder="填写描述" v-model="option.description" style="width: 530px;"></el-input>
                            <el-button type="text" @click="model.option.splice(index, 1)">
                                删除
                            </el-button>
                        </div>
                        <div class="multy-choose-item">
                            <el-button type="text" @click="addMoreTestingOption(model.option)">添加更多选项</el-button>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="答案详解">
                    <el-input v-model="model.explain" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容">
                    </el-input>
                </el-form-item>
                <el-form-item label="所属题库">
                    <SelectScroll :requestCb="fetchLibrary" v-model="model.group_id"></SelectScroll>
                </el-form-item>
                <el-form-item label="课程标签">
                    <Tags v-model="model.tags"></Tags>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm">确定</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="详情" :visible.sync="dialog.view">
            <div class="el-form-item">
                <label class="el-form-item__label" style="width: 100px;">题库名称：</label>
                <div class="el-form-item__content" style="margin-left: 100px;">
                    <div class="el-input">
                        {{model.name}}
                    </div>
                </div>
            </div>
            <div class="el-form-item">
                <label class="el-form-item__label" style="width: 100px;">题库简介：</label>
                <div class="el-form-item__content" style="margin-left: 100px;">
                    <div class="el-input">
                        {{model.description}}
                    </div>
                </div>
            </div>
            <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                <el-table-column
                        prop="date"
                        label="单选题">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="多选题">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="判断题">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="药我说">
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>

</template>

<script>
    import DateRange from '../../component/form/DateRangePicker.vue'
    import testQuestionService from '../../../services/testQuestionService'
    import testLibraryService from '../../../services/testLibraryService'
    import UploadImg from '../../component/upload/UploadImg.vue'
    import SelectScroll from '../../component/form/SelectScroll.vue'
    import Tags from '../../component/form/Tags.vue'

    export default{
        data () {
            return {
                dialog: {
                    edit: true,
                    view: false,
                    del: false,
                },
                loadingData: false,
                data: [],
                selectedIds: [],
                fetchParam: {
                    keyword: void '',
                    status: void 0,
                    time_start: void '',
                    time_end: void '',
                    page: 1,
                    page_size: 15,
                    page_total: 0,
                },
                model: {
                    id: 0,
                    description: '',
                    image: '',
                    type: 0,
                    correct: 0,
                    group_id: '',
                    option: []
                },
                editDialog: '新建题库'
            }
        },
        activated () {
            this.fetchData()
        },
        methods: {
            fetchData() {
//                this.loadingData = true
//                return testQuestionService.search(this.fetchParam).then((ret) => {
//                    this.data = ret.list
//                    this.total = ret.total
//                    this.loadingData = false
//                    xmview.setContentLoading(false)
//                })
            },
            delMulti() {

            },
            // 单行被选中
            selectRow(selection) {
                let ret = []
                selection.forEach((item) => {
                    ret.push(item.id)
                })
                this.selectedIds = ret
            },
            openAddDialog() {
                this.editDialog = '新建题库'
                this.dialog.edit = true
            },
            edit(index, row) {
                this.editDialog = '编辑题库'
                this.dialog.edit = true
                this.model = row
            },
            del(index, row) {
                this.$confirm('题库删除后，已加入题库的试题将处于无归属状态，您是否确定删除本题库？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return testQuestionService.delete(row.id).then((ret) => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.fetchData()
                    })
                })
            },
            preview(index, row) {
                this.dialog.view = true
                this.model = row
            },
            submitForm() {
                console.log(this.model)
            },
            openImportDialog() {

            },
            // 添加多选 单选的选项
            addMoreTestingOption() {
                this.model.option.push({
                    description: '',
                    correct: ''
                })
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
            }
        },
        components: {DateRange, UploadImg, SelectScroll, Tags}
    }
</script>

<template>
    <div id="paper-content-container">
        <section class="manage-container">
            <el-button type="primary" icon="plus" @click="$router.push({ name:'test-paper-add'})"><i>新增试卷</i></el-button>
        </section>

        <el-form :inline="true" :model="fetchParam" class="search">
            <el-form-item label="课程名称">
                <el-input v-model="fetchParam.keyword" placeholder="课程名称" @keyup.enter.native="fetchData"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="fetchParam.status" placeholder="未选择" @change="fetchData" :clearable="true">
                    <el-option label="正常" value="0"></el-option>
                    <el-option label="下线" value="1"></el-option>
                    <el-option label="视频转码中" value="2"></el-option>
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
                    min-width="200"
                    prop="name"
                    label="课程">
            </el-table-column>
            <el-table-column
                    min-width="200"
                    prop="cat_name"
                    label="所属栏目">
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
                    width="80"
                    prop="score"
                    label="总分数">
            </el-table-column>
            <el-table-column
                    width="80"
                    prop="limit_time_string"
                    label="限时">
            </el-table-column>
            <el-table-column
                    width="100"
                    label="状态">
                <template scope="scope">
                    <el-tag v-if="scope.row.status == 0" type="success">正常</el-tag>
                    <el-tag v-else-if="scope.row.status == 2" type="primary">转码中</el-tag>
                    <el-tag v-else>已下线</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    width="190"
                    prop="create_time_name"
                    label="创建时间">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    width="207"
                    label="操作">
                <template scope="scope">
                    <!--<el-button @click="preview(scope.$index, scope.row)" type="text" size="small">预览</el-button>-->
                    <el-button
                            @click="$router.push({name: 'course-manage-addCourse', params: {courseInfo: scope.row}, query: {id: scope.row.id}})"
                            type="text" size="small">编辑 <!--a-->
                    </el-button>
                    <el-button @click="offline(scope.$index, scope.row)" type="text" size="small">
                        <i>{{ scope.row.status == 1 ? '上线' : '下线' }}</i>
                    </el-button>
                    <el-button @click="del(scope.$index, scope.row)" type="text" size="small">删除</el-button>
                    <el-button v-if="scope.row.subject_num > 0"
                               @click="$router.push({name:'course-manage-course-answer-analysis', params:{id:scope.row.id}})"
                               type="text" size="small">答案分析 <!--ff-->
                    </el-button>
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
    </div>

</template>

<script>
    import DateRange from '../../component/form/DateRangePicker.vue'

    export default{
        data () {
            return {
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
                xmview.setContentLoading(false)
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
        },
        components: {DateRange}
    }
</script>

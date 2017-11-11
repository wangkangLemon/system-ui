<template>
    <div id="paper-content-container">
        <section class="manage-container">
            <el-button type="primary" icon="plus" @click="$router.push({ name:'test-paper-add'})"><i>新增试卷</i></el-button>
        </section>

        <el-form :inline="true" :model="fetchParam" class="search">
            <el-form-item label="试卷名称">
                <el-input v-model="fetchParam.keyword" placeholder="试卷名称" @keyup.enter.native="fetchData"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="fetchParam.status" @change="fetchData" :clearable="true">
                    <el-option label="正常" :value="0"></el-option>
                    <el-option label="下线" :value="1"></el-option>
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
            <el-table-column
                    type="selection"
                    :selectable="selectable"></el-table-column>
            <el-table-column
                    min-width="200"
                    prop="name"
                    label="试卷名称">
            </el-table-column>
            <el-table-column
                    width="80"
                    label="题目数"
                    prop="subject_total">
            </el-table-column>
            <el-table-column
                    width="80"
                    prop="score_total"
                    label="总分数">
            </el-table-column>
            <el-table-column
                    width="80"
                    prop="score_pass"
                    label="及格分数">
            </el-table-column>
            <el-table-column
                    width="100"
                    label="当前状态">
                <template scope="scope">
                    <el-tag v-if="scope.row.status == 0" type="success">正常</el-tag>
                    <el-tag v-else-if="scope.row.status == 1" type="danger">下线</el-tag>
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
                    <el-button
                            @click="$router.push({name: 'test-paper-edit', params: {exam_id: scope.row.id}})"
                            type="text"
                            size="small"
                            :disabled="scope.row.status == 0">
                        编辑
                    </el-button>
                    <el-button @click="online(scope.$index, scope.row)" type="text" size="small" v-if="scope.row.status == 1">
                        <i>上线</i>
                    </el-button>
                    <el-button @click="offline(scope.$index, scope.row)" type="text" size="small" v-if="scope.row.status == 0">
                        <i>下线</i>
                    </el-button>
                    <el-button @click="del(scope.$index, scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-row :gutter="20" class="utils-top-15">
            <el-col :span="6">
                <!--底部的批量删除和移动两个按钮-->
                <el-button type="danger" :disabled='selectedIds.length < 1' @click="delMulti">批量删除</el-button>
            </el-col>
            <el-col :span="12" :offset="6">
                <el-pagination
                        style="text-align: right"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
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
    import testPaperService from '../../../services/exam/pagerService'

    export default{
        data () {
            return {
                loadingData: false,
                data: [],
                selectedIds: [],
                fetchParam: {
                    keyword: void '',
                    status: '',
                    time_start: void '',
                    time_end: void '',
                    page: 1,
                    page_size: 15,
                    page_total: 0,
                },
                editDialog: '新建题库'
            }
        },
        activated () {
            this.fetchData()
        },
        methods: {
            fetchData() {
                xmview.setContentLoading(true)
                let data = Object.assign({}, this.fetchParam)
                if (data.status === '' || data.status === undefined) {
                    data.status = -1
                }
                testPaperService.search(data).then((ret) => {
                    this.data = ret.list
                    this.fetchParam.page_total = ret.total
                    this.selectedIds = []
                    xmview.setContentLoading(false)
                })
            },
            del(index, row) {
                this.$confirm('您是否确定删除试题？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return testPaperService.delete(row.id).then((ret) => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.fetchData()
                    })
                })
            },
            delMulti() {
                xmview.showDialog(`你将要删除选中的试卷，操作不可恢复确认吗?`, () => {
                    testPaperService.batchDelete(this.selectedIds).then(() => {
                        this.selectedIds = []
                        xmview.showTip('success', '操作成功')
                        setTimeout(() => {
                            this.fetchData() // 重新刷新数据
                        }, 300)
                    })
                })
            },
            // 单行被选中
            selectRow(selection) {
                let ret = []
                selection.forEach((item) => {
                    ret.push(item.id)
                })
                this.selectedIds = ret
            },
            online(index, row) {
                return testPaperService.online(row.id).then(() => {
                    row.status = 0
                    xmview.showTip('success', '操作成功')
                })
            },
            offline(index, row) {
                return testPaperService.offline(row.id).then(() => {
                    row.status = 1
                    xmview.showTip('success', '操作成功')
                })
            },
            handleSizeChange (val) {
                this.fetchParam.page_size = val
                this.fetchData()
            },
            handleCurrentChange (val) {
                if (this.fetchParam.page != val) {
                    this.fetchParam.page = val
                    this.fetchData()
                }
            },
            selectable (row, index) {
                return row.status === 1
            }
        },
        components: {DateRange}
    }
</script>

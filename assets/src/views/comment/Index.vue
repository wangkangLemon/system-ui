<style lang='scss' rel='stylesheet/scss'>
    @import "../../utils/mixins/common";
    @import "../../utils/mixins/showDetail";

    #test-comment-container {
        @extend %content-container;
        border: none;
        .manage-container {
            @extend %right-top-btnContainer;
            > * {
                color: #fff;
                border-radius: 5px;
            }
        }
    }
</style>
<template>
    <section id="test-comment-container">
        <div id="comment-content-container">
            <el-form :inline="true" :model="fetchParam" class="search">
                <el-form-item label="课程名称">
                    <el-input v-model="fetchParam.course_name" placeholder="请输入课程名称" @keyup.enter.native="fetchData"></el-input>
                </el-form-item>
                <el-form-item label="用户名称">
                    <el-input v-model="fetchParam.user_name" placeholder="请输入用户名称" @keyup.enter.native="fetchData"></el-input>
                </el-form-item>
                <el-form-item label="课程类型">
                    <el-select v-model="fetchParam.course_type" @change="fetchData" :clearable="true">
                        <el-option label="公共课" value="public"></el-option>
                        <el-option label="私有课" value="private"></el-option>
                        <el-option label="工业课" value="industry"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="当前状态">
                    <el-select v-model="fetchParam.status" @change="fetchData" :clearable="true">
                        <el-option label="待审核" :value="0"></el-option>
                        <el-option label="驳回" :value="1"></el-option>
                        <el-option label="通过" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <DateRange title="发表时间" :start="fetchParam.time_start" :end="fetchParam.time_end"
                               @changeStart="val=> {fetchParam.time_start=val}"
                               @changeEnd="val=> {fetchParam.time_end=val}" :change="fetchData">
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
                        min-width="100"
                        prop="course_name"
                        label="课程名称">
                </el-table-column>
                <el-table-column
                        min-width="100"
                        prop="score"
                        label="课程评分">
                </el-table-column>
                <el-table-column
                        width="150"
                        label="课程评论"
                        prop="content">
                </el-table-column>
                <el-table-column
                        width="100"
                        prop="user_name"
                        label="用户名称">
                        <template scope="scope">
                            <el-button @click="showUserInfo(scope.row.user_id)" type="text" size="small">{{scope.row.user_name }}</el-button>
                        </template>
                </el-table-column>
                <el-table-column
                        width="90"
                        prop="courseType"
                        label="课程类型">
                    <template scope="scope">
                        <el-tag v-if="scope.row.course_type == 'public'" type="success">公共课</el-tag>
                        <el-tag v-else-if="scope.row.course_type == 'private'" type="danger">私有课</el-tag>
                        <el-tag v-else-if="scope.row.course_type == 'industry'" type="danger">工业课</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        width="190"
                        prop="company_name"
                        label="课程归属">
                </el-table-column>
                <el-table-column
                        width="170"
                        prop="create_time"
                        label="评论发表时间">
                </el-table-column>
                <el-table-column
                        width="90"
                        label="当前状态">
                    <template scope="scope">
                        <el-tag v-if="scope.row.status === 0" type="primary">待审核</el-tag>
                        <el-tag v-if="scope.row.status === 1" type="danger">驳回</el-tag>
                        <el-tag v-if="scope.row.status === 2" type="success">通过</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    width="150"
                    label="操作"
                    align="center">
                    <template scope="scope">
                        <el-button @click="del(scope.$index, scope.row)" type="text" size="small"
                                   :disabled="scope.row.can_edit == 1 && scope.row.status == 1">驳回</el-button>
                        <el-button @click="recovery(scope.$index, scope.row)" type="text" size="small"
                                   :disabled="scope.row.can_edit == 1 && scope.row.status == 2">通过</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-row :gutter="20" class="utils-top-15">
                <el-col :span="12" :offset="12">
                    <el-pagination
                        style="text-align: right"
                        @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                        @current-change="val=> {fetchParam.page=val; fetchData()}"
                        :current-page="fetchParam.page"
                        :page-size="fetchParam.page_size"
                        :page-sizes="[15, 30, 60, 100]"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="fetchParam.page_total">
                    </el-pagination>
                </el-col>
            </el-row>
        </div>
    </section>
</template>

<script>
    import DateRange from '../component/form/DateRangePicker.vue'
    import testCommentService from '../../services/comment/testCommentService'
    import companyUserService from '../../services/companyUserService'
    export default{
        data () {
            return {
                loadingData: false,
                data: [],
                showDetail: false,
                fetchParam: this.newFetchParam(),
                details: this.clearFn(),
            }
        },
        activated () {
        },
        created () {
            this.fetchData()
        },
        filters: {
        },
        methods: {
            initFetchParam () {
                this.fetchParam = this.newFetchParam()
                this.fetchData()
            },
            fetchData () {
                xmview.setContentLoading(true)
                // let fetchParam = this.fetchParam
                let data = Object.assign({}, this.fetchParam)
                data.status = (!data.status && data.status !== 0) ? -1 : data.status
                testCommentService.search(data).then((ret) => {
                    console.log(ret)
                    this.data = ret.data
                    this.fetchParam.page_total = ret.total
                    xmview.setContentLoading(false)
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
            // 单行被选中
            selectRow (selection) {
                let ret = []
                selection.forEach((item) => {
                    ret.push(item.id)
                })
                this.selectedIds = ret
            },
            del (index, row) {
                this.$confirm('您是否确定驳回此评论？', '驳回', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return testCommentService.updateCommentStatus(row.id, 1).then((ret) => {
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        })
                        this.fetchData()
                    })
                })
            },
            recovery (index, row) {
                this.$confirm('通过后该评论将在评论区中显示，您是否确定通过该评论？', '通过', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return testCommentService.updateCommentStatus(row.id, 2).then((ret) => {
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        })
                        this.fetchData()
                    })
                })
            },
            newFetchParam () {
                return {
                    course_name: '',
                    course_type: '',
                    user_name: '',
                    status: '',
                    time_start: void '',
                    time_end: void '',
                    page: 1,
                    page_size: 15,
                    page_total: 0,
                }
            },
            // 用户信息
            showUserInfo (id) {
                this.showDetail = true
                companyUserService.userDetail(id).then((ret) => {
                    this.details = ret.data
                })
            },
            clearFn () {
                return {
                    avatar: '',
                    name: '',
                    department_id: '',
                    dep_name: '',
                    sex: '',
                    job: '',
                    birthday: '',
                    join_time: '',
                    mobile: '',
                    passwd: '',
                    address: '',
                    last_login_time_name: '',
                    last_active_time_name: ''
                }
            }
        },
        components: {
            DateRange,
        }
    }
</script>

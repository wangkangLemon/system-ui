<!--公开课管理-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";

    #course-manage-public-container {
        @extend %content-container;

        .manage-container {
            position: absolute;
            right: 0;
            top: -50px;
            > * {
                color: #fff;
                border-radius: 5px;
            }

            // 添加课程
            .add {
                background: rgb(0, 204, 255);
            }

            // 管理栏目
            .catmange {
                background: rgb(153, 102, 204);
            }
        }

        .search {
            @extend %top-search-container;
        }

        // 底部的管理按钮
        .bottom-manage {
            margin-top: 15px;
        }
    }
</style>

<template>
    <article id="course-manage-public-container">
        <section class="manage-container">
            <el-button type="primary" icon="plus" @click="$router.push({ name:'course-manage-addCourse'})">添加课程
            </el-button>
            <el-button type="warning" icon="menu">管理栏目 </el-button>
            <el-button type="success" icon="menu">专辑管理 </el-button>
        </section>

        <article class="search">
            <h1 style="color:red">部分查询选项接口未完成</h1>

            <section>
                <i>课程名称</i>
                <vInput :enter="fetchData" v-model="fetchParam.keyword"></vInput>
            </section>

            <section>
                <i>状态</i>
                <el-select v-model="fetchParam.status" placeholder="未选择"
                           @change="fetchData" :clearable="true">
                    <el-option label="正常" value="0"></el-option>
                    <el-option label="下线" value="1"></el-option>
                    <el-option label="视频转码中" value="2"></el-option>
                </el-select>
            </section>

            <DateRange title="创建时间" :start="fetchParam.time_start" :end="fetchParam.time_end"
                       @changeStart="val=> fetchParam.time_start=val "
                       @changeEnd="val=> fetchParam.time_end=val" :change="fetchData">
            </DateRange>
        </article>

        <el-table class="data-table" v-loading="loadingData"
                  :data="data"
                  :fit="true"
                  @select="selectRow"
                  @select-all="selectRow"
                  border>
            <el-table-column type="selection"></el-table-column>
            <el-table-column
                    prop="name"
                    label="课程">
            </el-table-column>
            <el-table-column
                    width="200"
                    prop="cat_name"
                    label="所属栏目">
            </el-table-column>
            <el-table-column
                    prop="subject_num"
                    width="80"
                    label="题目数">
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
                    width="180"
                    label="操作">
                <template scope="scope">
                    <el-button @click="preview(scope.$index, scope.row)" type="text" size="small">预览</el-button>
                    <el-button @click="edit(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="offline(scope.$index, scope.row)" type="text" size="small">下线</el-button>
                    <el-button @click="del(scope.$index, scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination class="pagin"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="fetchParam.page"
                       :page-size="fetchParam.page_size"
                       :page-sizes="[15, 30, 60, 100]"
                       layout="sizes,total, prev, pager, next"
                       :total="total">
        </el-pagination>

        <div class="bottom-manage">
            <el-button :disabled='selectedIds.length < 1' @click="moveToCat">移动到</el-button>
            <el-button :disabled='selectedIds.length < 1' @click="delMulti">批量删除</el-button>
        </div>

        <el-dialog title="操作提示" v-model="dialogVisible" size="tiny">
            <span v-html="dialogTitle"></span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </article>
</template>

<script>
    import courseService from '../../../services/courseService'
    import DateRange from '../../component/form/DateRangePicker.vue'
    import vInput from '../../component/form/Input.vue'

    export default{
        data () {
            return {
                loadingData: false,
                data: [], // 表格数据
                total: 0,
                dialogVisible: false,
                dialogType: 1, // 1-删除 2-批量删除
                dialogTitle: null,
                selectedIds: [], // 被选中的数据id集合
                fetchParam: {
                    status: void 0, // 2- 视屏转码中 1-下线 0-正常
                    category: void 0, // 1-工业 默认-公开课
                    course_id: void 0,
                    company_id: void 0,
                    page: 1,
                    page_size: 15,
                    time_start: void 0,
                    time_end: void 0,
                    keyword: void 0, // 搜索关键词
                }
            }
        },
        activated () {
            this.fetchData()
        },
        methods: {
            handleCurrentChange (val) {
                this.fetchParam.page = val
                this.fetchData()
            },
            handleSizeChange (val) {
                this.fetchParam.page_size = val
                this.fetchData()
            },
            fetchData () {
                this.loadingData = true
                return courseService.getCourseList(this.fetchParam).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loadingData = false
                    xmview.setContentLoading(false)
                })
            },
            // 单行被选中
            selectRow (selection) {
                let ret = []
                selection.forEach((item) => {
                    ret.push(item.id)
                })
                this.selectedIds = ret
            },
            // 预览
            preview () {
            },
            // 编辑
            edit () {
            },
            // 下线
            offline (index, row) {
                this.showDialog('你将要下线课程 <span style="color:red">' + row.name + '</span> 操作不可恢复确认吗?')
                this.dialogConfirm = () => {
                    alert('test')
                }
            },
            // 单条删除
            del (index, row) {
                this.showDialog('你将要删除课程 <span style="color:red">' + row.name + '</span> 操作不可恢复确认吗?')
            },
            // 移动到
            moveToCat () {
            },
            // 批量删除
            delMulti () {
                this.showDialog('你将要删除选中的课程，操作不可恢复确认吗?')
            },
            // dialog 确认按钮
            dialogConfirm () {
                this.dialogVisible = false
            },
            showDialog (title) {
                this.dialogTitle = title
                this.dialogVisible = true
            }
        },
        components: {vInput, DateRange}
    }
</script>

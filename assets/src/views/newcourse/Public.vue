<!--课程列表-->
<style lang='scss' rel='stylesheet/scss'>
@import "../../../utils/mixins/common";
@import "../../../utils/mixins/topSearch";

#newcourse-course-public-container {
    @extend %content-container;

    .manage-container {
        @extend %right-top-btnContainer;
        >* {
            color: #fff;
            border-radius: 5px;
        } // 添加课程
        .add {
            background: rgb(0, 204, 255);
        } // 管理栏目
        .catmange {
            background: rgb(153, 102, 204);
        }
    }

    .search {
        @extend %top-search-container;
    } // 底部的管理按钮
    .bottom-manage {
        margin-top: 15px;
    }

    .el-dialog__wrapper {
        padding-top: 15px;
        background: rgba(0, 0, 0, .5);
        z-index: 1000;
    }
}
</style>

<template>
    <article id="newcourse-course-public-container">
        <section class="manage-container">
            <el-button type="primary" icon="plus" @click="$router.push({ name:'course-manage-addCourse'})">
                <i>添加课程</i>
            </el-button>
            <el-button type="warning" icon="menu" @click="$router.push({name:'course-manage-course-category-manage'})">
                <i>管理栏目</i>
            </el-button>
            <el-button type="success" icon="menu" @click="$router.push({name:'course-manage-course-album-manage'})">
                <i>专辑管理</i>
            </el-button>
        </section>

        <el-tabs v-model="activeTab" @tab-click="handleTab">
            <el-tab-pane label="单节课程" name="course"></el-tab-pane>
            <el-tab-pane label="系列课程" name="newcourse"></el-tab-pane>
        </el-tabs>

        <article class="search">
            <section>
                <i>课程名称</i>
                <el-input v-model="fetchParam.keyword" @keyup.enter.native="fetchData"></el-input>
            </section>

            <section>
                <i>状态</i>
                <el-select v-model="fetchParam.status" placeholder="未选择" @change="fetchData" :clearable="true">
                    <el-option label="正常" value="0"></el-option>
                    <el-option label="下线" value="1"></el-option>
                    <el-option label="视频转码中" value="2"></el-option>
                </el-select>
            </section>

            <section>
                <i>栏目</i>
                <CourseCategorySelect :onchange="fetchData" v-model="fetchParam.category_id"></CourseCategorySelect>
            </section>

            <DateRange title="创建时间" :start="fetchParam.time_start" :end="fetchParam.time_end" @changeStart="val=> fetchParam.time_start=val " @changeEnd="val=> fetchParam.time_end=val" :change="fetchData">
            </DateRange>

        </article>

        <el-table class="data-table" v-loading="loadingData" :data="data" :fit="true" @select="selectRow" @select-all="selectRow" border>
            <el-table-column type="selection"></el-table-column>
            <el-table-column min-width="200" prop="name" label="课程">
            </el-table-column>
            <el-table-column min-width="200" prop="cat_name" label="所属栏目">
            </el-table-column>
            <el-table-column width="80" label="课时">
                <template scope="scope">
                    {{ scope.row.lesson_count}}课时
                </template>
            </el-table-column>
            <el-table-column width="100" label="状态">
                <template scope="scope">
                    <el-tag v-if="scope.row.status == 0" type="success">正常</el-tag>
                    <el-tag v-else-if="scope.row.status == 2" type="primary">转码中</el-tag>
                    <el-tag v-else>已下线</el-tag>
                </template>
            </el-table-column>
            <el-table-column width="190" prop="create_time_name" label="创建时间">
            </el-table-column>
            <el-table-column fixed="right" width="207" label="操作">
                <template scope="scope">
                    <!--<el-button @click="preview(scope.$index, scope.row)" type="text" size="small">预览</el-button>-->
                    <el-button @click="$router.push({name: 'course-manage-addCourse', params: {courseInfo: scope.row}, query: {id: scope.row.id}})" type="text" size="small">编辑
                        <!--a-->
                    </el-button>
                    <el-button @click="offline(scope.$index, scope.row)" type="text" size="small">
                        <i>{{ scope.row.status == 1 ? '上线' : '下线' }}</i>
                    </el-button>
                    <el-button @click="del(scope.$index, scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination class="pagin" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="fetchParam.page" :page-size="fetchParam.page_size" :page-sizes="[15, 30, 60, 100]" layout="sizes,total, prev, pager, next" :total="total">
        </el-pagination>

        <!--底部的批量删除和移动两个按钮-->
        <div class="bottom-manage">
            <el-button :disabled='selectedIds.length < 1' @click="dialogTree.isShow = true">移动到</el-button>
            <el-button :disabled='selectedIds.length < 1' @click="delMulti">批量删除</el-button>
        </div>

        <!--移动子栏目的弹出框-->
        <div class="el-dialog__wrapper" v-show="dialogTree.isShow">
            <article class="el-dialog el-dialog--tiny">
                <section class="el-dialog__header">
                    <i>移动课程到</i>
                </section>
                <section class="el-dialog__body">
                    <CourseCategoryTree node-key="id" :onNodeClick="(data) => dialogTree.selectedId=data.value"></CourseCategoryTree>
                </section>

                <section class="el-dialog__footer">
                    <span class="dialog-footer">
                        <el-button @click="dialogTree.isShow = false">取 消</el-button>
                        <el-button type="primary" @click="moveToCat">确 定</el-button>
                    </span>
                </section>
            </article>
        </div>
    </article>
</template>

<script>
import courseService from '../../../services/courseService'
import DateRange from '../../component/form/DateRangePicker.vue'
import CourseCategorySelect from '../../component/select/CourseCategory.vue'
import CourseCategoryTree from '../../component/tree/CourseCategory.vue'

function getFetchParam() {
    return {
        status: void 0, // 2- 视屏转码中 1-下线 0-正常
        category: void 0, // 1-工业 默认-公开课
        category_id: void 0, // 栏目id
        page: 1,
        page_size: 15,
        time_start: void 0,
        time_end: void 0,
        need_testing: void 0, //  不赋值则表示全部，0为不需要，1为需要
        keyword: void 0,
    }
}
export default {
    data() {
        return {
            activeTab: 'newcourse',
            loadingData: false,
            data: [], // 表格数据
            total: 0,
            dialogVisible: false,
            selectedIds: [], // 被选中的数据id集合
            fetchParam: getFetchParam(),
            dialogTree: {
                isShow: false,
                selectedId: void 0,
            }
        }
    },
    created() {
        //            this.fetchData()
    },
    activated() {
        this.fetchData()
    },
    methods: {
        initFetchParam() {
            this.fetchParam = getFetchParam()
        },
        handleCurrentChange(val) {
            this.fetchParam.page = val
            this.fetchData()
        },
        handleSizeChange(val) {
            this.fetchParam.page_size = val
            this.fetchData()
        },
        fetchData(val) {
            this.loadingData = true
            return courseService.getPublicCourselist(this.fetchParam).then((ret) => {
                this.data = ret.data
                this.total = ret.total
                this.loadingData = false
                xmview.setContentLoading(false)
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
        // 下线 或者上线课程 0为下线，1为上线
        offline(index, row) {
            let txt = row.status == 0 ? '下线' : '上线'
            let finalStatus = row.status == 0 ? 1 : 0
            xmview.showDialog(`你将要${txt}课程 <span style="color:red">${row.name}</span> 确认吗?`, () => {
                courseService.offlineCourse({ course_id: row.id, disabled: finalStatus }).then((ret) => {
                    row.status = finalStatus
                })
            })
        },
        // 单条删除
        del(index, row) {
            xmview.showDialog(`你将要删除课程 <span style="color:red">${row.name}</span> 操作不可恢复确认吗?`, () => {
                courseService.deleteCourse({ course_id: row.id }).then(() => {
                    xmview.showTip('success', '操作成功')
                    this.data.splice(index, 1)
                })
            })
        },
        moveToCat() {
            courseService.moveCourseToCategoryMulty({
                id: this.selectedIds.join(','),
                catid: this.dialogTree.selectedId
            }).then(() => {
                xmview.showTip('success', '操作成功')
                this.dialogTree.isShow = false
                setTimeout(() => {
                    this.fetchData() // 重新刷新数据
                }, 300)
            })
        },
        // 批量删除
        delMulti() {
            xmview.showDialog(`你将要删除选中的课程，操作不可恢复确认吗?`, () => {
                courseService.deleteCourseMulty({ id: this.selectedIds.join(',') }).then(() => {
                    xmview.showTip('success', '操作成功')
                    this.dialogTree.isShow = false
                    setTimeout(() => {
                        this.fetchData() // 重新刷新数据
                    }, 300)
                })
            })
        },
        handleTab(val) {
            if (val.name == 'newcourse') {
                this.$router.push({ name: 'newcourse-course-index' })
            }
        }
    },
    components: { DateRange, CourseCategorySelect, CourseCategoryTree }
}
</script>

<!--专辑管理-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/topSearch";

    #course-manage--albummanage {
        @extend %content-container;
        .manage-container {
            @extend %right-top-btnContainer;
        }

        .search {
            @extend %top-search-container;
        }

        // 底部的管理按钮
        .bottom-manage {
            margin-top: 15px;
            display: inline-block;
        }

        .dialog-container {
            section {
                .el-input {
                    width: 80%;
                    margin: 0 0 10px 15px;
                }
            }

            .dialog-add-item {
                width: 47%;
                display: inline-block;
                vertical-align: top;

                &:first-of-type {
                    margin-right: 4%;
                }

                h5 {
                    font-size: 16px;
                    margin-bottom: 10px;
                    color: #666;
                }

                .dialogadd-notselect-row {
                    &:last-of-type {
                        td:first-of-type {
                            div {
                                display: none;
                            }
                        }
                    }
                }
            }
        }

        .el-dialog {
            top: 15px !important;
        }
    }
</style>

<template>
    <article id="course-manage--albummanage">
        <section class="manage-container">
            <el-button type="primary" icon="plus" @click="add">
                <i>新建专辑</i>
            </el-button>
        </section>

        <article class="search">
            <section>
                <i>专辑名称</i>
                <el-input v-model="fetchParam.keyword" @keyup.enter.native="fetchData"></el-input>
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
                    label="专辑名称">
            </el-table-column>
            <el-table-column
                    width="190"
                    prop="create_time_name"
                    label="创建时间">
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="course_count"
                    label="课程数量">
            </el-table-column>
            <el-table-column
                    width="200"
                    label="操作">
                <template scope="scope">
                    <!--<el-button @click="preview(scope.$index, scope.row)" type="text" size="small">预览</el-button>-->
                    <el-button @click="edit(scope.$index, scope.row)" type="text" size="small">修改</el-button>
                    <el-button @click="del(scope.$index, scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--底部的批量删除和移动两个按钮-->
        <div class="bottom-manage">
            <el-button type="danger" :disabled='selectedIds.length < 1' @click="delMulti">批量删除</el-button>
        </div>

        <el-pagination class="pagin"
                       @size-change="val => fetchParam.page_size = val "
                       @current-change="val => fetchParam.page = val"
                       :current-page="fetchParam.page"
                       :page-size="fetchParam.page_size"
                       :page-sizes="[15, 30, 60, 100]"
                       layout="sizes,total, prev, pager, next"
                       :total="total">
        </el-pagination>


        <el-dialog :title="dialogAdd.title" v-model="dialogAdd.isShow" class="dialog-container"
                   v-loading="dialogAdd.loadingData">
            <section>
                <i>专辑名称</i>
                <el-input v-model="dialogAdd.name" style="vertical-align: middle"></el-input>
            </section>
            <div class="dialog-add-item">
                <h5>未选择
                    <el-input placeholder="搜索" v-model="dialogAdd.keyword" style="width: 80%; vertical-align: middle"
                              @keyup.enter.native="fetchData4dialogCourse(true)"></el-input>
                </h5>
                <el-table :data="dialogAdd.data" :show-header="false" :height="500" :fit="true"
                          v-loading="dialogAdd.loading"
                          row-class-name="dialogadd-notselect-row"
                          @select="selectRow4Course" @select-all="selectRow4Course">
                    <el-table-column type="selection" :selectable="(row) =>  row.id != -1">
                    </el-table-column>
                    <el-table-column label="课程名">
                        <template scope="scope">
                            <i v-if="scope.row.id != -1">{{scope.row.name}}</i>
                            <el-button @click="dialogAdd.page++" class="dialog-getmore-btn" type="text"
                                       v-else :disabled="dialogAdd.data.length - 1 >= dialogAdd.total">
                                <i>{{dialogAdd.data.length - 1 >= dialogAdd.total ? '已无更多' : '点击加载更多'}}</i>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="dialog-add-item">
                <h5>已选择</h5>
                <el-table :show-header="false" :data="dialogAdd.data4Selected" :height="500" :fit="true"
                          v-loading="dialogAdd.loading">
                    <el-table-column prop="name" label="课程名"></el-table-column>
                    <el-table-column
                            width="50"
                            label="">
                        <template scope="scope">
                            <el-button type="text" @click="deleteCourseAlbum(scope.$index, scope.row)" icon="delete"
                                       size="small">
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogAdd.isShow = false">取 消</el-button>
                <el-button type="primary" @click="dialogAdd.confirmFn">确 定</el-button>
              </span>
        </el-dialog>
    </article>
</template>

<script>
    import courseService from '../../../services/courseService'
    import DateRange from '../../component/form/DateRangePicker.vue'
    export default{
        data () {
            return {
                data: [],
                total: 0,
                loadingData: false,
                selectedIds: [],
                fetchParam: {
                    page: 1,
                    page_size: 15,
                    keyword: void 0,
                    time_start: void 0,
                    time_end: void 0
                },
                dialogAdd: {
                    title: '',
                    isShow: false,
                    total: 0,
                    data: [],
                    page: 1,
                    page_size: 15,
                    keyword: void 0,
                    loading: false,
                    data4Selected: [],
                    confirmFn: {},
                    name: '',
                    loadingData: false
                }
            }
        },
        watch: {
            'fetchParam.page_size'() {
                this.fetchData()
            },
            'fetchParam.page'() {
                this.fetchData()
            },
            'dialogAdd.page' (val) {
                val != 1 && this.fetchData4dialogCourse()
            }
        },
        activated () {
            this.fetchData()
            xmview.setContentLoading(false)
        },
        methods: {
            fetchData () {
                this.loadingData = true
                courseService.getAlbumList(this.fetchParam).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loadingData = false
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
            // 单挑删除
            del (index, row) {
                xmview.showDialog(`你将要删除专辑 <i style="color:red">${row.name}</i> 操作不可恢复确认吗?`, () => {
                    this.loadingData = true
                    courseService.deleteAlbum({id: row.id}).then((ret) => {
                        this.data.splice(index, 1)
                        xmview.showTip('success', '操作成功!')
                        this.loadingData = false
                    }).catch(() => {
                        this.loadingData = false
                    })
                })
            },
            // 批量删除
            delMulti () {
                xmview.showDialog(`你将要删除选中专辑 操作不可恢复确认吗?`, () => {
                    this.loadingData = true
                    courseService.deleteAlbumMulty({ids: this.selectedIds}).then(() => {
                        this.fetchData()
                    }).catch(() => {
                        this.loadingData = false
                    })
                })
            },
            edit(index, row) {
                this.dialogAdd.isShow = true
                this.dialogAdd.name = row.name
                this.dialogAdd.title = `${row.name} 专辑编辑`
                this.fetchData4dialogCourse(true)
                courseService.getPublicCourselist({albumid: row.id}).then((ret) => {
                    this.dialogAdd.data4Selected = ret.data
                })

                // 修改按钮按下回调
                this.dialogAdd.confirmFn = () => {
                    this.dialogAdd.loadingData = true
                    let course_id = []
                    this.dialogAdd.data4Selected.forEach((item) => {
                        course_id.push(item.id)
                    })
                    courseService.editAlbum({name: this.dialogAdd.name, course_id}).then(() => {
                        this.dialogAdd.loadingData = false
                        this.dialogAdd.isShow = false
                        xmview.showTip('success', '操作成功')
                        this.fetchData()
                    })
                }
            },
            // 添加专辑
            add () {
                this.dialogAdd.isShow = true
                this.dialogAdd.name = ''
                this.dialogAdd.title = `新建专辑编辑`
                this.dialogAdd.data4Selected = []
                this.fetchData4dialogCourse(true)
                // 添加按钮按下回调
                this.dialogAdd.confirmFn = () => {
                    this.dialogAdd.loadingData = true
                    let course_id = []
                    this.dialogAdd.data4Selected.forEach((item) => {
                        course_id.push(item.id)
                    })
                    courseService.addAlbum({name: this.dialogAdd.name, course_id}).then(() => {
                        this.dialogAdd.loadingData = false
                        this.dialogAdd.isShow = false
                        xmview.showTip('success', '操作成功')
                        this.fetchData()
                    })
                }
            },
            // 获取不属于任何专辑的课程
            fetchData4dialogCourse (isFirst) {
                if (isFirst)
                    this.dialogAdd.page = 1
                this.dialogAdd.loading = true
                courseService.getPublicCourselist({
                    album_id: 0,
                    page: this.dialogAdd.page,
                    page_size: this.dialogAdd.page_size,
                    keyword: this.dialogAdd.keyword
                }).then((ret) => {
                    if (isFirst)
                        this.dialogAdd.data = []
                    this.dialogAdd.data.splice(-1, 1)
                    this.dialogAdd.data.push(...[...ret.data, {id: -1}])
                    this.dialogAdd.total = ret.total
                    this.dialogAdd.loading = false
                }).catch(() => {
                    this.dialogAdd.loading = false
                })
            },
            // 选中课程
            selectRow4Course (selection, row) {
                for (let i = 0; i < this.dialogAdd.data4Selected.length; i++) {
                    if (this.dialogAdd.data4Selected[i].id == row.id) {
                        this.dialogAdd.data4Selected.splice(i, 1)
                        return
                    }
                }
                this.dialogAdd.data4Selected.push(row)
            },
            deleteCourseAlbum (index, row) {
                this.dialogAdd.data4Selected.splice(index, 1)
            }
        },
        components: {DateRange}
    }
</script>

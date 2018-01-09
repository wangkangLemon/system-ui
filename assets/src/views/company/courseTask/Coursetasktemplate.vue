<!--课程任务模板-->
<style lang='scss' rel="stylesheet/scss">
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/topSearch";
    @import "../../../utils/mixins/common";

    .course-task-template-index {
        @extend %content-container;
        .search {
            @extend %top-search-container;
        }

        .manage-container {
            @extend %right-top-btnContainer;
        }

        .block {
            text-align: right;
            margin-top: 10px;
        }

        .edui-editor {
            width: 100% !important;
        }

        .avatar-uploader {
            .el-upload {
                border: 1px dashed #d9d9d9;
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
                &:hover {
                    border-color: #20a0ff;
                }
            }
        }

        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
        }

        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .img-wrap {
            margin-bottom: 10px;
            width: 150px !important;
            height: 150px !important;
            img {
                width: 100%;
                height: 100%;
            }
        }

        .add {
            background: #ededed;
            padding: px2rem(10) px2rem(20);
            border-bottom: 1px solid #ededed;
        }

        .desc {
            width: 100%;
            height: 100px;
        }
    }
</style>
<template>
    <article class="course-task-template-index">
        <!--添加/编辑表单-->
        <!--点击添加 form数据取邮箱/手机号 密码-->
        <article class="manage-container">
            <el-button icon="plus" type="primary" @click="()=> $router.push({name:'coursetask-template-add'}) ">添加
            <!--添加-->
            </el-button>
        </article>
        <section class="search">
            <section>
                <i>类别</i>
                <CourseTaskTemplateCategorySelect :onchange="getData"
                                                  v-model="fetchParam.category_id"></CourseTaskTemplateCategorySelect>
            </section>
            <section>
                <i>任务名称</i>
                <el-input @keyup.enter.native="getData" class="name" v-model="fetchParam.title"/>
            </section>
        </section>
        <el-table border :data="coursetasktemplateData" v-loading="loading">
            <el-table-column
                    prop="title"
                    label="任务名称">
            </el-table-column>
            <el-table-column
                    prop="status_name"
                    label="状态"
                    width="90">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.status == 0">正常</el-tag>
                    <el-tag type="gray" v-if="scope.row.status == 1">草稿</el-tag>
                    <el-tag type="gray" v-if="scope.row.status == 2">下线</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    prop="create_time_name"
                    label="创建时间"
                    width="170">
            </el-table-column>
            <el-table-column prop="operate" label="操作" width="140" fixed="right" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="editItm(scope.row)">
                        修改
                        <!--点击详情 form数据变成当前管理员的信息-->
                    </el-button>
                    <el-button v-if="scope.row.status == 2 || scope.row.status == 1 " type="text" size="small"
                               @click="publishCourseTaskTemplate(scope.row)">
                        上线
                        <!--上线-->
                    </el-button>
                    <el-button v-if="scope.row.status == 0 " type="text" size="small"
                               @click="revokeCourseTaskTemplate(scope.row)">
                        <i>下线</i>
                    </el-button>
                    <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">
                        <i>删除</i>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <section class="block">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[15, 30, 60, 100]"
                    layout="total, sizes, ->, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </section>
    </article>
</template>
<script>
    import DateRange from '../../component/form/DateRangePicker.vue'
    import companyService from '../../../services/companyService'
    import CourseTaskTemplateCategorySelect from '../../component/select/CourseTaskTemplateCategory.vue'
    import {fillImgPath} from '../../../utils/filterUtils'

    export default {
        filters: {
            fillImgPath
        },
        components: {
            DateRange,
            CourseTaskTemplateCategorySelect,
        },
        data () {
            return {
                currCategoryName: '',
                loading: false,
                fetchParam: {
                    title: '',
                    category_id: '',
                },
                itemName: '',           // 要删除项名称
                coursetasktemplateData: [],
                total: 0,
                currentPage: 1, // 分页当前显示的页数
                pageSize: 15
            }
        },
        activated () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            handleDelete (index, row) {
                xmview.showDialog(`你将要删除课程任务【<i style="color:red">${row.title || ''}</i>】操作不可恢复确认吗？`, this.deleteItem(row.id))
            },
            deleteItem (id) {
                // 以下执行接口删除动作
                return () => {
                    companyService.deleteCourseTaskTemplate(id).then((ret) => {
                        xmview.showTip('success', '删除成功')
                        this.getData()
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message)
                    })
                }
            },
            editItm (row) {
                row.course = row.course || []
                this.$router.push({name: 'coursetask-template-add', params: {item: row}})
            },
            publishCourseTaskTemplate (row) {
                xmview.showDialog(`你将要上线课程任务【<i style="color:red">${row.title || ''}</i>】吗？`, this.publishItem(row.id))
            },
            publishItem (id) {
                // 以下执行接口删除动作
                return () => {
                    companyService.publishCourseTaskTemplate(id).then((ret) => {
                        xmview.showTip('success', '上线成功')
                        this.getData()
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message)
                    })
                }
            },
            revokeCourseTaskTemplate (row) {
                xmview.showDialog(`你将要下线课程任务【<i style="color:red">${row.title || ''}</i>】吗？`, this.revokeItem(row.id))
            },
            revokeItem (id) {
                // 以下执行接口删除动作
                return () => {
                    companyService.revokeCourseTaskTemplate(id).then((ret) => {
                        xmview.showTip('success', '下线成功')
                        this.getData()
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message)
                    })
                }
            },
            handleSizeChange (val) {
                this.pageSize = val
                this.getData()
            },
            handleCurrentChange (val) {
                this.currentPage = val
                this.getData()
            },
            getData () {
                this.loading = true
                return companyService.getCourseTaskTemplateList({
                    category_id: this.fetchParam.category_id,
                    title: this.fetchParam.title,
                    page: this.currentPage,
                    page_size: this.pageSize
                }).then((ret) => {
                    this.coursetasktemplateData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            },
            handleImgUploaded(response) {
                this.form.cover = response.data.url
            },
            ueReady (ue) {
                this.editor = ue
            }
        }
    }
</script>

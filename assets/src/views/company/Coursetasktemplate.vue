<!--文章内容管理-->
<style lang='scss' rel="stylesheet/scss">
    @import "../../utils/mixins/mixins";
    @import "../../utils/mixins/topSearch";
    .v-modal {
        z-index: 1000 !important;
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

    .course-task-template-index {
        .img-wrap {
            margin-bottom: 10px;
            width: 150px !important;
            height: 150px !important;
            img {
                width: 100%;
                height: 100%;
            }
        }
        border: 1px solid #ededed;
        .addForm {
            z-index: 99999999999999999999 !important;
        }
        .add {
            background: #ededed;
            padding: px2rem(10) px2rem(20);
            border-bottom: 1px solid #ededed;
        }
        .main-container {
            padding: 20px;
            background: #fff;
            .search {
                @extend %top-search-container;
            }
            .block {
                text-align: right;
                margin-top: 10px;
            }
        }
        .desc {
            width:100%;
            height:100px;
        }
    }
</style>
<template>
    <article class="course-task-template-index">
        <!--添加/编辑表单-->
        <el-dialog :visible.sync="addForm">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item prop="category" label="分类" :label-width="formLabelWidth">
                    <CourseTaskTemplateCategorySelect :placeholder="currCategoryName" v-model="form.category"></CourseTaskTemplateCategorySelect>
                </el-form-item>
                <el-form-item prop="title" label="标题" :label-width="formLabelWidth">
                    <el-input v-model="form.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="description" label="描述" :label-width="formLabelWidth">
                    <textarea v-model="form.description" class="desc"></textarea>
                </el-form-item>
                <el-form-item prop="imgUrl" label="封面" :label-width="formLabelWidth">
                    <div class="img-wrap" v-if="form.image">
                        <img :src="form.image | fillImgPath" alt="" />
                    </div>
                    <ImagEcropperInput :isRound="false" :aspectRatio="1" :confirmFn="cropperFn"
                                       class="upload-btn"></ImagEcropperInput>
                </el-form-item>
                <el-form-item prop="course" label="选择课程" :label-width="formLabelWidth">
                    <el-input v-model="form.course_id" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="sort" label="排序" :label-width="formLabelWidth">
                    <el-input v-model="form.sort" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit('form')">确 定</el-button>
                <el-button type="primary" @click="submit('form', 1)">存为草稿</el-button>
            </div>
        </el-dialog>
        <section class="add">
            <!--点击添加 form数据取邮箱/手机号 密码-->
            <el-button icon="plus" @click="addCourseTaskTemplate">添加</el-button>
        </section>
        <div class="main-container">
            <section class="search">
                <section>
                    <i>类别</i>
                    <CourseTaskTemplateCategorySelect :onchange="getData" v-model="search.category_id"></CourseTaskTemplateCategorySelect>
                </section>
                <section>
                    <i>课程名称</i>
                    <el-input @change="getData" class="name" v-model="search.title"/>
                </section>
            </section>
            <el-card class="box-card">
                <el-table border :data="coursetasktemplateData" v-loading="loading">
                    <el-table-column
                            prop="title"
                            label="课程任务">
                    </el-table-column>
                    <el-table-column
                            prop="create_time_name"
                            label="创建时间"
                            width="200">
                    </el-table-column>
                    <el-table-column
                            prop="status_name"
                            label="状态"
                            width="200">
                        <template slot-scope="scope">
                            <el-tag type="success" v-if="scope.row.status == 0">正常</el-tag>
                            <el-tag type="gray" v-if="scope.row.status == 1">草稿</el-tag>
                            <el-tag type="gray" v-if="scope.row.status == 2">下线</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="operate" label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="editCourseTaskTemplate(scope.row)">
                                修改
                                <!--点击详情 form数据变成当前管理员的信息-->
                            </el-button>
                            <el-button v-if="scope.row.status == 2 || scope.row.status == 1 " type="text" size="small" @click="publishCourseTaskTemplate(scope.row)">
                                上线
                            </el-button>
                            <el-button v-if="scope.row.status == 0 " type="text" size="small" @click="revokeCourseTaskTemplate(scope.row)">
                                下线
                            </el-button>
                            <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">
                                删除
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
            </el-card>
        </div>
    </article>
</template>
<script>
    import DateRange from '../component/form/DateRangePicker.vue'
    import companyService from '../../services/companyService'
    import CourseTaskTemplateCategorySelect from '../component/select/CourseTaskTemplateCategory.vue'
    import ImagEcropperInput from '../component/upload/ImagEcropperInput.vue'
    import {fillImgPath} from '../../utils/filterUtils'

    export default {
        filters: {
            fillImgPath
        },
        components: {
            DateRange,
            CourseTaskTemplateCategorySelect,
            ImagEcropperInput
        },
        data () {
            return {
                currCategoryName: '',
                loading: false,
                search: {
                    title: '',
                    category_id: '',
                },
                itemName: '',           // 要删除项名称
                uploadImgUrl: '',      // 要上传图片的请求地址
                form: {                // 表单属性值
                    id: '',
                    title: '',          // 标题
                    category: '',       // 分类
                    image: '',        // 图片地址
                    description: '',  // 简介
                    sort: '',         // 排序
                    course_id: '',     // 课程
                    status: '',       // 状态
                },
                rules: {
                    title: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    category: {type: 'number', required: true, message: '请选择栏目', trigger: 'change'}
                },
                formLabelWidth: '120px', // 表单label的宽度
                addForm: false, // 表单弹窗是否显示
                coursetasktemplateData: [],
                total: 0,
                currentPage: 1, // 分页当前显示的页数
                pageSize: 15
            }
        },
        created () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            addCourseTaskTemplate () {
                this.currCategoryName = ''
                this.addForm = true
                this.form = {
                    id: '',
                    title: '',
                    category: '',
                    description: '',
                    image: '',
                    course_id: '',
                    sort: '',
                    status: '',
                }
            },
            editCourseTaskTemplate (row) {
                companyService.getCourseTaskTemplateEditDetail(row.id).then((ret) => {
                    this.addForm = true
                    this.form.category = ret.data.category_id
                    this.form.title = ret.data.title
                    this.form.image = ret.data.image
                    this.form.description = ret.data.description
                    this.form.sort = ret.data.sort
                    this.form.course_id = ret.data.course_id
                    this.form.id = ret.data.id
                    this.currCategoryName = ret.category.name
                })
            },
            submit (form, status = 0) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.form.status = status
                        let reqFn = companyService.addCourseTaskTemplate
                        let msg = '发布成功'
                        if (this.form.id) {
                            reqFn = companyService.updateCourseTaskTemplate
                            msg = '修改成功'
                        }
                        reqFn(this.form).then((ret) => {
                            xmview.showTip('success', msg)
                            this.addForm = false
                            this.getData()
                        }).catch((ret) => {
                            xmview.showTip('error', ret.message)
                        })
                    } else {
                        return false
                    }
                })
            },
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
                    category_id: this.search.category_id,
                    title: this.search.title,
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
            cropperFn(data, ext) {
                companyService.CourseTaskTemplateUploadUrl({
                    avatar: data,
                    alias: `${Date.now()}${ext}`
                }).then((ret) => {
                    xmview.showTip('success', '上传成功')
                    this.form.image = ret.data.url // 显示图片
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            ueReady (ue) {
                this.editor = ue
            }
        }
    }
</script>

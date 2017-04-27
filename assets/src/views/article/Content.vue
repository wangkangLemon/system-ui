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

    .article-content-container {
        .showDetail {
            h2 {
                text-align: center;
            }
            .info {
                p {
                    line-height: 35px;
                }
            }
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
        .addForm {
            z-index: 99999999999999999999 !important;
        }
        .add {
            text-align: right;
            padding: 20px 0;
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
    }
</style>
<template>
    <article class="article-content-container">
        <!--详情-->
        <el-dialog class="showDetail" :title="currentItem.type" v-model="showDetail">
            <h2>{{currentItem.title}}</h2>
            <div class="info" ref="info"></div>
        </el-dialog>
        <!--添加/编辑表单-->
        <el-dialog v-model="addForm">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item prop="category" label="分类" :label-width="formLabelWidth">
                    <ArticleCategorySelect :placeholder="currCategoryName" v-model="form.category"></ArticleCategorySelect>
                </el-form-item>
                <el-form-item prop="title" label="标题" :label-width="formLabelWidth">
                    <el-input v-model="form.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="imgUrl" label="封面" :label-width="formLabelWidth">
                    <div class="img-wrap" v-if="form.cover">
                        <img :src="form.cover | fillImgPath" alt="" />
                    </div>
                    <ImagEcropperInput :isRound="false" :aspectRatio="1" :confirmFn="cropperFn"
                                       class="upload-btn"></ImagEcropperInput>
                </el-form-item>
                <el-form-item prop="content" label="正文内容" id="editor" :label-width="formLabelWidth">
                    <vue-editor v-model="form.content" @ready="ueReady"></vue-editor>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit('form')">确 定</el-button>
                <el-button type="primary" @click="submit('form', 1)">存为草稿</el-button>
            </div>
        </el-dialog>
        <section class="add">
            <el-button type="primary" icon="plus" @click="addArticle">添加</el-button>
        </section>
        <div class="main-container">
            <section class="search">
                <section>
                    <i>标题</i>
                    <el-input @change="getData" class="name" v-model="search.title"/>
                </section>
                <section>
                    <i>类别</i>
                    <ArticleCategorySelect :onchange="getData" v-model="search.category_id"></ArticleCategorySelect>
                </section>
                <DateRange title="时间" :start="search.createTime" :end="search.endTime"
                           v-on:changeStart="val=> search.createTime=val"
                           v-on:changeEnd="val=> search.endTime=val"
                           :change="getData">
                </DateRange>
            </section>
            <el-card class="box-card">
                <el-table border :data="articleData" v-loading="loading">
                    <el-table-column
                            prop="title"
                            label="标题">
                    </el-table-column>
                    <el-table-column
                            prop="category_name"
                            label="类别"
                            width="200">
                    </el-table-column>
                    <el-table-column
                            prop="status_name"
                            label="状态"
                            width="200">
                        <template scope="scope">
                            <el-tag type="gray" v-if="scope.row.status">{{scope.row.status_name}}</el-tag>
                            <el-tag type="success" v-if="!scope.row.status">{{scope.row.status_name}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="create_time_name"
                            label="创建时间"
                            width="200">
                    </el-table-column>
                    <el-table-column prop="operate" label="操作">
                        <template scope="scope">
                            <el-button type="text" size="small" @click="showFn(scope.row)">
                                查看
                            </el-button>
                            <el-button type="text" size="small" @click="editArticle(scope.row)">
                                修改
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
    import VueEditor from '../component/form/UEditor.vue'
    import ArticleService from '../../services/articleService'
    import ArticleCategorySelect from '../component/select/ArticleCategory.vue'
    import ImagEcropperInput from '../component/upload/ImagEcropperInput.vue'
    import {fillImgPath} from '../../utils/filterUtils'

    export default {
        filters: {
            fillImgPath
        },
        components: {
            DateRange,
            VueEditor,
            ArticleCategorySelect,
            ImagEcropperInput
        },
        data () {
            return {
                showDetail: false,
                currentItem: {
                    title: '',
                    type: ''
                },
                currCategoryName: '',
                loading: false,
                search: {
                    title: '',
                    category_id: '',
                    createTime: '',
                    endTime: '',
                },
                editor: null,
                itemName: '',           // 要删除项名称
                uploadImgUrl: '',      // 要上传图片的请求地址
                form: {                // 表单属性值
                    title: '',          // 标题
                    category: '',       // 分类
                    cover: '',        // 图片地址
                    content: '',         // 正文内容
                },
                rules: {
                    title: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    category: {type: 'number', required: true, message: '请选择栏目', trigger: 'change'}
                },
                formLabelWidth: '120px', // 表单label的宽度
                addForm: false, // 表单弹窗是否显示
                name: '', // 搜索的姓名
                articleData: [],
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
            showFn (row) {
                ArticleService.getArticleDetail({article_id: row.id}).then((ret) => {
                    this.currentItem.type = ret.category.name
                    this.currentItem.title = ret.data.title
                    this.currentItem.content = ret.data.content
                    this.$nextTick(() => {
                        this.$refs.info.innerHTML = ret.data.content
                    })
                }).then(() => {
                    this.showDetail = true
                })
            },
            addArticle () {
                this.currCategoryName = ''
                this.form = {
                    title: '',
                    category: '',
                    cover: '',
                    content: '',
                }
                this.addForm = true
                this.editor && this.editor.setContent('')
            },
            handleDelete (index, row) {
                xmview.showDialog(`你将要删除文章【<i style="color:red">${row.title || ''}</i>】操作不可恢复确认吗？`, this.deleteItem(row.id))
            },
            deleteItem (id) {
                // 以下执行接口删除动作
                return () => {
                    ArticleService.deleteArticle(id).then((ret) => {
                        xmview.showTip('success', '删除成功')
                        this.getData()
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message)
                    })
                }
            },
            editArticle (row) {
                ArticleService.getEditDetail(row.id).then((ret) => {
                    this.addForm = true
                    this.form.category = ret.data.category_id
                    this.form.title = ret.data.title
                    this.form.cover = ret.data.cover
                    this.form.content = ret.data.content
                    this.form.id = ret.data.id
                    this.currCategoryName = ret.category.name
                    this.editor && this.editor.setContent(ret.data.content)
                })
            },
            submit (form, status = 0) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        if (!this.editor.getContentTxt()) {
                            xmview.showTip('error', '请填写正文内容')
                            return
                        }
                        this.form.content = this.editor.getContentTxt()
                        this.form.draft = status
                        let reqFn = ArticleService.addArticle
                        let msg = '发布成功'
                        if (this.form.id) {
                            reqFn = ArticleService.updateArticle
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
                return ArticleService.getArticleList({
                    category_id: this.search.category_id,
                    title: this.search.title,
                    start_time: this.search.createTime,
                    end_time: this.search.endTime,
                    page: this.currentPage,
                    page_size: this.pageSize
                }).then((ret) => {
                    this.articleData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            },
            handleImgUploaded(response) {
                this.form.cover = response.data.url
            },
            cropperFn(data) {
                ArticleService.ArticleUploadUrl({
                    avatar: data,
                    alias: Date.now() + '.jpg'
                }).then((ret) => {
                    console.log(ret)
                    xmview.showTip('success', '上传成功')
                    this.form.cover = ret.data.url // 显示图片
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

<!--管理员-->
<style lang='scss' rel="stylesheet/scss">
    @import "../../utils/mixins/mixins";
    @import "../../utils/mixins/topSearch";
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
    .table-container {
        border: 1px solid #ededed;
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
        .showDetail {
            .avatar {
                border: 1px solid #ededed;
                display: inline-block;
                vertical-align: top;
            }
            .info {
                display: inline-block;
                vertical-align: top;
                > p {
                    > span {
                        display: inline-block;
                        width: px2rem(100);
                        text-align: right;
                        padding-right: px2rem(10);
                    }
                }
            }
        }
        .forbidden-content {
            text-align: center;
            i {
                &:before {
                    display: block;
                    font-size: px2rem(60);
                    color: #f8bb86;
                    padding-bottom: px2rem(40);
                }
            }
            h1 {
                font-size: px2rem(20);
            }
            p {
                margin: px2rem(10);
                span {
                    color: red;
                }
            }
        }
    }
</style>
<template>
    <article class="table-container">
        <!--删除弹窗-->
        <delete-dialog :text="itemName" v-model="deletDialog" v-on:callback="deleteItem"></delete-dialog>
        <!--详情-->
        <el-dialog class="showDetail" title="查看管理员账号" v-model="showDetial">
            <div class="avatar">
                <img src="http://sys.yst.vodjk.dev/assets/img/user-default-female.jpg?00da903dc4d95b13b46f"/>
            </div>
            <div class="info">
                <p><span>测试营销员</span></p>
                <p><span>Mobile：</span> <i class="iconfont icon-oslash"></i>13012332324</p>
                <p><span>Email：</span><i class="el-icon-message"></i> 12@vodjk.com</p>
                <p><span>状态：</span> 正常</p>
                <p><span>性别：</span> 女</p>
                <p><span>地址：</span> 北京市朝阳区</p>
                <p><span>注册时间：</span>2017-03-17 12:333</p>
            </div>
        </el-dialog>
        <!--添加/编辑表单-->
        <el-dialog v-model="addForm">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item prop="category" label="分类" :label-width="formLabelWidth">
                    <ArticleCategorySelect v-model="form.category"></ArticleCategorySelect>
                </el-form-item>
                <el-form-item prop="title" label="标题" :label-width="formLabelWidth">
                    <el-input v-model="form.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="imgUrl" label="封面" :label-width="formLabelWidth">
                    <UploadImg ref="uploadImg" :defaultImg="form.cover" :url="uploadImgUrl"
                               :onSuccess="handleImgUploaded"></UploadImg>
                </el-form-item>
                <el-form-item prop="content" label="正文内容" id="editor" :label-width="formLabelWidth">
                    <vue-editor @ready="ueReady"></vue-editor>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit('form')">确 定</el-button>
                <el-button type="primary" @click="submit('form', 1)">存为草稿</el-button>
            </div>
        </el-dialog>
        <section class="add">
            <!--点击添加 form数据取邮箱/手机号 密码-->
            <el-button icon="plus" @click="addForm = true">添加</el-button>
        </section>
        <div class="main-container">
            <section class="search">
                <section>
                    <i>标题</i>
                    <el-input @change="getData" class="name" v-model="search.title" />
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
                            <el-button type="text" size="small" @click="editArticle(scope.row)">
                                修改
                                <!--点击详情 form数据变成当前管理员的信息-->
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
<script lang="babel">
    import deleteDialog from '../component/dialog/Delete'
    import DateRange from '../component/form/DateRangePicker.vue'
    import VueEditor from '../component/form/UEditor.vue'
    import ArticleService from '../../services/articleService'
    import ArticleCategorySelect from '../component/select/ArticleCategory.vue'
    import UploadImg from '../component/upload/UploadImg.vue'

    export default {
        components: {
            deleteDialog,
            DateRange,
            VueEditor,
            ArticleCategorySelect,
            UploadImg
        },
        data () {
            return {
                loading: false,
                search: {
                    title: '',
                    category_id: '',
                    createTime: '',
                    endTime: '',
                },
                editor: null,
                itemName: '',           // 要删除项名称
                deletDialog: false,     // 删除弹窗
                showDetial: false,     // 是否显示详情对话框
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
            this.uploadImgUrl = ArticleService.getArticleUploadUrl()
            console.log(this.uploadImgUrl)
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            handleDelete (index, row) {
                this.deletDialog = true
                this.itemName = row.name
            },
            deleteItem (confirm) {
                this.deletDialog = false
                if (!confirm) {
                    return false
                }
                // 以下执行接口删除动作
                console.log(11)
            },
            editArticle (row) {
                this.addForm = true
                let _this = this
                setTimeout(() => {
                    _this.$refs['form'].resetFields()
                    _this.form = row
                    console.log(_this.editor)
//                    _this.editor.setContent(_this.form.content || '')
                    console.log(row)
                }, 0)
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
                        ArticleService.addArticle(this.form).then((ret) => {
                            xmview.showTip('success', '发布成功')
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
                console.log(`每页 ${val} 条`)
                // 当切换每页条数得时候 获取当前第一页得数据
                this.handleCurrentChange(1)
            },
            handleCurrentChange (val) {
                this.currentPage = val
                console.log(`当前页: ${val}`)
                // 以下获取当页数据
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
            ueReady (ue) {
                this.editor = ue
            }
        }
    }
</script>

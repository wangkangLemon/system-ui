<!--内容维护-->
<style lang='scss' rel="stylesheet/scss">
    @import "../../../utils/mixins/mixins";

    .client-content-manage {
        .cell {
            overflow: visible !important;
        }
        .el-input {
            .el-input__icon {
                text-align: center;
                text-align-last: center;
            }
        }
        /*上传图片的样式*/
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
            width: 150px;
            height: 150px;
            line-height: 150px;
            text-align: center;
        }
        .avatar {
            width: 150px;
            height: 150px;
            display: block;
        }
        // 同步时候的遮罩层
        .keep {
            position: absolute;
            width: 100%;
            left: 0;
            height: 360px;
            z-index: 99;
            background: rgba(255, 255, 255, 0.7);
            top: 140px;
        }
        .synchronize {
            background: cornflowerblue;
            color: #fff;
            padding: 10px;
            line-height: 35px;
            margin-bottom: 20px;
            .el-button {
                float: right;
            }
        }
        .addForm {
            text-align: left;
            text-align-last: left;
            .img-wrap {
                display: flex;
                .image {
                    width: 200px;
                    height: 100px;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .button-wrap {
                    margin-left: 10px;
                }
            }
            .tag {
                span {
                    padding: 10px;
                    border: 1px solid #e2e7eb;
                    background: #fff;
                    border-right: none;
                    &:last-of-type {
                        border-right: 1px solid #e2e7eb;
                    }
                    &:hover {
                        background: #e2e7eb;
                    }
                    &.active {
                        background: #e2e7eb;
                    }
                }
            }
        }
        .dialog-footer {
            text-align: right;
            float: right;
            margin-bottom: 30px;
        }
        @extend %justify;
        .main-container {
            background: transparent;

            .search {
                position: relative;
                padding-top: 0;
                .categorySubTree {
                    position: absolute;
                    z-index: 9;
                    width: 20%;
                }
            }
        }
        .left-content {
            display: inline-block;
            vertical-align: top;
            width: 25%;

            .title {
                padding: 10px 20px;
                background: #f0f3f5;
                position: relative;
            }
            .left-list {
                background: #fff;
                padding: 20px;

                .list {
                    margin-bottom: 10px;
                    .name {
                        font-size: 16px;
                        padding-top: 10px;
                    }
                    .class {
                        color: #ddd;
                        font-size: 12px;
                        padding-bottom: 10px;
                    }
                }
            }
        }
        .right-content {
            width: 74%;
            display: inline-block;
            vertical-align: top;
            background: #fff;

            .title {
                padding: 10px 20px;
                background: #f0f3f5;
                text-align: left;
                line-height: 35px;
                span {
                    float: right;
                    display: block;
                }
            }
            .right-list {
                padding: 20px;
                padding-bottom: 60px;
                .el-table {
                    overflow: visible !important;
                    .el-table__body-wrapper {
                        overflow: visible !important;
                    }
                    .cell {
                        i.tag {
                            padding: 5px;
                            background: cornflowerblue;
                            color: #fff;
                            border-radius: 5px;
                        }
                        i.el-icon-picture {
                            position: relative;
                            .img-wrap {
                                display: none;
                                padding: 5px;
                                background: #fff;
                                width: 213px;
                                height: 123px;
                                position: absolute;
                                bottom: -123px;
                                right: -213px;
                                z-index: 999 !important;
                                img {
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                        }
                    }
                }
            }
            .el-pagination {
                float: right;
                margin-top: 10px;
            }
        }
    }
</style>
<template>
    <article class="client-content-manage">
        <!--添加/编辑课程-->
        <el-dialog v-model="addForm" :title="formTitle">
            <section v-if="form.ref_id">
                <div class="keep" v-if="form.ref_sync"></div>
                <div class="synchronize">
                    {{catArr[category]}}：{{category == 'course' ? form.content.name : form.content.title}}
                    <el-button @click="form.ref_sync = 0" v-if="form.ref_sync">关闭同步</el-button>
                    <el-button @click="keepSync" v-if="!form.ref_sync">开启同步</el-button>
                </div>
            </section>
            <el-form label-position="top" class="addForm" :model="form" :rules="rules" ref="form">
                <el-form-item prop="title" label="标题" :label-width="formLabelWidth">
                    <el-input v-model="form.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="!form.ref_id" prop="url" label="链接" :label-width="formLabelWidth">
                    <el-input v-model="form.url" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="image" label="图片" :label-width="formLabelWidth">
                    <!--图片上传-->
                    <div class="img-wrap">
                        <div v-if="form.image" class="image">
                            <img :src="form.image | fillImgPath" alt=""/>
                        </div>
                        <div class="button-wrap">
                            <el-button type="primary" @click="() => {$refs.imgcropper.chooseImg()}">上传</el-button>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item prop="desc" label="描述" :label-width="formLabelWidth">
                    <el-input type="textarea" :rows="3" v-model="form.desc" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item class="tag" label="标签" :label-width="formLabelWidth">
                    <span @click="toggleTag(item.value)" :class="{'active': item.value == form.tags}"
                          v-for="(item, index) in tags">{{item.name}}</span>
                </el-form-item>
                <el-form-item prop="date" label="日期" :label-width="formLabelWidth">
                    <el-date-picker v-model="form.date" type="date"/>
                </el-form-item>
                <el-form-item prop="sort" label="排序" :label-width="formLabelWidth">
                    <el-input v-model="form.sort" auto-complete="off" placeholder="排序越大越靠前，留空则自动设为最靠前的排序"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addForm = false">取 消</el-button>
                <el-button type="primary" @click="submit('form')">确 定</el-button>
            </div>
        </el-dialog>
        <!--选取-->
        <ChooseContent v-model="content.isShow" v-on:result="contentConfirm"></ChooseContent>
        <section class="left-content">
            <div class="classify title">
                <SectionCategorySelect :onchange="getLeftCategoryData" v-model="section.category_id"></SectionCategorySelect>
            </div>
            <div class="left-list">
                <div class="list">
                    <el-table v-loading="section.loading" @row-click="sectionChange" :show-header="false" :highlight-current-row="true" :data="section.classifyData" border>
                        <el-table-column>
                            <template scope="scope">
                                <h2 class="name">{{scope.row.name}}</h2>
                                <p class="class">{{scope.row.categorys}}</p>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <el-pagination
                        @current-change="sectionPageChange"
                        :current-page="section.page"
                        :page-size="section.page_size"
                        small
                        layout="prev, pager, next"
                        :total="section.total">
                </el-pagination>
            </div>
        </section>
        <section class="right-content">
            <div class="title">
                {{result.title.name}}-内容列表<i v-if="result.title.category">(绑定公开课栏目:{{result.title.category}})</i>
                <span>
                    <el-button @click="content.isShow = true">选取内容</el-button>
                    <el-button @click="addCourse('form')">添加内容</el-button>
                </span>
            </div>
            <!--列表-->
            <div class="right-list">
                <el-table v-loading="result.loading" border :data="result.data">
                    <el-table-column
                            label="序号"
                            type="index"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            class="course-column"
                            label="标题">
                        <template scope="scope">
                            <el-tag type="primary" class="tag" v-if="scope.row.ref_type == 'course'">课程</el-tag>
                            <el-tag type="success" class="tag" v-if="scope.row.ref_type == 'speaking'">药我说</el-tag>
                            <el-tag type="warning" class="tag" v-if="scope.row.ref_type == 'article'">资讯</el-tag>
                            <el-tag type="gray" class="tag" v-if="scope.row.ref_type == 'link'">链接</el-tag>
                            {{scope.row.title}}
                            <i class="el-icon-picture" v-if="scope.row.image" @mouseover="showImg" @mouseout="hideImg">
                                <div class="img-wrap">
                                    <img :src="scope.row.image | fillImgPath"/>
                                </div>
                            </i>
                            <el-tooltip v-if="scope.row.ref_sync" class="item" effect="dark" content="与引用内容保持同步" placement="top">
                                <i class="iconfont icon-refresh"></i>
                            </el-tooltip>
                            <el-tag type="gray" v-if="scope.row.tags">{{scope.row.tags | filterArray}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="sort"
                            label="排序"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="date"
                            label="日期"
                            width="120">
                        <template scope="scope">
                            {{scope.row.create_time_name && scope.row.create_time_name.slice(0, 10)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="operate" label="操作" width="100">
                        <template scope="scope">
                            <el-button type="text" size="small" @click="updateCourse(scope.$index, scope.row)">
                                编辑
                            </el-button>
                            <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        @current-change="resultPageChange"
                        :current-page="result.page"
                        :page-size="result.page_size"
                        small
                        layout="prev, pager, next"
                        :total="result.total">
                </el-pagination>
            </div>
        </section>
        <ImagEcropperInput :compress="1" :isShowBtn="false" ref="imgcropper" :confirmFn="handleImgUploaded" :aspectRatio="ratio"></ImagEcropperInput>
    </article>
</template>
<script>
    import ChooseContent from '../component/ChooseContent.vue'
    import SectionCategorySelect from '../../component/select/SectionCategory.vue'
    import sectionService from '../../../services/sectionService'
    import ImagEcropperInput from '../../component/upload/ImagEcropperInput.vue'
    import {date2Str} from '../../../utils/timeUtils'
    let _this
    export default {
        components: {
            ChooseContent,
            SectionCategorySelect,
            ImagEcropperInput
        },
        data () {
            return {
                ratio: 0, // 裁剪的比例
                // 左侧分类
                section: {
                    loading: false,
                    category_id: '',
                    classifyData: [],  // 左侧显示的列表数据
                    total: 0,
                    page: 1,
                    page_size: 10,
                    currentID: '' // 当前选中的区块ID
                },
                // 右侧结果
                result: {
                    loading: false,
                    title: {
                        name: '',
                        category: ''
                    },
                    data: [],
                    page: 1,
                    page_size: 15,
                    total: 0
                },
                // 选取
                content: {
                    isShow: false
                },
                // 表单相关属性
                formTitle: '添加内容',
                addForm: false, // 表单弹窗是否显示
                formLabelWidth: '50px', // 表单label的宽度
                catArr: {'course': '课程', 'article': '资讯', 'speaking': '药我说', 'link': '链接'},
                category: '',
                form: {                // 表单属性值
                    title: '',          // 标题
                    url: '', // 链接地址
                    ref_type: '',       // 引用类型
                    ref_id: '',       // 引用ID
                    ref_sync: 0,       // 是否与引用同步
                    image: '',        // 图片
                    desc: '',         // 描述
                    date: '',       // 日期
                    sort: '',            // 排序
                    tags: ''
                },
                tags: [
                    {
                        name: '无',
                        value: ''
                    },
                    {
                        name: '热门',
                        value: 'hot'
                    },
                    {
                        name: '最新',
                        value: 'new'
                    },
                    {
                        name: '推荐',
                        value: 'recommend'
                    }
                ],
                rules: {
                    title: [
                        {
                            required: true,
                            message: '标题不能为空',
                            trigger: 'blur'
                        }
                    ],
                    url: [
                        {
                            required: true,
                            message: '链接不能为空',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        filters: {
            // 过滤标签名
            filterArray (value) {
                let newVal = ''
                _this.tags.forEach((item) => {
                    if (item['value'] == value) {
                        newVal = item['name']
                    }
                })
                return newVal
            }
        },
        activated () {
            _this = this
            this.getLeftCategoryData().then((ret) => {
                this.sectionChange(ret.data[0])
            }).then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            showImg (e) {
                e.target.firstChild.style.display = 'block'
            },
            hideImg (e) {
                e.target.firstChild.style.display = 'none'
            },
            // 保持同步
            keepSync () {
                this.form.ref_sync = 1
                if (this.category == 'course') {
                    this.form.title = this.form.content.name
                    this.form.image = this.form.content.image
                    this.form.desc = this.form.content.description
                    this.form.date = this.form.content.create_time_name
                } else if (this.category == 'speaking') {
                    this.form.title = this.form.content.title
                    this.form.image = this.form.content.image
                    this.form.desc = this.form.content.content
                    this.form.date = this.form.content.create_time
                } else if (this.category == 'article') {
                    this.form.title = this.form.content.title
                    this.form.image = this.form.content.cover
                    this.form.date = this.form.content.create_time_name
                }
                this.form.sort = ''
            },
            // 区块当前页
            sectionPageChange (val) {
                this.section.page = val
                this.getLeftCategoryData()
            },
            // 结果当前页
            resultPageChange (val) {
                this.result.page = val
                this.getSectionData(this.section.currentID)
            },
            // 点击分类获取列表
            sectionChange (row) {
                this.result.title = {
                    name: row.name,
                    category: row.course_category_name
                }
                this.section.currentID = row.id
                if (this.section.currentID == 1 || this.section.currentID == 10) this.ratio = 2.2
                else this.ratio = 0
                this.getSectionData(row.id)
            },
            // 结果列表
            getSectionData (sectionID) {
                this.result.loading = true
                sectionService.getSectionDataList({
                    page: this.result.page,
                    page_size: this.result.page_size,
                    section_id: sectionID
                }).then((ret) => {
                    this.result.data = ret.data
                    this.result.total = ret.total
                    this.result.loading = false
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            // 获取左侧分类列表
            getLeftCategoryData () {
                this.section.loading = true
                return sectionService.getSectionList({
                    category_id: this.section.category_id,
                    page: this.section.page
                }).then((ret) => {
                    this.section.classifyData = ret.data
                    this.section.total = ret.total
                    this.section.loading = false
                    return ret
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            contentConfirm (dataObj) { // 点击确定的时候，进行搜索结果
                this.form.content = dataObj.data
                this.form.ref_id = dataObj.data.id
                this.form.ref_sync = 1
                this.form.tags = ''
                this.category = dataObj.category
                if (this.form.id) delete this.form.id
                this.keepSync()
                this.addForm = true
            },
            handleDelete (index, row) {
                xmview.showDialog(`你确定要将内容 【<i style="color:red">${row.title}</i>】 从区块中删除吗？`, () => {
                    sectionService.delSectionData({
                        id: row.id,
                        section_id: this.section.currentID
                    }).then(() => {
                        xmview.showTip('success', '删除成功')
                        this.getSectionData(this.section.currentID)
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message)
                    })
                })
            },
            submit (form) { // 表单提交
                this.form.section_id = this.section.currentID
                this.form.date = this.form.date ? date2Str(this.form.date) : ''
                this.form.ref_type = this.form.ref_id ? this.category : 'link'
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        let reqFn = sectionService.createSectionData
                        let msg = '添加成功'
                        if (this.form.id) {
                            reqFn = sectionService.updateSectionData
                            msg = '修改成功'
                        }
                        reqFn(this.form).then(() => {
                            xmview.showTip('success', msg)
                            this.addForm = false
                            this.content.isShow = false
                            this.getSectionData(this.section.currentID)
                        }).catch((ret) => {
                            xmview.showTip('error', ret.message)
                        })
                    } else {
                        return false
                    }
                })
            },
            toggleTag (value) {
                this.form.tags = value
            },
            updateCourse (index, item) {
                this.formTitle = `编辑${this.catArr[item.ref_type]}`
                this.form = item
                if (item.ref_type != 'link') {
                    this.category = item.ref_type
                    if (item.ref_type == 'course') {
                        this.form.content = item.course
                    } else if (item.ref_type == 'speaking') {
                        this.form.content = item.speaking
                    } else if (item.ref_type == 'article') {
                        this.form.content = item.article
                    }
                }
                this.addForm = true
            },
            addCourse (form) {
                if (this.section.loading || this.result.loading) {
                    return
                }
                this.form = {
                    title: '',
                    url: '',
                    ref_type: '',
                    ref_id: '',
                    ref_sync: 0,
                    image: '',
                    desc: '',
                    date: '',
                    sort: '',
                    tags: ''
                }
                this.addForm = true
                this.formTitle = '添加内容'
            },
            handleImgUploaded (data, ext) {
                sectionService.uploadSectionImage({
                    section_id: this.section.currentID,
                    alias: Date.now() + ext,
                    image: data
                }).then((ret) => {
                    this.form.image = ret.url
                })
            }
        }
    }
</script>

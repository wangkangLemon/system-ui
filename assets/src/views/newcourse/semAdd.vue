<!--课程表单：添加/修改-->
<style lang="scss" rel="stylesheet/scss">
    @import "../../utils/mixins/common";
    #add-newcourse {
        @extend %content-container;
        .el-form {
            max-width: 700px;
        }
        .el-tabs {
            .el-tab-pane {
                .mulit-class {
                    .saveBtn {
                        float: right;
                        margin-top: 20px;
                    }
                    padding: 20px 100px;
                    text-align: center;
                    width: 75%;
                    p {
                        padding: 10px;
                        text-align: left;
                        span {
                            i {
                                margin: 0 10px;
                            }
                        }
                        .operate {
                            float: right;
                        }
                        &.gray {
                            text-align: center;
                            background: #eee;
                            margin-left: 50px;
                            cursor: pointer;
                        }
                        .edit-status {
                            display: block;
                            margin: 10px 0 10px 50px;
                            .el-input {
                                width: 70%;
                            }
                            span {
                                float: right;
                            }
                        }
                        &.edit-status {
                            text-align: left;
                            > .el-input {
                                outline: none;
                                line-height: 30px;
                                width: 70%;
                            }
                            > span {
                                float: right;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
<template>
    <article id="add-newcourse">
        <el-tabs type="card" v-model="activeTab" class="tab">
            <el-tab-pane label="课程信息" name="couse">
                <el-form label-width="120px" ref="form" :rules="rules" :model="fetchParam">
                    <!-- <el-form-item label="所属栏目" prop="category_id">
                        <CourseCategorySelect type="newcourse" :placeholder="fetchParam.category_name" :autoClear="true" :showNotCat="false" v-model="fetchParam.category_id"></CourseCategorySelect>
                    </el-form-item> -->
                    <el-form-item label="课程名称" prop="name">
                        <el-input v-model="fetchParam.name"></el-input>
                    </el-form-item>
                    <el-form-item label="课程封面图" prop="image">
                        <img :src="fetchParam.image | fillImgPath" width="200" height="112" v-show="fetchParam.image">
                        <CropperImg ref="imgcropper" :confirmFn="cropperImgSucc" :aspectRatio="16/9"></CropperImg>
                    </el-form-item>
                    <el-form-item label="课程介绍" prop="description">
                        <el-input v-model="fetchParam.description" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="课程标签">
                        <vTags v-model="courseTags"></vTags>
                    </el-form-item>
                    <el-form-item label="课程归属" prop="company_id">
                        <CompanySelect type="3" v-model="fetchParam.company_id"
                                       :placeholder="fetchParam.company_name"
                                        v-on:change="val=>fetchParam.company_id=val">
                        </CompanySelect>
                    </el-form-item>
                    <el-form-item label="课程售价" prop="price">
                        <el-input v-model.number="fetchParam.price" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="更新时间" prop="update_time_name" v-if="fetchParam.update_time_name">
                        <el-date-picker v-model="fetchParam.update_time_name" 
                            type="datetime" 
                            value-format="yyyy-MM-dd HH:mm:ss" 
                            placeholder="更新时间">
                        </el-date-picker>
                    </el-form-item>
                    <h2>课时类型设置</h2>
                    <el-form-item label="选择类型" prop="lesson_type">
                        <el-radio-group v-model="fetchParam.lesson_type">
                            <el-radio label="single">单节课</el-radio>
                            <el-radio label="multi">多课时</el-radio>
                            <el-radio label="chapter">多章节课</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button type="primary" @click="btnNextClick">下一步</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane :disabled="!fetchParam.id" label="课时管理" name="classhour">
                <!--单节课-->
                <el-form v-if="fetchParam.lesson_type == 'single'" label-width="120px" ref="classhourform" :rules="classhour.rules" :model="classhour.form">
                    <LessonForm :lesson="classhour.form" :company_id="fetchParam.company_id"></LessonForm>

                    <el-form-item v-if="!classhour.paperLesson">
                        <el-button type="gray" size="full" @click="openExamForm(-1, -1, $event)"><i class="el-icon-plus" ></i> 添加考试</el-button>
                    </el-form-item>
                    <el-form-item v-if="classhour.paperLesson">
                        <section>
                            <span>
                                <i style="margin-right: 10px">{{classhour.paperLesson.name}}</i>
                                <el-tag type="danger" v-show="classhour.paperLesson.try_enable">免费试看</el-tag>
                                <el-tag type="danger" v-if="classhour.paperLesson.material_type == 'exam'">考试</el-tag>
                            </span>
                            <span class="operate" style="float: right">
                                <el-button type="text" @click="openEditExamForm(classhour.paperLesson, -1, 0, $event)">编辑</el-button>
                                <el-button type="text" @click="delClasshour(classhour.paperLesson, -1, 0)">删除</el-button>
                            </span>
                        </section>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button type="primary" class="saveBtn" @click="saveResult">保存</el-button>
                    </el-form-item>
                </el-form>

                <!--多节课-->
                <section class="mulit-class" v-if="fetchParam.lesson_type == 'multi'">
                    <div v-for="(item,index) in multi.data" :key="item.id">
                        <div v-if="!item.deleted">
                            <div v-if="item.id === -1">
                                <p><el-button type="gray" size="full" @click="addNewClasshour"><i class="el-icon-plus" ></i> 添加新课时</el-button></p>
                                <p><el-button type="gray" size="full" @click="openExamForm(-1, -1, $event)"><i class="el-icon-plus" ></i> 添加考试</el-button></p>
                            </div>
                            <p v-else>
                                <el-tag type="primary">课时{{index + 1}}</el-tag>
                                <span>
                                    <i>{{item.name}}</i>
                                    <el-tag type="danger" v-show="item.try_enable">免费试看</el-tag>
                                    <el-tag type="danger" v-if="item.material_type == 'exam'">考试</el-tag>
                                </span>
                                <span class="operate" v-if="item.material_type != 'exam'">
                                    <el-button type="text" @click="previewFn(item)">查看</el-button>
                                    <el-button type="text" @click="editClasshour(item, index)">编辑</el-button>
                                    <el-button type="text" @click="delClasshour(item, index)">删除</el-button>
                                </span>
                                <span class="operate" v-else>
                                    <el-button type="text" @click="openEditExamForm(item, -1, index, $event)">编辑</el-button>
                                    <el-button type="text" @click="delClasshour(item, -1, index)">删除</el-button>
                                </span>
                            </p>
                        </div>
                    </div>
                    <el-button type="primary" class="saveBtn" @click="saveResult">保存</el-button>
                </section>

                <!--多章节-->
                <section class="mulit-class" v-if="fetchParam.lesson_type == 'chapter'">
                    <section v-for="(pitem,pindex) in resultData" :key="pitem.id">
                        <section v-if="pitem.deleted == false">
                            <p>
                                <el-tag type="danger">章节{{pindex + 1}}</el-tag>
                                <span v-if="!pitem.status"><i>{{pitem.name}}</i></span>
                                <span v-if="!pitem.status" class="operate">
                                    <el-button type="text" @click="()=>{pitem.status = 1;$forceUpdate();}">编辑</el-button>
                                    <el-button type="text" @click="delChapter(pitem, pindex)">删除</el-button>
                                </span>
                                <i class="edit-status" v-if="pitem.status">
                                    <el-input v-model="pitem.name" placeholder="请输入章节名称"></el-input>
                                    <span>
                                        <el-button type="text" @click="saveItemChapter(pitem, pindex)">保存</el-button>
                                        <el-button type="text" @click="()=>{pitem.status = 0;$forceUpdate();}">取消</el-button>
                                    </span>
                                </i>
                            </p>
                            <div v-for="(item,index) in pitem.lessons" :key="item.id">
                                <div v-if="!item.deleted">
                                    <div v-if="item.id === -1">
                                        <p><el-button type="gray" size="full" @click="addNewClasshour(pindex)"><i class="el-icon-plus" ></i> 添加新课时</el-button></p>
                                        <p><el-button type="gray" size="full" @click="openExamForm(pindex, -1, $event)"><i class="el-icon-plus" ></i> 添加考试</el-button></p>
                                    </div>
                                    <p v-else>
                                        <el-tag type="primary">课时{{index + 1}}</el-tag>
                                        <span>
                                            <i>{{item.name}}</i>
                                            <el-tag type="danger" v-show="item.try_enable">免费试看</el-tag>
                                            <el-tag type="danger" v-if="item.material_type == 'exam'">考试</el-tag>
                                        </span>
                                        <span class="operate" v-if="item.material_type != 'exam'">
                                            <el-button type="text" @click="previewFn(item)">查看</el-button>
                                            <el-button type="text" @click="editClasshour(item, pindex, index)">编辑</el-button>
                                            <el-button type="text" @click="delClasshour(item, pindex, index)">删除</el-button>
                                        </span>
                                        <span class="operate" v-else>
                                            <el-button type="text" @click="openEditExamForm(item, pindex, index, $event)">编辑</el-button>
                                            <el-button type="text" @click="delClasshour(item, pindex, index)">删除</el-button>
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </section>
                    </section>
                    <p v-show="chapter.editStatus" class="edit-status" style="text-align: left">
                        <el-input v-model="chapter.value" placeholder="请输入章节名称"></el-input>
                        <span>
                            <el-button type="text" @click="submitChapter">保存</el-button>
                            <el-button type="text" @click="chapter.editStatus = false">取消</el-button>
                        </span>
                    </p>
                    <p v-show="!chapter.editStatus"><el-button type="gray" size="full" @click="()=>{chapter.editStatus = true;chapter.value = '';}"><i class="el-icon-plus" ></i> 添加新章节</el-button></p>
                    <el-button type="primary" class="saveBtn" @click="saveResult">保存</el-button>
                </section>
            </el-tab-pane>
        </el-tabs>
        <el-dialog 
            :title="classhour.title" 
            :visible.sync="classhour.showDialog"
            append-to-body>
            <LessonForm :lesson="classhour.form" :company_id="fetchParam.company_id" ref="multiForm"></LessonForm>
            <el-form label-width="120px">
                <el-form-item>
                    <el-button type="primary" @click="addMultiSubmit">保存</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="查看" :visible.sync="docshow">
            <DocPreview ref="docShow" :docurl="docurl" class="docshow"></DocPreview>
        </el-dialog>
        <VideoPreview :type="1" :url="videoUrl" ref="videoPreview"></VideoPreview>

        <Sidebar ref="paperSidebar">
            <PaperForm :paper="editPaper" :onSubmit="this.submitPaper" style="padding-top: 30px"></PaperForm>
        </Sidebar>
    </article>
</template>
<script>
    import courseService from '../../services/courseService'
    import newcourseService from '../../services/newcourse/courseService'
    import CourseCategorySelect from '../component/select/CourseCategory.vue'
    import vTags from '../component/form/Tags.vue'
    import CropperImg from '../component/upload/ImagEcropperInput.vue'
    import DialogVideo from './component/DialogVideo.vue'
    import UploadFile from '../component/upload/UploadFiles.vue'
    import CompanySelect from '../component/select/IndustryCompany.vue'
    import VideoPreview from '../component/dialog/VideoPreview.vue'
    import DocPreview from '../component/dialog/DocShow.vue'
    import config from '../../utils/config'
    import clone from 'clone'
    import PaperForm from './PaperForm.vue'
    import Paper from '../../models/paper'
    import Chapter from '../../models/chapter'
    import Lesson from '../../models/lesson'
    import LessonForm from './LessonForm.vue'
    import Sidebar from '../component/sidebar/Sidebar.vue'
    import * as _ from 'utils/common'

    export default {
        name: 'newcourse-course-form',
        components: {
            DocPreview,
            VideoPreview,
            CourseCategorySelect,
            vTags,
            CropperImg,
            DialogVideo,
            UploadFile,
            CompanySelect,
            LessonForm,
            Sidebar,
            PaperForm
        },
        data () {
            return {
                videoUrl: '',
                docurl: '',
                docshow: false,
                editLessonData: [],
                currentData: {
                    data: {},
                    pindex: -1,
                    index: -1
                },
                chapter: {
                    editStatus: false,
                    value: ''
                },
                isShowVideoDialog: false,
                activeTab: 'couse',
                courseTags: [],
                fetchParam: getOriginData(),
                rules: {
                    name: { required: true, message: '请输入课程名称', trigger: 'change' },
                    category_id: { required: true, type: 'number', message: '请选择课程栏目', trigger: 'change' },
                    image: { required: true, message: '请上传课程封面', trigger: 'change' },
                    lesson_type: { required: true, message: '请选择课程类型', trigger: 'change' },
                    // company_id: { required: true, type: 'number', message: '请选择课程归属', trigger: 'change' },
                },
                // 单节课
                classhour: {
                    showDialog: false,
                    title: '新增课程',
                    accept: '*.doc,*.docx', // 上传的文件格式
                    form: new Lesson(),
                    paperLesson: null,
                    _paperLesson: null,
                    rules: {
                        name: { required: true, message: '请输入课程名称', trigger: 'change' },
                        material_type: { required: true, message: '请选择课时类型', trigger: 'change' },
                        material_id: { required: true, type: 'number', message: '请上传课程文件', trigger: 'change' },
                    }
                },
                multi: {
                    data: [{id: -1}],
                },
                resultData: [],
                sidebar: null,
                editLesson: null,
                editPaper: new Paper(),
            }
        },
        created () {
            if (this.$route.params.course_id != undefined) {
                newcourseService.getCourseInfo({
                    course_id: this.$route.params.course_id
                }).then((ret) => {
                    this.editLessonData = ret.lessons
                    this.fetchParam = ret.course
                    this.fetchParam.company_id = ret.course.company_id || void 0
                    if (!this.fetchParam.company_id) {
                        this.fetchParam.company_name = '请选择'
                    }
                    this.courseTags = ret.course.tags === '' ? [] : ret.course.tags.split(',')

                    if (this.fetchParam.lesson_type === 'single') {
                        let lesson = new Lesson()
                        Object.assign(lesson, ret.lessons[0].lessons[0])
                        this.classhour.form = lesson

                        if (ret.lessons[0].lessons.length > 1) {
                            let paperLesson = new Lesson()
                            Object.assign(paperLesson, ret.lessons[0].lessons[1])
                            this.classhour.paperLesson = paperLesson
                        }
                    } else if (this.fetchParam.lesson_type === 'multi') {
                        this.multi.data = []
                        ret.lessons[0].lessons.forEach((item) => {
                            let lesson = new Lesson()
                            Object.assign(lesson, item)
                            this.multi.data.push(lesson)
                        })
                        this.multi.data.push({id: -1})
                    } else if (this.fetchParam.lesson_type === 'chapter') {
                        ret.lessons.forEach((pitem) => {
                            let chapter = new Chapter()
                            chapter.id = pitem.id
                            chapter.name = pitem.name

                            pitem.lessons.forEach((item) => {
                                let lesson = new Lesson()
                                Object.assign(lesson, item)
                                chapter.addLesson(lesson)
                            })

                            chapter.lessons.push({id: -1})

                            this.resultData.push(chapter)
                        })
                    }
                })
            }
            xmview.setContentLoading(false)
        },
        methods: {
            // 添加多课时
            addMultiSubmit () {
                this.$refs['multiForm'].validate((valid) => {
                    if (!valid) return
                    let item = clone(this.classhour.form)
                    if (this.fetchParam.lesson_type === 'multi') {
                        this.currentData.pindex !== -1 ? this.multi.data[this.currentData.pindex] = item : this.multi.data.splice(this.multi.data.length - 1, 0, item)
                    } else if (this.fetchParam.lesson_type === 'chapter') {
                        this.currentData.index !== -1 ? this.resultData[this.currentData.pindex].lessons[this.currentData.index] = item : this.resultData[this.currentData.pindex].lessons.splice(this.resultData[this.currentData.pindex].lessons.length - 1, 0, item)
                    }
                    this.classhour.showDialog = false
                })
            },
            cropperImgSucc (data, ext) {
                newcourseService.getUploadUrl({
                    image: data,
                    alias: Date.now() + ext
                }).then((ret) => {
                    this.fetchParam.image = ret.url
                })
            },
            btnNextClick () {
                this.$refs['form'].validate((valid) => {
                    if (!valid) return
                    this.fetchParam.tags = this.courseTags.toString()
                    let req = newcourseService.create
                    if (this.fetchParam.id) req = newcourseService.update
                    this.fetchParam.update_time = this.fetchParam.update_time_name
                    req(this.fetchParam).then((ret) => {
                        // 重置当前数据
                        this.currentData = {
                            data: [],
                            pindex: -1,
                            index: -1
                        }
                        this.activeTab = 'classhour'
                        if (!this.fetchParam.id) this.fetchParam.id = ret.id
                    })
                })
            },
            // 课程类型改变
            typeChange(val) {
                if (val === 'doc') {
                    this.classhour.accept = '.doc,.docx'
                } else if (val === 'ppt') {
                    this.classhour.accept = '.ppt,pptx'
                } else if (val === 'pdf') {
                    this.classhour.accept = '.pdf'
                }
            },
            handleUploadDoc(rep) { // 文档上传完毕
                this.classhour.form.material_id = rep.data.id
            },
            // 处理视频选取
            handleVideoSelected(row) {
                this.classhour.form.material_name = row.name
                this.classhour.form.material_id = row.id
            },
            addNewClasshour (pindex = -1) {
                this.currentData = {
                    data: [],
                    pindex: -1,
                    index: -1
                }
                if (this.fetchParam.lesson_type === 'chapter') this.currentData.pindex = pindex
                this.classhour.showDialog = true
                this.classhour.title = '新增课程'
                this.classhour.form = new Lesson()
                this.$nextTick(() => {
                    this.$refs['multiForm'].resetFields()
                })
            },
            editClasshour (row, pindex = -1, index = -1) {
                this.currentData = {data: row, pindex, index}
                this.classhour.showDialog = true
                this.classhour.title = '修改课程'
                this.classhour.form = clone(row)
            },
            delClasshour (row, pindex = -1, index = -1) {
                if (row.id !== 0) {
                    row.deleted = true
                    if (this.fetchParam.lesson_type === 'single') {
                        // this.classhour.form.deleted = row.deleted
                        this.classhour._paperLesson = _.clone(this.classhour.paperLesson)
                        this.classhour.paperLesson = null

                    }
                } else {
                    if (this.fetchParam.lesson_type === 'multi') {
                        this.multi.data.splice(pindex, 1)
                    } else if (this.fetchParam.lesson_type === 'chapter') {
                        this.resultData[pindex].lessons.splice(index, 1)
                    }
                }
            },
            // 保存章节
            submitChapter () {
                if (!this.chapter.value) return
                if (this.resultData === null) this.resultData = []
                this.resultData.push({
                    id: 0,
                    name: this.chapter.value,
                    sort: 0,
                    deleted: false,
                    status: 0,
                    lessons: [
                        {
                            id: -1
                        }
                    ]
                })
                this.chapter.editStatus = false
            },
            saveItemChapter (pitem, pindex) {
                this.resultData[pindex].status = 0
                this.$forceUpdate()
            },
            // 删除多章节
            delChapter (pitem, pindex) {
                let dealData = this.resultData[pindex].lessons.filter((item) => {
                    return !item.deleted
                })
                if (dealData.length > 1) {
                    xmview.showTip('error', '请先删除该章节下面的课时')
                    return
                }
                if (pitem.id) {
                    pitem.deleted = true
                } else {
                    this.resultData.splice(pindex, 1)
                }
            },
            saveResult () {
                let chapters = []

                if (this.fetchParam.lesson_type === 'single') {
                    let chapter = new Chapter()

                    chapter.addLesson(this.classhour.form)
                    if (this.classhour.paperLesson) {
                        chapter.addLesson(this.classhour.paperLesson)
                    }
                    if (this.classhour._paperLesson) {
                        chapter.addLesson(this.classhour._paperLesson)
                    }

                    chapters.push(chapter)
                } else if (this.fetchParam.lesson_type === 'multi') {
                    let chapter = new Chapter()

                    this.multi.data.forEach((item) => {
                        if (item.id == -1) {
                            return
                        }
                        let lesson = new Lesson()
                        item.try_enable ? item.try_enable = 1 : item.try_enable = 0
                        Object.assign(lesson, item)

                        chapter.addLesson(lesson)
                    })

                    chapters.push(chapter)
                } else if (this.fetchParam.lesson_type === 'chapter') {
                    this.resultData.forEach((pitem) => {
                        let chapter = new Chapter()
                        Object.assign(chapter, pitem)
                        chapter.lessons = []
                        pitem.lessons.forEach((item) => {
                            if (item.id == -1) {
                                return
                            }
                            let lesson = new Lesson()
                            item.try_enable ? item.try_enable = 1 : item.try_enable = 0
                            Object.assign(lesson, item)

                            chapter.addLesson(lesson)
                        })

                        chapters.push(chapter)
                    })
                }

                newcourseService.setLessons({
                    course_id: this.fetchParam.id,
                    jsonstr: JSON.stringify(chapters)
                }).then(() => {
                    xmview.showTip('success', '操作成功')
                    this.$router.push({name: 'newcourse-course-public', query: {tab: 'newcourse'}})
                })
            },
            previewFn (row) {
                if (row.material_type === 'video') {
                    // 拿到播放地址
                    courseService.getVideoPreviewUrl(row.material_id).then((ret) => {
                        this.videoUrl = ret.video
                        this.$refs.videoPreview.show(row.name)
                    })
                } else {
                    this.docurl = `${config.apiHost}/sys/course/doc/${row.material_id}/view`
                    this.docshow = true
                }
            },
            openExamForm (pindex, index, e) {
                e.stopPropagation()
                this.currentData.pindex = pindex
                this.currentData.index = index

                let paper = new Paper()
                paper.type = 'course_exam'

                let lesson = new Lesson()
                lesson.material_type = 'exam'
                lesson.setMaterialPaper(paper)

                this.editLesson = lesson
                this.editPaper = paper

                this.$refs['paperSidebar'].open()
            },
            submitPaper() {
                this.editPaper.save().then(() => {
                    let lesson = this.editLesson
                    lesson.setMaterialPaper(this.editPaper)
                    if (this.fetchParam.lesson_type == 'single') {
                        this.classhour.paperLesson = lesson
                    }

                    if (this.fetchParam.lesson_type === 'multi') {
                        this.currentData.index !== -1 ? this.multi.data[this.currentData.index] = lesson : this.multi.data.splice(this.multi.data.length - 1, 0, lesson)
                    }

                    if (this.fetchParam.lesson_type === 'chapter') {
                        this.currentData.index !== -1 ? this.resultData[this.currentData.pindex].lessons[this.currentData.index] = lesson : this.resultData[this.currentData.pindex].lessons.splice(this.resultData[this.currentData.pindex].lessons.length - 1, 0, lesson)
                    }

                    this.$refs['paperSidebar'].close()
                })
            },
            openEditExamForm(lesson, pindex, index, e) {
                e.stopPropagation()
                this.currentData.pindex = pindex
                this.currentData.index = index

                let paper = new Paper()
                paper.findById(lesson.material_id)
                this.editLesson = lesson
                this.editPaper = paper

                this.$refs['paperSidebar'].open()
            }
        }
    }
    function getOriginData() {
        return {
            company_id: void 0,
            company_name: '',
            category_id: '',
            category_name: '',
            name: '',
            image: '',
            description: '',
            price: '',
            lesson_type: 'single',
            tags: '',
            update_time_name: '',
            id: 0,
            course_type:''
        }
    }
</script>

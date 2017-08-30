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
                .saveBtn {
                    margin-left: 100px;
                }
                .mulit-class {
                    padding: 20px 100px;
                    text-align: center;
                    p {
                        width: 75%;
                        padding: 10px;
                        margin-top: 10px;
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
                            width: 70%;
                            text-align: center;
                            background: #eee;
                            margin-left: 50px;
                            cursor: pointer;
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
                    <el-form-item label="所属栏目" prop="category_id">
                        <CourseCategorySelect :placeholder="fetchParam.cat_name" :autoClear="true" :showNotCat="false" v-model="fetchParam.category_id"></CourseCategorySelect>
                    </el-form-item>
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
                    <el-form-item label="课程售价" prop="price">
                        <el-input v-model="fetchParam.price"></el-input>
                    </el-form-item>
                    <h2>课时类型设置</h2>
                    <el-form-item label="选择类型" prop="type">
                        <el-radio-group v-model="fetchParam.type">
                            <el-radio label="single">单节课</el-radio>
                            <el-radio label="multi">多课时</el-radio>
                            <el-radio label="chapter ">多章节课</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button type="primary" @click="btnNextClick">下一步</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <!--<el-tab-pane :disabled="!fetchParam.id" label="课时管理" name="classhour">-->
            <el-tab-pane label="课时管理" name="classhour">
                <!--单节课-->
                <el-form v-if="fetchParam.type == 'single'" label-width="120px" ref="classhourform" :rules="classhour.rules" :model="classhour.form">
                    <el-form-item label="课时类型" prop="material_type">
                        <el-select v-model="classhour.form.material_type" @change="typeChange"  :clearable="true">
                            <el-option label="视频" value="video"></el-option>
                            <el-option label="WORD" value="doc"></el-option>
                            <el-option label="PPT" value="ppt"></el-option>
                            <el-option label="PDF" value="pdf"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="课件" prop="material_id">
                        <!--上传文件-->
                        <UploadFile :onSuccess="handleUploadDoc" :url="uploadDocUrl" :accept="classhour.accept" :disabled="classhour.form.material_type == null" v-show="classhour.form.material_type !== 'video'"></UploadFile>
                        <!--点击上传视频-->
                        <el-button v-show="classhour.form.material_type === 'video'" @click="isShowVideoDialog=true">
                            <i>{{classhour.form.material_name}}</i>
                        </el-button>
                    </el-form-item>
                </el-form>

                <!--多节课-->
                <section class="mulit-class" v-if="fetchParam.type == 'multi'">
                    <div v-for="(item,index) in multi.data">
                        <p class="gray" @click="addNewClasshour" v-if="item.id === -1"><i class="el-icon-plus" ></i> 添加新课时</p>
                        <p v-else>
                            <el-tag type="primary">课时{{index + 1}}</el-tag>
                            <span>
                                <i>{{item.name}}</i>
                                <el-tag type="danger" v-show="item.try_enable">免费试看</el-tag>
                            </span>
                            <span class="operate">
                                <el-button type="text">查看</el-button>
                                <el-button type="text" @click="editClasshour(item)">编辑</el-button>
                                <el-button type="text" @click="delClasshour(item, index)">删除</el-button>
                            </span>
                        </p>
                    </div>
                </section>

                <el-button type="primary" class="saveBtn">保存</el-button>
                <!--选择视频的弹窗-->
                <DialogVideo :onSelect="handleVideoSelected" v-model="isShowVideoDialog"></DialogVideo>
            </el-tab-pane>
        </el-tabs>
        <el-dialog title="添加课时" :visible.sync="classhour.showDialog">
            <el-form label-width="120px" ref="multiForm" :rules="classhour.rules" :model="classhour.form">
                <el-form-item label="课时类型" prop="material_type">
                    <el-select v-model="classhour.form.material_type" @change="typeChange"  :clearable="true">
                        <el-option label="视频" value="video"></el-option>
                        <el-option label="WORD" value="doc"></el-option>
                        <el-option label="PPT" value="ppt"></el-option>
                        <el-option label="PDF" value="pdf"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课件" prop="material_id">
                    <!--上传文件-->
                    <UploadFile :onSuccess="handleUploadDoc" :url="uploadDocUrl" :accept="classhour.accept" :disabled="classhour.form.material_type == null" v-show="classhour.form.material_type !== 'video'"></UploadFile>
                    <!--点击上传视频-->
                    <el-button v-show="classhour.form.material_type === 'video'" @click="classhour.isShowVideoDialog=true">
                        <i>{{classhour.form.material_name}}</i>
                    </el-button>
                </el-form-item>
                <el-form-item label="课时名称">
                    <el-input v-model="classhour.form.name"></el-input>
                </el-form-item>
                <el-form-item label="免费试看">
                    <el-checkbox v-model="classhour.form.try_enable">本课时免费试看</el-checkbox>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addMultiSubmit">保存</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </article>
</template>
<script>
    import courseService from '../../services/courseService'
    import CourseCategorySelect from '../component/select/CourseCategory.vue'
    import vTags from '../component/form/Tags.vue'
    import CropperImg from '../component/upload/ImagEcropperInput.vue'
    import DialogVideo from './component/DialogVideo.vue'
    import UploadFile from '../component/upload/UploadFiles.vue'
    import clone from 'clone'
    export default {
        name: 'newcourse-course-form',
        components: {
            CourseCategorySelect,
            vTags,
            CropperImg,
            DialogVideo,
            UploadFile
        },
        data () {
            return {
                isShowVideoDialog: false,
                uploadDocUrl: '',
                activeTab: 'couse',
                courseTags: [],
                fetchParam: getOriginData(),
                rules: {
                    name: { required: true, message: '请输入课程名称', trigger: 'change' },
                    category_id: { required: true, type: 'number', message: '请选择课程栏目', trigger: 'change' },
                    image: { required: true, message: '请上传课程封面', trigger: 'change' },
                },
                // 单节课
                classhour: {
                    showDialog: false,
                    accept: '*.doc,*.docx', // 上传的文件格式
                    form: clearFormData(),
                    rules: {
                        material_type: { required: true, message: '请选择课时类型', trigger: 'change' },
                    }
                },
                multi: {
                    data: [
                        {
                            id: -1
                        }
                    ],
                },
                resultData: [
                    {
                        id: 0,
                        name: '',
                        sort: 0,
                        deleted: false,
                        lessons: [
                            {
                                id: 0,
                                name: '',
                                try_enable: 0,
                                material_type: '',
                                material_id: '',
                                sort: 0,
                                deleted: false
                            }
                        ]
                    }
                ]
            }
        },
        created () {
            this.uploadDocUrl = courseService.getCourseDocUploadUrl()
            xmview.setContentLoading(false)
        },
        methods: {
            // 添加多课时
            addMultiSubmit () {
                this.$refs['multiForm'].validate((valid) => {
                    if (!valid) return
                    let item = clone(this.classhour.form)
                    this.multi.data.unshift(item)
                    this.classhour.showDialog = false
                })
            },
            cropperImgSucc (data) {
                this.fetchParam.image = data
            },
            btnNextClick () {
                console.log('下一步')
                this.activeTab = 'classhour'
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
            addNewClasshour () {
                this.classhour.showDialog = true
                this.classhour.form = clearFormData()
            },
            editClasshour (row) {
                this.classhour.showDialog = true
                this.classhour.form = clone(row)
            },
            delClasshour (row, index) {
                this.multi.data.splice(index, 1)
                if (row.id !== 0) {
                    console.log(3333)
                    this.multi.data[index].deleted = 1
                }
            }
        }
    }
    function getOriginData() {
        return {
            category_id: '',
            cat_name: '',
            name: '',
            image: '',
            description: '',
            price: '',
            type: ''
        }
    }
    function clearFormData() {
        return {
            id: 0,
            name: '',
            material_type: '',
            material_id: '',
            material_name: '选择视频',
            try_enable: 0,
            deleted: 0
        }
    }
</script>
